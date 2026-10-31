import { selectDistricts, selectItinerary, updateStats } from 'app/store/slice/tripSlice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function StatsWatcher({ children }) {
  const dispatch = useDispatch();
  const itinerary = useSelector(selectItinerary);
  const districts = useSelector(selectDistricts);

  useEffect(() => {
    dispatch(updateStats());
  }, [itinerary, districts]);

  return <></>;
}

export default StatsWatcher;
