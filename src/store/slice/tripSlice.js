import { createSlice } from '@reduxjs/toolkit';

export const selectTripTitle = (state) => state.trip.tripTitle;
export const selectItinerary = (state) => state.trip.itinerary;
export const selectDistricts = (state) => state.trip.districts;
export const selectStats = (state) => state.trip.stats;

const initialState = {
  tripTitle: localStorage.getItem('trip_title') ?? 'Trip',

  itinerary: JSON.parse(localStorage.getItem('trip_itinerary')) ?? [],

  districts: JSON.parse(localStorage.getItem('trip_districts')) ?? [],

  stats: {
    totalCost: 0,
    totalStops: 0,
    daysCount: 0,
  },
};

export const tripSlice = createSlice({
  name: 'trip',
  initialState,
  reducers: {
    setTripTitle: (state, { payload }) => {
      state.tripTitle = payload;
      localStorage.setItem('trip_title', payload);
    },

    setItinerary: (state, { payload }) => {
      state.itinerary = payload;
      localStorage.setItem('trip_itinerary', JSON.stringify(payload));
    },
    addDayToItinerary: (state, { payload }) => {
      state.itinerary = [...state.itinerary, payload];
      localStorage.setItem('trip_itinerary', JSON.stringify(state.itinerary));
    },
    deleteDayToItinerary: (state, { payload }) => {
      if (state.itinerary.length <= 1) {
        return;
      }

      state.itinerary = state.itinerary.filter((d) => d.day !== payload).map((d, idx) => ({ ...d, day: idx + 1 }));

      localStorage.setItem('trip_itinerary', JSON.stringify(state.itinerary));
    },
    updateDayInfo: (state, { payload }) => {
      const { selectedDayNum, field, value } = payload;

      const day = state.itinerary.find((d) => d.day === selectedDayNum);
      if (day) {
        day[field] = value;

        localStorage.setItem('trip_itinerary', JSON.stringify(state.itinerary));
      }
    },
    updateStoptoItinerary: (state, { payload }) => {
      const { selectedDayNum, actionData } = payload;

      const day = state.itinerary.find((d) => d.day === selectedDayNum);
      if (day) {
        const exists = day.stops.some((s) => s.id === actionData.id);
        if (exists) {
          day.stops = day.stops.map((s) => (s.id === actionData.id ? actionData : s));
        } else {
          day.stops.push(actionData);
        }

        localStorage.setItem('trip_itinerary', JSON.stringify(state.itinerary));
      }
    },
    updateRouteToStop: (state, { payload }) => {
      const { selectedDayNum, stopId } = payload;
      const { mode, description, timeMin, route, indications, color } = payload;

      const day = state.itinerary.find((d) => d.day === selectedDayNum);
      if (day) {
        const exists = day.stops.some((s) => s.id === stopId);
        if (exists) {
          day.stops = day.stops.map((s) =>
            s.id === stopId
              ? {
                  ...s,
                  travelToNext: {
                    mode,
                    description,
                    timeMin,
                    route,
                    indications,
                    color,
                  },
                }
              : s
          );
        }

        localStorage.setItem('trip_itinerary', JSON.stringify(state.itinerary));
      }
    },
    deleteRouteToStop: (state, { payload }) => {
      const { selectedDayNum, stopId } = payload;

      const day = state.itinerary.find((d) => d.day === selectedDayNum);
      if (day) {
        const exists = day.stops.some((s) => s.id === stopId);
        if (exists) {
          day.stops = day.stops.map((s) =>
            s.id === stopId
              ? {
                  ...s,
                  travelToNext: null,
                }
              : s
          );
          localStorage.setItem('trip_itinerary', JSON.stringify(state.itinerary));
        }
      }
    },
    deleteStopToItinerary: (state, { payload }) => {
      const { selectedDayNum, stopId } = payload;

      const day = state.itinerary.find((d) => d.day === selectedDayNum);
      if (day) {
        const index = day.stops.findIndex((s) => s.id === stopId);

        if (index !== -1) {
          if (index > 0) {
            day.stops[index - 1].travelToNext = null;
          }

          day.stops = day.stops.filter((s) => s.id !== stopId);
        }

        localStorage.setItem('trip_itinerary', JSON.stringify(state.itinerary));
      }
    },
    reorderStops: (state, { payload }) => {
      const { selectedDayNum, sourceIndex, destinationIndex } = payload;

      const day = state.itinerary.find((d) => d.day === selectedDayNum);
      if (day && day.stops) {
        const [movedStop] = day.stops.splice(sourceIndex, 1);
        day.stops.splice(destinationIndex, 0, movedStop);

        // A. The moved stop itself
        day.stops[destinationIndex].travelToNext = null;
        // B. The stop preceding the moved stop in its NEW position
        if (destinationIndex > 0) {
          day.stops[destinationIndex - 1].travelToNext = null;
        }
        // C. The stop preceding the moved stop in its OLD position
        if (sourceIndex > 0) {
          if (destinationIndex < sourceIndex) {
            day.stops[sourceIndex].travelToNext = null;
          } else {
            day.stops[sourceIndex - 1].travelToNext = null;
          }
        }

        localStorage.setItem('trip_itinerary', JSON.stringify(state.itinerary));
      }
    },

    setDistricts: (state, { payload }) => {
      state.districts = payload;
      localStorage.setItem('trip_districts', JSON.stringify(payload));
    },
    updateDistrict: (state, { payload }) => {
      const { actionData } = payload;

      const exists = state.districts.some((s) => s.id === actionData.id);
      if (exists) {
        state.districts = state.districts.map((s) => (s.id === actionData.id ? actionData : s));
      } else {
        state.districts.push(actionData);
      }

      localStorage.setItem('trip_districts', JSON.stringify(state.districts));
    },
    deleteDistrict: (state, { payload }) => {
      const { districtId } = payload;

      const index = state.districts.findIndex((s) => s.id === districtId);
      if (index !== -1) {
        state.districts = state.districts.filter((s) => s.id !== districtId);

        localStorage.setItem('trip_districts', JSON.stringify(state.districts));
      }
    },

    setStats: (state, { payload }) => {
      state.stats = payload;
    },
    updateStats: (state) => {
      let totalCost = 0;
      let totalStops = 0;
      let totalDistricts = 0;

      state.itinerary.forEach((d) => {
        d.stops.forEach((s) => {
          totalCost += s.cost || 0;
          totalStops++;
        });
      });

      state.stats = {
        totalCost,
        totalStops,
        totalDistricts: state.districts.length,
        daysCount: state.itinerary.length,
      };
    },
  },
});

export const {
  setTripTitle,

  setItinerary,
  addDayToItinerary,
  deleteDayToItinerary,
  updateDayInfo,
  updateStoptoItinerary,
  updateRouteToStop,
  deleteRouteToStop,
  deleteStopToItinerary,
  reorderStops,

  setDistricts,
  updateDistrict,
  deleteDistrict,

  setStats,
  updateStats,
} = tripSlice.actions;

export default tripSlice.reducer;
