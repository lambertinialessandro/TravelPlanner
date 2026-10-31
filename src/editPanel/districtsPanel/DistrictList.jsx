import { ACTION_CREATE_DISTRICT, ACTION_EDIT_DISTRICT, ACTION_PEND_DISTRICT } from 'app/costants/rightPanel/actions';
import { selectRpActionIdx, selectRpActionKey } from 'app/store/slice/layoutSlice';
import { selectDistricts } from 'app/store/slice/tripSlice';
import { Fragment } from 'react';
import { useSelector } from 'react-redux';
import DistrictItem from './districtItem/DistrictItem';
import FormDistrict from './districtItem/FormDistrict';
import PendingDeleteDistrict from './districtItem/PendingDeleteDistrict';

function DistrictList(props) {
  const districts = useSelector(selectDistricts);

  const actionKey = useSelector(selectRpActionKey);
  const actionIdx = useSelector(selectRpActionIdx);
  const isCreatingDistrict = actionKey === ACTION_CREATE_DISTRICT;
  const isEditingDistrict = actionKey === ACTION_EDIT_DISTRICT;
  const isPendingDelete = actionKey === ACTION_PEND_DISTRICT;

  return (
    <>
      {isCreatingDistrict && <FormDistrict />}

      <div className="grid grid-cols-1 gap-2">
        {districts.map((district, idx) => {
          const isThisIdx = actionIdx === idx;

          return (
            <Fragment key={district.id}>
              {isEditingDistrict && isThisIdx ? (
                <FormDistrict />
              ) : isPendingDelete && isThisIdx ? (
                <PendingDeleteDistrict districtId={district.id} />
              ) : (
                <DistrictItem key={idx} idx={idx} district={district} />
              )}
            </Fragment>
          );
        })}
      </div>
    </>
  );
}

export default DistrictList;
