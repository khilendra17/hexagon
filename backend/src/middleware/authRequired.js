import jwt from "jsonwebtoken";

function getJwtSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret || !String(secret).trim()) {
    throw new Error("JWT_SECRET is not set");
  }
  return secret;
}

export default function authRequired(req, res, next) {
  const header = req.headers.authorization || "";
  const [scheme, token] = header.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }

  try {
    const payload = jwt.verify(token, getJwtSecret());
    // Convention: sub is user id
    req.auth = {
      userId: payload.sub,
      role: payload.role,
      email: payload.email,
    };
    return next();
  } catch (_err) {
    return res.status(401).json({ success: false, error: "Unauthorized" });
  }
}

