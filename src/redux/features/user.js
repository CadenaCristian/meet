import { createSlice } from "@reduxjs/toolkit";
const initPref = {
    userData: "",
    isAuth: false,
    joinMeeting: false,
};
const usersSlice = createSlice({
    name: "users",
    initialState: initPref,
    reducers: {
        updateUserNameData: (state, action) => {
            state.userData = action.payload;
        },
        changeAuthStatus: (state, action) => {
            state.isAuth = action.payload;
        },
        changeZoomStatus: (state, action) => {
            state.joinMeeting = action.payload;
        },
    },
});
export const { updateUserNameData, changeAuthStatus, changeZoomStatus } = usersSlice.actions;
export default usersSlice.reducer;
