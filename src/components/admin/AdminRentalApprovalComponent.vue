<template>
  <q-card style="width: 650px;">
    <q-card-section class="row justify-center">
      <div class="text-h6">Approve Rental?</div>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <div class="q-mb-md"><b>Applicant Details</b></div>
      <ul>
        <li>First Name: {{ capitalizeFirstLetter(rental.userFirstName) }}</li>
        <li>Last Name: {{ capitalizeFirstLetter(rental.userLastName) }}</li>
        <li>Username: {{ rental.userUsername }}</li>
        <li>Phone: {{ rental.userPhone }}</li>
        <li>Email: {{ rental.userEmail }}</li>
      </ul>
    </q-card-section>

    <q-card-section>
      <div class="q-mb-md"><b>Rental Details</b></div>
      <ul>
        <li>
          <span>Application Date:</span> {{ formatDate(rental.applicationDate) }}
        </li>
        <li v-if="rental.rentalStartDate">
          Start Date: {{ formatDate(rental.rentalStartDate) }}
        </li>
        <li v-if="rental.rentalEndDate">
          End Date: {{ formatDate(rental.rentalEndDate) }}
        </li>
      </ul>
    </q-card-section>

    <q-card-section>
      <div class="q-mb-md"><b>Unit Details</b></div>
      <ul>
        <li>
          <span>Unit number:</span> {{ rental.unitNumber }}
        </li>
        <li>
          Unit Type: {{ rental.unitType }} unit
        </li>
        <li>
          Monthly Rent: R {{ rental.rentalPrice }}.00
        </li>
      </ul>
    </q-card-section>

    <!-- <q-card-section v-if="unitDetails.unitStatus !== 'Occupied'" >
      <div class="q-mb-md"><b>Set the rental period</b></div>
      <q-input v-model="rental.rentalStartDate" label="Rental Start Date" type="date" :min="minDate" />
      <q-input v-model="rental.rentalEndDate" label="Rental End Date" type="date" :min="rental.rentalStartDate || minDate" />
    </q-card-section> -->

    <q-card-section>
      <q-radio v-model="isApproved" :val="true" label="Approve" />
      <q-radio v-model="isApproved" :val="false" label="Not Approve" />
    </q-card-section>

    <q-card-section v-if="isApproved === false">
      <q-input filled label-color="black" color="brown" v-model="message" label="Message" type="textarea" stack-label required
        style="border: 2px solid white;">
      </q-input>
    </q-card-section>

    <q-card-section class="justify-between row">
      <CustomButton label="Close" color="white" text-color="black" @click="$emit('close')" customStyle="width: 45%" />
      <CustomButton v-if="isApproved === true" label="Approve" color="brown" text-color="white" @click="approveRental" customStyle="width: 45%" />
      <CustomButton v-if="isApproved === false" label="Not Approve" color="brown" text-color="white" @click="rejectRental" customStyle="width: 45%" />
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
