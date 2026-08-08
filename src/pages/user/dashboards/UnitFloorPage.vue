<template>
  <q-page class="bg-grey-3 q-pa-md">
    <div>
      <div class="constrain-standard" style="position: relative; min-height: 300px;">

        <!-- Page-level overlay spinner -->
        <div v-show="pageLoading" class="spinner-overlay">
          <q-spinner color="primary" size="md" />
        </div>

        <!-- Content -->
        <div class="q-pt-md" v-show="!pageLoading">
          <div class="text-h4 text-weight-bold text-center">
            The-WEB: Architectural Layout & <br> Floor Plan Guide
          </div>
        </div>

        <div class="q-py-md">
          <!-- Child emits loading, parent listens once -->
          <UnitCardGridComponent @update:loading="handleChildLoading" />
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
      pageLoading: true,   // page overlay
      childLoadedOnce: false // guard flag
    }
  },
  components: { UnitCardGridComponent },
  created() {
    const floorParam = parseInt(this.$route.params.floor)
    this.currentFloor = floorParam
  },
  methods: {
    handleChildLoading(val) {
      // Only respond to the first time child finishes loading
      if (!this.childLoadedOnce && val === false) {
        this.pageLoading = false
        this.childLoadedOnce = true
      }
    }
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
