<template>
  <q-page>
    <div class="q-pa-md row justify-center">

      <q-card flat bordered class="col-md-3 col-12 q-ma-sm full-height">
        <!-- Pie Chart Section -->
        <q-card-section class="row justify-center">
          <div class="text-h6">Rental Status Distribution</div>
        </q-card-section>
        <q-separator />
        <q-card-section class="row justify-center">
          <div style="width: 300px; height: 300px;">
            <canvas ref="pieChart"></canvas>
          </div>
        </q-card-section>
        <q-card-section class="row justify-center">
          <!-- <q-toggle
            v-model="showAllStatuses"
            label="Show All Statuses"
            @update:model-value="updateChart"
          /> -->
        </q-card-section>
      </q-card>

      <q-card flat bordered class="col-md-8 col-12 q-ma-sm full-height">
        <!-- Table Section -->
        <q-card-section class="row justify-center">
          <div class="text-h6">Rental History</div>
        </q-card-section>

        <q-card-section class="row justify-between">
          <q-input filled v-model="search" placeholder="Search" @update:model-value="filterBySearch" class="col-12 col-md-9" />

          <q-select
            v-model="selectedRentalStatus"
            :options="rentalStatus"
            label="Rental Status"
            @update:model-value="filteredByRentalStatus"
            class="col-12 col-md-2"
          />
        </q-card-section>

        <q-card-section v-if="rentals.length > 0">
          <q-markup-table flat bordered>
            <thead>
              <tr>
                <th></th>
                <th class="text-left">Application Date</th>
                <th class="text-left">Applicant</th>
                <!-- <th class="text-left">Access Key</th> -->
                <th class="text-left">Application ID</th>
                <th class="text-left">Start Date</th>
                <th class="text-left">End Date</th>
                <th class="text-left">Before Scheduled</th>
                <!-- <th class="text-left">Rental Price</th> -->
                <!-- <th class="text-left">Unit Type</th> -->
                <th class="text-left">Status</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(rental, index) in filteredRentals" :key="rental._id" @click="viewUserTimeline(rental._id)">
                <td class="text-left cursor-pointer">{{ index + 1 }}</td>
                <td class="text-left cursor-pointer">{{ formatDate(rental.applicationDate) }}</td>
                <td class="text-left cursor-pointer hover-effect" @click.stop="viewUserDetails(rental.userId)">{{ rental.username }}</td>
                <td class="text-left cursor-pointer id">{{ rental._id }}</td>
                <!-- <td class="text-left cursor-pointer">
                  <div v-if="rental.accessKey" @click.stop="copyToClipboard(rental.accessKey)" style="text-transform: uppercase; cursor: pointer; color: brown;">
                    <b>{{ rental.accessKey }}</b>
                  </div>
                  <div v-else>
                    N/A
                  </div>
                </td> -->
                <td class="text-left cursor-pointer">
                  <div v-if="rental.rentalStartDate !== null">
                    {{ formatDate(rental.rentalStartDate) }}
                  </div>
                  <div v-else>
                    Being processed...
                  </div>
                </td>
                <td class="text-left cursor-pointer">
                  <div v-if="rental.rentalEndDate !== null">
                    {{ formatDate(rental.rentalEndDate) }}
                  </div>
                  <div v-else>
                    Being processed...
                  </div>
                </td>
                <td class="text-left cursor-pointer">
                  <div v-if="rental.earlyEndDate !== null" style="text-decoration: underline;">
                    {{ formatDate(rental.earlyEndDate) }}
                  </div>
                  <div v-else>
                    N/A
                  </div>
                </td>
                <!-- <td class="text-left cursor-pointer">R {{ rental.rentalPrice }}.00</td> -->
                <!-- <td class="text-left cursor-pointer">{{ capitalizeFirstLetter(rental.unitType) }}</td> -->
                <td class="text-left cursor-pointer text-uppercase" :class="
                    { 'pending-status': rental.status === 'Pending'},
                    { 'active-status': rental.status === 'Active'},
                    { 'rejected-status': rental.status === 'Rejected'},
                    { 'ended-status': rental.status === 'Ended'}"
                  >
                    {{ capitalizeFirstLetter(rental.status) }}
                </td>
                <td class="text-left cursor-pointer">
                  <CustomButton flat color="red" text-color="red" customStyle="width: 15%" icon="eva-trash-outline" @click.stop="deleteRental(rental)" />
                  <CustomButton v-if="rental.status === 'Active'" flat color="red" text-color="red" customStyle="width: 15%" icon="eva-edit-2-outline" @click.stop="openExtendRentalDialog(rental)" />
                  <CustomButton v-if="rental.status === 'Active'" flat color="red" text-color="red" customStyle="width: 15%" icon="eva-archive-outline" @click.stop="endRental(rental)" />
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card-section>

        <q-card-section v-else class="row justify-center">
          <q-item>
            <q-item-section class="text-subtitle1">No rental has been placed yet.</q-item-section>
          </q-item>
        </q-card-section>
      </q-card>
    </div>

    <q-dialog v-model="extendRentalDialog">
      <AdminExtendRentalComponent :rental="selectedRental" @close="handleClose" />
    </q-dialog>
  </q-page>
</template>

<script>
import { Chart, PieController, ArcElement, Tooltip, Legend } from 'chart.js';
Chart.register(PieController, ArcElement, Tooltip, Legend);

import RentalService from 'src/services/RentalService';
import UnitService from 'src/services/UnitService';
import UserService from 'src/services/UserService';
import Helper from 'src/services/utils';
import CustomButton from 'src/components/elements/CustomButton.vue';
import AdminExtendRentalComponent from 'src/components/admin/AdminExtendRentalComponent.vue';

export default {
  name: "AdminRentalsCard",

  data() {
    return {
      rentals: [],
      search: '',
      filteredRentals: [],
      approvedRentals: [],
      pendingRentals: [],
      rejectedRentals: [],
      endedRentals: [],
      currentRentals: [],
      extendRentalDialog: false,
      selectedRental: null,
      rentalStatus: ['All', 'Approved', 'Pending', 'Rejected', 'Ended'],
      selectedRentalStatus: 'All',
      showAllStatuses: true,
      pieChart: null
    };
  },
  components: {
    CustomButton,
    AdminExtendRentalComponent
  },
  methods: {
    formatDate: Helper.formatDate,
    capitalizeFirstLetter: Helper.capitalizeFirstLetter,

    copyToClipboard(text) {
      navigator.clipboard.writeText(text)
        .then(() => {
          this.$q.notify({ type: 'positive', color: 'primary', message: 'Access key copied to clipboard!' });
        }).catch(err => {
          this.$q.notify({ type: 'negative', message: `Failed to copy text: ${err}` });
        })
    },

    async findAllRentals() {
      const response = await RentalService.findAllRentals();

      this.rentals = await Promise.all(response.map(async rental => {
        const unit = await UnitService.getByIdUnit(rental.unit);
        const user = await UserService.findUserById(rental.user);
        return {
          ...rental,
          unitType: unit.unitType,
          username: user.username,
          userId: user._id
        };
      }));

      const filteredRentals = this.rentals.filter(rental => rental.status === 'Pending' || rental.status === 'Active' || rental.status === 'Rejected' || rental.status === 'Ended');

      this.currentRentals = filteredRentals;
      this.approvedRentals = filteredRentals.filter(rental => rental.status === 'Active');
      this.pendingRentals = filteredRentals.filter(rental => rental.status === 'Pending');
      this.rejectedRentals = filteredRentals.filter(rental => rental.status === 'Rejected');
      this.endedRentals = filteredRentals.filter(rental => rental.status === 'Ended');

      this.filteredByRentalStatus();
      this.updateChart();
    },

    updateChart() {
      const statusData = this.showAllStatuses
        ? {
            Active: this.approvedRentals.length,
            Pending: this.pendingRentals.length,
            Rejected: this.rejectedRentals.length,
            Ended: this.endedRentals.length
          }
        : {
            Active: this.approvedRentals.length,
            Ended: this.endedRentals.length
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
              '#4CAF50', // Green for Approved/Active
              '#CC5500', // Yellow for Pending
              '#F44336', // Red for Rejected
              '#6C757D'  // Grey for Ended
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
          },
          onClick: (event, elements) => {
            if (elements.length > 0) {
              const index = elements[0].index;
              const selectedStatus = Object.keys(statusData)[index];
              this.filterRentalsByChart(selectedStatus);
            }
          }
        }
      });
    },

    viewUserDetails(id) {
      Helper.adminUserDetails(id, this.$router);
    },

    filterBySearch() {
      const searchTerm = this.search.toLowerCase();

      const base = this.selectedRentalStatus === 'All'
        ? this.currentRentals
        : this.filteredRentals;

      if (this.search === '') {
        this.filteredByRentalStatus();
        return;
      }

      this.filteredRentals = base.filter(rental =>
        rental.username?.toLowerCase().includes(searchTerm) ||
        rental.unitType?.toLowerCase().includes(searchTerm) ||
        rental.status?.toLowerCase().includes(searchTerm) ||
        rental.applicationDate?.toLowerCase().includes(searchTerm) ||
        rental.rentalStartDate?.toLowerCase().includes(searchTerm) ||
        rental.rentalEndDate?.toLowerCase().includes(searchTerm) ||
        rental.earlyEndDate?.toLowerCase().includes(searchTerm) ||
        rental._id?.toLowerCase().includes(searchTerm)
      );
    },


    filterRentalsByChart(selectedStatus) {
      this.selectedRentalStatus = selectedStatus; // Sync dropdown filter

      if (selectedStatus === 'Approved') {
        this.filteredRentals = this.approvedRentals;
      } else if (selectedStatus === 'Pending') {
        this.filteredRentals = this.pendingRentals;
      } else if (selectedStatus === 'Rejected') {
        this.filteredRentals = this.rejectedRentals;
      } else if (selectedStatus === 'Ended') {
        this.filteredRentals = this.endedRentals;
      } else {
        this.filteredRentals = this.currentRentals;
      }
    },

    filteredByRentalStatus() {
      if (this.selectedRentalStatus === 'All') {
        this.filteredRentals = this.currentRentals;
      } else {
        this.filterRentalsByChart(this.selectedRentalStatus);
      }
    },

    openExtendRentalDialog(rental) {
      this.selectedRental = rental;
      this.extendRentalDialog = true;
    },

    handleClose() {
      this.extendRentalDialog = false;
      this.findAllRentals();
    },

    async deleteRental(rental) {
      this.$q.dialog({
        title: 'Confirm',
        message: `You are about to delete this rental application. This action is irreversible and will permanently remove the entry from the associated user, unit rented history and the database, leaving no record behind. Proceed with caution. Do you wish to continue?`,
        color: 'primary',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        const response = await RentalService.deleteRental(rental._id);
        if (response) {
          this.$q.notify({ type: 'positive', color: 'primary', message: 'Delete successful!' });
          this.findAllRentals();
        } else {
          this.$q.notify({ type: 'negative', message: 'Delete failed. Please try again.' });
        }
      }).onCancel(() => {});
    },

    async endRental(rental) {
      if (rental.status === 'Active') {
        this.$q.dialog({
          title: 'Confirm',
          message: 'You are about to terminate this rental application before the agreement end date. Do you wish to proceed?',
          color: 'primary',
          cancel: true,
          persistent: true
        }).onOk(async () => {
          const response = await RentalService.endRental(rental._id);
          if (response) {
            this.$q.notify({ type: 'positive', color: 'primary', message: 'Rental Ended successful!' });
            this.findAllRentals();
          } else {
            this.$q.notify({ type: 'negative', message: 'End rental failed. Please try again.' });
          }
        });
      } else {
        this.$q.notify({ type: 'negative', message: 'End rental failed. You can only end an active rental.' });
      }
    },
    viewUserTimeline(id) {
      Helper.adminRentalDetails(id, this.$router);
    },

  },
  created() {
    this.findAllRentals();
  }
};
</script>
