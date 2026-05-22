import { ref, onUnmounted } from 'vue'

export function useGameLoop(updateCallback, renderCallback) {
  const fps = ref(0)
  const isRunning = ref(false)

  let animFrameId = null
  let lastTime = 0
  let fpsAccumulator = 0
  let fpsFrameCount = 0

  function loop(currentTime) {
    if (!isRunning.value) return

    const dt = Math.min((currentTime - lastTime) / 1000, 0.05) // cap at 50ms
    lastTime = currentTime

    // FPS calculation
    fpsAccumulator += dt
    fpsFrameCount++
    if (fpsAccumulator >= 0.5) {
      fps.value = Math.round(fpsFrameCount / fpsAccumulator)
      fpsAccumulator = 0
      fpsFrameCount = 0
    }

    updateCallback(dt)
    renderCallback(dt)

    animFrameId = requestAnimationFrame(loop)
  }

  function start() {
    if (isRunning.value) return
    isRunning.value = true
    lastTime = performance.now()
    animFrameId = requestAnimationFrame(loop)
  }

  function stop() {
    isRunning.value = false
    if (animFrameId !== null) {
      cancelAnimationFrame(animFrameId)
      animFrameId = null
    }
  }

  onUnmounted(stop)

  return { fps, isRunning, start, stop }
}
