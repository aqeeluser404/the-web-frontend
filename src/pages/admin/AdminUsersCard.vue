<template>
  <q-page>
    <div class="q-pa-md row justify-center">

      <q-card flat bordered class="col-md-3 col-12 q-ma-sm full-height">
        <!-- Pie Chart Section -->
        <q-card-section class="row justify-center">
          <div class="text-h6">User Online Status</div>
        </q-card-section>
        <q-separator />
        <q-card-section class="row justify-center">
          <div style="width: 300px; height: 300px;">
            <canvas ref="userPieChart"></canvas>
          </div>
        </q-card-section>
      </q-card>

      <!-- USER TABLE -->
      <q-card flat bordered class="col-md-8 col-12 q-ma-sm full-height">
        <q-card-section class="row justify-center">
          <div class="text-h6">Registered Users</div>
        </q-card-section>
        <q-card-section class="row justify-between">
          <q-input filled v-model="search" placeholder="Search" @update:model-value="filterBySearch" class="col-12 col-md-9" />
          <q-select
            v-model="selectedUser"
            :options="userSelectors"
            label="User filters"
            @update:model-value="filteredByUserType"
            class="col-12 col-md-2"
          />
        </q-card-section>
        <q-card-section>
          <q-markup-table flat bordered>
            <thead>
              <tr>
                <th></th>
                <th class="text-left">Creation Date</th>
                <th class="text-left">Username</th>
                <th class="text-left">Email</th>
                <th class="text-left">Approved Applications</th>
                <th class="text-left">Type</th>
                <th class="text-left">Online</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody v-for="(user, index) in filteredUsers" :key="user._id">
              <tr @click="viewUserDetails(user._id)">
                <td class="text-left cursor-pointer">{{ index + 1 }}</td>
                <td class="text-left cursor-pointer">{{ formatDate(user.dateCreated) }}</td>
                <td class="text-left cursor-pointer">{{ user.username }}</td>
                <td class="text-left cursor-pointer">{{ user.email }}</td>
                <td class="text-left cursor-pointer" v-if="user.rentals.length > 0">
                  <b>This user has {{ user.rentals.length }} applications(s)</b>
                </td>
                <td class="text-left cursor-pointer" v-else>
                  This user has no applications
                </td>
                <td class="text-left cursor-pointer" :class="{ 'admin-user': user.userType === 'admin'}">{{ user.userType }}</td>
                <td class="text-center cursor-pointer">
                  <span v-if="user.loginInfo && user.loginInfo.isLoggedIn" class="green-dot"></span>
                  <span v-else class="red-dot"></span>
                </td>
                <td class="text-left cursor-pointer">
                  <CustomButton flat color="red" text-color="red" customStyle="width: 15%" icon="eva-trash-outline" @click.stop="deleteUser(user)" />
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(PieController, ArcElement, Tooltip, Legend);

import UserService from 'src/services/UserService';
import CustomButton from 'src/components/elements/CustomButton.vue';
import Helper from 'src/services/utils';

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
      userPieChart: null
    };
  },
  components: {
    CustomButton
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
    },

    updateUserChart() {
      const onlineUsers = this.users.filter(user => user.loginInfo && user.loginInfo.isLoggedIn).length;
      const offlineUsers = this.users.length - onlineUsers;

      const data = {
        labels: ['Online', 'Offline'],
        datasets: [{
          data: [onlineUsers, offlineUsers],
          backgroundColor: ['#4CAF50', '#F44336']
        }]
      };

      if (this.userPieChart) {
        this.userPieChart.destroy();
      }

      const ctx = this.$refs.userPieChart.getContext('2d');
      this.userPieChart = new Chart(ctx, {
        type: 'pie',
        data: data,
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

    filteredByUserType() {
      if (this.selectedUser === 'All') {
        this.filteredUsers = this.allUsers;
      } else if (this.selectedUser === 'Admin') {
        this.filteredUsers = this.adminUsers;
      } else if (this.selectedUser === 'User') {
        this.filteredUsers = this.regularUsers;
      }
    },

    async deleteUser(user) {
      if (user.userType === 'admin') {
        this.$q.notify({ type: 'negative', message: 'Deletion is restricted as this user has admin authority.' });
        return;
      }
      if (user.rentals && user.rentals.length > 0) {
        this.$q.notify({ type: 'negative', message: 'Deletion is restricted as this user is tied to a previous rental record.' });
        return;
      }
      this.$q.dialog({
        title: 'Confirm',
        message: 'You are about to delete this user, continue?',
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
      }).onCancel(() => {});
    },

    viewUserDetails(id) {
      Helper.adminUserDetails(id, this.$router);
    }
  },
  created() {
    this.findAllUsers();
  }
};
</script>
