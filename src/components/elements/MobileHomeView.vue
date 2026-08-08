<template>
  <q-page class="bg-grey-6">
    <!-- Loading State -->
    <div v-if="loading" class="full-width full-height row justify-center items-center" style="min-height: 100vh;">
      <div class="text-center">
        <q-spinner size="50px" color="primary" />
        <div class="text-caption q-mt-sm text-grey-6">Loading...</div>
      </div>
    </div>

    <!-- Main Content -->
    <div v-else class="constrain-mobile-home-view bg-grey-3" style="padding-bottom: 80px;">

      <div class="section-spacer"></div>

      <!-- Header -->
      <q-card flat class="bg-transparent">
        <q-card-section class="row justify-between items-center full-width no-wrap q-px-none">
          <div class="column">
            <span class="text-subtitle1 text-grey-9">Good afternoon,</span>
            <span class="text-h5 text-bold">{{ userDetails?.firstName || 'Guest' }}</span>
          </div>
          <div class="row">
            <q-btn class="q-mr-md" icon="eva-bell-outline" round size="md" />
            <q-btn :label="initials || '?'" round size="md" color="primary" />
          </div>
        </q-card-section>
      </q-card>

      <div class="section-spacer"></div>

      <!-- Welcome tab -->
      <q-card class="soft-shadow-card q-pa-md">
        <div class="text-h6 text-bold q-mb-sm">
          Welcome to The-WEB Resident Portal
        </div>
        <div class="text-grey-9 text-subtitle1">
          Manage your bookings, visitors, maintenance requests, profile etc.
          from one place.
        </div>
      </q-card>

      <div class="section-spacer"></div>

      <!-- Quick actions -->
      <q-card flat class="bg-transparent">
        <q-card-section class="q-px-none">
          <div class="text-h6 text-bold q-mb-sm">Quick actions</div>

          <div>
            <!-- quick actions card -->
            <div class="row q-col-gutter-md">
              <div v-for="item in items" :key="item.title" class="col-6">
                <q-card flat class="quick-action-card cursor-pointer soft-shadow-card" @click="goTo(item.route)">
                  <q-card-section class="column justify-between full-height">
                    <!-- icon -->
                    <div class="icon-circle" :style="{
                      backgroundColor: item.bgColor,
                      color: item.color,
                    }">
                      <q-icon :name="item.icon" size="22px" />
                    </div>

                    <!-- title and subtitle -->
                    <div class="row items-end no-wrap justify-between q-mt-md">
                      <div class="text-container">
                        <div class="action-title">
                          {{ item.title }}
                        </div>

                        <div class="text-caption text-grey-6 ellipsis">
                          {{ item.subtitle }}
                        </div>
                      </div>

                      <q-icon name="chevron_right" size="18px" color="grey-6" class="chevron" />
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>

          <div class="section-spacer q-mt-md"></div>
          <!-- query card -->
          <q-card flat class="soft-shadow-card pa-sm">
            <q-card-section class="support-card q-pa-md">
              <div class="row items-center no-wrap">
                <div class="support-icon">
                  <q-icon name="support_agent" size="24px" color="teal" />
                </div>

                <div class="q-ml-md">
                  <div class="text-subtitle1 text-weight-bold q-mb-xs">
                    Contact us
                  </div>

                  <div class="text-body2 text-grey-7">
                    Contact us for any queries
                  </div>
                </div>
              </div>

              <q-btn class="full-width q-mt-md support-btn" color="teal" unelevated no-caps label="Contact support"
                @click="goToContact" />
            </q-card-section>
          </q-card>
        </q-card-section>
      </q-card>
    </div>

    <!-- bottom nav -->
    <q-footer bordered class="mobile-footer bg-white">
      <q-tabs v-model="tab" align="justify" dense active-color="primary" indicator-color="transparent"
        class="text-grey-7">
        <q-tab name="home" icon="home" label="Home" @click="goTo('/')" class="text-capitalize" />
        <q-tab name="bookings" icon="event" label="Bookings" @click="goTo('/bookings')" class="text-capitalize"  />
        <q-tab name="alerts" icon="notifications" label="Alerts" @click="goTo('/alerts')" class="text-capitalize"  />
        <q-tab name="profile" icon="person" label="Profile" @click="goTo('/user/profile')" class="text-capitalize"  />
      </q-tabs>
    </q-footer>
  </q-page>
</template>

<script>
import CustomButton from "./CustomButton.vue";
// import { useRouter } from "vue-router";
import Helper from "src/services/utils";
import UserService from "src/services/api/UserService.js";

export default {
  name: "MobileHomeView",
  data() {
    return {
      loading: true,
      tab: "home",
      userDetails: {},
      items: [
        {
          title: "Book Now",
          subtitle: "Reserve facilities",
          icon: "event_available",
          color: "#1976D2",
          bgColor: "#EAF3FF",
          route: "/units/apply/floor/1",
        },
        {
          title: "My Profile",
          subtitle: "Manage account",
          icon: "person",
          color: "#8E24AA",
          bgColor: "#F4E8FB",
          route: "/user/profile",
        },
        // {
        //   title: "Account History",
        //   subtitle: "Past bookings",
        //   icon: "history",
        //   color: "#43A047",
        //   bgColor: "#EAF7EE",
        //   route: "/history",
        // },
        {
          title: "FAQ",
          subtitle: "Common questions",
          icon: "help_outline",
          color: "#5E35B1",
          bgColor: "#F3E8FF",
          route: "/frequently-asked-questions",
        },
        {
          title: "Log a Call",
          subtitle: "Report an issue",
          icon: "build",
          color: "#FB8C00",
          bgColor: "#FFF3E5",
          route: "/user/call-log",
        },
        {
          title: "Shuttle Booking",
          subtitle: "Reserve transport",
          icon: "directions_bus",
          color: "#00897B",
          bgColor: "#E5F7F5",
          route: "/user/shuttle-booking",
        },
        {
          title: "Visitor Booking",
          subtitle: "Register visitors",
          icon: "group_add",
          color: "#E53935",
          bgColor: "#FDECEC",
          route: "/user/visitor-booking",
        },
      ],
      userDetails: {},
    };
  },
  components: {
    CustomButton,
  },

  computed: {
    initials() {
      if (!this.userDetails) return "";

      const first = this.userDetails.firstName?.charAt(0) || "";
      const last = this.userDetails.lastName?.charAt(0) || "";

      return `${first}${last}`.toUpperCase();
    },
  },

  methods: {
    async fetchUserDetails() {
      try {
        const isLoggedIn = await Helper.checkCookie();

        if (!isLoggedIn) {
          this.$router.push('/auth/login');
          return;
        }

        const user = await UserService.FindUserByToken();
        if (user && user._id) {
          this.userDetails = await UserService.findUserById(user._id);
        } else {
          this.$router.push('/auth/login');
        }
      } catch (error) {
        this.$router.push('/auth/login');
      } finally {
        this.loading = false;
      }
    },

    goTo(route) {
      this.$router.push(route);
    },

    goToContact() {
      this.$router.push("/#contact");
    },
  },

  mounted() {
    this.fetchUserDetails();
  },
};
</script>

<style lang="sass">
.soft-shadow-card
  border-radius: 8px
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1)
  min-height: 120px !important

.quick-action-card
  border-radius: 18px
  background: #fff
  min-height: 165px
  transition: all .18s ease
  box-shadow: 0 1px 2px rgba(15,23,42,.04), 0 6px 20px rgba(15,23,42,.08)

  &:hover
    transform: translateY(-2px)
    box-shadow: 0 2px 4px rgba(15,23,42,.06), 0 12px 28px rgba(15,23,42,.12)

  &:active
    transform: scale(.985)

.quick-action-card .q-card__section
  height: 100%
  padding: 18px
  display: flex
  flex-direction: column
  justify-content: space-between

.icon-circle
  width: 46px
  height: 46px
  border-radius: 50%
  display: flex
  align-items: center
  justify-content: center

.text-container
  flex: 1
  min-width: 0

.text-subtitle1
  font-size: 15px
  line-height: 1.2

.text-caption
  margin-top: 4px
  font-size: 12px

.text-container
  flex: 1
  min-width: 0
  overflow: hidden

.action-title
  font-size: 15px
  font-weight: 600
  white-space: nowrap
  overflow: hidden
  text-overflow: ellipsis

.action-subtitle
  margin-top: 4px
  font-size: 12px
  color: #757575
  overflow: hidden
  display: -webkit-box
  -webkit-line-clamp: 2
  -webkit-box-orient: vertical
  line-height: 1.3

.chevron
  transition: transform .18s ease

.quick-action-card:hover .chevron
  transform: translateX(3px)

  //  ------------support card------------

.support-card
  border-radius: 20px
  background: #fff

.support-icon
  width: 52px
  height: 52px
  border-radius: 50%
  background: #DDF8F1
  display: flex
  align-items: center
  justify-content: center

.support-btn
  border-radius: 18px
  height: 48px
  font-size: 16px
  font-weight: 600

//  ------------bottom nav------------
.mobile-footer
  background: white
  border-top: 1px solid #ECECEC
  box-shadow: 0 -2px 15px rgba(0,0,0,.05)

.mobile-footer .q-tabs
  height: 64px
  background: white
  position: fixed
  bottom: 0
  left: 0
  right: 0

.mobile-footer .q-tab
  border-radius: 14px
  transition: all .2s ease
  min-height: 56px
  color: #757575

.mobile-footer .q-tab:hover
  background: rgba(25,118,210,.08)
  color: $primary
  transform: translateY(-1px)

.mobile-footer .q-tab--active
  background: rgba(25,118,210,.12)
  color: $primary
  font-weight: 600

.mobile-footer .q-tab--active .q-icon
  transform: scale(1.12)

.mobile-footer .q-tab .q-icon
  transition: all .2s ease

.mobile-footer .q-tab__label
  font-size: 11px
  font-weight: 500
</style>
