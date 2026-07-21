// services/pingService.js
const ping = require('ping');
require('dotenv').config();

const TIMEOUT_SECONDS = Number(process.env.PING_TIMEOUT_SECONDS || 3);

/**
 * Ping satu IP address.
 */
async function pingOne(ip) {
  const res = await ping.promise.probe(ip, {
    timeout: TIMEOUT_SECONDS,
  });
  return {
    ip,
    alive: res.alive,
    responseTime: res.time === 'unknown' ? null : Math.round(res.time),
  };
}

/**
 * Ping banyak IP secara simultan (FR-02: mass ping asynchronous).
 */
async function pingMany(devices) {
  const results = await Promise.all(
    devices.map(async (device) => {
      const result = await pingOne(device.ip_address);
      return { ...device, ...result };
    })
  );
  return results;
}

module.exports = { pingOne, pingMany };