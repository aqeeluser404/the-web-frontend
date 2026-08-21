<template>
  <router-view />
</template>

<script setup>
import "leaflet/dist/leaflet.css";
import { onMounted, onUnmounted } from "vue";
import { App as CapacitorApp } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { useRouter, useRoute } from "vue-router";
import Helper from "./services/helper/utils";

defineOptions({
  name: "App",
});

const router = useRouter();
const route = useRoute();

let backButtonListener;
let removeAfterEach;

onMounted(async () => {
  if (!Capacitor.isNativePlatform()) return;

  const handleBack = () => {
    const backPath = window.history.state?.back;

    // don't go back into login — treat it the same as "nothing behind us"
    if (backPath && backPath !== "/auth/login") {
      router.back();
    } else if (route.path !== "/") {
      router.push("/");
    } else {
      CapacitorApp.exitApp();
    }
  };

  backButtonListener = await CapacitorApp.addListener("backButton", handleBack);

  // Safety net — only bounce away from login if the person is ACTUALLY
  // logged in. This was previously unconditional, which caused a
  // login <-> home ping-pong for anyone who was correctly logged out.
  removeAfterEach = router.afterEach(async (to) => {
    if (to.path !== "/auth/login") return;

    try {
      const valid = await Helper.checkCookie();
      const token = valid ? await Helper.getCookie("token") : null;
      if (token) {
        router.replace("/");
      }
      // no token → genuinely logged out, let them stay on login
    } catch (error) {
      // couldn't verify — safest to just leave them on login
    }
  });
});

onUnmounted(() => {
  backButtonListener?.remove();
  removeAfterEach?.();
});
</script>
