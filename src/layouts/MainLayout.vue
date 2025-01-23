<template>
  <q-layout view="hHh lpR fff">
    <q-header class="bg-white flex" style="height: 10vh;">

      <q-toolbar class="q-px-lg text-black row items-center justify-between">

        <!-- title and avatar -->
        <q-toolbar-title class="col-md-5 row items-center ">

          <q-avatar>
            <img :src="logoSrc"/>
          </q-avatar>

          <router-link to="/" class="text-remove-decoration text-black q-mr-md" >The Web </router-link>
          <!-- <span v-if="isLoggedIn">
            Hi, {{ userDetails.username }}
          </span> -->
        </q-toolbar-title>

        <div class="col-md-7">
          <!----------------------------------------------------------- NAV SECTION -------------------------------------------------->
          <!-- Desktop nav -->
          <div class="row justify-end items-center">
            <q-btn
              to="/"
              class="custom-button q-py-sm large-screen-only"
              label="Home" flat rounded />

            <q-btn
              @click="scrollToSection('amenities-section')"
              class="custom-button q-py-sm large-screen-only"
              label="Amenities" flat rounded />

            <q-btn
              @click="scrollToSection('images-section')"
              class="custom-button q-py-sm large-screen-only"
              label="Images" flat rounded />

            <q-btn
              @click="scrollToSection('academics-section')"
              class="custom-button q-py-sm large-screen-only"
              label="Academics" flat rounded />

            <q-btn
              @click="scrollToSection('units-section')"
              class="custom-button q-py-sm large-screen-only"
              label="Units" flat rounded />

            <q-btn
              @click="scrollToSection('contact-section')"
              class="custom-button q-py-sm large-screen-only"
              label="Contract" flat rounded />

            <!-- authentication -->
            <q-btn
              v-if="!isLoggedIn"
              to="/auth/login"
              class="custom-button q-py-sm large-screen-only"
              label="Login" flat rounded />

            <q-btn
              v-else
              @click="logout"
              class="custom-button q-py-sm large-screen-only"
              label="Logout" flat rounded />

            <!-- user dashboard -->
            <q-btn
              @click="openDash"
              class="custom-button q-py-sm large-screen-only"
              icon="eva-person-outline" flat rounded />

            <!-- admin -->
            <q-btn
              v-if="userDetails && userDetails.userType != null && userDetails.userType == 'admin'"
              to="/admin/dashboard"
              class="custom-button q-py-sm large-screen-only font-size-responsive-sm text-black"
              icon="eva-pie-chart-outline" flat rounded />
          </div>

          <!-- Mobile nav -->
          <q-btn-dropdown class="small-screen-only" dropdown-icon="menu" flat>
            <q-list style="width: 200px">
              <q-item clickable v-close-popup to="/">
                <q-item-section class="">Home</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section class="" @click="scrollToSection('amenities-section')">Amenities</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section class="" @click="scrollToSection('images-section')">Images</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section class="" @click="scrollToSection('academics-section')">Academics</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section class="" @click="scrollToSection('units-section')">Units</q-item-section>
              </q-item>
              <q-item clickable v-close-popup>
                <q-item-section class="" @click="scrollToSection('contact-section')">Contact</q-item-section>
              </q-item>

              <!-- authentication -->
              <q-item clickable v-close-popup to="/auth/login" v-if="!isLoggedIn">
                <q-item-section class="">Login</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="logout" v-else>
                <q-item-section class="">Logout</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="openDash">
                <q-item-section class="">User Profile</q-item-section>
              </q-item>
              <q-item clickable v-close-popup to="/admin/dashboard" v-if="userDetails && userDetails.userType != null && userDetails.userType == 'admin'">
                <q-item-section class="">Admin Panel</q-item-section>
              </q-item>
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import logoWhite from '../assets/resources/logos/THE WEB.gif'
import logoBlack from '../assets/resources/logos/THE WEB.gif'
import UserService from 'src/services/UserService'
import Helper from 'src/services/utils'

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

      logoWhite, logoBlack,
      logoSrc: logoWhite,
    }
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
    scrollToSection(sectionId) {
      const element = document.getElementById(sectionId)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
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
    },
    async fetchUserDetails() {
      const response = await UserService.FindUserByToken()
      this.userDetails = response
    },
    async openDash() {
      if (this.isLoggedIn == true) {
        this.$router.push('/user/dashboard')
      } else {
        this.$q.notify({ type: 'negative', message: 'Please login to continue.' })
      }
    },
  }
}
</script>
