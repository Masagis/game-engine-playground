<template>
  <div
    class="min-h-screen flex flex-col items-center relative overflow-hidden bg-bg-primary"
  >
    <!-- Background subtle gradient -->
    <div
      class="fixed inset-0 pointer-events-none z-0"
      style="
        background:
          radial-gradient(
            ellipse at 30% 20%,
            rgba(102, 192, 244, 0.04) 0%,
            transparent 60%
          ),
          radial-gradient(
            ellipse at 70% 80%,
            rgba(102, 192, 244, 0.03) 0%,
            transparent 50%
          );
      "
      aria-hidden="true"
    ></div>

    <!-- Header -->
    <header
      class="w-full max-w-280 flex items-center justify-between px-6 py-5 relative z-10"
    >
      <div class="flex items-center gap-2.5">
        <span class="text-[1.6rem]">🎮</span>
        <h1 class="text-xl font-extrabold text-text-main tracking-tight">
          GameEngine <span class="text-accent">Playground</span>
        </h1>
      </div>
    </header>

    <!-- Main Content -->
    <main
      class="flex-1 flex items-start justify-center px-6 pb-10 relative z-10"
    >
      <div class="flex gap-5 items-start">
        <!-- Game Area -->
        <div>
          <GameCanvas
            ref="gameCanvasRef"
            @update:state="onStateUpdate"
            @update:fps="onFpsUpdate"
            @update:activeKeys="onKeysUpdate"
          />
        </div>

        <!-- Side Panels -->
        <div class="flex flex-col gap-4">
          <DebugPanel :state="debugState" :fps="fps" :activeKeys="activeKeys" />
          <ControlPanel
            :objectType="objectType"
            @update:objectType="onObjectTypeChange"
            @reset="onReset"
            @save="onSave"
            @load="onLoad"
          />
        </div>
      </div>
    </main>

    <!-- Toast Notification -->
    <Transition name="toast">
      <div
        v-if="toast.visible"
        class="fixed bottom-8 left-1/2 -translate-x-1/2 px-5 py-2.5 rounded-xl bg-bg-panel backdrop-blur-lg border border-accent/12 text-text-main text-sm font-semibold flex items-center gap-2 z-50 shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
      >
        <span class="text-base">{{ toast.icon }}</span>
        <span>{{ toast.message }}</span>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import GameCanvas from './components/GameCanvas.vue'
import DebugPanel from './components/DebugPanel.vue'
import ControlPanel from './components/ControlPanel.vue'

const gameCanvasRef = ref(null)
const fps = ref(0)
const activeKeys = ref(new Set())
const objectType = ref('character')

const debugState = reactive({
  x: 400,
  y: 250,
  rotation: 0,
  scale: 1,
  direction: 'Right',
  directionV: 'Idle',
})

const toast = reactive({
  visible: false,
  message: '',
  icon: '',
  type: 'info',
})

let toastTimeout = null

function showToast(message, icon = '✅', type = 'info') {
  toast.visible = true
  toast.message = message
  toast.icon = icon
  toast.type = type
  if (toastTimeout) clearTimeout(toastTimeout)
  toastTimeout = setTimeout(() => {
    toast.visible = false
  }, 2000)
}

function onStateUpdate(state) {
  Object.assign(debugState, state)
}

function onFpsUpdate(val) {
  fps.value = val
}

function onKeysUpdate(val) {
  activeKeys.value = val
}

function onObjectTypeChange(type) {
  objectType.value = type
  if (gameCanvasRef.value) {
    gameCanvasRef.value.objectType = type
  }
  showToast(`Switched to ${type}`, type === 'character' ? '🤖' : '🖼️')
}

function onReset() {
  if (gameCanvasRef.value) {
    gameCanvasRef.value.resetPosition()
    showToast('Position reset', '↺')
  }
}

function onSave() {
  if (gameCanvasRef.value) {
    gameCanvasRef.value.saveState()
    showToast('State saved!', '💾', 'success')
  }
}

function onLoad() {
  if (gameCanvasRef.value) {
    const success = gameCanvasRef.value.loadState()
    if (success) {
      objectType.value = gameCanvasRef.value.objectType
      showToast('State loaded!', '📂', 'success')
    } else {
      showToast('No saved state found', '⚠️', 'warning')
    }
  }
}
</script>

<style>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(20px);
}
</style>
