<template>
  <q-page>
    <div class="background-wrapper">
      <q-img src="~src/assets/resources/home/hero/h3.jpg" alt="Hero Image" class="blurred-background"/>
    </div>
    <div class="absolute-full column justify-center items-center text-black">
      <q-card>
        <q-card-section class="column items-center">
          <div class="text-h6">Forgot Password</div>
        </q-card-section>

        <q-card-section>
          <q-input filled label-color=black color="black" v-model="email" label="Email to reset your password" style="width: 100%;" class="q-mb-md" />
          <CustomButton @click="ForgotPassword" icon="eva-email-outline" label="Send Code" />
          <CustomButton to='auth/login' color="white" text-color="black" label="Return to Login" class="q-mt-md" />
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
import CustomButton from 'src/components/elements/CustomButton.vue';

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
          // this.$q.notify({ type: 'positive', color: 'primary', message: 'An email has been sent to reset your password!' })
          // this.$router.push('/')
            this.$q.dialog({
              title: 'Success',
              message: 'An email has been sent with instructions to reset your password.',
              color: 'primary',
              persistent: true,
            }).onOk(() => {
              this.$router.push('/');
            });
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
