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
            <div class="row justify-center items-center q-gutter-sm no-wrap">
              <CustomButton
                flat
                color="red"
                text-color="red"
                class="inline-btn"
                icon="eva-trash-outline"
                @click.stop="$emit('delete', props.row)"
              />
              <CustomButton
                :disable="props.row.status !== 'Active'"
                flat
                color="red"
                text-color="red"
                class="inline-btn"
                icon="eva-edit-2-outline"
                @click.stop="$emit('extend', props.row)"
              />
              <CustomButton
                :disable="props.row.status !== 'Active'"
                flat
                color="red"
                text-color="red"
                class="inline-btn"
                icon="eva-archive-outline"
                @click.stop="$emit('end', props.row)"
              />
              <CustomButton
                flat
                color="primary"
                text-color="primary"
                class="inline-btn"
                icon="open_in_new"
                label="Open"
                @click.stop="$emit('open', props.row)"
              />
            </div>
          </q-td>
        </template>
      </q-table>
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

  methods: {
    formatDate: Helper.formatDate,
    extractFirstNumber(str) {
      if (!str) return "";
      const match = str.match(/\d+/);
      return match ? match[0] : str;
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
</style>
