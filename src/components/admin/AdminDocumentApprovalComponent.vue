<template>
  <q-card style="width: 650px;">
    <q-card-section class="row justify-center">
      <div class="text-h6">Documents</div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <q-list v-for="document in documents" :key="document._id">
        <q-card
          flat bordered
          class="cursor-pointer row q-ma-sm"
        >
          <q-card-section>
            <q-img
              src="src/assets/resources/elements/document.png"
              class="document"
            />
          </q-card-section>

          <q-card-section>
            <div class="text-caption wrap-text limit-text">{{ document.documentUrl.split('/').pop() }}</div>
            <div class="row justify-between q-my-md">
              <CustomButton flat @click="viewDocument(document.documentUrl)" label="Open" color="white" text-color="black" customStyle="width: 45%"  />
            </div>
          </q-card-section>
        </q-card>
      </q-list>
    </q-card-section>

    <q-card-section class="row justify-between">
      <CustomButton label="Close" color="brown" text-color="white" @click="$emit('close')" customStyle="width: 100%" />
    </q-card-section>
  </q-card>
</template>

<script>
import CustomButton from 'src/components/CustomButton.vue'
import Helper from 'src/services/utils'

export default {
  name: 'AdminDocumentApprovalComponent',
  components: { CustomButton },
  props: {
    documents: {
      type: Array,
      required: true
    }
  },
  methods: {
    viewDocument(document) {
      const url = Helper.getDocumentUrl(document);
      window.open(url, '_blank');
    }
  }
}
</script>
