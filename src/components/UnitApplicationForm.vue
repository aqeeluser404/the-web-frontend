<template>
  <q-card style="width: 650px;">
    <q-card-section>
      <div class="text-h6">Application Form</div>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <div class="image-container">
        <q-img
          v-if="unit.images && unit.images.length > 0"
          :src="getImageUrl(unit.images[currentImageIndex].imageUrl)"
          class="q-mb-md product-image"
        />
        <button class="nav-button left" @click="prevImage">‹</button>
        <button class="nav-button right" @click="nextImage">›</button>
      </div>
    </q-card-section>

    <q-card-section class="wrap-text">
      <div v-if="unit.unitStatus !== 'Occupied'"><b>You are applying for the {{ unit.unitType }} unit.</b><br><br>{{ unit.unitDescription }}</div>
      <div v-else><b>This {{ unit.unitType }} unit is currently occupied.</b><br><br>{{ unit.unitDescription }}</div>
      <ul>
        <li v-if="unit.unitStatus !== 'Occupied'">Unit Availability: {{ unit.unitOccupants - unit.currentOccupants }} occupants</li>
        <li v-if="nextAvailabilityDate !== null">Next Available Date: {{ formatDate(nextAvailabilityDate) }}</li>
        <li>Monthly price per occupant: R <span style="text-decoration: underline;">{{ unit.unitPrice }}.00</span></li>
      </ul>
    </q-card-section>

    <q-card-section v-if="unit.unitStatus !== 'Occupied'">
      <div class="q-mb-sm"><b>Confirm your information</b></div>
      <ul>
        <li>First Name: {{ userDetails.firstName }}</li>
        <li>Last Name: {{ userDetails.lastName }}</li>
        <li>Phone Number: {{ userDetails.phone }}</li>
        <li>Email Address: {{ userDetails.email }}</li>
      </ul>
    </q-card-section>

    <q-card-section v-if="unit.unitStatus !== 'Occupied'">
      <div>
        <div v-if="userDetails.verification && userDetails.verification.isVerified === true">
          Your email has <span style="text-decoration: underline;">been verified</span>.
        </div>
        <div v-else>
          Your email has <span style="text-decoration: underline;">not been verified</span>.
        </div>
      </div>

      <div>
        <div v-if="userDetails.documents && userDetails.documents.length === 3">
          All your documents have been uploaded
        </div>
        <div v-else>
          You still have documents <span style="text-decoration: underline;">outstanding</span>.
        </div>
      </div>
      <!-- <div>Unit price per monthly installment: <b style="text-decoration: underline;">R {{ unit.unitPrice }}.00</b></div> -->
    </q-card-section>

    <q-card-section v-if="unit.unitStatus !== 'Occupied'" >
      <q-input v-model="rentalDetails.rentalStartDate" label="Rental Start Date" type="date" :min="minDate" />
      <q-input v-model="rentalDetails.rentalEndDate" label="Rental End Date" type="date" :min="rentalDetails.rentalStartDate || minDate" />
    </q-card-section>

    <q-card-section class="row justify-between">
      <CustomButton label="Close" color="white" text-color="black" @click="$emit('close')" customStyle="width: 45%" />
      <CustomButton label="Apply" v-if="unit.unitStatus !== 'Occupied'" color="brown" customStyle="width: 45%" @click="createRentalApplication(unit)" />
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
      currentImageIndex: 0,
      userDetails: {},
      rentalDetails: {
        user: "",
        unit: "",
        rentalStartDate: '',
        rentalEndDate: ''
      },
      nextAvailabilityDate: null,
      rentals: [],
      minDate: new Date().toISOString().split('T')[0]   // Today's date
    }
  },
  components: {
    CustomButton
  },
  methods: {
    getImageUrl: Helper.getImageUrl,
    formatDate: Helper.formatDate,
    nextImage() {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.unit.images.length;
    },
    prevImage() {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.unit.images.length) % this.unit.images.length;
    },

    async fetchUserDetails() {
      this.userDetails = await Helper.fetchUserDetails()

      this.nextAvailabilityDate = await this.nextAvailability()
      console.log(this.nextAvailabilityDate)
    },
    async createRentalApplication(unit) {
      this.rentalDetails.user = this.userDetails._id
      this.rentalDetails.unit = unit._id

      const userRentals = await RentalService.findMyRentals(this.userDetails._id)
      const activeOrPendingRentals = userRentals.filter(rental => ['Pending', 'Active'].includes(rental.status))
      if (activeOrPendingRentals.length > 0) {
        this.$q.notify({ type: 'negative', color: 'red', message: 'You have an active or pending rental application. Please complete it before creating a new one.'})
        return
      }

      if (this.userDetails.verification && this.userDetails.verification.isVerified === true) {
        if (this.userDetails.documents && this.userDetails.documents.length === 3) {
          const response = await RentalService.createRental(this.rentalDetails)
          if (response) {
            this.$q.notify({ type: 'positive', color: 'primary', message: 'Your application has been successfully submitted. Please check your application history to monitor the status of your application.' })
            this.$emit('close')
          }
        } else {
          this.$q.notify({ type: 'negative', color: 'red', message: 'Please ensure all required documentation is uploaded before proceeding with your application.' });
        }
      } else {
        this.$q.notify({ type: 'negative', color: 'red', message: 'Please verify your email before proceeding with your application.' });
      }

    },
    async nextAvailability() {

      if (this.unit.currentOccupants >= this.unit.unitOccupants) {      // Check if the unit's capacity is full

        const rentals = await RentalService.findAllRentals();           // Find all rentals

        // Filter rentals for the current unit with status "Pending" or "Active"
        const activeOrPendingRentals = rentals.filter(rental =>
          rental.unit === this.unit._id && ['Pending', 'Active'].includes(rental.status)
        );

        // Find the rental with the latest end date
        if (activeOrPendingRentals.length > 0) {
          const latestRental = activeOrPendingRentals.reduce((latest, rental) =>
            new Date(rental.rentalEndDate) > new Date(latest.rentalEndDate) ? rental : latest
          );

          // Return the next availability date as the end date of the latest rental
          return latestRental.rentalEndDate;
        } else {
          // If no active or pending rentals, return today's date as the next availability
          return new Date().toISOString().split('T')[0];
        }
      } else {
        // If the unit's capacity is not full, return null or a message indicating availability
        return null; // or you can return a specific message like "Unit is available"
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

.image-container
  position: relative
  display: flex
  justify-content: center
  align-items: center
  height: 450px

.nav-button
  position: absolute
  top: 50%
  transform: translateY(-50%)
  background: rgba(0, 0, 0, 0.5)
  color: white
  border: none
  padding: 10px
  cursor: pointer

.nav-button.left
  left: 10px


.nav-button.right
  right: 10px

</style>
