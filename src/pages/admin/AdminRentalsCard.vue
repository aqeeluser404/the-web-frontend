<template>
  <q-page>
    Rentals
  </q-page>
</template>

<script>
import RentalService from 'src/services/RentalService';

export default {
  name: "AdminRentalsCard",

  data() {
    return {
      rentals: []
    }
  },
  methods: {
    async findAllRentals() {
      this.rentals = await RentalService.findAllRentals()
      console.log(this.rentals)
    }
  },
  created() {
    this.findAllRentals()
  }
}
</script>
