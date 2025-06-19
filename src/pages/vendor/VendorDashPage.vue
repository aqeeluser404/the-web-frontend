<template>
  <q-page>
    <div class="q-pa-md column justify-center flex-center" style="width: 100%; height: 100%;">

      <q-card flat class="q-ma-sm">
        <q-card-section class="row justify-center">
          <div class="text-h6">Vendor Panel</div>
        </q-card-section>

        <q-card-section class="row justify-center flex-center constrain">
          <q-list v-for="(card, index) in cards" :key="index">
            <q-card flat bordered class="q-ma-sm card-container text-center">
              <router-link :to="card.route" class="router-link">
                <q-icon :name="card.icon" class="card-icon" />
                <div class="text-subtitle1 card-label">{{ card.label }}</div>
              </router-link>
            </q-card>
          </q-list>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>


<script>
import CustomButton from 'src/components/elements/CustomButton.vue';

export default {
  name: "VendorDashPage",

  data() {
    return {
      cards: [
        { label: 'Call Log Administration', route: '/vendor/call-log', icon: 'eva-settings-outline' }
      ]
    }
  },
  components: {
    CustomButton
  }
}
</script>

<style lang="sass">
.card-container
  display: flex
  flex-direction: row
  align-items: center
  padding: 40px
  width: 220px
  transition: all 0.3s ease
  &:hover
    background-color: black !important
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
