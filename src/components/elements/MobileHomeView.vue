<template>
  <q-page class="bg-grey-6">
    <div class="constrain-mobile-home-view bg-grey-3">

      <!-- Header -->
      <q-card flat class="bg-transparent">
        <q-card-section class="row justify-between items-center full-width no-wrap q-px-none">
          <div class="column">
            <span class="text-subtitle1 text-grey-9">Good afternoon,</span>
            <span class="text-h5 text-bold">John</span>
          </div>
          <div class="row">
            <q-btn class="q-mr-md" icon="eva-bell-outline" round size="md" />
            <q-btn label="JD" round size="md" color="primary" />
          </div>
        </q-card-section>
      </q-card>


      <div class="section-spacer"></div>

      <!-- Welcome tab -->
      <q-card class="soft-shadow-card padding-sm">
        <div class="text-h6 text-bold q-mb-sm">
          Welcome to The-WEB Resident Portal
        </div>
        <div class="text-grey-9 text-subtitle1">
          Manage your bookings, visitors, maintenance requests, profile etc. from one place.
        </div>
      </q-card>

      <div class="section-spacer"></div>

      <!-- Quick actions -->
      <q-card flat class="bg-transparent ">
        <q-card-section class="q-px-none">
          <div class="text-h6 text-bold q-mb-sm">
            Quick actions
          </div>

          <div>
            <!-- icons -->
            <q-card class="soft-shadow-card">

            </q-card>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import CustomButton from './CustomButton.vue';
export default {
  name: "MobileHomeView",
  data() {

  },
  components: {
    CustomButton
  }
}
</script>

<style lang="sass">
.soft-shadow-card
  border-radius: 8px
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)
</style>
