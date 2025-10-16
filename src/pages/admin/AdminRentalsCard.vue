<template>
  <q-page>
    <div class="constrain-standard q-pt-md q-pb-md row justify-center">
      <BedGraphComponent />
    </div>

    <div class="constrain-standard row justify-center q-pb-md">
      <div class="col-md-3 col-12 full-height">
        <q-card flat bordered :class="$q.screen.lt.sm ? 'q-mb-md' : 'q-mr-md'">
          <q-card-section class="row justify-center">
            <div class="text-h6">Rental Status Distribution</div>
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
          <!-- Table Section -->
          <q-card-section class="row justify-between items-center">
            <div class="text-h6">Rental History</div>
            <q-btn @click="downloadData()" class="custom-button" icon="eva-cloud-download-outline"
              flat rounded />
          </q-card-section>

          <q-card-section class="row justify-between">
            <q-input filled v-model="search" placeholder="Search" @update:model-value="filterBySearch"
              class="col-12 col-md-9" />

            <q-select v-model="selectedRentalStatus" :options="rentalStatus" label="Rental Status"
              @update:model-value="filteredByRentalStatus" class="col-12 col-md-2" />
          </q-card-section>

          <q-card-section v-if="rentals.length > 0">
            <q-markup-table flat bordered>
              <thead>
                <tr>
                  <th></th>
                  <th class="text-left">Application Date</th>
                  <th class="text-left">Applicant</th>
                  <th class="text-left">Applicant Contact</th>
                  <th class="text-left">Applicant Email</th>
                  <th class="text-left">Application ID</th>
                  <th class="text-left">Start Date</th>
                  <th class="text-left">End Date</th>
                  <th class="text-left">Before Scheduled</th>
                  <th class="text-left">Condition</th>
                  <th class="text-left">Status</th>
                  <th class="text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(rental, index) in filteredRentals" :key="rental._id" @click="viewUserTimeline(rental._id)">
                  <td class="text-left cursor-pointer">{{ index + 1 }}</td>
                  <td class="text-left cursor-pointer">{{ formatDate(rental.applicationDate) }}</td>
                  <td class="text-left cursor-pointer hover-effect" >
                    <span @click.stop="viewUserDetails(rental.userId)">{{ rental.username }}</span></td>
                  <td class="text-left cursor-pointer">
                    <span @click.stop="copyToClipboard(rental.userPhone)">{{ rental.userPhone }}</span>
                  </td>
                  <td class="text-left cursor-pointer" @click.stop="copyToClipboard(rental.userEmail)">
                    <span @click.stop="copyToClipboard(rental.userEmail)">{{ rental.userEmail }}</span>
                  </td>
                  <td class="text-left cursor-pointer id">{{ rental._id }}</td>
                  <td class="text-left cursor-pointer">
                    <div v-if="!defaultValues(rental)">
                      {{ formatDate(rental.rentalStartDate) }}
                    </div>
                    <div v-else>
                      Being processed...
                    </div>
                  </td>
                  <td class="text-left cursor-pointer">
                    <div v-if="!defaultValues(rental)">
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
                  <td class="text-center cursor-pointer">
                    <div class="column items-center">
                      <q-icon :name="needsAttention(rental) ? 'error' : 'check_circle'"
                        :color="needsAttention(rental) ? 'negative' : 'positive'" size="18px" />
                      <span class="text-caption" :class="needsAttention(rental) ? 'text-negative' : 'text-positive'">
                        {{ needsAttention(rental) ? 'Alert' : 'All Good' }}
                      </span>
                    </div>
                  </td>
                  <td class="text-left cursor-pointer text-uppercase" :class="{ 'pending-status': rental.status === 'Pending' },
                    { 'active-status': rental.status === 'Active' },
                    { 'rejected-status': rental.status === 'Rejected' },
                    { 'ended-status': rental.status === 'Ended' }">
                    {{ capitalizeFirstLetter(rental.status) }}
                  </td>
                  <td class="text-left cursor-pointer">
                    <CustomButton flat color="red" text-color="red" customStyle="width: 15%" icon="eva-trash-outline"
                      @click.stop="deleteRental(rental)" />
                    <CustomButton v-if="rental.status === 'Active'" flat color="red" text-color="red"
                      customStyle="width: 15%" icon="eva-edit-2-outline" @click.stop="openExtendRentalDialog(rental)" />
                    <CustomButton v-if="rental.status === 'Active'" flat color="red" text-color="red"
                      customStyle="width: 15%" icon="eva-archive-outline" @click.stop="endRental(rental)" />
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
    </div>

    <q-dialog v-model="extendRentalDialog">
      <AdminExtendRentalComponent :rental="selectedRental" @close="handleClose" />
    </q-dialog>
  </q-page>
</template>

<script>
import {
  Chart, PieController, BarController, BarElement, ArcElement, Tooltip, Legend,
  LineController, LineElement, PointElement, LinearScale, Title, CategoryScale
} from 'chart.js';
Chart.register(PieController, BarController, BarElement, ArcElement, Tooltip, Legend,
  LineController, LineElement, PointElement, LinearScale, Title, CategoryScale
);
import BedGraphComponent from 'src/components/admin/BedGraphComponent.vue';
import RentalService from 'src/services/RentalService';
import UnitService from 'src/services/UnitService';
import UserService from 'src/services/UserService';
import Helper from 'src/services/utils';
import CustomButton from 'src/components/elements/CustomButton.vue';
import AdminExtendRentalComponent from 'src/components/admin/AdminExtendRentalComponent.vue';
import ExportDataService from 'src/services/ExportDataService';

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
    };
  },
  components: {
    CustomButton,
    AdminExtendRentalComponent,
    BedGraphComponent
  },
  computed: {
    hasBeforeEnd() {
      const hasBeforeEnd = this.rentals.find(rental =>
        (rental?.earlyEndDate && rental.status === 'Ended')
      );
      return hasBeforeEnd;
    }
  },
  methods: {
    formatDate: Helper.formatDate,
    capitalizeFirstLetter: Helper.capitalizeFirstLetter,

    async downloadData() {
      this.$q.dialog({
        title: 'Download Data',
        message: 'You are about to export all data for rentals. Would you like to proceed?',
        color: 'primary',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        try {
          const today = new Date().toISOString().split('T')[0];

          const response = await ExportDataService.exportRentalData();

          if (!response || !response.data) {
            throw new Error('Invalid response from server');
          }

          const blob = new Blob([response.data], { type: response.headers['content-type'] });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `rentals_export_${today}.xlsx`;
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

    needsAttention(rental) {
      if (!rental) return true;
      const emailVerified = rental.userVerification?.isVerified === true;
      const uploadedDocs = Array.isArray(rental.userDocuments) ? rental.userDocuments.map(doc => doc.docType) : [];
      const requiredDocs = ['registration', 'proof_of_address', 'id_or_passport', 'bank_statements', 'credit_check'];
      const documentsComplete = requiredDocs.every(docType => uploadedDocs.includes(docType));
      return !(emailVerified && documentsComplete);
    },

    defaultValues(rental) {
      const toDateOnly = (dateStr) => dateStr?.split('T')[0] || '';
      const today = new Date();
      const nextYear = today.getFullYear() + 1;
      const defaultStart = `${nextYear}-01-01`;
      const defaultEnd = `${nextYear}-12-31`;

      const start = toDateOnly(rental?.rentalStartDate);
      const end = toDateOnly(rental?.rentalEndDate);

      return start === defaultStart && end === defaultEnd;
    },

    copyToClipboard(text) {
      navigator.clipboard.writeText(text)
        .then(() => {
          this.$q.notify({ type: 'positive', color: 'primary', message: 'Copied to clipboard!' });
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
          userId: user._id,
          userEmail: user.email,
          userPhone: user.phone,
          userVerification: user.verification,
          userDocuments: user.documents || []
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
      }).onCancel(() => { });
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
