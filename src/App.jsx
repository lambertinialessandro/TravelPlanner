import EditPanel from './editPanel/EditPanel';
import Header from './header/Header';
import MapPanel from './mapPanel/MapPanel';

export default function App() {
  return (
    <div className="h-screen min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans">
      <Header />

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* LEFT COLUMN: Interactive Map */}
        <MapPanel />

        {/* RIGHT COLUMN: DAY-BY-DAY ITINERARY PANEL / DISTRICTS / ROUTES */}
        <EditPanel />
      </div>
    </div>
  );
}
