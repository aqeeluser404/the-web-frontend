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
      <div v-else-if="!isAuthorized" class="full-width full-height row justify-center items-center"
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
      </div>

      <!-- Email Verification Required -->
      <div v-else-if="needsEmailVerification" class="full-width full-height row justify-center items-center"
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
      </div>

      <!-- Already Signed by This Role -->
      <div v-else-if="hasRoleSigned" class="full-width full-height row justify-center items-center"
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
            <CustomButton label="Home" color="primary" textColor="white" to="/" customStyle="width: 150px;"
              class="q-mt-lg" />
          </q-card-section>
        </q-card>
      </q-card-section>

      <!-- Show Form -->
      <q-card-section v-else class="column items-center full-width">
        <div class="text-caption q-mb-md text-grey-6">
          Signing as: <strong>{{ userRoleDisplay }}</strong>
        </div>
        <DigitalApplicationForm :user="userDetails" :pendingRental="pendingRental" :userRole="userRole" />
      </q-card-section>
    </div>
  </q-page>
</template>

<script>
import DigitalApplicationForm from 'src/components/user/DigitalApplicationForm.vue';
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
      isAuthorized: false,
      userRole: null,
      userToken: null,
      needsEmailVerification: false,
      verificationEmail: '',
      verifying: false,
      verifiedDeviceId: null
    }
  },
  components: { DigitalApplicationForm, CustomButton },
  computed: {
    userRoleDisplay() {
      const roleMap = {
        'tenant': 'Tenant',
        'guardian': 'Parent/Guardian'
      };
      return roleMap[this.userRole] || this.userRole;
    },
    hasRoleSigned() {
      if (!this.pendingRental || !this.pendingRental.signingTokens) return false;
      if (!this.userRole) return false;

      const roleData = this.pendingRental.signingTokens[this.userRole];
      return roleData && roleData.signed === true;
    },
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
    async validateAccess() {
      try {
        const userId = this.$route.query.userId;
        const role = this.$route.query.role;
        const token = this.$route.query.token;

        console.log('Validating access:', { userId, role, token });

        if (!userId || !role || !token) {
          console.log('Missing userId, role, or token');
          this.isAuthorized = false;
          return false;
        }

        if (role !== 'tenant' && role !== 'guardian') {
          console.log('Invalid role:', role);
          this.isAuthorized = false;
          return false;
        }

        // Validate token on backend
        const validation = await UserService.validateSignerToken(userId, role, token);
        console.log('Validation response:', validation);

        if (validation.valid) {
          this.isAuthorized = true;
          this.userRole = role;
          this.userToken = token;

          // Check if email verification is needed
          if (validation.needsVerification) {
            this.needsEmailVerification = true;
          } else {
            this.needsEmailVerification = false;
          }

          console.log('Access granted for role:', role);
          return true;
        } else {
          console.log('Invalid token or role');
          this.isAuthorized = false;
          return false;
        }
      } catch (error) {
        console.error('Token validation error:', error);
        this.isAuthorized = false;
        return false;
      }
    },

    async verifyEmail() {
      if (!this.verificationEmail) {
        this.$q.notify({ type: 'warning', message: 'Please enter your email address.' });
        return;
      }

      this.verifying = true;

      try {
        const userId = this.$route.query.userId;
        const role = this.$route.query.role;
        const token = this.$route.query.token;

        const response = await UserService.verifySignerEmail({
          userId,
          role,
          token,
          email: this.verificationEmail
        });

        if (response.valid) {
          this.needsEmailVerification = false;
          this.isAuthorized = true;
          this.verifiedDeviceId = response.deviceId;

          // Save device ID to localStorage
          localStorage.setItem('verifiedDeviceId', response.deviceId);

          this.$q.notify({
            type: 'positive',
            message: 'Email verified successfully!'
          });

          // Load user data
          await this.getUserInfo();
          await this.getAllDrafts();

        } else {
          this.$q.notify({
            type: 'negative',
            message: response.message || 'Email does not match. Please check your email.'
          });
        }
      } catch (error) {
        console.error('❌ Email verification error:', error);
        this.$q.notify({
          type: 'negative',
          message: 'Verification failed. Please try again.'
        });
      } finally {
        this.verifying = false;
      }
    },

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

    async getAllDrafts() {
      try {
        this.allDrafts = await DraftService.getAllApplicationDrafts();
      } catch (error) {
        console.error('Error loading drafts:', error);
      }
    },

    async resendEmail() {
      try {
        await EmailService.resendSignerLink({
          userId: this.$route.query.userId,
          role: this.userRole
        });
        this.$q.notify({
          type: 'positive',
          message: 'Link resent to your email!'
        });
      } catch (error) {
        console.error('Error resending email:', error);
        this.$q.notify({
          type: 'negative',
          message: 'Failed to resend email. Please try again.'
        });
      }
    }
  },
  async created() {
    this.loading = true;

    const isValid = await this.validateAccess();

    if (isValid && !this.needsEmailVerification) {
      await this.getUserInfo();
      await this.getAllDrafts();
    }

    this.loading = false;
  }
}
</script>
