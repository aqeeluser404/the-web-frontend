<template>
  <q-card class="combined-unit-card">
    <div class="row">

      <div class="col-md-6 col-12 q-pa-md left-card" style="background-color: #f8f8f8;">
        <q-card-section class="row justify-between items-center">
          <div class="text-h6">{{ unit.unitType }} Details</div>
          <q-btn flat round icon="close" @click="$emit('close')" size="md" color="grey-10" aria-label="Close"
            class="small-screen-only" />
        </q-card-section>

        <q-separator />

        <!-- IMAGE CAROUSEL -->
        <q-card-section>
          <div class="image-container">
            <q-img v-if="unit.images && unit.images.length > 0"
              :src="getImageUrl(unit.images[currentImageIndex].imageUrl)" class="product-image cursor-zoom-in"
              @click="showImageDialog = true" />
            <q-btn round flat dense class="nav-button left" icon="chevron_left" @click="prevImage" />
            <q-btn round flat dense class="nav-button right" icon="chevron_right" @click="nextImage" />
          </div>
        </q-card-section>
        <q-dialog v-model="showImageDialog" @show="logImageInfo" maximized>
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

        <!-- UNIT DETAILS FORM -->
        <q-card-section>
          <!-- Images Upload -->
          <div v-for="(img, i) in 3" :key="'img' + i">
            <!-- <div v-for="(img, i) in 7" :key="'img' + i"> -->
            <q-item>
              <q-item-section class="text-left text-subtitle1">Image {{ i + 1 }}</q-item-section>
              <q-item-section class="text-left text-subtitle1">
                <q-file v-model="newImages[i]" :label="'Upload Image ' + (i + 1)" label-color="black" color="black"
                  accept="image/*">
                  <template v-slot:prepend>
                    <q-icon name="attach_file" />
                  </template>
                </q-file>
              </q-item-section>
            </q-item>
          </div>

          <!-- Basic Unit Fields -->
          <q-item v-for="field in basicFields" :key="field.key">
            <q-item-section class="text-left text-subtitle1">{{ field.label }}</q-item-section>
            <q-item-section class="text-left text-subtitle1">
              <q-input v-model="unit[field.key]" :readonly="field.readonly" :type="field.type || 'text'"
                :prefix="field.prefix || ''" :rules="field.rules || []" />
            </q-item-section>
          </q-item>
        </q-card-section>
      </div>

      <div class="col-md-6 col-12 q-pa-md">
        <q-card-section class="row justify-end items-center q-py-none q-py-sm">
          <q-btn flat round icon="close" @click="$emit('close')" size="md" color="grey-10" aria-label="Close"
            class="large-screen-only" />
        </q-card-section>

        <!-- Sub units -->
        <q-card-section>
          <div class="text-subtitle1 q-mb-md text-weight-bold">{{ unit.subUnits?.length ? 'Edit Sub-Units' : 'Create Sub-Units' }}</div>

          <!-- Existing SubUnits -->
          <template v-if="unit.subUnits && unit.subUnits.length">
            <div v-for="(sub, index) in unit.subUnits" :key="'existing-room-' + index">
              <q-item>
                <q-item-section class="text-left text-subtitle1">Sub-Unit Name *</q-item-section>
                <q-item-section class="text-left text-subtitle1">
                  <q-input v-model="sub.name" label="Sub-Unit Name" class="col-grow" />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section class="text-left text-subtitle1">Sub-Unit Type *</q-item-section>
                <q-item-section class="text-left text-subtitle1">
                  <q-select v-model="sub.type" :options="['room', 'bed']" label="Type" class="col-grow" />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section class="text-left text-subtitle1 text-bold">isAvailable *</q-item-section>
                <q-item-section class="text-left text-subtitle1">
                  <q-select
                    v-model="sub.isAvailable"
                    :options="[
                      { label: 'true', value: true },
                      { label: 'false', value: false }
                    ]"
                    emit-value
                    map-options
                  />
                </q-item-section>
              </q-item>

              <!-- Multiple Prices with name and price -->
              <div v-for="(priceEntry, pIndex) in subUnitPrices[index]" :key="'existing-price-' + index + '-' + pIndex"
                class="">
                <q-item>
                  <q-item-section class="text-left text-subtitle1">
                    Price ({{ pIndex + 1 }})
                  </q-item-section>
                  <q-item-section>
                    <q-input v-model.number="subUnitPrices[index][pIndex].price" label="Price (R)" type="number"
                      prefix="R" />
                  </q-item-section>
                  <q-item-section>
                    <q-input v-model="subUnitPrices[index][pIndex].name" label="Price Name" />
                  </q-item-section>
                  <q-item-section>
                    <CustomButton color="negative" icon="delete" v-if="subUnitPrices[index].length > 1"
                      @click="removePrice(index, pIndex)" />
                  </q-item-section>
                </q-item>
              </div>

              <div class="q-mx-none q-mt-md row justify-between">
                <div class="col-md-3 col-12 q-mb-sm">
                  <CustomButton label="Price" icon="add" @click="addPrice(index)"
                    :disable="subUnitPrices[index].length >= 3" />
                </div>
                <div class="col-md-3 col-12 q-mb-sm">
                  <q-btn label="Reserve" rounded v-if="!sub.reservedBy" class="custom-button q-px-lg q-py-sm" color="primary" @click="handleReserveRoom(index)" />
                  <q-btn label="Unreserve" rounded v-else color="negative" class="custom-button q-px-lg q-py-sm" @click="handleCancelReserveRoom(index)" />
                </div>
                <div class="col-md-5 col-12 q-mb-sm">
                  <CustomButton icon="delete" label="Remove Sub-Unit" color="negative" @click="deleteSubUnit(index)"
                    class="" />
                </div>
              </div>
            </div>
          </template>

          <!-- New SubUnits -->
          <template v-if="!unit.subUnits || !unit.subUnits.length">
            <div v-for="(sub, index) in newSubUnits" :key="'new-room-' + index">
              <q-item>
                <q-item-section class="text-left text-subtitle1">Sub-Unit Name *</q-item-section>
                <q-item-section class="text-left text-subtitle1">
                  <q-input v-model="sub.name" label="Sub-Unit Name" class="col-grow" />
                </q-item-section>
              </q-item>

              <q-item>
                <q-item-section class="text-left text-subtitle1">Sub-Unit Type *</q-item-section>
                <q-item-section class="text-left text-subtitle1">
                  <q-select v-model="sub.type" :options="['room', 'bed']" label="Type" class="col-grow" />
                </q-item-section>
              </q-item>

              <!-- Multiple Prices with name and price -->
              <div v-for="(priceEntry, pIndex) in subUnitPrices[index]" :key="'new-price-' + index + '-' + pIndex"
                class="">
                <q-item>
                  <q-item-section class="text-left text-subtitle1">
                    Price ({{ pIndex + 1 }})
                  </q-item-section>
                  <q-item-section>
                    <q-input v-model.number="subUnitPrices[index][pIndex].price" label="Price (R)" type="number"
                      prefix="R" />
                  </q-item-section>
                  <q-item-section>
                    <q-input v-model="subUnitPrices[index][pIndex].name" label="Price Name" />
                  </q-item-section>
                  <q-item-section>
                    <CustomButton color="negative" icon="delete" v-if="subUnitPrices[index].length > 1"
                      @click="removePrice(index, pIndex)" />
                  </q-item-section>
                </q-item>
              </div>

              <div class="q-mx-none q-mt-md row justify-between">
                <div class="col-md-3 col-12 q-mb-sm">
                  <CustomButton label="Price" icon="add" @click="addPrice(index)"
                    :disable="subUnitPrices[index].length >= 3" />
                </div>
                <div class="col-md-3 col-12 q-mb-sm">
                  <CustomButton label="Sub-Unit" icon="add" color="primary" @click="addNewSubUnit"
                    :disable="newSubUnits.length >= 3" v-if="newSubUnits.length > 0" />
                </div>
                <div class="col-md-5 col-12 q-mb-sm">
                  <CustomButton icon="delete" label="Remove Sub-Unit" color="negative" @click="removeNewSubUnit(index)"
                    class="" />
                </div>
              </div>
            </div>
          </template>

          <!-- Add New Sub-Unit Button (outside loop for consistency) -->
          <div v-if="!unit.subUnits || !unit.subUnits.length" class="q-mt-md">
            <CustomButton icon="add" label="Add Subunit" color="primary" flat @click="addNewSubUnit" />
          </div>
        </q-card-section>

        <q-card-section class="column items-center">
          <CustomButton label="Update Unit" customStyle="width: 100%" @click="updateUnit" class="q-mb-sm" />
          <CustomButton label="Reserve Unit" v-if="!unit.reservedBy" customStyle="width: 100%" @click="handleReserve"
            class="q-mb-sm" />
          <CustomButton label="Cancel Reserve" v-if="unit.reservedBy" customStyle="width: 100%"
            @click="handleCancelReservation" class="q-mb-sm" />
          <CustomButton label="Close" customStyle="width: 100%" color="white" text-color="black"
            @click="$emit('close')" />
        </q-card-section>
      </div>
    </div>
  </q-card>
</template>

<script>
import Helper from 'src/services/utils';
import CustomButton from '../elements/CustomButton.vue';
import UnitService from 'src/services/UnitService';

export default {
  name: 'UnitDetailsComponent',
  props: {
    unit: { type: Object, required: true }
  },
  data() {
    return {
      isLoggedIn: '',
      userDetails: {},

      logImageInfo: null,

      currentImageIndex: 0,
      showImageDialog: false,
      newImages: Array(7).fill(null),
      newSubUnits: [],
      // subUnitPrices: this.unit.subUnits?.map(sub => Array.isArray(sub.price) ? [...sub.price] : [sub.price || 0]) || [],
      subUnitPrices: this.unit.subUnits?.map(sub =>
        Array.isArray(sub.price)
          ? sub.price.map(p => typeof p === 'object' ? { name: p.name || 'default', price: parseFloat(p.price) || 0 } : { name: 'default', price: parseFloat(p) || 0 })
          : [{ name: 'default', price: parseFloat(sub.price) || 0 }]
      ) || [],

      basicFields: [
        { key: '_id', label: 'Unit ID', readonly: true },
        { key: 'unitNumber', label: 'Unit Number' },
        { key: 'floorLevel', label: 'Floor Level', readonly: true },
        { key: 'unitStatus', label: 'Unit Status', readonly: true },
        { key: 'currentOccupants', label: 'Current Occupants', readonly: true },
        { key: 'unitOccupants', label: 'Maximum Unit Occupancy', readonly: true },
        { key: 'unitType', label: 'Unit Type' },
        { key: 'genderAssignment', label: 'Gender Assignment' },
        // { key: 'unitPrice', label: 'Unit Price', type: 'number', prefix: 'R', rules: [val => val > 0 || 'Price must be positive'] },
        { key: 'unitDescription', label: 'Unit Description', type: 'textarea' }
      ]
    };
  },
  components: { CustomButton },
  computed: {
    currentDialogImageUrl() {
      if (!this.unit.images?.length) return null;
      const image = this.unit.images[this.currentImageIndex];
      if (!image?.imageUrl) return null;
      const url = this.getImageUrl(image.imageUrl);
      return url.startsWith('http') ? url : `${window.location.origin}${url}`;
    }
  },
  methods: {
    getImageUrl: Helper.getImageUrl,
    addPrice(subIndex) {
      this.subUnitPrices[subIndex].push({ name: 'default', price: 0 });
    },
    removePrice(subIndex, priceIndex) {
      this.subUnitPrices[subIndex].splice(priceIndex, 1);
    },
    addNewSubUnit() {
      this.newSubUnits.push({ name: '', type: 'room', price: [{ name: 'default', price: 0 }] });
      this.subUnitPrices.push([{ name: 'default', price: 0 }]);
    },
    deleteSubUnit(index) { this.unit.subUnits.splice(index, 1); },
    deleteNewSubUnit(index) { this.newSubUnits.splice(index, 1); },
    nextImage() { this.currentImageIndex = (this.currentImageIndex + 1) % this.unit.images.length; },
    prevImage() { this.currentImageIndex = (this.currentImageIndex - 1 + this.unit.images.length) % this.unit.images.length; },

    async updateUnit() {
      // if (this.unit.currentOccupants && this.unit.currentOccupants > 0) {
      //   this.$q.notify({ type: 'negative', message: 'Unit cannot be updated while it has occupants.' });
      //   return;
      // }
      if (!this.unit.floorLevel || !this.unit.unitType || !this.unit.unitDescription) {
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
        formData.append('unitDescription', this.unit.unitDescription);
        formData.append('genderAssignment', this.unit.genderAssignment || '');

        this.newImages.forEach(img => { if (img) formData.append('images[]', img); });

        const subUnits = [];

        this.unit.subUnits?.forEach((s, index) => {
          const name = s.name?.trim();
          const prices = this.subUnitPrices[index]?.map(p => ({
            name: p.name || 'default',
            price: parseFloat(p.price) || 0
          })) || [{ name: 'default', price: 0 }];

          subUnits.push({
            type: s.type,
            // If it's a bed, force roomType to null
            roomType: s.type === 'room' ? (name || s.roomType || '') : null,
            bedType: s.type === 'bed' ? (name || s.bedType || '') : null,
            price: prices,
            isAvailable: s.isAvailable ?? true,
            reservedBy: s.reservedBy ?? null
          });

          // Explicitly clear roomType if bedType is set
          if (subUnits[subUnits.length - 1].bedType) {
            subUnits[subUnits.length - 1].roomType = null;
          }
        });


        this.newSubUnits?.forEach(s => {
          const name = s.name?.trim();
          if (!name) return; // Skip empty entries
          const prices = Array.isArray(s.price)
            ? s.price.map(p => ({
              name: p.name || 'default',
              price: parseFloat(p.price) || 0
            }))
            : [{ name: 'default', price: parseFloat(s.price) || 0 }];

          subUnits.push({
            type: s.type,
            roomType: s.type === 'room' ? name : null,
            bedType: s.type === 'bed' ? name : null,
            price: prices,
            isAvailable: true,
          });
        });

        // Append updated subUnits JSON to form
        // formData.append('subUnits', JSON.stringify(subUnits));

        if (subUnits.length > 0) {
          formData.append('subUnits', JSON.stringify(subUnits));
        }
        try {
          await UnitService.updateUnit(this.unit._id, formData);
          this.$q.notify({ type: 'positive', message: 'Unit updated successfully!' });
          this.$emit('close');
        } catch (error) {
          this.$q.notify({ type: 'negative', message: error.response?.data?.message || 'Update failed. Please try again.' });
        }
      });
    },

    async handleReserve() {
      try {
        this.$q.dialog({
          title: 'Reserve',
          message: 'Do you wish to reserve the entire unit?',
          color: 'primary',
          persistent: true,
          cancel: true
        }).onOk(async () => {
          const response = await UnitService.reserveUnit(this.unit._id, this.userDetails._id);
          if (response) {
            this.unit.reservedBy = this.userDetails._id;
            this.unit.reservedAt = new Date().toISOString();

            // Reserve only subUnits that aren't already reserved
            if (Array.isArray(this.unit.subUnits)) {
              for (let i = 0; i < this.unit.subUnits.length; i++) {
                const sub = this.unit.subUnits[i];
                if (!sub.reservedBy) {
                  await this.handleReserveRoom(i);
                }
              }
            }
          }
        });
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: error.response?.data?.error || error.message || 'Failed to reserve unit'
        });
      }
    },

    async handleCancelReservation() {
      try {
        const response = await UnitService.cancelReservation(this.unit._id, this.userDetails._id);
        if (response) {
          this.unit.reservedBy = null;
          this.unit.reservedAt = null;

          // Cancel only subUnits reserved by this user
          if (Array.isArray(this.unit.subUnits)) {
            for (let i = 0; i < this.unit.subUnits.length; i++) {
              const sub = this.unit.subUnits[i];
              if (sub.reservedBy === this.userDetails._id) {
                await this.handleCancelReserveRoom(i);
              }
            }
          }
        }
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: error.response?.data?.error || error.message || 'Failed to cancel reservation'
        });
      }
    },

    async handleReserveRoom(index) {
      try {
        this.$q.dialog({
          title: 'Reserve Room',
          message: 'Do you want to reserve this room?',
          color: 'primary',
          persistent: true,
          cancel: true
        }).onOk(async () => {
          const subUnit = this.unit.subUnits[index];
          const response = await UnitService.reserveRoom(this.unit._id, index, this.userDetails._id);
          if (response) {
            this.$q.notify({ type: 'positive', message: 'Room reserved successfully!' });
            // Refresh or update local data here if needed
            this.unit.subUnits[index].reservedBy = this.userDetails._id; // Optimistic update
            this.unit.subUnits[index].reservedAt = new Date().toISOString();
          }
        });
      } catch (error) {
        this.$q.notify({ type: 'negative', message: error.response?.data?.error || error.message || 'Failed to reserve room' });
      }
    },

    async handleCancelReserveRoom(index) {
      try {
        this.$q.dialog({
          title: 'Cancel Reservation',
          message: 'Do you want to cancel the reservation for this room?',
          color: 'negative',
          persistent: true,
          cancel: true
        }).onOk(async () => {
          const subUnit = this.unit.subUnits[index];
          const response = await UnitService.cancelReserveRoom(this.unit._id, index, this.userDetails._id);
          if (response) {
            this.$q.notify({ type: 'positive', message: 'Room reservation cancelled!' });
            // Refresh or update local data here if needed
            this.unit.subUnits[index].reservedBy = null;
            this.unit.subUnits[index].reservedAt = null;
          }
        });
      } catch (error) {
        this.$q.notify({ type: 'negative', message: error.response?.data?.error || error.message || 'Failed to cancel room reservation' });
      }
    },

    async checkLoginStatus() {
      this.isLoggedIn = await Helper.checkCookie();
      if (this.isLoggedIn) {
        this.userDetails = await Helper.fetchUserDetails();
      }
    },
  },
  async created() {
    await this.checkLoginStatus();
    console.log(this.unit)
  }
};
</script>

<style lang="sass" scoped>
.left-card
  display: flex
  flex-direction: column
  height: 100%

.combined-unit-card
  width: 100%
  max-width: 550px
  padding: 16px

  @media (min-width: 601px)
    min-width: 1200px

  @media (max-width: 600px)
    min-width: unset
    padding: 8px

.wrap-text
  white-space: pre-wrap

.image-container
  position: relative
  width: 100%
  height: 450px
  overflow: hidden
  border-radius: 4px
  background: #f5f5f5
  display: flex
  justify-content: center
  align-items: center

.nav-button
  position: absolute
  top: 50%
  transform: translateY(-50%)
  background: rgba(0,0,0,0.2)
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

.image-dialog-card
  background: rgba(0,0,0,0.9) !important

.dialog-image-section
  height: 100%
  display: flex
  justify-content: center
  align-items: center
  position: relative

.enlarged-image
  max-width: 100%
  max-height: 100%
  width: auto
  height: auto

.close-button
  position: fixed
  right: 15px
  top: 10px
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
