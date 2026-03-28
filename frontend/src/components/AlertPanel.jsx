function severityClass(sev) {
  if (sev === "critical") return "border-red-500/40 bg-red-950/40 text-red-200";
  if (sev === "warning") return "border-amber-500/40 bg-amber-950/40 text-amber-200";
  return "border-slate-700 bg-slate-900/60 text-slate-300";
}

export default function AlertPanel({ alerts }) {
  return (
    <div className="flex h-full min-h-[16rem] flex-col rounded-lg border border-slate-800 bg-slate-900/80">
      <div className="border-b border-slate-800 px-4 py-3">
        <h2 className="text-sm font-medium text-slate-200">Recent alerts</h2>
      </div>
      <ul className="max-h-80 flex-1 space-y-2 overflow-y-auto p-3">
        {alerts.length === 0 && (
          <li className="text-sm text-slate-500">No alerts yet.</li>
        )}
        {alerts.map((a) => (
          <li
            key={a._id ?? `${a.hash}-${a.timestamp}`}
            className={`rounded-md border px-3 py-2 text-sm ${severityClass(a.severity)}`}
          >
            <div className="font-medium">{a.type}</div>
            <div className="mt-0.5 opacity-90">{a.message}</div>
            <div className="mt-1 text-xs opacity-70">
              {a.timestamp ? new Date(a.timestamp).toLocaleString() : ""}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
