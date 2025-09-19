<!-- <template>
  <div
    ref="zoomContainer"
    class="zoom-wrapper"
    @wheel="handleWheel"
    @touchstart="startTouch"
    @touchmove="moveTouch"
    @touchend="endTouch"
    :style="zoomStyle"
  >
    <slot />
  </div>
</template>

<script>
export default {
  name: 'SimpleZoom',
  data() {
    return {
      scale: 1,
      lastScale: 1,
      startDistance: null
    };
  },
  computed: {
    zoomStyle() {
      return {
        transform: `scale(${this.scale})`,
        transformOrigin: 'center center',
        transition: 'transform 0.1s ease-out'
      };
    }
  },
  methods: {
    handleWheel(e) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      this.scale = Math.min(Math.max(this.scale + delta, 1), 3);
    },
    startTouch(e) {
      if (e.touches.length === 2) {
        const [a, b] = e.touches;
        this.startDistance = Math.hypot(b.pageX - a.pageX, b.pageY - a.pageY);
      }
    },
    moveTouch(e) {
      if (e.touches.length === 2 && this.startDistance) {
        const [a, b] = e.touches;
        const currentDistance = Math.hypot(b.pageX - a.pageX, b.pageY - a.pageY);
        const scaleChange = currentDistance / this.startDistance;
        this.scale = Math.min(Math.max(this.lastScale * scaleChange, 1), 3);
      }
    },
    endTouch() {
      this.lastScale = this.scale;
      this.startDistance = null;
    }
  }
};
</script>

<style scoped>
.zoom-wrapper {
  touch-action: none;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.zoom-wrapper img {
  max-width: 100%;
  max-height: 100%;
  display: block;
}
</style> -->


<template>
  <div ref="zoomContainer" class="zoom-wrapper" @wheel="handleWheel" @mousedown="startPan" @mousemove="doPan"
    @mouseup="endPan" @mouseleave="endPan" @touchstart="startTouch" @touchmove="moveTouch" @touchend="endTouch"
    :style="wrapperStyle">
    <div class="zoom-content" :style="zoomStyle">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  name: 'SimpleZoom',
  data() {
    return {
      scale: 1,
      lastScale: 1,
      startDistance: null,
      isPanning: false,
      panStart: { x: 0, y: 0 },
      panOffset: { x: 0, y: 0 }
    };
  },
  computed: {
    zoomStyle() {
      return {
        transform: `scale(${this.scale}) translate(${this.panOffset.x}px, ${this.panOffset.y}px)`,
        transformOrigin: 'center center',
        transition: this.isPanning ? 'none' : 'transform 0.1s ease-out'
      };
    },
    wrapperStyle() {
      return {
        overflow: 'hidden',
        width: '100%',
        height: '100%',
        touchAction: 'none',
        cursor: this.isPanning ? 'grabbing' : 'grab'
      };
    }
  },
  methods: {
    handleWheel(e) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      this.scale = Math.min(Math.max(this.scale + delta, 1), 3);
    },
    startTouch(e) {
      if (e.touches.length === 2) {
        const [a, b] = e.touches;
        this.startDistance = Math.hypot(b.pageX - a.pageX, b.pageY - a.pageY);
      } else if (e.touches.length === 1 && this.scale > 1) {
        this.isPanning = true;
        this.panStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    },
    moveTouch(e) {
      if (e.touches.length === 2 && this.startDistance) {
        const [a, b] = e.touches;
        const currentDistance = Math.hypot(b.pageX - a.pageX, b.pageY - a.pageY);
        const scaleChange = currentDistance / this.startDistance;
        this.scale = Math.min(Math.max(this.lastScale * scaleChange, 1), 3);
      } else if (e.touches.length === 1 && this.isPanning) {
        const dx = e.touches[0].clientX - this.panStart.x;
        const dy = e.touches[0].clientY - this.panStart.y;
        this.panOffset.x += dx;
        this.panOffset.y += dy;
        this.panStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    },
    endTouch() {
      this.lastScale = this.scale;
      this.startDistance = null;
      this.isPanning = false;
    },
    startPan(e) {
      if (this.scale <= 1) return;
      this.isPanning = true;
      this.panStart = { x: e.clientX, y: e.clientY };
    },
    doPan(e) {
      if (!this.isPanning) return;
      const dx = e.clientX - this.panStart.x;
      const dy = e.clientY - this.panStart.y;
      this.panOffset.x += dx;
      this.panOffset.y += dy;
      this.panStart = { x: e.clientX, y: e.clientY };
    },
    endPan() {
      this.isPanning = false;
    }
  }
};
</script>

<style scoped>
.zoom-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
}

.zoom-content {
  will-change: transform;
}
</style>
