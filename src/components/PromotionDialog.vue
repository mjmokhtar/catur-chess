<template>
  <div class="promotion-overlay">
    <div class="promotion-dialog">
      <p class="promotion-title">Promosikan pion menjadi:</p>
      <div class="promotion-options">
        <button @click="$emit('choose', 'q')" title="Menteri">
          {{ color === 'w' ? '♕' : '♛' }}
        </button>
        <button @click="$emit('choose', 'r')" title="Benteng">
          {{ color === 'w' ? '♖' : '♜' }}
        </button>
        <button @click="$emit('choose', 'b')" title="Gajah">
          {{ color === 'w' ? '♗' : '♝' }}
        </button>
        <button @click="$emit('choose', 'n')" title="Kuda">
          {{ color === 'w' ? '♘' : '♞' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  color: { type: String, default: 'w' } // warna pion yang promosi
})
defineEmits(['choose'])
</script>

<style scoped>
.promotion-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}
.promotion-dialog {
  background: #fff3c9;
  border: 3px solid #8b0000;
  padding: 1.5rem 2rem;
  text-align: center;
  box-shadow: 4px 4px 20px rgba(0,0,0,0.4);
}
.promotion-title {
  font-family: 'IM Fell DW Pica SC', serif;
  color: #8b0000;
  margin: 0 0 1rem;
  font-size: 1rem;
}
.promotion-options {
  display: flex;
  gap: 0.75rem;
}
.promotion-options button {
  font-size: 2.2rem;
  background: #fff8e0;
  border: 2px solid #8b0000;
  width: 60px;
  height: 60px;
  cursor: pointer;
  transition: background 0.15s;
}
.promotion-options button:hover {
  background: #e8c84a;
}
</style>