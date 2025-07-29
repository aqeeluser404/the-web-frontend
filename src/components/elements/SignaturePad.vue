<template>
  <div class="signature-pad-container">
    <q-card flat bordered>

      <q-card-section>
        <div>Digital Signature</div>
      </q-card-section>

      <q-card-section>
        <canvas
          ref="signatureCanvas"
          class="signature-canvas"
          @mousedown="startDrawing"
          @mousemove="draw"
          @mouseup="stopDrawing"
          @mouseleave="stopDrawing"
          @touchstart="startDrawing"
          @touchmove="draw"
          @touchend="stopDrawing"
        ></canvas>
      </q-card-section>

      <q-card-section align="left">
        <q-btn
          flat
          color="negative"
          label="Clear"
          @click="clearSignature"
        />
        <q-btn
          flat
          color="primary"
          label="Save"
          :disable="isEmpty"
          @click="saveSignature"
        />
      </q-card-section>
    </q-card>
  </div>
</template>

<script>
import { ref, onMounted, nextTick } from 'vue'

export default {
  name: 'SignaturePad',
  emits: ['save'],
  setup(props, { emit }) {
    const signatureCanvas = ref(null)
    const isDrawing = ref(false)
    const lastX = ref(0)
    const lastY = ref(0)
    const ctx = ref(null)
    const isEmpty = ref(true)

    onMounted(() => {
      nextTick(() => {
        const canvas = signatureCanvas.value
        if (canvas) {
          ctx.value = canvas.getContext('2d')
          resizeCanvas()
        }
        window.addEventListener('resize', resizeCanvas)
      })
    })


    const resizeCanvas = () => {
      const canvas = signatureCanvas.value
      if (!canvas)
        return;

      const ratio = Math.max(window.devicePixelRatio || 1, 1)

      canvas.width = canvas.offsetWidth * ratio
      canvas.height = canvas.offsetHeight * ratio
      canvas.style.width = '100%'
      canvas.style.height = '100%'

      ctx.value.scale(ratio, ratio)
      ctx.value.lineWidth = 2
      ctx.value.lineCap = 'round'
      ctx.value.strokeStyle = '#000000'
    }

    const startDrawing = (e) => {
      isDrawing.value = true
      const canvas = signatureCanvas.value
      const rect = canvas.getBoundingClientRect()

      if (e.type.includes('touch')) {
        lastX.value = (e.touches[0].clientX - rect.left)
        lastY.value = (e.touches[0].clientY - rect.top)
      } else {
        lastX.value = (e.clientX - rect.left)
        lastY.value = (e.clientY - rect.top)
      }
    }

    const draw = (e) => {
      if (!isDrawing.value) return

      const canvas = signatureCanvas.value
      const rect = canvas.getBoundingClientRect()
      let currentX, currentY

      if (e.type.includes('touch')) {
        currentX = (e.touches[0].clientX - rect.left)
        currentY = (e.touches[0].clientY - rect.top)
      } else {
        currentX = (e.clientX - rect.left)
        currentY = (e.clientY - rect.top)
      }

      ctx.value.beginPath()
      ctx.value.moveTo(lastX.value, lastY.value)
      ctx.value.lineTo(currentX, currentY)
      ctx.value.stroke()

      lastX.value = currentX
      lastY.value = currentY
      isEmpty.value = false
    }

    const stopDrawing = () => {
      isDrawing.value = false
    }

    const clearSignature = () => {
      const canvas = signatureCanvas.value
      ctx.value.clearRect(0, 0, canvas.width, canvas.height)
      isEmpty.value = true
    }

    const saveSignature = () => {
      if (isEmpty.value) {
        // prevent emission if canvas is blank
        return;
      }
      const canvas = signatureCanvas.value;
      const signatureData = canvas.toDataURL('image/png');
      emit('save', signatureData);
    }

    return {
      signatureCanvas,
      isDrawing,
      lastX,
      lastY,
      isEmpty,
      startDrawing,
      draw,
      stopDrawing,
      clearSignature,
      saveSignature
    }
  }
}
</script>

<style scoped>
.signature-pad-container {
  width: 100%;
  margin-bottom: 20px;
}

.signature-canvas {
  width: 100%;
  height: 200px;
  border: 1px solid #ddd;
  background-color: white;
  touch-action: none;
}
</style>
