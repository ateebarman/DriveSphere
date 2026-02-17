import { createSlice } from "@reduxjs/toolkit";

const bookingSlice = createSlice({
  name: "booking",
  initialState: {
    formData : null
  },
  reducers: {
    setFormData: (state, action) => {
      state.formData = action.payload;
    },
   
  }
});

export const { setFormData } = bookingSlice.actions;
export default bookingSlice.reducer;
