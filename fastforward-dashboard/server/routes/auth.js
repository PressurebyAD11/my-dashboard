import { Router } from 'express';
const router = Router();

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const validUser = process.env.DASHBOARD_USER || 'ops.manager';
  const validPass = process.env.DASHBOARD_PASS || 'fastforward2026';
  if (username === validUser && password === validPass) {
    return res.json({ token: 'ff-session-token-2026', user: { name: 'Sarah Chen', role: 'VP Operations' } });
  }
  return res.status(401).json({ error: 'Invalid credentials' });
});

export default router;
