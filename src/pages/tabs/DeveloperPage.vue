<template>
  <q-page>
    <!----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
    <q-parallax
      :src="parallax"
      :height="300"
      :speed="0.5"
      style="background-position: center 30% !important; background-size: cover !important"
    >
      <div
        style="
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(34, 34, 34, 0.6);
        "
        class="text-white text-center column justify-center items-center q-pa-xl"
      >
        <q-card-section>
          <div class="text-h3 hero-heading">The Heartbeat of Idas Valley</div>
          <br />
          <div class="text-body1 q-mb-lg hero-subheading">
            Where heritage shapes the present, and community builds the future.
          </div>
        </q-card-section>
      </div>
    </q-parallax>

    <div style="height: 100%; background-color: #222" class="text-white q-pa-xl">
      <div class="constrain text-center subBanner">
        <div class="text-h4">The-WEB Developer Background</div>
      </div>
    </div>
    <!-- <div style="height: 60px; background-color: white"></div> -->

    <div class="q-pa-sm">
      <div class="row q-col-gutter-md items-stretch">
        <!-- Left Column -->
        <div class="col-12 col-lg-6">
          <div class="column full-height">
            <div class="q-mb-md col q-pa-md">
              <span class="text-h6">Raised in the Heart of Die Vlei</span>
              <p class="q-mb-lg">
                Earle Brynmor Williams is a boorling of Die Vlei—a place that epitomises the saying
                “Dit vat ’n gemeenskap om ’n kind groot te maak” (“It takes a village to raise a
                child”). In Die Vlei, this isn’t just a saying—it’s a philosophy woven into daily
                life.
              </p>
              <span class="text-h6">Bound by Soil, United by Belonging</span>
              <p class="q-mb-lg">
                He found spiritual belonging in the Volkskerk van Afrika, received his education at
                Laerskool Idasvallei and Hoërskool Lückhoff, and discovered joy and discipline on
                the fields with Victoria Swifts and Stellenbosch en Distrikte. Even as a young boy,
                delivering the Eikestadnuus, he learned the quiet power of service and the
                importance of showing up for his community.
              </p>
              <span class="text-h6">Guided by Faith and Community Values</span>
              <p class="q-mb-lg">
                Earle was raised in a community where faith, family, and friendship anchor the
                spirit of every street. His roots run deep: his parents, grandparents, extended
                family, and lifelong friends all reside in Die Vlei, nurturing him with unwavering
                support, shared values, and generational wisdom.
              </p>
            </div>
          </div>
        </div>

        <!-- Right Column -->
        <div class="col-12 col-lg-6">
          <div class="column">
            <div class=" img-container q-mb-md col q-pa-md">
              <img
                :src="valley"
                alt="idas Valley"
                class="dev-img"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="dev-info q-pa-md">
        Today, he walks alongside his wife—herself a child of Idas Valley. Their journey is bound by
        the same soil, the same sunsets, and the shared heartbeat of their hometown.
        <br />
        Die Vlei has instilled in them the values of respect, unity, and the power of helping hands.
        Here, they learned not just how to live, but how to belong. How to grow—not just as
        individuals, but together within a greater whole.
      </div>
    </div>
  </q-page>
</template>

<script>
import home2 from 'src/assets/resources/home/slider/2.jpg';
import idasValley from 'src/assets/resources/tab/idasValley.png';

export default {
  data() {
    return {
      parallax: home2,
      valley: idasValley,
    }
  },
}
</script>

<style scoped lang="scss">
.img-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.dev-img {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
  object-position: center;
}

/* media queries */

/* xs: Extra small (default for < 600px) */
@media screen and (max-width: 599.98px) {
  .row {
    flex-direction: column-reverse;
  }
  .col {
    margin: 0px;
    padding: 0px;
  }
  .dev-info {
    margin: 0px;
    padding: 0px;
  }
  .text-h6 {
    font-size: 1.1rem;
    line-height: 1rem;
  }
}

/* sm: Small (600px to < 1024px) */
@media screen and (min-width: 600px) and (max-width: 1023.98px) {

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
