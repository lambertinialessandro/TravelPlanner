import { selectStats } from 'app/store/slice/tripSlice';
import { useSelector } from 'react-redux';

function DistrictStatsPanel(props) {
  const stats = useSelector(selectStats);

  return (
    <div className="p-4 bg-slate-800/40 border-b border-slate-800 grid grid-cols-3 gap-2 text-center">
      {/* <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700/50">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Est. Budget</span>
          <span className="text-sm font-bold text-emerald-400">€{stats.totalCost.toLocaleString()}</span>
        </div> */}
      <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700/50">
        <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Districts</span>
        <span className="text-sm font-bold text-amber-300">{stats.totalDistricts}</span>
      </div>
      {/* <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700/50">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Total Days</span>
          <span className="text-sm font-bold text-rose-400">{stats.daysCount}</span>
        </div> */}
    </div>
  );
}

export default DistrictStatsPanel;
