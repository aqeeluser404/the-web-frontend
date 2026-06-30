<template>
  <q-card class="combined-unit-card">

    <div class="row">
      <!-- left section -->
      <div class="col-md-6 col-12 q-pa-md left-card" style="background-color: #f8f8f8;">
        <q-card-section class="row justify-between items-center">
          <div class="text-h6">Address Call Log</div>
          <q-btn flat round icon="close" @click="$emit('close')" size="md" color="grey-10" aria-label="Close"
            class="small-screen-only" />
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

          <q-item>
            <q-item-section class="text-left text-subtitle1">Description</q-item-section>
            <q-item-section class="text-left text-subtitle1">
              <q-input readonly v-model="callLog.description" />
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section class="text-left text-subtitle1">Summary</q-item-section>
            <q-item-section class="text-left text-subtitle1">
              <q-input readonly type="textarea" autogrow v-model="callLog.summary" />
            </q-item-section>
          </q-item>

          <q-item v-if="callLog.images && callLog.images.length > 0"></q-item>

          <q-item v-if="callLog.images && callLog.images.length > 0">
            <div class="image-container">
              <q-img
                v-if="callLog.images && callLog.images.length > 0"
                :src="getImageUrl(callLog.images[currentImageIndex].imageUrl)"
                class="product-image cursor-zoom-in"
                @click="showImageDialog = true" fit="contain"
              />
              <q-btn round flat dense class="nav-button left" icon="chevron_left" @click="prevImage" />
              <q-btn round flat dense class="nav-button right" icon="chevron_right" @click="nextImage" />
            </div>
          </q-item>

        </q-card-section>
      </div>

      <!-- right section -->
      <div class="col-md-6 col-12 q-pa-md">

        <q-card-section class="row justify-end items-center q-py-none q-py-xs">
          <q-btn flat round icon="close" @click="$emit('close')" size="md" color="grey-10" aria-label="Close"
            class="large-screen-only" />
        </q-card-section>

        <q-card-section>
          <q-item>
            <q-item-section class="text-left text-subtitle1">Add an update to inform the tenant</q-item-section>
            <q-item-section class="text-left text-subtitle1">
              <q-input autogrow type="textarea" v-model="update" />
            </q-item-section>
          </q-item>
        </q-card-section>

        <q-card-section>
          <div v-if="mode !== 'resolved'">
            <q-item class="q-my-md">
              <q-item-section class="text-left text-subtitle1">Assign a vendor</q-item-section>
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
                  <q-select v-else v-model="vendorInfo.vendorType" :options="vendorTypeOptions"
                    label="Select vendor type" emit-value map-options @update:model-value="autoFillVendorContact" />
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
                  <q-input v-model="vendorInfo.vendorAssignedDate" label="Assign a date" type="date" />
                </q-item-section>
              </q-item>
            </div>
          </div>
        </q-card-section>

        <q-card-section class="row items-center q-gutter-x-sm">
          <div class="row justify-between">
            <CustomButton v-if="mode !== 'resolved'" label="Update Call Log" customStyle="width: 100%"
              @click="updateUserType" />
            <CustomButton v-if="mode === 'resolved'" label="Reopen Call Log" customStyle="width: 100%"
              @click="reopenCallLog" />
          </div>

          <div class="" v-if="mode === 'editable'">
            <CustomButton v-if="mode === 'editable'" label="Resolved" color="white" text-color="black"
              @click="markResolved" />
          </div>
          <!-- <div>
            <CustomButton label="Close" color="white" text-color="black" customStyle="width: 100%"
              @click="submitUpdate" />
          </div> -->
        </q-card-section>
      </div>
    </div>
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
    },
  },
  data() {
    return {
      user: {},
      update: null,
      currentImageIndex: 0,
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
        { label: 'IT Support', value: 'IT Support' },
        { label: 'Maintenance', value: 'Maintenance' },
        { label: 'Plumbing', value: 'Plumbing' },
        { label: 'Electrical', value: 'Electrical' },
        { label: 'Security', value: 'Security' },
        { label: 'Cleaning', value: 'Cleaning' },
        { label: 'Other', value: 'Other' }
      ],
      vendorContacts: {
        'IT Support': 'TheWeb@trafalgar.co.za',
        'Maintenance': 'TheWeb@trafalgar.co.za',
        'Plumbing': 'TheWeb@trafalgar.co.za',
        'Electrical': 'TheWeb@trafalgar.co.za',
        'Security': 'TheWeb@trafalgar.co.za',
        'Cleaning': 'TheWeb@trafalgar.co.za',
        'Other': 'TheWeb@trafalgar.co.za'
      }
    }
  },
  computed: {
    isOtherCallType() {
      return this.callLog.callType?.startsWith('Other -');
    },
    currentDialogImageUrl() {
      if (!this.callLog.images || !this.callLog.images.length) return null
      const image = this.callLog.images[this.currentImageIndex]
      if (!image || !image.imageUrl) return null
      return this.getImageUrl(image.imageUrl)
    },
  },
  components: {
    CustomButton
  },
  methods: {
    getImageUrl: Helper.getImageUrl,
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

    nextImage() {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.callLog.images.length
    },
    prevImage() {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.callLog.images.length) % this.callLog.images.length
    },

    async updateUserType() {
      if (this.assignVendor === 'yes' && !this.vendorInfo.vendorContact) {
        this.$q.notify({
          type: 'negative',
          message: 'Please provide vendor contact information'
        });
        return;
      }

      let user = await Helper.fetchUserDetails()

      // Set status based on vendor assignment
      let status = this.callLog.status;
      if (this.assignVendor === 'yes') {
        status = 'Assigned';
      } else if (this.assignVendor === 'no') {
        status = 'Opened';
      }

      console.log('update field:', this.update)
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

        updates: this.update
          ? [{
              updateInfo: this.update,
              user: user._id
            }]
          : [],

        ...(status === 'Closed' && !this.callLog.closedAt
          ? { closedAt: new Date() }
          : {})
      };
      console.log(updatedCallLog)

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
            this.update = null;
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
    },
  }
}
</script>

<style lang="sass">
.left-card
  display: flex
  flex-direction: column
  height: 100%

.progress-wrapper
  margin-top: auto
  padding-top: 40px

.combined-unit-card
  width: 100%
  max-width: 1570px
  padding: 16px

  @media (min-width: 601px)
    min-width: 1600px
    // min-width: 1200px

  @media (max-width: 600px)
    min-width: unset
    padding: 8px

.image-container
  position: relative
  width: 100%
  height: auto
  overflow: hidden
  border-radius: 4px
  display: flex
  justify-content: center
  align-items: center

  // @media (max-width: 1025px)
  //   width: 100%
  //   height: 100%  // let container collapse or fill parent height if needed

.product-image
  max-width: 100%
  max-height: 100%
  object-fit: contain
  display: block

  @media (max-width: 1025px)
    width: 120%         // make the image bigger than container width
    height: 120%        // also bigger than container height
    object-fit: cover   // fill and crop to cover container fully
    max-width: none     // disable max-width to allow overflow
    max-height: none    // disable max-height

.nav-button
  position: absolute
  top: 50%
  transform: translateY(-50%)
  background: rgba(0, 0, 0, 0.2)
  color: white
  z-index: 2
  width: 48px
  height: 48px
  font-size: 24px
  &.left
    left: 24px
  &.right
    right: 24px

</style>
