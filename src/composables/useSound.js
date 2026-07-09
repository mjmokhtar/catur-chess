// Sintesis suara sederhana pakai Web Audio API — tanpa file audio eksternal
let audioCtx = null

function getContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  }
  return audioCtx
}

function tone(freq, duration, type = 'sine', volume = 0.15, delay = 0) {
  const ctx = getContext()
  const osc = ctx.createOscillator()
  const gain = ctx.createGain()
  osc.type = type
  osc.frequency.value = freq
  gain.gain.value = volume
  osc.connect(gain)
  gain.connect(ctx.destination)

  const startTime = ctx.currentTime + delay
  gain.gain.setValueAtTime(volume, startTime)
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)

  osc.start(startTime)
  osc.stop(startTime + duration)
}

export function useSound() {
  function playMove() {
    // "tick" pendek, seperti pena menyentuh kertas
    tone(420, 0.08, 'triangle', 0.12)
  }

  function playCapture() {
    // bunyi lebih tegas/berat untuk capture
    tone(220, 0.12, 'square', 0.12)
    tone(140, 0.15, 'square', 0.08, 0.03)
  }

  function playCheck() {
    // seperti lonceng kecil — dua nada naik
    tone(600, 0.15, 'sine', 0.14)
    tone(900, 0.2, 'sine', 0.1, 0.1)
  }

  function playGameEnd() {
    // rangkaian nada penutup
    tone(500, 0.15, 'sine', 0.12)
    tone(400, 0.15, 'sine', 0.12, 0.15)
    tone(300, 0.25, 'sine', 0.12, 0.3)
  }

  return { playMove, playCapture, playCheck, playGameEnd }
}