<template>
  <q-card class="soft-shadow-card">
    <q-card-section class="stats-header row justify-between items-center">
      <div class="text-h6">Bed Occupancy Line Chart</div>
      <q-select
        v-model="selectedYear"
        :options="availableYears"
        dense
        filled
        style="min-width: 120px"
        @update:model-value="onYearChange"
      />
      <q-separator class="q-my-sm" style="width: 100%" />
    </q-card-section>

    <q-card-section>
      <canvas ref="bedLineChart" style="max-height: 300px"></canvas>

      <div class="row justify-center q-mt-md">
        <q-chip
          square
          color="grey-3"
          text-color="grey-9"
          class="text-weight-bold"
          size="md"
        >
          Total occupied:
          {{ stats.overall.total - stats.overall.available }} /
          {{ stats.overall.total }}
        </q-chip>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import {
  Chart,
  PieController,
  BarController,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
} from "chart.js";

Chart.register(
  PieController,
  BarController,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale
);

import RentalService from "src/services/api/RentalService";
import UnitService from "src/services/api/UnitService";

export default {
  data() {
    return {
      pieChart: null,
      units: [],
      rentals: [],
      selectedYear: new Date().getFullYear(),
      stats: {
        firstFloor: { available: 0, total: 0 },
        secondFloor: { available: 0, total: 0 },
        thirdFloor: { available: 0, total: 0 },
        overall: { available: 0, total: 0 },
      },
      floors: [
        { key: "firstFloor", label: "1st Floor" },
        { key: "secondFloor", label: "2nd Floor" },
        { key: "thirdFloor", label: "3rd Floor" },
      ],
      bedLineChart: null,
    };
  },

  computed: {
    availableYears() {
      const years = new Set();
      this.units.forEach((unit) => {
        if (unit.unitYear != null) {
          years.add(Number(unit.unitYear));
        }
      });
      return Array.from(years).sort((a, b) => a - b);
    },

    filteredUnits() {
      return this.units.filter(
        (unit) => Number(unit.unitYear) === this.selectedYear
      );
    },
  },

  methods: {
    getAvailabilityColor(available, total) {
      const percentage = available / total;
      if (percentage > 0.5) return "positive";
      if (percentage > 0.25) return "warning";
      return "negative";
    },

    onYearChange() {
      this.calculateBedStats();
      this.drawLineChart();
    },

    // Returns the sub-unit identifier this rental occupies in a given year,
    // or null if it doesn't occupy anything that year.
    rentalOccupiedIdentifier(rental, year) {
      if (rental.status !== "Active") return null;

      // Case 1: rental is currently assigned to this year
      const unitYear = Number(rental.unitYear);
      if (unitYear === year) {
        return (
          rental.selectedSubUnits?.bedType ||
          rental.selectedSubUnits?.roomType ||
          null
        );
      }

      // Case 2: rental started in this year (no renewal yet, or first-year)
      const startYear = new Date(rental.rentalStartDate).getFullYear();
      if (
        startYear === year &&
        (!rental.renewalHistory || rental.renewalHistory.length === 0)
      ) {
        return (
          rental.selectedSubUnits?.bedType ||
          rental.selectedSubUnits?.roomType ||
          null
        );
      }

      // Case 3: rental renewed into or out of this year — find the entry
      // where fromYear === year and use its fromSubUnit
      if (Array.isArray(rental.renewalHistory)) {
        const entryFromYear = rental.renewalHistory.find(
          (e) => Number(e.fromYear) === year
        );
        if (entryFromYear) {
          return (
            entryFromYear.fromSubUnit?.bedType ||
            entryFromYear.fromSubUnit?.roomType ||
            null
          );
        }

        const entryToYear = rental.renewalHistory.find(
          (e) => Number(e.toYear) === year
        );
        if (entryToYear) {
          return (
            entryToYear.toSubUnit?.bedType ||
            entryToYear.toSubUnit?.roomType ||
            null
          );
        }
      }

      return null;
    },

    calculateBedStats() {
      // ============================================================
      // 🔍 DEBUG BLOCK — REMOVE AFTER DIAGNOSING
      // ============================================================
      const debugYear = this.selectedYear;
      const occupiedMatches = []; // { rentalId, unitId, unitNumber, identifier }
      const matchedPerRental = {}; // rentalId -> [ { unitId, identifier } ]
      const totalBedsPerUnit = {}; // unitId -> count
      const duplicateIdentifiersPerUnit = {}; // unitId -> Set(identifier)
      // ============================================================

      const stats = {
        firstFloor: { available: 0, total: 0 },
        secondFloor: { available: 0, total: 0 },
        thirdFloor: { available: 0, total: 0 },
        overall: { available: 0, total: 0 },
      };

      this.filteredUnits.forEach((unit) => {
        const floor = this.floorKey(unit.floorLevel);

        if (Array.isArray(unit.subUnits)) {
          // 🔍 track duplicate identifiers on the same unit doc
          const seenIdentifiers = new Set();

          unit.subUnits.forEach((sub) => {
            stats[floor].total += 1;

            const identifier = sub.roomType || sub.bedType;

            const occupiedThisYear = this.rentals.some((rental) => {
              // unit id must match somewhere in the rental's chain
              const targetId = String(unit._id);
              const referencesUnit =
                String(rental.unit) === targetId ||
                (Array.isArray(rental.renewalHistory) &&
                  rental.renewalHistory.some(
                    (e) =>
                      String(e.fromUnit) === targetId ||
                      String(e.toUnit) === targetId
                  ));

              if (!referencesUnit) return false;

              // which identifier does the rental actually occupy this year?
              const occupiedId = this.rentalOccupiedIdentifier(
                rental,
                this.selectedYear
              );
              return occupiedId === identifier;
            });

            if (!occupiedThisYear) {
              stats[floor].available += 1;
            }
          });

          totalBedsPerUnit[String(unit._id)] = unit.subUnits.length;
        } else if (
          unit.unitOccupants != null &&
          unit.currentOccupants != null
        ) {
          const occupants = Math.floor(unit.unitOccupants || 0);
          const current = Math.floor(unit.currentOccupants || 0);
          const availableBeds = Math.max(0, occupants - current);

          stats[floor].total += occupants;
          stats[floor].available += availableBeds;
        }
      });

      stats.overall.available =
        stats.firstFloor.available +
        stats.secondFloor.available +
        stats.thirdFloor.available;

      stats.overall.total =
        stats.firstFloor.total +
        stats.secondFloor.total +
        stats.thirdFloor.total;

      this.stats = stats;

      // ============================================================
      // 🔍 DEBUG OUTPUT
      // ============================================================
      console.log(`========== BED STATS DEBUG (year ${debugYear}) ==========`);
      console.log(
        "Total beds:",
        stats.overall.total,
        "| Occupied:",
        stats.overall.total - stats.overall.available,
        "| Available:",
        stats.overall.available
      );
      console.log("Total matches:", occupiedMatches.length);

      // 1. Rentals that matched MULTIPLE beds in the same year
      const multiMatches = Object.entries(matchedPerRental).filter(
        ([, matches]) => matches.length > 1
      );
      if (multiMatches.length) {
        console.warn(
          `⚠️ ${multiMatches.length} rentals matched MULTIPLE beds:`
        );
        multiMatches.forEach(([rentalId, matches]) => {
          console.warn(`  rental ${rentalId}:`);
          matches.forEach((m) => {
            console.warn(
              `    → unit ${m.unitNumber} (${m.unitId}) / ${m.identifier}`
            );
          });
        });
      } else {
        console.log("✅ No rental matched multiple beds");
      }

      // 2. Units with duplicate sub-unit identifiers
      const dupUnits = Object.entries(duplicateIdentifiersPerUnit);
      if (dupUnits.length) {
        console.warn(
          `⚠️ ${dupUnits.length} units have DUPLICATE sub-unit identifiers:`
        );
        dupUnits.forEach(([unitId, ids]) => {
          console.warn(`  unit ${unitId}: ${[...new Set(ids)].join(", ")}`);
        });
      } else {
        console.log("✅ No duplicate sub-unit identifiers");
      }

      // 3. Rental IDs appearing in this.rentals more than once
      const rentalIdCounts = {};
      this.rentals.forEach((r) => {
        const id = String(r._id);
        rentalIdCounts[id] = (rentalIdCounts[id] || 0) + 1;
      });
      const dupRentals = Object.entries(rentalIdCounts).filter(
        ([, count]) => count > 1
      );
      if (dupRentals.length) {
        console.warn(
          `⚠️ ${dupRentals.length} rental IDs appear MULTIPLE times in this.rentals:`
        );
        dupRentals.forEach(([id, count]) => {
          console.warn(`  rental ${id} appears ${count} times`);
        });
      } else {
        console.log("✅ No duplicate rentals in this.rentals");
      }
      // ============================================================
    },

    floorKey(level) {
      switch (level) {
        case "First Floor":
          return "firstFloor";
        case "Second Floor":
          return "secondFloor";
        case "Third Floor":
          return "thirdFloor";
        default:
          return "firstFloor";
      }
    },

    drawLineChart() {
      const labels = this.floors.map((f) => {
        const floor = this.stats[f.key];
        const occupied = floor.total - floor.available;
        return `${f.label} (${occupied}/${floor.total})`;
      });

      const occupiedData = this.floors.map((f) => {
        const floor = this.stats[f.key];
        return floor.total - floor.available;
      });

      const availableData = this.floors.map((f) => this.stats[f.key].available);

      if (this.bedLineChart) this.bedLineChart.destroy();

      const ctx = this.$refs.bedLineChart.getContext("2d");
      this.bedLineChart = new Chart(ctx, {
        type: "bar",
        data: {
          labels,
          datasets: [
            {
              label: `${this.selectedYear} Occupied`,
              data: occupiedData,
              backgroundColor: "#F44336",
            },
            {
              label: `${this.selectedYear} Available`,
              data: availableData,
              backgroundColor: "#4CAF50",
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            tooltip: {
              mode: "index",
              intersect: false,
            },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: "Beds",
              },
            },
            x: {
              title: {
                display: true,
                text: "Floor",
              },
            },
          },
        },
      });
    },

    async fetchUnits() {
      try {
        const [units, rentals] = await Promise.all([
          UnitService.getAllUnits(),
          RentalService.findAllRentals(),
        ]);

        this.units = units;
        this.rentals = Array.isArray(rentals) ? rentals : [];

        if (!this.availableYears.includes(this.selectedYear)) {
          this.selectedYear = this.availableYears[0] ?? this.selectedYear;
        }

        this.calculateBedStats();
        this.drawLineChart();
      } catch (error) {
        console.error("Error fetching units:", error);
      }
    },
  },

  mounted() {
    this.fetchUnits();
  },
};
</script>

<style lang="sass" scoped>
.stats-card
  border-radius: 8px
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)

  .stats-header
    background-color: #f5f5f5
    border-top-left-radius: 8px
    border-top-right-radius: 8px
    @media (max-width: 600px)
      display: flex
      flex-direction: column
      align-items: center
      justify-content: center

  .floor-stats
    padding: 8px
    border-radius: 6px
    transition: all 0.3s ease
    &:hover
      background-color: #f9f9f9

  .tinted-border
    background-color: #f8fff8
    border-bottom-left-radius: 8px
    border-bottom-right-radius: 8px

  .q-linear-progress
    height: 8px
    border-radius: 4px
</style>
