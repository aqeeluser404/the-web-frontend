<template>
  <DocumentsComponent :userId="userId" />

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
