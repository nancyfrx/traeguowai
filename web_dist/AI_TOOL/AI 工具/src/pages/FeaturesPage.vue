<template>
  <div class="relative overflow-hidden">
    <div class="pointer-events-none absolute inset-0">
      <div
        class="absolute -left-24 top-20 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl"
      ></div>
      <div
        class="absolute -right-28 top-56 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl"
      ></div>
      <div class="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(34,197,94,0.10),transparent_50%),radial-gradient(circle_at_80%_30%,rgba(249,115,22,0.10),transparent_55%)]"></div>
    </div>

    <div class="relative mx-auto max-w-6xl px-4 pb-20 pt-16">
      <div class="grid grid-cols-12 gap-6">
        <div class="col-span-12 lg:col-span-7 lg:col-start-2">
          <p class="text-xs tracking-[0.22em] text-emerald-300/80">FEATURES</p>
          <h1
            class="mt-4 font-display text-4xl leading-tight text-stone-100 md:text-5xl"
          >
            让文章一键变成可发布的视频
          </h1>
          <p class="mt-5 max-w-2xl text-base leading-relaxed text-stone-200/80">
            这里是“详细功能介绍”页面入口。你可以把每个功能扩展为流程图、效果预览、模板示例、语音样例与 FAQ。
          </p>

          <div class="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
            <div
              class="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
            >
              <h3 class="font-display text-lg text-stone-100">
                文章智能转视频
              </h3>
              <p class="mt-2 text-sm leading-relaxed text-stone-200/70">
                上传文章后自动提炼结构、分镜与字幕节奏，生成可直接投放的视频草稿。
              </p>
            </div>
            <div
              class="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
            >
              <h3 class="font-display text-lg text-stone-100">
                多样化视频模板
              </h3>
              <p class="mt-2 text-sm leading-relaxed text-stone-200/70">
                提供不同风格模板：科技、教育、访谈、资讯、产品发布等，一键切换。
              </p>
            </div>
            <div
              class="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
            >
              <h3 class="font-display text-lg text-stone-100">
                高质量语音合成
              </h3>
              <p class="mt-2 text-sm leading-relaxed text-stone-200/70">
                内置高品质语音合成，支持多种音色与语速，配合字幕自然同步。
              </p>
            </div>
            <div
              class="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur"
            >
              <h3 class="font-display text-lg text-stone-100">批量与团队协作</h3>
              <p class="mt-2 text-sm leading-relaxed text-stone-200/70">
                面向更高频创作场景：批量生成、模板规范化、团队素材库与权限控制。
              </p>
            </div>
          </div>

          <div class="mt-10 flex flex-wrap gap-3">
            <RouterLink to="/" class="btn btn-ghost">返回首页</RouterLink>
            <RouterLink to="/pricing" class="btn btn-outline">查看定价</RouterLink>
          </div>
        </div>

        <div class="col-span-12 lg:col-span-3">
          <div
            class="rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/0 p-5"
          >
            <p class="text-xs tracking-[0.2em] text-stone-200/70">QUICK NAV</p>
            <ul class="mt-4 space-y-2 text-sm">
              <li class="text-stone-200/80">- 工作流与分镜</li>
              <li class="text-stone-200/80">- 字幕与排版</li>
              <li class="text-stone-200/80">- 模板与品牌</li>
              <li class="text-stone-200/80">- 语音与配乐</li>
            </ul>
            <div class="mt-5 border-t border-white/10 pt-4 text-xs text-stone-200/60">
              提示：这里后续可以放真实视频预览或模板截图。
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
</script>
