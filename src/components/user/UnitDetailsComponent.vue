<template>
  <q-card style="width: 650px;">

    <q-card-section>
      <div class="text-h6">Unit {{ unit.unitNumber }} Details</div>
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
        <div class="row">
          <CustomButton icon="eva-briefcase-outline" label="Apply" @click="gotoApply" flat class="goto-button" style="width: 120px;" />
          <!-- <q-btn icon="eva-briefcase-outline" label="Make Application" @click="gotoApply" flat round class="goto-button" /> -->
          <q-btn icon="close" flat round v-close-popup class="close-button" />
        </div>
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
      <div><b>Unit Availability</b></div>
      <br>
      <div>This unit accommodates up to {{ unit.unitOccupants }} occupants, currently housing <span style="text-decoration: underline;">{{ unit.currentOccupants }} residents</span>. <br>
        <span v-if="unit.unitOccupants > unit.currentOccupants"><span style="text-decoration: underline;">{{ unit.unitOccupants - unit.currentOccupants }} occupants</span> can still make an application.</span><span v-else>This unit has been fully booked.</span></div>
    </q-card-section>

    <q-card-section>
      <div><b>Unit Description</b></div>
      <br>
      <div>{{ unit.unitDescription }}</div>
    </q-card-section>

    <q-card-section align="right">
      <CustomButton label="Close" @click="$emit('close')" />
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
      showImageDialog: false
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

    nextImage() {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.unit.images.length
      this.logImageInfo()
    },

    prevImage() {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.unit.images.length) % this.unit.images.length
      this.logImageInfo()
    },

    async gotoApply() {
      const isLoggedIn = await Helper.checkCookie()
      if (isLoggedIn) {
          this.$router.push({
          path: '/units/apply',
          query: { applyForUnit: this.unit._id }
        });
        this.showImageDialog = false;
      } else {
        this.$router.push('/auth/login')
        this.$q.notify({ type: 'negative', message: 'Please login to continue.' })
      }
    }
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

.goto-button
  position: fixed
  right: 102px
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
