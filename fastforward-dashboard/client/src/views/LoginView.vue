<template>
  <v-app>
    <v-main class="login-main">
      <v-container class="login-shell pa-6" fluid>
        <v-card class="login-card" elevation="10" rounded="xl">
          <v-card-item>
            <template #prepend>
              <v-avatar color="primary" size="40">
                <v-icon icon="mdi-truck-fast-outline" color="white" />
              </v-avatar>
            </template>
            <v-card-title class="text-h5 font-weight-bold">FastForward Login</v-card-title>
            <v-card-subtitle>Sign in to access operations dashboard</v-card-subtitle>
          </v-card-item>

          <v-card-text>
            <v-form @submit.prevent="onSubmit">
              <v-text-field
                v-model="username"
                label="Username"
                prepend-inner-icon="mdi-account-outline"
                variant="outlined"
                density="comfortable"
                autocomplete="username"
                :disabled="loading"
                required
              />

              <v-text-field
                v-model="password"
                label="Password"
                prepend-inner-icon="mdi-lock-outline"
                :append-inner-icon="showPassword ? 'mdi-eye-off-outline' : 'mdi-eye-outline'"
                :type="showPassword ? 'text' : 'password'"
                variant="outlined"
                density="comfortable"
                autocomplete="current-password"
                :disabled="loading"
                required
                @click:append-inner="showPassword = !showPassword"
              />

              <v-alert
                v-if="error"
                type="error"
                variant="tonal"
                density="comfortable"
                class="mb-4"
              >
                {{ error }}
              </v-alert>

              <v-btn
                type="submit"
                color="primary"
                size="large"
                block
                :loading="loading"
                :disabled="!canSubmit"
              >
                Sign In
              </v-btn>
            </v-form>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useAuth } from '../composables/useAuth';

const username = ref('');
const password = ref('');
const showPassword = ref(false);

const { login, loading, error } = useAuth();

const canSubmit = computed(() => username.value.trim().length > 0 && password.value.length > 0);

async function onSubmit() {
  if (!canSubmit.value || loading.value) return;
  await login(username.value.trim(), password.value);
}
</script>

<style scoped>
.login-main {
  min-height: 100vh;
  background-image:
    linear-gradient(135deg, rgba(4, 18, 46, 0.86) 0%, rgba(6, 24, 58, 0.74) 45%, rgba(8, 32, 72, 0.62) 100%),
    url('../assets/fastforward-login-bg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.login-shell {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.login-card {
  width: min(440px, 100%);
}

@media (min-width: 960px) {
  .login-shell {
    justify-content: flex-end;
  }
}
</style>
