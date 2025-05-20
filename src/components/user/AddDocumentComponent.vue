<template>
  <q-card class="component-card">
    <q-card-section>
      <div class="text-h6">Add New Document</div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <q-item>
        <q-item-section class="text-left text-subtitle1">Attach your document</q-item-section>
        <q-item-section>
          <q-file v-model="file" label="Upload your document" accept="*/*" name="document" id="document">
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>
        </q-item-section>
      </q-item>

    </q-card-section>

    <q-card-section class="row justify-between">
      <CustomButton label="Add Document" @click="addDocument" customStyle="width: 45%" />
      <CustomButton label="Close" color="white" text-color="black" @click="$emit('close')" customStyle="width: 45%" />
    </q-card-section>
  </q-card>
</template>

<script>
import CustomButton from '../elements/CustomButton.vue';
import UserService from 'src/services/UserService';

export default {
  name: 'AddDocumentComponent',
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      file: null
    };
  },
  components: {
    CustomButton
  },
  methods: {
    async addDocument() {
      if (this.file) {
        if (this.user.documents && this.user.documents.length < 3) {
          const formData = new FormData();
          formData.append('documents', this.file);
          try {
            const response = await UserService.uploadUserDocs(this.user._id, formData);
            if (response) {
              this.$q.notify({ type: 'positive', color: 'primary', message: 'Addition successful!' });
              this.file = null;
              this.$emit('close')
            } else {
              this.$q.notify({ type: 'negative', message: 'Addition failed. Please try again.' });
            }
          } catch (error) {
            this.$q.notify({ type: 'negative', message: 'An error occurred. Please try again.' });
          }
        } else {
          this.$q.notify({ type: 'negative', message: 'You cannot have more than 3 documents saved. Please ensure only your ID, proof of address, and bank statement are attached.' });
        }
      } else {
        this.$q.notify({ type: 'negative', message: 'Please attach your file.' });
      }
    }
  }
};
</script>
