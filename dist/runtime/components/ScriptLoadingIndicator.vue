<script setup lang="ts">
import { computed } from '#imports'

const props = withDefaults(defineProps<{
  color?: string
  size?: number
}>(), {
  color: 'currentColor',
  size: 30,
})

const styles = computed(() => ({
  width: `${props.size}px`,
  height: `${props.size}px`,
}))
</script>

<template>
  <div class="loader" :styles="styles" aria-label="Loading..." role="status" />
</template>

<style scoped>
.loader{animation:rotation 1s linear infinite;border:5px solid v-bind(color);border-bottom-color:transparent;border-radius:50%;box-sizing:border-box;display:inline-block;opacity:.5}@keyframes rotation{0%{transform:rotate(0deg)}to{transform:rotate(1turn)}}
</style>
