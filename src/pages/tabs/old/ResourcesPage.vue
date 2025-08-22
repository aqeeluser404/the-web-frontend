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
          <div class="text-h3">Resource</div>
          <br>
          <div class="text-body1 q-mb-lg">
            Some extra info available for download
          </div>
        </q-card-section>
      </div>
    </q-parallax>

    <!-- <div style="height: 60px; background-color: white;"></div> -->
    <!-- Withdrawal Form Button - Wider Version -->
    <div class="column items-center q-my-xl q-gutter-y-md">
      <q-btn
        flat
        no-caps
        class="q-px-xl q-py-md"
        style="border-radius: 8px; min-width: 300px; border: 1px solid #222;"
      >
        <div class="row items-center no-wrap">
          <div class="text-bold q-pr-sm">Withdrawal Form</div>
          <div class="text-caption">| Size: 43857KB | Date: October 2025</div>
        </div>
      </q-btn>
      <q-btn
        flat
        no-caps
        class="q-px-xl q-py-md"
        style="border-radius: 8px; min-width: 300px; border: 1px solid #222;"
      >
        <div class="row items-center no-wrap">
          <div class="text-bold q-pr-sm">Code of Conduct</div>
          <div class="text-caption">| Size: 43857KB | Date: October 2025</div>
        </div>
      </q-btn>
      <q-btn
        flat
        no-caps
        class="q-px-xl q-py-md"
        style="border-radius: 8px; min-width: 300px; border: 1px solid #222;"
      >
        <div class="row items-center no-wrap">
          <div class="text-bold q-pr-sm">The WEB Student Booklet</div>
          <div class="text-caption">| Size: 43857KB | Date: October 2025</div>
        </div>
      </q-btn>
      <q-btn
        flat
        no-caps
        class="q-px-xl q-py-md"
        style="border-radius: 8px; min-width: 300px; border: 1px solid #222;"
      >
        <div class="row items-center no-wrap">
          <div class="text-bold q-pr-sm">Vistor Protocol</div>
          <div class="text-caption">| Size: 43857KB | Date: October 2025</div>
        </div>
      </q-btn>
    </div>
    <div style="height: 60px; background-color: white;"></div>

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

