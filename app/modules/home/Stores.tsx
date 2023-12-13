/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {useFocusEffect, useScrollToTop} from '@react-navigation/native';
import {FC, memo, useCallback, useEffect, useRef, useState} from 'react';
import {RefreshControl, ScrollView, View} from 'react-native';
import {useSelector} from 'react-redux';
import {
  Background,
  FilterModal,
  FloatingOptions,
  LoadMore,
  NoDataFound,
  PrimaryHeader,
  PrimaryModal,
  SearchInput,
  StoreCarousel,
  StoreCategoryTitle,
  StoreItem,
} from '../../components';
import {getTabSafeAreaHeight, isRefreshing, screenName} from '../../core';
import {strings} from '../../i18n';
import {getCurrentRoute, navigate} from '../../navigation/RootNavigation';
import {RootState, dispatch} from '../../redux';
import {
  setOtherCategoryId,
  setSortList,
  setStoreData,
  setStoreFilterList,
} from '../../redux/modules/homeSlice';
import {storeAPI} from '../../services/homeServices';
import {commonStyles, storeStyles} from '../../styles';
import {CommonNavigationProps} from '../../types/navigationTypes';

/**************************************************************************************/
/*************************************On the basis*************************************/
/**************************navigation current route, we are****************************/
/******************************handling This screen data*******************************/
/**************************************************************************************/

export const Stores: FC<CommonNavigationProps> = memo(({navigation, route}) => {
  /************ Hooks Functions ************/

  const [count, setCount] = useState(0);
  const [showCatModal, setShowCatModal] = useState(false);
  const [bannerCurrentIndex, setBannerCurrentIndex] = useState(0);
  const [floatingValue, setFloatingValue] = useState('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [paddingBottom, setPaddingBottom] = useState(0);
  const [filteredStoreResults, setFilteredStoreResults] = useState<any>(0);

  const [inputValue, setInputValue] = useState('');
  const [isSearch, setIsSearch] = useState(false);
  const [selectFilter, setSelectedFilter] = useState(false);

  const store_list = useSelector((state: RootState) => state.home.storeData);

  const brandStoreList = useSelector(
    (state: RootState) => state.home.brandStoreList,
  );
  const coords = useSelector(
    (state: RootState) => state?.generic?.myLocation?.coords,
  );
  const isLoading = useSelector(
    (state: RootState) => state?.generic?.loader?.isLoading,
  );
  const category_list = useSelector(
    (state: RootState) => state.home?.homeData?.category_list,
  );
  const otherCategory = useSelector(
    (state: RootState) => state.home?.CategoryIdStore,
  );

  const category_id = route?.params?.category_id ?? null;
  const sub_category_id = route?.params?.sub_category_id ?? null;

  const [screenParams, setScreenParams] = useState<any>({
    category_id,
    sub_category_id,
  });
  const [data, setData] = useState<any>('');
  const scrollViewRef = useRef<any>();

  useEffect(() => {
    if (route?.name === screenName.brandStoreList) {
      setData(brandStoreList);
    } else {
      setData(store_list);
    }
  }, [store_list, brandStoreList, route]);

  useScrollToTop(
    useRef({
      scrollToTop: () => scrollViewRef.current?.scrollTo({y: 0}),
    }),
  );

  useEffect(() => {
    if (route?.name === screenName.stores) {
      if (coords?.latitude && coords?.longitude) {
        getStoreData();
      }
      setStoreFilterList([]);
    }
    return () => {
      dispatch(
        setStoreData({
          recommended_store_list: [],
          store_list: {},
        }),
      );
    };
  }, [coords?.latitude, coords?.longitude]);

  useFocusEffect(
    useCallback(() => {
      if (route?.name === screenName.tabStore) {
        if (coords?.latitude && coords?.longitude) {
          if (otherCategory === null) {
            setScreenParams({
              ...screenParams,
              category_id: null,
            });
          } else {
            setScreenParams({
              ...screenParams,
              category_id: otherCategory?.category_id,
            });
          }
          getStoreData();
        }
        setPaddingBottom(getTabSafeAreaHeight());
        setStoreFilterList([]);
      }
    }, [navigation, coords?.latitude, coords?.longitude, otherCategory]),
  );

  /************ Main Functions ************/
  const handleFilterApply = useCallback(
    (data: any) => {
      setSelectedFilter(data?.filter_count > 0);
      setCount(data.filter_count);
      const payload = {
        ...screenParams,
        ...data,
        page: 1,
        ...coords,
      };
      setCurrentPage(1);
      setScreenParams({
        ...screenParams,
        ...data,
        page: 1,
      });
      storeAPI(payload);
    },
    [screenParams, coords],
  );

  const getStoreData = useCallback(async () => {
    let payload;

    if (otherCategory !== null) {
      payload = {
        ...screenParams,
        page: 1,
        ...coords,
        category_id: otherCategory?.category_id,
      };
    } else if (otherCategory === null && route?.name === screenName.tabStore) {
      payload = {
        ...screenParams,
        page: 1,
        ...coords,
        category_id: null,
      };
    } else {
      payload = {
        ...screenParams,
        page: 1,
        ...coords,
      };
    }

    setCurrentPage(1);
    storeAPI(payload);
  }, [screenParams, coords, otherCategory]);

  const handleRefresh = useCallback(async () => {
    if (coords?.latitude && coords?.longitude) {
      const payload = {
        ...screenParams,
        page: 1,
        ...coords,
      };
      setCurrentPage(1);
      storeAPI(payload, 'refreshing');
    }
  }, [coords, screenParams]);

  const handleLoadMore = useCallback(async () => {
    const payload = {
      ...screenParams,
      page: currentPage + 1,
      ...coords,
    };
    setCurrentPage(currentPage + 1);
    storeAPI(payload, 'loading_more');
  }, [screenParams, coords]);

  const isCloseToBottom = useCallback(
    ({layoutMeasurement, contentOffset, contentSize}: any) => {
      const paddingToBottom = 20;
      return (
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom
      );
    },
    [],
  );

  const handleOtherCategory = useCallback(
    (id: any) => {
      if (route?.name === screenName.tabStore) {
        dispatch(
          setOtherCategoryId({
            category_id: id,
          }),
        );
      }
      const payload = {
        ...screenParams,
        category_id: id,
        page: 1,
        ...coords,
      };
      setScreenParams({
        ...screenParams,
        category_id: id,
      });
      setCurrentPage(1);
      storeAPI(payload);
    },
    [screenParams, coords],
  );

  const getCategoryName = useCallback(() => {
    const categoryName = category_list.find(
      (item: any) => item?.id === screenParams?.category_id,
    )?.category_name;
    if (categoryName) {
      return categoryName;
    } else {
      return strings.ctAllStore;
    }
  }, [screenParams, category_list]);

  const onInputChange = useCallback(
    (txt: string) => {
      setInputValue(txt);
      const result = data?.store_list?.data
        ?.map((item: any) => {
          if (item?.store_name?.toLowerCase().includes(txt.toLowerCase())) {
            return item;
          } else {
            return null;
          }
        })
        ?.filter((x: any) => x);
      setFilteredStoreResults(result);
    },
    [data],
  );

  const onDetailSearchHandler = useCallback(() => {
    isSearch === true ? setIsSearch(false) : setIsSearch(true);
  }, [isSearch]);

  const onScrollHandler = useCallback(
    ({nativeEvent}: any) => {
      if (
        isCloseToBottom(nativeEvent) &&
        data.store_list?.data?.length < data?.store_list?.total
      ) {
        handleLoadMore();
      }
    },
    [isCloseToBottom, handleLoadMore, data],
  );

  const onPressStoreItem = useCallback(
    (item: any) => {
      dispatch(setSortList([]));
      navigate(screenName.storeDetails, {
        seller_store_id: item?.id,
        category_id:
          route?.name === screenName?.tabStore
            ? item?.seller_store_categories?.[0]?.category_id
            : screenParams?.category_id,
        sub_category_id: sub_category_id,
        seller_store_address_id:
          item?.seller_store_categories?.[0]?.seller_store_address_id,
      });
    },
    [screenParams, route],
  );

  const onChangeSearchHandler = useCallback(
    (text: any) => {
      onInputChange(text);
    },
    [onInputChange],
  );

  const onPressCarousel = useCallback(
    (item: any) => {
      navigation.navigate(screenName.brandStoreList, {
        category_id: screenParams?.category_id,
        seller_store_id: item?.seller_store_id,
      });
    },
    [navigation, screenParams],
  );

  const openModalHandler = useCallback((value: any) => {
    value === 'filter'
      ? setShowFilterModal(true)
      : value === 'category'
      ? setShowCatModal(true)
      : setFloatingValue(value);
  }, []);

  const closeModalHandler = useCallback((type: any) => {
    switch (type) {
      case 'filter':
        setShowFilterModal(false);
        break;

      case 'category':
        setShowCatModal(false);
        break;
    }
  }, []);

  return (
    <Background>
      <View style={[commonStyles.flex1, {paddingBottom: paddingBottom}]}>
        <PrimaryHeader
          left="back"
          title={route?.name === screenName.tabStore ? getCategoryName() : ''}
          right="search_plus_cart_plus_menu"
          searchType="storeDetail"
          screen_from="store"
          onDetailSearch={onDetailSearchHandler}
        />

        {isSearch === true ? (
          <SearchInput
            inputValue={inputValue}
            onChangeText={onChangeSearchHandler}
            onPressClose={onInputChange.bind(null, '')}
          />
        ) : null}

        <ScrollView
          ref={scrollViewRef}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing()}
              onRefresh={handleRefresh}
            />
          }
          scrollEventThrottle={1000}
          onScroll={onScrollHandler}
          nestedScrollEnabled={true}
          contentContainerStyle={[
            storeStyles.contentContainerStyle,
            {
              paddingTop:
                getCurrentRoute() === screenName.tabStore ? '2%' : '4%',
            },
          ]}>
          {route?.name !== screenName.tabStore &&
            data?.recommended_store_list?.length > 0 && (
              <StoreCarousel
                data={data.recommended_store_list}
                onSnapToItem={index => {
                  setBannerCurrentIndex(index);
                }}
                bannerCurrentIndex={bannerCurrentIndex}
                onPress={onPressCarousel}
              />
            )}
          {data?.store_list?.data &&
            data?.store_list?.data?.length > 0 &&
            route?.name !== screenName.tabStore && (
              <StoreCategoryTitle category_name={getCategoryName()} />
            )}

          {data?.store_list?.data && data?.store_list?.data?.length > 0 ? (
            inputValue?.trim().length > 0 && filteredStoreResults.length > 0 ? (
              <View
                style={
                  floatingValue === 'grid' ? storeStyles.listGridWrapper : null
                }>
                {filteredStoreResults?.map((item: any, index: any) => {
                  return (
                    <StoreItem
                      key={index}
                      testID={`${index}`}
                      item={item}
                      floatingValue={floatingValue}
                      onPress={onPressStoreItem.bind(null, item)}
                      category_id={screenParams?.category_id}
                      seller_store_id={item?.id}
                      idSellerStore={item?.seller_store_id}
                      seller_store_address_id={
                        item?.seller_store_categories?.[0]
                          ?.seller_store_address_id
                      }
                    />
                  );
                })}
              </View>
            ) : inputValue?.trim().length > 0 &&
              filteredStoreResults.length === 0 ? (
              <View style={{marginTop: 10, flexGrow: 1}}>
                <NoDataFound label={'Result not found'} isDisplay={false} />
              </View>
            ) : (
              <View
                style={
                  floatingValue === 'grid' ? storeStyles.listGridWrapper : null
                }>
                {data?.store_list?.data?.map((item: any, index: any) => {
                  return (
                    <StoreItem
                      key={index}
                      testID={`${index}`}
                      item={item}
                      floatingValue={floatingValue}
                      onPress={onPressStoreItem.bind(null, item)}
                      category_id={screenParams?.category_id}
                      seller_store_id={item?.id}
                      idSellerStore={item?.seller_store_id}
                      seller_store_address_id={
                        item?.seller_store_categories?.[0]
                          ?.seller_store_address_id
                      }
                    />
                  );
                })}
              </View>
            )
          ) : (
            !isLoading &&
            data?.store_list?.data?.length === 0 && (
              <NoDataFound
                label={strings.ctServiceNotAvailable}
                isDisplay={false}
              />
            )
          )}
          <LoadMore />
        </ScrollView>

        <FloatingOptions
          onChange={openModalHandler}
          type="store"
          value={floatingValue}
          count={count}
        />

        <PrimaryModal
          payload={screenParams?.category_id}
          isVisible={showCatModal}
          onClose={closeModalHandler.bind(null, 'category')}
          type="other_category"
          onChange={handleOtherCategory}
        />

        <FilterModal
          selectedFilter={selectFilter}
          payload={{
            category_id: screenParams?.category_id,
          }}
          type="store_list"
          isVisible={showFilterModal}
          onClose={closeModalHandler.bind(null, 'filter')}
          onApply={handleFilterApply}
        />
      </View>
    </Background>
  );
});
