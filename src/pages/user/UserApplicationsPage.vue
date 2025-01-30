<template>
  <q-page>
    <div class="q-pa-md row justify-center">

      <q-card flat bordered class="col-md-8 col-11">

        <q-card-section class="row justify-center">
          <div class="text-h6">Application History</div>
        </q-card-section>

        <q-card-section v-if="userDetails.rentals && userDetails.rentals.length > 0">
          <q-markup-table flat bordered>
            <thead>
              <tr>
                <th></th>
                <th class="text-left">Application Date</th>
                <th class="text-left">Applicant</th>
                <th class="text-left">Start Date</th>
                <th class="text-left">Rental Price</th>
                <th class="text-left">Unit Type</th>
                <th class="text-left">Status</th>
                <th class="text-left">Actions</th>
              </tr>
            </thead>
            <tbody v-for="(rental, index) in rentals" :key="rental._id">
              <tr>
                <td class="text-left cursor-pointer">{{ index + 1 }}</td>
                <td class="text-left cursor-pointer">{{ formatDate(rental.applicationDate) }}</td>
                  <td class="text-left cursor-pointer">{{ userDetails.username }}</td>
                <td class="text-left cursor-pointer">
                  <div v-if="rental.rentalStartDate !== null">
                    {{ formatDate(rental.rentalStartDate) }}
                  </div>
                  <div v-else>
                    Being processed...
                  </div>
                </td>
                <td class="text-left cursor-pointer">R {{ rental.rentalPrice }}.00</td>
                  <td class="text-left cursor-pointer">{{ capitalizeFirstLetter(rental.unitType) }}</td>
                <td class="text-left cursor-pointer">{{ capitalizeFirstLetter(rental.status) }}</td>
                <td class="text-left cursor-pointer">
                  <CustomButton color="red" icon="eva-trash-outline" @click="deleteRental(rental)" customStyle="width: 40%" />
                </td>
              </tr>
            </tbody>
          </q-markup-table>
        </q-card-section>

        <q-card-section v-else class="row justify-center">
          <q-item>
            <q-item-section class="text-subtitle1">You currently have no rental applications on file.</q-item-section>
          </q-item>
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import Helper from 'src/services/utils';
import RentalService from 'src/services/RentalService';
import UnitService from 'src/services/UnitService';
import CustomButton from 'src/components/CustomButton.vue';

export default {
  data() {
    return {
      rentals: [],
      userDetails: {}
    }
  },
  components: {
    CustomButton
  },
  methods: {
    formatDate: Helper.formatDate,
    capitalizeFirstLetter: Helper.capitalizeFirstLetter,
    async findMyRentals() {
      const response = await RentalService.findMyRentals(this.userDetails._id)
      this.rentals = await Promise.all(response.map(async rental => {
        const unit = await UnitService.getByIdUnit(rental.unit)
        return {
          ...rental,
          unitType: unit.unitType
        }
      }))
    },
    async fetchUserDetails() {
      this.userDetails = await Helper.fetchUserDetails()
      this.findMyRentals()
    },
    async deleteRental(rental) {
      if (rental.status === 'Pending') {
        this.$q.dialog({
          title: 'Confirm', message: `You are about to delete this rental application, continue?`, color: 'primary', cancel: true, persistent: true
        }).onOk(async () => {
          const response = await RentalService.deleteRental(rental._id)
          if (response) {
            this.$q.notify({ type: 'positive', color: 'primary', message: 'Delete successful!' })
            this.fetchUserDetails()
          } else {
            this.$q.notify({ type: 'negative', message: 'Delete failed. Please try again.' })
          }
        }).onCancel(() => {
          this.fetchUserDetails()
          return
        })
      } else {
        this.$q.notify({ type: 'negative', color: 'primary', message: 'Delete failed. You cannot delete an approved rental.' })
      }
    }
  },
  mounted() {
    this.fetchUserDetails()
  }
}
</script>
