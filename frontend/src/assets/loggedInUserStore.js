import { configureStore } from '@reduxjs/toolkit';
import loginReducer from "./loggedInUserSlice";
export default configureStore({
    reducer: {
        loggedInUser: loginReducer
    },
});