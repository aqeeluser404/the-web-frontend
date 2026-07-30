<template>
  <q-page class="bg-grey-3">
    <div class="constrain-standard row justify-center q-py-md">

      <q-card-section class="column items-center full-width">
        <q-card class="q-pa-xl" style="max-width: 500px; width: 100%;">
          <q-card-section class="text-center">
            <q-icon name="check_circle" size="80px" color="positive" />
            <div class="text-h5 q-mt-md text-positive">Thank you!</div>
            <div class="text-subtitle1 q-mt-sm text-grey-7">
              Your application document has been successfully submitted.
            </div>
            <CustomButton label="Home" color="primary" textColor="white" to="/" customStyle="width: 150px;"
              class="q-mt-lg" />
          </q-card-section>
        </q-card>
      </q-card-section>
      <!-- <div class="col-12 col-md-8 col-lg-6">
        <q-card class="q-pa-xl text-center">
          <q-card-section>
            <div class="text-center">
              <q-icon name="check_circle" size="80px" color="positive" />
              <div class="text-h4 q-mt-md text-positive">Thank You!</div>
              <div class="text-subtitle1 q-mt-sm text-grey-7">
                You have successfully completed your signing session.
              </div>
            </div>
          </q-card-section>

          <q-card-section>
            <q-separator class="q-my-md" />
            <div class="text-left q-py-sm">
              <div class="row q-col-gutter-sm">
                <div class="col-4 text-grey-6 text-weight-bold">Rental ID:</div>
                <div class="col-8">{{ rentalId || 'N/A' }}</div>
              </div>
              <div class="row q-col-gutter-sm q-mt-sm">
                <div class="col-4 text-grey-6 text-weight-bold">Your Role:</div>
                <div class="col-8">{{ role || 'N/A' }}</div>
              </div>
              <div class="row q-col-gutter-sm q-mt-sm">
                <div class="col-4 text-grey-6 text-weight-bold">Status:</div>
                <div class="col-8 text-positive">
                  <q-icon name="check_circle" size="sm" class="q-mr-xs" />
                  Completed
                </div>
              </div>
            </div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-btn label="Go to Dashboard" color="primary" to="/" size="lg" class="full-width" no-caps />
          </q-card-section>

          <q-card-section>
            <div class="text-caption text-grey-6">
              You can close this window if you're done.
            </div>
          </q-card-section>
        </q-card>
      </div> -->
    </div>
  </q-page>
</template>

<script>
import CustomButton from 'src/components/elements/CustomButton.vue';

export default {
  name: 'LeaseApplicationSuccessPage',
  data() {
    return {
      rentalId: null,
      role: null
    }
  },
  components: {
    CustomButton
  },
  mounted() {
    // Get params from URL
    this.rentalId = this.$route.query.rentalId || null;
    this.role = this.$route.query.role || null;
  }
}
</script>

<style scoped>
.q-card {
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
}
</style>
