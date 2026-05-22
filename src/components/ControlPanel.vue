<template>
  <div
    class="bg-bg-panel/80 backdrop-blur-xl border border-accent/8 rounded-xl overflow-hidden min-w-55 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
  >
    <!-- Header -->
    <div
      class="flex items-center gap-2 px-3.5 py-2.5 border-b border-accent/6 bg-accent/3"
    >
      <span class="text-base">⚙️</span>
      <span class="text-text-muted font-bold tracking-wide text-xs uppercase"
        >Controls</span
      >
    </div>

    <!-- Body -->
    <div class="p-3.5 flex flex-col gap-4">
      <!-- Object Type Selector -->
      <div class="flex flex-col gap-2">
        <label
          class="text-text-muted text-[0.7rem] uppercase tracking-wide font-semibold"
          >Object Type</label
        >
        <div class="flex gap-1.5">
          <button
            class="flex-1 py-2 px-2.5 rounded-lg border font-semibold text-[0.78rem] cursor-pointer transition-all duration-200 font-[inherit]"
            :class="
              objectType === 'character'
                ? 'bg-accent/10 border-accent/30 text-accent shadow-[0_0_12px_rgba(102,192,244,0.08)]'
                : 'bg-bg-primary/40 border-accent/8 text-text-muted hover:border-accent/20 hover:text-text-sub'
            "
            @click="$emit('update:objectType', 'character')"
          >
            🤖 Character
          </button>
          <button
            class="flex-1 py-2 px-2.5 rounded-lg border font-semibold text-[0.78rem] cursor-pointer transition-all duration-200 font-[inherit]"
            :class="
              objectType === 'sprite'
                ? 'bg-accent/10 border-accent/30 text-accent shadow-[0_0_12px_rgba(102,192,244,0.08)]'
                : 'bg-bg-primary/40 border-accent/8 text-text-muted hover:border-accent/20 hover:text-text-sub'
            "
            @click="$emit('update:objectType', 'sprite')"
          >
            🖼️ Sprite
          </button>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex flex-col gap-2">
        <label
          class="text-text-muted text-[0.7rem] uppercase tracking-wide font-semibold"
          >Actions</label
        >
        <div class="flex gap-1.5">
          <button
            class="flex-1 py-2 rounded-lg bg-bg-primary/40 border border-accent/8 text-text-sub text-[0.78rem] font-semibold cursor-pointer transition-all duration-200 flex items-center justify-center gap-1 hover:border-accent/20 hover:text-text-main"
            @click="$emit('reset')"
          >
            <span class="text-xs">↺</span> Reset
          </button>
          <button
            class="flex-1 py-2 rounded-lg bg-bg-primary/40 border border-accent/8 text-text-sub text-[0.78rem] font-semibold cursor-pointer transition-all duration-200 flex items-center justify-center gap-1 hover:border-accent/20 hover:text-text-main"
            @click="$emit('save')"
          >
            <span class="text-xs">💾</span> Save
          </button>
          <button
            class="flex-1 py-2 rounded-lg bg-bg-primary/40 border border-accent/8 text-text-sub text-[0.78rem] font-semibold cursor-pointer transition-all duration-200 flex items-center justify-center gap-1 hover:border-accent/20 hover:text-text-main"
            @click="$emit('load')"
          >
            <span class="text-xs">📂</span> Load
          </button>
        </div>
      </div>

      <!-- Keyboard Shortcuts -->
      <div class="flex flex-col gap-2">
        <label
          class="text-text-muted text-[0.7rem] uppercase tracking-wide font-semibold"
          >Keyboard Shortcuts</label
        >
        <div
          class="flex flex-col gap-1.5 font-mono text-[0.7rem] text-text-muted"
        >
          <div
            class="flex justify-between items-center py-0.5 border-b border-accent/4"
          >
            <span>W A S D / ↑ ↓ ← →</span>
            <span class="font-semibold text-text-sub">Move</span>
          </div>
          <div
            class="flex justify-between items-center py-0.5 border-b border-accent/4"
          >
            <span>Q / E</span>
            <span class="font-semibold text-text-sub">Rotate</span>
          </div>
          <div
            class="flex justify-between items-center py-0.5 border-b border-accent/4"
          >
            <span>Scroll Wheel</span>
            <span class="font-semibold text-text-sub">Scale</span>
          </div>
          <div class="flex justify-between items-center py-0.5">
            <span>Click & Drag</span>
            <span class="font-semibold text-text-sub">FX + Drag</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  objectType: {
    type: String,
    default: 'character',
  },
})

defineEmits(['update:objectType', 'reset', 'save', 'load'])
</script>
