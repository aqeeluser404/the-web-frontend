<template>
  <q-card style="width: 650px;">
    <q-card-section>
      <div class="text-h6">Address Call Log</div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <q-item class="">
        <q-item-section class="text-left text-subtitle1">Log Date</q-item-section>
        <q-item-section class="text-left">
          <div style="opacity: 90%;">{{ formatDate(callLog.createdAt) }}</div>
        </q-item-section>
      </q-item>
      <q-item class="">
        <q-item-section class="text-left text-subtitle1">Log Time</q-item-section>
        <q-item-section class="text-left">
          <div style="opacity: 90%;">{{ formatTime(callLog.createdAt) }}</div>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section class="text-left text-subtitle1">Call Type</q-item-section>
        <q-item-section class="text-left text-subtitle1">
          <q-input readonly v-model="callLog.callType" />
        </q-item-section>
      </q-item>
      <!-- <q-item>
        <q-item-section class="text-left text-subtitle1">Description</q-item-section>
        <q-item-section class="text-left text-subtitle1">
          <q-input readonly v-model="callLog.description" />
        </q-item-section>
      </q-item> -->
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
      callLogStatusOptions: [
        { label: 'Pending', value: 'Pending' },
        { label: 'In Progress', value: 'In Progress' },
        { label: 'Resolved', value: 'Resolved' },
      ],
    }
  },
  components: {
    CustomButton
  },
  methods: {
    formatDate: Helper.formatDate,
    formatTime: Helper.formatTime,

    async updateUserType() {
      const updatedCallLog = {
        callType: this.callLog.callType,
        description: this.callLog.description,
        status: this.callLog.status,
        createdAt: this.callLog.createdAt,
        user: this.callLog.user
      }
      if (updatedCallLog) {
        this.$q.dialog({
          title: 'Confirm', message: `You are about to update this call Log status, continue?`, color: 'primary', cancel: true, persistent: true
        }).onOk(async () => {
          const response = await CallLogService.updateCallLog(this.callLog._id, updatedCallLog)
          if (response) {
            this.$q.notify({ type: 'positive', color: 'primary', message: 'Update successful!' })
            this.$emit('close')
          } else {
            this.$q.notify({ type: 'negative', message: 'Update failed. Please try again.' })
          }
        }).onCancel(() => {
          return
        })
      }
    },
  }
}

</script>
