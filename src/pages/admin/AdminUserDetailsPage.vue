<template>
  <q-page class="bg-grey-3">
    <div class="constrain-standard row justify-center q-py-md">

      <div class="col-md-6 col-12 full-height" v-show="!loading">
        <!-- USER DETAILS -->
        <q-card :class="$q.screen.lt.sm ? 'q-mb-md' : 'q-mr-md'" class="soft-shadow-card">
          <q-card-section class="stats-header">
            <div class="text-h6">User Details</div>
            <q-separator class="q-my-sm" style="width: 100%;" />
          </q-card-section>
          <!-- <q-separator /> -->
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
        <q-card class="soft-shadow-card">
          <q-card-section class="stats-header">
            <div class="text-h6">Rental History</div>
            <q-separator class="q-my-sm" style="width: 100%;" />
          </q-card-section>

          <!-- <q-card-section v-if="myRentals.length > 0">
            <q-markup-table flat bordered>
              <thead>
                <tr>
                  <th></th>
                  <th class="text-left">Status</th>
                  <th class="text-left">Application Date</th>
                  <th class="text-left">Access Key</th>
                </tr>
              </thead>
              <tbody>
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
                </tr>
              </tbody>
            </q-markup-table>
          </q-card-section>

          <q-card-section v-else class="row justify-start">
            <q-item>
              <q-item-section class="text-subtitle1">No rental has been placed yet.</q-item-section>
            </q-item>
          </q-card-section> -->

          <q-card-section>
            <q-table
              flat bordered :rows="myRentals" :columns="rentalColumns" row-key="_id" @row-click="viewUserTimeline"
            >
              <template v-slot:body-cell-index="props">
                <q-td :props="props">
                  {{ props.rowIndex + 1 }}
                </q-td>
              </template>

              <template v-slot:body-cell-id="props">
                <q-td :props="props" class="" >
                  <q-badge
                    color="text-primary"
                    align="middle"
                    class="q-pa-xs q-px-sm"
                  >
                    <div @click.stop="copyToClipboard(props.row._id)">
                      {{ props.row._id }}
                    </div>
                  </q-badge>
                </q-td>
              </template>

              <template v-slot:body-cell-applicationDate="props">
                <q-td :props="props">
                  {{ formatDate(props.row.applicationDate) }}
                </q-td>
              </template>

              <template v-slot:body-cell-accessKey="props">
                <q-td :props="props">
                  <div v-if="!props.row.accessKey">
                    N/A
                  </div>
                </q-td>
              </template>

              <template v-slot:body-cell-status="props">
                <q-td :props="props">
                  <q-badge
                    :color="
                      props.row.status === 'Active'
                        ? 'green'
                        : props.row.status === 'Pending'
                          ? 'orange'
                          : props.row.status === 'Rejected'
                            ? 'red'
                            : props.row.status === 'Ended'
                              ? 'grey'

                              : 'red'
                    "
                    align="middle"
                    class="q-pa-xs q-px-sm"
                  >
                    {{ props.row.status }}
                  </q-badge>
                </q-td>
              </template>
            </q-table>
          </q-card-section>

          <!-- PHP CODE -->
          <q-card-section class="stats-header">
            <div class="text-h6">Call Log History</div>
            <q-separator class="q-my-sm" style="width: 100%;" />
          </q-card-section>

          <!-- <q-card-section v-if="myCallLogs.length > 0">
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
          </q-card-section> -->

          <q-card-section>
            <q-table
              flat bordered :rows="myCallLogs" :columns="callLogColumns" row-key="_id"
            >
              <template v-slot:body-cell-index="props">
                <q-td :props="props">
                  {{ props.rowIndex + 1 }}
                </q-td>
              </template>

              <template v-slot:body-cell-status="props">
                <q-td :props="props">
                  <q-badge
                    :color="
                      props.row.status === 'Opened'
                        ? 'orange'
                        : props.row.status === 'Assigned'
                          ? 'blue'
                          : props.row.status === 'Resolved'
                            ? 'green'
                            : props.row.status === 'Closed'
                              ? 'grey'

                              : 'red'
                    "
                    align="middle"
                    class="q-pa-xs q-px-sm"
                  >
                    {{ props.row.status }}
                  </q-badge>
                </q-td>
              </template>

              <!-- <template v-slot:body-cell-status="props">
                <q-td :props="props" :class="
                  { 'callLog-opened': props.row.status === 'Opened' },
                  { 'callLog-assigned': props.row.status === 'Assigned' },
                  { 'callLog-resolved': props.row.status === 'Resolved' },
                  { 'callLog-closed': props.row.status === 'Closed' }"
                >
                  {{ props.row.status }}
                </q-td>
              </template> -->

              <template v-slot:body-cell-createdAt="props">
                <q-td :props="props">
                  {{ formatDate(props.row.createdAt) }}
                </q-td>
              </template>

              <template v-slot:body-cell-logNumber="props">
                <q-td :props="props" class="cursor-pointer">
                  <q-badge
                    color="text-primary"
                    align="middle"
                    class="q-pa-xs q-px-sm"
                  >
                    <div @click.stop="copyToClipboard(props.row.logNumber)">
                      {{ props.row.logNumber }}
                    </div>
                  </q-badge>
                </q-td>
              </template>
            </q-table>
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

      rentalColumns: [
        { name: "index", label: "#", field: "index", align: 'center' },
        { name: "id", label: "Rental Number", field: "_id", align: 'left' },
        { name: "applicationDate", label: "Application Date", field: "applicationDate", align: 'left' },
        { name: "accessKey", label: "Access Key", field: "accessKey", align: 'center' },
        { name: "status", label: "Status", field: "status", align: 'center' },
      ],

      callLogColumns: [
        { name: "index", label: "#", field: "index", align: 'center'},
        { name: "logNumber", label: "Log Number", field: "logNumber", align: 'left' },
        { name: "createdAt", label: "Created Date", field: "createdAt", align: 'left' },
        { name: "status", label: "Status", field: "status", align: 'center' },
      ],

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
          this.$q.notify({ type: 'positive', color: 'primary', message: 'Copied to clipboard!' });
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
