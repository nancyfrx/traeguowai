<template>
  <footer class="relative overflow-hidden border-t border-white/10">
    <div class="pointer-events-none absolute inset-0">
      <div
        class="absolute -left-24 bottom-10 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl"
      ></div>
      <div
        class="absolute -right-28 bottom-0 h-80 w-80 rounded-full bg-orange-500/10 blur-3xl"
      ></div>
      <div
        class="absolute inset-0 opacity-15 [background-image:linear-gradient(to_right,rgba(231,229,228,0.08)_1px,transparent_1px)] [background-size:48px_48px]"
      ></div>
    </div>

    <div class="relative mx-auto max-w-6xl px-4 py-14">
      <div class="grid grid-cols-12 gap-8">
        <!-- Left: logo + intro -->
        <div class="col-span-12 md:col-span-5 lg:col-span-4 lg:col-start-2">
          <RouterLink to="/" class="flex items-center gap-3">
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

          <p class="mt-5 text-sm leading-relaxed text-stone-200/70">
            我们的愿景是把内容创作变成稳定、可复用的生产流程：让每一篇文章都能迅速转化为高质量的视频表达。
          </p>

          <div class="mt-6 flex items-center gap-3">
            <a
              class="btn btn-ghost btn-circle"
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="h-5 w-5"
              >
                <path
                  d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.049c.476-.9 1.637-1.85 3.367-1.85 3.599 0 4.264 2.369 4.264 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.124 2.062 2.062 0 0 1 0 4.124zM6.814 20.452H3.86V9h2.954v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.727v20.545C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.273V1.727C24 .774 23.2 0 22.222 0z"
                />
              </svg>
            </a>
            <a
              class="btn btn-ghost btn-circle"
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Twitter"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="h-5 w-5"
              >
                <path
                  d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"
                />
              </svg>
            </a>
            <a
              class="btn btn-ghost btn-circle"
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                class="h-5 w-5"
              >
                <path
                  d="M22.675 0h-21.35C.597 0 0 .597 0 1.326v21.348C0 23.403.597 24 1.326 24h11.494v-9.294H9.691V11.01h3.129V8.309c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.795.143v3.24l-1.918.001c-1.504 0-1.795.715-1.795 1.763v2.31h3.587l-.467 3.696h-3.12V24h6.116C23.403 24 24 23.403 24 22.674V1.326C24 .597 23.403 0 22.675 0z"
                />
              </svg>
            </a>
          </div>
        </div>

        <!-- Links -->
        <div class="col-span-6 md:col-span-3 lg:col-span-2">
          <p class="text-xs tracking-[0.22em] text-stone-200/60">产品</p>
          <ul class="mt-4 space-y-2 text-sm">
            <li><RouterLink class="footer-link" to="/features">功能</RouterLink></li>
            <li><RouterLink class="footer-link" to="/pricing">定价</RouterLink></li>
            <li><RouterLink class="footer-link" to="/">案例</RouterLink></li>
          </ul>
        </div>

        <div class="col-span-6 md:col-span-4 lg:col-span-2">
          <p class="text-xs tracking-[0.22em] text-stone-200/60">资源</p>
          <ul class="mt-4 space-y-2 text-sm">
            <li><RouterLink class="footer-link" to="/blog">博客</RouterLink></li>
            <li><RouterLink class="footer-link" to="/">帮助中心</RouterLink></li>
            <li><RouterLink class="footer-link" to="/">联系我们</RouterLink></li>
          </ul>
        </div>

        <div class="col-span-12 md:col-span-12 lg:col-span-2">
          <p class="text-xs tracking-[0.22em] text-stone-200/60">法律</p>
          <ul class="mt-4 space-y-2 text-sm">
            <li><a class="footer-link" href="#">使用条款</a></li>
            <li><a class="footer-link" href="#">隐私政策</a></li>
            <li><a class="footer-link" href="#">Cookie 政策</a></li>
          </ul>
        </div>
      </div>

      <div class="mt-10 border-t border-white/10 pt-6">
        <div class="flex flex-col gap-2 text-xs text-stone-200/50 md:flex-row md:items-center md:justify-between">
          <p>Copyright © {{ currentYear }} - Article2Video AI</p>
          <p>成立于 2026 · Powered by Vue + Vite + CloudBase</p>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";

const currentYear = new Date().getFullYear();
</script>

<style scoped>
.footer-link {
  @apply text-stone-200/70 hover:text-stone-100 transition;
}
</style>
