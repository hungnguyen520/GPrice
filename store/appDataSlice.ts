import { DomesticPrice, GlobalPrice, IPageData } from '@/types'
import { createSlice } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'

const initialState: IPageData = {
    domesticPrice: undefined,
    globalPrice: undefined
}

export const appDataSlice = createSlice({
    name: 'appDataSlice',
    initialState,
    reducers: {
        setGlobalPrice: (state, action: PayloadAction<GlobalPrice>) => {
            state.globalPrice = action.payload
        },
        setDomesticPrice: (state, action: PayloadAction<DomesticPrice>) => {
            if (!state.domesticPrice) {
                state.domesticPrice = action.payload
            } else {
                state.domesticPrice = {
                    ...state.domesticPrice,
                    ...action.payload
                }
            }
        },
        clearData: (state) => {
            state.domesticPrice = undefined
            state.globalPrice = undefined
        }
    }
})

export const { setGlobalPrice, setDomesticPrice, clearData } =
    appDataSlice.actions

export default appDataSlice.reducer
