import {createSlice} from '@reduxjs/toolkit';
import {PaymentItemParams} from '../../types/paramsTypes';

interface OrderState {
  orderHistory: {
    total: number;
    data: any[];
  };
  upcomingOrders: {
    total: number;
    data: any[];
  };
  orderDetails: any;
  showRatingModal: boolean;
  ratingOrderID: any;
  paymentModes: PaymentItemParams[];
}

const initialState: OrderState = {
  orderHistory: {
    total: 0,
    data: [],
  },
  upcomingOrders: {
    total: 0,
    data: [],
  },
  orderDetails: null,
  showRatingModal: false,
  ratingOrderID: null,
  paymentModes: [],
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrderHistory: (state, action) => {
      state.orderHistory = action?.payload;
    },
    setUpcomingOrders: (state, action) => {
      state.upcomingOrders = action?.payload;
    },
    setOrderDetails: (state, action) => {
      state.orderDetails = action?.payload;
    },
    setShowRatingModal: (state, action) => {
      state.showRatingModal = action?.payload;
    },
    setRatingOrderID: (state, action) => {
      state.ratingOrderID = action?.payload;
    },
    setPaymentModes: (state, action) => {
      state.paymentModes = action?.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setOrderHistory,
  setUpcomingOrders,
  setOrderDetails,
  setShowRatingModal,
  setRatingOrderID,
  setPaymentModes,
} = orderSlice.actions;

export default orderSlice.reducer;
