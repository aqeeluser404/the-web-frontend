<template>
  <q-page class="bg-grey-3">


    <div class="constrain-standard q-pt-md q-pb-md row justify-center" v-show="!loading">
      <BedGraphComponent />
    </div>

    <div class="constrain-standard row justify-center q-pb-md" v-show="!loading">
      <div class="col-md-3 col-12 full-height">
        <q-card :class="$q.screen.lt.sm ? 'q-mb-md' : 'q-mr-md'" class="soft-shadow-card">
          <q-card-section class="row stats-header justify-center">
            <div class="text-h6">Rental Status Distribution</div>
            <q-separator class="q-my-sm" style="width: 100%;" />
          </q-card-section>
          <!-- <q-separator /> -->
          <q-card-section class="row justify-center">
            <div style="width: 300px; height: 300px;">
              <canvas ref="pieChart"></canvas>
            </div>
          </q-card-section>
        </q-card>
      </div>

      <div class="col-md-9 col-12 full-height">
        <q-card class="full-height soft-shadow-card">
          <!-- Table Section -->
          <q-card-section class="row justify-between items-center stats-header">
            <div class="row justify-between items-center full-width">
              <div class="text-h6">Rental History</div>
              <!-- <q-btn @click="syncRentals()" label="Sync Rentals" class="custom-button"
                flat rounded /> -->
              <q-btn @click="downloadData()" class="custom-button" icon="eva-cloud-download-outline"
                flat rounded />
            </div>
            <q-separator class="q-my-sm" style="width: 100%;" />
          </q-card-section>

          <q-card-section class="row justify-between">
            <q-input filled v-model="search" placeholder="Search" @update:model-value="filterBySearch"
              class="col-12 col-md-9" />

            <q-select v-model="selectedRentalStatus" :options="rentalStatus" label="Rental Status"
              @update:model-value="filteredByRentalStatus" class="col-12 col-md-2" />
          </q-card-section>

          <!-- <q-card-section v-if="rentals.length > 0">
            <q-markup-table flat bordered>
              <thead>
                <tr>
                  <th></th>
                  <th class="text-left">Application Date</th>
                  <th class="text-left">Applicant</th>
                  <th class="text-left">Applicant Contact</th>
                  <th class="text-left">Applicant Email</th>
                  <th class="text-left">Application ID</th>
                  <th class="text-left">Floor Level</th>
                  <th class="text-left">Unit Type</th>
                  <th class="text-left">Start Date</th>
                  <th class="text-left">End Date</th>
                  <th class="text-left">Before Scheduled</th>

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
                    <span>{{ rental.userPhone }}</span>
                  </td>
                  <td class="text-left cursor-pointer">
                    <span>{{ rental.userEmail }}</span>
                  </td>
                  <td class="text-left cursor-pointer id">{{ rental._id }}</td>
                  <td class="text-center cursor-pointer">{{ extractFirstNumber(rental.selectedSubUnits?.bedType || rental.selectedSubUnits?.roomType) }}</td>
                  <td class="text-left cursor-pointer">{{ rental.selectedSubUnits.bedType || rental.selectedSubUnits.roomType }}</td>
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
          </q-card-section> -->

          <q-card-section>
            <q-table
              flat bordered :rows="filteredRentals" :columns="rentalColumns" row-key="_id" @row-click="viewUserTimeline"
            >
              <template v-slot:body-cell-index="props">
                <q-td :props="props">
                  {{ props.rowIndex + 1 }}
                </q-td>
              </template>

              <template v-slot:body-cell-applicationDate="props">
                <q-td :props="props">
                  <div>
                    {{ formatDate(props.row.applicationDate) }}
                  </div>
                </q-td>
              </template>

              <!-- <template v-slot:body-cell-applicant="props">
                <q-td :props="props">
                  <div @click.stop="viewUserDetails(props.row.userId)">
                    {{ capitalizeFirstLetter(props.row.username) }}
                  </div>
                </q-td>
              </template> -->

              <template v-slot:body-cell-id="props">
                <q-td :props="props">
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

              <template v-slot:body-cell-floorLevel="props">
                <q-td :props="props">
                  <div class="text-center">
                    {{ extractFirstNumber(props.row.selectedSubUnits?.bedType || props.row.selectedSubUnits?.roomType) }}
                  </div>
                </q-td>
              </template>

              <template v-slot:body-cell-unitType="props">
                <q-td :props="props">
                  <div>
                    {{ props.row.selectedSubUnits.bedType || props.row.selectedSubUnits.roomType }}
                  </div>
                </q-td>
              </template>

              <template v-slot:body-cell-startDate="props">
                <q-td :props="props">
                  <div v-if="defaultValues(props.row)">
                    Being Processed...
                  </div>
                  <div v-else>
                    {{ formatDate(props.row.rentalStartDate) }}
                  </div>
                </q-td>
              </template>


              <template v-slot:body-cell-endDate="props">
                <q-td :props="props">
                  <div v-if="defaultValues(props.row)">
                    Being Processed...
                  </div>
                  <div v-else>
                    {{ formatDate(props.row.rentalEndDate) }}
                  </div>
                </q-td>
              </template>

               <template v-slot:body-cell-beforeScheduled="props">
                <q-td :props="props">
                  <div v-if="props.row.earlyEndDate !== null" style="text-decoration: underline;">
                    {{ formatDate(props.row.earlyEndDate) }}
                  </div>
                  <div v-else>
                    N/A
                  </div>
                </q-td>
              </template>

              <template v-slot:body-cell-status="props">
                <q-td :props="props">
                  <q-badge
                    :color="
                      props.row.status === 'Active'
                        ? 'green'
                        : props.row.status === 'Pending'
                          ? 'orange'
                          : props.row.status === 'Rejected'
                            ? 'red'
                            : props.row.status === 'Ended'
                              ? 'grey'

                              : 'red'
                    "
                    align="middle"
                    class="q-pa-xs q-px-sm"
                  >
                    {{ props.row.status }}
                  </q-badge>
                </q-td>
              </template>

              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <div class="row justify-center items-center q-gutter-sm no-wrap">
                    <CustomButton
                      flat
                      color="red"
                      text-color="red"
                      class="inline-btn"
                      icon="eva-trash-outline"
                      @click.stop="deleteRental(props.row)"
                    />

                    <CustomButton
                      :disable="props.row.status !== 'Active'"
                      flat
                      color="red"
                      text-color="red"
                      class="inline-btn"
                      icon="eva-edit-2-outline"
                      @click.stop="openExtendRentalDialog(props.row)"
                    />

                    <CustomButton
                      :disable="props.row.status !== 'Active'"
                      flat
                      color="red"
                      text-color="red"
                      class="inline-btn"
                      icon="eva-archive-outline"
                      @click.stop="endRental(props.row)"
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

import * as XLSX from 'xlsx';

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
      loading: true,
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
      rentalStatus: ['All', 'Active', 'Pending', 'Rejected', 'Ended'],
      selectedRentalStatus: 'All',
      showAllStatuses: true,

      rentalColumns: [
        { name: "index", label: "#", field: "index", align: 'center' },
        { name: "applicationDate", label: "Application Date", field: "applicationDate", align: 'left' },
        // { name: "applicant", label: "Username", field: "username", align: 'left' },
        { name: "userFirstName", label: "First Name", field: "userFirstName", align: 'left' },
        { name: "userLastName", label: "Last Name", field: "userLastName", align: 'left' },
        { name: "applicantContact", label: "Applicant Contact", field: "userPhone", align: 'left' },
        { name: "applicantEmail", label: "Applicant Email", field: "userEmail", align: 'left' },
        { name: "id", label: "Application ID", field: "_id", align: 'left' },
        { name: "floorLevel", label: "Floor Level", field: "selectedSubUnits", align: 'center' },
        { name: "unitType", label: "Unit Type", field: "selectedSubUnits", align: 'left' },
        { name: "startDate", label: "Start Date", field: "rentalStartDate", align: 'left' },
        { name: "endDate", label: "End Date", field: "rentalEndDate", align: 'left' },
        { name: "beforeScheduled", label: "Before Scheduled", field: "earlyEndDate", align: 'left' },
        { name: "status", label: "Status", field: "status", align: 'center' },
        { name: "actions", label: "Actions", field: "actions", align: 'center' },
      ],
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

    extractFirstNumber(str) {
      if (!str) return '';
      // Look for the first number anywhere in the string
      const match = str.match(/\d+/);
      return match ? match[0] : str;
    },

    // async downloadData() {
    //   this.$q.dialog({
    //     title: 'Download Data',
    //     message: 'You are about to export all data for rentals. Would you like to proceed?',
    //     color: 'primary',
    //     cancel: true,
    //     persistent: true
    //   }).onOk(async () => {
    //     try {
    //       const today = new Date().toISOString().split('T')[0];

    //       const response = await ExportDataService.exportRentalData();

    //       if (!response || !response.data) {
    //         throw new Error('Invalid response from server');
    //       }

    //       const blob = new Blob([response.data], { type: response.headers['content-type'] });
    //       const url = URL.createObjectURL(blob);
    //       const link = document.createElement('a');
    //       link.href = url;
    //       link.download = `rentals_export_${today}.xlsx`;
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
    //     message: 'You are about to export all rental history data. Would you like to proceed?',
    //     color: 'primary',
    //     cancel: true,
    //     persistent: true
    //   }).onOk(() => {
    //     try {
    //       const today = new Date().toISOString().split('T')[0];

    //       const rows = this.filteredRentals.map((rental, index) => ({
    //         'Field No.': index + 1,
    //         'Application Date': this.formatDate(rental.applicationDate) || '',
    //         'Applicant': rental.username || 'Unassigned',
    //         'Applicant Contact': `'${rental.userPhone || 'Unassigned'}`.replace(/,/g, ''),
    //         'Applicant Email': rental.userEmail || 'Unassigned',
    //         'Application ID': rental._id || '',
    //         'Floor Level': this.extractFirstNumber(
    //           rental.selectedSubUnits?.bedType || rental.selectedSubUnits?.roomType
    //         ) || '',
    //         'Unit Type': rental.selectedSubUnits?.bedType || rental.selectedSubUnits?.roomType || 'N/A',
    //         'Start Date': !this.defaultValues(rental)
    //           ? this.formatDate(rental.rentalStartDate)
    //           : 'Being processed...',
    //         'End Date': !this.defaultValues(rental)
    //           ? this.formatDate(rental.rentalEndDate)
    //           : 'Being processed...',
    //         'Before Scheduled': rental.earlyEndDate !== null
    //           ? this.formatDate(rental.earlyEndDate)
    //           : 'N/A',
    //         // 'Condition': this.needsAttention(rental) ? 'Alert' : 'All Good',
    //         'Status': this.capitalizeFirstLetter(rental.status || '')
    //       }));

    //       const safeRow = row => Object.values(row).map(val => `"${val}"`).join(',');

    //       const headers = Object.keys(rows[0]).map(h => `"${h}"`).join(',') + '\n';
    //       const csv = headers + rows.map(safeRow).join('\n');

    //       const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    //       const url = URL.createObjectURL(blob);
    //       const link = document.createElement('a');
    //       link.href = url;
    //       link.download = `rental_history_export_${today}.csv`;
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
        message: 'You are about to export all rental history data. Would you like to proceed?',
        color: 'primary',
        cancel: true,
        persistent: true
      }).onOk(() => {
        try {
          const today = new Date().toISOString().split('T')[0];

          const rows = this.filteredRentals.map((rental, index) => ({
            'Field No.': index + 1,
            'Application Date': this.formatDate(rental.applicationDate) || '',
            'Applicant': rental.username || 'Unassigned',
            'Applicant Contact': (rental.userPhone || 'Unassigned').replace(/,/g, ''),
            'Applicant Email': rental.userEmail || 'Unassigned',
            'Application ID': rental._id || '',
            'Floor Level': this.extractFirstNumber(
              rental.selectedSubUnits?.bedType || rental.selectedSubUnits?.roomType
            ) || '',
            'Unit Type': rental.selectedSubUnits?.bedType || rental.selectedSubUnits?.roomType || 'N/A',
            'Start Date': !this.defaultValues(rental)
              ? this.formatDate(rental.rentalStartDate)
              : 'Being processed...',
            'End Date': !this.defaultValues(rental)
              ? this.formatDate(rental.rentalEndDate)
              : 'Being processed...',
            'Before Scheduled': rental.earlyEndDate !== null
              ? this.formatDate(rental.earlyEndDate)
              : 'N/A',
            'Status': this.capitalizeFirstLetter(rental.status || '')
          }));

          // Convert JSON to worksheet
          const worksheet = XLSX.utils.json_to_sheet(rows);

          // Create a new workbook and append the worksheet
          const workbook = XLSX.utils.book_new();
          XLSX.utils.book_append_sheet(workbook, worksheet, 'RentalHistory');

          // Trigger download as .xlsx
          XLSX.writeFile(workbook, `rental_history_export_${today}.xlsx`);

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
      const uploadedDocs = Array.isArray(rental.userDocuments)
        ? rental.userDocuments.map(doc => doc.docType)
        : [];

      if (uploadedDocs.length === 0) return true;

      // Define required docs per category
      const requiredDocsByCategory = {
        'Private Client': [
          'private_application_form',
          'private_student_registration',
          'private_id_student',
          'private_id_person',
          'private_proof_of_address',
          'private_3_months_payslips',
          'private_3_months_bank_statements'
        ],
        'Business': [
          'business_application_form',
          'business_student_registration',
          'business_id_directors',
          'business_proof_of_address',
          'business_cipc_documents',
          'business_6_months_bank_statements'
        ],
        'Bursary Application': [
          'bursary_application_form',
          'bursary_student_registration',
          'bursary_confirmation',
          'bursary_proof_of_address',
          'bursary_id_documents'
        ]
      };

      // Detect category from prefix of first uploaded doc
      let category = null;
      const firstDoc = uploadedDocs[0];
      if (firstDoc.startsWith('private_')) category = 'Private Client';
      else if (firstDoc.startsWith('business_')) category = 'Business';
      else if (firstDoc.startsWith('bursary_')) category = 'Bursary Application';

      if (!category) return true;

      const requiredTypes = requiredDocsByCategory[category] || [];
      const documentsComplete = requiredTypes.every(type => uploadedDocs.includes(type));

      return !(emailVerified && documentsComplete);
    },

    defaultValues(rental) {
      if (!rental?.rentalStartDate || !rental?.rentalEndDate) return false;

      if (rental?.status === "Active") {
        return false;
      }

      const toDateObj = (dateStr) => new Date(dateStr);

      const start = toDateObj(rental.rentalStartDate);
      const end = toDateObj(rental.rentalEndDate);

      // Default is always Feb 1 → Dec 15 (any year)
      const isDefaultStart =
        start.getMonth() === 1 && start.getDate() === 1;   // Feb = 1 (0-based index)
      const isDefaultEnd =
        end.getMonth() === 11 && end.getDate() === 15;     // Dec = 11 (0-based index)

      console.log("Row:", start.toISOString().split("T")[0], end.toISOString().split("T")[0],
                  "Default?", isDefaultStart && isDefaultEnd);

      return isDefaultStart && isDefaultEnd;
    },

    copyToClipboard(text) {
      navigator.clipboard.writeText(text)
        .then(() => {
          this.$q.notify({ type: 'positive', color: 'primary', message: 'Copied to clipboard!' });
        }).catch(err => {
          this.$q.notify({ type: 'negative', message: `Failed to copy text: ${err}` });
        })
    },

// async findAllRentals() {
//   try {
//     this.loading = true;

//     // Step 1: Fetch all rentals
//     const response = await RentalService.findAllRentals();

//     // Step 2: Prepare caches
//     const unitCache = {};
//     const userCache = {};

//     // Step 3: Enrich rentals with unit + user data
//     this.rentals = await Promise.all(response.map(async rental => {
//       // Fetch unit (with caching)
//       if (!unitCache[rental.unit]) {
//         unitCache[rental.unit] = await UnitService.getByIdUnit(rental.unit);
//       }
//       const unit = unitCache[rental.unit];

//       // Fetch user (with caching)
//       if (!userCache[rental.user]) {
//         userCache[rental.user] = await UserService.findUserById(rental.user);
//       }
//       const user = userCache[rental.user];

//       return {
//         ...rental,
//         unitType: unit?.unitType,
//         username: user?.username,
//         userFirstName: user?.firstName,
//         userLastName: user?.lastName,
//         userId: user?._id,
//         userEmail: user?.email,
//         userPhone: user?.phone,
//         userVerification: user?.verification,
//         userDocuments: user?.documents || []
//       };
//     }));

//     // Step 4: Filter rentals by status
//     const filteredRentals = this.rentals.filter(rental =>
//       ['Pending', 'Active', 'Rejected', 'Ended'].includes(rental.status)
//     );

//     this.currentRentals = filteredRentals;
//     this.approvedRentals = filteredRentals.filter(r => r.status === 'Active');
//     this.pendingRentals = filteredRentals.filter(r => r.status === 'Pending');
//     this.rejectedRentals = filteredRentals.filter(r => r.status === 'Rejected');
//     this.endedRentals = filteredRentals.filter(r => r.status === 'Ended');

//     // Step 5: Update UI
//     this.filteredByRentalStatus();
//     this.updateChart();
//   } catch (error) {
//     console.error('Error loading rentals:', error);
//   } finally {
//     this.loading = false;
//   }
// },

    async findAllRentals() {
      this.loading = true
      const response = await RentalService.findAllRentals();

      this.rentals = await Promise.all(response.map(async rental => {
        const unit = await UnitService.getByIdUnit(rental.unit);
        const user = await UserService.findUserById(rental.user);
        return {
          ...rental,
          unitType: unit.unitType,
          username: user.username,
          userFirstName: user.firstName,
          userLastName: user.lastName,
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
      this.loading = false
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
        rental._id?.toLowerCase().includes(searchTerm) ||
        rental.userFirstName?.toLowerCase().includes(searchTerm) ||
        rental.userLastName?.toLowerCase().includes(searchTerm) ||
        rental.userEmail?.toLowerCase().includes(searchTerm) ||
        rental.userPhone?.toLowerCase().includes(searchTerm)
      );
    },


    filterRentalsByChart(selectedStatus) {
      this.selectedRentalStatus = selectedStatus; // Sync dropdown filter

      if (selectedStatus === 'Active') {
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

    async syncRentals() {
      this.$q.dialog({
        title: 'Confirm',
        message: `You are about to sync all rentals. Do you wish to continue?`,
        color: 'primary',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        const response = await RentalService.syncRentals();
        if (response) {
          this.$q.notify({ type: 'positive', color: 'primary', message: 'Sync successful!' });
          this.findAllRentals();
        } else {
          this.$q.notify({ type: 'negative', message: 'Sync failed. Please try again.' });
        }
      }).onCancel(() => { });
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
          this.filteredByRentalStatus();
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
    viewUserTimeline(evt, row) {
      const id = row._id
      Helper.adminRentalDetails(id, this.$router);
    },

  },
  created() {
    this.findAllRentals();
  }
};
</script>

<style>
.inline-btn {
  display: inline-flex; /* ensures they sit side by side */
  width: auto;          /* prevents full-width stretching */
}

</style>
