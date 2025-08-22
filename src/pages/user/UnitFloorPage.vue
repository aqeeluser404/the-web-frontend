<template>
  <!-- <q-card-section>
    <div class="text-h4 text-center">Floor Number {{ currentFloor }}</div>
  </q-card-section> -->

  <q-card-section>
    <div class="text-h4 text-center">Unit Specifications</div>
  </q-card-section>

  <div class="q-pa-md">
    <BedStatsComponent />
    <br><br>
    <UnitCardGridComponent />
  </div>
</template>

<script>
import BedStatsComponent from 'src/components/user/BedStatsComponent.vue'
import UnitCardGridComponent from 'src/components/user/UnitCardGridComponent.vue'

export default {
  data() {
    return {
      currentFloor: 1
    }
  },
  components: {
      BedStatsComponent,
      UnitCardGridComponent
  },

  created() {
    const floorParam = parseInt(this.$route.params.floor)
    this.currentFloor = floorParam

    // const floorMap = {
    //   1: 'First Floor',
    //   2: 'Second Floor',
    //   3: 'Third Floor'
    // }



  }
}
</script>
