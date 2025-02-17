<template>
  <q-card style="width: 650%;">
    <q-card-section>
      <div class="text-h6">Rental Details</div>
    </q-card-section>

    <q-card-section>
      {{ rental.status }}
    </q-card-section>

    <q-card-section>
      <CustomButton label="Close" color="white" text-color="black" @click="$emit('close')" />
    </q-card-section>
  </q-card>
</template>

<script>
import CustomButton from '../elements/CustomButton.vue';

export default {
  name: "AdminViewUserRentalComponent",
  props: {
    rental: {
      type: Object,
      required: true
    }
  },
  components: {
    CustomButton
  }
}
</script>
