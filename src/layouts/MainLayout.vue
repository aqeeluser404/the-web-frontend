<template>
  <q-layout view="hHh lpR fff">
    <q-header class="bg-white flex" :style="{ height: headerHeight }" v-if="
      $route.path !== '/auth/login' &&
      $route.path !== '/auth/register' &&
      $route.path !== '/verify-email' &&
      $route.path !== '/resend-verification' &&
      $route.path !== '/reset-password' &&
      $route.path !== '/forgot-password'
      // $route.path !== '/admin/dashboard'
    ">
      <!-- Top nav -->
      <div class="secondary-nav bg-grey-3 text-black full-width q-px-lg ">
        <div class="full-height large-screen-only">
          <div class="row justify-center items-center full-height">
            <q-btn to="/incident-report" rounded flat label="Incident Report"
              class="custom-button q-py-sm text-weight-medium" />
            <q-btn to="/resources" rounded flat label="Resources" class="custom-button q-py-sm text-weight-medium" />
            <q-btn to="/developer" rounded flat label="Developer" class="custom-button q-py-sm text-weight-medium" />
            <q-btn to="/fees" rounded flat label="Fees" class="custom-button q-py-sm text-weight-medium" />
            <q-btn to="/history" rounded flat label="History" class="custom-button q-py-sm text-weight-medium" />
            <q-btn to="/applications" rounded flat label="Applications"
              class="custom-button q-py-sm text-weight-medium" />
          </div>
        </div>
        <q-btn-dropdown dropdown-icon="menu" flat class="small-screen-only full-height">
          <q-list style="width: 200px;">
            <q-item clickable v-close-popup to="/incident-report">
              <q-item-section>Incident Report</q-item-section>
            </q-item>
            <q-item clickable v-close-popup to="/resources">
              <q-item-section>Resources</q-item-section>
            </q-item>
            <q-item clickable v-close-popup to="/developer">
              <q-item-section>Developer</q-item-section>
            </q-item>
            <q-item clickable v-close-popup to="/fees">
              <q-item-section>Fees</q-item-section>
            </q-item>
            <q-item clickable v-close-popup to="/history">
              <q-item-section>History</q-item-section>
            </q-item>
            <q-item clickable v-close-popup to="/applications">
              <q-item-section>Applications</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>

      <!-- <div class="secondary-nav bg-grey-3 text-black full-width q-px-lg small-screen-only">
        <div class="small-screen-only q-px-md text-right full-height">

        </div>
      </div> -->

      <q-toolbar class="q-px-lg text-black row items-center justify-between bg-white" style="border-bottom: 1px solid #e0e0e0;">

        <!-- title and avatar -->
        <q-toolbar-title class="col-md-4 row items-center ">
          <router-link to="/" class="row items-center">
            <img :src="logoSrc" alt="Home" style="width: 25%; cursor: pointer;">
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
              @click="scrollToSection('academics-section')" class="custom-button q-py-sm large-screen-only"
              label="Academics" flat rounded />

            <q-btn
              v-if="isRouteMatch(['/', '/frequently-asked-questions', '/developer', '/history', '/fees', '/applications', '/resources', '/incident-report'])"
              @click="scrollToSection('contact-section')" class="custom-button q-py-sm large-screen-only"
              label="Contact" flat rounded />

            <q-btn
              v-if="isRouteMatch(['/', '/frequently-asked-questions', '/developer', '/history', '/fees', '/applications', '/resources', '/incident-report'])"
              to="/frequently-asked-questions" class="custom-button q-py-sm large-screen-only" label="FAQ" flat
              rounded />

            <!-- dashboards -->
            <q-btn to="/units/apply" class="custom-button q-py-sm large-screen-only" label="Book Now" flat rounded />
            <q-btn
              v-if="isLoggedIn && isRouteMatch(['/units/apply/floor/1', '/units/apply/floor/2', '/units/apply/floor/3', '/units/apply', '/user/profile', '/user/applications', '/user/call-log'])"
              to="/user/profile" class="custom-button q-py-sm large-screen-only" label="User Profile" flat rounded />
            <q-btn
              v-if="isLoggedIn && isRouteMatch(['/units/apply/floor/1', '/units/apply/floor/2', '/units/apply/floor/3', '/units/apply', '/user/profile', '/user/applications', '/user/call-log'])"
              to="/user/applications" class="custom-button q-py-sm large-screen-only" label="Application History" flat
              rounded />
            <q-btn
              v-if="isLoggedIn && isRouteMatch(['/units/apply/floor/1', '/units/apply/floor/2', '/units/apply/floor/3', '/units/apply', '/user/profile', '/user/applications', '/user/call-log'])"
              to="/user/call-log" class="custom-button q-py-sm large-screen-only" label="Log A Call" flat rounded />
            <q-btn v-if="userDetails && userDetails.userType != null && userDetails.userType == 'admin'" to="/admin"
              class="custom-button q-py-sm large-screen-only" icon="eva-pie-chart-outline" label="Admin" flat rounded />

            <q-btn v-if="userDetails && userDetails.userType != null && userDetails.userType == 'vendor'" to="/vendor"
              class="custom-button q-py-sm large-screen-only" icon="eva-pie-chart-outline" label="Vendor" flat
              rounded />

            <!-- PHP CODE -->
            <q-btn v-if="userDetails && userDetails.userType != null && userDetails.userType == 'admin'"
              @click="downloadData()" class="custom-button q-py-sm large-screen-only" icon="eva-cloud-download-outline"
              flat rounded />

            <!-- authentication -->
            <CustomButton v-if="!isLoggedIn" label="Login" to="/auth/login" class="large-screen-only q-ml-md"
              :customStyle="{ width: 'fit-content' }" />
            <CustomButton v-else label="Logout" @click="logout" class="large-screen-only q-ml-md"
              :customStyle="{ width: 'fit-content' }" />
          </div>

          <!-- Mobile nav -->
          <q-btn-dropdown class="small-screen-only" dropdown-icon="menu" flat>
            <q-list style="width: 200px;">
              <q-item clickable v-close-popup to="/">
                <q-item-section class="">Home</q-item-section>
              </q-item>
              <q-item clickable v-close-popup v-if="isRouteMatch(['/', '/frequently-asked-questions'])">
                <q-item-section class="" @click="scrollToSection('amenities-section')">Amenities</q-item-section>
              </q-item>
              <!-- <q-item clickable v-close-popup v-if="$route.path === '/'">
                <q-item-section class="" @click="scrollToSection('images-section')">Gallery</q-item-section>
              </q-item> -->
              <q-item clickable v-close-popup v-if="isRouteMatch(['/', '/frequently-asked-questions'])">
                <q-item-section class="" @click="scrollToSection('units-section')">Units</q-item-section>
              </q-item>
              <q-item clickable v-close-popup v-if="isRouteMatch(['/', '/frequently-asked-questions'])">
                <q-item-section class="" @click="scrollToSection('academics-section')">Academics</q-item-section>
              </q-item>
              <q-item clickable v-close-popup v-if="isRouteMatch(['/', '/frequently-asked-questions'])">
                <q-item-section class="" @click="scrollToSection('contact-section')">Contact</q-item-section>
              </q-item>
              <q-item clickable v-close-popup to='/frequently-asked-questions'
                v-if="isRouteMatch(['/', '/frequently-asked-questions'])">
                <q-item-section class="">FAQ</q-item-section>
              </q-item>

              <!-- authentication -->
              <q-item clickable v-close-popup to="/units/apply">
                <q-item-section class="">Book Now</q-item-section>
              </q-item>
              <q-item clickable v-close-popup to="/user/profile"
                v-if="isLoggedIn && isRouteMatch(['/units/apply/floor/1', '/units/apply/floor/2', '/units/apply/floor/3', '/units/apply', '/user/profile', '/user/applications', '/user/call-log'])">
                <q-item-section class="">User Profile</q-item-section>
              </q-item>
              <q-item clickable v-close-popup to="/user/applications"
                v-if="isLoggedIn && isRouteMatch(['/units/apply/floor/1', '/units/apply/floor/2', '/units/apply/floor/3', '/units/apply', '/user/profile', '/user/applications', '/user/call-log'])">
                <q-item-section class="">Application History</q-item-section>
              </q-item>
              <q-item clickable v-close-popup to='/user/call-log'
                v-if="isLoggedIn && isRouteMatch(['/units/apply/floor/1', '/units/apply/floor/2', '/units/apply/floor/3', '/units/apply', '/user/profile', '/user/applications', '/user/call-log'])">
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

              <!-- PHP CODE -->
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
            </q-list>
          </q-btn-dropdown>
        </div>
      </q-toolbar>

      <MaintenanceBanner v-if="showMaintenanceBanner" class="full-width" />

      <!-- breadcrumbs -->
      <div v-if="isAdminRoute">
        <div class="text-black text-caption">
          <q-toolbar class="q-px-lg">
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
          <q-toolbar class="q-px-lg">
            <q-breadcrumbs flat active-color="black">
              <q-breadcrumbs-el v-if="$route.path.includes('/vendor')" label="Vendor" to="/vendor" icon="home" />
              <q-breadcrumbs-el v-if="$route.path.includes('/vendor/call-log')" label="Call Log Administration"
                icon="eva-settings-outline" />
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
import MaintenanceBanner from 'src/components/elements/MaintenanceBanner.vue';
import weblogo3d from '../assets/resources/logos/weblogo3d.png'

import UserService from 'src/services/UserService'
import Helper from 'src/services/utils'
import CustomButton from 'src/components/elements/CustomButton.vue'
import ExportDataService from 'src/services/ExportDataService'

export default {
  data() {
    return {
      showMaintenanceBanner: true,
      userDetails: {
        _id: '',
        username: '',
        userType: ''
      },
      isLoggedIn: false,
      burgerMenuShown: false,

      logoSrc: weblogo3d,
    }
  },
  components: {
    CustomButton,
    MaintenanceBanner
  },
  computed: {
    headerHeight() {
      if (this.showMaintenanceBanner === false) {
        // const adminVendorHeight = '225px';
        // const defaultMainHeader = '100px';

        const adminVendorHeight = '187px';
        const defaultMainHeader = '75px';

        // const adminVendorHeight = '150px';
        // const defaultMainHeader = '50px';

        const secondaryNavHeight = '50px';

        if (this.isAdminRoute || this.isVendorRoute) {
          return adminVendorHeight;
        } else {
          return `calc(${defaultMainHeader} + ${secondaryNavHeight})`;
        }
      } else {
        const adminVendorHeight = '250px';  // 50 extra for the breadcrumbs
        const defaultMainHeader = '150px';
        const secondaryNavHeight = '50px';

        if (this.isAdminRoute || this.isVendorRoute) {
          return adminVendorHeight;
        } else {
          return `calc(${defaultMainHeader} + ${secondaryNavHeight})`;
        }
      }
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
    isRouteMatch(paths) {
      return paths.includes(this.$route.path);
    },
    scrollToSection(sectionId) {
      if (this.$route.path !== '/') {
        this.$router.push('/').then(() => {
          // Give the component time to render after routing
          this.$nextTick(() => {
            setTimeout(() => {
              this.performScroll(sectionId);
            }, 300); // tweak delay as needed
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

.secondary-nav
  height: 50px
  border-bottom: 1px solid #e0e0e0
  padding: 0 16px

// .q-btn
//   padding: 0 12px
//   font-size: 0.9rem
//   &:hover
//     color: $primary





.full-width
  width: 100%
</style>
