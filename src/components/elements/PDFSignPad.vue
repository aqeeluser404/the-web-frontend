<template>
  <canvas
    ref="sigPad"
    class="pdf-signature"
    :style="{ top: top + 'px', left: left + 'px', width: width + 'px', height: height + 'px' }"
    @mousedown="startDraw"
    @mousemove="draw"
    @mouseup="endDraw"
    @mouseleave="endDraw"
    @touchstart="startDrawTouch"
    @touchmove="drawTouch"
    @touchend="endDraw"
  />
</template>

<script>
export default {
  props: ['top', 'left', 'width', 'height'],
  data() {
    return {
      isDrawing: false,
      ctx: null
    }
  },
  mounted() {
    const canvas = this.$refs.sigPad
    this.ctx = canvas.getContext('2d')
    // Set actual canvas resolution
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight
    this.ctx.strokeStyle = '#000'
    this.ctx.lineWidth = 2
    this.ctx.lineCap = 'round'
    this.ctx.lineJoin = 'round'
  },
  methods: {
    getPos(e) {
      const rect = this.$refs.sigPad.getBoundingClientRect()
      return {
        x: (e.clientX - rect.left) * (this.$refs.sigPad.width / rect.width),
        y: (e.clientY - rect.top) * (this.$refs.sigPad.height / rect.height)
      }
    },
    startDraw(e) {
      this.isDrawing = true
      const pos = this.getPos(e)
      this.ctx.beginPath()
      this.ctx.moveTo(pos.x, pos.y)
    },
    draw(e) {
      if (!this.isDrawing) return
      const pos = this.getPos(e)
      this.ctx.lineTo(pos.x, pos.y)
      this.ctx.stroke()
    },
    startDrawTouch(e) {
      e.preventDefault()
      const touch = e.touches[0]
      this.startDraw({ clientX: touch.clientX, clientY: touch.clientY })
    },
    drawTouch(e) {
      e.preventDefault()
      const touch = e.touches[0]
      this.draw({ clientX: touch.clientX, clientY: touch.clientY })
    },
    endDraw() {
      this.isDrawing = false
    },
    clear() {
      const canvas = this.$refs.sigPad
      this.ctx.clearRect(0, 0, canvas.width, canvas.height)
    },
    getSignature() {
      return this.$refs.sigPad.toDataURL('image/png')
    }
  }
}
</script>

<style scoped>
.pdf-signature {
  position: absolute;
  /* border: 1px solid rgba(0,0,0,0.15); */
  background: white;
  cursor: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path fill="black" d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>') 0 24, crosshair;
  touch-action: none;
}
.pdf-signature:focus {
  border-color: #1976d2;
  border-width: 2px;
}
</style>
