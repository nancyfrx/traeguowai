<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { 
  MapPin, 
  Star, 
  Navigation, 
  Search, 
  ChevronRight, 
  Filter,
  Utensils,
  Hotel,
  Mountain,
  Award,
  Flame,
  UserCheck,
  Zap,
  X,
  Phone,
  Clock
} from 'lucide-vue-next';

// --- 类型定义 ---
interface Shop {
  id: string;
  name: string;
  rating: number;
  priceRange: string;
  distance: number;
  tags: string[];
  navigationCount: number;
  type: 'food' | 'hotel' | 'attraction';
  district: string;
  address: string;
  isFeatured: boolean;
  specialBadge?: '专程前往' | '回头客多' | '烟火小店';
  imageUrl: string;
  location: { lng: number; lat: number };
}

// --- 模拟数据生成 ---
const districts = ['朝阳区', '海淀区', '西城区', '东城区', '丰台区'];
const categories = [
  { label: '全部', value: 'all' },
  { label: '餐饮', value: 'food', icon: Utensils },
  { label: '酒店', value: 'hotel', icon: Hotel },
  { label: '景点', value: 'attraction', icon: Mountain }
];

const generateMockData = (count: number): Shop[] => {
  const types: ('food' | 'hotel' | 'attraction')[] = ['food', 'hotel', 'attraction'];
  const badges: ('专程前往' | '回头客多' | '烟火小店')[] = ['专程前往', '回头客多', '烟火小店'];
  
  return Array.from({ length: count }, (_, i) => {
    const type = types[Math.floor(Math.random() * 3)];
    const district = districts[Math.floor(Math.random() * districts.length)];
    return {
      id: `shop-${i}`,
      name: `${['老北京', '四季', '旺角', '漫步', '悦享'][Math.floor(Math.random() * 5)]}${['涮肉', '烤鸭', '咖啡', '酒店', '公园'][Math.floor(Math.random() * 5)]}${i + 1}店`,
      rating: Number((4 + Math.random()).toFixed(1)),
      priceRange: `￥${Math.floor(Math.random() * 200 + 50)}/人`,
      distance: Math.floor(Math.random() * 10000),
      tags: ['环境优美', '交通便利', '老字号', '必吃榜'].slice(0, Math.floor(Math.random() * 3) + 1),
      navigationCount: Math.floor(Math.random() * 50000 + 1000),
      type,
      district,
      address: `${district}${['长安街', '平安大街', '朝阳路', '学院路'][Math.floor(Math.random() * 4)]}${Math.floor(Math.random() * 1000)}号`,
      isFeatured: Math.random() > 0.7,
      specialBadge: Math.random() > 0.6 ? badges[Math.floor(Math.random() * 3)] : undefined,
      imageUrl: `https://picsum.photos/seed/${i + 100}/400/300`,
      location: {
        lng: 116.397428 + (Math.random() - 0.5) * 0.1,
        lat: 39.90923 + (Math.random() - 0.5) * 0.1
      }
    };
  });
};

// --- 状态管理 ---
const activeTab = ref<'daily' | 'yearly'>('daily');
const selectedDistrict = ref('all');
const selectedDistance = ref('all');
const selectedCategory = ref('all');
const selectedBadge = ref('all');
const isLoading = ref(true);
const isRefreshing = ref(false);
const shops = ref<Shop[]>([]);
const showSkeleton = ref(true);
const selectedShop = ref<Shop | null>(null);
const showDetail = ref(false);

// --- 过滤逻辑 ---
const filteredShops = computed(() => {
  return shops.value.filter(shop => {
    // 根据 Tab 过滤 (模拟日榜和年榜数据不同)
    const tabMatch = activeTab.value === 'daily' ? true : shop.rating > 4.5;
    const dMatch = selectedDistrict.value === 'all' || shop.district === selectedDistrict.value;
    const distMatch = selectedDistance.value === 'all' || shop.distance <= parseInt(selectedDistance.value);
    const catMatch = selectedCategory.value === 'all' || shop.type === selectedCategory.value;
    const badgeMatch = selectedBadge.value === 'all' || shop.specialBadge === selectedBadge.value;
    return tabMatch && dMatch && distMatch && catMatch && badgeMatch;
  });
});

// --- 方法 ---
const loadData = async () => {
  isLoading.value = true;
  // 模拟 API 延迟
  await new Promise(resolve => setTimeout(resolve, 1000));
  // 根据 activeTab 生成不同的模拟数据
  const count = activeTab.value === 'daily' ? 20 : 15;
  shops.value = generateMockData(count);
  isLoading.value = false;
  showSkeleton.value = false;
};

// 监听 Tab 切换，重新加载数据
import { watch } from 'vue';
watch(activeTab, () => {
  loadData();
});

const handleRefresh = async () => {
  isRefreshing.value = true;
  await loadData();
  isRefreshing.value = false;
};

const handleNavigate = (shop: Shop) => {
  selectedShop.value = shop;
  showDetail.value = true;
};

const closeDetail = () => {
  showDetail.value = false;
  selectedShop.value = null;
};

const startNavigation = (shop: Shop) => {
  window.open(`https://uri.amap.com/marker?position=${shop.location.lng},${shop.location.lat}&name=${encodeURIComponent(shop.name)}`, '_blank');
};

const loadMore = async () => {
  if (isLoading.value) return;
  isLoading.value = true;
  await new Promise(resolve => setTimeout(resolve, 1000));
  shops.value = [...shops.value, ...generateMockData(10)];
  isLoading.value = false;
};

// --- 滚动监听 ---
const handleScroll = (e: any) => {
  const { scrollTop, scrollHeight, clientHeight } = e.target;
  if (scrollTop + clientHeight >= scrollHeight - 20) {
    loadMore();
  }
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="flex flex-col h-screen bg-slate-50 text-slate-900 overflow-hidden">
    <!-- 顶部导航 -->
    <header class="bg-white px-4 py-3 flex items-center justify-between border-b sticky top-0 z-50">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white">
          <MapPin class="w-5 h-5" />
        </div>
        <h1 class="font-bold text-lg tracking-tight">高德扫街榜</h1>
      </div>
      <div class="flex items-center gap-4">
        <button class="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <Search class="w-5 h-5 text-slate-500" />
        </button>
        <div class="w-8 h-8 rounded-full bg-slate-200 overflow-hidden border">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="avatar" />
        </div>
      </div>
    </header>

    <!-- Tab 切换 -->
    <div class="bg-white px-4 pt-2 border-b flex items-center gap-6">
      <button 
        @click="activeTab = 'daily'"
        class="pb-3 relative transition-all font-medium text-sm"
        :class="activeTab === 'daily' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'"
      >
        扫街榜 (日榜)
        <div v-if="activeTab === 'daily'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>
      </button>
      <button 
        @click="activeTab = 'yearly'"
        class="pb-3 relative transition-all font-medium text-sm"
        :class="activeTab === 'yearly' ? 'text-blue-600' : 'text-slate-500 hover:text-slate-700'"
      >
        状元榜 (年榜)
        <div v-if="activeTab === 'yearly'" class="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>
      </button>
    </div>

    <!-- 筛选区 -->
    <div class="bg-white p-4 border-b space-y-4">
      <!-- 核心分类 -->
      <div class="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
        <button 
          v-for="cat in categories" 
          :key="cat.value"
          @click="selectedCategory = cat.value"
          class="flex-shrink-0 px-4 py-1.5 rounded-full border text-xs font-medium flex items-center gap-1.5 transition-all"
          :class="selectedCategory === cat.value ? 'bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-100' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'"
        >
          <component :is="cat.icon" v-if="cat.icon" class="w-3.5 h-3.5" />
          {{ cat.label }}
        </button>
      </div>

      <!-- 细分筛选 -->
      <div class="flex items-center gap-3 overflow-x-auto no-scrollbar">
        <select 
          v-model="selectedDistrict"
          class="bg-slate-50 border-none rounded-lg px-3 py-1.5 text-xs font-medium focus:ring-2 ring-blue-500 outline-none cursor-pointer"
        >
          <option value="all">全城区域</option>
          <option v-for="d in districts" :key="d" :value="d">{{ d }}</option>
        </select>

        <select 
          v-model="selectedDistance"
          class="bg-slate-50 border-none rounded-lg px-3 py-1.5 text-xs font-medium focus:ring-2 ring-blue-500 outline-none cursor-pointer"
        >
          <option value="all">距离不限</option>
          <option value="1000">1km 内</option>
          <option value="3000">3km 内</option>
          <option value="5000">5km 内</option>
          <option value="10000">10km 内</option>
        </select>

        <select 
          v-model="selectedBadge"
          class="bg-slate-50 border-none rounded-lg px-3 py-1.5 text-xs font-medium focus:ring-2 ring-blue-500 outline-none cursor-pointer"
        >
          <option value="all">特色榜单</option>
          <option value="专程前往">专程前往榜</option>
          <option value="回头客多">回头客榜</option>
          <option value="烟火小店">烟火小店榜</option>
        </select>
      </div>
    </div>

    <!-- 列表区 -->
    <main class="flex-1 overflow-y-auto px-4 py-4" @scroll="handleScroll">
      <!-- 骨架屏 -->
      <div v-if="showSkeleton" class="space-y-4">
        <div v-for="i in 5" :key="i" class="bg-white rounded-2xl p-4 border animate-pulse flex gap-4">
          <div class="w-24 h-24 bg-slate-200 rounded-xl"></div>
          <div class="flex-1 space-y-3">
            <div class="h-4 bg-slate-200 rounded w-3/4"></div>
            <div class="h-3 bg-slate-200 rounded w-1/2"></div>
            <div class="h-3 bg-slate-200 rounded w-1/4"></div>
          </div>
        </div>
      </div>

      <!-- 真实数据 -->
      <div v-else class="space-y-4">
        <div 
          v-for="(shop, index) in filteredShops" 
          :key="shop.id"
          class="group bg-white rounded-2xl p-4 border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 flex gap-4 cursor-pointer relative"
        >
          <!-- 图片区 -->
          <div class="relative w-28 h-28 flex-shrink-0">
            <img :src="shop.imageUrl" class="w-full h-full object-cover rounded-xl border" />
            <div v-if="index < 3" class="absolute -top-2 -left-2 w-7 h-7 bg-amber-400 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-lg">
              {{ index + 1 }}
            </div>
            <!-- 特色角标 -->
            <div v-if="shop.specialBadge" class="absolute -bottom-1 -right-1">
              <span class="px-1.5 py-0.5 rounded-md bg-rose-500 text-[10px] text-white font-bold flex items-center gap-0.5 shadow-sm">
                <Zap v-if="shop.specialBadge === '烟火小店'" class="w-2.5 h-2.5" />
                <Award v-if="shop.specialBadge === '专程前往'" class="w-2.5 h-2.5" />
                <UserCheck v-if="shop.specialBadge === '回头客多'" class="w-2.5 h-2.5" />
                {{ shop.specialBadge }}
              </span>
            </div>
          </div>

          <!-- 内容区 -->
          <div class="flex-1 min-w-0">
            <div class="flex items-start justify-between">
              <h3 class="font-bold text-base truncate pr-2 group-hover:text-blue-600 transition-colors">{{ shop.name }}</h3>
              <span class="text-xs text-slate-400 flex-shrink-0">{{ shop.district }}</span>
            </div>
            
            <div class="flex items-center gap-3 mt-1">
              <div class="flex items-center gap-1">
                <Star class="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span class="text-sm font-bold text-amber-500">{{ shop.rating }}</span>
              </div>
              <span class="text-xs text-slate-500">{{ shop.priceRange }}</span>
              <span class="text-xs text-slate-400">{{ (shop.distance / 1000).toFixed(1) }}km</span>
            </div>

            <div class="flex flex-wrap gap-1.5 mt-2">
              <span v-for="tag in shop.tags" :key="tag" class="px-1.5 py-0.5 rounded bg-slate-100 text-[10px] text-slate-500">
                {{ tag }}
              </span>
            </div>

            <div class="flex items-center justify-between mt-3">
              <div class="flex items-center gap-1 text-xs text-slate-400">
                <Flame class="w-3 h-3 text-rose-500" />
                <span>{{ (shop.navigationCount / 1000).toFixed(1) }}k 人导航过</span>
              </div>
              <button 
                @click.stop="handleNavigate(shop)"
                class="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-600 hover:text-white transition-all flex items-center gap-1"
              >
                <Navigation class="w-3 h-3" />
                导航
              </button>
            </div>
          </div>
        </div>

        <!-- 加载更多提示 -->
        <div v-if="isLoading && !showSkeleton" class="py-4 flex justify-center">
          <div class="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
        
        <div v-if="filteredShops.length === 0 && !isLoading" class="py-20 text-center space-y-3">
          <div class="text-4xl">🔎</div>
          <p class="text-slate-400 text-sm">没找到符合条件的店铺，换个筛选试试吧</p>
        </div>
      </div>
    </main>

    <!-- 底部悬浮按钮 (手机端常用) -->
    <div class="fixed bottom-6 right-6 flex flex-col gap-3">
      <button 
        @click="handleRefresh"
        class="w-12 h-12 bg-white rounded-full shadow-2xl flex items-center justify-center border hover:scale-110 active:scale-95 transition-all group"
        :class="{ 'animate-spin': isRefreshing }"
      >
        <Zap class="w-5 h-5 text-blue-600 group-hover:fill-blue-600" />
      </button>
      <button class="w-12 h-12 bg-blue-600 rounded-full shadow-2xl shadow-blue-500/40 flex items-center justify-center hover:scale-110 active:scale-95 transition-all">
        <Filter class="w-5 h-5 text-white" />
      </button>
    </div>

    <!-- 详情页 Modal -->
    <Transition name="slide-up">
      <div v-if="showDetail && selectedShop" class="fixed inset-0 z-[100] bg-white flex flex-col">
        <!-- 头部 -->
        <div class="p-4 flex items-center justify-between border-b">
          <button @click="closeDetail" class="p-2 -ml-2 hover:bg-slate-100 rounded-full">
            <X class="w-6 h-6" />
          </button>
          <h2 class="font-bold text-lg">店铺详情</h2>
          <div class="w-10"></div>
        </div>

        <div class="flex-1 overflow-y-auto">
          <!-- 地图展示区 (移动到顶部) -->
          <div class="w-full h-72 border-b bg-slate-100 relative">
            <!-- 嵌入高德地图 (使用高德地图官方开放的快速展示接口) -->
            <iframe 
              class="w-full h-full border-0"
              :src="`https://m.amap.com/navi/?dest=${selectedShop.location.lng},${selectedShop.location.lat}&destName=${encodeURIComponent(selectedShop.name)}&hideRouteIcon=1&key=7302f35443317765951d451405e3a516`"
              allowfullscreen
            ></iframe>
            <!-- 悬浮基本信息卡片 -->
            <div class="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-3 rounded-xl shadow-lg border border-white/20 flex items-center justify-between">
              <div>
                <h3 class="font-bold text-slate-900">{{ selectedShop.name }}</h3>
                <p class="text-xs text-slate-500 mt-0.5">{{ selectedShop.address }}</p>
              </div>
              <div class="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                <Star class="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span class="text-amber-600 font-bold text-xs">{{ selectedShop.rating }}</span>
              </div>
            </div>
          </div>

          <!-- 店铺详情信息 -->
          <div class="p-4 space-y-6">
            <div class="space-y-4">
              <div class="flex flex-wrap gap-2">
                <span v-for="tag in selectedShop.tags" :key="tag" class="px-2 py-1 rounded-md bg-blue-50 text-[10px] text-blue-600 font-medium">
                  {{ tag }}
                </span>
                <span v-if="selectedShop.specialBadge" class="px-2 py-1 rounded-md bg-rose-50 text-[10px] text-rose-600 font-bold">
                  {{ selectedShop.specialBadge }}
                </span>
              </div>

              <div class="grid grid-cols-2 gap-3">
                <div class="bg-slate-50 p-3 rounded-xl">
                  <p class="text-[10px] text-slate-400 uppercase tracking-wider">人均消费</p>
                  <p class="text-sm font-bold text-slate-700 mt-1">{{ selectedShop.priceRange }}</p>
                </div>
                <div class="bg-slate-50 p-3 rounded-xl">
                  <p class="text-[10px] text-slate-400 uppercase tracking-wider">距离您</p>
                  <p class="text-sm font-bold text-slate-700 mt-1">{{ (selectedShop.distance / 1000).toFixed(1) }}km</p>
                </div>
              </div>
            </div>

            <div class="space-y-4 pt-2">
              <div class="flex items-start gap-3 p-4 bg-slate-50 rounded-xl min-h-[80px]">
                <MapPin class="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" />
                <div class="flex-1">
                  <p class="text-sm font-bold text-slate-800 leading-relaxed">{{ selectedShop.address }}</p>
                  <p class="text-xs text-slate-400 mt-2">详细地理位置及周边交通详情</p>
                </div>
              </div>
              
              <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <Clock class="w-5 h-5 text-slate-500 flex-shrink-0" />
                <p class="text-sm text-slate-700 font-medium">营业时间：09:00 - 22:00</p>
              </div>
              
              <div class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl">
                <Phone class="w-5 h-5 text-slate-500 flex-shrink-0" />
                <p class="text-sm text-slate-700 font-medium">联系电话：010-8888****</p>
              </div>
            </div>

            <!-- 店铺实拍 -->
            <div class="space-y-3">
              <h3 class="font-bold text-slate-900 flex items-center gap-2">
                <div class="w-1 h-4 bg-blue-600 rounded-full"></div>
                店铺实拍
              </h3>
              <img :src="selectedShop.imageUrl" class="w-full h-48 object-cover rounded-2xl shadow-sm border" />
            </div>
          </div>
        </div>

        <!-- 底部按钮 -->
        <div class="p-4 border-t bg-white">
          <button 
            @click="startNavigation(selectedShop)"
            class="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg shadow-xl shadow-blue-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            <Navigation class="w-5 h-5" />
            立即导航
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.group:active {
  transform: scale(0.98);
}

.slide-up-enter-active,
.slide-up-leave-active {
  transition: transform 0.3s ease-out;
}

.slide-up-enter-from,
.slide-up-leave-to {
  transform: translateY(100%);
}

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
