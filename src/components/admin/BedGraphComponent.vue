<template>
  <q-card class="stats-card col-md-12 col-12 full-height">
    <q-card-section class="stats-header row justify-between items-center">
      <div class="text-h6">Bed Occupancy Line Chart</div>
      <q-select
        v-model="selectedYear"
        :options="availableYears"
        dense
        filled
        style="min-width: 120px"
        @update:model-value="onYearChange"
      />
      <q-separator class="q-my-sm" style="width: 100%" />
    </q-card-section>

    <q-card-section>
      <canvas ref="bedLineChart" style="max-height: 300px;"></canvas>

      <div class="row justify-center q-mt-md">
        <q-chip
          square
          color="grey-3"
          text-color="grey-9"
          class="text-weight-bold"
          size="md"
        >
          Total occupied: {{ stats.overall.total - stats.overall.available }} / {{ stats.overall.total }}
        </q-chip>
      </div>
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
import RentalService from 'src/services/api/RentalService';
import UnitService from 'src/services/api/UnitService';

export default {
  data() {
    return {
      pieChart: null,

      units: [],
      selectedYear: new Date().getFullYear(),  // ✅ Default to current year
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

  computed: {
    // ============================================================
    // AVAILABLE YEARS — built from all units in the system
    // ============================================================
    availableYears() {
      const years = new Set();

      this.units.forEach(unit => {
        if (unit.unitYear != null) {
          years.add(Number(unit.unitYear));
        }
      });

      // ✅ Sort ascending so 2026, 2027, 2028, etc.
      return Array.from(years).sort((a, b) => a - b);
    },

    // ============================================================
    // UNITS FOR THE SELECTED YEAR
    // ============================================================
    filteredUnits() {
      return this.units.filter(
        unit => Number(unit.unitYear) === this.selectedYear
      );
    }
  },

  methods: {
    getAvailabilityColor(available, total) {
      const percentage = available / total
      if (percentage > 0.5) return 'positive'
      if (percentage > 0.25) return 'warning'
      return 'negative'
    },

    onYearChange() {
      // ✅ Recompute stats + redraw chart when year changes
      this.calculateBedStats();
      this.drawLineChart();
    },

calculateBedStats() {
  const stats = {
    firstFloor: { available: 0, total: 0 },
    secondFloor: { available: 0, total: 0 },
    thirdFloor: { available: 0, total: 0 },
    overall: { available: 0, total: 0 }
  };

  this.filteredUnits.forEach(unit => {
    const floor = this.floorKey(unit.floorLevel);

    if (Array.isArray(unit.subUnits)) {
      unit.subUnits.forEach(sub => {
        stats[floor].total += 1;

        // A sub-unit only counts as truly occupied for THIS year if
        // there's an Active rental whose current unitYear matches this
        // year and points at this exact bed — not just isAvailable being
        // false, since a locked-but-renewed-away bed shouldn't count here.
        const identifier = sub.roomType || sub.bedType;
        const genuinelyOccupiedThisYear = this.rentals.some(rental =>
          rental.status === 'Active' &&
          String(rental.unit) === String(unit._id) &&
          Number(rental.unitYear) === this.selectedYear &&
          (rental.selectedSubUnits?.roomType === identifier ||
           rental.selectedSubUnits?.bedType === identifier)
        );

        if (!genuinelyOccupiedThisYear) {
          stats[floor].available += 1;
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
},

    // ✅ Extracted so it can be used anywhere
    floorKey(level) {
      switch (level) {
        case 'First Floor': return 'firstFloor';
        case 'Second Floor': return 'secondFloor';
        case 'Third Floor': return 'thirdFloor';
        default: return 'firstFloor';
      }
    },

    drawLineChart() {
      const labels = this.floors.map(f => {
        const floor = this.stats[f.key];
        const occupied = floor.total - floor.available;
        return `${f.label} (${occupied}/${floor.total})`;
      });
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
              label: `${this.selectedYear} Occupied`,
              data: occupiedData,
              backgroundColor: '#F44336'
            },
            {
              label: `${this.selectedYear} Available`,
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
    const [units, rentals] = await Promise.all([
      UnitService.getAllUnits(),
      RentalService.findAllRentals()
    ]);
    this.units = units;
    this.rentals = Array.isArray(rentals) ? rentals : [];

    if (!this.availableYears.includes(this.selectedYear)) {
      this.selectedYear = this.availableYears[0] ?? this.selectedYear;
    }

    this.calculateBedStats();
    this.drawLineChart();
  } catch (error) {
    console.error('Error fetching units:', error);
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
