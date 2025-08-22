<template>
  <q-card class="combined-unit-card">
    <div class="row">
      <div class="col-md-6 col-12 q-pa-md left-card" style="background-color: #f8f8f8;">
        <q-card-section class="">
          <div class="text-h6">Review and Validate Information</div>
        </q-card-section>

        <q-separator />

        <q-card-section>
          <div class="q-mb-md"><b>Applicant Information</b></div>
          <ul>
            <li>User/Tenant ID: <span class="id-underlined">{{ rental.userId }}</span></li>
            <li>First Name: {{ capitalizeFirstLetter(rental.userFirstName) }}</li>
            <li>Last Name: {{ capitalizeFirstLetter(rental.userLastName) }}</li>
            <li>Gender: {{ rental.userGender }}</li>
            <li v-if="rental.userAge">Age: {{ rental.userAge }}</li>
            <li class="text-negative" v-else>Age: {{ capitalizeFirstLetter(rental.userFirstName) }} has not specified
              their
              age yet</li>
            <li>Username: {{ rental.userUsername }}</li>
            <li>Phone: {{ rental.userPhone }}</li>
            <li>Email: {{ rental.userEmail }}</li>
          </ul>
        </q-card-section>

        <q-card-section>
          <div class="q-mb-md">
            <b>Credit Score Information </b><span v-if="rental.userHasBursary">(The applicant has a bursary)</span>
            <span v-if="!rental.userHasBursary">(The applicant does not have a bursary)</span>
          </div>
          <ul v-if="rental.userHasBursary">
            <li>The applicant has a bursary, so a credit score is not required.</li>
          </ul>
          <div v-else class="q-mb-md">
            <ul v-if="rental.payerData && Object.values(rental.payerData).some(value => value)">
              <li v-if="rental.payerData.score">Credit Information <span style="text-decoration: underline;">(Score:{{
                rental.payerData.score }}/80)</span></li>
              <li v-if="rental.payerData.firstName">First Name: {{ rental.payerData.firstName }}</li>
              <li v-if="rental.payerData.lastName">Last Name: {{ rental.payerData.lastName }}</li>
              <li v-if="rental.payerData.email">Email: {{ rental.payerData.email }}</li>
              <li v-if="rental.payerData.idNumber">ID Number: {{ rental.payerData.idNumber }}</li>
              <li v-if="rental.payerData.bankName">Bank Name: {{ rental.payerData.bankName }}</li>
              <li v-if="rental.payerData.salary">Salary: R {{ rental.payerData.salary }}</li>
            </ul>
            <div v-else>
              <ul>
                <li>Not scored yet</li>
              </ul>
            </div>
          </div>
        </q-card-section>

        <q-card-section>
          <div class="q-mb-md">
            <b>Parking Information</b><br>
          </div>
          <ul v-if="rental.parking?.hasParking">
            <li>Accounting for Parking Fees in Monthly Pricing (Fee: R{{ Number(rental.parking.fee).toFixed(2) }})</li>
          </ul>
          <ul v-else>
            <li>Parking Not Included</li>
          </ul>
        </q-card-section>

        <q-card-section>
          <div class="q-mb-md"><b>Unit Information</b></div>
          <ul>
            <li>Unit ID: <span class="id-underlined">{{ rental.unitId }}</span></li>
            <li v-if="rental.accessKey">
              This user is sharing this unit with family or acquaintances.
            </li>
            <li v-else>
              This user is not sharing this unit with family or acquaintances.
            </li>
            <li v-if="rental.accessKey">Shared Access Key: <span class="id-underlined">{{ rental.accessKey }}</span>
            </li>
            <li>Unit Number: {{ rental.unitNumber }}</li>
            <li v-if="rental?.selectedSubUnits && rental.selectedSubUnits.roomType">
              Room: {{ rental.selectedSubUnits.roomType }}
            </li>
            <li v-if="rental?.selectedSubUnits && rental.selectedSubUnits.bedType">
              Bed: {{ rental.selectedSubUnits.bedType }}
            </li>
            <li v-if="rental.selectedSubUnits?.price?.price">Unit Price: R {{
              Number(rental.selectedSubUnits?.price?.price).toFixed(2) }} over {{ rental.selectedSubUnits?.price?.name
              }}s</li>
            <li v-else>
              Unit Price: R {{ Number(rental.selectedSubUnits?.price).toFixed(2) }}
            </li>
          </ul>
        </q-card-section>
      </div>

      <div class="col-md-6 col-12 q-pa-md">
        <q-card-section class="row justify-end items-center q-py-none q-py-sm">
          <q-btn flat round icon="close" @click="$emit('close')" size="md" color="grey-10" aria-label="Close" />
        </q-card-section>

        <q-card-section>
          <div class="q-mb-md"><b>Rental Information</b></div>
          <ul>
            <li>Application ID: <span class="id-underlined">{{ rental._id }}</span></li>
            <li>
              <span>Application Date:</span> {{ formatDate(rental.applicationDate) }}
            </li>
            <li v-if="rental.rentalStartDate">
              Start Date: {{ formatDate(rental.rentalStartDate) }}
            </li>
            <li v-if="rental.rentalEndDate">
              End Date: {{ formatDate(rental.rentalEndDate) }}
            </li>
            <li v-if="rental.earlyEndDate">
              Early End Date: {{ formatDate(rental.earlyEndDate) }}
            </li>
            <li>
              <div v-if="rental.selectedSubUnits?.price?.name">Lease Duration: {{
                rental.selectedSubUnits?.price?.name }} Payment Plan</div>
              <div v-else>Lease Duration: Standard Payment Plan</div>
            </li>
            <li v-if="rental.parking?.hasParking">
              Total Monthly Payment: R {{ Number(rental.rentalPrice).toFixed(2) }} (R {{
                Number(rental.selectedSubUnits?.price?.price).toFixed(2) }} + R {{ Number(rental.parking.fee).toFixed(2)
              }})
            </li>
            <li v-else>
              Total Monthly Payment: R {{ Number(rental.rentalPrice).toFixed(2) }} (No Parking)
            </li>
          </ul>
        </q-card-section>

        <q-card-section>
          <div class="q-mb-md"><b>Verification Status</b></div>
          <div class="row q-mb-sm">
            <q-icon :name="userDetails?.verification?.isVerified ? 'check_circle' : 'error'"
              :color="userDetails?.verification?.isVerified ? 'positive' : 'negative'" size="20px" />
            <span class="q-ml-sm">
              Email {{ userDetails?.verification?.isVerified ? 'verified' : 'not verified' }}
            </span>
          </div>
          <div class="row q-mb-sm">
            <q-icon :name="hasAllRequiredDocuments ? 'check_circle' : 'error'"
              :color="hasAllRequiredDocuments ? 'positive' : 'negative'" size="20px" />
            <span class="q-ml-sm">
              Documents {{ hasAllRequiredDocuments ? 'complete' : 'incomplete' }}
            </span>
          </div>
          <div class="row q-mb-sm">
            <q-icon :name="userDetails.dateOfBirth ? 'check_circle' : 'error'"
              :color="userDetails.dateOfBirth ? 'positive' : 'negative'" size="20px" />
            <span class="q-ml-sm">Age {{ userDetails.dateOfBirth ? 'verified' : 'not verified' }}</span>
          </div>


        </q-card-section>

        <q-card-section>
          <q-radio v-model="isApproved" :val="null" label="Request More Info" />
          <q-radio v-model="isApproved" :val="true" label="Approved" />
          <q-radio v-model="isApproved" :val="false" label="Declined" />
        </q-card-section>

        <q-card-section v-if="isApproved === null">
          <q-input filled label-color="black" v-model="message" label="Message to Applicant" type="textarea" stack-label
            required style="border: 2px solid white;" />
        </q-card-section>

        <q-card-section v-if="isApproved === false">
          <q-input filled label-color="black" v-model="message" label="Message to Applicant" type="textarea" stack-label
            required style="border: 2px solid white;">
          </q-input>
        </q-card-section>

        <q-card-section class="justify-between row">
          <CustomButton v-if="isApproved === true" label="Approve" @click="approveRental" customStyle="width: 100%" />
          <CustomButton v-if="isApproved === false" label="Decline" @click="rejectRental" customStyle="width: 100%" />
          <CustomButton v-if="isApproved === null" label="Send Request" @click="requestMoreInfo"
            customStyle="width: 100%" :disable="true" />
        </q-card-section>
      </div>
    </div>
  </q-card>
</template>

<script>
import CustomButton from 'src/components/elements/CustomButton.vue'
import Helper from 'src/services/utils'
import RentalService from 'src/services/RentalService';
import UserService from 'src/services/UserService';
import EmailService from 'src/services/EmailService';
import UnitService from 'src/services/UnitService';

export default {
  name: 'AdminRentalApprovalComponent',
  components: { CustomButton },
  props: {
    rental: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      unitDetails: {},
      isApproved: null,
      userDetails: {},
      message: '',
      minDate: new Date().toISOString().split('T')[0]
    }
  },
  async created() {
    await this.getUnitAvailability();
    await this.fetchUserDetails();
  },
  computed: {
    hasAllRequiredDocuments() {
      const requiredTypes = [
        'registration',
        'proof_of_address',
        'id_or_passport',
        'bank_statements',
        'credit_check'
      ];

      const uploadedTypes = this.userDetails.documents?.map(doc => doc.docType) || [];

      return requiredTypes.every(type => uploadedTypes.includes(type));
    },
  },
  methods: {
    formatDate: Helper.formatDate,
    capitalizeFirstLetter: Helper.capitalizeFirstLetter,

    async fetchUserDetails() {
      try {
        const response = await UserService.findUserById(this.rental.userId);
        this.userDetails = response;
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: 'Failed to load user details.'
        });
      }
    },

    async getUnitAvailability() {
      const response = await UnitService.getByIdUnit(this.rental.unit)
      this.unitDetails = response
    },

    async requestMoreInfo() {
      if (!this.message) {
        this.$q.notify({ type: 'warning', message: 'Please enter a message before sending.' })
        return
      }
      this.$q.dialog({
        title: 'Confirm',
        message: `You are about to request more information from the applicant. Continue?`,
        color: 'primary',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        try {
          await EmailService.RequestMoreInfo(this.rental.userId, this.message)
          this.$q.notify({ type: 'info', color: 'primary', message: 'Request sent to applicant.' })
          this.$emit('close')
        } catch (error) {
          this.$q.notify({ type: 'negative', message: 'Failed to send request. Please try again.' })
        }
      })
    },

    setRentalDates(startDate, endDate) {
      this.rental.rentalStartDate = startDate;
    },

    async approveRental() {
      const approvedRental = {
        applicationDate: this.rental.applicationDate,
        status: "Active",
        rentalStartDate: this.rental.rentalStartDate,
        rentalEndDate: this.rental.rentalEndDate,
        rentalPrice: this.rental.rentalPrice,
        unit: this.rental.unit,
        unitType: this.rental.unitType,
        user: this.rental.user
      }
      if (this.isApproved === true) {
        this.$q.dialog({
          title: 'Confirm', message: `You are about to approve this rental and notify applicant, continue?`, color: 'primary', cancel: true, persistent: true
        }).onOk(async () => {
          const response = await RentalService.updateRental(this.rental._id, approvedRental)
          if (response) {
            this.$q.notify({ type: 'positive', color: 'primary', message: 'Rental Approved!' })
            await EmailService.ApprovedRental(this.rental.userId, this.rental.unit, this.rental._id)
            this.$emit('close')
          } else {
            this.$q.notify({ type: 'negative', message: 'Approve rental failed. Please try again.' })
          }
        }).onCancel(() => {
          return
        })
      } else {
        this.$q.notify({ type: 'negative', message: 'Approve rental failed. Please try again.' })
      }
    },

    async rejectRental() {
      const rejectedRental = {
        applicationDate: this.rental.applicationDate,
        status: "Rejected",
        rentalStartDate: null,
        rentalEndDate: null,
        rentalPrice: this.rental.rentalPrice,
        unit: this.rental.unit,
        unitType: this.rental.unitType,
        user: this.rental.user
      }
      if (this.isApproved === false && this.message) {
        this.$q.dialog({
          title: 'Confirm', message: `You are about to reject this rental and notify applicant, continue?`, color: 'primary', cancel: true, persistent: true
        }).onOk(async () => {
          console.log(this.rental._id, rejectedRental)
          const response = await RentalService.updateRental(this.rental._id, rejectedRental)
          if (response) {
            this.$q.notify({ type: 'positive', color: 'primary', message: 'Rental Rejected!' })
            await EmailService.RejectedRental(this.rental.userId, this.message)
            this.$emit('close')
          } else {
            this.$q.notify({ type: 'negative', message: 'Reject rental failed. Please try again.' })
          }
        }).onCancel(() => {
          return
        })
      } else {
        this.$q.notify({ type: 'negative', message: 'Reject rental failed. Please try again.' })
      }
    },
  }
}
</script>

<style lang="sass">
.left-card
  display: flex
  flex-direction: column
  height: 100%

.combined-unit-card
  width: 100%
  max-width: 100%
  padding: 16px

  @media (min-width: 601px)
    min-width: 1200px

  @media (max-width: 600px)
    min-width: unset
    padding: 8px
</style>
