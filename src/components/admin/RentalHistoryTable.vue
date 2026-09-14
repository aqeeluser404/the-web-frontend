<template>
  <q-card class="full-height soft-shadow-card">
    <!-- Header -->
    <q-card-section class="row justify-between items-center stats-header">
      <div class="row justify-between items-center full-width">
        <div class="text-h6">Rental History</div>
        <div class="row items-center q-gutter-sm">
          <!-- <q-btn
            @click="$emit('download')"
            class="custom-button"
            icon="eva-cloud-download-outline"
            flat
            rounded
          /> -->

          <!-- ✅ View switcher -->
          <q-btn-toggle
            :model-value="'history'"
            @update:model-value="$emit('switch-table', $event)"
            no-caps
            unelevated
            dense
            toggle-color="primary"
            color="grey-3"
            text-color="grey-8"
            :options="[
              { label: 'History', value: 'history', icon: 'history' },
              { label: 'Approvals', value: 'approvals', icon: 'rule' },
            ]"
            class="view-toggle"
          />
        </div>
      </div>
      <q-separator class="q-my-sm" style="width: 100%" />
    </q-card-section>

    <!-- Search + Filter -->
    <q-card-section class="row justify-between">
      <q-input
        filled
        v-model="search"
        placeholder="Search"
        @update:model-value="$emit('search', search)"
        class="col-12 col-md-9"
      />
      <q-select
        filled
        v-model="selectedRentalStatus"
        :options="rentalStatus"
        label="Rental Status"
        @update:model-value="$emit('filter-status', selectedRentalStatus)"
        class="col-12 col-md-2"
      />
    </q-card-section>

    <!-- Table -->
    <q-card-section>
      <q-table
        flat
        bordered
        :rows="rentals"
        :columns="columns"
        row-key="_id"
        :pagination="{ rowsPerPage: 25 }"
        :rows-per-page-options="[5, 10, 15, 20, 50, 0]"
        @row-click="(evt, row) => $emit('row-click', row)"
      >
        <template v-slot:body-cell-index="props">
          <q-td :props="props">{{ props.rowIndex + 1 }}</q-td>
        </template>

        <template v-slot:body-cell-applicationDate="props">
          <q-td :props="props">{{
            formatDate(props.row.applicationDate)
          }}</q-td>
        </template>

        <template v-slot:body-cell-id="props">
          <q-td :props="props">
            <q-badge
              color="text-primary"
              align="middle"
              class="q-pa-xs q-px-sm"
            >
              {{ props.row._id }}
            </q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-floorLevel="props">
          <q-td :props="props" class="text-center">
            {{
              extractFirstNumber(
                props.row.selectedSubUnits?.bedType ||
                  props.row.selectedSubUnits?.roomType
              )
            }}
          </q-td>
        </template>

        <template v-slot:body-cell-unitType="props">
          <q-td :props="props">
            {{
              props.row.selectedSubUnits.bedType ||
              props.row.selectedSubUnits.roomType
            }}
          </q-td>
        </template>

        <template v-slot:body-cell-startDate="props">
          <q-td :props="props">{{
            formatDate(props.row.rentalStartDate)
          }}</q-td>
        </template>

        <template v-slot:body-cell-endDate="props">
          <q-td :props="props">{{ formatDate(props.row.rentalEndDate) }}</q-td>
        </template>

        <template v-slot:body-cell-renewed="props">
          <q-td :props="props" class="text-center">
            <q-badge
              v-if="props.row.renewed === true"
              color="teal"
              class="q-pa-xs q-px-sm"
            >
              <q-icon name="autorenew" size="xs" class="q-mr-xs" />
              Renewed
            </q-badge>
            <span v-else class="text-grey-6">—</span>
          </q-td>
        </template>

        <template v-slot:body-cell-beforeScheduled="props">
          <q-td :props="props">
            <div
              v-if="props.row.earlyEndDate !== null"
              style="text-decoration: underline"
            >
              {{ formatDate(props.row.earlyEndDate) }}
            </div>
            <div v-else>N/A</div>
          </q-td>
        </template>

        <template v-slot:body-cell-status="props">
          <q-td :props="props">
            <q-badge
              :color="
                props.row.status === 'Active'
                  ? 'green'
                  : props.row.status === 'Pending'
                  ? 'orange'
                  : props.row.status === 'Rejected'
                  ? 'red'
                  : props.row.status === 'Ended'
                  ? 'grey'
                  : 'red'
              "
              align="middle"
              class="q-pa-xs q-px-sm"
            >
              {{ props.row.status }}
            </q-badge>
          </q-td>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props">
            <div class="row justify-center items-center q-gutter-xs no-wrap">
              <q-btn
                round
                color="red"
                size="sm"
                icon="eva-trash-outline"
                @click.stop="$emit('delete', props.row)"
              >
                <q-tooltip>Delete</q-tooltip>
              </q-btn>

              <q-btn
                round
                color="red"
                size="sm"
                icon="eva-archive-outline"
                :disable="props.row.status !== 'Active'"
                @click.stop="$emit('end', props.row)"
              >
                <q-tooltip>End</q-tooltip>
              </q-btn>

              <q-btn
                round
                color="primary"
                size="sm"
                icon="open_in_new"
                @click.stop="$emit('open', props.row)"
              >
                <q-tooltip>Open</q-tooltip>
              </q-btn>

              <!-- ✅ 3-dot context menu -->
              <q-btn
                round
                flat
                color="grey-7"
                size="sm"
                icon="more_vert"
                @click.stop
              >
                <q-tooltip>More info</q-tooltip>
                <q-menu
                  anchor="bottom right"
                  self="top right"
                  :offset="[0, 8]"
                  @before-show="onMenuOpen"
                  @before-hide="onMenuClose"
                >
                  <q-card class="soft-shadow-card context-menu-card" flat>
                    <q-card-section class="q-pb-none">
                      <!-- ============================================ -->
                      <!-- APPLICANT DETAILS -->
                      <!-- ============================================ -->
                      <q-item-label header class="context-header"
                        >Applicant Details</q-item-label
                      >

                      <q-item dense>
                        <q-item-section avatar>
                          <q-icon name="person" color="grey-7" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label class="text-weight-bold">
                            {{ props.row.userFirstName }}
                            {{ props.row.userLastName }}
                          </q-item-label>
                          <q-item-label caption>Name</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item dense>
                        <q-item-section avatar>
                          <q-icon name="phone" color="grey-7" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{
                            props.row.userPhone || "N/A"
                          }}</q-item-label>
                          <q-item-label caption>Phone</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item dense>
                        <q-item-section avatar>
                          <q-icon name="email" color="grey-7" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{
                            props.row.userEmail || "N/A"
                          }}</q-item-label>
                          <q-item-label caption>Email</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item dense>
                        <q-item-section avatar>
                          <q-icon name="badge" color="grey-7" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{
                            props.row.userId || "N/A"
                          }}</q-item-label>
                          <q-item-label caption>User ID</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-separator class="q-mt-md q-mb-xs" />

                      <!-- ============================================ -->
                      <!-- APPLICATION DETAILS -->
                      <!-- ============================================ -->
                      <q-item-label header class="context-header"
                        >Application Details</q-item-label
                      >

                      <q-item dense>
                        <q-item-section avatar>
                          <q-icon name="event" color="grey-7" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{
                            formatDate(props.row.rentalStartDate)
                          }}</q-item-label>
                          <q-item-label caption>Start Date</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item dense>
                        <q-item-section avatar>
                          <q-icon name="event_available" color="grey-7" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{
                            formatDate(props.row.rentalEndDate)
                          }}</q-item-label>
                          <q-item-label caption>End Date</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-item dense>
                        <q-item-section avatar>
                          <q-icon name="schedule" color="grey-7" />
                        </q-item-section>
                        <q-item-section>
                          <q-item-label>{{
                            formatDate(props.row.applicationDate)
                          }}</q-item-label>
                          <q-item-label caption>Application Date</q-item-label>
                        </q-item-section>
                      </q-item>

                      <q-separator
                        class="q-mt-md q-mb-xs"
                        v-if="
                          props.row.renewalHistory &&
                          props.row.renewalHistory.length > 0
                        "
                      />
                      <div class="q-mt-md q-mb-xs"></div>

                      <!-- ============================================ -->
                      <!-- RENEWAL HISTORY (only when there is one) -->
                      <!-- ============================================ -->
                      <template
                        v-if="
                          props.row.renewalHistory &&
                          props.row.renewalHistory.length > 0
                        "
                      >
                        <q-item-label header class="context-header">
                          <div class="row items-center justify-between">
                            <span>Renewal History</span>
                            <q-badge color="info" class="q-ml-sm">
                              {{ props.row.renewalHistory.length }}
                            </q-badge>
                          </div>
                        </q-item-label>

                        <div class="renewal-timeline q-px-md q-pb-md">
                          <div
                            v-for="(entry, index) in props.row.renewalHistory"
                            :key="index"
                            class="renewal-entry"
                          >
                            <!-- Timeline dot + connector -->
                            <div class="renewal-timeline-marker">
                              <div
                                class="renewal-dot"
                                :class="{
                                  'room-changed': entry.sameRoom === false,
                                }"
                              />
                              <div
                                v-if="
                                  index < props.row.renewalHistory.length - 1
                                "
                                class="renewal-line"
                              />
                            </div>

                            <!-- Entry body -->
                            <div class="renewal-body">
                              <div class="row items-center q-gutter-xs">
                                <span class="text-weight-bold text-grey-9">
                                  {{ entry.fromYear }} → {{ entry.toYear }}
                                </span>
                                <q-badge
                                  v-if="entry.sameRoom === false"
                                  color="orange"
                                  outline
                                  class="text-caption"
                                >
                                  <q-icon
                                    name="swap_horiz"
                                    size="xs"
                                    class="q-mr-xs"
                                  />
                                  Room Changed
                                </q-badge>
                              </div>

                              <div class="renewal-detail">
                                <span class="text-caption text-grey-6"
                                  >Unit:</span
                                >
                                <span class="text-caption q-ml-xs">
                                  {{ entry.fromUnitNumber || "?" }}
                                  <q-icon
                                    name="arrow_forward"
                                    size="xs"
                                    class="q-mx-xs text-grey-5"
                                  />
                                  {{ entry.toUnitNumber || "?" }}
                                </span>
                              </div>

                              <div class="renewal-detail">
                                <span class="text-caption text-grey-6"
                                  >Room:</span
                                >
                                <span class="text-caption q-ml-xs">
                                  {{
                                    entry.fromSubUnit?.bedType ||
                                    entry.fromSubUnit?.roomType ||
                                    "?"
                                  }}
                                  <q-icon
                                    name="arrow_forward"
                                    size="xs"
                                    class="q-mx-xs text-grey-5"
                                  />
                                  {{
                                    entry.toSubUnit?.bedType ||
                                    entry.toSubUnit?.roomType ||
                                    "?"
                                  }}
                                </span>
                              </div>
                            </div>
                          </div>

                          <!-- Current state footer -->
                          <div class="renewal-current">
                            <q-icon
                              name="check_circle"
                              color="primary"
                              size="xs"
                              class="q-mr-xs"
                            />
                            <span class="text-caption text-grey-7">
                              Currently on
                              <b>{{ props.row.unitNumber }}</b>
                              ({{ props.row.unitYear }})
                            </span>
                          </div>
                        </div>
                      </template>
                    </q-card-section>
                  </q-card>
                </q-menu>
              </q-btn>
            </div>
          </q-td>
        </template>
      </q-table>
      <!-- ✅ Context Menu -->
    </q-card-section>
  </q-card>
</template>

<script>
import Helper from "src/services/helper/utils";
import CustomButton from "src/components/elements/CustomButton.vue";

export default {
  name: "RentalHistoryTable",

  components: { CustomButton },

  props: {
    rentals: { type: Array, default: () => [] },
    columns: { type: Array, required: true },
    rentalStatus: {
      type: Array,
      default: () => ["All", "Active", "Pending", "Rejected", "Ended"],
    },
    initialStatus: { type: String, default: "All" },
  },

  emits: [
    "search",
    "filter-status",
    "row-click",
    "delete",
    "extend",
    "end",
    "open",
    "download",
    "switch-table",
  ],

  data() {
    return {
      search: "",
      selectedRentalStatus: this.initialStatus,
    };
  },

  watch: {
    initialStatus(newVal) {
      this.selectedRentalStatus = newVal;
    },
  },

  beforeUnmount() {
    this.onMenuClose();
  },

  methods: {
    formatDate: Helper.formatDate,
    extractFirstNumber(str) {
      if (!str) return "";
      const match = str.match(/\d+/);
      return match ? match[0] : str;
    },

    onMenuOpen() {
      this._closeMenuOnScroll = (event) => {
        // If the scroll happened inside the menu, don't close
        const menu = event.target.closest?.(".q-menu");
        if (menu) return;

        document.body.dispatchEvent(
          new MouseEvent("mousedown", { bubbles: true })
        );
      };

      window.addEventListener("scroll", this._closeMenuOnScroll, {
        capture: true,
        passive: true,
      });
    },

    onMenuClose() {
      if (this._closeMenuOnScroll) {
        window.removeEventListener("scroll", this._closeMenuOnScroll, {
          capture: true,
        });
        this._closeMenuOnScroll = null;
      }
    },
  },
};
</script>

<style scoped lang="scss">
.inline-btn {
  display: inline-flex;
  width: auto;
}

.view-toggle {
  :deep(.q-btn) {
    padding: 8px 20px; /* ✅ generous horizontal padding */
    min-height: 36px; /* ✅ taller buttons */
    font-weight: 600;
    font-size: 13px;
  }

  :deep(.q-btn__content) {
    gap: 8px; /* ✅ space between icon and label */
  }

  :deep(.q-btn .q-icon) {
    font-size: 18px; /* ✅ bigger icons */
  }
}

.context-menu-stable {
  position: fixed !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
}
</style>
