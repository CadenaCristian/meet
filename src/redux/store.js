import { configureStore } from "@reduxjs/toolkit";
import usersSlice from "./features/user";
const store = configureStore({
    reducer: {
        userdata: usersSlice,
    },
});
export default store;
