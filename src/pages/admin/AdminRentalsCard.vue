<template>
  <q-page>
    <div class="q-pa-md row justify-center">
      <q-card flat bordered class="col-md-8 col-11">
        <q-card-section class="row justify-center">
          <div class="text-h6">Rental Management</div>
        </q-card-section>

        <q-card-section v-if="rentals.length > 0">
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
            <tbody>
              <tr  v-for="(rental, index) in rentals" :key="rental._id">
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
      rentals: []
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
      console.log(this.rentals)
    }
  },
  created() {
    this.findAllRentals()
  }
}
</script>
