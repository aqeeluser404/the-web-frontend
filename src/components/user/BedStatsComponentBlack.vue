<template>
  <q-card flat bordered class="stats-card">
    <q-card-section class="stats-header">
      <div class="text-h6">Accommodation Availability Summary</div>
      <q-separator class="q-my-sm" style="width: 100%;" />
    </q-card-section>

    <q-card-section class="total-stats">
      <div class="row justify-center items-center">
        <!-- <q-icon name="hotel" size="md" class="q-mr-sm" /> -->
        <div class="text-subtitle1">
          Total Sleepers Available:
          <span class="text-bold">{{ stats.overall.available }}/{{ stats.overall.total }}</span>
          ({{ stats.overall.total > 0 ? Math.round((stats.overall.available / stats.overall.total) * 100) + '%' : '0%'
          }})
        </div>
      </div>
    </q-card-section>

    <q-card-section class="row justify-between">
      <div class="floor-stats col-md-3 col-12" :class="$q.screen.gt.sm ? '' : 'q-pa-sm'" v-for="floor in floors" :key="floor.key" @click="goToFloor(floor.key)">
        <div class="text-subtitle2 text-center">{{ floor.label }}</div>

        <div class="text-center cursor-pointer">
          <q-icon name="content_paste" size="sm" class="q-mr-xs" />
          <span class="text-bold">{{ stats[floor.key].available }}/{{ stats[floor.key].total }}</span>
        </div>
        <q-linear-progress :value="stats[floor.key].available / stats[floor.key].total"
          :color="getAvailabilityColor(stats[floor.key].available, stats[floor.key].total)" class="q-mt-sm" />
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import Helper from 'src/services/utils'
import UnitService from 'src/services/api/UnitService';

export default {
  name: 'BedStatsComponent',
  data() {
    return {
      units: [],
      stats: {
        firstFloor: { available: 0, total: 0 },
        secondFloor: { available: 0, total: 0 },
        thirdFloor: { available: 0, total: 0 },
        overall: { available: 0, total: 0 }
      },
      floors: [
        { key: 'firstFloor', label: '1st Floor' },
        { key: 'secondFloor', label: '2nd Floor' },
        { key: 'thirdFloor', label: '3rd Floor' }
      ]
    }
  },
  methods: {
    getAvailabilityColor(available, total) {
      const percentage = available / total
      if (percentage > 0.5) return 'positive'
      if (percentage > 0.25) return 'warning'
      return 'negative'
    },
calculateBedStats() {
  const stats = {
    firstFloor: { available: 0, total: 0 },
    secondFloor: { available: 0, total: 0 },
    thirdFloor: { available: 0, total: 0 },
    overall: { available: 0, total: 0 }
  }

  this.units.forEach(unit => {
    // 🚫 Skip entire unit if it's reserved
    if (unit.reservedBy) return

    const floor = unit.floorLevel

    if (unit.subUnits && Array.isArray(unit.subUnits)) {
      unit.subUnits.forEach(sub => {
        const isAvailable = sub.isAvailable && !sub.reservedBy
        const isCountable = !sub.reservedBy

        if (isCountable) {
          stats[floorKey(floor)].total += 1
        }
        if (isAvailable) {
          stats[floorKey(floor)].available += 1
        }
      })
    } else if (unit.unitOccupants != null && unit.currentOccupants != null) {
      const occupants = Math.floor(unit.unitOccupants || 0)
      const current = Math.floor(unit.currentOccupants || 0)
      const availableBeds = Math.max(0, occupants - current)

      stats[floorKey(floor)].available += availableBeds
      stats[floorKey(floor)].total += occupants
    }
  })

  stats.overall.available =
    stats.firstFloor.available +
    stats.secondFloor.available +
    stats.thirdFloor.available

  stats.overall.total =
    stats.firstFloor.total +
    stats.secondFloor.total +
    stats.thirdFloor.total

  this.stats = stats

  function floorKey(level) {
    switch (level) {
      case 'First Floor': return 'firstFloor'
      case 'Second Floor': return 'secondFloor'
      case 'Third Floor': return 'thirdFloor'
      default: return 'firstFloor'
    }
  }
},
    async fetchUnits() {
      try {
        const response = await UnitService.getAllUnits()
        this.units = response
        this.calculateBedStats()
      } catch (error) {
        console.error('Error fetching units:', error)
      }
    },
    async goToFloor(key) {
      // const isLoggedIn = await Helper.checkCookie()
      // if (!isLoggedIn) {
      //   this.$router.push(`/auth/login`);
      //   this.$q.notify({ type: 'negative', message: `Please login in to continue.` })
      //   return
      // }
      const keyToNumber = {
        firstFloor: 1,
        secondFloor: 2,
        thirdFloor: 3
      };
      const floorNumber = keyToNumber[key];
      if (floorNumber) {
        this.$router.push(`/units/apply/floor/${floorNumber}`);
      }
    }
  },
  created() {
    this.fetchUnits()
  }
}
</script>

<style lang="sass" scoped>
.stats-card
  background-color: transparent
  color: white
  border-radius: 8px
  box-shadow: 0 2px 8px rgba(255, 255, 255, 0.1)

  .stats-header
    background-color: transparent
    border-top-left-radius: 8px
    border-top-right-radius: 8px
    @media (max-width: 600px)
      display: flex
      flex-direction: column
      align-items: center
      justify-content: center

  .floor-stats
    padding: 8px
    border-radius: 6px
    transition: all 0.3s ease
    &:hover
      background-color: rgba(255, 255, 255, 0.2)

  .total-stats
    background-color: transparent
    border-bottom-left-radius: 8px
    border-bottom-right-radius: 8px

  .q-linear-progress
    height: 8px
    border-radius: 4px
</style>
