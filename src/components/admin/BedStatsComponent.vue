<template>
  <q-card class="stats-card col-md-12 col-12 full-height">
    <q-card-section class="stats-header">
      <div class="text-h6">Bed Occupancy Stats</div>
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
    };
  },

  computed: {
    // ============================================================
    // 2027 UNITS
    // ============================================================

    units2027() {
      return this.units.filter((unit) => Number(unit.unitYear) === 2027);
    },

    // ============================================================
    // TOTAL 2027 BEDS
    // ============================================================

    totalBeds() {
      return this.units2027.reduce((total, unit) => {
        return total + Number(unit.unitOccupants || 0);
      }, 0);
    },

    // ============================================================
    // 2026 ACTIVE RENTALS
    // ============================================================
    //
    // We determine 2026 from the rental start date because some
    // existing 2026 rentals have unitYear === null.
    //
    // Each rental represents ONE bed.
    //

    occupied2026Rentals() {
      return this.rentals.filter((rental) => {
        const startYear = new Date(rental.rentalStartDate).getFullYear();

        return (
          startYear === 2026 &&
          rental.status === "Active" &&
          rental.selectedSubUnits?.type === "bed"
        );
      });
    },

    // ============================================================
    // 2026 OCCUPIED
    // ============================================================

    occupied2026() {
      return this.occupied2026Rentals.length;
    },

    // ============================================================
    // 2026 OCCUPIED USERS
    // ============================================================
    //
    // Used to determine whether a 2027 applicant is a renewal.
    //

    occupied2026Users() {
      return new Set(
        this.occupied2026Rentals.map((rental) => {
          return String(rental.user);
        }),
      );
    },

    // ============================================================
    // 2027 RENTALS / APPLICATIONS
    // ============================================================
    //
    // Again, use rentalStartDate rather than relying entirely
    // on unitYear.
    //

    rentals2027() {
      return this.rentals.filter((rental) => {
        const startYear = new Date(rental.rentalStartDate).getFullYear();

        return startYear === 2027 && rental.selectedSubUnits?.type === "bed";
      });
    },

    // ============================================================
    // 2027 RENEWED
    // ============================================================
    //
    // A renewal is:
    //
    // 1. A 2027 bed application
    // 2. The user had an active 2026 bed
    //
    // IMPORTANT:
    // We do NOT require the 2027 rental to be Active.
    //
    // This allows Pending renewal applications to count.
    //

    renewed2027() {
      return this.rentals2027.filter((rental) => {
        return this.occupied2026Users.has(String(rental.user));
      }).length;
    },

    // ============================================================
    // 2027 CONFIRMED
    // ============================================================
    //
    // A confirmed 2027 bed is:
    //
    // 1. A 2027 bed
    // 2. Status is Active
    // 3. User was NOT an active 2026 occupant
    //
    // Renewals are excluded because they are already counted
    // under 2027 Renewed.
    //

    newConfirmed2027() {
      return this.rentals2027.filter((rental) => {
        return (
          rental.status === "Active" &&
          !this.occupied2026Users.has(String(rental.user))
        );
      }).length;
    },

    // ============================================================
    // 2027 AVAILABLE
    // ============================================================
    //
    // Both renewed beds and confirmed new beds occupy 2027
    // capacity.
    //

    available2027() {
      const allocated = this.renewed2027 + this.newConfirmed2027;

      return Math.max(this.totalBeds - allocated, 0);
    },

    // ============================================================
    // DASHBOARD STATS
    // ============================================================

    items() {
      return [
        {
          title: "TOTAL BEDS",
          value: this.totalBeds,
          subtitle: "(PHYSICAL CAPACITY)",
          icon: "hotel",
        },

        {
          title: "2026 OCCUPIED",
          value: this.occupied2026,
          subtitle: "(ACTIVE 2026 BEDS)",
          icon: "event",
        },

        {
          title: "2027 RENEWED",
          value: this.renewed2027,
          subtitle: "(2026 OCCUPANTS)",
          icon: "autorenew",
        },

        {
          title: "2027 CONFIRMED",
          value: this.newConfirmed2027,
          subtitle: "(NEW ACTIVE BOOKINGS)",
          icon: "person_add",
        },

        {
          title: "2027 AVAILABLE",
          value: this.available2027,
          subtitle: "(LIVE BALANCE)",
          icon: "pie_chart",
        },
      ];
    },
  },

  // ============================================================
  // LOAD DATA
  // ============================================================

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

        // ========================================================
        // DEBUG
        // ========================================================

        console.log("========== BED STATS ==========");

        console.log("Total units:", this.units.length);

        console.log(
          "2026 units:",
          this.units.filter((unit) => Number(unit.unitYear) === 2026).length,
        );

        console.log(
          "2027 units:",
          this.units.filter((unit) => Number(unit.unitYear) === 2027).length,
        );

        console.log("2027 physical beds:", this.totalBeds);

        console.log("2026 occupied:", this.occupied2026);

        console.log("2026 occupied users:", this.occupied2026Users.size);

        console.log("2027 applications:", this.rentals2027.length);

        console.log("2027 renewed:", this.renewed2027);

        console.log("2027 confirmed:", this.newConfirmed2027);

        console.log("2027 available:", this.available2027);
      } catch (error) {
        console.error("Failed to load occupancy statistics:", error);
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>
