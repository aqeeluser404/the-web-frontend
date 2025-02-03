<template>
  <q-page>
    <div class="q-pa-md column justify-center flex-center constrain" style="width: 100%; height: 75vh;" >

      <q-card flat>
        <q-card-section class="row justify-center">
          <div class="text-h6">Admin Panel</div>
        </q-card-section>

        <q-card-section class="row justify-center flex-center constrain" >
          <q-list v-for="(card, index) in cards" :key="index">
            <q-card flat bordered class="q-ma-sm card-container">
              <router-link :to="card.route" class="router-link">
                <q-icon :name="card.icon" class="card-icon" />
                <div class="text-subtitle1">{{ card.label }}</div>
              </router-link>
            </q-card>
          </q-list>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import Helper from 'src/services/utils';
import CustomButton from 'src/components/CustomButton.vue';

export default {
  name: "AdminDashPage",

  data() {
    return {
      cards: [
        { label: 'Users', route: '/admin/users', icon: 'eva-people-outline' },
        { label: 'Units', route: '/admin/units', icon: 'eva-home-outline' },
        { label: 'Rentals', route: '/admin/rentals', icon: 'eva-briefcase-outline' }
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


.router-link
  display: flex
  flex-direction: column
  align-items: center
  text-decoration: none
  color: black


.card-icon
  font-size: 96px
  margin-bottom: 10px


.card-button
  width: 100%

</style>
