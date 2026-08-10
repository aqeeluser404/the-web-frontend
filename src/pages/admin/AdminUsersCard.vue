<template>
  <q-page class="bg-grey-3">
    <div class="constrain-standard row justify-center q-py-md" v-show="!loading">

      <div class="col-md-3 col-12 full-height"  >
        <q-card :class="$q.screen.lt.sm ? 'q-mb-md' : 'q-mr-md'" class="soft-shadow-card">

          <q-card-section class="row stats-header justify-center">
            <div class="text-h6">User Online Status</div>
            <q-separator class="q-my-sm" style="width: 100%;" />
          </q-card-section>

          <!-- <q-separator /> -->
          <q-card-section class="row justify-center">
            <div style="width: 300px; height: 300px;">
              <canvas ref="userPieChart"></canvas>
            </div>
          </q-card-section>
          <q-card-section>
            <CustomButton label="Add New User" @click="openAddNewUsersDialog" />
          </q-card-section>
        </q-card>
      </div>

      <div class="col-md-9 col-12 full-height">
        <!-- USER TABLE -->
        <q-card bordered class="full-height soft-shadow-card">

          <q-card-section class="row justify-between stats-header items-center">
            <div class="row justify-between items-center full-width">
              <div class="text-h6">Registered Users</div>
              <q-btn @click="downloadData()" size="12px" icon="eva-cloud-download-outline"
                flat rounded />
            </div>
            <q-separator class="q-my-sm" style="width: 100%;" />
          </q-card-section>

          <q-card-section class="row justify-between">
            <q-input filled v-model="search" placeholder="Search" @update:model-value="filterBySearch"
              class="col-12 col-md-9" />
            <q-select v-model="selectedUser" :options="userSelectors" label="User filters"
              @update:model-value="filteredByUserType" class="col-12 col-md-2" />
          </q-card-section>

          <!-- <q-card-section>
            <q-markup-table flat bordered>
              <thead>
                <tr>
                  <th></th>
                  <th class="text-left">Username</th>
                  <th class="text-left">User/Tenant ID</th>
                  <th class="text-left">Email</th>
                  <th class="text-left">Approved Applications</th>
                  <th class="text-left">Type</th>
                  <th class="text-left">Online</th>
                  <th class="text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(user, index) in filteredUsers" :key="user._id" @click="viewUserDetails(user._id)">
                  <td class="text-left cursor-pointer">{{ index + 1 }}</td>
                  <td class="text-left cursor-pointer">{{ user.username }}</td>
                  <td class="text-left cursor-pointer id">{{ user._id }}</td>
                  <td class="text-left cursor-pointer">{{ user.email }}</td>
                  <td class="text-left cursor-pointer" v-if="user.rentals.length > 0">
                    <b>This user has {{ user.rentals.length }} applications(s)</b>
                  </td>
                  <td class="text-left cursor-pointer" v-else>
                    This user has no applications
                  </td>
                  <td class="text-left cursor-pointer" :class="{ 'admin-user': user.userType === 'admin' }">{{
                    user.userType }}</td>
                  <td class="text-center cursor-pointer">
                    <span v-if="user.loginInfo && user.loginInfo.isLoggedIn" class="green-dot"></span>
                    <span v-else class="red-dot"></span>
                  </td>
                  <td class="text-left cursor-pointer">
                    <CustomButton flat color="red" text-color="red" customStyle="width: 15%" icon="eva-trash-outline"
                      @click.stop="deleteUser(user)" />
                  </td>
                </tr>
              </tbody>
            </q-markup-table>
          </q-card-section> -->

          <q-card-section>
            <q-table
              flat bordered :rows="filteredUsers" :columns="userColumns" row-key="_id" @row-click="viewUserDetails"
            >

            <template v-slot:body-cell-index="props">
              <q-td :props="props">
                {{ props.rowIndex + 1 }}
              </q-td>
            </template>

            <!-- Approved Applications -->
            <template v-slot:body-cell-approved="props">
              <q-td :props="props">
                <div v-if="props.row.rentals.length > 0">
                  <b>This user has {{ props.row.rentals.length }} application(s)</b>
                </div>
                <div v-else>
                  This user has no applications
                </div>
              </q-td>
            </template>

            <!-- Type -->
            <template v-slot:body-cell-type="props">
              <q-td :props="props">
                <q-badge
                  :color="props.row.userType === 'admin' ? 'green' : 'grey'"
                  class="q-pa-xs q-px-sm"
                >
                  {{ props.row.userType }}
                </q-badge>
              </q-td>
            </template>

              <template v-slot:body-cell-email="props">
                <q-td :props="props" @click.stop="copyToClipboard(props.row.email)">
                  <div>
                    {{ props.row.email }}
                  </div>
                </q-td>
              </template>


            <!-- Type -->
            <template v-slot:body-cell-rightsType="props">
              <q-td :props="props">
                <div v-if="props.row.rightsType">
                  {{ props.row.rightsType }}
                </div>
                <div v-else>
                  Unassigned
                </div>
              </q-td>
            </template>

            <!-- Online -->
            <template v-slot:body-cell-online="props">
              <q-td :props="props">
                <div class="row justify-center">
                  <span v-if="props.row.loginInfo && props.row.loginInfo.isLoggedIn" class="green-dot"></span>
                  <span v-else class="red-dot"></span>
                </div>
              </q-td>
            </template>

            <template v-slot:body-cell-id="props">
              <q-td :props="props" class="">
                <div class="id">
                    <q-badge
                      color="text-primary"
                      align="middle"
                      class="q-pa-xs q-px-sm"
                    >
                      {{ props.row._id }}
                    </q-badge>
                </div>
              </q-td>
            </template>

            <!-- Actions -->
            <template v-slot:body-cell-actions="props">
              <q-td :props="props" class="text-center">
                <div class="row justify-center">
                  <CustomButton
                    flat
                    color="red"
                    text-color="red"
                    customStyle="width: 15%"
                    icon="eva-trash-outline"
                    @click.stop="deleteUser(props.row)"
                  />
                </div>
              </q-td>
            </template>
            </q-table>
          </q-card-section>

        </q-card>
      </div>
    </div>

    <q-inner-loading :showing="loading" color="primary" size="md" />

    <q-dialog v-model="addUsersDialog">
      <AdminAddUserComponent @close="handleClose" />
    </q-dialog>
  </q-page>
</template>

<script>
import { Chart, PieController, ArcElement, Tooltip, Legend, BarController, BarElement, CategoryScale, LinearScale } from 'chart.js';
Chart.register(PieController, ArcElement, Tooltip, Legend, BarController, BarElement, CategoryScale, LinearScale);

import * as XLSX from 'xlsx';

import UserService from 'src/services/api/UserService';
import CustomButton from 'src/components/elements/CustomButton.vue';
import Helper from 'src/services/utils';
import AdminAddUserComponent from 'src/components/admin/AdminAddUserComponent.vue';
import ExportDataService from 'src/services/api/ExportDataService'

export default {
  name: "AdminUsersCard",

  data() {
    return {
      loading: true,

      userColumns: [
        {
          name: "index",
          label: "#",
          field: "index",
          align: 'center'

        },
        // { name: "username", label: "Username", field: "username", align: 'left' },
        { name: "firstName", label: "First Name", field: "firstName", align: 'left' },
        { name: "lastName", label: "Last Name", field: "lastName", align: 'left' },
        { name: "id", label: "User/Tenant ID", field: "_id", align: 'left' },
        { name: "email", label: "Email", field: "email", align: 'left' },
        { name: "approved", label: "Approved Applications", field: "rentals", align: 'left' },
        { name: "type", label: "Type", field: "userType", align: 'left' },
        { name: "rightsType", label: "Rights", field: "rightsType", align: 'left' },
        { name: "online", label: "Online", field: "loginInfo", align: 'center' },
        { name: "actions", label: "Actions", field: "actions", align: 'center' },
      ],

      users: [],
      search: '',
      filteredUsers: [],
      allUsers: [],
      adminUsers: [], regularUsers: [],

      tenantUsers: [], driverUsers: [], agentUsers: [],

      onlineUsers: [],
      offlineUsers: [],
      // userSelectors: ['All', 'Admin', 'User', 'Tenant', 'Driver', 'Agent', 'Online', 'Offline', ],
      userSelectors: ['All', 'Admin', 'User', 'Tenant', 'Driver', 'Agent' ],
      selectedUser: 'All',
      userPieChart: null,
      loginBarChart: null,
      addUsersDialog: false,
    };
  },
  components: {
    CustomButton,
    AdminAddUserComponent
  },
  methods: {
    formatDate: Helper.formatDate,

    // async downloadData() {
    //   this.$q.dialog({
    //     title: 'Download Data',
    //     message: 'You are about to export all data for users. Would you like to proceed?',
    //     color: 'primary',
    //     cancel: true,
    //     persistent: true
    //   }).onOk(async () => {
    //     try {
    //       const today = new Date().toISOString().split('T')[0];

    //       const response = await ExportDataService.exportUserData();

    //       if (!response || !response.data) {
    //         throw new Error('Invalid response from server');
    //       }

    //       const blob = new Blob([response.data], { type: response.headers['content-type'] });
    //       const url = URL.createObjectURL(blob);
    //       const link = document.createElement('a');
    //       link.href = url;
    //       link.download = `users_export_${today}.xlsx`;
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

    // async downloadData() {
    //   this.$q.dialog({
    //     title: 'Download Data',
    //     message: 'You are about to export all data for users. Would you like to proceed?',
    //     color: 'primary',
    //     cancel: true,
    //     persistent: true
    //   }).onOk(() => {
    //     try {
    //       const today = new Date().toISOString().split('T')[0];

    //       const rows = this.filteredUsers.map((user, index) => ({
    //         'Field No.': index + 1,
    //         Username: user.username,
    //         'User/Tenant ID': user._id,
    //         Email: user.email,
    //         'Applications': user.rentals?.length || 0,
    //         Type: user.userType,
    //         Online: user.loginInfo?.isLoggedIn ? 'Yes' : 'No'
    //       }));

    //       const headers = Object.keys(rows[0]).join(',') + '\n';
    //       const csv = headers + rows.map(r => Object.values(r).join(',')).join('\n');

    //       const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    //       const url = URL.createObjectURL(blob);
    //       const link = document.createElement('a');
    //       link.href = url;
    //       link.download = `users_export_${today}.csv`;
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


    copyToClipboard(text) {
      navigator.clipboard.writeText(text)
        .then(() => {
          this.$q.notify({ type: 'positive', color: 'primary', message: 'Email copied to clipboard!' });
        }).catch(err => {
          this.$q.notify({ type: 'negative', message: `Failed to copy text: ${err}` });
        })
    },

    async downloadData() {
      this.$q.dialog({
        title: 'Download Data',
        message: 'You are about to export all data for users. Would you like to proceed?',
        color: 'primary',
        cancel: true,
        persistent: true
      }).onOk(() => {
        try {
          const today = new Date().toISOString().split('T')[0];

          const rows = this.filteredUsers.map((user, index) => ({
            'Field No.': index + 1,
            Username: user.username,
            'User/Tenant ID': user._id,
            Email: user.email,
            'Applications': user.rentals?.length || 0,
            Type: user.userType,
            Online: user.loginInfo?.isLoggedIn ? 'Yes' : 'No'
          }));

          // Convert JSON to worksheet
          const worksheet = XLSX.utils.json_to_sheet(rows);

          // Create a new workbook and append the worksheet
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'Users');

          // Export to Excel file
          XLSX.writeFile(workbook, `users_export_${today}.xlsx`);

        } catch (error) {
          this.$q.notify({
            type: 'negative',
            message: 'Export failed: ' + (error.message || 'Please try again')
          });
        }
      });
    },

    async findAllUsers() {

        this.loading = true;
        this.users = await UserService.findAllUsers();

        const adminUsersTemp = this.users.filter(user => user.userType === 'admin');
        const regularUsersTemp = this.users.filter(user => user.userType === 'user');

        const tenantUsersTemp = this.users.filter(user => user.rightsType === 'Tenant');
        const driverUsersTemp = this.users.filter(user => user.rightsType === 'Driver');
        const agentUsersTemp = this.users.filter(user => user.rightsType === 'Agent');

        const onlineUsersTemp = this.users.filter(user => user.loginInfo && user.loginInfo.isLoggedIn === true)
        const offlineUsersTemp = this.users.filter(user => user.loginInfo && user.loginInfo.isLoggedIn === false)

        this.allUsers = [...this.users];
        this.adminUsers = adminUsersTemp;
        this.regularUsers = regularUsersTemp;

        this.tenantUsers = tenantUsersTemp;
        this.driverUsers = driverUsersTemp
        this.agentUsers = agentUsersTemp;

        this.onlineUsers = onlineUsersTemp;
        this.offlineUsers = offlineUsersTemp;

        this.filteredUsers = this.allUsers;

        this.updateUserChart();
        this.loading = false;
    },

    // updateLoginBarChart() {
    //   // Sort users by login count (descending) and take top 10
    //   const sortedUsers = [...this.users]
    //     .sort((a, b) => {
    //       const aCount = a.loginInfo?.loginCount || 0;
    //       const bCount = b.loginInfo?.loginCount || 0;
    //       return bCount - aCount;
    //     })
    //     .slice(0, 10);

    //   const labels = sortedUsers.map(user => user.username);
    //   const data = sortedUsers.map(user => user.loginInfo?.loginCount || 0);

    //   if (this.loginBarChart) {
    //     this.loginBarChart.destroy();
    //   }

    //   const ctx = this.$refs.loginBarChart.getContext('2d');
    //   this.loginBarChart = new Chart(ctx, {
    //     type: 'bar',
    //     data: {
    //       labels: labels,
    //       datasets: [{
    //         label: 'Login Count',
    //         data: data,
    //         backgroundColor: '#2196F3',
    //         borderColor: '#0D47A1',
    //         borderWidth: 1,
    //         borderRadius: 4, // Rounded corners for bars
    //       }]
    //     },
    //     options: {
    //       responsive: true,
    //       maintainAspectRatio: false,
    //       layout: {
    //         padding: {
    //           top: 20,
    //           right: 20,
    //           bottom: 20,
    //           left: 20
    //         }
    //       },
    //       scales: {
    //         y: {
    //           beginAtZero: true,
    //           title: {
    //             display: true,
    //             text: 'Number of Logins',
    //             font: {
    //               family: "'Roboto', sans-serif",
    //               size: 12,
    //               weight: 'bold'
    //             }
    //           },
    //           ticks: {
    //             font: {
    //               family: "'Roboto', sans-serif",
    //               size: 10
    //             }
    //           },
    //           grid: {
    //             display: true,
    //             color: 'rgba(0, 0, 0, 0.05)'
    //           }
    //         },
    //         x: {
    //           title: {
    //             display: true,
    //             text: 'Users',
    //             font: {
    //               family: "'Roboto', sans-serif",
    //               size: 12,
    //               weight: 'bold'
    //             }
    //           },
    //           ticks: {
    //             font: {
    //               family: "'Roboto', sans-serif",
    //               size: 10
    //             },
    //             maxRotation: 45, // Rotate labels for better fit
    //             minRotation: 45,
    //             autoSkip: true,
    //             maxTicksLimit: 10 // Limit number of labels on small screens
    //           },
    //           grid: {
    //             display: false
    //           }
    //         }
    //       },
    //       plugins: {
    //         legend: {
    //           labels: {
    //             font: {
    //               family: "'Roboto', sans-serif",
    //               size: 12
    //             },
    //             boxWidth: 12,
    //             padding: 20
    //           }
    //         },
    //         tooltip: {
    //           backgroundColor: 'rgba(0, 0, 0, 0.8)',
    //           titleFont: {
    //             family: "'Roboto', sans-serif",
    //             size: 12,
    //             weight: 'bold'
    //           },
    //           bodyFont: {
    //             family: "'Roboto', sans-serif",
    //             size: 12
    //           },
    //           padding: 10,
    //           callbacks: {
    //             afterLabel: (context) => {
    //               const user = sortedUsers[context.dataIndex];
    //               return `Last login: ${user.loginInfo?.lastLogin ? this.formatDate(user.loginInfo.lastLogin) : 'Never'}`;
    //             }
    //           }
    //         }
    //       },
    //       onClick: (event, elements) => {
    //         if (elements.length > 0) {
    //           const index = elements[0].index;
    //           const userId = sortedUsers[index]._id;
    //           this.viewUserDetails(userId);
    //         }
    //       },
    //       // Adjust chart size based on screen width
    //       aspectRatio: window.innerWidth < 600 ? 1.5 : 2.5
    //     }
    //   });

    //   // Add responsive behavior
    //   window.addEventListener('resize', () => {
    //     if (this.loginBarChart) {
    //       this.loginBarChart.resize();
    //     }
    //   });
    // },

    updateUserChart() {
      const onlineUsers = this.users.filter(user => user.loginInfo && user.loginInfo.isLoggedIn).length;
      const offlineUsers = this.users.length - onlineUsers;

      const labels = [`Online (${onlineUsers})`, `Offline (${offlineUsers})`];
      const data = [onlineUsers, offlineUsers];

      if (this.userPieChart) {
        this.userPieChart.destroy();
      }

      const ctx = this.$refs.userPieChart.getContext('2d');
      this.userPieChart = new Chart(ctx, {
        type: 'pie',
        data: {
          labels: labels,
          datasets: [{
            data: data,
            backgroundColor: ['#4CAF50', '#F44336']
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom'
            },
            // tooltip: {
            //   enabled: true
            // }
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
              const selectedStatus = index === 0 ? 'Online' : 'Offline';
              this.filterUsersByChart(selectedStatus);
            }
          }
        }
      });
    },
    filterBySearch() {
      if (this.search === '') {
        this.selectedUser = 'All';
        this.filteredByUserType();
        return;
      }
      const searchTerm = this.search.toLowerCase();
      this.filteredUsers = this.filteredUsers.filter(user =>
        user.username.toLowerCase().includes(searchTerm) ||
        user.username.toUpperCase().includes(searchTerm) ||
        user.firstName.toLowerCase().includes(searchTerm) ||
        user.firstName.toUpperCase().includes(searchTerm) ||
        user.lastName.toLowerCase().includes(searchTerm) ||
        user.lastName.toUpperCase().includes(searchTerm) ||
        user.phone.toLowerCase().includes(searchTerm) ||
        user.email.toLowerCase().includes(searchTerm) ||
        user.userType.toLowerCase().includes(searchTerm) ||
        user.userType.toUpperCase().includes(searchTerm) ||
        user._id.toLowerCase().includes(searchTerm)
      );
    },

    filterUsersByChart(selectedStatus) {
      if (selectedStatus === 'Online') {
        this.filteredUsers = this.users.filter(user => user.loginInfo && user.loginInfo.isLoggedIn);
      } else {
        this.filteredUsers = this.users.filter(user => !user.loginInfo || !user.loginInfo.isLoggedIn);
      }
      this.selectedUser = selectedStatus; // Sync filter dropdown
    },


    filteredByUserType() {
      if (this.selectedUser === 'All') {
        this.filteredUsers = this.allUsers;
      } else if (this.selectedUser === 'Admin') {
        this.filteredUsers = this.adminUsers;
      } else if (this.selectedUser === 'User') {
        this.filteredUsers = this.regularUsers;
      } else if (this.selectedUser === 'Tenant') {
        this.filteredUsers = this.tenantUsers
      } else if (this.selectedUser === 'Driver') {
        this.filteredUsers = this.driverUsers
      } else if (this.selectedUser === 'Agent') {
        this.filteredUsers = this.agentUsers
      }

      else if (this.selectedUser === 'Online') {
        this.filteredUsers = this.onlineUsers;
      } else if (this.selectedUser === 'Offline') {
        this.filteredUsers = this.offlineUsers;
      }
      else {
        this.filterUsersByChart(this.selectedUser); // Handle chart selection
      }
    },


    async deleteUser(user) {
      if (user.userType === 'admin') {
        this.$q.notify({ type: 'negative', message: 'Deletion is restricted as this user has admin authority.' });
        return;
      }
      // if (user.rentals && user.rentals.length > 0) {
      //   this.$q.notify({ type: 'negative', message: 'Deletion is restricted as this user is tied to a previous rental record.' });
      //   return;
      // }
      this.$q.dialog({
        title: 'Confirm',
        message: `You are about to delete this user. This action is irreversible and will permanently remove all associated rentals (whether active or inactive), call logs, and their data from the database, leaving no record behind. Proceed with caution. Do you wish to continue?`,
        color: 'primary',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        const response = await UserService.deleteUser(user._id);
        if (response) {
          this.$q.notify({ type: 'positive', color: 'primary', message: 'Delete successful!' });
          this.findAllUsers();
        } else {
          this.$q.notify({ type: 'negative', message: 'Delete failed. Please try again.' });
        }
      }).onCancel(() => { });
    },

    viewUserDetails(evt, row) {
      const id = row._id;
      Helper.adminUserDetails(id, this.$router);
    },

    openAddNewUsersDialog() {
      this.addUsersDialog = true
    },
    handleClose() {
      // this.updateDetailsDialog = false
      // this.addUnitsDialog = false;
      this.addUsersDialog = false
      this.findAllUsers();
    },
  },
  created() {

    this.findAllUsers();

  }
};
</script>
