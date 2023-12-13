import {createSlice} from '@reduxjs/toolkit';

interface HomeState {
  homeData: any;
  storeData: any;
  brandStoreList: any;
  storeDetailData: any;
  productDetails: any;
  productReview: any;
  filterList: any[];
  storeFilterList: any[];
  sortList: any[];
  recentlyViewed: number[];
  couponCodeList: any;
  SearchStoreData: any;
  SearchProductData: any;
  DeliveryTimeSlotData: any;
  SubCategoryListByCategoryData: any;
  allSubCategoryData: any;
  onBoardingData: any;
  categoryWithSubCategory: any;
  selectedBannerCategoryId: any;
  CategoryIdStore: any;
}

const initialState: HomeState = {
  homeData: {
    category_list: [],
    recently_viewed_product_list: [],
    trending_store_list: [],
  },
  storeData: {
    recommended_store_list: [],
    store_list: {},
  },
  brandStoreList: {
    recommended_store_list: [],
    store_list: {},
  },
  storeDetailData: null,
  productDetails: null,
  productReview: null,
  filterList: [],
  sortList: [],
  storeFilterList: [],
  recentlyViewed: [],
  couponCodeList: null,
  SearchStoreData: null,
  SearchProductData: null,
  DeliveryTimeSlotData: null,
  SubCategoryListByCategoryData: null,
  allSubCategoryData: null,
  onBoardingData: [],
  categoryWithSubCategory: [],
  selectedBannerCategoryId: null,
  CategoryIdStore: null,
};

export const homeSlice = createSlice({
  name: 'home',
  initialState,
  reducers: {
    setHomeData: (state, action) => {
      state.homeData = action?.payload;
    },
    setStoreData: (state, action) => {
      state.storeData = action?.payload;
    },
    setBrandStoreList: (state, action) => {
      state.brandStoreList = action?.payload;
    },
    setStoreDetail: (state, action) => {
      state.storeDetailData = action?.payload;
    },
    setProductDetails: (state, action) => {
      state.productDetails = action?.payload;
    },
    setProductReview: (state, action) => {
      state.productReview = action?.payload;
    },
    setFilterList: (state, action) => {
      state.filterList = action?.payload;
    },
    setStoreFilterList: (state, action) => {
      state.storeFilterList = action?.payload;
    },
    setSortList: (state, action) => {
      state.sortList = action?.payload;
    },
    _removeWishListItem: (state, action) => {
      let index = state.storeDetailData.product_list.data.findIndex(
        (i: any) => i.id === action.payload.product_id,
      );
      state.storeDetailData.product_list.data[index].is_favourite = 0;
    },
    _addWishListItem: (state, action) => {
      let index = state.storeDetailData.product_list.data.findIndex(
        (i: any) => i.id === action.payload.product_id,
      );
      state.storeDetailData.product_list.data[index].is_favourite = 1;
    },
    setRecentlyViewed: (state, action) => {
      state.recentlyViewed = action?.payload;
    },
    setCouponCodeList: (state, action) => {
      state.couponCodeList = action?.payload;
    },
    setSearchStoreData: (state, action) => {
      state.SearchStoreData = action?.payload;
    },
    setSearchProductData: (state, action) => {
      state.SearchProductData = action?.payload;
    },
    setDeliveryTimeSlotData: (state, action) => {
      state.DeliveryTimeSlotData = action?.payload;
    },
    setSubCategoryLisCategoryData: (state, action) => {
      state.SubCategoryListByCategoryData = action?.payload;
    },
    setAppendSubCategoryData: (state, action) => {
      if (action.payload === null) {
        const newArray = state.SubCategoryListByCategoryData?.filter(
          (ele: any) => ele.type !== 'subCategory',
        );
        state.SubCategoryListByCategoryData = newArray;
      } else {
        const flag = state.SubCategoryListByCategoryData.find(
          (ele: any) => ele.type === 'subCategory',
        );
        if (flag) {
          const newArray = state.SubCategoryListByCategoryData?.filter(
            (ele: any) => ele.type !== 'subCategory',
          );
          const oldArray: any = [];
          state.SubCategoryListByCategoryData?.map((ele: any) => {
            if (ele.type === 'subCategory') {
              ele.option_list.map((ele: any) => {
                if (ele.isSelected) {
                  oldArray.push(ele);
                }
              });
            }
          });
          const newOptionList = action?.payload.option_list.map((ele: any) => {
            const foundItem = oldArray.find(
              (item: any) => item.id === ele.id && item.isSelected,
            );
            if (foundItem) {
              return {
                ...ele,
                isSelected: true,
              };
            } else {
              return ele;
            }
          });
          const newObj = {
            ...action?.payload,
            option_list: newOptionList,
          };
          state.SubCategoryListByCategoryData = [...newArray, newObj];
        } else {
          state.SubCategoryListByCategoryData = [
            ...state.SubCategoryListByCategoryData,
            action.payload,
          ];
        }
      }
    },
    setAllSubCategoryData: (state, action) => {
      state.allSubCategoryData = action?.payload;
    },
    setOnboardingData: (state, action) => {
      state.onBoardingData = action.payload;
    },
    setCategoryWithSubCategory: (state, action) => {
      state.categoryWithSubCategory = action.payload;
    },
    setBannerCategoryId: (state, action) => {
      state.selectedBannerCategoryId = action.payload;
    },
    setOtherCategoryId: (state, action) => {
      state.CategoryIdStore = action.payload;
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  setHomeData,
  setStoreData,
  setStoreDetail,
  setProductDetails,
  setProductReview,
  setFilterList,
  setSortList,
  setStoreFilterList,
  _removeWishListItem,
  _addWishListItem,
  setRecentlyViewed,
  setCouponCodeList,
  setSearchStoreData,
  setSearchProductData,
  setDeliveryTimeSlotData,
  setSubCategoryLisCategoryData,
  setAppendSubCategoryData,
  setAllSubCategoryData,
  setOnboardingData,
  setCategoryWithSubCategory,
  setBrandStoreList,
  setBannerCategoryId,
  setOtherCategoryId,
} = homeSlice.actions;

export default homeSlice.reducer;
