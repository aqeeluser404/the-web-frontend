<template>
  <q-page>
    <div class="q-pa-md row justify-center">
      <q-card flat bordered class="col-md-3 col-12 q-ma-sm full-height">
        <q-card-section class="row justify-center">
          <div class="text-h6">Incident Nature Distribution</div>
        </q-card-section>
        <q-separator />
        <q-card-section class="row justify-center">
          <div style="width: 300px; height: 300px;">
            <canvas ref="pieChart"></canvas>
          </div>
        </q-card-section>
      </q-card>

      <q-card flat bordered class="col-md-8 col-12 q-ma-sm full-height">
        <q-card-section class="row justify-center">
          <div class="text-h6">Incident History</div>
        </q-card-section>
        <q-card-section class="row justify-between">
          <q-input filled v-model="search" placeholder="Search" @update:model-value="filterBySearch" class="col-12 col-md-9" />
          <q-select
            v-model="selectedIncidentNature"
            :options="incidentNatures"
            label="Filter by Nature"
            @update:model-value="filterByNature"
            class="col-12 col-md-2"
          />
        </q-card-section>
        <q-card-section v-if="incidents.length > 0">
          <q-markup-table flat bordered>
            <thead>
              <tr>
                <th></th>
                <th class="text-left">Log Number</th>
                <th class="text-left">First Name</th>
                <th class="text-left">Last Name</th>
                <th class="text-left">Email</th>
                <th class="text-left">Phone</th>
                <th class="text-left">Incident Nature</th>
                <th class="text-left">Created Date</th>
                <th class="text-left">Location</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(incident, index) in filteredIncidents" :key="incident._id">
                <td class="text-left">{{ index + 1 }}</td>
                <td class="text-left">{{ incident.logNumber }}</td>
                <td class="text-left">{{ incident.firstName }}</td>
                <td class="text-left">{{ incident.lastName }}</td>
                <td class="text-left">{{ incident.email }}</td>
                <td class="text-left">{{ incident.phone }}</td>
                <td class="text-left">{{ incident.incidentNature }}</td>
                <td class="text-left">{{ formatDate(incident.createdAt) }}</td>
                <td class="text-left">{{ incident.location }}</td>
                <td class="text-left">
                  <CustomButton flat color="red" text-color="red" customStyle="width: 15%" icon="eva-trash-outline" @click="deleteIncident(incident)" />
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card-section>
        <q-card-section v-else>
          <q-card flat>
            <q-card-section class="row justify-center">
              <q-item>
                <q-item-section class="text-subtitle1">No incidents have been reported yet.</q-item-section>
              </q-item>
            </q-card-section>
          </q-card>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(PieController, ArcElement, Tooltip, Legend);

import IncidentService from 'src/services/api/IncidentService';
import Helper from 'src/services/helper/utils';
import CustomButton from 'src/components/elements/CustomButton.vue';

export default {
  data() {
    return {
      search: '',
      incidents: [],
      filteredIncidents: [],
      selectedIncidentNature: 'All',
      incidentNatures: [
        'All',
        'Noise',
        'Damage to property',
        'Trespassing',
        'Disrespect',
        'Assault',
        'Theft',
        'Other'
      ],
      pieChart: null
    }
  },
  components: {
    CustomButton
  },
  methods: {
    formatDate: Helper.formatDate,

    async getAllIncidents() {
      try {
        const response = await IncidentService.findAllIncidents();
        // Ensure we're working with an array
        this.incidents = Array.isArray(response) ? response : [];
        this.filteredIncidents = [...this.incidents];
        this.updateChart();
      } catch (error) {
        console.error('Error fetching incidents:', error);
        this.incidents = [];
        this.filteredIncidents = [];
        this.$q.notify({ type: 'negative', message: 'Failed to load incidents' });
      }
    },

updateChart() {
  // Ensure we have valid data
  if (!Array.isArray(this.incidents)) {
    console.error('Incidents data is not an array');
    return;
  }

  // Initialize counts for all possible natures
  const natureCounts = {
    'Noise': 0,
    'Damage to property': 0,
    'Trespassing': 0,
    'Disrespect': 0,
    'Assault': 0,
    'Theft': 0,
    'Other': 0
  };

  // Count incidents by nature
  this.incidents.forEach(incident => {
    const nature = incident?.incidentNature || 'Other';
    if (natureCounts.hasOwnProperty(nature)) {
      natureCounts[nature]++;
    } else {
      natureCounts['Other']++;
    }
  });

  // Prepare chart data
  const labels = Object.keys(natureCounts).map(nature =>
    `${nature} (${natureCounts[nature]})`
  );
  const data = Object.values(natureCounts);

  // Destroy previous chart if exists
  if (this.pieChart) {
    this.pieChart.destroy();
  }

  // Create new chart
  const ctx = this.$refs.pieChart.getContext('2d');
  this.pieChart = new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: [
          '#FF6384', '#36A2EB', '#FFCE56',
          '#4BC0C0', '#9966FF', '#FF9F40',
          '#8AC24A'
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { position: 'bottom' },
        tooltip: {
          callbacks: {
            label: function(tooltipItem) {
              const total = tooltipItem.dataset.data.reduce((a, b) => a + b, 0);
              const value = tooltipItem.raw;
              const percentage = ((value / total) * 100).toFixed(1);
              return `${percentage}%`;
            }
          }
        }
      }
    }
  });
},

    async deleteIncident(incident) {
      this.$q.dialog({
        title: 'Confirm',
        message: `You are about to delete this incident report. This action is irreversible. Proceed?`,
        color: 'primary',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        const response = await IncidentService.deleteIncident(incident._id);
        if (response) {
          this.$q.notify({ type: 'positive', message: 'Incident deleted successfully!' });
          await this.getAllIncidents();
        } else {
          this.$q.notify({ type: 'negative', message: 'Failed to delete incident.' });
        }
      });
    }
  },
  created() {
    this.getAllIncidents();
  }
}
</script>
