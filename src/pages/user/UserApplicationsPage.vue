<template>
  <q-page>
    <!-- Banner for rejected rentals -->
    <q-banner v-if="addPayerInformation" class="bg-brown text-white full-width" @click="openAddPayer">
      <div class="row justify-center items-center" style="cursor: pointer;">
        <div>
          <q-icon name="warning" class="q-mr-sm" size="32px" />
          <span>You have successfully created your application. Click here to add your payer information.</span>
        </div>
      </div>
    </q-banner>

    <div class="q-pa-md row justify-center">
      <q-card flat bordered class="col-md-9 col-12 q-ma-sm">

        <q-card-section class="row justify-center">
          <div class="text-h6">Rental Information</div>
        </q-card-section>

        <q-separator />

        <q-card-section class="row text-left">
          <div>
            For <span style="text-decoration: underline;">returning</span> applicants, you may only apply for one rental at a time. If you have an existing application thats ongoing, you will not be able to apply for another rental until the previous rental has ended.
            Please note that once your application has been approved, cancellation may not be possible as your booking will have been confirmed and the application process will have progressed significantly. You may cancel your application during the following phases:
          </div>
          <ul>
            <li>The Processing/Pending phase</li>
            <li>The Rejection phase</li>
          </ul>
          <div>
            If your application is rejected, you will be notified via email and site notifications. To avoid rejection, please ensure that you have provided all the necessary documents and information. Rejection may occur if <span style="text-decoration: underline;">incorrect or outdated documents</span> are provided, or if false information is submitted. In such cases, you will be required to cancel the rejected application and reapply by re-uploading the documents during the rejection phase.
          </div><br>

        </q-card-section>

        <q-separator />

        <q-card-section class="row justify-center">
          <div class="text-h6">Application History</div>
        </q-card-section>

        <!-- <q-separator /> -->

        <q-card-section v-if="userDetails.rentals && userDetails.rentals.length > 0">
          <q-markup-table flat bordered>
            <thead>
              <tr>
                <th></th>
                <th class="text-left">Application Date</th>
                <!-- <th class="text-left">Application ID</th> -->
                <th class="text-left">Access Key</th>
                <th class="text-left">Start Date</th>
                <th class="text-left">End Date</th>
                <th class="text-left">Before Scheduled</th>
                <th class="text-left">Rental Price</th>
                <th class="text-left">Unit Number</th>
                <th class="text-left">Unit Type</th>
                <th class="text-left">Status</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody v-for="(rental, index) in rentals" :key="rental._id">
              <tr>
                <td class="text-left cursor-pointer">{{ index + 1 }}</td>
                <td class="text-left cursor-pointer">{{ formatDate(rental.applicationDate) }}</td>
                <!-- <td class="text-left cursor-pointer">{{ rental._id }}</td> -->
                <td class="text-left cursor-pointer">
                  <div v-if="rental.accessKey" @click="copyToClipboard(rental.accessKey)" style="text-transform: uppercase; cursor: pointer; color: brown;">
                    <b>{{ rental.accessKey }}</b>
                  </div>
                  <div v-else>
                    N/A
                  </div>
                </td>
                <td class="text-left cursor-pointer">
                  <div v-if="rental.rentalStartDate !== null">
                    {{ formatDate(rental.rentalStartDate) }}
                  </div>
                  <div v-else>
                    Being processed...
                  </div>
                </td>
                <td class="text-left cursor-pointer">
                  <div v-if="rental.rentalEndDate !== null">
                    {{ formatDate(rental.rentalEndDate) }}
                  </div>
                  <div v-else>
                    Being processed...
                  </div>
                </td>
                <td class="text-left cursor-pointer">
                  <div v-if="rental.earlyEndDate !== null" style="text-decoration: underline;">
                    {{ formatDate(rental.earlyEndDate) }}
                  </div>
                  <div v-else>
                    N/A
                  </div>
                </td>
                <td class="text-left cursor-pointer">R {{ rental.rentalPrice }}</td>
                <td class="text-left cursor-pointer">{{ rental.unitNumber }}</td>
                <td class="text-left cursor-pointer">{{ capitalizeFirstLetter(rental.unitType) }}</td>
                <td class="text-left cursor-pointer text-uppercase" :class="{ 'active-status': rental.status === 'Active'}, { 'ended-status': rental.status === 'Ended'}" style=""><b>{{ capitalizeFirstLetter(rental.status) }}</b></td>
                <td class="text-left cursor-pointer">
                  <CustomButton flat color="red" text-color="red" customStyle="width: 15%" icon="eva-trash-outline" @click.stop="deleteRental(rental)" />
                  <CustomButton v-if="rental.payerData.isValidated && rental.status === 'Pending' && viewPayerInformation" flat color="green" text-color="green" customStyle="width: 15%" icon="eva-bar-chart-outline" @click="openAddPayer" />
                  <!-- <CustomButton v-if="rental.status === 'Active'" flat color="brown" text-color="green" customStyle="width: 15%" icon="eva-email-outline" @click.stop="openRequestUser(rental)" /> -->
                </td>
                <!-- <td class="text-left cursor-pointer" v-else>
                  N/A
                </td> -->
              </tr>
            </tbody>
          </q-markup-table>
        </q-card-section>

        <q-card-section v-else class="row justify-center">
          <q-item>
            <q-item-section class="text-subtitle1">You currently have no rental applications on file.</q-item-section>
          </q-item>
        </q-card-section>
      </q-card>
    </div>
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
      rentals: [],
      userDetails: {},
      requestDialog: false,
      addPayerDialog: false,
      addPayerRental: null,
      selectedRental: null
    }
  },
  components: {
    CustomButton,
    UserRequestComponent,
    AddPayerComponent
  },
  computed: {
    addPayerInformation() {
      // Find the rental that requires payer information
      const rentalNeedingPayer = this.rentals.find(rental => rental.status === 'Pending' && rental.payerData.isValidated === false);
      this.addPayerRental = rentalNeedingPayer; // Set the addPayerRental
      return !!rentalNeedingPayer; // Return true if such a rental exists
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
    copyToClipboard(text) {
      navigator.clipboard.writeText(text)
        .then(() => {
          this.$q.notify({ type: 'positive', color: 'primary', message: 'Access key copied to clipboard!' });
        }).catch(err => {
          this.$q.notify({ type: 'negative', message: `Failed to copy text: ${err}` });
        })
    },
    async findMyRentals() {
      const response = await RentalService.findMyRentals(this.userDetails._id)
      this.rentals = await Promise.all(response.map(async rental => {
        const unit = await UnitService.getByIdUnit(rental.unit)
        return {
          ...rental,
          unitType: unit.unitType,
          unitNumber: unit.unitNumber
        }
      }))
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
  },
  mounted() {
    this.fetchUserDetails()
  }
}
</script>
