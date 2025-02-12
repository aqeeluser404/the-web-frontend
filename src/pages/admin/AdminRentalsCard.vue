<template>
  <q-page>
    <div class="q-pa-md row justify-center">

      <q-card flat bordered class="col-md-9 col-11 q-ma-sm">

        <q-card-section class="row justify-center">
          <div class="text-h6">Rental History</div>
        </q-card-section>

        <q-card-section class="row justify-between">
          <q-input filled v-model="search" placeholder="Search" @update:model-value="filterBySearch" class="col-12 col-md-9" />

          <q-select
            filled
            v-model="selectedRentalStatus"
            :options="rentalStatus"
            label="Rental Status"
            @update:model-value="filteredByRentalStatus"
            class="col-12 col-md-3"
          />
        </q-card-section>

        <q-card-section v-if="rentals.length > 0">
          <q-markup-table flat bordered>
            <thead>
              <tr>
                <th></th>
                <th class="text-left">Application Date</th>
                <th class="text-left">Applicant</th>
                <th class="text-left">Start Date</th>
                <th class="text-left">End Date</th>
                <th class="text-left">Before Scheduled</th>
                <th class="text-left">Rental Price</th>
                <th class="text-left">Unit Type</th>
                <th class="text-left">Status</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(rental, index) in filteredRentals" :key="rental._id" @click="viewUserTimeline(rental._id)">
                <td class="text-left cursor-pointer">{{ index + 1 }}</td>
                <td class="text-left cursor-pointer">{{ formatDate(rental.applicationDate) }}</td>
                <td class="text-left cursor-pointer">{{ rental.username }}</td>
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
                  <div v-if="rental.earlyEndDate !== null" style="text-decoration: underline; color: red;">
                    <b>{{ formatDate(rental.earlyEndDate) }}</b>
                  </div>
                  <div v-else>
                    N/A
                  </div>
                </td>
                <td class="text-left cursor-pointer">R {{ rental.rentalPrice }}.00</td>
                <td class="text-left cursor-pointer">{{ capitalizeFirstLetter(rental.unitType) }}</td>
                <td class="text-left cursor-pointer text-uppercase" style=""><b>{{ capitalizeFirstLetter(rental.status) }}</b></td>
                <td class="text-left cursor-pointer">
                  <CustomButton flat color="red" text-color="red" customStyle="width: 15%" icon="eva-trash-outline" @click.stop="deleteRental(rental)" />
                  <!-- <q-btn flat color="red" text-color="red" icon="eva-close-outline" @click.stop="endRental(rental)" /> -->
                  <CustomButton flat color="red" text-color="red" customStyle="width: 70%" icon="eva-close-outline" @click.stop="endRental(rental)" />
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
  </q-page>
</template>

<script>
import RentalService from 'src/services/RentalService';
import UnitService from 'src/services/UnitService';
import UserService from 'src/services/UserService';
import Helper from 'src/services/utils'
import CustomButton from 'src/components/CustomButton.vue';

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

      rentalStatus: ['All', 'Approved', 'Pending', 'Rejected', 'Ended'],

      selectedRentalStatus: 'All'
    }
  },
  components: {
    CustomButton
  },
  methods: {

    formatDate: Helper.formatDate,
    capitalizeFirstLetter: Helper.capitalizeFirstLetter,

    async findAllRentals() {
      const response = await RentalService.findAllRentals()

      this.rentals = await Promise.all(response.map(async rental => {
        const unit = await UnitService.getByIdUnit(rental.unit)
        const user = await UserService.findUserById(rental.user)
        return {
          ...rental,
          unitType: unit.unitType,
          username: user.username
        }
      }))

      const filteredRentals = this.rentals.filter(rental => rental.status === 'Pending' || rental.status === 'Active' || rental.status === 'Rejected' || rental.status === 'Ended')

      this.currentRentals = filteredRentals
      this.approvedRentals = filteredRentals.filter(rental => rental.status === 'Active')
      this.pendingRentals = filteredRentals.filter(rental => rental.status === 'Pending')
      this.rejectedRentals = filteredRentals.filter(rental => rental.status === 'Rejected')
      this.endedRentals = filteredRentals.filter(rental => rental.status === 'Ended')

      this.filteredByRentalStatus()
    },

    filterBySearch() {
      if (this.search === '') {
        this.selectedRentalStatus = 'All'
        this.filteredByRentalStatus()
        return
      }
      const searchTerm = this.search.toLowerCase()
      this.filteredRentals = this.filteredRentals.filter(rental =>
        rental.username.toLowerCase().includes(searchTerm) ||
        rental.username.toUpperCase().includes(searchTerm) ||
        rental.unitType.toLowerCase().includes(searchTerm) ||
        rental.unitType.toUpperCase().includes(searchTerm) ||
        rental.applicationDate.toLowerCase().includes(searchTerm) ||
        rental.applicationDate.toUpperCase().includes(searchTerm) ||
        user.user.toLowerCase().includes(searchTerm) ||
        user.user.toUpperCase().includes(searchTerm)
      )
    },

    filteredByRentalStatus() {
      if (this.selectedRentalStatus === 'All') {
        this.filteredRentals = this.currentRentals
      } else if (this.selectedRentalStatus === 'Approved') {
        this.filteredRentals = this.approvedRentals
      } else if (this.selectedRentalStatus === 'Pending') {
        this.filteredRentals = this.pendingRentals
      } else if (this.selectedRentalStatus === 'Rejected') {
        this.filteredRentals = this.rejectedRentals
      } else if (this.selectedRentalStatus === 'Ended') {
        this.filteredRentals = this.endedRentals
      }
    },

    async deleteRental(rental) {
      if (rental.status === 'Pending' || rental.status === 'Rejected') {
        this.$q.dialog({
          title: 'Confirm',
          message: 'You are about to delete this rental application, continue?',
          color: 'primary',
          cancel: true,
          persistent: true
        }).onOk(async () => {
          const response = await RentalService.deleteRental(rental._id)
          if (response) {
            this.$q.notify({ type: 'positive', color: 'primary', message: 'Delete successful!' })
            this.fetchUserDetails()
          } else {
            this.$q.notify({ type: 'negative', message: 'Delete failed. Please try again.' })
          }
        }).onCancel(() => {
          // No need to fetch user details again on cancel
        })
      } else {
        this.$q.notify({ type: 'negative', color: 'primary', message: 'Delete failed. You cannot delete an active or ended rental.' })
      }
    },

    async endRental(rental) {
      if (rental.status === 'Active') {
        this.$q.dialog({
          title: 'Confirm',
          message: 'You are about to end this rental application, continue?',
          color: 'primary',
          cancel: true,
          persistent: true
        }).onOk(async () => {
          const response = await RentalService.endRental(rental._id)
          if (response) {
            this.$q.notify({ type: 'positive', color: 'primary', message: 'Rental Ended successful!' })
            this.fetchUserDetails()
          } else {
            this.$q.notify({ type: 'negative', message: 'End rental failed. Please try again.' })
          }
        })
      } else {
        this.$q.notify({ type: 'negative', color: 'primary', message: 'End rental failed. You can only end an active rental.' })
      }
    },

    viewUserTimeline(id) {
      Helper.adminRentalDetails(id, this.$router)
    },
  },
  created() {
    this.findAllRentals()
  }
}
</script>
