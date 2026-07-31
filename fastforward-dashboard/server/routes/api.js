const express = require('express');
const fs = require('fs');
const path = require('path');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

const loadData = (file) => {
  const filePath = path.join(__dirname, '..', 'data', file);
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
};

router.get('/shipments', (req, res) => {
  const shipments = loadData('shipments.json');
  const { region, days } = req.query;
  let filtered = shipments;

  if (region && region !== 'all') {
    filtered = filtered.filter((s) => s.region.toLowerCase() === String(region).toLowerCase());
  }

  if (days) {
    const dayCount = Number(days);
    const cutoff = new Date(Date.now() - dayCount * 24 * 60 * 60 * 1000);
    filtered = filtered.filter((s) => new Date(s.createdAt) >= cutoff);
  }

  res.json(filtered);
});

router.get('/regions', (_req, res) => {
  res.json(loadData('regions.json'));
});

router.get('/exceptions', (req, res) => {
  const exceptions = loadData('exceptions.json');
  const { status, region } = req.query;
  let filtered = exceptions;

  if (status && status !== 'all') {
    filtered = filtered.filter((e) => e.status === status);
  }

  if (region && region !== 'all') {
    filtered = filtered.filter((e) => e.region.toLowerCase() === String(region).toLowerCase());
  }

  res.json(filtered);
});

router.get('/kpis', (_req, res) => {
  const shipments = loadData('shipments.json');
  const exceptions = loadData('exceptions.json');
  const delivered = shipments.filter((s) => s.status === 'delivered');
  const onTime = delivered.filter(
    (s) => new Date(s.actualDelivery) <= new Date(s.scheduledDelivery)
  );

  res.json({
    totalShipments: shipments.length,
    onTimeRate: delivered.length
      ? ((onTime.length / delivered.length) * 100).toFixed(1)
      : 0,
    avgTransitDays: 2.7,
    openExceptions: exceptions.filter((e) => e.status === 'open').length,
  });
});

module.exports = router;
