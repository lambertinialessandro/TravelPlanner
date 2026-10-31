import { CompassIcon, Edit3Icon, SaveIcon } from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectTripTitle, setTripTitle } from "app/store/slice/tripSlice";

function Title(props) {
  const dispatch = useDispatch();

  const tripTitle = useSelector(selectTripTitle);

  const [editingTitle, setEditingTitle] = useState(false);

  return (
    <div className="flex items-center space-x-3">
      <div className="bg-linear-to-tr from-rose-500 to-red-600 p-2.5 rounded-xl shadow-lg shadow-rose-500/30">
        <CompassIcon className="w-6 h-6 text-white animate-pulse" />
      </div>
      <div>
        {editingTitle ? (
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={tripTitle}
              onChange={(e) => dispatch(setTripTitle(e.target.value))}
              className="bg-slate-900 border border-rose-500 text-lg font-bold px-2 py-0.5 rounded text-slate-100 outline-none"
              autoFocus
            />
            <button
              onClick={() => setEditingTitle(false)}
              className="p-1 bg-rose-600 hover:bg-rose-500 rounded text-xs text-white"
            >
              <SaveIcon className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div
            className="flex items-center space-x-2 group cursor-pointer"
            onClick={() => setEditingTitle(true)}
          >
            <h1 className="text-lg font-bold tracking-tight bg-linear-to-tr from-rose-400 via-pink-300 to-amber-200 bg-clip-text text-transparent">
              {tripTitle}
            </h1>
            <Edit3Icon className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 transition" />
          </div>
        )}
        <p className="text-xs text-slate-400">
          Interactive Map, Custom Districts & Turn-by-Turn Routes
        </p>
      </div>
    </div>
  );
}

export default Title;
