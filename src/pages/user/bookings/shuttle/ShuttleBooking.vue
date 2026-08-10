<template>

    <!-------------------- BOOKING SHUTTLE OPTIONS -------------------->
    <div class=" q-py-md">
      <q-card flat bordered class="row justify-center">
        <q-card-section class="col-md-6 col-12" >
          <q-select
            label="Pick-up"
            :class="$q.screen.lt.sm ? 'q-mb-md' : 'q-mr-md'"
            v-model="pickupLocation"
            :options="pickupOptions"
            outlined
          />
        </q-card-section>
        <q-card-section class="col-md-6 col-12">
          <q-select
            label="Drop-off"
            v-model="dropoffLocation"
            :options="dropoffOptions"
            outlined
          />
        </q-card-section>
      </q-card>
    </div>



    <!-------------------- BOOKING SHUTTLE -------------------->
    <div class="q-py-md">
      <q-card flat bordered>
        <q-card-section>
          <div class="text-h6">Select Date and Time</div>
        </q-card-section>

        <q-card-section class="row justify-center full-width" style="min-height: 280px;">

          <!-- Left column/calendar column - AUTO HEIGHT -->
          <div class="calendar-box col-md-9 col-12">
            <div :class="$q.screen.lt.sm ? 'q-mb-md' : 'q-mr-md'">
              <q-date
                v-model="selectedDate"
                today-btn
                flat bordered
                class="full-width"
                :options="dateOptions"
              />
            </div>
          </div>

          <!-- Right column/time slot column - FLEXIBLE HEIGHT -->
          <div class="timeslot-box col-md-3 col-12">
            <q-card flat bordered class="column" style="height: 100%;">
              <div class="timeslot-heading flex items-center justify-center text-h6 q-pb-sm">
                Available Time Slots
              </div>

              <!-- CONTROL HEIGHT HERE ONLY -->
              <q-scroll-area class="q-pa-sm" :style="{'height': $q.screen.lt.sm ? '300px' : '280px'}">
                <div class="timeslot-list column">
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
                    <q-badge
                      class="q-ml-sm q-pa-sm"
                      v-if="slot.remaining === null"
                      color="grey"
                    >
                      Select a date
                    </q-badge>

                    <q-badge
                      class="q-ml-sm q-pa-sm"
                      v-else-if="slot.passed"
                      color="grey"
                    >
                      Passed
                    </q-badge>

                    <q-badge
                      class="q-ml-sm q-pa-sm"
                      v-else
                      color="var(--q-primary)"
                    >
                      {{ slot.remaining }} Left
                    </q-badge>

                  </q-btn>
                </div>
              </q-scroll-area>
            </q-card>
          </div>
        </q-card-section>
      </q-card>
    </div>




    <!--------------------- USER DETAILS --------------------->
    <div class="q-py-md">
      <q-card flat bordered>
        <q-card-section>
          <div class="text-h6">User Details</div>
        </q-card-section>

        <q-card-section>
          <div class="row justify-center">

            <!-- Left Column/Personal Info -->
            <div class="col-md-6 col-12">
              <q-card flat bordered class="q-pa-md" :class="$q.screen.lt.sm ? 'q-mb-md' : 'q-mr-md'">
                <div class="text-h6 text-primary text-bold q-mb-sm">
                  <q-icon name="person" class="q-mr-sm" /> Personal Info
                </div>
                <q-list dense>
                  <q-item>
                    <q-item-section>
                      <div class="text-left text-subtitle1">Name:
                        <span class="text-grey-8">{{ userDetails?.firstName }}</span>
                      </div>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <div class="text-left text-subtitle1">Surname:
                        <span class="text-grey-8">{{ userDetails?.lastName }}</span>
                      </div>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <div class="text-left text-subtitle1">Student Number:
                        <span class="text-grey-8">{{ userDetails?.studentInfo?.studentNumber }}</span>
                      </div>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <div class="text-left text-subtitle1">Unit Number:
                        <span class="text-grey-8">{{ rentalDetails?.unitType }}</span>
                      </div>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card>
            </div>

            <!-- Right Column/Booking Info -->
            <div class="col-md-6 col-12">
              <q-card flat bordered class="q-pa-md">
                <div class="text-h6 text-primary text-bold q-mb-sm">
                  <q-icon name="event" class="q-mr-sm" /> Booking Info
                </div>
                <q-list dense>
                  <q-item>
                    <q-item-section>
                      <div class="text-left text-subtitle1">
                        Pick-up:
                        <span class="text-grey-8">{{ pickupLocation }}</span>
                      </div>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <div class="text-left text-subtitle1">
                        Drop-off:
                        <span class="text-grey-8">{{ dropoffLocation }}</span>
                      </div>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <div class="text-left text-subtitle1">
                        Date: <span class="text-grey-8">{{ selectedDate }}</span>
                      </div>
                    </q-item-section>
                  </q-item>
                  <q-item>
                    <q-item-section>
                      <div class="text-left text-subtitle1">
                        Time Slot:
                        <span class="text-grey-8">{{ selectedSlotTime }}</span>
                      </div>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card>
            </div>
          </div>
        </q-card-section>
        <q-card-section class="row justify-end">
          <CustomButton
            customStyle="width: 25%"
            label="Confirm Booking"
            color="green"
            icon="check_circle"
            :disable="!canSubmit"
            @click="confirmBooking"
          />
        </q-card-section>
      </q-card>
    </div>



    <!-------------------- BOOKING HISTORY -------------------->
    <div class="q-py-md">
      <q-card flat bordered>
        <q-card-section>
          <div class="text-h6">Booking History</div>
        </q-card-section>

        <q-card-section>
          <q-table
            flat
            bordered
            :rows="bookingHistory"
            :columns="columns"
            row-key="_id"
          >
            <template v-slot:body-cell-index="props">
              <q-td :props="props">
                {{ props.rowIndex + 1 }}
              </q-td>
            </template>

            <template v-slot:body-cell-id="props">
              <q-td :props="props">
                <div class="id">
                  <q-badge
                    color="text-primary"
                    align="middle"
                    class="q-pa-xs q-px-sm"
                  >
                    {{ props.row._id }}
                  </q-badge>
                </div>
              </q-td>
            </template>

              <template v-slot:body-cell-unitNumber="props">
                <q-td :props="props">
                  <div v-if="props.row.unitNumber">
                    {{ props.row.unitNumber }}
                  </div>
                  <div v-else>
                    N/A
                  </div>
                </q-td>
              </template>

            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <q-badge
                  :color="
                    props.row.status === 'Pending'
                      ? 'orange'
                      : props.row.status === 'Picked Up'
                        ? 'primary'
                        : props.row.status === 'Dropped Off'
                          ? 'green'
                          : props.row.status === 'Missed Pick Up'
                            ? 'red'
                            : 'grey'
                  "
                  align="middle"
                  class="q-pa-xs q-px-sm"
                >
                  {{ props.row.status }}
                </q-badge>
              </q-td>
            </template>

            <!-- QR Code Column -->
            <template v-slot:body-cell-qr="props">
              <q-td :props='props'>
                <q-btn
                round
                flat
                icon="qr_code_2"
                :color="props.row.status === 'Dropped Off'|| props.row.status === 'Missed Pick Up' ? 'grey' : 'primary'"
                :disable="props.row.status === 'Dropped Off' || props.row.status === 'Missed Pick Up'"
                @click="openQRDialog(props.row)" >
                  <q-tooltip>View Shuttle Pass</q-tooltip>
                </q-btn>
              </q-td>
            </template>


            <template v-slot:body-cell-actions="props">
              <q-td :props="props" class="text-center">
                <CustomButton
                  flat
                  color="red"
                  text-color="red"
                  customStyle="width: 15%"
                  icon="eva-trash-outline"
                  @click="cancelBooking(props.row)"
                />
              </q-td>
            </template>
          </q-table>
        </q-card-section>
      </q-card>
    </div>

    <q-dialog v-model="showQRDialog" persistent>
      <q-card style="min-width: 340px; max-width: 420px; width: 100%">

        <q-card-section class="bg-primary text-white text-center q-pa-md">
          <q-icon name="qr_code_2" size="28px" class="q-mb-xs"/>
          <div class="text-h6">Shuttle Pass</div>
          <div class="text-caption">Show this QR code to the Shuttle Driver</div>
        </q-card-section>

        <q-card-section class="column items-center q-pa-lg">

        <!-- Loading spinner while QR generates -->
        <div v-if="qrGenerating" class="column items-center q-pa-xl">
          <q-spinner color="primary" size="48px" />
          <div class="text-grey-6 q-mt-sm">Generating pass...</div>
        </div>

        <!-- QR Canvas -->
        <canvas
          v-show="!qrGenerating"
          ref="qrCanvas"
          class="qr-canvas"
        />

        <!-- Booking Info Below QR -->
        <div
          v-if="selectedShuttle && !qrGenerating"
          class="q-mt-md text-center full-width"
        >
          <q-badge
            :color="
              selectedShuttle.status === 'Pending'
                ? 'orange'
                : selectedShuttle.status === 'Picked Up'
                ? 'primary'
                : 'grey'
            "
            class="q-pa-sm q-mb-sm"
            style="font-size: 13px"
          >
            {{ selectedShuttle.status }}
          </q-badge>

          <div class="text-subtitle1 text-weight-bold q-mt-sm">
            {{ selectedShuttle.pickupLocation }} →
            {{ selectedShuttle.dropoffLocation }}
          </div>

          <div class="text-grey-7 q-mt-xs">
            {{ formatDate(selectedShuttle.bookingTimeslot) }} at
            {{ formatTime(selectedShuttle.bookingTimeslot) }}
          </div>

          <div class="text-grey-6 q-mt-xs" style="font-size: 11px">
            ID: {{ selectedShuttle._id }}
          </div>
        </div>
      </q-card-section>

      <q-card-section class="row justify-between q-pt-none q-pb-md q-px-md">
        <q-btn
          flat
          label="Close"
          color="grey"
          @click="closeQRDialog"
        />
        <q-btn
          unelevated
          label="Download Pass"
          color="primary"
          icon="download"
          @click="downloadQR"
        />
      </q-card-section>
      </q-card>
    </q-dialog>
</template>

<script>
import { date } from "quasar";
import ShutttleService from "src/services/ShuttleService";
import Helper from 'src/services/helper/utils';
import RentalService from 'src/services/api/RentalService';
import CustomButton from "src/components/elements/CustomButton.vue";
import QRCode from 'qrcode'

import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Browser } from '@capacitor/browser';

export default {
  name: "BookingPage",

  data() {
    return {
      pickupLocation: "Residence",
      dropoffLocation: "University",

      pickupOptions: ["University", "Residence"],
      dropoffOptions: ["University", "Residence"],

      selectedSlot: null,
      selectedDate: null,

      slots: [
        { id: "s1", time: "07:20", remaining: 15 },
        { id: "s2", time: "07:40", remaining: 15 },
        { id: "s3", time: "08:45", remaining: 15 },
        { id: "s4", time: "14:15", remaining: 15 },
        { id: "s6", time: "16:15", remaining: 15 },
        { id: "s7", time: "17:15", remaining: 15 },
      ],
      maxCapacity: 15,

      userDetails: {},
      rentalDetails: [],
      bookingHistory: [],

      //QR dialog state
      showQRDialog: false,
      selectedShuttle: null,
      qrGenerating: false,

      columns: [
        { name: "index", label: "#", field: "index", align: 'center' },
        { name: "qr", label: "Pass", field: "qr", align: "center" },
        { name: "id", label: "Shuttle ID", field: "_id", align: 'left' },
        { name: "student", label: "Stu No.", field: "student", align: 'left' },
        { name: "slot", label: "Slot", field: "slot", align: 'left' },
        { name: "date", label: "Date", field: "date", align: 'left' },
        { name: "pickupLocation", label: "Pick-up", field: "pickupLocation", align: 'left' },
        { name: "dropoffLocation", label: "Drop-off", field: "dropoffLocation", align: 'left' },

        {
          name: "unitNumber",
          label: "Unit",
          field: "unitNumber",
          align: "left",
        },
        { name: "status", label: "Status", field: "status", align: 'center' },

        { name: "actions", label: "Actions", field: "actions", align: 'center' },
      ],
    };
  },

  components: {
    CustomButton
  },

  async mounted() {
    await this.fetchUserDetails();
  },

  watch: {
    selectedDate() {
      this.updateSlotAvailability();
    }
  },

  computed: {

    // -------------------------- DATE AND SLOT SELECTION --------------------------
    slotsWithStatus() {
      const now = new Date();
      const today = date.formatDate(now, "YYYY-MM-DD");

      // If no date selected, show placeholder slots
      if (!this.selectedDate) {
        return this.slots.map(slot => ({
          ...slot,
          remaining: null, // mark as not yet available
          passed: false
        }));
      }

      // Use the selected date instead of today
      const selectedDateStr = date.formatDate(this.selectedDate, "YYYY-MM-DD");

      return this.slots.map(slot => {
        const slotDateTime = new Date(`${selectedDateStr} ${slot.time}`);
        const passed = slotDateTime < now;
        return { ...slot, passed };
      });
    },
    selectedSlotTime() {
      const slot = this.slots.find((slot) => slot.id === this.selectedSlot);
      return slot ? slot.time : "-";
    },
    canSubmit() {
      return (
        this.selectedSlot &&
        this.selectedDate &&
        this.pickupLocation &&
        this.dropoffLocation
      );
    },
  },

  methods: {
    formatDate: Helper.formatDate,
    formatTime: Helper.formatTime,

    // -------------------------- DATE AND SLOT SELECTION --------------------------
    dateOptions(day) {
      const today = date.formatDate(new Date(), "YYYY/MM/DD");
      return day >= today;
    },
    selectSlot(slot) {
      if (!slot.passed && slot.remaining > 0) {
        this.selectedSlot = slot.id;
      }
    },
    async updateSlotAvailability() {
      if (!this.selectedDate) {
        this.slots.forEach((slot) => {
          slot.remaining = this.maxCapacity;
        });
        return;
      }

      try {
        const selectedDateObj = new Date(this.selectedDate);
        const normalizedDate = date.formatDate(selectedDateObj, "YYYY/MM/DD");

        this.slots.forEach((slot) => {
          slot.remaining = this.maxCapacity;
        });

        const allShuttles = await ShutttleService.findAllShuttles();
        const slotBookings = {};

        allShuttles.forEach((shuttle) => {
          if (shuttle.bookingTimeslot) {
            try {
              const bookingDate = new Date(shuttle.bookingTimeslot);
              const bookingDateStr = date.formatDate(bookingDate, "YYYY/MM/DD");
              const bookingTimeStr = date.formatDate(bookingDate, "HH:mm");

              if (bookingDateStr === normalizedDate) {
                if (!slotBookings[bookingTimeStr]) {
                  slotBookings[bookingTimeStr] = 0;
                }
                slotBookings[bookingTimeStr]++;
              }
            } catch (error) {
              console.warn("Error processing shuttle booking:", shuttle);
            }
          }
        });
        this.slots.forEach((slot) => {
          const bookedCount = slotBookings[slot.time] || 0;
          slot.remaining = Math.max(0, this.maxCapacity - bookedCount);
        });
      } catch (error) {
        console.error("Error updating slot availability:", error);
        this.$q.notify({
          type: 'negative',
          message: 'Failed to update slot availability'
        });
      }
    },



    // -------------------------- FETCH DATA APIS --------------------------
    async fetchUserDetails() {
      this.userDetails = await Helper.fetchUserDetails();
      await this.getMyRental();
      await this.fetchMyShuttles();
    },
    async fetchMyShuttles() {
      try {
        const shuttles = await ShutttleService.findMyShuttles(this.userDetails._id);
        const user = await Helper.fetchUserDetails();

        this.bookingHistory = shuttles.map(shuttle => {
          let dateStr = "-";
          let timeStr = "-";

          if (shuttle.bookingTimeslot) {
            const dt = new Date(shuttle.bookingTimeslot);
            if (!isNaN(dt.getTime())) {
              dateStr = date.formatDate(dt, "YYYY/MM/DD");
              timeStr = date.formatDate(dt, "HH:mm");
            }
          }
          return {
            ...shuttle,
            date: dateStr,
            slot: timeStr,
            student: user.studentInfo.studentNumber
          };
        });

        if (this.selectedDate) {
          await this.updateSlotAvailability();
        }

        console.log(this.bookingHistory)
      } catch (error) {
        console.error("Error fetching shuttles:", error);
      }
    },
    async getMyRental() {
      const rentals = await RentalService.findMyRentals(this.userDetails._id);
      this.rentalDetails = rentals.find(r => r.status === 'Pending');
    },



    // -------------------------- BOOKING APIS --------------------------
    async confirmBooking() {
      if (!this.canSubmit) return;

      this.$q.dialog({
        title: 'Confirm',
        message: `You are about to confirm the booking of this application. Do you wish to continue?`,
        color: 'primary',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        if (this.pickupLocation === this.dropoffLocation) {
          this.$q.notify({
            type: 'negative',
            message: 'Pick-up and drop-off locations cannot be the same. Please choose different locations.'
          });
          return;
        }

        // Might add a condition to limit the amount of bookings

        const slot = this.slots.find((s) => s.id === this.selectedSlot);
        if (!slot || slot.remaining <= 0) {
          this.$q.notify({
            type: 'negative',
            message: 'This slot is no longer available'
          });
          return;
        }

        const combinedDateTime = new Date(`${this.selectedDate} ${slot.time}`);
        const bookingTimeslot = combinedDateTime.toISOString();

        const shuttleData = {
          pickupLocation: this.pickupLocation,
          dropoffLocation: this.dropoffLocation,
          bookingTimeslot: bookingTimeslot,
          user: this.userDetails._id
        };

        try {
          const response = await ShutttleService.createShuttle(shuttleData);
          if (response) {
            this.$q.notify({
              type: 'positive',
              color: 'primary',
              message: 'Your shuttle application has been submitted!'
            });

            // Refresh ALL data including slot availability
            await this.fetchMyShuttles();
            await this.updateSlotAvailability();

            // this.selectedSlot = null;
            // this.selectedDate = null;
          }
        } catch (error) {
          console.error('Booking error:', error);
          this.$q.notify({
            type: 'negative',
            message: 'Shuttle submission failed. Please try again.'
          });
        }
      }).onCancel(() => { });


    },
    async cancelBooking(row) {
      const shuttleId = row._id;

      this.$q.dialog({
        title: 'Confirm',
        message: 'You are about to cancel this Shuttle. Do you wish to proceed?',
        color: 'primary',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        try {
          await ShutttleService.deleteShuttle(shuttleId);
          this.$q.notify({
            type: 'positive',
            color: 'primary',
            message: 'Shuttle booking has been deleted.'
          });

          // Refresh data immediately after cancellation
          await this.fetchMyShuttles();
          await this.updateSlotAvailability();

        } catch (error) {
          console.error(error);
          this.$q.notify({
            type: 'negative',
            message: 'Failed to cancel shuttle.'
          });
        }
      }).onCancel(() => { });
    },

    // ---------QR Code---------------
    openQRDialog(shuttle) {
      this.selectedShuttle = shuttle
      this.showQRDialog = true
      this.qrGenerating = true
      this.$nextTick(async () => {
        await this.generateQR()
      })
    },
    closeQRDialog() {
      this.showQRDialog = false
      this.selectedShuttle = null
    },

    async generateQR() {
      try {
        const canvas = this.$refs.qrCanvas
        if (!canvas) return

        // encode the shuttle _id into the QR
        const payload = JSON.stringify({
          shuttleId: this.selectedShuttle._id,
          userId: this.selectedShuttle.user,
          timeslot: this.selectedShuttle.bookingTimeslot,
          pickup: this.selectedShuttle.pickupLocation,
          dropoff: this.selectedShuttle.dropoffLocation,
        })

        await QRCode.toCanvas(canvas, payload, {
          width: 240,
          margin: 2,
          color: {
            dark: '#1a1a1a',
            light: '#ffffff',
          },
          errorCorrectionLevel: 'M',
        })
      } catch (error) {
        console.error('QR generation failed:', error)
        this.$q.notify({ type: 'negative', message: 'Failed to generate QR code' })
      } finally {
        this.qrGenerating = false
      }
    },

    // downloadQR() {
    //   const canvas = this.$refs.qrCanvas
    //   if (!canvas) return
    //   const link = document.createElement('a')
    //   link.download = `shuttle-pass-${this.selectedShuttle._id}.png`
    //   link.href = canvas.toDataURL('image/png')
    //   link.click()
    // },

    async ensureStoragePermission() {
      // On Android 13+, Capacitor maps "photos" to READ_MEDIA_IMAGES
      // On older Android, it maps to WRITE_EXTERNAL_STORAGE
      const perm = await Capacitor.Plugins.Permissions?.query({ name: 'photos' });
      if (perm?.state !== 'granted') {
        await Capacitor.Plugins.Permissions?.request({ name: 'photos' });
      }
    },

    // async downloadQR() {
    //   const canvas = this.$refs.qrCanvas;
    //   if (!canvas) return;

    //   const dataUrl = canvas.toDataURL("image/png");
    //   const base64Data = dataUrl.split(",")[1];
    //   const fileName = `shuttle-pass-${this.selectedShuttle._id}.png`;

    //   const isNative = Capacitor.isNativePlatform();

    //   if (isNative) {
    //     try {
    //       await this.ensureStoragePermission();

    //       await Filesystem.writeFile({
    //         path: fileName,
    //         data: base64Data,
    //         directory: Directory.Documents
    //         // directory: Capacitor.getPlatform() === 'ios' ? Directory.Documents : Directory.External,
    //       });

    //       this.$q.notify({ type: 'positive', message: 'QR saved to device storage!' });
    //     } catch (err) {
    //       console.error("Filesystem error:", err);
    //       this.$q.notify({ type: 'warning', message: 'Could not save, opening share options...' });
    //       try {
    //         await Share.share({ title: 'Shuttle Pass', url: dataUrl });
    //       } catch {
    //         await Browser.open({ url: dataUrl });
    //       }
    //     }
    //   } else {
    //     const link = document.createElement("a");
    //     link.download = fileName;
    //     link.href = dataUrl;
    //     document.body.appendChild(link);
    //     link.click();
    //     document.body.removeChild(link);
    //     this.$q.notify({ type: 'positive', message: 'QR downloaded!' });
    //   }
    // }

    async downloadQR() {
      const canvas = this.$refs.qrCanvas;
      if (!canvas) return;

      const dataUrl = canvas.toDataURL("image/png");
      const fileName = `shuttle-pass-${this.selectedShuttle._id}.png`;

      if (Capacitor.isNativePlatform()) {
        // On Android/iOS app → open in browser so user can save/share
        await Browser.open({ url: dataUrl });
        this.$q.notify({ type: 'info', message: 'Shuttle QR opened in browser — save it from there.' });
      } else {
        // On web/desktop → trigger normal download
        const link = document.createElement("a");
        link.download = fileName;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.$q.notify({ type: 'positive', message: 'Shuttle QR downloaded!' });
      }
    }
  },
};
</script>


<style scoped>
/* .shuttleBooking {
  display: flex;
  flex-direction: column;
  justify-content: center;
  margin: 0 auto;

  width: 100%;
} */

/* calendar */
.calendar-box {
  padding: 0;
  /* margin-left: 10px; */
  /* border-radius: 5px; */
  /* ensure children can stretch to same height */
}

/* timeslot column */
.timeslot-box {
  /* border: 1px solid #000; */
  padding: 0;
  display: flex;
  flex-direction: column;
  /* margin-left: 10px; */
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
.qr-canvas {
  border-radius: 8px;
  border: 2px solid #e0e0e0;
  padding: 8px;

}
</style>
