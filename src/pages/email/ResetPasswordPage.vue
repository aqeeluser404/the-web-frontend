<template>
  <q-page>
    <q-img src="" alt="Hero Image" style="width: 100%; height: 100vh;" >
      <div class="absolute-full column justify-center items-center text-black">
        <q-card>

          <q-card-section>
            <div class="text-h6">Reset Password</div>
          </q-card-section>

          <q-card-section>
            <q-input filled v-model="password" label="Enter your new password *" style="width: 100%;" class="q-mb-md"/>
            <CustomButton @click="ResetPassword" icon="eva-email-outline" label="Change Password" />
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
import CustomButton from 'src/components/CustomButton.vue';
import EmailService from 'src/services/EmailService'
import Helper from 'src/services/utils'

export default {
  name: "ResetPasswordPage",

  data() {
    return {
      message: '',
      password: ''
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
      const token = this.$route.query.token;
      if (this.password !== '') {
        if (this.validateFields()) {
          if (token) {
            const response = await EmailService.ResetPassword(token, this.password)
            if (response) {
              this.$q.notify({ type: 'positive', color: 'primary', message: 'Password reset successful!' })
              this.$router.push('/auth/login')
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
