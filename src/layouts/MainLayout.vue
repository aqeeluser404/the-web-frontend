<template>
  <q-layout view="hHh lpR fff">
    <q-header class="bg-white flex" :style="{ height: headerHeight }"
      style="border-bottom: 1px solid #e0e0e0;" v-if="
        $route.path !== '/auth/login' &&
        $route.path !== '/auth/register' &&
        $route.path !== '/verify-email' &&
        $route.path !== '/resend-verification' &&
        $route.path !== '/reset-password' &&
        $route.path !== '/forgot-password' &&
        $route.path !== '/install-app'
      ">
      <q-toolbar class="text-black row items-center justify-between bg-white constrain-standard">

        <!-- title and avatar -->
        <q-toolbar-title class="col-md-4 row items-center">
          <router-link to="/" class="row items-center">
            <img :src="logoSrc" alt="Home" style="width: 40%; cursor: pointer;">
          </router-link>
        </q-toolbar-title>

        <div class="col-md-8">
          <!----------------------------------------------------------- NAV SECTION -------------------------------------------------->
          <!-- Desktop nav -->
          <div class="row justify-end items-center q-py-lg ">
            <q-btn to="/" class="custom-button q-py-sm large-screen-only" label="Home" flat rounded />

            <q-btn
              v-if="isRouteMatch(['/', '/frequently-asked-questions', '/developer', '/history', '/fees', '/applications', '/resources', '/incident-report'])"
              @click="scrollToSection('amenities-section')" class="custom-button q-py-sm large-screen-only"
              label="Amenities" flat rounded />

            <q-btn
              v-if="isRouteMatch(['/', '/frequently-asked-questions', '/developer', '/history', '/fees', '/applications', '/resources', '/incident-report'])"
              @click="scrollToSection('units-section')" class="custom-button q-py-sm large-screen-only" label="Units"
              flat rounded />

            <q-btn
              v-if="isRouteMatch(['/', '/frequently-asked-questions', '/developer', '/history', '/fees', '/applications', '/resources', '/incident-report'])"
              @click="scrollToSection('location-section')" class="custom-button q-py-sm large-screen-only"
              label="Location" flat rounded />

            <q-btn
              v-if="isRouteMatch(['/', '/frequently-asked-questions', '/developer', '/history', '/fees', '/applications', '/resources', '/incident-report'])"
              @click="scrollToSection('contact-section')" class="custom-button q-py-sm large-screen-only"
              label="Contact" flat rounded />

            <q-btn
              v-if="isRouteMatch(['/', '/frequently-asked-questions', '/developer', '/history', '/fees', '/applications', '/resources', '/incident-report'])"
              to="/frequently-asked-questions" class="custom-button q-py-sm large-screen-only" label="FAQs" flat
              rounded />

            <q-btn
              v-if="isRouteMatch(['/', '/frequently-asked-questions', '/developer', '/history', '/fees', '/applications', '/resources', '/incident-report'])"
              to="/fees" class="custom-button q-py-sm large-screen-only" label="Fees" flat rounded />

            <!-- dashboards -->
            <q-btn to="/units/apply/floor/1" class="custom-button q-py-sm large-screen-only" label="Book Now" flat rounded />
            <q-btn
              v-if="isLoggedIn && ($route.path.startsWith('/user/applications/view/') || isRouteMatch(['/units/apply/floor/1', '/units/apply/floor/2', '/units/apply/floor/3', '/units/apply', '/user/profile', '/user/applications', '/user/call-log']))"
              to="/user/profile" class="custom-button q-py-sm large-screen-only" label="User Profile" flat rounded />

            <q-btn
              v-if="isLoggedIn && ($route.path.startsWith('/user/applications/view/') || isRouteMatch(['/units/apply/floor/1', '/units/apply/floor/2', '/units/apply/floor/3', '/units/apply', '/user/profile', '/user/applications', '/user/call-log']))"
              to="/user/applications" class="custom-button q-py-sm large-screen-only" label="Application History" flat
              rounded />

            <q-btn
              v-if="isLoggedIn && ($route.path.startsWith('/user/applications/view/') || isRouteMatch(['/units/apply/floor/1', '/units/apply/floor/2', '/units/apply/floor/3', '/units/apply', '/user/profile', '/user/applications', '/user/call-log']))"
              to="/user/call-log" class="custom-button q-py-sm large-screen-only" label="Log A Call" flat rounded />

            <q-btn v-if="userDetails && userDetails.userType != null && userDetails.userType == 'admin'" to="/admin"
              class="custom-button q-py-sm large-screen-only" icon="eva-pie-chart-outline" label="Admin" flat rounded />

            <q-btn v-if="userDetails && userDetails.userType != null && userDetails.userType == 'vendor'" to="/vendor"
              class="custom-button q-py-sm large-screen-only" icon="eva-pie-chart-outline" label="Vendor" flat
              rounded />

            <!-- PHP CODE -->
            <!-- <q-btn v-if="userDetails && userDetails.userType != null && userDetails.userType == 'admin'"
              @click="downloadData()" class="custom-button q-py-sm large-screen-only" icon="eva-cloud-download-outline"
              flat rounded /> -->

            <!-- authentication -->
            <CustomButton v-if="!isLoggedIn" label="Login" to="/auth/login" class="large-screen-only q-ml-md"
              :customStyle="{ width: 'fit-content' }" />
            <CustomButton v-else label="Logout" @click="logout" class="large-screen-only q-ml-md"
              :customStyle="{ width: 'fit-content' }" />

            <q-btn-dropdown class="small-screen-only" dropdown-icon="menu" flat>
              <q-list style="width: 380px; padding: 8px;">
                <div class="two-column-list">

                  <div class="column q-pa-md" style="background-color: #f8f8f8;">
                    <q-item clickable v-close-popup to='/frequently-asked-questions'>
                      <q-item-section class="">FAQs</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup to="/fees">
                      <q-item-section>Fees</q-item-section>
                    </q-item>
                  </div>

                  <div class="column q-pa-md">
                    <q-item clickable v-close-popup to="/" :active-class="$route.path === '/' ? 'q-item--active' : ''">
                      <q-item-section class="" >Home</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup v-if="isRouteMatch(['/', '/frequently-asked-questions'])">
                      <q-item-section class="" @click="scrollToSection('amenities-section')">Amenities</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup v-if="isRouteMatch(['/', '/frequently-asked-questions'])">
                      <q-item-section class="" @click="scrollToSection('units-section')">Units</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup v-if="isRouteMatch(['/', '/frequently-asked-questions'])">
                      <q-item-section class="" @click="scrollToSection('location-section')">Location</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup v-if="isRouteMatch(['/', '/frequently-asked-questions'])">
                      <q-item-section class="" @click="scrollToSection('contact-section')">Contact</q-item-section>
                    </q-item>

                    <q-item clickable v-close-popup to="/units/apply/floor/1">
                      <q-item-section class="">Book Now</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup to="/user/profile"
                      v-if="isLoggedIn && ($route.path.startsWith('/user/applications/view/') || isRouteMatch(['/units/apply/floor/1', '/units/apply/floor/2', '/units/apply/floor/3', '/units/apply', '/user/profile', '/user/applications', '/user/call-log']))">
                      <q-item-section class="">User Profile</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup to="/user/applications"
                      v-if="isLoggedIn && ($route.path.startsWith('/user/applications/view/') || isRouteMatch(['/units/apply/floor/1', '/units/apply/floor/2', '/units/apply/floor/3', '/units/apply', '/user/profile', '/user/applications', '/user/call-log']))">
                      <q-item-section class="">Application History</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup to='/user/call-log'
                      v-if="isLoggedIn && ($route.path.startsWith('/user/applications/view/') || isRouteMatch(['/units/apply/floor/1', '/units/apply/floor/2', '/units/apply/floor/3', '/units/apply', '/user/profile', '/user/applications', '/user/call-log']))">
                      <q-item-section class="">Log A Call</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup to="/admin"
                      v-if="userDetails && userDetails.userType != null && userDetails.userType == 'admin'">
                      <q-item-section class="">Admin Dashboard</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup to="/vendor"
                      v-if="userDetails && userDetails.userType != null && userDetails.userType == 'vendor'">
                      <q-item-section class="">Vendor Dashboard</q-item-section>
                    </q-item>

                    <q-item clickable v-close-popup
                      v-if="userDetails && userDetails.userType != null && userDetails.userType == 'admin'">
                      <q-item-section class="" @click="downloadData()">Download Data</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup to="/auth/login" v-if="!isLoggedIn">
                      <q-item-section class="">Login</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="logout" v-else>
                      <q-item-section class="">Logout</q-item-section>
                    </q-item>
                  </div>
                </div>
              </q-list>
            </q-btn-dropdown>
          </div>
        </div>
      </q-toolbar>

      <MaintenanceBanner v-if="showMaintenanceBanner" class="full-width" />

      <!-- breadcrumbs -->
      <div v-if="isAdminRoute" class="full-width">
        <div class="text-black bg-white text-caption">
          <q-toolbar class="constrain-standard">
            <q-breadcrumbs flat active-color="black">
              <q-breadcrumbs-el v-if="$route.path.includes('/admin')" label="Admin" to="/admin" icon="home" />

              <q-breadcrumbs-el v-if="$route.path.includes('/admin/users')" label="User Administration"
                to="/admin/users" icon="eva-people-outline" />
              <q-breadcrumbs-el v-if="$route.path.includes('/admin/users/view/')" label="User Details"
                icon="eva-person" />

              <q-breadcrumbs-el v-if="$route.path.includes('/admin/units')" label="Unit Administration"
                icon="eva-home-outline" />

              <q-breadcrumbs-el v-if="$route.path.includes('/admin/rentals')" label="Rental Administration"
                to="/admin/rentals" icon="eva-briefcase-outline" />
              <q-breadcrumbs-el v-if="$route.path.includes('/admin/rentals/view/')" label="Rental Details"
                icon="eva-briefcase" />

              <q-breadcrumbs-el v-if="$route.path.includes('/admin/call-log')" label="Call Log Administration"
                icon="eva-settings-outline" />

              <q-breadcrumbs-el v-if="$route.path.includes('/admin/incidents')" label="Incident Administration"
                icon="eva-settings-outline" />
            </q-breadcrumbs>
          </q-toolbar>
        </div>
      </div>

      <!-- breadcrumbs -->
      <div v-if="isVendorRoute">
        <div class="text-black text-caption">
          <q-toolbar class="constrain-standard">
            <q-breadcrumbs flat active-color="black">
              <q-breadcrumbs-el v-if="$route.path.includes('/vendor')" label="Vendor" to="/vendor" icon="home" />
              <q-breadcrumbs-el v-if="$route.path.includes('/vendor/call-log')" label="Call Log Administration"
                icon="eva-settings-outline" />
            </q-breadcrumbs>
          </q-toolbar>
        </div>
      </div>
    </q-header>


    <q-card class="whats-app-box" style="" v-if="boxOpened">
      <q-card-section class="row justify-between items-start q-pa-md" style="background-color: #0B5E54; border-top-left-radius: 12px; border-top-right-radius: 12px;">
        <div class="col-md-2">
          <div class="justify-center row items-center logo-circle">
            <img :src="logoSrcBlack" alt="Home" class="logo-image"></img>
          </div>
        </div>
        <div class="col-md-7 text-white">
          <div class="text-h7"><b>The-WEB</b></div>
          <div class="text-caption">Business Account</div>
        </div>
        <q-btn class="" v-if="!isUserDetails" flat round icon="close" @click="toggleWhatsAppBox" size="md" color="white"
          aria-label="Close" />
      </q-card-section>

      <q-card-section class="q-pa-md" style="background-color: #E4DDD4;">
        <q-card class="whats-app-msg">
          <q-card-section>
            <div class="text-h7 text-grey-8"><b>The-WEB</b></div>
            <div class="text-caption">Hey, how can we help you?</div>
          </q-card-section>
        </q-card>
        <div class="section-spacer-sm"></div>
      </q-card-section>

      <div class="row justify-center items-center q-pa-md">
        <a href="https://wa.me/27774623613" target="_blank" style="text-decoration: none;" class="full-width">
          <CustomButton
            customStyle="width: 100%;"
            size="md"
            label="Start Chat"
            color="secondary"
          />
        </a>
      </div>
    </q-card>

    <q-btn rounded :label="!boxOpened ? 'Chat with us' : ''" color="secondary" text-color="white"
      icon="img:/assets/elements/whatsapp.png" size="lg" class="custom-button whats-app-btn-desktop" @click="toggleWhatsAppBox" />

    <q-btn rounded color="secondary" text-color="white"
      icon="img:/assets/elements/whatsapp.png" size="lg" class="custom-button whats-app-btn-mobile" @click="toggleWhatsAppBox" />

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import MaintenanceBanner from 'src/components/elements/MaintenanceBanner.vue';
import weblogo3d from '../assets/resources/logos/weblogo3d.png'
import web3dlogoBlack from '../assets/resources/logos/web3dlogoBlack.png'

import UserService from 'src/services/UserService'
import Helper from 'src/services/utils'
import CustomButton from 'src/components/elements/CustomButton.vue'
import ExportDataService from 'src/services/ExportDataService'

export default {
  data() {
    return {
      showMaintenanceBanner: false,
      userDetails: {
        _id: '',
        username: '',
        userType: ''
      },
      isLoggedIn: false,
      burgerMenuShown: false,

      logoSrc: weblogo3d,
      logoSrcBlack: web3dlogoBlack,
      boxOpened: false,
    }
  },
  components: {
    CustomButton,
    MaintenanceBanner
  },
  computed: {
    headerHeight() {
      const baseHeight = this.showMaintenanceBanner ? 150 : 75;
      const adminExtra = 50;

      return (this.isAdminRoute || this.isVendorRoute) ? baseHeight + adminExtra : baseHeight;
    },
    isAdminRoute() {
      return this.$route.path.startsWith('/admin')
    },
    isVendorRoute() {
      return this.$route.path.startsWith('/vendor')
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
    toggleWhatsAppBox() {
      this.boxOpened = !this.boxOpened
    },
    isRouteMatch(paths) {
      return paths.includes(this.$route.path);
    },
    scrollToSection(sectionId) {
      if (this.$route.path !== '/') {
        this.$router.push('/').then(() => {
          this.$nextTick(() => {
            setTimeout(() => {
              this.performScroll(sectionId);
            }, 300);
          });
        });
      } else {
        this.performScroll(sectionId);
      }
    },


    performScroll(sectionId) {
      const element = document.getElementById(sectionId);
      if (element) {
        const offset = window.innerHeight * 0.1;
        const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth',
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
          // this.$q.notify({ type: 'positive', color: 'primary', message: 'You have successfully logged out!' })

          this.$q.dialog({
            title: 'Success',
            message: 'You have successfully logged out!',
            color: 'primary',
            persistent: true,
          }).onOk(() => {
            this.$router.push('/');
            this.isLoggedIn = false
            window.location.reload()
          });

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
    // PHP CODE
    async downloadData() {
      this.$q.dialog({
        title: 'Download Data',
        message: 'You are about to export all data. Would you like to proceed?',
        color: 'primary',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        try {
          const today = new Date().toISOString().split('T')[0];

          const response = await ExportDataService.exportData();

          if (!response || !response.data) {
            throw new Error('Invalid response from server');
          }

          const blob = new Blob([response.data], { type: response.headers['content-type'] });
          const url = URL.createObjectURL(blob);
          const link = document.createElement('a');
          link.href = url;
          link.download = `mongo_export_${today}.xlsx`;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          setTimeout(() => URL.revokeObjectURL(url), 100);

        } catch (error) {
          this.$q.notify({
            type: 'negative',
            message: 'Export failed: ' + (error.message || 'Please try again')
          });
        }
      });
    }
  }
}
</script>

<style lang="sass">
.whats-app-btn-desktop
  position: fixed
  bottom: 20px
  right: 20px
  z-index: 1000
  @media (max-width: 768px)
    display: none
    bottom: 70px
    left: 20px
    margin: 0 auto
    width: 89%

.whats-app-btn-mobile
  display: none
  position: fixed
  bottom: 20px
  right: 20px
  z-index: 1000
  @media (max-width: 768px)
    display: block
    bottom: 10px
    // left: 20px
    margin: 0 auto
    width: 15%

.whats-app-box
  position: fixed
  bottom: 90px
  right: 20px
  z-index: 1000
  width: 100%
  max-width: 300px
  // height: 300px
  border-radius: 15px
  @media (max-width: 768px)
    border-radius: 25px
    right: 20px
    bottom: 70px
    margin: 0 auto
    max-width: 90%

.whats-app-msg
  width: 100%
  max-width: 300px
  border-radius: 15px
.whats-app-msg::after
  content: ''
  position: absolute
  top: 12px  // Adjust this to position vertically
  left: -10px  // Move it slightly outside the container
  width: 0
  height: 0
  border-top: 1px solid transparent
  border-bottom: 10px solid transparent
  border-right: 13px solid white  // Right border creates left-pointing triangle

.logo-circle
  width: 40px
  height: 40px
  border-radius: 50%
  background: white
  display: flex
  justify-content: center
  align-items: center
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)
  overflow: hidden // ensures image doesn't spill out

.logo-image
  width: 70%
  height: 80%
  object-fit: contain
  cursor: pointer

.secondary-nav
  height: 50px
  border-bottom: 1px solid #e0e0e0
  padding: 0 16px

.two-column-list
  display: flex
  gap: 8px
  box-sizing: border-box

.column
  flex: 1
  display: flex
  flex-direction: column
  gap: 8px
  box-sizing: border-box

.full-width
  width: 100%
</style>
