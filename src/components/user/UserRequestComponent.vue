<template>
  <q-card class="component-card">
    <q-card-section>
      <div class="text-h6">Contact Administration</div>
    </q-card-section>

    <q-separator />

    <q-card-section class="column justify-start">
      <div class="q-mb-md"><b>Reasons for contact</b></div>
      <q-radio v-model="isExtension" :val="true" label="Request to extend lease period." />
      <q-radio v-model="isExtension" :val="false" label="Request to end rental." />
    </q-card-section>

    <q-card-section v-if="isExtension === true">
      <div class="q-mb-sm"><b>Please select your preferred extension lease date</b></div>
      <q-input v-model="rentalExtension" label="Extended lease" type="date" :min="formattedEndDate" />
    </q-card-section>

    <q-card-section v-if="isExtension === false">
      <div class="q-mb-sm"><b>Lease agreement</b></div>
      <ul>
        <li>Lorem ipsum dolor sit amet consectetur adipisicing.</li>
        <li>Lorem ipsum dolor sit amet consectetur adipisicing.</li>
        <li>Lorem ipsum dolor sit amet consectetur adipisicing.</li>
      </ul>
    </q-card-section>

    <q-card-section class="row justify-between">
      <CustomButton label="Send Message" customStyle="width: 45%" @click="sendRequest" />
      <CustomButton label="Close" color="white" text-color="black" @click="$emit('close')" customStyle="width: 45%" />
    </q-card-section>
  </q-card>
</template>

<script>
import EmailService from 'src/services/EmailService';
import CustomButton from '../elements/CustomButton.vue';

export default {
  name: 'UserRequestComponent',
  props: {
    rental: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      isExtension: null,
      formattedEndDate: ''
    }
  },
  components: {
    CustomButton
  },
  created() {
    this.formatEndDate();
  },
  methods: {
    formatEndDate() {
      const endDate = new Date(this.rental.rentalEndDate);
      this.formattedEndDate = endDate.toISOString().split('T')[0];
    },
    async sendRequest() {
      if (this.isExtension === null) {
        this.$q.notify({ type: 'negative', message: 'Please select a reason for contact.' });
        return;
      }

      let message = '';

      if (this.isExtension) {
        if (!this.rentalExtension) {
          this.$q.notify({ type: 'negative', message: 'Please select an extension date.' });
          return;
        }
        message = `Request to extend lease period. Preferred extension date: ${this.rentalExtension}.`;
      } else {
        message = 'Request to terminate the rental agreement.';
      }

      this.$q.dialog({
        title: 'Confirm', message: message, color: 'primary', cancel: true, persistent: true
      }).onOk(async() => {
        await EmailService.SendUserRequest(this.rental.user, { message }) // Pass message as an object
        this.$q.notify({ type: 'positive', color: 'primary', message: 'Request Sent!' })
        this.$emit('close')
      }).onCancel(() => {
        return
      })
    }
  }
}
</script>
