import { createSlice } from "@reduxjs/toolkit";
const initPref = {
    userData: "",
    isAuth: false,
    joinMeeting: false,
    rol: ""
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
        updateRol: (state, action) => {
            state.rol = action.payload;
        }
    },
});
export const { updateUserNameData, changeAuthStatus, changeZoomStatus, updateRol } = usersSlice.actions;
export default usersSlice.reducer;
