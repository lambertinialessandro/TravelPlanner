import { LANGUAGES } from 'app/costants/languages';
import { selectPresentationMode, setPresentationMode, setSelectedDayNum } from 'app/store/slice/layoutSlice';
import { selectMapLang, setMapLang } from 'app/store/slice/mapSlice';
import {
  selectDistricts,
  selectItinerary,
  selectTripTitle,
  setDistricts,
  setItinerary,
  setTripTitle,
} from 'app/store/slice/tripSlice';
import { DownloadIcon, EyeIcon, GlobeIcon, RotateCcwIcon, UploadIcon } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// TODO: split in sub components
function ControlsButtons(props) {
  const dispatch = useDispatch();

  /* LANGUAGE SELECTOR */
  const mapLang = useSelector(selectMapLang);

  /* NEW ITINERARY */
  const [isOpenNewItinerary, setIsOpenNewItinerary] = useState(false);

  const handleStartNewItinerary = useCallback((preset = 'blank') => {
    setIsOpenNewItinerary(false);

    if (!window.confirm('Start a new itinerary? Existing unsaved changes will be replaced.')) return;

    if (preset === 'blank') {
      dispatch(
        setItinerary([
          {
            day: 1,
            date: new Date().toISOString().slice(0, 10),
            title: 'Day 1: Arrival',
            summary: 'Initial Day',
            districtId: '',
            stops: [],
          },
        ])
      );
      dispatch(setDistricts([]));
    }

    dispatch(setSelectedDayNum(1));
  }, []);

  /* PRESENTATION MODE */
  const presentationMode = useSelector(selectPresentationMode);

  /* IMPORT/EXPORT ITINERARY */
  const tripTitle = useSelector(selectTripTitle);
  const itinerary = useSelector(selectItinerary);
  const districts = useSelector(selectDistricts);

  const handleExportJSON = () => {
    const dataStr =
      'data:text/json;charset=utf-8,' +
      encodeURIComponent(JSON.stringify({ tripTitle, itinerary, districts }, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `${tripTitle.toLowerCase().replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleImportJSON = (e) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target.result);
          if (parsed.tripTitle) dispatch(setTripTitle(parsed.tripTitle));
          if (parsed.itinerary) dispatch(setItinerary(parsed.itinerary));
          if (parsed.districts) dispatch(setDistricts(parsed.districts));
          alert('Itinerary loaded successfully!');
        } catch (err) {
          alert('Invalid JSON file format.');
        }
      };
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {/* LANGUAGE SELECTOR */}
      <div className="flex items-center space-x-1 bg-slate-700 px-2 py-1 rounded-lg border border-slate-600 text-xs text-slate-200">
        <GlobeIcon className="w-3.5 h-3.5 text-rose-400" />
        <select
          value={mapLang}
          onChange={(e) => dispatch(setMapLang(e.target.value))}
          className="bg-transparent text-slate-200 text-xs font-medium outline-none cursor-pointer"
        >
          {LANGUAGES.map(({ id, value }, idx) => (
            <option key={idx} value={id} className="bg-slate-800">
              {value}
            </option>
          ))}
        </select>
      </div>

      {/* NEW ITINERARY */}
      <div className="relative">
        <button
          onClick={() => setIsOpenNewItinerary(!isOpenNewItinerary)}
          className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600 flex items-center space-x-1.5 transition"
        >
          <RotateCcwIcon className="w-3.5 h-3.5 text-amber-400" />
          <span className="hidden sm:inline">New Plan</span>
        </button>
        {isOpenNewItinerary && (
          <div className="absolute right-0 mt-1 w-44 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 p-1 space-y-1">
            <button
              onClick={() => handleStartNewItinerary('blank')}
              className="w-full text-left px-3 py-1.5 text-xs text-slate-200 hover:bg-slate-700 rounded-lg"
            >
              Start Blank Plan
            </button>
          </div>
        )}
      </div>

      {/* PRESENTATION MODE */}
      <button
        onClick={() => dispatch(setPresentationMode(!presentationMode))}
        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition flex items-center space-x-1.5 ${presentationMode ? 'bg-amber-500/20 border-amber-500 text-amber-300' : 'border-slate-700 text-slate-300 hover:bg-slate-700'}`}
      >
        <EyeIcon className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{presentationMode ? 'Exit Mode' : 'Presentation'}</span>
      </button>

      {/* IMPORT/EXPORT ITINERARY */}
      <button
        onClick={handleExportJSON}
        title="Export JSON Backup"
        className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600 transition"
      >
        <DownloadIcon className="w-4 h-4" />
      </button>

      <label
        title="Import JSON Backup"
        className="p-2 rounded-lg bg-slate-700 hover:bg-slate-600 text-slate-200 border border-slate-600 transition cursor-pointer"
      >
        <UploadIcon className="w-4 h-4" />
        <input type="file" accept=".json" onChange={handleImportJSON} className="hidden" />
      </label>
    </div>
  );
}

export default ControlsButtons;
