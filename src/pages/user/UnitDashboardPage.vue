<template>
  <q-page>
    <div class="q-pa-md row justify-center constrain">
      <q-list v-for="unit in units" :key="unit._id">
        <q-card
          flat bordered
          class="q-ma-sm"
        >
          <q-card-section class="row justify-center">
            <div class="text-h6">{{ unit.unitType }} ({{ unit.unitStatus }})</div>
          </q-card-section>
          <q-card-section class="">
            <q-img
              v-if="unit.images && unit.images.length > 0"
              :src="getImageUrl(unit.images[0].imageUrl)"
              class="image"
            />
          </q-card-section>
          <q-card-section class="row justify-between">
            <CustomButton label="View More" customStyle="width: 40%" color="white" text-color="black" @click="openUnitDetails(unit)" />
            <CustomButton v-if="unit.unitStatus !== 'Occupied'" label="Apply" customStyle="width: 40%" @click="openApplicationForm(unit)" />
          </q-card-section>
        </q-card>
      </q-list>
    </div>

    <q-dialog v-model="detailsDialog">
      <UnitDetailsComponent :unit="selectedUnit" @close="detailsDialog = false" />
    </q-dialog>
    <q-dialog v-model="applyDialog">
      <UnitApplicationForm :unit="selectedUnit" @close="handleDialogClose" />
    </q-dialog>
  </q-page>

</template>

<script>
  import UnitService from 'src/services/UnitService'
  import Helper from 'src/services/utils'
  import CustomButton from 'src/components/CustomButton.vue'
  import UnitDetailsComponent from 'src/components/UnitDetailsComponent.vue'
  import UnitApplicationForm from 'src/components/UnitApplicationForm.vue'

  export default {
    name: "UnitDashboardPage",

    data() {
      return {
        units: [],
        detailsDialog: false,
        applyDialog: false,
        selectedUnit: null
      }
    },
    components: {
      CustomButton,
      UnitDetailsComponent,
      UnitApplicationForm
    },
    methods: {
      getImageUrl: Helper.getImageUrl,
      capitalizeFirstLetter: Helper.capitalizeFirstLetter,

      async fetchUnits() {
        const response = await UnitService.getAllUnits()
        this.units = response
      },
      openUnitDetails(unit) {
        this.selectedUnit = unit,
        this.detailsDialog = true
      },
      openApplicationForm(unit) {
        this.selectedUnit = unit,
        this.applyDialog = true
      },
      handleDialogClose() {
        this.applyDialog = false
        this.fetchUnits()
      }
    },
    created() {
      this.fetchUnits()
    },
  }
</script>

<style lang="sass">
</style>
