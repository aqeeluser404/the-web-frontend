import Helper from 'src/services/helper/utils';

// ============================================================
// ROUTE DEFINITIONS
// ============================================================

const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      // ==========================================================
      // PUBLIC ROUTES
      // ==========================================================

      // Home
      { path: '', component: () => import('pages/public/HomePage.vue') },
      { path: 'home', redirect: '/' },

      // Information
      {
        path: '/frequently-asked-questions',
        component: () => import('src/pages/public/FaqsPage.vue')
      },
      {
        path: '/fees',
        component: () => import('src/pages/public/FeesPage.vue')
      },
      {
        path: '/install-app',
        component: () => import('src/pages/public/InstallApp.vue')
      },

      // ==========================================================
      // AUTHENTICATION ROUTES
      // ==========================================================

      // Login & Registration
      {
        path: '/auth/login',
        component: () => import('pages/auth/LoginPage.vue')
      },
      {
        path: '/auth/register',
        component: () => import('pages/auth/RegisterPage.vue')
      },

      // Admin Authentication
      {
        path: '/admin/auth/login',
        component: () => import('pages/auth/AdminLoginPage.vue'),
        beforeEnter: Helper.beforeRouteEnterAdmin
      },

      // Password Management
      {
        path: '/forgot-password',
        component: () => import('src/pages/email/auth/ForgotPasswordPage.vue')
      },
      {
        path: '/reset-password',
        component: () => import('pages/email/auth/ResetPasswordPage.vue')
      },

      // Email Verification
      {
        path: '/verify-email',
        component: () => import('src/pages/email/auth/VerifyEmailPage.vue')
      },
      {
        path: '/resend-verification',
        component: () => import('src/pages/email/auth/ResendVerificationEmailPage.vue')
      },

      // Lease & Application
      {
        path: '/lease-signed',
        component: () => import('src/pages/email/form/LeaseApplicaionSuccessPage.vue')
      },
      {
        path: '/digital-application',
        name: 'DigitalApplication',
        component: () => import('pages/email/form/DigitalApplicationFormPage.vue')
      },

      // ==========================================================
      // USER ROUTES (Role: User)
      // ==========================================================

      // Units
      {
        path: '/units/apply',
        component: () => import('src/pages/user/dashboards/UnitDashboardPage.vue')
      },
      {
        path: '/units/apply/floor/:floor',
        component: () => import('src/pages/user/dashboards/UnitFloorPage.vue')
      },

      // Profile & Applications
      {
        path: '/user/profile',
        component: () => import('src/pages/user/profile/UserProfilePage.vue'),
        beforeEnter: Helper.beforeRouteEnterUser
      },
      {
        path: '/user/applications',
        component: () => import('src/pages/user/applications/UserApplicationsPage.vue'),
        beforeEnter: Helper.beforeRouteEnterUser
      },
      {
        path: '/user/applications/view/:id',
        component: () => import('src/pages/user/applications/UserApplicationsDetailsPage.vue'),
        beforeEnter: Helper.beforeRouteEnterUser
      },

      // Bookings
      {
        path: '/user/call-log',
        component: () => import('src/pages/user/bookings/calllog/UserLogCallPage.vue'),
        beforeEnter: Helper.beforeRouteEnterUser
      },
      {
        path: '/user/shuttle-booking',
        component: () => import('src/pages/user/bookings/shuttle/UserShuttleBooking.vue'),
        beforeEnter: Helper.beforeRouteEnterUser
      },
      {
        path: '/user/visitor-booking',
        component: () => import('src/pages/user/bookings/visitor/UserVisitorBooking.vue'),
        beforeEnter: Helper.beforeRouteEnterUser
      },

      // ==========================================================
      // VENDOR ROUTES (Role: Vendor)
      // ==========================================================

      {
        path: '/vendor',
        component: () => import('src/pages/vendor/VendorDashPage.vue'),
        beforeEnter: Helper.beforeRouteEnterVendor
      },
      {
        path: '/vendor/call-log',
        component: () => import('src/pages/vendor/VendorCallLogPage.vue'),
        beforeEnter: Helper.beforeRouteEnterVendor
      },

      // ==========================================================
      // ADMIN ROUTES (Role: Admin)
      // ==========================================================

      // Dashboard
      {
        path: '/admin',
        component: () => import('src/pages/admin/AdminDashPage.vue'),
        beforeEnter: Helper.beforeRouteEnterAdmin
      },

      // User Management
      {
        path: '/admin/users',
        component: () => import('src/pages/admin/AdminUsersCard.vue'),
        beforeEnter: Helper.beforeRouteEnterAdmin
      },
      {
        path: '/admin/users/view/:id',
        component: () => import('src/pages/admin/AdminUserDetailsPage.vue'),
        beforeEnter: Helper.beforeRouteEnterAdmin
      },

      // Rental Management
      {
        path: '/admin/rentals',
        component: () => import('src/pages/admin/AdminRentalsCard.vue'),
        beforeEnter: Helper.beforeRouteEnterAdmin
      },
      {
        path: '/admin/rentals/clean',
        component: () => import('src/pages/admin/AdminRentalCleanPage.vue'),
        beforeEnter: Helper.beforeRouteEnterAdmin
      },
      {
        path: '/admin/rentals/view/:id',
        component: () => import('src/pages/admin/AdminRentalApprovalsPage.vue'),
        beforeEnter: Helper.beforeRouteEnterAdmin
      },

      // Unit Management
      {
        path: '/admin/units',
        component: () => import('src/pages/admin/AdminUnitsCard.vue'),
        beforeEnter: Helper.beforeRouteEnterAdmin
      },

      // Call Log Management
      {
        path: '/admin/call-log',
        component: () => import('src/pages/admin/AdminCallLogPage.vue'),
        beforeEnter: Helper.beforeRouteEnterAdmin
      },

      // Shuttle Booking Management
      {
        path: '/admin/shuttle-booking',
        component: () => import('src/pages/admin/AdminShuttleBooking.vue'),
        beforeEnter: Helper.beforeRouteEnterAdmin
      },

      // Visitor Booking Management
      {
        path: '/admin/visitor-booking',
        component: () => import('src/pages/admin/AdminVisitorBooking.vue'),
        beforeEnter: Helper.beforeRouteEnterAdmin
      },

      // Incident Management
      {
        path: '/admin/incidents',
        component: () => import('src/pages/admin/AdminIncidentPage.vue'),
        beforeEnter: Helper.beforeRouteEnterAdmin
      },

      // QR Scanning
      {
        path: '/scan',
        component: () => import('src/pages/admin/DriverQRScanPage.vue'),
        beforeEnter: Helper.beforeRouteEnterAdmin
      },
      {
        path: '/security/scan',
        component: () => import('src/pages/admin/SecurityQRScanPage.vue'),
        beforeEnter: Helper.beforeRouteEnterAdmin
      },
    ]
  },

  // ============================================================
  // CATCH-ALL 404 ROUTE
  // ============================================================

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/public/ErrorNotFound.vue')
  }
]

export default routes

// ============================================================
// COMMENTED OUT ROUTES (Keep for reference)
// ============================================================

// { path: "/auth/otp-verification", component: () => import("pages/auth/implement/OtpPage.vue") },
