<template>
  <v-app>
    <v-navigation-drawer
      v-if="showDrawer"
      v-model="drawer"
      :rail="isMobile"
      border="end"
      color="surface"
    >
      <v-list nav density="comfortable">
        <v-list-subheader class="text-uppercase">Navigation</v-list-subheader>
        <v-list-item
          v-for="item in navItems"
          :key="item.title"
          :to="item.to"
          :prepend-icon="item.icon"
          :title="item.title"
          rounded="lg"
        />
      </v-list>
    </v-navigation-drawer>

    <v-app-bar color="primary" density="comfortable" elevation="2">
      <v-btn
        v-if="showDrawer"
        icon="mdi-menu"
        variant="text"
        @click="drawer = !drawer"
      />

      <v-avatar class="ml-1" color="secondary" size="32">
        <v-icon icon="mdi-truck-fast-outline" color="white" size="18" />
      </v-avatar>

      <v-toolbar-title class="ml-3 font-weight-bold">
        FastForward Operations Dashboard
      </v-toolbar-title>

      <v-spacer />

      <div class="d-flex align-center ga-2">
        <v-chip color="white" variant="tonal" size="small">
          {{ userName }}
        </v-chip>
        <v-btn
          color="secondary"
          variant="flat"
          prepend-icon="mdi-logout"
          @click="logout"
        >
          Logout
        </v-btn>
      </div>
    </v-app-bar>

    <v-main>
      <v-container fluid class="pa-4 pa-md-6">
        <slot />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useDisplay } from 'vuetify';
import { useAuth } from '../composables/useAuth';

const props = defineProps({
  showDrawer: {
    type: Boolean,
    default: true,
  },
  navItems: {
    type: Array,
    default: () => [
      { title: 'Dashboard', icon: 'mdi-view-dashboard-outline', to: '/dashboard' },
    ],
  },
});

const { mobile } = useDisplay();
const { logout } = useAuth();

const drawer = ref(!mobile.value && props.showDrawer);

const isMobile = computed(() => mobile.value);
const userName = computed(() => {
  try {
    const raw = localStorage.getItem('ff-user');
    const user = raw ? JSON.parse(raw) : null;
    return user?.name || user?.username || 'Operations User';
  } catch {
    return 'Operations User';
  }
});
</script>
