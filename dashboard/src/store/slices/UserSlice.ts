import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import type { RootState } from '../reduxStore'


export interface User {
    id: number,
    fname: string,
    lname: string,
    email: string;
    avatar?: string;
    phone_number: number | null,
    is_email_verified?: boolean,
    role?: "admin" | 'employee',
    status?: 'active' | 'inactive',
    created_at?: Date | null,
    updated_at?: Date | null
}
// Define a type for the slice state
interface UserState {
    user: User,
    role: "admin" | 'employee';
}





// Define the initial state using that type
const initialState: UserState = {
    user: {
        id: 1,
        fname: '',
        lname: '',
        email: '',
        avatar: '',
        phone_number: null,
        is_email_verified: false,
        created_at: null,
        updated_at: null
    },
    role: 'employee',
}

export const UserSlice = createSlice({
    name: 'User',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        setToken: (state, payload: PayloadAction<string>) => {
            let date = new Date()
            date.setDate(date.getTime() + 7 * 24 * 60 * 60 * 1000);
            document.cookie = `token=${payload.payload}; expires=${date.toUTCString()}; path=/; SameSite=Strict`;
            sessionStorage.setItem("token", payload.payload);
        },
        getToken: () => {
            let token;
            document.cookie.split(';').forEach((e) => {
                let regex = new RegExp(/token/g)
                if (e.match(regex)) {
                    token = e.split('=')[1].trim()
                } else {
                    token = ''
                }
            })

            return token
        },
        setMyDetails: (state, payload: PayloadAction<User>) => {
            state.user.id = payload.payload.id
            state.user.fname = payload.payload.fname
            state.user.lname = payload.payload.lname
            state.user.email = payload.payload.email
            state.user.avatar = payload.payload.avatar
            state.user.phone_number = payload.payload.phone_number
            state.user.created_at = payload.payload.created_at
            state.user.updated_at = payload.payload.updated_at
            state.user.role = payload.payload.role
            state.user.status = payload.payload.status
            state.user.is_email_verified = payload.payload.is_email_verified
            if (payload.payload.role == 'admin' || payload.payload.role == 'employee') {
                state.role = payload.payload.role
            }
        }
    },
})

export const { setToken, setMyDetails, getToken } = UserSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectUser = (state: RootState) => state.User.user

export default UserSlice.reducer