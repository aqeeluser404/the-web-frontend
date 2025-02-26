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
          <CustomButton label="Initiate Call" color="brown" text-color="white" @click="initiateCall" />
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
        { label: 'Complaint', value: 'Complaint' },
        { label: 'Cleaning', value: 'Cleaning' },
        { label: 'Maintenance', value: 'Maintenance' },
        { label: 'Lease Extension', value: 'Lease Extension' },
        { label: 'Rent Payment Issue', value: 'Rent Payment Issue' },
        { label: 'Noise Complaint', value: 'Noise Complaint' },
        { label: 'Security Issue', value: 'Security Issue' },
        { label: 'Utility Problem', value: 'Utility Problem' },
        { label: 'Move-In/Move-Out Inspection', value: 'Move-In/Move-Out Inspection' },
        { label: 'General Inquiry', value: 'General Inquiry' }
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
