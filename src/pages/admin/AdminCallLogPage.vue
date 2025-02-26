<template>
  <q-page>
    <div class="q-pa-md row justify-center">
      <q-card flat bordered class="col-md-3 col-12 q-ma-sm full-height">
        <!-- Pie Chart Section -->
        <q-card-section class="row justify-center">
          <div class="text-h6">Call Log Status Distribution</div>
        </q-card-section>
        <q-separator />
        <q-card-section class="row justify-center">
          <div style="width: 300px; height: 300px;">
            <canvas ref="pieChart"></canvas>
          </div>
        </q-card-section>
        <q-card-section class="row justify-center">
          <q-toggle
            v-model="showAllStatuses"
            label="Show All Statuses"
            @update:model-value="updateChart"
          />
        </q-card-section>
      </q-card>

      <q-card flat bordered class="col-md-8 col-12 q-ma-sm full-height">
        <q-card-section class="row justify-center">
          <div class="text-h6">Call Log History</div>
        </q-card-section>
        <q-card-section class="row justify-between">
          <q-input filled v-model="search" placeholder="Search" @update:model-value="filterBySearch" class="col-12 col-md-9" />
          <q-select
            v-model="selectedCallLogStatus"
            :options="callLogStatus"
            label="Call Log Status"
            @update:model-value="filteredByCallLogStatus"
            class="col-12 col-md-2"
          />
        </q-card-section>
        <q-card-section v-if="callLogs.length > 0">
          <q-markup-table flat bordered>
            <thead>
              <tr>
                <th></th>
                <th class="text-left">Log Date</th>
                <th class="text-left">Log Time</th>
                <th class="text-left">Applicant</th>
                <!-- <th class="text-left">Description</th> -->
                <th class="text-left">Call Type </th>
                <th class="text-left">Status</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(callLog, index) in filteredCallLogs"  :key="callLog._id">
                <td class="text-left cursor-pointer">{{ index + 1 }}</td>
                <td class="text-left cursor-pointer">{{ formatDate(callLog.createdAt) }}</td>
                <td class="text-left cursor-pointer">{{ formatTime(callLog.createdAt) }}</td>
                <td class="text-left cursor-pointer">{{ callLog.username }}</td>
                <!-- <td class="text-left cursor-pointer limit-text">{{ callLog.description }}</td> -->
                <td class="text-left cursor-pointer">{{ callLog.callType }}</td>
                <td class="text-left cursor-pointer text-uppercase" :class="{ 'active-status': callLog.status === 'Resolved'}, { 'ended-status': callLog.status === 'Pending'}"><b>{{ callLog.status }}</b></td>
                <td class="text-left cursor-pointer">
                  <CustomButton flat color="red" text-color="red" customStyle="width: 15%" icon="eva-trash-outline" @click="deleteCallLog(callLog)" />
                  <CustomButton v-if="callLog.status !== 'Resolved'" flat color="red" text-color="red" customStyle="width: 15%" icon="eva-file-text-outline" @click="openUpdateCallLogDialog(callLog)" />
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card-section>
        <q-card-section v-else>
          <q-card flat>
            <q-card-section class="row justify-center">
              <q-item>
                <q-item-section class="text-subtitle1">No call log has been placed yet.</q-item-section>
              </q-item>
            </q-card-section>
          </q-card>
        </q-card-section>
      </q-card>
    </div>

    <q-dialog v-model="updateCallLogDialog">
      <AdminUpdateCallLogComponent :callLog="selectedCallLog" @close="handleDialogClose" />
    </q-dialog>
  </q-page>
</template>

<script>
import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(PieController, ArcElement, Tooltip, Legend);

import CallLogService from 'src/services/CallLogService';
import Helper from 'src/services/utils';
import CustomButton from 'src/components/elements/CustomButton.vue';
import UserService from 'src/services/UserService';
import AdminUpdateCallLogComponent from 'src/components/admin/AdminUpdateCallLogComponent.vue';

export default {
  data() {
    return {
      updateCallLogDialog: false,
      selectedCallLog: null,


      search: '',
      callLogs: [],
      filteredCallLogs: [],
      pendingCallLogs: [],
      inProgressCallLogs: [],
      resolvedCallLogs: [],
      currentCallLogs: [],
      callLogStatus: ['All', 'Pending', 'In Progress', 'Resolved'],
      selectedCallLogStatus: 'All',
      showAllStatuses: false,
      pieChart: null
    }
  },
  components: {
    CustomButton,
    AdminUpdateCallLogComponent
  },
  methods: {
    formatDate: Helper.formatDate,
    formatTime: Helper.formatTime,
    capitalizeFirstLetter: Helper.capitalizeFirstLetter,

    async getAllCallLogs() {
      const response = await CallLogService.findAllCallLogs()

      this.callLogs = await Promise.all(response.map(async callLog => {
        const user = await UserService.findUserById(callLog.user)
        return {
          ...callLog,
          username: user.username
        }
      }))

      const filteredCallLogs = this.callLogs.filter(callLog => callLog.status === 'Pending' || callLog.status === 'In Progress' || callLog.status === 'Resolved' )

      this.currentCallLogs = filteredCallLogs
      this.pendingCallLogs = filteredCallLogs.filter(callLog => callLog.status === 'Pending')
      this.inProgressCallLogs = filteredCallLogs.filter(callLog => callLog.status === 'In Progress')
      this.resolvedCallLogs = filteredCallLogs.filter(callLog => callLog.status === 'Resolved')

      this.filteredByCallLogStatus()
      this.updateChart()
    },

    filteredByCallLogStatus() {
      if (this.selectedCallLogStatus === 'All') {
        this.filteredCallLogs = this.currentCallLogs
      } else if (this.selectedCallLogStatus === 'Pending') {
        this.filteredCallLogs = this.pendingCallLogs
      } else if (this.selectedCallLogStatus === 'In Progress') {
        this.filteredCallLogs = this.inProgressCallLogs
      } else if (this.selectedCallLogStatus === 'Resolved') {
        this.filteredCallLogs = this.resolvedCallLogs
      }
    },

    filterBySearch() {
      if (this.search === '') {
        this.selectedCallLogStatus = 'All',
        this.filteredByCallLogStatus()
        return
      }
      const searchTerm = this.search.toLowerCase()
      this.filteredCallLogs = this.filteredCallLogs.filter(callLog =>
        callLog.username.toLowerCase().includes(searchTerm) ||
        callLog.username.toUpperCase().includes(searchTerm) ||
        callLog.callType.toLowerCase().includes(searchTerm) ||
        callLog.callType.toUpperCase().includes(searchTerm) ||
        // callLog.description.toLowerCase().includes(searchTerm) ||
        // callLog.description.toUpperCase().includes(searchTerm) ||
        callLog.createdAt.toLowerCase().includes(searchTerm) ||
        callLog.createdAt.toUpperCase().includes(searchTerm) ||
        callLog.status.toLowerCase().includes(searchTerm) ||
        callLog.status.toUpperCase().includes(searchTerm)
      )
    },

    async deleteCallLog(callLog) {
      // if (callLog.status === 'Resolved') {
      //   this.$q.notify({ type: 'negative', message: 'Deletion is restricted as this call log is tied to this user call log history.' });
      //   return;
      // }
      this.$q.dialog({
        title: 'Confirm',
        message: `You are about to delete this call log, continue?`,
        color: 'primary',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        const response = await CallLogService.deleteCallLog(callLog._id);
        if (response) {
          this.$q.notify({ type: 'positive', color: 'primary', message: 'Call log has been deleted successfully!' });
          await this.getAllCallLogs()
        } else {
          this.$q.notify({ type: 'negative', message: 'Delete call log failed. Please try again.' });
        }
      }).onCancel(() => {});
    },

    openUpdateCallLogDialog(callLog) {
      this.updateCallLogDialog = true
      this.selectedCallLog = callLog
    },

    handleDialogClose() {
      this.updateCallLogDialog = false
      this.getAllCallLogs()
    },

    updateChart() {
      const statusData = this.showAllStatuses
        ? {
            Pending: this.pendingCallLogs.length,
            'In Progress': this.inProgressCallLogs.length,
            Resolved: this.resolvedCallLogs.length
          }
        : {
            Pending: this.pendingCallLogs.length,
            Resolved: this.resolvedCallLogs.length
          };

      const labels = Object.keys(statusData);
      const data = Object.values(statusData);

      if (this.pieChart) {
        this.pieChart.destroy();
      }

      const ctx = this.$refs.pieChart.getContext('2d');
      this.pieChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: [
              '#F44336', // Yellow for Pending
              '#4CAF50',  // Green for Resolved
              '#FF9800', // Orange for In Progress

            ]
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            },
            tooltip: {
              enabled: true
            }
          }
        }
      });
    }
  },
  created() {
    this.getAllCallLogs()
  }
}
</script>
