<template>
  <q-page class="bg-grey-3">
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
          <q-btn
            :label="scanning ? 'Stop Scanner' : 'Scan QR Code'"
            :color="scanning ? 'negative' : 'primary'"
            :icon="scanning ? 'stop' : 'qr_code_scanner'"
            unelevated
            class="q-mb-md"
            style="min-width: 220px"
            @click="toggleScanner"
          />

          <div class="row items-center full-width q-mb-md" style="max-width: 400px">
            <q-separator class="col" />
            <span class="text-grey-6 q-mx-sm text-caption">or enter manually</span>
            <q-separator class="col" />
          </div>

          <!-- Manual ID entry -->
          <!-- <div class="full-width" style="max-width: 400px">
            <q-input
              v-model="manualId"
              outlined
              label="Paste or type Shuttle ID"
              clearable
              @keyup.enter="lookupByManualId"
            >
              <template v-slot:append>
                <q-btn
                  flat
                  round
                  icon="search"
                  color="primary"
                  :loading="lookingUp"
                  @click="lookupByManualId"
                />
              </template>
            </q-input>
          </div> -->
        </q-card-section>


      </q-card>
    </div>
    <q-inner-loading :showing="lookingUp" color="primary" size="md" />
  </q-page>
</template>

<script>
import { Html5Qrcode } from 'html5-qrcode'
import ShuttleService from 'src/services/ShuttleService'
import UserService from 'src/services/UserService'
import RentalService from 'src/services/RentalService'
import UnitService from 'src/services/UnitService'
import Helper from 'src/services/utils'

export default {
  name: 'SecurityQRScannerPage',

  data() {
    return {
      scanning: false,
      manualId: '',
      scannedVisitor: null,
      lookingUp: false,
      updating: false,
      html5QrCode: null,
    }
  },
  methods: {
    formatTime: Helper.formatTime,
    formatDate: Helper.formatDate,

    // ── SCANNER ───────────────────────────────────────────────────────
    async toggleScanner() {
      if (this.scanning) {
        await this.stopScanner()
      } else {
        await this.startScanner()
      }
    },

    async startScanner() {
      this.scanning = true
      this.scannedVisitor = null
      await this.$nextTick()

      try {
        this.html5QrCode = new Html5Qrcode('qr-reader')

        const devices = await Html5Qrcode.getCameras()

        if (!devices || devices.length === 0) {
          throw new Error('No camera found')
        }

        const backCamera = devices.find(d => d.label.toLowerCase().includes('back'))
        const cameraId = backCamera ? backCamera.id : devices[0].id

        await this.html5QrCode.start(
          cameraId,
          { fps: 10, qrbox: { width: 250, height: 250 } },
          async (decodedText) => {
            await this.stopScanner()
            await this.processQRData(decodedText)
          }
        )
      } catch (err) {
        console.error('Camera error:', err)
        this.scanning = false
        this.$q.notify({
          type: 'negative',
          message: 'Camera access denied. Please enable camera permission in your phone settings.',
        })
      }
    },

    async stopScanner() {
      if (this.html5QrCode) {
        try {
          await this.html5QrCode.stop()
          this.html5QrCode.clear()
        } catch (err) {
          console.warn('Error stopping scanner:', err)
        }
        this.html5QrCode = null
      }
      this.scanning = false
    },

    // ── QR PROCESSING ─────────────────────────────────────────────────

  }
}
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
.border-orange  { border-left: 5px solid orange  !important; }
.border-primary { border-left: 5px solid var(--q-primary) !important; }
.border-green   { border-left: 5px solid green   !important; }
.border-red     { border-left: 5px solid red     !important; }
.border-grey    { border-left: 5px solid grey    !important; }
</style>
