<template>
  <q-card class="soft-shadow-card">
    <q-card-section class="header-tint">
      <div class="text-h6">Accommodation Availability Summary</div>
      <q-separator class="q-my-sm" style="width: 100%;" />
    </q-card-section>

    <q-card-section class="tinted-border row justify-between">
      <div class="floor-stats col-md-3 col-12 cursor-pointer" :class="$q.screen.gt.sm ? '' : 'q-pa-sm'"
        v-for="floor in floors" :key="floor.key" @click="goToFloor(floor.key)" :style="{
          backgroundColor: getBackgroundColor(floor.key),
          color: getTextColor(floor.key)
        }">

        <div class="text-h6 text-center text-weight-bold">{{ floor.label }}</div>

        <q-linear-progress :value="stats[floor.key].available / stats[floor.key].total"
          :color="getProgressColor(floor.key)" class="q-mt-sm" style="border-radius: 6px; padding: 6px;" />
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import UnitService from 'src/services/api/UnitService';

// ─── Module-level constants — created once, not on every call ───
const KEY_TO_NUMBER = { firstFloor: 1, secondFloor: 2, thirdFloor: 3 }
const NUMBER_TO_KEY = { 1: 'firstFloor', 2: 'secondFloor', 3: 'thirdFloor' }
const FLOOR_LEVEL_TO_KEY = {
  'First Floor': 'firstFloor',
  'Second Floor': 'secondFloor',
  'Third Floor': 'thirdFloor'
}

export default {
  name: 'BedStatsComponent',
  props: {
    unitYear: {
      type: [Number, String],
      default: null
    }
  },
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
  watch: {
    unitYear() {
      this.calculateBedStats()
    }
  },
  computed: {
    currentFloorParam() {
      const match = this.$route.path.match(/\/units\/apply\/floor\/(\d+)$/)
      return match ? parseInt(match[1]) : null
    },
    isHomeRoute() {
      return this.$route.path === '/'
    }
  },
  methods: {
    // ─── One shared check instead of 3 duplicated ones ───
    isFloorActive(floorKey) {
      if (this.isHomeRoute && floorKey === 'firstFloor') return true
      return this.currentFloorParam === KEY_TO_NUMBER[floorKey]
    },

    getBackgroundColor(floorKey) {
      return this.isFloorActive(floorKey) ? '#009B77' : 'white'
    },
    getTextColor(floorKey) {
      return this.isFloorActive(floorKey) ? 'white' : 'black'
    },
    getProgressColor(floorKey) {
      if (this.isFloorActive(floorKey)) return 'white'

      const { available, total } = this.stats[floorKey]
      if (total === 0) return 'black' // avoid NaN from 0/0
      const percentage = available / total

      if (percentage > 0.5) return 'black'
      if (percentage > 0.25) return 'black'
      return 'negative'
    },

    calculateBedStats() {
      const stats = {
        firstFloor: { available: 0, total: 0 },
        secondFloor: { available: 0, total: 0 },
        thirdFloor: { available: 0, total: 0 },
        overall: { available: 0, total: 0 }
      }

      const targetYear = this.unitYear ? String(this.unitYear) : null

      // Single pass: filter + accumulate together instead of
      // filtering into a new array first, then looping over that.
      for (const unit of this.units) {
        if (targetYear && String(unit.unitYear) !== targetYear) continue

        const floorKey = FLOOR_LEVEL_TO_KEY[unit.floorLevel] || 'firstFloor'
        const bucket = stats[floorKey]

        if (unit.subUnits && unit.subUnits.length) {
          for (const sub of unit.subUnits) {
            bucket.total += 1
            if (sub.isAvailable && !sub.reservedBy) {
              bucket.available += 1
            }
          }
        } else if (unit.unitOccupants != null && unit.currentOccupants != null) {
          if (unit.reservedBy) continue

          const occupants = Math.floor(unit.unitOccupants || 0)
          const current = Math.floor(unit.currentOccupants || 0)
          bucket.available += Math.max(0, occupants - current)
          bucket.total += occupants
        }
      }

      stats.overall.available =
        stats.firstFloor.available + stats.secondFloor.available + stats.thirdFloor.available
      stats.overall.total =
        stats.firstFloor.total + stats.secondFloor.total + stats.thirdFloor.total

      this.stats = stats
    },

    async fetchUnits() {
      try {
        this.units = await UnitService.getAllUnits()
        this.calculateBedStats()
      } catch (error) {
        console.error('Error fetching units:', error)
      }
    },

    goToFloor(key) {
      const floorNumber = KEY_TO_NUMBER[key]
      if (floorNumber) {
        this.$router.push(`/units/apply/floor/${floorNumber}`)
      }
    }
  },
  created() {
    this.fetchUnits()
  }
}
</script>

<style lang="sass" scoped>
.floor-stats
  padding: 12px
  border-radius: 6px
  transition: all 0.3s ease
  &:hover
    background-color: #efefef

.q-linear-progress
  height: 8px
  border-radius: 4px
</style>
