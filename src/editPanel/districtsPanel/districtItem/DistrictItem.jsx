import { DISTRICT_TYPE_CIRCLE, DISTRICT_TYPE_POLYGON } from 'app/costants/districtTypes';
import { ACTION_EDIT_DISTRICT, ACTION_PEND_DISTRICT } from 'app/costants/rightPanel/actions';
import { selectRpActionKey, setRpAction, setUserSelectedMapItem } from 'app/store/slice/layoutSlice';
import L from 'leaflet';
import { CircleGaugeIcon, Edit3Icon, MapPinIcon, Trash2Icon, VectorPolygonIcon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';

function DistrictItem(props) {
  const { idx, district } = props;
  const dispatch = useDispatch();

  const actionKey = useSelector(selectRpActionKey);
  const noAction = actionKey === null;

  const isCircle = district.type === DISTRICT_TYPE_CIRCLE;
  const isPolygon = district.type === DISTRICT_TYPE_POLYGON;

  const onEditDistrict = (idx, district) => {
    dispatch(setRpAction({ key: ACTION_EDIT_DISTRICT, idx: idx, data: district }));
  };
  const onPendingDeleteRequest = (idx, district) => {
    dispatch(setRpAction({ key: ACTION_PEND_DISTRICT, idx: idx, data: district.id }));
  };

  return (
    <div className="bg-slate-800/60 hover:bg-slate-800 rounded-xl p-3.5 border border-slate-700/60 shadow-sm transition">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <span
              className="text-[10px] font-bold px-2 py-0.5 rounded-full text-white uppercase"
              style={{ backgroundColor: district.color }}
            >
              {district.type}
            </span>
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300">
              {isCircle && (
                <div className="flex items-center space-x-1 text-slate-400">
                  <CircleGaugeIcon className="w-3.5 h-3.5 text-slate-500" />
                  <span>Radius: {district.radius}m</span>
                </div>
              )}
              {isPolygon && (
                <div className="flex items-center space-x-1 text-slate-400">
                  <VectorPolygonIcon className="w-3.5 h-3.5 text-slate-500" />
                  <span>{district.polygon?.length || 0} vertices</span>
                </div>
              )}
            </div>
          </div>
          <h4 className="text-sm font-bold text-slate-100 mt-1.5">{district.name}</h4>
        </div>

        <div className="flex items-center space-x-1">
          <button
            onClick={() => {
              let latLng = null;
              if (district.type === DISTRICT_TYPE_CIRCLE) {
                latLng = district.center;
              } else if (district.type === DISTRICT_TYPE_POLYGON) {
                if (district.polygon.length > 0) {
                  latLng = district.polygon.map(([lat, lng]) => [lat, lng]);
                }
              }

              console.log('latLng', latLng);

              if (latLng) {
                dispatch(setUserSelectedMapItem(latLng));
              }
            }}
            className="p-1 text-slate-400 enabled:hover:text-slate-200 disabled:opacity-50 disabled:cursor-default disabled:bg-slate-800/40"
          >
            <MapPinIcon className="w-3.5 h-3.5" />
          </button>
          <button
            disabled={!noAction}
            onClick={() => onEditDistrict(idx, district)}
            className="p-1 text-slate-400 enabled:hover:text-slate-200 disabled:opacity-50 disabled:cursor-default disabled:bg-slate-800/40"
            title="Edit district points directly on map by dragging!"
          >
            <Edit3Icon className="w-3.5 h-3.5" />
          </button>
          <button
            disabled={!noAction}
            onClick={() => onPendingDeleteRequest(idx, district)}
            className="p-1 text-slate-400 enabled:hover:text-rose-400 disabled:opacity-50 disabled:cursor-default disabled:bg-slate-800/40"
          >
            <Trash2Icon className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {district.notes && (
        <p className="text-xs text-slate-400 bg-slate-900/60 p-2 rounded-lg mt-2.5 border border-slate-800">
          {district.notes}
        </p>
      )}
    </div>
  );
}

export default DistrictItem;
