<template>
  <q-card style="width: 400px;">
    <q-card-section>
      <div class="text-h6">{{ unit.unitType }} Details</div>
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
      <div><b>Unit Specifications</b></div>
      <ul>
        <li>{{ unit.bedrooms }} Bedroom(s)</li>
        <li>{{ unit.kitchens }} Kitchen(s)</li>
        <li>{{ unit.bathrooms }} Bathroom(s)</li>
        <li>{{ unit.parking }} Parking(s)</li>
        <li>{{ unit.lounges }} Lounge(s)</li>
      </ul>
      <div>{{ unit.unitDescription }}</div>
    </q-card-section>
    <q-card-section align="right">
      <CustomButton label="Close" @click="$emit('close')" />
    </q-card-section>
  </q-card>
</template>

<script>
import Helper from 'src/services/utils'
import CustomButton from './CustomButton.vue'

export default {
  name: 'UnitDetailsComponent',
  props: {
    unit: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      currentImageIndex: 0,
    }
  },
  components: {
    CustomButton
  },
  methods: {
    getImageUrl: Helper.getImageUrl,

    nextImage() {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.unit.images.length;
    },
    prevImage() {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.unit.images.length) % this.unit.images.length;
    },

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
  height: 300px

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
