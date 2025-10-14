<template>
  <div>
    <div class="q-pt-md">
      <div class="text-h4 text-weight-bold text-center">The-WEB: Architectural Layout & <br> Floor Plan Guide</div>
    </div>

    <div class="q-py-md">
      <UnitCardGridComponent />
    </div>
  </div>

</template>

<script>
import BedStatsComponent from './BedStatsComponent.vue'
import UnitCardGridComponent from './UnitCardGridComponent.vue'

export default {
  name: 'UnitsCardSection',
  components: {
    BedStatsComponent,
    UnitCardGridComponent
  }
}
</script>
