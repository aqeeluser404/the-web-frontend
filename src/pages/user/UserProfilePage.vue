<template>
  <q-page>
    <div class="constrain-standard row justify-center q-py-md">

      <!-- user profile section -->
      <div class="col-md-6 col-12 full-height ">
        <q-card flat bordered :class="$q.screen.lt.sm ? 'q-mb-md' : 'q-mr-md'">
          <q-card-section>
            <div class="text-h6">Personal Details</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <q-item>
              <q-item-section class="text-left text-subtitle1">First Name</q-item-section>
              <q-item-section class="text-left text-subtitle1">
                <q-input v-model="userDetails.firstName" />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section class="text-left text-subtitle1">Last Name</q-item-section>
              <q-item-section class="text-left text-subtitle1">
                <q-input v-model="userDetails.lastName" />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section class="text-left text-subtitle1">
                <span>Email
                  <span class="text-subtitle1 q-ml-md"
                    v-if="userDetails && userDetails.verification && userDetails.verification.isVerified">
                    <!-- VERIFIED  -->
                    <q-icon color="secondary" name="eva-checkmark-circle-2-outline" />
                  </span>
                  <span class="text-subtitle1 q-ml-md" v-else>
                    <!-- NOT VERIFIED  -->
                    <q-icon color="negative" name="eva-alert-circle-outline" />
                  </span>
                </span>
              </q-item-section>
              <q-item-section class="text-left text-subtitle1">
                <q-input :disable="isEditingDisabled" v-model="userDetails.email" />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section class="text-left text-subtitle1">Gender</q-item-section>
              <q-item-section class="text-left" v-if="!userDetails.gender">
                <q-select v-model="selectedGender" label-color="black" color="black" label=" *"
                  :options="userGenderOptions" emit-value map-options />
              </q-item-section>
              <q-item-section class="text-left" v-else>
                <q-input readonly :disable="true" v-model="userDetails.gender" />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section class="text-left text-subtitle1">Phone</q-item-section>
              <q-item-section class="text-left">
                <q-input v-model="userDetails.phone" />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section class="text-left text-subtitle1">Username</q-item-section>
              <q-item-section class="text-left">
                <q-input v-model="userDetails.username" />
              </q-item-section>
            </q-item>
            <!-- Add Date of Birth field -->
            <q-item>
              <q-item-section class="text-left text-subtitle1">Date of Birth</q-item-section>
              <q-item-section class="text-left">
                <q-input type="date" v-model="userDetails.dateOfBirth" :disable="isEditingDisabled"
                  placeholder="YYYY-MM-DD" @update:model-value="handleDateChange" />
              </q-item-section>
            </q-item>

            <!-- Add Age display field -->
            <q-item>
              <q-item-section class="text-left text-subtitle1">Age</q-item-section>
              <q-item-section class="text-left">
                <q-input :model-value="userDetails.age" readonly disable />
              </q-item-section>
            </q-item>
          </q-card-section>

          <q-card-section>
            <div class="text-h6">Student Info</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div>
              <q-item class="row justify-between">
                <q-radio :disable="isEditingDisabled" style="width: 48%;"
                  v-model="userDetails.studentInfo.isRegisteredStudent" :val="true" label="Registered student" />
                <q-radio :disable="isEditingDisabled" style="width: 48%;"
                  v-model="userDetails.studentInfo.isRegisteredStudent" :val="false" label="Unregistered student" />
              </q-item>
            </div>
            <div>
              <q-item class="row justify-between">
                <q-radio :disable="isEditingDisabled" style="width: 48%;" v-model="userDetails.studentInfo.hasBursary"
                  :val="true" label="I am a bursary recipient" />
                <q-radio :disable="isEditingDisabled" style="width: 48%;" v-model="userDetails.studentInfo.hasBursary"
                  :val="false" label="I am not a bursary recipient" />
              </q-item>
            </div>
            <div v-if="userDetails.studentInfo.isRegisteredStudent === true">
              <q-item>
                <q-item-section class="text-left text-subtitle1">Student Number</q-item-section>
                <q-item-section class="text-left">
                  <q-input :disable="isEditingDisabled" v-model="userDetails.studentInfo.studentNumber" />
                </q-item-section>
              </q-item>
              <q-item>
                <q-item-section class="text-left text-subtitle1">Registered Institution</q-item-section>
                <q-item-section class="text-left">
                  <q-input :disable="isEditingDisabled" v-model="userDetails.studentInfo.registeredInstitution" />
                </q-item-section>
              </q-item>
            </div>
          </q-card-section>

          <q-card-section class="row justify-between">
            <CustomButton label="Save" customStyle="width: 45%" @click="updateUser" />
            <CustomButton label="Verify Email" customStyle="width: 45%" color="white" text-color="black"
              @click="resendVerificationEmail"
              v-if="userDetails && userDetails.verification && !userDetails.verification.isVerified" />
          </q-card-section>
        </q-card>
      </div>

      <!-- documents section -->
      <div class="col-md-6 col-12 full-height">
        <q-card flat bordered class="full-height">
          <q-card-section>
            <div class="text-h6">Instructions</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div class="q-mb-sm">Please verify that all provided information is accurate before proceeding. Kindly
              ensure
              the following documents are uploaded:</div>
            <ul>
              <div v-for="docType in requiredDocuments" :key="docType.type" class="cursor-pointer q-mb-sm"
                style="font-weight: 500;" @click="openAddDocumentDialog(docType.type)">
                <q-icon class="q-mr-sm" v-if="hasDocument(docType.type)" color="secondary"
                  name="eva-checkmark-circle-2-outline" />
                <q-icon class="q-mr-sm" v-else color="negative" name="eva-alert-circle-outline" />
                <span> {{ docType.label }}</span>
              </div>
              <br>
              <div class="cursor-pointer" @click="removeAllDocuments">
                <q-icon class="q-mr-sm" name="eva-trash-outline" />
                <span> Clear All</span>
              </div>
            </ul>
            <div class="q-mt-xl q-mb-sm">
              <p class="">
                To view the full application process, check out our
                <a target="_blank" href="/frequently-asked-questions" class="text-primary">How to Apply guide</a>.
              </p>

              <p class="q-mt-sm">
                <a href="/files/Apply.pdf" target="_blank" class=" text-primary" style="text-decoration: underline;">
                  Download Application Form
                </a>
              </p>
            </div>
            <!-- <CustomButton :disable="isEditingDisabled" label="Remove All" customStyle="width: 45%" color="white" text-color="black" @click="removeAllDocuments"/> -->
            <br>Once your rental application has been submitted; <br> No further changes to your <span
              style="text-decoration: underline;">email</span> or <span style="text-decoration: underline;">sensitive
              data</span> will be permitted unless the application has been rejected or ended. <br><br><b>Note:</b>
            Applicants with a bursary are exempt from credit score verification.
          </q-card-section>

          <q-card-section>
            <div class="text-h6">Current Access Key</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <div class="q-mb-sm">Use this key to grant family members or dependents access to shared accommodation
              within
              a designated unit.</div>
            <ul>
              <li v-if="currentAccessKey">
                Copy to clipboard:
                <span class="id" @click="copyToClipboard(currentAccessKey)">
                  {{ currentAccessKey }}
                </span>
              </li>
              <li v-else>
                You have not utilized an access or reference key in your current application.
              </li>
            </ul>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <q-dialog v-model="addDocDialog">
      <AddDocumentComponent :user="userDetails" :docType="activeDocType" @close="handleDialogClose"
        @document-added="fetchUserDetails" />
    </q-dialog>
  </q-page>
</template>

<script>
import documentLogo from '../../assets/resources/elements/document.png'
import UserService from 'src/services/UserService';
import Helper from 'src/services/utils';
import EmailService from 'src/services/EmailService';
import CustomButton from 'src/components/elements/CustomButton.vue';
import AddDocumentComponent from 'src/components/user/AddDocumentComponent.vue';
import RentalService from 'src/services/RentalService';
import { copyToClipboard } from 'quasar';

export default {
  data() {
    return {
      userDetails: {
        studentInfo: {
          isRegisteredStudent: '',
          studentNumber: '',
          registeredInstitution: '',
          hasBursary: ''
        }
      },
      selectedGender: '',

      isEditingDisabled: false,
      userGenderOptions: [
        { label: 'Male', value: 'Male' },
        { label: 'Female', value: 'Female' }
      ],
      currentAccessKey: '',
      documentLogo,

      addDocDialog: false,
      requiredDocuments: [
        { type: 'registration', label: 'Registration Form' },
        { type: 'proof_of_address', label: 'Proof of Residential Address' },
        { type: 'id_or_passport', label: 'South African Identity Document (ID) or Passport' },
        { type: 'bank_statements', label: 'Three Months\' Bank Statements' },
        // { type: 'bank_statements_6_months', label: 'Six Months\' Bank Statements' },
        { type: 'proof_of_bursary', label: 'Proof of Bursary (if applicable)' },
        { type: 'credit_check', label: 'Check Credit Approval' },
      ],
      activeDocType: null
    }
  },
  components: {
    CustomButton,
    AddDocumentComponent
  },
  methods: {
    validateText: Helper.validateText,
    validateEmail: Helper.validateEmail,
    validatePhone: Helper.validatePhone,
    validateUsername: Helper.validateUsername,
    validatePassword: Helper.validatePassword,
    handleDateChange(newDate) {
      if (newDate) {
        // Calculate age from date
        const dob = new Date(newDate);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
          age--;
        }

        this.userDetails.age = age;
      } else {
        this.userDetails.age = null;
      }
    },

    copyToClipboard(text) {
      navigator.clipboard.writeText(text)
        .then(() => {
          this.$q.notify({ type: 'positive', color: 'primary', message: 'Access key copied to clipboard!' });
        }).catch(err => {
          this.$q.notify({ type: 'negative', message: `Failed to copy text: ${err}` });
        })
    },
    async checkEditingDisabled() {
      if (!this.userDetails || !this.userDetails.rentals) {
        this.isEditingDisabled = false;
        return;
      }
      const userRentals = await RentalService.findMyRentals(this.userDetails._id);
      const activeOrPendingRentals = userRentals.filter(rental => ['Pending', 'Active'].includes(rental.status));
      this.isEditingDisabled = activeOrPendingRentals.length > 0;
    },
    validateFields() {
      const details = this.userDetails;
      const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'username'];
      for (const field of requiredFields) {
        if (!details[field]) {
          this.$q.notify({ type: 'negative', message: `Please fill in all the fields.` });
          return false;
        }
      }

      if (this.userDetails.studentInfo.isRegisteredStudent === true) {
        const studentInfo = this.userDetails.studentInfo
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
      }
      if (!this.validateEmail(details.email)) {
        this.$q.notify({ type: 'negative', message: 'Invalid email address.' });
        return false;
      }
      if (!this.validatePhone(details.phone)) {
        this.$q.notify({ type: 'negative', message: 'Invalid phone number.' });
        return false;
      }
      if (!this.validateUsername(details.username)) {
        this.$q.notify({ type: 'negative', message: 'Invalid username.' });
        return false;
      }
      return true;
    },
    async resendVerificationEmail() {
      try {
        const response = await EmailService.resendVerificationEmail(this.userDetails.email);
        if (response) {
          this.$q.notify({ type: 'positive', color: 'primary', message: 'Please check your email for verification link.' });
          this.fetchUserDetails();
        }
        this.message = 'Verification email resent successfully!';
      } catch (error) {
        this.message = 'Error resending verification email.';
      }
    },
    updatedStudentStatus() {
      const isRegistered = this.userDetails.studentInfo.isRegisteredStudent;

      if (isRegistered === true) {
        return {
          isRegisteredStudent: this.userDetails.studentInfo.isRegisteredStudent,
          studentNumber: this.userDetails.studentInfo.studentNumber,
          registeredInstitution: this.userDetails.studentInfo.registeredInstitution,
          hasBursary: this.userDetails.studentInfo.hasBursary
        };
      } else {
        return {
          isRegisteredStudent: this.userDetails.studentInfo.isRegisteredStudent,
          studentNumber: '',
          registeredInstitution: '',
          hasBursary: this.userDetails.studentInfo.hasBursary
        };
      }
    },
    async updateUser() {
      const studentInfo = this.updatedStudentStatus();

      const updatedUser = {
        firstName: this.userDetails.firstName,
        lastName: this.userDetails.lastName,
        email: this.userDetails.email,
        phone: this.userDetails.phone,
        username: this.userDetails.username,
        password: this.userDetails.password,
        gender: this.userDetails.gender || this.selectedGender,
        userType: this.userDetails.userType,
        location: this.userDetails.location,
        loginInfo: this.userDetails.loginInfo,
        studentInfo: studentInfo,
        dateOfBirth: this.userDetails.dateOfBirth || null,
        age: this.userDetails.age || null
      };
      if (this.validateFields()) {
        this.$q.dialog({
          title: 'Confirm', message: `You are about to update your profile, continue?`, color: 'primary', cancel: true, persistent: true
        }).onOk(async () => {
          const response = await UserService.updateUserDetails(this.userDetails._id, updatedUser);
          if (response) {
            this.$q.notify({ type: 'positive', color: 'primary', message: 'Update successful!' });
            this.fetchUserDetails();
          } else {
            this.$q.notify({ type: 'negative', message: 'Update failed. Please try again.' });
          }
        }).onCancel(() => {
          this.fetchUserDetails();
          return;
        });
      }
    },
    async fetchUserDetails() {
      this.userDetails = await Helper.fetchUserDetails();

      // Format date for display if it exists
      if (this.userDetails.dateOfBirth) {
        this.userDetails.dateOfBirth = this.formatDateForDisplay(this.userDetails.dateOfBirth);
      }
      this.checkEditingDisabled();

      const response = await RentalService.findMyRentals(this.userDetails._id)

      this.currentAccessKey = response.find(rental => (rental.status === 'Pending' || rental.status === 'Active') && rental.accessKey)?.accessKey
    },

    formatDateForDisplay(date) {
      if (!date) return '';
      let d;
      if (date.$date) d = new Date(date.$date);
      else d = new Date(date);
      if (isNaN(d.getTime())) return '';

      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    },

    hasDocument(type) {
      return this.userDetails.documents?.some(doc => doc.docType === type);
    },
    viewDocument(document) {
      const url = Helper.getDocumentUrl(document);
      window.open(url, '_blank');
    },
    async deleteDocument(fileId) {
      // console.log(this.userDetails._id)
      // console.log(fileId)
      const response = await UserService.removeUserDoc(this.userDetails._id, fileId);
      if (response) {
        this.$q.notify({ type: 'positive', color: 'primary', message: 'Delete successful!' });
        this.fetchUserDetails();
      }
    },
    async removeAllDocuments() {
      if (this.userDetails.documents.length > 0) {
        this.$q.dialog({
          title: 'Confirm', message: `You are about to delete all your documents, continue?`, color: 'primary', cancel: true, persistent: true
        }).onOk(async () => {
          const response = await UserService.clearAllUserDocs(this.userDetails._id);
          if (response) {
            this.$q.notify({ type: 'positive', color: 'primary', message: 'Delete successful!' });
            this.fetchUserDetails();
          } else {
            this.$q.notify({ type: 'negative', message: 'Delete failed. Please try again.' });
          }
        }).onCancel(() => {
          this.fetchUserDetails();
          return;
        });
      } else {
        this.$q.notify({ type: 'negative', message: 'You have no documents to delete. Please try again.' });
      }
    },
    openAddDocumentDialog(type) {
      this.activeDocType = type;
      this.addDocDialog = true;
    },
    handleDialogClose() {
      this.addDocDialog = false;
      this.fetchUserDetails();
    }
  },
  created() {
    this.fetchUserDetails();
  }
};
</script>

<style scoped lang="sass">
.wrap-text
  white-space: pre-wrap
  word-wrap: break-word

// lists
// .custom-list
//   list-style-type: none
  // line-height:
  // margin: 0


  // text-indent: -1em


// .custom-list li
//   position: relative
//   padding-left: 1em
//   text-indent: -2em
//   margin-bottom: 0.5em


// .custom-list li:before
//   content: ""
//   position: absolute
//   left: 0
//   padding-right: 0.5em

// /* For lists with checkmarks */
// .custom-list li span
//   position: relative



</style>
