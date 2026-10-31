import { combineReducers } from '@reduxjs/toolkit';
import layout from './slice/layoutSlice';
import map from './slice/mapSlice';
import trip from './slice/tripSlice';

const createReducer = (asyncReducers) => (state, action) => {
  const combinedReducer = combineReducers({
    layout,
    map,
    trip,
    ...asyncReducers,
  });

  return combinedReducer(state, action);
};

export default createReducer;
