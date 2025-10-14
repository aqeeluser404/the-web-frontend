<template>
  <q-page>
    <!----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
    <q-parallax :src="parallax" :height="300" :speed="0.5"
      style="background-position: center 30% !important; background-size: cover !important;">
      <div style="
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(34, 34, 34, 0.6);
        " class="text-white text-center column justify-center items-center q-pa-xl">
        <q-card-section>
          <div class="text-h3">Applications</div>
          <br>
          <div class="text-body1 q-mb-lg">

          </div>
        </q-card-section>
      </div>
    </q-parallax>



    <!-- <h4 class="application_heading text-center text-h5">
      The-WEB Student Accommodation Application Guide
    </h4> -->



    <!-- Introduction Section -->
    <div style="height: 100%; background-color: #222" class="text-white q-pa-xl">
      <div class="constrain text-center">
        <div class="text-h4">The-WEB Student Accommodation Application Guide</div>
      </div>
    </div>
    <div style="height: 60px; background-color: white"></div>

    <div class="constrain">
      <q-expansion-item class="bordered-expansion q-mb-md q-pa-sm bg-grey-3">
        <template v-slot:header>
          <q-item-section avatar>
            <div class="circle bg-dark">1</div>
          </q-item-section>

          <q-item-section class="text-h6"> Complete Application </q-item-section>
        </template>

        <q-card>
          <q-card-section>
            <ul>
              <li>Please read this document carefully.</li>
              <li>
                Please note that ALL students must complete the application form, first time
                applicants and returning students.
              </li>
              <li>
                If you are applying for shared accommodation and have a preferred flat mate, they
                must preferably apply on the same date. Please ensure to use the access key.
              </li>
              <li>
                Tick the box for parking if you require parking.
              </li>
            </ul>
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item class="bordered-expansion q-mb-md q-pa-sm bg-grey-3">
        <template v-slot:header>
          <q-item-section avatar>
            <div class="circle bg-dark">2</div>
          </q-item-section>

          <q-item-section class="text-h6"> Make Payments </q-item-section>
        </template>

        <q-card>
          <q-card-section>
            <ul>
              <li>
                We are often over-subscribed and early payment improves the applicant’s position on
                the reservation list.
              </li>
              <li>
                If you have requested parking, the R400 parking fee is included in your monthly payment that would be
                due.
              </li>
            </ul>
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item class="bordered-expansion q-mb-md q-pa-sm bg-grey-3">
        <template v-slot:header>
          <q-item-section avatar>
            <div class="circle bg-dark">3</div>
          </q-item-section>

          <q-item-section class="text-h6"> Single Lease Agreement </q-item-section>
        </template>

        <q-card>
          <q-card-section>
            <ul>
              <li>Sign the on-line lease agreement</li>
              <!-- <li>
                This can be done once our team has linked your on-line application to your payment
                and the The Web system has sent you an e-mail with the link, username, and password
                which you require to access the portal featuring the lease agreement waiting to be
                signed. There is no need for an electronic signature, simply ‘tick’ the applicable
                block to agree to the terms and conditions of the lease. You will need to select the
                correct option from the three offered. In all three cases, the parent or guardian
                binds him or herself as guarantor to the lessee (student). It is possible for a
                parent or guardian to sign on behalf of the lessee (option 3). Where the lessee is a
                minor, the signature of the parent or guardian (on behalf of the lessee) is required
                (option 2). You will receive confirmation that the lease has been correctly received
                via e-mail.
              </li> -->
              <li>
                The completed application form and first payment will secure
                your place on the Reservation List. Please note that it does guarantee
                placement.
              </li>
            </ul>
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <!-- <div class="row q-col-gutter-md q-mb-md">
        <div class="col-12 col-sm-6">
          <div class="bordered-expansion bg-grey-3 q-pa-md fit">
            <p class="application_subheading text-h6">Bank Details</p>
            <p><span class="text-weight-bold">Bank: </span>ABSA</p>
            <p><span class="text-weight-bold">Branch Code: </span>632005</p>
            <p>
              <span class="text-weight-bold">Account Name: </span>The Web Student Accommodation
              (PTY) LTD
            </p>
            <p><span class="text-weight-bold">Account Number: </span>409 210 0707</p>
            <p><span class="text-weight-bold">References: </span>STUDENT'S NAME & SURNAME</p>
          </div>
        </div>

        <div class="col-12 col-sm-6">
          <div class="bordered-expansion bg-grey-3 q-pa-md fit">
            <p class="application_subheading text-h6">Fees & Discounts</p>
            <p>
              Residence Fee includes water, electricity, and electricity levy of R254.55/month
              (total R2800)
            </p>
            <p>
              2.5% discount for returning students (2nd year) if form & payment received by 31 July
              2025.
            </p>
            <p>
              5% discount for returning students (3rd year or more) if form & payment received by 31
              July 2025.
            </p>
            <p>2.5% discount for siblings applying early.</p>
            <p>Maximum discount per student: 5%</p>
          </div>
        </div>
      </div> -->

      <q-expansion-item class="bordered-expansion q-mb-md q-pa-sm bg-grey-3">
        <template v-slot:header>
          <q-item-section avatar>
            <q-avatar icon="content_paste" />
          </q-item-section>

          <q-item-section class="text-h6"> Placement </q-item-section>
        </template>

        <q-card>
          <q-card-section>
            <ul>
              <li>We reserve the right to decline any application.</li>
              <li>Preference is given to returning students with good payment and disciplinary records.</li>
              <li>Preference is given to Stellenbosch University (SU) students. Non-SU applicants may be considered
                based on
                availability.</li>
              <li>Payment of the full Annual Fee may guarantee placement, subject to all other criteria being met.</li>
              <li>Placement is handled on a first come, first served basis, depending on application date, payment
                status, and
                submission of signed lease agreement.</li>
              <li>Specific unit or block requests cannot be accommodated for new applicants. Assigned unit and block
                will be
                confirmed upon check-in.</li>
              <li>Application status will be confirmed once processing begins, typically during the second half of the
                year.
              </li>
            </ul>

          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-expansion-item class="bordered-expansion q-mb-md q-pa-sm bg-grey-3">
        <template v-slot:header>
          <q-item-section avatar>
            <q-avatar icon="block" />
          </q-item-section>

          <q-item-section class="text-h6"> Cancellation </q-item-section>
        </template>

        <q-card>
          <q-card-section>
            <ul>
              <ul>
                <li>Cancellations must be submitted in writing using the official Withdrawal Form available on
                  www.the-web.co.za.</li>
                <li>If cancellation is received before the official placement confirmation, any payments made will be
                  refunded, less an administration fee.</li>
                <li>Cancellation policies and penalties after placement are outlined in the lease agreement. Please
                  contact us
                  for further details.</li>
              </ul>
            </ul>
          </q-card-section>
        </q-card>
      </q-expansion-item>

      <q-card flat bordered class="q-pa-md bg-grey-3 q-mb-md">
        <q-card-section>
          <p class="application_subheading text-h6">Non-Acceptance by Stellenbosch University</p>
          <p class="text-subtitle2">For Academic Reasons</p>
          <ul>
            <li>Returning students must notify us promptly if not accepted for the upcoming academic year.</li>
            <li>Prospective students should inform us as soon as possible following matric results or university
              admission
              decisions.</li>
          </ul>
        </q-card-section>

      </q-card>

      <!-- <p class="text-weight-medium">
        Please contact us on +27(0)21 887 1260 or email us at applications@the-web.co.za if you have
        any questions regarding your application for 2025.
      </p> -->
    </div>
  </q-page>
</template>

<script>
import home2 from 'src/assets/resources/home/slider/2.png';

export default {
  data() {
    return {
      parallax: home2
    }
  }
}
</script>


<style lang="scss" scoped>
li {
  line-height: 26px;
}

.bordered-expansion {
  border: 1px solid #ccc;
  border-radius: 6px;
}

.circle {
  border-radius: 100%;
  height: 40px;
  width: 40px;
  font-size: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
}

/* media queries */

/* xs: Extra small (default for < 600px) */
@media screen and (max-width: 599.98px) {
  .text-h6 {
    font-size: 0.8rem;
    font-weight: 500;
    line-height: normal;
  }

  ul {
    padding-left: 10px;
  }

  li {
    line-height: 20px;
  }

  .application_heading {
    font-size: 1.2rem;
    font-weight: 500;
  }

  .application_subheading {
    font-size: 1rem;
    font-weight: 500;
  }

  .circle {
    height: 30px;
    width: 30px;
    font-size: 0.7rem;
  }
}

/* sm: Small (600px to < 1024px) */
@media screen and (min-width: 600px) and (max-width: 1023.98px) {
  .text-h6 {
    font-size: 1rem;

  }
}

/* md: Medium (1024px to < 1440px) */
/* @media screen and (min-width: 1024px) and (max-width: 1439.98px) { */
/* styles for md */
/* } */

/* lg: Large (1440px to < 1920px) */
/* @media screen and (min-width: 1440px) and (max-width: 1919.98px) { */
/* styles for lg */
/* } */
</style>
