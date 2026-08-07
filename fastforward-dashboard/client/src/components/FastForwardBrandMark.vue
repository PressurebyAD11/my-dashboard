<template>
  <div class="brand-mark" aria-hidden="true">
    <svg viewBox="0 0 60 40" xmlns="http://www.w3.org/2000/svg" focusable="false">
      <polygon points="0,0 20,0 34,20 20,40 0,40 14,20" fill="#ffffff" />
      <polygon points="24,0 44,0 58,20 44,40 24,40 38,20" fill="#ff4b17" />
    </svg>
  </div>
</template>

<script setup>
defineProps({
  height: {
    type: [Number, String],
    default: 40,
  },
});
</script>

<style scoped>
.brand-mark {
  display: inline-flex;
  align-items: center;
}

.brand-mark svg {
  height: v-bind('typeof height === "number" ? `${height}px` : height');
  width: auto;
  display: block;
}
</style>