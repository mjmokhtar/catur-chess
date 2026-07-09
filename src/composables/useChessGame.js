import { ref, computed } from 'vue'
import { Chess } from 'chess.js'

export function useChessGame() {
  const chess = ref(new Chess())
  const fen = ref(chess.value.fen())
  const selectedSquare = ref(null)
  const legalMovesForSelected = ref([])
  const lastMove = ref(null)
  const status = ref('playing')
  const moveHistory = ref([])
  const playerColor = ref('w')
  const resignedBy = ref(null)

  // State untuk dialog promosi pending
  const pendingPromotion = ref(null) // { from, to } | null

  function updateStatus() {
    const c = chess.value
    if (c.isCheckmate())     status.value = 'checkmate'
    else if (c.isStalemate()) status.value = 'stalemate'
    else if (c.isDraw())      status.value = 'draw'
    else if (c.inCheck())     status.value = 'check'
    else                      status.value = 'playing'
  }

  function isPromotionMove(from, to) {
    const piece = chess.value.get(from)
    if (!piece || piece.type !== 'p') return false
    const targetRank = to[1]
    return (piece.color === 'w' && targetRank === '8') ||
           (piece.color === 'b' && targetRank === '1')
  }

  function executeMove(from, to, promotion) {
    const move = chess.value.move({ from, to, promotion })
    if (move) {
      lastMove.value = { from: move.from, to: move.to }
      moveHistory.value.push({ san: move.san, fen: chess.value.fen() })
      fen.value = chess.value.fen()
      updateStatus()
    }
    return move
  }

  function selectSquare(square) {
    const c = chess.value
    if (selectedSquare.value && legalMovesForSelected.value.includes(square)) {
      const from = selectedSquare.value
      const to = square

      selectedSquare.value = null
      legalMovesForSelected.value = []

      // Jika ini gerakan promosi, jangan eksekusi dulu — tunggu pilihan pemain
      if (isPromotionMove(from, to)) {
        pendingPromotion.value = { from, to }
        return { moved: false, awaitingPromotion: true }
      }

      const move = executeMove(from, to, undefined)
      return { moved: !!move, move }
    }

    const piece = c.get(square)
    if (piece && piece.color === c.turn()) {
      selectedSquare.value = square
      legalMovesForSelected.value = c
        .moves({ square, verbose: true })
        .map(m => m.to)
    } else {
      selectedSquare.value = null
      legalMovesForSelected.value = []
    }
    return { moved: false }
  }

  function confirmPromotion(pieceType) {
    // pieceType: 'q' | 'r' | 'b' | 'n'
    if (!pendingPromotion.value) return null
    const { from, to } = pendingPromotion.value
    pendingPromotion.value = null
    return executeMove(from, to, pieceType)
  }

  function cancelPromotion() {
    pendingPromotion.value = null
  }

  function applyBotMove(uciMove) {
    if (!uciMove) return
    const from = uciMove.slice(0, 2)
    const to   = uciMove.slice(2, 4)
    const promo = uciMove[4] || 'q' // bot selalu promosi ke Menteri (wajar untuk AI)
    executeMove(from, to, promo)
  }

  function resign(color) {
    resignedBy.value = color
    status.value = 'resigned'
  }

  function resetGame(color = 'w') {
    chess.value = new Chess()
    fen.value = chess.value.fen()
    selectedSquare.value = null
    legalMovesForSelected.value = []
    lastMove.value = null
    status.value = 'playing'
    moveHistory.value = []
    playerColor.value = color
    resignedBy.value = null
    pendingPromotion.value = null
  }

  const turn = computed(() => chess.value.turn())
  const isGameOver = computed(() =>
    ['checkmate', 'stalemate', 'draw', 'resigned'].includes(status.value)
  )
  const botColor = computed(() => (playerColor.value === 'w' ? 'b' : 'w'))

  return {
    fen, turn, status, isGameOver,
    selectedSquare, legalMovesForSelected, lastMove,
    moveHistory, playerColor, botColor, resignedBy,
    pendingPromotion,
    selectSquare, applyBotMove, resetGame, resign,
    confirmPromotion, cancelPromotion
  }
}