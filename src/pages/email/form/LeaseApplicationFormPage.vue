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

      <!-- Access Denied -->
      <!-- <div v-else-if="!isAuthorized" class="full-width full-height row justify-center items-center"
        style="min-height: 100vh;">
        <q-card class="q-pa-xl" style="max-width: 500px; width: 100%;">
          <q-card-section class="text-center">
            <q-icon name="lock" size="80px" color="negative" />
            <div class="text-h5 q-mt-md text-negative">Access Denied</div>
            <div class="text-subtitle1 q-mt-sm text-grey-7">
              You don't have permission to view this application.
            </div>
            <p class="text-caption q-mt-md text-grey-6">
              Please check your email for the correct link or contact The-WEB team.
            </p>
            <CustomButton label="Home" color="primary" textColor="white" to="/" customStyle="width: 150px;"
              class="q-mt-lg" />
          </q-card-section>
        </q-card>
      </div> -->

      <!-- Email Verification Required -->
      <!-- <div v-else-if="needsEmailVerification" class="full-width full-height row justify-center items-center"
        style="min-height: 100vh;">
        <q-card class="q-pa-xl" style="max-width: 450px; width: 100%;">
          <q-card-section class="text-center">
            <q-icon name="email" size="60px" color="primary" />
            <div class="text-h6 q-mt-md">Verify Your Email</div>
            <div class="text-subtitle1 q-mt-sm text-grey-7">
              Please enter the email address where you received this link.
            </div>
          </q-card-section>
          <q-card-section>
            <q-input v-model="verificationEmail" label="Email Address" type="email" outlined dense
              placeholder="Enter your email address" :rules="[val => !!val || 'Email is required']"
              @keyup.enter="verifyEmail" />
            <div class="text-caption q-mt-sm text-grey-6">
              This must match the email on file for your application.
            </div>
          </q-card-section>
          <q-card-actions align="center">
            <CustomButton label="Verify & Continue" color="primary" textColor="white" @click="verifyEmail"
              customStyle="width: 100%;" :loading="verifying" />
          </q-card-actions>
          <q-card-section class="text-center q-pt-none">
            <div class="text-caption text-grey-6">
              Didn't receive an email? <a href="#" @click.prevent="resendEmail" style="color: #1976d2;">Resend link</a>
            </div>
          </q-card-section>
        </q-card>
      </div> -->

      <!-- Already Signed by This Role -->
      <!-- <div v-else-if="hasRoleSigned" class="full-width full-height row justify-center items-center"
        style="min-height: 100vh;">
        <q-card class="q-pa-xl" style="max-width: 500px; width: 100%;">
          <q-card-section class="text-center">
            <q-icon name="check_circle" size="80px" color="positive" />
            <div class="text-h5 q-mt-md text-positive">Already Signed!</div>
            <div class="text-subtitle1 q-mt-sm text-grey-7">
              You have already signed this application as <strong>{{ userRoleDisplay }}</strong>.
            </div>
            <CustomButton label="Home" color="primary" textColor="white" to="/" customStyle="width: 150px;"
              class="q-mt-lg" />
          </q-card-section>
        </q-card>
      </div> -->

      <!-- Already Submitted -->
      <q-card-section v-else-if="hasSubmittedDocument" class="column items-center full-width">
        <q-card class="q-pa-xl" style="max-width: 500px; width: 100%;">
          <q-card-section class="text-center">
            <q-icon name="check_circle" size="80px" color="positive" />
            <div class="text-h5 q-mt-md text-positive">Already Submitted!</div>
            <div class="text-subtitle1 q-mt-sm text-grey-7">
              Your application document has been successfully submitted.
            </div>
            <CustomButton label="Home" color="primary" textColor="white" to="/" customStyle="width: 150px;"
              class="q-mt-lg" />
          </q-card-section>
        </q-card>
      </q-card-section>

      <!-- Show Form -->
      <q-card-section v-else class="column items-center full-width">

        <!-- <div class="text-caption q-mb-md text-grey-6">
          Signing as: <strong>{{ userRoleDisplay }}</strong>
        </div> -->

        <!-- <LeaseApplicationForm :user="userDetails" :pendingRental="pendingRental" :userRole="userRole" /> -->

        <LeaseApplicationForm :user="userDetails" :pendingRental="pendingRental" />
      </q-card-section>
    </div>
  </q-page>
</template>

<script>
import LeaseApplicationForm from 'src/components/user/LeaseApplicationForm.vue';
import UserService from 'src/services/api/UserService';
import RentalService from 'src/services/api/RentalService';
import DraftService from 'src/services/api/DraftService.js';
import CustomButton from 'src/components/elements/CustomButton.vue';

export default {
  data() {
    return {
      userDetails: {},
      myRentals: [],
      loading: true,
    }
  },
  components: { LeaseApplicationForm, CustomButton },
  computed: {
    hasSubmittedDocument() {
      if (!this.myRentals || !Array.isArray(this.myRentals)) return false;

      const pendingRental = this.myRentals.find(rental => rental.status === 'Pending');
      if (!pendingRental) return false;
      if (!pendingRental.documents) return false;

      return pendingRental.documents.some(doc =>
        doc.docType === 'Signed And Filled Lease Form'
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
        console.log('User loaded:', this.userDetails);
        console.log('Rentals loaded:', this.myRentals);
      } catch (error) {
        console.error('Error loading user info:', error);
      }
    },

    // There should only be 1 draft inside here.
    // The previous digitalApplication draft would have been deleted

    async getAllDrafts() {
      try {
        this.allDrafts = await DraftService.getAllApplicationDrafts();
      } catch (error) {
        console.error('Error loading drafts:', error);
      }
    },
  },
  async created() {
    this.loading = true;

    await this.getUserInfo();
    await this.getAllDrafts();

    this.loading = false;
  },

  // async created() {
  //   this.loading = true;

  //   const isValid = await this.validateAccess();

  //   if (isValid && !this.needsEmailVerification) {
  //     await this.getUserInfo();
  //     await this.getAllDrafts();
  //   }

  //   this.loading = false;
  // }

}
</script>
