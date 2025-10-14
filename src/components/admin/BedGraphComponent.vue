<template>
  <q-card bordered flat class="stats-card col-md-12 col-12 full-height">
    <q-card-section class="stats-header">
      <div class="text-h6">Bed Occupancy Line Chart</div>
      <q-separator class="q-my-sm" style="width: 100%;" />
    </q-card-section>

    <q-card-section>
      <canvas ref="bedLineChart" style="max-height: 300px;"></canvas>
    </q-card-section>
  </q-card>
</template>

<script>
import {
  Chart, PieController, BarController, BarElement, ArcElement, Tooltip, Legend,
  LineController, LineElement, PointElement, LinearScale, Title, CategoryScale
} from 'chart.js';
Chart.register(PieController, BarController, BarElement, ArcElement, Tooltip, Legend,
  LineController, LineElement, PointElement, LinearScale, Title, CategoryScale
);

import UnitService from 'src/services/UnitService';

export default {
  data() {
    return {
      pieChart: null,

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
      ],
      bedLineChart: null
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
  };

  this.units.forEach(unit => {
    // 🚫 Skip entire unit if it's reserved
    if (unit.reservedBy) return;

    const floor = floorKey(unit.floorLevel);

    if (Array.isArray(unit.subUnits)) {
      unit.subUnits.forEach(sub => {
        if (!sub.reservedBy) {
          stats[floor].total += 1;
          if (sub.isAvailable) {
            stats[floor].available += 1;
          }
        }
      });
    } else if (unit.unitOccupants != null && unit.currentOccupants != null) {
      const occupants = Math.floor(unit.unitOccupants || 0);
      const current = Math.floor(unit.currentOccupants || 0);
      const availableBeds = Math.max(0, occupants - current);

      stats[floor].total += occupants;
      stats[floor].available += availableBeds;
    }
  });

  stats.overall.available =
    stats.firstFloor.available +
    stats.secondFloor.available +
    stats.thirdFloor.available;

  stats.overall.total =
    stats.firstFloor.total +
    stats.secondFloor.total +
    stats.thirdFloor.total;

  this.stats = stats;

  function floorKey(level) {
    switch (level) {
      case 'First Floor': return 'firstFloor';
      case 'Second Floor': return 'secondFloor';
      case 'Third Floor': return 'thirdFloor';
      default: return 'firstFloor';
    }
  }
},

    drawLineChart() {
      const labels = this.floors.map(f => f.label);
      const occupiedData = this.floors.map(f => {
        const floor = this.stats[f.key];
        return floor.total - floor.available;
      });
      const availableData = this.floors.map(f => this.stats[f.key].available);

      if (this.bedLineChart) this.bedLineChart.destroy();

      const ctx = this.$refs.bedLineChart.getContext('2d');
      this.bedLineChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Occupied',
              data: occupiedData,
              backgroundColor: '#F44336'
            },
            {
              label: 'Available',
              data: availableData,
              backgroundColor: '#4CAF50'
            }
          ]
        },
        options: {
          responsive: true,
          plugins: {
            legend: {
              position: 'top'
            },
            tooltip: {
              mode: 'index',
              intersect: false
            }
          },
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Beds'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Floor'
              }
            }
          }
        }
      });
    },

    async fetchUnits() {
      try {
        const response = await UnitService.getAllUnits()
        this.units = response
        this.calculateBedStats()
        this.drawLineChart()
      } catch (error) {
        console.error('Error fetching units:', error)
      }
    },
  },
  mounted() {
    this.fetchUnits()
  }
}
</script>

<style lang="sass" scoped>
.stats-card
  border-radius: 8px
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)

  .stats-header
    background-color: #f5f5f5
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
      background-color: #f9f9f9

  .tinted-border
    background-color: #f8fff8
    border-bottom-left-radius: 8px
    border-bottom-right-radius: 8px

  .q-linear-progress
    height: 8px
    border-radius: 4px
</style>
