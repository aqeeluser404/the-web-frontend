<template>
  <q-page class="bg-grey-3">
    <div class="constrain-standard q-pt-md q-pb-md row justify-center" v-show="!loading">
      <BedStatsComponent />
    </div>

    <div class="constrain-standard q-pb-md row justify-center" v-show="!loading">
      <BedGraphComponent class="col-md-12 col-12" />

      <!-- <div class="col-md-3 col-12" :class="$q.screen.gt.sm ? 'q-mt-none' : 'q-mt-md'">
        <RentalStatusPie
          :rentals="currentRentals"
          :class="$q.screen.gt.sm ? 'q-ml-md' : 'q-ml-none'"
          @filter-status="filterRentalsByChart"
        />
      </div> -->
    </div>

    <!-- Swappable table area -->
    <div class="constrain-standard row justify-center q-pb-md" v-show="!loading">
      <div class="col-md-12 col-12 full-height">
        <!-- Rental History Table -->
        <!-- <RentalHistoryTable
          v-if="activeTable === 'history'"
          :rentals="filteredRentals"
          :columns="rentalColumns"
          :rental-status="rentalStatus"
          :initial-status="selectedRentalStatus"
          @search="handleSearch"
          @filter-status="filterRentalsByChart"
          @row-click="viewUserTimeline"
          @delete="deleteRental"
          @extend="openExtendRentalDialog"
          @end="endRental"
          @open="openInNewTab"
          @download="downloadData"
          @switch-table="activeTable = $event"
        /> -->

<RentalHistoryTable
  v-if="activeTable === 'history'"
  :rentals="filteredRentals"
  :columns="rentalColumns"
  :rental-status="rentalStatus"
  :initial-status="selectedRentalStatus"
  :years="availableYears"
  :initial-year="selectedHistoryYear"
  @search="handleSearch"
  @filter-status="filterRentalsByChart"
  @filter-year="handleHistoryYearFilter"
  @row-click="viewUserTimeline"
  @delete="deleteRental"
  @extend="openExtendRentalDialog"
  @end="endRental"
  @open="openInNewTab"
  @download="downloadData"
  @switch-table="activeTable = $event"
/>

        <!-- Rental Approvals Table -->
        <RentalApprovalsTable
          v-else-if="activeTable === 'approvals'"
          @switch-table="activeTable = $event"
        />
      </div>
    </div>

    <q-inner-loading :showing="loading" color="primary" size="md" />

    <q-dialog v-model="extendRentalDialog">
      <AdminExtendRentalComponent :rental="selectedRental" @close="handleClose" />
    </q-dialog>
  </q-page>
</template>

<script>
import * as XLSX from "xlsx";
import CryptoJS from "crypto-js";
import RentalService from "src/services/api/RentalService";
import UserService from "src/services/api/UserService";
import Helper from "src/services/helper/utils";
import BedGraphComponent from "src/components/admin/BedGraphComponent.vue";
import BedStatsComponent from "src/components/admin/BedStatsComponent.vue";
import RentalStatusPie from "src/components/admin/RentalStatusPie.vue";
import RentalHistoryTable from "src/components/admin/RentalHistoryTable.vue";
import RentalApprovalsTable from "src/components/admin/RentalApprovalsTable.vue";
import AdminExtendRentalComponent from "src/components/admin/AdminExtendRentalComponent.vue";

export default {
  name: "AdminRentalsCard",

  components: {
    BedGraphComponent,
    BedStatsComponent,
    RentalStatusPie,
    RentalHistoryTable,
    RentalApprovalsTable,
    AdminExtendRentalComponent,
  },

computed: {
  availableYears() {
    const years = new Set(
      this.currentRentals.map((r) => Number(r.unitYear)).filter(Boolean)
    );
    return [...years].sort((a, b) => a - b);
  },
},

  data() {
    return {
      activeTable: "history", // 'history' | 'approvals'
      selectedHistoryYear: null,

      loading: true,
      rentals: [],
      filteredRentals: [],
      approvedRentals: [],
      pendingRentals: [],
      rejectedRentals: [],
      endedRentals: [],
      currentRentals: [],
      extendRentalDialog: false,
      selectedRental: null,
      rentalStatus: ["All", "Active", "Pending", "Rejected", "Ended"],
      selectedRentalStatus: "Pending",

      rentalColumns: [
        { name: "id", label: "Application ID", field: "_id", align: "left" },
        // { name: "index", label: "#", field: "index", align: "center" },
        { name: "applicationDate", label: "Application Date", field: "applicationDate", align: "left" },
        { name: "userFirstName", label: "First Name", field: "userFirstName", align: "left" },
        { name: "userLastName", label: "Last Name", field: "userLastName", align: "left" },
        // { name: "applicantContact", label: "Applicant Contact", field: "userPhone", align: "left" },
        // { name: "applicantEmail", label: "Applicant Email", field: "userEmail", align: "left" },

        { name: "floorLevel", label: "Floor Level", field: "selectedSubUnits", align: "center" },
        { name: "unitType", label: "Unit Type", field: "selectedSubUnits", align: "left" },
        // { name: "startDate", label: "Start Date", field: "rentalStartDate", align: "left" },
        // { name: "endDate", label: "End Date", field: "rentalEndDate", align: "left" },
        { name: "renewed", label: "Renewed", field: "renewed", align: "center" },
        { name: "beforeScheduled", label: "Before Scheduled End", field: "earlyEndDate", align: "left" },
        { name: "status", label: "Status", field: "status", align: "center" },
        { name: "actions", label: "Actions", field: "actions", align: "center" },
      ],
    };
  },

  methods: {
    formatDate: Helper.formatDate,
    capitalizeFirstLetter: Helper.capitalizeFirstLetter,

    extractFirstNumber(str) {
      if (!str) return "";
      const match = str.match(/\d+/);
      return match ? match[0] : str;
    },

    openInNewTab(row) {
      try {
        const encryptedId = CryptoJS.AES.encrypt(row._id.toString(), "secret-key").toString();
        const url = `/admin/rentals/view/${encodeURIComponent(encryptedId)}`;
        window.open(url, "_blank");
      } catch (error) {
        console.error("Failed to open rental in new tab:", error);
      }
    },



    async downloadData() {
      this.$q.dialog({
        title: "Download Data",
        message: "You are about to export all rental history data. Would you like to proceed?",
        color: "primary",
        cancel: true,
        persistent: true,
      }).onOk(() => {
        try {
          const today = new Date().toISOString().split("T")[0];
          const rows = this.filteredRentals.map((rental, index) => ({
            "Field No.": index + 1,
            "Application Date": this.formatDate(rental.applicationDate) || "",
            Applicant: rental.username || "Unassigned",
            "Applicant Contact": (rental.userPhone || "Unassigned").replace(/,/g, ""),
            "Applicant Email": rental.userEmail || "Unassigned",
            "Application ID": rental._id || "",
            "Floor Level": this.extractFirstNumber(
              rental.selectedSubUnits?.bedType || rental.selectedSubUnits?.roomType
            ) || "",
            "Unit Type": rental.selectedSubUnits?.bedType || rental.selectedSubUnits?.roomType || "N/A",
            "Start Date": this.defaultValues(rental) ? "Being processed..." : this.formatDate(rental.rentalStartDate),
            "End Date": this.defaultValues(rental) ? "Being processed..." : this.formatDate(rental.rentalEndDate),
            "Before Scheduled": rental.earlyEndDate !== null ? this.formatDate(rental.earlyEndDate) : "N/A",
            Status: this.capitalizeFirstLetter(rental.status || ""),
          }));

          const worksheet = XLSX.utils.json_to_sheet(rows);
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, "RentalHistory");
          XLSX.writeFile(workbook, `rental_history_export_${today}.xlsx`);
        } catch (error) {
          this.$q.notify({
            type: "negative",
            message: "Export failed: " + (error.message || "Please try again"),
          });
        }
      });
    },

    defaultValues(rental) {
      if (!rental?.rentalStartDate || !rental?.rentalEndDate) return false;
      if (rental?.status === "Active") return false;

      const start = new Date(rental.rentalStartDate);
      const end = new Date(rental.rentalEndDate);
      const isDefaultStart = start.getMonth() === 1 && start.getDate() === 1;
      const isDefaultEnd = end.getMonth() === 11 && end.getDate() === 15;
      return isDefaultStart && isDefaultEnd;
    },

    async findAllRentals() {
      this.loading = true;
      try {
        const response = await RentalService.findAllRentals();
        const userIds = [...new Set(response.map((r) => r.user))];
        const usersMap = await UserService.findUsersByIds(userIds);

        this.rentals = response.map((rental) => {
          const user = usersMap[rental.user] || {};
          return {
            ...rental,
            username: user.username || "Unknown",
            userFirstName: user.userFirstName || "Unknown",
            userLastName: user.userLastName || "",
            userId: user.userId || rental.user,
            userEmail: user.userEmail || "",
            userPhone: user.userPhone || "",
            userVerification: user.userVerification || null,
            userDocuments: user.userDocuments || [],
          };
        });

        const filtered = this.rentals.filter((r) =>
          ["Pending", "Active", "Rejected", "Ended"].includes(r.status)
        );

        const sorted = filtered.sort(
          (a, b) => new Date(b.applicationDate) - new Date(a.applicationDate)
        );

        this.currentRentals = sorted;
        this.approvedRentals = sorted.filter((r) => r.status === "Active");
        this.pendingRentals = sorted.filter((r) => r.status === "Pending");
        this.rejectedRentals = sorted.filter((r) => r.status === "Rejected");
        this.endedRentals = sorted.filter((r) => r.status === "Ended");

        this.filteredByRentalStatus();
      } catch (error) {
        console.error("Error loading rentals:", error);
        this.$q?.notify({ type: "negative", message: "Failed to load rentals. Please try again." });
      } finally {
        this.loading = false;
      }
    },
    handleHistoryYearFilter(year) {
      this.selectedHistoryYear = year;
      this.filteredByRentalStatus();
    },

    handleSearch(term) {
      const searchTerm = term.toLowerCase();
      const base = this.selectedRentalStatus === "All" ? this.currentRentals : this.filteredRentals;

      if (!term) {
        this.filteredByRentalStatus();
        return;
      }

      this.filteredRentals = base.filter(
        (rental) =>
          rental.username?.toLowerCase().includes(searchTerm) ||
          rental.unitType?.toLowerCase().includes(searchTerm) ||
          rental.status?.toLowerCase().includes(searchTerm) ||
          rental._id?.toLowerCase().includes(searchTerm) ||
          rental.userFirstName?.toLowerCase().includes(searchTerm) ||
          rental.userLastName?.toLowerCase().includes(searchTerm) ||
          rental.userEmail?.toLowerCase().includes(searchTerm) ||
          rental.userPhone?.toLowerCase().includes(searchTerm)
      );
    },

    filterRentalsByChart(selectedStatus) {
      this.selectedRentalStatus = selectedStatus;
      if (selectedStatus === "Active") this.filteredRentals = this.approvedRentals;
      else if (selectedStatus === "Pending") this.filteredRentals = this.pendingRentals;
      else if (selectedStatus === "Rejected") this.filteredRentals = this.rejectedRentals;
      else if (selectedStatus === "Ended") this.filteredRentals = this.endedRentals;
      else this.filteredRentals = this.currentRentals;
    },

    filteredByRentalStatus() {
      let base;
      if (this.selectedRentalStatus === "All") {
        base = this.currentRentals;
      } else {
        base = this.filteredRentals; // or recompute from status buckets
        this.filterRentalsByChart(this.selectedRentalStatus);
        base = this.filteredRentals;
      }

      if (this.selectedHistoryYear) {
        base = base.filter(
          (r) => Number(r.unitYear) === Number(this.selectedHistoryYear)
        );
      }

      this.filteredRentals = base;
    },

    openExtendRentalDialog(rental) {
      this.selectedRental = rental;
      this.extendRentalDialog = true;
    },

    handleClose() {
      this.extendRentalDialog = false;
      this.selectedRental = null;
      this.findAllRentals();
    },

    async deleteRental(rental) {
      this.$q.dialog({
        title: "Confirm",
        message: "You are about to delete this rental application. This action is irreversible. Continue?",
        color: "primary",
        cancel: true,
        persistent: true,
      }).onOk(async () => {
        const response = await RentalService.deleteRental(rental._id);
        if (response) {
          this.$q.notify({ type: "positive", color: "primary", message: "Delete successful!" });
          this.findAllRentals();
        } else {
          this.$q.notify({ type: "negative", message: "Delete failed. Please try again." });
        }
      });
    },

    async endRental(rental) {
      if (rental.status !== "Active") {
        this.$q.notify({ type: "negative", message: "You can only end an active rental." });
        return;
      }

      this.$q.dialog({
        title: "Confirm",
        message: "You are about to terminate this rental before the agreement end date. Continue?",
        color: "primary",
        cancel: true,
        persistent: true,
      }).onOk(async () => {
        const response = await RentalService.endRental(rental._id);
        if (response) {
          this.$q.notify({ type: "positive", color: "primary", message: "Rental Ended!" });
          this.findAllRentals();
        } else {
          this.$q.notify({ type: "negative", message: "End rental failed. Please try again." });
        }
      });
    },

    viewUserTimeline(row) {
      Helper.adminRentalDetails(row._id, this.$router);
    },
  },

  created() {
    this.findAllRentals();
  },
};
</script>

<style scoped>
.inline-btn {
  display: inline-flex;
  width: auto;
}
</style>
