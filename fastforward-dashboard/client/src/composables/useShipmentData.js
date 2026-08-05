import { computed, ref, reactive } from 'vue';
import api from '../services/api';

export function useShipmentData() {
  const DAY_MS = 24 * 60 * 60 * 1000;
  const loading = ref(false);
  const error = ref(null);
  const sessionExpired = ref(false);
  const filters = reactive({ days: 30, region: 'all', exceptionStatus: 'all' });

  const allShipments = ref([]);
  const allExceptions = ref([]);
  const regionMeta = ref([]);

  function getCutoff(days) {
    const numericDays = Number(days);
    if (!Number.isFinite(numericDays) || numericDays <= 0) return null;
    return Date.now() - (numericDays * DAY_MS);
  }

  function matchesRegion(region) {
    if (filters.region === 'all') return true;
    return String(region || '').toLowerCase() === String(filters.region).toLowerCase();
  }

  function computeOnTimeRate(items) {
    const delivered = items.filter((shipment) => shipment.status === 'delivered');
    if (!delivered.length) return 0;

    const onTime = delivered.filter((shipment) => new Date(shipment.actualDelivery) <= new Date(shipment.scheduledDelivery));
    return Number(((onTime.length / delivered.length) * 100).toFixed(1));
  }

  function computeAvgTransitDays(items) {
    const delivered = items.filter((shipment) => shipment.status === 'delivered' && shipment.actualDelivery);
    if (!delivered.length) return 0;

    const totalDays = delivered.reduce((sum, shipment) => {
      const transitMs = new Date(shipment.actualDelivery).getTime() - new Date(shipment.createdAt).getTime();
      return sum + (transitMs / DAY_MS);
    }, 0);

    return Number((totalDays / delivered.length).toFixed(1));
  }

  const shipmentCutoff = computed(() => getCutoff(filters.days));

  const shipments = computed(() => allShipments.value.filter((shipment) => {
    const createdAt = new Date(shipment.createdAt).getTime();
    const withinWindow = shipmentCutoff.value === null || createdAt >= shipmentCutoff.value;
    return withinWindow && matchesRegion(shipment.region);
  }));

  const scopedOpenExceptions = computed(() => allExceptions.value.filter((exception) => {
    const createdAt = new Date(exception.createdAt).getTime();
    const withinWindow = shipmentCutoff.value === null || createdAt >= shipmentCutoff.value;
    return withinWindow && matchesRegion(exception.region) && exception.status === 'open';
  }));

  const exceptions = computed(() => allExceptions.value.filter((exception) => {
    const createdAt = new Date(exception.createdAt).getTime();
    const withinWindow = shipmentCutoff.value === null || createdAt >= shipmentCutoff.value;
    const matchesStatus = filters.exceptionStatus === 'all' || exception.status === filters.exceptionStatus;
    return withinWindow && matchesRegion(exception.region) && matchesStatus;
  }));

  const regions = computed(() => {
    const requestedRegion = String(filters.region || 'all').toLowerCase();

    return regionMeta.value
      .filter((region) => requestedRegion === 'all' || region.id === requestedRegion)
      .map((region) => {
        const regionShipments = shipments.value.filter((shipment) => String(shipment.region || '').toLowerCase() === region.id);
        const regionExceptions = scopedOpenExceptions.value.filter((exception) => String(exception.region || '').toLowerCase() === region.id);

        return {
          id: region.id,
          name: region.name,
          totalShipments: regionShipments.length,
          onTimeRate: computeOnTimeRate(regionShipments),
          avgTransitDays: computeAvgTransitDays(regionShipments),
          openExceptions: regionExceptions.length,
        };
      });
  });

  const kpis = computed(() => ({
    totalShipments: shipments.value.length,
    onTimeRate: computeOnTimeRate(shipments.value),
    avgTransitDays: computeAvgTransitDays(shipments.value),
    openExceptions: scopedOpenExceptions.value.length,
  }));

  const fetchAll = async () => {
    loading.value = true;
    error.value = null;
    sessionExpired.value = false;
    try {
      const [shipRes, regRes, excRes] = await Promise.all([
        api.get('/api/shipments'),
        api.get('/api/regions'),
        api.get('/api/exceptions'),
      ]);
      allShipments.value = shipRes.data;
      regionMeta.value = regRes.data.map((region) => ({ id: region.id, name: region.name }));
      allExceptions.value = excRes.data;
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

  fetchAll();

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