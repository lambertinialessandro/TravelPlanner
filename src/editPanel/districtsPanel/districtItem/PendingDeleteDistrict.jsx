import { resetRpAction } from 'app/store/slice/layoutSlice';
import { deleteDistrict } from 'app/store/slice/tripSlice';
import { CheckIcon, RotateCcwIcon } from 'lucide-react';
import { useDispatch } from 'react-redux';

function PendingDeleteDistrict(props) {
  const { districtId } = props;
  const dispatch = useDispatch();

  const onCancelDelete = () => {
    dispatch(resetRpAction());
  };
  const onDeleteStop = () => {
    dispatch(deleteDistrict({ districtId }));
    dispatch(resetRpAction());
  };

  return (
    <div className="bg-rose-950/40 border border-rose-900/50 rounded-xl p-3.5 flex items-center justify-between shadow-inner animate-pulse">
      <span className="text-xs font-semibold text-rose-300">District deleted</span>
      <div className="flex items-center space-x-2">
        <button
          onClick={onCancelDelete}
          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-medium flex items-center space-x-1 transition"
          title="Undo"
        >
          <RotateCcwIcon className="w-3.5 h-3.5 text-slate-400" />
          <span>Undo</span>
        </button>
        <button
          onClick={onDeleteStop}
          className="px-2.5 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded-lg text-xs font-medium flex items-center space-x-1 transition shadow-sm"
          title="Confirm Delete"
        >
          <CheckIcon className="w-3.5 h-3.5" />
          <span>Confirm</span>
        </button>
      </div>
    </div>
  );
}

export default PendingDeleteDistrict;
