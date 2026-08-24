<template>
  <router-view />
</template>

<script setup>
import "leaflet/dist/leaflet.css";
import { onMounted, onUnmounted, ref } from "vue";
import { App as CapacitorApp } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { useRouter, useRoute } from "vue-router";
import Helper from "./services/helper/utils";

defineOptions({
  name: "App",
});

const router = useRouter();
const route = useRoute();
const navigationHistory = ref([]);

let backButtonListener;
let removeAfterEach;

onMounted(async () => {
  if (!Capacitor.isNativePlatform()) return;

  // Track navigation history
  removeAfterEach = router.afterEach(async (to) => {
    // Track pages (skip login)
    if (to.path !== '/auth/login') {
      // Avoid duplicates
      if (navigationHistory.value[navigationHistory.value.length - 1] !== to.path) {
        navigationHistory.value.push(to.path);
      }
    }

    // Login redirect logic
    if (to.path === "/auth/login") {
      try {
        const valid = await Helper.checkCookie();
        const token = valid ? await Helper.getCookie("token") : null;
        if (token && route.path !== '/auth/login') {
          router.replace("/");
        }
      } catch (error) {
        // Leave them on login
      }
    }
  });

  // Handle back button
  const handleBack = () => {
    const currentPath = route.path;

    // Exit app on login page
    if (currentPath === '/auth/login') {
      CapacitorApp.exitApp();
      return;
    }

    // Remove current from history
    if (navigationHistory.value.length > 0 &&
        navigationHistory.value[navigationHistory.value.length - 1] === currentPath) {
      navigationHistory.value.pop();
    }

    // Get previous page
    const previousPath = navigationHistory.value[navigationHistory.value.length - 1];

    if (previousPath) {
      // Go to previous page
      router.replace(previousPath);
    } else if (currentPath !== '/') {
      // No history, go home
      router.replace('/');
    } else {
      // Already on home, exit app
      CapacitorApp.exitApp();
    }
  };

  backButtonListener = await CapacitorApp.addListener("backButton", handleBack);
});

onUnmounted(() => {
  backButtonListener?.remove();
  removeAfterEach?.();
});
</script>
