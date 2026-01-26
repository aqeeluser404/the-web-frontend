<template>
  <q-page>
    <div class="constrain-standard row justify-center q-py-md">

      <div class="col-md-3 col-12 full-height">
        <q-card flat bordered :class="$q.screen.lt.sm ? 'q-mb-md' : 'q-mr-md'">

          <q-card-section class="row justify-center">
            <div class="text-h6">Call Log Status Distribution</div>
          </q-card-section>
          <q-separator />
          <q-card-section class="row justify-center">
            <div style="width: 300px; height: 300px;">
              <canvas ref="pieChart"></canvas>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-md-9 col-12 full-height">
        <q-card flat bordered class="full-height">
          <q-card-section class="row justify-between items-center">
            <div class="text-h6">Call Log History</div>
            <q-btn @click="downloadData()" class="custom-button" icon="eva-cloud-download-outline"
              flat rounded />
          </q-card-section>
          <q-card-section class="row justify-between">
            <q-input filled v-model="search" placeholder="Search" @update:model-value="filterBySearch"
              class="col-12 col-md-9" />
            <q-select v-model="selectedCallLogStatus" :options="callLogStatus" label="Call Log Status"
              @update:model-value="filteredByCallLogStatus" class="col-12 col-md-2" />
          </q-card-section>
          <q-card-section v-if="callLogs.length > 0">
            <q-markup-table flat bordered>
              <thead>
                <tr>
                  <th></th>
                  <th class="text-left">Log Number</th>
                  <th class="text-left">Applicant</th>
                  <th class="text-left">Opened Date</th>
                  <th class="text-left">Closed Date</th>
                  <th class="text-left">Call Type </th>
                  <th class="text-left">Status</th>
                  <th class="text-left">Vendor</th>
                  <th class="text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(callLog, index) in filteredCallLogs" @click.stop="openUpdateCallLogNotesDialog(callLog)"
                  :key="callLog._id">
                  <td class="text-left cursor-pointer">{{ index + 1 }}</td>
                  <td class="text-left cursor-pointer id">{{ callLog.logNumber }}</td>
                  <td class="text-left cursor-pointer hover-effect" @click.stop="viewUserDetails(callLog.user)">{{
                    callLog.username }}</td>
                  <td class="text-left cursor-pointer">{{ formatDate(callLog.createdAt) }}</td>
                  <td class="text-left cursor-pointer">
                    <div v-if="callLog.closedAt">
                      {{ formatDate(callLog.closedAt) }}
                    </div>
                    <div v-else>N/A</div>
                  </td>
                  <td class="text-left cursor-pointer">{{ callLog.callType }}</td>
                  <td class="text-left cursor-pointer text-uppercase" :class="{ 'callLog-opened': callLog.status === 'Opened' },
                    { 'callLog-assigned': callLog.status === 'Assigned' },
                    { 'callLog-resolved': callLog.status === 'Resolved' },
                    { 'callLog-closed': callLog.status === 'Closed' }">
                    {{ callLog.status }}
                  </td>

                  <td class="text-left cursor-pointer">
                    <div v-if="callLog.vendorInfo && callLog.vendorInfo.vendorType">
                      {{ callLog.vendorInfo.vendorType }}
                    </div>
                    <div v-else>N/A</div>
                  </td>
                  <td class="text-left cursor-pointer">
                    <CustomButton flat color="red" text-color="red" customStyle="width: 15%" icon="eva-trash-outline"
                      @click.stop="deleteCallLog(callLog)" />
                    <CustomButton v-if="callLog.status !== 'Closed'" flat color="red" text-color="red"
                      customStyle="width: 15%" icon="eva-edit-2-outline"
                      @click.stop="openUpdateCallLogDialog(callLog)" />
                    <CustomButton v-if="callLog.status === 'Assigned'" @click.stop="sendEmailToVendor(callLog)" flat
                      color="red" text-color="red" customStyle="width: 15%" icon="eva-email-outline" />
                    <CustomButton v-if="callLog.status === 'Resolved'" @click.stop="closeCallLog(callLog._id)" flat
                      color="red" text-color="red" customStyle="width: 15%" icon="eva-archive-outline" />
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
    </div>

    <q-dialog v-model="updateCallLogDialog">
      <AdminUpdateCallLogComponent :callLog="selectedCallLog" @close="handleDialogClose" />
    </q-dialog>

    <q-dialog v-model="updateCallLogNotesDialog">
      <AdminUpdateCallLogNotes :callLog="selectedCallLog" @close="handleDialogClose" />
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
import EmailService from 'src/services/EmailService';
import ExportDataService from 'src/services/ExportDataService';
import AdminUpdateCallLogNotes from 'src/components/admin/AdminUpdateCallLogNotes.vue';

export default {
  data() {
    return {
      updateCallLogDialog: false,
      updateCallLogNotesDialog: false,
      selectedCallLog: null,

      search: '',
      callLogs: [],
      filteredCallLogs: [],

      openedCallLogs: [],
      assignedCallLogs: [],
      resolvedCallLogs: [],
      closedCallLogs: [],

      currentCallLogs: [],

      callLogStatus: ['All', 'Opened', 'Assigned', 'Resolved', 'Closed'],
      selectedCallLogStatus: 'All',
      showAllStatuses: true,
      pieChart: null
    }
  },
  components: {
    CustomButton,
    AdminUpdateCallLogComponent, AdminUpdateCallLogNotes
  },
  methods: {
    formatDate: Helper.formatDate,
    formatTime: Helper.formatTime,
    capitalizeFirstLetter: Helper.capitalizeFirstLetter,

    // async downloadData() {
    //   this.$q.dialog({
    //     title: 'Download Data',
    //     message: 'You are about to export all data for calllogs. Would you like to proceed?',
    //     color: 'primary',
    //     cancel: true,
    //     persistent: true
    //   }).onOk(async () => {
    //     try {
    //       const today = new Date().toISOString().split('T')[0];

    //       const response = await ExportDataService.exportCalllogData();

    //       if (!response || !response.data) {
    //         throw new Error('Invalid response from server');
    //       }

    //       const blob = new Blob([response.data], { type: response.headers['content-type'] });
    //       const url = URL.createObjectURL(blob);
    //       const link = document.createElement('a');
    //       link.href = url;
    //       link.download = `calllogs_export_${today}.xlsx`;
    //       document.body.appendChild(link);
    //       link.click();
    //       document.body.removeChild(link);
    //       setTimeout(() => URL.revokeObjectURL(url), 100);

    //     } catch (error) {
    //       this.$q.notify({
    //         type: 'negative',
    //         message: 'Export failed: ' + (error.message || 'Please try again')
    //       });
    //     }
    //   });
    // },

    async downloadData() {
      this.$q.dialog({
        title: 'Download Data',
        message: 'You are about to export all call log history data. Would you like to proceed?',
        color: 'primary',
        cancel: true,
        persistent: true
      }).onOk(() => {
        try {
          const today = new Date().toISOString().split('T')[0];

          const rows = this.filteredCallLogs.map((callLog, index) => ({
            'Field No.': index + 1,
            'Log Number': callLog.logNumber || '',
            'Applicant': callLog.username || 'Unassigned',
            'Opened Date': this.formatDate(callLog.createdAt) || '',
            'Closed Date': callLog.closedAt ? this.formatDate(callLog.closedAt) : 'N/A',
            'Call Type': callLog.callType || 'N/A',
            'Status': callLog.status || 'N/A',
            'Vendor': callLog.vendorInfo?.vendorType || 'N/A'
          }));

          const safeRow = row => Object.values(row).map(val => `"${val}"`).join(',');
          const headers = Object.keys(rows[0]).map(h => `"${h}"`).join(',') + '\n';
          const csv = headers + rows.map(safeRow).join('\n');

          const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `call_logs_export_${today}.csv`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setTimeout(() => URL.revokeObjectURL(url), 100);

        } catch (error) {
          this.$q.notify({
            type: 'negative',
            message: 'Export failed: ' + (error.message || 'Please try again')
          });
        }
      });
    },

    async getAllCallLogs() {
      const response = await CallLogService.findAllCallLogs()

      this.callLogs = await Promise.all(response.map(async callLog => {
        const user = await UserService.findUserById(callLog.user)
        return {
          ...callLog,
          username: user.username
        }
      }))

      this.currentCallLogs = [...this.callLogs]
      this.filteredCallLogs = [...this.filteredCallLogs]
      // const filteredCallLogs = this.callLogs.filter(callLog => callLog.status === 'Opened' || callLog.status === 'Assigned' || callLog.status === 'Resolved' || callLog.status === 'Closed' )

      this.openedCallLogs = this.callLogs.filter(callLog => callLog.status === 'Opened')
      this.assignedCallLogs = this.callLogs.filter(callLog => callLog.status === 'Assigned')
      this.resolvedCallLogs = this.callLogs.filter(callLog => callLog.status === 'Resolved')
      this.closedCallLogs = this.callLogs.filter(callLog => callLog.status === 'Closed')

      this.filteredByCallLogStatus()
      this.updateChart()
    },

    filteredByCallLogStatus() {
      if (this.selectedCallLogStatus === 'All') {
        this.filteredCallLogs = this.currentCallLogs;
      } else {
        this.filterCallLogsByChart(this.selectedCallLogStatus);
      }
    },

    filterBySearch() {
      const searchTerm = this.search.toLowerCase();

      // If search is empty, reset filter to selected status
      if (!searchTerm) {
        this.selectedCallLogStatus = 'All';
        this.filteredByCallLogStatus();
        return;
      }

      // Use the full filtered list based on selected status
      const baseList = this.selectedCallLogStatus === 'All'
        ? this.callLogs  // your original list of all call logs
        : this.filteredCallLogs;

      this.filteredCallLogs = baseList.filter(callLog => {
        const logNumber = callLog.logNumber?.toLowerCase() || '';
        const vendorType = callLog.vendorInfo?.vendorType?.toLowerCase() || '';
        const username = callLog.username?.toLowerCase() || '';
        const callType = callLog.callType?.toLowerCase() || '';
        const createdAt = callLog.createdAt?.toLowerCase() || '';
        const closedAt = callLog.closedAt?.toLowerCase() || '';
        const status = callLog.status?.toLowerCase() || '';
        // const description = callLog.description?.toLowerCase() || '';

        return (
          logNumber.includes(searchTerm) ||
          vendorType.includes(searchTerm) ||
          username.includes(searchTerm) ||
          callType.includes(searchTerm) ||
          createdAt.includes(searchTerm) ||
          closedAt.includes(searchTerm) ||
          status.includes(searchTerm)
          // || description.includes(searchTerm)
        );
      });
    },

    updateChart() {
      // Always show all statuses (removed the toggle logic)
      const statusData = {
        Opened: this.openedCallLogs.length,
        Assigned: this.assignedCallLogs.length,
        Resolved: this.resolvedCallLogs.length,
        Closed: this.closedCallLogs.length
      };

      // Labels now include count in brackets
      const labels = Object.keys(statusData).map(status => `${status} (${statusData[status]})`);
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
              '#CC5500', // Orange for Opened
              '#007BFF', // Blue for Assigned
              '#28A745', // Green for Resolved
              '#6C757D'  // Grey for Closed
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
              callbacks: {
                label: function (tooltipItem) {
                  const dataset = tooltipItem.chart.data.datasets[0];
                  const total = dataset.data.reduce((sum, val) => sum + val, 0);
                  const value = dataset.data[tooltipItem.dataIndex];
                  const percentage = ((value / total) * 100).toFixed(1);
                  // const label = tooltipItem.chart.data.labels[tooltipItem.dataIndex] || '';
                  return `${percentage}%`;
                }
              }
            }
          },
          onClick: (event, elements) => {
            if (elements.length > 0) {
              const index = elements[0].index;
              const selectedStatus = Object.keys(statusData)[index];
              this.filterCallLogsByChart(selectedStatus);
            }
          }
        }
      });
    },

    filterCallLogsByChart(selectedStatus) {
      this.selectedCallLogStatus = selectedStatus; // Sync dropdown filter

      if (selectedStatus === 'Opened') {
        this.filteredCallLogs = this.openedCallLogs;
      } else if (selectedStatus === 'Assigned') {
        this.filteredCallLogs = this.assignedCallLogs;
      } else if (selectedStatus === 'Resolved') {
        this.filteredCallLogs = this.resolvedCallLogs;
      } else if (selectedStatus === 'Closed') {
        this.filteredCallLogs = this.closedCallLogs;
      } else {
        this.filteredCallLogs = this.currentCallLogs;
      }
    },

    viewUserDetails(id) {
      Helper.adminUserDetails(id, this.$router);
    },

    async deleteCallLog(callLog) {
      // if (callLog.status === 'Resolved') {
      //   this.$q.notify({ type: 'negative', message: 'Deletion is restricted as this call log is tied to this user call log history.' });
      //   return;
      // }
      this.$q.dialog({
        title: 'Confirm',
        message: `You are about to delete this call log. This action is irreversible and will permanently remove the entry from the associated user and the database, leaving no record behind. Proceed with caution. Do you wish to continue?`,
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
      }).onCancel(() => { });
    },

    async sendEmailToVendor(callLog) {


      this.$q.dialog({
        title: 'Confirm',
        message: `You are about to notify this vendor about the issue recorded in this call log. Continue?`,
        color: 'primary',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        try {
          await EmailService.SendVendorEmail(callLog.user, callLog._id);

          this.$q.notify({
            type: 'positive',
            color: 'primary',
            message: 'Notification has been sent successfully.'
          });
          await this.getAllCallLogs()
        } catch (error) {
          console.error(error);
          this.$q.notify({ type: 'negative', message: 'Failed to send this call log notification.' });
        }
      }).onCancel(() => { });
    },

    async closeCallLog(callLogId) {
      const updatedCallLog = {
        status: 'Closed',
        closedAt: new Date()
        // do not spread this.callLog directly
      };

      this.$q.dialog({
        title: 'Confirm',
        message: `You are about to close this call log. Please note that this action will permanently archive the entry, disabling vendor assignments and further modifications. Do you wish to proceed?`,
        color: 'primary',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        try {
          await CallLogService.updateCallLog(callLogId, updatedCallLog);

          this.$q.notify({
            type: 'positive',
            color: 'primary',
            message: 'Call log marked as been closed.'
          });
          await this.getAllCallLogs()
        } catch (error) {
          console.error(error);
          this.$q.notify({ type: 'negative', message: 'Failed to resolve call log.' });
        }
      }).onCancel(() => { });
    },

    openUpdateCallLogDialog(callLog) {
      this.updateCallLogDialog = true
      this.selectedCallLog = callLog
    },
    openUpdateCallLogNotesDialog(callLog) {
      this.updateCallLogNotesDialog = true
      this.selectedCallLog = callLog
    },

    handleDialogClose() {
      this.updateCallLogDialog = false
      this.updateCallLogNotesDialog = false
      this.getAllCallLogs()
    },

  },
  created() {
    this.getAllCallLogs()
  }
}
</script>
