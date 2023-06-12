import { createSlice } from '@reduxjs/toolkit'

const loggedInUserSlice = createSlice({
    name: 'loggedInUser',
    initialState: {
        user_id: null,
        username: "logged in user",
        isJournalist: false,
    },
    reducers: {
        login: (state, action) => {
            state.user_id = action.payload.user_id;
            state.username = action.payload.username;
            state.isJournalist = action.payload.isJournalist;
        },
    }
})

export const { login } = loggedInUserSlice.actions;

export default loggedInUserSlice.reducer;