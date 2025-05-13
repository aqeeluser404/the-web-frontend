<template>
  <q-card class="component-card">
    <q-card-section>
      <div class="text-h6">Address Call Log</div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <q-item class="">
        <q-item-section class="text-left text-subtitle1">Opened Date/Time</q-item-section>
        <q-item-section class="text-left">
          <div style="opacity: 90%;">
            <div>
              {{ formatDate(callLog.createdAt) }}
            </div>
            <div>
              {{ formatTime(callLog.createdAt) }}
            </div>
          </div>
        </q-item-section>
      </q-item>
      <q-item class="">
        <q-item-section class="text-left text-subtitle1">Closed Date/Time</q-item-section>
        <q-item-section class="text-left">
          <div style="opacity: 90%;" v-if="callLog.closedAt">
            <div>
              {{ formatDate(callLog.closedAt) }}
            </div>
            <div>
              {{ formatTime(callLog.closedAt) }}
            </div>
          </div>
          <div v-else>
            N/A
          </div>
        </q-item-section>
      </q-item>

      <br>

      <!-- Vendor Info Section -->
      <q-item>
        <q-item-section class="text-left text-subtitle1">Vendor Assignment</q-item-section>
        <q-item-section class="text-left">
          <q-radio v-model="assignVendor" val="yes" label="Assign Vendor" />
          <q-radio v-model="assignVendor" val="no" label="No Vendor" />
        </q-item-section>
      </q-item>

      <div v-if="assignVendor === 'yes'">
        <q-item>
          <q-item-section class="text-left text-subtitle1">Vendor Type</q-item-section>
          <q-item-section class="text-left">
            <q-select
              v-model="vendorInfo.vendorType"
              :options="vendorTypeOptions"
              label="Select vendor type"
              emit-value
              map-options
              @update:model-value="autoFillVendorContact"
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section class="text-left text-subtitle1">Vendor Contact</q-item-section>
          <q-item-section class="text-left">
            <q-input
              v-model="vendorInfo.vendorContact"
              label="Vendor contact email"
              :rules="[val => !!val || 'Contact email is required']"
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section class="text-left text-subtitle1">Assignment Date</q-item-section>
          <q-item-section class="text-left">
            <q-input v-model="vendorInfo.vendorAssignedDate" type="date" />
          </q-item-section>
        </q-item>
      </div>

      <q-item>
        <q-item-section class="text-left text-subtitle1">Call Type</q-item-section>
        <q-item-section class="text-left text-subtitle1">
          <q-input readonly v-model="callLog.callType" />
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section class="text-left text-subtitle1">Status</q-item-section>
        <q-item-section class="text-left text-subtitle1">
          <q-select v-model="callLog.status" :options="callLogStatusOptions" emit-value map-options />
        </q-item-section>
      </q-item>
    </q-card-section>

    <q-card-section class="row justify-between">
      <CustomButton label="Update Call Log" customStyle="width: 45%" @click="updateUserType" />
      <CustomButton label="Close" customStyle="width: 45%" color="white" text-color="black" @click="$emit('close')" />
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
        { label: 'Electrical Company', value: 'Electrical Company' },
        { label: 'Plumbing Service', value: 'Plumbing Service' },
        { label: 'HVAC Technician', value: 'HVAC Technician' },
        { label: 'General Contractor', value: 'General Contractor' },
        { label: 'Landscaping Service', value: 'Landscaping Service' },
        { label: 'Pest Control', value: 'Pest Control' },
        { label: 'Appliance Repair', value: 'Appliance Repair' },
        { label: 'Roofing Contractor', value: 'Roofing Contractor' },
        { label: 'Handyman Service', value: 'Handyman Service' },
        { label: 'Other', value: 'Other' }
      ],
      vendorContacts: {
        'Electrical Company': 'electrical@company.com',
        'Plumbing Service': 'plumbing@service.com',
        'HVAC Technician': 'hvac@technicians.com',
        'General Contractor': 'contractors@builders.com',
        'Landscaping Service': 'landscape@gardeners.com',
        'Pest Control': 'pest@control.com',
        'Appliance Repair': 'appliance@repair.com',
        'Roofing Contractor': 'roofing@experts.com',
        'Handyman Service': 'handyman@services.com',
        'Other': 'vendors@company.com'
      }
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

      const updatedCallLog = {
        callType: this.callLog.callType,
        status: this.callLog.status,
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

        ...(this.callLog.status === 'Closed' && !this.callLog.closedAt
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
      }).onCancel(() => {});
    }
  }
}
</script>
