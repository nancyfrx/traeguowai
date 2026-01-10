<template>
  <div class="relative overflow-hidden">
    <div class="pointer-events-none absolute inset-0">
      <div
        class="absolute left-1/2 top-10 h-80 w-80 -translate-x-1/2 rounded-full bg-emerald-500/10 blur-3xl"
      ></div>
      <div
        class="absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(249,115,22,0.10),transparent_60%)]"
      ></div>
    </div>

    <div class="relative mx-auto max-w-6xl px-4 pb-24 pt-16">
      <div class="grid grid-cols-12 gap-6">
        <div class="col-span-12 lg:col-span-8 lg:col-start-2">
          <p class="text-xs tracking-[0.22em] text-emerald-300/80">BLOG</p>
          <h1 class="mt-4 font-display text-4xl text-stone-100 md:text-5xl">
            行业动态与创作技巧
          </h1>
          <p class="mt-5 max-w-2xl text-base leading-relaxed text-stone-200/80">
            这里可以放置增长内容：教程、模板案例、视频分镜技巧、AI 生产力实践。
          </p>

          <div class="mt-10 grid grid-cols-1 gap-4 md:grid-cols-2">
            <article
              class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <p class="text-xs tracking-[0.2em] text-stone-200/60">GUIDE</p>
              <h3 class="mt-3 font-display text-lg text-stone-100">
                如何把长文拆成可读的分镜节奏
              </h3>
              <p class="mt-2 text-sm leading-relaxed text-stone-200/70">
                结构化提炼：标题层级、节奏点、关键句可视化，让视频更像“讲述”，不是“朗读”。
              </p>
              <button class="btn btn-ghost mt-5 px-0">阅读（即将上线）</button>
            </article>

            <article
              class="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
            >
              <p class="text-xs tracking-[0.2em] text-stone-200/60">TEMPLATE</p>
              <h3 class="mt-3 font-display text-lg text-stone-100">
                资讯/产品发布模板怎么选？
              </h3>
              <p class="mt-2 text-sm leading-relaxed text-stone-200/70">
                从受众与渠道出发：信息密度、字幕尺寸、封面风格、旁白速度的组合策略。
              </p>
              <button class="btn btn-ghost mt-5 px-0">阅读（即将上线）</button>
            </article>
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
