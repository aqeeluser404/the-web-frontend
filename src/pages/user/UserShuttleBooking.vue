<template>
  <q-page>
    <div class="constrain-standard q-py-md" v-if="userDetails.rightsType === 'Tenant'">
      <q-card class="col-md-4 col-12 stats-card full-height">
        <q-card-section class="row stats-header justify-center">
          <div class="text-h6">Book a Shuttle</div>
          <q-separator class="q-my-sm" style="width: 100%;" />
        </q-card-section>

        <q-card-section class="row justify-center">
          <q-item>
            <q-item-section class="text-subtitle1">Under Development</q-item-section>
          </q-item>
        </q-card-section>
      </q-card>
    </div>

    <div class="constrain-standard q-py-md" v-else>
      <q-card class="col-md-4 col-12 stats-card full-height">
        <q-card-section class="row stats-header justify-center">
          <div class="text-h6">Book a Shuttle</div>
          <q-separator class="q-my-sm" style="width: 100%;" />
        </q-card-section>

        <q-card-section class="row justify-center">
          <q-item>
            <q-item-section class="text-subtitle1">You’ll have access to the shuttle booking system once your rental application is approved.</q-item-section>
          </q-item>
        </q-card-section>
      </q-card>
    </div>
    
    <!-- Shuttle booking ui -->
    <ShuttleBooking/>
  </q-page>
</template>

<script>
import Helper from 'src/services/utils';
import CustomButton from 'src/components/elements/CustomButton.vue';
import ShuttleBooking from './ShuttleBooking.vue';

export default {
  data() {
    return {
      loading: true,
      userDetails: {
        rightsType: ''
      },
    }
  },
  components: {
    CustomButton,
    ShuttleBooking
  },
  methods: {
    async fetchUserDetails() {
      this.userDetails = await Helper.fetchUserDetails()
      this.loading = false
    },
  },
  created() {
    this.fetchUserDetails()
  }
}
</script>

<style lang="sass" scoped>
.stats-card
  border-radius: 8px
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)

.stats-header
  background-color: #f5f5f5
  border-top-left-radius: 8px
  border-top-right-radius: 8px
  @media (max-width: 600px)
    display: flex
    flex-direction: column
    align-items: center
    justify-content: center

.custom-button
  &:hover
    background-color: black !important
    color: white !important
</style>
