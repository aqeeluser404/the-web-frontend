<template>
  <q-page>
    <!----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
    <!-- <q-parallax
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
          <div class="text-h3 hero-heading">The History</div>
          <br />
          <div class="text-body1 q-mb-lg hero-subheading">How it all began</div>
        </q-card-section>
      </div>
    </q-parallax> -->

    <div style="height: 100%; background-color: #222" class="text-white q-pa-xl">
      <div class="constrain text-center subBanner">
        <div class="text-h4">Get to Know The-WEB History</div>
      </div>
    </div>

    <div class="row q-col-gutter-md q-mb-md q-ma-lg">
      <div class="col-12 col-sm-6">
        <span class="text-h5 text-weight-bold">🛤️ Journey of the Pass</span>
        <dl>
          <dt>Origins of Movement</dt>
          <dd style="margin-left: 0">
            As early as the late 1600s, skilled Khoisan herders and their cattle navigated this
            natural route. Later, European settlers formalized and expanded it to connect emerging
            towns in the valley.
          </dd>

          <dt>Formal construction</dt>
          <dd style="margin-left: 0">
            In 1854, Helshoogte Pass (now the R310) was officially constructed, replacing the
            treacherous “Hell” descent and providing a safer, more direct link between Stellenbosch
            and Franschhoek.
          </dd>

          <dt>Evolution over time</dt>
          <dd style="margin-left: 0">
            Upgrades in the early 1900s, the 1960s, and most recently in 2010 have transformed it
            into the scenic and well-maintained route known today—defined by gentle curves, smooth
            gradients, and panoramic mountain views.
          </dd>
        </dl>
      </div>
      <div class="col-12 col-sm-6">
        <span class="text-h5 text-weight-bold">🏞️ Why this Address Matters</span>
        <dl>
          <dt>Cultural depth</dt>
          <dd style="margin-left: 0">
            Old Helshoogte Road once cut through the heart of Idas Valley, forming part of the
            original corridor connecting major Huguenot and Cape settlements. Today, Idas Valley
            remains a peaceful cul-de-sac, preserving its authenticity and sense of place.
          </dd>

          <dt>Scenic prestige</dt>
          <dd style="margin-left: 0">
            From this vantage point, residents enjoy views over lush vineyards and the rolling
            foothills of the Simonsberg and Jonkershoek ranges—all iconic features of the renowned
            Helshoogte Pass.
          </dd>

          <dt>Symbolic setting</dt>
          <dd style="margin-left: 0">
            The Web is positioned at a meaningful crossroads—one that tells the story of
            transformation, from indigenous trails to colonial trade routes, and now to a
            heritage-conscious, contemporary community.
          </dd>
        </dl>
      </div>
    </div>
    <q-card flat bordered class="row q-col-gutter-md q-mb-md q-ma-lg bg-grey-3">
      <div class="history-info col-12 col-sm-6" style="display: flex; justify-content: center; flex-direction: column; padding-left: 30px">
        <span class="text-h5 text-weight-bold">✨ Heritage Legacy Meets Urban Living</span>
        <p style="margin-top: 12px; font-weight: 500;">This is more than just a location—it’s a living story:</p>
        <ul>
          <li>A historic artery that connected communities long before modern infrastructure</li>
          <li>A place that has witnessed centuries of resilience, growth, and reinvention</li>
          <li>A setting where heritage, architecture, and natural beauty now converge</li>
        </ul>
      </div>
      <div class="col-12 col-sm-6" style="padding: 12px;">
      <!-- <img :src="valley" style="width: 100%; height:100%; object-fit: cover;" alt="idas Valley"> -->
      </div>
    </q-card>

    <!-- <div style="height: 60px; background-color: #222;"></div> -->
  </q-page>
</template>

<script>
// import home2 from 'src/assets/resources/home/slider/2.jpg';
// import idasValley from 'src/assets/resources/tab/idasValley.png';

export default {
  data() {
    return {
      // parallax: home2,
      // valley: idasValley,
    }
  },
}
</script>

<style scoped lang="sass">
// lists
.custom-list
  list-style-type: none
  padding-left: 1em
  line-height: 1.6


.custom-list li
  position: relative
  // padding-left: 2.5em
  // text-indent: -3em
  margin-bottom: 0.5em


.custom-list li:before
  content: ""
  position: absolute
  left: 0
  padding-right: 0.5em

/* For lists with checkmarks */
.custom-list li span
  position: relative
  left: -0.5em
dl
  dt
    font-weight: bold
  dd
    margin-bottom: 1em
    line-height: 1.7

ul
  li
    line-height: 2


/* media queries */

/* xs: Extra small (default for < 600px) */
@media screen and (max-width: 599.98px)

  .text-h5
    font-size: 1.2rem
  .row
    padding-right: 5px
    margin: 0

  .history-info
    margin: 0 !important
    padding-left: 5px !important
  .history-info p
    margin: 0

  li
    line-height: 1.5 !important


/* sm: Small (600px to < 1024px) */
@media screen and (min-width: 600px) and (max-width: 1023.98px)

/* md: Medium (1024px to < 1440px) */
/* @media screen and (min-width: 1024px) and (max-width: 1439.98px) { */
/* styles for md */
/* } */

/* lg: Large (1440px to < 1920px) */
/* @media screen and (min-width: 1440px) and (max-width: 1919.98px) { */
/* styles for lg */
/* } */

</style>
