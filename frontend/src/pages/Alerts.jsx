import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import AlertsPanel from '../components/AlertsPanel';
import { MOCK_ALERTS } from '../utils/formatVitals';

export default function Alerts() {
  const unacked = MOCK_ALERTS.filter((a) => !a.acked).length;
  return (
    <div className="app-shell">
      <Sidebar alertCount={unacked} />
      <div className="main-content">
        <TopBar title="ALERTS — LIVE FEED" />
        <div className="page-body">
          <div className="page-header">
            <div>
              <div className="page-heading">ALERT FEED</div>
              <div className="page-subhead">{unacked} unacknowledged · Updating via Socket.io</div>
            </div>
            <div className="live-indicator">
              <span className="live-dot" />
              LIVE
            </div>
          </div>
          <div className="card">
            <AlertsPanel />
          </div>
        </div>
      </div>
    </div>
  );
}
