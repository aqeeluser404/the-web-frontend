<template>
  <q-card class="combined-unit-card">
    <div class="row">

      <div class="col-md-6 col-12 q-pa-md left-card" style="background-color: #f8f8f8;">
        <q-card-section class="row justify-between items-center">
          <div class="text-h6">Create a new user</div>
          <q-btn flat round icon="close" @click="$emit('close')" size="md" color="grey-10" aria-label="Close"
            class="small-screen-only" />
        </q-card-section>

        <q-separator />

        <q-card-section>
          <q-item>
            <q-item-section class="text-left text-subtitle1">First Name *</q-item-section>
            <q-item-section class="text-left text-subtitle1">
              <q-input v-model="user.firstName" />
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section class="text-left text-subtitle1">Last Name *</q-item-section>
            <q-item-section class="text-left text-subtitle1">
              <q-input v-model="user.lastName" />
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section class="text-left text-subtitle1">Username *</q-item-section>
            <q-item-section class="text-left text-subtitle1">
              <q-input v-model="user.username" />
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section class="text-left text-subtitle1">Email *</q-item-section>
            <q-item-section class="text-left text-subtitle1">
              <q-input v-model="user.email" />
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section class="text-left text-subtitle1">Gender *</q-item-section>
            <q-item-section class="text-left text-subtitle1">
              <q-select v-model="user.gender" :options="genderOptions" emit-value map-options />
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section class="text-left text-subtitle1">Phone *</q-item-section>
            <q-item-section class="text-left text-subtitle1">
              <q-input v-model="user.phone" />
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section class="text-left text-subtitle1">Password *</q-item-section>
            <q-item-section class="text-left text-subtitle1">
              <q-input v-model="user.password" />
            </q-item-section>
          </q-item>

        </q-card-section>

        <q-card-section>
          <CustomButton label="Add New User" @click="onSubmit" />
        </q-card-section>
      </div>

      <div class="col-md-6 col-12 q-pa-md">
        <q-card-section class="row justify-end items-center q-py-none q-py-sm">
          <q-btn flat round icon="close" @click="$emit('close')" size="md" color="grey-10" aria-label="Close"
            class="large-screen-only" />
        </q-card-section>

        <q-card-section>
          <q-item>
            <q-item-section class="text-left text-subtitle1">User Type *</q-item-section>
            <q-item-section class="text-left text-subtitle1">
              <q-select v-model="user.userType" :options="userTypeOptions" emit-value map-options />
            </q-item-section>
          </q-item>
          <div v-if="user.userType === 'user'">
            <q-item>
              <q-item-section class="text-left text-subtitle1">Registered Student *</q-item-section>
              <q-item-section class="text-left text-subtitle1">
                <q-select v-model="user.studentInfo.isRegisteredStudent" :options="isRegisteredStudentOptions"
                  emit-value map-options />
              </q-item-section>
            </q-item>

            <q-item>
              <q-item-section class="text-left text-subtitle1">Has Bursary *</q-item-section>
              <q-item-section class="text-left text-subtitle1">
                <q-select v-model="user.studentInfo.hasBursary" :options="hasBursaryOptions" emit-value map-options />
              </q-item-section>
            </q-item>

            <q-item v-if="user.studentInfo.isRegisteredStudent === true">
              <q-item-section class="text-left text-subtitle1">Student Number *</q-item-section>
              <q-item-section class="text-left text-subtitle1">
                <q-input v-model="user.studentInfo.studentNumber" />
              </q-item-section>
            </q-item>

            <q-item v-if="user.studentInfo.isRegisteredStudent === true">
              <q-item-section class="text-left text-subtitle1">Registered Institution *</q-item-section>
              <q-item-section class="text-left text-subtitle1">
                <q-input v-model="user.studentInfo.registeredInstitution" />
              </q-item-section>
            </q-item>
          </div>
        </q-card-section>
      </div>
    </div>
  </q-card>
</template>

<script>
import CustomButton from '../elements/CustomButton.vue';
import Helper from 'src/services/utils';
import UserService from 'src/services/api/UserService';

export default {
  data() {
    return {
      user: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        username: '',
        password: '',
        gender: 'Select',
        userType: 'Select',
        studentInfo: {
          isRegisteredStudent: false,
          studentNumber: '',
          registeredInstitution: '',
          hasBursary: false
        }
      },
      genderOptions: [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' },
      ],
      userTypeOptions: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
        { label: 'Vendor', value: 'vendor' },
      ],
      isRegisteredStudentOptions: [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ],
      hasBursaryOptions: [
        { label: 'Yes', value: true },
        { label: 'No', value: false },
      ],
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
          message: 'Password must be 8-64 characters, with at least 1 uppercase, 1 lowercase, 1 number, and 1 special character (@$!%*?&).'
        });
        return false;
      }
      return true
    },

    async onSubmit() {
      try {
        if (this.user.userType !== 'user') {
          this.reset()
        }
        const userDetails = {
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          email: this.user.email,
          phone: this.user.phone,
          username: this.user.username,
          password: this.user.password,
          userType: this.user.userType,
          gender: this.user.gender,
          studentInfo: {
            isRegisteredStudent: this.user.studentInfo.isRegisteredStudent,
            studentNumber: this.user.studentInfo.studentNumber,
            registeredInstitution: this.user.studentInfo.registeredInstitution,
            hasBursary: this.user.studentInfo.hasBursary
          }
        }
        if (this.validateFields()) {
          const response = await UserService.createUser(userDetails)
          if (response) {
            this.$q.notify({ type: 'positive', color: 'primary', message: 'Please check your email to verify your account.' })
            this.$emit('close')
          } else {
            this.$q.notify({ type: 'negative', message: 'Registration failed. Please try again!' })
          }
        }
      } catch (error) {
        if (error.response && (error.response.status === 401 || error.response.status === 400)) {
          this.$q.notify({ type: 'negative', color: 'red', message: 'Username or email already exists. Please try again!' })
        } else {
          this.$q.notify({ type: 'negative', color: 'red', message: 'User creation failed. Please try again!' })
        }
      }
    },

    reset() {
      this.user.studentInfo.isRegisteredStudent = false;
      this.user.studentInfo.studentNumber = '';
      this.user.studentInfo.registeredInstitution = '';
    },
  }
}
</script>

<style lang="sass" scoped>
.left-card
  display: flex
  flex-direction: column
  height: 100%

.combined-unit-card
  width: 100%
  max-width: 550px
  padding: 16px

  @media (min-width: 601px)
    min-width: 1200px

  @media (max-width: 600px)
    min-width: unset
    padding: 8px

.wrap-text
  white-space: pre-wrap

.image-container
  position: relative
  width: 100%
  height: 450px
  overflow: hidden
  border-radius: 4px
  background: #f5f5f5
  display: flex
  justify-content: center
  align-items: center

.nav-button
  position: absolute
  top: 50%
  transform: translateY(-50%)
  background: rgba(0,0,0,0.2)
  color: white
  z-index: 2
  width: 48px
  height: 48px
  font-size: 24px
  &.left
    left: 24px
  &.right
    right: 24px

.cursor-zoom-in
  cursor: zoom-in

.image-dialog-card
  background: rgba(0,0,0,0.9) !important

.dialog-image-section
  height: 100%
  display: flex
  justify-content: center
  align-items: center
  position: relative

.enlarged-image
  max-width: 100%
  max-height: 100%
  width: auto
  height: auto

.close-button
  position: fixed
  right: 15px
  top: 10px
  z-index: 2
  background: transparent
  color: white

.dialog-nav
  position: absolute
  top: 50%
  transform: translateY(-50%)
  background: transparent
  color: white
  z-index: 2
  width: 48px
  height: 48px
  font-size: 24px
  &.left
    left: 24px
  &.right
    right: 24px
</style>
