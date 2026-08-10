<template>
  <q-page class="bg-grey-3">

    <q-banner
      class="bg-black text-white full-width">
      <div class="row justify-center items-center q-pa-md" style="cursor: pointer;">
        <div class="text-center">
          <!-- <q-icon name="warning" class="q-mr-sm" size="24px" /> -->
          <span>
            Visiting hours are strictly observed from 09:00 AM to 21:30 PM
          </span>
        </div>
      </div>
    </q-banner>

    <div class="constrain-standard q-py-md">
      <q-card class="soft-shadow-card">
        <!-- Header -->
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">
            <q-icon name="qr_code_scanner" class="q-mr-sm" />
            Scan Visitor Pass
          </div>
          <div class="text-caption">
            Scan the visitor’s QR code to confirm their entry or exit.
          </div>
        </q-card-section>

        <!-- Scanner + Manual Entry -->
        <q-card-section class="column items-center q-pa-lg">
          <!-- Camera view -->
          <div v-if="scanning" class="scanner-container q-mb-md">
            <div id="qr-reader" style="width: 100%" />
          </div>

          <!-- Start / Stop button -->
          <q-btn :label="scanning ? 'Stop Scanner' : 'Scan QR Code'" :color="scanning ? 'negative' : 'primary'"
            :icon="scanning ? 'stop' : 'qr_code_scanner'" unelevated class="q-mb-md" style="min-width: 220px"
            @click="toggleScanner" />

          <div class="row items-center full-width q-mb-md" style="max-width: 400px">
            <q-separator class="col" />
            <span class="text-grey-6 q-mx-sm text-caption">or enter manually</span>
            <q-separator class="col" />
          </div>

          <!-- Manual ID entry -->
          <div class="full-width" style="max-width: 400px">
            <q-input v-model="manualId" outlined label="Paste or type Visitor ID" clearable
              @keyup.enter="lookupByManualId">
              <template v-slot:append>
                <q-btn flat round icon="search" color="primary" :loading="lookingUp" @click="lookupByManualId" />
              </template>
            </q-input>
          </div>
        </q-card-section>

<q-card-section v-if="visitingList.length" class="q-pt-none row justify-center">
  <q-separator class="q-mb-md" />

  <q-card
    v-for="visitor in visitingList"
    :key="visitor._id"
    flat
    bordered
    :class="`result-card border-${statusBadgeColor(visitor.status)}`"
    class="col-md-9 col-12 q-mb-md"
  >
    <q-card-section>
      <!-- Status -->
      <div class="row items-center q-mb-md">
        <q-icon :name="resultIcon" :color="statusBadgeColor(visitor.status)" size="30px" class="q-mr-sm" />
        <div class="text-h6 text-weight-bold" :class="`text-${statusBadgeColor(visitor.status)}`">
          {{ visitor.status }}
        </div>
      </div>

      <!-- Visitor Info -->
      <q-list dense bordered separator class="q-mb-md">
        <q-item>
          <q-item-section avatar class="q-pa-md">
            <q-icon name="person" color="primary" />
          </q-item-section>
          <q-item-section class="q-pa-md">
            <q-item-label class="text-weight-medium">
              {{ visitor.firstName }} {{ visitor.lastName }}
              <q-item-label caption class="q-mt-sm">Full Name</q-item-label>
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section avatar class="q-pa-md">
            <q-icon name="schedule" color="primary" />
          </q-item-section>
          <q-item-section class="q-pa-md">
            <q-item-label class="text-weight-medium">
              {{ formatDate(visitor.bookingTimeslot) }}
              <q-item-label caption class="q-mt-sm">Visit Date</q-item-label>
            </q-item-label>
          </q-item-section>
        </q-item>

        <q-item>
          <q-item-section avatar class="q-pa-md">
            <q-icon name="info" color="primary" />
          </q-item-section>
          <q-item-section class="q-pa-md">
            <q-badge class="q-pa-xs" :color="statusBadgeColor(visitor.status)">
              {{ visitor.status }}
            </q-badge>
            <q-item-label caption class="q-mt-sm">Status</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <!-- ACTION BUTTONS -->
      <div v-if="visitor.status === 'Pending'" class="row q-gutter-sm justify-end">
        <q-btn label="Mark Entry" color="primary" icon="login" :loading="updating" @click="confirmEntry(visitor)" />
        <q-btn label="Mark Missed" color="negative" flat icon="cancel" :loading="updating" @click="markMissed(visitor)" />
      </div>

      <div v-else-if="visitor.status === 'Visiting'" class="row justify-end">
        <q-btn label="Mark Exit" color="green" icon="logout" :loading="updating" @click="confirmExit(visitor)" />
      </div>

      <div v-else class="text-center text-grey-6 q-mt-sm">
        No further action required
      </div>
    </q-card-section>
  </q-card>
</q-card-section>

      </q-card>
    </div>
    <q-inner-loading :showing="lookingUp" color="primary" size="md" />
  </q-page>
</template>

<script>
import { Html5Qrcode } from "html5-qrcode";
import VisitorService from "src/services/api/VisitorService";
import Helper from 'src/services/helper/utils';

export default {
  name: "VisitorQRScannerPage",

  data() {
    return {
      visitingList: [],
      scanning: false,
      manualId: "",
      // scannedVisitor: null,
      lookingUp: false,
      updating: false,
      html5QrCode: null,
    };
  },

  computed: {
    resultColor() {
      if (!this.scannedVisitor) return "grey";

      const map = {
        Pending: "orange",
        Visiting: "primary",
        Completed: "green",
        Missed: "red",
      };

      return map[this.scannedVisitor.status] || "grey";
    },

    resultIcon() {
      const map = {
        Pending: "schedule",
        Visiting: "visibility",
        Completed: "check_circle",
        Missed: "cancel",
      };

      return map[this.scannedVisitor?.status] || "info";
    },

    resultMessage() {
      const map = {
        Pending: "Valid Visitor Pass — Ready for Entry",
        Visiting: "Visitor Inside — In Progress",
        Completed: "Visit Completed",
        Missed: "Invalid / Missed Visit",
      };

      return map[this.scannedVisitor?.status] || "Visitor Found";
    },
  },

  methods: {
    formatTime: Helper.formatTime,
    formatDate: Helper.formatDate,

    statusBadgeColor(status) {
      const map = {
        Pending: "orange",
        Visiting: "primary",
        Completed: "green",
        Missed: "red",
      };

      return map[status] || "grey";
    },

    // ── SCANNER ───────────────────────────────────────────────────────
    async toggleScanner() {
      if (this.scanning) {
        await this.stopScanner();
      } else {
        await this.startScanner();
      }
    },

    async startScanner() {
      this.scanning = true;
      this.scannedVisitor = null;
      await this.$nextTick();

      try {
        this.html5QrCode = new Html5Qrcode("qr-reader");

        const devices = await Html5Qrcode.getCameras();

        if (!devices || devices.length === 0) {
          throw new Error("No camera found");
        }

        const backCamera = devices.find((d) =>
          d.label.toLowerCase().includes("back"),
        );

        const cameraId = backCamera ? backCamera.id : devices[0].id;

        await this.html5QrCode.start(
          cameraId,
          { fps: 10, qrbox: { width: 250, height: 250 } },
          async (decodedText) => {
            await this.stopScanner();
            await this.processQRData(decodedText);
          },
        );
      } catch (err) {
        console.error("Camera error:", err);
        this.scanning = false;
        this.$q.notify({
          type: "negative",
          message: "Camera access denied. Please enable camera permission.",
        });
      }
    },

    async stopScanner() {
      if (this.html5QrCode) {
        try {
          await this.html5QrCode.stop();
          this.html5QrCode.clear();
        } catch (err) {
          console.warn("Error stopping scanner:", err);
        }
        this.html5QrCode = null;
      }

      this.scanning = false;
    },

    // ── QR PROCESSING ─────────────────────────────────────────────────
async processQRData(rawData) {
  try {
    let visitorId = null;
    try {
      const payload = JSON.parse(rawData);
      visitorId = payload.visitorId;
    } catch {
      visitorId = rawData.trim();
    }

    if (!visitorId) {
      this.$q.notify({ type: "negative", message: "Invalid QR code scanned" });
      return;
    }

    await this.lookupVisitor(visitorId);
  } catch (err) {
    console.error("QR processing error:", err);
    this.$q.notify({ type: "negative", message: "Could not read QR code" });
  }
},


    async lookupByManualId() {
      if (!this.manualId?.trim()) {
        this.$q.notify({
          type: "warning",
          message: "Please enter a Visitor ID",
        });
        return;
      }

      await this.lookupVisitor(this.manualId.trim());
    },

    // ── VISITOR LOOKUP ────────────────────────────────────────────────
    async lookupVisitor(visitorId) {
      this.lookingUp = true;

      try {
        const visitor = await VisitorService.findVisitorById(visitorId);

        if (!visitor) {
          this.$q.notify({
            type: "negative",
            message: "Visitor not found",
          });
          return;
        }

      // Prevent duplicates
      const exists = this.visitingList.some(v => v._id === visitor._id);
      if (!exists) {
        this.visitingList.push(visitor);
      }
      } catch (err) {
        console.error("Lookup error:", err);
        this.$q.notify({
          type: "negative",
          message: "Failed to find visitor booking",
        });
      } finally {
        this.lookingUp = false;
      }
    },

    // ── STATUS UPDATES ────────────────────────────────────────────────
async confirmEntry(visitor) {
  this.updating = true;

  try {
    const newStatus = "Visiting";

    await VisitorService.updateVisitor(visitor._id, {
      status: newStatus,
      entryTimeslot: new Date(),
    });

    // Update the visitor’s status locally
    visitor.status = newStatus;

    // If not already in the list, add them
    const exists = this.visitingList.some(v => v._id === visitor._id);
    if (!exists) {
      this.visitingList.push(visitor);
    }

    this.$q.notify({
      type: "positive",
      color: "primary",
      message: "Visitor marked as Entered",
    });
  } catch (err) {
    console.error(err);
    this.$q.notify({
      type: "negative",
      message: "Failed to update status",
    });
  } finally {
    this.updating = false;
  }
},


    async confirmExit() {
  this.updating = true;
  try {
    await VisitorService.updateVisitor(visitor._id, {
      status: "Completed",
      exitTimeslot: new Date(),
    });
    this.visitingList = this.visitingList.filter(v => v._id !== visitor._id);
    this.$q.notify({ type: "positive", message: "Visitor marked as Exited" });
        this.$q.notify({
          type: "positive",
          color: "primary",
          message: "Visitor marked as Exited",
        });
      } catch (err) {
        console.error(err);
        this.$q.notify({
          type: "negative",
          message: "Failed to update status",
        });
      } finally {
        this.updating = false;
      }
    },

async markMissed(visitor) {
  this.updating = true;

  try {
    await VisitorService.updateVisitor(visitor._id, {
      status: "Missed",
    });

    // Update local state
    visitor.status = "Missed";

    // Remove from visiting list
    this.visitingList = this.visitingList.filter(v => v._id !== visitor._id);

    this.$q.notify({
      type: "warning",
      message: "Marked as Missed Visit",
    });
  } catch (err) {
    console.error(err);
    this.$q.notify({
      type: "negative",
      message: "Failed to update status",
    });
  } finally {
    this.updating = false;
  }
}
,

resetScanner() {
  this.manualId = "";
  this.scanning = false;
  this.html5QrCode = null;
}
  },

  async beforeUnmount() {
    await this.stopScanner();
  },
  async mounted() {
    try {
      // Get all visitors from your service
      const visitors = await VisitorService.findAllVisitors();

      // Only keep those currently Visiting
      this.visitingList = visitors.filter(v => v.status === "Visiting");
    } catch (err) {
      console.error("Failed to load visitors:", err);
      this.$q.notify({
        type: "negative",
        message: "Could not load visitors"
      });
    }
  }

};
</script>

<style scoped>
.scanner-container {
  width: 100%;
  max-width: 400px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid var(--q-primary);
}

.result-card {
  border-radius: 8px;
}

/* colored left border based on status */
.border-orange {
  border-left: 5px solid orange !important;
}

.border-primary {
  border-left: 5px solid var(--q-primary) !important;
}

.border-green {
  border-left: 5px solid green !important;
}

.border-red {
  border-left: 5px solid red !important;
}

.border-grey {
  border-left: 5px solid grey !important;
}
</style>
