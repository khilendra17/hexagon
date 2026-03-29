import mongoose from 'mongoose';
import Event from '../models/Event.js';
import { computeDrugCurve } from '../services/drugCurveService.js';

const _memEvents = [];

function isMongoConnected() {
  return mongoose.connection.readyState === 1;
}

export async function createEvent(data, io) {
  if (!['iv_start', 'iv_stop'].includes(data.type)) {
    throw Object.assign(new Error('type must be "iv_start" or "iv_stop"'), { status: 422 });
  }

  let event;
  if (!isMongoConnected()) {
    event = {
      _id: `mem_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      ...data,
      timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
    };
    _memEvents.unshift(event);
  } else {
    event = await Event.create({
      ...data,
      timestamp: data.timestamp ? new Date(data.timestamp) : new Date(),
    });
  }

  // Async drug curve computation — does NOT block response (PRD FR-E04)
  if (data.type === 'iv_start') {
    setImmediate(() => computeDrugCurve(io, event.timestamp));
  }

  return event;
}
