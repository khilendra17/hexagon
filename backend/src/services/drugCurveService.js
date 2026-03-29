import Vitals from "../models/Vitals.js";

let lastResult = null;

export function getLastInsight() {
  return lastResult;
}

function toDate(t) {
  if (!t) return null;
  const d = t instanceof Date ? t : new Date(t);
  return Number.isNaN(d.getTime()) ? null : d;
}

function avg(nums) {
  if (!nums.length) return null;
  return nums.reduce((a, b) => a + b, 0) / nums.length;
}

function distTo75(hr) {
  return Math.abs(hr - 75);
}

function buildInsight(r) {
  const parts = [];
  if (r.responseDelayMins != null) {
    parts.push(
      `First response signal at ${r.responseDelayMins.toFixed(1)} minutes after IV start.`
    );
  } else {
    parts.push("No clear response signal in the 30-minute window.");
  }
  if (r.improvement && (r.improvement.heartRate != null || r.improvement.spo2 != null)) {
    const dh =
      r.improvement.heartRate != null
        ? `${r.improvement.heartRate > 0 ? "+" : ""}${r.improvement.heartRate.toFixed(1)}`
        : "—";
    const ds =
      r.improvement.spo2 != null
        ? `${r.improvement.spo2 > 0 ? "+" : ""}${r.improvement.spo2.toFixed(1)}`
        : "—";
    parts.push(`Mean change vs baseline: HR ${dh} bpm, SpO₂ ${ds} pp.`);
  }
  if (r.stabilizationMins != null) {
    parts.push(
      `Vitals stabilised by ${r.stabilizationMins.toFixed(1)} minutes from IV start.`
    );
  } else {
    parts.push("Stabilisation criteria not met within the window.");
  }
  return parts.join(" ");
}

export async function compute(ivStartTime) {
  const start = toDate(ivStartTime);
  if (!start) {
    lastResult = null;
    return null;
  }

  const ms10 = 10 * 60 * 1000;
  const ms30 = 30 * 60 * 1000;
  const preWindowStart = new Date(start.getTime() - ms10);

  const preRaw = await Vitals.find({
    timestamp: { $gte: preWindowStart, $lt: start },
  })
    .sort({ timestamp: -1 })
    .limit(10)
    .lean();

  let baseline = null;
  if (preRaw.length > 0) {
    baseline = {
      heartRate: avg(preRaw.map((v) => v.heartRate)),
      spo2: avg(preRaw.map((v) => v.spo2)),
    };
  }

  const postEnd = new Date(start.getTime() + ms30);
  const post = await Vitals.find({
    timestamp: { $gt: start, $lte: postEnd },
  })
    .sort({ timestamp: 1 })
    .lean();

  const vitalsTimeline = post.map((v) => ({
    ...v,
    timestamp: v.timestamp instanceof Date ? v.timestamp : new Date(v.timestamp),
  }));

  let responseDelayMins = null;
  if (baseline && post.length > 0) {
    const bHr = baseline.heartRate;
    const bSpo2 = baseline.spo2;
    const d0 = distTo75(bHr);

    for (const v of post) {
      const ts = v.timestamp instanceof Date ? v.timestamp : new Date(v.timestamp);
      const spo2Ok = v.spo2 >= bSpo2 + 2;
      const d1 = distTo75(v.heartRate);
      const hrCloser = d0 - d1 >= 5;
      if (spo2Ok || hrCloser) {
        responseDelayMins = (ts.getTime() - start.getTime()) / 60000;
        break;
      }
    }
  }

  let improvement = null;
  if (baseline && post.length > 0) {
    const mHr = avg(post.map((v) => v.heartRate));
    const mSpo2 = avg(post.map((v) => v.spo2));
    improvement = {
      heartRate: mHr - baseline.heartRate,
      spo2: mSpo2 - baseline.spo2,
    };
  }

  let stabilizationMins = null;
  if (post.length >= 5) {
    for (let i = 0; i <= post.length - 5; i++) {
      const slice = post.slice(i, i + 5);
      const ok = slice.every(
        (v) => v.spo2 > 93 && v.heartRate >= 55 && v.heartRate <= 100
      );
      if (ok) {
        const t0 = slice[0].timestamp;
        const ts = t0 instanceof Date ? t0 : new Date(t0);
        stabilizationMins = (ts.getTime() - start.getTime()) / 60000;
        break;
      }
    }
  }

  const result = {
    ivStartTime: start.toISOString(),
    baseline,
    responseDelayMins,
    improvement,
    stabilizationMins,
    vitalsTimeline,
  };
  result.insight = buildInsight(result);
  lastResult = result;
  return result;
}
