export default function IVStatusBadge({ status }) {
  if (status !== "running" && status !== "stopped") {
    return (
      <span className="inline-flex rounded-full bg-slate-800 px-3 py-1 text-sm text-slate-400 ring-1 ring-slate-600">
        IV status unknown
      </span>
    );
  }
  const running = status === "running";
  const label = running ? "IV running" : "IV stopped";
  const cls = running
    ? "bg-emerald-600/20 text-emerald-300 ring-1 ring-emerald-500/40"
    : "bg-red-600/20 text-red-300 ring-1 ring-red-500/40";

  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${cls}`}
    >
      {label}
    </span>
  );
}
