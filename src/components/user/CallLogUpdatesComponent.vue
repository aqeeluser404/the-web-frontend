<template>
  <q-card class="combined-unit-card">
    <div class="row">
      <!-- left section -->
      <div
        class="col-md-6 col-12 q-pa-md left-card"
        style="background-color: #f8f8f8"
      >
        <q-card-section class="row justify-between items-center">
          <div class="text-h6">
            <q-icon name="phone" color="primary" class="q-mr-sm" />
            Call Log Details
          </div>
          <q-btn
            flat
            round
            icon="close"
            @click="$emit('close')"
            size="md"
            color="grey-10"
            aria-label="Close"
          />
        </q-card-section>

        <q-separator />

        <q-card-section>
          <!-- Image at the top -->
          <div
            v-if="callLog.images && callLog.images.length > 0"
            class="image-section q-mb-md"
          >
            <div class="image-container">
              <q-img
                :src="getImageUrl(callLog.images[currentImageIndex].imageUrl)"
                class="product-image cursor-zoom-in"
                fit="contain"
                loading="eager"
              />
              <q-btn
                v-if="callLog.images.length > 1"
                round
                flat
                dense
                class="nav-button left"
                icon="chevron_left"
                @click.stop="prevImage"
              />
              <q-btn
                v-if="callLog.images.length > 1"
                round
                flat
                dense
                class="nav-button right"
                icon="chevron_right"
                @click.stop="nextImage"
              />
              <div v-if="callLog.images.length > 1" class="image-counter">
                {{ currentImageIndex + 1 }} / {{ callLog.images.length }}
              </div>
            </div>
          </div>

          <!-- Status Badge -->
          <div class="row q-mb-md">
            <q-chip
              :color="callLog.status === 'Closed' ? 'green' : 'orange'"
              text-color="white"
              class="q-mt-sm"
            >
              <q-icon
                :name="callLog.status === 'Closed' ? 'check_circle' : 'pending'"
                size="sm"
                class="q-mr-xs"
              />
              {{ callLog.status || "Open" }}
            </q-chip>

            <q-chip color="primary" text-color="white" class="q-mt-sm q-ml-sm">
              <q-icon name="label" size="sm" class="q-mr-xs" />
              {{ callLog.callType || "General" }}
            </q-chip>
          </div>

          <q-item>
            <q-item-section class="text-left text-subtitle1">
              <div class="flex items-center">
                <q-icon
                  name="confirmation_number"
                  color="grey-7"
                  size="sm"
                  class="q-mr-sm"
                />
                <span>Log Number</span>
              </div>
            </q-item-section>
            <q-item-section class="text-left text-subtitle1 text-weight-medium">
              #{{ callLog.logNumber }}
            </q-item-section>
          </q-item>

          <q-separator spaced />

          <q-item>
            <q-item-section class="text-left text-subtitle1">
              <div class="flex items-center">
                <q-icon name="event" color="grey-7" size="sm" class="q-mr-sm" />
                <span>Opened</span>
              </div>
            </q-item-section>
            <q-item-section class="text-left text-subtitle1">
              <div class="flex items-center">
                <span>{{ formatDate(callLog.createdAt) }}</span>
                <span class="text-grey-6 q-ml-sm"
                  >({{ formatTime(callLog.createdAt) }})</span
                >
              </div>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section class="text-left text-subtitle1">
              <div class="flex items-center">
                <q-icon
                  name="event_available"
                  color="grey-7"
                  size="sm"
                  class="q-mr-sm"
                />
                <span>Closed</span>
              </div>
            </q-item-section>
            <q-item-section class="text-left text-subtitle1">
              <div class="flex items-center" v-if="callLog.closedAt">
                <span>{{ formatDate(callLog.closedAt) }}</span>
                <span class="text-grey-6 q-ml-xs">{{
                  formatTime(callLog.closedAt)
                }}</span>
              </div>
              <span v-else class="text-grey-6">—</span>
            </q-item-section>
          </q-item>

          <q-separator spaced />

          <q-item>
            <q-item-section class="text-left text-subtitle1">
              <div class="flex items-center">
                <q-icon name="home" color="grey-7" size="sm" class="q-mr-sm" />
                <span>Unit</span>
              </div>
            </q-item-section>
            <q-item-section class="text-left text-subtitle1">
              {{ callLog.unit || "N/A" }}
            </q-item-section>
          </q-item>

          <q-item v-if="callLog.vendorInfo?.vendorType">
            <q-item-section class="text-left text-subtitle1">
              <div class="flex items-center">
                <q-icon
                  name="business"
                  color="grey-7"
                  size="sm"
                  class="q-mr-sm"
                />
                <span>Vendor</span>
              </div>
            </q-item-section>
            <q-item-section class="text-left text-subtitle1">
              <div class="flex items-center">
                <span class="">{{ callLog.vendorInfo.vendorType }}</span>
                <span
                  v-if="callLog.vendorInfo.vendorContact"
                  class="text-grey-6 q-ml-sm"
                >
                  ({{ callLog.vendorInfo.vendorContact }})
                </span>
              </div>
            </q-item-section>
          </q-item>

          <q-separator spaced />

          <q-item>
            <q-item-section
              class="text-left text-subtitle1"
              style="min-width: 120px"
            >
              <div class="flex items-center">
                <q-icon
                  name="description"
                  color="grey-7"
                  size="sm"
                  class="q-mr-sm"
                />
                <span>Description</span>
              </div>
            </q-item-section>
            <q-item-section class="text-left">
              <div
                class="text-subtitle1 description-text"
                style="padding-left: 0"
              >
                {{ callLog.description || "No description provided" }}
              </div>
            </q-item-section>
          </q-item>

          <q-item>
            <q-item-section
              class="text-left text-subtitle1"
              style="min-width: 120px"
            >
              <div class="flex items-center">
                <q-icon
                  name="summarize"
                  color="grey-7"
                  size="sm"
                  class="q-mr-sm"
                />
                <span>Summary</span>
              </div>
            </q-item-section>
            <q-item-section class="text-left">
              <div class="text-subtitle1 summary-text" style="padding-left: 0">
                {{ callLog.summary || "No summary provided" }}
              </div>
            </q-item-section>
          </q-item>
        </q-card-section>
      </div>

      <!-- right section: updates history, read-only -->
      <div class="col-md-6 col-12 q-pa-md right-card">
        <q-card-section>
          <div class="text-h6">
            <q-icon name="history" color="primary" class="q-mr-sm" />
            Update History
          </div>
          <div class="text-caption text-grey-6">
            {{ callLog.updates?.length || 0 }} updates
          </div>
        </q-card-section>

        <q-card-section v-if="callLog.updates && callLog.updates.length">
          <q-timeline color="primary" layout="dense">
            <q-timeline-entry
              v-for="(u, index) in callLog.updates"
              :key="index"
              :color="index === 0 ? 'primary' : 'grey-5'"
            >
              <template v-slot:title>
                <span class="text-subtitle1">{{ u.updateInfo }}</span>
              </template>
              <template v-slot:subtitle>
                <span class="text-grey-6">
                  <q-icon name="schedule" size="xs" class="q-mr-xs" />
                  {{ formatDate(u.addedAt) }} {{ formatTime(u.addedAt) }}
                </span>
              </template>
            </q-timeline-entry>
          </q-timeline>
        </q-card-section>

        <q-card-section v-else class="empty-state">
          <div class="text-center q-py-xl">
            <q-icon name="inbox" size="56px" color="grey-4" />
            <div class="text-h6 text-grey-6 q-mt-md">No updates yet</div>
            <div class="text-caption text-grey-5">
              Updates will appear here as they're added
            </div>
          </div>
        </q-card-section>
      </div>
    </div>
  </q-card>
</template>

<script>
import Helper from "src/services/helper/utils";

export default {
  props: {
    callLog: {
      type: Object,
      required: true,
    },
  },
  emits: ["close"],
  data() {
    return {
      currentImageIndex: 0,
    };
  },
  methods: {
    getImageUrl: Helper.getImageUrl,
    formatDate: Helper.formatDate,
    formatTime: Helper.formatTime,
    nextImage() {
      this.currentImageIndex =
        (this.currentImageIndex + 1) % this.callLog.images.length;
    },
    prevImage() {
      this.currentImageIndex =
        (this.currentImageIndex - 1 + this.callLog.images.length) %
        this.callLog.images.length;
    },
  },
};
</script>

<style lang="sass" scoped>
.left-card
  display: flex
  flex-direction: column
  height: 100%
  border-radius: 8px 0 0 8px

  @media (max-width: 600px)
    border-radius: 8px 8px 0 0

.right-card
  background: #ffffff
  border-radius: 0 8px 8px 0
  height: 100%

  @media (max-width: 600px)
    border-radius: 0 0 8px 8px

.combined-unit-card
  width: 100%
  max-width: 1570px
  padding: 16px
  border-radius: 12px
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12)

  @media (min-width: 601px)
    min-width: 1600px

  @media (max-width: 600px)
    min-width: unset
    padding: 8px

.image-section
  width: 100%

.image-container
  position: relative
  width: 100%
  height: 300px
  overflow: hidden
  border-radius: 8px
  background: #f0f0f0
  display: flex
  justify-content: center
  align-items: center

  @media (max-width: 600px)
    height: 200px

.product-image
  width: 100%
  height: 100%
  object-fit: contain
  display: block

.nav-button
  position: absolute
  top: 50%
  transform: translateY(-50%)
  background: rgba(0, 0, 0, 0.5)
  color: white
  z-index: 2
  width: 40px
  height: 40px
  font-size: 20px

  &:hover
    background: rgba(0, 0, 0, 0.7)

  &.left
    left: 8px
  &.right
    right: 8px

.image-counter
  position: absolute
  bottom: 12px
  right: 12px
  background: rgba(0, 0, 0, 0.6)
  color: white
  padding: 4px 12px
  border-radius: 12px
  font-size: 12px
  z-index: 2

.description-text,
.summary-text
  background: #f5f5f5
  padding: 8px 12px
  border-radius: 6px
  word-break: break-word
  line-height: 1.5

.empty-state
  background: #fafafa
  border-radius: 8px

// Timeline styling
:deep(.q-timeline__entry)
  padding-bottom: 16px

:deep(.q-timeline__dot)
  width: 12px
  height: 12px
  min-width: 12px

:deep(.q-timeline__title)
  font-weight: 500

:deep(.q-timeline__subtitle)
  margin-top: 2px
</style>
