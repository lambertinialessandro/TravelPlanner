import { CATEGORY_COLORS, MISSING_COLOR } from 'app/costants/colors';
import { ACTION_EDIT_STOP, ACTION_PEND_STOP } from 'app/costants/rightPanel/actions';
import { selectRpActionKey, setRpAction, setUserSelectedMapItem } from 'app/store/slice/layoutSlice';
import { ClockIcon, Edit3Icon, EuroIcon, MapPinIcon, Trash2Icon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import RouteSummary from './RouteSummary';

function StopItem(props) {
  const { idx, stop, isLast } = props;
  const dispatch = useDispatch();

  const actionKey = useSelector(selectRpActionKey);
  const noAction = actionKey === null;

  const categoryColor = CATEGORY_COLORS[stop.category] || MISSING_COLOR;

  const onEditStop = () => {
    dispatch(setRpAction({ key: ACTION_EDIT_STOP, idx: idx, data: stop }));
  };
  const onPendingDeleteRequest = () => {
    dispatch(setRpAction({ key: ACTION_PEND_STOP, idx: idx, data: stop.id }));
  };

  return (
    <div className="bg-slate-800/60 hover:bg-slate-800 rounded-xl p-3.5 border border-slate-700/60 shadow-sm transition">
      <div className="flex items-start justify-between">
        <div>
          <span
            className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white"
            style={{ backgroundColor: categoryColor }}
          >
            {stop.category}
          </span>
          <h4 className="text-sm font-bold text-slate-100 mt-1.5">{stop.name}</h4>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => dispatch(setUserSelectedMapItem([stop.lat, stop.lng]))}
            className="p-1 text-slate-400 enabled:hover:text-slate-200 disabled:opacity-50 disabled:cursor-default disabled:bg-slate-800/40"
          >
            <MapPinIcon className="w-3.5 h-3.5" />
          </button>
          <button
            disabled={!noAction}
            onClick={onEditStop}
            className="p-1 text-slate-400 enabled:hover:text-slate-200 disabled:opacity-50 disabled:cursor-default disabled:bg-slate-800/40"
          >
            <Edit3Icon className="w-3.5 h-3.5" />
          </button>
          <button
            disabled={!noAction}
            onClick={onPendingDeleteRequest}
            className="p-1 text-slate-400 enabled:hover:text-rose-400 disabled:opacity-50 disabled:cursor-default disabled:bg-slate-800/40"
          >
            <Trash2Icon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-300">
        <div className="flex items-center space-x-1 text-slate-400">
          <ClockIcon className="w-3.5 h-3.5 text-slate-500" />
          <span>
            {stop.startTime} ({stop.durationMin}m)
          </span>
        </div>
        {stop.cost > 0 && (
          <div className="flex items-center space-x-1 font-semibold text-emerald-400">
            <EuroIcon className="w-3.5 h-3.5" />
            <span>{stop.cost.toLocaleString()}</span>
          </div>
        )}
        <div className="flex items-center space-x-1 text-slate-500 text-[11px]">
          <MapPinIcon className="w-3 h-3" />
          <span>
            {stop.lat}, {stop.lng}
          </span>
        </div>
      </div>

      {stop.notes && (
        <p className="text-xs text-slate-400 bg-slate-900/60 p-2 rounded-lg mt-2.5 border border-slate-800">
          {stop.notes}
        </p>
      )}

      {!isLast && <RouteSummary idx={idx} stop={stop} />}
    </div>
  );
}

export default StopItem;
