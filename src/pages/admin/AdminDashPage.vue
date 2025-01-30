<template>
  <q-page>
    <div class="q-pa-md text-black row justify-center constrain">
      <q-list>
        <q-item v-for="(card, index) in cards" :key="index">
          <q-item-section>
            <q-card flat bordered class="q-ma-sm card-container">
              <router-link :to="card.route" class="router-link">
                <q-icon :name="card.icon" class="card-icon" />
                <q-btn flat :label="card.label" class="card-button" />
              </router-link>
            </q-card>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script>
import Helper from 'src/services/utils';

export default {
  name: "AdminDashPage",

  data() {
    return {
      cards: [
        { label: 'Users', route: '/admin/users', icon: 'eva-people-fill' },
        { label: 'Units', route: '/admin/units', icon: 'eva-home-fill' },
        { label: 'Rentals', route: '/admin/rentals', icon: 'eva-briefcase-fill' }
      ]
    }
  },
}
</script>

<style lang="sass">
.card-container
  display: flex
  flex-direction: column
  align-items: center
  padding: 20px


.router-link
  display: flex
  flex-direction: column
  align-items: center
  text-decoration: none


.card-icon
  font-size: 64px
  margin-bottom: 10px


.card-button
  width: 100%

</style>
