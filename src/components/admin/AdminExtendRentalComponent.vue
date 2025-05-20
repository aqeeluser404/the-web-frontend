<template>
  <q-card class="component-card">
    <q-card-section>
      <div class="text-h6">Extend Rental End Date</div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <q-item>
        <q-item-section class="text-left text-subtitle1">New Date</q-item-section>
        <q-item-section class="text-left text-subtitle1">
          <q-input  v-model="rentalExtension" type="date" :min="formattedEndDate" />
        </q-item-section>
      </q-item>
      <!-- <div class="q-mb-sm"><b>Please select the new end date</b></div>
      <q-input v-model="rentalExtension" label="Extended lease" type="date" :min="formattedEndDate" /> -->
    </q-card-section>

    <q-card-section class="row justify-between">
      <CustomButton label="Save Changes" customStyle="width: 45%" @click="extendRental" />
      <CustomButton label="Close" color="white" text-color="black" @click="$emit('close')" customStyle="width: 45%" />
    </q-card-section>
  </q-card>
</template>

<script>
import CustomButton from '../elements/CustomButton.vue';
import RentalService from 'src/services/RentalService';
import EmailService from 'src/services/EmailService';
export default {
  name: 'AdminExtendRentalComponent',

  props: {
    rental: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      formattedEndDate: ''
    }
  },
  components: {
    CustomButton
  },
  methods: {
    formatEndDate() {
      const endDate = new Date(this.rental.rentalEndDate);
      this.formattedEndDate = endDate.toISOString().split('T')[0];
    },
    async extendRental() {

      if (!this.rentalExtension) {
        this.$q.notify({ type: 'negative', message: 'Please select an extension date.' });
        return
      }
      let message = ''
      message = `${this.rentalExtension}`;

      const updatedRental = {
        applicationDate: this.rental.applicationDate,
        status: this.rental.status,
        rentalStartDate: this.rental.rentalStartDate,

        rentalEndDate: this.rentalExtension,

        rentalPrice: this.rental.rentalPrice,
        unit: this.rental.unit,
        unitType: this.rental.unitType,
        user: this.rental.user
      }

      this.$q.dialog({
        title: 'Confirm', message: `You are about to extend this rental and notify applicant, continue?`, color: 'primary', cancel: true, persistent: true
      }).onOk(async () => {
        const response = await RentalService.updateRental(this.rental._id, updatedRental)
        if (response) {
          this.$q.notify({ type: 'positive', color: 'primary', message: 'Rental Extended!' })

          // Send email to user
          await EmailService.SendExtendedDate(this.rental.user, { message })

          this.$emit('close')
        } else {
          this.$q.notify({ type: 'negative', message: 'Extension for rental failed. Please try again.' })
        }
      }).onCancel(() => {
        return
      })

    }
  },
  created() {
    this.formatEndDate();
  },
}
</script>
