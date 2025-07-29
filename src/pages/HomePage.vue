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
    <div style="height: 100%;">
      <div flat class="
        bg-black
        text-white
        row justify-between
        q-pa-lg
        ">
        <q-card-section class="text-h4">Ready for Move-in, 2026</q-card-section>
        <q-card-section>
          <CustomButton color="white" text-color="black" label="Visit the Unit Rental List" @click="openUnitDash"
            style="border: 2px solid black;" />
        </q-card-section>
      </div>
    </div>

    <div style="height: 100%; background-color: #222;" class="text-white row justify-between q-pa-lg">
      <q-card-section>
        <div class="text-h4 q-mb-md">Welcome to The Web - 1 Old Helshoogte Road, Idas Valley, Stellenbosch, 7600</div>
        <div>Discover a first-of-its-kind student residence nestled between the Banhoek and Simonsberg Mountains.</div>
      </q-card-section>
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
          <!-- <div class="text-white"><b></b></div> -->
          <div class="text-h3 q-mb-md">The Web - A Place to Live, Learn & Belong</div>
          <div>Imagine a fully furnished, premium student residence with:</div>
          <ul class="q-mb-lg" style="list-style-type: none; padding-left: 0; line-height: 2;">
            <li><span class="q-mr-sm">✔️</span> Secure 24-hour access in a gated setting</li>
            <li><span class="q-mr-sm">✔️</span> Modern finishes throughout</li>
            <li><span class="q-mr-sm">✔️</span> Carefully screened shared rooms offering semi-private comfort</li>
            <li><span class="q-mr-sm">✔️</span> Flexible options ranging from single to duo suites with elegant
              Soji-style screens</li>
            <li><span class="q-mr-sm">✔️</span> Communal spaces for collaboration, study, and socialising</li>
            <li><span class="q-mr-sm">✔️</span> A stunning fourth-floor rooftop deck designed for socialising,
              entertainment, and braais — complete with 360-degree panoramic views of the Banhoek and Simonsberg
              mountain ranges</li>
            <li><span class="q-mr-sm">✔️</span> Proximity to Stellenbosch University, shopping, cafés, and scenic trails
            </li>
          </ul>
          <!-- <CustomButton v-if="$q.screen.gt.sm" customStyle="width: 25%" color="white" text-color="black" label="Make an Enquiry" @click="scrollToSection('contact-section')" />
          <CustomButton v-else color="white" text-color="black"  customStyle="width: 100%" label="Make an Enquiry" @click="scrollToSection('contact-section')" /> -->
        </q-card-section>
      </q-card>
      <div class="col-md-5 col-12 slide-in-right">
        <q-img src="~src/assets/resources/home/slider/3.jpg" alt="hero image" class="side-image" />
      </div>
    </div>

    <!-- -----------------------------------------------------------------------------------------------------------------------------------------------  -->
    <!-- images -->

    <div id="images-section" style="margin: 4%; margin-top: 0;" class="bg-grey">
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
          <div class="text-h4">A New Landmark with Deep Roots</div>
        </q-card-section>
        <q-card-section class="">
          <div class="col-md-6">
            Located on a historic farm landscape granted in 1683 and honoured as a Grade I heritage area since 1976,
            Idas Valley is steeped in stories of early French Huguenot pioneers, Cape Dutch architecture, and
            generations of local communities.
          </div>
          <div class="col-md-6">
            From the original homesteads built by Samuel Johannes Cats in the late 1700s to the surrounding werf
            complexes at Rustenburg and Ida Minor , this valley has preserved its authentic charm and continues to
            inspire collective heritage conservation.
          </div>
          <div class="col-md-6">
            Today, Idas Valley is more than history — it’s a vibrant, tight-knit community shaped by local culture,
            schools, artisans, and the natural landscape under shared custodianship.
          </div>
        </q-card-section>
        <br>
        <q-card-section>
          <div class="text-h4">A Life Surrounded by Heritage & Nature</div>
        </q-card-section>
        <q-card-section>
          Wake up to mountain vistas and the valley’s legacy of Cape Dutch architecture <br>
          Take breaks exploring local hiking, e‑bike, and trail routes in the Idas Valley Nature Area <br>
          Connect with a dynamic community deeply rooted in culture, craftsmanship, and heritage <br>
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
          <div class="text-h3 q-mb-md">Why The Web Stands Out</div>

          <ul class="q-mb-lg" style="list-style-type: none; padding-left: 0; line-height: 2;">
            <li><span class="q-mr-sm">✔️</span> Heritage-infused location: Built upon centuries of protected heritage and evolving local narratives</li>
            <li><span class="q-mr-sm">✔️</span> Contemporary design: Stunning finishes, smart layouts, and curated privacy solutions</li>
            <li><span class="q-mr-sm">✔️</span> Community connection: Shape your journey in a neighbourhood that thrives on collaboration and legacy</li>
            <li><span class="q-mr-sm">✔️</span> Lifestyle integration: Seamless access to university, nature, culture, and essential services</li>
          </ul>
        </q-card-section>
      </q-card>
      <div class="col-md-5 col-12 row justify-center slide-in-right">
        <q-img src="~src/assets/resources/home/slider/4.jpg" class="side-image" />
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

      <br><br>
      <q-card flat class="bg-transparent text-white row justify-center">
        <l-map :zoom="15" :center="[ -33.92599, 18.89250 ]" style="height: 700px; width: 100%;">
          <l-tile-layer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          <l-marker :lat-lng="[ -33.92099, 18.89850 ]">
            <l-popup>The Web</l-popup>
          </l-marker>

          <l-marker :lat-lng="[ -33.93410, 18.87510 ]">
            <l-popup>BUCO Hardware</l-popup>
          </l-marker>

          <l-marker :lat-lng="[ -33.93080, 18.88020 ]">
            <l-popup>PEP Home Thohoyandou Sanlam</l-popup>
          </l-marker>


          <!-- <l-marker :lat-lng="[ -33.93278, 18.86417 ]">
            <l-popup>Stellenbosch University</l-popup>
          </l-marker>

          <l-marker :lat-lng="[ -33.93500, 18.86150 ]">
            <l-popup>Pick n Pay (Bird St)</l-popup>
          </l-marker> -->
        </l-map>

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
import 'leaflet/dist/leaflet.css';
import {
  LMap,
  LTileLayer,
  LMarker,
  LPopup
} from '@vue-leaflet/vue-leaflet';



import MaintenanceBanner from 'src/components/elements/MaintenanceBanner.vue';
import CustomButton from 'src/components/elements/CustomButton.vue';
import EmailService from 'src/services/EmailService';
import Helper from 'src/services/utils'

// interior carousel images
// import Room1 from 'src/assets/resources/home/images/Room_1.jpg';
// import Room2 from 'src/assets/resources/home/images/Room_2.jpg';
// import Room3 from 'src/assets/resources/home/images/Room_3.jpg';
// import Room8 from 'src/assets/resources/home/images/Room_8.jpg';
// import Room9 from 'src/assets/resources/home/images/Room_9.jpg';
// import Room10 from 'src/assets/resources/home/images/Room_10.jpg';
// import Room11 from 'src/assets/resources/home/images/Room_11.jpg';
// import Room12 from 'src/assets/resources/home/images/Room_12.jpg';
// import Bathroom from 'src/assets/resources/home/images/Bathroom.jpg';

import g1 from 'src/assets/resources/home/gallery/g1.jpg';
import g5 from 'src/assets/resources/home/gallery/g5.jpg';
import g8 from 'src/assets/resources/home/gallery/g8.jpg';
import g9 from 'src/assets/resources/home/gallery/g9.jpg';
import g10 from 'src/assets/resources/home/gallery/g10.jpg';
import g11 from 'src/assets/resources/home/gallery/g11.jpg';
import g13 from 'src/assets/resources/home/gallery/g13.jpg';
import g14 from 'src/assets/resources/home/gallery/g14.jpg';
import g15 from 'src/assets/resources/home/gallery/g15.jpg';
import g17 from 'src/assets/resources/home/gallery/g17.jpg';
import g18 from 'src/assets/resources/home/gallery/g18.jpg';
import g19 from 'src/assets/resources/home/gallery/g19.jpg';
import g20 from 'src/assets/resources/home/gallery/g20.jpg';
import g22 from 'src/assets/resources/home/gallery/g22.jpg';
import g21 from 'src/assets/resources/home/gallery/g21.jpg';

// hero carousel images
import home1 from 'src/assets/resources/home/slider/1.jpg';
import home2 from 'src/assets/resources/home/slider/2.jpg';
import home3 from 'src/assets/resources/home/slider/3.jpg';
import home4 from 'src/assets/resources/home/slider/4.jpg';

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
      // unitCards: [
      //   { _id: 1, imageUrl: Room1 },
      //   { _id: 2, imageUrl: Room2 },
      //   { _id: 3, imageUrl: Room3 },
      //   { _id: 4, imageUrl: Room8 },
      //   { _id: 5, imageUrl: Room9 },
      //   { _id: 6, imageUrl: Room10 },
      //   { _id: 7, imageUrl: Room11 },
      //   { _id: 8, imageUrl: Room12 },
      //   { _id: 9, imageUrl: Bathroom },
      // ],
      unitCards: [
        { _id: 2, imageUrl: g5 },
        // { _id: 1, imageUrl: g1 },

        // { _id: 3, imageUrl: g8 },
        // { _id: 4, imageUrl: g9 },
        { _id: 5, imageUrl: g10 },
        // { _id: 6, imageUrl: g11 },
        { _id: 7, imageUrl: g13 },
        { _id: 8, imageUrl: g14 },
        // { _id: 9, imageUrl: g15 },
        { _id: 10, imageUrl: g17 },
        { _id: 11, imageUrl: g18 },
        { _id: 12, imageUrl: g19 },
        { _id: 13, imageUrl: g20 },
        // { _id: 14, imageUrl: g22 },
        { _id: 15, imageUrl: g21 },
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
    MaintenanceBanner,
    LMap,
    LTileLayer,
    LMarker,
    LPopup

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
