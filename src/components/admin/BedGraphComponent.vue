<template>
  <q-card class="soft-shadow-card">
    <q-card-section class="stats-header row justify-between items-center">
      <div class="text-h6">Bed Occupancy Line Chart</div>
      <q-select
        v-model="selectedYear"
        :options="availableYears"
        dense
        filled
        :disable="loading || availableYears.length === 0"
        style="min-width: 120px"
        @update:model-value="onYearChange"
      />
      <q-separator class="q-my-sm" style="width: 100%" />
    </q-card-section>

    <!-- ✅ Loading state -->
    <q-card-section
      v-if="loading"
      class="row justify-center items-center"
      style="min-height: 300px"
    >
      <div class="column items-center">
        <q-spinner color="primary" size="48px" />
        <div class="text-caption text-grey-7 q-mt-md">
          Loading occupancy chart…
        </div>
      </div>
    </q-card-section>

    <!-- ✅ Loaded state -->
    <q-card-section v-else>
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
      loading: true,               // ✅ start loading
      currentYear: new Date().getFullYear(),
      selectedYear: null,          // ✅ set after data loads
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
      const years = new Set([this.currentYear]); // ✅ always include current
      this.units.forEach((unit) => {
        const y = Number(unit.unitYear);
        if (!isNaN(y) && y >= this.currentYear) {
          years.add(y);
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

      // Case 3: rental renewed into or out of this year
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
      const stats = {
        firstFloor: { available: 0, total: 0 },
        secondFloor: { available: 0, total: 0 },
        thirdFloor: { available: 0, total: 0 },
        overall: { available: 0, total: 0 },
      };

      this.filteredUnits.forEach((unit) => {
        const floor = this.floorKey(unit.floorLevel);

        if (Array.isArray(unit.subUnits)) {
          unit.subUnits.forEach((sub) => {
            stats[floor].total += 1;

            const identifier = sub.roomType || sub.bedType;

            const occupiedThisYear = this.rentals.some((rental) => {
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

      const availableData = this.floors.map(
        (f) => this.stats[f.key].available
      );

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
            legend: { position: "top" },
            tooltip: { mode: "index", intersect: false },
          },
          scales: {
            y: {
              beginAtZero: true,
              title: { display: true, text: "Beds" },
            },
            x: {
              title: { display: true, text: "Floor" },
            },
          },
        },
      });
    },

async fetchUnits() {
  this.loading = true;

  try {
    const [units, rentals] = await Promise.all([
      UnitService.getAllUnits(),
      RentalService.findAllRentals(),
    ]);

    this.units = Array.isArray(units) ? units : [];
    this.rentals = Array.isArray(rentals) ? rentals : [];

    // ✅ Default to the LATEST available year (with units)
    if (
      !this.selectedYear ||
      !this.availableYears.includes(this.selectedYear)
    ) {
      const years = this.availableYears;
      this.selectedYear =
        years.length > 0 ? years[years.length - 1] : this.currentYear;
    }

    this.calculateBedStats();

    // ✅ CRITICAL: flip loading OFF so v-if renders the canvas,
    //    then wait for Vue to actually paint it before drawing
    this.loading = false;
    await this.$nextTick();

    this.drawLineChart();
  } catch (error) {
    console.error("Error fetching units:", error);
    this.loading = false;
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
