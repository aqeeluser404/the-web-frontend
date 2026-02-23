<template>
  <q-page>
    <div class="constrain-standard row justify-center q-py-md">

      <div class="col-md-6 col-12 full-height" v-show="!loading">
        <!-- USER DETAILS -->
        <q-card flat bordered :class="$q.screen.lt.sm ? 'q-mb-md' : 'q-mr-md'">
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
                <q-input readonly v-model="userDetails.email" />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section class="text-left text-subtitle1">Gender</q-item-section>
              <q-item-section class="text-left text-subtitle1">
                <q-input v-if="userDetails.gender" readonly v-model="userDetails.gender" />
                <q-input v-else readonly value="Not specified" />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section class="text-left text-subtitle1">Phone</q-item-section>
              <q-item-section class="text-left text-subtitle1">
                <q-input readonly v-model="userDetails.phone" />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section class="text-left text-subtitle1">Username</q-item-section>
              <q-item-section class="text-left text-subtitle1">
                <q-input readonly v-model="userDetails.username" />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section class="text-left text-subtitle1">Account Type</q-item-section>
              <q-item-section class="text-left text-subtitle1">
                <q-select v-model="userDetails.userType" :options="userTypeOptions" emit-value map-options />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section class="text-left text-subtitle1">User Rights</q-item-section>
              <q-item-section class="text-left text-subtitle1">
                <q-select
                  v-model="userDetails.rightsType"
                  :options="rightsTypeOptions"
                  emit-value
                  map-options
                />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section class="text-left text-subtitle1">Account ID</q-item-section>
              <q-item-section class="text-left text-subtitle1">
                <q-input readonly v-model="userDetails._id" />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section class="text-left text-subtitle1">Date Created</q-item-section>
              <q-item-section class="text-left text-subtitle1">
                <q-input readonly :model-value="formatDate(userDetails.dateCreated)" />
              </q-item-section>
            </q-item>
          </q-card-section>
          <q-card-section>
            <div class="text-h6">Student Info</div>
          </q-card-section>
          <q-separator />
          <q-card-section>
            <!-- <q-item>
              <q-item-section class="text-left text-subtitle1">Registered student</q-item-section>
              <q-item-section class="text-left">
                <q-input readonly v-model="userDetails.studentInfo.isRegisteredStudent" />
              </q-item-section>
            </q-item> -->

            <q-item>
              <q-item-section class="text-left text-subtitle1">Registered student</q-item-section>
              <q-item-section class="text-left">
                <div class=" q-py-md">
                  {{ userDetails.studentInfo.isRegisteredStudent ? 'Registered' : 'Awaiting registration' }}
                </div>
              </q-item-section>
            </q-item>

            <!-- <q-item>
              <q-item-section class="text-left text-subtitle1">Bursary student</q-item-section>
              <q-item-section class="text-left">
                <q-input readonly v-model="userDetails.studentInfo.hasBursary" />
              </q-item-section>
            </q-item> -->

            <q-item>
              <q-item-section class="text-left text-subtitle1">Bursary student</q-item-section>
              <q-item-section class="text-left">
                <div class=" q-py-md">
                  {{ userDetails.studentInfo.hasBursary ? 'Yes' : 'No' }}
                </div>
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

          <q-card-section class="row justify-between">
            <CustomButton label="Update Account Type" @click="updateUserType" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-md-6 col-12 full-height" v-show="!loading">

        <DocumentsComponent :userId="userDetails._id" class="q-mb-md" />

        <!-- USER HISTORY AND DOCUMENTS -->
        <q-card flat bordered>
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
                  <th class="text-left">Access Key</th>
                  <!-- <th class="text-left">ID</th> -->
                </tr>
              </thead>
              <tbody>
                <!-- <tr v-for="(rental, index) in myRentals" :key="rental._id" @click="OpenViewRentalDetailsDialog(rental)"> -->
                <tr v-for="(rental, index) in myRentals" :key="rental._id" @click="viewUserTimeline(rental._id)">
                  <td class="text-left cursor-pointer">{{ index + 1 }}</td>
                  <td class="text-left cursor-pointer text-uppercase" :class="{ 'pending-status': rental.status === 'Pending' },
                    { 'active-status': rental.status === 'Active' },
                    { 'rejected-status': rental.status === 'Rejected' },
                    { 'ended-status': rental.status === 'Ended' }">
                    {{ capitalizeFirstLetter(rental.status) }}
                  </td>
                  <td class="text-left cursor-pointer">{{ formatDate(rental.applicationDate) }}</td>
                  <td class="text-left cursor-pointer">
                    <div v-if="rental.accessKey" @click.stop="copyToClipboard(rental.accessKey)" class="id">
                      {{ rental.accessKey }}
                    </div>
                    <div v-else>
                      N/A
                    </div>
                  </td>
                  <!-- <div class="text-left cursor-pointer id">
                  {{ rental._id }}
                </div> -->
                </tr>
              </tbody>
            </q-markup-table>
          </q-card-section>

          <q-card-section v-else class="row justify-start">
            <q-item>
              <q-item-section class="text-subtitle1">No rental has been placed yet.</q-item-section>
            </q-item>
          </q-card-section>

          <!-- PHP CODE -->
          <q-card-section>
            <div class="text-h6">Call Log History</div>
          </q-card-section>
          <q-separator />
          <q-card-section v-if="myCallLogs.length > 0">
            <q-markup-table flat bordered>
              <thead>
                <tr>
                  <th></th>
                  <th class="text-left">Status</th>
                  <th class="text-left">Opened Date</th>
                  <th class="text-left">Log Number</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(callLog, index) in myCallLogs" :key="callLog._id">
                  <td class="text-left cursor-pointer">{{ index + 1 }}</td>
                  <td class="text-left cursor-pointer text-uppercase" :class="{ 'callLog-opened': callLog.status === 'Opened' },
                    { 'callLog-assigned': callLog.status === 'Assigned' },
                    { 'callLog-resolved': callLog.status === 'Resolved' },
                    { 'callLog-closed': callLog.status === 'Closed' }">
                    {{ capitalizeFirstLetter(callLog.status) }}
                  </td>
                  <td class="text-left cursor-pointer">{{ formatDate(callLog.createdAt) }}</td>
                  <td class="text-left cursor-pointer id">
                    {{ callLog.logNumber }}
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </q-card-section>

          <q-card-section v-else class="row justify-start">
            <q-item>
              <q-item-section class="text-subtitle1">No call log has been placed yet.</q-item-section>
            </q-item>
          </q-card-section>

        </q-card>
      </div>
    </div>

    <q-inner-loading :showing="loading" color="primary" size="md" />
    <q-dialog v-model="viewRentalDetailsDialog">
      <AdminViewUserRentalComponent :rental="selectedRental" @close="handleClose" />
    </q-dialog>
  </q-page>
</template>

<script>
import documentLogo from '../../assets/resources/elements/document.png'
import AES from 'crypto-js/aes';
import Utf8 from 'crypto-js/enc-utf8';
import Helper from 'src/services/utils';
import UserService from 'src/services/UserService';
import CustomButton from 'src/components/elements/CustomButton.vue';
import RentalService from 'src/services/RentalService';
import AdminViewUserRentalComponent from 'src/components/admin/AdminViewUserRentalComponent.vue'
import CallLogService from 'src/services/CallLogService';
import DocumentsComponent from 'src/components/elements/DocumentsComponent.vue';

export default {
  name: "AdminUserDetailsPage",

  data() {
    return {
      loading: true,
      // PHP CODE
      myCallLogs: [],
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
      rightsTypeOptions: [
        { label: 'Agent', value: 'Agent' },
        { label: 'Driver', value: 'Driver' },
        { label: 'Unassigned', value: '' },
        ],

      viewRentalDetailsDialog: false, selectedRental: null,
      documentLogo
    }
  },
  components: {
    CustomButton,
    AdminViewUserRentalComponent,
    DocumentsComponent
  },
  methods: {
    formatDate: Helper.formatDate,
    capitalizeFirstLetter: Helper.capitalizeFirstLetter,

    copyToClipboard(text) {
      navigator.clipboard.writeText(text)
        .then(() => {
          this.$q.notify({ type: 'positive', color: 'primary', message: 'Access key copied to clipboard!' });
        }).catch(err => {
          this.$q.notify({ type: 'negative', message: `Failed to copy text: ${err}` });
        })
    },

    // PHP CODE
    async getAllMyCallLogs() {
      this.myCallLogs = await CallLogService.findMyCallLogs(this.userDetails._id);
    },
    async fetchUserDetails() {
      this.loading = true
      try {
        const encryptedId = this.$route.params.id
        const decryptedBytes = AES.decrypt(decodeURIComponent(encryptedId), 'secret-key')
        const decryptedId = decryptedBytes.toString(Utf8)

        if (!decryptedId) {
          console.error("Decryption failed or ID is missing.")
          return
        }

        this.userDetails = await UserService.findUserById(decryptedId)
        this.userDetails.rightsType = this.userDetails.rightsType ?? ''

        // Wait for both async calls to finish before continuing
        await Promise.all([
          this.fetchRentalDetails(),
          this.getAllMyCallLogs()
        ])

        // Now everything is ready
      } catch (err) {
        console.error("Failed to fetch user details:", err)
      } finally {
        this.loading = false
      }
    },
    async fetchRentalDetails() {
      this.myRentals = await RentalService.findMyRentals(this.userDetails._id)
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
        rightsType: this.userDetails.rightsType,
        location: this.userDetails.location,
        loginInfo: this.userDetails.loginInfo,
        order: this.userDetails.order
      }

      if (updatedUser.rightsType === 'Agent' || updatedUser.rightsType === 'Driver') {
        updatedUser.userType = 'admin'
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
    viewUserTimeline(id) {
      Helper.adminRentalDetails(id, this.$router);
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
