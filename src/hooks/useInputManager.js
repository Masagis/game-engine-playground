import { reactive, onMounted, onUnmounted } from 'vue'

export function useInputManager(canvasRef) {
  const keys = reactive(new Set())
  const mouse = reactive({
    x: 0,
    y: 0,
    canvasX: 0,
    canvasY: 0,
    isDown: false,
    clicked: false,
    wheelDelta: 0,
  })

  // Track which keys are currently active for the UI
  const activeKeys = reactive(new Set())

  const GAME_KEYS = new Set([
    'ArrowUp',
    'ArrowDown',
    'ArrowLeft',
    'ArrowRight',
    'KeyW',
    'KeyA',
    'KeyS',
    'KeyD',
    'KeyQ',
    'KeyE',
  ])

  function onKeyDown(e) {
    // Ignore keys pressed with Cmd/Ctrl — these are OS/browser shortcuts
    // whose keyup events are often swallowed, causing stuck keys
    if (e.metaKey || e.ctrlKey) return

    if (GAME_KEYS.has(e.code)) {
      e.preventDefault()
    }
    keys.add(e.code)
    activeKeys.add(e.code)
  }

  function onKeyUp(e) {
    keys.delete(e.code)
    activeKeys.delete(e.code)
  }

  // Clear all pressed keys when the window/tab loses focus
  function onWindowBlur() {
    keys.clear()
    activeKeys.clear()
  }

  function onVisibilityChange() {
    if (document.hidden) {
      keys.clear()
      activeKeys.clear()
    }
  }

  function onMouseMove(e) {
    mouse.x = e.clientX
    mouse.y = e.clientY
    if (canvasRef.value) {
      const rect = canvasRef.value.getBoundingClientRect()
      mouse.canvasX = e.clientX - rect.left
      mouse.canvasY = e.clientY - rect.top
    }
  }

  function onMouseDown(e) {
    mouse.isDown = true
    mouse.clicked = true
    if (canvasRef.value) {
      const rect = canvasRef.value.getBoundingClientRect()
      mouse.canvasX = e.clientX - rect.left
      mouse.canvasY = e.clientY - rect.top
    }
  }

  function onMouseUp() {
    mouse.isDown = false
  }

  function onWheel(e) {
    e.preventDefault()
    mouse.wheelDelta = -e.deltaY
  }

  function consumeClick() {
    const wasClicked = mouse.clicked
    mouse.clicked = false
    return wasClicked
  }

  function consumeWheel() {
    const delta = mouse.wheelDelta
    mouse.wheelDelta = 0
    return delta
  }

  onMounted(() => {
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    window.addEventListener('blur', onWindowBlur)
    document.addEventListener('visibilitychange', onVisibilityChange)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)

    if (canvasRef.value) {
      canvasRef.value.addEventListener('mousedown', onMouseDown)
      canvasRef.value.addEventListener('wheel', onWheel, { passive: false })
    }
  })

  onUnmounted(() => {
    window.removeEventListener('keydown', onKeyDown)
    window.removeEventListener('keyup', onKeyUp)
    window.removeEventListener('blur', onWindowBlur)
    document.removeEventListener('visibilitychange', onVisibilityChange)
    window.removeEventListener('mousemove', onMouseMove)
    window.removeEventListener('mouseup', onMouseUp)

    if (canvasRef.value) {
      canvasRef.value.removeEventListener('mousedown', onMouseDown)
      canvasRef.value.removeEventListener('wheel', onWheel)
    }
  })

  function bindCanvas(canvas) {
    canvas.addEventListener('mousedown', onMouseDown)
    canvas.addEventListener('wheel', onWheel, { passive: false })
  }

  return { keys, mouse, activeKeys, consumeClick, consumeWheel, bindCanvas }
}
