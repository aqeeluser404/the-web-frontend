<template>
  <q-layout view="hHh lpR fff">
    <q-header class="bg-white">

      <q-toolbar class="q-px-lg row items-center justify-between">

        <!-- title and avatar -->
        <q-toolbar-title class="col-md-6 row items-center ">
          <q-avatar class="q-mr-sm responsive-avatar">
            <img :src="logoSrc"/>
          </q-avatar>
          <router-link to="/" class="text-remove-decoration font-size-responsive-lg text-black" >The Web </router-link>
          <span v-if="isLoggedIn" :class="[ 'q-ml-sm', $q.screen.lt.md ? 'font-size-responsive-md' : 'font-size-responsive-xxl', 'caveat' ]">
            Hi, {{ userDetails.username }}
          </span>
        </q-toolbar-title>

        <div class="col-md-6">
          <!----------------------------------------------------------- NAV SECTION -------------------------------------------------->
          <!-- Desktop nav -->
          <div class="row justify-end items-center">
            <q-btn to="/" class="custom-button q-py-sm large-screen-only font-size-responsive-sm text-black" label="Home" flat rounded />
            <q-btn to="/units" class="custom-button q-py-sm large-screen-only font-size-responsive-sm text-black" label="Units" flat rounded />
            <q-btn v-if="!isLoggedIn" to="/auth/login" class="custom-button q-py-sm large-screen-only font-size-responsive-sm text-black" label="Login" flat rounded />
            <q-btn v-else @click="logout" class="custom-button q-py-sm large-screen-only font-size-responsive-sm text-black" label="Logout" flat rounded />
            <q-btn @click="openDash" class="custom-button q-py-sm large-screen-only font-size-responsive-sm text-black" icon="eva-person-outline" flat rounded />
            <q-btn v-if="userDetails && userDetails.userType != null && userDetails.userType == 'admin'" to="/admin/dashboard" icon="eva-pie-chart-outline" class="custom-button q-py-sm large-screen-only font-size-responsive-sm text-black" flat rounded />
          </div>
          <!-- Mobile nav -->
          <q-btn-dropdown class="small-screen-only" dropdown-icon="menu" flat>
            <q-list style="width: 200px">
              <q-item clickable v-close-popup to="/">
                <q-item-section class="font-size-responsive-md">Home</q-item-section>
              </q-item>
              <q-item clickable v-close-popup to="/units">
                <q-item-section class="font-size-responsive-md">Catalogue</q-item-section>
              </q-item>
              <q-item clickable v-close-popup to="/auth/login" v-if="!isLoggedIn">
                <q-item-section class="font-size-responsive-md">Login</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="logout" v-else>
                <q-item-section class="font-size-responsive-md">Logout</q-item-section>
              </q-item>
              <q-item clickable v-close-popup @click="openDash">
                <q-item-section class="font-size-responsive-md">User Profile</q-item-section>
              </q-item>
              <q-item clickable v-close-popup to="/admin/dashboard" v-if="userDetails && userDetails.userType != null && userDetails.userType == 'admin'">
                <q-item-section class="font-size-responsive-md">Admin Panel</q-item-section>
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
