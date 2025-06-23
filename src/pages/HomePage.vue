<template>
  <q-page>
    <!-- <MaintenanceBanner /> -->

    <!----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
    <div style="margin: 4%; margin-top: 0;" class="bg-grey">
      <q-carousel animated v-model="currentSlide" infinite autoplay :autoplay-interval="5000"
        transition-prev="slide-right" transition-next="slide-left" transition-duration="1800"
        :height="$q.screen.lt.sm ? 'auto' : '100vh'" arrows navigation control-color="white"
        class="fullscreen-carousel">
        <q-carousel-slide v-for="card in heroCards" :key="card._id" :name="card._id" class="column no-wrap flex-center">
          <q-img :src="card.imageUrl" :alt="'Room ' + card._id" class="hero-image" fit="cover" />
        </q-carousel-slide>
      </q-carousel>
    </div>

    <!----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
    <div style="height: 100%; margin: 4% 0;">
      <div flat class="
        bg-black
        text-white
        row justify-between
        q-pa-lg
        ">
        <q-card-section class="text-h4">Attention Students! Looking to rent in 2026?</q-card-section>
        <q-card-section>
          <CustomButton color="white" text-color="black" label="Visit the Unit Rental List" @click="openUnitDash"
            style="border: 2px solid black;" />
        </q-card-section>
      </div>
    </div>

    <!-- -----------------------------------------------------------------------------------------------------------------------------------------------  -->
    <!-- amenities -->
    <div id="amenities-section" class="row justify-between slide-container"
      style="height: 100%; margin: 4% 0; background-color: #333;">
      <q-card flat class="
        bg-transparent
        text-white
        text-body1
        q-pa-lg
        col-md-7 col-12
        column flex-center
        ">
        <q-card-section class="fade-in-scale">
          <div class="text-white"><b>Feature Rich</b></div>
          <div class="text-h3 q-mb-md">World-Class Amenities</div>
          <div>Designed around the needs of its residents, The Web strikes the perfect balance between lifestyle and
            academic amenities.</div>
          <ul class="q-mb-lg" style="list-style-type: none; padding-left: 0; line-height: 2;">
            <li><span class="q-mr-sm">✔️</span> Social courtyard</li>
            <li><span class="q-mr-sm">✔️</span> Resort-style swimming pool</li>
            <li><span class="q-mr-sm">✔️</span> Woodfire braai areas & firepit</li>
            <li><span class="q-mr-sm">✔️</span> Outdoor undercover lounge</li>
            <li><span class="q-mr-sm">✔️</span> Restaurant & coffee shop</li>
            <li><span class="q-mr-sm">✔️</span> Themed professional kitchens per floor</li>
            <li><span class="q-mr-sm">✔️</span> Backup power to common areas</li>
            <li><span class="q-mr-sm">✔️</span> 24hr security with biometric access</li>
            <li><span class="q-mr-sm">✔️</span> High-speed Wi-Fi throughout</li>
            <li><span class="q-mr-sm">✔️</span> Secure car, motorbike & bicycle parking</li>
          </ul>
          <!-- <CustomButton v-if="$q.screen.gt.sm" customStyle="width: 25%" color="white" text-color="black" label="Make an Enquiry" @click="scrollToSection('contact-section')" />
          <CustomButton v-else color="white" text-color="black"  customStyle="width: 100%" label="Make an Enquiry" @click="scrollToSection('contact-section')" /> -->
        </q-card-section>
      </q-card>
      <div class="col-md-5 col-12 slide-in-right">
        <q-img src="~src/assets/resources/home/outside3.jpg" alt="hero image" class="side-image" />
      </div>
    </div>

    <!-- -----------------------------------------------------------------------------------------------------------------------------------------------  -->
    <!-- images -->

    <div id="images-section" style="margin: 4% 0" class="bg-grey">
      <!-- <q-img src="~src/assets/resources/home/hero/Location2.png" alt="hero image" class="hero-image" /> -->
      <q-carousel animated v-model="currentSlide2" infinite autoplay :autoplay-interval="5000"
        transition-prev="slide-right" transition-next="slide-left" transition-duration="1800"
        :height="$q.screen.lt.sm ? 'auto' : '100vh'" arrows navigation control-color="white"
        class="fullscreen-carousel">
        <q-carousel-slide v-for="card in unitCards" :key="card._id" :name="card._id" class="column no-wrap flex-center">
          <q-img :src="card.imageUrl" :alt="'Room ' + card._id" class="hero-image" fit="cover" />
        </q-carousel-slide>
      </q-carousel>
    </div>

    <!-- units card -->
    <div id="units-section" class="q-py-xl" style="height: 100%; margin:  4% 0; background-color: #222;">
      <q-card-section class=" fade-up">
        <div class="text-h4 text-center text-white">Unit Specifications</div>
      </q-card-section>

      <div class="q-pa-md">

        <BedStatsComponentBlack />

        <q-card flat class="q-ma-sm bg-transparent text-white">
          <q-expansion-item class="text-subtitle1" v-for="(units, floorIndex) in allUnits" :key="floorIndex"
            :label="`${floorLabels[floorIndex]} (${units.length} items)`" expand-separator
            v-model="expanded[floorIndex]" @show="handleExpansion(floorIndex)">
            <q-list class="row justify-center">
              <q-card v-for="unit in units" :key="unit._id" flat class="q-ma-sm bg-transparent hover-scale"
                @click="openUnitDetails(unit)" style="cursor: pointer;">
                <q-card-section class="column flex-center">
                  <div class="text-h6">

                    Unit {{ unit.unitNumber }}

                    (<span v-if="unit.unitStatus === 'Available'"
                      :class="{ 'available-unit': unit.unitStatus === 'Available' }">
                      {{ unit.unitStatus }}
                    </span>
                    <span v-else :class="{ 'occupied-unit': unit.unitStatus === 'Occupied' }">
                      {{ unit.unitStatus }}
                    </span>)
                  </div>

                  <div class="text-caption">{{ unit.unitType }} - {{ unit.unitOccupants - unit.currentOccupants }}/{{
                    unit.unitOccupants }} Beds</div>
                </q-card-section>
                <q-card-section class="row justify-center">
                  <q-img v-if="unit.images && unit.images.length > 0" :src="getImageUrl(unit.images[0].imageUrl)"
                    class="image" />
                </q-card-section>
              </q-card>
            </q-list>
          </q-expansion-item>
        </q-card>
      </div>
    </div>

    <!-- <div id="units-section" class="q-py-xl" style="height: 100%; margin:  4% 0;">
      <q-card-section class=" fade-up">
        <div class="text-h4 text-center">Unit Specifications</div>
      </q-card-section>
      <div class="q-pa-md">
        <BedStatsComponent />
        <q-card flat class="q-ma-sm">
          <q-expansion-item
            class="text-subtitle1"
            v-for="(units, floorIndex) in allUnits"
            :key="floorIndex"
            :label="`${floorLabels[floorIndex]} (${units.length} items)`"
            expand-separator
            :default-opened="floorIndex === 0"
          >
            <q-list class="row justify-center">
              <q-card v-for="unit in units" :key="unit._id" flat class="q-ma-sm bg-transparent hover-scale" @click="openUnitDetails(unit)" style="cursor: pointer;">
                <q-card-section class="column flex-center">
                  <div class="text-h6">

                    Unit {{ unit.unitNumber }}

                    (<span v-if="unit.unitStatus === 'Available'" :class="{ 'available-unit': unit.unitStatus === 'Available'}">
                      {{ unit.unitStatus }}
                    </span>
                    <span v-else :class="{ 'occupied-unit': unit.unitStatus === 'Occupied'}">
                      {{ unit.unitStatus }}
                    </span>)
                  </div>

                  <div class="text-caption">{{ unit.unitType }} - {{ unit.unitOccupants }} Beds</div>
                </q-card-section>
                <q-card-section class="row justify-center">
                  <q-img v-if="unit.images && unit.images.length > 0" :src="getImageUrl(unit.images[0].imageUrl)" class="image" />
                </q-card-section>
              </q-card>
            </q-list>
          </q-expansion-item>
        </q-card>
      </div>
    </div> -->

    <!-- -----------------------------------------------------------------------------------------------------------------------------------------------  -->
    <!-- academics -->
    <div id="academics-section" style="height: 100%; margin:  4% 0; " class="row justify-between">
      <div class="col-md-5 col-12 row justify-center slide-in-left">
        <q-img src="~src/assets/resources/home/rooftop.png" alt="hero image" class="side-image" />
      </div>

      <q-card flat class="
        bg-transparent
        text-body1
        q-pa-lg
        col-md-7 col-12
        column flex-center
        ">
        <q-card-section class="fade-in-scale">
          <div class="text-black"><b>Space to Thrive</b></div>
          <div class="text-h3 q-mb-md">Academic Excellence</div>
          <div>At the heart of this purpose-built student development is an environment that facilitates both private
            and collaborative studying. The Web has it all, from an expansive study centre with tailor-made solo study
            pods, and multi-purpose boardrooms for group work, these facilities are geared for the demanding needs of
            future business and thought leaders.</div>
          <ul class="q-mb-lg" style="list-style-type: none; padding-left: 0; line-height: 2;">
            <li><span class="q-mr-sm">✔️</span> Study centre</li>
            <li><span class="q-mr-sm">✔️</span> High-speed Wi-Fi throughout</li>
            <li><span class="q-mr-sm">✔️</span> Multiple study zones</li>
            <li><span class="q-mr-sm">✔️</span> Meeting rooms</li>
            <li><span class="q-mr-sm">✔️</span> Outdoor study pods</li>
            <li><span class="q-mr-sm">✔️</span> Zen courtyard</li>
            <li><span class="q-mr-sm">✔️</span> Print & copy facilities</li>
            <li><span class="q-mr-sm">✔️</span> Conference facilities</li>
          </ul>
        </q-card-section>
      </q-card>
    </div>

    <!-- academics - section 2  -->
    <div class="q-pa-xl" style="height: 100%; margin: 2% 0; background-color: #222;">
      <q-card flat class="bg-transparent text-white text-body1 text-center constrain fade-up">
        <q-card-section>
          <div class="text-h4">Enhancing a Quaint Suburb of Stellenbosch</div>
        </q-card-section>
        <q-card-section class="">
          <div class="col-md-6">
            Paramount to The Web's vision, is to ultimately enhance this quaint suburb by making it more
            pedestrian-friendly and in doing so, create a café culture atmosphere along its beautiful tree-lined
            streets.
          </div>
          <div class="col-md-6">
            In a Stellenbosch first, over R35 million has been raised and earmarked by a group of developers in the area
            to build towards this vision and amplify the suburb, as well as improve its accessibility to campus. The
            funds will be allocated to 11 projects that range from major security enhancements, to local area
            infrastructure upgrades for all who reside in the area.
          </div>
          <div class="col-md-6">
            This desirable location, well on its way becoming the next Stellies student hub, has likeminded developers
            already taking advantage of The Web's entrance into the area by purchasing existing houses in the precinct
            for further student development.
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- academics - section 3 -->
    <div class="row justify-between" style="height: 100%; margin: 4% 0;">
      <q-card flat class="
        bg-transparent
        text-body1
        q-pa-lg
        col-md-7 col-12
        column flex-center
        ">
        <q-card-section class="fade-in-scale">
          <div class="text-black"><b>Perfectly Position</b></div>
          <div class="text-h3 q-mb-md">The Jewel in the Stellenbosch Crown</div>
          <div class="q-mb-md">
            Nestled in a desirable pocket of Stellenbosch and a mere 750m from the University, The Web is perfectly
            poised to become an instant hit with students and one of Stellenbosch’s most sought-after new developments.
          </div>
          <div class="q-mb-lg">
            With Stellenbosch’s student population rapidly growing over the past decade, The Web is set to become the
            ultimate choice for students seeking quality and convenience in their home away from home.
          </div>
        </q-card-section>
      </q-card>
      <div class="col-md-5 col-12 row justify-center slide-in-right">
        <q-img src="~src/assets/resources/home/outside3.jpg" class="side-image" />
      </div>
    </div>

    <!-- academics - section 4 -->
    <div class="row justify-between" style="height: 100%; margin: 4% 0; background-color: #333;">
      <div class="col-md-5 col-12 slide-in-left">
        <q-img src="~src/assets/resources/home/Residential.png" class="side-image" />
      </div>
      <q-card flat style="" class="
        bg-transparent
        text-white
        text-body1
        q-pa-lg
        col-md-7 col-12
        column flex-center
        ">
        <q-card-section class="fade-in-scale">
          <div class="text-white"><b>Rent in A</b></div>
          <div class="text-h3 q-mb-md">Residential College</div>
          <div>A residential college is a private residence which is aligned with the academic and support functions of
            the university and serves to holistically support the student towards personal and academic achievement.
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- academics - section 5 -->
    <div class="q-pa-xl" style="height: 100%; margin: 4% 0; background-color: #222;">
      <q-card flat class="bg-transparent text-white text-body1 text-center constrain fade-up">
        <q-card-section>
          <div class="text-h4">The Web's Amenities Foster an Environment Ideal for Academic Success</div>
        </q-card-section>
        <q-card-section class="">
          <div class="col-md-6">
            The academic advisor of The Web is a former senior director of the Division for Student Affairs of
            Stellenbosch University. Residents of The Web will be encouraged to participate in organised student
            programmes offered by The Web and the various tertiary institutions they attend, such as well-being
            programmes, leadership training, mentoring programmes, and social events.
          </div>
          <div class="col-md-6">
            The Web is designed in collaboration with top academic experts to give your child the highest possibility of
            academic success. Cooperation between the tertiary institutions in Stellenbosch and The Web to the benefit
            of the students who will take up residence at The Web is possible.
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- academics - BANNER -->
    <div style="height: 100%; margin: 4% 0;">
      <div flat class="
        bg-black
        text-white
        row justify-between
        q-pa-lg
        ">
        <q-card-section class="text-h4">Need more answers? Read our FAQs</q-card-section>
      </div>
    </div>

    <!-- -----------------------------------------------------------------------------------------------------------------------------------------------  -->

    <!-- units card - section 2 -->
    <div class="row justify-between" style="height: 100%; margin: 4% 0;">
      <div class="col-md-6 col-12 row justify-center slide-in-left">
        <q-img src="~src/assets/resources/home/dinning.png" class="side-image" />
      </div>
      <q-card flat class="
        bg-transparent
        text-body1
        q-pa-lg
        col-md-6 col-12
        column flex-center
        ">
        <q-card-section class="fade-in-scale">
          <div class="text-black"><b>Living Spaces</b></div>
          <div class="text-h3 q-mb-md">Expertly Designed</div>
          <div class="q-mb-lg">Architects Boogertman & Partners have spent countless hours configuring each of the
            living spaces at The Web. Ergonomically designed units all feature a kitchenette, private bathroom, study
            desk, and open-plan living spaces with premium fittings and fixtures.</div>
        </q-card-section>
      </q-card>
    </div>

    <!-- -----------------------------------------------------------------------------------------------------------------------------------------------  -->
    <!-- contact card -->
    <div id="contact-section" style="height: 100%; background-color: #333;" class="q-pa-xl">

      <q-card flat class="bg-transparent text-white row justify-center constrain">

        <q-card-section class="col-md-6 col-12">
          <div class="text-h4 q-mb-md">Discuss with Our Team</div>

          <!-- <div class="text-body2 q-mb-md">Founder and Managing Director</div> -->
          <div class="text-body1 q-mb-md"><b>Wayne Louw</b></div>

          <div class="column">
            <a href="mailto:admin@the-web.co.za" class="q-mb-md" style="text-decoration: underline; color: white;">
              <q-icon name="eva-email-outline" class="q-mr-sm" /> admin@the-web.co.za
            </a>

            <a href="tel:+27823433945" target="_blank" class="q-mb-md"
              style="text-decoration: underline; color: white;">
              <q-icon name="eva-phone-outline" class="q-mr-sm" /> (+27) 82-343-3945
            </a>

            <a href="https://api.whatsapp.com/send/?phone=27823433945&text&type=phone_number&app_absent=0"
              target="_blank" style="text-decoration: underline; color: white;">
              <q-icon name="eva-message-circle-outline" class="q-mr-sm" /> Send WhatsApp
            </a>
          </div>
        </q-card-section>

        <q-card-section class="col-md-6 col-12 bg-transparent">
          <div class="text-h4 q-mb-md">Contact Us</div>

          <div class="">
            <q-form @submit="submitContactForm" style="width: 100%;">
              <q-input filled label-color=white color="brown" v-model="userContact.firstName" label="Your Name"
                stack-label class="q-mb-md " required style="border: 1px solid white;" input-style="color: white;" />
              <q-input filled label-color=white color="brown" v-model="userContact.email" label="Your Email" stack-label
                class="q-mb-md" required style="border: 1px solid white;" input-style="color: white;" />
              <q-input filled label-color=white color="brown" v-model="message" label="Message" type="textarea"
                stack-label class="q-mb-md" required style="border: 1px solid white;" input-style="color: white;" />
              <div class="row justify-between flex-center">
                <label>
                  <input type="checkbox" name="privacyPolicy" value="agree" required class="q-mr-sm">
                  By submitting your data, you agree to our <span class="text-white">privacy policy</span>
                </label>
                <CustomButton v-if="$q.screen.gt.sm" type="submit" label="Send Message" color="white" text-color="black"
                  customStyle="width: 30%" />
                <CustomButton v-else type="submit" label="Send Message" class="q-mt-md" color="white" text-color="black"
                  customStyle="width: 100%" />
              </div>
            </q-form>
          </div>
        </q-card-section>
      </q-card>
    </div>
    <CustomButton customStyle="width: 180px" label="Secure your spot" @click="openUnitDash"
      style="position: fixed; bottom: 20px; left: 20px; z-index: 1000" />

    <!-- Dialogs -->
    <q-dialog v-model="detailsDialog">
      <UnitDetailsComponent :unit="selectedUnit" @close="detailsDialog = false" />
    </q-dialog>
    <q-dialog v-model="applyDialog">
      <UnitApplicationFormComponent :unit="selectedUnit" @close="handleDialogClose" />
    </q-dialog>
  </q-page>
</template>

<script>
import MaintenanceBanner from 'src/components/elements/MaintenanceBanner.vue';
import CustomButton from 'src/components/elements/CustomButton.vue';
import EmailService from 'src/services/EmailService';
import Helper from 'src/services/utils'

// interior carousel images
import Room1 from 'src/assets/resources/home/images/Room_1.jpg';
import Room2 from 'src/assets/resources/home/images/Room_2.jpg';
import Room3 from 'src/assets/resources/home/images/Room_3.jpg';
import Room8 from 'src/assets/resources/home/images/Room_8.jpg';
import Room9 from 'src/assets/resources/home/images/Room_9.jpg';
import Room10 from 'src/assets/resources/home/images/Room_10.jpg';
import Room11 from 'src/assets/resources/home/images/Room_11.jpg';
import Room12 from 'src/assets/resources/home/images/Room_12.jpg';
import Bathroom from 'src/assets/resources/home/images/Bathroom.jpg';

// hero carousel images
import home1 from 'src/assets/resources/home/outside1.jpg';
import home2 from 'src/assets/resources/home/outside2.png';
import home3 from 'src/assets/resources/home/outside3.jpg';
import home4 from 'src/assets/resources/home/rooftop.png';

// unit images
import StudioPatio from 'src/assets/resources/home/unit-types/B-StudioBalcony-768x689.png';
import StudioBalconyB from 'src/assets/resources/home/unit-types/B3-Studio-768x689.png';
import StudioPatioB from 'src/assets/resources/home/unit-types/B4-StudioBalcony-768x689.png';
import StudioBal from 'src/assets/resources/home/unit-types/D-StudioBalcony-768x689.png';
import Deluxe from 'src/assets/resources/home/unit-types/Deluxe-768x689.png';
import StudioPatioC from 'src/assets/resources/home/unit-types/C-StudioPatio-768x689.png';
import SharedStudio from 'src/assets/resources/home/unit-types/E-Shared-768x689.png';
import TwoBed from 'src/assets/resources/home/unit-types/F-2-Bed-768x689.png';

import UnitService from 'src/services/UnitService'
import UnitDetailsComponent from 'src/components/user/UnitDetailsComponent.vue'
import UnitApplicationFormComponent from 'src/components/user/UnitApplicationFormComponent.vue'
import RentalService from 'src/services/RentalService'
import BedStatsComponentBlack from 'src/components/user/BedStatsComponentBlack.vue'
import BedStatsComponent from 'src/components/user/BedStatsComponent.vue'

import { useMeta } from 'quasar'

export default {
  name: 'Homepage',

  setup() {
    useMeta({
      robots: {
        name: 'robots',
        content: 'index, follow'
      },
      title: 'The Web | Premium Student Housing in Stellenbosch',
      meta: {

        // Primary meta
        description: {
          name: 'description',
          content: 'Modern student accommodation in Stellenbosch with resort-style amenities, 24/7 security, high-speed Wi-Fi, and academic-focused living spaces. Apply now for 2026.'
        },
        keywords: {
          name: 'keywords',
          content: 'student housing Stellenbosch, student accommodation, The Web residences, university housing, secure student living'
        },

        // OpenGraph (Facebook/social)
        ogTitle: {
          property: 'og:title',
          content: 'The Web | Luxury Student Housing in Stellenbosch'
        },
        ogDescription: {
          property: 'og:description',
          content: 'Stellenbosch\'s premier student residence featuring study lounges, resort-style pool, social courtyards, and 24/7 security. Applications open for 2026.'
        },
        ogUrl: {
          property: 'og:url',
          content: 'https://the-web.co.za' + window.location.pathname
        },
        ogImage: {
          property: 'og:image',
          content: 'https://the-web.co.za/assets/outside3.jpg'
        },
        ogType: {
          property: 'og:type',
          content: 'website'
        },

        // Twitter Card
        twitterCard: {
          name: 'twitter:card',
          content: 'summary_large_image'
        },
        twitterTitle: {
          name: 'twitter:title',
          content: 'The Web | Premium Student Housing in Stellenbosch'
        },
        twitterDescription: {
          name: 'twitter:description',
          content: 'Luxury student accommodation with academic facilities, social spaces, and premium amenities. Secure your spot for 2026.'
        }
      },
      link: {
        canonical: 'https://the-web.co.za' + window.location.pathname
      }
    })
  },

  data() {
    return {
      units: [],
      detailsDialog: false,
      applyDialog: false,
      selectedUnit: null,
      myRentals: [],
      allUnits: [],
      // floorLabels: ['Ground Floor', 'First Floor', 'Second Floor'],
      floorLabels: ['First Floor', 'Second Floor', 'Third Floor'],
      expanded: [true, false, false],

      currentSlide: 1,
      heroCards: [
        { _id: 1, imageUrl: home1 },
        { _id: 2, imageUrl: home2 },
        { _id: 3, imageUrl: home3 },
        { _id: 4, imageUrl: home4 },
      ],

      currentSlide2: 1,
      unitCards: [
        { _id: 1, imageUrl: Room1 },
        { _id: 2, imageUrl: Room2 },
        { _id: 3, imageUrl: Room3 },
        { _id: 4, imageUrl: Room8 },
        { _id: 5, imageUrl: Room9 },
        { _id: 6, imageUrl: Room10 },
        { _id: 7, imageUrl: Room11 },
        { _id: 8, imageUrl: Room12 },
        { _id: 9, imageUrl: Bathroom },
      ],

      unitTypes: [
        { _id: 2, imageUrl: StudioPatio, label: 'Studio Patio' },
        { _id: 3, imageUrl: StudioBalconyB, label: 'Studio Balcony B' },
        { _id: 4, imageUrl: StudioPatioB, label: 'Studio Patio' },
        { _id: 5, imageUrl: StudioBal, label: 'Studio Bal' },
        { _id: 6, imageUrl: Deluxe, label: 'Deluxe' },
        { _id: 7, imageUrl: StudioPatioC, label: 'Studio Patio' },
        { _id: 8, imageUrl: SharedStudio, label: 'Studio Patio' },
        { _id: 9, imageUrl: TwoBed, label: 'Shared Studio' },
      ],
      userContact: {
        firstName: '',
        email: '',
      }, message: '',
    }
  },
  components: {
    CustomButton,
    BedStatsComponentBlack,
    BedStatsComponent,
    UnitDetailsComponent,
    UnitApplicationFormComponent,
    MaintenanceBanner
  },
  computed: {
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

    handleExpansion(expandedIndex) {
      this.expanded = this.expanded.map((_, index) => index === expandedIndex)
    },

    async fetchUnits() {
      const response = await UnitService.getAllUnits()
      this.units = response

      const sortedUnits = Helper.sortByProperty(this.units, 'unitNumber', 'asc')

      // const groundFloorUnits = sortedUnits.filter(unit => unit.floorLevel === 'Ground Floor')
      // const firstFloorUnits = sortedUnits.filter(unit => unit.floorLevel === 'First Floor')
      // const secondFloorUnits = sortedUnits.filter(unit => unit.floorLevel === 'Second Floor')

      const groundFloorUnits = sortedUnits.filter(unit => unit.floorLevel === 'First Floor')
      const firstFloorUnits = sortedUnits.filter(unit => unit.floorLevel === 'Second Floor')
      const secondFloorUnits = sortedUnits.filter(unit => unit.floorLevel === 'Third Floor')

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
    },
    scrollToSection(sectionId) {
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = window.innerHeight * 0.1; // 10vh
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    },
    async submitContactForm() {
      const checkbox = document.querySelector('input[name="privacyPolicy"]');
      if (!checkbox.checked) {
        this.$q.notify({ type: 'negative', message: 'You must agree to the privacy policy before submitting.' });
        return;
      }

      try {
        const response = await EmailService.GetInContact(this.userContact, this.message);
        if (response) {
          this.$q.notify({ type: 'positive', color: 'primary', message: 'Message sent successfully!' });
          this.userContact.firstName = '';
          this.userContact.email = '';
          this.message = '';
        } else {
          this.$q.notify({ type: 'negative', message: 'Error sending message.' });
        }
      } catch (error) {
        this.$q.notify({ type: 'negative', message: 'Error sending message.' });
      }
    },
    async openUnitDash() {
      const isLoggedIn = await Helper.checkCookie()
      if (isLoggedIn) {
        this.$router.push('/units/apply')
      } else {
        this.$router.push('/auth/login')
        this.$q.notify({ type: 'negative', message: 'Please login to continue.' })
      }
    }
  },
  created() {
    this.fetchUnits()
  },
}
</script>

<style lang="sass">

.fade-in-scale
  transform: scale(0.8)
  // opacity: 0
  animation: fade-in linear forwards
  animation-timeline: view()
  animation-range: 150px 600px

@keyframes fade-in
  from
    transform: scale(0.8)
    // opacity: 0
  to
    transform: scale(1)
    opacity: 1

body
  overflow-x: hidden

.slide-in-left
  transform: translateX(-500px)
  // opacity: 0
  animation: slide-left linear forwards
  animation-timeline: view()
  animation-range: 150px 600px

@keyframes slide-left
  from
    transform: translateX(-500px)
    // opacity: 0
  to
    transform: translateX(0)
    opacity: 1


.slide-in-right
  transform: translateX(500px)
  // opacity: 0
  animation: slide-right linear forwards
  animation-timeline: view()
  animation-range: 150px 600px

@keyframes slide-right
  from
    transform: translateX(500px)
    // opacity: 0
  to
    transform: translateX(0)
    opacity: 1

.fade-up
  transform: translateY(150px)
  // opacity: 0
  animation: fade-up ease-out forwards
  animation-timeline: view()
  animation-range: 150px 500px

@keyframes fade-up
  from
    transform: translateY(150px)
    // opacity: 0
  to
    transform: translateY(0)
    opacity: 1

.hover-scale:hover
  transform: scale(1.05)
  transition: transform 0.3s ease

.hero-image
  width: 100%
  height: 100vh
  object-fit: cover
  @media (max-width: 600px)
    height: 340px

.fullscreen-carousel
  margin: 0 !important
  padding: 0 !important

.q-carousel__slide
  padding: 0 !important

.q-carousel__navigation-inner
  padding-bottom: 20px

.q-carousel__arrow
  color: white
  font-size: 2rem

.side-image
  object-fit: cover
  width: 100%
  height: 100%

// #amenities-section
//   height: 110vh
// @media (max-width: 1024px)
//   #amenities-section
//     height: 100vh

.smaller-image
  width: 700px
  height: 100%
</style>
