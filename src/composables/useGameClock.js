import { ref, onUnmounted } from 'vue'

export function useGameClock() {
  const whiteTime = ref(0) // ms
  const blackTime = ref(0) // ms
  let intervalId = null
  let lastTick = null
  let activeColor = null // 'w' | 'b' | null

  function tick() {
    if (!activeColor || lastTick === null) return
    const now = Date.now()
    const delta = now - lastTick
    lastTick = now
    if (activeColor === 'w') whiteTime.value += delta
    else blackTime.value += delta
  }

  function start(color) {
    tick() // simpan sisa waktu warna sebelumnya dulu
    activeColor = color
    lastTick = Date.now()
    if (!intervalId) {
      intervalId = setInterval(tick, 200)
    }
  }

  function stopAll() {
    tick()
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }
    activeColor = null
    lastTick = null
  }

  function reset() {
    whiteTime.value = 0
    blackTime.value = 0
    activeColor = null
    lastTick = null
  }

  function formatTime(ms) {
    const totalSeconds = Math.floor(ms / 1000)
    const m = Math.floor(totalSeconds / 60)
    const s = totalSeconds % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  onUnmounted(stopAll)

  return { whiteTime, blackTime, start, stopAll, reset, formatTime }
}