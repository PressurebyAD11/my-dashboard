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

    <v-app-bar class="dashboard-app-bar" color="primary" density="comfortable" elevation="0" :height="76">
      <div class="d-flex align-center topbar-brand">
        <v-btn
          v-if="showDrawer"
          class="menu-btn"
          icon="mdi-menu"
          variant="text"
          @click="drawer = !drawer"
        />

        <FastForwardBrandMark class="app-bar-logo" :height="24" />
      </div>

      <div class="brand-lockup">
        <div class="brand-kicker">FastForward Logistics</div>
        <v-toolbar-title class="dashboard-title">Operations Dashboard</v-toolbar-title>
      </div>

      <v-spacer />

      <div class="d-flex align-center mr-4 topbar-actions">
        <v-avatar class="user-avatar" size="40">
          <span class="user-avatar-text">SC</span>
        </v-avatar>
        <v-btn
          class="logout-btn"
          color="secondary"
          variant="flat"
          @click="logout"
        >
          LOG OUT
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
import FastForwardBrandMark from '../components/FastForwardBrandMark.vue';
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

.dashboard-app-bar :deep(.v-toolbar__content) {
  min-height: 76px !important;
  padding-block: 0.35rem;
}

.topbar-brand {
  gap: 1rem;
}

.menu-btn {
  margin-inline-start: 0;
}

.app-bar-logo {
  flex: 0 0 auto;
}

.brand-lockup {
  min-width: 0;
  margin-inline-start: 1rem;
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

.topbar-actions {
  gap: 1rem;
}

.user-avatar {
  background: rgba(12, 24, 45, 0.92);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.user-avatar-text {
  color: #fff;
  font-size: 0.94rem;
  font-weight: 800;
  letter-spacing: 0.04em;
}

.logout-btn {
  min-width: 116px;
  height: 2.9rem;
  padding-inline: 1rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-size: 0.95rem;
  font-weight: 700;
  border-radius: 0.55rem;
  transition: transform 200ms ease, box-shadow 200ms ease, background 200ms ease;
}

.logout-btn:hover {
  background: #e03d0f;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 75, 23, 0.45);
}

.logout-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(255, 75, 23, 0.3);
}

.logout-btn :deep(.v-btn__content) {
  color: #fff;
}

.dashboard-main {
  background: transparent;
}

.dashboard-container {
  padding-top: 1.5rem !important;
}

@media (max-width: 959px) {
  .topbar-actions {
    gap: 0.75rem !important;
  }

  .logout-btn {
    min-width: 0;
    padding-inline: 0.85rem;
  }
}
</style>
