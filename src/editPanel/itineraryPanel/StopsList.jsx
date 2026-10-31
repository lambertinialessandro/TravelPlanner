import { ACTION_CREATE_STOP, ACTION_EDIT_STOP, ACTION_PEND_STOP } from 'app/costants/rightPanel/actions';
import { selectDayItinerary, selectRpActionIdx, selectRpActionKey } from 'app/store/slice/layoutSlice';
import { reorderStops } from 'app/store/slice/tripSlice';
import { Fragment, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import FormStop from './stopItem/FormStop';
import PendingDeleteStop from './stopItem/PendingDeleteStop';
import StopItem from './stopItem/StopItem';

function StopsList(props) {
  const dispatch = useDispatch();

  const dayItinerary = useSelector(selectDayItinerary);

  const actionKey = useSelector(selectRpActionKey);
  const actionIdx = useSelector(selectRpActionIdx);

  /* DRAG AND DROP */
  const [draggedIndex, setDraggedIndex] = useState(null);
  const handleDragStart = (e, index) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };
  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === targetIndex) {
      setDraggedIndex(null);
      return;
    }

    dispatch(
      reorderStops({
        selectedDayNum: dayItinerary.day,
        sourceIndex: draggedIndex,
        destinationIndex: targetIndex,
      })
    );

    setDraggedIndex(null);
  };
  const handleDragEnd = () => {
    setDraggedIndex(null);
  };

  /* CREATE AND EDIT ROUTE */
  const isCreatingStop = actionKey === ACTION_CREATE_STOP;
  const isEditingStop = actionKey === ACTION_EDIT_STOP;
  const isPendingDelete = actionKey === ACTION_PEND_STOP;

  return (
    <div className="space-y-3 relative before:absolute before:inset-0 before:left-3.5 before:w-0.5 before:bg-slate-800">
      {dayItinerary.stops?.map((stop, idx) => {
        const isBeingDragged = draggedIndex === idx;
        const isThisIdx = actionIdx === idx;
        const isLast = idx === dayItinerary.stops.length - 1;

        return (
          <Fragment key={stop.id}>
            {isEditingStop && isThisIdx ? (
              <div className="relative pl-8">
                <FormStop />
              </div>
            ) : (
              <div
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, idx)}
                className={`relative pl-8 transition-opacity duration-200 ${
                  isBeingDragged ? 'opacity-40 scale-[0.98]' : 'opacity-100'
                }`}
              >
                <div
                  draggable={!isPendingDelete}
                  onDragStart={(e) => handleDragStart(e, idx)}
                  onDragEnd={handleDragEnd}
                  className={`absolute left-0 top-1.5 w-7 h-7 rounded-full border border-slate-700 bg-slate-900 flex items-center justify-center transition-all z-10 shadow-sm ${
                    isPendingDelete
                      ? 'opacity-50 cursor-default'
                      : 'hover:bg-slate-800 hover:border-rose-500/50 cursor-grab active:cursor-grabbing group'
                  }`}
                  title={isPendingDelete ? '' : 'Drag to reorder'}
                >
                  <span className="text-xs font-bold text-slate-300 group-hover:text-rose-400 transition-colors">
                    {idx + 1}
                  </span>
                </div>

                {isPendingDelete && isThisIdx ? (
                  <PendingDeleteStop stopId={stop.id} />
                ) : (
                  <StopItem idx={idx} stop={stop} isLast={isLast} />
                )}
              </div>
            )}
          </Fragment>
        );
      })}

      {isCreatingStop && (
        <div className="relative pl-8">
          <FormStop />
        </div>
      )}
    </div>
  );
}

export default StopsList;
