<!-- <template>
  <div class="fullscreen flex flex-center column">
    <q-spinner size="50px" color="primary" />
    <div class="q-mt-md text-h6">Waking up the server...</div>
    <div class="q-mt-sm">This may take up to a minute.</div>
  </div>
</template>

<script>
import axiosInstance from 'src/services/axiosInstance'

export default {
  name: 'LoadingPage',

  data() {
    return {
      hasRetried: false,
    }
  },

  mounted() {
    this.checkServerStatus()
  },

  methods: {
    async checkServerStatus() {
      console.log('[Wakeup] Waiting 2 seconds...')
      await this.sleep(2000)

      console.log('[Wakeup] Checking /units...')
      try {
        const unitsResponse = await axiosInstance.get('/units')
        const unitsData = unitsResponse.data

        if (Array.isArray(unitsData) && unitsData.length > 0) {
          console.log('[Wakeup] Server is up. Proceeding...')
          this.proceedToApp()
        } else {
          this.handleRetryOrFail('[Wakeup] Invalid data from /units')
        }
      } catch (error) {
        this.handleRetryOrFail('[Wakeup] Error contacting /units:', error)
      }
    },

    async handleRetryOrFail(message) {
      if (!this.hasRetried) {
        this.hasRetried = true
        console.warn(`${message}. Retrying in 50 seconds...`)
        await this.sleep(50000)
        this.checkServerStatus()
      } else {
        console.error('[Wakeup] Second attempt failed. Redirecting to /404.')
        this.$router.replace('/404')
      }
    },

    async proceedToApp() {
      try {
        const healthResponse = await axiosInstance.get('/health')
        if (healthResponse.status === 200) {
          const redirectPath = this.$route.query.redirect || '/'

          switch (redirectPath) {
            case '/verify-email':
            case '/reset-password': {
              const token = new URLSearchParams(window.location.search).get('token')
              if (token) {
                this.$router.replace(redirectPath)
              } else {
                this.$router.replace('/404')
              }
              break
            }

            case '/resend-verification':
              this.$router.replace(redirectPath || '/')
              break

            case '/404':
              this.$router.replace('/')
              break

            default:
              this.$router.replace(redirectPath)
          }
        } else {
          this.$router.replace('/404')
        }
      } catch (e) {
        console.error('[Wakeup] Health check failed:', e)
        this.$router.replace('/404')
      }
    },

    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    }
  }
}
</script> -->

<!-- <template>
  <div class="fullscreen flex flex-center column">
    <q-spinner size="50px" color="primary" />
    <div v-if="showMessage" class="q-mt-md text-h6">Waking up the server...</div>
    <div v-if="showMessage" class="q-mt-sm">This may take up to a minute.</div>
  </div>
</template>

<script>
import axiosInstance from 'src/services/axiosInstance'

export default {
  name: 'LoadingPage',

  data() {
    return {
      hasRetried: false,
      showMessage: false // 👈 initially hidden
    }
  },

  mounted() {
    // After 2 seconds, show the "waking up" message
    setTimeout(() => {
      this.showMessage = true
    }, 2000)

    this.checkServerStatus()
  },

  methods: {
    async checkServerStatus() {
      console.log('[Wakeup] Waiting 50ms...')
      await this.sleep(50)

      console.log('[Wakeup] Checking /units...')
      try {
        const unitsResponse = await axiosInstance.get('/units')
        const unitsData = unitsResponse.data

        if (Array.isArray(unitsData) && unitsData.length > 0) {
          console.log('[Wakeup] Server is up. Proceeding...')
          this.proceedToApp()
        } else {
          this.handleRetryOrFail('[Wakeup] Invalid data from /units')
        }
      } catch (error) {
        this.handleRetryOrFail('[Wakeup] Error contacting /units:', error)
      }
    },

    async handleRetryOrFail(message) {
      if (!this.hasRetried) {
        this.hasRetried = true
        console.warn(`${message}. Retrying in 50 seconds...`)
        this.showMessage = true // 🟢 Show message during retry
        await this.sleep(50000)
        this.checkServerStatus()
      } else {
        console.error('[Wakeup] Second attempt failed. Redirecting to /404.')
        this.$router.replace('/404')
      }
    },

    async proceedToApp() {
      try {
        const healthResponse = await axiosInstance.get('/health')
        if (healthResponse.status === 200) {
          const redirectPath = this.$route.query.redirect || '/'

          switch (redirectPath) {
            case '/verify-email':
            case '/reset-password': {
              const redirectUrl = new URL(window.location.origin + (this.$route.query.redirect || '/'))
              const token = redirectUrl.searchParams.get('token')
              if (token) {
                this.$router.replace(redirectPath)
              } else {
                this.$router.replace('/404')
              }
              break
            }

            case '/resend-verification':
              this.$router.replace(redirectPath || '/')
              break

            case '/404':
              this.$router.replace('/')
              break

            default:
              this.$router.replace(redirectPath)
          }
        } else {
          this.$router.replace('/404')
        }
      } catch (e) {
        console.error('[Wakeup] Health check failed:', e)
        this.$router.replace('/404')
      }
    },

    sleep(ms) {
      return new Promise(resolve => setTimeout(resolve, ms))
    }
  }
}
</script> -->

<template>
  <div class="fullscreen flex flex-center column">
    <q-spinner size="50px" color="primary" />
    <div class="q-mt-md text-h6">Waking up the server...</div>
    <div class="q-mt-sm">This may take up to a minute.</div>
  </div>
</template>

<script>
export default {
  name: 'LoadingPage',

  mounted() {
    const redirectTimeout = this.$route.query.retry ? 5000 : 3000
    setTimeout(() => {
      this.$router.replace(this.$route.query.redirect || '/')
    }, redirectTimeout)
  }
}
</script>
