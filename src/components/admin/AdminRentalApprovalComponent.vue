<template>
  <q-card class="component-card">
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
        <li>Username: {{ rental.userUsername }}</li>
        <li>Phone: {{ rental.userPhone }}</li>
        <li>Email: {{ rental.userEmail }}</li>
      </ul>
    </q-card-section>

    <q-card-section>
      <div class="q-mb-md">
        <b>Credit Score Information </b><span v-if="rental.userHasBursary">(The applicant has a bursary)</span> <span
          v-if="!rental.userHasBursary">(The applicant does not have a bursary)</span>
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
          <span>Not scored yet.</span>
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
        <li>Shared Access Key: <span class="id-underlined">{{ rental.accessKey }}</span></li>
        <li>
          <span>Unit Number:</span> {{ rental.unitNumber }}
        </li>
        <li>
          Unit Price: R {{ Number(rental.unitPrice).toFixed(2) }}
        </li>
      </ul>
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
        <li v-if="rental.parking?.hasParking">
          Total Monthly Payment: R {{ Number(rental.rentalPrice).toFixed(2) }} (R {{ Number(rental.unitPrice).toFixed(2)
          }} + R {{ Number(rental.parking.fee).toFixed(2) }})
        </li>
        <li v-else>
          Total Monthly Payment: R {{ Number(rental.rentalPrice).toFixed(2) }}
        </li>
      </ul>
    </q-card-section>

    <q-card-section>
      <q-radio v-model="isApproved" :val="true" label="Approved" />
      <q-radio v-model="isApproved" :val="false" label="Declined" />
    </q-card-section>

    <q-card-section v-if="isApproved === false">
      <q-input label-color="black" v-model="message" label="Message" type="textarea" stack-label required
        style="border: 2px solid white;">
      </q-input>
    </q-card-section>

    <q-card-section class="justify-between row" v-if="isApproved !== null">
      <CustomButton v-if="isApproved === true" label="Approve" @click="approveRental" customStyle="width: 45%" />
      <CustomButton v-if="isApproved === false" label="Not Approve" @click="rejectRental" customStyle="width: 45%" />
      <CustomButton label="Close" color="white" text-color="black" @click="$emit('close')" customStyle="width: 45%" />
    </q-card-section>

    <q-card-section v-else>
      <CustomButton label="Close" color="white" text-color="black" @click="$emit('close')" customStyle="width: 100%" />
    </q-card-section>
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
      // message: `
      //   Dear ${this.rental.userFirstName} ${this.rental.userLastName},<br><br>
      //   We regret to inform you that your rental application has been rejected due to the following reasons:<br><br>
      //   - [Insert reason here]<br><br>
      //   Please review the documents and resubmit your application.<br><br>
      //   If you have any questions or need further assistance, please do not hesitate to contact us.<br><br>
      //   Best regards,<br>
      //   The Web Team`,
      message: '',
      minDate: new Date().toISOString().split('T')[0]   // Today's date
    }
  },
  methods: {
    formatDate: Helper.formatDate,
    capitalizeFirstLetter: Helper.capitalizeFirstLetter,

    async getUnitAvailability() {
      const response = await UnitService.getByIdUnit(this.rental.unit)
      this.unitDetails = response
    },

    async approveRental() {

      // const today = new Date();
      // const startDate = new Date(this.rentalDetails.rentalStartDate);
      // const endDate = new Date(this.rentalDetails.rentalEndDate);

      // // Check if start date is in the future
      // if (startDate <= today) {
      //   this.$q.notify({ type: 'negative', message: 'Rental start date must be in the future.' });
      //   return;
      // }

      // // Check if end date is after start date
      // if (endDate <= startDate) {
      //   this.$q.notify({ type: 'negative', message: 'Rental end date must be after the start date.' });
      //   return;
      // }

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

            // Send email to user
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

            // Send email to user
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
