const express = require('express');

const router = express.Router();

const DEMO_USER = process.env.DASHBOARD_USER || 'ops.manager';
const DEMO_PASS = process.env.DASHBOARD_PASS || 'fastforward2026';
const SESSION_TOKEN = 'ff-session-token-2026';

router.post('/login', (req, res) => {
  const { username, password } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ error: 'username and password are required' });
  }

  if (username !== DEMO_USER || password !== DEMO_PASS) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  return res.json({
    token: SESSION_TOKEN,
    user: { name: 'Sarah Chen', role: 'VP Operations' },
  });
});

module.exports = router;
