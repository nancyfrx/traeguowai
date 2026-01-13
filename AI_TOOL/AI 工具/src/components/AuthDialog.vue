<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="open"
        class="fixed inset-0 z-[100] flex items-center justify-center px-4"
      >
        <div
          class="absolute inset-0 bg-black/60 backdrop-blur-sm"
          @click="emit('close')"
        ></div>

        <div
          class="relative w-full max-w-3xl overflow-hidden rounded-3xl border border-white/10 bg-[#0D131B]/95 shadow-2xl ring-1 ring-white/10"
        >
          <div class="absolute -left-20 -top-16 h-48 w-48 rounded-full bg-emerald-400/15 blur-3xl"></div>
          <div class="absolute -right-16 bottom-0 h-48 w-48 rounded-full bg-amber-400/12 blur-3xl"></div>

          <div class="relative grid grid-cols-1 lg:grid-cols-5">
            <div class="lg:col-span-2 border-r border-white/10 bg-white/5 p-6">
              <p class="text-xs tracking-[0.22em] text-emerald-300/80">ACCESS</p>
              <h3 class="mt-3 font-display text-2xl text-stone-100">
                登录 / 注册
              </h3>
              <p class="mt-3 text-sm leading-relaxed text-stone-200/70">
                使用手机号验证码完成快速登录。如果尚未开通验证码模板，请先在控制台完成配置。
              </p>

              <ul class="mt-5 space-y-3 text-sm text-stone-200/75">
                <li class="flex items-start gap-2">
                  <span class="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-300"></span>
                  支持验证码登录与注册，成功后自动保持会话。
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-300"></span>
                  登录状态变化实时更新，便于后续页面使用用户信息。
                </li>
                <li class="flex items-start gap-2">
                  <span class="mt-1 h-1.5 w-1.5 rounded-full bg-emerald-300"></span>
                  退出登录后会清理本地登录态。
                </li>
              </ul>
            </div>

            <div class="lg:col-span-3 p-6 lg:p-8">
              <div class="flex items-center gap-3 text-sm text-stone-200/70">
                <button
                  :class="[
                    'rounded-full px-3 py-1 transition',
                    activeTab === 'login'
                      ? 'bg-emerald-400 text-black'
                      : 'bg-white/5 text-stone-200/80 hover:bg-white/10',
                  ]"
                  @click="setTab('login')"
                >
                  登录
                </button>
                <button
                  :class="[
                    'rounded-full px-3 py-1 transition',
                    activeTab === 'signup'
                      ? 'bg-emerald-400 text-black'
                      : 'bg-white/5 text-stone-200/80 hover:bg-white/10',
                  ]"
                  @click="setTab('signup')"
                >
                  注册
                </button>
                <span class="ml-auto text-xs text-amber-200/80" v-if="hint">{{ hint }}</span>
              </div>

              <form class="mt-6 space-y-4" @submit.prevent="handleSubmit">
                <div class="space-y-2">
                  <label class="text-sm text-stone-200/80">手机号（仅限中国大陆）</label>
                  <div
                    class="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2 focus-within:border-emerald-300/60"
                  >
                    <span class="text-xs text-stone-200/60">+86</span>
                    <input
                      v-model.trim="phone"
                      type="tel"
                      inputmode="numeric"
                      autocomplete="tel"
                      class="w-full bg-transparent text-sm text-stone-100 outline-none placeholder:text-stone-500"
                      placeholder="请输入手机号"
                      required
                    />
                  </div>
                </div>

                <div class="grid grid-cols-1 gap-3 md:grid-cols-3">
                  <div class="md:col-span-2 space-y-2">
                    <label class="text-sm text-stone-200/80">验证码</label>
                    <input
                      v-model.trim="code"
                      type="text"
                      inputmode="numeric"
                      autocomplete="one-time-code"
                      maxlength="6"
                      class="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-stone-100 outline-none placeholder:text-stone-500 focus:border-emerald-300/60"
                      placeholder="输入短信验证码"
                      required
                    />
                  </div>
                  <div class="flex items-end">
                    <button
                      type="button"
                      class="w-full rounded-xl border border-emerald-300/40 bg-emerald-400 text-sm font-semibold text-[#0B0F14] transition hover:bg-emerald-300 disabled:cursor-not-allowed disabled:border-white/20 disabled:bg-white/10 disabled:text-stone-300"
                      :disabled="isSending || countdown > 0"
                      @click="sendCode"
                    >
                      {{ countdown > 0 ? `${countdown}s 后重试` : isSending ? '发送中…' : '获取验证码' }}
                    </button>
                  </div>
                </div>

                <div v-if="activeTab === 'signup'" class="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div class="space-y-2">
                    <label class="text-sm text-stone-200/80">昵称（可选）</label>
                    <input
                      v-model.trim="name"
                      type="text"
                      class="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-stone-100 outline-none placeholder:text-stone-500 focus:border-emerald-300/60"
                      placeholder="展示给团队成员"
                    />
                  </div>
                  <div class="space-y-2">
                    <label class="text-sm text-stone-200/80">密码（可选）</label>
                    <input
                      v-model.trim="password"
                      type="password"
                      autocomplete="new-password"
                      class="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-stone-100 outline-none placeholder:text-stone-500 focus:border-emerald-300/60"
                      placeholder="设置密码以便账户找回"
                    />
                  </div>
                </div>

                <div class="flex items-center justify-between text-xs text-stone-400">
                  <span>登录即默认同意隐私与使用条款。</span>
                  <button
                    type="button"
                    class="text-emerald-300 hover:text-emerald-200"
                    @click="setTab(activeTab === 'login' ? 'signup' : 'login')"
                  >
                    {{ activeTab === 'login' ? '没有账号？去注册' : '已有账号？去登录' }}
                  </button>
                </div>

                <div class="space-y-2">
                  <button
                    type="submit"
                    class="w-full rounded-xl bg-gradient-to-r from-emerald-400 to-amber-300 px-4 py-3 text-sm font-semibold text-[#0B0F14] shadow-lg shadow-emerald-500/20 transition hover:translate-y-[-1px] disabled:cursor-not-allowed disabled:from-white/20 disabled:to-white/20 disabled:text-stone-300"
                    :disabled="pending"
                  >
                    {{ pending ? '处理中…' : activeTab === 'login' ? '验证码登录' : '验证码注册并登录' }}
                  </button>
                  <p v-if="error" class="text-sm text-amber-200/90">{{ error }}</p>
                  <p v-if="success" class="text-sm text-emerald-200/90">{{ success }}</p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { computed, ref, watch } from "vue";
import {
  getCurrentUser,
  loginWithSms,
  sendSmsCode,
  signupWithSms,
} from "../utils/cloudbase";
import type { CloudbaseUser, VerificationInfo } from "../utils/cloudbase";

type AuthDialogMode = "login" | "signup";

type Props = {
  open: boolean;
  mode: AuthDialogMode;
};

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: "close"): void;
  (e: "success", user: CloudbaseUser): void;
}>();

const phone = ref("");
const code = ref("");
const name = ref("");
const password = ref("");
const pending = ref(false);
const isSending = ref(false);
const countdown = ref(0);
const error = ref("");
const success = ref("");
const verificationInfo = ref<VerificationInfo | null>(null);
const activeTab = ref<AuthDialogMode>(props.mode || "login");

const hint = computed(() =>
  activeTab.value === "signup"
    ? "新账号会自动完成登录"
    : "输入验证码即可快捷登录",
);

const resetState = () => {
  phone.value = "";
  code.value = "";
  name.value = "";
  password.value = "";
  pending.value = false;
  isSending.value = false;
  countdown.value = 0;
  error.value = "";
  success.value = "";
  verificationInfo.value = null;
};

watch(
  () => props.open,
  (val) => {
    if (val) {
      resetState();
      activeTab.value = props.mode || "login";
    }
  },
);

watch(
  () => props.mode,
  (val) => {
    activeTab.value = val;
  },
);

const setTab = (mode: AuthDialogMode) => {
  activeTab.value = mode;
  error.value = "";
  success.value = "";
};

const startCountdown = () => {
  countdown.value = 60;
  const timer = setInterval(() => {
    countdown.value -= 1;
    if (countdown.value <= 0) {
      clearInterval(timer);
    }
  }, 1000);
};

const sendCode = async () => {
  if (!phone.value) {
    error.value = "请先输入手机号";
    return;
  }
  try {
    error.value = "";
    isSending.value = true;
    verificationInfo.value = await sendSmsCode(phone.value);
    startCountdown();
  } catch (err: any) {
    error.value = err?.message || "发送验证码失败，请重试";
  } finally {
    isSending.value = false;
  }
};

const handleSubmit = async () => {
  if (!verificationInfo.value) {
    error.value = "请先获取验证码";
    return;
  }
  if (!code.value) {
    error.value = "请输入验证码";
    return;
  }

  pending.value = true;
  error.value = "";
  success.value = "";

  try {
    if (activeTab.value === "login") {
      await loginWithSms({
        phone: phone.value,
        verificationInfo: verificationInfo.value,
        verificationCode: code.value,
      });
    } else {
      await signupWithSms({
        phone: phone.value,
        verificationInfo: verificationInfo.value,
        verificationCode: code.value,
        name: name.value,
        password: password.value || undefined,
        username: phone.value,
      });
    }

    const current = await getCurrentUser();
    if (current) {
      success.value = activeTab.value === "login" ? "登录成功" : "注册并登录成功";
      emit("success", current);
    }
  } catch (err: any) {
    const messageMap: Record<string, string> = {
      INVALID_CREDENTIALS: "验证码或凭证无效，请重试",
      VERIFICATION_CODE_EXPIRED: "验证码已过期，请重新获取",
      VERIFICATION_CODE_INVALID: "验证码错误，请重试",
      RATE_LIMIT_EXCEEDED: "操作过于频繁，请稍后再试",
      CAPTCHA_REQUIRED: "触发风控，请完成图形验证码后重试",
      USER_ALREADY_EXISTS: "账号已存在，请直接登录",
      USER_NOT_FOUND: "账号不存在，请注册",
    };
    error.value = messageMap[err?.code as string] || err?.message || "请求失败，请稍后再试";
  } finally {
    pending.value = false;
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
