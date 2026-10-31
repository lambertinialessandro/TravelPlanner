import { STOP_CATEGORIES } from 'app/costants/stopCategories';
import {
  resetRpAction,
  selectIsSelectingLocation,
  selectLocationData,
  selectRpActionData,
  selectRpActionIdx,
  selectSelectedDayNum,
  setIsSelectingLocation,
  updateRpActionData,
} from 'app/store/slice/layoutSlice';
import { updateStoptoItinerary } from 'app/store/slice/tripSlice';
import { Edit3Icon, MapPinIcon, SaveIcon } from 'lucide-react';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function FormStop(props) {
  const dispatch = useDispatch();

  const actionData = useSelector(selectRpActionData);
  const actionIdx = useSelector(selectRpActionIdx);

  const selectedDayNum = useSelector(selectSelectedDayNum);
  const isSelectingLocation = useSelector(selectIsSelectingLocation);
  const locationData = useSelector(selectLocationData);

  useEffect(() => {
    if (!locationData || Object.keys(locationData).length === 0) return;
    dispatch(
      updateRpActionData([
        { field: 'lat', value: locationData.lat },
        { field: 'lng', value: locationData.lng },
      ])
    );
  }, [locationData]);

  const onCancelStop = (e) => {
    e.preventDefault();
    dispatch(setIsSelectingLocation(false));
    dispatch(resetRpAction());
  };
  const onSaveStop = (e) => {
    e.preventDefault();
    if (!actionData) return;

    dispatch(updateStoptoItinerary({ selectedDayNum, actionData }));

    dispatch(setIsSelectingLocation(false));
    dispatch(resetRpAction());
  };

  return (
    <form
      onSubmit={onSaveStop}
      className="bg-slate-900 border border-slate-700 rounded-2xl w-full p-5 space-y-4 shadow-2xl"
    >
      <h3 className="text-base font-bold text-slate-100 flex items-center justify-between">
        <span className="flex items-center space-x-2">
          <Edit3Icon className="w-4 h-4 text-rose-400" />
          <span>{actionIdx >= 0 ? 'Edit Stop' : 'Add New Stop'}</span>
        </span>
      </h3>

      <div className="space-y-3 text-xs">
        <div>
          <label className="block text-slate-400 font-semibold mb-1">Stop Name</label>
          <input
            type="text"
            required
            value={actionData.name}
            onChange={(e) => dispatch(updateRpActionData([{ field: 'name', value: e.target.value }]))}
            placeholder="e.g. Fushimi Inari Shrine"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-200 outline-none focus:border-rose-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
          <div className="col-span-2">
            <button
              type="button"
              onClick={() => {
                dispatch(setIsSelectingLocation(!isSelectingLocation));
              }}
              className={`px-3 py-1 rounded-lg text-sm font-semibold flex items-center space-x-2 transition-all duration-200 bg-rose-600 hover:bg-rose-500 text-white ${
                isSelectingLocation
                  ? 'animate-pulse ring-4 ring-rose-500/30 shadow-lg shadow-amber-500/20'
                  : 'shadow-md'
              }`}
              title="Click on the map to set location"
            >
              <MapPinIcon className="w-3.5 h-3.5" />
              <span>{isSelectingLocation ? 'Click Map to Drop Pin...' : 'Pick Location on Map'}</span>
            </button>
          </div>
          <div>
            <label className="block text-rose-400 font-semibold mb-1">Latitude (Lat)</label>
            <input
              type="number"
              step="any"
              required
              value={actionData.lat ?? ''}
              onChange={(e) =>
                dispatch(
                  updateRpActionData([{ field: 'lat', value: e.target.value === '' ? '' : parseFloat(e.target.value) }])
                )
              }
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 font-mono outline-none focus:border-rose-500"
            />
          </div>
          <div>
            <label className="block text-rose-400 font-semibold mb-1">Longitude (Lng)</label>
            <input
              type="number"
              step="any"
              required
              value={actionData.lng ?? ''}
              onChange={(e) =>
                dispatch(
                  updateRpActionData([
                    { field: 'lng', value: e.target.value === '' ? '' : parseFloat(e.target.value) },
                  ])
                )
              }
              className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 font-mono outline-none focus:border-rose-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Category</label>
            <select
              value={actionData.category}
              onChange={(e) => dispatch(updateRpActionData([{ field: 'category', value: e.target.value }]))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-200 outline-none focus:border-rose-500"
            >
              {STOP_CATEGORIES.map(({ id, value }, idx) => (
                <option key={idx} value={id}>
                  {value}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Est. Cost (€ EUR)</label>
            <input
              type="number"
              value={actionData.cost ?? ''}
              onChange={(e) =>
                dispatch(
                  updateRpActionData([{ field: 'cost', value: e.target.value === '' ? '' : parseInt(e.target.value) }])
                )
              }
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-200 outline-none focus:border-rose-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Start Time</label>
            <input
              type="text"
              value={actionData.startTime}
              onChange={(e) => dispatch(updateRpActionData([{ field: 'startTime', value: e.target.value }]))}
              placeholder="14:00"
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-200 outline-none focus:border-rose-500"
            />
          </div>
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Duration (minutes)</label>
            <input
              type="number"
              value={actionData.durationMin ?? ''}
              onChange={(e) =>
                dispatch(
                  updateRpActionData([
                    { field: 'durationMin', value: e.target.value === '' ? '' : parseInt(e.target.value) },
                  ])
                )
              }
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-200 outline-none focus:border-rose-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-slate-400 font-semibold mb-1">Notes / Recommendations</label>
          <textarea
            rows="2"
            value={actionData.notes}
            onChange={(e) => dispatch(updateRpActionData([{ field: 'notes', value: e.target.value }]))}
            placeholder="Tips, ticket info, menu highlights..."
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-200 outline-none focus:border-rose-500"
          ></textarea>
        </div>
      </div>

      <div className="flex items-center justify-end space-x-2 pt-2">
        <button
          type="button"
          onClick={onCancelStop}
          className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1"
        >
          <SaveIcon className="w-3.5 h-3.5" />
          <span>{actionIdx >= 0 ? 'Save Changes' : 'Save Stop'}</span>
        </button>
      </div>
    </form>
  );
}

export default FormStop;
