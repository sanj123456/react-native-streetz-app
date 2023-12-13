import {createSlice} from '@reduxjs/toolkit';
import {PaymentItemParams} from '../../types/paramsTypes';

interface CartState {
  myCart: {
    items: {
      id: number;
      user_id: number;
      product_id: number;
      coupon_code_id: any;
      product_variation_combination_id: any;
      price: any;
      discounted_price: any;
      quantity: number;
      total_price: any;
      status: number;
      product: {
        id: number;
        product_image: string;
        thumbnail: any;
        product_name: string;
        slug: string;
        price: any;
        discount: number;
        discounted_price: any;
        is_favourite: any;
        status: string;
        thumbnail_url: any;
      };
      product_variation_combination: any;
      coupon_code: any;
    }[];
    totalPrice: {
      total: number | string;
      discount_applicable_price: number | string;
      discount: number | string;
      discounted_price: number | string;
      final_price: number | string;
      discount_type: any;
      coupon_code_id: number | string;
      coupon_code: number | string;
      referral_code: any;
      delivery_fee: number | string;
      connivance_fee: number | string;
      type: any;
      calculate_delivery_fee: number | string;
      is_gift: string;
      gift_wrapping_fee: string | number;
    };
    prevPaymentMode: PaymentItemParams | null;
    seller_store_address_id: any;
    seller_store_name: string;
    category_id: any;
    seller_store_address_name: string;
  };
  isDeliveryAvailable: boolean;
  payMode: {
    enum: string;
    id: number;
    img: string;
    key: string;
    label: string;
    value: boolean;
  } | null;
  deliveryTime: {
    type: number;
    date?: string;
    delivery_time_slot_id?: number;
    time?: string;
    dateObj?: string;
  };
}

const initialState: CartState = {
  myCart: {
    items: [],
    totalPrice: {
      total: 0,
      discount_applicable_price: 0,
      discount: 0,
      discounted_price: 0,
      final_price: 0,
      discount_type: null,
      coupon_code_id: 0,
      coupon_code: 0,
      delivery_fee: 0,
      connivance_fee: 0,
      type: null,
      calculate_delivery_fee: 0,
      is_gift: 'no',
      gift_wrapping_fee: 0,
      referral_code: null,
    },
    seller_store_address_id: null,
    seller_store_name: '',
    category_id: null,
    seller_store_address_name: '',
    prevPaymentMode: null,
  },
  isDeliveryAvailable: true,
  payMode: null,
  deliveryTime: {
    type: 0,
  },
};

export const cartSlice = createSlice({
  name: 'generic',
  initialState,
  reducers: {
    setMyCart: (state, action) => {
      state.myCart = action?.payload;
    },
    setIsDeliveryAvailable: (state, action) => {
      state.isDeliveryAvailable = action?.payload;
    },
    setPayMode: (state, action) => {
      state.payMode = action?.payload;
    },
    setDeliveryTime: (state, action) => {
      state.deliveryTime = action?.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setMyCart, setIsDeliveryAvailable, setPayMode, setDeliveryTime} =
  cartSlice.actions;

export default cartSlice.reducer;
