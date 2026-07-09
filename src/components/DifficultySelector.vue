<template>
  <div class="difficulty-selector">
    <label for="difficulty">Tingkat Kesulitan Bot</label>
    <input
      id="difficulty"
      type="range"
      min="0"
      max="20"
      :value="modelValue"
      @input="$emit('update:modelValue', Number($event.target.value))"
    />
    <span class="difficulty-label">{{ difficultyLabel }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: Number, default: 10 }
})
defineEmits(['update:modelValue'])

const difficultyLabel = computed(() => {
  const v = props.modelValue
  if (v <= 3)  return `Pemula (${v})`
  if (v <= 8)  return `Menengah (${v})`
  if (v <= 14) return `Mahir (${v})`
  if (v <= 18) return `Master (${v})`
  return `Grandmaster (${v})`
})
</script>