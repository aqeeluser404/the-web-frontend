<template>
  <q-page class="bg-grey-3 q-pa-md">
    <div>
      <div class="constrain-standard" style="position: relative; min-height: 300px;">

        <!-- Overlay spinner controlled by loading -->
        <div v-show="loading" class="spinner-overlay">
          <q-spinner color="primary" size="md" />
        </div>

        <!-- Content -->
        <div class="q-pt-md" v-show="!loading">
          <div class="text-h4 text-weight-bold text-center">
            The-WEB: Architectural Layout & <br> Floor Plan Guide
          </div>
        </div>

        <div class="q-py-md">
          <!-- Child fetches its own units and emits loading state -->
          <UnitCardGridComponent @update:loading="loading = $event" />
        </div>

      </div>
    </div>
  </q-page>
</template>

<script>
import UnitCardGridComponent from 'src/components/user/UnitCardGridComponent.vue'

export default {
  data() {
    return {
      currentFloor: 1,
      loading: true // controlled by child
    }
  },
  components: { UnitCardGridComponent },
  created() {
    const floorParam = parseInt(this.$route.params.floor)
    this.currentFloor = floorParam
  }
}
</script>

<style scoped>
.spinner-overlay {
  position: fixed;   /* cover entire viewport */
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: white;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
</style>
