<template>
  <q-page class="bg-grey-3">
    <div class="constrain-standard q-py-md">
      <q-card class="soft-shadow-card">

        <!-- Header -->
        <q-card-section class="bg-primary text-white">
          <div class="text-h6">
            <q-icon name="qr_code_scanner" class="q-mr-sm" />
            Scan Shuttle Pass
          </div>
          <div class="text-caption">
            Scan a tenant QR code to confirm their pickup or drop-off
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
          <div class="full-width" style="max-width: 400px">
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
          </div>
        </q-card-section>

        <!-- Result Section -->
        <q-card-section v-if="scannedShuttle" class="q-pt-none">
          <q-separator class="q-mb-md" />

          <q-card flat bordered :class="`result-card border-${resultColor}`">
            <q-card-section>

              <!-- Status Banner -->
              <div class="row items-center q-mb-md">
                <q-icon
                  :name="resultIcon"
                  :color="resultColor"
                  size="30px"
                  class="q-mr-sm"
                />
                <div
                  class="text-h6 text-weight-bold"
                  :class="`text-${resultColor}`"
                >
                  {{ resultMessage }}
                </div>
              </div>

              <!-- Users Details -->
              <q-list dense bordered separator class="rounded-borders q-mb-md">
                <q-item>
                  <q-item-section avatar>
                    <q-icon name="person" color="primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">
                      {{ scannedShuttle.userFirstName }}
                      {{ scannedShuttle.userLastName }}
                    </q-item-label>
                    <q-item-label caption>Full Name</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section avatar>
                    <q-icon name="badge" color="primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">
                      {{ scannedShuttle.userStudentNumber }}
                    </q-item-label>
                    <q-item-label caption>Student Number</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item v-if="scannedShuttle.unitNumber">
                  <q-item-section avatar>
                    <q-icon name="home" color="primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">
                      {{ scannedShuttle.unitNumber }}
                    </q-item-label>
                    <q-item-label caption>Unit Number</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section avatar>
                    <q-icon name="schedule" color="primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">
                      {{ formatTime(scannedShuttle.bookingTimeslot) }}
                    </q-item-label>
                    <q-item-label caption>Time Slot</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section avatar>
                    <q-icon name="place" color="primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="text-weight-medium">
                      {{ scannedShuttle.pickupLocation }} →
                      {{ scannedShuttle.dropoffLocation }}
                    </q-item-label>
                    <q-item-label caption>Route</q-item-label>
                  </q-item-section>
                </q-item>

                <q-item>
                  <q-item-section avatar>
                    <q-icon name="info" color="primary" />
                  </q-item-section>
                  <q-item-section>
                    <q-item-label>
                      <q-badge
                        :color="statusBadgeColor(scannedShuttle.status)"
                        class="q-pa-xs q-px-sm"
                      >
                        {{ scannedShuttle.status }}
                      </q-badge>
                    </q-item-label>
                    <q-item-label caption>Current Status</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>

              <!-- Action Buttons -->
              <div
                v-if="scannedShuttle.status === 'Pending'"
                class="row q-gutter-sm justify-end"
              >
                <q-btn
                  label="Mark Missed"
                  color="negative"
                  flat
                  icon="cancel"
                  :loading="updating"
                  @click="markMissed"
                />
                <q-btn
                  label="Confirm Pickup"
                  color="primary"
                  unelevated
                  icon="check_circle"
                  :loading="updating"
                  @click="confirmPickup"
                />
              </div>

              <div
                v-else-if="scannedShuttle.status === 'Picked Up'"
                class="row justify-end"
              >
                <q-btn
                  label="Confirm Drop-off"
                  color="secondary"
                  unelevated
                  icon="check_circle"
                  :loading="updating"
                  @click="confirmDropoff"
                />
              </div>

              <div v-else class="text-center text-grey-6 q-mt-sm">
                No further action required for this booking.
              </div>

              <!-- Scan Another -->
              <div class="row justify-center q-mt-md">
                <q-btn
                  flat
                  label="Scan Another"
                  color="primary"
                  icon="qr_code_scanner"
                  @click="resetScanner"
                />
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
import { Html5Qrcode } from 'html5-qrcode'
import ShuttleService from "src/services/api/ShuttleService";
import UserService from 'src/services/api/UserService'
import RentalService from 'src/services/api/RentalService';
import UnitService from 'src/services/api/UnitService';
import Helper from 'src/services/utils'

export default {
  name: 'DriverQRScannerPage',

  data() {
    return {
      scanning: false,
      manualId: '',
      scannedShuttle: null,
      lookingUp: false,
      updating: false,
      html5QrCode: null,
    }
  },

  computed: {
    resultColor() {
      if (!this.scannedShuttle) return 'grey'
      const map = {
        Pending: 'orange',
        'Picked Up': 'primary',
        'Dropped Off': 'green',
        'Missed Pick Up': 'red',
      }
      return map[this.scannedShuttle.status] || 'grey'
    },

    resultIcon() {
      const map = {
        Pending: 'pending',
        'Picked Up': 'directions_bus',
        'Dropped Off': 'check_circle',
        'Missed Pick Up': 'cancel',
      }
      return map[this.scannedShuttle?.status] || 'info'
    },

    resultMessage() {
      const map = {
        Pending: 'Valid Booking — Ready for Pickup',
        'Picked Up': 'On Board — Ready for Drop-off',
        'Dropped Off': 'Already Dropped Off',
        'Missed Pick Up': 'Marked as Missed',
      }
      return map[this.scannedShuttle?.status] || 'Booking Found'
    },
  },

  methods: {
    formatTime: Helper.formatTime,
    formatDate: Helper.formatDate,

    statusBadgeColor(status) {
      const map = {
        Pending: 'orange',
        'Picked Up': 'primary',
        'Dropped Off': 'green',
        'Missed Pick Up': 'red',
      }
      return map[status] || 'grey'
    },

    // ── SCANNER ───────────────────────────────────────────────────────
    async toggleScanner() {
      if (this.scanning) {
        await this.stopScanner()
      } else {
        await this.startScanner()
      }
    },

    // async startScanner() {
    //   this.scanning = true
    //   this.scannedShuttle = null

    //   await this.$nextTick()

    //   try {
    //     this.html5QrCode = new Html5Qrcode('qr-reader')

    //     await this.html5QrCode.start(
    //       { facingMode: 'environment' },
    //       {
    //         fps: 10,
    //         qrbox: { width: 250, height: 250 },
    //       },
    //       async (decodedText) => {
    //         // success callback - stop scanner then process
    //         await this.stopScanner()
    //         await this.processQRData(decodedText)
    //       },
    //       () => {
    //         // error callback - just keep scanning, no need to log every frame
    //       }
    //     )
    //   } catch (err) {
    //     console.error('Camera error:', err)
    //     this.scanning = false
    //     this.$q.notify({
    //       type: 'negative',
    //       message: 'Camera access denied. Please use manual entry instead.',
    //     })
    //   }
    // },

    async startScanner() {
      this.scanning = true
      this.scannedShuttle = null
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
    async processQRData(rawData) {
      try {
        let shuttleId = null

        // try parsing as JSON first (our format)
        try {
          const payload = JSON.parse(rawData)
          shuttleId = payload.shuttleId
        } catch {
          // plain string fallback
          shuttleId = rawData.trim()
        }

        if (!shuttleId) {
          this.$q.notify({ type: 'negative', message: 'Invalid QR code scanned' })
          return
        }

        await this.lookupShuttle(shuttleId)
      } catch (err) {
        console.error('QR processing error:', err)
        this.$q.notify({ type: 'negative', message: 'Could not read QR code' })
      }
    },

    async lookupByManualId() {
      if (!this.manualId?.trim()) {
        this.$q.notify({ type: 'warning', message: 'Please enter a Shuttle ID' })
        return
      }
      await this.lookupShuttle(this.manualId.trim())
    },

    // ── SHUTTLE LOOKUP ────────────────────────────────────────────────
    async lookupShuttle(shuttleId) {
      this.lookingUp = true
      try {
        // use findShuttleById - already exists in your ShuttleService
        const shuttle = await ShuttleService.findShuttleById(shuttleId)

        if (!shuttle) {
          this.$q.notify({ type: 'negative', message: 'Shuttle booking not found' })
          return
        }

        // enrich with user details - same pattern as AdminShuttleCard
        const user = await UserService.findUserById(shuttle.user)
        const rentals = await RentalService.findMyRentals(shuttle.user)
        const activeRental = rentals.find((r) => r.status === 'Active')
        const unit = activeRental
          ? await UnitService.findUnitById(activeRental.unit)
          : null

        this.scannedShuttle = {
          ...shuttle,
          userFirstName: user.firstName,
          userLastName: user.lastName,
          userStudentNumber: user.studentInfo.studentNumber,
          unitNumber: unit?.unitNumber || null,
        }
      } catch (err) {
        console.error('Lookup error:', err)
        this.$q.notify({
          type: 'negative',
          message: 'Failed to find shuttle booking. Check the ID and try again.',
        })
      } finally {
        this.lookingUp = false
      }
    },

    // ── STATUS UPDATES ────────────────────────────────────────────────
    async confirmPickup() {
      this.updating = true
      try {
        await ShuttleService.updateShuttle(this.scannedShuttle._id, {
          status: 'Picked Up',
        })
        this.scannedShuttle.status = 'Picked Up'
        this.$q.notify({
          type: 'positive',
          color: 'primary',
          message: 'Pickup confirmed successfully!',
        })
      } catch (err) {
        console.error(err)
        this.$q.notify({ type: 'negative', message: 'Failed to update status' })
      } finally {
        this.updating = false
      }
    },

    async confirmDropoff() {
      this.updating = true
      try {
        await ShuttleService.updateShuttle(this.scannedShuttle._id, {
          status: 'Dropped Off',
        })
        this.scannedShuttle.status = 'Dropped Off'
        this.$q.notify({
          type: 'positive',
          color: 'primary',
          message: 'Drop-off confirmed successfully!',
        })
      } catch (err) {
        console.error(err)
        this.$q.notify({ type: 'negative', message: 'Failed to update status' })
      } finally {
        this.updating = false
      }
    },

    async markMissed() {
      this.updating = true
      try {
        await ShuttleService.updateShuttle(this.scannedShuttle._id, {
          status: 'Missed Pick Up',
        })
        this.scannedShuttle.status = 'Missed Pick Up'
        this.$q.notify({
          type: 'warning',
          message: 'Marked as Missed Pick Up.',
        })
      } catch (err) {
        console.error(err)
        this.$q.notify({ type: 'negative', message: 'Failed to update status' })
      } finally {
        this.updating = false
      }
    },

    resetScanner() {
      this.scannedShuttle = null
      this.manualId = ''
    },
  },

  // cleanup camera on page leave
  async beforeUnmount() {
    await this.stopScanner()
  },
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
