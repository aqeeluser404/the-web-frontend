<template>
  <q-card class="stats-card col-md-12 col-12 full-height">
    <q-card-section class="stats-header row justify-between items-center">
      <div class="text-h6">Bed Occupancy Stats</div>

      <div class="row items-center q-gutter-sm">
        <q-btn
          icon="eva-cloud-download-outline"
          flat
          dense
          rounded
          color="primary"
          :disable="loading || !internalYear"
          @click="downloadRentalsExcel"
        >
          <q-tooltip>Download {{ internalYear }} rentals</q-tooltip>
        </q-btn>
        <q-select
          v-model="internalYear"
          :options="availableYears"
          dense
          filled
          :disable="loading || availableYears.length === 0"
          style="min-width: 120px"
        />
      </div>

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
import UserService from "src/services/api/UserService";
import * as XLSX from "xlsx";

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
            return fromYear === this.displayYear || toYear === this.displayYear;
          });
        }

        return false;
      });
    },

    occupiedCurrentYear() {
      return this.occupiedCurrentYearRentals.length + this.reservedInYear;
    },

    // renewedInYear() {
    //   return this.occupiedCurrentYearRentals.filter((rental) => {
    //     if (!Array.isArray(rental.renewalHistory)) return false;
    //     return rental.renewalHistory.some(
    //       (entry) => Number(entry.toYear) === this.displayYear
    //     );
    //   }).length;
    // },

    // confirmedInYear() {
    //   const freshRentals = this.occupiedCurrentYearRentals.filter((rental) => {
    //     if (
    //       !Array.isArray(rental.renewalHistory) ||
    //       rental.renewalHistory.length === 0
    //     ) {
    //       return true;
    //     }
    //     return !rental.renewalHistory.some(
    //       (entry) => Number(entry.toYear) === this.displayYear
    //     );
    //   }).length;

    //   return freshRentals + this.reservedInYear;
    // },

    renewedInYear() {
      const renewedRentals = this.occupiedCurrentYearRentals.filter(
        (rental) => {
          if (!Array.isArray(rental.renewalHistory)) return false;
          return rental.renewalHistory.some(
            (entry) => Number(entry.toYear) === this.displayYear
          );
        }
      ).length;

      // ✅ Reserved sub-units now count toward Renewed
      return renewedRentals + this.reservedInYear;
    },

    confirmedInYear() {
      // ✅ Fresh rentals only — no reserved added here
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
          subtitle: `(ACTIVE ${year})`,
          // subtitle: `(ACTIVE ${year} + ${this.reservedInYear} RESERVED)`,
          icon: "event",
        },
        // {
        //   title: `${year} RENEWED`,
        //   value: this.renewedInYear,
        //   subtitle: `(RENEWED INTO ${year})`,
        //   icon: "autorenew",
        // },
        // {
        //   title: `${year} CONFIRMED`,
        //   value: this.confirmedInYear,
        //   subtitle: `(NEW BOOKINGS + ${this.reservedInYear} RESERVED)`,
        //   icon: "person_add",
        // },
        {
          title: `${year} RENEWED`,
          value: this.renewedInYear,
          subtitle: `(RENEWED INTO ${year})`,
          // subtitle: `(RENEWED INTO ${year} + ${this.reservedInYear} RESERVED)`,
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

  watch: {
    refreshKey() {
      this.fetchStatsData();
    },
  },

  async mounted() {
    await this.fetchStatsData();
  },

  methods: {
    downloadRentalsExcel() {
      const year = this.internalYear;
      if (!year) return;

      const unitById = {};
      this.units.forEach((u) => {
        unitById[String(u._id)] = u;
      });

      const findUnitNumber = (unitId) => {
        if (!unitId) return "";
        const unit = unitById[String(unitId)];
        return unit ? unit.unitNumber : "";
      };

      const formatDate = (value) => {
        if (!value) return "—";
        const d = new Date(value);
        if (isNaN(d.getTime())) return "—";
        const day = d.getDate();
        const month = d.toLocaleString("en-ZA", { month: "short" });
        const year = d.getFullYear();
        return `${day} ${month} ${year}`;
      };

      const formatMoney = (value) => {
        const n = Number(value);
        if (isNaN(n) || n === 0) return "—";
        return `R ${n.toLocaleString("en-ZA", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`;
      };

      const yesNo = (value) => (value ? "Yes" : "No");

      const formatPlan = (name) => {
        if (!name) return "—";
        return name
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");
      };

      const matchesYear = (rental) => {
        const startYear = new Date(rental.rentalStartDate).getFullYear();
        const unitYear = Number(rental.unitYear) || startYear;

        if (unitYear === year) return true;
        if (startYear === year) return true;

        if (Array.isArray(rental.renewalHistory)) {
          return rental.renewalHistory.some((entry) => {
            const fromYear = Number(entry.fromYear);
            const toYear = Number(entry.toYear);
            return fromYear === year || toYear === year;
          });
        }
        return false;
      };

      const rentalsForYear = this.rentals.filter(
        (r) => r.status === "Active" && matchesYear(r)
      );

      // ============================================================
      // 1. Active rentals
      // ============================================================
      const dataRows = rentalsForYear.map((rental, index) => {
        const sub = rental.selectedSubUnits || {};
        const currentRoom = sub.bedType || sub.roomType || sub.type || "—";

        const lastRenewal =
          Array.isArray(rental.renewalHistory) &&
          rental.renewalHistory.length > 0
            ? rental.renewalHistory[rental.renewalHistory.length - 1]
            : null;

        return {
          "#": index + 1,
          "Application ID": rental._id || "—",
          Applicant:
            `${rental.userFirstName || ""} ${
              rental.userLastName || ""
            }`.trim() ||
            rental.username ||
            "—",
          Email: rental.userEmail || "—",
          Phone: rental.userPhone || "—",
          Gender: rental.userGender || "—",
          "Applied For": rental.unitYear || "—",
          Unit: findUnitNumber(rental.unit) || "—",
          "Room / Bed": currentRoom,
          "Application Date": formatDate(rental.applicationDate),
          "Start Date": formatDate(rental.rentalStartDate),
          "End Date": formatDate(rental.rentalEndDate),
          "Early End Date": rental.earlyEndDate
            ? formatDate(rental.earlyEndDate)
            : "—",
          Status: rental.status || "—",
          "Rental Price": formatMoney(rental.rentalPrice),
          "Payment Plan": formatPlan(sub.price?.name),
          Parking: rental.parking?.hasParking
            ? `Yes — ${formatMoney(rental.parking.fee)}`
            : "No",
          Shuttle: rental.shuttle?.hasShuttle
            ? `Yes — ${formatMoney(rental.shuttle.fee)}`
            : "No",
          "Renewed?": yesNo(rental.renewed),
          "Renewed From": findUnitNumber(rental.renewedFromUnit) || "—",
          "Renewed To": findUnitNumber(rental.renewedToUnit) || "—",
          "Last Renewal": lastRenewal
            ? `${lastRenewal.fromYear} → ${lastRenewal.toYear}`
            : "—",
        };
      });

      // ============================================================
      // 2. Reserved sub-units (not yet rented)
      // ============================================================
      const reservedRows = [];

      const unitsForYear = this.units.filter(
        (u) => Number(u.unitYear) === year
      );

      unitsForYear.forEach((unit) => {
        const subUnits = Array.isArray(unit.subUnits) ? unit.subUnits : [];
        subUnits.forEach((sub) => {
          const isReserved =
            sub.reservedAt != null && sub.isAvailable !== false;
          if (!isReserved) return;

          const identifier = sub.bedType || sub.roomType || sub.type || "—";

          reservedRows.push({
            "#": "—",
            "Application ID": "RESERVED",
            Applicant: "—",
            Email: "—",
            Phone: "—",
            Gender: "—",
            "Applied For": year,
            Unit: unit.unitNumber || "—",
            "Room / Bed": identifier,
            "Application Date": "—",
            "Start Date": "—",
            "End Date": "—",
            "Early End Date": "—",
            Status: "Reserved",
            "Rental Price": "—",
            "Payment Plan": "—",
            Parking: "—",
            Shuttle: "—",
            "Renewed?": "—",
            "Renewed From": "—",
            "Renewed To": "—",
            "Last Renewal": `Reserved ${formatDate(sub.reservedAt)}`,
          });
        });
      });

      // Combine: active rentals first, then reserved
      const allRows = [...dataRows, ...reservedRows];

      if (allRows.length === 0) {
        this.$q.notify({
          type: "info",
          message: `No active or reserved entries for ${year} to export.`,
        });
        return;
      }

      // ============================================================
      // 3. Build the sheet
      // ============================================================
      const headers = Object.keys(allRows[0]);
      const colCount = headers.length;

      const title = `${year} ACTIVE RENTAL APPLICATIONS`;
      const subtitle = `Generated ${formatDate(new Date())} · ${
        dataRows.length
      } rentals · ${reservedRows.length} reserved`;

      const aoa = [[title], [subtitle], [], headers];

      allRows.forEach((row) => {
        aoa.push(headers.map((h) => row[h]));
      });

      const worksheet = XLSX.utils.aoa_to_sheet(aoa);

      worksheet["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: colCount - 1 } },
        { s: { r: 1, c: 0 }, e: { r: 1, c: colCount - 1 } },
      ];

      const titleCell = worksheet["A1"];
      if (titleCell) {
        titleCell.s = {
          font: { bold: true, sz: 16, color: { rgb: "009B77" } },
          alignment: { horizontal: "center", vertical: "center" },
        };
      }
      const subtitleCell = worksheet["A2"];
      if (subtitleCell) {
        subtitleCell.s = {
          font: { italic: true, sz: 10, color: { rgb: "757575" } },
          alignment: { horizontal: "center", vertical: "center" },
        };
      }

      headers.forEach((_, i) => {
        const cellRef = XLSX.utils.encode_cell({ r: 3, c: i });
        if (worksheet[cellRef]) {
          worksheet[cellRef].s = {
            font: { bold: true, color: { rgb: "FFFFFF" } },
            fill: { fgColor: { rgb: "009B77" } },
            alignment: { horizontal: "left", vertical: "center" },
          };
        }
      });

      // Auto-size columns
      worksheet["!cols"] = headers.map((header) => {
        const maxLen = Math.max(
          header.length,
          ...allRows.map((row) => String(row[header] ?? "").length)
        );
        return { wch: Math.min(maxLen + 2, 40) };
      });

      worksheet["!rows"] = [{ hpt: 28 }, { hpt: 18 }, { hpt: 8 }, { hpt: 20 }];

      worksheet["!freeze"] = { xSplit: 0, ySplit: 4 };

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        `${year} Applications`.slice(0, 31)
      );

      const today = new Date().toISOString().split("T")[0];
      const filename = `rentals_${year}_${today}.xlsx`;
      XLSX.writeFile(workbook, filename);

      this.$q.notify({
        type: "positive",
        color: "primary",
        message: `Exported ${dataRows.length} rentals + ${reservedRows.length} reserved for ${year}.`,
      });
    },

    async fetchStatsData() {
      this.loading = true;

      try {
        const [rentalsResponse, units] = await Promise.all([
          RentalService.findAllRentals(),
          UnitService.getAllUnits(),
        ]);

        this.units = Array.isArray(units) ? units : [];
        const rawRentals = Array.isArray(rentalsResponse)
          ? rentalsResponse
          : [];

        // ✅ Join user details so export has names / email / phone / gender
        const userIds = [
          ...new Set(rawRentals.map((r) => r.user).filter(Boolean)),
        ];

        let usersMap = {};
        if (userIds.length) {
          usersMap = await UserService.findUsersByIds(userIds);
        }

        this.rentals = rawRentals.map((rental) => {
          const user = usersMap[rental.user] || {};
          return {
            ...rental,
            // user details (for display + export)
            username: user.username || "Unknown",
            userFirstName: user.userFirstName || "",
            userLastName: user.userLastName || "",
            userEmail: user.userEmail || "",
            userPhone: user.userPhone || "",
            userGender: user.userGender || "",
            userId: user.userId || rental.user,
          };
        });

        if (
          !this.internalYear ||
          !this.availableYears.includes(this.internalYear)
        ) {
          const years = this.availableYears;
          this.internalYear =
            years.length > 0 ? years[years.length - 1] : this.currentYear;
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
