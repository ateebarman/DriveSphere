import { createSlice } from "@reduxjs/toolkit";

const carSlice = createSlice({
  name: "car",
  initialState: {
    location: "Mumbai",
    startDate:  new Date().toISOString(),
    dropDate:  new Date().toISOString()
  },
  reducers: {
    // actions
    setLocation: (state, action) => {
      state.location = action.payload;
    },
    setStartDateInStore: (state, action) => {
      state.startDate = action.payload;
    },
    setDropDateInStore: (state, action) => {
      state.dropDate = action.payload;
    },
  }
});

export const { setLocation, setStartDateInStore, setDropDateInStore } = carSlice.actions;
export default carSlice.reducer;
