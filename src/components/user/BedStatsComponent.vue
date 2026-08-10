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

export default {
  name: 'BedStatsComponent',
  props: {
    unitYear: {
      type: [Number, String],
      default: null // null = all years
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
    // isHomePage() {
    //   return this.$route.path === '/'
    // },
  },
  methods: {
    getBackgroundColor(floorKey) {
      const keyToNumber = { firstFloor: 1, secondFloor: 2, thirdFloor: 3 };
      const floorNumber = keyToNumber[floorKey];

      if (this.$route.path === '/' && floorKey === 'firstFloor') {
        return '#009B77';
      }
      return this.currentFloorParam === floorNumber ? '#009B77' : 'white';
    },
    getTextColor(floorKey) {
      const keyToNumber = { firstFloor: 1, secondFloor: 2, thirdFloor: 3 };
      const floorNumber = keyToNumber[floorKey];

      if (this.$route.path === '/' && floorKey === 'firstFloor') {
        return 'white';
      }
      return this.currentFloorParam === floorNumber ? 'white' : 'black';
    },

    getProgressColor(floorKey) {
      const keyToNumber = { firstFloor: 1, secondFloor: 2, thirdFloor: 3 }
      const floorNumber = keyToNumber[floorKey]

      if (this.$route.path === '/' && floorKey === 'firstFloor') {
        return 'white';
      }

      if (this.currentFloorParam === floorNumber) {
        return 'white'
      }
      const available = this.stats[floorKey].available
      const total = this.stats[floorKey].total
      const percentage = available / total

      // if (percentage > 0.5) return 'positive'
      // if (percentage > 0.25) return 'warning'

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

      const filteredUnits = this.unitYear
        ? this.units.filter(unit => String(unit.unitYear) === String(this.unitYear))
        : this.units

      filteredUnits.forEach(unit => {
        const floor = unit.floorLevel

        if (unit.subUnits && Array.isArray(unit.subUnits) && unit.subUnits.length) {
          // Reservation is checked per sub-unit, not at the unit level
          // unit.subUnits.forEach(sub => {
          //   const isCountable = !sub.reservedBy
          //   const isAvailable = sub.isAvailable && !sub.reservedBy

          //   if (isCountable) {
          //     stats[floorKey(floor)].total += 1
          //   }
          //   if (isAvailable) {
          //     stats[floorKey(floor)].available += 1
          //   }
          // })
          unit.subUnits.forEach(sub => {
            // Every sub-unit counts toward total capacity, reserved or not
            stats[floorKey(floor)].total += 1

            const isAvailable = sub.isAvailable && !sub.reservedBy
            if (isAvailable) {
              stats[floorKey(floor)].available += 1
            }
          })
        } else if (unit.unitOccupants != null && unit.currentOccupants != null) {
          // No subUnits — this unit's own reservedBy governs it
          if (unit.reservedBy) return

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
      //   this.$router.push(`/auth/login`)
      //   this.$q.notify({ type: 'negative', message: `Please login to continue.` })
      //   return
      // }
      const keyToNumber = {
        firstFloor: 1,
        secondFloor: 2,
        thirdFloor: 3
      }
      const floorNumber = keyToNumber[key]
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
