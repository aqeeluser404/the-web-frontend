<template>
  <q-page class="bg-grey-3">
    <!-- Banner for rejected rentals -->
    <q-banner v-if="addPayerInformation && userDetails.studentInfo?.hasBursary === false"
      class="bg-black text-white full-width" @click="openAddPayer">
      <div class="row justify-center items-center q-pa-md" style="cursor: pointer;">
        <div class="text-center">
          <!-- <q-icon name="warning" class="q-mr-sm" size="24px" /> -->
          <span>
            Your application has been submitted successfully. <br>Since no bursary is linked to your profile, it is
            mandatory to provide payer information to proceed with financial processing. Click here to complete this
            step.
          </span>
        </div>
      </div>
    </q-banner>

    <div v-if="!loading" class="constrain-standard row justify-center q-py-md">
      <q-card class="col-md-12 col-12 soft-shadow-card">

        <q-card-section class="row stats-header justify-center">
          <div class="text-h6">Rental Information</div>
          <q-separator class="q-my-sm" style="width: 100%;" />
        </q-card-section>

        <!-- <q-separator /> -->

        <q-card-section class="row text-left">
          <div>
            For <span style="text-decoration: underline;">returning</span> applicants, you may only apply for one rental
            at a time. If you have an existing application thats ongoing, you will not be able to apply for another
            rental until the previous rental has ended.
            Please note that once your application has been approved, cancellation may not be possible as your booking
            will have been confirmed and the application process will have progressed significantly. You may cancel your
            application during the following phases:
          </div>
          <ul>
            <li>The Processing/Pending phase</li>
            <li>The Rejection phase</li>
          </ul>
          <div>
            If your application is rejected, you will be notified via email and site notifications. To avoid rejection,
            please ensure that you have provided all the necessary documents and information. Rejection may occur if
            <span style="text-decoration: underline;">incorrect or outdated documents</span> are provided, or if false
            information is submitted. In such cases, you will be required to cancel the rejected application and reapply
            by re-uploading the documents during the rejection phase.
            <br><br>
            <span>
              Please note: documents can still be uploaded even if your application is pending or ongoing. Be sure to
              monitor your email and site notifications for any requests or updates regarding missing or required
              documents.
            </span>

          </div>

        </q-card-section>

        <q-separator />

        <q-card-section class="row justify-center">
          <div class="text-h6">Application History</div>
        </q-card-section>

        <!-- <q-separator /> -->

        <!-- <q-card-section v-if="userDetails.rentals && userDetails.rentals.length > 0">
          <q-markup-table flat bordered>
            <thead>
              <tr>
                <th></th>
                <th class="text-left">Application Date</th>
                <th class="text-left">Application ID</th>
                <th class="text-left">Start Date</th>
                <th class="text-left">End Date</th>
                <th class="text-left">Parking</th>
                <th class="text-left">Bed/Room Price</th>
                <th class="text-left">Payment Plan</th>
                <th class="text-center">Unit Number</th>
                <th class="text-left">Status</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody v-for="(rental, index) in rentals" :key="rental._id">
              <tr @click="viewRentalDetails(rental._id)">
                <td class="text-left cursor-pointer">{{ index + 1 }}</td>
                <td class="text-left cursor-pointer">{{ formatDate(rental.applicationDate) }}</td>
                <td class="text-left cursor-pointer id">{{ rental._id }}</td>
                <td class="text-left cursor-pointer">
                  <div v-if="!defaultValues(rental)">
                    {{ formatDate(rental.rentalStartDate) }}
                  </div>
                  <div v-else>
                    Being processed...
                  </div>
                </td>
                <td class="text-left cursor-pointer">
                  <div v-if="!defaultValues(rental)">
                    {{ formatDate(rental.rentalEndDate) }}
                  </div>
                  <div v-else>
                    Being processed...
                  </div>
                </td>
                <td class="text-left cursor-pointer">
                  <div v-if="rental.parking?.hasParking">
                    R {{ Number(rental.parking?.fee).toFixed(2) }}
                  </div>
                  <div v-else>
                    No
                  </div>
                </td>
                <td class="text-left cursor-pointer">R {{ Number(rental.selectedSubUnits.price.price).toFixed(2) }} </td>
                <td class="text-left cursor-pointer">{{ capitalizeFirstLetter(rental.selectedSubUnits.price.name) }}</td>
                <td class="text-center cursor-pointer">{{ rental.unitNumber }} </td>
                <td class="text-left cursor-pointer text-uppercase" :class="{ 'pending-status': rental.status === 'Pending' },
                  { 'active-status': rental.status === 'Active' },
                  { 'rejected-status': rental.status === 'Rejected' },
                  { 'ended-status': rental.status === 'Ended' }">
                  {{ capitalizeFirstLetter(rental.status) }}
                </td>
                <td class="text-left cursor-pointer">
                  <CustomButton v-if="rental.status === 'Pending'" flat color="red" text-color="red"
                    customStyle="width: 15%" icon="eva-trash-outline" @click.stop="deleteRental(rental)" />
                  <CustomButton flat color="black" text-color="positive" customStyle="width: 15%"
                    icon="eva-cloud-upload-outline" to="/user/profile" />
                  <CustomButton
                    v-if="rental.payerData.isValidated && rental.status === 'Pending' && viewPayerInformation" flat
                    color="red" text-color="red" customStyle="width: 15%" icon="eva-edit-2-outline"
                    @click="openAddPayer" />
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card-section>

        <q-card-section v-else class="row justify-center">
          <q-item>
            <q-item-section class="text-subtitle1">You currently have no rental applications on file.</q-item-section>
          </q-item>
        </q-card-section> -->

        <q-card-section>
          <q-table
            flat bordered :rows="rentals" :columns="rentalColumns" @click="viewRentalDetails" row-key="_id"
          >
            <template v-slot:body-cell-index="props">
              <q-td :props="props">
                {{ props.rowIndex + 1 }}
              </q-td>
            </template>

            <template v-slot:body-cell-applicationDate="props">
              <q-td :props="props">
                <div>
                  {{ formatDate(props.row.applicationDate) }}
                </div>
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

            <template v-slot:body-cell-startDate="props">
              <q-td :props="props">
                <div v-if="defaultValues(props.row)">
                  Being Processed...
                </div>
                <div v-else>
                  {{ formatDate(props.row.rentalStartDate) }}
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-endDate="props">
              <q-td :props="props">
                <div v-if="defaultValues(props.row)">
                  Being Processed...
                </div>
                <div v-else>
                  {{ formatDate(props.row.rentalEndDate) }}
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-parking="props">
              <q-td :props="props">
                <div v-if="props.row.parking?.hasParking">
                  R {{ Number(props.row.parking?.fee).toFixed(2) }}
                </div>
                <div v-else>
                  No
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-unitPrice="props">
              <q-td :props="props">
                <div>
                  {{ Number(props.row.selectedSubUnits.price.price).toFixed(2) }}
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-paymentPlan="props">
              <q-td :props="props">
                <div>
                  {{ capitalizeFirstLetter(props.row.selectedSubUnits.price.name) }}
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-unitNumber="props">
              <q-td :props="props">
                <div>
                  {{ capitalizeFirstLetter(props.row.unitNumber) }}
                </div>
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
                  align="middle"
                  class="q-pa-xs q-px-sm"
                >
                  {{ props.row.status }}
                </q-badge>
              </q-td>
            </template>

            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <div class="row justify-center items-center q-gutter-sm no-wrap">
                  <CustomButton
                    :disable="props.row.status !== 'Pending'"
                    flat
                    color="red"
                    text-color="red"
                    class="inline-btn"
                    icon="eva-trash-outline"
                    @click.stop="deleteRental(props.row)"
                  />

                  <CustomButton
                    flat
                    color="black"
                    text-color="positive"
                    class="inline-btn"
                    icon="eva-cloud-upload-outline"
                    to="/user/profile"
                  />

                  <CustomButton
                    :disable="!( (props.row.status === 'Pending' || props.row.status === 'Active') && props.row.payerData.isValidated === false )"
                    flat
                    color="red"
                    text-color="red"
                    class="inline-btn"
                    icon="eva-edit-2-outline"
                    @click.stop="openAddPayer"
                  />
                </div>
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>

    <q-inner-loading :showing="loading" color="primary" size="md" />

    <q-dialog v-model="requestDialog">
      <UserRequestComponent :rental="selectedRental" @close="handleDialogClose" />
    </q-dialog>
    <q-dialog v-model="addPayerDialog">
      <AddPayerComponent :rental="addPayerRental" @close="handleDialogClose" />
    </q-dialog>
  </q-page>
</template>

<script>
import Helper from 'src/services/utils';
import RentalService from 'src/services/RentalService';
import UnitService from 'src/services/UnitService';
import CustomButton from 'src/components/elements/CustomButton.vue';
import UserRequestComponent from 'src/components/user/UserRequestComponent.vue';
import AddPayerComponent from 'src/components/user/AddPayerComponent.vue';

export default {
  data() {
    return {
      loading: true,
      rentals: [],
      userDetails: {
        studentInfo: {
          isRegisteredStudent: false, // Default value for boolean
          studentNumber: null,        // Null for non-existent or undefined
          registeredInstitution: '',  // Empty string works for text fields
          hasBursary: false
        }
      },
      requestDialog: false,
      addPayerDialog: false,
      addPayerRental: null,
      selectedRental: null,

      rentalColumns: [
        { name: "index", label: "#", field: "index", align: 'center' },
        { name: "applicationDate", label: "Application Date", field: "applicationDate", align: 'left' },
        { name: "id", label: "Application ID", field: "_id", align: 'left' },
        { name: "startDate", label: "Start Date", field: "rentalStartDate", align: 'left' },
        { name: "endDate", label: "End Date", field: "rentalEndDate", align: 'left' },
        { name: "parking", label: "Parking", field: "parking", align: 'left' },

        { name: "unitPrice", label: "Bed/Room Price", field: "selectedSubUnits", align: 'left' },
        { name: "paymentPlan", label: "Payment Plan", field: "selectedSubUnits", align: 'left' },
        { name: "unitNumber", label: "Unit Number", field: "unitNumber", align: 'center' },

        { name: "status", label: "Status", field: "status", align: 'center' },
        { name: "actions", label: "Actions", field: "actions", align: 'center' },
      ]
    }
  },
  components: {
    CustomButton,
    UserRequestComponent,
    AddPayerComponent
  },
  computed: {

    addPayerInformation() {
      // Find a rental where status is either 'Pending' or 'Approved' and payerData is not validated
      const rentalNeedingPayer = this.rentals.find(rental =>
        (rental.status === 'Pending' || rental.status === 'Active') &&
        rental.payerData.isValidated === false
      );
      this.addPayerRental = rentalNeedingPayer;
      return !!rentalNeedingPayer;
    },
    viewPayerInformation() {
      // Find the rental that requires payer information
      const rentalNeedingPayer = this.rentals.find(rental => rental.status === 'Pending');
      this.addPayerRental = rentalNeedingPayer; // Set the addPayerRental
      return !!rentalNeedingPayer; // Return true if such a rental exists
    }
  },
  methods: {
    formatDate: Helper.formatDate,
    capitalizeFirstLetter: Helper.capitalizeFirstLetter,

    // defaultValues(rental) {
    //   const toDateOnly = (dateStr) => (dateStr?.split('T')[0] || '');
    //   const today = new Date();
    //   const nextYear = today.getFullYear() + 1;
    //   const defaultStart = `${nextYear}-01-01`;
    //   const defaultEnd = `${nextYear}-12-31`;

    //   const start = toDateOnly(rental?.rentalStartDate);
    //   const end = toDateOnly(rental?.rentalEndDate);

    //   return start === defaultStart && end === defaultEnd;
    // },

    defaultValues(rental) {
      if (!rental?.rentalStartDate || !rental?.rentalEndDate) return false;

      if (rental?.status === "Active") {
        return false;
      }

      const toDateObj = (dateStr) => new Date(dateStr);

      const start = toDateObj(rental.rentalStartDate);
      const end = toDateObj(rental.rentalEndDate);

      // Default is always Feb 1 → Dec 15 (any year)
      const isDefaultStart =
        start.getMonth() === 1 && start.getDate() === 1;   // Feb = 1 (0-based index)
      const isDefaultEnd =
        end.getMonth() === 11 && end.getDate() === 15;     // Dec = 11 (0-based index)

      console.log("Row:", start.toISOString().split("T")[0], end.toISOString().split("T")[0],
                  "Default?", isDefaultStart && isDefaultEnd);

      return isDefaultStart && isDefaultEnd;
    },

    copyToClipboard(text) {
      navigator.clipboard.writeText(text)
        .then(() => {
          this.$q.notify({ type: 'positive', color: 'primary', message: 'Access key copied to clipboard!' });
        }).catch(err => {
          this.$q.notify({ type: 'negative', message: `Failed to copy text: ${err}` });
        })
    },
    async findMyRentals() {
      this.loading = true;
      const response = await RentalService.findMyRentals(this.userDetails._id);

      this.rentals = await Promise.all(response.map(async rental => {
        try {
          const unit = await UnitService.getByIdUnit(rental.unit);
          return {
            ...rental,
            unitType: unit?.unitType || 'Unknown',
            unitNumber: unit?.unitNumber || 'N/A',
          };
        } catch (error) {
          return {
            ...rental,
            unitType: 'Unknown',
            unitNumber: 'N/A',
          };
        }
      }));
      this.loading = false;
    },
    async fetchUserDetails() {
      this.userDetails = await Helper.fetchUserDetails()
      this.findMyRentals()
    },
    async deleteRental(rental) {
      if (rental.status === 'Pending' || rental.status === 'Rejected') {
        this.$q.dialog({
          title: 'Confirm',
          message: 'You are about to delete this rental application, continue?',
          color: 'primary',
          cancel: true,
          persistent: true
        }).onOk(async () => {
          const response = await RentalService.deleteRental(rental._id)
          if (response) {
            this.$q.notify({ type: 'positive', color: 'primary', message: 'Delete successful!' })
            this.fetchUserDetails()
          } else {
            this.$q.notify({ type: 'negative', message: 'Delete failed. Please try again.' })
          }
        }).onCancel(() => {
          // No need to fetch user details again on cancel
        })
      } else {
        this.$q.notify({ type: 'negative', message: 'Deletion is restricted as this rental is tied to your rental History.' })
      }
    },
    openRequestUser(rental) {
      this.selectedRental = rental,
        this.requestDialog = true
    },
    openAddPayer() {
      this.addPayerDialog = true
    },
    handleDialogClose() {
      this.selectedRental = false
      this.requestDialog = false
      this.addPayerDialog = false
      this.fetchUserDetails()
    },

    viewRentalDetails(evt, row) {
      const id = row._id
      Helper.viewRentalDetails(id, this.$router);
    },
  },
  mounted() {
    this.fetchUserDetails()
  }
}
</script>

<style>
.inline-btn {
  display: inline-flex; /* ensures they sit side by side */
  width: auto;          /* prevents full-width stretching */
}

</style>
