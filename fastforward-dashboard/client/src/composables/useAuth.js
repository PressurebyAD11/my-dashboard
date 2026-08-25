import { ref } from 'vue';
import api from '../services/api';
import { useRouter } from 'vue-router';

export function useAuth() {
  const router = useRouter();
  const loading = ref(false);
  const error = ref(null);
  const user = ref(null);

  const login = async (username, password) => {
    loading.value = true;
    error.value = null;
    try {
      const { data } = await api.post('/api/auth/login', { username, password });
      localStorage.setItem('ff-token', data.token);
      localStorage.setItem('ff-user', JSON.stringify(data.user));
      user.value = data.user;
      router.replace('/dashboard');
    } catch (e) {
      error.value = e?.response?.data?.error || 'Invalid credentials. Please try again.';
    } finally {
      loading.value = false;
    }
  };

  const logout = () => {
    localStorage.removeItem('ff-token');
    localStorage.removeItem('ff-user');
    router.replace('/login');
  };

  return { login, logout, loading, error, user };
}