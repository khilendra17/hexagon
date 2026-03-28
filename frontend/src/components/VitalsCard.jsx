export default function VitalsCard({ label, value, unit }) {
  return (
    <div className="rounded-lg border border-slate-800 bg-slate-900/80 p-4">
      <p className="text-sm text-slate-400">{label}</p>
      <p className="mt-1 text-3xl font-semibold tabular-nums text-white">
        {value ?? "—"}
        {unit != null && value != null && (
          <span className="ml-1 text-lg font-normal text-slate-400">{unit}</span>
        )}
      </p>
    </div>
  );
}
