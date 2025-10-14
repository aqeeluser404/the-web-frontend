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
          <div class="text-h3 hero-heading">Resources</div>
          <br />
          <div class="text-body1 q-mb-lg hero-subheading">Some extra info available for download</div>
        </q-card-section>
      </div>
    </q-parallax>

    <!-- <div style="height: 60px; background-color: white;"></div> -->
    <div style="height: 100%; background-color: #222" class="text-white q-pa-xl">
      <div class="constrain text-center subBanner">
        <div class="text-h4">Download Resources</div>
      </div>
    </div>
    <div class="row justify-center q-ma-md">
    <div class="column items-center q-my-xl q-gutter-y-md" style="max-width: 600px; width: 100%">
      <q-btn flat no-caps class="block-radius full-width q-py-md" style="border: 1px solid #222">
        <div class="row items-center no-wrap justify-between">
          <div class="text-bold q-pr-sm">Withdrawal Form</div>
          <div class="text-caption">| Size: 43857KB | Date: October 2025</div>
        </div>
      </q-btn>

      <q-btn flat no-caps class="block-radius full-width q-py-md" style="border: 1px solid #222">
        <div class="row items-center no-wrap justify-between">
          <div class="text-bold q-pr-sm">Code of Conduct</div>
          <div class="text-caption">| Size: 43857KB | Date: October 2025</div>
        </div>
      </q-btn>

      <q-btn flat no-caps class="block-radius full-width q-py-md" style="border: 1px solid #222">
        <div class="row items-center no-wrap justify-between">
          <div class="text-bold q-pr-sm">The-WEB Student Booklet</div>
          <div class="text-caption">| Size: 43857KB | Date: October 2025</div>
        </div>
      </q-btn>

      <q-btn flat no-caps class="block-radius full-width q-py-md" style="border: 1px solid #222">
        <div class="row items-center no-wrap justify-between">
          <div class="text-bold q-pr-sm">Visitor Protocol</div>
          <div class="text-caption">| Size: 43857KB | Date: October 2025</div>
        </div>
      </q-btn>
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
      parallax: home2
    }
  },
}
</script>

<style scoped lang="scss">
.block-radius {
  border-radius: 5px;
}


.row.justify-center {
  display: flex;
  justify-content: center;
}

.text-bold {
  font-size: 1.2rem;
}

.text-caption {
  font-size: 0.8rem;
}

/* Mobile adjustments */
@media screen and (max-width: 599.98px) {

  .q-btn.full-width {
    width: 100%;
    min-width: 0;
    margin-bottom: 12px;
  }

  .text-bold {
    font-size: 1rem;
  }

  .text-caption {
    font-size: 0.75rem;
  }
}

</style>
