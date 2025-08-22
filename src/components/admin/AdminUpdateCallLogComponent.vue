<template>
  <q-card class="component-card">
    <q-card-section>
      <div class="text-h6">Address Call Log</div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <q-item>
        <q-item-section class="text-left text-subtitle1">Opened Date/Time</q-item-section>
        <q-item-section class="text-left text-subtitle1">
          <q-input readonly
            :model-value="`${formatDate(callLog.createdAt)}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${formatTime(callLog.createdAt)}`" />
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section class="text-left text-subtitle1">Closed Date/Time</q-item-section>
        <q-item-section class="text-left text-subtitle1">
          <q-input readonly
            :model-value="callLog.closedAt ? `${formatDate(callLog.closedAt)}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;${formatTime(callLog.closedAt)}` : 'N/A'" />
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section class="text-left text-subtitle1">Call Type</q-item-section>
        <q-item-section class="text-left text-subtitle1">
          <q-input readonly v-model="callLog.callType" />
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section class="text-left text-subtitle1">Status</q-item-section>
        <q-item-section class="text-left text-subtitle1">
          <q-input readonly v-model="callLog.status" />
        </q-item-section>
      </q-item>

      <div v-if="mode !== 'resolved'">
        <q-item class="q-my-md">
          <q-item-section class="text-left text-subtitle1">Vendor Assignment</q-item-section>
          <q-item-section class="text-left text-subtitle1">
            <div class="row q-gutter-md items-center">
              <q-radio v-model="assignVendor" val="yes" label="Assigned" dense />
              <q-radio v-model="assignVendor" val="no" label="Unassigned" dense />
            </div>
          </q-item-section>
        </q-item>

        <div v-if="assignVendor === 'yes'">
          <q-item>
            <q-item-section class="text-left text-subtitle1">Vendor Type</q-item-section>
            <q-item-section class="text-left text-subtitle1">
              <q-input v-if="isOtherCallType" v-model="vendorInfo.vendorType" label="Enter vendor type"
                :rules="[val => !!val || 'Vendor type is required']" />
              <q-select v-else v-model="vendorInfo.vendorType" :options="vendorTypeOptions" label="Select vendor type"
                emit-value map-options @update:model-value="autoFillVendorContact" />
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section class="text-left text-subtitle1">Vendor Contact</q-item-section>
            <q-item-section class="text-left text-subtitle1">
              <q-input v-model="vendorInfo.vendorContact" label="Vendor contact email"
                :rules="[val => !!val || 'Contact email is required']" />
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section class="text-left text-subtitle1">Assignment Date</q-item-section>
            <q-item-section class="text-left text-subtitle1">
              <q-input v-model="vendorInfo.vendorAssignedDate" type="date" />
            </q-item-section>
          </q-item>
        </div>
      </div>
    </q-card-section>

    <q-card-section class="column items-center">
      <div class="full-width row justify-between q-mb-md">
        <CustomButton v-if="mode !== 'resolved'" label="Update Call Log" customStyle="width: 100%" @click="updateUserType" />
        <CustomButton v-if="mode === 'resolved'" label="Reopen Call Log" customStyle="width: 100%" @click="reopenCallLog" />
      </div>

      <div class="full-width q-mb-md" v-if="mode === 'editable'">
        <CustomButton v-if="mode === 'editable'" label="Resolved" color="white" text-color="black"
          @click="markResolved" />
      </div>
      <div class="full-width">
        <CustomButton label="Close" color="white" text-color="black" customStyle="width: 100%" @click="$emit('close')" />
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import CustomButton from '../elements/CustomButton.vue';
import CallLogService from 'src/services/CallLogService';
import Helper from 'src/services/utils';

export default {
  props: {
    callLog: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      mode: this.callLog.status === 'Resolved' ? 'resolved' : 'editable',
      assignVendor: this.callLog.vendorInfo?.vendorType ? 'yes' : 'no',
      vendorInfo: {
        vendorType: this.callLog.vendorInfo?.vendorType || null,
        vendorContact: this.callLog.vendorInfo?.vendorContact || null,
        vendorAssignedDate: this.formatDateForInput(this.callLog.vendorInfo?.vendorAssignedDate) || ''
      },
      callLogStatusOptions: [
        { label: 'Assigned', value: 'Assigned' },
        { label: 'Resolved', value: 'Resolved' },
        { label: 'Closed', value: 'Closed' },
      ],
      vendorTypeOptions: [
        { label: 'IT Support Company', value: 'IT Support Company' },
        { label: 'Maintenance Company', value: 'Maintenance Company' },
        { label: 'Plumbing Company', value: 'Plumbing Company' },
        { label: 'Electrical Company', value: 'Electrical Company' },
        { label: 'Security Company', value: 'Security Company' },
        { label: 'Cleaning Company', value: 'Cleaning Company' },
        { label: 'Test Company', value: 'Test Company' },
        { label: 'Other', value: 'Other' }
      ],
      vendorContacts: {
        'IT Support Company': 'itsupport@company.com',
        'Maintenance Company': 'maintenance@company.com',
        'Plumbing Company': 'plumbing@company.com',
        'Electrical Company': 'electrical@company.com',
        'Security Company': 'security@company.com',
        'Cleaning Company': 'cleaning@company.com',
        'Test Company': 'tamakikotatsu404@gmail.com',
        'Other': 'vendors@company.com'
      }
    }
  },
  computed: {
    isOtherCallType() {
      return this.callLog.callType?.startsWith('Other -');
    }
  },
  components: {
    CustomButton
  },
  methods: {
    formatDate: Helper.formatDate,
    formatTime: Helper.formatTime,

    formatDateForInput(date) {
      if (!date) return '';
      const d = new Date(date);
      return d.toISOString().split('T')[0];
    },

    autoFillVendorContact(selectedType) {
      if (this.isOtherCallType) return;
      if (selectedType && this.vendorContacts[selectedType]) {
        this.vendorInfo.vendorContact = this.vendorContacts[selectedType];
      }
    },

    async updateUserType() {
      if (this.assignVendor === 'yes' && !this.vendorInfo.vendorContact) {
        this.$q.notify({
          type: 'negative',
          message: 'Please provide vendor contact information'
        });
        return;
      }

      // Set status based on vendor assignment
      let status = this.callLog.status;
      if (this.assignVendor === 'yes') {
        status = 'Assigned';
      } else if (this.assignVendor === 'no') {
        status = 'Opened';
      }

      const updatedCallLog = {
        callType: this.callLog.callType,
        status,
        createdAt: this.callLog.createdAt,
        user: this.callLog.user,
        vendorInfo: this.assignVendor === 'yes'
          ? {
            vendorType: this.vendorInfo.vendorType || null,
            vendorContact: this.vendorInfo.vendorContact || null,
            vendorAssignedDate: this.vendorInfo.vendorAssignedDate
              ? new Date(this.vendorInfo.vendorAssignedDate)
              : new Date()
          }
          : { vendorType: null, vendorContact: null, vendorAssignedDate: null },

        ...(status === 'Closed' && !this.callLog.closedAt
          ? { closedAt: new Date() }
          : {})
      };

      this.$q.dialog({
        title: 'Confirm',
        message: `You are about to update this call log status, continue?`,
        color: 'primary',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        try {
          const response = await CallLogService.updateCallLog(this.callLog._id, updatedCallLog);
          if (response) {
            this.$q.notify({
              type: 'positive',
              color: 'primary',
              message: 'Update successful!',
            });
            this.$emit('close');
          }
        } catch (error) {
          console.error('Update error:', error);
          this.$q.notify({ type: 'negative', message: 'An error occurred during update.' });
        }
      }).onCancel(() => { });
    },

    async markResolved() {
      const updatedCallLog = {
        status: 'Resolved'
      };

      this.$q.dialog({
        title: 'Confirm',
        message: `You are about to resolve this call log, continue?`,
        color: 'primary',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        try {
          await CallLogService.updateCallLog(this.callLog._id, updatedCallLog);
          this.mode = 'resolved';

          this.$q.notify({
            type: 'positive',
            color: 'primary',
            message: 'Call log marked as resolved.'
          });
          this.$emit('close');
        } catch (error) {
          console.error(error);
          this.$q.notify({ type: 'negative', message: 'Failed to resolve call log.' });
        }
      }).onCancel(() => { });
    },

    async reopenCallLog() {
      const updatedCallLog = {
        status: 'Opened'
      };

      this.$q.dialog({
        title: 'Confirm',
        message: `You are about to re-open this call log, continue?`,
        color: 'primary',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        try {
          await CallLogService.updateCallLog(this.callLog._id, updatedCallLog);
          this.mode = 'editable';

          this.$q.notify({
            type: 'info',
            color: 'primary',
            message: 'Call log has been reopened.'
          });
        } catch (error) {
          console.error(error);
          this.$q.notify({ type: 'negative', message: 'Failed to reopen call log.' });
        }
      }).onCancel(() => { });
    }
  }
}
</script>
