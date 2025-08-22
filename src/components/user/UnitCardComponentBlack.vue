<template>

    <q-card-section>
      <div class="text-h4 text-center">Unit Specifications</div>
    </q-card-section>

    <div class="q-pa-md">
      <BedStatsComponentBlack />
      <br><br>
      <UnitCardGridComponent />
  </div>

</template>

<script>
// import BedStatsComponent from './BedStatsComponent.vue'
import BedStatsComponentBlack from './BedStatsComponentBlack.vue';
import UnitCardGridComponent from './UnitCardGridComponent.vue'

export default {
  name: 'UnitsCardSection',
  components: {
    // BedStatsComponent,
    BedStatsComponentBlack,
    UnitCardGridComponent
  }
}
</script>
