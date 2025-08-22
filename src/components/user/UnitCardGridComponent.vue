<template>
  <q-card flat class="q-ma-sm bg-transparent">
    <!-- Carousel section (always shown) -->
    <div class="carousel-wrapper row justify-center">
      <q-carousel animated v-model="currentSlide" infinite :autoplay="!isSpecificFloorRoute" :autoplay-interval="5000"
        transition-prev="slide-right" transition-next="slide-left" transition-duration="1800" arrows
        control-color="white" class="carousel col-md-9">

        <q-carousel-slide v-for="(card, index) in filteredFloorCards" :key="card._id" :name="card._id"
          class="column no-wrap flex-center">
          <q-img :src="card.imageUrl" :alt="'Floor ' + card._id" class="hero-image cursor-pointer"
            :style="isHomePage ? 'background: #121212;' : ''" :class="{ 'image-shadow': !isHomePage }" fit="contain"
            @click="openImageDialog(index)" />
        </q-carousel-slide>

      </q-carousel>
    </div>

    <template v-if="isSpecificFloorRoute">
      <div class="">
        <q-card v-for="(units, floorIndex) in filteredUnits" :key="floorIndex" class="q-mt-lg soft-shadow-card">
          <q-card-section class="header-tint">
            <div class="text-h6">
              {{ floorLabels[currentFloor - 1] }} ({{ units.length }} items)
            </div>
            <q-separator class="q-my-sm" style="width: 100%;" />
          </q-card-section>

          <q-card-section class="row justify-center q-gutter-md">
            <q-input filled dense debounce="300" v-model="search" placeholder="Search by unit number, or status"
              class="col-xs-12 col-sm-6 col-md-3">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
            <q-select filled dense v-model="selectedStatus" :options="['All', 'Available', 'Occupied']"
              class="col-xs-12 col-sm-6 col-md-1" emit-value map-options />
            <q-select filled dense v-model="selectedFloor" :options="[
              { label: '1st Floor', value: 1 },
              { label: '2nd Floor', value: 2 },
              { label: '3rd Floor', value: 3 },
            ]" emit-value map-options class="col-xs-12 col-sm-6 col-md-1" @update:model-value="goToFloor" />
            <q-input filled dense v-model.number="priceRange.min" type="number" placeholder="Min Price"
              class="col-xs-12 col-sm-6 col-md-1" />
            <q-input filled dense v-model.number="priceRange.max" type="number" placeholder="Max Price"
              class="col-xs-12 col-sm-6 col-md-1" />
            <q-btn flat rounded icon="refresh" label="Reset" color="red"
              class="q-py-sm custom-button col-xs-12 col-sm-6 col-md-1" @click="resetFilters" />
          </q-card-section>

          <q-card-section>
            <q-list class="row justify-center">
              <q-card v-for="unit in units" :key="unit._id" class="hover-scale q-ma-sm bg-transparent soft-shadow-card"
                :class="{ 'dimmed-unit': shouldDimUnit(unit) }"
                :style="{ pointerEvents: shouldDimUnit(unit) ? 'none' : 'auto' }"
                @click="!shouldDimUnit(unit) ? handleUnitClick(unit) : null">

                <!-- Image -->
                <q-card-section class="row justify-center">
                  <div class="image-container reserved-container">
                    <q-img v-if="unit.images?.length" :src="getImageUrl(unit.images[0].imageUrl)"
                      class="reserved-image" />
                    <div v-if="unit.reservedBy" class="reserved-full-overlay">
                      RESERVED
                    </div>
                  </div>
                </q-card-section>

                <!-- Heading -->
                <q-card-section style="background-color: #f8f8f8;">
                  <div class="row justify-between">
                    <div class="column items-start q-pa-sm">
                      <div class="text-h6">Unit {{ unit.unitNumber }}</div>
                      <div class="text-caption text-grey-9">
                        {{ unit.floorLevel }} <br>
                        {{ getAvailableSubUnits(unit) }}/{{ unit.subUnits?.length || unit.unitOccupants || 0 }}
                        Available
                      </div>
                    </div>

                    <div class="column items-end q-pa-sm">
                      <span class="text-h6"
                        :class="unit.unitStatus === 'Available' ? 'available-unit' : 'occupied-unit'">
                        {{ unit.unitStatus }}
                      </span>
                      <span class="text-caption" v-if="unit.unitStatus === 'Available'">
                        <b>From R {{ Number(unit.unitPrice).toFixed(2) }}</b>
                      </span>
                    </div>
                  </div>

                  <div class="row justify-center q-mt-xs">
                    <div class="unit-meta-info row justify-between">

                      <!-- Status -->
                      <div class="column items-center hover-scale-icon">
                        <q-tooltip anchor="top middle" self="bottom middle">Status: {{ unit.unitStatus }}</q-tooltip>
                        <q-icon :name="unit.unitStatus === 'Available' ? 'check_circle' : 'block'"
                          :color="unit.unitStatus === 'Available' ? 'positive' : 'negative'" size="sm" />
                        <div class="text-caption">{{ unit.unitStatus }}</div>
                      </div>

                      <!-- Unit Type -->
                      <div class="column items-center hover-scale-icon">
                        <q-tooltip anchor="top middle" self="bottom middle">Unit Type: {{ unit.unitType }}</q-tooltip>
                        <q-icon name="home" size="sm" />
                        <div class="text-caption">{{ unit.unitType }}</div>
                      </div>

                      <!-- Occupancy -->
                      <div class="column items-center hover-scale-icon">
                        <q-tooltip anchor="top middle" self="bottom middle">
                          {{ getAvailableSubUnits(unit) }} of {{ unit.subUnits?.length || unit.unitOccupants || 0 }} available
                        </q-tooltip>

                        <q-icon
                          :name="unit.subUnits?.[0]?.type === 'bed' ? 'bed'
                                  : unit.subUnits?.[0]?.type === 'room' ? 'meeting_room'
                                  : 'help'"
                          size="sm"
                        />

                        <div class="text-caption">
                          {{ unit.subUnits?.length || unit.unitOccupants || 0 }}
                          {{ unit.subUnits?.[0]?.type === 'bed' ? 'Beds'
                            : unit.subUnits?.[0]?.type === 'room' ? 'Rooms'
                            : 'Units' }}
                        </div>
                      </div>

                      <!-- Gender / Access -->
                      <div class="column items-center hover-scale-icon">
                        <q-tooltip anchor="top middle" self="bottom middle">
                          <span v-if="unit.accessKey?.isShared">Access Key Required</span>
                          <span v-else-if="unit.genderAssignment">{{ unit.genderAssignment }} Only</span>
                          <span v-else-if="unit.currentOccupants > 0">General Applied</span>
                          <span v-else>Unassigned</span>
                        </q-tooltip>

                        <q-icon v-if="unit.accessKey?.isShared" name="vpn_key" color="orange" size="sm" />
                        <q-icon v-else-if="unit.genderAssignment === 'Male'" name="male" color="blue" size="sm" />
                        <q-icon v-else-if="unit.genderAssignment === 'Female'" name="female" color="pink" size="sm" />
                        <q-icon v-else-if="unit.currentOccupants > 0" name="group" color="green" size="sm" />
                        <q-icon v-else name="help" color="grey" size="sm" />

                        <div class="text-caption">
                          <span v-if="unit.accessKey?.isShared">Key</span>
                          <span v-else-if="unit.genderAssignment">{{ unit.genderAssignment }}</span>
                          <span v-else-if="unit.currentOccupants > 0">General</span>
                          <span v-else>Unassigned</span>
                        </div>
                      </div>

                    </div>
                  </div>
                </q-card-section>

                <q-card-section>
                  <!-- <template v-if="unit.reservedBy">
                    <CustomButton v-if="isReservedByCurrentUser(unit)" label="Return to Application" color="negative"
                      @click.stop="handleCancelReservation(unit)" />
                    <CustomButton v-else label="Reserved" disabled color="grey" />
                  </template>
                  <CustomButton v-else label="Reserve" :disabled="!isLoggedIn || getAvailableSubUnits(unit) === 0"
                    @click.stop="handleReserve(unit)"
                    :color="(!isLoggedIn || getAvailableSubUnits(unit) === 0) ? 'grey' : 'primary'" /> -->

                  <CustomButton label="Reserve Now" @click="handleUnitClick(unit)"  />
                </q-card-section>
              </q-card>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </template>

    <!-- Dialogs -->
    <q-dialog v-model="imageDialog" maximized>
      <q-card flat class="image-dialog-card">
        <q-btn icon="close" flat round dense v-close-popup class="close-button" />

        <q-card-section class="dialog-image-section row justify-center flex-center">
          <img :src="currentDialogImageUrl" class="enlarged-image" style="object-fit: contain" />

          <q-btn round flat dense class="dialog-nav left" icon="chevron_left" @click="prevImage"
            v-if="filteredFloorCards.length > 1" />
          <q-btn round flat dense class="dialog-nav right" icon="chevron_right" @click="nextImage"
            v-if="filteredFloorCards.length > 1" />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="detailFormDialog">
      <UnitDetailedApplicationForm :unit="selectedUnit" @close="handleDialogClose" />
    </q-dialog>
    <q-dialog v-model="detailsDialog">
      <UnitDetailsComponent :unit="selectedUnit" @close="detailsDialog = false" />
    </q-dialog>
    <q-dialog v-model="applyDialog">
      <UnitApplicationFormComponent :unit="selectedUnit" @close="handleDialogClose" />
    </q-dialog>
  </q-card>
</template>

<script>
import UnitDetailedApplicationForm from './UnitDetailedApplicationForm.vue'
import UnitDetailsComponent from './UnitDetailsComponent.vue'
import UnitApplicationFormComponent from './UnitApplicationFormComponent.vue'
import UnitService from '../../services/UnitService'
import RentalService from '../../services/RentalService'
import Helper from '../../services/utils'
import floor1 from '../../assets/resources/floorLayout/FirstFloorLayout.png'
import floor2 from 'src/assets/resources/floorLayout/SecondFloorLayout.png'
import floor3 from 'src/assets/resources/floorLayout/ThirdFloorLayout.png'
import CustomButton from '../elements/CustomButton.vue'

export default {
  name: 'UnitGridSection',
  components: {
    UnitDetailsComponent,
    UnitApplicationFormComponent,
    UnitDetailedApplicationForm,
    CustomButton
  },
  data() {
    return {
      isLoggedIn: '',
      userDetails: {},
      allReservedUnits: [],

      imageDialog: false,
      currentDialogImageUrl: '',
      currentImageIndex: 0,

      search: '',
      selectedStatus: 'All',
      selectedFloor: null,
      priceRange: {
        min: null,
        max: null
      },

      units: [],
      floorLabels: ['First Floor', 'Second Floor', 'Third Floor'],
      expanded: [true, false, false],
      allUnits: [],
      myRentals: [],
      selectedUnit: null,
      detailFormDialog: false,
      detailsDialog: false,
      applyDialog: false,
      currentSlide: 1,
      floorCards: [
        { _id: 1, imageUrl: floor1 },
        { _id: 2, imageUrl: floor2 },
        { _id: 3, imageUrl: floor3 },
      ],
      currentFloor: null
    }
  },
  computed: {

    // Check if the current user reserved any unit
    myReservedUnitId() {
      if (!this.isLoggedIn) return null;
      const unit = this.filteredUnits[0]?.find(u => u.reservedBy === this.userDetails._id);
      return unit ? unit._id : null;
    },

    // Return a list of all unit IDs that are reserved (by anyone)
    reservedUnitIds() {
      return this.filteredUnits[0]
        ?.filter(u => u.reservedBy)
        .map(u => u._id) || [];
    },
    isHomePage() {
      return this.$route.path === '/'
    },
    hasOngoingRentals() {
      return this.myRentals.some(r => r.status === 'Pending' || r.status === 'Active')
    },
    isSpecificFloorRoute() {
      return this.$route.path.match(/\/units\/apply\/floor\/\d+$/)
    },
    filteredFloorCards() {
      if (!this.isSpecificFloorRoute) {
        return this.floorCards
      }
      return this.floorCards.filter(card => card._id === this.currentFloor)
    },
    filteredUnits() {
      if (!this.isSpecificFloorRoute) return []

      const floorIndex = this.currentFloor - 1
      let floorUnits = this.allUnits[floorIndex] || []
      if (this.search) {
        const searchTerm = this.search.toLowerCase()
        floorUnits = floorUnits.filter(unit =>
          unit.unitNumber.toString().toLowerCase().includes(searchTerm) ||
          unit.unitStatus?.toLowerCase().includes(searchTerm)
        )
      }

      if (this.selectedStatus !== 'All') {
        floorUnits = floorUnits.filter(unit =>
          unit.unitStatus?.toLowerCase() === this.selectedStatus.toLowerCase()
        )
      }
      if (this.priceRange.min != null) {
        floorUnits = floorUnits.filter(unit =>
          Number(unit.unitPrice) >= this.priceRange.min
        )
      }
      if (this.priceRange.max != null) {
        floorUnits = floorUnits.filter(unit =>
          Number(unit.unitPrice) <= this.priceRange.max
        )
      }

      return [floorUnits]
    }
  },
  methods: {
    getImageUrl: Helper.getImageUrl,

    getAvailableSubUnits(unit) {
      if (unit.subUnits && Array.isArray(unit.subUnits)) {
        return unit.subUnits.filter(sub => sub.isAvailable).length;
      }
      // fallback for old units
      if (unit.unitOccupants != null && unit.currentOccupants != null) {
        return unit.unitOccupants - unit.currentOccupants;
      }
      return 0;
    },

    getOccupancyIcon(unit) {
      if (unit.subUnits && Array.isArray(unit.subUnits) && unit.subUnits.length > 0) {
        const firstType = unit.subUnits[0].type;
        if (firstType === 'bed') return 'bed';
        if (firstType === 'room') return 'meeting_room';
      }
      // fallback for old units
      return 'meeting_room';
    },

    // getRoomType(description) {
    //   if (!description) return null;
    //   const desc = description.toLowerCase();

    //   const isStrand = desc.includes('the strand');
    //   const isPinnacle = desc.includes('the pinnacle');
    //   const isCore = desc.includes('the core');

    //   // Check for mixed units first
    //   if (isPinnacle && isCore) return 'mixed';
    //   if (isStrand) return 'strand';
    //   if (isPinnacle) return 'pinnacle';
    //   if (isCore) return 'core';

    //   return null;
    // },


    // RESERVE UNITS
    // ------------------------------------------------------------------------------------------

    shouldDimUnit(unit) {
      // If no one is logged in, dim all reserved units
      if (!this.isLoggedIn) {
        return !!unit.reservedBy
      }

      // If user has reserved ANY unit (not just current floor)
      const userHasReservation = this.allReservedUnits.some(
        u => u.reservedBy === this.userDetails._id
      )

      if (userHasReservation) {
        // Dim everything except the unit they reserved
        return unit.reservedBy !== this.userDetails._id
      }

      // Otherwise, dim units reserved by others
      return !!unit.reservedBy && unit.reservedBy !== this.userDetails._id
    },

    isReservedByCurrentUser(unit) {
      if (!this.isLoggedIn || !unit.reservedBy) return false;
      return this.userDetails?._id === unit.reservedBy;
    },

    async handleReserve(unit) {
      try {
        if (!this.isLoggedIn) {
          this.$q.notify({
            type: 'negative',
            message: 'Please login to reserve a unit'
          });
          return;
        }

        if (unit.currentOccupants > 0) {
          this.$q.notify({
            type: 'negative',
            message: 'Unit is already occupied'
          });
          return;
        }

        this.$q.dialog({
          title: 'Reserve',
          message: 'Reserving this unit will restrict you from applying to other units. To proceed with this reservation, you must return to complete the application. Do you wish to continue?',
          color: 'primary',
          persistent: true,
          cancel: true
        }).onOk(async () => {
          const response = await UnitService.reserveUnit(unit._id, this.userDetails._id);
          if (response) {
            // Update global reservation state
            const updatedUnit = this.units.find(u => u._id === unit._id)
            if (updatedUnit) {
              updatedUnit.reservedBy = this.userDetails._id
              this.allReservedUnits.push(updatedUnit)
            }
            this.$q.dialog({
              title: 'Success',
              message: 'Unit reserved successfully',
              color: 'primary',
              persistent: true,
            }).onOk(async () => {
              await this.fetchUnits();
            });
          }
        });
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: error.response?.data?.error || error.message || 'Failed to reserve unit'
        });
      }
    },

    async handleCancelReservation(unit) {
      try {
        const response = await UnitService.cancelReservation(unit._id, this.userDetails._id);

        if (response) {
          // Update global reservation state
          const updatedUnit = this.units.find(u => u._id === unit._id)
          if (updatedUnit) {
            updatedUnit.reservedBy = null
            this.allReservedUnits = this.allReservedUnits.filter(u => u._id !== unit._id)
          }

          this.$q.dialog({
            title: 'Success',
            message: 'Unit opened',
            color: 'primary',
            persistent: true,
          }).onOk(async () => {
            await this.fetchUnits();
          });
        }

      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: error.response?.data?.error || error.message || 'Failed to cancel reservation'
        });
      }
    },

    async checkLoginStatus() {
      this.isLoggedIn = await Helper.checkCookie();
      if (this.isLoggedIn) {
        this.userDetails = await Helper.fetchUserDetails();
      }
    },

    // IMAGES AND FULLSCREEN
    // ------------------------------------------------------------------------------------------

    openImageDialog(index) {
      this.currentImageIndex = index
      this.currentDialogImageUrl = this.filteredFloorCards[index].imageUrl
      this.imageDialog = true
    },
    nextImage() {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.filteredFloorCards.length
      this.currentDialogImageUrl = this.filteredFloorCards[this.currentImageIndex].imageUrl
    },
    prevImage() {
      this.currentImageIndex = (this.currentImageIndex - 1 + this.filteredFloorCards.length) % this.filteredFloorCards.length
      this.currentDialogImageUrl = this.filteredFloorCards[this.currentImageIndex].imageUrl
    },

    // FETCHING UNITS AND RENTALS
    // ------------------------------------------------------------------------------------------

    async fetchUnits() {
      const response = await UnitService.getAllUnits()
      this.units = response
      this.allReservedUnits = response.filter(u => u.reservedBy)
      this.organizeUnitsByFloor()
      await this.fetchMyRentals()
    },

    async fetchMyRentals() {
      const user = await Helper.fetchUserDetails()
      await this.checkLoginStatus()
      this.myRentals = await RentalService.findMyRentals(user._id)
    },

    // FILTER BY FLOOR
    // ------------------------------------------------------------------------------------------

    organizeUnitsByFloor() {
      const sortedUnits = Helper.sortByProperty(this.units, 'unitNumber', 'asc')
      this.allUnits = [
        sortedUnits.filter(u => u.floorLevel === 'First Floor'),
        sortedUnits.filter(u => u.floorLevel === 'Second Floor'),
        sortedUnits.filter(u => u.floorLevel === 'Third Floor')
      ]
    },

    resetFilters() {
      this.search = ''
      this.selectedStatus = 'All'
      this.priceRange.min = null
      this.priceRange.max = null
    },

    // -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    handleUnitClick(unit) {
      this.selectedUnit = unit
      this.detailFormDialog = true
      // this.detailsDialog = true
      // this.applyDialog = true

    },
    handleDialogClose() {
      this.detailFormDialog = false
      // this.applyDialog = false
      // this.detailsDialog = false
      this.fetchUnits()
    },

    // -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    parseFloorFromRoute() {
      if (this.isSpecificFloorRoute) {
        this.currentFloor = parseInt(this.$route.params.floor)

        this.selectedFloor = this.currentFloor

        // Auto-expand the relevant floor section
        this.expanded = this.expanded.map((_, i) => i === this.currentFloor - 1)

        // Reset carousel to first (or only) slide
        const card = this.floorCards.find(card => card._id === this.currentFloor)
        this.currentSlide = card?._id ?? 1
      }
    },
    async goToFloor(floorKeyOrId) {
      const keyToNumber = {
        firstFloor: 1,
        secondFloor: 2,
        thirdFloor: 3
      }
      const floorNumber = typeof floorKeyOrId === 'number'
        ? floorKeyOrId
        : keyToNumber[floorKeyOrId]

      if (floorNumber) {
        this.$router.push(`/units/apply/floor/${floorNumber}`)
      }
    }
  },
  watch: {
    '$route.path'() {
      this.parseFloorFromRoute()
    }
  },
  async created() {
    await this.checkLoginStatus();
    this.parseFloorFromRoute()
    this.fetchUnits()
  }
}
</script>

<style lang="sass">

.reserved-container
  position: relative
  width: 100%
  height: 100%

.reserved-image
  // width: 100%
  // height: 100%
  max-width: 100%
  max-height: 100%
  object-fit: contain

.reserved-full-overlay
  position: absolute
  top: 10
  left: 10
  width: 60%
  height: 20%
  background-color: rgba(0, 0, 0, 1)
  color: white
  display: flex
  align-items: center
  justify-content: center
  font-size: 2rem
  font-weight: bold
  letter-spacing: 2px
  border-radius: 8px
  z-index: 10
  text-transform: uppercase

.dimmed-unit
  opacity: 0.3
  filter: grayscale(100%)

// Enlarged Image
.image-dialog-card
  background: rgba(0, 0, 0, 0.9) !important

.dialog-image-section
  height: 100%
  display: flex
  justify-content: center
  align-items: center
  position: relative

.enlarged-image
  max-width: 100%
  max-height: 100%
  width: auto
  height: auto

.close-button
  position: fixed
  right: 15px
  top: 10px
  z-index: 6000
  color: white

.dialog-nav
  position: absolute
  top: 50%
  transform: translateY(-50%)
  color: white
  z-index: 2
  width: 48px
  height: 48px
  font-size: 24px
  &.left
    left: 24px

  &.right
    right: 24px

.cursor-pointer
  cursor: pointer


// -----------------------
.image-container
  width: 350px
  height: 275px
  display: flex
  justify-content: center
  align-items: center
  overflow: hidden
  padding: 5px
  @media (max-width: 1025px)
    width: 300px
    height: 300px

.unit-meta-info
  width: 350px
  padding: 8px

// .image
//   max-width: 100%
//   max-height: 100%
//   object-fit: contain

.background-transparent
  background: #121212

.carousel-wrapper
  max-height: 550px
  height: auto
  overflow: hidden
  width: 100%

.carousel
  width: 100%
  height: auto
  aspect-ratio: 16/9
  min-height: 300px
  max-height: 550px

.hero-image
  width: 100%
  height: 100%
  object-fit: contain

.image-shadow
  filter: drop-shadow(0 4px 10px rgba(0, 0, 0, 0.5))

.q-carousel__slide
  padding: 0 !important

.q-carousel__navigation-inner
  padding-bottom: 20px

.q-carousel__arrow
  color: white
  font-size: 2rem

.hover-scale
  cursor: pointer
  transition: transform 0.2s ease-in-out

.hover-scale:hover
  transform: scale(1.03)

.hover-scale-icon
  cursor: pointer
  transition: transform 0.2s ease-in-out

.hover-scale-icon:hover
  transform: scale(1.2)

.available-unit
  color: #4CAF50

.occupied-unit
  color: #F44336
</style>
