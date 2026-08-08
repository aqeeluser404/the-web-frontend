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
      $route.path !== '/digital-application' &&
      $route.path !== '/lease-signed' &&
      $route.path !== '/install-app'
    ">
      <q-toolbar class="text-black row items-center justify-between bg-white constrain-standard">

        <!-- title and avatar -->
        <q-toolbar-title class="col-md-3 row items-center">
          <router-link v-if="!isMobileView" to="/" class="row items-center">
            <img :src="logoSrc" alt="Home" style="width: 40%; cursor: pointer;">
          </router-link>
          <router-link v-else to="/" class="row items-center">
            <img :src="logoSrcBlack" alt="Home" style="width: 15%; cursor: pointer;">
          </router-link>
        </q-toolbar-title>

        <div class="col-md-9">
          <!---------------------------------------------- DESKTOP NAV SECTION -------------------------------------------------->

          <div class="row justify-end items-center q-py-lg ">

            <!-- Home Icons -->
            <UniversalMenu :items="homeItems" :hover="true" class="large-screen-only"
              v-if="$route.path !== '/' && $route.path !== '/frequently-asked-questions' && $route.path !== '/fees'">
              <template #trigger>
                <q-btn flat label="Home" to="/" class="custom-button q-py-sm q-px-md" />
              </template>
            </UniversalMenu>

            <div v-else class="row justify-end items-center">

              <q-btn to="/" class="custom-button q-py-sm large-screen-only" label="Home" flat />
              <q-btn @click="scrollToSection('amenities-section')" class="custom-button q-py-sm large-screen-only"
                label="Amenities" flat />
              <q-btn @click="scrollToSection('units-section')" class="custom-button q-py-sm large-screen-only"
                label="Units" flat />
              <q-btn @click="scrollToSection('location-section')" class="custom-button q-py-sm large-screen-only"
                label="Location" flat />
              <q-btn @click="scrollToSection('contact-section')" class="custom-button q-py-sm large-screen-only"
                label="Contact" flat />
              <q-btn to="/frequently-asked-questions" class="custom-button q-py-sm large-screen-only" label="FAQs"
                flat />
              <q-btn to="/fees" class="custom-button q-py-sm large-screen-only" label="Fees" flat />
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
            <UniversalMenu :items="adminItems" :hover="true" class="large-screen-only"
              v-show="isLoggedIn && isAdminUser">
              <template #trigger>
                <q-btn flat label="Administration" class="custom-button q-py-sm q-px-md" />
              </template>
            </UniversalMenu>


            <!-- <CustomButton v-if="!isLoggedIn" label="Login" to="/auth/login" class="large-screen-only q-ml-md"
              :customStyle="{ width: 'fit-content' }" /> -->

            <!-- AUTHENTICATION AND WELCOME DIALOG -->
            <CustomButton v-if="!isLoggedIn" label="Login" class="large-screen-only q-ml-md"
              :customStyle="{ width: 'fit-content' }" @click="showAuthDialog = true" />
            <CustomButton v-else label="Logout" @click="logout" class="large-screen-only q-ml-md"
              :customStyle="{ width: 'fit-content' }" />

            <q-dialog v-model="showAuthDialog" position="top">
              <div class="dialog-wrapper">
                <q-card class="combined-unit-card">
                  <div class="row">
                    <div class="col-md-6 col-12 q-pa-md column justify-center">
                      <q-card-section class="q-pb-none">
                        <div class="text-h3">Welcome Back</div>
                      </q-card-section>

                      <q-card-section class="row justify-between">
                        <CustomButton label="Login" class="" to="/auth/login" @click="showAuthDialog = false"
                          customStyle="width: 45%;" />
                        <CustomButton label="Register" class="" to="/auth/register" @click="showAuthDialog = false"
                          customStyle="width: 45%;" />
                      </q-card-section>
                    </div>
                    <div class="col-md-6 col-12">
                      <q-img :src="loginImage" class="side-image" />
                    </div>
                  </div>
                </q-card>
              </div>
            </q-dialog>



            <!---------------------------------------------- MOBILE NAV SECTION -------------------------------------------------->
            <q-btn-dropdown class="small-screen-only" dropdown-icon="menu" flat>
              <q-list style="width: 380px; padding: 8px;">
                <div class="two-column-list">

                  <div class="column wide q-pa-md" style="background-color: #f8f8f8;">

                    <!-- Home Icons -->
                    <QListItems :noPadding="false" :items="homeItemsMobile" alignItems="left" class="text-light"
                      :includeIcons="false" :underline="true" />

                    <!-- Book Icons -->
                    <QListItems :noPadding="false" :items="bookItemsMobile" alignItems="left" class="text-light"
                      :includeIcons="false" :underline="true" />

                    <!-- Account Icons -->
                    <QListItems v-show="isLoggedIn" :noPadding="false" :items="accountItemsMobile" alignItems="left"
                      class="text-light" :includeIcons="false" :underline="true" />

                    <!-- Admin Icons -->
                    <QListItems v-show="isLoggedIn && isAdminUser" :noPadding="false" :items="adminItemsMobile"
                      alignItems="left" class="text-light" :includeIcons="false" :underline="true" />
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

      <!-- MAINTENANCE BANNER -->
      <MaintenanceBanner v-if="showMaintenanceBanner" class="full-width" />

      <!-- ADMIN BREADBRUMBS -->
      <div v-if="isAdminRoute" class="full-width">
        <div class="text-black bg-white text-caption">
          <q-toolbar class="constrain-standard">
            <q-breadcrumbs flat active-color="black">
              <q-breadcrumbs-el v-for="(crumb, idx) in adminBreadcrumbs" :key="idx" :label="crumb.label" :to="crumb.to"
                :icon="crumb.icon" />
            </q-breadcrumbs>
          </q-toolbar>
        </div>
      </div>
    </q-header>

    <!-- WHATSAPP CHAT -->
    <q-card class="whats-app-box" style="" v-if="boxOpened">
      <q-card-section class="row justify-between items-center q-pa-md"
        style="background-color: #0B5E54; border-top-left-radius: 12px; border-top-right-radius: 12px;">

        <div class="row items-center">
          <div class="justify-center row items-center logo-circle q-mr-md">
            <img :src="logoSrcBlack" alt="Home" class="logo-image"></img>
          </div>

          <div class="text-white">
            <div class="text-h7"><b>The-WEB</b></div>
            <div class="text-caption">Business Account</div>
          </div>
        </div>

        <q-btn class="" flat round icon="close" @click="toggleWhatsAppBox" size="md" color="white" aria-label="Close" />
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

    <!-- WHATSAPP BUTTONS -->
    <q-btn v-if="!isAdminRoute" rounded :label="!boxOpened ? '' : ''" color="secondary" text-color="white"
      icon="img:/assets/elements/whatsapp.png" size="lg" class="custom-button whats-app-btn-desktop"
      @click="toggleWhatsAppBox" />
    <q-btn v-if="!isAdminRoute" rounded color="secondary" text-color="white" icon="img:/assets/elements/whatsapp.png"
      size="lg" class="custom-button whats-app-btn-mobile" @click="toggleWhatsAppBox" />


    <!-- PAGE ROUTING -->
    <q-page-container>
      <div v-if="isMobileView || showDesktopView" >
        <MobileHomeView />
      </div>
      <div v-else>
        <router-view />
      </div>
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
import { showSessionExpired } from 'src/services/showShessionExpired';

import main from 'src/assets/resources/home/hero/h0.png';

import { Capacitor } from '@capacitor/core';
import MobileHomeView from 'src/components/elements/MobileHomeView.vue';

export default {
  data() {
    return {
      showDesktopView: false,
      isMobileView: Capacitor.isNativePlatform(),

      loginImage: main,
      showMaintenanceBanner: false,
      userDetails: {
        _id: '',
        username: '',
        userType: ''
      },
      isLoggedIn: false,
      tokenTimeout: null,
      burgerMenuShown: false,
      showAuthDialog: false,

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
      ],
      homeItemsMobile: [
        {
          label: 'Home',
          isMenuGroup: true,
          children: [
            { label: 'Home', to: '/' },
            { label: 'Amenities', handler: () => this.scrollToSection('amenities-section') },
            { label: 'Units', handler: () => this.scrollToSection('units-section') },
            { label: 'Location', handler: () => this.scrollToSection('location-section') },
            { label: 'Contact', handler: () => this.scrollToSection('contact-section') },
            { label: 'FAQs', to: '/frequently-asked-questions' },
            { label: 'Fees', to: '/fees' },
          ]
        },
      ]
    }
  },
  components: { CustomButton, MaintenanceBanner, UniversalMenu, QListItems, MobileHomeView },

  computed: {
    bookItems() {
      const items = [
        { label: 'Unit Booking', to: '/units/apply/floor/1' },
      ]
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
        { label: 'Unit Booking', to: '/units/apply/floor/1' },
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
        })

        // Driver-specific
        if (this.userDetails.rightsType === 'Driver' || this.userDetails?.username === 'admin') {
          children.push({
            label: 'Driver Scanner',
            to: '/scan',
          })
        }

        // Security-specific
        if (this.userDetails.rightsType === 'Security' || this.userDetails?.username === 'admin') {
          children.push({
            label: 'Security Scanner',
            to: '/security/scan',
          })
        }

        children.push({
          label: this.showDesktopView ? 'Show Desktop (test)' : 'Show Mobile (test)',
          handler: this.toggleMode,
        })
      }

      // <q-btn @click="toggleMode" class="custom-button q-py-sm large-screen-only"
      //   :label="showDesktopView ? 'Show Desktop' : 'Show Mobile'" flat />

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
          })
        }

        // Security-specific
        if (this.userDetails.rightsType === 'Security' || this.userDetails?.username === 'admin') {
          children.push({
            label: 'Security Scanner',
            to: '/security/scan',
          })
        }

        children.push({
          label: this.showDesktopView ? 'Show Desktop (test)' : 'Show Mobile (test)',
          click: this.toggleMode,
        })
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
  const adminExtra = this.isAdminRoute ? 50 : 0;
  const mobileExtra = this.showDesktopView ? 15 : 0;

  return baseHeight + adminExtra + mobileExtra;
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
    },

    // isVendorUser() {
    //   return this.userDetails?.userType === 'vendor';
    // },

    // isVendorRoute() {
    //   return this.$route.path.startsWith('/vendor');
    // },
  },
  mounted() {
    this.checkLoginStatus();
  },
  beforeUnmount() {
    clearTimeout(this.tokenTimeout);
  },
  watch: {
    '$route'(to, from) {
      this.checkLoginStatus();

      if (to.path !== '/') {
        this.isMobileView = false;
        this.showDesktopView = false;
      } else {
        this.isMobileView = Capacitor.isNativePlatform();
      }
    },
    isLoggedIn(newVal, oldVal) {
      if (oldVal === true && newVal === false) {
        if (this.$route.path !== '/auth/login') {
          showSessionExpired(this.$router);
        }
      }
    }
  },
  methods: {
    toggleMode() {
      this.showDesktopView = !this.showDesktopView;
      this.isMobileView = !this.isMobileView;
    },

    // LOGIN SETUP

    async checkLoginStatus() {
      clearTimeout(this.tokenTimeout);

      const valid = await Helper.checkCookie();
      if (!valid) {
        this.isLoggedIn = false;
        return;
      }

      const token = await Helper.getCookie('token');
      if (!token) {
        this.isLoggedIn = false;
        return;
      }

      try {
        const user = await UserService.FindUserByToken();
        const userDetails = await UserService.findUserById(user._id);
        this.userDetails = userDetails;

        if (token === userDetails.loginInfo.loginToken) {
          this.isLoggedIn = true;

          const payload = JSON.parse(atob(token.split('.')[1]));
          if (payload.exp) {
            const expiry = payload.exp * 1000;
            const delay = expiry - Date.now();
            if (delay > 0) {
              this.tokenTimeout = setTimeout(() => {
                this.isLoggedIn = false;
              }, delay);
            } else {
              this.isLoggedIn = false;
            }
          }
        } else {
          this.isLoggedIn = false;
          this.handleLogout();
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        this.isLoggedIn = false;
        this.handleLogout();
      }
    },

    handleLogout() {
      Helper.removeCookie('token');
      this.$router.push('/');
    },

    async logout() {
      this.$q.dialog({
        title: 'Logout',
        message: 'You are about to logout, continue?',
        color: 'primary',
        cancel: true,
        persistent: true
      }).onOk(async () => {
        const response = await UserService.logout(this.userDetails._id);
        if (response) {
          this.$q.dialog({
            title: 'Success',
            message: 'You have successfully logged out!',
            color: 'primary',
            persistent: true
          }).onOk(() => {
            this.$router.push('/');
            this.isLoggedIn = false;
            window.location.reload();
          });
        } else {
          this.$q.notify({ type: 'negative', message: 'Logout failed. Please try again.' });
        }
      });
    },


    downloadApk() {
      this.$q.dialog({
        title: 'Preparing Download',
        message: 'Your app is being prepared, please wait...',
        color: 'primary',
        persistent: true
      }).onOk(() => {
        const link = document.createElement('a')
        link.href = '/files/the-web-v5-app.apk'
        link.setAttribute('download', 'the-web-v5-app.apk')
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

<style lang="sass" scoped>
.dialog-wrapper
  display: flex
  justify-content: center
  align-items: center
  width: 100%
  min-width: 1200px
  height: 100%
  padding: 24px
  margin-top: 70px
  box-sizing: border-box

.border-radius
  border-radius: 12px

.side-image
  object-fit: cover
  width: 100%
  height: 100%
  // max-width: 1280px
  border-radius: 12px
  @media (max-width: 767px)
    height: 300px
    max-width: 500px
    margin: 0 auto

.combined-unit-card
  width: 100%;
  color: white
  padding: 16px
  border-radius: 20px
  overflow: hidden
  text-align: center
  background-color: #555
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3)

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
  right: 78px
  z-index: 1000
  width: 300px
  max-width: calc(100vw - 40px)
  border-radius: 15px

  @media (max-width: 768px)
    right: 10px
    left: 20px
    width: auto
    max-width: none
    bottom: 220px
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
