<template>
  <q-page>
    <div class="q-pa-md row justify-center">


      <!-- USER DETAILS -->
      <q-card flat bordered class="col-md-4 col-12 q-ma-sm full-height">
        <q-card-section>
          <div class="text-h6">User Details</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-item>
            <q-item-section class="text-left text-subtitle1">First Name</q-item-section>
            <q-item-section class="text-left text-subtitle1">
              <q-input readonly v-model="userDetails.firstName" />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section class="text-left text-subtitle1">Last Name</q-item-section>
            <q-item-section class="text-left text-subtitle1">
              <q-input readonly v-model="userDetails.lastName" />
            </q-item-section>
          </q-item>
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
              <q-input readonly v-model="userDetails.email" />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section class="text-left text-subtitle1">Gender</q-item-section>
            <q-item-section class="text-left">
              <q-input v-if="userDetails.gender" readonly v-model="userDetails.gender" />
              <div v-else style="opacity: 90%;">Not specified</div>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section class="text-left text-subtitle1">Phone</q-item-section>
            <q-item-section class="text-left">
              <q-input readonly v-model="userDetails.phone" />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section class="text-left text-subtitle1">Username</q-item-section>
            <q-item-section class="text-left">
              <q-input readonly v-model="userDetails.username" />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section class="text-left text-subtitle1">Account Type</q-item-section>
            <q-item-section class="text-left">
              <q-select v-model="userDetails.userType" :options="userTypeOptions" emit-value map-options />
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section class="text-left text-subtitle1">Date Created</q-item-section>
            <q-item-section class="text-left">
              <div style="opacity: 90%;">{{ formatDate(userDetails.dateCreated) }}</div>
            </q-item-section>
          </q-item>
        </q-card-section>

        <q-card-section>
          <div class="text-h6">Student Info</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-item>
            <q-item-section class="text-left text-subtitle1">Registered student</q-item-section>
            <q-item-section class="text-left">
              <q-input readonly v-model="userDetails.studentInfo.isRegisteredStudent" />
            </q-item-section>
          </q-item>

          <div v-if="userDetails.studentInfo.isRegisteredStudent === true">
            <q-item>
              <q-item-section class="text-left text-subtitle1">Student Number</q-item-section>
              <q-item-section class="text-left">
                <q-input readonly v-model="userDetails.studentInfo.studentNumber" />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section class="text-left text-subtitle1">Registered Institution</q-item-section>
              <q-item-section class="text-left">
                <q-input readonly v-model="userDetails.studentInfo.registeredInstitution" />
              </q-item-section>
            </q-item>
          </div>
        </q-card-section>

        <q-card-section  class="row justify-between">
          <CustomButton label="Update Account Type" color="brown" text-color="white" @click="updateUserType" />
        </q-card-section>
      </q-card>


      <!-- USER HISTORY AND DOCUMENTS -->
      <q-card flat bordered class="col-md-4 col-12 q-ma-sm full-height">
        <q-card-section>
          <div class="text-h6">Rental History</div>
        </q-card-section>
        <q-separator />
        <q-card-section v-if="myRentals.length > 0">
          <q-markup-table flat bordered>
            <thead>
              <tr>
                <th></th>
                <th class="text-left">Status</th>
                <th class="text-left">Application Date</th>
                <th class="text-left">Start Date</th>
                <th class="text-left">End Date</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(rental, index) in myRentals" :key="rental._id" @click="OpenViewRentalDetailsDialog(rental)">
                <td class="text-left cursor-pointer">{{ index + 1 }}</td>
                <td class="text-left cursor-pointer text-uppercase" :class="{ 'active-status': rental.status === 'Active'}, { 'ended-status': rental.status === 'Ended'}"><b>{{ capitalizeFirstLetter(rental.status) }}</b></td>
                <td class="text-left cursor-pointer">{{ formatDate(rental.applicationDate) }}</td>
                <td class="text-left cursor-pointer">
                  <div v-if="rental.rentalStartDate !== null">
                    {{ formatDate(rental.rentalStartDate) }}
                  </div>
                  <div v-else>
                    Being processed...
                  </div>
                </td>
                <td class="text-left cursor-pointer">
                  <div v-if="rental.rentalEndDate !== null">
                    {{ formatDate(rental.rentalEndDate) }}
                  </div>
                  <div v-else>
                    Being processed...
                  </div>
                </td>

              </tr>
            </tbody>
          </q-markup-table>
        </q-card-section>

        <q-card-section v-else class="row justify-start">
          <q-item>
            <q-item-section class="text-subtitle1">No rental has been placed yet.</q-item-section>
          </q-item>
        </q-card-section>

        <q-card-section>
          <div class="text-h6">Applicant Documents</div>
        </q-card-section>

        <q-separator />

        <q-card-section v-if="userDetails.documents && userDetails.documents.length > 0">
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
                  <CustomButton flat @click="viewDocument(document.documentUrl)" label="Open" color="white" text-color="black" customStyle="width: 45%"  />
                  <!-- <CustomButton flat @click="deleteDocument(document.fileId)" label="Delete" color="white" text-color="black" customStyle="width: 45%"  /> -->
                </div>

              </q-card-section>
            </q-card>
          </q-list>
        </q-card-section>

        <q-card-section v-else class="row justify-start">
          <q-item>
            <q-item-section class="text-subtitle1">This user has no documents saved yet.</q-item-section>
          </q-item>
        </q-card-section>

      </q-card>
    </div>

    <q-dialog v-model="viewRentalDetailsDialog">
      <AdminViewUserRentalComponent :rental="selectedRental" @close="handleClose" />
    </q-dialog>
  </q-page>
</template>

<script>
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import Helper from 'src/services/utils';
import UserService from 'src/services/UserService';
import CustomButton from 'src/components/elements/CustomButton.vue';
import RentalService from 'src/services/RentalService';
import AdminViewUserRentalComponent from 'src/components/admin/AdminViewUserRentalComponent.vue'

export default {
  name: "AdminUserDetailsPage",

  data() {
    return {
      userDetails: {
        studentInfo: {
          isRegisteredStudent: '',
          studentNumber: '',
          registeredInstitution: ''
        }
      },
      myRentals: [],
      userTypeOptions: [
        { label: 'Admin', value: 'admin' },
        { label: 'User', value: 'user' },
      ],

      viewRentalDetailsDialog: false, selectedRental: null
    }
  },
  components: {
    CustomButton,
    AdminViewUserRentalComponent
  },
  methods: {
    formatDate: Helper.formatDate,
    capitalizeFirstLetter: Helper.capitalizeFirstLetter,
    async fetchUserDetails() {
      const encryptedId = this.$route.params.id;
      const decryptedBytes = AES.decrypt(decodeURIComponent(encryptedId), 'secret-key');
      const decryptedId = decryptedBytes.toString(Utf8);

      if (!decryptedId) {
          console.error("Decryption failed or ID is missing.");
          return;
        }
      this.userDetails = await UserService.findUserById(decryptedId)
      this.fetchRentalDetails()

    },
    async fetchRentalDetails() {
      this.myRentals = await RentalService.findMyRentals(this.userDetails._id)
      console.log(this.myRentals)
    },

    viewDocument(document) {
      const url = Helper.getDocumentUrl(document);
      window.open(url, '_blank');
    },

    async updateUserType() {
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
      if (updatedUser) {
        this.$q.dialog({
          title: 'Confirm', message: `You are about to update this user account type, continue?`, color: 'primary', cancel: true, persistent: true
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
    OpenViewRentalDetailsDialog(rental) {
      this.viewRentalDetailsDialog = true
      this.selectedRental = rental
    },
    handleClose() {
      this.viewRentalDetailsDialog = false
      this.fetchUserDetails()
    }
  },
  created() {
    this.fetchUserDetails()
  }
}
</script>
