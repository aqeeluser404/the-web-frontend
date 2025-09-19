<template>
  <q-page>
    <div class="q-pa-md row justify-center">

      <!-- NEW LOGIN COUNT BAR CHART SECTION -->
      <!-- <q-card flat bordered class="col-md-11 col-12 q-ma-sm">
        <q-card-section class="row justify-center">
          <div class="text-h6">User Login Activity</div>
        </q-card-section>
        <q-separator />
        <q-card-section class="row justify-center ">
          <div style="width: 100%; height: 300px;">
            <canvas ref="loginBarChart"></canvas>
          </div>
        </q-card-section>
      </q-card> -->

      <div class="row justify-center full-height" style="width: 100%;">
        <!-- Pie Chart Section -->
        <q-card flat bordered class="col-md-3 col-12 q-ma-sm full-height">
          <q-card-section class="row justify-center">
            <div class="text-h6">User Online Status</div>
          </q-card-section>
          <q-separator />
          <q-card-section class="row justify-center">
            <div style="width: 300px; height: 300px;">
              <canvas ref="userPieChart"></canvas>
            </div>

          </q-card-section>

          <q-card-section>
            <CustomButton label="Add New User" @click="openAddNewUsersDialog" />
          </q-card-section>
        </q-card>

        <!-- USER TABLE -->
        <q-card flat bordered class="col-md-8 col-12 q-ma-sm full-height">
          <q-card-section class="row justify-center">
            <div class="text-h6">Registered Users</div>
          </q-card-section>
          <q-card-section class="row justify-between">
            <q-input filled v-model="search" placeholder="Search" @update:model-value="filterBySearch"
              class="col-12 col-md-9" />
            <q-select v-model="selectedUser" :options="userSelectors" label="User filters"
              @update:model-value="filteredByUserType" class="col-12 col-md-2" />
          </q-card-section>

          <q-card-section>
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
          </q-card-section>
        </q-card>
      </div>
    </div>
    <q-dialog v-model="addUsersDialog">
      <AdminAddUserComponent @close="handleClose" />
    </q-dialog>
  </q-page>
</template>

<script>
import { Chart, PieController, ArcElement, Tooltip, Legend, BarController, BarElement, CategoryScale, LinearScale } from 'chart.js';
Chart.register(PieController, ArcElement, Tooltip, Legend, BarController, BarElement, CategoryScale, LinearScale);

import UserService from 'src/services/UserService';
import CustomButton from 'src/components/elements/CustomButton.vue';
import Helper from 'src/services/utils';
import AdminAddUserComponent from 'src/components/admin/AdminAddUserComponent.vue';

export default {
  name: "AdminUsersCard",

  data() {
    return {
      users: [],
      search: '',
      filteredUsers: [],
      allUsers: [],
      adminUsers: [],
      regularUsers: [],
      userSelectors: ['All', 'Admin', 'User'],
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
    async findAllUsers() {
      this.users = await UserService.findAllUsers();
      const adminUsersTemp = this.users.filter(user => user.userType === 'admin');
      const regularUsersTemp = this.users.filter(user => user.userType === 'user');
      this.allUsers = [...this.users];
      this.adminUsers = adminUsersTemp;
      this.regularUsers = regularUsersTemp;
      this.filteredUsers = this.allUsers;
      this.updateUserChart();
      // this.updateLoginBarChart();
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
        user.userType.toLowerCase().includes(searchTerm) ||
        user.userType.toUpperCase().includes(searchTerm)
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
      } else {
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

    viewUserDetails(id) {
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
