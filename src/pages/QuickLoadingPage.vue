<template>
  <div class="fullscreen flex flex-center column">
    <q-spinner size="50px" color="primary" />
    <div v-if="showMessage" class="q-mt-md text-h6">Waking up the server...</div>
    <div v-if="showMessage" class="q-mt-sm">This may take up to a minute.</div>
  </div>
</template>

<script>
export default {
  name: 'QuickLoadingPage',

  data() {
    return {
      showMessage: false
    }
  },

  mounted() {
    setTimeout(() => {
      this.showMessage = true
    }, 2000)

    const redirectPath = this.$route.query.redirect || '/'
    setTimeout(() => {
      this.$router.replace(redirectPath)
    }, 1500)
  }
}
</script>
