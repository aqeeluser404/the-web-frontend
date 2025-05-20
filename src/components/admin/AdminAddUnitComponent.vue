<template>
  <q-card class="component-card">
    <q-card-section>
      <div class="text-h6">Create a new unit</div>
    </q-card-section>

    <q-separator />

    <q-card-section>
      <q-item>
        <q-item-section class="text-left text-subtitle1">Unit Number *</q-item-section>
        <q-item-section class="text-left text-subtitle1">
          <q-input v-model="unit.unitNumber" readonly />
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section class="text-left text-subtitle1">Floor Level *</q-item-section>
        <q-item-section class="text-left text-subtitle1">
          <q-select v-model="unit.floorLevel" :options="floorLevelOptions" emit-value map-options />
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section class="text-left text-subtitle1">Unit Occupants *</q-item-section>
        <q-item-section class="text-left text-subtitle1">
          <q-select v-model="unit.unitOccupants" :options="unitOccupantsOptions" emit-value map-options />
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section class="text-left text-subtitle1">Unit Price *</q-item-section>
        <q-item-section class="text-left text-subtitle1">
          <q-input v-model="unit.unitPrice" type="number" prefix="R"
            :rules="[val => val > 0 || 'Price must be positive']" />
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section class="text-left text-subtitle1">Cover Image *</q-item-section>
        <q-item-section class="text-left text-subtitle1">
          <q-file v-model="image1" label="Upload Cover Image" label-color="black" color="black" accept="image/*">
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section class="text-left text-subtitle1">Second Image *</q-item-section>
        <q-item-section class="text-left text-subtitle1">
          <q-file v-model="image2" label="Upload Second Image" label-color="black" color="black" accept="image/*">
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section class="text-left text-subtitle1">Third Image *</q-item-section>
        <q-item-section class="text-left text-subtitle1">
          <q-file v-model="image3" label="Upload Third Image" label-color="black" color="black" accept="image/*">
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>
        </q-item-section>
      </q-item>

      <q-item>
        <q-item-section class="text-left text-subtitle1">Unit Description *</q-item-section>
        <q-item-section class="text-left text-subtitle1">
          <q-input v-model="unit.unitDescription" type="textarea" />
        </q-item-section>
      </q-item>
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
        const filteredUnits = units.filter(u => u.floorLevel === floorLevel);

        let floorPrefix;
        const floorName = (floorLevel || '').toString().toLowerCase().trim();

        if (floorName === 'first floor') {
          floorPrefix = '1';
        } else if (floorName === 'second floor') {
          floorPrefix = '2';
        } else if (floorName === 'third floor') {
          floorPrefix = '3';
        } else {
          const floorNum = parseInt(floorName);
          floorPrefix = !isNaN(floorNum) ? (floorNum + 1).toString() : '1';
        }
        // Default starting number for this floor (e.g., 101, 201, etc.)
        const defaultStartNumber = parseInt(floorPrefix + '01');
        if (filteredUnits.length === 0) {
          this.unit.unitNumber = defaultStartNumber.toString();
          return;
        }
        const unitNumbers = filteredUnits
          .map(u => {
            const unitNumStr = u.unitNumber?.toString() || '';
            if (unitNumStr.startsWith(floorPrefix)) {
              const num = parseInt(unitNumStr);
              return isNaN(num) ? 0 : num;
            }
            return 0;
          })
          .filter(num => num >= defaultStartNumber)
          .sort((a, b) => a - b);

        if (unitNumbers.length === 0) {
          this.unit.unitNumber = defaultStartNumber.toString();
          return;
        }
        let nextNumber = defaultStartNumber;
        for (const num of unitNumbers) {
          if (num > nextNumber) break;
          nextNumber = num + 1;
        }
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
