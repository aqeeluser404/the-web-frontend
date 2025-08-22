<template>
  <q-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" maximized>
    <q-card flat borderless class="image-dialog-card">
      <q-btn icon="close" flat round v-close-popup class="close-button" />
      <q-card-section class="dialog-image-section">
        <img
          v-if="imageUrl"
          :src="imageUrl"
          class="enlarged-image"
          style="object-fit: contain"
        />
        <q-btn v-if="onPrev" round flat dense class="dialog-nav left" icon="chevron_left" @click="onPrev" />
        <q-btn v-if="onNext" round flat dense class="dialog-nav right" icon="chevron_right" @click="onNext" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Boolean,
      required: true
    },
    imageUrl: {
      type: String,
      default: ''
    },
    onPrev: Function,
    onNext: Function
  },
  emits: ['update:modelValue']
}
</script>

<style lang="sass" scoped>
.image-dialog-card
  background: rgba(0, 0, 0, 0.9) !important

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
