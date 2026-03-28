import Dashboard from "./components/Dashboard.jsx";
import { useSocket } from "./hooks/useSocket.js";

export default function App() {
  const { vitals, alerts } = useSocket();

  return (
    <main className="min-h-screen">
      <Dashboard vitals={vitals} alerts={alerts} />
    </main>
  );
}
