// import { route } from 'quasar/wrappers'
// import {
//   createRouter,
//   createMemoryHistory,
//   createWebHistory,
//   createWebHashHistory
// } from 'vue-router'
// import routes from './routes'
// import axiosInstance from 'src/services/axiosInstance'

// export default route(function () {
//   const createHistory = process.env.SERVER
//     ? createMemoryHistory
//     : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

//   const Router = createRouter({
//     scrollBehavior: () => ({ left: 0, top: 0 }),
//     routes,
//     history: createHistory(process.env.VUE_ROUTER_BASE)
//   })

//   let hasChecked = false // Prevent infinite redirect loop

//   Router.beforeEach(async (to, from, next) => {
//     if (!hasChecked && to.path !== '/loading') {
//       hasChecked = true
//       return next({ path: '/loading', query: { redirect: to.fullPath } })
//     }

//     next()
//   })

//   return Router
// })




// import { route } from 'quasar/wrappers'
// import {
//   createRouter,
//   createMemoryHistory,
//   createWebHistory,
//   createWebHashHistory
// } from 'vue-router'
// import routes from './routes'
// import axiosInstance from 'src/services/axiosInstance'

// export default route(function () {
//   const createHistory = process.env.SERVER
//     ? createMemoryHistory
//     : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

//   const Router = createRouter({
//     scrollBehavior: () => ({ left: 0, top: 0 }),
//     routes,
//     history: createHistory(process.env.VUE_ROUTER_BASE)
//   })

//   let serverReady = false
//   let serverCheckInProgress = false

//   async function checkServerStatus() {
//     if (serverReady) return true
//     console.log('[Router] Checking server status...')
//     try {
//       const response = await axiosInstance.get(`/${process.env.VUE_APP_SERVER_CHECK}`);
//       const unitsData = response.data
//       serverReady = Array.isArray(unitsData) && unitsData.length > 0
//       return serverReady
//     } catch (error) {
//       console.error('[Router] Server check failed:', error)
//       return false
//     }
//   }

//   Router.beforeEach(async (to, from, next) => {
//     // Skip checks for loading page
//     if (to.path === '/loading' || to.path === '/quick-load') {
//       return next()
//     }

//     // Quick load screen before server check (only if not retried and not ready)
//     if (!serverReady && !serverCheckInProgress && from.path !== '/quick-load') {
//       return next({
//         path: '/quick-load',
//         query: { redirect: to.fullPath }
//       })
//     }

//     // First check server status if not already ready
//     if (!serverReady && !serverCheckInProgress) {
//       serverCheckInProgress = true

//       const isServerUp = await checkServerStatus()
//       serverCheckInProgress = false

//       if (!isServerUp) {
//         // If already coming from loading and retrying, go to 404
//         if (from.path === '/loading' && to.query.retry) {
//           return next('/404')
//         }
//         return next({
//           path: '/loading',
//           query: {
//             redirect: to.fullPath,
//             retry: true
//           }
//         })
//       }
//       serverReady = true
//     }

//     // Handle special routes
//     switch (to.path) {
//       case '/verify-email':
//       case '/reset-password':
//         if (!to.query.token) {
//           return next('/') // Redirect to home instead of 404
//         }
//         break

//       case '/resend-verification':
//         if (from.path !== '/verify-email') {
//           return next('/') // Redirect to home instead of 404
//         }
//         break

//       case '/404':
//         return next('') // Always redirect 404 to home
//     }

//     // For all other cases, proceed normally
//     next()
//   })

//   return Router
// })



import { route } from 'quasar/wrappers'
import {
  createRouter,
  createMemoryHistory,
  createWebHistory,
  createWebHashHistory
} from 'vue-router'
import routes from './routes'
import axiosInstance from 'src/services/axiosInstance'

export default route(function () {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  // Server status tracking
  let serverReady = false
  let serverCheckInProgress = false
  let serverCheckAttempted = false
  let retryCount = 0
  const MAX_RETRIES = 2

  // Reset function that can be called from components
  function resetServerCheck() {
    serverReady = false
    serverCheckInProgress = false
    serverCheckAttempted = false
    retryCount = 0
  }

  // Make reset function available on router instance
  Router.resetServerCheck = resetServerCheck

  async function checkServerStatus() {
    if (serverReady) return true
    console.log('[Router] Checking server status...')
    try {
      const response = await axiosInstance.get(`/${process.env.VUE_APP_SERVER_CHECK}`)
      const unitsData = response.data
      serverReady = Array.isArray(unitsData) && unitsData.length > 0
      if (serverReady) retryCount = 0 // Reset counter on success
      return serverReady
    } catch (error) {
      console.error('[Router] Server check failed:', error)
      retryCount++
      return false
    }
  }

  Router.beforeEach(async (to, from, next) => {
    // Skip checks for loading pages and 404
    if (to.path === '/loading' || to.path === '/quick-load' || to.path === '/404') {
      return next()
    }

    // Quick load screen before server check (only if not retried and not ready)
    if (!serverReady && !serverCheckInProgress && !serverCheckAttempted) {
      serverCheckAttempted = true
      return next({
        path: '/quick-load',
        query: { redirect: to.fullPath }
      })
    }

    // First check server status if not already ready
    if (!serverReady && !serverCheckInProgress) {
      serverCheckInProgress = true
      const isServerUp = await checkServerStatus()
      serverCheckInProgress = false

      if (!isServerUp) {
        // If max retries reached, go to 404
        if (retryCount >= MAX_RETRIES) {
          serverReady = true // Prevent further checks
          return next('/404')
        }

        // First failure - go to loading page with retry flag
        return next({
          path: '/loading',
          query: {
            redirect: to.fullPath,
            retry: true
          }
        })
      }
      serverReady = true
    }

    // Handle special routes
    switch (to.path) {
      case '/verify-email':
      case '/reset-password':
        if (!to.query.token) {
          return next('/')
        }
        break
      case '/resend-verification':
        if (from.path !== '/verify-email') {
          return next('/')
        }
        break
    }

    next()
  })

  return Router
})
