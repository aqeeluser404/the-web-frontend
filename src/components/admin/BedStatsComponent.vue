<template>
  <q-card class="stats-card col-md-12 col-12 full-height">
    <q-card-section class="stats-header row justify-between items-center">
      <div class="text-h6">Bed Occupancy Stats</div>
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

    <q-card-section class="row justify-between">
      <q-card
        v-for="item in items"
        :key="item.title"
        class="col-12 col-sm-6 col-md-2 text-center q-pa-md"
        flat
        bordered
      >
        <q-icon :name="item.icon" color="primary" size="40px" />

        <div class="text-subtitle1 text-weight-bold q-mt-sm">
          {{ item.title }}
        </div>

        <div class="text-h5 text-weight-bold q-mt-xs">
          {{ item.value }}
        </div>

        <div class="text-caption text-grey-7">
          {{ item.subtitle }}
        </div>
      </q-card>
    </q-card-section>

    <!-- <q-card-section class="row justify-start q-pt-none q-pb-md q-gutter-sm">
      <q-chip
        square
        color="grey-3"
        text-color="grey-9"
        class="text-weight-bold"
        size="md"
      >
        {{ displayYear }} · {{ occupiedCurrentYear }}/{{ totalBeds }}
      </q-chip>

      <q-chip
        square
        color="grey-3"
        text-color="grey-9"
        class="text-weight-bold"
        size="md"
      >
        Renewed in {{ displayYear }}: {{ renewedInYear }}
      </q-chip>

      <q-chip
        square
        color="grey-3"
        text-color="grey-9"
        class="text-weight-bold"
        size="md"
      >
        Confirmed in {{ displayYear }}: {{ confirmedInYear }}
      </q-chip>
    </q-card-section> -->
  </q-card>
</template>

<script>
import RentalService from "src/services/api/RentalService";
import UnitService from "src/services/api/UnitService";

export default {
  name: "BedOccupancyStats",

  data() {
    return {
      rentals: [],
      units: [],
      loading: false,
      currentYear: new Date().getFullYear(),
      selectedYear: new Date().getFullYear(),
    };
  },

  computed: {
    // ============================================================
    // DISPLAY YEAR — single year, no "next year" concept
    // ============================================================
    displayYear() {
      return this.selectedYear;
    },

    // ============================================================
    // AVAILABLE YEARS
    // ============================================================
    availableYears() {
      const years = new Set([this.currentYear]);

      this.units.forEach((unit) => {
        const y = Number(unit.unitYear);
        if (!isNaN(y) && y >= this.currentYear) {
          years.add(y);
        }
      });

      return Array.from(years).sort((a, b) => a - b);
    },

    // ============================================================
    // UNITS FOR SELECTED YEAR
    // ============================================================
    unitsCurrentYear() {
      return this.units.filter(
        (unit) => Number(unit.unitYear) === this.displayYear
      );
    },

    // ============================================================
    // TOTAL BEDS
    // ============================================================
    totalBeds() {
      return this.unitsCurrentYear.reduce((total, unit) => {
        const subUnits = Array.isArray(unit.subUnits) ? unit.subUnits : [];
        return total + subUnits.length;
      }, 0);
    },

    // ============================================================
    // OCCUPIED RENTALS FOR THE SELECTED YEAR
    // ============================================================
    //
    // A rental counts as occupied in year X if it's Active AND:
    //   - it's currently assigned to year X, OR
    //   - it started in year X, OR
    //   - it touched year X in its renewal chain (fromYear or toYear)
    //
    occupiedCurrentYearRentals() {
      return this.rentals.filter((rental) => {
        if (rental.status !== "Active") return false;

        const startYear = new Date(rental.rentalStartDate).getFullYear();
        const unitYear = Number(rental.unitYear) || startYear;

        // 1. Currently assigned to this year
        if (unitYear === this.displayYear) return true;

        // 2. Started in this year
        if (startYear === this.displayYear) return true;

        // 3. Touched this year via renewal chain
        if (Array.isArray(rental.renewalHistory)) {
          return rental.renewalHistory.some((entry) => {
            const fromYear = Number(entry.fromYear);
            const toYear = Number(entry.toYear);
            return (
              fromYear === this.displayYear || toYear === this.displayYear
            );
          });
        }

        return false;
      });
    },

    occupiedCurrentYear() {
      return this.occupiedCurrentYearRentals.length;
    },

    // ============================================================
    // RENEWED INTO THIS YEAR
    // ============================================================
    //
    // Occupants in this year whose renewal chain shows they arrived
    // here via a renewal (i.e. an entry with toYear === displayYear).
    //
    renewedInYear() {
      return this.occupiedCurrentYearRentals.filter((rental) => {
        if (!Array.isArray(rental.renewalHistory)) return false;
        return rental.renewalHistory.some(
          (entry) => Number(entry.toYear) === this.displayYear
        );
      }).length;
    },

    // ============================================================
    // CONFIRMED IN THIS YEAR
    // ============================================================
    //
    // Occupants in this year that did NOT arrive via renewal.
    // Fresh bookings and first-year applications.
    //
    confirmedInYear() {
      return this.occupiedCurrentYearRentals.filter((rental) => {
        if (!Array.isArray(rental.renewalHistory) || rental.renewalHistory.length === 0) {
          return true; // no renewal history at all = first-time
        }
        return !rental.renewalHistory.some(
          (entry) => Number(entry.toYear) === this.displayYear
        );
      }).length;
    },

    // ============================================================
    // AVAILABLE FOR THIS YEAR
    // ============================================================
    availableInYear() {
      return Math.max(this.totalBeds - this.occupiedCurrentYear, 0);
    },

    // ============================================================
    // DASHBOARD CARDS
    // ============================================================
    items() {
      return [
        {
          title: "TOTAL BEDS",
          value: this.totalBeds,
          subtitle: `(${this.displayYear} PHYSICAL CAPACITY)`,
          icon: "hotel",
        },
        {
          title: `${this.displayYear} OCCUPIED`,
          value: this.occupiedCurrentYear,
          subtitle: `(ACTIVE ${this.displayYear} OCCUPANTS)`,
          icon: "event",
        },
        {
          title: `${this.displayYear} RENEWED`,
          value: this.renewedInYear,
          subtitle: `(RENEWED INTO ${this.displayYear})`,
          icon: "autorenew",
        },
        {
          title: `${this.displayYear} CONFIRMED`,
          value: this.confirmedInYear,
          subtitle: `(NEW ${this.displayYear} BOOKINGS)`,
          icon: "person_add",
        },
        {
          title: `${this.displayYear} AVAILABLE`,
          value: this.availableInYear,
          subtitle: `(${this.occupiedCurrentYear} / ${this.totalBeds} USED)`,
          icon: "pie_chart",
        },
      ];
    },
  },

  async mounted() {
    await this.fetchStatsData();
  },

  methods: {
    onYearChange() {
      console.log("Year changed to:", this.selectedYear);
    },

    async fetchStatsData() {
      this.loading = true;

      try {
        const [rentals, units] = await Promise.all([
          RentalService.findAllRentals(),
          UnitService.getAllUnits(),
        ]);

        this.rentals = Array.isArray(rentals) ? rentals : [];
        this.units = Array.isArray(units) ? units : [];

        if (!this.availableYears.includes(this.selectedYear)) {
          this.selectedYear = this.availableYears[0] ?? this.currentYear;
        }

        console.log("========== BED STATS ==========");
        console.log("Display Year:", this.displayYear);
        console.log(`${this.displayYear} physical beds:`, this.totalBeds);
        console.log(`${this.displayYear} occupied:`, this.occupiedCurrentYear);
        console.log(`${this.displayYear} renewed:`, this.renewedInYear);
        console.log(`${this.displayYear} confirmed:`, this.confirmedInYear);
        console.log(`${this.displayYear} available:`, this.availableInYear);
        console.log(
          "Check: renewed + confirmed =",
          this.renewedInYear + this.confirmedInYear,
          "| occupied =",
          this.occupiedCurrentYear
        );
      } catch (error) {
        console.error("Failed to load occupancy statistics:", error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style lang="sass" scoped>
.total-occupied-badge
  background-color: #f0f0f0
  padding: 8px 24px
  border-radius: 6px
  font-weight: bold
  font-size: 15px
  color: #333
</style>
