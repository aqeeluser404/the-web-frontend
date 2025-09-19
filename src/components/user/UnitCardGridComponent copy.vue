<template>
  <div class="">
    <!-- Carousel section (always shown) -->
    <div class="q-py-md">
      <div class="carousel-wrapper row justify-center bg-grey-3">
        <q-carousel v-show="!isSpecificFloorRoute" animated v-model="currentSlide" infinite
          :autoplay="!isSpecificFloorRoute" :autoplay-interval="5000" transition-prev="slide-right"
          transition-next="slide-left" transition-duration="1800" control-color="white" class="carousel col-md-9"
          :class="isHomePage ? 'bg-none' : 'bg-grey-3'">
          <q-carousel-slide v-for="(card, index) in carouselFloorCards" :key="card._id" :name="card._id"
            class="column no-wrap flex-center" style="position: relative; border-radius: 0;">
            <q-img :src="card.imageUrl" loading="lazy" spinner-color="primary" :alt="'Floor ' + card._id" class="carousel-image cursor-pointer"
              :style="isHomePage ? 'background: none; border-radius: 0;' : 'border-radius: 0;'"
              :class="{ 'image-shadow': !isHomePage }" fit="contain" @click="openImageDialog(index)" />
            <!-- <div class="floor-label text-h6" :class="isHomePage ? 'bg-none' : 'bg-grey-3'">
              <span class="text-underline-on-hover"><b>{{ getFloorLabel(card._id) }}</b></span>
            </div> -->

            <!-- <div class="floor-label">
              <q-card flat class="room-card text-center bg-primary text-white">
                <div class="room-type row justify-start items-center full-height">
                  <div class="col-md-3 col-2 full-height q-mr-md">
                    <span class="web-icon web-icon--botmaskop full-height">🕸️</span>
                  </div>
                  <div class="col-md-8 col-8 full-height">
                    <div class="room-name text-left" style="line-height: 1.2;">Botmaskop</div>
                    <div class="room-description text-left" style="line-height: 1.2;">Larger private room</div>
                  </div>
                </div>
              </q-card>
            </div>
            <div class="floor-label2">
              <q-card flat class="room-card text-center bg-primary text-white">
                <div class="room-type row justify-start items-center full-height">
                  <div class="col-md-3 col-2 full-height q-mr-md">
                    <span class="web-icon web-icon--helshoogte full-height">🕸️</span>
                  </div>
                  <div class="col-md-8 col-8 full-height">
                    <div class="room-name text-left" style="line-height: 1.2;">Helshoogte</div>
                    <div class="room-description text-left" style="line-height: 1.2;">Shoji separated semi-private room</div>
                  </div>
                </div>
              </q-card>
            </div> -->
          </q-carousel-slide>

          <!-- v-for="(card, index) in filteredFloorCards" -->

          <!-- <q-carousel-slide v-for="(card, index) in isHomePage ? getHomePageFloorCards() : filteredFloorCards"
            :key="card._id" :name="card._id" class="column no-wrap flex-center"
            style="position: relative; border-radius: 0;"> <q-img :src="card.imageUrl" :alt="'Floor ' + card._id"
              class="carousel-image cursor-pointer"
              :style="isHomePage ? 'background: none; border-radius: 0;' : 'border-radius: 0;'"
              :class="{ 'image-shadow': !isHomePage }" fit="contain" @click="openImageDialog(index)" />
            <div class="floor-label text-h6" :class="isHomePage ? 'bg-none' : 'bg-grey-3'"> <span
                class="text-underline-on-hover"><b>{{ getFloorLabel(card._id) }}</b></span> </div>
          </q-carousel-slide> -->
        </q-carousel>

        <!-- Smart Map -->
        <div class="map-image-wrapper" v-if="isSpecificFloorRoute">
          <q-img v-if="filteredFloorCards.length > 0" :src="filteredFloorCards[0].imageUrl" class="hero-image">

            <!-- Unit 1 -->
            <div class="marker" :class="markerClass('01-01')" @click="onMarkerClick('01', '01-01')">
              <img :src="markerImage('01-01')" />
            </div>
            <div class="marker" :class="markerClass('01-02')" @click="onMarkerClick('01', '01-02')">
              <img :src="markerImage('01-02')" />
            </div>

            <!-- Unit 2 -->
            <div class="marker" :class="markerClass('02-01')" @click="onMarkerClick('02', '02-01')">
              <img :src="markerImage('02-01')" />
            </div>
            <div class="marker" :class="markerClass('02-02')" @click="onMarkerClick('02', '02-02')">
              <img :src="markerImage('02-02')" />
            </div>

            <!-- Flipped the 2 and 3 rooms -->
            <!-- Unit 3 -->
            <div class="marker" :class="markerClass('03-01')" @click="onMarkerClick('03', '03-01')">
              <img :src="markerImage('03-01')" />
            </div>
            <div class="marker" :class="markerClass('03-02')" @click="onMarkerClick('03', '03-03')">
              <img :src="markerImage('03-02')" />
            </div>
            <div class="marker" :class="markerClass('03-03')" @click="onMarkerClick('03', '03-02')">
              <img :src="markerImage('03-03')" />
            </div>

            <!-- Unit 4 -->
            <div class="marker" :class="markerClass('04-01A')" @click="onMarkerClick('04', '04-01A')">
              <img :src="markerImage('04-01A')" />
            </div>
            <div class="marker" :class="markerClass('04-01B')" @click="onMarkerClick('04', '04-01B')">
              <img :src="markerImage('04-01B')" />
            </div>
            <div class="marker" :class="markerClass('04-02A')" @click="onMarkerClick('04', '04-02A')">
              <img :src="markerImage('04-02A')" />
            </div>
            <div class="marker" :class="markerClass('04-02B')" @click="onMarkerClick('04', '04-02B')">
              <img :src="markerImage('04-02B')" />
            </div>
            <div class="marker" :class="markerClass('04-03A')" @click="onMarkerClick('04', '04-03A')">
              <img :src="markerImage('04-03A')" />
            </div>
            <div class="marker" :class="markerClass('04-03B')" @click="onMarkerClick('04', '04-03B')">
              <img :src="markerImage('04-03B')" />
            </div>

            <!-- Unit 5 -->
            <div class="marker" :class="markerClass('05-01A')" @click="onMarkerClick('05', '05-01A')">
              <img :src="markerImage('05-01A')" />
            </div>
            <div class="marker" :class="markerClass('05-01B')" @click="onMarkerClick('05', '05-01B')">
              <img :src="markerImage('05-01B')" />
            </div>
            <div class="marker" :class="markerClass('05-02A')" @click="onMarkerClick('05', '05-02A')">
              <img :src="markerImage('05-02A')" />
            </div>
            <div class="marker" :class="markerClass('05-02B')" @click="onMarkerClick('05', '05-02B')">
              <img :src="markerImage('05-02B')" />
            </div>
            <div class="marker" :class="markerClass('05-03A')" @click="onMarkerClick('05', '05-03A')">
              <img :src="markerImage('05-03A')" />
            </div>
            <div class="marker" :class="markerClass('05-03B')" @click="onMarkerClick('05', '05-03B')">
              <img :src="markerImage('05-03B')" />
            </div>

            <!-- Flipped the 2 and 3 rooms -->
            <!-- Unit 6 -->
            <div class="marker" :class="markerClass('06-01A')" @click="onMarkerClick('06', '06-01A')">
              <img :src="markerImage('06-01A')" />
            </div>
            <div class="marker" :class="markerClass('06-01B')" @click="onMarkerClick('06', '06-01B')">
              <img :src="markerImage('06-01B')" />
            </div>
            <div class="marker" :class="markerClass('06-02A')" @click="onMarkerClick('06', '06-03A')">
              <img :src="markerImage('06-02A')" />
            </div>
            <div class="marker" :class="markerClass('06-02B')" @click="onMarkerClick('06', '06-03B')">
              <img :src="markerImage('06-02B')" />
            </div>
            <div class="marker" :class="markerClass('06-03A')" @click="onMarkerClick('06', '06-02A')">
              <img :src="markerImage('06-03A')" />
            </div>
            <div class="marker" :class="markerClass('06-03B')" @click="onMarkerClick('06', '06-02B')">
              <img :src="markerImage('06-03B')" />
            </div>

            <!-- Unit 7 -->
            <div class="marker" :class="markerClass('07-01A')" @click="onMarkerClick('07', '07-01A')">
              <img :src="markerImage('07-01A')" />
            </div>
            <div class="marker" :class="markerClass('07-01B')" @click="onMarkerClick('07', '07-01B')">
              <img :src="markerImage('07-01B')" />
            </div>

            <div class="marker" :class="markerClass('07-02A')" @click="onMarkerClick('07', '07-02A')">
              <img :src="markerImage('07-02A')" />
            </div>
            <div class="marker" :class="markerClass('07-02B')" @click="onMarkerClick('07', '07-02B')">
              <img :src="markerImage('07-02B')" />
            </div>

            <div class="marker" :class="markerClass('07-03A')" @click="onMarkerClick('07', '07-03A')">
              <img :src="markerImage('07-03A')" />
            </div>
            <div class="marker" :class="markerClass('07-03B')" @click="onMarkerClick('07', '07-03B')">
              <img :src="markerImage('07-03B')" />
            </div>

            <!-- Unit 8 -->
            <div class="marker" :class="markerClass('08-01')" @click="onMarkerClick('08', '08-01')">
              <img :src="markerImage('08-01')" />
            </div>
            <!-- <div class="marker" :class="markerClass('08-02')" @click="onMarkerClick('08', '08-02')">
              <img :src="markerImage('08-02')" />
            </div> -->
          </q-img>
        </div>
      </div>
    </div>

    <!-- <div class="row items-center justify-around full-width q-gutter-y-md q-my-sm" v-if="!isSpecificFloorRoute">
      <div class="floor-label col-12 col-sm-3 ">
        <q-card flat class="room-card text-center bg-primary text-white full-height" :class="{ 'q-mr-sm': $q.screen.gt.sm }" >
          <div class="room-type row justify-start items-center full-height q-pa-md" style="background: #00796B;">
            <div class="col-md-3 col-2 full-height">
              <span class="web-icon web-icon--botmaskop full-height">🕸️</span>
            </div>
            <div class="col-md-9 col-8 full-height column justify-center">
              <div class="room-name text-h6 text-left" style="line-height: 1.2;">Botmaskop</div>
              <div class="room-description text-body1 text-left" style="line-height: 1.2;">Larger private room</div>
            </div>
          </div>
        </q-card>
      </div>
      <div class="floor-label col-12 col-sm-3">
        <q-card flat class="room-card text-center bg-primary text-white full-height" >
          <div class="room-type row justify-start items-center full-height q-pa-md" style="background-color: #FFB300;">
            <div class="col-md-3 col-2 full-height">
              <span class="web-icon web-icon--helshoogte full-height">🕸️</span>
            </div>
            <div class="col-md-9 col-8 full-height column justify-center">
              <div class="room-name text-h6 text-left" style="line-height: 1.2;">Helshoogte</div>
              <div class="room-description text-body1 text-left" style="line-height: 1.2;">Shoji separated semi-private
                room
              </div>
            </div>
          </div>
        </q-card>
      </div>
    </div> -->

    <div v-if="isSpecificFloorRoute" class="q-py-lg">
      <BedStatsComponent />
    </div>

    <div v-if="isSpecificFloorRoute" class="q-pb-md">
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
                class="col-xs-12 col-sm-6 col-md-1" emit-value map-options />
              <q-select filled dense v-model="selectedFloor" :options="[
                { label: '1st Floor', value: 1 },
                { label: '2nd Floor', value: 2 },
                { label: '3rd Floor', value: 3 },
              ]" emit-value map-options class="col-xs-12 col-sm-6 col-md-1" @update:model-value="goToFloor" />
              <!-- <q-input filled dense v-model.number="priceRange.min" type="number" placeholder="Min Price"
                class="col-xs-12 col-sm-6 col-md-1" />
              <q-input filled dense v-model.number="priceRange.max" type="number" placeholder="Max Price"
                class="col-xs-12 col-sm-6 col-md-1" /> -->
              <q-btn flat rounded icon="refresh" label="Reset" color="red"
                class="q-py-sm custom-button col-xs-12 col-sm-6 col-md-1" @click="resetFilters" />
            </q-card-section>

            <q-card-section>
              <q-list class="row justify-center">
                <q-card v-for="unit in units" :key="unit._id"
                  class="hover-scale q-ma-sm bg-transparent soft-shadow-card col-md-3 col-12"
                  :class="{ 'dimmed-unit': shouldDimUnit(unit) }"
                  :style="{ pointerEvents: shouldDimUnit(unit) ? 'none' : 'auto' }"
                  @click="!shouldDimUnit(unit) ? handleUnitClick(unit) : null">

                  <!-- Image -->
                  <div class="row justify-center">
                    <div class="image-container reserved-container full-height">
                      <q-img v-if="unit.images?.length" :src="getImageUrl(unit.images[0].imageUrl)"
                        class="reserved-image" fit="cover" />
                      <div v-if="unit.reservedBy" class="reserved-full-overlay">
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
                          <b>From R {{ Number(unit.unitPrice).toFixed(2) }}</b>
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

                          <q-icon
                            :name="getAvailableSubUnits(unit) > 0 ? 'check_circle' : 'block'"
                            :color="getAvailableSubUnits(unit) > 0 ? 'positive' : 'negative'"
                            size="sm"
                          />

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
          <img :src="currentDialogImageUrl" class="enlarged-image" style="object-fit: contain" />

          <q-btn round flat dense class="dialog-nav left" icon="chevron_left" @click="prevImage"
            v-if="filteredFloorCards.length > 1" />
          <q-btn round flat dense class="dialog-nav right" icon="chevron_right" @click="nextImage"
            v-if="filteredFloorCards.length > 1" />
        </q-card-section>
      </q-card>
    </q-dialog>
    <q-dialog v-model="detailFormDialog" @hide="handleDialogClose" :maximized="$q.screen.lt.sm ? true : false">
      <UnitDetailedApplicationForm :unit="selectedUnit" :sub-unit="selectedSubUnit" @close="handleDialogClose" />
    </q-dialog>
  </div>
</template>

<script>
import BedStatsComponent from './BedStatsComponent.vue'
import UnitDetailedApplicationForm from './UnitDetailedApplicationForm.vue'
import UnitDetailsComponent from './UnitDetailsComponent.vue'
import UnitApplicationFormComponent from './UnitApplicationFormComponent.vue'
import UnitService from '../../services/UnitService'
import RentalService from '../../services/RentalService'
import Helper from '../../services/utils'
import floor1 from 'src/assets/resources/floorLayout/FirstFloorLayout.png'
import floor2 from 'src/assets/resources/floorLayout/SecondFloorLayout.png'
import floor3 from 'src/assets/resources/floorLayout/ThirdFloorLayout.png'
import floorHome from 'src/assets/resources/floorLayout/FirstFloorLayoutHome.png'
import CustomButton from '../elements/CustomButton.vue'

export default {
  name: 'UnitGridSection',
  components: {
    UnitDetailsComponent,
    UnitApplicationFormComponent,
    UnitDetailedApplicationForm,
    CustomButton, BedStatsComponent
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
      selectedSubUnit: null,
      detailFormDialog: false,
      detailsDialog: false,
      applyDialog: false,
      currentSlide: 1,
      floorCards: [
        { _id: 1, imageUrl: floor1 },
        { _id: 2, imageUrl: floor2 },
        { _id: 3, imageUrl: floor3 },
        { _id: 4, imageUrl: floorHome }
      ],
      currentFloor: null
    }
  },
  computed: {

    // currentRoute() {
    //   return this.$route.params.floor;
    // },

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
    isHomeRoute() {
      return this.$route.path === '/';
    },
    carouselFloorCards() {
      if (this.isHomePage || this.$route.path === '/units/apply') {
        // return this.floorCards.filter(card => card._id === 1);
        return this.floorCards.filter(card => card._id === 4);
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
        // console.log('selectedSubUnit set to:', this.selectedSubUnit);
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
      // this.currentImageIndex = index
      // this.currentDialogImageUrl = this.filteredFloorCards[index].imageUrl
      // this.imageDialog = true
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
      const response = await UnitService.getAllUnits()
      this.units = response
      this.allReservedUnits = response.filter(u => u.reservedBy)
      this.organizeUnitsByFloor()

      if (this.isLoggedIn) {
        await this.fetchMyRentals()
      }
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
      // Clone the unit to avoid mutating the original reference
      const cleanUnit = { ...unit };

      if (Array.isArray(unit.subUnits)) {
        cleanUnit.subUnits = unit.subUnits.filter(sub => !sub.reservedBy);
      }

      this.selectedUnit = cleanUnit;
      this.detailFormDialog = true;
      // this.detailsDialog = true
      // this.applyDialog = true
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
  async mounted() {
    await this.checkLoginStatus();
    this.parseFloorFromRoute()
    this.fetchUnits()
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
  height: 100%;
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
