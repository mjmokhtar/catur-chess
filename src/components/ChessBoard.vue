<template>
  <div class="board-wrapper">
    <div class="board">
      <div
        v-for="square in squares"
        :key="square.id"
        class="square"
        :class="[
          square.color,
          { 'selected':    square.id === selectedSquare },
          { 'legal-move':  legalMoves.includes(square.id) },
          { 'last-move':   lastMove && (square.id === lastMove.from || square.id === lastMove.to) },
          { 'in-check':    inCheck && square.piece?.type === 'k' && square.piece?.color === turn },
        ]"
        @click="$emit('square-click', square.id)"
      >
        <span v-if="square.piece" class="piece">{{ pieceUnicode(square.piece) }}</span>
        <span v-if="legalMoves.includes(square.id) && !square.piece" class="dot" />
        <span class="coord-file" v-if="square.rank === 1">{{ square.file }}</span>
        <span class="coord-rank" v-if="square.file === 'a'">{{ square.rank }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Chess } from 'chess.js'

const props = defineProps({
  fen:            { type: String, required: true },
  selectedSquare: { type: String, default: null },
  legalMoves:     { type: Array,  default: () => [] },
  lastMove:       { type: Object, default: null },
  turn:           { type: String, default: 'w' },
  flipped:        { type: Boolean, default: false }, // ← baru
})
defineEmits(['square-click'])

const UNICODE = {
  wk: '♔', wq: '♕', wr: '♖', wb: '♗', wn: '♘', wp: '♙',
  bk: '♚', bq: '♛', br: '♜', bb: '♝', bn: '♞', bp: '♟',
}

function pieceUnicode(piece) {
  return UNICODE[`${piece.color}${piece.type}`] || ''
}

const squares = computed(() => {
  const chess = new Chess(props.fen)
  const result = []
  const files = ['a','b','c','d','e','f','g','h']
  const ranks = props.flipped ? [1,2,3,4,5,6,7,8] : [8,7,6,5,4,3,2,1]
  const orderedFiles = props.flipped ? [...files].reverse() : files

  for (const rank of ranks) {
    for (const file of orderedFiles) {
      const id = `${file}${rank}`
      const piece = chess.get(id)
      const fIndex = files.indexOf(file)
      const isLight = (fIndex + rank) % 2 === 0
      result.push({ id, file, rank, piece: piece || null, color: isLight ? 'light' : 'dark' })
    }
  }
  return result
})

const inCheck = computed(() => {
  const chess = new Chess(props.fen)
  return chess.inCheck()
})
</script>