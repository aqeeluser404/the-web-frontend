<template>
  <!-------------------- VISITOR DETAILS -------------------->
  <div class="q-py-md">
    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">Visitor Information</div>
      </q-card-section>

      <q-card-section>
        <div class="row q-col-gutter-md">
          <div class="col-md-6 col-12">
            <q-input outlined v-model="visitor.firstName" label="First Name" />
          </div>

          <div class="col-md-6 col-12">
            <q-input outlined v-model="visitor.lastName" label="Last Name" />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>

  <!-------------------- BOOKING DATE -------------------->
  <div class="q-py-md">
    <q-card flat bordered>
      <q-card-section>
        <div class="text-h6">Select Date</div>
      </q-card-section>

      <q-card-section class="row justify-center full-width" style="min-height: 280px">
        <!-- Left column/calendar column - AUTO HEIGHT -->
        <div class="calendar-box col-md-9 col-12">
          <div :class="$q.screen.lt.sm ? 'q-mb-md' : 'q-mr-md'">
            <q-date v-model="selectedDate" today-btn flat bordered class="full-width" :options="dateOptions" />
          </div>
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
                    <div class="text-left text-subtitle1">
                      Full Name:
                      <span class="text-grey-8">{{
                        userDetails?.firstName + " " + userDetails?.lastName
                        }}</span>
                    </div>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <div class="text-left text-subtitle1">
                      Student Number:
                      <span class="text-grey-8">{{
                        userDetails?.studentInfo?.studentNumber || "N/A"
                        }}</span>
                    </div>
                  </q-item-section>
                </q-item>
                <q-item>
                  <q-item-section>
                    <div class="text-left text-subtitle1">
                      Unit Number:
                      <span class="text-grey-8">
                        {{ rentalDetails?.unitType || "Admin Access Account" }}
                      </span>
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
                <q-icon name="badge" class="q-mr-sm" />
                Visitor Details
              </div>

              <q-list dense>
                <q-item>
                  <q-item-section>
                    <div class="text-left text-subtitle1">
                      Name:
                      <span class="text-grey-8">
                        {{ visitor.firstName }}
                      </span>
                    </div>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <div class="text-left text-subtitle1">
                      Surname:
                      <span class="text-grey-8">
                        {{ visitor.lastName }}
                      </span>
                    </div>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section>
                    <div class="text-left text-subtitle1">
                      Date:
                      <span class="text-grey-8">
                        {{ selectedDate }}
                      </span>
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
  label="Confirm Booking"
  color="green"
  icon="check_circle"
  :disable="!canSubmit"
  @click="confirmBooking"
  :style="{
    width: $q.screen.gt.sm ? '19%' : '100%'
  }"
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
        <q-table flat bordered :rows="bookingHistory" :columns="columns" row-key="_id">
          <template v-slot:body-cell-index="props">
            <q-td :props="props">
              {{ props.rowIndex + 1 }}
            </q-td>
          </template>

          <template v-slot:body-cell-id="props">
            <q-td :props="props">
              <div class="id">
                <q-badge color="text-primary" align="middle" class="q-pa-xs q-px-sm">
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
              <div v-else>N/A</div>
            </q-td>
          </template>

          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-badge :color="props.row.status === 'Pending'
                  ? 'orange'
                  : props.row.status === 'Visiting'
                    ? 'primary'
                    : props.row.status === 'Completed'
                      ? 'green'
                      : 'grey'
                " align="middle" class="q-pa-xs q-px-sm">
                {{ props.row.status }}
              </q-badge>
            </q-td>
          </template>

          <!-- QR Code Column -->
          <template v-slot:body-cell-qr="props">
            <q-td :props="props">
              <q-btn round flat icon="qr_code_2" :color="props.row.status === 'Pending'
                  ? 'orange'
                  : props.row.status === 'Visiting'
                    ? 'primary'
                    : props.row.status === 'Completed'
                      ? 'green'
                      : 'grey'
                " :disable="props.row.status === 'Completed'" @click="openQRDialog(props.row)">
                <q-tooltip>View Visitor Pass</q-tooltip>
              </q-btn>
            </q-td>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props" class="text-center">
              <CustomButton flat color="red" text-color="red" customStyle="width: 15%" icon="eva-trash-outline"
                @click="cancelBooking(props.row)" />
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </div>

  <q-dialog v-model="showQRDialog" persistent>
    <q-card style="min-width: 340px; max-width: 420px; width: 100%">
      <q-card-section class="bg-primary text-white text-center q-pa-md">
        <q-icon name="qr_code_2" size="28px" class="q-mb-xs" />
        <div class="text-h6">Visitor Pass</div>
        <div class="text-caption">Show this QR code to the Security</div>
      </q-card-section>

      <q-card-section class="column items-center q-pa-lg">
        <!-- Loading spinner while QR generates -->
        <div v-if="qrGenerating" class="column items-center q-pa-xl">
          <q-spinner color="primary" size="48px" />
          <div class="text-grey-6 q-mt-sm">Generating pass...</div>
        </div>

        <!-- QR Canvas -->
        <canvas v-show="!qrGenerating" ref="qrCanvas" class="qr-canvas" />

        <!-- Booking Info Below QR -->
        <div v-if="selectedVisitor && !qrGenerating" class="q-mt-md text-center full-width">
          <q-badge :color="selectedVisitor.status === 'Pending'
              ? 'orange'
              : selectedVisitor.status === 'Visiting'
                ? 'primary'
                : selectedVisitor.status === 'Completed'
                  ? 'green'
                  : 'grey'
            " class="q-pa-sm q-mb-sm" style="font-size: 13px">
            {{ selectedVisitor.status }}
          </q-badge>

          <!-- <div class="text-subtitle1 text-weight-bold q-mt-sm">
            {{ selectedVisitor.firstName }}
            {{ selectedVisitor.lastName }}
          </div> -->

<div class="text-subtitle1">
  <span class="text-weight-bold">{{ selectedVisitor.firstName }} {{ selectedVisitor.lastName }}</span>
  (Visitor)
  <br>
  <span>to visit</span>
  <br>
  <span class="text-weight-bold">{{ selectedVisitor.userFirstName }} {{ selectedVisitor.userLastName }}</span>
  (Tenant)
</div>

<div class="text-grey-7 q-mt-xs">
  Scheduled Date: {{ formatDate(selectedVisitor.bookingTimeslot) }}
</div>

          <br>
          <div class="text-grey-6 q-mt-xs" style="font-size: 11px">
            ID: {{ selectedVisitor._id }}
          </div>
        </div>
      </q-card-section>

      <q-card-section class="row justify-between q-pt-none q-pb-md q-px-md">
        <q-btn flat label="Close" color="grey" @click="closeQRDialog" />
        <q-btn unelevated label="Download Pass" color="primary" icon="download" @click="downloadQR" />
      </q-card-section>
    </q-card>
  </q-dialog>
</template>

<script>
import { date } from "quasar";
import VisitorService from "src/services/api/VisitorService";
import Helper from 'src/services/helper/utils';
import RentalService from 'src/services/api/RentalService';
import CustomButton from "src/components/elements/CustomButton.vue";
import QRCode from "qrcode";

import { Capacitor } from '@capacitor/core';
import { Filesystem, Directory } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import { Browser } from '@capacitor/browser';

export default {
  name: "BookingPage",

  data() {
    return {
      visitor: {
        firstName: "",
        lastName: "",
      },

      selectedDate: null,

      userDetails: {},
      rentalDetails: [],
      bookingHistory: [],

      //QR dialog state
      showQRDialog: false,
      selectedVisitor: null,
      qrGenerating: false,

      columns: [
        { name: "index", label: "#", field: "index", align: "center" },
        { name: "qr", label: "Pass", field: "qr", align: "center" },
        { name: "id", label: "Visitor ID", field: "_id", align: "left" },
        { name: "student", label: "Stu No.", field: "student", align: "left" },
        {
          name: "visitorName",
          label: "Visitor Name",
          field: (row) => `${row.firstName} ${row.lastName}`,
          align: "left",
        },
        { name: "date", label: "Date For", field: "date", align: "left" },
        {
          name: "unitNumber",
          label: "Unit",
          field: "unitNumber",
          align: "left",
        },
        { name: "status", label: "Status", field: "status", align: "center" },



        {
          name: "actions",
          label: "Actions",
          field: "actions",
          align: "center",
        },
      ],
    };
  },

  components: {
    CustomButton,
  },

  async mounted() {
    await this.fetchUserDetails();
  },

  computed: {
    canSubmit() {
      return (
        this.selectedDate && this.visitor.firstName && this.visitor.lastName
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

    // -------------------------- FETCH DATA APIS --------------------------
    async fetchUserDetails() {
      this.userDetails = await Helper.fetchUserDetails();
      await this.getMyRental();
      await this.fetchMyVisitors();

      this.selectedDate = null;

      this.visitor = {
        firstName: "",
        lastName: "",
      };
    },
    async fetchMyVisitors() {
      try {
        const visitors = await VisitorService.findMyVisitors(
          this.userDetails._id,
        );
        const user = await Helper.fetchUserDetails();

        this.bookingHistory = visitors.map((visitor) => {
          let dateStr = "-";
          let timeStr = "-";

          if (visitor.bookingTimeslot) {
            const dt = new Date(visitor.bookingTimeslot);
            if (!isNaN(dt.getTime())) {
              dateStr = date.formatDate(dt, "YYYY/MM/DD");
              timeStr = date.formatDate(dt, "HH:mm");
            }
          }
          return {
            ...visitor,
            userFirstName: user.firstName,
            userLastName: user.lastName,
            unitNumber: this.rentalDetails?.unitType || "N/A",
            date: dateStr,
            slot: timeStr,
            student: user.studentInfo?.studentNumber || "N/A",
          };
        });

        console.log(this.bookingHistory);
      } catch (error) {
        console.error("Error fetching Visitors:", error);
      }
    },
    async getMyRental() {
      const rentals = await RentalService.findMyRentals(this.userDetails._id);
      const activeRental = rentals.find((r) => r.status === "Active");
      this.rentalDetails = activeRental || null; // or "N/A" if you prefer
    },


    // -------------------------- BOOKING APIS --------------------------
    async confirmBooking() {
      if (!this.canSubmit) return;

      this.$q
        .dialog({
          title: "Confirm",
          message: `You are about to confirm the booking of this application. Do you wish to continue?`,
          color: "primary",
          cancel: true,
          persistent: true,
        })
        .onOk(async () => {
          // Might add a condition to limit the amount of bookings

          const visitorData = {
            firstName: this.visitor.firstName,
            lastName: this.visitor.lastName,
            bookingTimeslot: this.selectedDate,

            entryTimeslot: null,
            exitTimeslot: null,

            status: "Pending",
            user: this.userDetails._id,
          };

          try {
            const response = await VisitorService.createVisitor(visitorData);
            if (response) {
              this.$q.notify({
                type: "positive",
                color: "primary",
                message: "Visitor booking submitted successfully!",
              });

              // Refresh ALL data including slot availability
              await this.fetchMyVisitors();

              // this.selectedSlot = null;
              // this.selectedDate = null;
            }
          } catch (error) {
            console.error("Booking error:", error.response?.data);
            this.$q.notify({
              type: "negative",
              message: "D booking failed. Please try again.",
            });
          }
        })
        .onCancel(() => { });
    },
    async cancelBooking(row) {
      const visitorId = row._id;

      this.$q
        .dialog({
          title: "Confirm",
          message:
            "You are about to cancel this Visit. Do you wish to proceed?",
          color: "primary",
          cancel: true,
          persistent: true,
        })
        .onOk(async () => {
          try {
            await VisitorService.deleteVisitor(visitorId);
            this.$q.notify({
              type: "positive",
              color: "primary",
              message: "Visitor booking has been deleted.",
            });

            // Refresh data immediately after cancellation
            await this.fetchMyVisitors();
          } catch (error) {
            console.error(error);
            this.$q.notify({
              type: "negative",
              message: "Failed to cancel Visitor Booking.",
            });
          }
        })
        .onCancel(() => { });
    },

    // ---------QR Code---------------
    openQRDialog(visitor) {
      this.selectedVisitor = visitor;
      this.showQRDialog = true;
      this.qrGenerating = true;
      this.$nextTick(async () => {
        await this.generateQR();
      });
    },
    closeQRDialog() {
      this.showQRDialog = false;
      this.selectedVisitor = null;
    },

    async generateQR() {
      try {
        const canvas = this.$refs.qrCanvas;
        if (!canvas) return;

        // encode the visitor _id into the QR
        const payload = JSON.stringify({
          visitorId: this.selectedVisitor._id,
          visitorNumber: this.selectedVisitor.visitorNumber,
          firstName: this.selectedVisitor.firstName,
          lastName: this.selectedVisitor.lastName,
          bookingTimeslot: this.selectedVisitor.bookingTimeslot,
          user: this.selectedVisitor.user,
        });

        await QRCode.toCanvas(canvas, payload, {
          width: 240,
          margin: 2,
          color: {
            dark: "#1a1a1a",
            light: "#ffffff",
          },
          errorCorrectionLevel: "M",
        });
      } catch (error) {
        console.error("QR generation failed:", error);
        this.$q.notify({
          type: "negative",
          message: "Failed to generate QR code",
        });
      } finally {
        this.qrGenerating = false;
      }
    },

    async ensureStoragePermission() {
      // On Android 13+, Capacitor maps "photos" to READ_MEDIA_IMAGES
      // On older Android, it maps to WRITE_EXTERNAL_STORAGE
      const perm = await Capacitor.Plugins.Permissions?.query({ name: 'photos' });
      if (perm?.state !== 'granted') {
        await Capacitor.Plugins.Permissions?.request({ name: 'photos' });
      }
    },

    async downloadQR() {
      const canvas = this.$refs.qrCanvas;
      if (!canvas) return;

      const dataUrl = canvas.toDataURL("image/png");
      const fileName = `visitor-pass-${this.selectedVisitor._id}.png`;

      // For native apps, just open the image in the system browser
      if (Capacitor.isNativePlatform()) {
        await Browser.open({ url: dataUrl });
        this.$q.notify({ type: 'info', message: 'QR opened in browser — save it from there.' });
      } else {
        // For web/desktop, trigger a normal download
        const link = document.createElement("a");
        link.download = fileName;
        link.href = dataUrl;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        this.$q.notify({ type: 'positive', message: 'QR downloaded!' });
      }
    },


    // async downloadQR() {
    //   const canvas = this.$refs.qrCanvas;
    //   if (!canvas) return;

    //   const dataUrl = canvas.toDataURL("image/png");
    //   const base64Data = dataUrl.split(",")[1];
    //   const fileName = `visitor-pass-${this.selectedVisitor._id}.png`;

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

    //       this.$q.notify({ type: 'positive', message: 'Visitor QR saved to device storage!' });
    //     } catch (err) {
    //       this.$q.notify({ type: 'warning', message: 'Could not save, opening share options...' });
    //       try {
    //         await Share.share({ title: 'Visitor Pass', url: dataUrl });
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
    //     this.$q.notify({ type: 'positive', message: 'Visitor QR downloaded!' });
    //   }
    // }

    // downloadQR() {
    //   const canvas = this.$refs.qrCanvas;
    //   if (!canvas) return;
    //   const link = document.createElement("a");
    //   link.download = `visitor-pass-${this.selectedVisitor._id}.png`;
    //   link.href = canvas.toDataURL("image/png");
    //   link.click();
    // },
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
