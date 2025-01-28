<template>
  <q-card style="max-width: 450px;">
    <q-card-section>
      <div class="text-h6">{{ unit.unitType }} Details</div>
    </q-card-section>
    <q-separator />
    <q-card-section>
      <q-img
        v-if="unit.images && unit.images.length > 0"
        :src="getImageUrl(unit.images[0].imageUrl)"
        class="image"
      />
    </q-card-section>

    <q-card-section>
      <div><b>Unit Specifications</b></div>
      <ul>
        <li>{{ unit.bedrooms }} Bedroom(s)</li>
        <li>{{ unit.kitchens }} Kitchen(s)</li>
        <li>{{ unit.bathrooms }} Bathroom(s)</li>
        <li>{{ unit.parking }} Parking(s)</li>
        <li>{{ unit.lounges }} Lounge(s)</li>
      </ul>
      <div>{{ unit.unitDescription }}</div>
    </q-card-section>
    <q-card-section align="right">
      <CustomButton label="Close" @click="$emit('close')" />
    </q-card-section>
  </q-card>
</template>

<script>
import Helper from 'src/services/utils'
import CustomButton from './CustomButton.vue'

export default {
  name: 'UnitDetailsComponent',
  props: {
    unit: {
      type: Object,
      required: true
    }
  },
  components: {
    CustomButton
  },
  methods: {
    getImageUrl: Helper.getImageUrl
  }
}
</script>
