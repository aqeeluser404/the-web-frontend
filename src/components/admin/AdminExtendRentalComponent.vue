<template>
  <q-card class="combined-unit-card">
    <div class="row">
      <div
        class="col-md-6 col-12 q-pa-md left-card"
        style="background-color: #f8f8f8"
      >
        <q-card-section class="row justify-between items-center">
          <div class="text-h6">Extend Rental</div>
          <q-btn
            flat
            round
            icon="close"
            @click="$emit('close')"
            size="md"
            color="grey-10"
            aria-label="Close"
            class="small-screen-only"
          />
        </q-card-section>

        <q-separator />

        <q-card-section>
          <!-- Current Rental Details -->
          <div class="row q-col-gutter-md">
            <div class="col-12">
              <div class="text-subtitle2 text-grey-7">
                Current Rental Period
              </div>
              <br />
              <div class="row q-mt-sm">
                <div class="col-6">
                  <div class="text-caption text-grey-6">Start Date</div>
                  <div class="text-subtitle1">
                    {{ formattedCurrentStartDisplay }}
                  </div>
                </div>
                <div class="col-6">
                  <div class="text-caption text-grey-6">End Date</div>
                  <div class="text-subtitle1">
                    {{ formattedCurrentEndDisplay }}
                  </div>
                </div>
              </div>
              <div class="row q-mt-xs">
                <div class="col-12">
                  <div class="text-caption text-grey-6">Year</div>
                  <div class="text-subtitle1">{{ currentYear }}</div>
                </div>
              </div>
              <div class="row q-mt-xs">
                <div class="col-12">
                  <div class="text-caption text-grey-6">Current Unit</div>
                  <div class="text-subtitle1">
                    {{ currentUnitNumber || "N/A" }}
                  </div>
                </div>
              </div>
              <div class="row q-mt-xs">
                <div class="col-12">
                  <div class="text-caption text-grey-6">Current Room</div>
                  <div class="text-subtitle1">{{ currentRoom }}</div>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>
      </div>

      <div class="col-md-6 col-12 q-pa-md">
        <q-card-section class="row justify-end items-center q-py-none q-py-sm">
          <q-btn
            flat
            round
            icon="close"
            @click="$emit('close')"
            size="md"
            color="grey-10"
            aria-label="Close"
            class="large-screen-only"
          />
        </q-card-section>

        <q-card-section>
          <div class="col-12">
            <div class="text-subtitle2 text-grey-7">New Rental Period</div>
            <br />
            <div class="row q-mt-sm">
              <div class="col-6">
                <div class="text-caption text-grey-6">Start Date</div>
                <div class="text-subtitle1 text-primary">
                  {{ formattedNewStartDisplay }}
                </div>
              </div>
              <div class="col-6">
                <div class="text-caption text-grey-6">End Date</div>
                <div class="text-subtitle1 text-primary">
                  {{ formattedNewEndDisplay }}
                </div>
              </div>
            </div>
            <br />

            <!-- Year Selection -->
            <div class="row q-mt-xs">
              <div class="col-12">
                <div class="row q-mt-md items-center">
                  <div class="col-12 col-md-4">
                    <span class="text-subtitle1">Select New Year:</span>
                  </div>
                  <div class="col-12 col-md-8">
                    <br class="small-screen-only" />
                    <q-btn-toggle
                      v-model="selectedYear"
                      :options="yearOptions"
                      unelevated
                      toggle-color="primary"
                      @update:model-value="onYearChange"
                      class="full-width"
                      style="flex-wrap: wrap"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Unit Selection -->
            <div class="row q-mt-md">
              <div class="col-12">
                <div class="row items-center">
                  <div class="col-12 col-md-4">
                    <span class="text-subtitle1">Select Unit:</span>
                  </div>
                  <div class="col-12 col-md-8">
                    <q-select
                      v-model="selectedUnit"
                      :options="unitOptions"
                      label="Choose a unit"
                      dense
                      outlined
                      emit-value
                      map-options
                      option-label="label"
                      option-value="value"
                      @update:model-value="onUnitChange"
                      :loading="loadingUnits"
                      class="full-width"
                    >
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey-6">
                            No units available for {{ selectedYear }}
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>
                </div>
              </div>
            </div>

            <!-- Room Selection -->
            <div class="row q-mt-md">
              <div class="col-12">
                <div class="row items-center">
                  <div class="col-12 col-md-4">
                    <span class="text-subtitle1">Select Room:</span>
                  </div>
                  <div class="col-12 col-md-8">
                    <q-select
                      v-model="selectedRoom"
                      :options="roomOptions"
                      label="Choose a room"
                      dense
                      outlined
                      emit-value
                      map-options
                      option-label="label"
                      option-value="value"
                      :loading="loadingRooms"
                      class="full-width"
                    >
                      <template v-slot:no-option>
                        <q-item>
                          <q-item-section class="text-grey-6">
                            No rooms available for this unit
                          </q-item-section>
                        </q-item>
                      </template>
                    </q-select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-section class="row justify-between">
          <CustomButton
            label="Save Changes"
            @click="extendRental"
            :disable="
              !selectedYear ||
              selectedYear === currentYear ||
              !selectedUnit ||
              !selectedRoom
            "
          />
        </q-card-section>
      </div>
    </div>
  </q-card>
</template>

<script>
import CustomButton from "../elements/CustomButton.vue";
import RentalService from "src/services/api/RentalService";
import EmailService from "src/services/api/EmailService";
import UnitService from "src/services/api/UnitService";

export default {
  name: "AdminExtendRentalComponent",

  props: {
    rental: {
      type: Object,
      required: true,
    },
  },

  components: {
    CustomButton,
  },

  data() {
    return {
      selectedYear: null,
      yearOptions: [],
      currentYear: null,
      formattedCurrentStart: "",
      formattedCurrentEnd: "",
      formattedNewStart: "",
      formattedNewEnd: "",
      rentalExtension: "",
      loadingYears: false,

      // Unit/Room selection
      selectedUnit: null,
      selectedRoom: null,
      unitOptions: [],
      roomOptions: [],
      loadingUnits: false,
      loadingRooms: false,
      allUnits: [],
      currentRoom: "",
      currentUnitId: null,
    };
  },

  computed: {
    crossesIntoNewYear() {
      return this.selectedYear && this.selectedYear > this.currentYear;
    },
    // ✅ Computed for current unit number (no params)
    currentUnitNumber() {
      const unit = this.allUnits.find((u) => u._id === this.rental.unit);
      return unit ? unit.unitNumber : "N/A";
    },
    // ✅ Computed for selected unit number (no params)
    selectedUnitNumber() {
      const unit = this.allUnits.find((u) => u._id === this.selectedUnit);
      return unit ? unit.unitNumber : "N/A";
    },
    formattedCurrentStartDisplay() {
      return this.formatDisplayDate(this.rental.rentalStartDate);
    },
    formattedCurrentEndDisplay() {
      return this.formatDisplayDate(this.rental.rentalEndDate);
    },
    formattedNewStartDisplay() {
      return this.formatDisplayDate(this.formattedNewStart);
    },
    formattedNewEndDisplay() {
      return this.formatDisplayDate(this.formattedNewEnd);
    },
  },

  methods: {
    formatDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      return date.toISOString().split("T")[0];
    },

    formatDisplayDate(dateString) {
      if (!dateString) return "";
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return "";
      const day = date.getDate();
      const month = date.toLocaleString("en-ZA", { month: "short" });
      const year = date.getFullYear();
      return `${day} ${month} ${year}`;
    },

    getCurrentRoom() {
      const sub = this.rental.selectedSubUnits;
      if (sub) {
        return sub.bedType || sub.roomType || sub.type || "N/A";
      }
      return "N/A";
    },

    // ✅ Add this as a method for looking up any unit number
    getUnitNumber(unitId) {
      if (!unitId) return "N/A";
      const unit = this.allUnits.find((u) => u._id === unitId);
      return unit ? unit.unitNumber : "N/A";
    },

    async fetchAvailableYears() {
      try {
        this.loadingYears = true;

        // Get all units
        const units = await UnitService.getAllUnits();
        this.allUnits = units;

        // Find the current unit
        const currentUnit = units.find((u) => u._id === this.rental.unit);
        this.currentUnitId = currentUnit?._id || null;

        // Extract unique years from units, sort ascending
        const years = [...new Set(units.map((u) => u.unitYear))].sort(
          (a, b) => a - b
        );

        // Generate options from available years
        const options = years.map((year) => ({
          label: year.toString(),
          value: year,
        }));

        // Only show years that are:
        // 1. Future years (greater than current year)
        // 2. NOT the current year (user can't extend to the same year)
        const filteredOptions = options.filter((opt) => {
          const isCurrentYear = opt.value === this.currentYear;
          const isFutureYear = opt.value > this.currentYear;
          return !isCurrentYear && isFutureYear;
        });

        this.yearOptions = filteredOptions;

        // Auto-select the first available future year
        if (this.yearOptions.length > 0) {
          this.selectedYear = this.yearOptions[0].value;
          this.updateNewDates();
          await this.loadUnitsForYear(this.selectedYear);
        } else {
          this.$q.notify({
            type: "warning",
            message:
              "No future years available for extension. Please create units for future years first.",
          });
        }
      } catch (error) {
        console.error("Error fetching available years:", error);
        this.$q.notify({
          type: "negative",
          message: "Failed to load available years. Please try again.",
        });
      } finally {
        this.loadingYears = false;
      }
    },

    async loadUnitsForYear(year) {
      try {
        this.loadingUnits = true;
        this.selectedUnit = null;
        this.selectedRoom = null;
        this.roomOptions = [];

        // Filter units by selected year
        const unitsForYear = this.allUnits.filter((u) => u.unitYear === year);

        this.unitOptions = unitsForYear.map((unit) => ({
          label: unit.unitNumber || "Unit",
          value: unit._id,
          unit: unit,
        }));

        // ✅ Try to find the matching unit by unitNumber (same as current)
        const currentUnit = this.allUnits.find(
          (u) => u._id === this.rental.unit
        );
        const matchingUnit = unitsForYear.find(
          (u) => u.unitNumber === currentUnit?.unitNumber
        );

        if (matchingUnit) {
          // Auto-select the matching unit
          this.selectedUnit = matchingUnit._id;
          await this.loadRoomsForUnit(this.selectedUnit);
        } else if (this.unitOptions.length > 0) {
          // Fallback to first unit
          this.selectedUnit = this.unitOptions[0].value;
          await this.loadRoomsForUnit(this.selectedUnit);
        }
      } catch (error) {
        console.error("Error loading units:", error);
        this.$q.notify({
          type: "negative",
          message: "Failed to load units for this year.",
        });
      } finally {
        this.loadingUnits = false;
      }
    },

    async loadRoomsForUnit(unitId) {
      try {
        this.loadingRooms = true;
        this.selectedRoom = null;

        // Find the unit
        const unit = this.allUnits.find((u) => u._id === unitId);
        if (!unit || !unit.subUnits) {
          this.roomOptions = [];
          return;
        }

        // Get current room identifier
        const currentRoomId =
          this.rental.selectedSubUnits?.bedType ||
          this.rental.selectedSubUnits?.roomType ||
          this.rental.selectedSubUnits?.type;

        // Get available rooms (isAvailable = true) OR the matching room if it exists
        const availableRooms = unit.subUnits.filter(
          (sub) => sub.isAvailable !== false
        );

        this.roomOptions = availableRooms.map((sub) => ({
          label: sub.bedType || sub.roomType || sub.type || "Room",
          value: sub,
        }));

        // ✅ Try to find the matching room by bedType/roomType
        const matchingRoom = availableRooms.find(
          (sub) =>
            (sub.bedType && sub.bedType === currentRoomId) ||
            (sub.roomType && sub.roomType === currentRoomId)
        );

        if (matchingRoom) {
          // Auto-select the matching room
          this.selectedRoom = matchingRoom;
        } else if (this.roomOptions.length > 0) {
          // Fallback to first available room
          this.selectedRoom = this.roomOptions[0].value;
        }
      } catch (error) {
        console.error("Error loading rooms:", error);
        this.$q.notify({
          type: "negative",
          message: "Failed to load rooms for this unit.",
        });
      } finally {
        this.loadingRooms = false;
      }
    },

    onYearChange() {
      this.updateNewDates();
      if (this.selectedYear) {
        this.loadUnitsForYear(this.selectedYear);
      }
    },

    onUnitChange() {
      if (this.selectedUnit) {
        this.loadRoomsForUnit(this.selectedUnit);
      }
    },

    updateNewDates() {
      if (!this.selectedYear) return;

      this.formattedNewStart = `${this.selectedYear}-02-01`;
      this.formattedNewEnd = `${this.selectedYear}-12-15`;
      this.rentalExtension = this.formattedNewEnd;
    },

    async extendRental() {
      if (!this.selectedYear || this.selectedYear === this.currentYear) {
        this.$q.notify({
          type: "negative",
          message: "Please select a different year to extend to.",
        });
        return;
      }

      if (!this.selectedUnit || !this.selectedRoom) {
        this.$q.notify({
          type: "negative",
          message: "Please select a unit and room for the new year.",
        });
        return;
      }

      const newEndDate = `${this.selectedYear}-12-15`;
      const message = `Extended to ${newEndDate}`;

      // Check if same unit and room (for history tracking)
      const unitChanged = this.getSelectedUnitNumber() !== this.currentUnitNumber; // 🆕 was: this.selectedUnit !== this.rental.unit

      const roomChanged =
        (this.selectedRoom.bedType || this.selectedRoom.roomType) !==
        (this.rental.selectedSubUnits?.bedType ||
          this.rental.selectedSubUnits?.roomType);

      // ✅ Only show warning if rental is already renewed AND changing unit/room
      const isAlreadyRenewed = this.rental.renewed === true;
      const showRoomChangeWarning =
        isAlreadyRenewed && (unitChanged || roomChanged);

      this.$q
        .dialog({
          title: "Confirm Extension",
          message: `
          <div class="q-mt-sm">
            <div><strong>Current:</strong> ${this.formatDisplayDate(
              this.rental.rentalEndDate
            )}</div>
            <div><strong>New:</strong> ${this.formatDisplayDate(
              newEndDate
            )}</div>
            <div class="q-mt-sm"><strong>Current Unit:</strong> ${
              this.currentUnitNumber
            }</div>
            <div><strong>New Unit:</strong> ${this.selectedUnitNumber}</div>
            <div class="q-mt-sm"><strong>Current Room:</strong> ${
              this.currentRoom
            }</div>
            <div><strong>New Room:</strong> ${
              this.selectedRoom.bedType || this.selectedRoom.roomType || "Room"
            }</div>
            ${
              showRoomChangeWarning
                ? '<div class="q-mt-sm text-warning">⚠️ This rental is already renewed and you are changing the unit/room — this will break the renewal chain.</div>'
                : ""
            }
            ${
              !isAlreadyRenewed && (unitChanged || roomChanged)
                ? '<div class="q-mt-sm text-info">ℹ️ First extension with room change — this will create a new renewal chain.</div>'
                : ""
            }
            <div class="q-mt-sm text-primary">This will move the rental to the ${
              this.selectedYear
            } unit.</div>
          </div>
        `,
          html: true,
          color: "primary",
          cancel: true,
          persistent: true,
        })
        .onOk(async () => {
          try {
            let response;

            // If unit or room changed, pass the override parameters
            if (this.crossesIntoNewYear && (unitChanged || roomChanged)) {
              response = await RentalService.extendRentalToNewYear(
                this.rental._id,
                newEndDate,
                this.selectedUnit,
                this.selectedRoom
              );
            } else if (this.crossesIntoNewYear) {
              // Same unit and room, just extend
              response = await RentalService.extendRentalToNewYear(
                this.rental._id,
                newEndDate
              );
            } else {
              const updatedRental = {
                applicationDate: this.rental.applicationDate,
                status: this.rental.status,
                rentalStartDate: this.rental.rentalStartDate,
                rentalEndDate: newEndDate,
                rentalPrice: this.rental.rentalPrice,
                unit: this.rental.unit,
                unitType: this.rental.unitType,
                user: this.rental.user,
              };
              response = await RentalService.updateRental(
                this.rental._id,
                updatedRental
              );
            }

            if (response) {
              this.$q.notify({
                type: "positive",
                color: "primary",
                message: `Rental extended to ${this.selectedYear}!`,
              });

              await EmailService.SendExtendedDate(this.rental.user, {
                message,
              });
              this.$emit("close");
            } else {
              this.$q.notify({
                type: "negative",
                message: "Extension for rental failed. Please try again.",
              });
            }
          } catch (error) {
            console.error("Extension error:", error);
            this.$q.notify({
              type: "negative",
              message:
                error.message ||
                "Extension for rental failed. Please try again.",
            });
          }
        })
        .onCancel(() => {});
    },

    getSelectedUnitNumber() {
      const unit = this.allUnits.find((u) => u._id === this.selectedUnit);
      return unit ? unit.unitNumber : "N/A";
    },
  },

  async created() {
    // Set current year from rental
    const endDate = new Date(this.rental.rentalEndDate);
    this.currentYear = endDate.getFullYear();

    // Get current room
    this.currentRoom = this.getCurrentRoom();

    // Format current dates
    this.formattedCurrentStart = this.formatDate(this.rental.rentalStartDate);
    this.formattedCurrentEnd = this.formatDate(this.rental.rentalEndDate);

    // Fetch available years from units
    await this.fetchAvailableYears();
  },
};
</script>

<style scoped>
.component-card {
  min-width: 500px;
  max-width: 700px;
}

@media (max-width: 600px) {
  .component-card {
    min-width: unset;
    width: 100%;
  }
}
</style>
