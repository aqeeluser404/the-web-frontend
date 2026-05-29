<template>
  <!-------------------- VISITOR SHUTTLE -------------------->
  <div class="q-py-md">
    <q-card>

    </q-card>
  </div>

</template>

<script>
export default {
  name: "BookingPage",
}
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
