<template>
  <q-page>
    <q-img src="" alt="Hero Image" style="width: 100%; height: 100vh;">
      <div class="absolute-full row justify-center items-center text-black">

        <q-card class="column q-pa-lg bg-white" style="max-width: 430px;">
          <div class="row justify-center">
            <p class="q-mb-md text-h6">CREATE A NEW ACCOUNT</p>
          </div>
          <br>
          <div class="q-gutter-lg q-mb-md">
            <div style="display: flex;" class="justify-start ">
              <q-input filled label-color="black" color="black" v-model="user.firstName" label="First Name *" class="q-mr-md" />
              <q-input filled label-color="black" color="black" v-model="user.lastName" label="Last Name *" class="" />
            </div>
            <div style="display: flex;" class="justify-start ">
              <q-input filled label-color="black" color="black" v-model="user.username" label="Username *" class="q-mr-md" />
              <q-input filled label-color="black" color="black" v-model="user.email" label="Email *" class="" />
            </div>

            <div class="row justify-start">
              <q-input filled label-color="black" color="black" v-model="user.phone" label="Phone Number *" class="col-12" />
            </div>

            <div class="row justify-start">
              <q-input filled label-color="black" color="black" v-model="user.password" label="Password *" type="password" class="col-12" />
            </div>
          </div>

          <div class="column col-12 col-md-4 text-center">
            <div class="q-mb-sm">
              <router-link to="/auth/login" class="" style="text-decoration: underline; color: black;">
                Already a member, login instead?
              </router-link>
            </div>
            <div>
              <p class="text-caption">By signing up, you acknowledge and agree to The Webs’s Terms of Service.</p>
              <CustomButton color="brown" label="Create your account" @click="onSubmit" />
            </div>
          </div>
        </q-card>
      </div>
    </q-img>
  </q-page>
</template>


<script>
import UserService from 'src/services/UserService'
import Helper from 'src/services/utils'
import CustomButton from 'src/components/elements/CustomButton.vue'

export default {
  name: "RegisterPage",
  data() {
    return {
      user: { firstName: '', lastName: '', email: '', phone: '', username: '', password: '' }
    }
  },
  components: {
    CustomButton
  },
  methods: {
    validateText: Helper.validateText,
    validateEmail: Helper.validateEmail,
    validatePhone: Helper.validatePhone,
    validateUsername: Helper.validateUsername,
    validatePassword: Helper.validatePassword,
    validateFields() {
      const details = this.user
      const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'username', 'password']
      for (const field of requiredFields) {
        if (!details[field]) {
          this.$q.notify({ type: 'negative', message: `Please fill in all the fields.` })
          return false
        }
      }
      if (!this.validateEmail(details.email)) {
        this.$q.notify({ type: 'negative', message: 'Invalid email address.' })
        return false
      }
      if (!this.validatePhone(details.phone)) {
        this.$q.notify({ type: 'negative', message: 'Invalid phone number.' })
        return false
      }
      if (!this.validateUsername(details.username)) {
        this.$q.notify({ type: 'negative', message: 'Invalid username.' })
        return false
      }
      if (!this.validatePassword(details.password)) {
        this.$q.notify({ type: 'negative', message: 'Password must be at least 8 characters long and include at least one letter and one number.' })
        return false
      }
      return true
    },
    async onSubmit() {
      try {
        if (this.validateFields()) {
          const response = await UserService.register(this.user)
          if (response) {
            this.$q.notify({ type: 'positive', color: 'primary', message: 'Please check your email to verify your account.' })
            this.$router.push('/auth/login')
          } else {
            this.$q.notify({ type: 'negative', message: 'Registration failed. Please try again!' })
            this.onReset()
          }
        }
      } catch (error) {
        if (error.response && (error.response.status === 401 || error.response.status === 400)) {
          this.$q.notify({ type: 'negative', color: 'red', message: 'Username or email already exists. Please try again!' })
        } else {
          this.$q.notify({ type: 'negative', color: 'red', message: 'Registration failed. Please try again!' })
        }
      }
    },
    onReset() {
      this.user = { firstName: '', lastName: '', email: '', phone: '', username: '', password: '' }
    }
  }
}
</script>
