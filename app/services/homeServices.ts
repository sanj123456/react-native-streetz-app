import {
  consoleHere,
  constants,
  errorToast,
  screenName,
  successToast,
} from '../core';
import {dispatch, getStore} from '../redux';
import {setIsLoading, setLoader} from '../redux/modules/genericSlice';
import {
  setBrandStoreList,
  setCategoryWithSubCategory,
  setFilterList,
  setHomeData,
  setOnboardingData,
  setProductDetails,
  setProductReview,
  setRecentlyViewed,
  setSearchProductData,
  setSearchStoreData,
  setStoreData,
  setStoreDetail,
} from '../redux/modules/homeSlice';
import {LoadingParams} from '../types/paramsTypes';
import {setAsyncData} from './asyncServices';
import {get, post} from './request';
import {getCurrentRoute} from '../navigation/RootNavigation';

export const homeAPI = async (payload: any) => {
  const userType = getStore().profile.userType;
  const recently_viewed_product_id = getStore()?.home?.recentlyViewed;
  const category_list = getStore()?.home?.homeData?.category_list;
  const showLoader = !category_list || category_list?.length === 0;
  showLoader && dispatch(setIsLoading(true));
  return post(constants.endPtHome, {
    ...payload,
    recently_viewed_product_id,
  })
    .then(async res => {
      dispatch(setIsLoading(false));
      dispatch(setFilterList([]));
      dispatch(setStoreDetail(null));
      if (res?.status === constants.apiSuccess) {
        dispatch(setHomeData(res?.data));
        if (userType === 'registered') {
          dispatch(setRecentlyViewed([]));
          setAsyncData(constants.asyncRecentlyViewed, []);
        }
        return true;
      } else {
        errorToast(res?.message);
        return false;
      }
    })
    .catch(e => {
      consoleHere({e});
      dispatch(setIsLoading(false));
      return false;
    });
};

export const storeAPI = async (payload: any, loadingType?: LoadingParams) => {
  const store_list = getStore().home?.storeData?.store_list;
  const brandStoreListData = getStore().home?.brandStoreList?.store_list;
  if (getCurrentRoute() === screenName.tabStore) {
    const showLoader =
      !loadingType && (!store_list?.data || store_list?.data?.length === 0);
    showLoader && dispatch(setLoader({isLoading: true, loadingType}));
  } else {
    dispatch(setLoader({isLoading: true, loadingType}));
  }
  post(constants.endPtStore, payload)
    .then(async res => {
      // consoleHere({SToreDataABCD: JSON.stringify(res.data)});
      if (res?.status === constants.apiSuccess) {
        if (getCurrentRoute() === screenName.brandStoreList) {
          if (loadingType === 'loading_more') {
            const newData = {
              ...res?.data,
              store_list: {
                ...res?.data?.store_list,
                data: [
                  ...brandStoreListData?.data,
                  ...res?.data?.store_list?.data,
                ],
              },
            };
            dispatch(setBrandStoreList(newData));
          } else {
            dispatch(setBrandStoreList(res?.data));
          }
        } else {
          if (loadingType === 'loading_more') {
            const newData = {
              ...res?.data,
              store_list: {
                ...res?.data?.store_list,
                data: [...store_list?.data, ...res?.data?.store_list?.data],
              },
            };
            dispatch(setStoreData(newData));
          } else {
            consoleHere({ABCD: 'test'});
            dispatch(setStoreData(res?.data));
          }
        }
      } else {
        errorToast(res?.message);
        !loadingType &&
          dispatch(
            setStoreData({
              recommended_store_list: [],
              store_list: {},
            }),
          );

        dispatch(
          setBrandStoreList({
            recommended_store_list: [],
            store_list: {},
          }),
        );
      }
      dispatch(setLoader({isLoading: false, loadingType}));
    })
    .catch(e => {
      consoleHere({e});
      dispatch(setLoader({isLoading: false, loadingType}));
    });
};

export const storeDetailsAPI = async (
  payload: any,
  loadingType?: LoadingParams,
) => {
  dispatch(setLoader({isLoading: true, loadingType}));
  post(constants.endPtStoreDetail, payload)
    .then(async res => {
      if (res?.status === constants.apiSuccess) {
        if (loadingType === 'loading_more') {
          const product_list = getStore().home?.storeDetailData?.product_list;
          const newData = {
            ...res?.data,
            product_list: {
              ...res?.data?.product_list,
              data: [...product_list?.data, ...res?.data?.product_list?.data],
            },
          };
          dispatch(setStoreDetail(newData));
        } else {
          if (
            payload?.subCategoryIdArr &&
            payload?.subCategoryIdArr?.length > 0
          ) {
            dispatch(
              setStoreDetail({
                ...res?.data,
                selectedSubCategory: payload?.subCategoryIdArr?.[0],
              }),
            );
          } else {
            dispatch(setStoreDetail(res?.data));
          }
        }
      } else {
        dispatch(setStoreDetail(null));
        errorToast(res?.message);
      }
      dispatch(setLoader({isLoading: false, loadingType}));
    })
    .catch(e => {
      consoleHere({e});
      dispatch(setLoader({isLoading: false, loadingType}));
    });
};

export const productDetailsAPI = async (
  payload: any,
  loadingType?: LoadingParams,
) => {
  if (!loadingType) {
    dispatch(setProductDetails(null));
    dispatch(setProductReview(null));
  }
  dispatch(setLoader({isLoading: true, loadingType}));
  get(constants.endPtProductDetails, payload)
    .then(async res => {
      if (res?.status === constants.apiSuccess) {
        dispatch(setProductDetails(res?.data));
      } else {
        errorToast(res?.message);
      }
      dispatch(setLoader({isLoading: false, loadingType}));
    })
    .catch(e => {
      consoleHere({e});
      dispatch(setLoader({isLoading: false, loadingType}));
    });
};

export const productRatingReviewAPI = async (
  payload: any,
  loadingType?: LoadingParams,
) => {
  !loadingType && dispatch(setProductReview(null));
  dispatch(setLoader({isLoading: true, loadingType}));
  get(constants.endProductReviewList, payload)
    .then(async res => {
      if (res?.status === constants.apiSuccess) {
        if (loadingType === 'loading_more') {
          const product_reviewList = getStore().home?.productReview;
          const newData = {
            ...res?.data,
            product_reviewList: {
              ...res?.data?.product_reviewList,
              data: [
                ...product_reviewList?.data,
                ...res?.data?.product_reviewList?.data,
              ],
            },
          };
          dispatch(setProductReview(newData));
        } else {
          dispatch(setProductReview(res?.data));
        }
      } else {
        errorToast(res?.message);
      }
      dispatch(setLoader({isLoading: false, loadingType}));
    })
    .catch(e => {
      consoleHere({e});
      dispatch(setLoader({isLoading: false, loadingType}));
    });
};

export const filterVariationAPI = async (payload: any) => {
  return get(constants.endPtFilterVariation, payload)
    .then(async res => {
      if (res?.status === constants.apiSuccess) {
        return res?.data;
      } else {
        errorToast(res?.message);
        return null;
      }
    })
    .catch(e => {
      consoleHere({e});
    });
};

export const brandListForFilterAPI = async (payload: any) => {
  return get(constants.endPtBrandListForFilter, payload)
    .then(async res => {
      if (res?.status === constants.apiSuccess) {
        return res?.data;
      } else {
        errorToast(res?.message);
        return null;
      }
    })
    .catch(e => {
      consoleHere({e});
    });
};

export const universalSearchAPI = async (
  payload: any,
  loadingType?: LoadingParams,
) => {
  if (loadingType !== 'loading_more') {
    dispatch(setSearchStoreData(null));
  }
  dispatch(setLoader({isLoading: true, loadingType}));
  if (payload.store_rating === undefined) {
    delete payload.store_rating;
  }
  if (payload.sellerStoreIdArr === undefined) {
    delete payload.sellerStoreIdArr;
  }
  if (payload.categoryIdArr === '') {
    delete payload.categoryIdArr;
  }

  post(constants.endPtUniversalSearch, payload)
    .then(async res => {
      if (res?.status === constants.apiSuccess) {
        if (loadingType === 'loading_more') {
          const seller_store_addresses =
            getStore().home?.SearchStoreData?.seller_store_addresses;
          const newData = {
            ...res?.data,
            seller_store_addresses: {
              ...res?.data?.seller_store_addresses,
              data: [
                ...seller_store_addresses?.data,
                ...res?.data?.seller_store_addresses?.data,
              ],
            },
          };
          dispatch(setSearchStoreData(newData));
        } else {
          dispatch(setSearchStoreData(res?.data));
        }
        return true;
      } else {
        // errorToast(res?.message);
      }
      dispatch(setLoader({isLoading: false, loadingType}));
    })
    .catch(e => {
      consoleHere({e});
      dispatch(setLoader({isLoading: false, loadingType}));
    });
};

export const universalProductSearchAPI = async (
  payload: any,
  loadingType?: LoadingParams,
) => {
  if (loadingType !== 'loading_more') {
    dispatch(setSearchProductData(null));
  }
  dispatch(setLoader({isLoading: true, loadingType}));
  if (payload.product_rating === undefined) {
    delete payload.product_rating;
  }
  if (payload.categoryIdArr === null) {
    delete payload.categoryIdArr;
  }
  if (payload.subCategoryIdArr === null) {
    delete payload.subCategoryIdArr;
  }
  if (payload.sellerStoreIdArr === null) {
    delete payload.sellerStoreIdArr;
  }
  if (payload.sort_by === null) {
    delete payload.sort_by;
  }

  post(constants.endPtUniversalProductSearch, payload)
    .then(async res => {
      if (res?.status === constants.apiSuccess) {
        if (loadingType === 'loading_more') {
          const seller_store_addresses =
            getStore().home?.SearchProductData?.seller_store_addresses;
          const newData = {
            ...res?.data,
            seller_store_addresses: {
              ...res?.data?.seller_store_addresses,
              data: [
                ...seller_store_addresses?.data,
                ...res?.data?.seller_store_addresses?.data,
              ],
            },
          };
          dispatch(setSearchProductData(newData));
        } else {
          dispatch(setSearchProductData(res?.data));
        }
      }
      dispatch(setLoader({isLoading: false, loadingType}));
    })
    .catch(e => {
      consoleHere({e});
      dispatch(setLoader({isLoading: false, loadingType}));
    });
};

export const subCategoryListCategoryAPI = async (payload: any) => {
  return post(constants.endPtSubCategoryListByCategory, payload)
    .then(async res => {
      if (res?.status === constants.apiSuccess) {
        return res?.data;
      } else {
        return null;
      }
    })
    .catch(e => {
      consoleHere({e});
      return null;
    });
};

export const OnBoardingAPI = async () => {
  dispatch(setIsLoading(true));
  get(constants.endPtOnboarding)
    .then(async res => {
      if (res?.status === constants.apiSuccess) {
        dispatch(setOnboardingData(res.data));
      } else {
        errorToast(res?.message);
      }
      dispatch(setIsLoading(false));
    })
    .catch(e => {
      consoleHere({e});
      dispatch(setIsLoading(false));
    });
};

export const categoriesWithSubCategoriesDataAPI = async () => {
  dispatch(setIsLoading(true));
  get(constants.endPtCategoryWithSubCategory)
    .then(async res => {
      if (res?.status === constants.apiSuccess) {
        if (res?.data) {
          dispatch(setCategoryWithSubCategory(res.data));
        }
      } else {
        errorToast(res?.message);
      }
      dispatch(setIsLoading(false));
    })
    .catch(e => {
      consoleHere({e});
      dispatch(setIsLoading(false));
    });
};

export const submitOnBoardingAPI = async (payload: any) => {
  dispatch(setIsLoading(true));
  return post(constants.endPtSubmitOnboardingForm, payload)
    .then(async res => {
      if (res?.status === constants.apiSuccess) {
        successToast(res.message);
        dispatch(setIsLoading(false));
        return true;
      } else {
        errorToast(res?.message);
        dispatch(setIsLoading(false));
        return false;
      }
    })
    .catch(e => {
      consoleHere({e});
      dispatch(setIsLoading(false));
      return false;
    });
};

export const whatsAppClickCountAPI = async (payload: any) => {
  // dispatch(setIsLoading(true));
  return post(constants.endPtWhatsAppClickCount, payload)
    .then(async res => {
      if (res?.status === constants.apiSuccess) {
        // successToast(res.message);
        // dispatch(setIsLoading(false));
        return true;
      } else {
        //errorToast(res?.message);
        // dispatch(setIsLoading(false));
        return false;
      }
    })
    .catch(e => {
      consoleHere({e});
      // dispatch(setIsLoading(false));
      return false;
    });
};
