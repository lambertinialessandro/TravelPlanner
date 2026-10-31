import { selectIsSelectingLocation, setIsLocationData } from 'app/store/slice/layoutSlice';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

function LocationPicker(props) {
  const { map } = props;
  const dispatch = useDispatch();

  const isSelectingLocation = useSelector(selectIsSelectingLocation);

  useEffect(() => {
    if (!isSelectingLocation) return;
    const container = map.getContainer();
    const prevCursor = container.style.cursor;
    container.style.cursor = 'pointer';

    const handleMapClick = (e) => {
      const { lat, lng } = e.latlng;
      const latFixed = parseFloat(lat.toFixed(6));
      const lngFixed = parseFloat(lng.toFixed(6));

      dispatch(
        setIsLocationData([
          { field: 'lng', value: lngFixed },
          { field: 'lat', value: latFixed },
        ])
      );
    };

    map.on('click', handleMapClick);

    return () => {
      map.off('click', handleMapClick);
      container.style.cursor = prevCursor;
    };
  }, [map, isSelectingLocation]);

  return null;
}

export default LocationPicker;
