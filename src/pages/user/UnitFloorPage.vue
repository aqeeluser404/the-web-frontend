<template>
  <q-page>
    <div class="bg-grey-3">
      <div class="constrain-standard">

        <div class="q-pt-md">
          <div class="text-h4 text-weight-bold text-center">The-WEB: Architectural Layout & <br> Floor Plan Guide</div>
        </div>

        <div class="q-py-md">
          <UnitCardGridComponent />
        </div>

      </div>
    </div>
  </q-page>
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
