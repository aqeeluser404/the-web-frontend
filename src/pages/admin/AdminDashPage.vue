<template>
  <q-page class="bg-grey-3">
    <div class="q-pa-md column justify-center flex-center" style="width: 100%; height: 100%;" v-show="!loading">
      <div class="q-ma-sm" style="min-height: 300px; position: relative;">

        <!-- Dashboard Title -->
        <q-card-section class="row justify-center">
          <div class="text-h4 text-weight-bold">Administration Dashboard</div>
        </q-card-section>

        <!-- Cards -->
        <q-card-section class="row justify-center flex-center constrain">
          <q-list v-for="(card, index) in visibleCards" :key="index">
            <q-card class="q-ma-sm card-container text-center soft-shadow-card">
              <router-link :to="card.route" class="router-link">
                <q-icon :name="card.icon" class="card-icon" />
                <div class="text-subtitle1 card-label">{{ card.label }}</div>
              </router-link>
            </q-card>
          </q-list>
        </q-card-section>

      </div>
    </div>
    <!-- Spinner Overlay -->
    <q-inner-loading :showing="loading" color="primary" size="md" />
  </q-page>
</template>


<script>
import Helper from 'src/services/utils';
import CustomButton from 'src/components/elements/CustomButton.vue';

export default {
  name: "AdminDashPage",

  data() {
    return {
      loading: true,
      userDetails: {
        userType: 'admin',
        rightsType: ''
      },
      cards: [
        { label: 'User Administration', route: '/admin/users', icon: 'eva-people-outline', key: 'user' },
        { label: 'Unit Administration', route: '/admin/units', icon: 'eva-home-outline', key: 'unit' },
        { label: 'Rental Administration', route: '/admin/rentals', icon: 'eva-briefcase-outline', key: 'rental' },
        { label: 'Call Log Administration', route: '/admin/call-log', icon: 'eva-settings-outline', key: 'calllog' },
        { label: 'Shuttle Booking Administration', route: '/admin/shuttle-booking', icon: 'eva-calendar-outline', key: 'shuttle' },
        // { label: 'Incident Administration', route: '/admin/incidents', icon: 'eva-settings-outline' }
      ]
    }
  },
  components: {
    CustomButton
  },
  computed: {
    visibleCards() {
      if (!this.userDetails) return []

      if (this.userDetails.userType === 'admin') {
        if (['Yusri', 'Aqeel'].includes(this.userDetails.firstName)) {
          return [
            ...this.cards,
            {
              label: 'Bypass Login Administration',
              route: '/admin/auth/login',
              icon: 'eva-log-in-outline',
              key: 'login'
            }
          ]
        }
        if (this.userDetails.rightsType === 'Driver') {
          return this.cards.filter(c => c.key === 'shuttle')
        } else if (this.userDetails.rightsType === 'Agent') {
          return this.cards.filter(c => ['user', 'rental', 'calllog'].includes(c.key))
        } else {
          return this.cards
        }
      }

      return []
    },
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

<style lang="sass">
.card-container
  display: flex
  flex-direction: row
  align-items: center
  padding: 40px
  width: 200px
  height: 250px
  transition: all 0.3s ease
  &:hover
    background-color: var(--q-primary) !important
    transform: scale(1.05)
    .card-icon, .card-label
      color: white !important

.router-link
  display: flex
  flex-direction: column
  align-items: center
  text-decoration: none
  color: black

.card-icon
  font-size: 96px
  margin-bottom: 10px
  transition: color 0.3s ease

.card-label
  transition: color 0.3s ease
</style>
