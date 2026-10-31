import { EDIT_DISTRICT_COLOR } from 'app/costants/colors';
import { ACTION_CREATE_DISTRICT, ACTION_EDIT_DISTRICT } from 'app/costants/rightPanel/actions';
import {
  selectRpActionData,
  selectRpActionKey,
  selectUserSelectedMapItem,
  setUserSelectedMapItem,
} from 'app/store/slice/layoutSlice';
import { selectDistricts } from 'app/store/slice/tripSlice';
import L from 'leaflet';
import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addDistrictShape } from '../mapUtils';

function DistrictsLayer(props) {
  const { map } = props;
  const dispatch = useDispatch();

  const actionKey = useSelector(selectRpActionKey);
  const actionData = useSelector(selectRpActionData);
  const isCreatingOrEditingDistrict = actionKey === ACTION_CREATE_DISTRICT || actionKey === ACTION_EDIT_DISTRICT;

  const districts = useSelector(selectDistricts);
  const activeDistricts = useMemo(() => {
    if (!districts) return [];
    return districts;
  }, [districts]);

  const userSelectedMapItem = useSelector(selectUserSelectedMapItem);

  // draw: one layerGroup, cleanup = remove the whole group
  useEffect(() => {
    const group = L.layerGroup().addTo(map);

    if (activeDistricts.length === 0) return;

    activeDistricts.forEach((district) => {
      addDistrictShape(district, group, district.color, !isCreatingOrEditingDistrict);
    });

    return () => group.remove();
  }, [map, districts, isCreatingOrEditingDistrict]);

  useEffect(() => {
    const group = L.layerGroup().addTo(map);

    if (isCreatingOrEditingDistrict && (actionData?.center?.length == 2 || actionData?.polygon?.length >= 2)) {
      addDistrictShape(actionData, group, EDIT_DISTRICT_COLOR, false);
    }

    return () => group.remove();
  }, [isCreatingOrEditingDistrict, actionData]);

  // focus a stop chosen from the list
  useEffect(() => {
    console.log('userSelectedMapItem', userSelectedMapItem);
    if (!userSelectedMapItem && !Array.isArray(userSelectedMapItem)) return;

    if (!Array.isArray(userSelectedMapItem[0])) {
      map.setView(userSelectedMapItem, 14);
    } else {
      map.fitBounds(L.latLngBounds(userSelectedMapItem), { padding: [50, 50] });
    }

    dispatch(setUserSelectedMapItem(null));
  }, [map, userSelectedMapItem]);

  return null;
}

export default DistrictsLayer;
