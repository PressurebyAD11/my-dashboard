const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/shipments', (_req, res) => {
  res.json([]);
});

module.exports = router;
