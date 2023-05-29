import { createSlice } from '@reduxjs/toolkit'

const loggedInUserSlice = createSlice({
    name: 'loggedInUser',
    initialState: {
        id: null,
        username: "logged in user",
        isJournalist: false,
    },
    reducers: {
        login: (state, action) => {
            state.id = action.payload.id;
            state.username = action.payload.username;
            state.isJournalist = action.payload.isJournalist;
        },
    }
})

export const { login } = loggedInUserSlice.actions;

export default loggedInUserSlice.reducer;