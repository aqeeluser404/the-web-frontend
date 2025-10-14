<template>
  <q-card class="combined-unit-card">
    <div class="row">

      <!-- Left side -->
      <div class="col-md-6 col-12 q-pa-md left-card" style="background-color: #f8f8f8;">
        <q-card-section class="row justify-between items-center">
          <div class="text-h6">Create a new unit</div>
          <q-btn flat round icon="close" @click="$emit('close')" size="md" color="grey-10" aria-label="Close"
            class="small-screen-only" />
        </q-card-section>

        <q-separator />

        <!-- Unit Info -->
        <div class="column justify-between full-height">
          <q-card-section>
            <q-item>
              <q-item-section class="text-left text-subtitle1">Unit Number *</q-item-section>
              <q-item-section>
                <q-input v-model="unit.unitNumber" readonly />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section class="text-left text-subtitle1">Floor Level *</q-item-section>
              <q-item-section>
                <q-select v-model="unit.floorLevel" :options="floorLevelOptions" emit-value map-options />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section class="text-left text-subtitle1">Total Occupants</q-item-section>
              <q-item-section>
                <q-input :model-value="calculateTotalOccupants()" readonly />
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section class="text-left text-subtitle1">Unit Description *</q-item-section>
              <q-item-section>
                <q-input v-model="unit.unitDescription" type="textarea" />
              </q-item-section>
            </q-item>
          </q-card-section>

          <q-card-section>
            <CustomButton label="Add New Unit" @click="addUnit" />
          </q-card-section>
        </div>
      </div>



      <!-- Right side -->
      <div class="col-md-6 col-12 q-pa-md">
        <q-card-section class="row justify-end items-center q-py-none q-py-sm">
          <q-btn flat round icon="close" @click="$emit('close')" size="md" color="grey-10" aria-label="Close"
            class="large-screen-only" />
        </q-card-section>

        <q-card-section>
          <!-- Image Uploads -->
          <q-item>
            <q-item-section class="text-left text-subtitle1">Cover Image *</q-item-section>
            <q-item-section>
              <q-file v-model="image1" label="Upload Cover Image" label-color="black" color="black" accept="image/*">
                <template v-slot:prepend><q-icon name="attach_file" /></template>
              </q-file>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section class="text-left text-subtitle1">Second Image *</q-item-section>
            <q-item-section>
              <q-file v-model="image2" label="Upload Second Image" label-color="black" color="black" accept="image/*">
                <template v-slot:prepend><q-icon name="attach_file" /></template>
              </q-file>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section class="text-left text-subtitle1">Third Image *</q-item-section>
            <q-item-section>
              <q-file v-model="image3" label="Upload Third Image" label-color="black" color="black" accept="image/*">
                <template v-slot:prepend><q-icon name="attach_file" /></template>
              </q-file>
            </q-item-section>
          </q-item>
        </q-card-section>

        <!-- <q-separator /> -->

        <!-- SubUnits Section -->
        <q-card-section class="q-py-none q-mb-sm">
          <div class="text-subtitle1 text-weight-bold q-mt-md">Unit Configuration</div>

          <!-- Unit Type Selection -->
          <q-item>
            <q-item-section class="text-left text-subtitle1">Unit Type *</q-item-section>
            <q-item-section>
              <q-select v-model="unit.unitType" :options="unitTypeOptions" label="Select Unit Type" emit-value
                map-options @update:model-value="onUnitTypeChange" />
            </q-item-section>
          </q-item>

          <template v-if="unit.unitType === 'rooms'">
            <div v-for="(room, index) in unit.rooms" :key="'room-' + index">

              <q-item>
                <q-item-section class="text-left text-subtitle1">Room Type *</q-item-section>
                <q-item-section class="text-left text-subtitle1">
                  <q-select v-model="room.type" :options="roomTypeOptions" label="Room Type" class="col-grow" />
                </q-item-section>
              </q-item>

              <!-- Multiple Prices with name and price -->
              <div v-for="(priceEntry, pIndex) in room.price" :key="'room-price-' + index + '-' + pIndex"
                class="">
                <q-item>
                  <q-item-section class="text-left text-subtitle1">
                    Price ({{ pIndex + 1 }})
                  </q-item-section>
                  <q-item-section>
                    <q-input v-model.number="room.price[pIndex].price" label="Price (R)" type="number" />
                  </q-item-section>
                  <q-item-section>
                    <q-input v-model="room.price[pIndex].name" label="Price Name" />
                  </q-item-section>
                  <q-item-section>
                    <CustomButton color="negative" icon="delete" v-if="room.price.length > 1"
                      @click="room.price.splice(pIndex, 1)" />
                  </q-item-section>
                </q-item>
              </div>

              <div class="q-mx-none q-mt-md row justify-between">
                <div class="col-md-3 col-12 q-mb-sm">
                  <CustomButton label="Price" icon="add" @click="room.price.push({ name: 'default', price: 0 })" :disable="room.price.length >= 3" />
                </div>
                <div class="col-md-3 col-12 q-mb-sm">
                  <CustomButton label="Room" icon="add" color="primary" @click="addRoom"
                      :disable="unit.rooms.length >= 3" v-if="unit.rooms.length > 0" />
                </div>
                <div class="col-md-5 col-12 q-mb-sm">
                  <CustomButton icon="delete" label="Remove Room" color="negative" @click="removeRoom(index)" class="" />
                </div>
              </div>
            </div>
            <!-- <div v-if="unit.rooms.length >= 3" class="text-caption text-grey">
              Maximum of 3 rooms per unit
            </div> -->
          </template>

          <template v-if="unit.unitType === 'beds'">
            <div v-for="(bed, index) in unit.beds" :key="'bed-' + index">

              <q-item>
                <q-item-section class="text-left text-subtitle1">Bed Type *</q-item-section>
                <q-item-section class="text-left text-subtitle1">
                  <q-input v-model="bed.number" label="Bed Number" class="col-grow" />
                </q-item-section>
              </q-item>

              <!-- Multiple Prices with name and price -->
              <div v-for="(priceEntry, pIndex) in bed.price" :key="'bed-price-' + index + '-' + pIndex"
                class="">
                <q-item>
                  <q-item-section class="text-left text-subtitle1">
                    Price ({{ pIndex + 1 }})
                  </q-item-section>
                  <q-item-section class="text-left text-subtitle1">
                    <q-input v-model.number="bed.price[pIndex].price" label="Price (R)" type="number" />
                  </q-item-section>
                  <q-item-section>
                    <q-input v-model="bed.price[pIndex].name" label="Price Name" />
                  </q-item-section>
                  <q-item-section>
                    <CustomButton icon="delete" color="negative" v-if="bed.price.length > 1" @click="bed.price.splice(pIndex, 1)" />
                  </q-item-section>
                </q-item>
              </div>

              <div class="q-mx-none q-mt-md row justify-between">
                <div class="col-md-3 col-12 q-mb-sm">
                  <CustomButton label="Price" icon="add" @click="bed.price.push({ name: 'default', price: 0 })"
                    :disable="bed.price.length >= 3" />
                </div>
                <div class="col-md-3 col-12 q-mb-sm">
                  <CustomButton label="Bed" icon="add" color="primary" @click="addBed" class="" />
                </div>
                <div class="col-md-5 col-12">
                  <CustomButton icon="delete" label="Remove Bed" color="negative" @click="removeBed(index)" />
                </div>
              </div>
            </div>
          </template>

        </q-card-section>
      </div>
    </div>
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
        unitType: '',
        unitDescription: 'This unit features a well-appointed kitchen area, modern bathrooms, spacious lounges, and ample parking.',
        // unitPrice: '',
        images: [],
        rooms: [],
        beds: [],
      },
      image1: null, image2: null, image3: null,

      // Options
      floorLevelOptions: [
        { label: 'First Floor', value: 'First Floor' },
        { label: 'Second Floor', value: 'Second Floor' },
        { label: 'Third Floor', value: 'Third Floor' },
      ],
      unitTypeOptions: [
        { label: 'Rooms Unit', value: 'rooms' },
        { label: 'Beds Unit', value: 'beds' }
      ],
      roomTypeOptions: [
        'The Core', 'Botmaskop'
      ]
    }
  },
  components: { CustomButton },
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
    // Room management
    addRoom() {
      if (this.unit.rooms.length < 3) {
        this.unit.rooms.push({
          type: 'Standard',
          price: [
            { name: 'default', price: 100 },
            { name: 'special', price: 150 },
          ]
        });
      }
    },
    removeRoom(index) {
      this.unit.rooms.splice(index, 1);
    },

    // Bed management
    addBed() {
      this.unit.beds.push({
        number: `Bed ${this.unit.beds.length + 1}`,
        price: [
          { name: 'default', price: 100 },
          { name: 'special', price: 150 },
        ]
      });
    },
    removeBed(index) {
      this.unit.beds.splice(index, 1);
    },

    onUnitTypeChange() {
      // Clear the other type's data
      if (this.unit.unitType === 'rooms') {
        this.unit.beds = [];
        if (this.unit.rooms.length === 0) this.addRoom();
      } else {
        this.unit.rooms = [];
        if (this.unit.beds.length === 0) this.addBed();
      }
    },

    // Calculate total occupants
    calculateTotalOccupants() {
      if (this.unit.unitType === 'rooms') {
        return Array.isArray(this.unit.rooms) ? this.unit.rooms.length : 0;
      } else if (this.unit.unitType === 'beds') {
        return Array.isArray(this.unit.beds) ? this.unit.beds.length : 0;
      }
      return 0;
    },

    async fetchLatestUnitNumber(floorLevel) {
      try {
        const units = await UnitService.getAllUnits();
        const filteredUnits = units.filter(u => u.floorLevel === floorLevel);

        let floorPrefix;
        const floorName = (floorLevel || '').toLowerCase().trim();
        if (floorName === 'first floor') floorPrefix = '1';
        else if (floorName === 'second floor') floorPrefix = '2';
        else if (floorName === 'third floor') floorPrefix = '3';
        else floorPrefix = '1';

        const defaultStartNumber = `${floorPrefix}-01`;

        if (filteredUnits.length === 0) { this.unit.unitNumber = defaultStartNumber; return; }

        const unitNumbers = filteredUnits.map(u => {
          const numStr = u.unitNumber?.toString() || '';
          if (numStr.includes('-')) {
            const [prefix, num] = numStr.split('-');
            if (prefix === floorPrefix) return parseInt(num) || 0;
          } else if (numStr.startsWith(floorPrefix)) {
            return parseInt(numStr.substring(floorPrefix.length)) || 0;
          }
          return 0;
        }).filter(n => n > 0).sort((a, b) => a - b);

        let nextNumber = 1;
        for (const n of unitNumbers) { if (n > nextNumber) break; nextNumber = n + 1; }
        if (nextNumber > 99) { this.unit.unitNumber = 'Error'; return; }

        this.unit.unitNumber = `${floorPrefix}-${nextNumber.toString().padStart(2, '0')}`;
      } catch (error) {
        console.error(error);
        this.unit.unitNumber = 'Error';
      }
    },
    addUnit() {
      // Validate required fields
      if (!this.unit.unitNumber || !this.unit.floorLevel || !this.unit.unitType ||
        !this.unit.unitDescription || !this.image1) {
        this.$q.notify({ type: 'negative', message: 'Please fill in all required fields' });
        return;
      }

      // Validate rooms/beds
      if ((this.unit.unitType === 'rooms' && this.unit.rooms.length === 0) ||
        (this.unit.unitType === 'beds' && this.unit.beds.length === 0)) {
        this.$q.notify({ type: 'negative', message: 'Please add at least one ' + this.unit.unitType });
        return;
      }

      this.$q.dialog({
        title: 'Confirm',
        message: 'Create this unit with ' + this.calculateTotalOccupants() + ' occupants?',
        color: 'primary',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        try {
          const formData = new FormData();

          // Build subUnits array
          const subUnits = [];
          if (this.unit.unitType === 'rooms') {
            this.unit.rooms.forEach(room => {
              subUnits.push({
                type: 'room',
                roomType: room.type,
                price: room.price.map(p => ({
                  name: p.name || 'default',
                  price: parseFloat(p.price) || 0
                })),
                isAvailable: true
              });
            });
          } else if (this.unit.unitType === 'beds') {
            this.unit.beds.forEach(bed => {
              subUnits.push({
                type: 'bed',
                bedType: bed.number,
                price: bed.price.map(p => ({
                  name: p.name || 'default',
                  price: parseFloat(p.price) || 0
                })),
                isAvailable: true
              });
            });
          }
          // Calculate total price
          // const totalPrice = subUnits.reduce((sum, s) => sum + (s.price || 0), 0);

          // Append unit data
          formData.append('unitNumber', this.unit.unitNumber);
          formData.append('floorLevel', this.unit.floorLevel);
          // formData.append('unitType', this.unit.unitType); // keep actual type
          formData.append('unitType', 'Shared'); // keep actual type
          formData.append('unitDescription', this.unit.unitDescription);
          formData.append('unitOccupants', this.calculateTotalOccupants());
          // formData.append('unitPrice', this.unit.unitPrice);

          // console.log('Submitting subUnits:', JSON.stringify(subUnits, null, 2));

          // Append subUnits
          formData.append('subUnits', JSON.stringify(subUnits));

          // Append images
          if (this.image1) formData.append('images[]', this.image1);
          if (this.image2) formData.append('images[]', this.image2);
          if (this.image3) formData.append('images[]', this.image3);

          const response = await UnitService.createUnit(formData);
          if (response) {
            this.$q.notify({ type: 'positive', message: 'Unit created successfully!' });
            this.$emit('close');
          }
        } catch (error) {
          this.$q.notify({ type: 'negative', message: error.message || 'Failed to create unit' });
        }
      });
    }
  }
}
</script>

<style lang="sass">
.left-card
  display: flex
  flex-direction: column
  height: 100%

.combined-unit-card
  width: 100%
  max-width: 100%
  padding: 16px

  @media (min-width: 601px)
    min-width: 1200px

  @media (max-width: 600px)
    min-width: unset
    padding: 8px
</style>
