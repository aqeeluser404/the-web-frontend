<template>
  <q-page>
    <q-img src="" alt="Hero Image" style="width: 100%; height: 100vh;" >
      <div class="absolute-full column justify-center items-center text-black">
        <q-card>

          <q-card-section class="column items-center">
            <div class="text-h6">Verify Email</div>
          </q-card-section>

          <q-card-section>
            <CustomButton v-if="success" label="Home" to="/" color="black" text-color="white" />
            <CustomButton v-if="!success" label="Resend Verification" to="/resend-verification" color="black" text-color="white" icon="eva-email-outline" />
          </q-card-section>

          <q-card-section v-if="message" class="column items-center">
            <div>{{ message }}</div>
          </q-card-section>

        </q-card>
      </div>
    </q-img>
  </q-page>
</template>

<script>
import EmailService from 'src/services/EmailService'
import CustomButton from 'src/components/CustomButton.vue'

export default {
  data() {
    return {
      message: '',
      success: false
    };
  },
  components: {
    CustomButton
  },
  async created() {
    await this.verifyEmail();
  },
  methods: {
    async verifyEmail() {
      const token = this.$route.query.token;
      if (token) {
        try {
          await EmailService.verifyEmail(token);
          this.$q.notify({ type: 'positive', color: 'primary', message: 'Email verified successfully!' });
          this.message = 'Email verified successfully!';
          this.success = true;

        } catch (error) {
          if (error.response && (error.response.status === 401 || error.response.status === 400)) {
            this.$q.notify({ type: 'negative', message: 'The token may be invalid or expired. Please try again.' });
            this.message = 'Error verifying email. The token may be invalid or expired.';
            this.success = false;

          } else {
            this.$q.notify({ type: 'negative', message: 'An unexpected error occurred. Please try again later.' });
            this.message = 'An unexpected error occurred. Please try again later.';
            this.success = false;

          }
        }
      } else {
        this.message = 'Invalid verification link.';
        this.success = false;
      }
    }
  }
}
</script>
