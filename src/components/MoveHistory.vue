<template>
  <div class="move-history" v-if="moves.length">
    <button class="move-history-header" @click="expanded = !expanded">
      <span>Riwayat Langkah ({{ moves.length }})</span>
      <span class="chevron" :class="{ open: expanded }">▾</span>
    </button>

    <ol class="move-list" v-show="expanded">
      <li v-for="(pair, i) in movePairs" :key="i">
        <span class="move-num">{{ i + 1 }}.</span>
        <span class="move-white">{{ pair.white }}</span>
        <span class="move-black">{{ pair.black || '' }}</span>
      </li>
    </ol>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'

const props = defineProps({
  moves: { type: Array, default: () => [] } // [{ san, fen }, ...]
})

const expanded = ref(false)

const movePairs = computed(() => {
  const pairs = []
  for (let i = 0; i < props.moves.length; i += 2) {
    pairs.push({
      white: props.moves[i]?.san || '',
      black: props.moves[i + 1]?.san || ''
    })
  }
  return pairs
})
</script>

<style scoped>
.move-history {
  max-width: 300px;
  margin: 1rem auto 0;
  border: 2px solid #8b0000;
  background: #fff8e0;
}

.move-history-header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 0.6rem 1rem;
  font-family: 'IM Fell DW Pica SC', serif;
  color: #8b0000;
  font-size: 0.95rem;
  letter-spacing: 0.03em;
}

.chevron {
  transition: transform 0.2s;
  font-size: 0.85rem;
}
.chevron.open {
  transform: rotate(180deg);
}

.move-list {
  list-style: none;
  margin: 0;
  padding: 0 1rem 0.75rem;
  font-size: 0.9rem;
  color: #4a3520;
  max-height: 180px;
  overflow-y: auto;
  border-top: 1px solid #d8b96a;
  padding-top: 0.5rem;
}
.move-list li {
  display: flex;
  gap: 0.75rem;
  padding: 0.15rem 0;
}
.move-num { width: 1.8rem; color: #7a5c2e; }
.move-white, .move-black { min-width: 4rem; }
</style>