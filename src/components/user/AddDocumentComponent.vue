<template>
  <q-card class="component-card">
    <q-card-section>
      <div class="text-h6">Add {{ documentTypeLabel }}</div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <q-item>
        <q-item-section class="text-left text-subtitle1">
          Attach your {{ documentTypeLabel }}
        </q-item-section>
        <q-item-section>
          <div v-if="existingDocument">
            <q-icon name="eva-checkmark-circle-2-outline" color="secondary" class="q-mr-sm" />
            <span>Already uploaded on {{ new Date(existingDocument.uploadDate).toLocaleDateString() }}</span>
            <br>
            <a :href="existingDocument.documentUrl" target="_blank" class="text-primary">
              View Document
            </a>
          </div>
          <div v-else>
            <q-file v-model="file" :label="`Upload your ${documentTypeLabel}`" accept="*/*" />
          </div>
        </q-item-section>
      </q-item>
    </q-card-section>

    <q-card-section class="row justify-between">
      <CustomButton label="Add Document" :disable="!!existingDocument || isUploading" customStyle="width: 45%"
        @click="addDocument" />
      <CustomButton label="Close" color="white" text-color="black" @click="$emit('close')" customStyle="width: 45%" />
    </q-card-section>
  </q-card>
</template>

<script>
import CustomButton from '../elements/CustomButton.vue';
import UserService from 'src/services/UserService';
import EmailService from 'src/services/EmailService';

export default {
  props: {
    user: {
      type: Object,
      required: true
    },
    docType: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      file: null,
      isUploading: false
    }
  },
  computed: {
    documentTypeLabel() {
      const types = {
        'registration': 'Registration Form',
        'proof_of_address': 'Proof of Residential Address',
        'id_or_passport': 'ID or Passport',
        'bank_statements': 'Bank Statements',
        'credit_check': 'Credit Check'
      };
      return types[this.docType] || 'Document';
    },
    existingDocument() {
      return this.user.documents?.find(doc => doc.docType === this.docType) || null;
    }
  },
  components: {
    CustomButton
  },
  methods: {
    async addDocument() {
      if (!this.file) {
        this.$q.notify({ type: 'negative', message: 'Please select a file.' });
        return;
      }

      if (this.isUploading) return;

      if (this.existingDocument) {
        this.$q.notify({ type: 'negative', message: 'Document already uploaded.' });
        return;
      }

      this.isUploading = true;

      const formData = new FormData();
      formData.append('documents', this.file);
      formData.append('type', this.docType);

      try {
        const response = await UserService.uploadUserDocs(this.user._id, formData);
        await EmailService.DocumentUploadEmail(this.user._id)
        await EmailService.DocumentUploadToUserEmail(this.user._id)
        if (response) {
          this.$q.notify({ type: 'positive', message: 'Document added successfully!' });
          this.$emit('document-added', { type: this.docType, file: this.file });
          this.$emit('close');
        }
      } catch (error) {
        this.$q.notify({ type: 'negative', message: 'Upload failed. Please try again.' });
      } finally {
        this.isUploading = false;
      }
    }
  }
}
</script>
