<template>
  <q-card class="component-card">
    <q-card-section>
      <div class="text-h6">Create a new user</div>
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
            <q-select v-model="user.studentInfo.isRegisteredStudent" :options="isRegisteredStudentOptions" emit-value map-options />
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

    <q-card-section>
      <CustomButton label="Add New Unit" @click="onSubmit" />
    </q-card-section>
  </q-card>
</template>

<script>
import CustomButton from '../elements/CustomButton.vue';
import Helper from 'src/services/utils';
import UserService from 'src/services/UserService';

export default {
  data() {
    return {
      user: {
        firstName: 'Aarif',
        lastName: 'Hanslo',
        email: 'aarif210@gmail.com',
        phone: '0748904233',
        username: 'TestUser1',
        password: 'TestPass2@',
        gender: 'Select',
        userType: 'Select',
        studentInfo: {
          isRegisteredStudent: false,
          studentNumber: '' ,
          registeredInstitution: '',
          hasBursary: false
        }
      },
      genderOptions: [
        { label: 'Male', value: 'male' },
        { label: 'Female', value: 'female' },
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
          message: 'Password must be 8-64 characters, with at least 1 uppercase, 1 lowercase, 1 number, and 1 special character (@$!%*?&).'        });
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
