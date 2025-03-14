<template>
  <q-card style="width: 650px;">
    <q-card-section>
      <div class="text-h6">Verify Payer Score</div>
    </q-card-section>

    <q-separator />

    <q-card-section class="wrap-text">
      <div class="q-mb-md"><b>Payer Eligibility</b></div>
      <div class="q-mb-md">This section provides an overview of the payer's eligibility, including their credit score and validation status. <span v-if="rental.payerData.isValidated" style="text-decoration: underline;">Score: {{ rental.payerData.score }}/80</span>
      </div>
      <div><b>Scoring Criteria</b></div>
      <ul>
        <li><b>ID Validation:</b> 30 points if the ID number is valid</li>
        <li><b>First Name:</b> 10 points if the first name is valid</li>
        <li><b>Last Name:</b> 10 points if the last name is valid</li>
        <li><b>Monthly Salary:</b> 20 points if the salary is within a reasonable range (R2000 - R100,000)</li>
        <li><b>Bank Name:</b> 10 points if the bank name is valid</li>
      </ul>
    </q-card-section>

    <!-- <q-card-section class="wrap-text">
      <div class="q-mb-md"><b>The Web Bank Details</b></div>
      <ul>
        <li><b>Bank Name:</b> Standard Bank</li>
        <li><b>Account Name:</b> The Web Solutions</li>
        <li><b>Account Number:</b> 123456789</li>
        <li><b>Branch Code:</b> 051001</li>
        <li><b>SWIFT Code:</b> SBZAZAJJ</li>
        <li><b>Reference:</b> [Your Invoice Number or Full Name]</li>
      </ul>
      <div>Please ensure you use the correct reference number for accurate allocation of your payment.</div>
    </q-card-section> -->


    <q-card-section class="q-gutter-md">
      <!-- First Name -->
      <q-input
        filled
        label-color="black"
        color="black"
        v-model="rental.payerData.firstName"
        label="First Name *"
        :disable="rental.payerData.isValidated"
      />
      <!-- Last Name -->
      <q-input
        filled
        label-color="black"
        color="black"
        v-model="rental.payerData.lastName"
        label="Last Name *"
        :disable="rental.payerData.isValidated"
      />
      <!-- Email -->
      <q-input
        filled
        label-color="black"
        color="black"
        v-model="rental.payerData.email"
        label="Email *"
        :disable="rental.payerData.isValidated"
      />
      <!-- ID Number -->
      <q-input
        filled
        label-color="black"
        color="black"
        v-model="rental.payerData.idNumber"
        label="ID Number *"
        :disable="rental.payerData.isValidated"
      />
      <!-- Monthly Salary -->
      <q-input
        filled
        label-color="black"
        color="black"
        v-model="rental.payerData.salary"
        label="Monthly Salary *"
        type="number"
        prefix="R"
        :disable="rental.payerData.isValidated"
      />
      <!-- Bank Selection -->
      <q-select
        filled
        label="Select Bank *"
        v-model="rental.payerData.bankName"
        :options="banks"
        label-color="black"
        color="black"
        :disable="rental.payerData.isValidated"
      />
    </q-card-section>

    <q-card-section class="row justify-between">
      <CustomButton
        v-if="!rental.payerData.isValidated"
        label="Score Payer Information"
        customStyle="width: 45%"
        color="brown"
        text-color="white"
        @click="verifyPayer"
      />
      <CustomButton
        v-if="!rental.payerData.isValidated"
        label="Close"
        customStyle="width: 45%"
        color="white"
        text-color="black"
        @click="$emit('close')"
      />
      <CustomButton
        v-else
        label="Close"
        customStyle="width: 100%"
        color="white"
        text-color="black"
        @click="$emit('close')"
      />
    </q-card-section>
  </q-card>
</template>

<script>
import RentalService from 'src/services/RentalService';
import CustomButton from '../elements/CustomButton.vue';
import Helper from 'src/services/utils';

export default {
  props: {
    rental: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      banks: [
        { label: 'Absa', value: 'Absa' },
        { label: 'Standard Bank', value: 'Standard Bank' },
        { label: 'Nedbank', value: 'Nedbank' },
        { label: 'FNB', value: 'FNB' },
        { label: 'Capitec', value: 'Capitec' },
        { label: 'Investec', value: 'Investec' },
      ]
    };
  },
  components: {
    CustomButton
  },
  methods: {
    // Validate text field to ensure it’s not empty
    validateText: Helper.validateText,
    // Validate email format using Helper service
    validateEmail: Helper.validateEmail,

    // Validate if all required fields are completed and valid
    validateFields() {
      const payerData = this.rental.payerData;

      if (!payerData.firstName || !payerData.lastName || !payerData.email || !payerData.idNumber || !payerData.salary || !payerData.bankName) {
        this.$q.notify({ type: 'negative', message: 'Please fill in all the fields.' });
        return false;
      }
      if (!this.validateEmail(payerData.email)) {
        this.$q.notify({ type: 'negative', message: 'Invalid email address.' });
        return false;
      }
      if (isNaN(payerData.salary) || payerData.salary <= 0) {
        this.$q.notify({ type: 'negative', message: 'Please enter a valid monthly salary.' });
        return false;
      }
      return true;
    },

    // This method is called when the 'Verify' button is clicked
    async verifyPayer() {
      if (!this.validateFields()) {
        return; // If validation fails, don't proceed with the API call
      }

      const payload = {
        payerData: {
          firstName: this.rental.payerData.firstName,
          lastName: this.rental.payerData.lastName,
          email: this.rental.payerData.email,
          idNumber: this.rental.payerData.idNumber,
          salary: this.rental.payerData.salary,
          bankName: this.rental.payerData.bankName,
        }
      };

      try {
        // Call the backend service to verify and save payer data
        const response = await RentalService.verifyAndSavePayer(this.rental._id, payload);

        if (response.isValidated) {
          this.$q.notify({
            type: 'positive',
            color: 'primary',
            message: `Payer verification was successful. Credit score: ${response.score}/80. Your submission is under review, and we will verify the provided information for accuracy shortly.`
          });
          this.$emit('close'); // Close the dialog after successful verification
        } else {
          this.$q.notify({
            type: 'negative',
            message: `Payer verification was unsuccessful. Credit score: ${response.score}/80. Kindly review the provided information for accuracy.`
          });
        }
      } catch (error) {
        // Handle error in case of failure
        this.$q.notify({
          type: 'negative',
          message: `Failed to verify payer: ${error.message}`
        });
      }
    }
  }
};
</script>

<style scoped>
/* Add your custom styles here */
</style>
