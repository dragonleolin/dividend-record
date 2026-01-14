<script setup>
import { ref, computed } from 'vue';
import { getAvatar, getRandomSeed } from '../utils/dicebear';
import { useSound } from '../composables/useSound';
import { CONFIG } from '../config';

const { playClick, playLevelUp } = useSound();

const step = ref(1);
const avatarSeed = ref(getRandomSeed());
const form = ref({
  date: new Date().toISOString().split('T')[0],
  ticker: '',
  amount: '',
  shares: '',
  note: '季配息' // Default
});

const emit = defineEmits(['close']);

// 常用標的對照表 (可自行擴充)
const tickerMap = {
  '0001': '安聯收益成長基金',
  '006208': '006208 富邦台50',
  '00687B': '00687B 國泰20年美債',
  '00722B': '00722B 群益投資級電信',
  '00795B': '00795B 中信美國公債20年',
  '00919': '00919 群益台灣精選高息',
  '00929': '00929 復華台灣科技優息',
  '00934': '00934 中信成長高股息',
  '00878': '00878 國泰永續高股息',
  '0056': '0056 元大高股息',
  '0050': '0050 元大台灣50',
  '2330': '2330 台積電'
  
};

const history = ref([]);
const GOOGLE_SCRIPT_URL = CONFIG.GOOGLE_SCRIPT_URL;

const isLastStep = computed(() => step.value === 5);

const nextStep = () => {
  playClick();
  if (step.value < 4) {
    step.value++;
  } else if (step.value === 4) {
    submitForm();
  }
};

const submitForm = async () => {
  // 1. Submit Data
  console.log('Submitting:', form.value);
  
  if (GOOGLE_SCRIPT_URL === '') {
    alert('請先在 src/components/PixelWizard.vue 設定 GOOGLE_SCRIPT_URL');
    // Mock success for demo
    await new Promise(r => setTimeout(r, 1000));
  } else {
    try {
      await fetch(GOOGLE_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.value)
      });
    } catch (e) {
      console.error('Error submitting form', e);
      alert('上傳失敗，請檢查網路或 URL');
      return;
    }
  }
  
  playLevelUp();
  step.value = 5;
  avatarSeed.value = 'stamp_success'; // Happy face

  // 2. Fetch History
  fetchHistory();
};

const fetchHistory = async () => {
  if (GOOGLE_SCRIPT_URL === 'YOUR_WEB_APP_URL_HERE') return;
  
  try {
    const res = await fetch(GOOGLE_SCRIPT_URL);
    const data = await res.json();
    if (data.status === 'success') {
      history.value = data.history;
    }
  } catch (e) {
    console.error('Error fetching history', e);
  }
};

const resetForm = () => {
  step.value = 1;
  // Reset fields but keep Date? Or reset all? User usually inputs batch.
  // Let's keep Date, clear others.
  form.value = { 
    ...form.value, 
    ticker: '', 
    amount: '', 
    shares: '' 
  };
  avatarSeed.value = getRandomSeed();
  playClick();
  emit('close');
};


// Auto-fill logic
const onTickerBlur = () => {
  const code = form.value.ticker.trim();
  if (tickerMap[code]) {
    form.value.ticker = tickerMap[code];
  }
};
</script>

<template>
  <div class="pixel-container w-full max-w-md mx-auto p-4 flex flex-col items-center min-h-screen justify-center">
    
    <!-- Avatar Section -->
    <div class="avatar-box mb-6 relative animate-bounce-slow">
      <img 
        :src="getAvatar(avatarSeed)" 
        alt="Avatar" 
        class="w-32 h-32 pixelated border-4 border-white bg-slate-800 rounded-lg shadow-[8px_8px_0_0_rgba(0,0,0,0.5)]"
      />
    </div>

    <!-- Dialogue Box -->
    <div class="dialogue-box bg-slate-800 border-4 border-white w-full p-4 mb-8 text-xl shadow-[8px_8px_0_0_rgba(0,0,0,0.5)] relative">
      <div class="absolute -top-3 left-8 bg-slate-800 px-2 text-sm text-gray-400">GAME MASTER</div>
      <p class="typing-text text-green-400">
        <span v-if="step === 1">今天是什麼日子呢？</span>
        <span v-else-if="step === 2">收到了哪支股票的配息？</span>
        <span v-else-if="step === 3">這次獲得了多少金幣與單位？</span>
        <span v-else-if="step === 4">備註一下這筆寶藏的屬性吧！</span>
        <span v-else-if="step === 5">恭喜 增加財富！</span>
      </p>
    </div>

    <!-- Interaction Area -->
    <div class="interaction-area w-full">
      <transition name="fade" mode="out-in">
        
        <!-- Step 1: Date -->
        <div v-if="step === 1" key="step1" class="flex flex-col gap-4">
          <input 
            type="date" 
            v-model="form.date"
            class="nes-input w-full bg-slate-700 text-white p-4 text-center text-xl border-2 border-white focus:outline-none focus:border-green-400"
          />
          <button @click="nextStep" class="nes-btn w-full bg-blue-600 text-white p-4 border-2 border-white hover:bg-blue-500 shadow-[4px_4px_0_0_black]">NEXT ></button>
        </div>

        <!-- Step 2: Ticker -->
        <div v-else-if="step === 2" key="step2" class="flex flex-col gap-4">
          <input 
            v-model="form.ticker" 
            @blur="onTickerBlur"
            placeholder="例如: 00878"
            class="nes-input w-full bg-slate-700 text-white p-4 text-center text-xl border-2 border-white focus:outline-none focus:border-green-400"
          />
          <button @click="nextStep" class="nes-btn w-full bg-blue-600 text-white p-4 border-2 border-white hover:bg-blue-500 shadow-[4px_4px_0_0_black]">NEXT ></button>
        </div>

        <!-- Step 3: Loot -->
        <div v-else-if="step === 3" key="step3" class="flex flex-col gap-4">
          <div class="flex gap-2 items-center">
            <span class="text-yellow-400">$</span>
            <input 
              v-model="form.amount" 
              type="number" 
              placeholder="金額" 
              class="nes-input w-full bg-slate-700 text-white p-3 text-right text-xl border-2 border-white focus:outline-none focus:border-green-400"
            />
          </div>
          <div class="flex gap-2 items-center">
            <span class="text-gray-400">Qty</span>
            <input 
              v-model="form.shares" 
              type="number" 
              placeholder="股數" 
              class="nes-input w-full bg-slate-700 text-white p-3 text-right text-xl border-2 border-white focus:outline-none focus:border-green-400"
            />
          </div>
          <button @click="nextStep" class="nes-btn w-full bg-blue-600 text-white p-4 border-2 border-white hover:bg-blue-500 shadow-[4px_4px_0_0_black]">NEXT ></button>
        </div>

        <!-- Step 4: Attribute -->
        <div v-else-if="step === 4" key="step4" class="flex flex-col gap-4">
          <select 
            v-model="form.note" 
            class="nes-select w-full bg-slate-700 text-white p-4 text-xl border-2 border-white focus:outline-none focus:border-green-400"
          >
            <option>月配息</option>
            <option>季配息</option>
            <option>半年配</option>
            <option>年配息</option>
          </select>
          <button @click="nextStep" class="nes-btn w-full bg-red-600 text-white p-4 border-2 border-white hover:bg-red-500 shadow-[4px_4px_0_0_black] animate-pulse">存檔 SAVE</button>
        </div>

        <!-- Step 5: Success -->
        <div v-else-if="step === 5" key="step5" class="flex flex-col items-center justify-center animate-fade-in">
           <h2 class="text-4xl text-yellow-400 animate-bounce mb-4">股息持續成長</h2>
           
             <div class="flex flex-col md:flex-row gap-4 w-full items-start">
               
               <!-- Left Side: Loot Summary -->
               <div class="flex-1 w-full">
                 <div class="nes-container is-dark with-title w-full bg-slate-800 border-4 border-white p-4 mb-6">
                   <p class="title bg-slate-800 px-2 -mt-7 ml-2 text-green-400">Loot Acquired</p>
                   <ul class="nes-list is-disc text-left space-y-2 text-lg">
                     <li><span class="text-gray-400">Target:</span> <span class="text-white">{{ form.ticker }}</span></li>
                     <li><span class="text-gray-400">Amount:</span> <span class="text-yellow-400">${{ form.amount }}</span></li>
                     <li><span class="text-gray-400">Shares:</span> <span class="text-blue-400">{{ form.shares }} unit(s)</span></li>
                     <li><span class="text-gray-400">Type:</span> <span class="text-red-400">{{ form.note }}</span></li>
                   </ul>
                 </div>
                 <button @click="resetForm" class="nes-btn w-full bg-blue-600 text-white p-4 border-2 border-white hover:bg-blue-500 shadow-[4px_4px_0_0_black] mb-2">NEXT QUEST ></button>
               </div>

               <!-- Right Side: Recent History -->
               <div v-if="history.length > 0" class="flex-1 w-full bg-slate-800 border-4 border-white p-4 relative h-[300px] flex flex-col">
                 <div class="absolute -top-3 left-4 bg-slate-800 px-2 text-yellow-400 text-sm">RECENT DROPS</div>
                 <div class="space-y-2 overflow-y-auto flex-1 scrollbar-hide pt-2">
                    <div v-for="(item, idx) in history" :key="idx" class="bg-slate-700 border-2 border-slate-600 p-2 text-xs flex justify-between items-center text-gray-300">
                      <div class="flex flex-col flex-1 mr-2">
                        <span>{{ new Date(item.date).toLocaleDateString() }}</span>
                        <!-- No truncate, full name -->
                        <span class="text-white whitespace-normal">{{ item.ticker }}</span>
                      </div>
                      <span class="text-yellow-400 shrink-0">${{ item.amount }}</span>
                    </div>
                 </div>
               </div>

             </div>
        </div>

      </transition>
    </div>

  </div>
</template>

<style scoped>
.pixelated {
  image-rendering: pixelated;
}
.nes-btn:active {
  transform: translate(4px, 4px);
  box-shadow: none;
}
</style>
