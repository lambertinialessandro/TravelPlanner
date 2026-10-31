import { TAB_DISTRICTS, TAB_ITINERARY, TAB_ROUTING, TAB_STOPS } from 'app/costants/activeTabs';
import { selectActiveTab, setActiveTab } from 'app/store/slice/layoutSlice';
import { CalendarIcon, LayersIcon, MapPinIcon, RouteIcon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';

function NavigationTabs(props) {
  const dispatch = useDispatch();

  const activeTab = useSelector(selectActiveTab);

  return (
    <div className="flex items-center space-x-1 bg-slate-900/80 p-1 rounded-xl border border-slate-700/50">
      <button
        onClick={() => dispatch(setActiveTab(TAB_ITINERARY))}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${activeTab === TAB_ITINERARY ? 'bg-rose-500 text-white shadow' : 'text-slate-400 hover:text-white'}`}
      >
        <CalendarIcon className="w-3.5 h-3.5" />
        <span>Itinerary</span>
      </button>
      <button
        onClick={() => dispatch(setActiveTab(TAB_STOPS))}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${activeTab === TAB_STOPS ? 'bg-rose-500 text-white shadow' : 'text-slate-400 hover:text-white'}`}
      >
        <MapPinIcon className="w-3.5 h-3.5" />
        <span>Stops</span>
      </button>
      <button
        onClick={() => dispatch(setActiveTab(TAB_DISTRICTS))}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${activeTab === TAB_DISTRICTS ? 'bg-rose-500 text-white shadow' : 'text-slate-400 hover:text-white'}`}
      >
        <LayersIcon className="w-3.5 h-3.5" />
        <span>Districts</span>
      </button>
      <button
        onClick={() => dispatch(setActiveTab(TAB_ROUTING))}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition ${activeTab === TAB_ROUTING ? 'bg-rose-500 text-white shadow' : 'text-slate-400 hover:text-white'}`}
      >
        <RouteIcon className="w-3.5 h-3.5" />
        <span>Directions</span>
      </button>
    </div>
  );
}

export default NavigationTabs;
