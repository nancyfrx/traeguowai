<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { 
  ArrowRight, 
  Github, 
  Twitter, 
  Mail, 
  X 
} from 'lucide-vue-next';

const API_BASE = 'http://localhost:8081/api/blogs';

const blogs = ref([]);
const loading = ref(true);
const selectedBlog = ref(null);

const fetchBlogs = async () => {
  try {
    const response = await axios.get(API_BASE);
    blogs.value = response.data;
  } catch (error) {
    console.error('Error fetching blogs:', error);
    // Fallback data
    blogs.value = [
      { id: 1, title: 'Visual Poetry', content: 'Design is the silent ambassador of your brand. Every pixel tells a story, every space breathes life into the narrative.', author: 'John Doe', createTime: '2026-01-11T10:00:00' },
      { id: 2, title: 'The Grid System', content: 'Order is the foundation of beauty. The grid is not a cage, but a structure that allows freedom to flourish within limits.', author: 'Jane Smith', createTime: '2026-01-10T15:30:00' },
      { id: 3, title: 'Future of Web', content: 'The web is evolving into a more tactile, human-centric experience. Empathy is the core of modern development.', author: 'Alex Chen', createTime: '2026-01-09T08:45:00' }
    ];
  } finally {
    loading.value = false;
  }
};

onMounted(() => {
  fetchBlogs();
});
</script>

<template>
  <div class="min-h-screen bg-[#fdfdfd] text-[#111111] font-sans selection:bg-black/5">
    <!-- Navigation -->
    <nav class="fixed top-0 w-full z-50 px-8 py-6 flex justify-between items-center mix-blend-difference invert">
      <h1 class="text-xl font-bold tracking-tighter">BOKE.</h1>
      <div class="flex gap-8 text-sm font-medium">
        <a href="#" class="hover:opacity-50 transition-opacity">Journal</a>
        <a href="#" class="hover:opacity-50 transition-opacity">Studio</a>
        <a href="#" class="hover:opacity-50 transition-opacity">Contact</a>
      </div>
    </nav>

    <!-- Hero Section -->
    <header class="pt-48 pb-24 px-8 max-w-7xl mx-auto">
      <div class="transition-all duration-1000 transform translate-y-0 opacity-100">
        <h2 class="text-[12vw] leading-[0.9] font-black tracking-tighter uppercase mb-8">
          Curated<br/>Insights.
        </h2>
        <p class="max-w-md text-lg text-black/60 font-medium leading-relaxed">
          Exploring the intersection of aesthetics and functionality through a Vue-powered lens.
        </p>
      </div>
    </header>

    <!-- Blog List -->
    <main class="px-8 max-w-7xl mx-auto pb-32">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-24">
        <article 
          v-for="(blog, index) in blogs" 
          :key="blog.id"
          @click="selectedBlog = blog"
          class="group cursor-pointer transform transition-all duration-700 hover:-translate-y-2"
        >
          <div class="aspect-[4/5] bg-neutral-100 mb-8 overflow-hidden relative">
            <div class="absolute inset-0 bg-neutral-200 group-hover:scale-105 transition-transform duration-1000 ease-out" />
            <div class="absolute inset-0 flex items-center justify-center p-12 text-center">
               <span class="text-xs uppercase tracking-widest text-black/20 font-bold group-hover:text-black/40 transition-colors italic">Collection {{ index + 1 }}</span>
            </div>
          </div>
          <div class="space-y-4">
            <div class="flex justify-between items-end">
              <span class="text-[10px] uppercase tracking-[0.2em] text-black/40 font-bold">
                {{ new Date(blog.createTime).toLocaleDateString() }}
              </span>
              <ArrowRight :size="16" class="transform -rotate-45 group-hover:rotate-0 transition-transform duration-500 opacity-20 group-hover:opacity-100" />
            </div>
            <h3 class="text-2xl font-bold leading-tight group-hover:translate-x-1 transition-transform duration-500">{{ blog.title }}</h3>
            <p class="text-sm text-black/50 line-clamp-2 leading-relaxed">{{ blog.content }}</p>
          </div>
        </article>
      </div>
    </main>

    <!-- Footer -->
    <footer class="px-8 py-24 border-t border-black/5 max-w-7xl mx-auto">
      <div class="flex flex-col md:flex-row justify-between items-start gap-12">
        <div class="space-y-4">
          <h1 class="text-2xl font-black tracking-tighter">BOKE.</h1>
          <p class="text-sm text-black/40 font-medium">© 2026 Vue Edition • Minimalist Design.</p>
        </div>
        <div class="flex gap-8">
          <Github :size="20" class="hover:opacity-50 cursor-pointer transition-opacity" />
          <Twitter :size="20" class="hover:opacity-50 cursor-pointer transition-opacity" />
          <Mail :size="20" class="hover:opacity-50 cursor-pointer transition-opacity" />
        </div>
      </div>
    </footer>

    <!-- Detail Overlay -->
    <Transition name="fade">
      <div v-if="selectedBlog" class="fixed inset-0 z-[100] bg-white px-8 pt-48 pb-32 overflow-y-auto">
        <button 
          @click="selectedBlog = null"
          class="fixed top-8 right-8 z-[110] p-4 hover:bg-neutral-100 rounded-full transition-colors"
        >
          <X :size="24" />
        </button>
        <div class="max-w-3xl mx-auto space-y-12">
          <span class="text-xs uppercase tracking-[0.3em] text-black/30 font-bold">
            By {{ selectedBlog.author }} • {{ new Date(selectedBlog.createTime).toLocaleDateString() }}
          </span>
          <h2 class="text-6xl font-black tracking-tighter leading-[1.1] uppercase">{{ selectedBlog.title }}</h2>
          <div class="w-24 h-1 bg-black" />
          <p class="text-xl text-black/70 leading-relaxed font-medium whitespace-pre-wrap">
            {{ selectedBlog.content }}
          </p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.6s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
