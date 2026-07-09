<template>
  <div class="game-status">
    <p class="status-text">
      <span v-if="isBotThinking" class="spinner" />
      {{ statusText }}
    </p>
    <p class="turn-text" v-if="!isGameOver && !isBotThinking">
      Giliran: <strong>{{ turn === playerColor ? '🙋 Anda' : '🤖 Bot' }}</strong>
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: { type: String, default: 'playing' },
  turn:   { type: String, default: 'w' },
  isGameOver: { type: Boolean, default: false },
  isBotThinking: { type: Boolean, default: false },
  resignedBy: { type: String, default: null },
  playerColor: { type: String, default: 'w' },
})

const statusText = computed(() => {
  if (props.isBotThinking) return 'Bot sedang berpikir...'
  switch (props.status) {
    case 'check':     return '⚠️ Skak!'
    case 'checkmate': return props.turn === props.playerColor
                        ? '💀 Skak Mat — Bot menang!'
                        : '🏆 Skak Mat — Anda menang!'
    case 'stalemate': return '🤝 Remis — Stalemate'
    case 'draw':      return '🤝 Remis'
    case 'resigned':  return props.resignedBy === props.playerColor
                        ? '🏳️ Anda menyerah — Bot menang'
                        : '🏳️ Bot menyerah — Anda menang!'
    default:          return '♟ Permainan berlangsung'
  }
})

</script>

<style scoped>
.spinner {
  display: inline-block;
  width: 0.9em;
  height: 0.9em;
  border: 2px solid #d8b96a;
  border-top-color: #8b0000;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  margin-right: 0.4em;
  vertical-align: -0.1em;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>