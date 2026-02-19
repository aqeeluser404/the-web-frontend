<template>
  <q-page>
    <div class="constrain-standard q-pt-md q-pb-md row justify-center">
      <!-- Driver Approval Card -->
      <q-card class="full-width" style="max-width: 989px" flat bordered>
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">Shuttle Applications for Today</div>
        </q-card-section>

        <q-card-section>
          <q-list
            v-if="Object.keys(groupedApplications).length > 0"
            bordered
            separator
          >
            <q-expansion-item
              v-for="(applications, time) in groupedApplications"
              :key="time"
              :label="time"
              icon="schedule"
              header-class="text-weight-medium text-center"
              expand-separator
            >
              <!-- user info -->
              <div
                v-for="shuttle in applications"
                :key="shuttle._id"
                class="row items-center justify-between q-pa-md"
              >
                <div>
                  <div class="text-weight-bold">
                    {{ capitalizeFirstLetter(shuttle.userFirstName) }}
                    {{ capitalizeFirstLetter(shuttle.userLastName) }}
                  </div>

                  <div class="text-grey-7 q-mt-xs">
                    Student No: {{ shuttle.userStudentNumber }}
                  </div>

                  <div class="text-grey-7">Unit: {{ shuttle.unitNumber }}</div>
                </div>

                <!-- buttons -->
                <div>
                  <q-btn
                    :label="
                      shuttle.status === 'Pending'
                        ? 'Picked Up'
                        : shuttle.status === 'Picked Up'
                          ? 'Dropped Off'
                          : ''
                    "
                    :color="
                      shuttle.status === 'Pending'
                        ? 'primary'
                        : shuttle.status === 'Picked Up'
                          ? 'secondary'
                          : 'grey'
                    "
                    unelevated
                    class="q-ml-md"
                    @click="approveShuttle(shuttle)"
                  />
                  <q-btn
                    label="Missed"
                    color="negative"
                    unelevated
                    class="q-ml-md"
                    @click="declineShuttle(shuttle)"
                  />
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

    <!-- Shuttle History -->
    <div class="constrain-standard row justify-center q-pb-md">
      <div class="col-md-9 col-12 full-height">
        <q-card flat bordered class="full-height">
          <!-- Heading -->
          <q-card-section class="row justify-between items-center">
            <div class="text-h6">Shuttle History</div>
            <q-btn
              @click=""
              class="custom-button"
              icon="eva-cloud-download-outline"
              flat
              rounded
            />
          </q-card-section>

          <!-- Filtering methods -->
          <q-card-section class="row justify-between">
            <q-input
              filled
              v-model="search"
              placeholder="Search"
              @update:model-value="filterBySearch"
              class="col-12 col-md-9"
            />
            <q-select
              v-model="selectedShuttleStatus"
              :options="shuttleStatus"
              label="Shuttle Status"
              @update:model-value="filteredByShuttleStatus"
              class="col-12 col-md-2"
            />
          </q-card-section>

          <!-- shuttle history table -->
          <!-- loop using the filteredShuttles -->
          <q-card-section v-if="filteredShuttles.length > 0">
            <q-table
              :rows="filteredShuttles"
              :columns="columns"
              row-key="_id"
              flat
              bordered
            >
              <!-- created date -->
              <template v-slot:body-cell-createdAt="props">
                <q-td :props="props" class="text-grey-8">
                  {{ formatDate(props.row.createdAt) }}
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
                  <q-badge
                    :color="
                      props.row.status === 'Pending'
                        ? 'orange'
                        : props.row.status === 'Picked Up'
                          ? 'primary'
                          : props.row.status === 'Dropped Off'
                            ? 'green'
                            : props.row.status === 'Missed Pick Up'
                              ? 'red'
                              : 'grey'
                    "
                    align="middle"
                    class="q-pa-xs q-px-sm"
                  >
                    {{ props.row.status }}
                  </q-badge>
                </q-td>
              </template>
            </q-table>
          </q-card-section>
          <q-card-section v-else class="row justify-center">
            <q-item>
              <q-item-section class="text-subtitle1"
                >No shuttle booking has been placed yet.</q-item-section
              >
            </q-item>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
// import * as XLSX from 'xlsx';
import ShutttleService from "src/services/ShuttleService";
import Helper from "src/services/utils";
import RentalService from "src/services/RentalService";
import CustomButton from "src/components/elements/CustomButton.vue";
import UserService from "src/services/UserService";
import UnitService from "src/services/UnitService";

export default {
  name: "AdminShuttleCard",

  data() {
    return {
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

      columns: [
        {
          name: "createdAt",
          label: "CreatedAt",
          field: "createdAt",
          align: "left",
        },
        {
          name: "bookingDate",
          label: "Date For",
          field: "bookingDate",
          align: "left",
        },
        {
          name: "bookingTimeslot",
          label: "Time Slot",
          field: "bookingTimeslot",
          align: "left",
        },
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
          name: "unitNumber",
          label: "Unit",
          field: "unitNumber",
          align: "left",
        },
        {
          name: "pickupLocation",
          label: "Pickup",
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
          name: "status",
          label: "Status",
          field: "status",
          align: "left",
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

    async findAllShuttles() {
      const response = await ShutttleService.findAllShuttles();
      console.log(response);

      this.shuttles = await Promise.all(
        response.map(async (shuttle) => {
          const user = await UserService.findUserById(shuttle.user);
          const rentals = await RentalService.findMyRentals(shuttle.user);

          const activeRental = rentals.find(
            (rental) => rental.status === "Active",
          );
          const occupiedUnit = activeRental
            ? await UnitService.findUnitById(activeRental.unit)
            : null;

          return {
            ...shuttle,
            userStudentNumber: user.studentInfo.studentNumber,
            userFirstName: user.firstName,
            userLastName: user.lastName,
            unitNumber: occupiedUnit ? occupiedUnit.unitNumber : null,
          };
        }),
      );

      this.buildTodaysApplications(); //get todays applications

      const filteredShuttles = this.shuttles.filter(
        (shuttle) =>
          shuttle.status === "Picked Up" ||
          shuttle.status === "Pending" ||
          shuttle.status === "Dropped Off" ||
          shuttle.status === "Missed Pick Up",
      );

      this.currentShuttles = filteredShuttles;
      this.pickedUpShuttles = filteredShuttles.filter(
        (shuttle) => shuttle.status === "Picked Up",
      );
      this.pendingShuttles = filteredShuttles.filter(
        (shuttle) => shuttle.status === "Pending",
      );
      this.droppedOffShuttles = filteredShuttles.filter(
        (shuttle) => shuttle.status === "Dropped Off",
      );
      this.MissedPickUpShuttles = filteredShuttles.filter(
        (shuttle) => shuttle.status === "Missed Pick Up",
      );

      this.filteredByShuttleStatus();
    },

    //get todays applications
    buildTodaysApplications() {
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];

      this.todaysApplications = this.shuttles.filter((shuttle) => {
        const shuttleDate = new Date(shuttle.bookingTimeslot)
          .toISOString()
          .split("T")[0];

        return (
          (shuttleDate === todayStr && shuttle.status === "Pending") ||
          shuttle.status === "Picked Up"
        );
      });

      this.todaysApplications.sort((a, b) => {
        //sort time from earlist
        return new Date(a.bookingTimeslot) - new Date(b.bookingTimeslot);
      });

      this.groupedApplications = this.todaysApplications.reduce(
        //group applicants ot the time slots
        (groups, shuttle) => {
          const timeKey = this.formatTime(shuttle.bookingTimeslot);

          if (!groups[timeKey]) {
            groups[timeKey] = [];
          }

          groups[timeKey].push(shuttle);

          return groups;
        },
        {},
      );
    },

    //approve shuttle
    async approveShuttle(shuttle) {
      try {
        let newStatus = "";

        if (shuttle.status === "Pending") {
          newStatus = "Picked Up";
        } else if (shuttle.status === "Picked Up") {
          newStatus = "Dropped Off";
        } else {
          return;
        }

        shuttle.status = newStatus;

        this.buildTodaysApplications();
        this.filteredByShuttleStatus();

        await ShutttleService.updateShuttle(shuttle._id, { status: newStatus });
      } catch (error) {
        console.error("Error approving shuttle:", error);
      }
    },

    // missed pickup
    async declineShuttle(shuttle) {
      try {
        let newStatus = "";

        if (shuttle.status === "Pending") {
          newStatus = "Missed Pick Up";
        } else {
          return;
        }

        shuttle.status = newStatus;

        this.buildTodaysApplications();
        this.filteredByShuttleStatus();

        await ShutttleService.updateShuttle(shuttle._id, {
          status: newStatus,
        });
      } catch {
        console.error("Error declining shuttle:", error);
      }
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
    //       await ShutttleService.updateShuttle(shuttle._id, {
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
        console.log("all", this.currentShuttles);
      } else {
        this.filterRentalsByChart(this.selectedShuttleStatus);
      }
    },

    filterRentalsByChart(selectedStatus) {
      this.selectedShuttleStatus = selectedStatus;

      if (selectedStatus === "Picked Up") {
        this.filteredShuttles = this.pickedUpShuttles;
        console.log("pickedup", this.pickedUpShuttles);
      } else if (selectedStatus === "Pending") {
        this.filteredShuttles = this.pendingShuttles;
        console.log("pending", this.pendingShuttles);
      } else if (selectedStatus === "Dropped Off") {
        this.filteredShuttles = this.droppedOffShuttles;
        console.log("dropped off", this.droppedOffShuttles);
      } else if (selectedStatus === "Missed Pick Up") {
        this.filteredShuttles = this.MissedPickUpShuttles;
        console.log("missed pick ups", this.MissedPickUpShuttles);
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
  },

  //   mounted() { //added this for refresh
  //     this.interval = setInterval(() => {
  //       this.findAllShuttles();
  //     },5000);
  //   },
  //   beforeUnmount() {
  //     clearInterval(this.interval);
  //   },
};
</script>

<style scoped></style>
