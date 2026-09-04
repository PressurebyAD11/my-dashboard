import { Router } from 'express';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { authMiddleware } from '../middleware/authMiddleware.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const router = Router();
const DAY_MS = 24 * 60 * 60 * 1000;

router.use(authMiddleware);

const loadData = (file) =>
  JSON.parse(readFileSync(join(__dirname, '..', 'data', file), 'utf-8'));

const normalizeRegion = (value) => String(value || '').toLowerCase();

const getCutoff = (days) => {
  const numericDays = Number(days);
  if (!Number.isFinite(numericDays) || numericDays <= 0) return null;
  return new Date(Date.now() - (numericDays * DAY_MS));
};

const filterShipments = (shipments, { region, days }) => {
  const cutoff = getCutoff(days);
  let filtered = shipments;

  if (region && region !== 'all') {
    const normalizedRegion = normalizeRegion(region);
    filtered = filtered.filter((shipment) => normalizeRegion(shipment.region) === normalizedRegion);
  }

  if (cutoff) {
    filtered = filtered.filter((shipment) => new Date(shipment.createdAt) >= cutoff);
  }

  return filtered;
};

const filterExceptions = (exceptions, { status, region, days }) => {
  const cutoff = getCutoff(days);
  let filtered = exceptions;

  if (status && status !== 'all') {
    filtered = filtered.filter((exception) => exception.status === status);
  }

  if (region && region !== 'all') {
    const normalizedRegion = normalizeRegion(region);
    filtered = filtered.filter((exception) => normalizeRegion(exception.region) === normalizedRegion);
  }

  if (cutoff) {
    filtered = filtered.filter((exception) => new Date(exception.createdAt) >= cutoff);
  }

  return filtered;
};

const computeOnTimeRate = (shipments) => {
  const delivered = shipments.filter((shipment) => shipment.status === 'delivered');
  if (!delivered.length) return 0;

  const onTime = delivered.filter((shipment) => new Date(shipment.actualDelivery) <= new Date(shipment.scheduledDelivery));
  return Number(((onTime.length / delivered.length) * 100).toFixed(1));
};

const computeAvgTransitDays = (shipments) => {
  const delivered = shipments.filter((shipment) => shipment.status === 'delivered' && shipment.actualDelivery);
  if (!delivered.length) return 0;

  const totalDays = delivered.reduce((sum, shipment) => {
    const transitMs = new Date(shipment.actualDelivery).getTime() - new Date(shipment.createdAt).getTime();
    return sum + (transitMs / DAY_MS);
  }, 0);

  return Number((totalDays / delivered.length).toFixed(1));
};

router.get('/shipments', (req, res) => {
  const shipments = loadData('shipments.json');
  res.json(filterShipments(shipments, req.query));
});

router.get('/regions', (req, res) => {
  const regionMeta = loadData('regions.json');
  const shipments = filterShipments(loadData('shipments.json'), req.query);
  const openExceptions = filterExceptions(loadData('exceptions.json'), {
    ...req.query,
    status: 'open',
  });
  const requestedRegion = normalizeRegion(req.query.region);

  const rows = regionMeta
    .filter((region) => requestedRegion === '' || requestedRegion === 'all' || region.id === requestedRegion)
    .map((region) => {
      const regionShipments = shipments.filter((shipment) => normalizeRegion(shipment.region) === region.id);
      const regionExceptions = openExceptions.filter((exception) => normalizeRegion(exception.region) === region.id);

      return {
        id: region.id,
        name: region.name,
        totalShipments: regionShipments.length,
        onTimeRate: computeOnTimeRate(regionShipments),
        avgTransitDays: computeAvgTransitDays(regionShipments),
        openExceptions: regionExceptions.length,
      };
    });

  res.json(rows);
});

router.get('/exceptions', (req, res) => {
  const exceptions = loadData('exceptions.json');
  res.json(filterExceptions(exceptions, req.query));
});

router.get('/kpis', (req, res) => {
  const shipments = filterShipments(loadData('shipments.json'), req.query);
  const openExceptions = filterExceptions(loadData('exceptions.json'), {
    ...req.query,
    status: 'open',
  });

  res.json({
    totalShipments: shipments.length,
    onTimeRate: computeOnTimeRate(shipments),
    avgTransitDays: computeAvgTransitDays(shipments),
    openExceptions: openExceptions.length,
  });
});

export default router;
