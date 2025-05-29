<template>
  <div class="fullscreen flex flex-center column">
    <div class="q-mt-md text-h6">Oops... This page doesn't exist.</div>
    <div class="q-mt-sm">You may have taken a wrong turn.</div>
    <CustomButton
      class="q-mt-md"
      label="Try Again"
      customStyle="width: 250px"
      @click="reloadPage"
    />
  </div>
</template>

<script>
import CustomButton from 'src/components/elements/CustomButton.vue';

export default {
  components: {
    CustomButton
  },
  methods: {
    reloadPage() {
      // Call the reset function on the router
      this.$router.resetServerCheck()

      // Navigate to home to restart the process
      this.$router.replace('/')
    }
  }
};
</script>
