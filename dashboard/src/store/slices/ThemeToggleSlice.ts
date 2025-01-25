import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../reduxStore'
import { fetchCookieTheme } from '@/functions/GetCookie'

// Define a type for the slice state
interface ThemeState {
    value: "dark" | 'light'
}

// Define the initial state using that type
const initialState: ThemeState = {
    value: fetchCookieTheme() 
}

export const ThemeSlice = createSlice({
    name: 'Theme',
    // `createSlice` will infer the state type from the `initialState` argument
    initialState,
    reducers: {
        toggleTheme: (state) => {
            let date = new Date()
            date.setDate(date.getTime() + 7 * 24 * 60 * 60 * 1000);
            date.setHours(date.getHours() + 1);
            if (state.value == 'dark') {
                state.value = 'light'
                document.cookie = `theme=${state.value}; expires=${date.toUTCString()}; path=/`;
            } else {
                state.value = 'dark'
                console.log('state', state.value);
                document.cookie = `theme=${state.value}; expires=${date.toUTCString()}; path=/`;
            }

        }
    },
})

export const { toggleTheme } = ThemeSlice.actions

// Other code such as selectors can use the imported `RootState` type
export const selectValue = (state: RootState) => state.Theme.value

export default ThemeSlice.reducer