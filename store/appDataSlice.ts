import { IPageState } from '@/types';
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

const initialState: IPageState = {
    prices: [],
    globalPrice: {} as any
};

export const appDataSlice = createSlice({
    name: 'appDataSlice',
    initialState,
    reducers: {
        setAppData: (state, action: PayloadAction<IPageState>) => {
            state.globalPrice = action.payload.globalPrice;
            state.prices = action.payload.prices;
        }
    }
});

export const { setAppData } = appDataSlice.actions;

export default appDataSlice.reducer;
