import { ref, onUnmounted } from 'vue'

export function useStockfish() {
  const isReady = ref(false)
  const bestMove = ref(null)
  let worker = null
  let resolveMove = null

  function init() {
    worker = new Worker('/stockfish/stockfish-18-lite-single.js')

    worker.onmessage = (e) => {
      const line = e.data
      if (line === 'uciok') {
        worker.postMessage('isready')
      }
      if (line === 'readyok') {
        isReady.value = true
      }
      if (line.startsWith('bestmove')) {
        const move = line.split(' ')[1]
        bestMove.value = move
        if (resolveMove) {
          resolveMove(move === '(none)' ? null : move)
          resolveMove = null
        }
      }
    }

    worker.postMessage('uci')
  }

  function setSkillLevel(level) {
    // level: 0–20
    worker.postMessage(`setoption name Skill Level value ${level}`)
  }

  function getBestMove(fen, skillLevel = 10, thinkTimeMs = 1000) {
    return new Promise((resolve) => {
      resolveMove = resolve
      setSkillLevel(skillLevel)
      worker.postMessage(`position fen ${fen}`)
      worker.postMessage(`go movetime ${thinkTimeMs}`)
    })
  }

  function destroy() {
    if (worker) {
      worker.postMessage('quit')
      worker.terminate()
      worker = null
    }
  }

  onUnmounted(destroy)

  return { isReady, bestMove, init, getBestMove, destroy }
}