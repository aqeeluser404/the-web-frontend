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

<q-card-section class="row justify-center items-center q-pt-none q-pb-md q-gutter-sm">
  <q-chip
    square
    color="grey-3"
    text-color="grey-9"
    class="text-weight-bold"
    size="md"
  >
    {{ displayYear }}: {{ occupiedCurrentYear }} / {{ totalBeds }} occupied
  </q-chip>

  <q-chip
    square
    color="grey-3"
    text-color="grey-9"
    class="text-weight-bold"
    size="md"
  >
    {{ nextDisplayYear }}: {{ newConfirmedNextYear + renewedNextYear }} / {{ totalBedsNextYear }} occupied
  </q-chip>
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
      loading: false,
      currentYear: new Date().getFullYear(),
      // ✅ Selected year drives the whole component
      // Defaults to current year (2026)
      selectedYear: new Date().getFullYear(),
    };
  },

  computed: {
    // ============================================================
    // DISPLAYED YEARS — derived from the selected year
    // ============================================================
    //
    // If selectedYear is 2026 → displayYear = 2026, nextDisplayYear = 2027
    // If selectedYear is 2027 → displayYear = 2027, nextDisplayYear = 2028
    // If selectedYear is 2028 → displayYear = 2028, nextDisplayYear = 2029
    //

    displayYear() {
      return this.selectedYear;
    },

    nextDisplayYear() {
      return this.selectedYear + 1;
    },

    // ============================================================
    // AVAILABLE YEARS — built from units in the system
    // ============================================================
    //
    // Only includes years >= currentYear so users can't select past years.
    // Always includes currentYear as an option even if no units exist yet.
    //

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
    // UNITS FOR SELECTED YEAR + NEXT YEAR
    // ============================================================

    unitsCurrentYear() {
      return this.units.filter(
        (unit) => Number(unit.unitYear) === this.displayYear
      );
    },

    unitsNextYear() {
      return this.units.filter(
        (unit) => Number(unit.unitYear) === this.nextDisplayYear
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

totalBedsNextYear() {
  // ✅ No fallback — if next year has no units, capacity is 0
  return this.unitsNextYear.reduce((total, unit) => {
    const subUnits = Array.isArray(unit.subUnits) ? unit.subUnits : [];
    return total + subUnits.length;
  }, 0);
},

// ============================================================
// CURRENT YEAR OCCUPIED
// ============================================================
//
// Physical occupancy of the display year.
// - Includes tenants whose lease started in the display year
// - Includes renewed tenants assigned to the display year
// - Excludes tenants who've moved forward (renewed into next year)
//

occupiedCurrentYearRentals() {
  return this.rentals.filter((rental) => {
    if (rental.status !== "Active") return false;

    const startYear = new Date(rental.rentalStartDate).getFullYear();
    const unitYear = Number(rental.unitYear) || startYear;

    // ✅ Determine the chain head — the latest year this rental is in
    let chainHead = unitYear;

    if (Array.isArray(rental.renewalHistory)) {
      rental.renewalHistory.forEach((entry) => {
        const toYear = Number(entry.toYear);
        if (!isNaN(toYear) && toYear > chainHead) {
          chainHead = toYear;
        }
      });
    }

    // ✅ Only count if the chain head matches the display year
    return chainHead === this.displayYear;
  });
},

    occupiedCurrentYear() {
      return this.occupiedCurrentYearRentals.length;
    },

    occupiedCurrentYearUsers() {
      return new Set(
        this.occupiedCurrentYearRentals.map((rental) =>
          String(rental.user)
        )
      );
    },

    // ============================================================
    // NEXT YEAR RENTALS / APPLICATIONS
    // ============================================================

    rentalsNextYear() {
      return this.rentals.filter((rental) => {
        const year =
          Number(rental.unitYear) ||
          new Date(rental.rentalStartDate).getFullYear();

        return (
          year === this.nextDisplayYear &&
          rental.selectedSubUnits?.type === "bed"
        );
      });
    },

    // ============================================================
    // NEXT YEAR RENEWED (Active only)
    // ============================================================

    renewedNextYear() {
      return this.rentalsNextYear.filter((rental) => {
        return rental.renewed === true && rental.status === "Active";
      }).length;
    },

    // ============================================================
    // NEXT YEAR CONFIRMED (New active bookings)
    // ============================================================

    newConfirmedNextYear() {
      return this.rentalsNextYear.filter((rental) => {
        return rental.status === "Active" && rental.renewed !== true;
      }).length;
    },

    // ============================================================
    // NEXT YEAR AVAILABLE
    // ============================================================

availableNextYear() {
  // ✅ No next-year units = no available count
  if (this.totalBedsNextYear === 0) return 0;

  const allocated = this.renewedNextYear + this.newConfirmedNextYear;
  return Math.max(this.totalBedsNextYear - allocated, 0);
},

    // ============================================================
    // DASHBOARD STATS
    // ============================================================

  totalOccupied() {
    return (
      this.occupiedCurrentYear +
      this.renewedNextYear +
      this.newConfirmedNextYear
    );
  },

nextYearAllocated() {
  return this.renewedNextYear + this.newConfirmedNextYear;
},

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
          subtitle: `(ACTIVE ${this.displayYear} BEDS)`,
          icon: "event",
        },
        {
          title: `${this.nextDisplayYear} RENEWED`,
          value: this.renewedNextYear,
          subtitle: `(${this.displayYear} OCCUPANTS)`,
          icon: "autorenew",
        },
        {
          title: `${this.nextDisplayYear} CONFIRMED`,
          value: this.newConfirmedNextYear,
          subtitle: "(NEW ACTIVE BOOKINGS)",
          icon: "person_add",
        },
{
  title: `${this.nextDisplayYear} AVAILABLE`,
  value: this.availableNextYear,
  subtitle: `(${this.nextYearAllocated} / ${this.totalBedsNextYear} FOR NEW YEAR)`,
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
      // Computed props auto-update, but this hook lets you
      // trigger side effects if needed later
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

        // ✅ If the default selectedYear isn't in the availableYears list,
        // snap to the first available year
        if (!this.availableYears.includes(this.selectedYear)) {
          this.selectedYear = this.availableYears[0] ?? this.currentYear;
        }

        console.log("========== BED STATS ==========");
        console.log("Display Year:", this.displayYear);
        console.log("Next Display Year:", this.nextDisplayYear);
        console.log(`${this.displayYear} physical beds:`, this.totalBeds);
        console.log(
          `${this.nextDisplayYear} physical beds:`,
          this.totalBedsNextYear
        );
        console.log(
          `${this.displayYear} occupied:`,
          this.occupiedCurrentYear
        );
        console.log(`${this.nextDisplayYear} renewed:`, this.renewedNextYear);
        console.log(
          `${this.nextDisplayYear} confirmed:`,
          this.newConfirmedNextYear
        );
        console.log(
          `${this.nextDisplayYear} available:`,
          this.availableNextYear
        );
        console.log(
          "Total allocated (occupied + renewed + confirmed):",
          this.occupiedCurrentYear +
            this.renewedNextYear +
            this.newConfirmedNextYear
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
