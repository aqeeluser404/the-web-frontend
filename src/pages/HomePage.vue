<template>
  <q-page>
    <!-- hero -->
    <div style="height: 100vh;" class="bg-grey">
       <q-img src="~src/assets/resources/home/hero/Location2.png" alt="hero image" class="hero-image" />
    </div>

    <!-- hero - BANNER -->
    <div style="height: 100%;">
      <div flat class="
        bg-transparent
        bg-brown
        text-white
        row justify-between
        q-pa-lg
        "
      >
        <q-card-section class="text-h4">Attention Students! Looking to rent in 2025?</q-card-section>
        <q-card-section>
          <CustomButton color="brown" text-color="white" label="Visit the Unit Rental List" @click="openUnitDash" style="border: 2px solid white;" />
        </q-card-section>
      </div>
    </div>

    <!-- -----------------------------------------------------------------------------------------------------------------------------------------------  -->
    <!-- amenities -->
    <div id="amenities-section" class="row justify-between" style="height: 100%; background-color: #333;">
      <q-card flat class="
        bg-transparent
        text-white
        text-body1
        q-pa-lg
        col-md-7 col-12
        column flex-center
        "
      >
        <q-card-section>
          <div class="text-brown"><b>Feature Rich</b></div>
          <div class="text-h3 q-mb-md">World-Class Amenities</div>
          <div>Designed around the needs of its residents, The Web strikes the perfect balance between lifestyle and academic amenities.</div>
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
          <CustomButton v-if="$q.screen.gt.sm" customStyle="width: 25%" color="brown" text-color="white" label="Make an Enquiry" @click="scrollToSection('contact-section')" />
          <CustomButton v-else color="brown" customStyle="width: 100%" text-color="white" label="Make an Enquiry" @click="scrollToSection('contact-section')" />
        </q-card-section>
      </q-card>
      <div class="col-md-5 col-12">
        <q-img src="~src/assets/resources/home/amenities/About2.png" alt="hero image" class="side-image"/>
      </div>
    </div>

    <!-- -----------------------------------------------------------------------------------------------------------------------------------------------  -->
    <!-- images -->
    <div id="images-section" style="height: 100%; background-color: #333;">
      <q-list class="row justify-around">
        <div class="bg-transparent col-md-4 col-12" flat v-for="card in cards" :key="card._id">
          <q-img :src="card.imageUrl" :alt="card.title" />
        </div>
      </q-list>
    </div>

    <!-- -----------------------------------------------------------------------------------------------------------------------------------------------  -->
    <!-- academics -->
    <div id="academics-section" style="height: 100%;" class="row justify-between">
      <div class="col-md-5 col-12 row justify-center">
        <q-img src="~src/assets/resources/home/academics/Students.png" alt="hero image" class="side-image"/>
      </div>

      <q-card flat class="
        bg-transparent
        text-body1
        q-pa-lg
        col-md-7 col-12
        column flex-center
        "
      >
        <q-card-section>
          <div class="text-brown"><b>Space to Thrive</b></div>
          <div class="text-h3 q-mb-md">Academic Excellence</div>
          <div>At the heart of this purpose-built student development is an environment that facilitates both private and collaborative studying. The Web has it all, from an expansive study centre with tailor-made solo study pods, and multi-purpose boardrooms for group work, these facilities are geared for the demanding needs of future business and thought leaders.</div>
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
          <CustomButton v-if="$q.screen.gt.sm" color="brown" text-color="white" customStyle="width: 25%" label="Rent in 2025" @click="openUnitDash" />
          <CustomButton v-else color="brown" text-color="white" customStyle="width: 100%" label="Rent in 2025" @click="openUnitDash" />
        </q-card-section>
      </q-card>
    </div>

    <!-- academics - section 2 -->
    <div style="height: 100%; background-color: #333;">
      <q-card flat class="bg-transparent text-white text-body1 text-left q-pa-lg">

        <q-card-section class="row">
          <div class="text-h3 q-mb-xl">Enhancing a Quaint Suburb of Stellenbosch</div>
          <div>
            Paramount to The Web's vision, is to ultimately enhance this quaint suburb by making it more pedestrian-friendly and in doing so, create a café culture atmosphere along its beautiful tree-lined streets.
            <br>In a Stellenbosch first, over R35 million has been raised and earmarked by a group of developers in the area to build towards this vision and amplify the suburb, as well as improve its accessibility to campus. The funds will be allocated to 11 projects that range from major security enhancements, to local area infrastructure upgrades for all who reside in the area.
            <br><br>This desirable location, well on its way becoming the next Stellies student hub, has likeminded developers already taking advantage of The Web's entrance into the area by purchasing existing houses in the precinct for further student development.
          </div>
        </q-card-section>

        <q-card-section class="row">
          <q-img src="~src/assets/resources/home/academics/Home1.png" />
        </q-card-section>
      </q-card>
    </div>

    <!-- academics - section 3 -->
    <div class="row justify-between" style="height: 100%;">
      <q-card flat class="
        bg-transparent
        text-body1
        q-pa-lg
        col-md-7 col-12
        column flex-center
        "
      >
        <q-card-section>
          <div class="text-brown"><b>Perfectly Position</b></div>
          <div class="text-h3 q-mb-md">The Jewel in the Stellenbosch Crown</div>
          <div class="q-mb-md">
            Nestled in a desirable pocket of Stellenbosch and a mere 750m from the University, The Web is perfectly poised to become an instant hit with students and one of Stellenbosch’s most sought-after new developments.
          </div>
          <div class="q-mb-lg">
            With Stellenbosch’s student population rapidly growing over the past decade, The Web is set to become the ultimate choice for students seeking quality and convenience in their home away from home.
          </div>
          <CustomButton v-if="$q.screen.gt.sm" color="brown" text-color="white" customStyle="width: 25%" label="Secure your spot"  @click="openUnitDash" />
          <CustomButton v-else color="brown" text-color="white" customStyle="width: 100%" label="Secure your spot" @click="openUnitDash" />
        </q-card-section>
      </q-card>
      <div class="col-md-5 col-12 row justify-center">
        <q-img src="~src/assets/resources/home/academics/Happy-Students.png" class="side-image"/>
      </div>
    </div>

    <!-- academics - section 4 -->
    <div class="row justify-between" style="height: 100%; background-color: #333;">
      <div class="col-md-5 col-12">
        <q-img src="~src/assets/resources/home/academics/Residential.png" class="side-image"/>
      </div>
      <q-card flat style="" class="
        bg-transparent
        text-white
        text-body1
        q-pa-lg
        col-md-7 col-12
        column flex-center
        "
      >
        <q-card-section>
          <div class="text-brown"><b>Rent in A</b></div>
          <div class="text-h3 q-mb-md">Residential College</div>
          <div>A residential college is a private residence which is aligned with the academic and support functions of the university and serves to holistically support the student towards personal and academic achievement.</div>
        </q-card-section>
      </q-card>
    </div>

    <!-- academics - section 5 -->
    <div class="q-pa-xl" style="height: 100%; background-color: #222;">
      <q-card flat class="bg-transparent text-white text-body1 text-center constrain">
        <q-card-section>
          <div class="text-h4">The Web's Amenities Foster an Environment Ideal for Academic Success</div>
        </q-card-section>
        <q-card-section class="">
          <div class="col-md-6">
            The academic advisor of The Web is a former senior director of the Division for Student Affairs of Stellenbosch University. Residents of The Web will be encouraged to participate in organised student programmes offered by The Web and the various tertiary institutions they attend, such as well-being programmes, leadership training, mentoring programmes, and social events.
          </div>
          <div class="col-md-6">
            The Web is designed in collaboration with top academic experts to give your child the highest possibility of academic success. Cooperation between the tertiary institutions in Stellenbosch and The Web to the benefit of the students who will take up residence at The Web is possible.
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- academics - BANNER -->
    <div style="height: 100%;">
      <div flat class="
        bg-transparent
        bg-brown
        text-white
        row justify-between
        q-pa-lg
        "
      >
        <q-card-section class="text-h4">Need more answers? Read our FAQs</q-card-section>
        <q-card-section>
          <CustomButton color="brown" text-color="white" label="View FAQs" to="/frequently-asked-questions" style="border: 2px solid white;" />
        </q-card-section>
      </div>
    </div>

    <!-- -----------------------------------------------------------------------------------------------------------------------------------------------  -->
    <!-- units card -->
    <div id="units-section" class="q-py-xl" style="height: 100%; background-color: #222;">
      <q-card-section>
        <div class="text-h4 text-center text-white">Unit Specifications</div>
      </q-card-section>
      <q-list class="row justify-center q-pa-sm">
        <q-card class="q-pa-md bg-transparent col-md-3 col-12" flat v-for="unitType in unitTypes" :key="unitType._id">
          <q-img class="" :src="unitType.imageUrl" />
          <div class="text-white text-center text-h6">{{ unitType.label }}</div>
        </q-card>
      </q-list>
    </div>

    <!-- units card - section 2 -->
    <div class="row justify-between" style="height: 100%;">
      <div class="col-md-6 col-12 row justify-center">
        <q-img src="~src/assets/resources/home/unit-types/7.png" class="side-image"/>
      </div>
      <q-card flat class="
        bg-transparent
        text-body1
        q-pa-lg
        col-md-6 col-12
        column flex-center
        "
      >
        <q-card-section>
          <div class="text-brown"><b>Living Spaces</b></div>
          <div class="text-h3 q-mb-md">Expertly Designed</div>
          <div class="q-mb-lg">Architects Boogertman & Partners have spent countless hours configuring each of the living spaces at The Web. Ergonomically designed units all feature a kitchenette, private bathroom, study desk, and open-plan living spaces with premium fittings and fixtures.</div>
          <CustomButton v-if="$q.screen.gt.sm" color="brown" text-color="white" customStyle="width: 25%" label="Make an enquiry" @click="scrollToSection('contact-section')" />
          <CustomButton v-else color="brown" text-color="white" customStyle="width: 100%" label="Make an enquiry" @click="scrollToSection('contact-section')" />
        </q-card-section>
      </q-card>
    </div>

    <!-- -----------------------------------------------------------------------------------------------------------------------------------------------  -->
    <!-- contact card -->
    <div id="contact-section" style="height: 100%; background-color: #333;" class="q-pa-xl">

      <q-card flat class="bg-transparent text-white row justify-center constrain">

        <q-card-section class="col-md-6 col-12">
          <div class="text-h4 q-mb-md">Discuss with Our Team</div>

          <div class="text-body2 q-mb-md">Founder and Managing Director</div>
          <div class="text-body1 q-mb-md"><b>Wayne Louw</b></div>

          <div class="column">
            <a href="mailto:admin@the-web.co.za" class="q-mb-md" style="text-decoration: underline; color: white;">
              <q-icon name="eva-email-outline" class="q-mr-sm" /> admin@the-web.co.za
            </a>

            <a href="tel:0823433945" class="q-mb-md" style="text-decoration: underline; color: white;">
              <q-icon name="eva-phone-outline" class="q-mr-sm" /> (+27) 82-343-3945
            </a>

            <a href="https://api.whatsapp.com/send/?phone=0828205342&text&type=phone_number&app_absent=0" style="text-decoration: underline; color: white;">
              <q-icon name="eva-message-circle-outline" class="q-mr-sm" /> Send WhatsApp
            </a>
          </div>
        </q-card-section>

        <q-card-section class="col-md-6 col-12 bg-transparent">
          <div class="text-h4 q-mb-md">Contact Us</div>

          <div class="">
            <q-form @submit="submitContactForm" style="width: 100%;">
              <q-input filled label-color=white color="brown" v-model="userContact.firstName" label="Your Name" stack-label class="q-mb-md " required
              style="border: 1px solid white;" input-style="color: white;" />
              <q-input filled label-color=white color="brown" v-model="userContact.email" label="Your Email" stack-label class="q-mb-md" required
              style="border: 1px solid white;" input-style="color: white;" />
              <q-input filled label-color=white color="brown" v-model="message" label="Message" type="textarea" stack-label class="q-mb-md" required
              style="border: 1px solid white;" input-style="color: white;"  />
              <div class="row justify-between flex-center">
                <label>
                  <input type="checkbox" name="privacyPolicy" value="agree" required class="q-mr-sm">
                  By submitting your data, you agree to our <span class="text-brown"><b>privacy policy</b></span>
                </label>
                <CustomButton v-if="$q.screen.gt.sm" type="submit" label="Send Message" color="brown" text-color="white" customStyle="width: 30%" />
                <CustomButton v-else type="submit" label="Send Message" class="q-mt-md" color="brown" text-color="white" customStyle="width: 100%" />
              </div>
            </q-form>
        </div>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import CustomButton from 'src/components/elements/CustomButton.vue';
import EmailService from 'src/services/EmailService';
import Helper from 'src/services/utils'

import Room1 from 'src/assets/resources/home/images/Room_1.jpg';
import Room2 from 'src/assets/resources/home/images/Room_2.jpg';
import Room3 from 'src/assets/resources/home/images/Room_3.jpg';
import Room8 from 'src/assets/resources/home/images/Room_8.jpg';
import Room9 from 'src/assets/resources/home/images/Room_9.jpg';
import Room10 from 'src/assets/resources/home/images/Room_10.jpg';
import Room11 from 'src/assets/resources/home/images/Room_11.jpg';
import Room12 from 'src/assets/resources/home/images/Room_12.jpg';
import Bathroom from 'src/assets/resources/home/images/Bathroom.jpg';

import StudioPatio from 'src/assets/resources/home/unit-types/B-StudioBalcony-768x689.png';
import StudioBalconyB from 'src/assets/resources/home/unit-types/B3-Studio-768x689.png';
import StudioPatioB from 'src/assets/resources/home/unit-types/B4-StudioBalcony-768x689.png';
import StudioBal from 'src/assets/resources/home/unit-types/D-StudioBalcony-768x689.png';
import Deluxe from 'src/assets/resources/home/unit-types/Deluxe-768x689.png';
import StudioPatioC from 'src/assets/resources/home/unit-types/C-StudioPatio-768x689.png';
import SharedStudio from 'src/assets/resources/home/unit-types/E-Shared-768x689.png';
import TwoBed from 'src/assets/resources/home/unit-types/F-2-Bed-768x689.png';


export default {
  name: 'Homepage',

  data() {
    return {
      cards: [
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
      }, message: ''
    }
  },
  components: {
    CustomButton
  },

  methods: {
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
  }
}
</script>

<style lang="sass">
.hero-image
  width: 100%
  height: 100vh
  object-fit: cover
  @media (max-width: 1024px)

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
