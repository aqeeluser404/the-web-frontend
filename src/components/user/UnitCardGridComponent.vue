<template>
  <div>
    <!-- Carousel section (always shown) -->
    <div class="q-py-md">
      <q-card class="carousel-wrapper row justify-center bg-grey-3 soft-shadow-card">
        <q-carousel v-show="!isSpecificFloorRoute" animated v-model="currentSlide" infinite
          :autoplay="!isSpecificFloorRoute" :autoplay-interval="5000" transition-prev="slide-right"
          transition-next="slide-left" transition-duration="1800" control-color="white" class="carousel col-md-9"
          :class="isHomePage ? 'bg-none' : 'bg-grey-3'">
          <q-carousel-slide v-for="(card, index) in carouselFloorCards" :key="card._id" :name="card._id"
            class="column no-wrap flex-center" style="position: relative; border-radius: 0;">
            <q-img :src="card.imageUrl" loading="lazy" spinner-color="primary" :alt="'Floor ' + card._id"
              class="carousel-image cursor-pointer"
              :style="isHomePage ? 'background: none; border-radius: 0;' : 'border-radius: 0;'"
              :class="{ 'image-shadow': !isHomePage }" fit="contain" @click="openFloorPage(index)" />
          </q-carousel-slide>
        </q-carousel>

        <!-- Smart Map -->
        <div class="map-image-wrapper" v-if="isSpecificFloorRoute">
          <q-img v-if="filteredFloorCards.length > 0" :src="filteredFloorCards[0].imageUrl" class="hero-image"
            @click="openImageDialog(0)">
          </q-img>
        </div>
      </q-card>
    </div>

    <div v-if="isHomeRoute" class="q-py-lg">
      <BedStatsComponent :unitYear="selectedYear" />
    </div>

    <div v-if="isHomeRoute" class="q-pb-md">
      <template v-if="isHomeRoute">
        <div>
          <q-card flat v-for="(units, floorIndex) in firstFloorCards" :key="floorIndex" class="soft-shadow-card">
            <q-list class="row justify-center">
              <q-card v-for="unit in units" :key="unit._id"
                class="hover-scale q-ma-sm bg-transparent soft-shadow-card col-md-6 col-12"
                :class="{ 'dimmed-unit': shouldDimUnit(unit) || getAvailableSubUnits(unit) === 0 }"
                :style="{ pointerEvents: (shouldDimUnit(unit) || getAvailableSubUnits(unit) === 0) ? 'none' : 'auto' }"
                style="max-width: 496px;" @click="openUnitImageDialog(unit)">
                <!-- Image -->
                <div class="row justify-center">
                  <div class="image-container reserved-container full-height">
                    <q-img v-if="unit.images?.length" :src="getImageUrl(unit.images[0].imageUrl)" class="reserved-image"
                      fit="cover" />
                    <div v-if="unit.reservedBy || getAvailableSubUnits(unit) === 0" class="reserved-full-overlay">
                      RESERVED
                    </div>
                  </div>
                </div>

                <!-- Heading -->
                <q-card-section style="background-color: #f8f8f8;">
                  <div class="row justify-between">
                    <div class="column items-start q-pa-sm">
                      <div class="text-h6">Unit {{ unit.unitNumber }}</div>
                      <div class="text-caption text-grey-9">
                        <div v-if="getAvailableSubUnits(unit)">
                          {{ unit.floorLevel }} <br>
                          {{ getAvailableSubUnits(unit) }}/{{unit.subUnits?.filter(su => !su.reservedBy)?.length ||
                            unit.unitOccupants || 0}}
                          Available
                        </div>
                        <div v-else>
                          {{ unit.floorLevel }} <br>
                          {{ getAvailableSubUnits(unit) }}/{{unit.subUnits?.filter(su => !su.reservedBy)?.length ||
                            unit.unitOccupants || 0}}
                          Occupied
                        </div>
                      </div>
                    </div>

                    <div class="column items-end q-pa-sm">
                      <span v-if="getAvailableSubUnits(unit)" class="text-h6 text-primary">
                        Available
                      </span>
                      <span v-else class="text-h6 text-negative">
                        Occupied
                      </span>
                      <span class="text-caption" v-if="getAvailableSubUnits(unit)">
                        <b>R{{ Number(unit.unitPrice).toLocaleString('en-ZA') }}&nbsp;/person&nbsp;/month</b>
                      </span>
                    </div>
                  </div>

                  <div class="row justify-center q-mt-xs">
                    <div class="unit-meta-info row justify-between">

                      <!-- Status -->
                      <div class="col-md-2 column items-center hover-scale-icon">
                        <q-tooltip anchor="top middle" self="bottom middle">
                          Status: {{ getAvailableSubUnits(unit) > 0 ? 'Available' : 'Occupied' }}
                        </q-tooltip>

                        <q-icon :name="getAvailableSubUnits(unit) > 0 ? 'check_circle' : 'block'"
                          :color="getAvailableSubUnits(unit) > 0 ? 'positive' : 'negative'" size="sm" />

                        <div class="text-caption">
                          {{ getAvailableSubUnits(unit) > 0 ? 'Available' : 'Occupied' }}
                        </div>
                      </div>

                      <!-- Unit Type -->
                      <div class="col-md-2 column items-center hover-scale-icon">
                        <q-tooltip anchor="top middle" self="bottom middle">Unit Type: {{ unit.unitType }}</q-tooltip>
                        <q-icon name="home" size="sm" />
                        <div class="text-caption">{{ unit.unitType }}</div>
                      </div>

                      <!-- Occupancy -->
                      <div class="col-md-2 column items-center hover-scale-icon">
                        <q-tooltip anchor="top middle" self="bottom middle">
                          {{ getAvailableSubUnits(unit) }} of {{unit.subUnits?.filter(su => !su.reservedBy)?.length ||
                            unit.unitOccupants || 0}}
                          available
                        </q-tooltip>

                        <q-icon :name="unit.subUnits?.[0]?.type === 'bed' ? 'bed'
                          : unit.subUnits?.[0]?.type === 'room' ? 'meeting_room'
                            : 'help'" size="sm" />

                        <div class="text-caption">
                          {{unit.subUnits?.filter(su => !su.reservedBy)?.length || unit.unitOccupants || 0}}
                          {{ unit.subUnits?.[0]?.type === 'bed' ? 'Beds'
                            : unit.subUnits?.[0]?.type === 'room' ? 'Rooms'
                              : 'Units' }}
                        </div>
                      </div>

                      <!-- Gender / Access -->
                      <div class="col-md-2 column items-center hover-scale-icon">
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
                  <CustomButton label="Reserve Now" @click.stop="handleUnitClick(unit)" />
                </q-card-section>
              </q-card>
            </q-list>
          </q-card>
        </div>
      </template>
    </div>

    <div v-if="isSpecificFloorRoute" class="q-py-md">
      <BedStatsComponent :unitYear="selectedYear" />
    </div>

    <div v-if="isSpecificFloorRoute" class="q-py-md">
      <template v-if="isSpecificFloorRoute">
        <div>
          <q-card v-for="(units, floorIndex) in filteredUnits" :key="floorIndex" class="soft-shadow-card">
            <q-card-section class="header-tint">
              <div class="text-h6">
                {{ floorLabels[currentFloor - 1] }} ({{ units.length }} items)
              </div>
              <q-separator class="q-my-sm" style="width: 100%;" />
            </q-card-section>

            <q-card-section class="row justify-center q-gutter-md q-pa-lg">
              <q-input filled dense debounce="300" v-model="search" placeholder="Search by unit number, or status"
                class="col-xs-12 col-sm-6 col-md-3">
                <template v-slot:append>
                  <q-icon name="search" />
                </template>
              </q-input>
              <q-select filled dense v-model="selectedStatus" :options="['All', 'Available', 'Occupied']"
                class="col-xs-12 col-sm-6 col-md-2" emit-value map-options />
              <q-select filled dense v-model="selectedYear" :options="yearOptions" class="col-xs-12 col-sm-6 col-md-2"
                emit-value map-options />
              <q-select filled dense v-model="selectedFloor" :options="[
                { label: '1st Floor', value: 1 },
                { label: '2nd Floor', value: 2 },
                { label: '3rd Floor', value: 3 },
              ]" emit-value map-options class="col-xs-12 col-sm-6 col-md-2" @update:model-value="goToFloor" />
              <q-btn flat rounded icon="refresh" label="Reset" color="red"
                class="q-py-sm custom-button col-xs-12 col-sm-6 col-md-1" @click="resetFilters" />
            </q-card-section>

            <q-card-section>
              <q-list class="row justify-center">
                <q-card v-for="unit in units" :key="unit._id"
                  class="hover-scale q-ma-sm bg-transparent soft-shadow-card col-md-5 col-12"
                  :class="{ 'dimmed-unit': shouldDimUnit(unit) || getAvailableSubUnits(unit) === 0 }"
                  :style="{ pointerEvents: (shouldDimUnit(unit) || getAvailableSubUnits(unit) === 0) ? 'none' : 'auto' }"
                  style="max-width: 496px;" @click="!shouldDimUnit(unit) ? handleUnitClick(unit) : null">

                  <!-- Image -->
                  <div class="row justify-center">
                    <div class="image-container reserved-container full-height">
                      <q-img v-if="unit.images?.length" :src="getImageUrl(unit.images[0].imageUrl)"
                        class="reserved-image" fit="cover" />
                      <div v-if="unit.reservedBy || getAvailableSubUnits(unit) === 0" class="reserved-full-overlay">
                        RESERVED
                      </div>
                    </div>
                  </div>

                  <!-- Heading -->
                  <q-card-section style="background-color: #f8f8f8;">
                    <div class="row justify-between">
                      <div class="column items-start q-pa-sm">
                        <div class="text-h6">Unit {{ unit.unitNumber }}</div>
                        <div class="text-caption text-grey-9">
                          <div v-if="getAvailableSubUnits(unit)">
                            {{ unit.floorLevel }} <br>
                            {{ getAvailableSubUnits(unit) }}/{{unit.unitOccupants || 0}}
                            Available
                          </div>
                          <div v-else>
                            {{ unit.floorLevel }} <br>
                            {{ getAvailableSubUnits(unit) }}/{{unit.subUnits?.filter(su => !su.reservedBy)?.length ||
                              unit.unitOccupants || 0}}
                            Occupied
                          </div>
                        </div>
                      </div>

                      <div class="column items-end q-pa-sm">
                        <span v-if="getAvailableSubUnits(unit)" class="text-h6 text-primary">
                          Available
                        </span>
                        <span v-else class="text-h6 text-negative">
                          Occupied
                        </span>
                        <span class="text-caption" v-if="getAvailableSubUnits(unit)">
                          <b>R{{ Number(unit.unitPrice).toLocaleString('en-ZA') }}&nbsp;/person&nbsp;/month</b>
                        </span>
                      </div>
                    </div>

                    <div class="row justify-center q-mt-xs">
                      <div class="unit-meta-info row justify-between">

                        <!-- Status -->
                        <div class="col-md-2 col-12 column items-center hover-scale-icon">
                          <q-tooltip anchor="top middle" self="bottom middle">
                            Status: {{ getAvailableSubUnits(unit) > 0 ? 'Available' : 'Occupied' }}
                          </q-tooltip>

                          <q-icon :name="getAvailableSubUnits(unit) > 0 ? 'check_circle' : 'block'"
                            :color="getAvailableSubUnits(unit) > 0 ? 'positive' : 'negative'" size="sm" />

                          <div class="text-caption">
                            {{ getAvailableSubUnits(unit) > 0 ? 'Available' : 'Occupied' }}
                          </div>
                        </div>

                        <!-- Unit Type -->
                        <div class="col-md-2 col-12 column items-center hover-scale-icon">
                          <q-tooltip anchor="top middle" self="bottom middle">Unit Type: {{ unit.unitType }}</q-tooltip>
                          <q-icon name="home" size="sm" />
                          <div class="text-caption">{{ unit.unitType }}</div>
                        </div>

                        <!-- Occupancy -->
                        <div class="col-md-2 col-12 column items-center hover-scale-icon">
                          <q-tooltip anchor="top middle" self="bottom middle">
                            {{ getAvailableSubUnits(unit) }} of {{unit.subUnits?.filter(su => !su.reservedBy)?.length ||
                              unit.unitOccupants || 0}}
                            available
                          </q-tooltip>

                          <q-icon :name="unit.subUnits?.[0]?.type === 'bed' ? 'bed'
                            : unit.subUnits?.[0]?.type === 'room' ? 'meeting_room'
                              : 'help'" size="sm" />

                          <div class="text-caption">
                            {{unit.subUnits?.filter(su => !su.reservedBy)?.length || unit.unitOccupants || 0}}
                            {{ unit.subUnits?.[0]?.type === 'bed' ? 'Beds'
                              : unit.subUnits?.[0]?.type === 'room' ? 'Rooms'
                                : 'Units' }}
                          </div>
                        </div>

                        <!-- Gender / Access -->
                        <div class="col-md-2 col-12 column items-center hover-scale-icon">
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
                    <CustomButton label="Reserve Now" @click="handleUnitClick(unit)" />
                  </q-card-section>
                </q-card>
              </q-list>
            </q-card-section>
          </q-card>
        </div>
      </template>
    </div>

    <!-- Dialogs -->
    <q-dialog v-model="imageDialog" maximized>
      <q-card flat class="image-dialog-card">
        <q-btn icon="close" flat round dense v-close-popup class="close-button" />

        <q-card-section class="dialog-image-section row justify-center flex-center">
          <SimpleZoom>
            <img :src="currentDialogImageUrl" class="enlarged-image" style="object-fit: contain" />
          </SimpleZoom>

          <q-btn round flat dense class="dialog-nav left" icon="chevron_left" @click="prevImage"
            v-if="filteredFloorCards.length > 1 && !isHomeRoute" />
          <q-btn round flat dense class="dialog-nav right" icon="chevron_right" @click="nextImage"
            v-if="filteredFloorCards.length > 1 && !isHomeRoute" />
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="detailFormDialog" @hide="handleDialogClose" :maximized="$q.screen.lt.sm ? true : false">
      <UnitDetailedApplicationForm :unit="selectedUnit" :sub-unit="selectedSubUnit" :latest-unit-year="latestUnitYear" @close="handleDialogClose" />
    </q-dialog>
  </div>
</template>

<script>
import BedStatsComponent from './BedStatsComponent.vue'
import UnitDetailedApplicationForm from './UnitDetailedApplicationForm.vue'
// import UnitDetailsComponent from './UnitDetailsComponent.vue'
// import UnitApplicationFormComponent from './UnitApplicationFormComponent.vue'
import UnitService from 'src/services/api/UnitService';
import RentalService from 'src/services/api/RentalService';
import Helper from '../../services/utils'
import floor1 from 'src/assets/resources/floorLayout/floorPlan1.png'
import floor2 from 'src/assets/resources/floorLayout/floorPlan2.png'
import floor3 from 'src/assets/resources/floorLayout/floorPlan3.png'
import CustomButton from '../elements/CustomButton.vue'
import SimpleZoom from '../elements/SimpleZoom.vue'

export default {
  name: 'UnitGridSection',
  components: {
    UnitDetailedApplicationForm,
    CustomButton, BedStatsComponent, SimpleZoom
  },
  emits: ['update:loading'],
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
      selectedYear: 2027,
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
      selectedSubUnit: null,
      detailFormDialog: false,
      detailsDialog: false,
      applyDialog: false,
      currentSlide: 1,
      floorCards: [
        { _id: 1, imageUrl: floor1 },
        { _id: 2, imageUrl: floor2 },
        { _id: 3, imageUrl: floor3 }
      ],
      currentFloor: null
    }
  },
  computed: {
    yearOptions() {
      const years = [...new Set(this.units.map(u => u.unitYear))].sort((a, b) => a - b)
      return [...years]
    },
    latestUnitYear() {
      if (!this.units.length) return 2026;
      return Math.max(...this.units.map(u => Number(u.unitYear) || 2026));
    },
    myReservedUnitId() {
      if (!this.isLoggedIn) return null;
      const unit = this.filteredUnits[0]?.find(u => u.reservedBy === this.userDetails._id);
      return unit ? unit._id : null;
    },
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

      // digit sequence
      return this.$route.path.match(/\/units\/apply\/floor\/\d+$/)
    },
    isHomeRoute() {
      return this.$route.path === '/';
    },
    carouselFloorCards() {
      if (this.isHomePage || this.$route.path === '/units/apply') {
        return this.floorCards.filter(card => card._id === 1);
      }
      if (this.isSpecificFloorRoute) {
        return this.floorCards.filter(card => card._id === this.currentFloor);
      }
      return this.floorCards;
    },
    filteredFloorCards() {
      if (!this.isSpecificFloorRoute) {
        return this.floorCards
      }
      return this.floorCards.filter(card => card._id === this.currentFloor)
    },
    firstFloorCards() {
      if (this.isHomeRoute) {
        const floorIndex = 0
        let floorUnits = this.allUnits[floorIndex] || []
        if (this.search) {
          const searchTerm = this.search.toLowerCase()
          floorUnits = floorUnits.filter(unit =>
            unit.unitNumber.toString().toLowerCase().includes(searchTerm) ||
            unit.unitStatus?.toLowerCase().includes(searchTerm)
          )
        }
        return [floorUnits]
      }
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
      if (this.selectedYear !== '2026') {
        floorUnits = floorUnits.filter(unit => unit.unitYear === this.selectedYear)
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

    getHomePageFloorCards() {
      return this.floorCards.filter(card => card._id === 1);
    },

    getFloorLabel(id) {
      const labels = {
        1: 'First Floor Plan',
        2: 'Second Floor Plan',
        3: 'Third Floor Plan',
        4: 'Fourth Floor',
        5: 'Fifth Floor'
        // Add more if needed
      };
      return labels[id] || `Floor ${id}`;
    },


    toggleLabel(markerId) {
      this.activeLabel = this.activeLabel === markerId ? null : markerId;
    },

    markerImage(unit) {
      const floor = this.$route.params.floor || '1';
      return `/assets/units/f${floor}/${unit}.png`;
    },

    markerClass(unit) {
      const floor = this.$route.params.floor || '1';
      return `marker-${unit}-f${floor}`;
    },

    // Open Map Unit
    onMarkerClick(unitSuffix, subUnitId) {
      const floorNumber = this.currentFloor;
      if (!floorNumber) {
        this.$q.notify({ type: 'negative', message: 'Floor not selected' });
        return;
      }
      const targetUnitNumber = `${floorNumber}-${unitSuffix}`;
      const floorIndex = floorNumber - 1;
      const unitsOnFloor = this.allUnits?.[floorIndex] || [];

      const matchedUnit = unitsOnFloor.find(unit =>
        unit.unitNumber.toString() === targetUnitNumber || unit.unitNumber.toString().endsWith(unitSuffix)
      );
      if (matchedUnit) {
        this.selectedUnit = matchedUnit;
        this.selectedSubUnit = subUnitId;
        this.detailFormDialog = true;
      } else {
        this.$q.notify({ type: 'negative', message: 'Unit not found' });
      }
    },

    getAvailableSubUnits(unit) {
      if (unit.subUnits && Array.isArray(unit.subUnits)) {
        return unit.subUnits.filter(sub => sub.isAvailable && !sub.reservedBy).length;
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
    openUnitImageDialog(unit) {
      this.currentImageIndex = 0
      this.currentDialogImageUrl = unit.images && unit.images.length > 0
        ? unit.images[0].imageUrl
        : unit.imageUrl
      this.imageDialog = true
    },


    openFloorPage(index) {
      index = index + 1
      this.$router.push(`/units/apply/floor/${index}`);
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
  try {
    this.$emit('update:loading', true)
    const response = await UnitService.getAllUnits()

    // Single pass: build normalized units + reserved list together
    this.allReservedUnits = []
    this.units = response.map(unit => {
      if (unit.reservedBy) this.allReservedUnits.push(unit)
      return {
        ...unit,
        unitYear: Number(unit.unitYear) || 2026
      }
    })

    this.organizeUnitsByFloor()

    if (this.isLoggedIn) {
      await this.fetchMyRentals()
    }
  } catch (err) {
    console.error('Error fetching units:', err)
  } finally {
    this.$emit('update:loading', false)
  }
},

async fetchMyRentals() {
  // These two don't depend on each other's result, run in parallel
  const [user] = await Promise.all([
    Helper.fetchUserDetails(),
    this.checkLoginStatus()
  ])
  this.myRentals = await RentalService.findMyRentals(user._id)
},

    // FILTER BY FLOOR
    // ------------------------------------------------------------------------------------------

organizeUnitsByFloor() {
  const sortedUnits = Helper.sortByProperty(this.units, 'unitNumber', 'asc')

  // Single pass instead of 3 separate .filter() scans over the full array
  const floorMap = {
    'First Floor': [],
    'Second Floor': [],
    'Third Floor': []
  }
  for (const unit of sortedUnits) {
    floorMap[unit.floorLevel]?.push(unit)
  }
  this.allUnits = [floorMap['First Floor'], floorMap['Second Floor'], floorMap['Third Floor']]
},


    resetFilters() {
      this.search = ''
      this.selectedStatus = 'All'
      this.priceRange.min = null
      this.priceRange.max = null
    },

    // -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    handleUnitClick(unit) {
      if (this.$route.path === '/') {
        this.$router.push('/units/apply/floor/1')
        return;
      }
      // Clone the unit to avoid mutating the original reference
      const cleanUnit = { ...unit };

      if (Array.isArray(unit.subUnits)) {
        cleanUnit.subUnits = unit.subUnits.filter(sub => !sub.reservedBy);
      }

      this.selectedUnit = cleanUnit;
      this.detailFormDialog = true;
    },

    handleDialogClose() {
      this.detailFormDialog = false
      this.selectedSubUnit = null;
      this.selectedUnit = null;
      this.fetchUnits()
    },

    // -----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
parseFloorFromRoute() {
  if (this.isSpecificFloorRoute) {
    this.currentFloor = parseInt(this.$route.params.floor)
    this.selectedFloor = this.currentFloor
    this.expanded = this.expanded.map((_, i) => i === this.currentFloor - 1)
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
  async mounted() {
    await this.checkLoginStatus();
    this.parseFloorFromRoute()
    await this.fetchUnits()
  }
}
</script>

<style lang="scss" scoped>
/* #region MAP WRAPPER */
.map-image-wrapper {
  width: 100%;
  position: relative;
  //max-width: 1024px;
  //max-height: 550px;
  //height: 100%;

  //max-width: 1575px;
  /* updated from 1024px */
  height: auto;
  overflow: hidden;
  margin: 0 auto;
}

.hero-image {
  width: 100%;
  // height: 100%;
  width: 100%;
  object-fit: contain;
  display: block;
}

/* #endregion MAP WRAPPER */


/* #region MARKERS */
.marker {
  position: absolute;
  transform: translate(-50%, -100%);
  cursor: pointer;
  background-color: transparent;

  &:hover {
    filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.8));
    z-index: 100;
    transform: translate(-50%, -100%) scale(1.55);
    overflow: visible;
    transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
  }

  img {
    width: 100%;
    height: auto;
    display: block;
    object-fit: contain;
  }
}

// .marker:hover img {
//   filter:
//     /* Solid border simulated by multiple sharp drop shadows */
//     drop-shadow(0 0 0 #009B77) drop-shadow(1px 0 0 #009B77) drop-shadow(-1px 0 0 #009B77) drop-shadow(0 1px 0 #009B77) drop-shadow(0 -1px 0 #009B77);
// }

::v-deep(.q-img__content > div) {
  padding: 0 !important;
  margin: 0 !important;
}

/* #endregion MARKERS */


/* #region MARKER POSITIONS */
$markers: (
  "01-01": (width: 5.7%, top: 94%, left: 87.75%),
  "01-02": (width: 5%, top: 94.5%, left: 82.2%),
  "02-01": (width: 6.8%, top: 94.1%, left: 75.8%),
  "02-02": (width: 6.8%, top: 77.7%, left: 72.48%),

  "03-01": (width: 7.15%, top: 48.3%, left: 79.35%),
  "03-02": (width: 7.15%, top: 23.3%, left: 79.4%),
  "03-03": (width: 7.1%, top: 23.3%, left: 86.7%),

  "04-01A": (width: 3.54%, top: 48.5%, left: 69.75%),
  "04-01B": (width: 3.54%, top: 48.5%, left: 73.31%),
  "04-02A": (width: 3.55%, top: 18.3%, left: 69.7%),
  "04-02B": (width: 3.55%, top: 18.3%, left: 73.3%),
  "04-03A": (width: 3.63%, top: 19.5%, left: 62.4%),
  "04-03B": (width: 3.65%, top: 19.5%, left: 65.85%),

  "05-01A": (width: 3.71%, top: 48.4%, left: 54.6%),
  "05-01B": (width: 3.56%, top: 48.4%, left: 58.1%),
  "05-02A": (width: 3.65%, top: 18%, left: 54.5%),
  "05-02B": (width: 3.61%, top: 18%, left: 58.1%),
  "05-03A": (width: 3.53%, top: 19%, left: 47.1%),
  "05-03B": (width: 3.65%, top: 19%, left: 50.6%),

  "06-01A": (width: 3.71%, top: 48.4%, left: 32.1%),
  "06-01B": (width: 3.56%, top: 48.4%, left: 35.55%),
  "06-02A": (width: 3.65%, top: 18%, left: 32.1%),
  "06-02B": (width: 3.61%, top: 18%, left: 35.6%),
  "06-03A": (width: 3.53%, top: 18.8%, left: 39.4%),
  "06-03B": (width: 3.65%, top: 19%, left: 43%),

  "07-01A": (width: 3.62%, top: 48.4%, left: 24.3%),
  "07-01B": (width: 3.56%, top: 48.4%, left: 27.8%),
  "07-02A": (width: 3.65%, top: 18%, left: 24.25%),
  "07-02B": (width: 3.61%, top: 18%, left: 27.8%),

  "07-03A": (width: 3.53%, top: 18.8%, left: 16.8%),
  "07-03B": (width: 3.65%, top: 19%, left: 20.35%),

  "08-01": (width: 7.19%, top: 23.35%, left: 10.8%)
);

// @each $name, $props in $markers {

//   ::v-deep(.marker-#{$name}-f1),
//   ::v-deep(.marker-#{$name}-f2),
//   ::v-deep(.marker-#{$name}-f3) {
//     width: map-get($props, width);
//     top: map-get($props, top);
//     left: map-get($props, left);
//   }
// }

$color-one: #009B77;
$color-two: #FF5733;

@each $name, $props in $markers {
  $prefix: str-slice($name, 1, 2); // get "01", "02", etc.

  $hover-color: if(($prefix =="01") or ($prefix =="02") or ($prefix =="03") or ($prefix =="08"),
      $color-one,
      $color-two );

  ::v-deep(.marker-#{$name}-f1),
  ::v-deep(.marker-#{$name}-f2),
  ::v-deep(.marker-#{$name}-f3) {
    width: map-get($props, width);
    top: map-get($props, top);
    left: map-get($props, left);

    &:hover img {
      filter: drop-shadow(0 0 0 #{$hover-color}) drop-shadow(1px 0 0 #{$hover-color}) drop-shadow(-1px 0 0 #{$hover-color}) drop-shadow(0 1px 0 #{$hover-color}) drop-shadow(0 -1px 0 #{$hover-color});
    }
  }
}

/* #endregion MARKER POSITIONS */


/* #region FLOOR LABELS */
// .floor-label {
//   position: absolute;
//   // bottom: 0px;
//   // color: white;
//   padding: 6px 12px;
//   border-radius: 4px;
//   // font-size: 1.2rem;
//   font-weight: 500;
//   z-index: 2;
//   left: 0%;
//   bottom: 0%;

//   @media (max-width: 767px) {
//     font-size: 0.75rem;
//   }
// }
// .floor-label2 {
//   width: 390px;
//   position: absolute;
//   padding: 6px 12px;
//   border-radius: 4px;
//   font-weight: 500;
//   z-index: 2;
//   left: 24%;
//   bottom: 0%;

//   @media (max-width: 767px) {
//     // width: 250px;
//     // left: 0%;
//     // bottom: 28%;
//   }
// }

.floor-label {
  // width: 390px;
  // position: absolute;
  // padding: 6px 12px;
  border-radius: 4px;
  font-weight: 500;
  // z-index: 2;
  // left: 0%;
  // bottom: 0%;

  // @media (max-width: 767px) {
  //   width: 160px;

  //   // padding: 4px 6px;
  // }
}

.room-card {
  height: 100%;
  // padding: 12px;
  // font-size: 1rem;

  // @media (max-width: 767px) {
  //   font-size: 0.6rem;
  // }
}

.room-name {
  font-weight: bold;
  // font-size: 1rem;

  // @media (max-width: 767px) {
  //   font-size: 0.6rem;
  // }
}

.room-description {
  margin: 0;
  // font-size: 0.9rem;

  // @media (max-width: 767px) {
  //   font-size: 0.6rem;
  // }
}

.web-icon {
  font-size: 2rem;
  display: inline-block;

  @media (max-width: 767px) {
    font-size: 1.5rem;
  }

  &--botmaskop {
    filter: invert(70%) sepia(95%) saturate(4%) hue-rotate(7deg) brightness(105%) contrast(102%);
  }

  &--helshoogte {
    filter: invert(86%) sepia(32%) saturate(1%) hue-rotate(314deg) brightness(81%) contrast(106%);
  }
}

/* #endregion FLOOR LABELS */


/* #region CAROUSEL */

.carousel-wrapper {
  width: 100%;
  max-width: 1575px;
  /* updated from 1024px */
  height: auto;
  /* auto height */
  overflow: hidden;
  margin: 0 auto;
}

.carousel {
  width: 100%;
  height: auto;
  /* auto height */
}

.carousel-image {
  width: 100%;
  height: auto;
  /* auto height */
  object-fit: contain;
  display: block;
}

.q-carousel__slides-container {
  height: auto !important;
  /* auto height */
  min-height: unset !important;
  /* remove min height */
}

.q-carousel__slide {
  height: auto !important;
  /* auto height */
  padding: 0 !important;
}



/* Mobile adjustments */
@media (max-width: 767px) {
  .carousel-wrapper {
    max-height: 240px;
    /* Reduced from 350px */
  }

  .carousel {
    height: 240px !important;
    /* Reduced from 350px */
    max-height: 240px !important;
    min-height: 240px !important;
  }

  .carousel-image {
    height: 240px !important;
    /* Reduced from 350px */
  }

  .q-carousel__slides-container {
    height: 240px !important;
    min-height: 240px !important;
  }

  .q-carousel__slide {
    height: 240px !important;
  }
}

/* Small mobile adjustments */
@media (max-width: 480px) {
  // .carousel-wrapper {
  //   max-height: 180px;
  //   /* Reduced from 300px */
  // }

  .carousel {
    height: 180px !important;
    /* Reduced from 300px */
    max-height: 180px !important;
    min-height: 180px !important;
  }

  .carousel-image {
    height: 180px !important;
    /* Reduced from 300px */
  }

  .q-carousel__slides-container {
    height: 180px !important;
    min-height: 180px !important;
  }

  .q-carousel__slide {
    height: 180px !important;
  }
}


// .carousel-wrapper {
//   height: 100%;
//   max-height: 550px;
//   overflow: hidden;
// }

// .carousel {
//   height: 100%;
//   max-height: 550px;
//   overflow: hidden;
// }

// .q-carousel__slide {
//   height: 100% !important;
//   overflow: hidden !important;
//   padding: 0 !important;
// }

// .carousel-image {
//   height: 100%;
//   width: 100%;
//   object-fit: cover;
//   display: block;
// }


.q-carousel__navigation-inner {
  padding-bottom: 20px;
}

.q-carousel__arrow {
  color: white;
  font-size: 2rem;
}

/* #endregion CAROUSEL */


/* #region RESERVED UNITS */
.reserved-container {
  position: relative;
  width: 100%;
  height: 100%;
}

.reserved-image {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}

.reserved-full-overlay {
  position: absolute;
  top: 10;
  left: 10;
  width: 60%;
  height: 20%;
  background-color: rgba(0, 0, 0, 1);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
  letter-spacing: 2px;
  border-radius: 8px;
  z-index: 10;
  text-transform: uppercase;
}

.dimmed-unit {
  opacity: 0.3;
  filter: grayscale(100%);
}

/* #endregion RESERVED UNITS */


/* #region ENLARGED IMAGE DIALOG */
.image-dialog-card {
  background: rgba(0, 0, 0, 0.9) !important;
}

.dialog-image-section {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.enlarged-image {
  max-width: 100%;
  max-height: 100%;
  width: auto;
  height: auto;
}

.close-button {
  position: fixed;
  right: 15px;
  top: 10px;
  z-index: 6000;
  color: white;
}

.dialog-nav {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: white;
  z-index: 2;
  width: 48px;
  height: 48px;
  font-size: 24px;

  &.left {
    left: 24px;
  }

  &.right {
    right: 24px;
  }
}

.cursor-pointer {
  cursor: pointer;
}

/* #endregion ENLARGED IMAGE DIALOG */


/* #region UNIT CARDS / THUMBNAILS */
.image-container {
  // width: 750px;
  // height: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  // padding: 5px;

  @media (max-width: 1025px) {
    //  width: 300px;
    //  height: 300px;
    width: 100%;
    height: 100%;
  }
}

.unit-meta-info {
  width: 100%;
  padding: 8px;
}

.background-transparent {
  background: #121212;
}

.hover-scale {
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.03);
  }
}

.hover-scale-icon {
  cursor: pointer;
  transition: transform 0.2s ease-in-out;

  &:hover {
    transform: scale(1.2);
  }
}

.available-unit {
  color: #4CAF50;
}

.occupied-unit {
  color: #F44336;
}

/* #endregion UNIT CARDS / THUMBNAILS */
</style>
