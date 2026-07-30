<template>
  <div
    class="pdf-checkbox-wrapper"
    :style="{ top: top + 'px', left: left + 'px', width: width + 'px', height: height + 'px' }"
    @click="toggle"
  >
    <!-- Checkbox style -->
    <input
      v-if="type === 'checkbox'"
      type="checkbox"
      :checked="isChecked"
      @change="handleChange"
      class="pdf-checkbox"
      :style="{ width: width + 'px', height: height + 'px' }"
    />

    <!-- Tick/Checkmark style (no box) -->
    <span
      v-else-if="type === 'tick'"
      class="pdf-tick"
      :style="{
        width: width + 'px',
        height: height + 'px',
        fontSize: (width * 0.8) + 'px',
        lineHeight: height + 'px'
      }"
    >
      {{ isChecked ? '✓' : '' }}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: [Boolean, String, Number, null],
      default: false
    },
    val: {
      type: [Boolean, String, Number, null],
      default: true
    },
    top: {
      type: Number,
      required: true
    },
    left: {
      type: Number,
      required: true
    },
    width: {
      type: Number,
      default: 10
    },
    height: {
      type: Number,
      default: 10
    },
    type: {
      type: String,
      default: 'checkbox',
      validator: (value) => ['checkbox', 'tick'].includes(value)
    }
  },
  emits: ['update:modelValue'],
  computed: {
    isChecked() {
      // If val is provided, check if modelValue equals val
      // Otherwise, just check if modelValue is truthy
      return this.val !== undefined ? this.modelValue === this.val : !!this.modelValue;
    }
  },
  methods: {
    toggle() {
      // If val is provided, toggle between val and null
      // Otherwise, toggle between true and false
      if (this.val !== undefined) {
        this.$emit('update:modelValue', this.modelValue === this.val ? null : this.val);
      } else {
        this.$emit('update:modelValue', !this.modelValue);
      }
    },
    handleChange(event) {
      this.$emit('update:modelValue', event.target.checked ? this.val : null);
    }
  }
}
</script>

<style scoped>
.pdf-checkbox-wrapper {
  position: absolute;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  border: 1px solid rgba(0,0,0,0.3);
}

.pdf-checkbox {
  cursor: pointer;
  accent-color: #1976d2;
  margin: 0;
  padding: 0;
  border: 1px solid rgba(0,0,0,0.3);
  border-radius: 2px;
  background: white;
  box-sizing: border-box;
  appearance: auto;
}
.pdf-checkbox:focus {
  outline: 2px solid #1976d2;
  outline-offset: 1px;
}

.pdf-tick {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #000000;
  font-weight: bold;
  user-select: none;
  border-radius: 2px;
  transition: background-color 0.2s;
}
.pdf-tick:hover {
  background-color: rgba(25, 118, 210, 0.1);
}
</style>
