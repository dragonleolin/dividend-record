<script setup>
import { ref, onMounted } from 'vue'
import PixelWizard from './components/PixelWizard.vue'
import { CONFIG } from './config'

// --- State ---
const currentView = ref('home') // 'home' | 'wizard'
const history = ref([])

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
})
</script>

<template>
  <div class="app-container min-h-screen bg-slate-900 text-white font-[DotGothic16]">
    
    <!-- HEADER / LOGO -->
    <header class="p-4 text-center border-b-4 border-slate-700 bg-slate-800">
      <h1 class="text-2xl text-yellow-400 drop-shadow-[2px_2px_0_rgba(0,0,0,1)]">資產財富成長紀錄</h1>
    </header>

    <main class="w-full max-w-md mx-auto p-4">
      
      <!-- HOME VIEW -->
      <transition name="fade" mode="out-in">
        <div v-if="currentView === 'home'" key="home" class="flex flex-col items-center gap-6">
          
          <!-- Hero Image / Banner -->
          <div class="w-32 h-32 bg-slate-700 rounded-lg flex items-center justify-center border-4 border-white shadow-[4px_4px_0_0_black]">
            <span class="text-4xl">🏰</span>
          </div>

          <div class="text-center space-y-2">
            <p class="text-green-400">歡迎，冒險者!</p>
            <p class="text-xs text-gray-400">你將持續累積你的財富</p>
          </div>

          <!-- Action Button -->
          <button @click="startQuest" class="nes-btn is-primary w-full bg-blue-600 p-4 border-2 border-white text-xl shadow-[4px_4px_0_0_black] hover:bg-blue-500 active:translate-y-1 active:shadow-none transition-all">
            START RECORD
          </button>

          <!-- History Table -->
          <div class="w-full bg-slate-800 border-4 border-white p-4 relative mt-4">
            <div class="absolute -top-3 left-4 bg-slate-800 px-2 text-yellow-400 text-sm">QUEST LOG</div>
            
            <div v-if="history.length === 0" class="text-center text-gray-500 py-8">
              No records found...<br>Start a new quest!
            </div>

            <div v-else class="space-y-3 overflow-y-auto max-h-[300px] pr-1 scrollbar-hide">
              <div v-for="(item, idx) in history" :key="idx" class="flex justify-between items-center bg-slate-700 p-3 border-2 border-slate-600 hover:border-white transition-colors">
                 <div class="flex flex-col text-left">
                   <span class="text-xs text-gray-400">{{ new Date(item.date).toLocaleDateString() }}</span>
                   <span class="text-sm text-white font-bold truncate w-32">{{ item.ticker }}</span>
                 </div>
                 <div class="flex flex-col text-right">
                   <span class="text-yellow-400">${{ item.amount }}</span>
                   <span class="text-[10px] text-blue-300">{{ item.note }}</span>
                 </div>
              </div>
            </div>
          </div>

        </div>

        <!-- WIZARD VIEW -->
        <div v-else key="wizard">
          <PixelWizard @close="onWizardClose" />
          
          <div class="text-center mt-4">
            <button @click="currentView = 'home'" class="text-gray-500 hover:text-white underline text-sm">
              Cancel Quest
            </button>
          </div>
        </div>

      </transition>

    </main>

  </div>
</template>

<style>
/* Global Styles can go here or in style.css */
body {
  margin: 0;
  background-color: #0f172a; /* slate-900 */
}
</style>
