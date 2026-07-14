<template>
  <q-page class="bg-grey-3">
    <div class="constrain-standard row justify-center q-py-md">

      <!-- Loading State -->
      <div v-if="loading" class="full-width full-height row justify-center items-center" style="min-height: 100vh;">
        <div class="text-center">
          <q-spinner size="50px" color="primary" />
          <div class="text-caption q-mt-sm text-grey-6">Loading application...</div>
        </div>
      </div>

      <!-- Already Submitted -->
      <q-card-section v-else-if="hasSubmittedDocument" class="column items-center full-width">
        <q-card class="q-pa-xl" style="max-width: 500px; width: 100%;">
          <q-card-section class="text-center">
            <q-icon name="check_circle" size="80px" color="positive" />
            <div class="text-h5 q-mt-md text-positive">Already Submitted!</div>
            <div class="text-subtitle1 q-mt-sm text-grey-7">
              Your application document has been successfully submitted.
            </div>
            <CustomButton label="Home" color="primary" textColor="white" to="/" customStyle="width: 150px;" class="q-mt-lg" />
          </q-card-section>
        </q-card>
      </q-card-section>

      <!-- Show Form -->
      <q-card-section v-else class="column items-center full-width">
        <DigitalApplicationForm :user="userDetails" :pendingRental="pendingRental" />
      </q-card-section>
    </div>
  </q-page>
</template>

<script>
import DigitalApplicationForm from 'src/components/user/DigitalApplicationForm.vue';
import UserService from 'src/services/UserService';
import RentalService from 'src/services/RentalService';
import DraftService from 'src/services/DraftService';
import CustomButton from 'src/components/elements/CustomButton.vue';

export default {
  data() {
    return {
      userDetails: {},
      myRentals: [],
      loading: true
    }
  },
  components: { DigitalApplicationForm, CustomButton },
  computed: {
    hasSubmittedDocument() {
      if (!this.myRentals || !Array.isArray(this.myRentals)) return false;

      const pendingRental = this.myRentals.find(rental => rental.status === 'Pending');
      if (!pendingRental) return false;
      if (!pendingRental.documents) return false;

      return pendingRental.documents.some(doc =>
        doc.docType === 'Signed And Filled Application Form'
      );
    },
    pendingRental() {
      if (!this.myRentals || !Array.isArray(this.myRentals)) return null;
      return this.myRentals.find(rental => rental.status === 'Pending') || null;
    },
  },
  methods: {
    async getUserInfo() {
      try {
        const userId = this.$route.query.userId;
        if (!userId) {
          console.warn('No userId in URL');
          return;
        }

        this.userDetails = await UserService.findDocsUserById(userId);
        this.myRentals = await RentalService.findMyDocsRentals(userId);
        // console.log('✅ User loaded:', this.userDetails);
        // console.log('📋 Rentals loaded:', this.myRentals);f
      } catch (error) {
        console.error('❌ Error loading user info:', error);
      }
    },
    async getAllDrafts() {
      try {
        this.allDrafts = await DraftService.getAllApplicationDrafts();
        // console.log("Drafts: ", this.allDrafts);
      } catch (error) {
        console.error('❌ Error loading drafts:', error);
      }
    }
  },
  async created() {
    this.loading = true;
    await this.getUserInfo();
    await this.getAllDrafts();
    this.loading = false;
  }
}
</script>
