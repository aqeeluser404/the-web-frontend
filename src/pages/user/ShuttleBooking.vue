<template>
  <q-page class="shuttleBooking q-pa-md">
    <div class="row q-col-gutter-md q-mb-sm">
      <div class="col-6">
        <q-select
          label="Pick-up"
          v-model="pickupLocation"
          :options="pickupOptions"
          outlined
        />
      </div>
      <div class="col-6">
        <q-select
          label="Drop-off"
          v-model="dropoffLocation"
          :options="dropoffOptions"
          outlined
        />
      </div>
    </div>

    <div>
      <h6>Select Date and Time</h6>
      <q-card-section class="row q-col-gutter-lg q-mb-lg" style="height: 407px">
        <!-- Left column/calendar column -->
        <div
          class="calendar-box col-6 flex items-center justify-center"
          style="height: 100%"
        >
          <div class="full-width">
            <q-date
              v-model="selectedDate"
              today-btn
              class="full-width"
              :options="dateOptions"
            />
          </div>
        </div>

        <!-- Right column/time slot column -->
        <div
          class="timeslot-box col-6 flex column shadow-2"
          style="height: 100%"
        >
          <div
            class="timeslot-heading flex items-center justify-center text-h6"
          >
            Available Time Slots
          </div>

          <q-scroll-area class="q-pa-sm" style="flex: 1">
            <div class="timeslot-list flex column">
              <q-btn
                v-for="slot in slotsWithStatus"
                :key="slot.id"
                :label="slot.time"
                :disable="slot.passed || slot.remaining === 0"
                :color="
                  selectedSlot === slot.id
                    ? 'primary'
                    : slot.passed
                      ? 'grey-5'
                      : 'green'
                "
                flat
                @click="selectSlot(slot)"
                class="timeslot-btn q-mb-sm"
                :class="{ 'selected-slot': selectedSlot === slot.id }"
              >
                <q-badge class="q-ml-sm q-pa-sm" v-if="slot.passed" color="grey"
                  >Passed</q-badge
                >
                <q-badge class="q-ml-sm q-pa-sm" v-else color="var(--q-primary)"
                  >{{ slot.remaining }} Left</q-badge
                >
              </q-btn>
            </div>
          </q-scroll-area>
        </div>
      </q-card-section>
    </div>

    <!-- user detail -->
    <q-card flat bordered class="q-mb-lg">
      <q-card-section>
        <div class="text-h5 q-mb-md">User Details</div>

        <div class="row q-col-gutter-md">
          <!-- Left Column/Personal Info -->
          <div class="col-6">
            <q-card flat bordered class="q-pa-md">
              <div class="text-h6 text-primary text-bold q-mb-sm">
                <q-icon name="person" class="q-mr-sm" /> Personal Info
              </div>
              <q-list dense>
                <q-item>
                  <q-item-section>
                    <div class="text-h6">
                      Name:
                      <span class="text-grey-7">{{ user?.firstName }}</span>
                    </div>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <div class="text-h6">
                      Surname:
                      <span class="text-grey-7">{{ user?.lastName }}</span>
                    </div>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <div class="text-h6">
                      Student Number:
                      <span class="text-grey-7">{{ user?.studentNumber }}</span>
                      <!-- no info/need fixing -->
                    </div>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <div class="text-h6">
                      Unit Number:
                      <span class="text-grey-7">{{ user?.unitNumber }}</span>
                      <!-- no info/need fixing -->
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </div>

          <!-- Right Column/Booking Info -->
          <div class="col-6">
            <q-card flat bordered class="q-pa-md">
              <div class="text-h6 text-primary text-bold q-mb-sm">
                <q-icon name="event" class="q-mr-sm" /> Booking Info
              </div>
              <q-list dense>
                <q-item>
                  <q-item-section>
                    <div class="text-h6">
                      Pick-up:
                      <span class="text-grey-7">{{ pickupLocation }}</span>
                    </div>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <div class="text-h6">
                      Drop-off:
                      <span class="text-grey-7">{{ dropoffLocation }}</span>
                    </div>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <div class="text-h6">
                      Date: <span class="text-grey-7">{{ selectedDate }}</span>
                    </div>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <div class="text-h6">
                      Time Slot:
                      <span class="text-grey-7">{{ selectedSlotTime }}</span>
                    </div>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </div>
        </div>

        <div class="row justify-end q-mt-md">
          <q-btn
            label="Confirm Booking"
            color="green"
            icon="check_circle"
            :disable="!canSubmit"
            @click="confirmBooking"
          />
        </div>
      </q-card-section>
    </q-card>

    <!-- booking history -->
    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6 q-mb-md">Booking History</div>

        <q-table
          flat
          bordered
          :rows="bookingHistory"
          :columns="columns"
          row-key="id"
        >
          <template v-slot:body-cell-actions="props">
            <q-btn
              flat
              color="negative"
              label="cancel"
              @click="cancelBooking(props.row)"
            />
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import { date } from "quasar";
import UserService from "src/services/UserService";

export default {
  name: "BookingPage",

  data() {
    return {
      pickupLocation: "University",
      dropoffLocation: "Residence",

      pickupOptions: ["University", "Residence"],
      dropoffOptions: ["University", "Residence"],

      selectedSlot: null,
      selectedDate: null,

      slots: [
        { id: "s1", time: "06:30", remaining: 0 },
        { id: "s2", time: "07:30", remaining: 0 },
        { id: "s3", time: "08:30", remaining: 2 },
        { id: "s4", time: "14:00", remaining: 4 },
        { id: "s5", time: "15:00", remaining: 4 },
        { id: "s6", time: "16:00", remaining: 4 },
        { id: "s7", time: "17:00", remaining: 4 },
      ],

      // user: {
      //   firstName: "John",
      //   lastName: "Doe",
      //   studentNumber: "78092874",
      //   unitNumber: "1-03",
      // },
      user: null,

      bookingHistory: [],

      columns: [
        { name: "slot", label: "Slot", field: "slot" },
        { name: "date", label: "Date", field: "date" },
        { name: "pickupLocation", label: "Pick-up", field: "pickupLocation" },
        {
          name: "dropoffLocation",
          label: "Drop-off",
          field: "dropoffLocation",
        },
        { name: "student", label: "Stu No.", field: "student" },
        { name: "actions", label: "Actions", field: "actions" },
      ],
    };
  },

  async mounted() {
    try {
      const data = await UserService.FindUserByToken();
      this.user = data;
    } catch (err) {
      console.error("Failed to fetch user profile:", err);
    }
  },

  computed: {
    slotsWithStatus() {
      const now = new Date();
      const today = date.formatDate(now, "YYYY/MM/DD");

      return this.slots.map((slot) => {
        // Date object for today & slot timee
        const slotDateTime = new Date(`${today} ${slot.time}`);
        const passed = slotDateTime < now;

        return { ...slot, passed };
      });
    },

    selectedSlotTime() {
      const slot = this.slots.find((slot) => slot.id === this.selectedSlot);
      return slot ? slot.time : "-";
    },
    canSubmit() {
      //submits if all fields are filled
      return (
        this.selectedSlot &&
        this.selectedDate &&
        this.pickupLocation &&
        this.dropoffLocation
      );
    },
  },

  methods: {
    dateOptions(day) {
      const today = date.formatDate(new Date(), "YYYY/MM/DD");
      return day >= today;
    },
    selectSlot(slot) {
      // just selects the available slot
      if (!slot.passed && slot.remaining > 0) {
        this.selectedSlot = slot.id;
      }
    },
    confirmBooking() {
      if (!this.canSubmit) return;

      const slot = this.slots.find((s) => s.id === this.selectedSlot);
      if (!slot || slot.remaining <= 0) return;

      this.bookingHistory.push({
        id: this.bookingHistory.length + 1,
        slot: this.selectedSlotTime,
        date: this.selectedDate,
        pickupLocation: this.pickupLocation,
        dropoffLocation: this.dropoffLocation,
        student: this.user.studentNumber,
      });

      slot.remaining -= 1;

      this.selectedSlot = null;
    },

    cancelBooking(row) {
      this.bookingHistory = this.bookingHistory.filter((b) => b.id !== row.id);

      const slot = this.slots.find((s) => s.time === row.slot);
      if (slot) {
        slot.remaining += 1;
      }
    },
  },
};
</script>

<style scoped>
.shuttleBooking {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;
  /* max-width: 1024px; */
  width: 100%;
}

/* calendar */
.calendar-box {
  padding: 0;
  margin-left: 10px;
  /* border-radius: 5px; */
  /* ensure children can stretch to same height */
}

/* timeslot column */
.timeslot-box {
  /* border: 1px solid #000; */
  padding: 0;
  display: flex;
  flex-direction: column;
  margin-left: 10px;
  border-radius: 5px;
  /* border: 1px solid #130c0c; */
}

.timeslot-heading {
  background: var(--q-primary);
  height: 86px;
  color: white;
  padding: 8px 12px;
  font-weight: 600;
  width: 100%;
  box-sizing: border-box;
  border-top-left-radius: 5px;
  border-top-right-radius: 5px;
}

.selected-slot {
  background-color: #d2f0ee;
  border-radius: 6px;
}
</style>
