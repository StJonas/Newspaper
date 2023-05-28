import { createSlice } from '@reduxjs/toolkit'

const loggedInUserSlice = createSlice({
    name: 'loggedInUser',
    initialState: {
        id: null,
        username: null,
    },
    reducers: {
        login: (state, action) => {
            state.id = action.payload.id;
            state.username = action.payload.username;
        },
    }
})

export const { login } = loggedInUserSlice.actions;

export default loggedInUserSlice.reducer;