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
              style="width: 16%; cursor: pointer;"
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

    <!-- <q-footer class="bg-dark text-white">
      <div id="contact-section" style="height: 100%; background-color: #333;" class="q-pa-xl">
        <q-card flat class="bg-transparent text-white row justify-center constrain">
          <q-card-section class="col-md-6 col-12">
            <div class="text-h4 q-mb-md">Discuss with Our Team</div>
            <div class="text-body2 q-mb-md">Founder and Managing Director</div>
            <div class="text-body1 q-mb-md"><b>Wayne Louw</b></div>
            <div class="column">
              <a href="mailto:admin@the-web.co.za" class="q-mb-md" style="text-decoration: underline; color: white;">
                <q-icon name="eva-email-outline" class="q-mr-sm" /> admin@the-web.co.za
              </a>
              <a href="tel:+27823433945" target="_blank" class="q-mb-md" style="text-decoration: underline; color: white;">
                <q-icon name="eva-phone-outline" class="q-mr-sm" /> (+27) 82-343-3945
              </a>
              <a href="https://api.whatsapp.com/send/?phone=27823433945&text&type=phone_number&app_absent=0" target="_blank" style="text-decoration: underline; color: white;">
                <q-icon name="eva-message-circle-outline" class="q-mr-sm" /> Send WhatsApp
              </a>
            </div>
          </q-card-section>
          <q-card-section class="col-md-6 col-12 bg-transparent">
            <div class="text-h4 q-mb-md">Contact Us</div>
            <div class="">
              <q-form @submit="submitContactForm" style="width: 100%;">
                <q-input filled label-color="white" color="brown" v-model="userContact.firstName" label="Your Name" stack-label class="q-mb-md" required
                  style="border: 1px solid white;" input-style="color: white;" />
                <q-input filled label-color="white" color="brown" v-model="userContact.email" label="Your Email" stack-label class="q-mb-md" required
                  style="border: 1px solid white;" input-style="color: white;" />
                <q-input filled label-color="white" color="brown" v-model="message" label="Message" type="textarea" stack-label class="q-mb-md" required
                  style="border: 1px solid white;" input-style="color: white;" />
                <div class="row justify-between flex-center">
                  <label>
                    <input type="checkbox" name="privacyPolicy" value="agree" required class="q-mr-sm">
                    By submitting your data, you agree to our <span class="text-brown"><b>privacy policy</b></span>
                  </label>
                  <CustomButton v-if="$q.screen.gt.sm" type="submit" label="Send Message" color="brown" text-color="white" customStyle="width: 30%" />
                  <CustomButton v-else type="submit" label="Send Message" class="q-mt-md" color="brown" text-color="white" customStyle="width: 100%" />
                </div>
              </q-form>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </q-footer> -->
  </q-layout>
</template>

<script>
import logoWhite from '../assets/resources/logos/Logo2.png'
import logoBlack from '../assets/resources/logos/Logo2.png'
import UserService from 'src/services/UserService'
import Helper from 'src/services/utils'
import CustomButton from 'src/components/elements/CustomButton.vue'
import EmailService from 'src/services/EmailService';

export default {
  data() {
    return {
      // userContact: {
      //   firstName: '',
      //   email: '',
      // }, message: '',


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
    // async submitContactForm() {
    //   const checkbox = document.querySelector('input[name="privacyPolicy"]');
    //   if (!checkbox.checked) {
    //     this.$q.notify({ type: 'negative', message: 'You must agree to the privacy policy before submitting.' });
    //     return;
    //   }

    //   try {
    //     const response = await EmailService.GetInContact(this.userContact, this.message);
    //     if (response) {
    //       this.$q.notify({ type: 'positive', color: 'primary', message: 'Message sent successfully!' });
    //       this.userContact.firstName = '';
    //       this.userContact.email = '';
    //       this.message = '';
    //     } else {
    //       this.$q.notify({ type: 'negative', message: 'Error sending message.' });
    //     }
    //   } catch (error) {
    //     this.$q.notify({ type: 'negative', message: 'Error sending message.' });
    //   }
    // },
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
