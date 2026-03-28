import Alert from "../models/Alert.js";
import { emitAlertNew } from "../sockets/index.js";

export async function createAlert(req) {
  const alert = await Alert.create(req.body);
  emitAlertNew(req.app.locals.io, alert);
  return alert;
}

export async function listAlerts() {
  const alerts = await Alert.find().sort({ timestamp: -1 });
  return alerts;
}
