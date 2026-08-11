<template>
  <q-page>
    <div class="background-wrapper">
      <q-img src="~src/assets/resources/home/hero/h3.jpg" alt="Hero Image" class="blurred-background" loading="eager" />
    </div>

    <div class="absolute-full column justify-center items-center text-black">
      <q-card class="q-pa-md" style="max-width: 400px">
        <q-card-section class="column items-center">
          <div class="text-h6">Install our App</div>
        </q-card-section>

        <q-card-section class="q-gutter-md">
          <div class="text-body1">
            Follow these steps to install the app on your Android device:
            <ul class="custom-list text-body1">
              <li>
                <span class="tick-emoji">✔️</span> Tap the button below to download
              </li>
              <li>
                <span class="tick-emoji">✔️</span> Once downloaded, open the file from your notifications or Downloads folder.
              </li>
              <li>
                <span class="tick-emoji">✔️</span> If prompted, allow installation from your browser.
              </li>
              <li>
                <span class="tick-emoji">✔️</span> Tap "Install" to complete the process.
              </li>
            </ul>
          </div>

          <CustomButton label="Download" color="primary" class="q-mt-md full-width" @click="downloadApk" />

          <CustomButton to="/" color="white" text-color="black" label="Return to Home" class="q-mt-sm full-width" />
        </q-card-section>
      </q-card>
    </div>
  </q-page>
</template>

<script>
import CustomButton from 'src/components/elements/CustomButton.vue';

export default {
  components: {
    CustomButton
  },
  methods: {
    downloadApk() {
      const link = document.createElement('a')
      link.href = '/files/the-web-v5-app.apk'
      link.download = 'the-web-v5-app.apk'
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }
}
</script>

<style scoped lang="sass">
.tick-emoji
  filter: invert(44%) sepia(40%) saturate(5175%) hue-rotate(142deg) brightness(90%) contrast(101%)

.custom-list
  list-style-type: none
  padding-left: 1em
  line-height: 1.4

.custom-list li
  position: relative
  padding-left: 2.5em
  text-indent: -3em
  margin-bottom: 0.5em

.custom-list ul
  list-style: disc
  padding-left: 1.5rem
  margin-top: 0.25rem
  margin-bottom: 0

.custom-list ul li
  padding-left: 3rem

.custom-list li:before
  content: ""
  position: absolute
  left: 0
  padding-right: 0.5em

/* For lists with checkmarks */
.custom-list li span
  position: relative
  left: -0.5em

.emoji
  font-family: "Twemoji Mozilla", "Segoe UI Emoji"
  color: #ffd700

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

</style>
