<template>
  <q-page>
    <div class="q-pa-md row justify-center constrain">
      <q-list v-for="unit in units" :key="unit._id">
        <q-card
          flat bordered
          @click="viewUnitDetails(unit._id)"
          class="cursor-pointer q-ma-sm"
        >
          <q-card-section class="">
            <q-img
              v-if="unit.images && unit.images.length > 0"
              :src="getImageUrl(unit.images[0].imageUrl)"
              class="image"
            />
          </q-card-section>
          <q-card-section class="row justify-between">
            <CustomButton label="View More" customStyle="width: 40%" color="white" text-color="black" />
            <CustomButton label="Apply" customStyle="width: 40%" />
          </q-card-section>
        </q-card>
      </q-list>

    </div>
  </q-page>

</template>

<script>
  import UnitService from 'src/services/UnitService'
  import Helper from 'src/services/utils'
  import CustomButton from 'src/components/CustomButton.vue'

  export default {
    name: "UnitDashboardPage",

    data() {
      return {
        units: []
      }
    },
    components: {
      CustomButton
    },
    methods: {
      getImageUrl: Helper.getImageUrl,
      capitalizeFirstLetter: Helper.capitalizeFirstLetter,

      async fetchUnits() {
        const response = await UnitService.getAllUnits()
        this.units = response
      },
      viewUnitDetails(id) {

      }
    },
    created() {
      this.fetchUnits()
    },
  }
</script>

<style lang="sass">
</style>
