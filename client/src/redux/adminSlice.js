import {createSlice} from "@reduxjs/toolkit";

const userSlice = createSlice({
    name:"admin",
    initialState:{
      clickedOption : null
    },
    reducers:{
        // actions
        setClickedOption:(state,action)=>{
            state.clickedOption = action.payload;
        },
        
    }
});
export const {setClickedOption} = userSlice.actions;
export default userSlice.reducer;