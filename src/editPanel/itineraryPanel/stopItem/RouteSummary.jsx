import { DEAFULT_ROUTE_COLOR } from 'app/costants/colors';
import { ACTION_EDIT_ROUTE } from 'app/costants/rightPanel/actions';
import { ROUTE_MODES } from 'app/costants/routeMode';
import {
  resetRpAction,
  selectDayItinerary,
  selectRpActionData,
  selectRpActionIdx,
  selectRpActionKey,
  setRpAction,
  updateRpActionData,
} from 'app/store/slice/layoutSlice';
import { deleteRouteToStop, selectItinerary, updateRouteToStop } from 'app/store/slice/tripSlice';
import { NavigationIcon, SaveIcon, Trash2Icon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';

function RouteSummary(props) {
  const { idx, stop } = props;
  const dispatch = useDispatch();

  const actionKey = useSelector(selectRpActionKey);
  const actionIdx = useSelector(selectRpActionIdx);
  const actionData = useSelector(selectRpActionData);

  const isThisIdx = actionIdx === idx;
  const hasRoute = !!stop.travelToNext;
  const noAction = actionKey === null;
  const isEditingRoute = actionKey === ACTION_EDIT_ROUTE;

  const itinerary = useSelector(selectItinerary);
  const dayItinerary = useSelector(selectDayItinerary);

  const onStartRouteToStop = () => {
    dispatch(
      setRpAction({
        key: ACTION_EDIT_ROUTE,
        idx: idx,
        data: {
          itineraryDay: dayItinerary.day,
          originStopId: stop.id,
          destStopId: dayItinerary.stops[idx + 1].id,
          mode: '',
          routeColor: DEAFULT_ROUTE_COLOR,
          loading: false,
          error: null,
          result: null,
        },
      })
    );
  };
  const onCancelRoute = () => {
    dispatch(resetRpAction());
  };
  const onCalculateRoute = async () => {
    if (!actionData.originStopId || !actionData.destStopId) {
      dispatch(updateRpActionData([{ field: 'error', value: 'Please select both origin and destination stops.' }]));
      return;
    }

    const allStops = itinerary.flatMap((d) => d.stops);
    const origin = allStops.find((s) => s.id === actionData.originStopId);
    const dest = allStops.find((s) => s.id === actionData.destStopId);

    if (!origin || !dest) {
      dispatch(updateRpActionData([{ field: 'error', value: 'Stops not found.' }]));
      return;
    }

    dispatch(
      updateRpActionData([
        { field: 'loading', value: true },
        { field: 'error', value: null },
        { field: 'result', value: null },
      ])
    );

    try {
      const url = `https://router.project-osrm.org/route/v1/${actionData.mode}/${origin.lng},${origin.lat};${dest.lng},${dest.lat}?overview=full&geometries=geojson&steps=true`;

      const res = await fetch(url);
      const data = await res.json();

      if (data.code === 'Ok' && data.routes && data.routes[0]) {
        const route = data.routes[0];
        const rawSteps = route.legs[0]?.steps?.map((s) => s.maneuver.instruction || s.name).filter(Boolean) || [];

        const distanceKm = (route.distance / 1000).toFixed(2);
        const durationMin = Math.round(route.duration / 60);

        dispatch(
          updateRouteToStop({
            selectedDayNum: parseInt(actionData.itineraryDay),
            stopId: actionData.originStopId,
            mode: actionData.mode,
            description: `To ${dest.name} (${distanceKm} km)`,
            timeMin: durationMin,
            route: route.geometry.coordinates,
            indications: rawSteps,
            color: actionData.routeColor,
          })
        );

        dispatch(resetRpAction());
      } else {
        dispatch(
          updateRpActionData([
            { field: 'loading', value: false },
            { field: 'error', value: 'Could not calculate route between these points.' },
          ])
        );
      }
    } catch (err) {
      dispatch(
        updateRpActionData([
          { field: 'loading', value: false },
          { field: 'error', value: 'Network error calculating route.' },
        ])
      );
    }
  };
  const onDeleteRoute = () => {
    dispatch(deleteRouteToStop({ selectedDayNum: dayItinerary.day, stopId: stop.id }));
  };

  return (
    <>
      {isEditingRoute && isThisIdx ? (
        <div className="mt-2 grid grid-cols-2 gap-2 bg-slate-950 p-2.5 rounded-xl border border-slate-800">
          <div>
            <label className="block text-xs text-slate-400 font-semibold mb-1">Travel Mode</label>
            <select
              value={actionData.mode}
              onChange={(e) => dispatch(updateRpActionData([{ field: 'mode', value: e.target.value }]))}
              className="w-full text-xs bg-slate-800 border border-slate-700 rounded-lg p-2.5 text-slate-200 outline-none focus:border-rose-500"
            >
              {ROUTE_MODES.map(({ id, value }, idx) => (
                <option key={idx} value={id}>
                  {value}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col">
            <label className="block text-xs text-slate-400 font-semibold mb-1">Route Line Color</label>
            <input
              type="color"
              value={actionData.routeColor}
              onChange={(e) => dispatch(updateRpActionData([{ field: 'routeColor', value: e.target.value }]))}
              className="flex-1 w-full text-xs bg-slate-800 border border-slate-700 rounded-lg px-1 py-0.5 text-slate-200 outline-none focus:border-rose-500"
            />
          </div>

          {actionData.error && (
            <p className="col-span-2 text-xs text-red-400 bg-red-950/40 border border-red-800 p-2 rounded-lg">
              {actionData.error}
            </p>
          )}

          <div className="col-span-2 flex items-center justify-end space-x-2 pt-2">
            <button
              type="button"
              onClick={onCancelRoute}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={onCalculateRoute}
              disabled={actionData.loading}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1"
            >
              <SaveIcon className="w-3.5 h-3.5" />
              <span>{actionData.loading ? 'Calculating...' : 'Generate Route'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-3 pt-2 border-t border-slate-700/40 flex items-center space-x-2 text-[11px] text-amber-300">
          {!hasRoute ? (
            <button
              disabled={!noAction}
              onClick={() => onStartRouteToStop()}
              className="text-xs font-semibold flex items-center space-x-1.5 transition text-slate-400 enabled:hover:text-white disabled:opacity-50 disabled:cursor-default disabled:bg-slate-800/40"
            >
              <NavigationIcon className="w-3.5 h-3.5" />
              <span>Generate</span>
            </button>
          ) : (
            <div className="w-full flex flex-row justify-between items-center">
              <div className="w-full flex-1 flex gap-1 justify-start">
                <NavigationIcon className={`w-3.5 h-3.5 ${hasRoute ? 'text-amber-400' : 'text-slate-400'} `} />
                <span className="font-semibold">{stop.travelToNext.mode}:</span>
                <span>{stop.travelToNext.description}</span>
                <span className="text-slate-500">({stop.travelToNext.timeMin} mins)</span>
              </div>
              <button
                disabled={!noAction}
                onClick={onDeleteRoute}
                className="p-1 text-slate-400 enabled:hover:text-rose-400 disabled:opacity-50 disabled:cursor-default disabled:bg-slate-800/40"
              >
                <Trash2Icon className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}

export default RouteSummary;
