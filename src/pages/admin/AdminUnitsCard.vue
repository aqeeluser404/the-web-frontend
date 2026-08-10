<template>
  <q-page class="bg-grey-3">
    <div class="constrain-standard row justify-center q-py-md">

      <div class="col-md-8 col-12 full-height" v-show="!loading">

        <!-- view all units -->
        <q-card class="full-height soft-shadow-card" :class="$q.screen.lt.sm ? 'q-mb-md' : 'q-mr-md'">

          <q-tabs
            v-model="selectedYear"
            dense
            active-color="primary"
            indicator-color="primary"
            align="justify"
            @update:model-value="applyYearFilter"
          >
            <q-tab v-for="year in availableYears" :key="year" :name="year" :label="String(year)" />
          </q-tabs>
          <!-- <q-separator /> -->

          <q-expansion-item v-for="(units, floorIndex) in allUnits" :key="floorIndex"
            :label="`${floorLabels[floorIndex]} (${units.length} items)`" expand-separator
            v-model="expanded[floorIndex]" @show="handleExpansion(floorIndex)">
            <q-list class="row justify-center">
              <q-card v-for="unit in units" :key="unit._id" flat bordered class="q-ma-sm">
                <q-card-section class="column flex-center">
                  <div class="text-h6">

                    <!-- unit number -->
                    Unit {{ unit.unitNumber }}

                    <!-- available status -->
                    (
                    <span
                      v-if="unit.unitStatus === 'Available' && unit.subUnits?.length && !unit.subUnits.some(sub => sub.reservedBy)"
                      :class="{ 'available-unit': true }">
                      Available
                    </span>

                    <span v-else-if="unit.unitStatus === 'Available' && unit.subUnits?.some(sub => !sub.reservedBy)"
                      :class="{ 'partially-reserved-unit': true }" style="color: orange;">
                      Partially Reserved
                    </span>

                    <span
                      v-else-if="unit.unitStatus === 'Available' && unit.subUnits?.length && unit.subUnits.every(sub => sub.reservedBy)"
                      :class="{ 'fully-reserved-unit': true }" style="color: crimson;">
                      Fully Reserved
                    </span>

                    <span v-else-if="unit.unitStatus === 'Occupied'" :class="{ 'occupied-unit': true }">
                      Occupied
                    </span>
                    )
                  </div>
                  <!-- shared + bed count -->
                  <div class="text-caption">
                    {{ unit.unitType }} -
                    {{
                      Array.isArray(unit.subUnits)
                        ? unit.subUnits.filter(sub => sub.isAvailable && !sub.reservedBy).length
                        : 0
                    }}/{{
                      Array.isArray(unit.subUnits)
                        ? unit.subUnits.filter(sub => !sub.reservedBy).length
                        : 0
                    }} Beds
                  </div>
                  <!-- reserved by (subUnit-level) -->
                  <div v-if="Array.isArray(unit.subUnits) && unit.subUnits.some(sub => sub?.reservedBy)"
                    class="text-caption text-weight-light" style="color: black;">
                    {{ getReservedSummary(unit.subUnits) }}
                  </div>
                  <div v-else class="text-caption text-weight-light" style="color: black;">
                    Unreserved
                  </div>
                </q-card-section>
                <q-card-section class="row justify-center">
                  <div class="image-container">
                    <q-img v-if="unit.images?.length" :src="getImageUrl(unit.images[0].imageUrl)" class="image" />
                  </div>
                </q-card-section>
                <q-card-section class="row justify-between">
                  <CustomButton label="Update " customStyle="width: 40%" color="white" text-color="black"
                    @click="openUnitDetails(unit)" />
                  <CustomButton label="Delete " customStyle="width: 40%" @click="deleteUnit(unit)" />
                </q-card-section>
              </q-card>
            </q-list>
          </q-expansion-item>
        </q-card>
      </div>

      <div class="col-md-4 col-12 full-height" v-show="!loading">
        <!-- add new unit -->
        <q-card class="full-height soft-shadow-card">
          <q-card-section class="row justify-between stats-header items-center">
            <div class="text-h6">Add a new unit</div>
            <q-btn @click="downloadData()" class="custom-button" icon="eva-cloud-download-outline" flat rounded />
            <q-separator class="q-my-sm" style="width: 100%;" />
          </q-card-section>
          <!-- <q-separator /> -->
          <q-card-section class="q-pa-">
            <div class="q-mb-sm">When adding new units to the system, please note the following guidelines:</div>
            <ul>
              <li class="q-mb-sm">Units will be assigned the next available unit number based on the highest existing
                unit
                number for the selected floor level.</li>
              <li class="q-mb-sm">Each unit entry can accommodate a maximum of three images which must be provided
                during
                the creation process.</li>
              <li class="q-mb-sm">Unit numbers are automatically generated by the system and cannot be manually altered
                to
                ensure <span style="text-decoration: underline;">consistency and accuracy.</span></li>
            </ul>
          </q-card-section>
          <q-card-section>
            <CustomButton label="Add New" @click="openAddUnitsDialog" />
          </q-card-section>
        </q-card>
      </div>

      <q-inner-loading :showing="loading" color="primary" size="md" />
    </div>
    <q-dialog v-model="updateDetailsDialog">
      <AdminUnitDetailsComponent :unit="selectedUnit" @close="handleClose" />
    </q-dialog>
    <q-dialog v-model="addUnitsDialog">
      <AdminAddUnitComponent @close="handleClose" />
    </q-dialog>
  </q-page>
</template>

<script>
import UnitService from 'src/services/api/UnitService';
import CustomButton from 'src/components/elements/CustomButton.vue';
import Helper from 'src/services/helper/utils';
import AdminAddUnitComponent from 'src/components/admin/AdminAddUnitComponent.vue';
import AdminUnitDetailsComponent from 'src/components/admin/AdminUnitDetailsComponent.vue';
import UserService from 'src/services/api/UserService';
import ExportDataService from 'src/services/api/ExportDataService'

export default {
  name: "AdminUnitsCard",

  data() {
    return {
      loading: true,
      users: [],
      units: [],
      allUnits: [],
      // floorLabels: ['Ground Floor', 'First Floor', 'Second Floor'],
      floorLabels: ['First Floor', 'Second Floor', 'Third Floor'],

      addUnitsDialog: false,

      selectedUnit: null,
      updateDetailsDialog: false,

      expanded: [true, false, false],

      selectedYear: 2026,
      availableYears: []
    };
  },
  components: {
    CustomButton,
    AdminAddUnitComponent,
    AdminUnitDetailsComponent
  },
  methods: {
    getImageUrl: Helper.getImageUrl,
    capitalizeFirstLetter: Helper.capitalizeFirstLetter,

    async downloadData() {
      this.$q.dialog({
        title: 'Download Data',
        message: 'You are about to export all data for units. Would you like to proceed?',
        color: 'primary',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        try {
          const today = new Date().toISOString().split('T')[0];

          const response = await ExportDataService.exportUnitData();

          if (!response || !response.data) {
            throw new Error('Invalid response from server');
          }

          const blob = new Blob([response.data], { type: response.headers['content-type'] });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `units_export_${today}.xlsx`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setTimeout(() => URL.revokeObjectURL(url), 100);

        } catch (error) {
          this.$q.notify({
            type: 'negative',
            message: 'Export failed: ' + (error.message || 'Please try again')
          });
        }
      });
    },

    getReservedSummary(subUnits) {
      const reserved = subUnits
        .map((sub, i) => sub?.reservedBy ? `Room ${i + 1} by ${this.getUsername(sub.reservedBy)}` : null)
        .filter(Boolean);
      return reserved.length > 0 ? reserved.join(', ') : '';
    },

    async findAllUnits() {
      this.loading = true;
      const response = await UnitService.getAllUnits();

      this.units = response.map(unit => ({
        ...unit,
        unitYear: Number(unit.unitYear) || 2026,
        subUnits: (unit.subUnits || []).map(sub => ({
          ...sub,
          name: sub.name || sub.roomType || sub.bedType || ''
        }))
      }));

      this.availableYears = [...new Set(this.units.map(u => u.unitYear))].sort((a, b) => a - b);

      this.applyYearFilter();

      this.loading = false;
    },

    applyYearFilter() {
      const yearFiltered = this.units.filter(unit => unit.unitYear === this.selectedYear);
      const sortedUnits = Helper.sortByProperty(yearFiltered, 'unitNumber', 'asc');

      const groundFloorUnits = sortedUnits.filter(unit => unit.floorLevel === 'First Floor');
      const firstFloorUnits = sortedUnits.filter(unit => unit.floorLevel === 'Second Floor');
      const secondFloorUnits = sortedUnits.filter(unit => unit.floorLevel === 'Third Floor');

      this.allUnits = [groundFloorUnits, firstFloorUnits, secondFloorUnits];
    },

    getUsername(userId) {
      const user = this.users?.find(u => u._id === userId);
      // console.log(user.username)
      return user?.username || 'Unknown';
    },

    async deleteUnit(unit) {
      // console.log(unit)
      // Check if there are active or pending rentals
      const hasActiveRentals = unit.rentedHistory.some(rental => rental.status !== 'Ended');

      if (hasActiveRentals) {
        this.$q.notify({
          type: 'negative',
          message: 'This unit cannot be deleted as it still has active or pending rentals.'
        });
        return;
      }

      // Proceed with deletion confirmation
      this.$q.dialog({
        title: 'Confirm',
        message: `You are about to delete this unit entry. This action is irreversible. However, it will not remove the entry from the associated rental application, which must be manually deleted. Proceed with caution. Do you wish to continue?`,
        color: 'primary',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        const response = await UnitService.deleteUnit(unit._id);
        if (response) {
          this.$q.notify({ type: 'positive', color: 'primary', message: 'Unit Deleted!' });
          this.findAllUnits();
        } else {
          this.$q.notify({ type: 'negative', message: 'Failed to delete unit. Please try again.' });
        }
      }).onCancel(() => {
        return;
      });
    },
    openAddUnitsDialog() {
      this.addUnitsDialog = true;
    },
    openUnitDetails(unit) {
      this.selectedUnit = unit,
        this.updateDetailsDialog = true
    },

    handleClose() {
      this.updateDetailsDialog = false
      this.addUnitsDialog = false;
      this.findAllUnits();
    },
    handleExpansion(expandedIndex) {
      this.expanded = this.expanded.map((_, index) => index === expandedIndex)
    },
    async findAllUsers() {
      try {
        const response = await UserService.findAllUsers();
        this.users = response || [];
        // console.log(this.users)
      } catch (error) {
        this.$q.notify({
          type: 'negative',
          message: 'Failed to load user list'
        });
        this.users = [];
      }
    }
  },
  created() {
    this.findAllUsers()
    this.findAllUnits();
  },
};
</script>

<style lang="sass">
.image-container
  width: 350px
  height: 350px
  display: flex
  justify-content: center
  align-items: center
  overflow: hidden
  background-color: #f5f5f5
  padding: 5px
  @media (max-width: 1025px)
    width: 300px
    height: 300px

.image
  max-width: 100%
  max-height: 100%
  object-fit: contain
</style>
