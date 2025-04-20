import { IPageData } from '@/types'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

const initialState: IPageData = {
    domesticPrice: {} as any,
    globalPrice: {} as any
}

export const appDataSlice = createSlice({
    name: 'appDataSlice',
    initialState,
    reducers: {
        setAppData: (state, action: PayloadAction<IPageData>) => {
            state.globalPrice = action.payload.globalPrice
            state.domesticPrice = action.payload.domesticPrice
        }
    }
})

export const { setAppData } = appDataSlice.actions

export default appDataSlice.reducer
