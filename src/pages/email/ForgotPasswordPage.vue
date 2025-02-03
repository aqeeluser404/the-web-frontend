<template>
  <q-page>
    <q-img src="" alt="Hero Image" style="width: 100%; height: 100vh;" >
      <div class="absolute-full column justify-center items-center text-black">
        <q-card>

          <q-card-section class="column items-center">
            <div class="text-h6">Forgot Password</div>
          </q-card-section>

          <q-card-section>
            <q-input filled label-color=black color="black" v-model="email" label="Email to reset your password" style="width: 100%;" class="q-mb-md" />
            <CustomButton @click="ForgotPassword" icon="eva-email-outline" color="brown" text-color="white" label="Send Code" />
            <CustomButton to='auth/login' color="white" text-color="black" label="Return to Login" class="q-mt-md" />
          </q-card-section>

        </q-card>
      </div>
    </q-img>
  </q-page>
</template>

<script>
import EmailService from 'src/services/EmailService'
import CustomButton from 'src/components/CustomButton.vue';

export default {
  name: "ForgotPasswordPage",

  data() {
    return {
      email: ''
    }
  },
  components: {
    CustomButton
  },
  methods: {
    async ForgotPassword() {
      if (this.email === '' || null) {
        this.$q.notify({ type: 'negative', message: 'Please fill in the email field.' })
      } else {
        const response = await EmailService.ForgotPassword(this.email)
        if (response) {
          this.$q.notify({ type: 'positive', color: 'primary', message: 'An email has been sent to reset your password!' })
          this.$router.push('/')
        } else {
          this.$q.notify({ type: 'negative', message: 'Sending email failed. Please try again.' })
          this.onReset()
        }
      }
    },
    onReset() {
      this.email = ''
    }
  }
}
</script>
