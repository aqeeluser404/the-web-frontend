<template>
  <q-page>
    <div class="background-wrapper">
      <q-img src="~src/assets/resources/home/hero/h3.jpg" alt="Hero Image" class="blurred-background"/>
    </div>
    <div class="absolute-full column justify-center items-center text-black">
      <q-card>
        <q-card-section class="column items-center">
          <div class="text-h6">Resend Verification Email</div>
        </q-card-section>

        <q-card-section>
          <q-input filled v-model="email" label="Enter email for the verification code" style="width: 100%;" class="q-mb-md"/>
          <CustomButton label="Send Verification" icon="eva-email-outline" @click="resendVerificationEmail" />
          <CustomButton label="Home" to="/" color="white" text-color="black" class="q-mt-md" />
        </q-card-section>

        <q-card-section v-if="message" class="column items-center">
          <div>{{ message }}</div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<style scoped lang="sass">
.background-wrapper
  position: fixed
  width: 100%
  height: 100vh
  overflow: hidden
  z-index: -1

.blurred-background
  width: 100%
  height: 100%
  object-fit: cover
  filter: blur(8px)
  transform: scale(1.1)
</style>

<script>
import EmailService from 'src/services/api/EmailService';
import CustomButton from 'src/components/elements/CustomButton.vue'
import Helper from 'src/services/utils'

export default {
  data() {
    return {
      email: '',
      message: ''
    }
  },
  components: {
    CustomButton
  },
  methods: {
    validateEmail: Helper.validateEmail,
    validateFields() {
      if (!this.validateEmail(this.email)) {
        this.$q.notify({ type: 'negative', message: 'Invalid email address.' })
        return false
      }
      return true
    },
    async resendVerificationEmail() {
      if (this.email !== '') {
        try {
          if (this.validateFields()) {
            const response = await EmailService.resendVerificationEmail(this.email)
            if (response) {
              this.message = 'Verification email resent successfully!'
              this.$q.dialog({
                title: 'Success',
                message: 'Verification email resent successfully!',
                color: 'primary',
                persistent: true,
              }).onOk(() => {
                // this.$router.push('/units/apply');
              });
              // this.$q.notify({ type: 'positive', color: 'primary', message: 'Verification email resent successfully!' })
              // this.message = 'Verification email resent successfully!'
            } else {
              this.$q.notify({ type: 'negative', message: 'Error resending verification email.' })
              this.message = 'Error resending verification email.'
            }
          }
        } catch (error) {
          this.$q.notify({ type: 'negative', message: 'An error occurred while resending the verification email. Please try again later.' })
          this.message = 'Please provide the email used for registration.'
        }
      } else {
        this.$q.notify({ type: 'negative', message: 'Please provide your email address to resend the verification email.' })
      }
    }
  }
}
</script>
