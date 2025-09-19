<template>
  <div class="map-image-wrapper" style="position: relative; width: 100%; height: 100%;">
    <q-img v-if="imageUrl" :src="imageUrl" class="hero-image" fit="contain" />

    <div
      v-for="marker in markers"
      :key="marker.id"
      class="marker"
      :class="marker.class"
      :data-label="marker.label"
      @click="() => onMarkerClick(marker.unitSuffix, marker.subUnitId)"
      :style="{ top: marker.top, left: marker.left, position: 'absolute' }"
    ></div>
  </div>
</template>

<script>
export default {
  name: "MapView",
  props: {
    imageUrl: {
      type: String,
      required: true,
    },
    markers: {
      type: Array,
      required: true,
      // Expected each marker obj: { id, class, label, top, left, unitSuffix, subUnitId }
    },
    currentFloor: {
      type: [String, Number],
      required: true,
    },
    allUnits: {
      type: Array,
      required: true,
    },
  },
  methods: {
    onMarkerClick(unitSuffix, subUnitId) {
      const floorNumber = this.currentFloor;
      if (!floorNumber) {
        this.$q.notify({ type: "negative", message: "Floor not selected" });
        return;
      }
      const targetUnitNumber = `${floorNumber}-${unitSuffix}`;
      const floorIndex = floorNumber - 1;
      const unitsOnFloor = this.allUnits?.[floorIndex] || [];

      const matchedUnit = unitsOnFloor.find(
        (unit) =>
          unit.unitNumber.toString() === targetUnitNumber ||
          unit.unitNumber.toString().endsWith(unitSuffix)
      );
      if (matchedUnit) {
        this.$emit("select-unit", matchedUnit, subUnitId);
      } else {
        this.$q.notify({ type: "negative", message: "Unit not found" });
      }
    },
  },
};
</script>

<style scoped>
.map-image-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}
.hero-image {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}
.marker {
  cursor: pointer;
  background-color: white;
  border: 1px solid red;
  background-size: cover;
  background-repeat: no-repeat;
  transform: translate(-50%, -100%);
  position: absolute;
}
.marker:hover {
  transform: translate(-50%, -100%) scale(1.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease;
}
.marker-1 {
  width: 4vw;
  height: 6.5vw;
  background-image: url('/assets/units/1-01-01.png');
}
.marker-2 {
  width: 4vw;
  height: 6.5vw;
  background-image: url('/assets/units/1-01-02.png');
}
</style>
