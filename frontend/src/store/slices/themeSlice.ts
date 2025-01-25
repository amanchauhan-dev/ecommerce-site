import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import { RootState } from '../store'
import { setCookie, setCookieTheme } from '@/functions/FetchCookie'

// Define a type for the slice state
interface themeState {
    value: 'dark' | 'light'
}

// Define the initial state using that type
const initialState: themeState = {
    value: 'dark',
}

export const themeSlice = createSlice({
    name: 'theme',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        toggleTheme: (state) => {
            if (state.value == 'dark') {
                state.value = 'light'
                setCookieTheme('light')
            } else {
                state.value = 'dark'
                setCookieTheme('dark')
            }
        },
        setDarkTheme: (state) => {
            state.value = 'dark'
            setCookieTheme('dark')
        },
        setLightTheme: (state) => {
            state.value = 'light'
            setCookieTheme('light')
        },
        setTheme: (state, payload: PayloadAction<'dark' | 'light'>) => {
            state.value = payload.payload
            setCookieTheme(payload.payload)
        },
    },
})

export const { toggleTheme, setDarkTheme, setLightTheme, setTheme } = themeSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectTheme = (state: RootState) => state.theme.value

export default themeSlice.reducer