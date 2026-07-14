<template>
  <q-page class="bg-grey-3">
    <div v-if="!loading">
      <div class="constrain-standard q-py-md" v-if="userDetails.userType === 'admin' || userDetails.rightsType === 'Tenant'">
        <q-card class="col-md-4 col-12 stats-card full-height">
          <q-card-section class="row stats-header justify-center">
            <div class="text-h6">Log a call</div>
            <q-separator class="q-my-sm" style="width: 100%;" />
          </q-card-section>

          <q-card-section>
            <div class="row q-gutter-sm justify-center">
              <q-btn v-for="option in callTypeOptions" :key="option.value"
                :color="callLog.callType === option.value ? 'primary' : 'grey-8'" :icon="option.icon" flat rounded
                size="lg" :label="option.label" class="col-md-2 col-12 custom-button"
                @click="callLog.callType = option.value" style="border: 1px solid;">
              </q-btn>
            </div>
          </q-card-section>

          <!-- New description field -->
          <q-card-section class="row q-gutter-sm justify-center" >

            <template v-if="issueOptions[callLog.callType]">
              <q-select
                class="col-md-4 col-12"                      
                outlined
                rounded
                v-model="selectedIssue"
                :options="issueOptions[callLog.callType]"
                label="Issue Type"
                option-label="label"
                option-value="value"
                emit-value
                map-options
              />

              <q-input
                class="col-md-4 col-12"
                v-if="selectedIssue === 'Other'"
                v-model="customIssue"
                outlined
                rounded
                label="Describe the issue"
              />
            </template>

            <template v-else>
              <q-input
              rounded
              class="col-md-4 col-12"
              v-model="callLog.description"
              label="Description"
              autogrow
              outlined
              placeholder="Provide more details about the issue..."
            />
            </template>

            
            <q-input
              rounded
              class="col-md-4 col-12"
              v-model="callLog.summary"
              type="textarea"
              label="Summary"
              autogrow
              outlined
              placeholder="Enter a short summary of the issue..."
            />
            <q-input
              rounded
              class="col-md-2 col-12"
              v-model="callLog.unit"
              label="Unit"
              outlined
              placeholder="Enter the unit number"
            />
          </q-card-section>

          <q-card class="q-pa-lg shadow-2 rounded-borders full-width flex flex-center">
            <q-card-section class="column items-center " style="max-width: 500px; width: 100%;">
              <div class="text-h6 text-primary">Attach Supporting Images</div>
              <div class="text-subtitle1 text-grey-7 q-mb-sm">
                Upload one or more images to help describe the issue.
              </div>

              <q-uploader
                ref="uploader"
                label="Select Images"
                multiple
                accept="image/*"
                :auto-upload="false"
                flat
                class="stats-header"
                style="width: 100%; border-radius: 20px;"
                @added="onFilesAdded"
              />
            </q-card-section>
          </q-card>




          <q-card-section class="row justify-center">
            <CustomButton label="Log Call" @click="initiateCall" :disabled="!callLog.callType"
              customStyle="width: 250px; @media (max-width: 600px) { width: 100% !important; }" />
          </q-card-section>
        </q-card>

        <q-card flat class="col-md-4 col-12 full-height q-my-md bg-grey-3">
          <q-card-section class="q-px-none">
            <div class="q-mb-sm ">
              <div class="text-h6 text-subtitle1">Filter with:</div>
            </div>
            <div class="row q-gutter-md ">
              <q-select v-model="selectedStatus" filled :options="statusOptions" label="Status"
                @update:model-value="filterCallLogs" class="col-7 col-md-2" behavior="menu"
                options-selected-class="text-weight-bold" emit-value map-options dense />

              <q-select v-model="selectedCallType" filled
                :options="['All', ...callTypeOptions.map(option => option.label)]" label="Call Type"
                @update:model-value="filterCallLogs" class="col-4 col-md-2" behavior="menu"
                options-selected-class="text-weight-bold" emit-value map-options dense />

              <q-select v-model="selectedSort" filled :options="sortOptions" label="Sort By"
                @update:model-value="sortCallLogs" class="col-4 col-md-2" behavior="menu"
                options-selected-class="text-weight-bold" emit-value map-options dense />
            </div>
          </q-card-section>
        </q-card>

        <q-card class="col-md-4 col-12 full-height stats-card">
          <q-card-section class="row justify-center stats-header">
            <div class="text-h6">Call Log History</div>
            <q-separator class="q-my-sm" style="width: 100%;" />
          </q-card-section>

          <!-- <q-separator /> -->

        <q-card-section>
          <q-table flat bordered :rows="filteredCallLogs" :columns="callLogColumns" row-key="_id"
          >
            <template v-slot:body-cell-index="props">
              <q-td :props="props">
                {{ props.rowIndex + 1 }}
              </q-td>
            </template>

            <template v-slot:body-cell-logNumber="props">
              <q-td :props="props">
                <div class="id">
                  <q-badge
                    color="text-primary"
                    align="middle"
                    class="q-pa-xs q-px-sm"
                  >
                    {{ props.row.logNumber }}
                  </q-badge>
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-createdDate="props">
              <q-td :props="props">
                {{ formatDate(props.row.createdAt) }}
              </q-td>
            </template>

            <template v-slot:body-cell-createdTime="props">
              <q-td :props="props">
                {{ formatTime(props.row.createdAt) }}
              </q-td>
            </template>

            <template v-slot:body-cell-closedDate="props">
              <q-td :props="props">
                <div v-if="props.row.closedAt">
                  {{ formatDate(props.row.closedAt) }}
                </div>
                <div v-else>N/A</div>
              </q-td>
            </template>

            <template v-slot:body-cell-closedTime="props">
              <q-td :props="props">
                <div v-if="props.row.closedAt">
                  {{ formatTime(props.row.closedAt) }}
                </div>
                <div v-else>N/A</div>
              </q-td>
            </template>

            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <q-badge
                  :color="
                    props.row.status === 'Resolved'
                      ? 'green'
                      : props.row.status === 'Opened'
                        ? 'orange'
                        : props.row.status === 'Assigned'
                          ? 'blue'
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

            <template v-slot:body-cell-vendorType="props">
              <q-td :props="props">
                <div v-if="props.row.vendorInfo && props.row.vendorInfo.vendorType">
                  {{ props.row.vendorInfo.vendorType }}
                </div>
                <div v-else>N/A</div>
              </q-td>
            </template>
          </q-table>
        </q-card-section>
        </q-card>

        <q-dialog v-model="otherDialog">
          <q-card class="component-card">
            <q-card-section>
              <div class="text-h6">Specify Call Type</div>
            </q-card-section>

            <q-separator />

            <q-card-section>
              <q-item>
                <q-item-section class="text-left text-subtitle1">Please describe your issue</q-item-section>
                <q-item-section>
                  <q-input v-model="customCallType" label="Other" autofocus @keyup.enter="initiateCustomCall" />
                </q-item-section>
              </q-item>
            </q-card-section>

            <q-card-section class="row justify-between">
              <CustomButton customStyle="width: 45%" label="Initiate Call" @click="initiateCustomCall"
                :disabled="!customCallType" />
              <CustomButton customStyle="width: 45%" color="white" text-color="primary" label="Cancel" v-close-popup />

            </q-card-section>
          </q-card>
        </q-dialog>
      </div>

      <div class="constrain-standard q-py-md" v-else>
        <q-card class="col-md-4 col-12 stats-card full-height">
          <q-card-section class="row stats-header justify-center">
            <div class="text-h6">Log a call</div>
            <q-separator class="q-my-sm" style="width: 100%;" />
          </q-card-section>

          <q-card-section class="row justify-center">
            <q-item>
              <q-item-section class="text-subtitle1">You’ll have access to the call log system once your rental
                application is approved.</q-item-section>
            </q-item>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-inner-loading :showing="loading" color="primary" size="md" />
  </q-page>
</template>

<script>
import CallLogService from 'src/services/CallLogService';
import Helper from 'src/services/utils';
import CustomButton from 'src/components/elements/CustomButton.vue';
import RentalService from 'src/services/RentalService';
import UserService from 'src/services/UserService';
export default {

  components: {
    CustomButton,
  },
  data() {
    return {
      loading: true,
      callLog: {
        callType: '',
        // status: 'Pending',
        status: 'Opened',
        user: null,
        unit: '',
        description: '',
        summary: '',
        images: []

      },
      activeRental: {},
      myRentals: [],
      userDetails: {},
      myCallLogs: [],
      otherDialog: false,
      customCallType: '',
      callTypeOptions: [
        { label: 'IT Support', value: 'IT Support', icon: 'computer' },
        { label: 'Maintenance', value: 'Maintenance', icon: 'handyman' },
        { label: 'Plumbing', value: 'Plumbing', icon: 'plumbing' },
        { label: 'Electrical', value: 'Electrical', icon: 'electrical_services' },
        { label: 'Security', value: 'Security', icon: 'security' },
        { label: 'Cleaning', value: 'Cleaning', icon: 'cleaning_services' },
        { label: 'Other', value: 'Other -', icon: 'help_outline' },
      ],

      filteredCallLogs: [],
      selectedStatus: null,  // was 'All'
      selectedCallType: null, // was 'All'
      selectedSort: null, // was 'Newest First'

      statusOptions: ['All', 'Opened', 'Assigned', 'Resolved', 'Closed'],
      sortOptions: ['Newest First', 'Oldest First'],

      callLogColumns: [
        { name: "index", label: "#", field: "index", align: 'center' },
        { name: "logNumber", label: "Log Number", field: "logNumber", align: 'left' },

        { name: "firstName", label: "First Name", field: "firstName", align: 'left'},
        { name: "lastName", label: "Last Name", field: "lastName", align: 'left'},
        { name: "unit", label: "Unit", field: "unit", align: 'left' },
        { name: "description", label: "Description", field: "description", align: 'left' },
        { name: "summary", label: "Summary", field: "summary", align: 'left' },

        { name: "createdDate", label: "Opened Date", field: "createdAt", align: 'left' },
        { name: "createdTime", label: "Opened Time", field: "createdAt", align: 'left' },
        { name: "closedDate", label: "Closed Date", field: "closedAt", align: 'left' },
        { name: "closedTime", label: "Closed Time", field: "closedAt", align: 'left' },
        { name: "callType", label: "Call Type", field: "callType", align: 'left' },
        { name: "status", label: "Status", field: "status", align: 'center' },
        { name: "vendorType", label: "Vendor", field: "vendorInfo", align: 'left' },

      ],
        issueOptions: {
          "IT Support": [
            { label: "WiFi", value: "WiFi" },
            { label: "Internet Down", value: "Internet Down" },
            { label: "Other", value: "Other" }
          ],

          "Maintenance": [
            { label: "Broken Door", value: "Broken Door" },
            { label: "Broken Window", value: "Broken Window" },
            { label: "Other", value: "Other" }
          ]
        },
      selectedIssue: "",
      customIssue: "",

    }
  },
  watch: {
    selectedIssue(value) {
       if (value !== "Other") {
      this.callLog.description = value;
    } else {
      this.callLog.description = "";
    }
    },
    customIssue(value){
      if (this.selectedIssue === "Other") {
      this.callLog.description = value;
    }
    },
    otherDialog(newVal) {
      if (!newVal && this.callLog.callType === 'Other -') {
        this.callLog.callType = '';
      }
    },
    'callLog.callType'(newVal) {
      if (newVal === 'Other -') {
        this.callLog.callType = '';
        this.otherDialog = true;
      }
    },
    myCallLogs: {
      handler() {
        this.filterCallLogs();
      },
      deep: true
    },

    // watch for changes in callLog.callType so that it clears when selecting other options
    'callLog.callType'() {
    this.selectedIssue = "";
    this.customIssue = "";
    this.callLog.description = "";

    if (this.callLog.callType === "Other -") {
        this.callLog.callType = "";
        this.otherDialog = true;
    }
}
  },

  methods: {
    formatDate: Helper.formatDate,
    formatTime: Helper.formatTime,

    onFilesAdded(files) {
      this.callLog.images.push(...files);
      console.log('Files added:', this.callLog.images);
    },

    async initiateCall() {
      if (this.callLog.callType === 'Other') return;

      if (!this.callLog.description || this.callLog.description.trim() === '') {
        this.$q.notify({ type: 'negative', message: 'Please provide a description of the issue.' });
        return;
      }
      if (!Array.isArray(this.callLog.images) || this.callLog.images.length === 0) {
        this.$q.notify({ type: 'negative', message: 'Please attach at least one image.' });
        return;
      }

      const formData = new FormData();
      formData.append('callType', this.callLog.callType);
      formData.append('status', this.callLog.status);
      formData.append('user', this.userDetails._id);
      formData.append('unit', this.callLog.unit);
      formData.append('description', this.callLog.description);
      formData.append('summary', this.callLog.summary);

      // Append images (can be one or many)
      if (Array.isArray(this.callLog.images)) {
        this.callLog.images.forEach(file => {
          formData.append('images[]', file);
        });
      }


      this.$q.dialog({
        title: 'Confirm',
        message: `You are about to log a ${this.callLog.callType} call, continue?`,
        color: 'primary',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        const response = await CallLogService.createCallLog(formData);
        if (response) {
          this.$q.notify({ type: 'positive', color: 'primary', message: 'Your call log has been sent!' });
          await this.getAllMyCallLogs();
          this.reset();
          this.$refs.uploader.reset();
          this.openWhatsApp();
        } else {
          this.$q.notify({ type: 'negative', message: 'Call log failed. Please try again.' });
        }
      }).onCancel(() => {});
    },

    async initiateCustomCall() {
      if (!this.customCallType) return;

      if (!this.callLog.description || this.callLog.description.trim() === '') {
        this.$q.notify({ type: 'negative', message: 'Please provide a description of the issue.' });
        return;
      }
      if (!Array.isArray(this.callLog.images) || this.callLog.images.length === 0) {
        this.$q.notify({ type: 'negative', message: 'Please attach at least one image.' });
        return;
      }

      const formData = new FormData();
      formData.append('callType', "Other - " + this.customCallType);
      formData.append('status', this.callLog.status);
      formData.append('user', this.userDetails._id);
      formData.append('unit', this.callLog.unit);
      formData.append('description', this.callLog.description);
      formData.append('summary', this.callLog.summary);

      // Append images (can be one or many)
      if (Array.isArray(this.callLog.images)) {
        this.callLog.images.forEach(file => {
          formData.append('images[]', file);
        });
      }

      const response = await CallLogService.createCallLog(formData);
      if (response) {
        this.$q.notify({ type: 'positive', color: 'primary', message: 'Your call log has been sent!' });
        await this.getAllMyCallLogs();
        this.reset();
        this.otherDialog = false;
        this.customCallType = '';
        this.$refs.uploader.reset();
        this.openWhatsApp();
      } else {
        this.$q.notify({ type: 'negative', message: 'Call log failed. Please try again.' });
      }
    },

    filterCallLogs() {
      this.filteredCallLogs = this.myCallLogs.filter(log => {
        const statusMatch = this.selectedStatus === null || this.selectedStatus === 'All' || log.status === this.selectedStatus;
        const typeMatch = this.selectedCallType === null || this.selectedCallType === 'All' || log.callType === this.selectedCallType;

        // Exception: Allow filtering by call types starting with "Other - "
        const otherTypeMatch = this.selectedCallType === 'Other' && log.callType.startsWith('Other - ');

        return statusMatch && (typeMatch || otherTypeMatch);
      });

      this.sortCallLogs();
    },
    sortCallLogs() {
      if (!this.selectedSort) {
        return; // Don't sort if no selection
      }
      this.filteredCallLogs.sort((a, b) => {
        return this.selectedSort === 'Newest First'
          ? new Date(b.createdAt) - new Date(a.createdAt)
          : new Date(a.createdAt) - new Date(b.createdAt);
      });
    },

    async getAllMyCallLogs() {
      const logs = await CallLogService.findMyCallLogs(this.userDetails._id);

      const myLogs = await Promise.all(
        logs.map(async (log, index) => {
          const user = await UserService.findUserById(log.user);
          return {
            ...log,
            index: index + 1,
            unit: log.unit ?? null,
            description: log.description ?? null,
            summary: log.summary ?? null,
            firstName: user?.firstName ?? null,
            lastName: user?.lastName ?? null
          };
        })
      );

      this.myCallLogs = myLogs;
    },

    async fetchUserDetails() {
      this.loading = true;
      this.userDetails = await Helper.fetchUserDetails();

      await this.getAllMyCallLogs();

      this.filteredCallLogs = [...this.myCallLogs];
      this.loading = false;
    },









    openWhatsApp() {
      const phoneNumber = '+27657207713'; // Replace with your company phone number
      const url = `https://wa.me/${phoneNumber}`;
      window.open(url, '_blank');
    },


    // async deleteCallLog(callLog) {
    //   if (callLog.status === 'Resolved') {
    //     this.$q.notify({ type: 'negative', message: 'Deletion is restricted as this call log is tied to your call log history.' });
    //     return;
    //   }
    //   this.$q.dialog({
    //     title: 'Confirm',
    //     message: `You are about to delete this call log, continue?`,
    //     color: 'primary',
    //     cancel: true,
    //     persistent: true
    //   }).onOk(async () => {
    //     const response = await CallLogService.deleteCallLog(callLog._id);
    //     if (response) {
    //       this.$q.notify({ type: 'positive', color: 'primary', message: 'Your call log has been deleted!' });
    //       await this.getAllMyCallLogs();
    //     } else {
    //       this.$q.notify({ type: 'negative', message: 'Delete call log failed. Please try again.' });
    //     }
    //   }).onCancel(() => {});
    // },
    reset() {
      this.callLog = {
        callType: '',
        status: 'Pending',
        user: null,
        unit: '',
        description: '',
        summary: '',
        images: []
      };
      this.selectedIssue = '';
      this.customIssue = '';
    }
  },
  mounted() {
    this.fetchUserDetails();
  }
}
</script>

<style lang="sass" scoped>
.q-radio
  display: flex
  flex-direction: column
  align-items: center
  padding: 10px
  border-radius: 8px
  transition: all 0.3s

.q-radio:hover
  background-color: rgba(0, 0, 0, 0.05)

.q-icon
  margin-bottom: 5px

.stats-card
  border-radius: 8px
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)

.stats-header
  background-color: #f5f5f5
  border-top-left-radius: 8px
  border-top-right-radius: 8px
  @media (max-width: 600px)
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center

.custom-button
  &:hover
    background-color: black !important
    color: white !important
</style>
