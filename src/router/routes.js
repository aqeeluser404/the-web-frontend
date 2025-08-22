import Helper from 'src/services/utils'

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/HomePage.vue') },
      { path: "/frequently-asked-questions", component: () => import("src/pages/FaqsPage.vue"), },

      { path: "/incident-report", component: () => import("src/pages/tabs/IncidentReportPage.vue"), },
      { path: "/resources", component: () => import("src/pages/tabs/ResourcesPage.vue"), },
      { path: "/developer", component: () => import("src/pages/tabs/DeveloperPage.vue"), },
      { path: "/fees", component: () => import("src/pages/tabs/FeesPage.vue"), },
      { path: "/history", component: () => import("src/pages/tabs/HistoryPage.vue"), },

      { path: "/applications", component: () => import("src/pages/tabs/ApplicationsPage.vue"), },

      // user authority routes--------------------------------------------------------------------------------------------------------------------

      { path: '/units/apply', component: () => import('src/pages/user/UnitDashboardPage.vue') },
      { path: '/units/apply/floor/:floor', component: () => import('src/pages/user/UnitFloorPage.vue')},

      { path: '/user/profile', component: () => import('src/pages/user/UserProfilePage.vue'), beforeEnter: Helper.beforeRouteEnterUser },            // user profile page (update and view), documents
      { path: '/user/applications', component: () => import('src/pages/user/UserApplicationsPage.vue'), beforeEnter: Helper.beforeRouteEnterUser },  // user applications page
      { path: '/user/call-log', component: () => import('src/pages/user/UserLogCallPage.vue'), beforeEnter: Helper.beforeRouteEnterUser },  // user applications page

      { path: '/vendor', component: () => import('src/pages/vendor/VendorDashPage.vue'), beforeEnter: Helper.beforeRouteEnterVendor },
      { path: '/vendor/call-log', component: () => import('src/pages/vendor/VendorCallLogPage.vue'), beforeEnter: Helper.beforeRouteEnterVendor },

      // admin authority routes-------------------------------------------------------------------------------------------------------------------

      // dashboard
      { path: '/admin', component: () => import('src/pages/admin/AdminDashPage.vue'), beforeEnter: Helper.beforeRouteEnterAdmin },

      // user management
      { path: '/admin/users', component: () => import('src/pages/admin/AdminUsersCard.vue'), beforeEnter: Helper.beforeRouteEnterAdmin },
      { path: '/admin/users/view/:id', component: () => import('src/pages/admin/AdminUserDetailsPage.vue'), beforeEnter: Helper.beforeRouteEnterAdmin },

      // rental management
      { path: '/admin/rentals', component: () => import('src/pages/admin/AdminRentalsCard.vue'), beforeEnter: Helper.beforeRouteEnterAdmin },
      { path: '/admin/rentals/view/:id', component: () => import('src/pages/admin/AdminRentalApprovalsPage.vue'), beforeEnter: Helper.beforeRouteEnterAdmin },

      // unit management
      { path: '/admin/units', component: () => import('src/pages/admin/AdminUnitsCard.vue'), beforeEnter: Helper.beforeRouteEnterAdmin },

      // call log management
      { path: '/admin/call-log', component: () => import('src/pages/admin/AdminCallLogPage.vue'), beforeEnter: Helper.beforeRouteEnterAdmin },

      // incident management
      { path: '/admin/incidents', component: () => import('src/pages/admin/AdminIncidentPage.vue'), beforeEnter: Helper.beforeRouteEnterAdmin },

      // authentication routes-------------------------------------------------------------------------------------------------------------------

      { path: "/auth/login", component: () => import("pages/auth/LoginPage.vue"), },
      { path: "/auth/register", component: () => import("pages/auth/RegisterPage.vue"), },

      { path: '/forgot-password', component: () => import('src/pages/email/ForgotPasswordPage.vue') },
      { path: '/reset-password', component: () => import('pages/email/ResetPasswordPage.vue') },

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
