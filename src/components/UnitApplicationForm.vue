<template>
  <q-card style="max-width: 450px;">
    <q-card-section>
      <div class="text-h6">Application Form</div>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <q-img
        v-if="unit.images && unit.images.length > 0"
        :src="getImageUrl(unit.images[0].imageUrl)"
        class="q-mb-md"
      />
    </q-card-section>

    <q-card-section class="wrap-text">
      <div>
        You are applying for the <b>{{ unit.unitType }}</b> unit, which includes:
      </div>
      <ul>
        <li>{{ unit.bedrooms }} Bedroom(s)</li>
        <li>{{ unit.kitchens }} Kitchen(s)</li>
        <li>{{ unit.bathrooms }} Bathroom(s)</li>
        <li>{{ unit.parking }} Parking(s)</li>
        <li>{{ unit.lounges }} Lounge(s)</li>
      </ul>
    </q-card-section>

    <q-card-section>
      <div class="q-mb-sm"><b>Confirm your information</b></div>
      <ul>
        <li>First Name: {{ userDetails.firstName }}</li>
        <li>Last Name: {{ userDetails.lastName }}</li>
        <li>Phone Number: {{ userDetails.phone }}</li>
        <li>Email Address: {{ userDetails.email }}</li>
        <li v-if="userDetails.documents && userDetails.documents.length === 3">
          <b>Documentation <span class="text-green">UPLOADED</span></b>
        </li>
        <li v-else>
          <b>OUTSTANDING <span class="text-red">Documentation</span></b>
        </li>
      </ul>
    </q-card-section>

    <q-card-section>
      <div>Unit price <b>per monthly</b> installment: R {{ unit.unitPrice }}.00</div>
    </q-card-section>


    <q-card-section class="row justify-between">
      <CustomButton label="Close" color="white" text-color="black" @click="$emit('close')" customStyle="width: 45%" />
      <CustomButton label="Apply" customStyle="width: 45%" @click="createRentalApplication(unit)" />
    </q-card-section>
  </q-card>
</template>
<script>
import Helper from 'src/services/utils'
import CustomButton from './CustomButton.vue'
import RentalService from 'src/services/RentalService';

export default {
  name: 'UnitApplicationForm',
  props: {
    unit: {
      type: Object,
      required: true
    },
  },
  data() {
    return {
      userDetails: {},
      rentalDetails: { user: "", unit: ""}
    }
  },
  components: {
    CustomButton
  },
  methods: {
    getImageUrl: Helper.getImageUrl,

    async fetchUserDetails() {
      this.userDetails = await Helper.fetchUserDetails()
    },
    async createRentalApplication(unit) {
      this.rentalDetails.user = this.userDetails._id
      this.rentalDetails.unit = unit._id

      try {
        if (this.userDetails.documents && this.userDetails.documents.length === 3) {
          const response = await RentalService.createRental(rentalDetails)
          if (response) {
            this.$q.notify({ type: 'positive', color: 'primary', message: 'Your application has been successfully submitted. Please check your application history to monitor the status of your application.' })
          }
        } else {
          this.$q.notify({ type: 'negative', color: 'red', message: 'Please ensure all required documentation is uploaded before proceeding with your application.' });
        }
      } catch(error) {

      }
    }
  },

  created() {
    this.fetchUserDetails()
  }
}
</script>

<style lang="sass">
.wrap-text
  white-space: pre-wrap

</style>
