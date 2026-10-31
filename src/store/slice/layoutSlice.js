import { createSlice } from '@reduxjs/toolkit';
import { TAB_ITINERARY } from 'app/costants/activeTabs';

export const selectActiveTab = (state) => state.layout.activeTab;
export const selectPresentationMode = (state) => state.layout.presentationMode;
export const selectSelectedDayNum = (state) => state.layout.selectedDayNum;
export const selectDayItinerary = (state) => state.layout.dayItinerary;

export const selectRpActionKey = (state) => state.layout.rightPanel.actionKey;
export const selectRpActionIdx = (state) => state.layout.rightPanel.actionIdx;
export const selectRpActionData = (state) => state.layout.rightPanel.actionData;

export const selectIsSelectingLocation = (state) => state.layout.isSelectingLocation;
export const selectLocationData = (state) => state.layout.locationData;

export const selectUserSelectedMapItem = (state) => state.layout.userSelectedMapItem;

const emptyItinerary = {
  day: 1,
  date: '',
  title: 'Day 1',
  summary: '',
  stops: [],
};

const initialState = {
  activeTab: TAB_ITINERARY, // TAB_ITINERARY, TAB_DISTRICTS, TAB_ROUTING
  presentationMode: false,
  selectedDayNum: 1,
  dayItinerary: emptyItinerary,

  rightPanel: {
    actionKey: null,
    actionIdx: null,
    actionData: null,
  },

  isSelectingLocation: false,
  locationData: null,

  userSelectedMapItem: null,
};

export const layoutSlice = createSlice({
  name: 'layout',
  initialState,
  reducers: {
    setActiveTab: (state, { payload }) => {
      state.activeTab = payload;
    },
    setPresentationMode: (state, { payload }) => {
      state.presentationMode = payload;
    },
    setSelectedDayNum: (state, { payload }) => {
      state.selectedDayNum = payload;
    },
    setDayItinerary: (state, { payload }) => {
      state.dayItinerary = payload;
    },
    resetDayItinerary: (state, { payload }) => {
      state.dayItinerary = emptyItinerary;
    },

    setRpAction: (state, { payload }) => {
      console.log("setRpAction")
      const { key, idx, data } = payload;
      state.rightPanel.actionKey = key;
      state.rightPanel.actionIdx = idx;
      state.rightPanel.actionData = data;
    },
    resetRpAction: (state, { payload }) => {
      console.log("resetRpAction")
      state.rightPanel.actionKey = null;
      state.rightPanel.actionIdx = null;
      state.rightPanel.actionData = null;
    },
    setRpActionKey: (state, { payload }) => {
      state.rightPanel.actionKey = payload;
    },
    setRpActionIdx: (state, { payload }) => {
      console.log("setRpActionIdx")
      state.rightPanel.actionIdx = payload;
    },
    setRpActionData: (state, { payload }) => {
      state.rightPanel.actionData = payload;
    },
    updateRpActionData: (state, { payload }) => {
      for (const { field, value } of payload) {
        state.rightPanel.actionData[field] = value;
      }
    },

    setIsSelectingLocation: (state, { payload }) => {
      state.isSelectingLocation = payload;
      state.locationData = {}
    },
    setIsLocationData: (state, { payload }) => {
      for (const { field, value } of payload) {
        state.locationData[field] = value;
      }
    },

    setUserSelectedMapItem: (state, { payload }) => {
      state.userSelectedMapItem = payload;
    },
  },
});

export const {
  setActiveTab,
  setPresentationMode,
  setSelectedDayNum,
  setDayItinerary,
  resetDayItinerary,

  setRpAction,
  resetRpAction,
  setRpActionKey,
  setRpActionIdx,
  setRpActionData,
  updateRpActionData,

  setIsSelectingLocation,
  setIsLocationData,
  setUserSelectedMapItem,
} = layoutSlice.actions;

export default layoutSlice.reducer;
