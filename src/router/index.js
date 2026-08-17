import { route } from 'quasar/wrappers'
import { createRouter, createMemoryHistory, createWebHistory, createWebHashHistory } from 'vue-router'
import routes from './routes'
import axiosInstance from 'src/services/api/axiosInstance'
import Helper from 'src/services/helper/utils'
import UserService from 'src/services/api/UserService'
import { Capacitor } from '@capacitor/core'

// TEST MOBILE APP VIEW
// Capacitor.isNativePlatform = () => true

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

  // Existing health-check guard — unchanged
  Router.beforeEach(async (to, from, next) => {
    try {
      const response = await axiosInstance.get('/health');
      if (response.status === 200) {
        switch (to.path) {
          case '/verify-email':
          case '/reset-password': {
            const token = to.query.token;
            if (token) {
              next();
            } else {
              next({ path: '/404' });
            }
            break;
          }
          case 'DigitalApplication': {
            const userId = to.query.userId;
            if (userId) {
              next();
            } else {
              next({ path: '/404' });
            }
            break;
          }
          case '/resend-verification':
            if (from.path === '/verify-email') {
              next();
            } else {
              next({ path: '/404' });
            }
            break;
          case '/404':
            next('/');
            break;
          default:
            next();
        }
      }
    } catch (error) {
      next(to.path !== '/404' ? '/404' : undefined);
    }
  });

 // NEW — native mobile app cold-start only: force login before first render
  let hasCheckedInitialAuth = false

  Router.beforeEach(async (to, from, next) => {
    if (!Capacitor.isNativePlatform() || hasCheckedInitialAuth) {
      return next()
    }

    hasCheckedInitialAuth = true

    try {
      const valid = await Helper.checkCookie()
      console.log('[auth-guard] checkCookie:', valid)

      const token = valid ? await Helper.getCookie('token') : null
      console.log('[auth-guard] token present:', !!token)

      if (!token) {
        return next({ path: '/auth/login', replace: true })
      }

      const user = await UserService.FindUserByToken()
      const userDetails = await UserService.findUserById(user._id)

      if (token !== userDetails.loginInfo.loginToken) {
        Helper.removeCookie('token')
        return next({ path: '/auth/login', replace: true })
      }

      return next()
    } catch (error) {
      console.error('[auth-guard] error, falling back to login:', error)
      return next({ path: '/auth/login', replace: true })
    }
  })

  return Router;
});

// Router.beforeEach(async (to, from, next) => {
//   try {
//     const response = await axiosInstance.get('/health');
//     if (response.status === 200) {
//       // Public routes that should always be accessible
//       const publicPaths = [
//         "/",
//         "/verify-email",
//         "/reset-password",
//         "/resend-verification",
//         "/404",
//         "/auth/login", // <-- add your public units page here
//         "/auth/register",
//         "/units/apply",
//         '/units/apply/floor/:floor',
//       ];

//       if (publicPaths.includes(to.path)) {
//         return next();
//       }

//       switch (to.path) {
//         case "/verify-email":
//         case "/reset-password": {
//           const token = to.query.token;
//           if (token) {
//             return next();
//           } else {
//             return next({ path: "/404" });
//           }
//         }

//         case "/resend-verification":
//           if (from.path === "/verify-email") {
//             return next();
//           } else {
//             return next({ path: "/404" });
//           }

//         case "/404":
//           return next("/");

//         default:
//           // Only check login for protected routes
//           const user = await Helper.checkLoginStatus(Router);

//           if (user) {
//             // Role-based checks
//             if (to.path.startsWith("/vendor") && user.userType !== "vendor") {
//               return next({ path: "/" });
//             }
//             if (to.path.startsWith("/admin") && user.userType !== "admin") {
//               return next({ path: "/" });
//             }
//             if (to.path.startsWith("/user") && user.userType !== "user") {
//               return next({ path: "/" });
//             }

//             return next();
//           } else {
//             // If not logged in, send to login only if route is protected
//             return next({ path: "/" });
//           }
//       }
//     } else {
//       return next({ path: "/404" });
//     }
//   } catch (error) {
//     console.error("Router guard error:", error);
//     return next(to.path !== "/404" ? "/404" : undefined);
//   }
// });
