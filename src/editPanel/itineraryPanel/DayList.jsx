import {
  resetDayItinerary,
  selectRpActionKey,
  selectSelectedDayNum,
  setDayItinerary,
  setSelectedDayNum,
} from 'app/store/slice/layoutSlice';
import { addDayToItinerary, selectItinerary } from 'app/store/slice/tripSlice';
import { PlusIcon } from 'lucide-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function DayList(props) {
  const dispatch = useDispatch();

  const itinerary = useSelector(selectItinerary);
  const selectedDayNum = useSelector(selectSelectedDayNum);

  useEffect(() => {
    const targetDay = itinerary.find((d) => d.day === selectedDayNum) ?? itinerary[0];
    if (targetDay) {
      dispatch(setDayItinerary(targetDay));
    } else {
      dispatch(resetDayItinerary());
    }
  }, [itinerary, selectedDayNum]);

  const actionKey = useSelector(selectRpActionKey);
  const noAction = actionKey === null;

  const onAddDay = () => {
    const newDayNum = itinerary.length + 1;

    dispatch(
      addDayToItinerary({
        day: newDayNum,
        date: new Date(Date.now() + newDayNum * 86400000).toISOString().slice(0, 10),
        title: `Day ${newDayNum} Exploration`,
        summary: 'New planned activities.',
        districtId: '',
        stops: [],
      })
    );
    dispatch(setSelectedDayNum(newDayNum));
  };

  return (
    <div className="p-3 bg-slate-950 border-b border-slate-800 flex items-start justify-between gap-2">
      <div className="flex flex-wrap items-center gap-1.5 flex-1 max-h-24 overflow-y-auto pr-1">
        {itinerary.map((day) => (
          <button
            disabled={!noAction}
            key={day.day}
            onClick={() => dispatch(setSelectedDayNum(day.day))}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center space-x-1.5 ${
              selectedDayNum === day.day
                ? 'bg-linear-to-r from-rose-500 to-red-600 text-white shadow-md'
                : 'bg-slate-800 text-slate-400 enabled:hover:bg-slate-700 enabled:hover:text-slate-200 disabled:opacity-50 disabled:cursor-default disabled:bg-slate-800/40'
            }`}
          >
            <span>Day {day.day}</span>
          </button>
        ))}
      </div>
      <button
        disabled={!noAction}
        onClick={onAddDay}
        title="Add New Day"
        className="px-2.5 py-1.5 bg-slate-800 enabled:hover:bg-slate-700 text-rose-400 rounded-xl border border-slate-700 text-xs font-bold flex items-center space-x-1 shrink-0 disabled:opacity-50 disabled:cursor-default disabled:bg-slate-800/40"
      >
        <PlusIcon className="w-3.5 h-3.5" />
        <span>Day</span>
      </button>
    </div>
  );
}

export default DayList;
