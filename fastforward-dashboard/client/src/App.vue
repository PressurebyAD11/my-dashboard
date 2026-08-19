<template>
  <router-view />
</template>

<style>
/* Override Vuetify's Roboto default so every component inherits Inter */
html,
body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}

.v-application {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif !important;
}

.v-application * {
  font-family: inherit;
}
</style>
