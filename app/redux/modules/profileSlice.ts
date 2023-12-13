import {createSlice} from '@reduxjs/toolkit';

interface ProfileState {
  profileData: any;
  userType: 'guest' | 'registered';
}

const initialState: ProfileState = {
  profileData: null,
  userType: 'guest',
};

export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    setProfileData: (state, action) => {
      state.profileData = action?.payload;
    },
    setUserType: (state, action) => {
      state.userType = action?.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {setProfileData, setUserType} = profileSlice.actions;

export default profileSlice.reducer;
