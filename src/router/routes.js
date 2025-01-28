import Helper from 'src/services/utils'

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/HomePage.vue') },

      { path: '/units/apply', component: () => import('src/pages/user/UnitDashboardPage.vue'), beforeEnter: Helper.beforeRouteEnterUser },

      { path: '/user/profile', component: () => import('src/pages/user/UserProfilePage.vue'), beforeEnter: Helper.beforeRouteEnterUser },            // user profile page (update and view), documents
      { path: '/user/applications', component: () => import('src/pages/user/UserApplicationsPage.vue'), beforeEnter: Helper.beforeRouteEnterUser },  // user applications page

      { path: '/admin/dashboard', component: () => import('src/pages/admin/AdminDashPage.vue'), beforeRouteEnterAdmin: Helper.beforeRouteEnterAdmin },


      { path: "/auth/login", component: () => import("pages/auth/LoginPage.vue"), },
      { path: "/auth/register", component: () => import("pages/auth/RegisterPage.vue"), },

      { path: '/verify-email', component: () => import('src/pages/email/VerifyEmailPage.vue')},
      { path: '/resend-verification', component: () => import('src/pages/email/ResendVerificationEmailPage.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
