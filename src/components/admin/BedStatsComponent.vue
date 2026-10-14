<template>
  <q-card class="stats-card col-md-12 col-12 full-height">
    <q-card-section class="stats-header row justify-between items-center">
      <div class="text-h6">Bed Occupancy Stats</div>
      <q-select
        v-model="internalYear"
        :options="availableYears"
        dense
        filled
        :disable="loading || availableYears.length === 0"
        style="min-width: 120px"
      />
      <q-separator class="q-my-sm" style="width: 100%" />
    </q-card-section>

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

  props: {
    refreshKey: { type: Number, default: 0 },
    selectedYear: { type: [Number, String], default: null },
  },

  emits: ["update:selected-year"],

  data() {
    return {
      rentals: [],
      units: [],
      loading: true,
      currentYear: new Date().getFullYear(),
    };
  },

  computed: {
    //   v-model bridge: reads parent's selectedYear, writes back to it
    internalYear: {
      get() {
        return this.selectedYear;
      },
      set(val) {
        this.$emit("update:selected-year", val);
      },
    },

    displayYear() {
      return this.internalYear;
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

    reservedInYear() {
      return this.unitsCurrentYear.reduce((total, unit) => {
        const subUnits = Array.isArray(unit.subUnits) ? unit.subUnits : [];
        return (
          total +
          subUnits.filter(
            (s) => s.reservedAt != null && s.isAvailable !== false
          ).length
        );
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
      return this.occupiedCurrentYearRentals.length + this.reservedInYear;
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
      const freshRentals = this.occupiedCurrentYearRentals.filter((rental) => {
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

      return freshRentals + this.reservedInYear;
    },

    availableInYear() {
      return Math.max(this.totalBeds - this.occupiedCurrentYear, 0);
    },

    items() {
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
          subtitle: `(ACTIVE ${year} + ${this.reservedInYear} RESERVED)`,
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
          subtitle: `(NEW BOOKINGS + ${this.reservedInYear} RESERVED)`,
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

  watch: {
    refreshKey() {
      this.fetchStatsData();
    },
  },

  async mounted() {
    await this.fetchStatsData();
  },

  methods: {
    async fetchStatsData() {
      this.loading = true;

      try {
        const [rentals, units] = await Promise.all([
          RentalService.findAllRentals(),
          UnitService.getAllUnits(),
        ]);

        this.rentals = Array.isArray(rentals) ? rentals : [];
        this.units = Array.isArray(units) ? units : [];

        //   default to latest year if the shared year isn't set
        if (
          !this.internalYear ||
          !this.availableYears.includes(this.internalYear)
        ) {
          const years = this.availableYears;
          this.internalYear =
            years.length > 0
              ? years[years.length - 1]
              : this.currentYear;
        }
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
