import AlertPanel from "./AlertPanel.jsx";
import IVStatusBadge from "./IVStatusBadge.jsx";
import VitalsCard from "./VitalsCard.jsx";
import VitalsChart from "./VitalsChart.jsx";

export default function Dashboard({ vitals, alerts }) {
  const latest = vitals[vitals.length - 1];

  return (
    <div className="mx-auto max-w-6xl px-4 py-6">
      <header className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-xl font-semibold text-white">IoT Healthcare Monitoring</h1>
        {latest?.ivStatus != null && <IVStatusBadge status={latest.ivStatus} />}
      </header>

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="grid grid-cols-2 gap-3 lg:col-span-2">
          <VitalsCard label="Heart rate" value={latest?.heartRate} unit="bpm" />
          <VitalsCard label="SpO₂" value={latest?.spo2} unit="%" />
        </div>
        <div className="lg:row-span-2">
          <AlertPanel alerts={alerts} />
        </div>
        <div className="lg:col-span-2">
          <VitalsChart vitals={vitals} />
        </div>
      </div>
    </div>
  );
}
