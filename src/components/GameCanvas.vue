<template>
  <div
    class="relative rounded-xl overflow-hidden shadow-[0_0_30px_rgba(102,192,244,0.06),0_20px_60px_rgba(0,0,0,0.5)] border border-accent/10"
  >
    <canvas
      ref="canvasRef"
      :width="CANVAS_WIDTH"
      :height="CANVAS_HEIGHT"
      class="block cursor-crosshair"
    />
    <div
      v-if="!gameStarted"
      class="absolute inset-0 bg-bg-primary/90 backdrop-blur-md flex items-center justify-center cursor-pointer transition-colors duration-300 hover:bg-bg-primary/80"
      @click="startGame"
    >
      <div class="text-center">
        <div class="text-5xl mb-3 animate-[pulse-slow_2s_ease-in-out_infinite]">
          🎮
        </div>
        <div class="text-2xl font-bold text-text-main mb-2">Click to Start</div>
        <div class="text-sm text-text-muted">
          Use W A S D or Arrow Keys to move
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useGameLoop } from '../hooks/useGameLoop'
import { useInputManager } from '../hooks/useInputManager'
import { useGameObject } from '../hooks/useGameObject'

import spriteUrl from '../assets/sprite.png'

const CANVAS_WIDTH = 800
const CANVAS_HEIGHT = 500

const canvasRef = ref(null)
const gameStarted = ref(false)

const emit = defineEmits(['update:state', 'update:fps', 'update:activeKeys'])

// Game object
const {
  state: objState,
  clickEffect,
  drag,
  spriteAnim,
  objectType,
  update: updateObject,
  hitTest,
  triggerClickEffect,
  startDrag,
  stopDrag,
  resetPosition,
  saveState,
  loadState,
} = useGameObject(CANVAS_WIDTH, CANVAS_HEIGHT)

// Input manager
const { keys, mouse, activeKeys, consumeClick, consumeWheel, bindCanvas } =
  useInputManager(canvasRef)

// Load sprite image
const spriteImage = ref(null)
const spriteLoaded = ref(false)

onMounted(() => {
  const img = new Image()
  img.onload = () => {
    spriteImage.value = img
    spriteLoaded.value = true
  }
  img.src = spriteUrl

  if (canvasRef.value) {
    bindCanvas(canvasRef.value)
  }

  // Try to load saved state
  loadState()
})

// ---- GRID PATTERN ----
function drawGrid(ctx) {
  const gridSize = 40
  ctx.strokeStyle = 'rgba(100, 140, 200, 0.08)'
  ctx.lineWidth = 1

  for (let x = 0; x <= CANVAS_WIDTH; x += gridSize) {
    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, CANVAS_HEIGHT)
    ctx.stroke()
  }
  for (let y = 0; y <= CANVAS_HEIGHT; y += gridSize) {
    ctx.beginPath()
    ctx.moveTo(0, y)
    ctx.lineTo(CANVAS_WIDTH, y)
    ctx.stroke()
  }

  // Center crosshair
  ctx.strokeStyle = 'rgba(100, 180, 255, 0.12)'
  ctx.lineWidth = 1
  ctx.setLineDash([4, 4])
  ctx.beginPath()
  ctx.moveTo(CANVAS_WIDTH / 2, 0)
  ctx.lineTo(CANVAS_WIDTH / 2, CANVAS_HEIGHT)
  ctx.stroke()
  ctx.beginPath()
  ctx.moveTo(0, CANVAS_HEIGHT / 2)
  ctx.lineTo(CANVAS_WIDTH, CANVAS_HEIGHT / 2)
  ctx.stroke()
  ctx.setLineDash([])
}

// ---- DRAW CHARACTER (shape-based) ----
function drawCharacter(ctx) {
  ctx.save()
  ctx.translate(objState.x, objState.y)
  ctx.rotate((objState.rotation * Math.PI) / 180)
  ctx.scale(
    objState.direction === 'Left' ? -objState.scale : objState.scale,
    objState.scale
  )

  const s = 1

  // Shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
  ctx.beginPath()
  ctx.ellipse(0, 22 * s, 16 * s, 4 * s, 0, 0, Math.PI * 2)
  ctx.fill()

  // Body
  const bodyGrad = ctx.createLinearGradient(-12 * s, -8 * s, 12 * s, 18 * s)
  bodyGrad.addColorStop(0, '#4a9eff')
  bodyGrad.addColorStop(1, '#2563eb')
  ctx.fillStyle = bodyGrad
  ctx.beginPath()
  ctx.roundRect(-12 * s, -8 * s, 24 * s, 26 * s, 4 * s)
  ctx.fill()

  // Body highlight
  ctx.fillStyle = 'rgba(255,255,255,0.15)'
  ctx.beginPath()
  ctx.roundRect(-10 * s, -6 * s, 8 * s, 20 * s, 3 * s)
  ctx.fill()

  // Core gem
  ctx.fillStyle = '#00f5ff'
  ctx.shadowColor = '#00f5ff'
  ctx.shadowBlur = 8
  ctx.beginPath()
  ctx.arc(0, 4 * s, 4 * s, 0, Math.PI * 2)
  ctx.fill()
  ctx.shadowBlur = 0

  // Head
  const headGrad = ctx.createRadialGradient(0, -16 * s, 2, 0, -16 * s, 14 * s)
  headGrad.addColorStop(0, '#64b5f6')
  headGrad.addColorStop(1, '#1e88e5')
  ctx.fillStyle = headGrad
  ctx.beginPath()
  ctx.arc(0, -16 * s, 14 * s, 0, Math.PI * 2)
  ctx.fill()

  // Visor
  ctx.fillStyle = 'rgba(0,0,0,0.3)'
  ctx.beginPath()
  ctx.ellipse(0, -16 * s, 10 * s, 7 * s, 0, 0, Math.PI * 2)
  ctx.fill()

  // Eyes
  ctx.fillStyle = '#00f5ff'
  ctx.shadowColor = '#00f5ff'
  ctx.shadowBlur = 6
  ctx.beginPath()
  ctx.arc(-4 * s, -17 * s, 2.5 * s, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(4 * s, -17 * s, 2.5 * s, 0, Math.PI * 2)
  ctx.fill()
  ctx.shadowBlur = 0

  // Eye glint
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.arc(-3 * s, -18 * s, 1 * s, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(5 * s, -18 * s, 1 * s, 0, Math.PI * 2)
  ctx.fill()

  // Antenna
  ctx.strokeStyle = '#90caf9'
  ctx.lineWidth = 2
  ctx.beginPath()
  ctx.moveTo(0, -30 * s)
  ctx.lineTo(0, -26 * s)
  ctx.stroke()
  ctx.fillStyle = '#00f5ff'
  ctx.shadowColor = '#00f5ff'
  ctx.shadowBlur = 4
  ctx.beginPath()
  ctx.arc(0, -31 * s, 2.5 * s, 0, Math.PI * 2)
  ctx.fill()
  ctx.shadowBlur = 0

  // Legs
  ctx.fillStyle = '#1565c0'
  const legOffset = spriteAnim.isMoving
    ? Math.sin((spriteAnim.frame * Math.PI) / 2) * 4
    : 0
  ctx.beginPath()
  ctx.roundRect(-9 * s, 18 * s + legOffset, 7 * s, 8 * s, 2 * s)
  ctx.fill()
  ctx.beginPath()
  ctx.roundRect(2 * s, 18 * s - legOffset, 7 * s, 8 * s, 2 * s)
  ctx.fill()

  // Arms
  ctx.fillStyle = '#1976d2'
  const armSwing = spriteAnim.isMoving
    ? Math.sin((spriteAnim.frame * Math.PI) / 2) * 3
    : 0
  ctx.beginPath()
  ctx.roundRect(-17 * s, -4 * s + armSwing, 5 * s, 16 * s, 2 * s)
  ctx.fill()
  ctx.beginPath()
  ctx.roundRect(12 * s, -4 * s - armSwing, 5 * s, 16 * s, 2 * s)
  ctx.fill()

  ctx.restore()
}

// ---- DRAW SPRITE ----
function drawSprite(ctx) {
  if (!spriteLoaded.value || !spriteImage.value) return

  ctx.save()
  ctx.translate(objState.x, objState.y)
  ctx.rotate((objState.rotation * Math.PI) / 180)
  ctx.scale(
    objState.direction === 'Left' ? -objState.scale : objState.scale,
    objState.scale
  )

  const img = spriteImage.value
  const frameW = img.width / 4
  const frameH = img.height
  const frame = spriteAnim.frame
  const drawSize = 64

  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.2)'
  ctx.beginPath()
  ctx.ellipse(0, drawSize / 2 - 4, drawSize / 3, 6, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.drawImage(
    img,
    frame * frameW,
    0,
    frameW,
    frameH,
    -drawSize / 2,
    -drawSize / 2,
    drawSize,
    drawSize
  )

  ctx.restore()
}

// ---- DRAW CLICK EFFECTS ----
function drawClickEffects(ctx) {
  if (!clickEffect.active) return

  const progress = clickEffect.time / clickEffect.maxTime

  for (const ring of clickEffect.rings) {
    const r = ring.maxRadius * Math.min(1, progress * 2.5)
    const alpha = ring.alpha * (1 - progress)
    ctx.strokeStyle = `rgba(0, 245, 255, ${alpha})`
    ctx.lineWidth = 2 * (1 - progress)
    ctx.beginPath()
    ctx.arc(clickEffect.x, clickEffect.y, r, 0, Math.PI * 2)
    ctx.stroke()
  }

  if (progress < 0.3) {
    const glowAlpha = (1 - progress / 0.3) * 0.4
    const glowGrad = ctx.createRadialGradient(
      clickEffect.x,
      clickEffect.y,
      0,
      clickEffect.x,
      clickEffect.y,
      50
    )
    glowGrad.addColorStop(0, `rgba(0, 245, 255, ${glowAlpha})`)
    glowGrad.addColorStop(1, 'rgba(0, 245, 255, 0)')
    ctx.fillStyle = glowGrad
    ctx.fillRect(clickEffect.x - 50, clickEffect.y - 50, 100, 100)
  }

  for (const p of clickEffect.particles) {
    ctx.globalAlpha = Math.max(0, p.life / 0.8)
    ctx.fillStyle = p.color
    ctx.shadowColor = p.color
    ctx.shadowBlur = 4
    ctx.beginPath()
    ctx.arc(p.x, p.y, p.size * (p.life / 0.8), 0, Math.PI * 2)
    ctx.fill()
  }
  ctx.globalAlpha = 1
  ctx.shadowBlur = 0
}

// ---- DRAW DRAG INDICATOR ----
function drawDragIndicator(ctx) {
  if (!drag.active) return
  ctx.strokeStyle = 'rgba(168, 85, 247, 0.5)'
  ctx.lineWidth = 2
  ctx.setLineDash([4, 4])
  const halfW = (objState.width * objState.scale) / 2 + 6
  const halfH = (objState.height * objState.scale) / 2 + 6
  ctx.beginPath()
  ctx.roundRect(objState.x - halfW, objState.y - halfH, halfW * 2, halfH * 2, 6)
  ctx.stroke()
  ctx.setLineDash([])
}

// ---- GAME UPDATE ----
function gameUpdate(dt) {
  const wasClicked = consumeClick()
  if (wasClicked) {
    if (hitTest(mouse.canvasX, mouse.canvasY)) {
      triggerClickEffect()
      if (!drag.active) {
        startDrag(mouse.canvasX, mouse.canvasY)
      }
    }
  }

  if (!mouse.isDown && drag.active) {
    stopDrag()
  }

  updateObject(dt, keys, consumeWheel, mouse)

  emit('update:state', {
    x: Math.round(objState.x),
    y: Math.round(objState.y),
    rotation: Math.round(objState.rotation),
    scale: objState.scale,
    direction: objState.direction,
    directionV: objState.directionV,
  })
  emit('update:activeKeys', new Set(activeKeys))
}

// ---- GAME RENDER ----
function gameRender() {
  const canvas = canvasRef.value
  if (!canvas) return
  const ctx = canvas.getContext('2d')

  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  const bgGrad = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT)
  bgGrad.addColorStop(0, '#171a21')
  bgGrad.addColorStop(1, '#1e2230')
  ctx.fillStyle = bgGrad
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT)

  drawGrid(ctx)

  if (objectType.value === 'character') {
    drawCharacter(ctx)
  } else {
    drawSprite(ctx)
  }

  drawClickEffects(ctx)
  drawDragIndicator(ctx)
}

// ---- GAME LOOP ----
const { fps, start, stop } = useGameLoop(gameUpdate, gameRender)

watch(fps, (val) => emit('update:fps', val))

function startGame() {
  gameStarted.value = true
  start()
}

defineExpose({
  resetPosition,
  saveState,
  loadState,
  objectType,
  startGame,
  fps,
})
</script>
