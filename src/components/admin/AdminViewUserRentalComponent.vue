<template>
  <q-card class="component-card">
    <q-card-section>
      <div class="text-h6">Rental Details</div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <div class="image-container">
        <q-img
          v-if="unit.images && unit.images.length > 0"
          :src="getImageUrl(unit.images[currentImageIndex].imageUrl)"
          class="q-mb-md product-image"
          :ratio="1" loading="eager"
        />
        <button class="nav-button left" @click="prevImage">‹</button>
        <button class="nav-button right" @click="nextImage">›</button>
      </div>
    </q-card-section>

    <q-card-section class="column justify-between">
      <div v-if="rental.status === 'Active'">Application Status: <span style="color: green;"><b>{{ rental.status }}</b></span></div>
      <div v-if="rental.status === 'Pending'">Application Status: <span style="color: black;"><b>{{ rental.status }}</b></span></div>
      <div v-if="rental.status === 'Rejected'">Application Status: <span style="color: red;"><b>{{ rental.status }}</b></span></div>
      <div v-if="rental.status === 'Ended'">Application Status: <span style="color: brown;"><b>{{ rental.status }}</b></span></div>

      <div v-if="rental.accessKey">Access or Reference key:
        <span style="text-transform: uppercase; cursor: pointer; color: brown;" @click="copyToClipboard(currentAccessKey)">
          <b>{{ rental.accessKey }}</b>
        </span>
      </div>
    </q-card-section>



    <q-separator />

    <q-card-section>
      <div class="q-mb-sm"><b>Application Dates</b></div>
      <ul>
        <li>Start Date: {{ formatDate(rental.rentalStartDate) }}</li>
        <li>End Date: {{ formatDate(rental.rentalEndDate) }}</li>
        <li v-if="rental.earlyEndDate">Lease Early End: {{ formatDate(rental.earlyEndDate) }}</li>
        <li><div class="">Application Date: {{ formatDate(rental.applicationDate) }}</div></li>
      </ul>
    </q-card-section>

    <q-card-section>
      <div class="q-mb-sm"><b>Unit Specifications</b></div>
      <ul>
        <li>Unit Number: {{ unit.unitNumber }}</li>
        <li>Unit Type: {{ unit.unitType }}</li>
        <li><div class="">Unit Status: {{ unit.unitStatus }}</div></li>
      </ul>
    </q-card-section>


    <q-card-section>
      <CustomButton label="Close" @click="$emit('close')" />
    </q-card-section>
  </q-card>
</template>

<script>
import CustomButton from '../elements/CustomButton.vue';
import Helper from 'src/services/helper/utils';
import UnitService from 'src/services/api/UnitService';
import { copyToClipboard } from 'quasar';

export default {
  name: "AdminViewUserRentalComponent",
  props: {
    rental: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      currentImageIndex: 0,
      unit: {}
    }
  },
  components: {
    CustomButton
  },
  methods: {
    getImageUrl: Helper.getImageUrl,
    formatDate: Helper.formatDate,

    copyToClipboard(text) {
      navigator.clipboard.writeText(text)
        .then(() => {
          this.$q.notify({ type: 'positive', color: 'primary', message: 'Access key copied to clipboard!' });
        }).catch(err => {
          this.$q.notify({ type: 'negative', message: `Failed to copy text: ${err}` });
        })
    },

    async getUnitDetails() {
      this.unit = await UnitService.getByIdUnit(this.rental.unit)
    },

    nextImage() {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.unit.images.length;
    },
    prevImage() {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.unit.images.length) % this.unit.images.length;
    },
  },
  created() {
    this.getUnitDetails()
  }
}
</script>

<style lang="sass">
.wrap-text
  white-space: pre-wrap

.image-container
  position: relative
  width: 100%
  height: 340px
  overflow: hidden
  border-radius: 4px
  background: #f5f5f5  // Optional: Add background color for empty space

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
