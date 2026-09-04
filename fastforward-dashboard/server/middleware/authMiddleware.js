const SESSION_TOKEN = 'ff-session-token-2026';

export const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : '';

  if (token !== SESSION_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  return next();
};
