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

      <!-- bed stats ----------------------------------------------------------------------------------------------------------------------------------------------->
      <BedStatsComponent />

      <!-- units ----------------------------------------------------------------------------------------------------------------------------------------------->
      <q-card flat bordered class="q-ma-sm">
        <q-expansion-item
          class="text-subtitle1"
          v-for="(units, floorIndex) in allUnits"
          :key="floorIndex"
          :label="`${floorLabels[floorIndex]} (${units.length} items)`"
          expand-separator
          v-model="expanded[floorIndex]"
          @show="handleExpansion(floorIndex)"
        >
          <q-list class="row justify-center">
            <q-card v-for="unit in units" :key="unit._id" flat bordered class="q-ma-sm">
              <q-card-section class="column flex-center">
                <div class="text-h6">

                  <!-- unit number -->
                  Unit {{ unit.unitNumber }}

                  <!-- available status -->
                  (<span v-if="unit.unitStatus === 'Available'" :class="{ 'available-unit': unit.unitStatus === 'Available'}">
                    {{ unit.unitStatus }}
                  </span>
                  <span v-else :class="{ 'occupied-unit': unit.unitStatus === 'Occupied'}">
                    {{ unit.unitStatus }}
                  </span>)
                </div>
                <!-- shared + bed count -->
                <div class="text-caption">{{ unit.unitType }} - {{ unit.unitOccupants - unit.currentOccupants }}/{{ unit.unitOccupants }} Beds</div>

              </q-card-section>
              <q-card-section class="row justify-center">
                <q-img v-if="unit.images && unit.images.length > 0" :src="getImageUrl(unit.images[0].imageUrl)" class="image" />
              </q-card-section>

              <q-card-section v-if="!hasOngoingRentals" class="row justify-between">
                <CustomButton label="View More" customStyle="width: 40%" color="white" text-color="black" @click="openUnitDetails(unit)" />
                <CustomButton label="Apply" customStyle="width: 40%" @click="openApplicationForm(unit)" />
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
import Helper from 'src/services/utils'
import CustomButton from 'src/components/elements/CustomButton.vue'
import UnitDetailsComponent from 'src/components/user/UnitDetailsComponent.vue'
import UnitApplicationFormComponent from 'src/components/user/UnitApplicationFormComponent.vue'
import RentalService from 'src/services/RentalService'
import BedStatsComponent from 'src/components/user/BedStatsComponent.vue'
import UnitService from 'src/services/UnitService'

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
      floorLabels: ['First Floor', 'Second Floor', 'Third Floor'],
      expanded: [true, false, false]
    }
  },
  components: {
    CustomButton,
    UnitDetailsComponent,
    UnitApplicationFormComponent,
    BedStatsComponent
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
      const groundFloorUnits = sortedUnits.filter(unit => unit.floorLevel === 'First Floor')
      const firstFloorUnits = sortedUnits.filter(unit => unit.floorLevel === 'Second Floor')
      const secondFloorUnits = sortedUnits.filter(unit => unit.floorLevel === 'Third Floor')
      this.allUnits = [groundFloorUnits, firstFloorUnits, secondFloorUnits]
      this.fetchMyRentals()
    },
    openUnitDetails(unit) {
      this.selectedUnit = unit
      this.detailsDialog = true
    },
    openApplicationForm(unit) {
      this.selectedUnit = unit
      this.applyDialog = true
    },
    handleDialogClose() {
      this.applyDialog = false
      this.fetchUnits()
    },
    goToRentalHistory() {
      this.$router.push({ path: '/user/applications' })
    },
    handleExpansion(expandedIndex) {
      this.expanded = this.expanded.map((_, index) => index === expandedIndex)
    },
    async switchToApplicationForm(unitId) {
      try {
        const response = await UnitService.getByIdUnit(unitId);
        this.openApplicationForm(response)
        // localStorage.removeItem('pendingUnitApplication')
      } catch (error) {
        console.error('Error fetching unit details:', error);
      }
    },
    checkForUnitQuery() {
      const unitId = this.$route.query.applyForUnit;
      if (unitId) {
        this.switchToApplicationForm(unitId);
      }
    },

  },
  created() {
    this.fetchUnits()
    // const unitId = localStorage.getItem('pendingUnitApplication');
    this.checkForUnitQuery();
  },
  beforeRouteUpdate(to, from, next) {
    const unitId = to.query.applyForUnit;
    if (unitId) {
      this.switchToApplicationForm(unitId);
    }
    next();
  },
  // watch: {
  //   applyDialog(newVal, oldVal) {
  //     if (oldVal === true && newVal === false) {
  //       this.$router.replace({ query: {} });
  //     }
  //   }
  // }
  watch: {
    applyDialog(newVal, oldVal) {
      if (oldVal === true && newVal === false) {
        const currentScroll = { x: window.pageXOffset, y: window.pageYOffset };
        this.$router.replace({ query: {} }).then(() => {
          window.scrollTo(currentScroll.x, currentScroll.y);
        });
      }
    }
  }
}
</script>

<style lang="sass">

.stats-card
  border-radius: 8px
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)

  .stats-header
    background-color: #f5f5f5
    border-top-left-radius: 8px
    border-top-right-radius: 8px


  .floor-stats
    padding: 8px
    border-radius: 6px
    transition: all 0.3s ease
    &:hover
      background-color: #f9f9f9



  .total-stats
    background-color: #f0f7ff
    border-bottom-left-radius: 8px
    border-bottom-right-radius: 8px


  .q-linear-progress
    height: 8px
    border-radius: 4px


</style>
