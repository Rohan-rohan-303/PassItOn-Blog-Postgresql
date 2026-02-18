import { type PayloadAction } from '@reduxjs/toolkit';
export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    role: 'admin' | 'user';
    bio?: string;
    created_at?: string;
}
export interface UserState {
    isLoggedIn: boolean;
    user: User | null;
}
export declare const userSlice: import("@reduxjs/toolkit").Slice<UserState, {
    setUser: (state: {
        isLoggedIn: boolean;
        user: {
            id: number;
            name: string;
            email: string;
            avatar?: string | undefined;
            role: "admin" | "user";
            bio?: string | undefined;
            created_at?: string | undefined;
        } | null;
    }, action: PayloadAction<User>) => void;
    removeUser: (state: {
        isLoggedIn: boolean;
        user: {
            id: number;
            name: string;
            email: string;
            avatar?: string | undefined;
            role: "admin" | "user";
            bio?: string | undefined;
            created_at?: string | undefined;
        } | null;
    }) => void;
}, "user", "user", import("@reduxjs/toolkit").SliceSelectors<UserState>>;
export declare const setUser: import("@reduxjs/toolkit").ActionCreatorWithPayload<User, "user/setUser">, removeUser: import("@reduxjs/toolkit").ActionCreatorWithoutPayload<"user/removeUser">;
declare const _default: import("redux").Reducer<UserState>;
export default _default;
//# sourceMappingURL=user.slice.d.ts.map