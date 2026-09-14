<template>
  <q-card class="soft-shadow-card full-height">
    <q-card-section class="row stats-header justify-center items-center">
      <div class="text-h6">Rental Status Distribution</div>
      <q-separator class="q-my-sm q-mt-md" style="width: 100%;" />
    </q-card-section>
    <q-card-section class="row justify-center">
      <div style="width: 300px; height: 300px;">
        <canvas ref="pieChart"></canvas>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { Chart, PieController, ArcElement, Tooltip, Legend } from "chart.js";
Chart.register(PieController, ArcElement, Tooltip, Legend);

export default {
  name: "RentalStatusPie",

  props: {
    // ✅ Receive pre-fetched rentals from parent
    rentals: {
      type: Array,
      default: () => [],
    },
    showAllStatuses: {
      type: Boolean,
      default: true,
    },
  },

  emits: ["filter-status"],

  data() {
    return {
      pieChart: null,
    };
  },

  computed: {
    statusData() {
      const counts = { Active: 0, Pending: 0, Rejected: 0, Ended: 0 };
      this.rentals.forEach((r) => {
        if (counts[r.status] !== undefined) counts[r.status]++;
      });
      return this.showAllStatuses
        ? counts
        : { Active: counts.Active, Ended: counts.Ended };
    },
  },

  watch: {
    rentals: {
      handler() {
        this.updateChart();
      },
      deep: true,
    },
    showAllStatuses() {
      this.updateChart();
    },
  },

  mounted() {
    this.updateChart();
  },

  beforeUnmount() {
    if (this.pieChart) this.pieChart.destroy();
  },

  methods: {
    updateChart() {
      const statusData = this.statusData;
      const labels = Object.keys(statusData).map(
        (status) => `${status} (${statusData[status]})`
      );
      const data = Object.values(statusData);

      if (this.pieChart) this.pieChart.destroy();

      const ctx = this.$refs.pieChart.getContext("2d");
      this.pieChart = new Chart(ctx, {
        type: "pie",
        data: {
          labels,
          datasets: [
            {
              data,
              backgroundColor: ["#4CAF50", "#CC5500", "#F44336", "#6C757D"],
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: "bottom" },
            tooltip: {
              callbacks: {
                label: (tooltipItem) => {
                  const dataset = tooltipItem.chart.data.datasets[0];
                  const total = dataset.data.reduce((sum, val) => sum + val, 0);
                  const value = dataset.data[tooltipItem.dataIndex];
                  const percentage = ((value / total) * 100).toFixed(1);
                  return `${percentage}%`;
                },
              },
            },
          },
          onClick: (event, elements) => {
            if (elements.length > 0) {
              const index = elements[0].index;
              const selectedStatus = Object.keys(statusData)[index];
              this.$emit("filter-status", selectedStatus);
            }
          },
        },
      });
    },
  },
};
</script>
