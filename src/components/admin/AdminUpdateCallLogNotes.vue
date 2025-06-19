<template>
  <q-card class="component-card">
    <q-card-section>
      <div class="text-h6">Call Log Notes</div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <q-item>
        <q-item-section>Notes</q-item-section>
        <q-item-section>
          <q-input label-color="black" v-model="localCallLog.vendorNotes.notes" type="textarea" stack-label
            style="border: 2px solid white;">
          </q-input>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section>Resolution Details</q-item-section>
        <q-item-section>
          <q-input label-color="black" v-model="localCallLog.vendorNotes.resolution" type="textarea" stack-label
            style="border: 2px solid white;">
          </q-input>
        </q-item-section>
      </q-item>
    </q-card-section>

    <q-card-section class="row justify-between">
      <CustomButton label="Update" customStyle="width: 45%" @click="updateCallLog" />
      <CustomButton label="Close" color="white" text-color="black" customStyle="width: 45%" @click="$emit('close')" />
    </q-card-section>

  </q-card>

</template>

<script>
import CustomButton from '../elements/CustomButton.vue';
import CallLogService from 'src/services/CallLogService';

export default {
  components: {
    CustomButton
  },
  props: {
    callLog: {
      type: Object,
      required: true
    }
  },
  data() {
  return {
    localCallLog: {
      ...this.callLog,
      vendorNotes: {
        notes: '',
        resolution: '',
        ...(this.callLog.vendorNotes || {})
      }
    }
  };
},
  methods: {
    async updateCallLog() {

      const updatedCallLog = {
        // ...this.localCallLog,
        vendorNotes: {
          notes: this.localCallLog.vendorNotes.notes,
          resolution: this.localCallLog.vendorNotes.resolution
        }
      }
      // console.log(updatedCallLog)
      this.$q.dialog({
        title: 'Confirm',
        message: `You are about to update this call log notes, continue?`,
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
    }
  }
}
</script>
