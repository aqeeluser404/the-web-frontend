<template>
  <q-page>
    <div class="background-wrapper">
      <q-img src="~src/assets/resources/home/hero/h3.jpg" alt="Hero Image" class="blurred-background"/>
    </div>
    <div class="absolute-full column justify-center items-center text-black">
      <q-card>
        <q-card-section class="column items-center">
          <div class="text-h6">Reset Password</div>
        </q-card-section>

        <q-card-section>
          <q-input filled v-model="password" label="Enter your new password *" type="password" style="width: 100%;" class="q-mb-md"/>
          <q-input filled v-model="confirmPassword" label="Confirm your new Password *" type="password" style="width: 100%;" class="q-mb-md"/>
          <CustomButton @click="ResetPassword" icon="eva-email-outline" type="password" label="Change Password" />
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
import CustomButton from 'src/components/elements/CustomButton.vue';
import EmailService from 'src/services/api/EmailService';
import Helper from 'src/services/utils'

export default {
  name: "ResetPasswordPage",

  data() {
    return {
      message: '',
      password: '',
      confirmPassword: ''
    }
  },
  components: {
    CustomButton
  },
  methods: {
    validatePassword: Helper.validatePassword,
    validateFields() {
      if (this.password && !this.validatePassword(this.password)) {
        this.$q.notify({ type: 'negative', message: 'Password must be at least 8 characters long and include at least one letter and one number.' });
        return false;
      }
      return true;
    },
    async ResetPassword() {
      if (this.password !== this.confirmPassword) {
        this.$q.notify({
          type: 'negative',
          color: 'red',
          message: 'Passwords do not match. Please try again!',
        });
        return;
      }
      const token = this.$route.query.token;
      if (this.password !== '') {
        if (this.validateFields()) {
          if (token) {
            const response = await EmailService.ResetPassword(token, this.password)
            if (response) {

              this.$q.dialog({
                title: 'Success',
                message: 'Password reset successful!',
                color: 'primary',
                persistent: true,
              }).onOk(() => {
                this.$router.push('/auth/login')
              });
              // this.$q.notify({ type: 'positive', color: 'primary', message: 'Password reset successful!' })
              // this.$router.push('/auth/login')
            } else {
              this.$q.notify({ type: 'negative', message: 'Password reset failed. Please try again.' })
              this.onReset()
            }
          } else {
            this.$q.notify({ type: 'negative', message: 'The token may be invalid or expired. Please try again.' })
          }
        }
      } else {
        this.$q.notify({ type: 'negative', message: 'Please fill in all the fields.' })
      }
    },
    onReset() {
      this.password = ''
    }
  }
}
</script>
