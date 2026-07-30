import { ref, reactive, watch } from 'vue';
import api from '../services/api';

export function useShipmentData() {
  const loading = ref(false);
  const error = ref(null);
  const sessionExpired = ref(false);
  const filters = reactive({ days: 30, region: 'all', exceptionStatus: 'all' });
  const kpis = ref(null);
  const shipments = ref([]);
  const regions = ref([]);
  const exceptions = ref([]);

  const fetchAll = async () => {
    loading.value = true;
    error.value = null;
    sessionExpired.value = false;
    try {
      const [kpiRes, shipRes, regRes, excRes] = await Promise.all([
        api.get('/api/kpis', { params: { days: filters.days, region: filters.region } }),
        api.get('/api/shipments', { params: { days: filters.days, region: filters.region } }),
        api.get('/api/regions'),
        api.get('/api/exceptions', { params: { status: filters.exceptionStatus, region: filters.region } }),
      ]);
      kpis.value = kpiRes.data;
      shipments.value = shipRes.data;
      regions.value = regRes.data;
      exceptions.value = excRes.data;
    } catch (e) {
      if (e?.response?.status === 401) {
        sessionExpired.value = true;
        error.value = 'Your session has expired. Redirecting to login...';
      } else {
        error.value = 'Failed to load dashboard data.';
      }
    } finally {
      loading.value = false;
    }
  };

  watch(filters, fetchAll, { immediate: true });

  return {
    loading,
    error,
    sessionExpired,
    filters,
    kpis,
    shipments,
    regions,
    exceptions,
    fetchAll,
  };
}