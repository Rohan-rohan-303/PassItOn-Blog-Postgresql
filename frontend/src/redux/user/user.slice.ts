import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    role: 'admin' | 'user';
    bio?: string;
    created_at?: string;
}

interface UserState {
    isLoggedIn: boolean;
    user: User | null;
}

const initialState: UserState = {
    isLoggedIn: false,
    user: null,
};

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (state, action: PayloadAction<User>) => {
            state.isLoggedIn = true;
            state.user = action.payload;
        },
        removeUser: (state) => {
            state.isLoggedIn = false;
            state.user = null;
        }
    },
});

export const { setUser, removeUser } = userSlice.actions;
export default userSlice.reducer;