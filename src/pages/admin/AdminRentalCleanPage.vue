<template>
  <q-page class="bg-grey-3">
    <div
      class="constrain-standard q-pt-md q-pb-md row justify-center"
      v-show="!loading"
    >
      <div class="col-md-12 col-12 full-height">
        <q-card class="full-height soft-shadow-card">
          <q-card-section class="row justify-between stats-header items-center">
            <div class="row justify-between items-center full-width">
              <div class="text-h6">Active Rental Applications</div>
              <q-select
                filled
                dense
                v-model="selectedYear"
                :options="availableYears"
                style="min-width: 120px"
                @update:model-value="applyYearFilter"
              />
            </div>
            <q-separator class="q-my-sm" style="width: 100%" />
          </q-card-section>

          <q-card-section>
            <q-list bordered>
              <q-expansion-item
                v-for="floor in floorGroups"
                :key="floor.floorLevel"
                :label="floor.floorLevel"
                :caption="`${floor.occupiedCount} / ${floor.roomCount} occupied`"
                header-class="text-h6"
                default-opened
              >
                <q-table
                  :rows="floor.units"
                  :columns="unitColumns"
                  row-key="_id"
                  flat
                  bordered
                  :rows-per-page-options="[0]"
                >
                  <template v-slot:body="props">
                    <!-- Unit-level row, clickable to expand -->
                    <q-tr
                      :props="props"
                      class="cursor-pointer"
                      @click="toggleExpand(props.row._id)"
                    >
                      <q-td key="unitNumber" :props="props">{{
                        props.row.unitNumber
                      }}</q-td>
                      <q-td key="occupancy" :props="props">
                        <q-badge
                          :color="props.row.emptyCount > 0 ? 'orange' : 'green'"
                        >
                          {{ props.row.occupiedCount }} /
                          {{ props.row.totalCount }} occupied
                        </q-badge>
                      </q-td>
                      <q-td key="genderAssignment" :props="props">
                        <q-badge
                          v-if="props.row.genderAssignment"
                          :color="
                            props.row.genderAssignment === 'Male'
                              ? 'blue'
                              : props.row.genderAssignment === 'Female'
                              ? 'purple'
                              : 'grey'
                          "
                        >
                          {{ props.row.genderAssignment }} unit
                        </q-badge>
                        <span v-else class="text-grey">Unassigned</span>
                      </q-td>
                      <q-td key="expand" :props="props">
                        <q-icon
                          :name="
                            expandedUnitIds.has(props.row._id)
                              ? 'expand_less'
                              : 'expand_more'
                          "
                          size="20px"
                        />
                      </q-td>
                    </q-tr>

                    <!-- Expanded sub-unit detail row -->
                    <q-tr
                      v-if="expandedUnitIds.has(props.row._id)"
                      :props="props"
                    >
                      <q-td colspan="100%" class="q-pa-none">
                        <q-list bordered separator>
                          <q-item
                            v-for="(sub, idx) in props.row.subUnits"
                            :key="idx"
                          >
                            <q-item-section>
                              <q-item-label>{{ sub.identifier }}</q-item-label>
                            </q-item-section>

                            <template v-if="sub.rental">
                              <q-item-section
                                >{{ sub.rental.firstName }}
                                {{ sub.rental.lastName }}</q-item-section
                              >
                              <q-item-section>{{
                                sub.rental.phone
                              }}</q-item-section>
                              <q-item-section>{{
                                sub.rental.email
                              }}</q-item-section>
                              <q-item-section>
                                <q-badge
                                  style="width: 50%"
                                  :color="
                                    sub.rental.gender === 'Male'
                                      ? 'blue'
                                      : sub.rental.gender === 'Female'
                                      ? 'purple'
                                      : 'red'
                                  "
                                >
                                  {{ sub.rental.gender }}
                                </q-badge>
                              </q-item-section>

                              <!-- 🆕 whole section new — labels the extension relationship -->
                              <q-item-section
                                v-if="sub.viewContext === 'extendedInto'"
                              >
                                <q-badge color="teal">
                                  Renewed from {{ sub.rental.unitYear - 1 }}
                                </q-badge>
                              </q-item-section>
                              <q-item-section
                                v-else-if="sub.viewContext === 'extendedFrom'"
                              >
                                <q-badge color="grey-7">
                                  Renewed to {{ sub.rental.unitYear }}
                                </q-badge>
                              </q-item-section>

                              <q-item-section side>
                                <div class="row items-center">
                                  <q-btn
                                    round
                                    class="q-mr-sm"
                                    color="red"
                                    size="sm"
                                    icon="eva-trash-outline"
                                    @click.stop="deleteRental(sub.rental._id)"
                                  >
                                    <q-tooltip
                                      anchor="top middle"
                                      self="bottom middle"
                                      >Delete Rental</q-tooltip
                                    >
                                  </q-btn>
                                  <q-btn
                                    round
                                    class="q-mr-sm"
                                    color="red"
                                    size="sm"
                                    icon="eva-archive-outline"
                                    @click.stop="endRental(sub.rental._id)"
                                  >
                                    <q-tooltip
                                      anchor="top middle"
                                      self="bottom middle"
                                      >End Rental</q-tooltip
                                    >
                                  </q-btn>
                                  <q-btn
                                    round
                                    class="q-mr-sm"
                                    color="red"
                                    size="sm"
                                    icon="arrow_back"
                                    @click.stop="moveToPending(sub.rental)"
                                  >
                                    <q-tooltip
                                      anchor="top middle"
                                      self="bottom middle"
                                      >Move to Pending</q-tooltip
                                    >
                                  </q-btn>
                                  <q-btn
                                    class="q-mr-sm"
                                    round
                                    color="primary"
                                    size="sm"
                                    icon="event"
                                    @click.stop="openExtendDialog(sub.rental)"
                                  >
                                    <q-tooltip
                                      anchor="top middle"
                                      self="bottom middle"
                                      >Extend Date</q-tooltip
                                    >
                                  </q-btn>
                                  <q-btn
                                    class="q-mr-sm"
                                    round
                                    color="secondary"
                                    size="sm"
                                    icon="edit"
                                    @click.stop="
                                      openApprovalDialog(sub.rental, props.row)
                                    "
                                  >
                                    <q-tooltip
                                      anchor="top middle"
                                      self="bottom middle"
                                      >Review Approval / Change Unit</q-tooltip
                                    >
                                  </q-btn>
                                </div>
                              </q-item-section>
                            </template>

                            <template v-else>
                              <q-item-section class="text-grey"
                                >Empty</q-item-section
                              >
                            </template>
                          </q-item>
                        </q-list>
                      </q-td>
                    </q-tr>
                  </template>
                </q-table>
              </q-expansion-item>
            </q-list>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-inner-loading :showing="loading" color="primary" size="md" />
    <q-dialog v-model="extendDialog">
      <AdminExtendRentalComponent
        v-if="selectedRentalForExtend"
        :rental="selectedRentalForExtend"
        @close="handleExtendClose"
      />
    </q-dialog>

    <q-dialog v-model="approvalDialog">
      <AdminRentalApprovalComponent
        v-if="selectedRentalForApproval"
        :rental="selectedRentalForApproval"
        @close="handleApprovalClose"
      />
    </q-dialog>
  </q-page>
</template>

<script>
import RentalService from "src/services/api/RentalService";
import UserService from "src/services/api/UserService";
import CustomButton from "src/components/elements/CustomButton.vue";
import UnitService from "src/services/api/UnitService";
import AdminExtendRentalComponent from "src/components/admin/AdminExtendRentalComponent.vue";
import AdminRentalApprovalComponent from "src/components/admin/AdminRentalApprovalComponent.vue";

export default {
  name: "AdminRentalCleanPage",

  data() {
    return {
      loading: true,
      allUnitRows: [],
      filteredUnits: [],
      selectedYear: null,
      availableYears: [],
      expandedUnitIds: new Set(),

      extendDialog: false,
      approvalDialog: false,
      selectedRentalForExtend: null,
      selectedRentalForApproval: null,

      unitColumns: [
        {
          name: "unitNumber",
          label: "Unit",
          field: "unitNumber",
          align: "left",
        },
        {
          name: "occupancy",
          label: "Occupancy",
          field: "occupancy",
          align: "center",
        },
        {
          name: "genderAssignment",
          label: "Gender Assignment",
          field: "genderAssignment",
          align: "center",
        },
        { name: "expand", label: "", field: "expand", align: "center" },
      ],
    };
  },
  components: {
    CustomButton,
    AdminExtendRentalComponent,
    AdminRentalApprovalComponent,
  },
  computed: {
    floorGroups() {
      const groups = {};
      for (const unit of this.filteredUnits) {
        const floor = unit.floorLevel || "Unknown Floor";
        if (!groups[floor]) groups[floor] = [];
        groups[floor].push(unit);
      }

      const floorOrder = ["First Floor", "Second Floor", "Third Floor"];
      return floorOrder
        .filter((f) => groups[f])
        .map((f) => {
          const roomCount = groups[f].reduce(
            (sum, unit) => sum + unit.totalCount,
            0
          );
          const occupiedCount = groups[f].reduce(
            (sum, unit) => sum + unit.occupiedCount,
            0
          );
          return {
            floorLevel: f,
            units: groups[f],
            roomCount,
            occupiedCount,
          };
        });
    },
  },
  methods: {
    getActiveRentalId(subUnits) {
      const subWithRental = subUnits?.find((s) => s.rental);
      return subWithRental?.rental?._id || null;
    },
    async findAllUnitsRaw() {
      try {
        const units = await UnitService.getAllUnits();
        return units.map((u) => ({
          _id: u._id,
          unitNumber: u.unitNumber,
          floorLevel: u.floorLevel,
          genderAssignment: u.genderAssignment || null,
          unitType: u.unitType,
          unitYear: Number(u.unitYear) || 2026,
          subUnits: u.subUnits || [],
        }));
      } catch (err) {
        console.error("Error fetching units:", err);
        return [];
      }
    },

    async findAllRentals() {
      this.loading = true;

      try {
        const response = await RentalService.findAllRentals();
        const activeRentals = response.filter(
          (rental) => rental.status === "Active"
        );

        const userIds = [
          ...new Set(activeRentals.map((rental) => rental.user)),
        ];
        const usersMap = await UserService.findUsersByIds(userIds);

        // console.log("user object:", usersMap);

        const rentalsWithUsers = activeRentals.map((rental) => {
          const user = usersMap[rental.user] || {};
          // console.log("user object:", user);
          return {
            ...rental,
            username: user.username || "Unknown",
            userUsername: user.username || "Unknown",
            userFirstName: user.userFirstName || "Unknown",
            userLastName: user.userLastName || "",
            userId: user.userId || rental.user,
            userEmail: user.userEmail || "",
            userPhone: user.userPhone || "",
            userGender: user.userGender || "",
            userAge: user.userAge || "",
            userVerification: user.userVerification || null,
            userDocuments: user.userDocuments || [],
            firstName: user.userFirstName || "Unknown",
            lastName: user.userLastName || "",
            phone: user.userPhone || "",
            email: user.userEmail || "",
            gender: user.userGender || "",
            age: user.userAge || "",
          };
        });

        const units = await this.findAllUnitsRaw();

        const unitRows = units.map((unit) => {
          const subUnits = unit.subUnits.map((sub) => {
            const identifier = sub.roomType || sub.bedType || sub.type;

            // Case 1: a rental currently points AT this unit (the normal case)
            const directMatch = rentalsWithUsers.find(
              (r) =>
                String(r.unit) === String(unit._id) &&
                (r.selectedSubUnits?.roomType === identifier ||
                  r.selectedSubUnits?.bedType === identifier)
            );

            if (directMatch) {
              return {
                identifier,
                rental: directMatch,
                viewContext: directMatch.renewedFromUnit
                  ? "extendedInto"
                  : "normal", // 🆕
              };
            }

            // 🆕 Case 2: no rental points here anymore, but a rental was extended AWAY from this
            // unit — this is the 2026 side of an extended tenancy, same physical bed.
            const linkedMatch = rentalsWithUsers.find(
              (r) =>
                r.renewedFromUnit &&
                String(r.renewedFromUnit) === String(unit._id) &&
                (r.selectedSubUnits?.roomType === identifier ||
                  r.selectedSubUnits?.bedType === identifier)
            );

            if (linkedMatch) {
              return {
                identifier,
                rental: linkedMatch,
                viewContext: "extendedFrom", // 🆕
              };
            }

            return { identifier, rental: null, viewContext: null }; // 🆕
          });

          const occupiedCount = subUnits.filter((s) => s.rental).length;
          const totalCount = subUnits.length;

          return {
            _id: unit._id,
            unitNumber: unit.unitNumber,
            floorLevel: unit.floorLevel,
            unitType: unit.unitType,
            unitYear: unit.unitYear,
            genderAssignment: unit.genderAssignment,
            subUnits,
            occupiedCount,
            totalCount,
            emptyCount: totalCount - occupiedCount,
          };
        });

        this.availableYears = [...new Set(units.map((u) => u.unitYear))].sort(
          (a, b) => a - b
        );
        if (
          !this.selectedYear ||
          !this.availableYears.includes(this.selectedYear)
        ) {
          this.selectedYear = this.availableYears[0] ?? 2026;
        }

        this.allUnitRows = unitRows;
        this.applyYearFilter();
      } catch (error) {
        console.error("Error fetching rentals:", error);
        this.$q?.notify({
          type: "negative",
          message: "Failed to load rentals. Please try again.",
        });
      } finally {
        this.loading = false;
      }
    },

    applyYearFilter() {
      const yearFiltered = this.allUnitRows.filter(
        (u) => u.unitYear === this.selectedYear
      );

      const parseUnitNumber = (unitNumber) => {
        if (!unitNumber) return [0, 0];
        const match = unitNumber.match(/^(\d+)-(\d+)$/);
        if (!match) return [0, 0];
        return [parseInt(match[1]), parseInt(match[2])];
      };

      yearFiltered.sort((a, b) => {
        const [floorA, numA] = parseUnitNumber(a.unitNumber);
        const [floorB, numB] = parseUnitNumber(b.unitNumber);
        if (floorA !== floorB) return floorA - floorB;
        return numA - numB;
      });

      this.filteredUnits = yearFiltered;
    },

    toggleExpand(unitId) {
      if (this.expandedUnitIds.has(unitId)) {
        this.expandedUnitIds.delete(unitId);
      } else {
        this.expandedUnitIds.add(unitId);
      }
    },

    async moveToPending(row) {
      this.$q
        .dialog({
          title: "Confirm",
          message: `You are about to move this rental back to Pending. Continue?`,
          color: "primary",
          cancel: true,
          persistent: true,
        })
        .onOk(async () => {
          const pendingRental = {
            status: "Pending",
          };

          const response = await RentalService.updateRental(
            row._id,
            pendingRental
          );
          if (response) {
            this.$q.notify({
              type: "positive",
              color: "primary",
              message: "Rental moved to Pending!",
            });
            this.findAllRentals();
          } else {
            this.$q.notify({
              type: "negative",
              message: "Failed to move rental to Pending. Please try again.",
            });
          }
        });
    },

    async deleteRental(row) {
      this.$q
        .dialog({
          title: "Confirm",
          message: `You are about to delete this rental application. This action is irreversible and will permanently remove the entry from the associated user, unit rented history and the database, leaving no record behind. Proceed with caution. Do you wish to continue?`,
          color: "primary",
          cancel: true,
          persistent: true,
        })
        .onOk(async () => {
          const response = await RentalService.deleteRental(row);
          if (response) {
            this.$q.notify({
              type: "positive",
              color: "primary",
              message: "Delete successful!",
            });
            this.findAllRentals();
            this.filteredByRentalStatus();
          } else {
            this.$q.notify({
              type: "negative",
              message: "Delete failed. Please try again.",
            });
          }
        })
        .onCancel(() => {});
    },

    async endRental(row) {
      this.$q
        .dialog({
          title: "Confirm",
          message:
            "You are about to terminate this rental application before the agreement end date. Do you wish to proceed?",
          color: "primary",
          cancel: true,
          persistent: true,
        })
        .onOk(async () => {
          const response = await RentalService.endRental(row);
          if (response) {
            this.$q.notify({
              type: "positive",
              color: "primary",
              message: "Rental Ended successful!",
            });
            this.findAllRentals();
          } else {
            this.$q.notify({
              type: "negative",
              message: "End rental failed. Please try again.",
            });
          }
        });
    },

    openExtendDialog(row) {
      this.selectedRentalForExtend = row;
      this.extendDialog = true;
    },

    openApprovalDialog(rental, unitRow) {
      this.selectedRentalForApproval = {
        ...rental,
        unitId: unitRow._id,
        unitNumber: unitRow.unitNumber,
      };
      this.approvalDialog = true;
    },

    handleExtendClose() {
      this.extendDialog = false;
      this.selectedRentalForExtend = null;
      this.findAllRentals();
    },

    handleApprovalClose() {
      this.approvalDialog = false;
      this.selectedRentalForApproval = null;
      this.findAllRentals();
    },
  },
  created() {
    this.findAllRentals();
  },
};
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
