<template>
  <div class="empty-state d-flex flex-column align-center justify-center text-center pa-8">
    <v-avatar size="56" :color="iconBgColor">
      <v-icon :icon="icon" :color="iconColor" size="28" />
    </v-avatar>

    <h3 class="text-subtitle-1 font-weight-bold mt-4 mb-2">{{ title }}</h3>
    <p class="text-body-2 text-medium-emphasis mb-4">{{ message }}</p>

    <v-btn
      v-if="actionLabel"
      color="secondary"
      variant="flat"
      :prepend-icon="actionIcon"
      @click="emit('action-click')"
    >
      {{ actionLabel }}
    </v-btn>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const emit = defineEmits(['action-click']);

const props = defineProps({
  icon: {
    type: String,
    default: 'mdi-database-search-outline',
  },
  title: {
    type: String,
    default: 'No Results Found',
  },
  message: {
    type: String,
    default: 'Try adjusting your filters to see more results.',
  },
  actionLabel: {
    type: String,
    default: '',
  },
  actionIcon: {
    type: String,
    default: 'mdi-refresh',
  },
  iconColor: {
    type: String,
    default: 'primary',
  },
});

const iconBgColor = computed(() => `${props.iconColor}15`);
</script>

<style scoped>
.empty-state {
  min-height: 220px;
}

.empty-state p {
  max-width: 420px;
}
</style>
