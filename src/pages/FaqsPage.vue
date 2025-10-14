<template>
  <q-page>
    <!----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
    <q-parallax :src="parallax" :height="300" :speed="0.5"
      style="background-position: center 30% !important; background-size: cover !important">
      <div style="
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(34, 34, 34, 0.6);
        " class="text-white text-center column justify-center items-center q-pa-xl">
        <q-card-section>
          <div class="text-h3">Frequently Asked Questions</div>
          <br />
          <div class="text-body1 q-mb-lg">Everything about living at The-WEB</div>
        </q-card-section>
      </div>
    </q-parallax>

    <!-- Introduction Section -->
    <div style="height: 100%; background-color: #222" class="text-white q-pa-xl">
      <div class="constrain text-center">
        <div class="text-h4">What is The-WEB?</div>
        <div class="text-body1 q-mt-md">
          Inspired by the structure and elegance of East Asian minimalism Western Contemporary
          Architecture. <br />The-WEB weaves design, technology, and lifestyle into one iconic
          student hub. <br />
          We offer three elevated room types, from stylish screened studios to premium balcony units
          each designed to meet the needs of modern students who want more from their space. At The
          WEB, you’re not just renting a room. You’re stepping into a community, a rhythm, a future.
        </div>
      </div>
    </div>

    <div style="height: 60px; background-color: white"></div>

    <!-- Main FAQ Content -->
    <div class="q-pa-lg">
      <div class="row justify-around items-start full-height">
        <!-- Left Column -->
        <div class="col-md-5 col-12">

          <q-expansion-item label="User" header-class="text-h4 text-left q-pa-md" expand-icon-class="text-black"
            style="border: 1px solid #222; margin-top: 16px">
            <template v-slot:header>
              <div class="full-width">
                <div class="text-h5 text-left">How to Register/Login to your Account?</div>
              </div>
            </template>

            <div class="q-py-lg q-px-md text-left">
              <q-btn label="Download Register" color="black" icon="download" href="/files/Register.pdf"
                target="_blank" />
              <div style="margin-top: 16px" class="q-mb-md">
                <iframe title="Register" src="/files/Register.pdf" width="100%" height="250"
                  style="border: none"></iframe>
              </div>
              <q-btn label="Download Login" color="black" icon="download" href="/files/Login.pdf" target="_blank" />
              <div style="margin-top: 16px">
                <iframe title="Login" src="/files/Login.pdf" width="100%" height="250" style="border: none"></iframe>
              </div>
            </div>
          </q-expansion-item>

          <q-expansion-item label="Admission" header-class="text-h4 text-left q-pa-md" expand-icon-class="text-black"
            style="border: 1px solid #222; margin-top: 16px">
            <template v-slot:header>
              <div class="full-width">
                <div class="text-h5 text-left">Is there admission criteria?</div>
              </div>
            </template>
            <div class="q-py-lg q-px-md text-left">
              Only full-time students are accepted into The-WEB.
            </div>
          </q-expansion-item>

          <q-expansion-item label="Admission" header-class="text-h4 text-left q-pa-md" expand-icon-class="text-black"
            style="border: 1px solid #222; margin-top: 16px">
            <template v-slot:header>
              <div class="full-width">
                <div class="text-h5 text-left">Can I choose my roommate?</div>
              </div>
            </template>
            <div class="q-py-lg q-px-md text-left">
              Yes, by checking the Access key option, you can share the unit with that person.
            </div>
          </q-expansion-item>

          <q-expansion-item label="Rooms" header-class="text-h4 text-left q-pa-md" expand-icon-class="text-black"
            style="border: 1px solid #222; margin-top: 16px">
            <template v-slot:header>
              <div class="full-width">
                <div class="text-h5 text-left">Is the WiFi free?</div>
              </div>
            </template>
            <div class="q-py-lg q-px-md text-left">
              Yes, high-speed WiFi is included in your rent.
            </div>
          </q-expansion-item>

          <!-- <q-expansion-item label="Rooms" header-class="text-h4 text-left q-pa-md" expand-icon-class="text-black"
            style="border: 1px solid #222; margin-top: 16px">
            <template v-slot:header>
              <div class="full-width">
                <div class="text-h5 text-left">Are the rooms serviced?</div>
              </div>
            </template>
            <div class="q-py-lg q-px-md text-left">
              Yes, cleaning and maintenance services are provided weekly.
            </div>
          </q-expansion-item> -->

          <q-expansion-item label="PrivacyPolicy" header-class="text-h4 text-left q-pa-md" expand-icon-class="text-black"
            style="border: 1px solid #222; margin-top: 16px">
            <template v-slot:header>
              <div class="full-width">
                <div class="text-h5 text-left">Privacy Policy</div>
              </div>
            </template>
            <div class="q-py-lg q-px-md text-left">
              To review our Privacy Policy, please click the link below to download the document.

              <!-- <q-btn label="Download Application" color="black" icon="download" href="/files/PrivacyPolicy.pdf" target="_blank"
                class="q-my-md" />

              <iframe title="Apply" src="/files/PrivacyPolicy.pdf" width="100%" height="250" style="border: none"></iframe> -->

              <p class="q-my-md text-weight-bold text-body1">
                <a href="/files/PrivacyPolicy.pdf" target="_blank" class=" text-primary" style="text-decoration: underline;">
                  Download Privacy Policy
                </a>
              </p>

              <iframe title="Apply" src="/files/PrivacyPolicy.pdf" width="100%" height="250" style="border: none"></iframe>
            </div>
          </q-expansion-item>

          <q-expansion-item label="Disclaimer" header-class="text-h4 text-left q-pa-md" expand-icon-class="text-black"
            style="border: 1px solid #222; margin-top: 16px">
            <template v-slot:header>
              <div class="full-width">
                <div class="text-h5 text-left">Disclaimer</div>
              </div>
            </template>
            <div class="q-py-lg q-px-md text-left">
              To review our Disclaimer, please click the link below to download the document.

              <!-- <q-btn label="Download Application" color="black" icon="download" href="/files/PrivacyPolicy.pdf" target="_blank"
                class="q-my-md" />

              <iframe title="Apply" src="/files/PrivacyPolicy.pdf" width="100%" height="250" style="border: none"></iframe> -->

              <p class="q-my-md text-weight-bold text-body1">
                <a href="/files/Disclaimer.pdf" target="_blank" class=" text-primary" style="text-decoration: underline;">
                  Download Privacy Policy
                </a>
              </p>

              <iframe title="Apply" src="/files/Disclaimer.pdf" width="100%" height="250" style="border: none"></iframe>
            </div>
          </q-expansion-item>
        </div>

        <!-- Right Column -->
        <div class="col-md-5 col-12">

          <!-- <q-expansion-item label="User" header-class="text-h4 text-left q-pa-md" expand-icon-class="text-black"
            style="border: 1px solid #222">
            <template v-slot:header>
              <div class="full-width row items-center">
                <div class="text-h5 text-left">How to Login into your account ?</div>
              </div>
            </template>
            <div class="q-py-lg q-px-md text-left">
              <q-btn label="Download Login" color="black" icon="download" href="/files/Login.pdf" target="_blank" />
              <div style="margin-top: 16px">
                <iframe title="Login" src="/files/Login.pdf" width="100%" height="250" style="border: none"></iframe>
              </div>
            </div>
          </q-expansion-item> -->

          <q-expansion-item label="How to Apply" header-class="text-h4 text-left q-pa-md" expand-icon-class="text-black"
            style="border: 1px solid #222; margin-top: 16px">
            <template v-slot:header>
              <div class="full-width">
                <div class="text-h5 text-left">How to Apply?</div>
              </div>
            </template>

            <div class="q-py-lg q-px-md text-left">
              <p class="text-h6 q-mb-md">
                Follow these simple steps to apply for The-WEB Student Accommodation:
              </p>

              <ol class="text-body1 q-mb-md">
                <li>
                  <b>Complete Application:</b> Fill in the application form. Returning students and first-time
                  applicants must
                  all apply. If applying with a preferred flatmate, coordinate your submissions.
                </li>
                <li>
                  <b>Application Fee:</b> A non refundable payment of R1200 is required.
                </li>
                <li>
                  <b>Make Payment:</b> Early payment improves your reservation position. Include the R400 parking fee if
                  required.
                </li>
                <li>
                  <b>Sign Lease Agreement:</b> Complete the online lease once your application and payment are
                  processed.
                </li>
                <li>
                  <b>Placement:</b> Placement is first come, first served based on application date, payment, and lease
                  submission. Preference is given to returning students and SU students.
                </li>
                <li>
                  <b>Cancellation:</b> Submit in writing via the official Withdrawal Form. Refunds are subject to
                  policy.
                </li>
              </ol>

              <!-- <q-btn label="Download Application" color="black" icon="download" href="/files/Apply.pdf" target="_blank"
                class="q-mb-md" /> -->

              <p class="q-my-md text-weight-bold text-body1">
                <a href="/files/Apply.pdf" target="_blank" class=" text-primary" style="text-decoration: underline;">
                  Download Application Form
                </a>
              </p>

              <iframe title="Apply" src="/files/Apply.pdf" width="100%" height="250" style="border: none"></iframe>
            </div>
          </q-expansion-item>

          <q-expansion-item label="Rooms" header-class="text-h4 text-left q-pa-md" expand-icon-class="text-black"
            style="border: 1px solid #222; margin-top: 16px">
            <template v-slot:header>
              <div class="full-width">
                <div class="text-h5 text-left">Can I choose my room?</div>
              </div>
            </template>
            <div class="q-py-lg q-px-md text-left">
              You can choose your room based on the availability and unit plan.
            </div>
          </q-expansion-item>

          <q-expansion-item label="Rooms" header-class="text-h4 text-left q-pa-md" expand-icon-class="text-black"
            style="border: 1px solid #222; margin-top: 16px">
            <template v-slot:header>
              <div class="full-width">
                <div class="text-h5 text-left">Are there pictures of the rooms?</div>
              </div>
            </template>
            <div class="q-py-lg q-px-md text-left">
              Yes, each unit type has photos in the "Unit Details" section.
            </div>
          </q-expansion-item>

          <q-expansion-item label="Rooms" header-class="text-h4 text-left q-pa-md" expand-icon-class="text-black"
            style="border: 1px solid #222; margin-top: 16px">
            <template v-slot:header>
              <div class="full-width">
                <div class="text-h5 text-left">Are there house rules?</div>
              </div>
            </template>
            <div class="q-py-lg q-px-md text-left">
              Yes, quiet hours and guest policies are outlined in your lease agreement.
            </div>
          </q-expansion-item>

          <q-expansion-item label="Terms&Conditions" header-class="text-h4 text-left q-pa-md" expand-icon-class="text-black"
            style="border: 1px solid #222; margin-top: 16px">
            <template v-slot:header>
              <div class="full-width">
                <div class="text-h5 text-left">Terms & Conditions</div>
              </div>
            </template>
            <div class="q-py-lg q-px-md text-left">
              To review our Terms & Conditions, please click the link below to download the document.

              <p class="q-my-md text-weight-bold text-body1">
                <a href="/files/Terms&Conditions.pdf" target="_blank" class=" text-primary" style="text-decoration: underline;">
                  Download Terms & Conditions
                </a>
              </p>

              <iframe title="Apply" src="/files/Terms&Conditions.pdf" width="100%" height="250" style="border: none"></iframe>
            </div>
          </q-expansion-item>

          <q-expansion-item label="CodeOfConduct" header-class="text-h4 text-left q-pa-md" expand-icon-class="text-black"
            style="border: 1px solid #222; margin-top: 16px">
            <template v-slot:header>
              <div class="full-width">
                <div class="text-h5 text-left">Code of Conduct</div>
              </div>
            </template>
            <div class="q-py-lg q-px-md text-left">
              To review our Code of Conduct, please click the link below to download the document.

              <p class="q-my-md text-weight-bold text-body1">
                <a href="/files/CodeOfConduct.pdf" target="_blank" class=" text-primary" style="text-decoration: underline;">
                  Download Code of Conduct
                </a>
              </p>

              <iframe title="Apply" src="/files/CodeOfConduct.pdf" width="100%" height="250" style="border: none"></iframe>
            </div>
          </q-expansion-item>
        </div>
      </div>
    </div>

    <div style="height: 60px; background-color: white"></div>
  </q-page>
</template>

<script>
import home2 from 'src/assets/resources/home/slider/2.png';

export default {
  data() {
    return {
      currentSlide: 1,
      parallax: home2,
      // faqHeroCards: [
      //   { _id: 1, imageUrl: home1 },
      //   { _id: 2, imageUrl: home2 },
      //   { _id: 3, imageUrl: home3 },
      //   { _id: 4, imageUrl: home4 }
      // ]
    }
  },
}
</script>

<style scoped>
.constrain {
  max-width: 1200px;
  margin: 0 auto;
}

.text-h5 {
  font-size: 1.25rem;
  font-weight: 500;
}

.text-h6 {
  font-size: 1.1rem;
  font-weight: 500;
}

.q-card {
  border-radius: 8px;
}
</style>
