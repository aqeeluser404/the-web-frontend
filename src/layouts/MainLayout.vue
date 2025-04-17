<template>
  <q-layout view="hHh lpR fff">
    <q-header class="bg-white flex" :style="{ height: headerHeight }"
      v-if="
        $route.path !== '/auth/login' &&
        $route.path !== '/auth/register' &&
        $route.path !== '/verify-email' &&
        $route.path !== '/resend-verification' &&
        $route.path !== '/reset-password' &&
        $route.path !== '/forgot-password'
        // $route.path !== '/admin/dashboard'
      "
    >
      <q-toolbar class="q-px-lg text-black row items-center justify-between">

        <!-- title and avatar -->
        <q-toolbar-title class="col-md-4 row items-center ">
          <router-link to="/">
            <img
              :src="logoSrc"
              alt="Home"
              style="width: 20%; cursor: pointer;"
            >
          </router-link>
        </q-toolbar-title>

        <div class="col-md-8">
          <!----------------------------------------------------------- NAV SECTION -------------------------------------------------->
          <!-- Desktop nav -->
          <div class="row justify-end items-center">
            <q-btn
              to="/"
              class="custom-button q-py-sm large-screen-only"
              label="Home" flat rounded />

            <q-btn
              v-if="$route.path === '/'"
              @click="scrollToSection('amenities-section')"
              class="custom-button q-py-sm large-screen-only"
              label="Amenities" flat rounded />

            <q-btn
              v-if="$route.path === '/'"
              @click="scrollToSection('images-section')"
              class="custom-button q-py-sm large-screen-only"
              label="Images" flat rounded />

            <q-btn
              v-if="$route.path === '/'"
              @click="scrollToSection('academics-section')"
              class="custom-button q-py-sm large-screen-only"
              label="Academics" flat rounded />

            <q-btn
              v-if="$route.path === '/'"
              @click="scrollToSection('units-section')"
              class="custom-button q-py-sm large-screen-only"
              label="Units" flat rounded />

            <q-btn
              v-if="$route.path === '/'"
              @click="scrollToSection('contact-section')"
              class="custom-button q-py-sm large-screen-only"
              label="Contact" flat rounded />

            <!-- dashboards -->
            <q-btn
              v-if="userDetails && userDetails.userType != null && (userDetails.userType == 'admin' || userDetails.userType == 'user')"
              @click="openDash"
              class="custom-button q-py-sm large-screen-only"
              label="Book Now" flat rounded />
            <q-btn
              v-if="isRouteMatch(['/units/apply', '/user/profile', '/user/applications', '/user/call-log'])"
              to="/user/profile"
              class="custom-button q-py-sm large-screen-only"
              label="User Profile" flat rounded />
            <q-btn
              v-if="isRouteMatch(['/units/apply', '/user/profile', '/user/applications', '/user/call-log'])"
              to="/user/applications"
              class="custom-button q-py-sm large-screen-only"
              label="Application History" flat rounded />
            <q-btn
              v-if="isRouteMatch(['/units/apply', '/user/profile', '/user/applications', '/user/call-log'])"
              to="/user/call-log"
              class="custom-button q-py-sm large-screen-only"
              label="Log A Call" flat rounded />
            <q-btn
              v-if="userDetails && userDetails.userType != null && userDetails.userType == 'admin'"
              to="/admin"
              class="custom-button q-py-sm large-screen-only"
              icon="eva-pie-chart-outline" label="Admin" flat rounded />

            <!-- authentication -->
            <CustomButton
              v-if="!isLoggedIn"
              label="Login"
              to="/auth/login"
              color="brown"
              class="large-screen-only q-ml-md"
              :customStyle="{ width: 'fit-content' }"
            />
            <CustomButton
              v-else
              label="Logout"
              @click="logout"
              color="brown"
              class="large-screen-only q-ml-md"
              :customStyle="{ width: 'fit-content' }"
            />
          </div>

          <!-- Mobile nav -->
          <q-btn-dropdown class="small-screen-only" dropdown-icon="menu" flat>
            <q-list style="width: 200px;">
              <q-item clickable v-close-popup to="/">
                <q-item-section class="">Home</q-item-section>
              </q-item>
              <q-item clickable v-close-popup v-if="$route.path === '/'">
                <q-item-section class="" @click="scrollToSection('amenities-section')">Amenities</q-item-section>
              </q-item>
              <q-item clickable v-close-popup v-if="$route.path === '/'">
                <q-item-section class="" @click="scrollToSection('images-section')">Images</q-item-section>
              </q-item>
              <q-item clickable v-close-popup v-if="$route.path === '/'">
                <q-item-section class="" @click="scrollToSection('academics-section')">Academics</q-item-section>
              </q-item>
              <q-item clickable v-close-popup v-if="$route.path === '/'">
                <q-item-section class="" @click="scrollToSection('units-section')">Units</q-item-section>
              </q-item>
              <q-item clickable v-close-popup v-if="$route.path === '/'">
                <q-item-section class="" @click="scrollToSection('contact-section')">Contact</q-item-section>
              </q-item>

              <!-- authentication -->
              <q-item clickable v-close-popup @click="openDash" v-if="userDetails && userDetails.userType != null && (userDetails.userType == 'admin' || userDetails.userType == 'user')">
                <q-item-section class="">Book Now</q-item-section>
              </q-item>
              <q-item clickable v-close-popup to="/user/profile" v-if="isRouteMatch(['/units/apply', '/user/profile', '/user/applications', '/user/call-log'])">
                <q-item-section class="">User Profile</q-item-section>
              </q-item>
              <q-item clickable v-close-popup to="/user/applications" v-if="isRouteMatch(['/units/apply', '/user/profile', '/user/applications', '/user/call-log'])">
                <q-item-section class="">Application History</q-item-section>
              </q-item>
              <q-item clickable v-close-popup to='/user/call-log' v-if="isRouteMatch(['/units/apply', '/user/profile', '/user/applications', '/user/call-log'])">
                <q-item-section class="">Log A Call</q-item-section>
              </q-item>

              <q-item clickable v-close-popup to="/admin" v-if="userDetails && userDetails.userType != null && userDetails.userType == 'admin'">
                <q-item-section class="">Admin Dashboard</q-item-section>
              </q-item>
              <q-item clickable v-close-popup to="/auth/login" v-if="!isLoggedIn">
                <q-item-section class="">Login</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="logout" v-else>
                <q-item-section class="">Logout</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-toolbar>

      <!-- breadcrumbs -->
      <div v-if="isAdminRoute">
        <div class="text-black text-caption">
          <q-toolbar class="q-px-lg">
            <q-breadcrumbs flat active-color="black">
              <q-breadcrumbs-el v-if="$route.path.includes('/admin')" label="Admin" to="/admin" icon="home" />

              <q-breadcrumbs-el v-if="$route.path.includes('/admin/users')" label="User Administration" to="/admin/users" icon="eva-people-outline" />
              <q-breadcrumbs-el v-if="$route.path.includes('/admin/users/view/')" label="User Details" icon="eva-person" />

              <q-breadcrumbs-el v-if="$route.path.includes('/admin/units')" label="Unit Administration" icon="eva-home-outline" />

              <q-breadcrumbs-el v-if="$route.path.includes('/admin/rentals')" label="Rental Administration" to="/admin/rentals" icon="eva-briefcase-outline" />
              <q-breadcrumbs-el v-if="$route.path.includes('/admin/rentals/view/')" label="Rental Details" icon="eva-briefcase" />

              <q-breadcrumbs-el v-if="$route.path.includes('/admin/call-log')" label="Call Log Administration" icon="eva-settings-outline" />
            </q-breadcrumbs>
          </q-toolbar>
        </div>
      </div>

    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import theWebLogo from '../assets/resources/logos/navLogo.png'

import UserService from 'src/services/UserService'
import Helper from 'src/services/utils'
import CustomButton from 'src/components/elements/CustomButton.vue'

export default {
  data() {
    return {
      userDetails: {
        _id: '',
        username: '',
        userType: ''
      },
      isLoggedIn: false,
      burgerMenuShown: false,

      logoSrc: theWebLogo,
    }
  },
  components: {
    CustomButton,
  },
  computed: {
    headerHeight() {
      return this.isAdminRoute ? '20vh' : '10vh';
    },
    isAdminRoute() {
      return this.$route.path.startsWith('/admin')
    },
  },
  mounted() {
    this.checkLoginStatus()
  },
  watch: {
    '$route'() {
      this.checkLoginStatus()
    },
  },
  methods: {
    isRouteMatch(paths) {
      return paths.includes(this.$route.path);
    },
    scrollToSection(sectionId) {
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = window.innerHeight * 0.1; // 10vh
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    },
    async checkLoginStatus() {
      const isLoggedIn = await Helper.checkCookie()
      if (isLoggedIn) {
        const token = await Helper.getCookie('token')

        if (token) {
          try {
            // Check if the token is still valid and fetch user details
            const user = await UserService.FindUserByToken();
            const userDetails = await UserService.findUserById(user._id);

            // Compare tokens to detect if the user logged in from another browser
            if (token === userDetails.loginInfo.loginToken) {
              this.isLoggedIn = true;
              this.fetchUserDetails();
            } else {
              // If tokens do not match, handle logout
              this.isLoggedIn = false;
              this.handleLogout();
            }
          } catch (error) {
            console.error('Error checking login status:', error);
            this.isLoggedIn = false;
            this.handleLogout();
          }
        } else {
          this.isLoggedIn = false;
          this.handleLogout();
        }
      }
    },
    handleLogout() {
      Helper.removeCookie('token')
      this.$router.push('/')
    },
    async logout() {
      this.$q.dialog({
        title: 'Logout', message: `You are about to logout, continue?`, color: 'primary', cancel: true, persistent: true
      }).onOk(async () => {
        const response = await UserService.logout(this.userDetails._id)
        if (response) {
          this.$q.notify({ type: 'positive', color: 'primary', message: 'You have successfully logged out!' })
          this.$router.push('/')
          this.isLoggedIn = false
          window.location.reload()
        } else {
          this.$q.notify({ type: 'negative', message: 'Logout failed. Please try again.' })
        }
      })
    },
    async fetchUserDetails() {
      const response = await UserService.FindUserByToken()
      this.userDetails = response
    },
    async openDash() {
      if (this.isLoggedIn == true) {
        this.$router.push('/units/apply')
      } else {
        this.$q.notify({ type: 'negative', message: 'Please login to continue.' })
      }
    },
  }
}
</script>

<style lang="sass">


.full-width
  width: 100%
</style>
