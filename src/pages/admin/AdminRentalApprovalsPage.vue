<template>
  <q-page>
    <div class="q-pa-md row justify-center">

      <q-card flat class="col-md-12 col-12 q-ma-sm">

        <q-card-section>
          <q-timeline :layout="layout" color="secondary">
            <q-timeline-entry heading class="text-h6">
              Rental Application Process
            </q-timeline-entry>
            <!-- Account creation -->
            <q-timeline-entry
              title="Account Creation" icon="eva-people" side="right" color="orange" :subtitle="formatDate(rental.userDateCreated)"
            >
              <div class="q-mb-md" style="text-decoration: underline;">Applicant Details</div>
              <ul>
                <li>First Name: {{ capitalizeFirstLetter(rental.userFirstName) }}</li>
                <li>Last Name: {{ capitalizeFirstLetter(rental.userLastName) }}</li>
                <li>Username: {{ rental.userUsername }}</li>
                <li>Phone: {{ rental.userPhone }}</li>
                <li>Email: {{ rental.userEmail }}</li>
              </ul>
            </q-timeline-entry>

            <!-- Account verification -->
            <q-timeline-entry
              v-if="rental.userVerified === true"
              title="Account has been Verified" icon="done_all" side="left" />

            <q-timeline-entry
              v-if="rental.userVerified === false"
              title="Account has not been Verified" color="red" icon="close" side="left" />

            <!-- Rental creation -->
            <q-timeline-entry
              title="Rental Creation" :subtitle="formatDate(rental.applicationDate)" icon="done_all" side="right"
            >
              <div class="q-mb-md">
                <span style="text-decoration: underline;">Rental Details</span>
              </div>
              <div class="">
                Applicant has applied for a <b>{{rental.unitType}}</b> unit.
              </div>
              <div class="q-mb-md" v-if="rental.accessKey">
                <span style="">This user is sharing a access key.</span>
              </div>
              <div class="q-mb-md" v-if="rental.accessKey">
                Access Key: <span style="text-transform: uppercase; cursor: pointer; color: brown;" @click.stop="copyToClipboard(rental.accessKey)"><b>{{ rental.accessKey }}</b></span>
              </div>
              <ul>
                <li>
                  <span>Unit Number:</span> {{ rental.unitNumber }}
                </li>
                <li>
                  <span>Application Date:</span> {{ formatDate(rental.applicationDate) }}
                </li>
                <li v-if="rental.rentalStartDate">
                  Start Date: {{ formatDate(rental.rentalStartDate) }}
                </li>
                <li v-if="rental.rentalEndDate">
                  End Date: {{ formatDate(rental.rentalEndDate) }}
                </li>
                <!-- <li v-if="rental.accessKey">
                  Access Key: <span style="text-transform: uppercase; cursor: pointer; color: brown;" @click.stop="copyToClipboard(rental.accessKey)"><b>{{ rental.accessKey }}</b></span>
                </li> -->
              </ul>
            </q-timeline-entry>

            <!-- Documents upload -->
            <q-timeline-entry
              v-if="rental.userDocuments && rental.userDocuments.length === 3"
              title="Documents have been Uploaded" side="left" icon="done_all" />

            <q-timeline-entry
              v-else
              title="Documents have not been Uploaded" side="left" color="red" icon="close" />

            <q-timeline-entry
              v-if="rental.status === 'Active' || rental.status === 'Ended'"
              title="Documents have been Approved" side="right" icon="done_all" />

            <!-- Document Approvals -->
            <q-timeline-entry
              v-else
              title="Document Approval" side="right" color="grey" icon="eva-file-text-outline"
            >
              <div class="q-mb-md"  style="cursor: pointer; text-decoration: underline;" @click="openUserDocumentsDialog">Please verify if the following documents are valid.</div>
              <ul>
                <li>Proof of Residential Address</li>
                <li>South African Identity Document (ID) or Passport</li>
                <li>Three Months' Bank Statements</li>
                <li>Documents are automatically approved once the rental has been approved</li>
              </ul>
            </q-timeline-entry>

            <!-- Rental Approvals -->
            <q-timeline-entry
              v-if="rental.status === 'Pending'"
              title="Approve Rental" color="grey" icon="eva-briefcase-outline" side="left"
            >
              <div class="q-mb-md"></div>
              <div @click="openRentalApprovalDialog" style="cursor: pointer; text-decoration: underline;">
                Approve the rental information and desired lease period.
              </div>
            </q-timeline-entry>

            <!-- rejected rental -->
            <q-timeline-entry
              v-if="rental.status === 'Rejected'"
              title="Rental has been Rejected" icon="close" color="red" side="left" />

            <!-- approved rental -->
            <q-timeline-entry
              v-if="rental.status === 'Active'"
              title="Rental has been Approved" :subtitle="formatDate(rental.rentalStartDate)" icon="done_all" side="left" />

            <!-- scheduled ended rental -->
            <q-timeline-entry
              v-if="rental.status === 'Ended' && rental.earlyEndDate === null"
              title="Rental has ended" :subtitle="formatDate(rental.rentalEndDate)" :body="`The rental period concluded as scheduled.`" icon="done_all" side="left" color="orange" />

            <!-- early ended rental -->
            <q-timeline-entry
              v-if="rental.status === 'Ended' && rental.earlyEndDate !== null"
              title="Rental has ended" :subtitle="formatDate(rental.earlyEndDate)" :body="`The rental period concluded ahead of the scheduled end date.`" icon="done_all" side="left" color="orange" />
          </q-timeline>
        </q-card-section>
      </q-card>
    </div>

    <q-dialog v-model="documentDialog">
      <AdminDocumentApprovalComponent :documents="rental.userDocuments" @close="handleDialogClose" />
    </q-dialog>

    <q-dialog v-model="rentalDialog">
      <AdminRentalApprovalComponent :rental="rental" @close="handleRentalDialogClose" />
    </q-dialog>
  </q-page>
</template>

<script>
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import RentalService from 'src/services/RentalService';
import UnitService from 'src/services/UnitService';
import UserService from 'src/services/UserService';
import Helper from 'src/services/utils';
import CustomButton from 'src/components/elements/CustomButton.vue';
import AdminDocumentApprovalComponent from 'src/components/admin/AdminDocumentApprovalComponent.vue';
import AdminRentalApprovalComponent from 'src/components/admin/AdminRentalApprovalComponent.vue';

export default {
  name: "AdminRentalDetails",

  data() {
    return {
      rental: {},
      body: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nunc nec ultricies posuere, nunc nunc',
      documentDialog: false,
      rentalDialog: false
    }
  },
  components: {
    CustomButton,
    AdminDocumentApprovalComponent,
    AdminRentalApprovalComponent
  },
  computed: {
    layout() {
      return this.$q.screen.lt.sm ? 'dense' : (this.$q.screen.lt.md ? 'comfortable' : 'loose');
    }
  },
  created() {
    this.fetchRentalDetails()
  },
  methods: {
    formatDate: Helper.formatDate,
    capitalizeFirstLetter: Helper.capitalizeFirstLetter,

    copyToClipboard(text) {
      navigator.clipboard.writeText(text)
        .then(() => {
          this.$q.notify({ type: 'positive', color: 'primary', message: 'Access key copied to clipboard!' });
        }).catch(err => {
          this.$q.notify({ type: 'negative', message: `Failed to copy text: ${err}` });
        })
    },

    openRentalApprovalDialog() {
      this.rentalDialog = true;
    },
    handleRentalDialogClose() {
      this.rentalDialog = false;
      this.fetchRentalDetails()
    },
    openUserDocumentsDialog() {
      this.documentDialog = true;
    },
    handleDialogClose() {
      this.documentDialog = false;
      this.fetchRentalDetails()
    },
    async fetchRentalDetails() {
      const encryptedId = this.$route.params.id;
      const decryptedBytes = AES.decrypt(decodeURIComponent(encryptedId), 'secret-key');
      const decryptedId = decryptedBytes.toString(Utf8);

      const response = await RentalService.findRentalById(decryptedId);

      const unit = await UnitService.getByIdUnit(response.unit);
      const user = await UserService.findUserById(response.user);

      this.rental = {
        ...response,

        unitNumber: unit.unitNumber,
        unitPrice: unit.unitPrice,
        unitType: unit.unitType,

        userId: user._id,
        userUsername: user.username,
        userFirstName: user.firstName,
        userLastName: user.lastName,
        userEmail: user.email,
        userPhone: user.phone,
        userDateCreated: user.dateCreated,
        userVerified: user.verification.isVerified,
        userDocuments: user.documents
      };

      // console.log(this.rental.userDocuments)
    },
  }
}
</script>
