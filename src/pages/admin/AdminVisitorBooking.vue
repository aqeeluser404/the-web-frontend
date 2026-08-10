<template>
  <q-page class="bg-grey-3">

    <q-banner
      class="bg-black text-white full-width" @click="openAddPayer">
      <div class="row justify-center items-center q-pa-md" style="cursor: pointer;">
        <div class="text-center">
          <!-- <q-icon name="warning" class="q-mr-sm" size="24px" /> -->
          <span>
            Visiting hours are strictly observed from 09:00 AM to 21:30 PM
          </span>
        </div>
      </div>
    </q-banner>

    <div
      class="constrain-standard q-pt-md q-pb-md row justify-center"
      v-show="!loading"
    >
      <div class="col-md-9 col-12 full-height">

        <q-card class="soft-shadow-card full-height">
          <q-card-section class="bg-primary text-white">
            <div class="text-h6">
              Today
              {{
                new Date().toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })
              }}
            </div>
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
                  v-for="visitor in applications"
                  :key="visitor._id"
                  class="row items-center justify-between q-pa-md"
                >
                  <div>

                    <div class="text-subtitle1">
                      <span class="text-weight-bold">{{ capitalizeFirstLetter(visitor.firstName) }} {{ capitalizeFirstLetter(visitor.lastName) }}</span>
                      <span> is visiting currently </span>
                      <span class="text-weight-bold">{{ capitalizeFirstLetter(visitor.userFirstName) }} {{ capitalizeFirstLetter(visitor.userLastName) }}</span>
                    </div>

                    <br>

                    <!-- <div class="text-grey-7 q-mt-xs">
                      Student No: {{ visitor.userStudentNumber }}
                    </div> -->

                    <div class="text-grey-7 q-mt-xs">
                      Entry Timeslot: {{ new Date(visitor.entryTimeslot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) }}
                    </div>

                    <div class="text-grey-7" v-if="visitor.unitNumber">
                      Tenant Unit: {{ visitor.unitNumber }}
                    </div>
                    <div class="text-grey-7" v-else>Admin Access Account</div>
                  </div>

                  <!-- buttons -->
                  <div class="row justify-center items-center">
                    <CustomButton
                      :label="
                        visitor.status === 'Pending'
                          ? 'Visiting'
                          : visitor.status === 'Visiting'
                            ? 'Visiting'
                            : ''
                      "
                      :color="
                        visitor.status === 'Pending'
                          ? 'primary'
                          : visitor.status === 'Visiting'
                            ? 'secondary'
                            : 'grey'
                      "
                      unelevated
                      class=""
                      @click="approveVisitor(visitor)"
                      :customStyle="
                        visitor.status === 'Visiting'
                          ? 'width: 100%'
                          : 'width: 55%'
                      "
                    />
                    <CustomButton
                      v-if="visitor.status !== 'Visiting'"
                      label="Missed"
                      color="negative"
                      unelevated
                      class="q-ml-sm"
                      @click="declineVisitor(visitor)"
                      customStyle="width: 40%"
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
    </div>

    <!-- Visitor History -->
    <div
      class="constrain-standard q-pb-md row justify-center"
      v-show="!loading"
    >
      <div class="col-md-9 col-12 full-height">
        <q-card class="full-height soft-shadow-card">
          <!-- Heading -->
          <q-card-section class="row justify-between stats-header items-center">
            <div class="row justify-between items-center full-width">
              <div class="text-h6">Visitor History</div>
              <q-btn
                @click="downloadData()"
                class="custom-button"
                icon="eva-cloud-download-outline"
                flat
                rounded
              />
            </div>
            <q-separator class="q-my-sm" style="width: 100%" />
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
              v-model="selectedVisitorStatus"
              :options="visitorStatus"
              label="Visitor Status"
              @update:model-value="filteredByVisitorStatus"
              class="col-12 col-md-2"
            />
          </q-card-section>

          <!-- visitor history table -->
          <!-- loop using the filteredVisitors -->
          <q-card-section v-if="filteredVisitors.length > 0">
            <q-table
              :rows="filteredVisitors"
              :columns="columns"
              row-key="_id"
              flat
              bordered
            >
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
                    <q-badge
                      color="text-primary"
                      align="middle"
                      class="q-pa-xs q-px-sm"
                    >
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

              <template v-slot:body-cell-visitDate="props">
                <q-td :props="props">
                  {{ formatDate(props.row.bookingTimeslot) }}
                </q-td>
              </template>

              <template v-slot:body-cell-visitTime="props">
                <q-td :props="props">
                  {{ formatTime(props.row.bookingTimeslot) }}
                </q-td>
              </template>

              <template v-slot:body-cell-entryTimeslot="props">
                <q-td :props="props">
                  <div v-if="props.row.entryTimeslot">
                    {{ new Date(props.row.entryTimeslot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) }}
                  </div>
                  <div v-else>
                    N/A
                  </div>
                </q-td>
              </template>

              <template v-slot:body-cell-exitTimeslot="props">
                <q-td :props="props">
                  <div v-if="props.row.exitTimeslot">
                    {{ new Date(props.row.exitTimeslot).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) }}
                  </div>
                  <div v-else>
                    N/A
                  </div>
                </q-td>
              </template>

              <template v-slot:body-cell-unitNumber="props">
                <q-td :props="props">
                  <div v-if="props.row.unitNumber">
                    {{ props.row.unitNumber }}
                  </div>
                  <div v-else>N/A</div>
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
                        : props.row.status === 'Visiting'
                          ? 'primary'
                          : props.row.status === 'Completed'
                            ? 'green'
                            : props.row.status === 'Missed'
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

              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <CustomButton
                    flat
                    color="red"
                    text-color="red"
                    customStyle="width: 15%"
                    icon="eva-trash-outline"
                    @click="cancelBooking(props.row)"
                  />
                </q-td>
              </template>
            </q-table>
          </q-card-section>
          <q-card-section v-else class="row justify-center">
            <q-item>
              <q-item-section class="text-subtitle1"
                >No visitor booking has been placed yet.</q-item-section
              >
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
import * as XLSX from "xlsx";
import VisitorService from "src/services/api/VisitorService";
import Helper from "src/services/utils";
import RentalService from 'src/services/api/RentalService';
import CustomButton from "src/components/elements/CustomButton.vue";
import UserService from "src/services/api/UserService";
import UnitService from 'src/services/api/UnitService';

export default {
  name: "AdminVisitorCard",

  data() {
    return {
      loading: true,
      visitors: [],
      search: "",

      // Visitor applications for today
      todaysApplications: [],
      groupedApplications: {},

      filteredVisitors: [],
      currentVisitors: [],
      pendingVisitors: [],
      visitingVisitors: [],
      completedVisitors: [],
      missedVisitors: [],

      visitorStatus: ["All", "Pending", "Visiting", "Completed", "Missed"],

      selectedVisitorStatus: "All",
      showAllStatuses: true,

      users: [],
      filteredUsers: [],

      // userColumns: [
      //   {
      //     name: "index",
      //     label: "#",
      //     field: "index",
      //     align: "center",
      //   },
      //   {
      //     name: "firstName",
      //     label: "First Name",
      //     field: "firstName",
      //     align: "left",
      //   },
      //   {
      //     name: "lastName",
      //     label: "Last Name",
      //     field: "lastName",
      //     align: "left",
      //   },
      // ],

      columns: [
        {
          name: "index",
          label: "#",
          field: "index",
          align: "center",
        },
        {
          name: "id",
          label: "Visitor ID",
          field: "_id",
          align: "left",
        },
        {
          name: "visitorName",
          label: "Visitor",
          field: (row) =>
            `${row.firstName.charAt(0).toUpperCase() + row.firstName.slice(1)} ${
              row.lastName.charAt(0).toUpperCase() + row.lastName.slice(1)
            }`,
          align: "left",
        },
        {
          name: "tenantName",
          label: "Tenant",
          field: (row) =>
            `${row.userFirstName.charAt(0).toUpperCase() + row.userFirstName.slice(1)} ${
              row.userLastName.charAt(0).toUpperCase() + row.userLastName.slice(1)
            }`,
          align: "left",
        },
        // {
        //   name: "studentNumber",
        //   label: "Student No.",
        //   field: "userStudentNumber",
        //   align: "left",
        // },
        {
          name: "unitNumber",
          label: "Unit",
          field: "unitNumber",
          align: "center",
        },
        {
          name: "visitDate",
          label: "Visit Date",
          field: "bookingTimeslot",
          align: "left",
        },
        {
          name: "entryTimeslot",
          label: "Entry Timeslot",
          field: "entryTimeslot",
          align: "left"
        },
        {
          name: "exitTimeslot",
          label: "Exit Timeslot",
          field: "exitTimeslot",
          align: "left"
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
      this.$q
        .dialog({
          title: "Download Data",
          message:
            "You are about to export all visitor history data. Would you like to proceed?",
          color: "primary",
          cancel: true,
          persistent: true,
        })
        .onOk(() => {
          try {
            const today = new Date().toISOString().split("T")[0];

            const rows = this.filteredVisitors.map((visitor, index) => {
              const timeslot = new Date(visitor.bookingTimeslot);

              return {
                "Field No.": index + 1,
                "Created At": this.formatDate(visitor.createdAt),
                "Visit Date": timeslot.toISOString().split("T")[0],
                "Visit Time": timeslot.toTimeString().split(" ")[0],
                "First Name": visitor.firstName,
                "Last Name": visitor.lastName,
                "Phone Number": visitor.phoneNumber || "",
                "Vehicle Registration": visitor.vehicleRegistration || "",
                Status: visitor.status,
              };
            });

            const worksheet = XLSX.utils.json_to_sheet(rows);

            const workbook = XLSX.utils.book_new();
            XLSX.utils.book_append_sheet(workbook, worksheet, "VisitorHistory");

            XLSX.writeFile(workbook, `visitor_history_export_${today}.xlsx`);

            this.$q.notify({
              type: "positive",
              color: "primary",
              message: "Export successful!",
            });
          } catch (error) {
            this.$q.notify({
              type: "negative",
              message:
                "Export failed: " + (error.message || "Please try again"),
            });
          }
        });
    },
    async findAllVisitors() {
      this.loading = true;

      try {
        const response = await VisitorService.findAllVisitors();

        this.visitors = await Promise.all(
          response.map(async (visitor) => {
            const user = await UserService.findUserById(visitor.user);

            const rentals = await RentalService.findMyRentals(visitor.user);

            const activeRental = rentals.find(
              (rental) => rental.status === "Active",
            );

            return {
              ...visitor,
              userFirstName: user?.firstName || "",
              userLastName: user?.lastName || "",
              unitNumber: activeRental?.unitType || "Admin Access Account",
            };

            // const occupiedUnit = activeRental
            //   ? await UnitService.getByIdUnit(activeRental.unit)
            //   : null;

            // return {
            //   ...visitor,

            //   // userStudentNumber: user?.studentInfo?.studentNumber || "N/A",

            //   userFirstName: user?.firstName || "",
            //   userLastName: user?.lastName || "",

            //   unitNumber: occupiedUnit
            //     ? occupiedUnit.unitNumber
            //     : "Admin Access Account",
            // };
          }),
        );

        await this.buildTodaysApplications();

        const filteredVisitors = this.visitors.filter(
          (visitor) =>
            visitor.status === "Pending" ||
            visitor.status === "Visiting" ||
            visitor.status === "Completed" ||
            visitor.status === "Missed",
        );

        this.currentVisitors = filteredVisitors;

        this.pendingVisitors = filteredVisitors.filter(
          (visitor) => visitor.status === "Pending",
        );

        this.visitingVisitors = filteredVisitors.filter(
          (visitor) => visitor.status === "Visiting",
        );

        this.completedVisitors = filteredVisitors.filter(
          (visitor) => visitor.status === "Completed",
        );

        this.missedVisitors = filteredVisitors.filter(
          (visitor) => visitor.status === "Missed",
        );

        this.filteredByVisitorStatus();
      } catch (error) {
        console.error("Error loading visitors:", error);

        this.$q.notify({
          type: "negative",
          message: "Failed to load visitors",
        });
      } finally {
        this.loading = false;
      }
    },

    async findAllUsers() {
      const response = await UserService.findAllUsers();

      this.filteredUsers = response.filter(
        (user) => user.rightsType === "Tenant",
      );
    },

    //get todays applications
    async buildTodaysApplications() {
      const today = new Date();
      const todayStr = today.toISOString().split("T")[0];

      const updatedVisitors = await Promise.all(
        this.visitors.map(async (visitor) => {
          const visitorDateStr = new Date(visitor.bookingTimeslot)
            .toISOString()
            .split("T")[0];

          // If visitor date has passed and still Pending -> Missed
          if (visitorDateStr < todayStr && visitor.status === "Pending") {
            const newStatus = "Missed";

            try {
              await VisitorService.updateVisitor(visitor._id, {
                status: newStatus,
              });

              visitor.status = newStatus;
            } catch (err) {
              console.error("Failed to update visitor:", visitor._id, err);
            }
          }

          return visitor;
        }),
      );

      // Show today's Pending visitors + visitors currently inside
      this.todaysApplications = updatedVisitors.filter(
        (visitor) =>
          (new Date(visitor.bookingTimeslot).toISOString().split("T")[0] ===
            todayStr &&
            visitor.status === "Pending") ||
          visitor.status === "Visiting",
      );

      // Sort by visit time
      this.todaysApplications.sort(
        (a, b) => new Date(a.bookingTimeslot) - new Date(b.bookingTimeslot),
      );

      // Group by timeslot
      const groupedTimeslots = this.todaysApplications.reduce(
        (groups, visitor) => {
          const timeKey = this.formatTime(visitor.bookingTimeslot);

          if (!groups[timeKey]) {
            groups[timeKey] = [];
          }

          groups[timeKey].push(visitor);

          return groups;
        },
        {},
      );

      // Sort time groups
      this.groupedApplications = Object.keys(groupedTimeslots)
        .sort((a, b) => {
          const [hourA, minuteA] = a.split(":").map(Number);
          const [hourB, minuteB] = b.split(":").map(Number);

          return hourA * 60 + minuteA - (hourB * 60 + minuteB);
        })
        .reduce((sorted, key) => {
          sorted[key] = groupedTimeslots[key];
          return sorted;
        }, {});
    },

    // Approve visitor

async approveVisitor(visitor) {
  try {
    this.$q.dialog({
      title: "Confirm",
      message: "You are about to update the status of this visitor. Do you wish to continue?",
      color: "primary",
      cancel: true,
      persistent: true,
    }).onOk(async () => {
      let newStatus = "";

      if (visitor.status === "Pending") {
        newStatus = "Visiting";

        await VisitorService.updateVisitor(visitor._id, {
          status: newStatus,
          entryTimeslot: new Date(),
        });

      } else if (visitor.status === "Visiting") {
        newStatus = "Completed";

        await VisitorService.updateVisitor(visitor._id, {
          status: newStatus,
          exitTimeslot: new Date(),
        });

      } else {
        return;
      }

      visitor.status = newStatus;

      await this.buildTodaysApplications();
      this.filteredByVisitorStatus();

      this.$q.notify({
        type: "positive",
        color: "primary",
        message: "Status update successful!",
      });

      this.findAllVisitors();
    }).onCancel(() => {});
  } catch (error) {
    console.error("Error approving visitor:", error);
  }
},


    // Mark visitor as missed
async declineVisitor(visitor) {
  try {
    this.$q.dialog({
      title: "Confirm",
      message: "You are about to update the status of this visitor. Do you wish to continue?",
      color: "primary",
      cancel: true,
      persistent: true,
    }).onOk(async () => {
      if (visitor.status !== "Pending") return;

      const newStatus = "Missed";

      await VisitorService.updateVisitor(visitor._id, {
        status: newStatus,
        exitTimeslot: new Date(), // optional: record when they were marked missed
      });

      visitor.status = newStatus;

      await this.buildTodaysApplications();
      this.filteredByVisitorStatus();

      this.$q.notify({
        type: "positive",
        color: "primary",
        message: "Status update successful!",
      });

      this.findAllVisitors();
    }).onCancel(() => {});
  } catch (error) {
    console.error("Error declining visitor:", error);
  }
},

    async cancelBooking(row) {
      const visitorId = row._id;

      this.$q
        .dialog({
          title: "Confirm",
          message:
            "You are about to cancel this visitor booking. Do you wish to proceed?",
          color: "primary",
          cancel: true,
          persistent: true,
        })
        .onOk(async () => {
          try {
            await VisitorService.deleteVisitor(visitorId);

            this.$q.notify({
              type: "positive",
              color: "primary",
              message: "Visitor booking has been deleted.",
            });

            // Refresh data immediately after cancellation
            await this.buildTodaysApplications();
            this.filteredByVisitorStatus();
            this.findAllVisitors();
          } catch (error) {
            console.error(error);

            this.$q.notify({
              type: "negative",
              message: "Failed to cancel visitor booking.",
            });
          }
        })
        .onCancel(() => {});
    },

    filteredByVisitorStatus() {
      if (this.selectedVisitorStatus === "All") {
        this.filteredVisitors = this.currentVisitors;
      } else {
        this.filterVisitorsByStatus(this.selectedVisitorStatus);
      }
    },

    filterVisitorsByStatus(selectedStatus) {
      this.selectedVisitorStatus = selectedStatus;

      if (selectedStatus === "Visiting") {
        this.filteredVisitors = this.visitingVisitors;
      } else if (selectedStatus === "Pending") {
        this.filteredVisitors = this.pendingVisitors;
      } else if (selectedStatus === "Completed") {
        this.filteredVisitors = this.completedVisitors;
      } else if (selectedStatus === "Missed") {
        this.filteredVisitors = this.missedVisitors;
      } else {
        this.filteredVisitors = this.currentVisitors;
      }
    },

    filterBySearch() {
      const searchTerm = this.search.toLowerCase();

      const base =
        this.selectedVisitorStatus === "All"
          ? this.currentVisitors
          : this.filteredVisitors;

      if (this.search === "") {
        this.filteredByVisitorStatus();
        return;
      }

      this.filteredVisitors = base.filter((visitor) => {
        const searchFilter = `
      ${visitor.firstName}
      ${visitor.lastName}
      ${visitor.idNumber || ""}
      ${visitor.contactNumber || ""}
      ${visitor.status}
      ${this.formatDate(visitor.createdAt)}
      ${this.formatDate(visitor.bookingTimeslot)}
      ${this.formatTime(visitor.bookingTimeslot)}
    `.toLowerCase();

        return searchFilter.includes(searchTerm);
      });
    },
    formatTime(date) {
      if (!date) return "-";

      const d = new Date(date);

      const isMidnightUTC = d.getUTCHours() === 0 && d.getUTCMinutes() === 0;

      if (isMidnightUTC) {
        return "--";
      }

      return d.toLocaleTimeString("en-ZA", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
    },
  },
  created() {
    this.findAllVisitors();
    this.findAllUsers();
  },
  // mounted() {
  //   const refresh = async () => {
  //     await this.findAllVisitors();
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
