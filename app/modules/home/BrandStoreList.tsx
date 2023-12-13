/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {FC, useEffect, useState} from 'react';
import {RefreshControl, ScrollView, View} from 'react-native';
import {useSelector} from 'react-redux';
import {
  Background,
  LoadMore,
  NoDataFound,
  PrimaryHeader,
  PrimaryModal,
  StoreItem,
} from '../../components';
import {isRefreshing, screenName} from '../../core';
import {RootState, dispatch} from '../../redux';
import {
  setBannerCategoryId,
  setBrandStoreList,
} from '../../redux/modules/homeSlice';
import {storeAPI} from '../../services/homeServices';
import {brandStoreListStyles} from '../../styles';
import {CommonNavigationProps} from '../../types/navigationTypes';

export const BrandStoreList: FC<CommonNavigationProps> = ({
  navigation,
  route,
}) => {
  /************ Hooks Functions ************/
  const category_id = route?.params?.category_id || null;
  const seller_store_id = route?.params?.seller_store_id || null;

  const [showCatModal, setShowCatModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [screenParams, setScreenParams] = useState<any>({
    category_id,
    seller_store_id: [seller_store_id],
  });

  const isLoading = useSelector(
    (state: RootState) => state?.generic?.loader?.isLoading,
  );
  const coords = useSelector(
    (state: RootState) => state?.generic?.myLocation?.coords,
  );
  const store_list = useSelector(
    (state: RootState) => state.home.brandStoreList?.store_list,
  );
  const selectedBannerCategoryId = useSelector(
    (state: RootState) => state.home?.selectedBannerCategoryId,
  );

  const getStoreData = async () => {
    const payload = {
      ...screenParams,
      page: 1,
      ...coords,
    };
    setCurrentPage(1);
    storeAPI(payload);
    dispatch(
      setBannerCategoryId({
        category_id: screenParams.category_id,
        seller_store_id: screenParams.seller_store_id,
      }),
    );
  };

  useEffect(() => {
    if (
      (selectedBannerCategoryId?.category_id &&
        selectedBannerCategoryId?.seller_store_id?.[0]) !==
      (screenParams?.category_id && screenParams?.seller_store_id?.[0])
    ) {
      dispatch(
        setBrandStoreList({
          store_list: {},
        }),
      );
      getStoreData();
    }
  }, []);

  /************ Main Functions ************/

  const handleRefresh = async () => {
    const payload = {
      ...screenParams,
      page: 1,
      ...coords,
    };
    setCurrentPage(1);
    storeAPI(payload, 'refreshing');
  };

  const handleLoadMore = async () => {
    const payload = {
      ...screenParams,
      page: currentPage + 1,
      ...coords,
    };
    setCurrentPage(currentPage + 1);
    storeAPI(payload, 'loading_more');
  };

  const isCloseToBottom = ({
    layoutMeasurement,
    contentOffset,
    contentSize,
  }: any) => {
    const paddingToBottom = 20;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  const handleOtherCategory = (id: any) => {
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
  };

  const onScrollHandler = ({nativeEvent}: any) => {
    if (
      isCloseToBottom(nativeEvent) &&
      store_list?.data?.length < store_list?.total
    ) {
      handleLoadMore();
    }
  };

  const onPressItem = (item: any) => {
    navigation.navigate(screenName.storeDetails, {
      seller_store_id: item?.id,
      category_id: category_id,
    });
  };

  const renderItemHandler = (item: any, index: any) => {
    return (
      <StoreItem
        item={item}
        testID={`${index}`}
        floatingValue={'list'}
        onPress={onPressItem.bind(null, item)}
        category_id={category_id}
        seller_store_id={item?.id}
        idSellerStore={item?.seller_store_id}
        seller_store_address_id={
          item?.seller_store_categories?.[0]?.seller_store_address_id
        }
      />
    );
  };

  return (
    <Background>
      <PrimaryHeader left="back" right="search_plus_cart_plus_menu" />
      <ScrollView
        testID={'BrandStoreList'}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing()}
            onRefresh={handleRefresh}
          />
        }
        scrollEventThrottle={1000}
        onScroll={onScrollHandler}
        nestedScrollEnabled={true}
        contentContainerStyle={brandStoreListStyles.contentContainerStyle}>
        {store_list?.data && store_list?.data?.length > 0 ? (
          <View style={brandStoreListStyles.listGridWrapper}>
            {store_list?.data?.map(renderItemHandler)}
          </View>
        ) : (
          !isLoading && <NoDataFound />
        )}
        <LoadMore />
      </ScrollView>

      <PrimaryModal
        payload={screenParams?.category_id}
        isVisible={showCatModal}
        onClose={() => setShowCatModal(false)}
        type="other_category"
        onChange={handleOtherCategory}
      />
    </Background>
  );
};
