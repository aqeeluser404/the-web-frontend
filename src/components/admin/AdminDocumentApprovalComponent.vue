<template>
  <DocumentsComponent :userId="userId" @close="$emit('close')" />

</template>

<script>
import DocumentsComponent from '../elements/DocumentsComponent.vue';

export default {
  props: {
    userId: {
      type: String,
      required: true
    }
  },
  emits: ['close'],
  components: {
    DocumentsComponent
  }
}
</script>
