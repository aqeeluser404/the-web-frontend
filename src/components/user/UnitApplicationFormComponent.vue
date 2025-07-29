<template>
  <q-card class="component-card">

    <q-card-section>
      <div class="text-h6">Application Form</div>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <div class="image-container">
        <q-img
          v-if="unit.images && unit.images.length > 0"
          :src="getImageUrl(unit.images[currentImageIndex].imageUrl)"
          class="q-mb-md product-image cursor-zoom-in"
          :ratio="1"
          @click="showImageDialog = true"
        />
        <q-btn round flat dense class="nav-button left" icon="chevron_left" @click="prevImage" />
        <q-btn round flat dense class="nav-button right" icon="chevron_right" @click="nextImage" />
      </div>
    </q-card-section>
    <q-dialog v-model="showImageDialog" @show="logImageInfo">
      <q-card flat borderless class="image-dialog-card">

        <q-btn icon="close" flat round dense v-close-popup class="close-button" />

        <q-card-section class="dialog-image-section row justify-center flex-center">
          <img
            v-if="currentDialogImageUrl"
            :src="currentDialogImageUrl"
            class="enlarged-image"
            style="object-fit: contain"
          />
          <q-btn round flat dense class="dialog-nav left" icon="chevron_left" @click="prevImage" />
          <q-btn round flat dense class="dialog-nav right" icon="chevron_right" @click="nextImage" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-card-section class="wrap-text">
      <div v-if="unit.unitStatus !== 'Occupied'"><b>You are applying for the {{ unit.unitType }} unit.</b><br><br>{{ unit.unitDescription }}</div>
      <div v-else><b>This {{ unit.unitType }} unit is currently occupied.</b><br><br>{{ unit.unitDescription }}</div>
      <ul>
        <li v-if="unit.unitStatus !== 'Occupied'">Unit Availability: {{ unit.unitOccupants - unit.currentOccupants }} spots remaining.</li>
        <li v-if="nextAvailabilityDate !== null">Next Available Date: {{ formatDate(nextAvailabilityDate) }}</li>
        <li>Monthly price per occupant: R <span style="text-decoration: underline;">{{ Number(unit.unitPrice).toFixed(2) }}</span></li>
        <li>Gender Assignment:
          <span v-if="unit.genderAssignment">This unit is currently assigned to <span style="text-decoration: underline;">{{ unit.genderAssignment.toLowerCase() }} occupants.</span></span>
          <span v-if="!unit.genderAssignment && !unit.accessKey.isShared">This unit is currently <span style="text-decoration: underline;">unassigned.</span></span>
          <span v-if="unit.accessKey.isShared">This unit requires an <span style="text-decoration: underline;">access key.</span></span>
        </li>
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

    <q-card-section v-if="!unit.accessKey.isShared && !unit.genderAssignment">
      <div class="q-mb-sm"><b>Generate Shared Access Key</b></div>
      <q-radio v-model="rentalDetails.accessKeyIsTrue" :val="true" label="Yes" />
      <q-radio v-model="rentalDetails.accessKeyIsTrue" :val="false" label="No" />
    </q-card-section>

    <q-card-section v-if="unit.accessKey.isShared">
      <div class="q-mb-sm"><b>Provide Shared Access Key</b></div>
      <q-input v-model="rentalDetails.accessKey" @input="setAccessKeyTrue" label="*" required style="border: 2px solid white;" />
    </q-card-section>

    <q-card-section v-if="unit.unitStatus !== 'Occupied'">
      <div class="q-mb-sm"><b>Would you like to add parking to your application?</b></div>
      <q-radio
        v-model="rentalDetails.parking.hasParking"
        :val="true"
        :label="`Include Parking (R ${rentalDetails.parking.fee.toFixed(2)} added to monthly payment)`"
      />
      <br>
      <q-radio
        v-model="rentalDetails.parking.hasParking"
        :val="false"
        label="I don't need parking"
      />
    </q-card-section>

    <q-card-section>
      <div class="q-mb-sm"><b>Digital Signature</b></div>
      <p>Please sign below to confirm your application:</p>
      <SignaturePad @save="handleSignatureSave" />
    </q-card-section>

    <q-card-section v-if="unit.unitStatus !== 'Occupied'" >
      <div class="q-mb-sm"><b>Please select your preferred lease dates at your earliest convenience.</b></div>
      <q-input v-model="rentalDetails.rentalStartDate" label="Rental Start Date" type="date" :min="minDate" />
      <q-input v-model="rentalDetails.rentalEndDate" label="Rental End Date" type="date" :min="rentalDetails.rentalStartDate || minDate" />
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

    <q-card-section class="row justify-between">
      <CustomButton label="Apply" v-if="unit.unitStatus !== 'Occupied'" customStyle="width: 45%" @click="createRentalApplication(unit)" />
      <CustomButton label="Close" color="white" text-color="black" @click="$emit('close')" customStyle="width: 45%" />
    </q-card-section>
  </q-card>
</template>


<script>
import Helper from 'src/services/utils'
import CustomButton from 'src/components/elements/CustomButton.vue'
import RentalService from 'src/services/RentalService';
import SignaturePad from '../elements/SignaturePad.vue';

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
        rentalEndDate: '',
        accessKeyIsTrue: null,
        accessKey: '',
        parking: {
          hasParking: false,
          fee: 750.0
        }
      },

      signatureData: null,
      nextAvailabilityDate: null,
      rentals: [],
      minDate: new Date().toISOString().split('T')[0],   // Today's date
      showImageDialog: false
    }
  },
  components: {
    CustomButton, SignaturePad
  },
  computed: {
    currentDialogImageUrl() {
      if (!this.unit.images || !this.unit.images.length) return null;
      const image = this.unit.images[this.currentImageIndex];
      if (!image || !image.imageUrl) return null;

      const url = this.getImageUrl(image.imageUrl);
      return url.startsWith('http') ? url : `${window.location.origin}${url}`;
    }
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
    },
    // async createRentalApplication(unit) {

    //   // validation code
    //   if (this.rentalDetails.rentalStartDate === '' || this.rentalDetails.rentalEndDate === '' ) {
    //     this.$q.notify({ type: 'negative', color: 'red', message: 'Please specify your desired start and end dates.'})
    //     return
    //   }
    //   this.rentalDetails.user = this.userDetails._id
    //   this.rentalDetails.unit = unit._id

    //   const userRentals = await RentalService.findMyRentals(this.userDetails._id)
    //   const activeOrPendingRentals = userRentals.filter(rental => ['Pending', 'Active'].includes(rental.status))
    //   if (activeOrPendingRentals.length > 0) {
    //     this.$q.notify({ type: 'negative', color: 'red', message: 'You have an active or pending rental application. Please complete it before creating a new one.'})
    //     return
    //   }
    //   // check if user specified their gender
    //   if (!this.userDetails.gender) {
    //     this.$q.notify({ type: 'negative', color: 'red', message: 'Please ensure you have specified your gender before submitting your application.' })
    //     return
    //   }
    //   // check if gender matches
    //   if (!unit.genderAssignment) {
    //     unit.genderAssignment = this.userDetails.gender;
    //   } else if (unit.genderAssignment !== this.userDetails.gender) {
    //     this.$q.notify({ type: 'negative', color: 'red', message: `This unit is only available for ${unit.genderAssignment}s.` })
    //     return
    //   }

    //   if (this.userDetails.verification && this.userDetails.verification.isVerified === true) {
    //     if (this.userDetails.documents && this.userDetails.documents.length === 3) {
    //       const response = await RentalService.createRental(this.rentalDetails)
    //       if (response) {
    //         this.$q.notify({ type: 'positive', color: 'primary', message: 'Your application has been successfully submitted. Please check your application history to monitor the status of your application.' })
    //         this.$emit('close')
    //       }
    //     } else {
    //       this.$q.notify({ type: 'negative', color: 'red', message: 'Please ensure all required documentation is uploaded before proceeding with your application.' });
    //     }
    //   } else {
    //     this.$q.notify({ type: 'negative', color: 'red', message: 'Please verify your email before proceeding with your application.' });
    //   }

    // },
    setAccessKeyTrue() {
      this.rentalDetails.accessKeyIsTrue = true;
    },

    handleSignatureSave(signature) {
      this.signatureData = signature;
    },

    base64ToFile(dataUrl, filename) {
      const arr = dataUrl.split(',');
      const mime = arr[0].match(/:(.*?);/)[1];
      const bstr = atob(arr[1]);
      let n = bstr.length;
      const u8arr = new Uint8Array(n);
      while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
      }
      return new File([u8arr], filename, { type: mime });
    },

    async createRentalApplication(unit) {

      // Validation code
      if (this.rentalDetails.rentalStartDate === '' || this.rentalDetails.rentalEndDate === '') {
        this.$q.notify({ type: 'negative', color: 'red', message: 'Please specify your desired start and end dates.' });
        return;
      }

      this.rentalDetails.user = this.userDetails._id;
      this.rentalDetails.unit = unit._id;

      const userRentals = await RentalService.findMyRentals(this.userDetails._id);
      const activeOrPendingRentals = userRentals.filter(rental => ['Pending', 'Active'].includes(rental.status));
      if (activeOrPendingRentals.length > 0) {
        this.$q.notify({ type: 'negative', color: 'red', message: 'You have an active or pending rental application. Please complete it before creating a new one.' });
        return;
      }

      // Check if user specified their gender
      if (!this.userDetails.gender) {
        this.$q.notify({ type: 'negative', color: 'red', message: 'Please ensure you have specified your gender before submitting your application.' });
        return;
      }

      if (typeof this.userDetails.studentInfo?.hasBursary !== 'boolean') {
        this.$q.notify({
          type: 'negative',
          color: 'red',
          message: 'Please indicate whether you have a bursary to proceed.'
        });
        return;
      }

      // Check if gender matches
      if (!unit.genderAssignment) {
        unit.genderAssignment = this.userDetails.gender;
      } else if (unit.genderAssignment !== this.userDetails.gender) {
        this.$q.notify({ type: 'negative', color: 'red', message: `This unit is only available for ${unit.genderAssignment}s.` });
        return;
      }

      // // Handle access key
      // if (unit.accessKey.isShared) {
      //   const assignedKeyLowerCase = unit.accessKey.assignedKey.toLowerCase();
      //   const rentalKeyLowerCase = this.rentalDetails.accessKey.toLowerCase();

      //   if (rentalKeyLowerCase !== assignedKeyLowerCase) {
      //     this.$q.notify({ type: 'negative', color: 'red', message: 'Invalid access key.' });
      //     return;
      //   }
      // }

      // Handle access key
      if (unit.accessKey.isShared) {
        if (this.rentalDetails.accessKey.toLowerCase() !== unit.accessKey.assignedKey) {
          this.$q.notify({ type: 'negative', color: 'red', message: 'Invalid access key.' });
          return;
        }
      }

      // Email verification check
      if (!this.userDetails.verification || this.userDetails.verification.isVerified !== true) {
        this.$q.notify({
          type: 'negative',
          color: 'red',
          message: 'Please verify your email before proceeding with your application.'
        });
        return;
      }

      // Document check
      if (!this.userDetails.documents || this.userDetails.documents.length < 3) {
        this.$q.notify({
          type: 'negative',
          color: 'red',
          message: 'Please ensure all required documentation is uploaded before proceeding with your application.'
        });
        return;
      }

      // Signature check
      if (!this.signatureData || this.signatureData === '') {
        this.$q.notify({
          type: 'negative',
          message: 'Please provide your digital signature by clicking Save.'
        });
        return;
      }
      const formData = new FormData()
      for (const key in this.rentalDetails) {
        if (key !== 'signature') {
          formData.append(key, this.rentalDetails[key])
        }
      }
      if (this.signatureData) {
        const signatureFile = this.base64ToFile(
        this.signatureData,
        `${this.userDetails.firstName}${this.userDetails.lastName}_Signed_${Date.now()}.png`
      );
        formData.append('signatureImage[]', signatureFile);
      }

      // Submit rental application
      try {
        const response = await RentalService.createRental(formData);
        if (response.accessKey) {
          this.$q.notify({
            type: 'positive',
            color: 'primary',
            message: `Your application has been successfully submitted. Your access key is: ${response.accessKey}`,
          });
        } else {
          this.$q.notify({
            type: 'positive',
            color: 'primary',
            message: 'Your application has been successfully submitted.',
          });
        }
        this.$emit('close');
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          color: 'red',
          message: error.message || 'There was an error submitting your application. Please try again.'
        });
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
    },
  },

  created() {
    this.fetchUserDetails()
  }
}
</script>

<style lang="sass" scoped>
.wrap-text
  white-space: pre-wrap

.image-container
  position: relative
  width: 100%
  height: 340px
  overflow: hidden
  border-radius: 4px
  background: #f5f5f5

.nav-button
  position: absolute
  top: 50%
  transform: translateY(-50%)
  background: rgba(0, 0, 0, 0.2)
  color: white
  z-index: 2
  width: 48px
  height: 48px
  font-size: 24px
  &.left
    left: 24px
  &.right
    right: 24px

.cursor-zoom-in
  cursor: zoom-in

/* Dialog fixes */
.image-dialog-card
  background: rgba(0, 0, 0, 0.9)
  max-width: 100vw
  max-height: 92vh
  width: 100vw
  height: 92vh
  display: flex
  flex-direction: column
  margin: 0
  overflow: hidden

.dialog-image-section
  flex: 1
  display: flex
  justify-content: center
  align-items: center
  position: relative
  padding: 0
  margin: 0

.enlarged-image
  max-width: calc(100vw - 100px)
  max-height: calc(100vh - 100px)
  width: auto
  height: auto
  object-fit: contain

.close-button
  position: fixed
  right: 62px
  top: 62px
  z-index: 2
  background: transparent
  color: white

.dialog-nav
  position: absolute
  top: 50%
  transform: translateY(-50%)
  background: transparent
  color: white
  z-index: 2
  width: 48px
  height: 48px
  font-size: 24px
  &.left
    left: 24px
  &.right
    right: 24px
</style>
