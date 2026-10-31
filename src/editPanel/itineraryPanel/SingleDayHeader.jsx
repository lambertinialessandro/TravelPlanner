import { ACTION_EDIT_DAY } from 'app/costants/rightPanel/actions';
import {
  resetRpAction,
  selectDayItinerary,
  selectRpActionKey,
  setRpActionKey,
  setSelectedDayNum,
} from 'app/store/slice/layoutSlice';
import { deleteDayToItinerary, selectItinerary, updateDayInfo } from 'app/store/slice/tripSlice';
import { Edit3Icon, Trash2Icon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';

function SingleDayHeader(props) {
  const dispatch = useDispatch();

  const itinerary = useSelector(selectItinerary);
  const dayItinerary = useSelector(selectDayItinerary);

  const actionKey = useSelector(selectRpActionKey);
  const noAction = actionKey === null;
  const isEditingDay = actionKey === ACTION_EDIT_DAY;

  const onDeleteDay = (dayNum) => {
    if (itinerary.length <= 1) return alert('You must keep at least one day in the itinerary.');
    if (!window.confirm(`Delete Day ${dayNum}?`)) return;

    dispatch(deleteDayToItinerary(dayNum));
    dispatch(setSelectedDayNum(Math.max(1, dayItinerary.day - 1)));
  };

  return (
    <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/70 shadow-sm relative">
      {isEditingDay ? (
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={dayItinerary.title}
              onChange={(e) =>
                dispatch(
                  updateDayInfo({
                    selectedDayNum: dayItinerary.day,
                    field: 'title',
                    value: e.target.value,
                  })
                )
              }
              className="flex-1 bg-slate-900 border border-slate-700 rounded px-2 py-1 text-lg font-bold text-white outline-none focus:border-rose-500"
            />
            <input
              type="date"
              value={dayItinerary.date}
              onChange={(e) =>
                dispatch(
                  updateDayInfo({
                    selectedDayNum: dayItinerary.day,
                    field: 'date',
                    value: e.target.value,
                  })
                )
              }
              className="bg-slate-900 border border-slate-700 rounded px-2 py-1 text-lg text-white outline-none focus:border-rose-500"
            />
          </div>
          <input
            type="text"
            value={dayItinerary.summary}
            onChange={(e) =>
              dispatch(
                updateDayInfo({
                  selectedDayNum: dayItinerary.day,
                  field: 'summary',
                  value: e.target.value,
                })
              )
            }
            placeholder="Day summary / primary goal"
            className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-lg text-slate-300 outline-none focus:border-rose-500"
          />
          <div className="flex justify-end space-x-2 pt-1">
            <button
              onClick={() => dispatch(resetRpAction())}
              className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-semibold"
            >
              Done
            </button>
          </div>
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-rose-400 uppercase tracking-wider">
              Day {dayItinerary.day} Itinerary
            </span>
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400">{dayItinerary.date}</span>
              <button
                disabled={!noAction}
                onClick={() => dispatch(setRpActionKey(ACTION_EDIT_DAY))}
                className="p-1 text-slate-400 enabled:hover:text-white disabled:opacity-50 disabled:cursor-default disabled:bg-slate-800/40"
              >
                <Edit3Icon className="w-3.5 h-3.5" />
              </button>
              <button
                disabled={!noAction}
                onClick={() => onDeleteDay(dayItinerary.day)}
                className="p-1 text-slate-500 enabled:hover:text-red-400 disabled:opacity-50 disabled:cursor-default disabled:bg-slate-800/40"
              >
                <Trash2Icon className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
          <h2 className="text-base font-bold text-slate-100 mt-1">{dayItinerary.title}</h2>
          <p className="text-xs text-slate-300 mt-1">{dayItinerary.summary}</p>
        </div>
      )}
    </div>
  );
}

export default SingleDayHeader;
