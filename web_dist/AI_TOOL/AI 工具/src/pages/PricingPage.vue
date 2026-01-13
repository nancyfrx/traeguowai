<template>
  <div class="relative overflow-hidden">
    <div class="pointer-events-none absolute inset-0">
      <div
        class="absolute -left-32 top-14 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl"
      ></div>
      <div
        class="absolute -right-24 top-64 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl"
      ></div>
      <div
        class="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),transparent_40%,rgba(255,255,255,0.03))]"
      ></div>
    </div>

    <div class="relative mx-auto max-w-6xl px-4 pb-24 pt-16">
      <div class="grid grid-cols-12 gap-6">
        <div class="col-span-12 lg:col-span-8 lg:col-start-2">
          <p class="text-xs tracking-[0.22em] text-emerald-300/80">PRICING</p>
          <h1 class="mt-4 font-display text-4xl text-stone-100 md:text-5xl">
            为不同规模的创作团队定价
          </h1>
          <p class="mt-5 max-w-2xl text-base leading-relaxed text-stone-200/80">
            这里提供更完整的价格与功能差异说明（可后续接入真实支付/订阅）。
          </p>

          <div class="mt-10 grid grid-cols-1 gap-4 md:grid-cols-3">
            <div
              class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <h3 class="font-display text-lg text-stone-100">免费试用</h3>
              <p class="mt-2 text-sm text-stone-200/70">适合初次尝试</p>
              <div class="mt-5 text-3xl font-display text-stone-100">¥0</div>
              <ul class="mt-5 space-y-2 text-sm text-stone-200/75">
                <li>- 基础转视频能力</li>
                <li>- 标准模板（少量）</li>
                <li>- 导出带水印</li>
              </ul>
              <button class="btn btn-ghost mt-6 w-full">开始试用</button>
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
              <p class="mt-2 text-sm text-stone-200/70">高频创作者首选</p>
              <div class="mt-5 text-3xl font-display text-stone-100">¥99</div>
              <ul class="mt-5 space-y-2 text-sm text-stone-200/75">
                <li>- 更多模板与样式</li>
                <li>- 更高生成次数</li>
                <li>- 高清导出</li>
              </ul>
              <button class="btn mt-6 w-full bg-emerald-400 text-black hover:bg-emerald-300">
                立即升级
              </button>
            </div>

            <div
              class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <h3 class="font-display text-lg text-stone-100">企业版</h3>
              <p class="mt-2 text-sm text-stone-200/70">面向规模化生产</p>
              <div class="mt-5 text-3xl font-display text-stone-100">联系销售</div>
              <ul class="mt-5 space-y-2 text-sm text-stone-200/75">
                <li>- 高级定制与私有模板</li>
                <li>- 团队协作与权限</li>
                <li>- SLA / 专属支持</li>
              </ul>
              <button class="btn btn-outline mt-6 w-full">预约演示</button>
            </div>
          </div>

          <div class="mt-12 flex flex-wrap gap-3">
            <RouterLink to="/" class="btn btn-ghost">返回首页</RouterLink>
            <RouterLink to="/features" class="btn btn-outline">查看功能</RouterLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>
