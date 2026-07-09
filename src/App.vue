<template>
  <main class="oldbook-chess">
    <h1>Oldbook Chess</h1>
    <p class="subtitle"><em>A game of ancient wisdom</em></p>
    
    <!-- Layar pemilihan warna, sebelum game mulai -->
    <div v-if="!gameStarted" class="color-select">
      <p class="color-select-label">Pilih warna Anda</p>
      <div class="color-options">
        <button
        :class="{ active: chosenColor === 'w' }"
        @click="chosenColor = 'w'"
        >⬜ Putih</button>
        <button
        :class="{ active: chosenColor === 'b' }"
        @click="chosenColor = 'b'"
        >⬛ Hitam</button>
      </div>
      <DifficultySelector v-model="skillLevel" />
      <button class="ready-btn" @click="startGame">✦ Ready</button>
    </div>

    <!-- Game -->
    <template v-else>

      <GameStatus
        :status="status"
        :turn="turn"
        :is-game-over="isGameOver"
        :is-bot-thinking="isBotThinking"
        :resigned-by="resignedBy"
        :player-color="playerColor"
      />

      <ChessBoard
        :fen="fen"
        :selected-square="selectedSquare"
        :legal-moves="legalMovesForSelected"
        :last-move="lastMove"
        :turn="turn"
        :flipped="playerColor === 'b'"
        @square-click="onSquareClick"
      />

      <MoveHistory :moves="moveHistory" />

      <div class="controls">
        <button @click="backToColorSelect">✦ New Game</button>
        <button
          v-if="!isGameOver"
          class="resign-btn"
          @click="handleResign"
        >🏳️ Resign</button>
      </div>
    </template>

    <div v-if="!stockfishReady" class="engine-loading">
      ⏳ Memuat engine Stockfish...
    </div>

  <PromotionDialog
    v-if="pendingPromotion"
    :color="playerColor"
    @choose="onPromotionChoose"
  />
  </main>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import ChessBoard from './components/ChessBoard.vue'
import GameStatus from './components/GameStatus.vue'
import DifficultySelector from './components/DifficultySelector.vue'
import { useChessGame } from './composables/useChessGame.js'
import { useStockfish } from './composables/useStockfish.js'
import MoveHistory from './components/MoveHistory.vue'
import PromotionDialog from './components/PromotionDialog.vue'
import { useSound } from './composables/useSound.js'

const skillLevel = ref(10)
const isBotThinking = ref(false)
const gameStarted = ref(false)
const chosenColor = ref('w')

const {
  fen, turn, status, isGameOver,
  selectedSquare, legalMovesForSelected, lastMove,
  moveHistory, playerColor, botColor, resignedBy,
  pendingPromotion,
  selectSquare, applyBotMove, resetGame, resign,
  confirmPromotion, cancelPromotion
} = useChessGame()

const { isReady: stockfishReady, init, getBestMove } = useStockfish()

onMounted(() => init())

const { playMove, playCapture, playCheck, playGameEnd } = useSound()

function playSoundForLastMove() {
  const last = moveHistory.value[moveHistory.value.length - 1]
  if (!last) return
  const san = last.san
  if (san.includes('#')) {
    playGameEnd()
  } else if (san.includes('+')) {
    playCheck()
  } else if (san.includes('x')) {
    playCapture()
  } else {
    playMove()
  }
}

async function triggerBotMoveIfNeeded() {
  if (isGameOver.value) return
  if (turn.value !== botColor.value) return
  isBotThinking.value = true
  const uciMove = await getBestMove(fen.value, skillLevel.value, 1000)
  applyBotMove(uciMove)
  playSoundForLastMove()          // ← tambah
  isBotThinking.value = false
}

async function onSquareClick(square) {
  if (isGameOver.value || turn.value !== playerColor.value || isBotThinking.value) return
  if (pendingPromotion.value) return // sedang menunggu pilihan promosi

  const result = selectSquare(square)

  if (result.moved && !isGameOver.value) {
    playSoundForLastMove()        // ← tambah
    await triggerBotMoveIfNeeded()
  }
  // Jika awaitingPromotion, tunggu user pilih via dialog — bot move dipicu setelah confirm
}

async function onPromotionChoose(pieceType) {
  confirmPromotion(pieceType)
  playSoundForLastMove()          // ← tambah
  if (!isGameOver.value) {
    await triggerBotMoveIfNeeded()
  }
}

function startGame() {
  resetGame(chosenColor.value)
  gameStarted.value = true
  // Jika pemain pilih hitam, bot (putih) jalan duluan
  triggerBotMoveIfNeeded()
}

function backToColorSelect() {
  gameStarted.value = false
  isBotThinking.value = false
}

function handleResign() {
  if (isGameOver.value) return
  resign(playerColor.value)
}
</script>

<style>
/* ── Layout utama ── */
.oldbook-chess {
  max-width: 560px;
  margin: 2rem auto;
  padding: 2rem;
  text-align: center;
}

.oldbook-chess h1 {
  font-family: 'IM Fell DW Pica SC', serif;
  font-size: 2.4rem;
  color: #8b0000;
  margin-bottom: 0.2rem;
  letter-spacing: 0.05em;
}

.subtitle {
  color: #7a5c2e;
  margin-bottom: 1.5rem;
  font-size: 1rem;
}

/* ── Board ── */
.board-wrapper {
  display: flex;
  justify-content: center;
  margin: 1rem 0;
}

.board {
  display: grid;
  grid-template-columns: repeat(8, 1fr);
  grid-template-rows: repeat(8, 1fr);   /* ← tambahkan baris ini */
  width: min(480px, 92vw);
  height: min(480px, 92vw);
  border: 3px solid #8b0000;
  box-shadow: 4px 4px 16px rgba(0,0,0,0.35);
  position: relative;
}

.square {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: filter 0.1s;
  overflow: hidden;      /* ← tambah */
  min-width: 0;          /* ← tambah */
  min-height: 0;         /* ← tambah */
}

.square.light { background: #fff3c9; }
.square.dark  { background: #c8a96e; }

.square.selected    { background: #e8c84a !important; }
.square.last-move   { background: #d4b84a99; }
.square.in-check    { background: #cc333388 !important; }

/* dot untuk legal move kosong */
.dot {
  width: 28%;
  height: 28%;
  border-radius: 50%;
  background: rgba(139,0,0,0.35);
  pointer-events: none;
}

/* highlight legal move yang ada bidak (capture) */
.square.legal-move.dark  { outline: 3px inset #8b0000; }
.square.legal-move.light { outline: 3px inset #8b0000; }

/* ── Piece ── */
.piece {
  width: 78%;
  height: 78%;
  object-fit: contain;
  user-select: none;
  pointer-events: none;
  filter: drop-shadow(1px 1px 1px rgba(0,0,0,0.35));
}

/* ── Koordinat ── */
.coord-file,
.coord-rank {
  position: absolute;
  font-size: 0.55rem;
  color: #7a5c2e;
  font-family: 'IM Fell DW Pica', serif;
  line-height: 1;
}
.coord-file { bottom: 1px; right: 2px; }
.coord-rank { top: 1px; left: 2px; }

.color-select {
  margin: 1.5rem 0;
}
.color-select-label {
  color: #4a3520;
  margin-bottom: 0.75rem;
  font-size: 1rem;
}
.color-options {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-bottom: 1.25rem;
}
.color-options button {
  font-family: 'IM Fell DW Pica', serif;
  font-size: 1rem;
  background: #fff3c9;
  color: #4a3520;
  border: 2px solid #8b0000;
  padding: 0.5rem 1.25rem;
  cursor: pointer;
  transition: background 0.2s;
}
.color-options button.active {
  background: #8b0000;
  color: #fff3c9;
}
.ready-btn {
  font-family: 'IM Fell DW Pica', serif;
  font-size: 1rem;
  background: #8b0000;
  color: #fff3c9;
  border: none;
  padding: 0.5rem 1.5rem;
  cursor: pointer;
  letter-spacing: 0.05em;
}
.ready-btn:hover { background: #6b0000; }

/* ── Status & Difficulty ── */
.game-status {
  margin: 0.75rem 0;
}
.status-text {
  font-size: 1.1rem;
  color: #8b0000;
  font-weight: bold;
  margin: 0.2rem 0;
}
.turn-text { margin: 0; font-size: 0.95rem; color: #4a3520; }

.difficulty-selector {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  font-size: 0.9rem;
  color: #4a3520;
}
.difficulty-selector input[type=range] {
  accent-color: #8b0000;
  width: 120px;
}
.difficulty-label { min-width: 110px; text-align: left; }

/* ── Controls ── */
.controls {
  display: flex;
  justify-content: center;
  gap: 0.75rem;
    margin-top: 1.5rem;   /* ← tambahkan baris ini */
}

.controls button {
  font-family: 'IM Fell DW Pica', serif;
  font-size: 1rem;
  background: #8b0000;
  color: #fff3c9;
  border: none;
  padding: 0.5rem 1.5rem;
  cursor: pointer;
  letter-spacing: 0.05em;
  transition: background 0.2s;
}
.controls button:hover { background: #6b0000; }

.engine-loading {
  margin-top: 0.75rem;
  font-size: 0.85rem;
  color: #7a5c2e;
}

.resign-btn {
  font-family: 'IM Fell DW Pica', serif;
  font-size: 1rem;
  background: transparent;
  color: #8b0000;
  border: 2px solid #8b0000;
  padding: 0.5rem 1.25rem;
  cursor: pointer;
}
.resign-btn:hover { background: #8b0000; color: #fff3c9; }
</style>