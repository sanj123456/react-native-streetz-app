import {createSlice} from '@reduxjs/toolkit';

interface WishState {
  wishListData: any;
}

const initialState: WishState = {
  wishListData: {
    data: [],
    total: 0,
  },
};

export const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {
    setWishList: (state, action) => {
      state.wishListData = action?.payload;
    },
    removeWishListItem: (state, action) => {
      let index = state.wishListData.data.findIndex(
        (i: any) => i.product_id === action.payload.product_id,
      );

      state.wishListData.data.splice(index, 1);
    },
  },
});

// Action creators are generated for each case reducer function
export const {setWishList, removeWishListItem} = wishlistSlice.actions;

export default wishlistSlice.reducer;
