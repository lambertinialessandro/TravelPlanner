import { DISTRICT_TYPES, DISTRICT_TYPE_CIRCLE, DISTRICT_TYPE_POLYGON } from 'app/costants/districtTypes';
import {
  resetRpAction,
  selectIsSelectingLocation,
  selectLocationData,
  selectRpActionData,
  selectRpActionIdx,
  setIsSelectingLocation,
  updateRpActionData,
} from 'app/store/slice/layoutSlice';
import { updateDistrict } from 'app/store/slice/tripSlice';
import { Edit3Icon, MapPinIcon, MapPinPlusIcon, MapPinXInsideIcon, PlusIcon, SaveIcon, Trash2Icon } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function FormDistrict(props) {
  const dispatch = useDispatch();

  const actionData = useSelector(selectRpActionData);
  const actionIdx = useSelector(selectRpActionIdx);

  const isSelectingLocation = useSelector(selectIsSelectingLocation);
  const locationData = useSelector(selectLocationData);
  const [locationDataIdx, setLocationDataIdx] = useState(null);

  useEffect(() => {
    if (!locationData || Object.keys(locationData).length === 0) return;

    if (actionData.type === DISTRICT_TYPE_CIRCLE) {
      dispatch(updateRpActionData([{ field: 'center', value: [locationData.lat, locationData.lng] }]));
    } else if (actionData.type === DISTRICT_TYPE_POLYGON) {
      dispatch(
        updateRpActionData([
          {
            field: 'polygon',
            value: actionData.polygon.map((p, i) => (i !== locationDataIdx ? p : [locationData.lat, locationData.lng])),
          },
        ])
      );
    }
  }, [locationData]);

  const onCancelDistrict = (e) => {
    console.log('onCancelDistrict');
    e.preventDefault();
    dispatch(setIsSelectingLocation(false));
    dispatch(resetRpAction());
  };
  const onSaveDistrict = (e) => {
    console.log('onSaveDistrict');
    e.preventDefault();
    if (!actionData) return;

    dispatch(updateDistrict({ actionData }));

    dispatch(setIsSelectingLocation(false));
    dispatch(resetRpAction());
  };

  return (
    <form
      onSubmit={onSaveDistrict}
      className="bg-slate-900 border border-slate-700 rounded-2xl w-full p-5 space-y-4 shadow-2xl"
    >
      <h3 className="text-base font-bold text-slate-100 flex items-center justify-between">
        <span className="flex items-center space-x-2">
          <Edit3Icon className="w-4 h-4 text-rose-400" />
          <span>{actionIdx >= 0 ? 'Edit District' : 'Add New District'}</span>
        </span>
      </h3>

      <div className="space-y-3 text-xs">
        <div>
          <label className="block text-slate-400 font-semibold mb-1">District Name</label>
          <input
            type="text"
            required
            value={actionData.name}
            onChange={(e) => dispatch(updateRpActionData([{ field: 'name', value: e.target.value }]))}
            placeholder="e.g. Fushimi Inari Shrine"
            className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-200 outline-none focus:border-rose-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="block text-slate-400 font-semibold mb-1">Type</label>
            <select
              value={actionData.type}
              onChange={(e) => dispatch(updateRpActionData([{ field: 'type', value: e.target.value }]))}
              className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-200 outline-none focus:border-rose-500"
            >
              {DISTRICT_TYPES.map(({ id, value }, idx) => (
                <option key={idx} value={id}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-slate-400 font-semibold mb-1">Color</label>
            <input
              type="color"
              value={actionData.color}
              onChange={(e) => dispatch(updateRpActionData([{ field: 'color', value: e.target.value }]))}
              className="flex-1 w-full text-xs bg-slate-800 border border-slate-700 rounded-lg px-1 py-0.5 text-slate-200 outline-none focus:border-rose-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
          {actionData.type === DISTRICT_TYPE_CIRCLE && (
            <>
              <div className="col-span-2">
                <button
                  type="button"
                  onClick={() => {
                    dispatch(setIsSelectingLocation(!isSelectingLocation));
                  }}
                  className={`px-3 py-1 rounded-lg text-sm font-semibold flex items-center space-x-2 transition-all duration-200 bg-rose-600 hover:bg-rose-500 text-white ${
                    isSelectingLocation
                      ? 'animate-pulse ring-4 ring-amber-500/30 shadow-lg shadow-amber-500/20'
                      : 'shadow-md'
                  }`}
                  title="Click on the map to set location"
                >
                  <MapPinIcon className="w-3.5 h-3.5" />
                  <span>{isSelectingLocation ? 'Click Map to Drop Pin...' : 'Pick Location on Map'}</span>
                </button>
              </div>
              <div>
                <label className="block text-rose-400 font-semibold mb-1">Center Latitude (Lat)</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={actionData.center[0] ?? ''}
                  onChange={(e) =>
                    dispatch(
                      updateRpActionData([
                        {
                          field: 'center',
                          value: [e.target.value === '' ? '' : parseFloat(e.target.value), center[1] || ''],
                        },
                      ])
                    )
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 font-mono outline-none focus:border-rose-500"
                />
              </div>
              <div>
                <label className="block text-rose-400 font-semibold mb-1">Center Longitude (Lng)</label>
                <input
                  type="number"
                  step="any"
                  required
                  value={actionData.center[1] ?? ''}
                  onChange={(e) =>
                    dispatch(
                      updateRpActionData([
                        {
                          field: 'center',
                          value: [center[0] || '', e.target.value === '' ? '' : parseFloat(e.target.value)],
                        },
                      ])
                    )
                  }
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 font-mono outline-none focus:border-rose-500"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-slate-400 font-semibold mb-1">Radius</label>
                <input
                  type="number"
                  value={actionData.radius ?? ''}
                  onChange={(e) =>
                    dispatch(
                      updateRpActionData([
                        { field: 'radius', value: e.target.value === '' ? '' : parseInt(e.target.value) },
                      ])
                    )
                  }
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-200 outline-none focus:border-rose-500"
                />
              </div>
            </>
          )}
          {actionData.type === DISTRICT_TYPE_POLYGON && (
            <>
              <div className="col-span-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => {
                    dispatch(
                      updateRpActionData([{ field: 'polygon', value: [...(actionData?.polygon ?? []), ['', '']] }])
                    );
                  }}
                  className="px-3 py-1 rounded-lg text-sm font-semibold flex items-center space-x-2 transition-all duration-200 bg-rose-600 hover:bg-rose-500 text-white shadow-md"
                  title="Click on the map to set location"
                >
                  <PlusIcon className="w-3.5 h-3.5" />
                  <span>Add a Point</span>
                </button>
              </div>

              {actionData?.polygon.map((point, idx) => (
                <div key={idx} className="col-span-2 flex gap-2 items-end">
                  <div className="flex-1">
                    <label className="block text-rose-400 font-semibold mb-1">#{idx + 1} Latitude (Lat)</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={actionData.polygon[idx][0] ?? ''}
                      onChange={(e) => {
                        dispatch(
                          updateRpActionData([
                            {
                              field: 'polygon',
                              value: actionData.polygon.map((p, i) => (i !== idx ? p : [e.target.value, p[1]])),
                            },
                          ])
                        );
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 font-mono outline-none focus:border-rose-500"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-rose-400 font-semibold mb-1">#{idx + 1} Longitude (Lng)</label>
                    <input
                      type="number"
                      step="any"
                      required
                      value={actionData.polygon[idx][1] ?? ''}
                      onChange={(e) => {
                        dispatch(
                          updateRpActionData([
                            {
                              field: 'polygon',
                              value: actionData.polygon.map((p, i) => (i !== idx ? p : [p[0], e.target.value])),
                            },
                          ])
                        );
                      }}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 text-slate-100 font-mono outline-none focus:border-rose-500"
                    />
                  </div>

                  <button
                    type="button"
                    disabled={isSelectingLocation && locationDataIdx !== idx}
                    onClick={() => {
                      if (isSelectingLocation) {
                        setLocationDataIdx(null);
                      } else {
                        setLocationDataIdx(idx);
                      }
                      dispatch(setIsSelectingLocation(!isSelectingLocation));
                    }}
                    className="mb-1 p-1 text-slate-400 enabled:hover:text-slate-200 disabled:opacity-50 disabled:cursor-default disabled:bg-slate-800/40"
                  >
                    {isSelectingLocation && locationDataIdx === idx ? (
                      <MapPinXInsideIcon className="w-4.5 h-4.5" />
                    ) : (
                      <MapPinPlusIcon className="w-4.5 h-4.5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      dispatch(
                        updateRpActionData([
                          { field: 'polygon', value: actionData.polygon.filter((_, i) => i !== idx) },
                        ])
                      );
                    }}
                    className="mb-1 p-1 text-slate-400 enabled:hover:text-rose-400 disabled:opacity-50 disabled:cursor-default disabled:bg-slate-800/40"
                  >
                    <Trash2Icon className="w-4.5 h-4.5" />
                  </button>
                </div>
              ))}
            </>
          )}
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
          onClick={onCancelDistrict}
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

export default FormDistrict;
