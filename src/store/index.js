import { configureStore } from '@reduxjs/toolkit';
import createReducer from './rootSlice';
import { createLogger } from 'redux-logger';


/* if (import.meta.env.VITE_NODE_ENV === 'development' && import.meta.hot) {
  import.meta.hot.accept('./rootSlice', (newModule) => {
    const newRootSlice = newModule.default;
    store.replaceReducer(newRootSlice.createReducer());
  });
} */

const middlewares = [];

/* if (import.meta.env.VITE_NODE_ENV === 'development') {
  const logger = createLogger({
    collapsed: (getState, action, logEntry) => !logEntry.error,
  });
  middlewares.push(logger);
} */

const store = configureStore({
  reducer: createReducer(),
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      immutableCheck: false,
      serializableCheck: false,
    }).concat(middlewares),
  devTools: import.meta.env.VITE_NODE_ENV === 'development',
});

export default store;
