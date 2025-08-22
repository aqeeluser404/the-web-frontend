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
          <div class="text-h3">THE WEB is located in the iconic Idas Valley (Die Vlei)</div>
          <br>
          <!-- <div class="text-body1 q-mb-lg">
            How it all began
          </div> -->
        </q-card-section>
      </div>
    </q-parallax>

    <div style="height: 60px; background-color: #222;"></div>

    <!-- Introduction Section -->
    <div style="height: 100%; background-color: #222;" class="text-white q-pa-xl">
      <div class="constrain text-center">
        <!-- <div class="text-h4">THE WEB is located in the iconic Idas Valley (Die Vlei)</div> -->
        <div class="text-body1">
          Earle Brynmor Williams is a boorling of Die Vlei, a place that epitomises the saying "Dit vat 'n gemeenskap om 'n kind groot te maak" ("It takes a village to raise a child"). In Die Vlei, this isn't just a saying, it's a philosophy woven into daily life.
          Earle was raised in a community where faith, family, and friendship anchor the spirit of every street. His roots run deep: his parents, grandparents, extended family, and lifelong friends all reside in Die Vlei, nurturing him with unwavering support, shared values, and generational wisdom.
          <br><br>He found spiritual belonging in the Volkskerk van Afrika, received his education at Laerskool Idasvallei and Hoërskool Lückhoff, and discovered joy and discipline on the fields with Victoria Swifts and Stellenbosch en Distrikte. Even as a young boy, delivering the Eikestadnuus, he learned the quiet power of service and the importance of showing up for his community.
          Today, he walks alongside his wife; herself a child of Idas Valley. <br><br> Their journey is bound by the same soil, the same sunsets, and the shared heartbeat of their hometown.
          Die Vlei has instilled in them the values of respect, unity, and the power of helping hands. Here, they learned not just how to live, but how to belong. How to grow; not just as individuals, but together within a greater whole.
        </div>
      </div>
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
