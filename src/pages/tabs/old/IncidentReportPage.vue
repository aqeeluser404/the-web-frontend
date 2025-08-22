<template>
  <q-page>
    <!----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
    <q-parallax :src="parallax" :height="300" :speed="0.5"
      style="background-position: center 30% !important; background-size: cover !important;">
      <div style="
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(34, 34, 34, 0.6);
        " class="text-white text-center column justify-center items-center q-pa-xl">
        <q-card-section>
          <div class="text-h3">Incident Report</div>
          <br>
          <div class="text-body1 q-mb-lg">
            Please let us know how we can help
          </div>
        </q-card-section>
      </div>
    </q-parallax>

    <div style="height: 60px; background-color: white;"></div>
    <div class="q-pa-lg constrain">
      <!-- First Name & Last Name Row -->
      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-xs-12 col-sm-6">
          <div class="q-pb-xs">First Name (Required)</div>
          <q-input
            filled
            dense
            label-color="black"
            color="black"
            hide-bottom-space
            class="bordered-input"
            v-model="form.firstName"
          />
        </div>
        <div class="col-xs-12 col-sm-6">
          <div class="q-pb-xs">Last Name (Required)</div>
          <q-input
            filled
            dense
            label-color="black"
            color="black"
            hide-bottom-space
            class="bordered-input"
            v-model="form.lastName"
          />
        </div>
      </div>

      <!-- Email & Phone Row -->
      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-xs-12 col-sm-6">
          <div class="q-pb-xs">Email (Required)</div>
          <q-input
            filled
            dense
            label-color="black"
            color="black"
            hide-bottom-space
            class="bordered-input"
            v-model="form.email"
          />
        </div>
        <div class="col-xs-12 col-sm-6">
          <div class="q-pb-xs">Phone (Required)</div>
          <q-input
            filled
            dense
            label-color="black"
            color="black"
            hide-bottom-space
            class="bordered-input"
            v-model="form.phone"
          />
        </div>
      </div>

      <!-- Incident Type, Date, Time Row -->
      <div class="row q-col-gutter-md q-mb-md">
        <!-- Nature of Incident -->
        <div class="col-xs-12 col-md-4">
          <div class="q-pb-xs">Nature of Incident (Required)</div>
          <q-select
            filled
            dense
            label-color="black"
            color="black"
            hide-bottom-space
            class="bordered-input"
            :options="incidentOptions"
            v-model="form.incidentNature"
          />
        </div>

        <!-- Date -->
        <div class="col-xs-12 col-md-4">
          <div class="q-pb-xs">Date (Required)</div>
          <q-input
            filled
            dense
            label-color="black"
            color="black"
            hide-bottom-space
            class="bordered-input"
            type="date"
            v-model="form.date"
          />
        </div>

        <!-- Time -->
        <div class="col-xs-12 col-md-4">
          <div class="q-pb-xs">Time</div>
          <div class="row q-col-gutter-md ">
            <div class="col-4">
              <q-select
                filled
                dense
                label-color="black"
                color="black"
                hide-bottom-space
                label="Hour"
                :options="hourOptions"
                class="bordered-input"
                v-model="form.hour"
              />
            </div>
            <div class="col-4">
              <q-select
                filled
                dense
                label-color="black"
                color="black"
                hide-bottom-space
                label="Minute"
                :options="minuteOptions"
                class="bordered-input"
                v-model="form.minute"
              />
            </div>
            <div class="col-4">
              <q-select
                filled
                dense
                label-color="black"
                color="black"
                hide-bottom-space
                label="AM/PM"
                :options="['AM', 'PM']"
                class="bordered-input"
                v-model="form.period"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Location -->
      <div class="q-mb-md">
        <div class="q-pb-xs">Location (Required)</div>
        <q-input
          filled
          dense
          label-color="black"
          color="black"
          hide-bottom-space
          class="bordered-input"
          v-model="form.location"
        />
      </div>

      <!-- Description -->
      <div class="q-mb-md">
        <div class="q-pb-xs">Description (Required)</div>
        <q-input
          filled
          label-color="black"
          color="black"
          hide-bottom-space
          class="bordered-input"
          type="textarea"
          rows="6"
          v-model="form.description"
        />
      </div>

      <div class="row q-col-gutter-md">
        <div class="col-xs-12 col-sm-4 col-md-3">
          <CustomButton label="Submit" @click="submitIncident" />
        </div>
      </div>
    </div>
    <div style="height: 60px; background-color: white;"></div>
  </q-page>

</template>

<script>
import CustomButton from 'src/components/elements/CustomButton.vue';
import home2 from 'src/assets/resources/home/slider/2.jpg';
import IncidentService from 'src/services/IncidentService';

export default {
  data() {
    return {
      parallax: home2,

      incidentOptions: [
        'Noise', 'Damage to property', 'Trespassing',
        'Disrespect', 'Assault', 'Theft', 'Other'
      ],
      hourOptions: Array.from({ length: 12 }, (_, i) => i + 1),
      minuteOptions: Array.from({ length: 60 }, (_, i) => i < 10 ? `0${i}` : `${i}`),

      form: {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        incidentNature: '',

        date: '',
        hour: '',
        minute: '',
        period: '',

        location: '',
        description: ''
      }
    };
  },
  methods: {
    async submitIncident() {
      const requiredFields = [
        'firstName', 'lastName', 'email', 'phone',
        'incidentNature', 'date', 'hour', 'minute', 'period',
        'location', 'description'
      ];

      const missingFields = requiredFields.filter(field => !this.form[field]);

      if (missingFields.length > 0) {
        this.$q.notify({
          type: 'negative',
          message: 'Please fill in all required fields.',
          position: 'bottom'
        });
        return;
      }
      try {
        const hour = this.form.period === 'PM' && this.form.hour !== 12
          ? this.form.hour + 12
          : this.form.period === 'AM' && this.form.hour === 12
          ? 0
          : this.form.hour;

        const createdAt = new Date(`${this.form.date}T${String(hour).padStart(2, '0')}:${this.form.minute}:00`);

        const payload = {
          firstName: this.form.firstName,
          lastName: this.form.lastName,
          email: this.form.email,
          phone: this.form.phone,
          incidentNature: this.form.incidentNature,
          location: this.form.location,
          description: this.form.description,
          createdAt: createdAt.toISOString()
        };

        const response = await IncidentService.createIncident(payload);
          if (response) {

            this.$q.dialog({
              title: 'Success',
              message: 'Incident Logged!',
              color: 'primary',
              persistent: true,
            }).onOk(() => {
              this.resetForm();
            });
          }

      } catch (error) {
        console.error('Incident submission failed:', error);
      }
    },
    resetForm() {
      this.form = {
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        incidentNature: '',
        date: '',
        hour: '',
        minute: '',
        period: '',
        location: '',
        description: ''
      };
    }
  },
  components: {
    CustomButton
  }
};
</script>

<style>
.bordered-input {
  border: 1px solid #ddd;
  /* border-radius: 4px;
  padding: 4px; */
}
.bordered-input .q-field__control {
  border-radius: 3px !important;
}
</style>
