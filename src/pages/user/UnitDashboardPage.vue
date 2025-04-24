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



    <div class="q-pa-md">
      <q-card flat bordered class="q-ma-sm">
        <q-expansion-item
          class="text-subtitle1"
          v-for="(units, floorIndex) in allUnits"
          :key="floorIndex"
          :label="`${floorLabels[floorIndex]} (${units.length} items)`"
          expand-separator
          :default-opened="floorIndex === 0"
        >
          <q-list class="row justify-center">
            <q-card v-for="unit in units" :key="unit._id" flat bordered class="q-ma-sm">
              <q-card-section class="column flex-center">
                <div class="text-h6">{{ unit.unitType }} <span class="text-brown">({{ unit.unitStatus }})</span></div>
                <div class="text-caption" v-if="!unit.accessKey.isShared">Unit {{ unit.unitNumber }} -
                  <span v-if="unit.genderAssignment">Assigned to {{ unit.genderAssignment.toLowerCase() }}s</span>
                  <span v-else>Unassigned</span>
                </div>
                <div class="text-caption" v-else>Unit {{ unit.unitNumber }} -
                  <span>Shared Access Key needed</span>
                </div>
              </q-card-section>
              <q-card-section class="row justify-center">
                <q-img v-if="unit.images && unit.images.length > 0" :src="getImageUrl(unit.images[0].imageUrl)" class="image" />
              </q-card-section>


              <q-card-section v-if="!hasOngoingRentals" class="row justify-between">
                <CustomButton label="View More" customStyle="width: 40%" color="white" text-color="black" @click="openUnitDetails(unit)" />
                <CustomButton color="brown" label="Apply" customStyle="width: 40%" @click="openApplicationForm(unit)" />
              </q-card-section>

              <q-card-section v-else class="row justify-between">
                <CustomButton label="View More" customStyle="width: 100%" color="white" text-color="black" @click="openUnitDetails(unit)" />
              </q-card-section>


            </q-card>
          </q-list>
        </q-expansion-item>
      </q-card>
    </div>

    <q-dialog v-model="detailsDialog">
      <UnitDetailsComponent :unit="selectedUnit" @close="detailsDialog = false" />
    </q-dialog>
    <q-dialog v-model="applyDialog">
      <UnitApplicationFormComponent :unit="selectedUnit" @close="handleDialogClose" />
    </q-dialog>
  </q-page>
</template>

<script>
import UnitService from 'src/services/UnitService'
import Helper from 'src/services/utils'
import CustomButton from 'src/components/elements/CustomButton.vue'
import UnitDetailsComponent from 'src/components/user/UnitDetailsComponent.vue'
import UnitApplicationFormComponent from 'src/components/user/UnitApplicationFormComponent.vue'
import RentalService from 'src/services/RentalService'

export default {
  name: "UnitDashboardPage",

  data() {
    return {
      units: [],
      detailsDialog: false,
      applyDialog: false,
      selectedUnit: null,
      myRentals: [],
      allUnits: [],
      floorLabels: ['Ground Floor', 'First Floor', 'Second Floor'],
    }
  },
  components: {
    CustomButton,
    UnitDetailsComponent,
    UnitApplicationFormComponent
  },
  computed: {
    hasRejectedRentals() {
      return this.myRentals.some(rental => rental.status === 'Rejected');
    },
    hasOngoingRentals() {
      return this.myRentals.some(rental => rental.status === 'Pending' || rental.status === 'Active');
    }
  },
  methods: {
    getImageUrl: Helper.getImageUrl,
    capitalizeFirstLetter: Helper.capitalizeFirstLetter,

    async fetchMyRentals() {
      const user = await Helper.fetchUserDetails()
      this.myRentals = await RentalService.findMyRentals(user._id)
    },

    async fetchUnits() {
      const response = await UnitService.getAllUnits()
      this.units = response

      const sortedUnits = Helper.sortByProperty(this.units, 'unitNumber', 'asc')

      const groundFloorUnits = sortedUnits.filter(unit => unit.floorLevel === 'Ground Floor')
      const firstFloorUnits = sortedUnits.filter(unit => unit.floorLevel === 'First Floor')
      const secondFloorUnits = sortedUnits.filter(unit => unit.floorLevel === 'Second Floor')

      this.allUnits = [groundFloorUnits, firstFloorUnits, secondFloorUnits]

      this.fetchMyRentals()
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
    },
    goToRentalHistory() {
      this.$router.push({ path: '/user/applications' })
    }
  },
  created() {
    this.fetchUnits()
  },
}
</script>

<style lang="sass">
</style>
