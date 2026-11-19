// Small in-memory fixed-window rate limiter. Good enough for a single server process;
// swap for express-rate-limit with a shared store if the server is ever scaled out.
function rateLimit({ windowMs, max, message = 'Too many requests, please try again later.' }) {
  const hits = new Map();

  const limiter = (req, res, next) => {
    const now = Date.now();
    const key = req.ip;
    let entry = hits.get(key);

    if (!entry || entry.resetAt <= now) {
      entry = { count: 0, resetAt: now + windowMs };
      hits.set(key, entry);
    }

    entry.count += 1;

    if (entry.count > max) {
      res.set('Retry-After', String(Math.ceil((entry.resetAt - now) / 1000)));
      return res.status(429).json({ message });
    }

    return next();
  };

  limiter.reset = () => hits.clear();

  // Drop expired entries so the map can't grow without bound.
  const sweep = setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of hits) {
      if (entry.resetAt <= now) hits.delete(key);
    }
  }, windowMs);
  sweep.unref();

  return limiter;
}

module.exports = rateLimit;
