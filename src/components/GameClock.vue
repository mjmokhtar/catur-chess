<template>
  <div class="game-clock">
    <div class="clock-entry">
      <span class="clock-label">🙋 Anda</span>
      <span class="clock-time">{{ formatTime(playerTime) }}</span>
    </div>
    <div class="clock-entry">
      <span class="clock-label">🤖 Bot</span>
      <span class="clock-time">{{ formatTime(botTime) }}</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  playerTime: { type: Number, default: 0 },
  botTime: { type: Number, default: 0 },
  formatTime: { type: Function, required: true }
})
</script>

<style scoped>
.game-clock {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin: 0.5rem 0 0.75rem;
  font-family: 'IM Fell DW Pica', serif;
}
.clock-entry {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #fff8e0;
  border: 2px solid #8b0000;
  padding: 0.3rem 0.9rem;
  min-width: 80px;
}
.clock-label { font-size: 0.8rem; color: #7a5c2e; }
.clock-time { font-size: 1.1rem; font-weight: bold; color: #8b0000; }
</style>