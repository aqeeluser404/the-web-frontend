<template>
  <q-page class="bg-grey-3">
    <div class="constrain-standard q-pt-md q-pb-md row justify-center" v-show="!loading">
      <div class="col-md-9 col-12 full-height">
        <!-- Driver Approval Card -->
        <q-card class="soft-shadow-card full-height">
          <q-card-section class="bg-primary text-white">
            <div class="text-h6">Today {{ new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) }}</div>
          </q-card-section>

          <q-card-section>
            <q-list v-if="Object.keys(groupedApplications).length > 0" bordered separator>
              <q-expansion-item v-for="(applications, time) in groupedApplications" :key="time" :label="time"
                icon="schedule" header-class="text-weight-medium text-center" expand-separator>
                <!-- user info -->
                <div v-for="shuttle in applications" :key="shuttle._id"
                  class="row items-center justify-between q-pa-md">
                  <div>
                    <div class="text-weight-bold">
                      {{ capitalizeFirstLetter(shuttle.userFirstName) }}
                      {{ capitalizeFirstLetter(shuttle.userLastName) }}
                    </div>

                    <div class="text-grey-7 q-mt-xs">
                      Student No: {{ shuttle.userStudentNumber }}
                    </div>

                    <div class="text-grey-7" v-if="shuttle.unitNumber">Unit: {{ shuttle.unitNumber }}</div>
                    <div class="text-grey-7" v-else>
                      Admin Access Account
                    </div>
                  </div>

                  <!-- buttons -->
                  <div class="row justify-center items-center">
                    <CustomButton :label="shuttle.status === 'Pending'
                      ? 'Picked Up'
                      : shuttle.status === 'Picked Up'
                        ? 'Dropped Off'
                        : ''
                      " :color="shuttle.status === 'Pending'
                        ? 'primary'
                        : shuttle.status === 'Picked Up'
                          ? 'secondary'
                          : 'grey'
                        " unelevated class="" @click="approveShuttle(shuttle)" :customStyle="shuttle.status === 'Picked Up'
                          ? 'width: 100%'
                          : 'width: 55%'
                          " />
                    <CustomButton v-if="shuttle.status !== 'Picked Up'" label="Missed" color="negative" unelevated
                      class="q-ml-sm" @click="declineShuttle(shuttle)" customStyle="width: 40%" />
                  </div>
                </div>
              </q-expansion-item>
            </q-list>
            <div v-else class="text-center text-grey-6 q-pa-lg">
              No applications for today
            </div>
          </q-card-section>
        </q-card>
      </div>


    </div>

    <!-- Shuttle History -->
    <div class="constrain-standard q-pb-md row justify-center" v-show="!loading">
      <div class="col-md-9 col-12 full-height">
        <q-card class="full-height soft-shadow-card">
          <!-- Heading -->
          <q-card-section class="row justify-between stats-header items-center">
            <div class="row justify-between items-center  full-width">
              <div class="text-h6">Shuttle History</div>
              <q-btn @click="downloadData()" class="custom-button" icon="eva-cloud-download-outline" flat rounded />
            </div>
            <q-separator class="q-my-sm" style="width: 100%;" />
          </q-card-section>

          <!-- Filtering methods -->
          <q-card-section class="row justify-between">
            <q-input filled v-model="search" placeholder="Search" @update:model-value="filterBySearch"
              class="col-12 col-md-9" />
            <q-select v-model="selectedShuttleStatus" :options="shuttleStatus" label="Shuttle Status"
              @update:model-value="filteredByShuttleStatus" class="col-12 col-md-2" />
          </q-card-section>

          <!-- shuttle history table -->
          <!-- loop using the filteredShuttles -->
          <q-card-section v-if="filteredShuttles.length > 0">
            <q-table :rows="filteredShuttles" :columns="columns" row-key="_id" flat bordered>

              <template v-slot:body-cell-index="props">
                <q-td :props="props">
                  {{ props.rowIndex + 1 }}
                </q-td>
              </template>

              <!-- created date -->
              <template v-slot:body-cell-createdAt="props">
                <q-td :props="props">
                  {{ formatDate(props.row.createdAt) }}
                </q-td>
              </template>

              <template v-slot:body-cell-id="props">
                <q-td :props="props">
                  <div class="id">
                    <q-badge color="text-primary" align="middle" class="q-pa-xs q-px-sm">
                      {{ props.row._id }}
                    </q-badge>
                  </div>
                </q-td>
              </template>

              <!-- date -->
              <template v-slot:body-cell-bookingDate="props">
                <q-td :props="props">
                  {{ formatDate(props.row.bookingTimeslot) }}
                </q-td>
              </template>

              <!-- time slot -->
              <template v-slot:body-cell-bookingTimeslot="props">
                <q-td :props="props">
                  {{ formatTime(props.row.bookingTimeslot) }}
                </q-td>
              </template>

              <template v-slot:body-cell-unitNumber="props">
                <q-td :props="props">
                  <div v-if="props.row.unitNumber">
                    {{ props.row.unitNumber }}
                  </div>
                  <div v-else>
                    N/A
                  </div>
                </q-td>
              </template>

              <!-- student -->
              <template v-slot:body-cell-student="props">
                <q-td :props="props">
                  {{ capitalizeFirstLetter(props.row.userFirstName) }}
                  {{ capitalizeFirstLetter(props.row.userLastName) }}
                </q-td>
              </template>

              <!-- status -->
              <template v-slot:body-cell-status="props">
                <q-td :props="props">
                  <q-badge :color="props.row.status === 'Pending'
                    ? 'orange'
                    : props.row.status === 'Picked Up'
                      ? 'primary'
                      : props.row.status === 'Dropped Off'
                        ? 'green'
                        : props.row.status === 'Missed Pick Up'
                          ? 'red'
                          : 'grey'
                    " align="middle" class="q-pa-xs q-px-sm">
                    {{ props.row.status }}
                  </q-badge>
                </q-td>
              </template>

              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <CustomButton flat color="red" text-color="red" customStyle="width: 15%" icon="eva-trash-outline"
                    @click="cancelBooking(props.row)" />
                </q-td>
              </template>
            </q-table>
          </q-card-section>
          <q-card-section v-else class="row justify-center">
            <q-item>
              <q-item-section class="text-subtitle1">No shuttle booking has been placed yet.</q-item-section>
            </q-item>
          </q-card-section>
        </q-card>
      </div>

      <!-- <q-card bordered class="col-md-3 col-12 soft-shadow-card">

        <q-card-section class="row justify-between stats-header items-center">
          <div class="row justify-between items-center full-width">
            <div class="text-h6">Tenant List</div>
            <q-btn @click="downloadData()" size="12px" icon="eva-cloud-download-outline" flat rounded />
          </div>
          <q-separator class="q-my-sm" style="width: 100%;" />
        </q-card-section>

        <q-table flat bordered :rows="filteredUsers" :columns="userColumns" row-key="_id">
          <template v-slot:body-cell-index="props">
            <q-td :props="props">
              {{ props.rowIndex + 1 }}
            </q-td>
          </template>
        </q-table>
      </q-card> -->
    </div>

    <q-inner-loading :showing="loading" color="primary" size="md" />
  </q-page>
</template>

<script>
import * as XLSX from 'xlsx';
import ShuttleService from "src/services/api/ShuttleService";
import Helper from 'src/services/helper/utils';
import RentalService from 'src/services/api/RentalService';
import CustomButton from "src/components/elements/CustomButton.vue";
import UserService from "src/services/api/UserService";
import UnitService from 'src/services/api/UnitService';

export default {
  name: "AdminShuttleCard",

  data() {
    return {
      loading: true,
      shuttles: [],
      search: "",

      //shuttle applications for today
      todaysApplications: [],
      groupedApplications: {},

      filteredShuttles: [],
      currentShuttles: [],
      pickedUpShuttles: [],
      pendingShuttles: [],
      droppedOffShuttles: [],
      MissedPickUpShuttles: [],

      shuttleStatus: [
        "All",
        "Picked Up",
        "Pending",
        "Dropped Off",
        "Missed Pick Up",
      ],
      selectedShuttleStatus: "All",
      showAllStatuses: true,

      userColumns: [
        {
          name: "index",
          label: "#",
          field: "index",
          align: 'center'

        },
        // { name: "username", label: "Username", field: "username", align: 'left' },
        { name: "firstName", label: "First Name", field: "firstName", align: 'left' },
        { name: "lastName", label: "Last Name", field: "lastName", align: 'left' },
        // { name: "id", label: "User/Tenant ID", field: "_id", align: 'left' },
        // { name: "email", label: "Email", field: "email", align: 'left' },
        // { name: "approved", label: "Approved Applications", field: "rentals", align: 'left' },
        // { name: "type", label: "Type", field: "userType", align: 'left' },
        // { name: "rightsType", label: "Rights", field: "rightsType", align: 'left' },
        // { name: "online", label: "Online", field: "loginInfo", align: 'center' },
        // { name: "actions", label: "Actions", field: "actions", align: 'center' },
      ],

      users: [],
      filteredUsers: [],

      columns: [
        {
          name: "index",
          label: "#",
          field: "index",
          align: 'center'
        },
        { name: "id", label: "Shuttle ID", field: "_id", align: 'left' },
        // {
        //   name: "createdAt",
        //   label: "CreatedAt",
        //   field: "createdAt",
        //   align: "left",
        // },
        {
          name: "student",
          label: "Student",
          field: (row) => `${row.firstName} ${row.lastName}`,
          align: "left",
        },
        {
          name: "userStudentNumber",
          label: "Student No.",
          field: "userStudentNumber",
          align: "left",
        },
        {
          name: "bookingTimeslot",
          label: "Slot",
          field: "bookingTimeslot",
          align: "left",
        },
        {
          name: "bookingDate",
          label: "Date",
          field: "bookingDate",
          align: "left",
        },
        {
          name: "pickupLocation",
          label: "Pick-up",
          field: "pickupLocation",
          align: "left",
        },
        {
          name: "dropoffLocation",
          label: "Dropoff",
          field: "dropoffLocation",
          align: "left",
        },

        {
          name: "unitNumber",
          label: "Unit",
          field: "unitNumber",
          align: "center",
        },
        {
          name: "status",
          label: "Status",
          field: "status",
          align: "center",
        },
        {
          name: "actions",
          label: "Actions",
          field: "actions",
          align: "center",
        },
      ],
    };
  },
  components: {
    CustomButton,
  },
  methods: {
    formatDate: Helper.formatDate,
    capitalizeFirstLetter: Helper.capitalizeFirstLetter,

    async downloadData() {
      this.$q.dialog({
        title: 'Download Data',
        message: 'You are about to export all shuttle history data. Would you like to proceed?',
        color: 'primary',
        cancel: true,
        persistent: true
      }).onOk(() => {
        try {
          const today = new Date().toISOString().split('T')[0];

          // Build rows from filteredShuttles
          const rows = this.filteredShuttles.map((shuttle, index) => {
            const timeslot = new Date(shuttle.bookingTimeslot);

            return {
              'Field No.': index + 1,
              'Created At': this.formatDate(shuttle.createdAt),
              'Date For': timeslot.toISOString().split('T')[0], // just the date
              'Time Slot': timeslot.toTimeString().split(' ')[0], // just the time (HH:mm:ss)
              'Student': `${shuttle.userFirstName} ${shuttle.userLastName}`,
              'Student No.': shuttle.userStudentNumber,
              'Unit': shuttle.unitNumber || '',
              'Pickup': shuttle.pickupLocation,
              'Dropoff': shuttle.dropoffLocation,
              'Status': shuttle.status,
            };
          });

          // Convert JSON to worksheet
          const worksheet = XLSX.utils.json_to_sheet(rows);

          // Create a new workbook and append the worksheet
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'ShuttleHistory');

          // Trigger download as .xlsx
          XLSX.writeFile(workbook, `shuttle_history_export_${today}.xlsx`);

          this.$q.notify({
            type: 'positive',
            color: 'primary',
            message: 'Export successful!'
          });
        } catch (error) {
          this.$q.notify({
            type: 'negative',
            message: 'Export failed: ' + (error.message || 'Please try again')
          });
        }
      });
    },

    async findAllShuttles() {
      this.loading = true

      const [response, allUsers, allRentals, allUnits] = await Promise.all([
        ShuttleService.findAllShuttles(),
        UserService.findAllUsers(),
        RentalService.findAllRentals(),
        UnitService.getAllUnits()
      ]);

      const usersById = new Map(allUsers.map(u => [u._id, u]));
      const unitsById = new Map(allUnits.map(u => [u._id, u]));

      // group rentals by user so we can find each shuttle's active rental without another lookup
      const rentalsByUser = new Map();
      for (const rental of allRentals) {
        if (!rentalsByUser.has(rental.user)) rentalsByUser.set(rental.user, []);
        rentalsByUser.get(rental.user).push(rental);
      }

      this.shuttles = response.map(shuttle => {
        try {
          const user = usersById.get(shuttle.user);
          if (!user) {
            console.warn(`Shuttle ${shuttle._id}: no matching user for ${shuttle.user}`);
            return { ...shuttle, userType: null, userStudentNumber: null, userFirstName: null, userLastName: null, unitNumber: null };
          }

          const userRentals = rentalsByUser.get(shuttle.user) || [];
          const activeRental = userRentals.find(rental => rental.status === "Active");
          const occupiedUnit = activeRental ? unitsById.get(activeRental.unit) : null;

          let userRightsType;
          if (
            user.userType === 'Admin' &&
            (!user.rightsType || user.rightsType === '' || user.rightsType === null)
          ) {
            userRightsType = user.userType;
          } else {
            userRightsType = user.rightsType;
          }

          return {
            ...shuttle,
            userType: userRightsType,
            userStudentNumber: user.studentInfo?.studentNumber ?? null, // 🆕 safe even if studentInfo is missing
            userFirstName: user.firstName,
            userLastName: user.lastName,
            unitNumber: occupiedUnit ? occupiedUnit.unitNumber : null,
          };
        } catch (err) {
          console.error(`Failed to process shuttle ${shuttle._id}:`, err);
          return { ...shuttle, userType: null, userStudentNumber: null, userFirstName: null, userLastName: null, unitNumber: null };
        }
      });

      this.buildTodaysApplications();

      const filteredShuttles = this.shuttles.filter(
        (shuttle) =>
          shuttle.status === "Picked Up" ||
          shuttle.status === "Pending" ||
          shuttle.status === "Dropped Off" ||
          shuttle.status === "Missed Pick Up",
      );

      this.currentShuttles = filteredShuttles;
      this.pickedUpShuttles = filteredShuttles.filter((shuttle) => shuttle.status === "Picked Up");
      this.pendingShuttles = filteredShuttles.filter((shuttle) => shuttle.status === "Pending");
      this.droppedOffShuttles = filteredShuttles.filter((shuttle) => shuttle.status === "Dropped Off");
      this.MissedPickUpShuttles = filteredShuttles.filter((shuttle) => shuttle.status === "Missed Pick Up");
      this.filteredByShuttleStatus();

      this.loading = false
    },

    async findAllUsers() {
      const response = await UserService.findAllUsers();

      this.filteredUsers = response.filter(user => user.rightsType === 'Tenant');
    },

    //get todays applications
    async buildTodaysApplications() {
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];

      // Use map instead of filter so we can await updates
      const updatedShuttles = await Promise.all(
        this.shuttles.map(async (shuttle) => {
          const shuttleDateStr = new Date(shuttle.bookingTimeslot)
            .toISOString()
            .split("T")[0];

          // If shuttle was due before today and still Pending → mark as Missed Pick Up
          if (shuttleDateStr < todayStr && shuttle.status === "Pending") {
            const newStatus = "Missed Pick Up";
            try {
              await ShuttleService.updateShuttle(shuttle._id, { status: newStatus });
              shuttle.status = newStatus; // update local copy after successful API call
            } catch (err) {
              console.error("Failed to update shuttle:", shuttle._id, err);
            }
          }

          return shuttle;
        })
      );

      // Keep only today's Pending OR any Picked Up
      this.todaysApplications = updatedShuttles.filter(
        (shuttle) =>
          (new Date(shuttle.bookingTimeslot).toISOString().split("T")[0] === todayStr &&
            shuttle.status === "Pending") ||
          shuttle.status === "Picked Up"
      );

      // Sort by timeslot ascending(within the time groups)
      this.todaysApplications.sort(
        (a, b) => new Date(a.bookingTimeslot) - new Date(b.bookingTimeslot)
      );

      //group by timeslot
      const sortTimeslotGroups = this.todaysApplications.reduce((groups, shuttle) => {
        const timeKey = this.formatTime(shuttle.bookingTimeslot);

        if(!groups[timeKey]) {
          groups[timeKey] = [];
        }

        groups[timeKey].push(shuttle);

        return groups;
      }, {});

      //sort by earliest first
      this.groupedApplications = Object.keys(sortTimeslotGroups)
      .sort((a,b) => {
        const [hourA, minuteA] = a.split(':').map(Number);
        const [hourB, minuteB] = b.split(':').map(Number);
        return (hourA * 60 + minuteA) - (hourB * 60 + minuteB);
      })
      .reduce((sorted, key) => {
        sorted[key] = sortTimeslotGroups[key];
        return sorted;
      }, {});
    },


    //approve shuttle
    async approveShuttle(shuttle) {
      try {
        this.$q.dialog({
          title: 'Confirm',
          message: `You are about update the status of this application. Do you wish to continue?`,
          color: 'primary',
          cancel: true,
          persistent: true
        }).onOk(async () => {

          let newStatus = "";
          if (shuttle.status === "Pending") {
            newStatus = "Picked Up";
          } else if (shuttle.status === "Picked Up") {
            newStatus = "Dropped Off";
          } else {
            return;
          }
          shuttle.status = newStatus;
          await this.buildTodaysApplications();
          this.filteredByShuttleStatus();

          const response = await ShuttleService.updateShuttle(shuttle._id, { status: newStatus });
          if (response) {
            this.$q.notify({ type: 'positive', color: 'primary', message: 'Status update successful!' });
            this.findAllShuttles();
          } else {
            this.$q.notify({ type: 'negative', message: 'Status update failed. Please try again.' });
          }
        }).onCancel(() => { });
      } catch (error) {
        console.error("Error approving shuttle:", error);
      }
    },

    // missed pickup
    async declineShuttle(shuttle) {
      try {
        this.$q.dialog({
          title: 'Confirm',
          message: `You are about update the status of this application. Do you wish to continue?`,
          color: 'primary',
          cancel: true,
          persistent: true
        }).onOk(async () => {

          let newStatus = "";
          if (shuttle.status === "Pending") {
            newStatus = "Missed Pick Up";
          } else {
            return;
          }
          shuttle.status = newStatus;
          await this.buildTodaysApplications();
          this.filteredByShuttleStatus();

          const response = await ShuttleService.updateShuttle(shuttle._id, {
            status: newStatus,
          });
          if (response) {
            this.$q.notify({ type: 'positive', color: 'primary', message: 'Status update successful!' });
            this.findAllShuttles();
          } else {
            this.$q.notify({ type: 'negative', message: 'Status update failed. Please try again.' });
          }
        }).onCancel(() => { });

      } catch {
        console.error("Error declining shuttle:", error);
      }
    },

    async cancelBooking(row) {
      const shuttleId = row._id;

      this.$q.dialog({
        title: 'Confirm',
        message: 'You are about to cancel this Shuttle. Do you wish to proceed?',
        color: 'primary',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        try {
          await ShuttleService.deleteShuttle(shuttleId);
          this.$q.notify({
            type: 'positive',
            color: 'primary',
            message: 'Shuttle booking has been deleted.'
          });

          // Refresh data immediately after cancellation
          await this.buildTodaysApplications();
          this.filteredByShuttleStatus();
          this.findAllShuttles();

        } catch (error) {
          console.error(error);
          this.$q.notify({
            type: 'negative',
            message: 'Failed to cancel shuttle.'
          });
        }
      }).onCancel(() => { });
    },

    //missed pickup
    // async markMissedPickups() {
    //   const now = new Date();

    //   const pendingShuttles = this.shuttles.filter(
    //     (s) => s.status === "Pending",
    //   );

    //   for (const shuttle of pendingShuttles) {
    //     const pickupTime = new Date(shuttle.bookingTimeslot);
    //     const cutoffTime = new Date(pickupTime.getTime() + 2 * 60 * 1000);
    //     if (now > cutoffTime) {
    //       await ShuttleService.updateShuttle(shuttle._id, {
    //         status: "Missed Pick Up",
    //       });

    //       shuttle.status = "Missed Pick Up";
    //     }
    //   this.buildTodaysApplications();
    //   this.filteredByShuttleStatus();
    //   }
    // },

    filteredByShuttleStatus() {
      if (this.selectedShuttleStatus === "All") {
        this.filteredShuttles = this.currentShuttles;
        // console.log("all", this.currentShuttles);
      } else {
        this.filterRentalsByChart(this.selectedShuttleStatus);
      }
    },

    filterRentalsByChart(selectedStatus) {
      this.selectedShuttleStatus = selectedStatus;

      if (selectedStatus === "Picked Up") {
        this.filteredShuttles = this.pickedUpShuttles;
        // console.log("pickedup", this.pickedUpShuttles);
      } else if (selectedStatus === "Pending") {
        this.filteredShuttles = this.pendingShuttles;
        // console.log("pending", this.pendingShuttles);
      } else if (selectedStatus === "Dropped Off") {
        this.filteredShuttles = this.droppedOffShuttles;
        // console.log("dropped off", this.droppedOffShuttles);
      } else if (selectedStatus === "Missed Pick Up") {
        this.filteredShuttles = this.MissedPickUpShuttles;
        // console.log("missed pick ups", this.MissedPickUpShuttles);
      } else {
        this.filteredShuttles = this.currentShuttles;
      }
    },

    filterBySearch() {
      const searchTerm = this.search.toLowerCase();

      const base =
        this.selectedShuttleStatus === "All"
          ? this.currentShuttles
          : this.filteredShuttles;

      if (this.search === "") {
        this.filteredByShuttleStatus();
        return;
      }

      this.filteredShuttles = base.filter((shuttle) => {
        const searchFilter = `
      ${shuttle.userFirstName}
      ${shuttle.userLastName}
      ${shuttle.userStudentNumber}
      ${shuttle.status}
      ${this.formatDate(shuttle.createdAt)}
      ${this.formatDate(shuttle.bookingTimeslot)}
      ${this.formatTime(shuttle.bookingTimeslot)}
      ${shuttle.pickupLocation}
      ${shuttle.dropoffLocation}
    `.toLowerCase();

        return searchFilter.includes(searchTerm);
      });
    },
    formatTime(date) {
      if (!date) return "-";

      const d = new Date(date);

      const formattedTime = d.toLocaleTimeString("en-ZA", {
        hour: "2-digit",
        minute: "2-digit",
      });

      return formattedTime;
    },
  },
  created() {
    this.findAllShuttles();
    this.findAllUsers()
  },
  // mounted() {
  //   const refresh = async () => {
  //     await this.findAllShuttles();
  //     this.interval = setTimeout(refresh, 5000);
  //   };
  //   refresh();
  // },
  // beforeUnmount() {
  //   clearTimeout(this.interval);
  // }
};
</script>

<style scoped></style>
