<template>
  <div class="min-h-screen bg-[#0B0F14] text-[#E7E5E4]">
    <AppNavbar
      :user="user"
      @open-login="openAuth('login')"
      @open-signup="openAuth('signup')"
      @guest-trial="signInTrial"
      @logout="handleLogout"
    />
    <main>
      <RouterView />
    </main>
    <AppFooter />
    <AuthDialog
      :open="isAuthDialogOpen"
      :mode="authMode"
      @close="closeAuth"
      @success="handleAuthSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, provide, ref } from "vue";
import { RouterView } from "vue-router";
import AppNavbar from "./components/AppNavbar.vue";
import AppFooter from "./components/HomeFooter.vue";
import AuthDialog from "./components/AuthDialog.vue";
import {
  getCurrentUser,
  listenLoginState,
  logout,
  signInGuest,
  getTrialExpireAt,
  clearTrialExpire,
} from "./utils/cloudbase";
import type { CloudbaseUser } from "./utils/cloudbase";

type AuthDialogMode = "login" | "signup";

const user = ref<CloudbaseUser | null>(null);
const isAuthDialogOpen = ref(false);
const authMode = ref<AuthDialogMode>("login");

const openAuth = (mode: AuthDialogMode = "login") => {
  authMode.value = mode;
  isAuthDialogOpen.value = true;
};

const closeAuth = () => {
  isAuthDialogOpen.value = false;
};

provide("openAuthDialog", openAuth);

const handleAuthSuccess = (authUser: CloudbaseUser) => {
  user.value = authUser;
  closeAuth();
};

const signInTrial = async () => {
  try {
    const current = await signInGuest();
    if (current) user.value = current;
  } catch (error) {
    console.error("游客登录失败", error);
  }
};

provide("signInTrial", signInTrial);

const handleLogout = async () => {
  await logout();
  user.value = null;
  clearTrialExpire();
};

onMounted(async () => {
  try {
    const current = await getCurrentUser();
    if (current) {
      user.value = current;
    } else {
      const expireAt = getTrialExpireAt();
      if (expireAt && expireAt > Date.now()) {
        await signInTrial();
      } else if (expireAt && expireAt <= Date.now()) {
        clearTrialExpire();
      }
    }
  } catch (error) {
    console.error("获取当前用户失败", error);
  }

  listenLoginState(async (params) => {
    try {
      const eventType = (params as any)?.data?.eventType;
      if (eventType === "sign_out") {
        user.value = null;
        return;
      }
      const current = await getCurrentUser();
      if (current) user.value = current;
    } catch (error) {
      console.error("监听登录状态变化失败", error);
    }
  });
});
</script>
