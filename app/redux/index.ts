import {configureStore} from '@reduxjs/toolkit';
import genericSlice from './modules/genericSlice';
import profileSlice from './modules/profileSlice';
import homeSlice from './modules/homeSlice';
import wishlistSlice from './modules/wishlistSlice';
import cartSlice from './modules/cartSlice';
import addressSlice from './modules/addressSlice';
import orderSlice from './modules/orderSlice';
import notificationSlice from './modules/notificationSlice';

const store = configureStore({
  reducer: {
    generic: genericSlice,
    profile: profileSlice,
    home: homeSlice,
    wishlist: wishlistSlice,
    cart: cartSlice,
    address: addressSlice,
    order: orderSlice,
    notification: notificationSlice,
  },
});
const dispatch = store.dispatch;
const getStore = store.getState;
const getWishList = store.getState;

export {dispatch, getStore, getWishList};

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

export default store;
