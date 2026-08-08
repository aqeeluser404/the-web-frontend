<template>
  <q-page>
    <div>
      <q-img
        src="~src/assets/resources/home/hero/h3.jpg"
        alt="Hero Image"
        class="blurred-background"
      />
    </div>

    <div class="absolute-full column justify-center items-start text-black">
      <q-card bordered flat class="row constrain q-col-gutter-md">
        <div></div>

        <div class="column q-pa-lg col-md-6 col-12 bg-black items-center justify-center right-section">
          <img :src="logoSrc" alt="logo" class="" >
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<script>
  import theWeb3d from '../../assets/resources/logos/web3dlogo.png'

  export default {
    name: "OtpPage",

    data() {
      return {

      }
    }
  }
</script>

<style scoped lang="sass">
.right-section
  display: flex
  @media (max-width: 1024px)
    display: none

.background-wrapper
  position: fixed
  width: 100%
  height: 100vh
  overflow: hidden
  z-index: -1

.blurred-background
  width: 100%
  height: 100%
  object-fit: cover
  filter: blur(8px)
  transform: scale(1.1)

.constrain
  max-width: 750px
  min-height: 450px
  width: 90%
  background: rgba(255, 255, 255, 0.85)
  backdrop-filter: blur(2px)
</style>
