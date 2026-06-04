<template>
  <q-page class="bg-grey-3">

    <q-banner
      class="bg-black text-white full-width" @click="openAddPayer">
      <div class="row justify-center items-center q-pa-md" style="cursor: pointer;">
        <div class="text-center">
          <!-- <q-icon name="warning" class="q-mr-sm" size="24px" /> -->
          <span>
            Visiting hours are strictly observed from 09:00 AM to 05:00 PM
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
            <q-input v-model="manualId" outlined label="Paste or type Shuttle ID" clearable
              @keyup.enter="lookupByManualId">
              <template v-slot:append>
                <q-btn flat round icon="search" color="primary" :loading="lookingUp" @click="lookupByManualId" />
              </template>
            </q-input>
          </div>
        </q-card-section>

        <q-card-section v-if="scannedVisitor" class="q-pt-none">
          <q-separator class="q-mb-md" />

          <q-card flat bordered :class="`result-card border-${resultColor}`">
            <q-card-section>
              <!-- Status -->
              <div class="row items-center q-mb-md">
                <q-icon :name="resultIcon" :color="resultColor" size="30px" class="q-mr-sm" />
                <div class="text-h6 text-weight-bold" :class="`text-${resultColor}`">
                  {{ resultMessage }}
                </div>
              </div>

              <!-- Visitor Info -->
              <q-list dense bordered separator class="q-mb-md">
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="person" color="primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">
                      {{ scannedVisitor.firstName }}
                      {{ scannedVisitor.lastName }}
                      <q-item-label caption>Full Name</q-item-label>
                    </q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section avatar>
                    <q-icon name="schedule" color="primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">
                      {{ formatDate(scannedVisitor.bookingTimeslot) }}
                    </q-item-label>
                    <q-item-label caption>Visit Date</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section avatar>
                    <q-icon name="info" color="primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-badge :color="statusBadgeColor(scannedVisitor.status)">
                      {{ scannedVisitor.status }}
                    </q-badge>
                    <q-item-label caption>Status</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>

              <!-- ACTION BUTTONS -->
              <div v-if="scannedVisitor.status === 'Pending'" class="row q-gutter-sm justify-end">
                <q-btn label="Mark Entry" color="primary" icon="login" :loading="updating" @click="confirmEntry" />

                <q-btn label="Mark Missed" color="negative" flat icon="cancel" :loading="updating"
                  @click="markMissed" />
              </div>

              <div v-else-if="scannedVisitor.status === 'Visiting'" class="row justify-end">
                <q-btn label="Mark Exit" color="green" icon="logout" :loading="updating" @click="confirmExit" />
              </div>

              <div v-else class="text-center text-grey-6 q-mt-sm">
                No further action required
              </div>

              <!-- Reset -->
              <div class="row justify-center q-mt-md">
                <q-btn flat label="Scan Another" color="primary" icon="qr_code_scanner" @click="resetScanner" />
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
import VisitorService from "src/services/VisitorService";
import Helper from "src/services/utils";

export default {
  name: "VisitorQRScannerPage",

  data() {
    return {
      scanning: false,
      manualId: "",
      scannedVisitor: null,
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

        // try JSON format first (recommended QR format)
        try {
          const payload = JSON.parse(rawData);
          visitorId = payload.visitorId;
        } catch {
          // fallback: raw string
          visitorId = rawData.trim();
        }

        if (!visitorId) {
          this.$q.notify({
            type: "negative",
            message: "Invalid QR code scanned",
          });
          return;
        }

        await this.lookupVisitor(visitorId);
      } catch (err) {
        console.error("QR processing error:", err);
        this.$q.notify({
          type: "negative",
          message: "Could not read QR code",
        });
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

        this.scannedVisitor = {
          ...visitor,
        };

        //persist to browser storage
        localStorage.setItem("scannedVisitor", JSON.stringify(visitor));
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
    async confirmEntry() {
      this.updating = true;

      try {
        let newStatus = "Visiting";

        await VisitorService.updateVisitor(this.scannedVisitor._id, {
          status: newStatus,
          entryTimeslot: new Date(),
        });

        this.scannedVisitor.status = newStatus;

        localStorage.setItem(
          "scannedVisitor",
          JSON.stringify(this.scannedVisitor),
        );

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
        let newStatus = "Completed";

        await VisitorService.updateVisitor(this.scannedVisitor._id, {
          status: newStatus,
          exitTimeslot: new Date(),
        });

        this.scannedVisitor.status = newStatus;

        localStorage.setItem(
          "scannedVisitor",
          JSON.stringify(this.scannedVisitor),
        );

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

    async markMissed() {
      this.updating = true;

      try {
        await VisitorService.updateVisitor(this.scannedVisitor._id, {
          status: "Missed",
        });

        this.scannedVisitor.status = "Missed";

        localStorage.setItem(
          "scannedVisitor",
          JSON.stringify(this.scannedVisitor),
        );

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
    },

    resetScanner() {
      this.scannedVisitor = null;
      this.manualId = "";
      localStorage.removeItem("scannedVisitor");
    },
  },

  async beforeUnmount() {
    await this.stopScanner();
  },
  async mounted() {
    const saved = localStorage.getItem("scannedVisitor");

    if (saved) {
      this.scannedVisitor = JSON.parse(saved);
    }
  },
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
