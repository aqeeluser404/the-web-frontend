<template>
  <q-layout view="hHh lpR fff">
    <q-header class="bg-white flex" :style="{ height: headerHeight }" style="border-bottom: 1px solid #e0e0e0;" v-if="
      $route.path !== '/auth/login' &&
      $route.path !== '/auth/register' &&
      $route.path !== '/verify-email' &&
      $route.path !== '/resend-verification' &&
      $route.path !== '/reset-password' &&
      $route.path !== '/forgot-password' &&
      $route.path !== '/admin/auth/login' &&
      $route.path !== '/install-app'
    ">
      <q-toolbar class="text-black row items-center justify-between bg-white constrain-standard">

        <!-- title and avatar -->
        <q-toolbar-title class="col-md-3 row items-center">
          <router-link to="/" class="row items-center">
            <img :src="logoSrc" alt="Home" style="width: 40%; cursor: pointer;">
          </router-link>
        </q-toolbar-title>

        <div class="col-md-9">
          <!---------------------------------------------- DESKTOP NAV SECTION -------------------------------------------------->

          <div class="row justify-end items-center q-py-lg ">

            <!-- Home Icons -->
            <UniversalMenu :items="homeItems" :hover="true" class="large-screen-only" v-if="$route.path !== '/' && $route.path !== '/frequently-asked-questions' && $route.path !== '/fees'">
              <template #trigger>
                <q-btn flat label="Explore" class="custom-button q-py-sm q-px-md" />
              </template>
            </UniversalMenu>

            <div v-else class="row justify-end items-center">
              <q-btn to="/" class="custom-button q-py-sm large-screen-only" label="Home" flat />

              <q-btn @click="scrollToSection('amenities-section')"
                class="custom-button q-py-sm large-screen-only" label="Amenities" flat />

              <q-btn @click="scrollToSection('units-section')"
                class="custom-button q-py-sm large-screen-only" label="Units" flat />

              <q-btn @click="scrollToSection('location-section')"
                class="custom-button q-py-sm large-screen-only" label="Location" flat />

              <q-btn @click="scrollToSection('contact-section')"
                class="custom-button q-py-sm large-screen-only" label="Contact" flat />

              <q-btn to="/frequently-asked-questions"
                class="custom-button q-py-sm large-screen-only" label="FAQs" flat />

              <q-btn to="/fees" class="custom-button q-py-sm large-screen-only" label="Fees"
                flat />

              <q-btn @click="downloadApk" class="custom-button q-py-sm large-screen-only" label="Download App"
                flat />
            </div>

            <!-- Book Icons -->
            <UniversalMenu :items="bookItems" :hover="true" class="large-screen-only">
              <template #trigger>
                <q-btn flat label="Book Now" class="custom-button q-py-sm q-px-md" />
              </template>
            </UniversalMenu>

            <!-- Accounts Icons -->
            <UniversalMenu :items="accountItems" :hover="true" class="large-screen-only" v-show="isLoggedIn">
              <template #trigger>
                <q-btn flat label="Account" class="custom-button q-py-sm q-px-md" />
              </template>
            </UniversalMenu>

            <!-- Admin Icons -->
            <UniversalMenu :items="adminItems" :hover="true" class="large-screen-only" v-show="isLoggedIn && isAdminUser">
              <template #trigger>
                <q-btn flat label="Administration" class="custom-button q-py-sm q-px-md" />
              </template>
            </UniversalMenu>

            <!-- authentication -->
            <CustomButton v-if="!isLoggedIn" label="Login" to="/auth/login" class="large-screen-only q-ml-md"
              :customStyle="{ width: 'fit-content' }" />
            <CustomButton v-else label="Logout" @click="logout" class="large-screen-only q-ml-md"
              :customStyle="{ width: 'fit-content' }" />

            <!---------------------------------------------- MOBILE NAV SECTION -------------------------------------------------->
            <q-btn-dropdown class="small-screen-only" dropdown-icon="menu" flat>
              <q-list style="width: 380px; padding: 8px;">
                <div class="two-column-list">

                  <div class="column wide q-pa-md" style="background-color: #f8f8f8;">

                    <!-- Home Icons -->
                    <QListItems
                      :noPadding="false"
                      :items="homeItemsMobile"
                      alignItems="left"
                      class="text-light"
                      :includeIcons="false"
                      :underline="true"
                    />

                    <!-- Book Icons -->
                    <QListItems
                      :noPadding="false"
                      :items="bookItemsMobile"
                      alignItems="left"
                      class="text-light"
                      :includeIcons="false"
                      :underline="true"
                    />

                    <!-- Account Icons -->
                    <QListItems v-show="isLoggedIn"
                      :noPadding="false"
                      :items="accountItemsMobile"
                      alignItems="left"
                      class="text-light"
                      :includeIcons="false"
                      :underline="true"
                    />

                    <!-- Admin Icons -->
                    <QListItems v-show="isLoggedIn && isAdminUser"
                      :noPadding="false"
                      :items="adminItemsMobile"
                      alignItems="left"
                      class="text-light"
                      :includeIcons="false"
                      :underline="true"
                    />
                  </div>

                  <div class="column narrow q-pa-md">

                    <!-- Auth items -->
                    <q-item clickable v-close-popup to="/auth/login" v-if="!isLoggedIn">
                      <q-item-section>Login</q-item-section>
                    </q-item>
                    <q-item clickable v-close-popup @click="logout" v-else>
                      <q-item-section>Logout</q-item-section>
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
              <q-breadcrumbs-el
                v-for="(crumb, idx) in adminBreadcrumbs"
                :key="idx"
                :label="crumb.label"
                :to="crumb.to"
                :icon="crumb.icon"
              />
            </q-breadcrumbs>
          </q-toolbar>
        </div>
      </div>
    </q-header>


    <q-card class="whats-app-box" style="" v-if="boxOpened">
      <q-card-section class="row justify-between items-start q-pa-md"
        style="background-color: #0B5E54; border-top-left-radius: 12px; border-top-right-radius: 12px;">
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
          <CustomButton customStyle="width: 100%;" size="md" label="Start Chat" color="secondary" />
        </a>
      </div>
    </q-card>

    <q-btn v-if="!isAdminRoute" rounded :label="!boxOpened ? '' : ''" color="secondary" text-color="white"
      icon="img:/assets/elements/whatsapp.png" size="lg" class="custom-button whats-app-btn-desktop"
      @click="toggleWhatsAppBox" />
    <q-btn v-if="!isAdminRoute" rounded color="secondary" text-color="white" icon="img:/assets/elements/whatsapp.png"
      size="lg" class="custom-button whats-app-btn-mobile" @click="toggleWhatsAppBox" />
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import UniversalMenu from 'src/components/elements/UniversalMenu.vue';
import QListItems from 'src/components/elements/QListItems.vue';

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

      homeItems: [
        { label: 'Home', to: '/' },
        { label: 'Amenities', handler: () => this.scrollToSection('amenities-section') },
        { label: 'Units', handler: () => this.scrollToSection('units-section') },
        { label: 'Location', handler: () => this.scrollToSection('location-section') },
        { label: 'Contact', handler: () => this.scrollToSection('contact-section') },
        { label: 'FAQs', to: '/frequently-asked-questions' },
        { label: 'Fees', to: '/fees' },
        { label: 'Download App', click: this.downloadApk }
      ],
      homeItemsMobile: [
        {
          label: 'Explore',
          isMenuGroup: true,
          // icon: 'explore',
          children: [
            { label: 'Home', to: '/' },
            { label: 'Amenities', handler: () => this.scrollToSection('amenities-section') },
            { label: 'Units', handler: () => this.scrollToSection('units-section') },
            { label: 'Location', handler: () => this.scrollToSection('location-section') },
            { label: 'Contact', handler: () => this.scrollToSection('contact-section') },
            { label: 'FAQs', to: '/frequently-asked-questions' },
            { label: 'Fees', to: '/fees' },
            { label: 'Download App', click: this.downloadApk }
          ]
        },
      ]
    }
  },
  components: { CustomButton, MaintenanceBanner, UniversalMenu, QListItems },

  computed: {
    bookItems() {
      const items = [{ label: 'Book a Unit', to: '/units/apply/floor/1' }]
      if (this.isLoggedIn) {
        items.push(
          { label: 'Shuttle Booking', to: '/user/shuttle-booking' },
          { label: 'Visitor Booking', to: '/user/visitor-booking' }
        )
      }
      return items
    },
    bookItemsMobile() {
      const children = [
        { label: 'Book a Unit', to: '/units/apply/floor/1' }
      ]
      if (this.isLoggedIn) {
        children.push(
          { label: 'Shuttle Booking', to: '/user/shuttle-booking' },
          { label: 'Visitor Booking', to: '/user/visitor-booking' }
        )
      }
      return [
        {
          label: 'Book Now',
          isMenuGroup: true,
          // icon: 'event', // optional icon if we want one
          children
        }
      ]
    },
    accountItems() {
      const children = []
      if (this.isLoggedIn) {
        children.push(
          { label: 'My Profile', to: '/user/profile' },
          { label: 'Application History', to: '/user/applications' },
          { label: 'Log a call', to: '/user/call-log' }
        )
      }
      return children
    },
    accountItemsMobile() {
      const children = []
      if (this.isLoggedIn) {
        children.push(
          { label: 'My Profile', to: '/user/profile' },
          { label: 'Application History', to: '/user/applications' },
          { label: 'Log A Call', to: '/user/call-log' }
        )
      }
      return [
        {
          label: 'Account',
          isMenuGroup: true,
          // icon: 'event', // optional icon if we want one
          children
        }
      ]
    },
    adminItems() {
      const children = []

      if (this.isLoggedIn && this.userDetails?.userType === 'admin') {
        // Always show Admin Portal
        children.push({
          label: this.portalName,
          to: '/admin',
          // icon: 'eva-pie-chart-outline'
        })

        // Driver-specific
        if (this.userDetails.rightsType === 'Driver' || this.userDetails?.username === 'admin') {
          children.push({
            label: 'Driver Scanner',
            to: '/scan',
            // icon: 'qr_code_scanner'
          })
        }

        // Security-specific
        if (this.userDetails.rightsType === 'Security' || this.userDetails?.username === 'admin') {
          children.push({
            label: 'Security Scanner',
            to: '/security/scan',
            // icon: 'qr_code_scanner'
          })
        }
      }

      return children;
    },
    adminItemsMobile() {
      const children = []

      if (this.isLoggedIn && this.userDetails?.userType === 'admin') {

        // Always show Admin Portal
        children.push({
          label: this.portalName,
          to: '/admin',
          // icon: 'eva-pie-chart-outline'
        })

        // Driver-specific
        if (this.userDetails.rightsType === 'Driver' || this.userDetails?.username === 'admin') {
          children.push({
            label: 'Driver Scanner',
            to: '/scan',
            // icon: 'qr_code_scanner'
          })
        }

        // Security-specific
        if (this.userDetails.rightsType === 'Security' || this.userDetails?.username === 'admin') {
          children.push({
            label: 'Security Scanner',
            to: '/security/scan',
            // icon: 'qr_code_scanner'
          })
        }
      }

      return [
        {
          label: 'Administration',
          isMenuGroup: true,
          children
        }
      ]
    },

    adminBreadcrumbs() {
      const path = this.$route.path
      const crumbs = [
        { match: '/admin', label: 'Admin', to: '/admin', icon: 'home' },
        { match: '/admin/users', label: 'User Administration', to: '/admin/users', icon: 'eva-people-outline' },
        { match: '/admin/users/view/', label: 'User Details', icon: 'eva-person' },
        { match: '/admin/units', label: 'Unit Administration', icon: 'eva-home-outline' },
        { match: '/admin/rentals', label: 'Rental Administration', to: '/admin/rentals', icon: 'eva-briefcase-outline' },
        { match: '/admin/rentals/view/', label: 'Rental Details', icon: 'eva-briefcase' },
        { match: '/admin/call-log', label: 'Call Log Administration', icon: 'eva-settings-outline' },
        { match: '/admin/shuttle-booking', label: 'Shuttle Booking Administration', icon: 'eva-calendar-outline' },
        { match: '/admin/visitor-booking', label: 'Visitor Booking Administration', icon: 'eva-calendar-outline' },
        { match: '/admin/incidents', label: 'Incident Administration', icon: 'eva-settings-outline' }
      ]

      // Only return those that match the current route
      return crumbs.filter(c => path.includes(c.match))
    },

    headerHeight() {
      const baseHeight = this.showMaintenanceBanner ? 150 : 75;
      const adminExtra = 50;

      return (this.isAdminRoute) ? baseHeight + adminExtra : baseHeight;
      // return (this.isAdminRoute || this.isVendorRoute) ? baseHeight + adminExtra : baseHeight;
    },

    isAdminUser() {
      return this.userDetails?.userType === 'admin';
    },

    isAdminRoute() {
      return this.$route.path.startsWith('/admin');
    },

    portalName() {
      if (!this.userDetails) return ""
      if (this.userDetails.userType === "admin") {
        switch (this.userDetails.rightsType) {
          case "Security":
            return "Security Portal"
          case "Driver":
            return "Driver Portal"
          case "Agent":
            return "Agent Portal"
          default:
            return "Admin Portal"
        }
      }
      return ""
    }

    // isVendorUser() {
    //   return this.userDetails?.userType === 'vendor';
    // },

    // isVendorRoute() {
    //   return this.$route.path.startsWith('/vendor');
    // },
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
    downloadApk() {
      this.$q.dialog({
        title: 'Preparing Download',
        message: 'Your app is being prepared, please wait...',
        color: 'primary',
        persistent: true
      }).onOk(() => {
        const link = document.createElement('a')
        link.href = '/files/the-web-v4-app.apk'
        link.setAttribute('download', 'the-web-v4-app.apk')
        link.style.display = 'none'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
      })
    },

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
  bottom: 80px
  right: 10px
  z-index: 1000
  width: 60px
  height: 60px
  border-radius: 100%

  @media (max-width: 768px)
    display: none

.whats-app-btn-mobile
  display: none

  @media (max-width: 768px)
    display: flex
    position: fixed
    bottom: 80px
    right: 10px
    z-index: 1000

    width: 60px
    height: 60px
    border-radius: 50%

    justify-content: center
    align-items: center

    background: #25D366
    box-shadow: 0 4px 12px rgba(0,0,0,.25)

.whats-app-box
  position: fixed
  bottom: 155px
  right: 10px
  z-index: 1000
  width: 300px
  max-width: calc(100vw - 40px)
  border-radius: 15px

  @media (max-width: 768px)
    right: 10px
    left: 20px
    width: auto
    max-width: none
    bottom: 155px
    border-radius: 20px

.whats-app-msg
  position: relative
  width: 100%
  border-radius: 15px

.whats-app-msg::after
  content: ''
  position: absolute
  top: 20px
  right: -10px
  width: 0
  height: 0
  border-top: 10px solid transparent
  border-bottom: 10px solid transparent
  border-left: 12px solid white

.logo-circle
  width: 60px
  height: 60px
  border-radius: 50%

  background: white
  display: flex
  justify-content: center
  align-items: center

  overflow: hidden
  cursor: pointer

  box-shadow: 0 4px 12px rgba(0,0,0,.25)

.logo-image
  width: 65%
  height: 65%
  object-fit: contain
</style>