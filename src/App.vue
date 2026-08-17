<template>
  <router-view />
</template>

<script setup>
import "leaflet/dist/leaflet.css";
import { onMounted, onUnmounted } from "vue";
import { App as CapacitorApp } from "@capacitor/app";
import { Capacitor } from "@capacitor/core";
import { useRouter, useRoute } from "vue-router";

defineOptions({
  name: "App",
});

const router = useRouter();
const route = useRoute();

let backButtonListener;

onMounted(async () => {
  if (!Capacitor.isNativePlatform()) return;

  const handleBack = () => {
    if (window.history.state?.back === "/auth/login") {
      // Never let hardware back land on the login page
      if (route.path !== "/") {
        router.push("/");
      } else {
        CapacitorApp.exitApp();
      }
      return;
    }

    if (window.history.state?.back) {
      router.back();
    } else if (route.path !== "/") {
      router.push("/");
    } else {
      CapacitorApp.exitApp();
    }
  };

  // window.dispatchEvent(new CustomEvent('capacitor-backbutton-test'))
  backButtonListener = await CapacitorApp.addListener("backButton", handleBack);

  // DEV-ONLY: simulate hardware back button with Escape key in browser testing
  if (process.env.DEV) {
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") handleBack();
    });
  }
});

onUnmounted(() => {
  backButtonListener?.remove();
});
</script>
