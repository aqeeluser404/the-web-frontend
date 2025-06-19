<template>
  <q-card class="component-card">

    <q-card-section>
      <div class="text-h6">{{ unit.unitType }} Details</div>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <div class="image-container">
        <q-img v-if="unit.images && unit.images.length > 0" :src="getImageUrl(unit.images[currentImageIndex].imageUrl)"
          class="q-mb-md product-image cursor-zoom-in" :ratio="1" @click="showImageDialog = true" />
        <q-btn round flat dense class="nav-button left" icon="chevron_left" @click="prevImage" />
        <q-btn round flat dense class="nav-button right" icon="chevron_right" @click="nextImage" />
      </div>
    </q-card-section>
    <q-dialog v-model="showImageDialog" @show="logImageInfo">
      <q-card flat borderless class="image-dialog-card">

        <q-btn icon="close" flat round dense v-close-popup class="close-button" />

        <q-card-section class="dialog-image-section row justify-center flex-center">
          <img v-if="currentDialogImageUrl" :src="currentDialogImageUrl" class="enlarged-image"
            style="object-fit: contain" />
          <q-btn round flat dense class="dialog-nav left" icon="chevron_left" @click="prevImage" />
          <q-btn round flat dense class="dialog-nav right" icon="chevron_right" @click="nextImage" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-card-section>

      <!-- PHP VERSION -->
      <q-item>
        <q-item-section class="text-left text-subtitle1">Cover Image</q-item-section>
        <q-item-section class="text-left text-subtitle1">
          <q-file v-model="newImage1" label="Upload Cover Image" label-color="black" color="black" accept="image/*">
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section class="text-left text-subtitle1">Second Image</q-item-section>
        <q-item-section class="text-left text-subtitle1">
          <q-file v-model="newImage2" label="Upload Second Image" label-color="black" color="black" accept="image/*">
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section class="text-left text-subtitle1">Third Image</q-item-section>
        <q-item-section class="text-left text-subtitle1">
          <q-file v-model="newImage3" label="Upload Third Image" label-color="black" color="black" accept="image/*">
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section class="text-left text-subtitle1">Unit ID </q-item-section>
        <q-item-section class="text-left text-subtitle1">
          <q-input v-model="unit._id" readonly />
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section class="text-left text-subtitle1">Unit Number</q-item-section>
        <q-item-section class="text-left text-subtitle1">
          <q-input v-model="unit.unitNumber" />
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
          <q-input v-model="unit.unitPrice" type="number" prefix="R"
            :rules="[val => val > 0 || 'Price must be positive']" />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section class="text-left text-subtitle1">Unit Description</q-item-section>
        <q-item-section class="text-left text-subtitle1">
          <q-input type="textarea" v-model="unit.unitDescription" />
        </q-item-section>
      </q-item>
    </q-card-section>

    <q-card-section class="row justify-between">
      <CustomButton label="Update Unit" customStyle="width: 45%" @click="updateUnit" />
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
      showImageDialog: false,

      // PHP VERSION
      newImage1: null, newImage2: null, newImage3: null,
    }
  },
  components: {
    CustomButton
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

    // async updateUnit() {
    //   const updatedUnit = {
    //     unitNumber: this.unit.unitNumber,
    //     floorLevel: this.unit.floorLevel,
    //     unitType: this.unit.unitType,
    //     unitOccupants: this.unit.unitOccupants,
    //     currentOccupants: this.unit.currentOccupants,
    //     unitDescription: this.unit.unitDescription,
    //     unitPrice: this.unit.unitPrice,
    //     images: this.unit.images
    //   }
    //   if (this.unit.unitNumber === '' || this.unit.floorLevel === '' || this.unit.unitType === '' || this.unit.unitOccupants === '' || this.unit.unitDescription === '' || this.unit.unitPrice === '') {
    //     this.$q.notify({ type: 'negative', message: 'Please fill in all fields' })
    //     return
    //   }
    //   this.$q.dialog({
    //     title: 'Confirm', message: `You are about to update this unit in the database, continue?`, color: 'primary', cancel: true, persistent: true
    //   }).onOk(async () => {
    //     const response = await UnitService.updateUnit(this.unit._id, updatedUnit)
    //     if (response) {
    //       this.$q.notify({ type: 'positive', color: 'primary', message: 'Unit Updated!' })
    //       this.$emit('close')
    //     } else {
    //       this.$q.notify({ type: 'negative', message: 'Failed to update unit. Please try again.' })
    //     }
    //   }).onCancel(() => {
    //     return
    //   })
    // },

    // PHP VERSION
    async updateUnit() {
      if (!this.unit.floorLevel || !this.unit.unitType ||
        !this.unit.unitOccupants || !this.unit.unitDescription || !this.unit.unitPrice) {
        this.$q.notify({ type: 'negative', message: 'Please fill in all fields' });
        return;
      }

      this.$q.dialog({
        title: 'Confirm',
        message: `You are about to update this unit in the database, continue?`,
        color: 'primary',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        const formData = new FormData();

        formData.append('unitNumber', this.unit.unitNumber);
        formData.append('floorLevel', this.unit.floorLevel);
        formData.append('unitType', this.unit.unitType);
        formData.append('unitOccupants', this.unit.unitOccupants);
        formData.append('unitDescription', this.unit.unitDescription);
        formData.append('unitPrice', this.unit.unitPrice);
        formData.append('genderAssignment', this.unit.genderAssignment || '');

        if (this.newImage1) formData.append('images[]', this.newImage1);
        if (this.newImage2) formData.append('images[]', this.newImage2);
        if (this.newImage3) formData.append('images[]', this.newImage3);

        try {
          await UnitService.updateUnit(this.unit._id, formData);

          this.$q.notify({
            type: 'positive',
            message: 'Unit updated successfully!'
          });
          this.$emit('close');
        } catch (error) {
          this.$q.notify({
            type: 'negative',
            message: error.response?.data?.message || 'Update failed. Please try again.'
          });
        }
      }).onCancel(() => {
        return;
      });
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
