import { TAB_DISTRICTS, TAB_ITINERARY, TAB_STOPS } from 'app/costants/activeTabs';
import { selectActiveTab, selectPresentationMode } from 'app/store/slice/layoutSlice';
import { useSelector } from 'react-redux';
import DistrictsLayer from './layers/DistrictsLayer';
import ItineraryLayer from './layers/ItineraryLayer';
import StopsLayer from './layers/StopsLayer';
import LocationPicker from './LocationPicker';
import useLeafletMap from './useLeafletMap';

const TAB_LAYERS = {
  [TAB_ITINERARY]: ItineraryLayer,
  [TAB_STOPS]: StopsLayer,
  [TAB_DISTRICTS]: DistrictsLayer,
};

function MapPanel(props) {
  const activeTab = useSelector(selectActiveTab);
  const presentationMode = useSelector(selectPresentationMode);

  const { containerRef, map } = useLeafletMap();
  const Layer = TAB_LAYERS[activeTab];

  return (
    <div
      className={`flex-1 flex flex-col border-r border-slate-800 relative ${presentationMode ? 'w-full' : 'lg:w-7/12'}`}
    >
      <div className="relative w-full h-80 lg:h-full min-h-95">
        <div ref={containerRef} className="absolute inset-0 z-0 bg-slate-950" />
      </div>

      {map && Layer && <Layer map={map} />}
      {map && <LocationPicker map={map} />}
    </div>
  );
}

export default MapPanel;
