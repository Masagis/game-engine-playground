import { reactive, ref } from 'vue'

export function useGameObject(canvasWidth = 800, canvasHeight = 500) {
  const MOVE_SPEED = 200 // pixels per second
  const ROTATION_SPEED = 120 // degrees per second
  const SCALE_SPEED = 0.003 // scale per wheel pixel
  const MIN_SCALE = 0.5
  const MAX_SCALE = 2.0
  const FRICTION = 0.85
  const OBJECT_SIZE = 48

  const state = reactive({
    x: canvasWidth / 2,
    y: canvasHeight / 2,
    rotation: 0, // degrees
    scale: 1.0,
    direction: 'Right',
    directionV: 'Idle',
    vx: 0,
    vy: 0,
    width: OBJECT_SIZE,
    height: OBJECT_SIZE,
  })

  // Click effect state
  const clickEffect = reactive({
    active: false,
    time: 0,
    maxTime: 0.6,
    x: 0,
    y: 0,
    rings: [],
    particles: [],
  })

  // Drag state
  const drag = reactive({
    active: false,
    offsetX: 0,
    offsetY: 0,
  })

  // Sprite animation
  const spriteAnim = reactive({
    frame: 0,
    timer: 0,
    frameTime: 0.15,
    isMoving: false,
  })

  // Object type: 'character' or 'sprite'
  const objectType = ref('character')

  function update(dt, keys, consumeWheel, mouse) {
    // ---- Movement ----
    let ax = 0
    let ay = 0

    if (keys.has('KeyW') || keys.has('ArrowUp')) ay -= 1
    if (keys.has('KeyS') || keys.has('ArrowDown')) ay += 1
    if (keys.has('KeyA') || keys.has('ArrowLeft')) ax -= 1
    if (keys.has('KeyD') || keys.has('ArrowRight')) ax += 1

    // Normalize diagonal movement
    if (ax !== 0 && ay !== 0) {
      const len = Math.sqrt(ax * ax + ay * ay)
      ax /= len
      ay /= len
    }

    state.vx += ax * MOVE_SPEED * dt * 5
    state.vy += ay * MOVE_SPEED * dt * 5

    // Apply friction
    state.vx *= FRICTION
    state.vy *= FRICTION

    // Stop tiny movements
    if (Math.abs(state.vx) < 0.5) state.vx = 0
    if (Math.abs(state.vy) < 0.5) state.vy = 0

    // Drag override
    if (drag.active && mouse) {
      state.x = mouse.canvasX - drag.offsetX
      state.y = mouse.canvasY - drag.offsetY
      state.vx = 0
      state.vy = 0
    } else {
      state.x += state.vx * dt
      state.y += state.vy * dt
    }

    // ---- Boundary clamping ----
    const halfW = (state.width * state.scale) / 2
    const halfH = (state.height * state.scale) / 2
    state.x = Math.max(halfW, Math.min(canvasWidth - halfW, state.x))
    state.y = Math.max(halfH, Math.min(canvasHeight - halfH, state.y))

    // ---- Direction (flip) ----
    if (state.vx < -1) state.direction = 'Left'
    else if (state.vx > 1) state.direction = 'Right'

    // ---- Vertical direction ----
    if (state.vy < -1) state.directionV = 'Up'
    else if (state.vy > 1) state.directionV = 'Down'
    else state.directionV = 'Idle'

    // ---- Rotation ----
    if (keys.has('KeyQ')) state.rotation -= ROTATION_SPEED * dt
    if (keys.has('KeyE')) state.rotation += ROTATION_SPEED * dt
    // Normalize
    state.rotation = ((state.rotation % 360) + 360) % 360

    // ---- Scale (mouse wheel) ----
    const wheelDelta = consumeWheel()
    if (wheelDelta !== 0) {
      state.scale += wheelDelta * SCALE_SPEED
      state.scale = Math.max(MIN_SCALE, Math.min(MAX_SCALE, state.scale))
      state.scale = Math.round(state.scale * 100) / 100
    }

    // ---- Sprite animation ----
    spriteAnim.isMoving = Math.abs(state.vx) > 1 || Math.abs(state.vy) > 1
    if (spriteAnim.isMoving) {
      spriteAnim.timer += dt
      if (spriteAnim.timer >= spriteAnim.frameTime) {
        spriteAnim.timer = 0
        spriteAnim.frame = (spriteAnim.frame + 1) % 4
      }
    } else {
      spriteAnim.frame = 0
      spriteAnim.timer = 0
    }

    // ---- Click effect ----
    if (clickEffect.active) {
      clickEffect.time += dt
      // Update particles
      for (const p of clickEffect.particles) {
        p.x += p.vx * dt
        p.y += p.vy * dt
        p.life -= dt
        p.vy += 80 * dt // gravity
      }
      clickEffect.particles = clickEffect.particles.filter((p) => p.life > 0)

      if (
        clickEffect.time >= clickEffect.maxTime &&
        clickEffect.particles.length === 0
      ) {
        clickEffect.active = false
      }
    }
  }

  function hitTest(mx, my) {
    const halfW = (state.width * state.scale) / 2
    const halfH = (state.height * state.scale) / 2
    return (
      mx >= state.x - halfW &&
      mx <= state.x + halfW &&
      my >= state.y - halfH &&
      my <= state.y + halfH
    )
  }

  function triggerClickEffect() {
    clickEffect.active = true
    clickEffect.time = 0
    clickEffect.x = state.x
    clickEffect.y = state.y
    clickEffect.rings = [
      { radius: 0, maxRadius: 60, speed: 150, alpha: 1 },
      { radius: 0, maxRadius: 80, speed: 120, alpha: 0.7 },
    ]
    // Spawn particles
    clickEffect.particles = []
    const colors = ['#00f5ff', '#a855f7', '#22d3ee', '#f472b6', '#facc15']
    for (let i = 0; i < 12; i++) {
      const angle = (Math.PI * 2 * i) / 12 + (Math.random() - 0.5) * 0.5
      const speed = 80 + Math.random() * 120
      clickEffect.particles.push({
        x: state.x,
        y: state.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 40,
        life: 0.4 + Math.random() * 0.4,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 3 + Math.random() * 4,
      })
    }
  }

  function startDrag(mx, my) {
    drag.active = true
    drag.offsetX = mx - state.x
    drag.offsetY = my - state.y
  }

  function stopDrag() {
    drag.active = false
  }

  function resetPosition() {
    state.x = canvasWidth / 2
    state.y = canvasHeight / 2
    state.rotation = 0
    state.scale = 1.0
    state.direction = 'Right'
    state.directionV = 'Idle'
    state.vx = 0
    state.vy = 0
  }

  function saveState() {
    const data = {
      x: state.x,
      y: state.y,
      rotation: state.rotation,
      scale: state.scale,
      direction: state.direction,
      objectType: objectType.value,
    }
    localStorage.setItem('gameObjectState', JSON.stringify(data))
  }

  function loadState() {
    const raw = localStorage.getItem('gameObjectState')
    if (!raw) return false
    try {
      const data = JSON.parse(raw)
      state.x = data.x ?? canvasWidth / 2
      state.y = data.y ?? canvasHeight / 2
      state.rotation = data.rotation ?? 0
      state.scale = data.scale ?? 1.0
      state.direction = data.direction ?? 'Right'
      objectType.value = data.objectType ?? 'character'
      state.vx = 0
      state.vy = 0
      return true
    } catch {
      return false
    }
  }

  return {
    state,
    clickEffect,
    drag,
    spriteAnim,
    objectType,
    update,
    hitTest,
    triggerClickEffect,
    startDrag,
    stopDrag,
    resetPosition,
    saveState,
    loadState,
  }
}
