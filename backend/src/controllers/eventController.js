import Event from "../models/Event.js";

export async function createEvent(data) {
  const event = await Event.create(data);
  return event;
}
