<template>
  <q-page class="bg-grey-3">
    <!-- Banner for rejected rentals -->
    <!-- <q-banner v-if="addPayerInformation && userDetails.studentInfo?.hasBursary === false"
      class="bg-black text-white full-width" @click="openAddPayer">
      <div class="row justify-center items-center q-pa-md" style="cursor: pointer;">
        <div class="text-center">
          <span>
            Your application has been submitted successfully. <br>Since no bursary is linked to your profile, it is
            mandatory to provide payer information to proceed with financial processing. Click here to complete this
            step.
          </span>
        </div>
      </div>
    </q-banner> -->

    <q-banner
      v-if="addPayerInformation"
      class="bg-black text-white full-width"
      @click="$router.push('/user/profile')"
    >
      <div
        class="row justify-center items-center q-pa-md"
        style="cursor: pointer"
      >
        <div class="text-center">
          <!-- <q-icon name="warning" class="q-mr-sm" size="24px" /> -->
          <span>
            Your room/bed selection for your application has been successfully
            completed. <br />
            Click this banner to navigate to your profile and ensure all your
            documents have been uploaded. <br />
            Upon successful completion of your document upload, an email will be
            sent to you with instructions to complete your online credit check
            application.
          </span>
        </div>
      </div>
    </q-banner>

    <div v-if="!loading" class="constrain-standard row justify-center q-py-md">
      <q-card class="col-md-12 col-12 soft-shadow-card">
        <q-card-section class="row stats-header justify-center">
          <div class="text-h6">Rental Information</div>
          <q-separator class="q-my-sm" style="width: 100%" />
        </q-card-section>

        <!-- <q-separator /> -->

        <q-card-section class="row text-left">
          <div>
            For
            <span style="text-decoration: underline">returning</span>
            applicants, you may only apply for one rental at a time. If you have
            an existing application thats ongoing, you will not be able to apply
            for another rental until the previous rental has ended. Please note
            that once your application has been approved, cancellation may not
            be possible as your booking will have been confirmed and the
            application process will have progressed significantly. You may
            cancel your application during the following phases:
          </div>
          <ul>
            <li>The Processing/Pending phase</li>
            <li>The Rejection phase</li>
          </ul>
          <div>
            If your application is rejected, you will be notified via email and
            site notifications. To avoid rejection, please ensure that you have
            provided all the necessary documents and information. Rejection may
            occur if
            <span style="text-decoration: underline"
              >incorrect or outdated documents</span
            >
            are provided, or if false information is submitted. In such cases,
            you will be required to cancel the rejected application and reapply
            by re-uploading the documents during the rejection phase.
            <br /><br />
            <span>
              Please note: documents can still be uploaded even if your
              application is pending or ongoing. Be sure to monitor your email
              and site notifications for any requests or updates regarding
              missing or required documents.
            </span>
          </div>
        </q-card-section>

        <q-separator />

        <q-card-section class="row justify-center">
          <div class="text-h6">Application History</div>
        </q-card-section>

        <q-card-section>
          <q-table
            flat
            bordered
            :rows="rentals"
            :columns="compactColumns"
            @row-click="viewRentalDetails"
            row-key="_id"
          >
            <template v-slot:body-cell-id="props">
              <q-td :props="props">
                <q-badge
                  color="text-primary"
                  align="middle"
                  class="q-pa-xs q-px-sm"
                >
                  {{ props.row._id }}
                </q-badge>
              </q-td>
            </template>

            <template v-slot:body-cell-applicationDate="props">
              <q-td :props="props">{{
                formatDate(props.row.applicationDate)
              }}</q-td>
            </template>

            <template v-slot:body-cell-unitType="props">
              <q-td :props="props">
                {{
                  props.row.selectedSubUnits?.bedType ||
                  props.row.selectedSubUnits?.roomType ||
                  "—"
                }}
              </q-td>
            </template>

            <template v-slot:body-cell-unitYear="props">
              <q-td :props="props" class="text-center">
                {{ props.row.unitYear }}
              </q-td>
            </template>

            <template v-slot:body-cell-renewed="props">
              <q-td :props="props" class="text-center">
                <q-badge
                  v-if="props.row.renewed === true"
                  color="teal"
                  class="q-pa-xs q-px-sm"
                >
                  <q-icon name="autorenew" size="xs" class="q-mr-xs" />
                  Renewed
                </q-badge>
                <span v-else class="">—</span>
              </q-td>
            </template>

            <template v-slot:body-cell-renewedTo="props">
              <q-td :props="props" class="text-center">
                <template
                  v-if="
                    props.row.renewalHistory &&
                    props.row.renewalHistory.length > 0
                  "
                >
                  <q-badge color="teal" class="q-pa-xs q-px-sm">
                    <q-icon name="autorenew" size="xs" class="q-mr-xs" />
                    {{
                      props.row.renewalHistory[
                        props.row.renewalHistory.length - 1
                      ].toYear
                    }}
                  </q-badge>
                </template>
                <span v-else class="">—</span>
              </q-td>
            </template>

            <template v-slot:body-cell-beforeScheduled="props">
              <q-td :props="props" class="text-center">
                <div
                  v-if="props.row.earlyEndDate"
                  style="text-decoration: underline"
                >
                  {{ formatDate(props.row.earlyEndDate) }}
                </div>
                <div v-else>N/A</div>
              </q-td>
            </template>

            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <q-badge
                  :color="
                    props.row.status === 'Active'
                      ? 'green'
                      : props.row.status === 'Pending'
                      ? 'orange'
                      : props.row.status === 'Rejected'
                      ? 'red'
                      : props.row.status === 'Ended'
                      ? 'grey'
                      : 'red'
                  "
                  class="q-pa-xs q-px-sm"
                >
                  {{ props.row.status }}
                </q-badge>
              </q-td>
            </template>
            <template v-slot:body-cell-actions="props">
              <q-td :props="props" class="text-center">
                <q-btn
                  round
                  flat
                  color="grey-8"
                  size="sm"
                  icon="more_horiz"
                  @click.stop
                >
                  <q-tooltip>Actions</q-tooltip>
                  <q-menu
                    anchor="bottom right"
                    self="top right"
                    :offset="[0, 10]"
                    class="modern-menu"
                    @before-show="onMenuOpen"
                    @before-hide="onMenuClose"
                  >
                    <div class="menu-card">
                      <!-- ===================== -->
                      <!-- APPLICATION DETAILS -->
                      <!-- ===================== -->
                      <div class="menu-section">
                        <div class="menu-section-title">Application</div>

                        <div class="menu-grid">
                          <div class="menu-item">
                            <div class="menu-icon bg-blue-1">
                              <q-icon name="tag" size="16px" color="blue-7" />
                            </div>
                            <div class="menu-item-body">
                              <div class="menu-item-value ellipsis">
                                {{ props.row.unitYear }}
                              </div>
                              <div class="menu-item-label">Applied For</div>
                            </div>
                          </div>

                          <div class="menu-item">
                            <div class="menu-icon bg-purple-1">
                              <q-icon
                                name="schedule"
                                size="16px"
                                color="purple-7"
                              />
                            </div>
                            <div class="menu-item-body">
                              <div class="menu-item-value">
                                {{ formatDate(props.row.applicationDate) }}
                              </div>
                              <div class="menu-item-label">
                                Application Date
                              </div>
                            </div>
                          </div>

                          <div class="menu-item">
                            <div class="menu-icon bg-teal-1">
                              <q-icon name="event" size="16px" color="teal-7" />
                            </div>
                            <div class="menu-item-body">
                              <div class="menu-item-value">
                                {{ formatDate(props.row.rentalStartDate) }}
                              </div>
                              <div class="menu-item-label">Start Date</div>
                            </div>
                          </div>

                          <div class="menu-item">
                            <div class="menu-icon bg-orange-1">
                              <q-icon
                                name="event_available"
                                size="16px"
                                color="orange-7"
                              />
                            </div>
                            <div class="menu-item-body">
                              <div class="menu-item-value">
                                {{ formatDate(props.row.rentalEndDate) }}
                              </div>
                              <div class="menu-item-label">End Date</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- ===================== -->
                      <!-- UNIT & PRICING -->
                      <!-- ===================== -->
                      <div class="menu-section">
                        <div class="menu-section-title">Unit & Pricing</div>

                        <div class="menu-grid">
                          <div class="menu-item">
                            <div class="menu-icon bg-green-1">
                              <q-icon name="home" size="16px" color="green-7" />
                            </div>
                            <div class="menu-item-body">
                              <div class="menu-item-value">
                                {{
                                  props.row.selectedSubUnits?.bedType ||
                                  props.row.selectedSubUnits?.roomType ||
                                  "N/A"
                                }}
                              </div>
                              <div class="menu-item-label">Room / Bed</div>
                            </div>
                          </div>

                          <div class="menu-item">
                            <div class="menu-icon bg-indigo-1">
                              <q-icon
                                name="payments"
                                size="16px"
                                color="indigo-7"
                              />
                            </div>
                            <div class="menu-item-body">
                              <div class="menu-item-value">
                                R
                                {{
                                  Number(
                                    props.row.selectedSubUnits?.price?.price ||
                                      0
                                  ).toFixed(2)
                                }}
                              </div>
                              <div class="menu-item-label">
                                Bed / Room Price
                              </div>
                            </div>
                          </div>

                          <div class="menu-item">
                            <div class="menu-icon bg-cyan-1">
                              <q-icon
                                name="credit_card"
                                size="16px"
                                color="cyan-7"
                              />
                            </div>
                            <div class="menu-item-body">
                              <div class="menu-item-value">
                                {{
                                  capitalizeFirstLetter(
                                    props.row.selectedSubUnits?.price?.name
                                  )
                                }}
                              </div>
                              <div class="menu-item-label">Payment Plan</div>
                            </div>
                          </div>

                          <div class="menu-item">
                            <div class="menu-icon bg-pink-1">
                              <q-icon
                                name="local_parking"
                                size="16px"
                                color="pink-7"
                              />
                            </div>
                            <div class="menu-item-body">
                              <div class="menu-item-value">
                                {{
                                  props.row.parking?.hasParking
                                    ? "R " +
                                      Number(props.row.parking.fee).toFixed(2)
                                    : "None"
                                }}
                              </div>
                              <div class="menu-item-label">Parking</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <!-- ===================== -->
                      <!-- RENEWAL HISTORY -->
                      <!-- ===================== -->
                      <div
                        v-if="
                          props.row.renewalHistory &&
                          props.row.renewalHistory.length > 0
                        "
                        class="menu-section"
                      >
                        <div
                          class="menu-section-title row items-center justify-between"
                        >
                          <span>Renewal History</span>
                          <q-badge
                            color="primary"
                            text-color="white"
                            class="q-px-sm"
                            style="font-size: 11px"
                          >
                            {{ props.row.renewalHistory.length }}
                          </q-badge>
                        </div>

                        <div class="renewal-timeline">
                          <div
                            v-for="(entry, index) in props.row.renewalHistory"
                            :key="index"
                            class="renewal-entry"
                          >
                            <div class="renewal-timeline-marker">
                              <div
                                class="renewal-dot"
                                :class="{
                                  'room-changed': entry.sameRoom === false,
                                }"
                              />
                              <div
                                v-if="
                                  index < props.row.renewalHistory.length - 1
                                "
                                class="renewal-line"
                              />
                            </div>

                            <div class="renewal-body">
                              <div class="row items-center q-gutter-xs">
                                <span class="renewal-year">
                                  {{ entry.fromYear }}
                                  <q-icon
                                    name="arrow_forward"
                                    size="12px"
                                    class="q-mx-xs text-grey-5"
                                  />
                                  {{ entry.toYear }}
                                </span>
                                <q-badge
                                  v-if="entry.sameRoom === false"
                                  color="orange-7"
                                  class="q-ml-sm renewal-badge"
                                >
                                  Room changed
                                </q-badge>
                              </div>

                              <div class="renewal-detail">
                                {{
                                  entry.fromSubUnit?.bedType ||
                                  entry.fromSubUnit?.roomType ||
                                  "?"
                                }}
                                <q-icon
                                  name="arrow_forward"
                                  size="11px"
                                  class="q-mx-xs text-grey-5"
                                />
                                {{
                                  entry.toSubUnit?.bedType ||
                                  entry.toSubUnit?.roomType ||
                                  "?"
                                }}
                              </div>
                            </div>
                          </div>

                          <div class="renewal-current">
                            <q-icon
                              name="check_circle"
                              size="14px"
                              color="positive"
                            />
                            <span>
                              Currently on <b>{{ props.row.unitNumber }}</b> ({{
                                props.row.unitYear
                              }})
                            </span>
                          </div>
                        </div>
                      </div>

                      <!-- ===================== -->
                      <!-- ACTIONS -->
                      <!-- ===================== -->
                      <div class="menu-section menu-actions">
                        <q-btn
                          flat
                          no-caps
                          align="left"
                          class="menu-action-btn"
                          :disable="props.row.status !== 'Pending'"
                          @click.stop="deleteRental(props.row)"
                        >
                          <q-icon
                            name="delete_outline"
                            size="18px"
                            class="q-mr-sm"
                          />
                          <span>Delete application</span>
                        </q-btn>

                        <q-btn
                          flat
                          no-caps
                          align="left"
                          class="menu-action-btn"
                          @click.stop="$router.push('/user/profile')"
                        >
                          <q-icon
                            name="cloud_upload"
                            size="18px"
                            class="q-mr-sm"
                          />
                          <span>Upload documents</span>
                        </q-btn>
                      </div>
                    </div>
                  </q-menu>
                </q-btn>
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>

    <q-inner-loading :showing="loading" color="primary" size="md" />

    <q-dialog v-model="requestDialog">
      <UserRequestComponent
        :rental="selectedRental"
        @close="handleDialogClose"
      />
    </q-dialog>
    <q-dialog v-model="addPayerDialog">
      <AddPayerComponent :rental="addPayerRental" @close="handleDialogClose" />
    </q-dialog>
  </q-page>
</template>

<script>
import Helper from "src/services/helper/utils";
import RentalService from "src/services/api/RentalService";
import UnitService from "src/services/api/UnitService";
import CustomButton from "src/components/elements/CustomButton.vue";
import UserRequestComponent from "src/components/user/UserRequestComponent.vue";
import AddPayerComponent from "src/components/user/AddPayerComponent.vue";

export default {
  data() {
    return {
      loading: true,
      rentals: [],
      userDetails: {
        studentInfo: {
          isRegisteredStudent: false, // Default value for boolean
          studentNumber: null, // Null for non-existent or undefined
          registeredInstitution: "", // Empty string works for text fields
          hasBursary: false,
        },
      },
      requestDialog: false,
      addPayerDialog: false,
      addPayerRental: null,
      selectedRental: null,

      compactColumns: [
        { name: "id", label: "Application ID", field: "_id", align: "left" },
        {
          name: "applicationDate",
          label: "Application Date",
          field: "applicationDate",
          align: "center",
        },
        {
          name: "unitType",
          label: "Unit Type",
          field: "selectedSubUnits",
          align: "center",
        },
        {
          name: "unitYear",
          label: "For Year",
          field: "unitYear",
          align: "center",
        },
        {
          name: "renewed",
          label: "Renewed",
          field: "renewed",
          align: "center",
        },
        {
          name: "renewedTo",
          label: "Renewed To",
          field: "renewedToUnit",
          align: "center",
        },
        {
          name: "beforeScheduled",
          label: "Before Scheduled End",
          field: "earlyEndDate",
          align: "center",
        },
        { name: "status", label: "Status", field: "status", align: "center" },
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
    UserRequestComponent,
    AddPayerComponent,
  },
  computed: {
    addPayerInformation() {
      // Find a rental where status is either 'Pending' or 'Approved' and payerData is not validated
      const rentalNeedingPayer = this.rentals.find(
        (rental) =>
          (rental.status === "Pending" || rental.status === "Active") &&
          rental.payerData.isValidated === false
      );
      this.addPayerRental = rentalNeedingPayer;
      return !!rentalNeedingPayer;
    },
    viewPayerInformation() {
      // Find the rental that requires payer information
      const rentalNeedingPayer = this.rentals.find(
        (rental) => rental.status === "Pending"
      );
      this.addPayerRental = rentalNeedingPayer; // Set the addPayerRental
      return !!rentalNeedingPayer; // Return true if such a rental exists
    },
  },
  methods: {
    formatDate: Helper.formatDate,
    capitalizeFirstLetter: Helper.capitalizeFirstLetter,

    onMenuOpen() {
      this._closeMenuOnScroll = (event) => {
        const menu = event.target.closest?.(".q-menu");
        if (menu) return;
        document.body.dispatchEvent(
          new MouseEvent("mousedown", { bubbles: true })
        );
      };
      window.addEventListener("scroll", this._closeMenuOnScroll, {
        capture: true,
        passive: true,
      });
    },

    onMenuClose() {
      if (this._closeMenuOnScroll) {
        window.removeEventListener("scroll", this._closeMenuOnScroll, {
          capture: true,
        });
        this._closeMenuOnScroll = null;
      }
    },

    copyToClipboard(text) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          this.$q.notify({
            type: "positive",
            color: "primary",
            message: "Access key copied to clipboard!",
          });
        })
        .catch((err) => {
          this.$q.notify({
            type: "negative",
            message: `Failed to copy text: ${err}`,
          });
        });
    },
    async findMyRentals() {
      this.loading = true;
      const response = await RentalService.findMyRentals(this.userDetails._id);

      this.rentals = await Promise.all(
        response.map(async (rental) => {
          try {
            const unit = await UnitService.getByIdUnit(rental.unit);
            return {
              ...rental,
              unitType: unit?.unitType || "Unknown",
              unitNumber: unit?.unitNumber || "N/A",
            };
          } catch (error) {
            return {
              ...rental,
              unitType: "Unknown",
              unitNumber: "N/A",
            };
          }
        })
      );
      this.loading = false;
    },
    async fetchUserDetails() {
      this.userDetails = await Helper.fetchUserDetails();
      this.findMyRentals();
    },
    async deleteRental(rental) {
      if (rental.status === "Pending" || rental.status === "Rejected") {
        this.$q
          .dialog({
            title: "Confirm",
            message:
              "You are about to delete this rental application, continue?",
            color: "primary",
            cancel: true,
            persistent: true,
          })
          .onOk(async () => {
            const response = await RentalService.deleteRental(rental._id);
            if (response) {
              this.$q.notify({
                type: "positive",
                color: "primary",
                message: "Delete successful!",
              });
              this.fetchUserDetails();
            } else {
              this.$q.notify({
                type: "negative",
                message: "Delete failed. Please try again.",
              });
            }
          })
          .onCancel(() => {
            // No need to fetch user details again on cancel
          });
      } else {
        this.$q.notify({
          type: "negative",
          message:
            "Deletion is restricted as this rental is tied to your rental History.",
        });
      }
    },
    openRequestUser(rental) {
      (this.selectedRental = rental), (this.requestDialog = true);
    },
    openAddPayer() {
      this.addPayerDialog = true;
    },
    handleDialogClose() {
      this.selectedRental = false;
      this.requestDialog = false;
      this.addPayerDialog = false;
      this.fetchUserDetails();
    },

    viewRentalDetails(evt, row) {
      const id = row._id;
      Helper.viewRentalDetails(id, this.$router);
    },
  },
  mounted() {
    this.fetchUserDetails();
  },
  beforeUnmount() {
    this.onMenuClose();
  },
};
</script>

<style scoped lang="scss">
.inline-btn {
  display: inline-flex;
  width: auto;
}

/* ============================ */
/* MENU SHELL                   */
/* ============================ */
.modern-menu :deep(.q-menu) {
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  overflow: hidden;
}

.menu-card {
  min-width: 420px;
  max-width: 480px;
  background: #fff;
}

.menu-section {
  padding: 16px 20px;
  border-bottom: 1px solid #f0f0f0;
}

.menu-section:last-child {
  border-bottom: none;
}

.menu-section-title {
  font-size: 11px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: #9e9e9e;
  margin-bottom: 12px;
}

/* ============================ */
/* MENU GRID                    */
/* ============================ */
.menu-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 16px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
}

.menu-icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-item-body {
  min-width: 0;
  flex: 1;
}

.menu-item-value {
  font-size: 13px;
  font-weight: 500;
  color: #212121;
  line-height: 1.3;
}

.menu-item-label {
  font-size: 10.5px;
  color: #9e9e9e;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-top: 2px;
}

/* ============================ */
/* ACTIONS                      */
/* ============================ */
.menu-actions {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 8px;
}

.menu-action-btn {
  justify-content: flex-start;
  text-transform: none;
  font-size: 13px;
  font-weight: 500;
  color: #424242;
  border-radius: 8px;
  padding: 8px 12px;
  min-height: 36px;
}

.menu-action-btn:hover {
  background: #f5f5f5;
}

.menu-action-btn.q-btn--disabled {
  color: #bdbdbd !important;
}

.menu-action-btn :deep(.q-btn__content) {
  justify-content: flex-start;
}

/* ============================ */
/* RENEWAL TIMELINE             */
/* ============================ */
.renewal-timeline {
  position: relative;
  padding-top: 4px;
}

.renewal-entry {
  display: flex;
  gap: 12px;
  position: relative;
  padding-bottom: 14px;
}

.renewal-timeline-marker {
  position: relative;
  flex: 0 0 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 3px;
}

.renewal-dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #26a69a;
  flex-shrink: 0;
  box-shadow: 0 0 0 3px rgba(38, 166, 154, 0.15);
}

.renewal-dot.room-changed {
  background: #fb8c00;
  box-shadow: 0 0 0 3px rgba(251, 140, 0, 0.15);
}

.renewal-line {
  flex: 1;
  width: 2px;
  background: #e8e8e8;
  margin-top: 4px;
  border-radius: 1px;
}

.renewal-body {
  flex: 1;
  min-width: 0;
}

.renewal-year {
  font-size: 13px;
  font-weight: 600;
  color: #212121;
}

.renewal-badge {
  font-size: 10px;
  padding: 3px 6px;
}

.renewal-detail {
  font-size: 12px;
  color: #616161;
  margin-top: 2px;
}

.renewal-current {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 6px;
  padding-top: 10px;
  border-top: 1px dashed #e8e8e8;
  font-size: 12px;
  color: #616161;
}

.renewal-current b {
  color: #212121;
}
</style>
