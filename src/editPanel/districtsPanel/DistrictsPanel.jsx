import { DEAFULT_DISTRICT_COLOR } from 'app/costants/colors';
import { DISTRICT_TYPE_CIRCLE } from 'app/costants/districtTypes';
import { ACTION_CREATE_DISTRICT } from 'app/costants/rightPanel/actions';
import { selectRpActionKey, setRpAction } from 'app/store/slice/layoutSlice';
import { LayersIcon, PlusIcon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import DistrictList from './DistrictList';
import DistrictStatsPanel from './DistrictStatsPanel';

const DEFAULT_DISTRICT = () => ({
  id: `d${Date.now()}`,
  name: '',
  type: DISTRICT_TYPE_CIRCLE,
  color: DEAFULT_DISTRICT_COLOR,
  center: [],
  radius: 1000,
  polygon: [],
  notes: '',
});

function DistrictsPanel(props) {
  const dispatch = useDispatch();

  const actionKey = useSelector(selectRpActionKey);
  const noAction = actionKey === null;

  const onCreateDistrict = () => {
    dispatch(
      setRpAction({
        key: ACTION_CREATE_DISTRICT,
        idx: -1,
        data: DEFAULT_DISTRICT(),
      })
    );
  };

  return (
    <>
      <DistrictStatsPanel />

      <div className="p-3 bg-slate-950 border-b border-slate-800 flex justify-between items-center gap-2">
        <h3 className="text-sm font-bold text-slate-200 flex items-center space-x-2">
          <LayersIcon className="w-4 h-4 text-rose-400" />
          <span>Districts & Neighborhood</span>
        </h3>

        <button
          disabled={!noAction}
          onClick={onCreateDistrict}
          className="px-2.5 py-1.5 bg-slate-800 enabled:hover:bg-slate-700 text-rose-400 rounded-xl border border-slate-700 text-xs font-bold flex items-center space-x-1 shrink-0 disabled:opacity-50 disabled:cursor-default disabled:bg-slate-800/40"
        >
          <PlusIcon className="w-3.5 h-3.5" />
          <span>Add District</span>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-900 border-t border-slate-800">
        <DistrictList />
      </div>
    </>
  );
}

export default DistrictsPanel;
