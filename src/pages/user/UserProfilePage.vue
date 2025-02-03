<template>
  <q-page>
    <div class="q-pa-md row justify-center">

      <!-- user profile section -->

      <q-card
        flat
        bordered
        class="col-md-4 col-11 q-ma-sm"
      >
        <q-card-section>
          <div class="text-h6">Personal Details</div>
        </q-card-section>

        <q-card-section>
          <q-item>
            <q-item-section class="text-left text-subtitle1">First Name</q-item-section>
            <q-item-section class="text-left text-subtitle1">
              <q-input v-model="userDetails.firstName" />
            </q-item-section>
          </q-item>
        </q-card-section>

        <q-card-section>
          <q-item>
            <q-item-section class="text-left text-subtitle1">Last Name</q-item-section>
            <q-item-section class="text-left text-subtitle1">
              <q-input v-model="userDetails.lastName" />
            </q-item-section>
          </q-item>
        </q-card-section>

        <q-card-section>
          <q-item>
            <q-item-section class="text-left text-subtitle1">
              <span>Email
                <span class="text-subtitle1 q-ml-md" v-if="userDetails && userDetails.verification && userDetails.verification.isVerified">
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
              <q-input v-model="userDetails.email" />
            </q-item-section>
          </q-item>
        </q-card-section>

        <q-card-section>
          <q-item>
            <q-item-section class="text-left">Phone</q-item-section>
            <q-item-section class="text-left">
              <q-input v-model="userDetails.phone" />
            </q-item-section>
          </q-item>
        </q-card-section>

        <q-card-section>
          <q-item>
            <q-item-section class="text-left">Username</q-item-section>
            <q-item-section class="text-left">
              <q-input v-model="userDetails.username" />
            </q-item-section>
          </q-item>
        </q-card-section>
        <q-card-section  class="row justify-between">
          <CustomButton label="Save" customStyle="width: 45%" color="brown" text-color="white" @click="updateUser" />
          <CustomButton label="Verify Email" customStyle="width: 45%" color="white" text-color="black" @click="resendVerificationEmail" v-if="userDetails && userDetails.verification && !userDetails.verification.isVerified" />
        </q-card-section>
      </q-card>

      <!-- documents section -->

      <q-card
        flat
        bordered
        class="col-md-4 col-11 q-ma-sm full-height"
      >
        <q-card-section>
          <div class="text-h6">Your Documents</div>
        </q-card-section>

        <div v-if="userDetails.documents && userDetails.documents.length > 0">
          <q-list v-for="document in userDetails.documents" :key="document._id">
            <q-card
              flat bordered
              class="cursor-pointer row q-ma-sm "
            >
              <q-card-section>
                <q-img
                  src="src/assets/resources/elements/document.png"
                  class="document"
                />
              </q-card-section>

              <q-card-section class="">
                <div class="text-caption wrap-text limit-text">{{ document.documentUrl.split('/').pop() }}</div>

                <div class="row justify-between q-my-md">
                  <CustomButton flat @click="viewDocument(document._id)" label="Open" color="white" text-color="black" customStyle="width: 45%"  />
                  <CustomButton flat @click="deleteDocument(document.fileId)" label="Delete" color="white" text-color="black" customStyle="width: 45%"  />
                </div>

              </q-card-section>
            </q-card>
          </q-list>
        </div>

        <div v-else>
          <q-card flat>
            <q-card-section>
              <q-item>
                <q-item-section class="text-subtitle1">You have no documents saved yet.</q-item-section>
              </q-item>
            </q-card-section>
          </q-card>
        </div>

        <q-card-section  class="row justify-between">
          <CustomButton label="Add Document" customStyle="width: 45%" color="brown" text-color="white" @click="openAddDocumentDialog" />
          <CustomButton label="Remove All" customStyle="width: 45%" color="white" text-color="black" @click="removeAllDocuments"/>
        </q-card-section>
      </q-card>
    </div>

    <q-dialog v-model="addDocDialog">
      <AddDocumentComponent :user="userDetails" @close="handleDialogClose" />
    </q-dialog>
  </q-page>
</template>

<script>
import UserService from 'src/services/UserService';
import Helper from 'src/services/utils';
import EmailService from 'src/services/EmailService';
import CustomButton from 'src/components/CustomButton.vue'
import AddDocumentComponent from 'src/components/AddDocumentComponent.vue';

export default {
  data() {
    return {
      userDetails: {},
      addDocDialog: false,
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
    validateFields() {
      const details = this.userDetails
      const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'username']
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
      return true
    },
    async resendVerificationEmail() {                                                       // Send verification email function
      try {
        const response = await EmailService.resendVerificationEmail(this.userDetails.email);
        if (response) {
          this.$q.notify({ type: 'negative', message: 'Please check your email for verification link.' })
          this.fetchUserDetails()
        }
        this.message = 'Verification email resent successfully!';
      } catch (error) {
        this.message = 'Error resending verification email.';
      }
    },
    async updateUser() {                                                                      // Update user function
      const updatedUser = {
        firstName: this.userDetails.firstName,
        lastName: this.userDetails.lastName,
        email: this.userDetails.email,
        phone: this.userDetails.phone,
        username: this.userDetails.username,
        password: this.userDetails.password,
        userType: this.userDetails.userType,
        location: this.userDetails.location,
        loginInfo: this.userDetails.loginInfo,
        order: this.userDetails.order
      }
      if (this.validateFields()) {
        this.$q.dialog({
          title: 'Confirm', message: `You are about to update your profile, continue?`, color: 'primary', cancel: true, persistent: true
        }).onOk(async () => {
          const response = await UserService.updateUserDetails(this.userDetails._id, updatedUser)
          if (response) {
            this.$q.notify({ type: 'positive', color: 'primary', message: 'Update successful!' })
            this.fetchUserDetails()
          } else {
            this.$q.notify({ type: 'negative', message: 'Update failed. Please try again.' })
          }
        }).onCancel(() => {
          this.fetchUserDetails()
          return
        })
      }
    },
    async fetchUserDetails() {
      this.userDetails = await Helper.fetchUserDetails()
    },
    viewDocument(document) {
      const url = Helper.getDocumentUrl(document);
      window.open(url, '_blank');
    },
    async deleteDocument(documentId) {
      const response = await UserService.removeUserDoc(this.userDetails._id, documentId)
      if (response) {
        this.$q.notify({ type: 'positive', color: 'primary', message: 'Delete successful!' })
        this.fetchUserDetails()
      }
    },
    async removeAllDocuments() {
      if (this.userDetails.documents.length > 0) {
        this.$q.dialog({
          title: 'Confirm', message: `You are about to delete all your documents, continue?`, color: 'primary', cancel: true, persistent: true
        }).onOk(async () => {
          const response = await UserService.clearAllUserDocs(this.userDetails._id)
          if (response) {
            this.$q.notify({ type: 'positive', color: 'primary', message: 'Delete successful!' })
            this.fetchUserDetails()
          } else {
            this.$q.notify({ type: 'negative', message: 'Delete failed. Please try again.' })
          }
        }).onCancel(() => {
          this.fetchUserDetails()
          return
        })
      } else {
        this.$q.notify({ type: 'negative', message: 'You have no documents to delete. Please try again.' })
      }
    },
    openAddDocumentDialog() {
      this.addDocDialog = true
    },
    handleDialogClose() {
      this.addDocDialog = false;
      this.fetchUserDetails();
    }
  },
  created() {
    this.fetchUserDetails()
  }
}
</script>

<style lang="sass">
.wrap-text
  white-space: pre-wrap
  word-wrap: break-word

</style>
