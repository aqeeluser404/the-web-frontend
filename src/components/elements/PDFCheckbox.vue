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
      :checked="modelValue"
      @change="$emit('update:modelValue', $event.target.checked)"
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
      {{ modelValue ? '✓' : '' }}
    </span>
  </div>
</template>

<script>
export default {
  props: {
    modelValue: {
      type: Boolean,
      default: false
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
  methods: {
    toggle() {
      this.$emit('update:modelValue', !this.modelValue)
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
