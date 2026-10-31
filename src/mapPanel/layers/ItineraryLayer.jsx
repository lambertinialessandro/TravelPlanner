import { CATEGORY_COLORS, DEAFULT_DIRECT_PATH_COLOR, EDIT_MARK_COLOR, MISSING_COLOR } from 'app/costants/colors';
import { ACTION_CREATE_STOP, ACTION_EDIT_STOP } from 'app/costants/rightPanel/actions';
import {
  selectDayItinerary,
  selectRpActionData,
  selectRpActionKey,
  selectUserSelectedMapItem,
  setUserSelectedMapItem,
} from 'app/store/slice/layoutSlice';
import L from 'leaflet';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addDistrictShape, addMarker } from '../mapUtils';
import { selectDistricts } from 'app/store/slice/tripSlice';

function ItineraryLayer(props) {
  const { map } = props;
  const dispatch = useDispatch();

  const actionKey = useSelector(selectRpActionKey);
  const actionData = useSelector(selectRpActionData);
  const isCreatingOrEditingStop = actionKey === ACTION_CREATE_STOP || actionKey === ACTION_EDIT_STOP;

  const dayItinerary = useSelector(selectDayItinerary);
  const activeStops = useMemo(() => {
    if (!dayItinerary || !dayItinerary.stops) return [];
    return dayItinerary.stops;
  }, [dayItinerary]);

  const districts = useSelector(selectDistricts);
  const activeDistricts = useMemo(() => {
    if (!districts) return [];
    return districts;
  }, [districts]);

  const userSelectedMapItem = useSelector(selectUserSelectedMapItem);

  // draw: one layerGroup, cleanup = remove the whole group
  useEffect(() => {
    const group = L.layerGroup().addTo(map);

    if (activeDistricts?.length !== 0) {
      activeDistricts.forEach((district) => {
        addDistrictShape(district, group, district.color, !isCreatingOrEditingStop);
      });
    }

    if (activeStops?.length !== 0) {
      activeStops.forEach((stop, idx) => {
        addMarker(idx + 1, stop, CATEGORY_COLORS[stop.category] || MISSING_COLOR, group);
      });

      for (let i = 0; i < activeStops.length - 1; i++) {
        const currentRoute = activeStops[i].travelToNext?.route;
        if (currentRoute) {
          const coords = currentRoute.map(([lng, lat]) => [lat, lng]);
          L.polyline(coords, {
            color: activeStops[i].travelToNext.color,
            weight: 6,
            opacity: 0.95,
          }).addTo(group);
        } else {
          L.polyline(
            [
              [activeStops[i].lat, activeStops[i].lng],
              [activeStops[i + 1].lat, activeStops[i + 1].lng],
            ],
            {
              color: DEAFULT_DIRECT_PATH_COLOR,
              weight: 3,
              dashArray: '6, 6',
              opacity: 0.7,
            }
          ).addTo(group);
        }
      }
    }

    return () => group.remove();
  }, [map, activeStops, isCreatingOrEditingStop]);

  useEffect(() => {
    const group = L.layerGroup().addTo(map);

    if (isCreatingOrEditingStop && actionData?.lat && actionData?.lng ) {
      addMarker('E', actionData, EDIT_MARK_COLOR, group);
    }

    return () => group.remove();
  }, [isCreatingOrEditingStop, actionData]);

  // fit bounds only when the stops change (not while editing)
  useEffect(() => {
    if (isCreatingOrEditingStop || activeStops.length === 0) return;

    const latLngs = activeStops.map((s) => [s.lat, s.lng]);
    if (latLngs.length === 1) {
      map.setView(latLngs[0], 14);
    } else {
      map.fitBounds(L.latLngBounds(latLngs), { padding: [50, 50] });
    }
  }, [map, activeStops]);

  // focus a stop chosen from the list
  useEffect(() => {
    if (!userSelectedMapItem) return;

    map.setView(userSelectedMapItem, 16);
    dispatch(setUserSelectedMapItem(null));
  }, [map, userSelectedMapItem]);

  return null;
}

export default ItineraryLayer;
