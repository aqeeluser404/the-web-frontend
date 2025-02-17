<template>
  <q-page>
    <div class="q-pa-md row justify-center">

      <q-card flat bordered class="col-md-9 col-11 q-ma-sm">

        <q-card-section class="row justify-center">
          <div class="text-h6">Registered Users</div>
        </q-card-section>

        <q-card-section class="row justify-between">

          <q-input filled v-model="search" placeholder="Search" @update:model-value="filterBySearch" class="col-12 col-md-9" />

          <q-select
            filled
            v-model="selectedUser"
            :options="userSelectors"
            label="User filters"
            @update:model-value="filteredByUserType"
            class="col-12 col-md-3"
          />
        </q-card-section>
        <q-card-section>
          <q-markup-table flat bordered>
            <thead>
              <tr>
                <th></th>
                <th class="text-left">First Name</th>
                <th class="text-left">Last Name</th>
                <th class="text-left">Email</th>
                <th class="text-left">Approved Applications</th>
                <th class="text-left">Username</th>
                <th class="text-left">Account Type</th>
                <th class="text-left">Online</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody v-for="(user, index) in filteredUsers" :key="user._id">
              <tr @click="viewUserDetails(user._id)">
                <td class="text-left cursor-pointer">{{ index + 1 }}</td>
                <td class="text-left cursor-pointer">{{ user.firstName }}</td>
                <td class="text-left cursor-pointer">{{ user.lastName }}</td>
                <td class="text-left cursor-pointer">{{ user.email }}</td>

                <td class="text-left cursor-pointer" v-if="user.rentals.length > 0">
                  <b>This user has {{ user.rentals.length }} approved rental(s)</b>
                </td>
                <td class="text-left cursor-pointer" v-else>
                  This user has no approved rentals
                </td>

                <td class="text-left cursor-pointer">{{ user.username }}</td>
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
import UserService from 'src/services/UserService';
import CustomButton from 'src/components/elements/CustomButton.vue';
import Helper from 'src/services/utils'


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
      selectedUser: ['All']
    }
  },
  components: {
    CustomButton
  },
  methods: {

    async findAllUsers() {
      // First get all users from the service
      this.users = await UserService.findAllUsers();

      // Then filter based on user types
      const adminUsersTemp = this.users.filter(user => user.userType === 'admin');
      const regularUsersTemp = this.users.filter(user => user.userType === 'user');

      // Assign the filtered arrays to properties
      this.allUsers = [...this.users];  // Create a copy of all users for filtering (if needed)
      this.adminUsers = adminUsersTemp;
      this.regularUsers = regularUsersTemp;
      this.filteredUsers = this.allUsers

    },

    async deleteUser(user) {
      if (user.userType === 'admin') {
        this.$q.notify({ type: 'negative', message: 'Deletion is restricted as this user has admin authority.' })
        return
      }
      if (user.rentals && user.rentals.length > 0) {
        this.$q.notify({ type: 'negative', message: 'Deletion is restricted as this user is tied to a previous rental record.' })
        return
      }
      this.$q.dialog({
        title: 'Confirm', message: 'You are about to delete this user, continue?', color: 'primary', cancel: true, persistent: true
      }).onOk(async () => {
        const response = await UserService.deleteUser(user._id)
        if (response) {
          this.$q.notify({ type: 'positive', color: 'primary', message: 'Delete successful!' })
          this.findAllUsers()
        } else {
          this.$q.notify({ type: 'negative', message: 'Delete failed. Please try again.' })
        }
      }).onCancel(() => {})
    },

    filterBySearch() {
      if (this.search === '') {
        this.selectedUser = 'All'
        this.filteredByUserType()
        return
      }
      const searchTerm = this.search.toLowerCase()
      this.filteredUsers = this.filteredUsers.filter(user =>
        user.username.toLowerCase().includes(searchTerm) ||
        user.username.toUpperCase().includes(searchTerm) ||
        user.firstName.toLowerCase().includes(searchTerm) ||
        user.firstName.toUpperCase().includes(searchTerm) ||
        user.lastName.toLowerCase().includes(searchTerm) ||
        user.lastName.toUpperCase().includes(searchTerm) ||
        user.userType.toLowerCase().includes(searchTerm) ||
        user.userType.toUpperCase().includes(searchTerm)
      )
    },

    filteredByUserType() {
      if (this.selectedUser === 'All') {
        this.filteredUsers = this.allUsers
      } else if (this.selectedUser === 'Admin') {
        this.filteredUsers = this.adminUsers
      } else if (this.selectedUser === 'User') {
        this.filteredUsers = this.regularUsers
      }
      // else if (this.selectedUser === 'Paid') {
      //   this.filteredUsers = this.paidUsers
      // }
      // else if (this.selectedUser === 'Not Paid') {
      //   this.filteredUsers = this.notPaidUsers
      // }
    },
    viewUserDetails(id) {
      Helper.adminUserDetails(id, this.$router)
    }

  },
  created() {
    this.findAllUsers()
  }
}
</script>
