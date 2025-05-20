<template>
  <q-page>
    <div class="q-pa-md row justify-center">
      <q-card flat bordered class="col-md-4 col-12 q-ma-sm full-height">
        <q-card-section>
          <div class="text-h6">Log a call</div>
        </q-card-section>
        <q-separator />
        <q-card-section>
          <q-item>
            <q-item-section class="text-left text-subtitle1">
              <q-select v-model="callLog.callType" label="Call Type" :options="callTypeOptions" emit-value map-options />
            </q-item-section>
          </q-item>
        </q-card-section>
        <q-card-section class="row justify-between">
          <CustomButton label="Initiate Call" @click="initiateCall" />
        </q-card-section>
      </q-card>

      <q-card flat bordered class="col-md-5 col-12 q-ma-sm full-height">
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
                <th class="text-left">Log Date</th>
                <th class="text-left">Log Time</th>
                <th class="text-left">Call Type</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(callLog, index) in myCallLogs" :key="callLog._id">
                <td class="text-left cursor-pointer">{{ index + 1 }}</td>
                <td class="text-left cursor-pointer text-uppercase" :class="{ 'active-status': callLog.status === 'Resolved'}, { 'ended-status': callLog.status === 'Pending'}"><b>{{ callLog.status }}</b></td>
                <td class="text-left cursor-pointer">{{ formatDate(callLog.createdAt) }}</td>
                <td class="text-left cursor-pointer">{{ formatTime(callLog.createdAt) }}</td>
                <td class="text-left cursor-pointer">{{ callLog.callType }}</td>
                <td class="text-left cursor-pointer">
                  <CustomButton flat color="red" text-color="red" customStyle="width: 15%" icon="eva-trash-outline" @click="deleteCallLog(callLog)" />
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card-section>
        <q-card-section v-else>
          <q-card flat>
            <q-card-section>
              <q-item>
                <q-item-section class="text-subtitle1">You have not logged a call yet.</q-item-section>
              </q-item>
            </q-card-section>
          </q-card>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import CallLogService from 'src/services/CallLogService';
import Helper from 'src/services/utils';
import CustomButton from 'src/components/elements/CustomButton.vue';

export default {
  data() {
    return {
      callLog: {
        callType: '',
        status: 'Pending',
        user: null
      },
      userDetails: {},
      myCallLogs: [],
      callTypeOptions: [
        { label: 'IT Support', value: 'IT Support' },
        { label: 'Maintenance', value: 'Maintenance' },
        { label: 'Plumbing', value: 'Plumbing' },
        { label: 'Electrical', value: 'Electrical' },
        { label: 'Security', value: 'Security' },
        { label: 'Other', value: 'Other' },
      ]
    }
  },
  components: {
    CustomButton,
  },
  methods: {
    formatDate: Helper.formatDate,
    formatTime: Helper.formatTime,
    async initiateCall() {
      const callLogData = {
        callType: this.callLog.callType,
        status: this.callLog.status,
        user: this.userDetails._id
      };
      if (callLogData.callType) {
        this.$q.dialog({
          title: 'Confirm',
          message: `You are about to log a call for ${callLogData.callType}, continue?`,
          color: 'primary',
          cancel: true,
          persistent: true
        }).onOk(async () => {
          const response = await CallLogService.createCallLog(callLogData);
          if (response) {
            this.$q.notify({ type: 'positive', color: 'primary', message: 'Your call log has been sent!' });
            await this.getAllMyCallLogs();
            this.reset();
            this.openWhatsApp();
          } else {
            this.$q.notify({ type: 'negative', message: 'Call log failed. Please try again.' });
          }
        }).onCancel(() => {});
      } else {
        this.$q.notify({ type: 'negative', message: 'Please select a call type.' });
      }
    },
    openWhatsApp() {
      const phoneNumber = '+27823433945'; // Replace with your company phone number
      const url = `https://wa.me/${phoneNumber}`;
      window.open(url, '_blank');
    },
    async getAllMyCallLogs() {
      this.myCallLogs = await CallLogService.findMyCallLogs(this.userDetails._id);
    },
    async fetchUserDetails() {
      this.userDetails = await Helper.fetchUserDetails();
      await this.getAllMyCallLogs();
    },
    async deleteCallLog(callLog) {
      if (callLog.status === 'Resolved') {
        this.$q.notify({ type: 'negative', message: 'Deletion is restricted as this call log is tied to your call log history.' });
        return;
      }
      this.$q.dialog({
        title: 'Confirm',
        message: `You are about to delete this call log, continue?`,
        color: 'primary',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        const response = await CallLogService.deleteCallLog(callLog._id);
        if (response) {
          this.$q.notify({ type: 'positive', color: 'primary', message: 'Your call log has been deleted!' });
          await this.getAllMyCallLogs();
        } else {
          this.$q.notify({ type: 'negative', message: 'Delete call log failed. Please try again.' });
        }
      }).onCancel(() => {});
    },
    reset() {
      this.callLog = {
        callType: '',
        status: 'Pending',
        user: null
      };
    }
  },
  mounted() {
    this.fetchUserDetails();
  }
}
</script>

<!-- PHP VERSION -->
<!-- <template>
  <q-page>
    <div class="q-pa-md constrain">
      <q-card class="col-md-4 col-12 stats-card q-ma-sm full-height">
        <q-card-section class="row stats-header justify-center">
          <div class="text-h6">Log a call</div>
          <q-separator class="q-my-sm" style="width: 100%;" />
        </q-card-section>

        <q-card-section>
          <div class="row q-gutter-sm justify-center">
            <q-btn
              v-for="option in callTypeOptions"
              :key="option.value"
              :color="callLog.callType === option.value ? 'primary' : 'grey-8'"
              :icon="option.icon"
              flat rounded
              size="lg"
              :label="option.label"
              class="col-md-2 col-12 custom-button"
              @click="callLog.callType = option.value"
              style="border: 1px solid;"
            >
              <q-tooltip>{{ option.label }}</q-tooltip>
            </q-btn>
          </div>
        </q-card-section>

        <q-card-section class="row justify-center">
          <CustomButton
            label="Initiate Call"
            @click="initiateCall"
            :disabled="!callLog.callType"
            customStyle="width: 250px; @media (max-width: 600px) { width: 100% !important; }"
          />
        </q-card-section>
      </q-card>

      <q-card flat class="col-md-4 col-12 q-ma-sm full-height">

        <q-card-section class="q-px-none">
          <div class="q-mb-sm ">
            <div class="text-h6 text-subtitle1">Filter with:</div>
          </div>

          <div class="row q-gutter-md ">
            <q-select
              v-model="selectedStatus"
              filled
              :options="statusOptions"
              label="Status"
              @update:model-value="filterCallLogs"
              class="col-11 col-md-2"
              behavior="menu"
              options-selected-class="text-weight-bold"
              emit-value
              map-options
              dense
            />

            <q-select
              v-model="selectedCallType"
              filled
              :options="['All', ...callTypeOptions.map(option => option.label)]"
              label="Call Type"
              @update:model-value="filterCallLogs"
              class="col-11 col-md-2"
              behavior="menu"
              options-selected-class="text-weight-bold"
              emit-value
              map-options
              dense
            />

            <q-select
              v-model="selectedSort"
              filled
              :options="sortOptions"
              label="Sort By"
              @update:model-value="sortCallLogs"
              class="col-11 col-md-2"
              behavior="menu"
              options-selected-class="text-weight-bold"
              emit-value
              map-options
              dense
            />
          </div>

        </q-card-section>
      </q-card>

      <q-card flat bordered class="col-md-4 col-12 q-ma-sm full-height">
        <q-card-section class="row justify-center">
          <div class="text-h6">Call Log History</div>
        </q-card-section>
        <q-separator />
        <q-card-section v-if="filteredCallLogs.length > 0">
          <q-markup-table flat bordered>
            <thead>
              <tr>
                <th></th>

                <th class="text-left">Log Number</th>
                <th class="text-left">Opened Date</th>
                <th class="text-left">Opened Time</th>
                <th class="text-left">Closed Date</th>
                <th class="text-left">Call Type</th>
                <th class="text-left">Status</th>
                <th class="text-left">Vendor</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(callLog, index) in filteredCallLogs" :key="callLog._id">
                <td class="text-left cursor-pointer">{{ index + 1 }}</td>
                <td class="text-left cursor-pointer id">{{ callLog.logNumber }}</td>
                <td class="text-left cursor-pointer">{{ formatDate(callLog.createdAt) }}</td>
                <td class="text-left cursor-pointer">{{ formatTime(callLog.createdAt) }}</td>
                <td class="text-left cursor-pointer">
                  <div v-if="callLog.closedAt">
                    {{ formatDate(callLog.closedAt) }}
                  </div>
                  <div v-else>N/A</div>
                </td>
                <td class="text-left cursor-pointer">{{ callLog.callType }}</td>
                <td class="text-left cursor-pointer text-uppercase" :class="
                    { 'callLog-opened': callLog.status === 'Opened'},
                    { 'callLog-assigned': callLog.status === 'Assigned'},
                    { 'callLog-resolved': callLog.status === 'Resolved'},
                    { 'callLog-closed': callLog.status === 'Closed'}"
                  >
                  {{ callLog.status }}
                </td>
                <td class="text-left cursor-pointer">
                  <div v-if="callLog.vendorInfo && callLog.vendorInfo.vendorType">
                    {{ callLog.vendorInfo.vendorType }}
                  </div>
                  <div v-else>N/A</div>
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card-section>
        <q-card-section v-else>
          <q-card flat>
            <q-card-section class="row justify-center">
              <q-item>
                <q-item-section class="text-subtitle1">You have not logged a call yet.</q-item-section>
              </q-item>
            </q-card-section>
          </q-card>
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
                <q-input
                  v-model="customCallType"
                  label="Other"
                  autofocus
                  @keyup.enter="initiateCustomCall"
                />
              </q-item-section>
            </q-item>
          </q-card-section>

          <q-card-section class="row justify-between">
            <CustomButton
              customStyle="width: 45%"
              label="Initiate Call"
              @click="initiateCustomCall"
              :disabled="!customCallType"
            />
            <CustomButton customStyle="width: 45%" color="white" text-color="primary" label="Cancel" v-close-popup />

          </q-card-section>
        </q-card>
      </q-dialog>
    </div>
  </q-page>
</template>

<script>
import CallLogService from 'src/services/CallLogService';
import Helper from 'src/services/utils';
import CustomButton from 'src/components/elements/CustomButton.vue';

export default {
  data() {
    return {
      callLog: {
        callType: '',
        // status: 'Pending',
        status: 'Opened',
        user: null
      },
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
      sortOptions: ['Newest First', 'Oldest First']
    }
  },
  components: {
    CustomButton,
  },
  watch: {
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
  },
  methods: {
    formatDate: Helper.formatDate,
    formatTime: Helper.formatTime,
    async initiateCall() {
      if (this.callLog.callType === 'Other') return;
      // if (this.callLog.callType.startsWith('Other - ')) return;

      const callLogData = {
        callType: this.callLog.callType,
        status: this.callLog.status,
        user: this.userDetails._id
      };

      this.$q.dialog({
        title: 'Confirm',
        message: `You are about to log a ${callLogData.callType} call, continue?`,
        color: 'primary',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        const response = await CallLogService.createCallLog(callLogData);
        if (response) {
          this.$q.notify({ type: 'positive', color: 'primary', message: 'Your call log has been sent!' });
          await this.getAllMyCallLogs();
          this.reset();
          this.openWhatsApp();
        } else {
          this.$q.notify({ type: 'negative', message: 'Call log failed. Please try again.' });
        }
      }).onCancel(() => {});
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

    async initiateCustomCall() {
      if (!this.customCallType) return;

      const callLogData = {
        callType: "Other - " + this.customCallType,
        status: this.callLog.status,
        user: this.userDetails._id
      };

      const response = await CallLogService.createCallLog(callLogData);
      if (response) {
        this.$q.notify({ type: 'positive', color: 'primary', message: 'Your call log has been sent!' });
        await this.getAllMyCallLogs();
        this.reset();
        this.otherDialog = false;
        this.customCallType = '';
        this.openWhatsApp();
      } else {
        this.$q.notify({ type: 'negative', message: 'Call log failed. Please try again.' });
      }
    },
    openWhatsApp() {
      const phoneNumber = '+27823433945'; // Replace with your company phone number
      const url = `https://wa.me/${phoneNumber}`;
      window.open(url, '_blank');
    },
    async getAllMyCallLogs() {
      this.myCallLogs = await CallLogService.findMyCallLogs(this.userDetails._id);
    },
    async fetchUserDetails() {
      this.userDetails = await Helper.fetchUserDetails();
      await this.getAllMyCallLogs();
      this.filteredCallLogs = [...this.myCallLogs];
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
        user: null
      };
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
</style> -->
