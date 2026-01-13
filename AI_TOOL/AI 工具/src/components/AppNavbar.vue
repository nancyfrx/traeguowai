<template>
  <header
    class="sticky top-0 z-50 border-b border-white/10 bg-[#0B0F14]/75 backdrop-blur"
  >
    <nav class="mx-auto max-w-6xl px-4 py-4">
      <div class="flex items-center justify-between">
        <!-- Logo (left) -->
        <RouterLink to="/" class="group flex items-center gap-3">
          <span
            class="grid h-9 w-9 place-items-center rounded-xl border border-white/10 bg-white/5"
          >
            <span class="h-2 w-2 rounded-full bg-emerald-400"></span>
          </span>
          <div class="leading-tight">
            <div class="font-display text-lg text-stone-100">Article2Video</div>
            <div class="text-[11px] tracking-[0.22em] text-stone-200/50">
              AI STUDIO
            </div>
          </div>
        </RouterLink>

        <!-- Desktop nav -->
        <div class="hidden items-center gap-6 lg:flex">
          <RouterLink class="nav-link" to="/features">功能</RouterLink>
          <RouterLink class="nav-link" to="/pricing">定价</RouterLink>
          <RouterLink class="nav-link" to="/blog">博客</RouterLink>
        </div>

        <!-- Right actions -->
        <div class="hidden items-center gap-3 lg:flex">
          <template v-if="user">
            <div
              class="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-sm text-stone-100"
            >
              {{ displayName }}
            </div>
            <button class="btn btn-ghost" @click="emit('logout')">退出</button>
          </template>
          <template v-else>
            <button class="btn btn-ghost" @click="handleLogin">登录</button>
            <button class="btn btn-ghost" @click="handleTrial">免注册体验</button>
            <button
              class="btn bg-emerald-400 text-black hover:bg-emerald-300"
              @click="handleSignup"
            >
              注册
            </button>
          </template>
        </div>

        <!-- Mobile hamburger -->
        <button
          class="btn btn-ghost btn-square lg:hidden"
          aria-label="Open menu"
          @click="isOpen = !isOpen"
        >
          <Bars3Icon class="h-6 w-6" />
        </button>
      </div>

      <!-- Mobile panel -->
      <div v-if="isOpen" class="mt-4 lg:hidden">
        <div class="rounded-2xl border border-white/10 bg-white/5 p-3">
          <div class="flex flex-col">
            <RouterLink class="mobile-link" to="/features" @click="close">
              功能
            </RouterLink>
            <RouterLink class="mobile-link" to="/pricing" @click="close">
              定价
            </RouterLink>
            <RouterLink class="mobile-link" to="/blog" @click="close">
              博客
            </RouterLink>

            <div
              class="mt-3 flex items-center gap-2 border-t border-white/10 pt-3"
            >
              <template v-if="user">
                <div class="grow rounded-xl bg-white/5 px-3 py-2 text-left text-sm">
                  <p class="text-stone-100">{{ displayName }}</p>
                  <p class="text-[11px] text-stone-300/70">已登录</p>
                </div>
                <button class="btn btn-ghost" @click="handleLogoutMobile">
                  退出
                </button>
              </template>
              <template v-else>
                <button class="btn btn-ghost grow" @click="handleLogin">
                  登录
                </button>
                <button class="btn btn-ghost grow" @click="handleTrial">
                  免注册体验
                </button>
                <button
                  class="btn grow bg-emerald-400 text-black hover:bg-emerald-300"
                  @click="handleSignup"
                >
                  注册
                </button>
              </template>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { RouterLink, useRouter } from "vue-router";
import { Bars3Icon } from "@heroicons/vue/24/outline";
import type { CloudbaseUser } from "../utils/cloudbase";

const props = defineProps<{ user: CloudbaseUser | null }>();
const emit = defineEmits<{
  (e: "open-login"): void;
  (e: "open-signup"): void;
  (e: "guest-trial"): void;
  (e: "logout"): void;
}>();

const isOpen = ref(false);
const router = useRouter();

const close = () => {
  isOpen.value = false;
};

const displayName = computed(() => {
  if (!props.user) return "";
  return (
    (props.user as any)?.name ||
    (props.user as any)?.phone ||
    (props.user as any)?.email ||
    (props.user as any)?.uid ||
    "已登录"
  );
});

const handleLogin = () => {
  close();
  emit("open-login");
};

const handleSignup = () => {
  close();
  emit("open-signup");
};

const handleTrial = () => {
  close();
  emit("guest-trial");
};

const handleLogoutMobile = () => {
  close();
  emit("logout");
  void router.push("/");
};
</script>

<style scoped>
.nav-link {
  @apply text-sm text-stone-200/80 hover:text-stone-100 transition;
}

.mobile-link {
  @apply rounded-xl px-3 py-3 text-left text-sm text-stone-200/85 hover:bg-white/5 hover:text-stone-100 transition;
}
</style>
