<script setup>
import { ref, onMounted, computed } from 'vue'
import PixelWizard from './components/PixelWizard.vue'
import InteractiveBackground from './components/InteractiveBackground.vue'
import { CONFIG } from './config'
import chestImg1 from './assets/Treasure.gif'
import chestImg2 from './assets/TreasureF.gif'

// --- State ---
const currentView = ref('home') // 'home' | 'wizard'
const history = ref([])
const currentChest = ref(chestImg1)

// --- Computed ---
const totalDividends = computed(() => {
  return history.value.reduce((sum, item) => sum + (Number(item.amount) || 0), 0)
})

const monthlyMaps = computed(() => {
  // Initialize 12 months (0-11)
  const months = Array.from({ length: 12 }, (_, i) => ({
    monthIndex: i,
    monthName: new Date(0, i).toLocaleString('en-US', { month: 'short' }).toUpperCase(), // JAN, FEB...
    records: [],
    total: 0
  }))

  history.value.forEach(item => {
    const d = new Date(item.date)
    const m = d.getMonth() // 0-11
    if (months[m]) {
      months[m].records.push(item)
      months[m].total += (Number(item.amount) || 0)
    }
  })
  
  return months
})

// --- Actions ---
const startQuest = () => {
  currentView.value = 'wizard'
}

const onWizardClose = () => {
  currentView.value = 'home'
  fetchHistory() // Refresh history on return
}

const fetchHistory = async () => {
  if (CONFIG.GOOGLE_SCRIPT_URL === '') {
    console.warn('請在 src/config.js 設定您的 Google Script URL');
    return;
  }
  
  try {
    const res = await fetch(CONFIG.GOOGLE_SCRIPT_URL);
    const data = await res.json();
    if (data.status === 'success') {
      history.value = data.history;
    }
  } catch (e) {
    console.error('Error fetching history', e);
  }
}

onMounted(() => {
  fetchHistory()
  // Random Chest
  currentChest.value = Math.random() > 0.5 ? chestImg1 : chestImg2
})
</script>

<template>
  <InteractiveBackground />
  <div class="app-container min-h-screen text-white font-[DotGothic16] pb-10">
    
    <!-- HEADER / LOGO -->
    <header class="p-4 text-center border-b-4 border-slate-700 bg-slate-800/90 backdrop-blur-sm sticky top-0 z-10 shadow-lg">
      <h1 class="text-2xl text-yellow-400 drop-shadow-[2px_2px_0_rgba(0,0,0,1)] flex items-center justify-center gap-2">
        <span class="text-3xl">💎</span>
        資產成長紀錄
      </h1>
    </header>

    <main class="w-full max-w-[95%] 2xl:max-w-[1600px] mx-auto p-4">
      
      <!-- HOME VIEW -->
      <transition name="fade" mode="out-in">
        <div v-if="currentView === 'home'" key="home" class="flex flex-col items-center gap-8">
          
          <!-- TREASURE CHEST (TOTAL) -->
          <div class="group cursor-pointer animate-float mt-8 flex flex-col items-center relative">
            
            <!-- Total Display Bubble (Now on top relative) -->
            <div class="bg-slate-800 border-2 border-white px-4 py-2 rounded-xl shadow-[4px_4px_0_0_black] z-20 mb-2 relative">
              <div class="text-center">
                <span class="text-xs text-gray-400 block mb-1">寶藏價值</span>
                <span class="text-3xl text-yellow-400 text-shadow-sm font-bold tracking-wider">${{ totalDividends.toLocaleString() }}</span>
              </div>
              <!-- Speech Bubble Triangle -->
              <div class="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-800 border-b-2 border-r-2 border-white rotate-45"></div>
            </div>

            <!-- Chest Icon Container -->
            <div class="w-48 h-40 bg-slate-800 rounded-lg border-4 border-white shadow-[8px_8px_0_0_rgba(0,0,0,0.5)] flex items-center justify-center relative z-10 overflow-visible mt-2">
               
               <!-- Random GIF Image -->
               <img :src="currentChest" alt="Treasure" class="w-full h-full object-contain p-2 pixelated" />
               
               <!-- Coins overflow effect (Retained) -->
               <div class="absolute -bottom-4 -right-6 text-4xl animate-bounce" style="animation-delay: 0.5s">💰</div>
               <div class="absolute -bottom-4 -left-6 text-4xl animate-bounce" style="animation-delay: 0.2s">💰</div>
            </div>
          </div>

          <!-- Action Button -->
          <button @click="startQuest" class="nes-btn is-primary bg-blue-600 px-8 py-4 border-4 border-white text-xl shadow-[8px_8px_0_0_black] hover:bg-blue-500 hover:scale-105 active:scale-95 active:shadow-none transition-all flex items-center gap-2">
            <span>⚔️</span> START RECORD
          </button>

          <!-- WORLD MAPS (QUEST LOG) -->
          <div class="w-full mt-4">
            <h2 class="text-center text-xl text-green-400 mb-6 flex items-center justify-center gap-2">
              <span>🗺️</span> ADVENTURE MAP (Month 1-12)
            </h2>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
              
              <!-- Individual Map Card -->
              <div v-for="map in monthlyMaps" :key="map.monthIndex" 
                   class="relative bg-[#e3cdac] text-slate-900 border-4 border-[#8b5a2b] p-2 h-[300px] shadow-[6px_6px_0_0_rgba(0,0,0,0.5)] hover:translate-y-[-2px] hover:shadow-[8px_8px_0_0_rgba(0,0,0,0.5)] transition-all overflow-hidden flex flex-col">
                
                <!-- Map Decoration: Grid Lines -->
                <div class="absolute inset-0 opacity-10 pointer-events-none" 
                     style="background-image: linear-gradient(#8b5a2b 1px, transparent 1px), linear-gradient(90deg, #8b5a2b 1px, transparent 1px); background-size: 20px 20px;">
                </div>

                <!-- Header -->
                <div class="flex justify-between items-start border-b-2 border-[#8b5a2b] pb-1 mb-2 relative z-10 shrink-0">
                  <span class="font-bold text-lg bg-[#cebb99] px-2 border border-[#8b5a2b] shadow-[2px_2px_0_0_#8b5a2b]">{{ map.monthName }}</span>
                  <span v-if="map.total > 0" class="font-bold text-[#8b5a2b] bg-white/50 px-1 rounded text-xs">${{ map.total.toLocaleString() }}</span>
                </div>

                <!-- Content: Locations/Records -->
                <div class="relative z-10 space-y-2 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-[#8b5a2b] scrollbar-track-transparent pr-1">
                  <div v-if="map.records.length === 0" class="flex flex-col items-center justify-center h-full opacity-40">
                    <span class="text-3xl grayscale">🔒</span>
                    <span class="text-xs font-bold text-[#8b5a2b] mt-1">LOCKED</span>
                  </div>
                  
                  <div v-else v-for="(rec, idx) in map.records" :key="idx" class="flex flex-col gap-1 text-xs bg-white/60 p-1 border border-[#8b5a2b]/30">
                    <div class="flex justify-between items-start">
                        <!-- Full Name Display (Wrap allowed) -->
                        <span class="font-bold text-[#2d2d2d] leading-tight break-words">{{ rec.ticker }}</span>
                        <!-- Type/Note indicator (optional small badge) -->
                        <span class="text-[8px] bg-sky-200 text-sky-800 px-1 rounded scale-90 origin-top-right whitespace-nowrap" v-if="rec.note">{{ rec.note }}</span>
                    </div>
                    <div class="flex items-center gap-1 mt-1 border-t border-[#8b5a2b]/20 pt-1">
                         <span class="text-[10px]">💰</span>
                         <span class="text-[#d95763] font-bold">${{ rec.amount }}</span>
                    </div>
                  </div>
                </div>

                <!-- Footer Decoration -->
                <div class="absolute bottom-1 right-1 opacity-20 text-[24px] pointer-events-none text-[#8b5a2b]">
                   {{ map.records.length > 0 ? '🚩' : '☁️' }}
                </div>
              </div>

            </div>
          </div>

        </div>

        <!-- WIZARD VIEW -->
        <div v-else key="wizard">
          <PixelWizard @close="onWizardClose" />
          
          <div class="text-center mt-4">
            <button @click="currentView = 'home'" class="text-gray-500 hover:text-white underline text-sm hover:translate-x-1 transition-transform">
              &lt; Return to World Map
            </button>
          </div>
        </div>

      </transition>

    </main>

  </div>
</template>

<style>
/* Global Styles */
body {
  margin: 0;
  /* background-color: #0f172a;  REMOVED: Let p5 background show */
}

/* Custom Scrollbar for Map Cards */
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #8b5a2b;
  border-radius: 2px;
}

@keyframes float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-5px); }
}
.animate-float {
  animation: float 3s ease-in-out infinite;
}
.text-shadow-sm {
  text-shadow: 2px 2px 0px #000000;
}
</style>
