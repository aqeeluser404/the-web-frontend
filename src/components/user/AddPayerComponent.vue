<template>
  <q-card class="combined-unit-card">
    <div class="row">
      <!-- Left Section: Score Overview -->
      <div class="col-md-6 col-12 q-pa-md left-card" style="background-color: #f8f8f8;">
        <q-card-section class="row justify-between items-center">
          <div class="text-h6">Verify Payer Score</div>
          <q-btn flat round icon="close" @click="$emit('close')" size="md" color="grey-10" aria-label="Close" class="small-screen-only" />
        </q-card-section>

        <q-separator />

        <q-card-section class="wrap-text">
          <div class="q-mb-md"><b>Payer Eligibility</b></div>
          <div class="q-mb-md">
            This section provides an overview of the payer's eligibility, including their credit score and validation
            status.
            <span v-if="rental.payerData.isValidated" style="text-decoration: underline;">
              Score: {{ rental.payerData.score }}/80
            </span>
          </div>

          <div><b>Scoring Criteria</b></div>
          <ul>
            <li>First Name: 10 points if the first name is valid</li>
            <li>Last Name: 10 points if the last name is valid</li>
            <li>Email: 10 points if the email is valid</li>
            <li>ID Number: 30 points if the ID number is valid</li>
            <li>Bank Name: 10 points if the bank name is valid</li>
            <li>Salary: Up to 20 points for R2 000 – R100 000</li>
          </ul>
        </q-card-section>

        <div class="progress-wrapper row justify-center text-center">
          <div class="circular-score q-mb-md">
            <q-circular-progress :value="circularValue" :color="circularColor" track-color="grey-3" size="180px"
              thickness="0.2" show-value class="text-bold">
              {{ circularLabel }}
            </q-circular-progress>
            <div class="text-caption text-grey-8 q-mt-sm">
              Final Credit Score
            </div>
          </div>
        </div>


        <div class="progress-wrapper">
          <q-linear-progress :value="filledFieldsRatio" :color="filledFieldsColor" size="20px" />
          <div class="text-caption text-grey-8 q-mt-xs">
            Form Completion Progress
          </div>
        </div>



        <!-- <div v-if="rental.payerData.isValidated" class="progress-wrapper">
          <q-linear-progress :value="rental.payerData.score / 80" color="primary" size="20px" />
          <div class="text-caption text-grey-8 q-mt-xs">
            Credit Score Progress
          </div>
        </div> -->

      </div>

      <!-- Right Section: Form -->
      <div class="col-md-6 col-12 q-pa-md">
        <q-card-section class="row justify-end items-center q-py-none q-py-xs">
          <q-btn flat round icon="close" @click="$emit('close')" size="md" color="grey-10" aria-label="Close" class="large-screen-only" />
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <q-input outlined label-color="black" color="black" v-model="rental.payerData.firstName" label="First Name *"
            :disable="rental.payerData.isValidated" />
          <q-input outlined label-color="black" color="black" v-model="rental.payerData.lastName" label="Last Name *"
            :disable="rental.payerData.isValidated" />
          <q-input outlined label-color="black" color="black" v-model="rental.payerData.email" label="Email *"
            :disable="rental.payerData.isValidated" />
          <q-input outlined label-color="black" color="black" v-model="rental.payerData.idNumber" label="ID Number *"
            :disable="rental.payerData.isValidated" />
          <q-select outlined label="Select Bank *" v-model="rental.payerData.bankName" :options="banks"
            label-color="black" color="black" :disable="rental.payerData.isValidated" />
          <q-input outlined label-color="black" color="black" v-model="rental.payerData.salary" label="Monthly Salary *"
            type="number" prefix="R" :disable="rental.payerData.isValidated" />
        </q-card-section>

        <q-card-section class="row justify-between">
          <CustomButton v-if="!rental.payerData.isValidated" label="Submit Form" customStyle="width: 45%"
            @click="verifyPayer" />
        </q-card-section>
      </div>
    </div>
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
  computed: {
    filledFieldsColor() {
      const ratio = this.filledFieldsRatio;
      if (ratio >= 1) return 'green';
      if (ratio >= 0.6) return 'orange';
      return 'red';
    },

    circularValue() {
      return this.rental.payerData.isValidated
        ? (Number(this.rental.payerData.score) / 80) * 100
        : 0;
    },
    circularLabel() {
      return this.rental.payerData.isValidated
        ? `${this.rental.payerData.score}/80`
        : 'Waiting...';
    },
    circularColor() {
      if (!this.rental.payerData.isValidated) return 'grey-5';

      const score = Number(this.rental.payerData.score);
      if (score >= 60) return 'green';
      if (score >= 40) return 'orange';
      return 'red';
    },

    scoreColor() {
      const score = this.rental.payerData.score;
      if (score >= 60) return 'green';
      if (score >= 40) return 'orange';
      return 'red';
    },
    filledFieldsRatio() {
      const fields = [
        this.rental.payerData.firstName,
        this.rental.payerData.lastName,
        this.rental.payerData.email,
        this.rental.payerData.idNumber,
        this.rental.payerData.salary,
        this.rental.payerData.bankName
      ];
      const filled = fields.filter(f => f !== null && f !== '').length;
      return filled / fields.length;
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
    validateText: Helper.validateText,
    validateEmail: Helper.validateEmail,

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

    async verifyPayer() {
      if (!this.validateFields()) {
        return;
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
        const response = await RentalService.verifyAndSavePayer(this.rental._id, payload);

        if (response.isValidated) {
          this.rental.payerData.isValidated = true;
          this.rental.payerData.score = response.score;

          this.$q.notify({
            type: 'positive',
            color: 'primary',
            message: `Payer verification was successful. Credit score: ${response.score}/80. Your submission is under review, and we will verify the provided information for accuracy shortly.`
          });
        } else {
          this.$q.notify({
            type: 'negative',
            message: `Payer verification was unsuccessful. Kindly review the provided information for accuracy and try again.`
          });
        }
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: `Failed to verify payer: ${error.message}`
        });
      }
    }
  }
};
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
  max-width: 100%
  padding: 16px

  @media (min-width: 601px)
    min-width: 1200px

  @media (max-width: 600px)
    min-width: unset
    padding: 8px
</style>
