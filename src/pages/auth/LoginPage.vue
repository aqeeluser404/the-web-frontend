<template>
  <q-page>
    <div class="background-wrapper">
      <q-img
        src="~src/assets/resources/home/hero/h3.jpg"
        alt="Hero Image"
        class="blurred-background"
      />
    </div>

    <div class="absolute-full column justify-center items-start text-black">
      <q-card bordered flat class="row constrain q-col-gutter-md">

        <!-- Left -->
        <div class="column justify-center q-pa-lg col-md-6 col-12">
          <router-link to="/" style="text-decoration: none; color: black;">
            <q-icon name="eva-arrow-back-outline" size="24px" color="black" />
          </router-link>
          <br />
          <q-form
            @submit="onSubmit"
            @reset="onReset"
            class="q-gutter-md"
            style="min-width: 280px;"
          >
            <q-input
              filled
              label-color="black"
              color="black"
              v-model="user.usernameOrEmail"
              label="Username or Email *"
            />
            <!-- <q-input
              filled
              label-color="black"
              color="black"
              v-model="user.password"
              label="Password *"
              type="password"
            /> -->

            <!-- <q-item class="input-container q-px-none">
              <div class="input-wrapper">
                <q-input
                  filled
                  label-color="black"
                  color="black"
                  :type="inputType"
                  label="Password"
                  v-model="user.password"
                  class="custom-input"
                  :style="{ width: inputWidth }"
                />
                <q-icon
                  :name="inputType === 'password' ? 'visibility' : 'visibility_off'"
                  class="eye-icon"
                  @click="toggleVisibility"
                />
              </div>
            </q-item> -->

            <VisibilityPasswordInput
              v-model="user.password"
              label="Password *"
              inputWidth="100%"
            />

            <div
              class="q-my-md q-mb-xl column text-left"
              style="transform: translateY(-1px);"
            >
              <router-link to="/forgot-password" style="text-decoration: none; color: black;">
                Forgot password?
              </router-link>

              <!-- <router-link to="/admin/auth/login" style="text-decoration: none; color: black;">
                Bypass Login
              </router-link> -->
            </div>


            <div>
              <CustomButton
                label="Sign In"
                class="q-mb-md"
              />
              <CustomButton
                label="Create Account"
                to="/auth/register"
                color="white"
                text-color="black"
              />
            </div>
          </q-form>
        </div>

        <!-- Right -->
        <div class="column q-pa-lg col-md-6 col-12 bg-black items-center justify-center right-section">
          <img :src="logoSrc" alt="logo" class="" >
        </div>
      </q-card>
    </div>
  </q-page>
</template>

<style scoped lang="sass">
.right-section
  display: flex
  @media (max-width: 1024px)
    display: none

.background-wrapper
  position: fixed
  width: 100%
  height: 100vh
  overflow: hidden
  z-index: -1

.blurred-background
  width: 100%
  height: 100%
  object-fit: cover
  filter: blur(8px)
  transform: scale(1.1)

.constrain
  max-width: 750px
  min-height: 450px
  width: 90%
  background: rgba(255, 255, 255, 0.85)
  backdrop-filter: blur(2px)

</style>

<script>
  import theWeb3d from '../../assets/resources/logos/web3dlogo.png'
  import UserService from 'src/services/UserService'
  import CustomButton from 'src/components/elements/CustomButton.vue'
  import VisibilityPasswordInput from 'src/components/elements/VisibilityPasswordInput.vue';

  export default {
    name: "LoginPage",

    data() {
      return {
        user: {
          usernameOrEmail: '',
          password: ''
        },
        confirmPassword: '',
        logoSrc: theWeb3d,
        inputType: 'password'
      }
    },
    components: {
      CustomButton, VisibilityPasswordInput
    },
    methods: {
      async onSubmit() {
        try {
          const response = await UserService.login(this.user.usernameOrEmail, this.user.password);
          if (response) {
            this.$q.dialog({
              title: 'Success',
              message: 'Login successful!',
              color: 'primary',
              persistent: true,
            }).onOk(() => {
              // this.$router.push('/units/apply/floor/1');
              this.$router.push('/');
            });
          }
          else {
            this.$q.notify({ type: 'negative', color: 'red', message: 'Login failed. Please try again!' });
            this.onReset();
          }
        } catch (error) {
          if (error.response && (error.response.status === 401 || error.response.status === 400)) {
            this.$q.notify({ type: 'negative', color: 'red', message: 'Login failed. Incorrect username or password.' });
          } else {
            this.$q.notify({ type: 'negative', color: 'red', message: 'Login failed. Please try again!' });
          }
          this.onReset();
        }
      },

      // async onSubmit() {
      //   try {
      //     const response = await UserService.login(this.user.usernameOrEmail, this.user.password);

      //     if (response === 'otp_required' || response.status === 'otp_required') {
      //       this.$q.dialog({
      //         title: 'OTP Required',
      //         message: 'Check your email for the OTP code.',
      //         color: 'primary',
      //         persistent: true,
      //       }).onOk(() => {
      //         this.$router.push('/auth/otp-verification');
      //       });
      //     }

      //     if (response) {
      //       this.$q.dialog({
      //         title: 'Success',
      //         message: 'Login successful!',
      //         color: 'primary',
      //         persistent: true,
      //       }).onOk(() => {
      //         this.$router.push('/units/apply/floor/1');
      //       });
      //     }
      //     else {
      //       this.$q.notify({ type: 'negative', color: 'red', message: 'Login failed. Please try again!' });
      //       this.onReset();
      //     }
      //   } catch (error) {
      //     if (error.response && (error.response.status === 401 || error.response.status === 400)) {
      //       this.$q.notify({ type: 'negative', color: 'red', message: 'Login failed. Incorrect username or password.' });
      //     } else {
      //       this.$q.notify({ type: 'negative', color: 'red', message: 'Login failed. Please try again!' });
      //     }
      //     this.onReset();
      //   }
      // },

      toggleVisibility() {
        this.inputType = this.inputType === "password" ? "text" : "password";
      },
      onReset() {
        this.user.usernameOrEmail = '';
        this.user.password = '';
      },

      onReset() {
        this.user.usernameOrEmail = '',
        this.user.password = ''
      }
    }
  }
</script>


