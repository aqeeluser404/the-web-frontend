<template>
  <q-page>
    <q-img src="" alt="Hero Image" style="width: 100%; height: 100vh;" >
      <div class="absolute-full column justify-center items-start text-black">
        <q-card bordered flat class="column q-pa-lg constrain" style="">
          <div class="row justify-center">
            <p class="q-mb-md text-h6">RETURNING CUSTOMER</p>
          </div>
          <br>
          <q-form @submit="onSubmit" @reset="onReset" class="q-gutter-md" style="min-width: 280px;">
            <q-input filled label-color=black color="black" v-model="user.usernameOrEmail" label="Username or Email *" />
            <q-input filled label-color=black color="black" v-model="user.password" label="Password *" type="password" />

            <div class="q-my-none column text-right" style="transform: translateY(-1px);">
              <router-link to="/forgot-password" style="text-decoration: underline; color: black;">
                Forgot password?
              </router-link>
              <router-link to="/" style="text-decoration: underline; color: black;">
                Go Back
              </router-link>
            </div>
            <div class="">
              <CustomButton
                label="Sign In"
                color="brown"
                text-color="white"
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
        </q-card>

        <q-card flat class="constrain">

        </q-card>

        <!-- <div class="text-right q-my-none" style="transform: translateY(-1px);">
              <router-link to="/forgot-password" style="text-decoration: underline; color: black;">
                Forgot password?
              </router-link>
            </div> -->
      </div>
    </q-img>
  </q-page>
</template>

<script>
  import UserService from 'src/services/UserService'
  import CustomButton from 'src/components/CustomButton.vue'

  export default {
    name: "LoginPage",

    data() {
      return {
        user: {
          usernameOrEmail: '',
          password: ''
        }
      }
    },
    components: {
      CustomButton
    },
    methods: {
      async onSubmit() {
        try {
          const response = await UserService.login(this.user.usernameOrEmail, this.user.password);
          // if (response.status === 200) {
          if (response) {
            this.$q.notify({ type: 'positive', color: 'primary', message: 'Login successful!' });
            this.$router.push('/');
          }
          else {
            // Handle unexpected status codes
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

      onReset() {
        this.user.usernameOrEmail = '',
        this.user.password = ''
      }
    }
  }
</script>

