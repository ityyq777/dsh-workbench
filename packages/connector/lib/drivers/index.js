import { rssDriver } from "./rss.js";
import { webhookDriver } from "./webhook.js";

export const DRIVERS = [rssDriver, webhookDriver];

export function driverById(id) {
  return DRIVERS.find((d) => d.id === id) || null;
}

export function driverList() {
  return DRIVERS.map((d) => ({
    id: d.id,
    title: d.title,
    secretFields: d.secretFields || [],
    configFields: d.configFields || [],
    inbound: typeof d.parseHook === "function",
  }));
}
