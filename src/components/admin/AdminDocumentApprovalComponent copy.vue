<template>
  <q-card class="component-card">
    <div class="q-pa-md" style="background-color: #f8f8f8;">
      <q-card-section class="row justify-between items-center">
        <div class="text-h6">Document Approval</div>
        <div>
          <q-btn flat round icon="close" @click="$emit('close')" size="md" color="grey-10" aria-label="Close" />
        </div>
      </q-card-section>

      <q-separator />

      <q-card-section>
        <ul>
          <div v-for="docType in requiredDocuments" :key="docType.type" class="cursor-pointer q-mb-sm"
            style="font-weight: 500;" @click="handleDocumentClick(docType.type)">
            <q-icon class="q-mr-sm" v-if="hasDocument(docType.type)" color="secondary"
              name="eva-checkmark-circle-2-outline" />
            <q-icon class="q-mr-sm" v-else color="negative" name="eva-alert-circle-outline" />
            <span>{{ docType.label }}</span>
          </div>
          <br />
          <div class="text-caption text-grey-8 q-mt-sm">
            Please ensure all submitted documents are accurate and match the applicant’s details before proceeding with
            approval.
          </div>
        </ul>
      </q-card-section>

      <!-- <q-card-section class="row justify-between">
        <CustomButton color="white" text-color="black" label="Close" @click="$emit('close')"
          customStyle="width: 100%" />
      </q-card-section> -->
    </div>

  </q-card>
</template>

<script>
import documentLogo from '../../assets/resources/elements/document.png'
import CustomButton from 'src/components/elements/CustomButton.vue'
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
  data() {
    return {
      documentLogo,
      requiredDocuments: [
        { type: 'registration', label: 'Registration Form' },
        { type: 'proof_of_address', label: 'Proof of Residential Address' },
        { type: 'id_or_passport', label: 'South African Identity Document (ID) or Passport' },
        { type: 'bank_statements', label: 'Three Months\' Bank Statements' },
        { type: 'credit_check', label: 'Check Credit Approval' }
      ]
    }
  },
  methods: {
    hasDocument(type) {
      return this.documents.some(doc => doc.docType === type)
    },
    getDocumentByType(type) {
      return this.documents.find(doc => doc.docType === type)
    },
    handleDocumentClick(type) {
      const document = this.getDocumentByType(type)
      if (document) {
        this.viewDocument(document)
      } else {
        this.openAddDocumentDialog(type)
      }
    },
    openAddDocumentDialog(type) {
      this.$emit('add-document', type)
    },
    removeAllDocuments() {
      this.$emit('remove-all')
    },
    viewDocument(document) {
      const url = Helper.getDocumentUrl(document)
      if (url) {
        window.open(url, '_blank')
      }
    }
  }
}
</script>

<style lang="sass">
.q-card.component-card
  padding: 16px
</style>
