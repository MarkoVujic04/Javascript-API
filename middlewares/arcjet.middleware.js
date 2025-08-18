import aj from "../config/arcjet.js";

const arcjetMiddleware = async (req, res, next) => {
  try {
    if (process.env.NODE_ENV !== "production") return next();

    const decision = await aj.protect(req);

    const denied = typeof decision.isDenied === "function"
      ? decision.isDenied()
      : !!decision.isDenied;

    if (!denied) return next();

    const r = decision.reason;
    if (r?.isRateLimit?.()) return res.status(429).json({ error: "Rate limit exceeded" });
    if (r?.isBot?.())       return res.status(403).json({ error: "Bot detected" });
    return res.status(403).json({ error: "Access denied" });
  } catch (err) {
    console.error(err);
    next(err);
  }
};

export default arcjetMiddleware;
