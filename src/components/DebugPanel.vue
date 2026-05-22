<template>
  <div
    class="bg-bg-panel/80 backdrop-blur-xl border border-accent/8 rounded-xl overflow-hidden font-mono text-[0.8rem] min-w-55 shadow-[0_8px_32px_rgba(0,0,0,0.5)] px-2"
  >
    <!-- Header -->
    <div
      class="flex items-center gap-2 px-3.5 py-2.5 border-b border-accent/6 bg-accent/3"
    >
      <div
        class="w-2 h-2 rounded-full bg-green shadow-[0_0_6px] shadow-green animate-[blink_2s_ease-in-out_infinite]"
      ></div>
      <span
        class="text-text-muted font-bold tracking-[2px] text-[0.7rem] flex-1"
        >DEBUG</span
      >
      <span class="text-green font-semibold text-[0.7rem]">{{ fps }} FPS</span>
    </div>

    <!-- Body -->
    <div class="px-3.5 py-2.5 flex flex-col gap-1.5">
      <div
        v-for="item in debugItems"
        :key="item.label"
        class="flex justify-between items-center"
      >
        <span class="text-text-muted text-[0.75rem]">{{ item.label }}</span>
        <span
          class="font-semibold text-[0.8rem] transition-colors duration-200"
          :class="{
            'text-cyan': item.class === 'cyan',
            'text-purple': item.class === 'purple',
            'text-green': item.class === 'green',
            'text-orange': item.class === 'orange',
          }"
        >
          {{ item.value }}
        </span>
      </div>
    </div>

    <!-- Footer: Active Keys -->
    <div class="px-3.5 py-2.5 border-t border-accent/6">
      <div class="text-text-muted text-[0.65rem] uppercase tracking-wide mb-2">
        Active Keys
      </div>
      <div class="flex flex-wrap gap-1">
        <span
          v-for="key in displayKeys"
          :key="key"
          class="inline-flex items-center justify-center w-7 h-7 rounded-md border text-[0.7rem] font-semibold transition-all duration-150"
          :class="
            activeKeys.has(key.code)
              ? 'bg-accent/10 border-accent/30 text-accent shadow-[0_0_8px_rgba(102,192,244,0.15)] scale-110'
              : 'bg-bg-primary/50 border-accent/8 text-text-muted'
          "
        >
          {{ key.label }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  state: {
    type: Object,
    default: () => ({
      x: 0,
      y: 0,
      rotation: 0,
      scale: 1,
      direction: 'Right',
      directionV: 'Idle',
    }),
  },
  fps: {
    type: Number,
    default: 0,
  },
  activeKeys: {
    type: Set,
    default: () => new Set(),
  },
})

const directionVClass = computed(() => {
  if (props.state.directionV === 'Up') return 'cyan'
  if (props.state.directionV === 'Down') return 'orange'
  return 'green'
})

const debugItems = computed(() => [
  { label: 'Position X', value: props.state.x, class: 'cyan' },
  { label: 'Position Y', value: props.state.y, class: 'cyan' },
  { label: 'Rotation', value: `${props.state.rotation}°`, class: 'purple' },
  { label: 'Scale', value: `${props.state.scale}x`, class: 'green' },
  {
    label: 'Direction H',
    value: props.state.direction,
    class: props.state.direction === 'Left' ? 'orange' : 'green',
  },
  {
    label: 'Direction V',
    value: props.state.directionV,
    class: directionVClass.value,
  },
])

const displayKeys = [
  { code: 'KeyW', label: 'W' },
  { code: 'KeyA', label: 'A' },
  { code: 'KeyS', label: 'S' },
  { code: 'KeyD', label: 'D' },
  { code: 'KeyQ', label: 'Q' },
  { code: 'KeyE', label: 'E' },
  { code: 'ArrowUp', label: '↑' },
  { code: 'ArrowDown', label: '↓' },
  { code: 'ArrowLeft', label: '←' },
  { code: 'ArrowRight', label: '→' },
]
</script>
