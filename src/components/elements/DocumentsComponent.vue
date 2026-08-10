<template>
  <!-- documents section -->
  <q-card :class="isUserDetails ? '' : 'component-card'" class="soft-shadow-card">
    <div :class="isUserDetails ? '' : 'q-pa-md'" :style="isUserDetails ? '' : 'background-color: #f8f8f8;'">
      <q-card-section class="row justify-between stats-header items-center">
        <div class="text-h6">Documents Approval</div>
        <q-btn v-if="!isUserDetails" flat round icon="close" @click="$emit('close')" size="md" color="grey-10" aria-label="Close" />
        <q-separator class="q-my-sm" style="width: 100%;" />
      </q-card-section>

      <q-card-section v-if="userCategory">
        <ul>
          <div>
            <div class="text-subtitle1 q-mb-md text-grey-9">{{ userCategory }} Documents</div>
            <div v-for="docType in requiredDocumentsByCategory[userCategory]"
                :key="docType.type"
                class="cursor-pointer q-mb-sm"
                style="font-weight: 500;"
                @click="openAddDocumentDialog(docType.type)">
              <q-icon class="q-mr-sm"
                      v-if="hasDocument(docType.type)"
                      color="secondary"
                      name="eva-checkmark-circle-2-outline" />
              <q-icon class="q-mr-sm"
                      v-else
                      color="negative"
                      name="eva-alert-circle-outline" />
              <span>{{ docType.label }}</span>
            </div>
          </div>

          <q-separator class="q-my-md" v-if="hasCreditCheckDocument || hasLeaseDocument || pendingRental" />

          <!-- Application Documents Section -->
          <div class="text-subtitle1 q-mb-md text-h6 text-grey-9">Application Documents</div>

          <!-- Credit Check Application -->
          <div class="cursor-pointer q-mb-sm" style="font-weight: 500;" @click="handleRentalDocumentClick('Signed And Filled Application Form')">
            <q-icon class="q-mr-sm"
                    :color="hasCreditCheckDocument ? 'secondary' : 'negative'"
                    :name="hasCreditCheckDocument ? 'eva-checkmark-circle-2-outline' : 'eva-alert-circle-outline'" />
            <span>Credit Check Application</span>
            <span v-if="!hasCreditCheckDocument" class="text-caption text-grey-6 q-ml-sm">(not uploaded yet)</span>
          </div>

          <!-- Signed Lease Agreement -->
          <div class="cursor-pointer q-mb-sm" style="font-weight: 500;" @click="handleRentalDocumentClick('Signed And Filled Lease Form')">
            <q-icon class="q-mr-sm"
                    :color="hasLeaseDocument ? 'secondary' : 'negative'"
                    :name="hasLeaseDocument ? 'eva-checkmark-circle-2-outline' : 'eva-alert-circle-outline'" />
            <span>Signed Lease Agreement</span>
            <span v-if="!hasLeaseDocument" class="text-caption text-grey-6 q-ml-sm">(not uploaded yet)</span>
          </div>

          <br>
          <div v-if="currentUser && currentUser.userType === 'user'"
              class="cursor-pointer"
              @click="removeAllDocuments">
            <q-icon class="q-mr-sm" name="eva-trash-outline" />
            <span> Clear All</span>
          </div>
        </ul>
      </q-card-section>

      <!-- If no docs uploaded -->
      <q-card-section v-else>
        <q-item>
          <q-item-section class="text-subtitle1">No documents have been uploaded yet.</q-item-section>
        </q-item>
      </q-card-section>
    </div>

    <q-dialog v-model="addDocDialog">
      <AddDocumentComponent :user="userDetails" :docType="activeDocType" @close="handleDialogClose"
        @document-added="fetchUserDetails" />
    </q-dialog>
  </q-card>
</template>

<script>
import UserService from 'src/services/api/UserService';
import Helper from 'src/services/utils';
import AddDocumentComponent from '../user/AddDocumentComponent.vue';
import RentalService from 'src/services/api/RentalService';

export default {
  data() {
    return {
      currentUser: {},
      myRentals: [],
      userDetails: {
        studentInfo: {
          isRegisteredStudent: '',
          studentNumber: '',
          registeredInstitution: '',
          hasBursary: ''
        },
        documents: []
      },
      isEditingDisabled: false,
      addDocDialog: false,
      activeDocType: null,
      requiredDocumentsByCategory: {
        'Private Client': [
          { type: 'private_student_registration', label: 'Student Registration Form' },
          { type: 'private_id_student', label: 'Identity Documents - Student responsible' },
          { type: 'private_id_person', label: 'Identity Documents - Person responsible' },
          { type: 'private_proof_of_address', label: 'Proof of Address' },
          { type: 'private_3_months_payslips', label: '3 months latest Payslips' },
          { type: 'private_3_months_bank_statements', label: '3 months Bank statements' },
          { type: 'private_credit_check_proof_of_payment', label: 'Credit Check Proof of Payment' },
        ],
        'Business': [
          { type: 'business_student_registration', label: 'Student Registration Form' },
          { type: 'business_id_directors', label: 'Identity Documents of all Directors' },
          { type: 'business_proof_of_address', label: 'Proof of Address' },
          { type: 'business_cipc_documents', label: 'CIPC Documents' },
          { type: 'business_6_months_bank_statements', label: '6 Months Bank statements' },
          { type: 'business_credit_check_proof_of_payment', label: 'Credit Check Proof of Payment' },
        ],
        'Bursary Application': [
          { type: 'bursary_student_registration', label: 'Student Registration Form' },
          { type: 'bursary_confirmation', label: 'Confirmation of bursary' },
          { type: 'bursary_proof_of_address', label: 'Proof of Address' },
          { type: 'bursary_id_documents', label: 'Identity Documents' },
          { type: 'bursary_credit_check_proof_of_payment', label: 'Credit Check Proof of Payment' },
        ]
      }
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
      return this.$route.path.match(/\/admin\/users\/view\/[^/]+$/)
    },
    userCategory() {
      const uploadedTypes = this.userDetails.documents?.map(doc => doc.docType) || [];
      if (uploadedTypes.length === 0) return null;

      const firstDoc = uploadedTypes[0];
      if (firstDoc.startsWith('private_')) return 'Private Client';
      if (firstDoc.startsWith('business_')) return 'Business';
      if (firstDoc.startsWith('bursary_')) return 'Bursary Application';
      return null;
    },
    pendingRental() {
      return this.myRentals?.find(rental => rental.status === 'Pending' || rental.status === 'Active') || null;
    },
    rentalDocuments() {
      return this.pendingRental?.documents || [];
    },
    hasCreditCheckDocument() {
      return this.rentalDocuments.some(doc => doc.docType === 'Signed And Filled Application Form');
    },
    hasLeaseDocument() {
      return this.rentalDocuments.some(doc => doc.docType === 'Signed And Filled Lease Form');
    }
  },
  methods: {
    async fetchUserDetails() {
      this.currentUser = await Helper.fetchUserDetails();
      this.userDetails = await UserService.findUserById(this.userId);
      this.myRentals = await RentalService.findMyRentals(this.userId);
    },

    hasDocument(type) {
      return this.userDetails.documents?.some(doc => doc.docType === type);
    },

    viewDocument(document) {
      const url = Helper.getDocumentUrl(document);
      window.open(url, '_blank');
    },

    handleRentalDocumentClick(docType) {
      const doc = this.rentalDocuments.find(d => d.docType === docType);
      if (doc) {
        this.viewDocument(doc);
      } else {
        this.$q.notify({
          type: 'warning',
          message: `The ${docType} has not been uploaded yet.`
        });
      }
    },

    async deleteDocument(fileId) {
      const response = await UserService.removeUserDoc(this.userDetails._id, fileId);
      if (response) {
        this.$q.notify({ type: 'positive', color: 'primary', message: 'Delete successful!' });
        this.fetchUserDetails();
      }
    },

    async removeAllDocuments() {
      if (this.userDetails.documents.length > 0) {
        this.$q.dialog({
          title: 'Confirm',
          message: 'You are about to delete all your documents, continue?',
          color: 'primary',
          cancel: true,
          persistent: true
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
