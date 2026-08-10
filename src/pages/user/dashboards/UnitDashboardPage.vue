<template>
  <q-page>
    <!-- Banner for rejected rentals -->
    <q-banner v-if="hasRejectedRentals" class="bg-red text-white" @click="goToRentalHistory">
      <div class="row justify-center items-center" style="cursor: pointer;">
        <div>
          <q-icon name="warning" class="q-mr-sm" size="32px" />
          <span>You have a rejected rental. Click here to view your rental history and cancel.</span>
        </div>
      </div>
    </q-banner>

    <!-- Units List Component -->
    <UnitsCardComponent />
  </q-page>
</template>

<script>
import UnitsCardComponent from '../../components/user/UnitCardComponent.vue'
import RentalService from 'src/services/api/RentalService';
import Helper from 'src/services/helper/utils';

export default {
  name: "UnitDashboardPage",
  components: {
    UnitsCardComponent
  },
  data() {
    return {
      myRentals: []
    }
  },
  computed: {
    hasRejectedRentals() {
      return this.myRentals.some(rental => rental.status === 'Rejected');
    }
  },
  methods: {
    async fetchMyRentals() {
      const user = await Helper.fetchUserDetails()
      this.myRentals = await RentalService.findMyRentals(user._id)
    },
    goToRentalHistory() {
      this.$router.push({ path: '/user/applications' })
    }
  },
  created() {
    this.fetchMyRentals()
  }
}
</script>
