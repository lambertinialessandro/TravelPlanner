import { TAB_DISTRICTS, TAB_ITINERARY, TAB_ROUTING, TAB_STOPS } from 'app/costants/activeTabs';
import { selectActiveTab, selectPresentationMode } from 'app/store/slice/layoutSlice';
import { useSelector } from 'react-redux';
import DistrictsPanel from './districtsPanel/DistrictsPanel';
import ItineraryPanel from './itineraryPanel/ItineraryPanel';
/* import RoutingPanel from './routingPanel/RoutingPanel';
import StopsPanel from './stopsPanel/StopsPanel'; */

function EditPanel(props) {
  const activeTab = useSelector(selectActiveTab);
  const presentationMode = useSelector(selectPresentationMode);

  return (
    <div
      className={`w-full ${presentationMode ? 'lg:w-full' : 'lg:w-5/12'} bg-slate-900 flex flex-col overflow-hidden`}
    >
      {activeTab === TAB_ITINERARY && <ItineraryPanel />}
      {/* {activeTab === TAB_STOPS && <StopsPanel />} */}
      {activeTab === TAB_DISTRICTS && <DistrictsPanel />}
      {/* {activeTab === TAB_ROUTING && <RoutingPanel />} */}
    </div>
  );
}

export default EditPanel;
