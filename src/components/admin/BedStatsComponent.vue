<template>
  <q-card class="stats-card col-md-12 col-12 full-height">
    <q-card-section class="stats-header row justify-between items-center">
      <div class="text-h6">Bed Occupancy Stats</div>
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
      style="min-height: 180px"
    >
      <div class="column items-center">
        <q-spinner color="primary" size="48px" />
        <div class="text-caption text-grey-7 q-mt-md">
          Loading occupancy stats…
        </div>
      </div>
    </q-card-section>

    <!-- ✅ Loaded state -->
    <q-card-section v-else class="row justify-between">
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
      loading: true,               // ✅ start loading
      currentYear: new Date().getFullYear(),
      selectedYear: null,
    };
  },

  computed: {
    displayYear() {
      return this.selectedYear;
    },

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

    unitsCurrentYear() {
      return this.units.filter(
        (unit) => Number(unit.unitYear) === this.displayYear
      );
    },

    totalBeds() {
      return this.unitsCurrentYear.reduce((total, unit) => {
        const subUnits = Array.isArray(unit.subUnits) ? unit.subUnits : [];
        return total + subUnits.length;
      }, 0);
    },

    occupiedCurrentYearRentals() {
      return this.rentals.filter((rental) => {
        if (rental.status !== "Active") return false;

        const startYear = new Date(rental.rentalStartDate).getFullYear();
        const unitYear = Number(rental.unitYear) || startYear;

        if (unitYear === this.displayYear) return true;
        if (startYear === this.displayYear) return true;

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

    renewedInYear() {
      return this.occupiedCurrentYearRentals.filter((rental) => {
        if (!Array.isArray(rental.renewalHistory)) return false;
        return rental.renewalHistory.some(
          (entry) => Number(entry.toYear) === this.displayYear
        );
      }).length;
    },

    confirmedInYear() {
      return this.occupiedCurrentYearRentals.filter((rental) => {
        if (
          !Array.isArray(rental.renewalHistory) ||
          rental.renewalHistory.length === 0
        ) {
          return true;
        }
        return !rental.renewalHistory.some(
          (entry) => Number(entry.toYear) === this.displayYear
        );
      }).length;
    },

    availableInYear() {
      return Math.max(this.totalBeds - this.occupiedCurrentYear, 0);
    },

    items() {
      // ✅ Guard: don't render labels with null year
      const year = this.displayYear ?? this.currentYear;

      return [
        {
          title: "TOTAL BEDS",
          value: this.totalBeds,
          subtitle: `(${year} PHYSICAL CAPACITY)`,
          icon: "hotel",
        },
        {
          title: `${year} OCCUPIED`,
          value: this.occupiedCurrentYear,
          subtitle: `(ACTIVE ${year} OCCUPANTS)`,
          icon: "event",
        },
        {
          title: `${year} RENEWED`,
          value: this.renewedInYear,
          subtitle: `(RENEWED INTO ${year})`,
          icon: "autorenew",
        },
        {
          title: `${year} CONFIRMED`,
          value: this.confirmedInYear,
          subtitle: `(NEW ${year} BOOKINGS)`,
          icon: "person_add",
        },
        {
          title: `${year} AVAILABLE`,
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

        // ✅ Default to the latest year with units
        if (
          !this.selectedYear ||
          !this.availableYears.includes(this.selectedYear)
        ) {
          const years = this.availableYears;
          this.selectedYear =
            years.length > 0
              ? years[years.length - 1]
              : this.currentYear;
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
