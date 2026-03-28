import Vitals from "../models/Vitals.js";
import { emitVitalsNew } from "../sockets/index.js";

export async function createVitals(req) {
  const vitals = await Vitals.create(req.body);
  emitVitalsNew(req.app.locals.io, vitals);
  return vitals;
}

export async function getLatestVitals() {
  const latest = await Vitals.findOne().sort({ timestamp: -1 });
  return latest;
}

export async function getVitalsHistory(limitQuery) {
  const parsedLimit = Number.parseInt(limitQuery, 10);
  const limit = Number.isNaN(parsedLimit)
    ? 100
    : Math.max(1, Math.min(parsedLimit, 100));

  const history = await Vitals.find().sort({ timestamp: -1 }).limit(limit);
  return history;
}
