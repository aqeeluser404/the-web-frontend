<template>
  <q-card style="width: 650px;">
    <q-card-section>
      <div class="text-h6">Create a new unit</div>
    </q-card-section>

    <q-separator />

    <q-card-section class="q-gutter-md">
      <q-input filled v-model="unit.unitNumber" label-color="black" color="black" label="Unit Number *" readonly />
      <q-select filled v-model="unit.floorLevel" label-color="black" color="black" label="Floor Level *" :options="floorLevelOptions" emit-value map-options />
      <!-- <q-select filled v-model="unit.unitType" label-color="black" color="black" label="Unit Type *" :options="unitTypeOptions" emit-value map-options /> -->
      <q-select filled v-model="unit.unitOccupants" label-color="black" color="black" label="Unit Occupants *" :options="unitOccupantsOptions" emit-value map-options />
      <q-input filled v-model="unit.unitPrice" label-color="black" color="black" label="Unit Price *" type="number" prefix="R" :rules="[val => val > 0] || 'Price must be positive'" />
      <q-file filled v-model="image1" label="Image (First View) * " label-color="black" color="black" accept="image/*" name="image1" id="image1" />
      <q-file filled v-model="image2" label="Image (Second View) * " label-color="black" color="black" accept="image/*" name="image2" id="image2" />
      <q-file filled v-model="image3" label="Image (Third View) * " label-color="black" color="black" accept="image/*" name="image3" id="image3" />
      <q-input filled v-model="unit.unitDescription" label-color="black" color="black" label="Unit Description *" type="textarea" stack-label />
    </q-card-section>

    <q-card-section>
      <CustomButton label="Add New Unit" @click="addUnit" />
    </q-card-section>
  </q-card>
</template>

<script>
import CustomButton from '../elements/CustomButton.vue';
import UnitService from 'src/services/UnitService';

export default {
  name: 'AdminAddUnitComponent',
  data() {
    return {
      unit: {
        unitNumber: 'Loading...',
        floorLevel: '',
        unitType: 'Shared',
        unitOccupants: '',
        unitDescription: 'This unit features a well-appointed kitchen area, (x) modern bathrooms, (x) spacious lounges, and ample parking for (x) vehicles.',
        unitPrice: '',
        images: []
      },
      image1: null, image2: null, image3: null,

      floorLevelOptions: [
        { label: 'First Floor', value: 'First Floor' },
        { label: 'Second Floor', value: 'Second Floor' },
        { label: 'Third Floor', value: 'Third Floor' },
      ],

      unitOccupantsOptions: [
        { label: '1', value: 1 },
        { label: '2', value: 2 },
        { label: '3', value: 3 },
        { label: '4', value: 4 },
        { label: '5', value: 5 },
        { label: '6', value: 6 },
        { label: '7', value: 7 },
        { label: '8', value: 8 },
        { label: '9', value: 9 },
        { label: '10', value: 10 },
      ]
    }
  },
  components: {
    CustomButton
  },
  async mounted() {
    if (this.unit.floorLevel) {
      await this.fetchLatestUnitNumber(this.unit.floorLevel);
    }
  },
  watch: {
    'unit.floorLevel': function (newFloorLevel) {
      if (newFloorLevel) {
        this.fetchLatestUnitNumber(newFloorLevel);
      }
    }
  },
  methods: {
    async fetchLatestUnitNumber(floorLevel) {
      try {
        const units = await UnitService.getAllUnits();

        // Filter units by the selected floor level
        const filteredUnits = units.filter(u => u.floorLevel === floorLevel);

        // Determine the floor prefix based on floor level
        let floorPrefix;
        const floorName = (floorLevel || '').toString().toLowerCase().trim();

        if (floorName === 'first floor') {
          floorPrefix = '1';
        } else if (floorName === 'second floor') {
          floorPrefix = '2';
        } else if (floorName === 'third floor') {
          floorPrefix = '3';
        } else {
          // For numeric floors or other names, try to determine prefix
          const floorNum = parseInt(floorName);
          floorPrefix = !isNaN(floorNum) ? (floorNum + 1).toString() : '1';
        }

        // Default starting number for this floor (e.g., 101, 201, etc.)
        const defaultStartNumber = parseInt(floorPrefix + '01');

        if (filteredUnits.length === 0) {
          // No units exist for this floor, start with default
          this.unit.unitNumber = defaultStartNumber.toString();
          return;
        }

        // Process existing unit numbers
        const unitNumbers = filteredUnits
          .map(u => {
            const unitNumStr = u.unitNumber?.toString() || '';
            if (unitNumStr.startsWith(floorPrefix)) {
              const num = parseInt(unitNumStr);
              return isNaN(num) ? 0 : num;
            }
            return 0;
          })
          .filter(num => num >= defaultStartNumber) // Only numbers in our new format
          .sort((a, b) => a - b);

        if (unitNumbers.length === 0) {
          // No valid unit numbers found, use default
          this.unit.unitNumber = defaultStartNumber.toString();
          return;
        }

        // Find the first available number in sequence
        let nextNumber = defaultStartNumber;
        for (const num of unitNumbers) {
          if (num > nextNumber) break;
          nextNumber = num + 1;
        }

        // Ensure we don't go beyond floor numbering (e.g., 199 for floor 1)
        const maxNumberForFloor = parseInt(floorPrefix + '99');
        if (nextNumber > maxNumberForFloor) {
          this.$q.notify({
            type: 'negative',
            message: 'Maximum unit numbers reached for this floor'
          });
          this.unit.unitNumber = 'Error';
          return;
        }

        this.unit.unitNumber = nextNumber.toString();

      } catch (error) {
        console.error('Error fetching units:', error);
        this.$q.notify({ type: 'negative', message: 'Failed to load unit numbers' });
        this.unit.unitNumber = 'Error';
      }
    },
    addUnit() {
      if (this.unit.unitNumber === '' || this.unit.floorLevel === '' || this.unit.unitType === '' || this.unit.unitOccupants === '' || this.unit.unitDescription === '' || this.unit.unitPrice === '') {
        this.$q.notify({ type: 'negative', message: 'Please fill in all fields' })
        return
      }
      this.$q.dialog({
        title: 'Confirm', message: `You are about to save this unit into the database, continue?`, color: 'primary', cancel: true, persistent: true
      }).onOk(async () => {
        const formData = new FormData()
        for (const key in this.unit) {
          if (key !== 'images') {
            formData.append(key, this.unit[key])
          }
        }
        if (this.image1) formData.append('images', this.image1)
        if (this.image2) formData.append('images', this.image2)
        if (this.image3) formData.append('images', this.image3)

        // PHP VERSION
        // if (this.image1) formData.append('images[]', this.image1);
        // if (this.image2) formData.append('images[]', this.image2);
        // if (this.image3) formData.append('images[]', this.image3);

        const response = await UnitService.createUnit(formData)
        if (response) {
          this.$q.notify({ type: 'positive', color: 'primary', message: 'Unit Saved!' })
          this.$emit('close')
        } else {
          this.$q.notify({ type: 'negative', message: 'Failed to save unit. Please try again.' })
        }
      }).onCancel(() => {
        return
      })
    }
  }
}
</script>
