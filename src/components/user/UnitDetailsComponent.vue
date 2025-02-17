<template>
  <q-card style="width: 650px;">
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
          :ratio="1"
        />
        <button class="nav-button left" @click="prevImage">‹</button>
        <button class="nav-button right" @click="nextImage">›</button>
      </div>
    </q-card-section>

    <q-card-section class="wrap-text">
      <div><b>Unit Availability</b></div>
      <br>
      <div>This unit accommodates up to {{ unit.unitOccupants }} occupants, currently housing <span style="text-decoration: underline;">{{ unit.currentOccupants }} residents</span>. <br>
        <span v-if="unit.unitOccupants > unit.currentOccupants"><span style="text-decoration: underline;">{{ unit.unitOccupants - unit.currentOccupants }} occupants</span> can still make an application.</span><span v-else>This unit has been fully booked.</span></div>
      <br>
      <div><b>Unit Description</b></div>
      <br>
      <div>{{ unit.unitDescription }}</div>
    </q-card-section>
    <q-card-section align="right">
      <CustomButton label="Close" color="brown" @click="$emit('close')" />
    </q-card-section>
  </q-card>
</template>

<script>
import Helper from 'src/services/utils'
import CustomButton from 'src/components/elements/CustomButton.vue'

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
