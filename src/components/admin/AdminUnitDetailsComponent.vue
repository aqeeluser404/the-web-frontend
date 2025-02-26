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

    <q-card-section>
      <q-item>
        <q-item-section class="text-left text-subtitle1">Unit Number</q-item-section>
        <q-item-section class="text-left text-subtitle1">
          <q-input readonly v-model="unit.unitNumber" />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section class="text-left text-subtitle1">Floor Level</q-item-section>
        <q-item-section class="text-left text-subtitle1">
          <q-input readonly v-model="unit.floorLevel" />
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section class="text-left text-subtitle1">Unit Status</q-item-section>
        <q-item-section class="text-left text-subtitle1">
          <q-input readonly v-model="unit.unitStatus" />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section class="text-left text-subtitle1">Current Occupants</q-item-section>
        <q-item-section class="text-left text-subtitle1">
          <q-input readonly v-model="unit.currentOccupants" />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section class="text-left text-subtitle1">Maximum Unit Occupancy</q-item-section>
        <q-item-section class="text-left text-subtitle1">
          <q-input v-model="unit.unitOccupants" />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section class="text-left text-subtitle1">Unit Type</q-item-section>
        <q-item-section class="text-left text-subtitle1">
          <q-input v-model="unit.unitType" />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section class="text-left text-subtitle1">Unit Price</q-item-section>
        <q-item-section class="text-left text-subtitle1">
          <q-input v-model="unit.unitPrice" type="number" prefix="R" :rules="[val => val > 0] || 'Price must be positive'" />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section class="text-left text-subtitle1">Unit Description</q-item-section>
        <q-item-section class="text-left text-subtitle1">
          <q-input type="textarea" stack-label v-model="unit.unitDescription" />
        </q-item-section>
      </q-item>
    </q-card-section>
    <q-card-section class="row justify-between">
      <CustomButton label="Update Unit" customStyle="width: 45%" color="brown" text-color="white" @click="updateUnit" />
      <CustomButton label="Close" customStyle="width: 45%" color="white" text-color="black" @click="$emit('close')" />
    </q-card-section>
  </q-card>
</template>

<script>
import Helper from 'src/services/utils'
import CustomButton from '../elements/CustomButton.vue'
import UnitService from 'src/services/UnitService';

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

    async updateUnit() {
      const updatedUnit = {
        unitNumber: this.unit.unitNumber,
        floorLevel: this.unit.floorLevel,
        unitType: this.unit.unitType,
        unitOccupants: this.unit.unitOccupants,
        currentOccupants: this.unit.currentOccupants,
        unitDescription: this.unit.unitDescription,
        unitPrice: this.unit.unitPrice,
        images: this.unit.images
      }
      if (this.unit.unitNumber === '' || this.unit.floorLevel === '' || this.unit.unitType === '' || this.unit.unitOccupants === '' || this.unit.unitDescription === '' || this.unit.unitPrice === '') {
        this.$q.notify({ type: 'negative', message: 'Please fill in all fields' })
        return
      }
      this.$q.dialog({
        title: 'Confirm', message: `You are about to update this unit in the database, continue?`, color: 'primary', cancel: true, persistent: true
      }).onOk(async () => {
        const response = await UnitService.updateUnit(this.unit._id, updatedUnit)
        if (response) {
          this.$q.notify({ type: 'positive', color: 'primary', message: 'Unit Updated!' })
          this.$emit('close')
        } else {
          this.$q.notify({ type: 'negative', message: 'Failed to update unit. Please try again.' })
        }
      }).onCancel(() => {
        return
      })
    },

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
