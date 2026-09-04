<template>
  <q-card class="combined-unit-card">
    <div class="row">
      <div
        class="col-md-6 col-12 q-pa-md left-card"
        style="background-color: #f8f8f8"
      >
        <q-card-section class="row justify-between items-center">
          <div class="text-h6">Extend Rental</div>
          <!-- <div class="text-caption text-grey-6">
            Move the rental to a new year
          </div> -->
          <q-btn
            flat
            round
            icon="close"
            @click="$emit('close')"
            size="md"
            color="grey-10"
            aria-label="Close"
            class="small-screen-only"
          />
        </q-card-section>

        <q-separator />

        <q-card-section>
          <!-- Current Rental Details -->
          <div class="row q-col-gutter-md">
            <div class="col-12 col-md-6">
              <div class="text-subtitle2 text-grey-7">
                Current Rental Period
              </div>
              <br>
              <div class="row q-mt-sm">
                <div class="col-6">
                  <div class="text-caption text-grey-6">Start Date</div>
                  <div class="text-subtitle1">{{ formattedCurrentStart }}</div>
                </div>
                <div class="col-6">
                  <div class="text-caption text-grey-6">End Date</div>
                  <div class="text-subtitle1">{{ formattedCurrentEnd }}</div>
                </div>
              </div>
              <div class="row q-mt-xs">
                <div class="col-12">
                  <div class="text-caption text-grey-6">Year</div>
                  <div class="text-subtitle1">{{ currentYear }}</div>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </div>

      <div class="col-md-6 col-12 q-pa-md">
        <q-card-section class="row justify-end items-center q-py-none q-py-sm">
          <q-btn
            flat
            round
            icon="close"
            @click="$emit('close')"
            size="md"
            color="grey-10"
            aria-label="Close"
            class="large-screen-only"
          />
        </q-card-section>

        <q-card-section>
          <div class="col-12 col-md-6">
            <div class="text-subtitle2 text-grey-7">New Rental Period</div>
            <br>
            <div class="row q-mt-sm">
              <div class="col-6">
                <div class="text-caption text-grey-6">Start Date</div>
                <div class="text-subtitle1 text-primary">
                  {{ formattedNewStart }}
                </div>
              </div>
              <div class="col-6">
                <div class="text-caption text-grey-6">End Date</div>
                <div class="text-subtitle1 text-primary">
                  {{ formattedNewEnd }}
                </div>
              </div>
            </div>
            <br>
            <div class="row q-mt-xs">
              <div class="col-12">
                <div class="row q-mt-md items-center">
                  <div class="col-12 col-md-4">
                    <span class="text-subtitle1">Select New Year:</span>
                  </div>
                  <div class="col-12 col-md-8">
                    <br class="small-screen-only">
                    <q-btn-toggle
                      v-model="selectedYear"
                      :options="yearOptions"
                      unelevated
                      toggle-color="primary"
                      @update:model-value="updateNewDates"
                      class="full-width"
                      style="flex-wrap: wrap"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-section class="row justify-between">
          <CustomButton
            label="Save Changes"

            @click="extendRental"
            :disable="!selectedYear || selectedYear === currentYear"
          />
        </q-card-section>
      </div>
    </div>
  </q-card>
</template>

<script>
import CustomButton from "../elements/CustomButton.vue";
import RentalService from "src/services/api/RentalService";
import EmailService from "src/services/api/EmailService";

export default {
  name: "AdminExtendRentalComponent",

  props: {
    rental: {
      type: Object,
      required: true,
    },
  },

  components: {
    CustomButton,
  },

  data() {
    return {
      selectedYear: null,
      yearOptions: [],
      currentYear: null,
      formattedCurrentStart: "",
      formattedCurrentEnd: "",
      formattedNewStart: "",
      formattedNewEnd: "",
      rentalExtension: "", // Keep for backward compatibility
    };
  },

  computed: {
    crossesIntoNewYear() {
      return this.selectedYear && this.selectedYear > this.currentYear;
    },
  },

  methods: {
    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toISOString().split("T")[0];
    },

    formatDisplayDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toLocaleDateString("en-ZA", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    },

    generateYearOptions() {
      const currentYear = new Date().getFullYear();
      const options = [];

      // Generate options for the next 5 years
      for (let year = currentYear; year <= currentYear + 1; year++) {
        options.push({
          label: year.toString(),
          value: year,
        });
      }

      return options;
    },

    updateNewDates() {
      if (!this.selectedYear) return;

      this.formattedNewStart = `${this.selectedYear}-02-01`;
      this.formattedNewEnd = `${this.selectedYear}-12-15`;
      this.rentalExtension = this.formattedNewEnd;
    },

    async extendRental() {
      if (!this.selectedYear || this.selectedYear === this.currentYear) {
        this.$q.notify({
          type: "negative",
          message: "Please select a different year to extend to.",
        });
        return;
      }

      const newEndDate = `${this.selectedYear}-12-15`;
      const message = `Extended to ${newEndDate}`;

      this.$q
        .dialog({
          title: "Confirm Extension",
          message: `
          <div class="q-mt-sm">
            <div><strong>Current:</strong> ${this.formatDisplayDate(
              this.rental.rentalEndDate
            )}</div>
            <div><strong>New:</strong> ${this.formatDisplayDate(
              newEndDate
            )}</div>
            <div class="q-mt-sm text-primary">This will move the rental to the ${
              this.selectedYear
            } unit.</div>
          </div>
        `,
          html: true,
          color: "primary",
          cancel: true,
          persistent: true,
        })
        .onOk(async () => {
          try {
            let response;

            if (this.crossesIntoNewYear) {
              response = await RentalService.extendRentalToNewYear(
                this.rental._id,
                newEndDate
              );
            } else {
              // Should never happen since we disable the button
              const updatedRental = {
                applicationDate: this.rental.applicationDate,
                status: this.rental.status,
                rentalStartDate: this.rental.rentalStartDate,
                rentalEndDate: newEndDate,
                rentalPrice: this.rental.rentalPrice,
                unit: this.rental.unit,
                unitType: this.rental.unitType,
                user: this.rental.user,
              };
              response = await RentalService.updateRental(
                this.rental._id,
                updatedRental
              );
            }

            if (response) {
              this.$q.notify({
                type: "positive",
                color: "primary",
                message: `Rental extended to ${this.selectedYear}!`,
              });

              await EmailService.SendExtendedDate(this.rental.user, {
                message,
              });
              this.$emit("close");
            } else {
              this.$q.notify({
                type: "negative",
                message: "Extension for rental failed. Please try again.",
              });
            }
          } catch (error) {
            this.$q.notify({
              type: "negative",
              message:
                error.message ||
                "Extension for rental failed. Please try again.",
            });
          }
        })
        .onCancel(() => {});
    },
  },

  created() {
    // Set current year from rental
    const endDate = new Date(this.rental.rentalEndDate);
    this.currentYear = endDate.getFullYear();

    // Format current dates
    this.formattedCurrentStart = this.formatDate(this.rental.rentalStartDate);
    this.formattedCurrentEnd = this.formatDate(this.rental.rentalEndDate);

    // Generate year options (only years after current)
    const allYears = this.generateYearOptions();
    this.yearOptions = allYears.filter((opt) => opt.value > this.currentYear);

    // Auto-select the next year
    if (this.yearOptions.length > 0) {
      this.selectedYear = this.yearOptions[0].value;
      this.updateNewDates();
    }
  },
};
</script>

<style scoped>
.component-card {
  min-width: 500px;
  max-width: 700px;
}

@media (max-width: 600px) {
  .component-card {
    min-width: unset;
    width: 100%;
  }
}
</style>
