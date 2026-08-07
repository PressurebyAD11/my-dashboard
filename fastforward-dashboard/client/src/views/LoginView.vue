<template>
  <v-app>
    <v-main class="login-main">
      <v-container class="login-shell px-4 px-sm-8 px-md-10" fluid>
        <v-card class="login-card" elevation="0" rounded="xl">
          <v-card-text class="pa-7 pa-sm-9">
            <div class="brand-row mb-9">
              <FastForwardBrandMark class="brand-mark" :height="41.6" />
              <div class="brand-text">
                <p class="brand-name ma-0">
                  FAST<span>FORWARD</span>
                </p>
                <p class="brand-sub ma-0">LOGISTICS</p>
              </div>
            </div>

            <h1 class="welcome-title mb-1">Operations Dashboard</h1>
            <p class="welcome-subtitle mb-6">Access the FastForward Logistics operations platform.</p>

            <v-form class="login-form" @submit.prevent="onSubmit">
              <v-text-field
                v-model="username"
                label="Username"
                prepend-inner-icon="mdi-account-outline"
                class="login-field"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
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
                class="login-field"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                autocomplete="current-password"
                :disabled="loading"
                required
                @click:append-inner="showPassword = !showPassword"
              />

              <div class="meta-row mb-6">
                <label class="remember-wrap">
                  <v-checkbox-btn
                    v-model="rememberMe"
                    color="white"
                    density="compact"
                    hide-details
                    :ripple="false"
                  />
                  <span>Remember me</span>
                </label>
                <button type="button" class="forgot-link">Forgot password?</button>
              </div>

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
                class="sign-in-btn"
                size="x-large"
                block
                :loading="loading"
                :disabled="!canSubmit"
              >
                Sign In
              </v-btn>

              <p class="footnote mt-7 mb-0">
                <v-icon icon="mdi-shield-check-outline" size="17" class="mr-2" />
                Real-time operational visibility.
              </p>
            </v-form>
          </v-card-text>
        </v-card>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { computed, ref } from 'vue';
import FastForwardBrandMark from '../components/FastForwardBrandMark.vue';
import { useAuth } from '../composables/useAuth';

const username = ref('');
const password = ref('');
const showPassword = ref(false);
const rememberMe = ref(false);

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
  position: relative;
  background-image:
    linear-gradient(to right, rgba(4, 18, 46, 0.38) 0%, rgba(6, 24, 58, 0.50) 50%, rgba(8, 32, 72, 0.63) 100%),
    url('../assets/fastforward-login-bg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

/* Warm glow simulating truck headlights, positioned lower-center-left */
.login-main::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(ellipse 38% 28% at 32% 68%, rgba(255, 195, 90, 0.13) 0%, transparent 70%);
  animation: headlight-pulse 8s ease-in-out infinite;
  z-index: 0;
}

/* Diagonal shimmer sweep simulating roadway light trails */
.login-main::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: linear-gradient(108deg, transparent 25%, rgba(255, 255, 255, 0.035) 50%, transparent 75%);
  background-size: 300% 100%;
  animation: road-shimmer 11s ease-in-out infinite;
  z-index: 0;
}

.login-shell {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 1;
}

/* Soft cool-blue pulse simulating world map network connection activity */
.login-shell::before {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background: radial-gradient(ellipse 55% 45% at 50% 38%, rgba(90, 150, 255, 0.07) 0%, transparent 65%);
  animation: network-pulse 12s ease-in-out infinite;
  z-index: 0;
}

.login-card {
  width: min(420px, 100%);
  color: #f2f6ff;
  background: linear-gradient(165deg, rgba(8, 19, 39, 0.86) 0%, rgba(6, 14, 28, 0.9) 100%);
  border: 1px solid rgba(205, 222, 255, 0.18);
  box-shadow: 0 22px 60px rgba(3, 10, 24, 0.5);
  backdrop-filter: blur(8px);
}

.brand-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.brand-mark {
  flex: 0 0 auto;
}

.brand-name {
  font-size: clamp(1.45rem, 2vw, 1.95rem);
  line-height: 1;
  font-weight: 800;
  letter-spacing: 0.02em;
}

.brand-name span {
  color: #ff4b17;
}

.brand-sub {
  margin-top: 0.28rem;
  letter-spacing: 0.42em;
  font-size: 0.84rem;
  color: #d4dfef;
}

.welcome-title {
  font-size: clamp(1.5rem, 2vw, 1.7rem);
  line-height: 1.2;
  font-weight: 650;
  white-space: nowrap;
  text-align: center;
}

.welcome-subtitle {
  color: rgba(233, 241, 255, 0.86);
  font-size: 0.82rem;
  white-space: nowrap;
  text-align: center;
}

.login-form {
  display: grid;
  gap: 1rem;
}

.meta-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 0.7rem;
}

.remember-wrap {
  display: inline-flex;
  align-items: center;
  gap: 0.15rem;
  color: rgba(230, 238, 255, 0.88);
  font-size: 0.95rem;
}

.forgot-link {
  color: #ff6638;
  background: transparent;
  border: 0;
  padding: 0;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
}

.sign-in-btn {
  height: 2.9rem;
  text-transform: none;
  letter-spacing: 0;
  font-size: 1.1rem;
  font-weight: 600;
  background: #ff4b17;
  color: #fff;
  border-radius: 0.55rem;
  transition: transform 200ms ease, box-shadow 200ms ease, background 200ms ease;
}

.sign-in-btn:hover {
  background: #e03d0f;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 75, 23, 0.45);
}

.sign-in-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(255, 75, 23, 0.3);
}

.footnote {
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(220, 230, 248, 0.84);
  font-size: 0.9rem;
}

.login-card :deep(.login-field .v-field) {
  background: rgba(7, 16, 31, 0.5);
  border-radius: 0.5rem;
  min-height: 2.9rem;
}

.login-card :deep(.login-field .v-field--variant-outlined .v-field__outline) {
  --v-field-border-opacity: 0.28;
  color: rgba(206, 222, 252, 0.78);
}

.login-card :deep(.login-field .v-label),
.login-card :deep(.login-field input),
.login-card :deep(.login-field .v-field__input) {
  color: #f2f6ff;
}

.login-card :deep(.login-field .v-input__prepend),
.login-card :deep(.login-field .v-input__append) {
  color: rgba(226, 237, 255, 0.84);
}

.login-card :deep(.v-selection-control) {
  min-height: auto;
}

@media (min-width: 960px) {
  .login-shell {
    justify-content: flex-end;
    padding-right: 6.5rem;
  }
}

@media (max-width: 959px) {
  .login-card {
    max-width: 500px;
  }

  .welcome-subtitle {
    font-size: 0.98rem;
  }
}

@media (max-width: 599px) {
  .meta-row {
    flex-direction: column;
    align-items: flex-start;
  }
}

@keyframes headlight-pulse {
  0%, 100% { opacity: 0.35; }
  50%       { opacity: 1; }
}

@keyframes road-shimmer {
  0%   { background-position: -100% 0; }
  100% { background-position: 200% 0; }
}

@keyframes network-pulse {
  0%, 100% { opacity: 0.3; transform: scale(1); }
  50%       { opacity: 1;   transform: scale(1.06); }
}

@media (prefers-reduced-motion: reduce) {
  .login-main::before,
  .login-main::after,
  .login-shell::before {
    animation: none;
  }
}
</style>
