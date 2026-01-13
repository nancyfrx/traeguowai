<template>
  <div class="grain">
    <!-- Hero -->
    <section class="relative overflow-hidden pb-16 pt-12 md:pt-16">
      <div class="pointer-events-none absolute inset-0">
        <div
          class="absolute -left-24 top-16 h-80 w-80 rounded-full bg-emerald-500/15 blur-3xl"
        ></div>
        <div
          class="absolute -right-28 top-52 h-96 w-96 rounded-full bg-orange-500/12 blur-3xl"
        ></div>
        <div
          class="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,rgba(34,197,94,0.14),transparent_55%),radial-gradient(circle_at_80%_35%,rgba(249,115,22,0.12),transparent_55%)]"
        ></div>
        <div
          class="absolute inset-0 opacity-20 [background-image:linear-gradient(to_right,rgba(231,229,228,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(231,229,228,0.06)_1px,transparent_1px)] [background-size:42px_42px]"
        ></div>
      </div>

      <div class="relative mx-auto max-w-6xl px-4">
        <div class="grid grid-cols-12 gap-6">
          <div
            class="col-span-12 pt-4 md:pt-10 lg:col-span-6 lg:col-start-2"
          >
            <p
              class="text-xs tracking-[0.22em] text-emerald-300/80 md:text-sm"
            >
              ARTICLE → VIDEO
            </p>
            <h1
              class="mt-4 font-display text-4xl leading-[1.05] text-stone-100 md:text-6xl"
            >
              用 AI 帮你快速生成视频内容。
            </h1>
            <p class="mt-5 max-w-xl text-base leading-relaxed text-stone-200/80">
              只需上传文章，立即获得专业视频内容。让你的创作更高效、便捷。
            </p>

            <div class="mt-8 flex flex-wrap items-center gap-3">
              <button
                class="btn bg-emerald-400 text-black hover:bg-emerald-300"
                @click="openSignup"
              >
                立即免费试用
              </button>
              <button class="btn btn-outline" @click="go('features')">
                了解功能
              </button>
              <span
                class="ml-1 text-xs tracking-wide text-stone-200/60 md:ml-3"
              >
                30 秒生成可发布草稿
              </span>
            </div>

            <div class="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-xs">
              <span class="text-stone-200/70">- 自动分镜</span>
              <span class="text-stone-200/70">- 字幕与版式</span>
              <span class="text-stone-200/70">- 语音合成</span>
              <span class="text-stone-200/70">- 模板切换</span>
            </div>
          </div>

          <!-- Right visual / mock panel -->
          <div class="col-span-12 lg:col-span-4 lg:col-start-8">
            <div
              class="relative mt-10 overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/0 p-5 backdrop-blur"
            >
              <div
                class="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-emerald-400/20 blur-2xl"
              ></div>
              <div
                class="absolute -bottom-12 -left-10 h-44 w-44 rounded-full bg-orange-400/15 blur-2xl"
              ></div>

              <div class="relative">
                <div class="flex items-center justify-between">
                  <div class="flex items-center gap-2">
                    <div
                      class="h-2.5 w-2.5 rounded-full bg-emerald-400"
                    ></div>
                    <p class="text-xs tracking-[0.22em] text-stone-200/70">
                      GENERATION PIPELINE
                    </p>
                  </div>
                  <p class="text-xs text-stone-200/50">v1.0</p>
                </div>

                <div class="mt-5 space-y-3">
                  <div
                    class="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <p class="text-[11px] tracking-[0.18em] text-stone-200/60">
                      INPUT
                    </p>
                    <p class="mt-2 text-sm text-stone-100">
                      文章结构解析 / 关键信息提炼
                    </p>
                  </div>

                  <div
                    class="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <p class="text-[11px] tracking-[0.18em] text-stone-200/60">
                      STORYBOARD
                    </p>
                    <p class="mt-2 text-sm text-stone-100">
                      分镜节奏 / 字幕排版 / 画面提示
                    </p>
                  </div>

                  <div
                    class="rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <p class="text-[11px] tracking-[0.18em] text-stone-200/60">
                      OUTPUT
                    </p>
                    <p class="mt-2 text-sm text-stone-100">
                      生成视频草稿 / 一键导出
                    </p>
                  </div>
                </div>

                <div class="mt-5 flex items-center justify-between">
                  <p class="text-xs text-stone-200/60">
                    适配短视频 / 资讯 / 教育
                  </p>
                  <div
                    class="animate-floaty rounded-full bg-white/5 px-3 py-1 text-xs text-emerald-300/90"
                  >
                    ready
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section id="features" class="relative mx-auto max-w-6xl px-4 py-14">
      <div class="grid grid-cols-12 gap-6">
        <div class="col-span-12 lg:col-span-4 lg:col-start-2">
          <p class="text-xs tracking-[0.22em] text-emerald-300/80">FEATURES</p>
          <h2 class="mt-4 font-display text-3xl text-stone-100">
            核心能力，像工具一样可靠
          </h2>
          <p class="mt-4 text-sm leading-relaxed text-stone-200/75">
            把“创作过程”变成可复用的生产线：输入文章、选择模板、生成语音与字幕，最后导出。
          </p>
        </div>

        <div class="col-span-12 lg:col-span-6">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div
              class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <h3 class="font-display text-lg text-stone-100">
                文章智能转视频
              </h3>
              <p class="mt-2 text-sm leading-relaxed text-stone-200/70">
                一键上传文章，自动生成专业视频内容，省时省力。
              </p>
              <RouterLink
                to="/features"
                class="btn btn-ghost mt-4 px-0 text-emerald-300"
              >
                了解更多
              </RouterLink>
            </div>

            <div
              class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <h3 class="font-display text-lg text-stone-100">
                多样化视频模板
              </h3>
              <p class="mt-2 text-sm leading-relaxed text-stone-200/70">
                提供多种风格模板，满足不同需求，轻松制作定制视频。
              </p>
              <RouterLink
                to="/features"
                class="btn btn-ghost mt-4 px-0 text-emerald-300"
              >
                了解更多
              </RouterLink>
            </div>

            <div
              class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur md:col-span-2"
            >
              <div class="flex flex-col gap-4 md:flex-row md:items-end">
                <div class="grow">
                  <h3 class="font-display text-lg text-stone-100">
                    高质量语音合成
                  </h3>
                  <p class="mt-2 text-sm leading-relaxed text-stone-200/70">
                    内置高品质语音合成，确保视频内容声音清晰、自然。
                  </p>
                </div>
                <RouterLink
                  to="/features"
                  class="btn btn-outline border-white/20"
                >
                  了解更多
                </RouterLink>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Pricing -->
    <section
      id="pricing"
      class="relative mx-auto max-w-6xl px-4 pb-16 pt-10"
    >
      <div class="grid grid-cols-12 gap-6">
        <div class="col-span-12 lg:col-span-4 lg:col-start-2">
          <p class="text-xs tracking-[0.22em] text-emerald-300/80">PRICING</p>
          <h2 class="mt-4 font-display text-3xl text-stone-100">
            简洁明确的订阅计划
          </h2>
          <p class="mt-4 text-sm leading-relaxed text-stone-200/75">
            从试用到企业规模化生产，按需求选择。你也可以在定价页查看更完整说明。
          </p>
          <RouterLink to="/pricing" class="btn btn-ghost mt-6 px-0 text-emerald-300">
            查看完整定价 →
          </RouterLink>
        </div>

        <div class="col-span-12 lg:col-span-6">
          <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div
              class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <h3 class="font-display text-lg text-stone-100">免费试用</h3>
              <p class="mt-2 text-xs tracking-wide text-stone-200/60">
                初次尝试
              </p>
              <div class="mt-5 font-display text-3xl text-stone-100">¥0</div>
              <ul class="mt-5 space-y-2 text-sm text-stone-200/75">
                <li>- 基础功能</li>
                <li>- 少量模板</li>
                <li>- 适合体验</li>
              </ul>
              <button class="btn btn-ghost mt-6 w-full" @click="go('cta')">
                立即试用
              </button>
            </div>

            <div
              class="relative rounded-2xl border border-emerald-400/30 bg-gradient-to-b from-emerald-500/15 to-white/5 p-6 backdrop-blur"
            >
              <div
                class="absolute -top-3 right-4 rounded-full bg-emerald-400 px-3 py-1 text-[11px] font-semibold tracking-wide text-black"
              >
                推荐
              </div>
              <h3 class="font-display text-lg text-stone-100">专业版</h3>
              <p class="mt-2 text-xs tracking-wide text-stone-200/60">
                更多模板/次数
              </p>
              <div class="mt-5 font-display text-3xl text-stone-100">¥99</div>
              <ul class="mt-5 space-y-2 text-sm text-stone-200/75">
                <li>- 更多视频模板</li>
                <li>- 更高生成次数</li>
                <li>- 高清导出</li>
              </ul>
              <button
                class="btn mt-6 w-full bg-emerald-400 text-black hover:bg-emerald-300"
                @click="go('cta')"
              >
                开始生成视频
              </button>
            </div>

            <div
              class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <h3 class="font-display text-lg text-stone-100">企业版</h3>
              <p class="mt-2 text-xs tracking-wide text-stone-200/60">
                大规模使用
              </p>
              <div class="mt-5 font-display text-3xl text-stone-100">定制</div>
              <ul class="mt-5 space-y-2 text-sm text-stone-200/75">
                <li>- 高级定制功能</li>
                <li>- 团队协作</li>
                <li>- 专属支持</li>
              </ul>
              <button class="btn btn-outline mt-6 w-full" @click="go('cta')">
                联系我们
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ -->
    <section id="faq" class="relative mx-auto max-w-6xl px-4 py-14">
      <div class="grid grid-cols-12 gap-6">
        <div class="col-span-12 lg:col-span-4 lg:col-start-2">
          <p class="text-xs tracking-[0.22em] text-emerald-300/80">FAQ</p>
          <h2 class="mt-4 font-display text-3xl text-stone-100">
            常见问题
          </h2>
          <p class="mt-4 text-sm leading-relaxed text-stone-200/75">
            用更少的犹豫完成注册：清晰的订阅、支付与数据安全说明。
          </p>
        </div>

        <div class="col-span-12 lg:col-span-6">
          <div class="space-y-3">
            <div
              class="collapse collapse-arrow rounded-2xl border border-white/10 bg-white/5"
            >
              <input type="radio" name="faq" checked />
              <div class="collapse-title font-display text-base text-stone-100">
                如何取消我的订阅？
              </div>
              <div class="collapse-content text-sm leading-relaxed text-stone-200/75">
                你可以随时在账户设置中取消订阅，取消后不会再收费。
              </div>
            </div>

            <div
              class="collapse collapse-arrow rounded-2xl border border-white/10 bg-white/5"
            >
              <input type="radio" name="faq" />
              <div class="collapse-title font-display text-base text-stone-100">
                支持哪些支付方式？
              </div>
              <div class="collapse-content text-sm leading-relaxed text-stone-200/75">
                我们支持信用卡、支付宝、微信支付等方式。
              </div>
            </div>

            <div
              class="collapse collapse-arrow rounded-2xl border border-white/10 bg-white/5"
            >
              <input type="radio" name="faq" />
              <div class="collapse-title font-display text-base text-stone-100">
                数据是否安全？
              </div>
              <div class="collapse-content text-sm leading-relaxed text-stone-200/75">
                所有的数据传输都使用加密协议，确保用户数据安全。
              </div>
            </div>

            <div
              class="collapse collapse-arrow rounded-2xl border border-white/10 bg-white/5"
            >
              <input type="radio" name="faq" />
              <div class="collapse-title font-display text-base text-stone-100">
                如何联系我们？
              </div>
              <div class="collapse-content text-sm leading-relaxed text-stone-200/75">
                你可以通过邮箱联系我们的客户支持团队，我们会尽快回复。
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section id="cta" class="relative overflow-hidden pb-20 pt-8">
      <div class="pointer-events-none absolute inset-0">
        <div
          class="absolute inset-0 bg-[radial-gradient(circle_at_35%_30%,rgba(34,197,94,0.18),transparent_55%),radial-gradient(circle_at_70%_60%,rgba(249,115,22,0.12),transparent_55%)]"
        ></div>
        <div
          class="absolute inset-0 opacity-20 [background-image:linear-gradient(60deg,rgba(231,229,228,0.08)_1px,transparent_1px)] [background-size:28px_28px]"
        ></div>
      </div>

      <div class="relative mx-auto max-w-6xl px-4">
        <div
          class="grid grid-cols-12 gap-6 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur md:p-10"
        >
          <div class="col-span-12 lg:col-span-7 lg:col-start-2">
            <p class="text-xs tracking-[0.22em] text-emerald-300/80">READY</p>
            <h2 class="mt-4 font-display text-3xl text-stone-100 md:text-4xl">
              准备好提升你的内容创作了吗？
            </h2>
            <p class="mt-4 text-sm leading-relaxed text-stone-200/75">
              加入我们，体验文章到视频的魔法，立即开始。
            </p>

            <div class="mt-7 flex flex-wrap gap-3">
              <button
                class="btn bg-emerald-400 text-black hover:bg-emerald-300"
                @click="openSignup"
              >
                立即免费注册
              </button>
              <button class="btn btn-outline" @click="openTrial">免注册体验一个月</button>
              <button class="btn btn-ghost" @click="openLogin">登录查看示例</button>
            </div>
          </div>

          <div class="col-span-12 lg:col-span-3">
            <div
              class="rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/0 p-5"
            >
              <p class="text-xs tracking-[0.2em] text-stone-200/70">
                WHAT YOU GET
              </p>
              <ul class="mt-4 space-y-2 text-sm text-stone-200/75">
                <li>- 文章结构自动提炼</li>
                <li>- 模板一键切换</li>
                <li>- 语音/字幕自动对齐</li>
                <li>- 可直接导出发布</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { inject, nextTick, onMounted } from "vue";
import { RouterLink, useRoute, useRouter } from "vue-router";

type AuthDialogMode = "login" | "signup";

const route = useRoute();
const router = useRouter();
const openAuthDialog = inject<(mode: AuthDialogMode) => void>("openAuthDialog");

const scrollToId = (id: string) => {
  const el = document.getElementById(id);
  if (!el) return;

  const y = el.getBoundingClientRect().top + window.scrollY;
  window.scrollTo({ top: Math.max(0, y - 84), behavior: "smooth" });
};

const go = async (id: string) => {
  if (route.path !== "/") {
    await router.push({ path: "/", query: { section: id } });
    return;
  }
  scrollToId(id);
};

const signInTrial = inject<() => void>("signInTrial");

const openSignup = () => {
  if (openAuthDialog) {
    openAuthDialog("signup");
  } else {
    void go("cta");
  }
};

const openLogin = () => {
  if (openAuthDialog) {
    openAuthDialog("login");
  } else {
    void go("cta");
  }
};

const openTrial = () => {
  if (signInTrial) {
    signInTrial();
  }
};

onMounted(async () => {
  const section = route.query.section;
  if (typeof section === "string" && section) {
    await nextTick();
    scrollToId(section);
  }
});
</script>
