import DayList from './DayList';
import ItineraryStatsPanel from './ItineraryStatsPanel';
import SingleDayHeader from './SingleDayHeader';
import StopsList from './StopsList';
import AddStopItem from './stopItem/AddStopItem';

function ItineraryPanel(props) {
  return (
    <>
      <ItineraryStatsPanel />

      <DayList />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <SingleDayHeader />

        <StopsList />

        <AddStopItem />
      </div>
    </>
  );
}

export default ItineraryPanel;
