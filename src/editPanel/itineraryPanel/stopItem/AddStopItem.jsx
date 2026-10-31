import { ACTION_CREATE_STOP } from 'app/costants/rightPanel/actions';
import { STOP_SIGHTSEEING } from 'app/costants/stopCategories';
import { selectDayItinerary, selectRpActionKey, setRpAction } from 'app/store/slice/layoutSlice';
import { PlusIcon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';

const DEFAULT_STOP = (dayItinerary) => ({
  id: `s${dayItinerary.day}-${Date.now()}`,
  name: '',
  lat: dayItinerary?.stops?.[0]?.lat || 35.6762,
  lng: dayItinerary?.stops?.[0]?.lng || 139.6503,
  category: STOP_SIGHTSEEING,
  startTime: '12:00',
  durationMin: 60,
  cost: 0,
  notes: '',
  completed: false,
  travelToNext: null,
});

function AddStopItem(props) {
  const dispatch = useDispatch();

  const dayItinerary = useSelector(selectDayItinerary);

  const actionKey = useSelector(selectRpActionKey);
  const noAction = actionKey === null;

  const onCreateStop = () => {
    dispatch(
      setRpAction({
        key: ACTION_CREATE_STOP,
        idx: -1,
        data: DEFAULT_STOP(dayItinerary),
      })
    );
  };

  return (
    <button
      disabled={!noAction}
      onClick={onCreateStop}
      className="w-full py-3 bg-slate-800/80 enabled:hover:bg-slate-700/80 border border-dashed border-slate-600 rounded-xl text-xs font-semibold text-slate-300 flex items-center justify-center space-x-2 transition disabled:opacity-50 disabled:cursor-default disabled:bg-slate-800/40"
    >
      <PlusIcon className="w-4 h-4 text-rose-400" />
      <span>Add Stop to Day {dayItinerary.day}</span>
    </button>
  );
}
export default AddStopItem;
