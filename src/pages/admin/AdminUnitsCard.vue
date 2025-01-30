<template>
  <q-page>
    Units
  </q-page>
</template>

<script>
import UnitService from 'src/services/UnitService';

export default {
  name: "AdminUnitsCard",

  data() {
    return {
      units: []
    }
  },
  methods: {
    async findAllUnits() {
      this.units = await UnitService.getAllUnits()
      console.log(this.units)
    }
  },
  created() {
    this.findAllUnits()
  }
}
</script>
