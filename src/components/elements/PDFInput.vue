<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    type="text"
    class="pdf-input"
    :style="{ top: top + 'px', left: left + 'px', width: width + 'px' }"
  />
</template>

<script>
export default {
  props: ['modelValue', 'top', 'left', 'width'],
  emits: ['update:modelValue']
}
</script>

<style scoped>
.pdf-input {
  position: absolute;
  height: 20px;
  font-size: 11px;
  padding: 0 4px;
  border: 1px solid rgba(0,0,0,0.15);
  border-radius: 0;
  background: transparent;
  outline: none;
  box-sizing: border-box;
}
.pdf-input:focus {
  border-color: #1976d2;
  border-width: 2px;
}
</style>
