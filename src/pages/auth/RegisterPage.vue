<template>
  <q-page>
    <div class="background-wrapper">
      <q-img
        src="~src/assets/resources/login/outside3.jpg"
        alt="Hero Image"
        class="blurred-background"
      />
    </div>

      <div class="absolute-full q-ma-xl row justify-center">
        <q-card class="q-pa-lg bg-white" style="max-width: 100%;">
          <!-- <div class="row justify-center">
            <p class="q-mb-md text-h6">CREATE A NEW ACCOUNT</p>
          </div> -->

          <div class="q-gutter-lg  q-mb-xl ">
            <q-card-section>
              <router-link to="/auth/login" style="text-decoration: none; color: black;">
                <q-icon name="eva-arrow-back-outline" size="24px" color="black" />
              </router-link>
            </q-card-section>
            <q-card-section class="row justify-around  q-py-none">
              <q-input filled style="width: 48%;" label-color="black" color="black" v-model="user.firstName" label="First Name *" />
              <q-input filled style="width: 48%;" label-color="black" color="black" v-model="user.lastName" label="Last Name *" />
            </q-card-section>
            <q-card-section class="row justify-around  q-py-none">
              <q-input filled style="width: 48%;" label-color="black" color="black" v-model="user.username" label="Username *" />
              <q-input filled style="width: 48%;" label-color="black" color="black" v-model="user.email" label="Email *" />
            </q-card-section>

            <q-card-section class="row justify-center q-py-none">
              <q-select filled style="width: 98%;" v-model="user.gender" label-color="black" color="black" label="Gender *" :options="userGenderOptions" emit-value map-options />
            </q-card-section>

            <q-card-section class="row justify-center q-py-none">
              <q-input filled style="width: 98%;" label-color="black" color="black" v-model="user.phone" label="Phone Number *" />
            </q-card-section>

            <q-card-section class="row justify-center q-py-none">
              <q-input filled style="width: 98%;" label-color="black" color="black" v-model="user.password" label="Password *" type="password" />
            </q-card-section>

            <q-card-section class="row justify-center q-py-none">
              <q-input filled style="width: 98%;" label-color="black" color="black" v-model="confirmPassword" label="Confirm Password *" type="password" />
            </q-card-section>

            <q-card-section class="row justify-between q-py-none">
              <q-radio style="width: 48%;" v-model="user.studentInfo.isRegisteredStudent" :val="true" label="Registered student" />
              <q-radio style="width: 48%;" v-model="user.studentInfo.isRegisteredStudent" :val="false" label="Unregistered student" />
            </q-card-section>

            <q-card-section class="row justify-between q-py-none">
              <q-radio style="width: 48%;" v-model="user.studentInfo.hasBursary" :val="true" label="I am a bursary recipient" />
              <q-radio style="width: 48%;" v-model="user.studentInfo.hasBursary" :val="false" label="I am not a bursary recipient" />
            </q-card-section>

            <q-card-section v-if="user.studentInfo.isRegisteredStudent === true" class="row justify-center q-py-none">
              <q-input filled style="width: 98%;" label-color="black" color="black" v-model="user.studentInfo.studentNumber" label="Student Number *" />
            </q-card-section>

            <q-card-section v-if="user.studentInfo.isRegisteredStudent === true" class="row justify-center q-py-none">
              <q-input filled style="width: 98%;" label-color="black" color="black" v-model="user.studentInfo.registeredInstitution" label="Registered Institution *" />
            </q-card-section>
          </div>
          <br>
          <div class="q-gutter-sm">
            <!-- <q-card-section class="row justify-start q-py-none">
              <router-link to="/auth/login" class="" style="text-decoration: none; color: black;">
                Already a member, login instead?
              </router-link>
            </q-card-section> -->
            <!-- <br /> -->
            <!-- <q-card-section class="row justify-start q-py-none">
              <p>By signing up, you acknowledge and agree to The Webs’s Terms of Service.</p>
            </q-card-section> -->
            <q-card-section class="row justify-start q-py-none">
              <CustomButton label="Create your account" @click="onSubmit" />
            </q-card-section>
          </div>
        </q-card>
      </div>
  </q-page>
</template>

<style lang="sass">
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
import UserService from 'src/services/UserService'
import Helper from 'src/services/utils'
import CustomButton from 'src/components/elements/CustomButton.vue'

export default {
  name: "RegisterPage",
  data() {
    return {

      user: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        username: '',
        password: '',
        gender: '',
        studentInfo: {
          isRegisteredStudent: true,
          studentNumber: '' ,
          registeredInstitution: '',
          hasBursary: false
        },
        confirmPassword: ''
      },

      userGenderOptions: [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' }
      ]
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

      const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'username', 'password', 'gender']
      for (const field of requiredFields) {
        if (!details[field]) {
          this.$q.notify({ type: 'negative', message: `Please fill in all the fields.` })
          return false
        }
      }

      const studentInfo = this.user.studentInfo
      if (studentInfo.isRegisteredStudent) {
        if (studentInfo.studentNumber === '') {
          this.$q.notify({ type: 'negative', message: `Please fill in all the fields.` })
          return false
        }
        if (studentInfo.registeredInstitution === '') {
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
        this.$q.notify({
          type: 'negative',
          message: 'Password must be 8-64 characters, with at least 1 uppercase, 1 lowercase, 1 number, and 1 special character (@$!%*?&).'        });
        return false;
      }
      return true
    },
    async onSubmit() {
      try {
          if (this.user.password !== this.confirmPassword) {
            this.$q.notify({
              type: 'negative',
              color: 'red',
              message: 'Passwords do not match. Please try again!',
            });
            return;
          }
        const userDetails = {
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          email: this.user.email,
          phone: this.user.phone,
          username: this.user.username,
          password: this.user.password,
          gender: this.user.gender,
          studentInfo: {
            isRegisteredStudent: this.user.studentInfo.isRegisteredStudent,
            studentNumber: this.user.studentInfo.studentNumber,
            registeredInstitution: this.user.studentInfo.registeredInstitution,
            hasBursary: this.user.studentInfo.hasBursary
          }
        }
        if (this.validateFields()) {
          const response = await UserService.register(userDetails)
          if (response) {

            this.$q.dialog({
              title: 'Success',
              message: 'Please check your email to verify your account.',
              color: 'primary',
              persistent: true,
            }).onOk(() => {
              this.$router.push('/auth/login')
            });
            // this.$q.notify({ type: 'positive', color: 'primary', message: 'Please check your email to verify your account.' })
            // this.$router.push('/auth/login')
          } else {
            this.$q.notify({ type: 'negative', message: 'Registration failed. Please try again!' })
            // this.onReset()
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
    // onReset() {
    //   this.user = { firstName: '', lastName: '', email: '', phone: '', username: '', password: '' }
    // }
  }
}
</script>
