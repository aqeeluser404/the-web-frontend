import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
import axios from 'axios'

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default route(function (/* { store, ssrContext } */) {
  const createHistory = process.env.SERVER
    ? createMemoryHistory
    : (process.env.VUE_ROUTER_MODE === 'history' ? createWebHistory : createWebHashHistory)

  const Router = createRouter({
    scrollBehavior: () => ({ left: 0, top: 0 }),
    routes,

    // Leave this as is and make changes in quasar.conf.js instead!
    // quasar.conf.js -> build -> vueRouterMode
    // quasar.conf.js -> build -> publicPath
    history: createHistory(process.env.VUE_ROUTER_BASE)
  })

  Router.beforeEach(async (to, from, next) => {
    try {
      // const response = await axios.get(`https://the-web-backend.onrender.com/health`)
      const response = await axios.get(`${process.env.VUE_APP_API_BASE_URL}/health`)
      if (response.status === 200) {
        if (to.path === '/verify-email')  {
          const token = to.query.token
          if (token) {
            next()
          } else {
            next(({ path: '/404'}))
          }
        } else if (to.path === '/resend-verification') {
          if (from.path === '/verify-email') {
            next()
          } else {
            next(({ path: '/404'}))
          }
        } else if (to.path === '/reset-password') {
          const token = to.query.token
          if (token) {
            next()
          } else {
            next(({ path: '/404'}))
          }
        } else if (to.path === '/404') {
          next('/');
        } else {
          next();
        }
      }
    } catch (error) {
      // If the server is offline or an error occurs
      if (to.path !== '/404') {
        next('/404');
      } else {
        next();
      }
    }
  })

  return Router
})
