/**
 * DrugResponseSummary.jsx
 * 3-step visual: Given → Responding → Full Effect
 * Plus effectiveness star rating.
 */
import { starRating } from '../../utils/insightGenerator';

function Step({ number, label, sublabel, done }) {
  return (
    <div className={`response-step ${done ? 'done' : 'pending'}`}>
      <div className="response-step-circle">{number}</div>
      <div className="response-step-content">
        <div className="response-step-label">{label}</div>
        {sublabel && <div className="response-step-sub">{sublabel}</div>}
      </div>
    </div>
  );
}

function fmtTime(ts) {
  if (!ts) return null;
  return new Date(ts).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
}

function Stars({ count }) {
  return (
    <span className="star-row">
      {[1,2,3,4,5].map((i) => (
        <span key={i} className={i <= count ? 'star filled' : 'star empty'}>★</span>
      ))}
    </span>
  );
}

export default function DrugResponseSummary({ session }) {
  if (!session?.drug?.name || session.drug.name === 'null') {
    return (
      <div className="drug-response-summary no-drug">
        <div className="drug-response-no-drug">Plain saline — no medication was administered during this bottle.</div>
      </div>
    );
  }

  const { drug, drugResponse } = session;
  const drugTime = fmtTime(drug?.injectedAt);
  const onset = drugResponse?.responseOnsetMinutes;
  const onsetTime = drug?.injectedAt && onset
    ? fmtTime(new Date(new Date(drug.injectedAt).getTime() + onset * 60000))
    : null;
  const peak = drugResponse?.peakEfficacyPercent;
  const score = drugResponse?.efficacyScore;
  const rating = starRating(score);

  return (
    <div className="drug-response-summary">
      <div className="response-steps">
        <Step number={1} label="Medication Given" sublabel={drugTime} done={!!drugTime} />
        <div className="response-arrow">→</div>
        <Step number={2} label="Body Started Responding" sublabel={onset ? `After ${onset} min` : null} done={onset != null && onsetTime != null} />
        <div className="response-arrow">→</div>
        <Step number={3} label="Full Effect Reached" sublabel={peak ? `${peak}% improvement` : null} done={peak != null} />
      </div>

      {score != null && (
        <div className="effectiveness-rating">
          <Stars count={rating.stars} />
          <span className={`effectiveness-rating-label ${rating.level}`}>{rating.label}</span>
        </div>
      )}
    </div>
  );
}
