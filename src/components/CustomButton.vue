<!-- filepath: /e:/Work/Projects/The Web/Project/the-web-quasar/src/components/CustomButton.vue -->
<template>
  <q-btn
    :rounded="rounded"
    :label="label"
    :color="color"
    :text-color="textColor"
    :type="type"
    :class="customClass"
    :style="customStyle"
    :to="to"
    @click="handleClick"
  />
</template>

<script>
export default {
  name: 'CustomButton',
  props: {
    rounded: {
      type: Boolean,
      default: true
    },
    label: {
      type: String,
      required: true
    },
    color: {
      type: String,
      default: 'brown'
    },
    textColor: {
      type: String,
      default: 'white'
    },
    type: {
      type: String,
      default: null
    },
    customClass: {
      type: String,
      default: 'custom-button q-px-lg q-py-sm'
    },
    customStyle: {
      type: String,
      default: 'width: 100%;'
    },
    to: {
      type: [String, Object],
      default: null
    },
    clickHandler: {
      type: Function,
      default: null
    }
  },
  methods: {
    handleClick(event) {
      if (this.clickHandler) {
        this.clickHandler(event);
      }
    }
  }
}
</script>
