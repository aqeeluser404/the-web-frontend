<template>
  <div class="input-container">
    <div class="input-wrapper">
      <q-input
        filled
        :type="inputType"
        :label="label"
        v-model="internalValue"
        class="custom-input"
        :style="{ width: inputWidth }"
        label-color="black"
        color="black"
      />
      <q-icon
        :name="inputType === 'password' ? 'visibility' : 'visibility_off'"
        class="eye-icon"
        @click="toggleVisibility"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: "VisibilityPasswordInput",
  props: {
    modelValue: {
      type: String,
      default: ""
    },
    label: {
      type: String,
      default: "Password"
    },
    inputWidth: {
      type: String,
      default: "100%"
    }
  },
  emits: ["update:modelValue"],
  data() {
    return {
      inputType: "password",
      internalValue: this.modelValue
    };
  },
  watch: {
    modelValue(val) {
      this.internalValue = val;
    },
    internalValue(val) {
      this.$emit("update:modelValue", val);
    }
  },
  methods: {
    toggleVisibility() {
      this.inputType = this.inputType === "password" ? "text" : "password";
    }
  }
};
</script>

<style scoped lang="sass">
.input-container
  display: flex
  flex-direction: column

.input-wrapper
  position: relative
  display: flex
  align-items: center
  width: 100%

.custom-input
  flex: 1
  width: 100%

.eye-icon
  position: absolute
  right: 12px
  cursor: pointer
  font-size: 20px
  color: rgba(0, 0, 0, 0.5)

  &:hover
    color: #009B77
</style>
