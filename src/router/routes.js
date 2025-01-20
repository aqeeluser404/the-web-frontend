const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/HomePage.vue') },
      { path: '/units', component: () => import('src/pages/units/UnitsPage.vue') },
      { path: '/user/profile', component: () => import('src/pages/user/UserProfilePage.vue') },
      { path: '/admin/dashboard', component: () => import('src/pages/admin/AdminDashPage.vue') },
      { path: "/auth/login", component: () => import("pages/auth/LoginPage.vue"), },
      { path: "/auth/register", component: () => import("pages/auth/RegisterPage.vue"), },

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
