<template>
  <q-page class="bg-grey-3">
    <div class="constrain-standard row justify-center q-py-md" v-show="!loading">
      <div class="col-md-3 col-12 full-height">
        <q-card :class="$q.screen.lt.sm ? 'q-mb-md' : 'q-mr-md'" class="soft-shadow-card">
          <q-card-section class="row stats-header justify-center">
            <div class="text-h6">Call Log Status Distribution</div>
            <q-separator class="q-my-sm" style="width: 100%;" />
          </q-card-section>
          <q-card-section class="row justify-center">
            <div style="width: 300px; height: 300px;">
              <canvas ref="pieChart"></canvas>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <!-- heading -->
      <div class="col-md-9 col-12 full-height">
        <q-card class="full-height soft-shadow-card">
          <q-card-section class="row justify-between items-center stats-header">
            <div class="row justify-between items-center full-width">
              <div class="text-h6">Call Log History</div>
              <q-btn @click="downloadData()" class="custom-button" icon="eva-cloud-download-outline" flat rounded />
            </div>
            <q-separator class="q-my-sm" style="width: 100%;" />
          </q-card-section>
          <q-card-section class="row justify-between">
            <q-input filled v-model="search" placeholder="Search" @update:model-value="filterBySearch"
              class="col-12 col-md-9" />
            <q-select v-model="selectedCallLogStatus" :options="callLogStatus" label="Call Log Status"
              @update:model-value="filteredByCallLogStatus" class="col-12 col-md-2" />
          </q-card-section>

          <q-card-section>
            <q-table flat bordered :rows="filteredCallLogs" :columns="callLogColumns" row-key="_id">
              <template v-slot:body-cell-index="props">
                <q-td :props="props">
                  {{ props.rowIndex + 1 }}
                </q-td>
              </template>

              <template v-slot:body-cell-logNumber="props">
                <q-td :props="props" class="cursor-pointer">
                  <q-badge color="text-primary" align="middle" class="q-pa-xs q-px-sm">
                    <div @click.stop="copyToClipboard(props.row.logNumber)">
                      {{ props.row.logNumber }}
                    </div>
                  </q-badge>
                </q-td>
              </template>

              <template v-slot:body-cell-unit="props">
                <q-td :props="props">
                  <div v-if="props.row.unit">
                    {{ props.row.unit }}
                  </div>
                  <div v-else class="row justify-center">N/A</div>
                </q-td>
              </template>

              <template v-slot:body-cell-description="props">
                <q-td :props="props">
                  <div v-if="props.row.description" class="text-left" style="white-space: normal;">
                    {{ props.row.description }}
                  </div>
                  <div v-else class="row justify-center">
                    N/A
                  </div>
                </q-td>
              </template>

              <template v-slot:body-cell-summary="props">
                <q-td :props="props">
                  <div v-if="props.row.summary" class="text-left" style="white-space: normal;">
                    {{ props.row.summary }}
                  </div>
                  <div v-else class="row justify-center">
                    N/A
                  </div>
                </q-td>
              </template>

              <template v-slot:body-cell-status="props">
                <q-td :props="props">
                  <q-badge :color="props.row.status === 'Opened'
                      ? 'orange'
                      : props.row.status === 'Assigned'
                        ? 'blue'
                        : props.row.status === 'Resolved'
                          ? 'green'
                          : props.row.status === 'Closed'
                            ? 'grey'

                            : 'red'
                    " align="middle" class="q-pa-xs q-px-sm">
                    {{ props.row.status }}
                  </q-badge>
                </q-td>
              </template>

              <template v-slot:body-cell-createdAt="props">
                <q-td :props="props">
                  <div v-if="props.row.createdAt">
                    {{ formatDate(props.row.createdAt) }}
                  </div>
                  <div v-else class="row justify-center">N/A</div>
                </q-td>
              </template>

              <template v-slot:body-cell-closedAt="props">
                <q-td :props="props">
                  <div v-if="props.row.closedAt">
                    {{ formatDate(props.row.closedAt) }}
                  </div>
                  <div v-else class="row justify-center">N/A</div>
                </q-td>
              </template>

              <template v-slot:body-cell-vendorType="props">
                <q-td :props="props">
                  <div v-if="props.row.vendorInfo && props.row.vendorInfo.vendorType">
                    {{ props.row.vendorInfo.vendorType }}
                  </div>
                  <div v-else class="row justify-center">N/A</div>
                </q-td>
              </template>

              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <div class="row justify-center items-center q-gutter-sm no-wrap">



                    <CustomButton :disable="props.row.status === 'Closed'" flat color="red" text-color="red"
                      class="inline-btn" icon="eva-edit-2-outline" @click.stop="openUpdateCallLogDialog(props.row)" />

                    <CustomButton :disable="props.row.status !== 'Assigned'" @click.stop="sendEmailToVendor(props.row)"
                      flat color="red" text-color="red" class="inline-btn" icon="eva-email-outline" />

                    <CustomButton :disable="props.row.status !== 'Resolved'" @click.stop="closeCallLog(props.row._id)"
                      flat color="red" text-color="red" class="inline-btn" icon="eva-archive-outline" />

                    <CustomButton flat color="red" text-color="red" class="inline-btn" icon="eva-trash-outline"
                      @click.stop="deleteCallLog(props.row)" />
                  </div>
                </q-td>
              </template>
            </q-table>

          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-inner-loading :showing="loading" color="primary" size="md" />
    <q-dialog v-model="updateCallLogDialog" :maximized="$q.screen.lt.sm ? true : false">
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

import CallLogService from "src/services/api/CallLogService";
import Helper from 'src/services/helper/utils';
import CustomButton from 'src/components/elements/CustomButton.vue';
import UserService from 'src/services/api/UserService';
import AdminUpdateCallLogComponent from 'src/components/admin/AdminUpdateCallLogComponent.vue';
import EmailService from 'src/services/api/EmailService';
import ExportDataService from 'src/services/api/ExportDataService'
import AdminUpdateCallLogNotes from 'src/components/admin/AdminUpdateCallLogNotes.vue';
import RentalService from 'src/services/api/RentalService';

export default {
  data() {
    return {
      loading: true,


      callLogColumns: [
        { name: "index", label: "#", field: "index", align: 'center' },
        { name: "logNumber", label: "Log Number", field: "logNumber", align: 'left' },
        { name: "firstName", label: "First Name", field: "firstName", align: 'left' },
        { name: "lastName", label: "Last Name", field: "lastName", align: 'left' },
        { name: "unit", label: "Unit", field: "unit", align: 'left' },
        { name: "description", label: "Description", field: "description", align: 'left' },
        { name: "summary", label: "Summary", field: "summary", align: 'left' },

        { name: "createdAt", label: "Opened Date", field: "createdAt", align: 'left' },
        { name: "closedAt", label: "Closed Date", field: "closedAt", align: 'left' },
        { name: "callType", label: "Call Type", field: "callType", align: 'left' },
        { name: "status", label: "Status", field: "status", align: 'center' },
        { name: "vendorType", label: "Vendor Type", field: "vendorType", align: 'left' },
        { name: "actions", label: "Actions", field: "actions", align: 'center' },
      ],

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
      this.loading = true
      const response = await CallLogService.findAllCallLogs()

      // console.log(response)
      this.callLogs = await Promise.all(response.map(async callLog => {
        try {
          const user = await UserService.findUserById(callLog.user)
          return {
            ...callLog,
            firstName: user?.firstName || 'Unknown',
            lastName: user?.lastName || 'User',
            vendorType: callLog.vendorInfo?.vendorType
          }
        } catch (error) {
          console.warn(`User not found for ID: ${callLog.user}`, error)
          return {
            ...callLog,
            firstName: 'Unknown',
            lastName: 'User',
            vendorType: callLog.vendorInfo?.vendorType
          }
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
      this.loading = false
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
