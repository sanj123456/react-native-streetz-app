/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {
  useFocusEffect,
  useIsFocused,
  useScrollToTop,
} from '@react-navigation/native';
import {FC, useCallback, useEffect, useRef, useState} from 'react';
import {AppState, Platform, ScrollView, View} from 'react-native';
import {isLocationEnabled} from 'react-native-device-info';
import {useSelector} from 'react-redux';
import {
  Background,
  CategoryHeader,
  HomeBottomBanner,
  HomeCarousel,
  HomeCategory,
  NoDataFound,
  PrimaryHeader,
  RecentViewProduct,
} from '../../components';
import {commonStyles, homeStyles} from '../../styles';
import {
  consoleHere,
  constants,
  getTabSafeAreaHeight,
  screenName,
} from '../../core';
import {strings} from '../../i18n';
import {RootState, dispatch} from '../../redux';
import {
  setAndroidEnablerStatus,
  setHomeSafeArea,
  setIsLoading,
} from '../../redux/modules/genericSlice';
import {
  analyticsLogEvent,
  getAddressAPI,
  getCartAPI,
  getGeoLocation,
  homeAPI,
  logoutAPI,
} from '../../services';
import {PERMISSIONS} from 'react-native-permissions';
import {CheckPermission} from '../../core/CheckPermission';
import {navigate} from '../../navigation/RootNavigation';
import {CommonNavigationProps} from '../../types/navigationTypes';
import {setOtherCategoryId, setStoreData} from '../../redux/modules/homeSlice';

export const Home: FC<CommonNavigationProps> = ({navigation}) => {
  /************ Hooks Functions ************/

  const [bannerCurrentIndex, setBannerCurrentIndex] = useState(0);
  const [adBannerCurrentIndex, setAdBannerCurrentIndex] = useState(0);
  const isFocused = useIsFocused();
  const [showHeader, setShowHeader] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const category_list = useSelector(
    (state: RootState) => state.home?.homeData?.category_list,
  );
  const recently_viewed_product_list = useSelector(
    (state: RootState) => state.home?.homeData?.recently_viewed_product_list,
  );
  const trending_store_list = useSelector(
    (state: RootState) => state.home?.homeData?.trending_store_list,
  );
  const ads_banner_list = useSelector(
    (state: RootState) => state.home?.homeData?.ads_banner_list,
  );
  const coords = useSelector(
    (state: RootState) => state.generic?.myLocation?.coords,
  );
  const isLoading = useSelector(
    (state: RootState) => state?.generic?.loader?.isLoading,
  );
  const profileData = useSelector(
    (state: RootState) => state?.profile.profileData,
  );

  const paddingBottom = getTabSafeAreaHeight();
  const appState = useRef(AppState.currentState);

  const checkComponentFocused = useCallback(async () => {
    dispatch(setHomeSafeArea(isFocused));
  }, [isFocused]);

  const scrollViewRef = useRef<any>();

  useScrollToTop(
    useRef({
      scrollToTop: () => scrollViewRef.current?.scrollTo({y: 0}),
    }),
  );

  useEffect(() => {
    checkComponentFocused();
  }, [isFocused]);

  const permissionHandler = useCallback(async () => {
    const permissionsArray =
      Platform.OS === 'ios'
        ? [PERMISSIONS.IOS.LOCATION_WHEN_IN_USE]
        : [PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION];

    const result = await CheckPermission(permissionsArray);

    switch (result) {
      case 0:
        await getAddressAPI();
        dispatch(setIsLoading(false));
        dispatch(setAndroidEnablerStatus(true));
        break;

      case 1:
        if (Platform.OS === 'android') {
          await getAddressAPI();
          isLocationEnabled().then(enabled => {
            if (enabled === true) {
              getGeoLocation();
              dispatch(setAndroidEnablerStatus(false));
            }
            if (enabled === false) {
              dispatch(setIsLoading(false));
              dispatch(setAndroidEnablerStatus(true));
            }
          });
        } else if (Platform.OS === 'ios') {
          await getGeoLocation();
        }
        break;

      case -1:
        await getAddressAPI();
        dispatch(setIsLoading(false));
        dispatch(setAndroidEnablerStatus(true));
        break;
    }
  }, []);

  useEffect(() => {
    if (Platform.OS === 'android') {
      const subscription = AppState.addEventListener('change', nextAppState => {
        if (
          appState.current.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          dispatch(setIsLoading(false));
          consoleHere('App has come to the foreground!');
          permissionHandler();
        }
        appState.current = nextAppState;
        consoleHere({AppState: appState.current});
      });

      return () => {
        subscription.remove();
      };
    }
  }, [permissionHandler]);

  useFocusEffect(
    useCallback(() => {
      if (!profileData.mobile_no.match(constants.numberRegex)) {
        if (coords?.latitude && coords?.longitude) {
          getHomeData();
          getCartAPI();
        } else if (!coords?.latitude || !coords?.longitude) {
          dispatch(setIsLoading(true));
          permissionHandler();
        }
      }
      if (profileData?.mobile_no.match(constants.numberRegex)) {
        logoutAPI();
      }
    }, [coords?.latitude, coords?.longitude, permissionHandler, profileData]),
  );

  /************ Main Functions ************/

  const getHomeData = async () => {
    const res = await homeAPI({
      ...coords,
    });
    if (res || !res) {
      setShowHeader(true);
    }
  };

  const handleSellWithUs = () => {
    navigate(screenName.onBoardingForm);
  };

  const onPressBannerHandler = useCallback(
    (item: any) => {
      item?.banner_type === 0
        ? navigation.navigate(screenName.tabStore)
        : navigation.navigate(screenName.brandStoreList, {
            category_id: item.category_id,
            seller_store_id: item?.seller_store_id,
          });
    },
    [navigation],
  );

  const onPressViewAllCategory = useCallback(() => {
    navigation.navigate(screenName.tabCategory);
  }, [navigation]);

  const onPressCategoryHandler = useCallback(
    (item: any) => {
      dispatch(setOtherCategoryId(null));
      dispatch(
        setStoreData({
          recommended_store_list: [],
          store_list: {},
        }),
      );
      // setShowModal(true);
      navigation.navigate(screenName.stores, {
        category_id: item?.id,
        category_name: item?.category_name,
      });
      analyticsLogEvent(constants.analyticsEvents.categorySelection, {
        category_name: item?.category_name,
      });
    },
    [navigation, dispatch],
  );

  return (
    <Background>
      <View style={[commonStyles.flex1, {paddingBottom: paddingBottom}]}>
        {showHeader && (
          <PrimaryHeader isHome left="location" right="search_plus_menu" />
        )}

        {category_list?.length > 0 ? (
          <ScrollView
            ref={scrollViewRef}
            bounces={false}
            nestedScrollEnabled={true}
            overScrollMode="never">
            <View
              style={[
                {paddingBottom: trending_store_list?.length > 0 ? 10 : 0},
              ]}>
              {category_list?.length > 0 && (
                <View
                  style={[
                    homeStyles.categoryBgWrapper,
                    {paddingBottom: trending_store_list?.length > 0 ? 10 : 10},
                  ]}>
                  {ads_banner_list?.length > 0 && (
                    <HomeCarousel
                      data={ads_banner_list}
                      onSnapToItem={index => setAdBannerCurrentIndex(index)}
                      isLightIndicator={true}
                      bannerCurrentIndex={adBannerCurrentIndex}
                      onPress={onPressBannerHandler}
                    />
                  )}
                  <CategoryHeader onPress={onPressViewAllCategory} />
                  <HomeCategory
                    data={category_list}
                    onPress={onPressCategoryHandler}
                  />
                </View>
              )}

              {trending_store_list?.length > 0 && (
                <HomeCarousel
                  data={trending_store_list}
                  bannerCurrentIndex={bannerCurrentIndex}
                  onSnapToItem={index => setBannerCurrentIndex(index)}
                  isTrendingCarousel={true}
                  onPress={onPressBannerHandler}
                />
              )}
            </View>

            {recently_viewed_product_list?.length > 0 && (
              <RecentViewProduct data={recently_viewed_product_list} />
            )}

            <HomeBottomBanner
              marginTop={recently_viewed_product_list?.length > 0 ? '0%' : '3%'}
              onPress={handleSellWithUs}
            />
          </ScrollView>
        ) : (
          !isLoading &&
          showHeader && <NoDataFound label={strings.ctServiceNotAvailable} />
        )}
      </View>
    </Background>
  );
};
