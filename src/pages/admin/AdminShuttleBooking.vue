<template>
  <q-page>
    <div class="constrain-standard q-pt-md q-pb-md row justify-center">

      <!-- Driver Approval Card -->
      <q-card></q-card>
    </div>

    <!-- Shuttle History -->
    <div class="constrain-standard row justify-center q-pb-md">
      <div class="col-md-9 col-12 full-height">
        <q-card flat bordered class="full-height">

          <!-- Heading -->
          <q-card-section class="row justify-between items-center">
            <div class="text-h6">Shuttle History</div>
            <q-btn @click="" class="custom-button" icon="eva-cloud-download-outline" flat rounded />
          </q-card-section>

          <!-- Filtering methods -->
          <q-card-section class="row justify-between">
              <q-input filled v-model="search" placeholder="Search" @update:model-value="filterBySearch" class="col-12 col-md-9" />
              <q-select v-model="selectedShuttleStatus" :options="shuttleStatus" label="Shuttle Status" @update:model-value="filteredByShuttleStatus" class="col-12 col-md-2" />
          </q-card-section>

          <!-- shuttle history table -->
          <!-- loop using the filteredShuttles -->
          <q-card-section v-if="shuttles.length > 0">

          </q-card-section>
          <q-card-section v-else class="row justify-center">
              <q-item>
                <q-item-section class="text-subtitle1">No shuttle booking has been placed yet.</q-item-section>
              </q-item>
            </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import * as XLSX from 'xlsx';
import ShutttleService from 'src/services/ShuttleService';
import Helper from 'src/services/utils';
import RentalService from "src/services/RentalService";
import CustomButton from 'src/components/elements/CustomButton.vue';
import UserService from 'src/services/UserService';
import UnitService from 'src/services/UnitService';

export default {
  name: "AdminShuttleCard",

  data() {
    return {
      shuttles: [],
      search: '',

      filteredShuttles: [], currentShuttles: [], pickedUpShuttles: [], pendingShuttles: [], droppedOffShuttles: [], MissedPickUpShuttles: [],

      shuttleStatus: ['All', 'Picked Up', 'Pending', 'Dropped Off', 'Missed Pick Up'],
      selectedShuttleStatus: 'All',
      showAllStatuses: true,
    }
  },
  components: {
    CustomButton
  },
  methods: {
    formatDate: Helper.formatDate,
    capitalizeFirstLetter: Helper.capitalizeFirstLetter,

    async findAllShuttles() {
      const response = await ShutttleService.findAllShuttles();
      console.log(response);

      this.shuttles = await Promise.all(
        response.map(async shuttle => {
          const user = await UserService.findUserById(shuttle.user);
          const rentals = await RentalService.findMyRentals(shuttle.user);

          const activeRental = rentals.find(rental => rental.status === 'Active');
          const occupiedUnit = activeRental
            ? await UnitService.findUnitById(activeRental.unit)
            : null;

          return {
            ...shuttle,
            userStudentNumber: user.studentInfo.studentNumber,
            userFirstName: user.firstName,
            userLastName: user.lastName,
            unitNumber: occupiedUnit ? occupiedUnit.unitNumber : null
          };
        })
      );
      const filteredShuttles = this.shuttles.filter(shuttle =>
        shuttle.status === 'Picked Up' ||
        shuttle.status === 'Pending' ||
        shuttle.status === 'Dropped Off' ||
        shuttle.status === 'Missed Pick Up'
      );

      this.currentShuttles = filteredShuttles;
      this.pickedUpShuttles = filteredShuttles.filter(shuttle => shuttle.status === 'Picked Up');
      this.pendingShuttles = filteredShuttles.filter(shuttle => shuttle.status === 'Pending');
      this.droppedOffShuttles = filteredShuttles.filter(shuttle => shuttle.status === 'Dropped Off');
      this.MissedPickUpShuttles = filteredShuttles.filter(shuttle => shuttle.status === 'Missed Pick Up');

      this.filteredByShuttleStatus();
    },

    filteredByShuttleStatus() {
      if (this.selectedShuttleStatus === 'All') {
        this.filteredShuttles = this.currentShuttles;
        console.log("all", this.currentShuttles)
      } else {
        this.filterRentalsByChart(this.selectedShuttleStatus);
      }
    },

    filterRentalsByChart(selectedStatus) {
      this.selectedShuttleStatus = selectedStatus;

      if (selectedStatus === 'Picked Up') {
        this.filteredShuttles = this.pickedUpShuttles;
        console.log("pickedup", this.pickedUpShuttles)
      } else if (selectedStatus === 'Pending') {
        this.filteredShuttles = this.pendingShuttles;
        console.log("pending", this.pendingShuttles)
      } else if (selectedStatus === 'Dropped Off') {
        this.filteredShuttles = this.droppedOffShuttles;
        console.log("dropped off", this.droppedOffShuttles)
      } else if (selectedStatus === 'Missed Picked Up') {
        this.filteredShuttles = this.MissedPickUpShuttles;
        console.log("missed pick ups", this.MissedPickUpShuttles)
      } else {
        this.filteredShuttles = this.currentShuttles;
      }
    },

    filterBySearch() {
      const searchTerm = this.search.toLowerCase();

      const base = this.selectedShuttleStatus === 'All'
        ? this.currentShuttles
        : this.filteredShuttles;

      if (this.search === '') {
        this.filteredByShuttleStatus();
        return;
      }

      this.filteredShuttles = base.filter(shuttle =>
        shuttle.user?.toLowerCase().includes(searchTerm) ||
        shuttle.userFirstName?.toLowerCase().includes(searchTerm) ||
        shuttle.userLastName?.toLowerCase().includes(searchTerm) ||
        shuttle.userStudentNumber?.toLowerCase().includes(searchTerm) ||

        shuttle._id?.toLowerCase().includes(searchTerm) ||
        shuttle.shuttleNumber?.toLowerCase().includes(searchTerm) ||
        shuttle.status?.toLowerCase().includes(searchTerm) ||
        shuttle.createdAt?.toLowerCase().includes(searchTerm) ||
        shuttle.bookingTimeslot?.toLowerCase().includes(searchTerm) ||
        shuttle.pickupLocation?.toLowerCase().includes(searchTerm) ||
        shuttle.dropoffLocation?.toLowerCase().includes(searchTerm)
      );
    }
  },
  created() {
    this.findAllShuttles();
  }
}
</script>

<style scoped>

</style>
