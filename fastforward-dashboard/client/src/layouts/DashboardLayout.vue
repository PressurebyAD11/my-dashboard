<template>
  <v-app class="dashboard-app">
    <v-navigation-drawer
      v-if="showDrawer"
      v-model="drawer"
      :rail="isMobile"
      border="end"
      color="surface"
      class="dashboard-drawer"
    >
      <div class="drawer-header px-4 pt-4 pb-2">
        <div class="drawer-kicker">FastForward</div>
        <div class="drawer-title">Operations</div>
      </div>

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

    <v-app-bar class="dashboard-app-bar" color="primary" density="comfortable" elevation="0">
      <v-btn
        v-if="showDrawer"
        icon="mdi-menu"
        variant="text"
        @click="drawer = !drawer"
      />

      <v-avatar class="ml-1 brand-avatar" color="secondary" size="40">
        <v-icon icon="mdi-truck-fast-outline" color="white" size="18" />
      </v-avatar>

      <div class="brand-lockup ml-3">
        <div class="brand-kicker">FastForward Logistics</div>
        <v-toolbar-title class="dashboard-title">Operations Dashboard</v-toolbar-title>
      </div>

      <v-spacer />

      <div class="d-flex align-center ga-2 mr-4 topbar-actions">
        <v-chip class="user-chip" color="white" variant="tonal" size="default">
          {{ userName }}
        </v-chip>
        <v-btn
          class="logout-btn"
          color="secondary"
          variant="flat"
          prepend-icon="mdi-logout"
          @click="logout"
        >
          Log out
        </v-btn>
      </div>
    </v-app-bar>

    <v-main class="dashboard-main">
      <v-container fluid class="pa-4 pa-md-6 dashboard-container">
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
      { title: 'Overview', icon: 'mdi-view-dashboard-outline', to: '/dashboard' },
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

<style scoped>
.dashboard-app {
  background:
    radial-gradient(circle at top right, rgba(242, 101, 34, 0.06), transparent 28%),
    linear-gradient(180deg, #f7f9fd 0%, #eef3f9 100%);
}

.dashboard-drawer {
  border-right: 1px solid rgba(27, 42, 74, 0.08);
}

.drawer-header {
  border-bottom: 1px solid rgba(27, 42, 74, 0.08);
  margin-bottom: 0.5rem;
}

.drawer-kicker {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: rgba(27, 42, 74, 0.56);
}

.drawer-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1b2a4a;
}

.dashboard-app-bar {
  background: linear-gradient(135deg, #172849 0%, #22365c 100%) !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
  box-shadow: 0 12px 30px rgba(12, 24, 45, 0.18);
}

.brand-avatar {
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.08);
}

.brand-lockup {
  min-width: 0;
}

.brand-kicker {
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(230, 238, 252, 0.68);
}

.dashboard-title {
  font-size: clamp(1.15rem, 1.6vw, 1.55rem);
  font-weight: 750;
  line-height: 1.15;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.user-chip {
  border: 1px solid rgba(255, 255, 255, 0.08);
  font-weight: 600;
}

.logout-btn {
  min-width: 116px;
  text-transform: none;
  letter-spacing: 0.01em;
  font-weight: 700;
}

.dashboard-main {
  background: transparent;
}

.dashboard-container {
  padding-top: 1.5rem !important;
}

@media (max-width: 959px) {
  .topbar-actions {
    gap: 0.5rem !important;
  }

  .user-chip {
    display: none;
  }

  .logout-btn {
    min-width: 0;
    padding-inline: 0.85rem;
  }
}
</style>
