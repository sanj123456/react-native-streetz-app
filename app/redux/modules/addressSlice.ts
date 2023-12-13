import {createSlice} from '@reduxjs/toolkit';

interface AddressState {
  addressData: any[];
  selectedAddress: any;
  addressCalledFrom: string;
}

const initialState: AddressState = {
  addressData: [],
  selectedAddress: null,
  addressCalledFrom: '',
};

export const addressSlice = createSlice({
  name: 'address',
  initialState,
  reducers: {
    setAddressData: (state, action) => {
      state.addressData = action?.payload;
    },
    setUpdatedAddressData: (state, action) => {
      const updatedAddressData = state.addressData.map(val => {
        if (val.id === action.payload.id) {
          return action.payload;
        } else {
          return val;
        }
      });
      state.addressData = updatedAddressData;
    },
    setRemoveAddressData: (state, action) => {
      const updatedAddressData = state.addressData.filter(val => {
        return val.id !== action?.payload?.id;
      });
      state.addressData = updatedAddressData;
    },
    setSelectedAddress: (state, action) => {
      state.selectedAddress = action.payload;
    },
    setAddressCalledFrom: (state, action) => {
      state.addressCalledFrom = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setAddressData,
  setUpdatedAddressData,
  setRemoveAddressData,
  setSelectedAddress,
  setAddressCalledFrom,
} = addressSlice.actions;

export default addressSlice.reducer;
