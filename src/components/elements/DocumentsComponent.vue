<template>
  <!-- documents section -->
  <q-card flat bordered :class="isUserDetails ? '' : 'component-card'">
    <div :class="isUserDetails ? '' : 'q-pa-md'" :style="isUserDetails ? '' : 'background-color: #f8f8f8;'">
      <q-card-section>
        <div class="text-h6">Documents Approval</div>
      </q-card-section>
      <q-separator />
      <q-card-section>
        <ul>
          <div v-for="docType in requiredDocuments" :key="docType.type" class="cursor-pointer q-mb-sm"
            style="font-weight: 500;" @click="openAddDocumentDialog(docType.type)">
            <q-icon class="q-mr-sm" v-if="hasDocument(docType.type)" color="secondary"
              name="eva-checkmark-circle-2-outline" />
            <q-icon class="q-mr-sm" v-else color="negative" name="eva-alert-circle-outline" />
            <span> {{ docType.label }}</span>
          </div>
          <br>
          <div class="cursor-pointer" @click="removeAllDocuments">
            <q-icon class="q-mr-sm" name="eva-trash-outline" />
            <span> Clear All</span>
          </div>
        </ul>
      </q-card-section>
    </div>
    <q-dialog v-model="addDocDialog">
      <AddDocumentComponent :user="userDetails" :docType="activeDocType" @close="handleDialogClose"
        @document-added="fetchUserDetails" />
    </q-dialog>
  </q-card>

</template>

<script>
import UserService from 'src/services/UserService';
import Helper from 'src/services/utils';
import AddDocumentComponent from '../user/AddDocumentComponent.vue';

export default {
  data() {
    return {
      userDetails: {
        studentInfo: {
          isRegisteredStudent: '',
          studentNumber: '',
          registeredInstitution: '',
          hasBursary: ''
        }
      },
      isEditingDisabled: false,
      addDocDialog: false,
      requiredDocuments: [
        { type: 'registration', label: 'Registration Form' },
        { type: 'proof_of_address', label: 'Proof of Residential Address' },
        { type: 'id_or_passport', label: 'South African Identity Document (ID) or Passport' },
        { type: 'bank_statements', label: 'Three Months\' Bank Statements' },
        { type: 'credit_check', label: 'Check Credit Approval' }
      ],
      activeDocType: null
    }
  },
  props: {
    userId: {
      type: String,
      required: true
    }
  },
  components: {
    AddDocumentComponent
  },
  computed: {
    isUserDetails() {

      // any non-slash sequence
      return this.$route.path.match(/\/admin\/users\/view\/[^/]+$/)
    }
  },
  methods: {
    async fetchUserDetails() {
      this.userDetails = await UserService.findUserById(this.userId)
    },

    hasDocument(type) {
      return this.userDetails.documents?.some(doc => doc.docType === type);
    },
    viewDocument(document) {
      const url = Helper.getDocumentUrl(document);
      window.open(url, '_blank');
    },
    async deleteDocument(fileId) {
      // console.log(this.userDetails._id)
      // console.log(fileId)
      const response = await UserService.removeUserDoc(this.userDetails._id, fileId);
      if (response) {
        this.$q.notify({ type: 'positive', color: 'primary', message: 'Delete successful!' });
        this.fetchUserDetails();
      }
    },
    async removeAllDocuments() {
      if (this.userDetails.documents.length > 0) {
        this.$q.dialog({
          title: 'Confirm', message: `You are about to delete all your documents, continue?`, color: 'primary', cancel: true, persistent: true
        }).onOk(async () => {
          const response = await UserService.clearAllUserDocs(this.userDetails._id);
          if (response) {
            this.$q.notify({ type: 'positive', color: 'primary', message: 'Delete successful!' });
            this.fetchUserDetails();
          } else {
            this.$q.notify({ type: 'negative', message: 'Delete failed. Please try again.' });
          }
        }).onCancel(() => {
          this.fetchUserDetails();
          return;
        });
      } else {
        this.$q.notify({ type: 'negative', message: 'You have no documents to delete. Please try again.' });
      }
    },
    openAddDocumentDialog(type) {
      this.activeDocType = type;
      this.addDocDialog = true;
    },
    handleDialogClose() {
      this.addDocDialog = false;
      this.fetchUserDetails();
    }
  },
  created() {
    this.fetchUserDetails();
  }
}
</script>

<style lang="sass">
.q-card.component-card
  padding: 16px
</style>
