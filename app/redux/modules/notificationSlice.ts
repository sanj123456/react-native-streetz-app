import {createSlice} from '@reduxjs/toolkit';
import {NotificationListParams} from '../../types/paramsTypes';

interface NotificationState {
  notificationList: NotificationListParams[];
  notificationCount: number;
}

const initialState: NotificationState = {
  notificationList: [],
  notificationCount: 0,
};

export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotificationList: (state, action) => {
      state.notificationList = action?.payload;
    },
    setNotificationCount: (state, action) => {
      state.notificationCount = action?.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setNotificationList, setNotificationCount} =
  notificationSlice.actions;

export default notificationSlice.reducer;
