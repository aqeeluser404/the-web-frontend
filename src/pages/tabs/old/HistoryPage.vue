<template>
  <q-page>



    <!----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------->
    <q-parallax
      :src="parallax"
      :height="300"
      :speed="0.5"
      style="background-position: center 30% !important; background-size: cover !important;"
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
          <div class="text-h3">The History</div>
          <br>
          <div class="text-body1 q-mb-lg">
            How it all began
          </div>
        </q-card-section>
      </div>
    </q-parallax>

    <div style="height: 60px; background-color: #222;"></div>

    <div style="height: 100%; background-color: #222;" class="text-white text-body1">
      <q-card-section class="constrain">
        <div class="text-h3">🛤️ Journey of the Pass</div>
        <br>
          <ul class="q-mb-lg custom-list">
            <li><b>Origins of movement:</b> As early as the late 1600s, skilled Khoisan herders and their cattle navigated this natural route. Later, European settlers formalized and expanded it to connect emerging towns in the valley.</li>
            <li><b>Formal construction:</b> In 1854, Helshoogte Pass (now the R310) was officially constructed, replacing the treacherous "Hell" descent and providing a safer, more direct link between Stellenbosch and Franschhoek.</li>
            <li><b>Evolution over time:</b> Upgrades in the early 1900s, the 1960s, and most recently in 2010 have transformed it into the scenic and well-maintained route known today; defined by gentle curves, smooth gradients, and panoramic mountain views.</li>
          </ul>
      </q-card-section>
    </div>

    <div style="height: 100%; background-color: #222;" class="text-white text-body1">
      <q-card-section class="constrain">
        <div class="text-h3">🏞️ Why This Address Matters</div>
        <br>
          <ul class="q-mb-lg custom-list">
            <li><b>Cultural depth:</b> Old Helshoogte Road once cut through the heart of Idas Valley, forming part of the original corridor connecting major Huguenot and Cape settlements. Today, Idas Valley remains a peaceful cul-de-sac, preserving its authenticity and sense of place.</li>
            <li><b>Scenic prestige:</b> From this vantage point, residents enjoy views over lush vineyards and the rolling foothills of the Simonsberg and Jonkershoek ranges—all iconic features of the renowned Helshoogte Pass.</li>
            <li><b>Symbolic setting:</b> The Web is positioned at a meaningful crossroads—one that tells the story of transformation, from indigenous trails to colonial trade routes, and now to a heritage-conscious, contemporary community.</li>
          </ul>
      </q-card-section>
    </div>

    <div style="height: 100%; background-color: #222;" class="text-white text-body1">
      <q-card-section class="constrain">
        <div class="text-h3">✨ Heritage Legacy Meets Urban Living</div>
        <br>
          <ul class="q-mb-lg custom-list">
            <li>A historic artery that connected communities long before modern infrastructure</li>
            <li>A place that has witnessed centuries of resilience, growth, and reinvention</li>
            <li>A setting where heritage, architecture, and natural beauty now converge</li>
          </ul>
      </q-card-section>
    </div>

    <div style="height: 60px; background-color: #222;"></div>

  </q-page>

</template>

<script>

import home2 from 'src/assets/resources/home/slider/2.jpg';

export default {
  data() {
    return {
      parallax: home2
    }
  }
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
</style>
