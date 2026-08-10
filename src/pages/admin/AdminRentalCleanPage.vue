<template>
  <q-page class="bg-grey-3">
    <div class="constrain-standard q-pt-md q-pb-md row justify-center" v-show="!loading">
      <div class="col-md-12 col-12 full-height">
        <q-card class="full-height soft-shadow-card">

          <q-card-section class="row justify-between stats-header items-center">
            <div class="row justify-between items-center full-width">
              <div class="text-h6">Active Rental Applications</div>
            </div>
            <q-separator class="q-my-sm" style="width: 100%;" />
          </q-card-section>

          <q-card-section>
            <q-table
              :rows="filteredRentals"
              :columns="rentalColumns"
              row-key="_id"
              flat
              bordered
              :rows-per-page-options="[0]"
            >
              <template v-slot:body-cell-index="props">
                <q-td :props="props">
                  {{ props.rowIndex + 1 }}
                </q-td>
              </template>

              <template v-slot:body-cell-gender="props">
                <q-td :props="props">
                  <q-badge
                    :color="
                      props.row.gender === 'Male'
                        ? 'blue'
                        : props.row.gender === 'Female'
                          ? 'purple'
                          : 'red'
                    "
                    align="middle"
                    class="q-pa-xs q-px-sm"
                  >
                    {{ props.row.gender }}
                  </q-badge>
                </q-td>
              </template>

              <template v-slot:body-cell-actions="props">
                <q-td :props="props">
                  <div class="row justify-center items-center q-gutter-sm no-wrap">
<CustomButton
  v-show="props.row && props.row.firstName"
  flat
  color="red"
  text-color="red"
  class="inline-btn"
  label="Move to Pending"
  @click.stop="moveToPending(props.row)"
/>

                  </div>
                </q-td>
              </template>

              <!-- Custom body template to apply tinted class -->
              <template v-slot:body="props">
                <q-tr :props="props" :class="props.row.tinted ? 'bg-tinted' : ''">
                  <q-td key="unitNumber" :props="props">
                    {{ props.row.unitNumber }}
                  </q-td>
                  <q-td key="currentOccupants" :props="props">
                    {{ props.row.currentOccupants }}
                  </q-td>
                  <q-td key="index" :props="props">
                    {{ props.rowIndex + 1 }}
                  </q-td>
                  <q-td key="unitType" :props="props">
                    {{ props.row.unitType }}
                  </q-td>
                  <q-td key="firstName" :props="props">
                    {{ props.row.firstName }}
                  </q-td>
                  <q-td key="lastName" :props="props">
                    {{ props.row.lastName }}
                  </q-td>
                  <q-td key="phone" :props="props">
                    {{ props.row.phone }}
                  </q-td>
                  <q-td key="email" :props="props">
                    {{ props.row.email }}
                  </q-td>
                  <q-td key="gender" :props="props">
                    <q-badge
                      :color="
                        props.row.gender === 'Male'
                          ? 'blue'
                          : props.row.gender === 'Female'
                            ? 'purple'
                            : 'red'
                      "
                      align="middle"
                      class="q-pa-xs q-px-sm"
                    >
                      {{ props.row.gender }}
                    </q-badge>
                  </q-td>
                  <q-td key="actions" :props="props">
                    <div class="row justify-center items-center q-gutter-sm no-wrap">
                      <CustomButton
                        flat
                        color="red"
                        text-color="red"
                        class="inline-btn"
                        label="Move to Pending"
                        @click.stop="moveToPending(props.row)"
                      />
                    </div>
                  </q-td>
                </q-tr>
              </template>
            </q-table>
          </q-card-section>

        </q-card>
      </div>
    </div>

    <q-inner-loading :showing="loading" color="primary" size="md" />
  </q-page>
</template>

<script>
import RentalService from 'src/services/api/RentalService';
import UserService from 'src/services/api/UserService';
import CustomButton from 'src/components/elements/CustomButton.vue';
import UnitService from 'src/services/api/UnitService';

export default {
  name: "AdminRentalCleanPage",

  data() {
    return {
      loading: true,
      filteredRentals: [],
      rentalColumns: [
        { name: "unitNumber", label: "Unit", field: "unitNumber", align: "left" },
        { name: "currentOccupants", label: "Occupants", field: "currentOccupants", align: "center" },
        { name: "index", label: "#", field: "index", align: 'center' },
        { name: "unitType", label: "Unit", field: "unitType", align: 'left' },
        { name: "firstName", label: "First Name", field: "firstName", align: 'left' },
        { name: "lastName", label: "Last Name", field: "lastName", align: 'left' },
        { name: "phone", label: "Phone Number", field: "phone", align: 'left' },
        { name: "email", label: "Email", field: "email", align: 'left' },
        { name: "gender", label: "Gender", field: "gender", align: 'left' },
        { name: "actions", label: "Actions", field: "actions", align: 'center' },
      ]
    }
  },
  components: { CustomButton },
  methods: {
    async findAllUnits() {
      try {
        const units = await UnitService.getAllUnits();
        return units.map(u => ({
          _id: u._id,
          unitNumber: u.unitNumber,
          unitType: u.unitType,
          currentOccupants: u.currentOccupants || 0,
          unitOccupants: u.unitOccupants || 0
        }));
      } catch (err) {
        console.error("Error fetching units:", err);
        return [];
      }
    },

async findAllRentals() {
  this.loading = true;

  try {
    const [units, rentals] = await Promise.all([
      this.findAllUnits(),
      RentalService.findAllRentals()
    ]);

    const activeRentals = rentals.filter(rental => rental.status === "Active");

    const rentalsWithUsers = await Promise.all(activeRentals.map(async rental => {
      const user = await UserService.findUserById(rental.user);
      const unit = units.find(u => String(u._id) === String(rental.unit));
      return {
        ...rental,
        firstName: user.firstName,
        lastName: user.lastName,
        phone: user.phone,
        email: user.email,
        gender: user.gender,
        unitNumber: unit ? unit.unitNumber : "",
        currentOccupants: unit ? unit.currentOccupants : 0,
        unitType: rental.unitType // keep rental’s unitType for ordering
      };
    }));

    // Add empty units into the same list
    const combinedRows = [...rentalsWithUsers];
    units.forEach(unit => {
      const hasRental = rentalsWithUsers.some(r => String(r.unit) === String(unit._id));
      if (!hasRental) {
        combinedRows.push({
          _id: unit._id,
          unitNumber: unit.unitNumber,
          unitType: unit.unitType,
          currentOccupants: unit.currentOccupants,
          firstName: "",
          lastName: "",
          phone: "",
          email: "",
          gender: "",
          status: "Empty"
        });
      }
    });

    // Parser for ordering
    const parseName = (name) => {
      if (!name) return [0, 0, 0, 0, ""];
      const parts = name.trim().split(" ");
      const sequence = parts.length > 1 ? parts[1] : parts[0];
      const match = sequence.match(/^(\d+)-(\d+)-(\d+)(?:-(\d+))?([A-Z]?)$/);
      if (!match) return [0, 0, 0, 0, ""];
      const [, block, floor, section, room, letter] = match;
      return [
        parseInt(block) || 0,
        parseInt(floor) || 0,
        parseInt(section) || 0,
        parseInt(room) || 0,
        letter || ""
      ];
    };

    // Sort the combined list (rentals + empty units) together
    combinedRows.sort((a, b) => {
      const [blockA, floorA, sectionA, roomA, letterA] = parseName(a.unitType);
      const [blockB, floorB, sectionB, roomB, letterB] = parseName(b.unitType);

      if (blockA !== blockB) return blockA - blockB;
      if (floorA !== floorB) return floorA - floorB;
      if (sectionA !== sectionB) return sectionA - sectionB;
      if (roomA !== roomB) return roomA - roomB;
      return letterA.localeCompare(letterB);
    });

    // Tinting
    let lastPrefix = null;
    let toggle = false;
    combinedRows.forEach(r => {
      const parts = r.unitType.trim().split(" ");
      const sequence = parts.length > 1 ? parts[1] : parts[0];
      const prefix = sequence.split("-").slice(0, 2).join("-");

      if (prefix !== lastPrefix) {
        toggle = !toggle;
        lastPrefix = prefix;
      }
      r.tinted = toggle;
    });

    this.filteredRentals = combinedRows;

  } catch (error) {
    console.error("Error fetching rentals:", error);
  } finally {
    this.loading = false;
  }
},

    async moveToPending(row) {

      console.log(row)
      this.$q.dialog({
        title: 'Confirm',
        message: `You are about to move this rental back to Pending. Continue?`,
        color: 'primary',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        const pendingRental = {
          // ...row,
          status: "Pending"
        }

        const response = await RentalService.updateRental(row._id, pendingRental)
        if (response) {
          this.$q.notify({ type: 'positive', color: 'primary', message: 'Rental moved to Pending!' })
          // this.$emit('close');
          this.findAllRentals();
        } else {
          this.$q.notify({ type: 'negative', message: 'Failed to move rental to Pending. Please try again.' })
        }
      })
    }
  },
  created() {
    this.findAllRentals();
  }
}
</script>

<style lang="scss" scoped>
.bg-tinted {
  background-color: rgba(0, 0, 0, 0.1) !important;
}

:deep(.q-table tbody tr.bg-tinted) {
  background-color: rgba(0, 0, 0, 0.1) !important;
}

.inline-btn {
  display: inline-flex;
  width: auto;
}
</style>
