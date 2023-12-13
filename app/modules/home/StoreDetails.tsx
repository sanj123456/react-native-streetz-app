/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {FC, useCallback, useEffect, useRef, useState} from 'react';
import {
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {
  Background,
  FilterModal,
  FloatingOptions,
  LoadMore,
  NoDataFound,
  PrimaryHeader,
  PrimaryModal,
  PrimaryText,
  ProductItem,
  SearchInput,
} from '../../components';
import {SortModal} from '../../components/SortModal';
import {
  consoleHere,
  contactWithWhatsApp,
  images,
  isRefreshing,
} from '../../core';
import {strings} from '../../i18n';
import {RootState, dispatch} from '../../redux';
import {setFilterList, setStoreDetail} from '../../redux/modules/homeSlice';
import {
  storeDetailsAPI,
  whatsAppClickCountAPI,
} from '../../services/homeServices';
import {colors, commonStyles, storeDetailsStyles} from '../../styles';
import {CommonNavigationProps} from '../../types/navigationTypes';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import Share from 'react-native-share';
import Config from 'react-native-config';

//let filteredProductResults: any = [];

export const StoreDetails: FC<CommonNavigationProps> = ({route}) => {
  const {
    category_id = null,
    seller_store_id = null,
    sub_category_id = null,
    seller_store_address_id = null,
  } = route.params;

  /************ Hooks Functions ************/
  const [showCatModal, setShowCatModal] = useState(false);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [screenParams, setScreenParams] = useState<any>({
    category_id,
    seller_store_id,
  });
  const [count, setCount] = useState(0);
  const [inputValue, setInputValue] = useState('');
  const [isSearch, setIsSearch] = useState(false);
  const subCatRef = useRef<any>(null);
  const [subCatID, setSubCatID] = useState(null);
  const [selectedSorting, setSelectedSorting] = useState(false);
  const [selectFilter, setSelectedFilter] = useState(false);
  const [filterParams, setFilterParams] = useState({});
  const [filteredStoreResults, setFilteredStoreResults] = useState<any>(0);

  const storeDetailData = useSelector(
    (state: RootState) => state.home.storeDetailData,
  );
  const store_details = useSelector(
    (state: RootState) => state.home.storeDetailData?.store_details,
  );
  const product_list = useSelector(
    (state: RootState) => state.home.storeDetailData?.product_list,
  );
  const sub_category_list = useSelector(
    (state: RootState) => state.home.storeDetailData?.sub_category_list,
  );
  const category_name = useSelector(
    (state: RootState) => state.home.storeDetailData?.category_name,
  );
  const isLoading = useSelector(
    (state: RootState) => state?.generic?.loader?.isLoading,
  );
  const userType = useSelector((state: RootState) => state.profile.userType);

  const [IsCallApi, setIsCallApi] = useState(false);

  useEffect(() => {
    if (storeDetailData) {
      const id = storeDetailData?.selectedSubCategory ?? null;
      setSubCatID(id);

      let index = [{id: null}, ...sub_category_list]?.findIndex(
        item => item?.id === id,
      );

      if (index < 0) {
        index = 0;
      }
      if (IsCallApi === true) {
        setTimeout(() => {
          subCatRef?.current?.scrollToIndex({
            index,
            animated: true,
          });
        }, 200);
      }
    }
    //}
  }, [storeDetailData?.selectedSubCategory, storeDetailData]);

  useEffect(() => {
    if (product_list?.data?.length > 0 && inputValue?.trim()?.length > 0) {
      const result = product_list?.data
        ?.map((item: any) => {
          if (
            item?.product_name?.toLowerCase().includes(inputValue.toLowerCase())
          ) {
            return item;
          } else {
            return null;
          }
        })
        ?.filter((x: any) => x);
      setFilteredStoreResults(result);
    }
  }, [product_list, inputValue]);

  const getStoreDetails = useCallback(async () => {
    let payload;

    if (sub_category_id !== null) {
      payload = {
        ...screenParams,
        page: 1,
        subCategoryIdArr: sub_category_id ? [sub_category_id] : [],
      };
    } else {
      payload = {
        ...screenParams,
        page: 1,
      };
    }
    setCurrentPage(1);
    storeDetailsAPI(payload);
    setIsCallApi(true);
  }, [screenParams]);

  useEffect(() => {
    if (!screenParams?.page && Object.keys(filterParams).length !== 0) {
      setScreenParams({category_id, seller_store_id});
    }
  }, [category_id, seller_store_id]);

  useEffect(() => {
    if (
      screenParams?.category_id &&
      screenParams?.seller_store_id &&
      (screenParams?.category_id !== category_name?.id ||
        screenParams?.seller_store_id !== store_details?.id)
    ) {
      dispatch(setFilterList([]));
      dispatch(setStoreDetail(null));
      getStoreDetails();
    } else {
      setIsCallApi(false);
    }
  }, [screenParams?.category_id, screenParams?.seller_store_id, userType]);

  /************ Main Functions ************/
  const handleFilterApply = useCallback(
    async (data: any) => {
      const id = storeDetailData?.selectedSubCategory ?? null;
      setSelectedFilter(data?.filter_count > 0);
      setCount(data.filter_count);

      const payload = {
        ...screenParams,
        ...data,
        page: 1,
        subCategoryIdArr: id ? [id] : [],
      };
      setCurrentPage(1);
      setScreenParams({
        ...screenParams,
        ...data,
        page: 1,
        subCategoryIdArr: id ? [id] : [],
      });
      setFilterParams(data);
      storeDetailsAPI(payload);
    },
    [screenParams, sub_category_list, storeDetailData],
  );

  const handleSortApply = useCallback(
    (data: any) => {
      const id = storeDetailData?.selectedSubCategory ?? null;
      setSelectedSorting(data?.sort_by?.length > 0);
      const payload = {
        ...screenParams,
        ...data,
        page: 1,
        subCategoryIdArr: id ? [id] : [],
      };
      setCurrentPage(1);
      setScreenParams({
        ...screenParams,
        ...data,
        page: 1,
        subCategoryIdArr: id ? [id] : [],
      });
      storeDetailsAPI(payload);
    },
    [screenParams, sub_category_list],
  );

  const handleRefresh = useCallback(async () => {
    const payload = {
      ...screenParams,
      page: 1,
    };
    setCurrentPage(1);
    storeDetailsAPI(payload, 'refreshing');
  }, [screenParams]);

  const handleLoadMore = useCallback(async () => {
    const payload = {
      ...screenParams,
      page: currentPage + 1,
    };
    setCurrentPage(currentPage + 1);
    storeDetailsAPI(payload, 'loading_more');
  }, [screenParams, currentPage]);

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
      const payload = {
        ...screenParams,
        category_id: id,
        page: 1,
      };
      setScreenParams({
        ...screenParams,
        category_id: id,
      });
      setCurrentPage(1);
      storeDetailsAPI(payload);
    },
    [screenParams],
  );
  const onInputChange = useCallback(
    (txt: string) => {
      setInputValue(txt);
      const result = product_list?.data
        ?.map((item: any) => {
          if (item?.product_name?.toLowerCase().includes(txt.toLowerCase())) {
            return item;
          } else {
            return null;
          }
        })
        ?.filter((x: any) => x);
      setFilteredStoreResults(result);
    },
    [product_list],
  );

  const handleTabChange = useCallback(
    (id: any) => () => {
      setSubCatID(id);
      setFilteredStoreResults([]);
      const payload = {
        ...screenParams,
        subCategoryIdArr: id ? [id] : [],
        page: 1,
        ...filterParams,
      };

      setCurrentPage(1);

      storeDetailsAPI(payload);
    },
    [screenParams, subCatID],
  );

  const searchHandler = useCallback(() => {
    setIsSearch(prev => !prev);
  }, []);

  const onScrollHandler = useCallback(
    ({nativeEvent}: any) => {
      if (
        isCloseToBottom(nativeEvent) &&
        product_list?.data?.length < product_list?.total
      ) {
        handleLoadMore();
      }
    },
    [isCloseToBottom, handleLoadMore, product_list],
  );

  const renderItemHandler = useCallback(
    ({item, index}: any) => {
      return (
        <TouchableOpacity
          activeOpacity={0.8}
          testID={`${index}_sub_cat_keys`}
          onPress={handleTabChange(item?.id)}
          style={[
            storeDetailsStyles.subItem,
            {
              backgroundColor:
                subCatID === item?.id ? colors.primary : colors.white,
              borderColor:
                subCatID === item?.id ? colors.primary : colors.background,
            },
          ]}>
          <PrimaryText
            style={{
              color: subCatID === item?.id ? colors.white : colors.blackText,
            }}>
            {index === 0 ? 'All' : item?.sub_category_name}
          </PrimaryText>
        </TouchableOpacity>
      );
    },
    [subCatID, handleTabChange],
  );

  const closeModalHandler = useCallback((type: any) => {
    switch (type) {
      case 'category':
        setShowCatModal(false);
        break;

      case 'filter':
        setShowFilterModal(false);
        break;
      case 'sort':
        setShowSortModal(false);
        break;
    }
  }, []);

  const openModalHandler = useCallback((value: any) => {
    value === 'filter' ? setShowFilterModal(true) : setShowSortModal(true);
  }, []);

  const generateLink = async () => {
    try {
      const link = await dynamicLinks().buildShortLink(
        {
          link: `${Config.Deep_Link_URL}${'store?category_id'}=${
            screenParams?.category_id
          }&seller_store_id=${screenParams?.seller_store_id}`,
          domainUriPrefix: 'https://streetzapp.page.link',
          android: {
            packageName: Config.ANDROID_PACKAGE_NAME ?? '',
          },
          ios: {
            appStoreId: '6451184276',
            bundleId: 'org.StreetzApp',
          },
        },
        dynamicLinks.ShortLinkType.DEFAULT,
      );

      return link;
    } catch (error) {
      consoleHere({generateLinkError: error});
    }
  };

  const shareStore = useCallback(async () => {
    const getLink = await generateLink();
    const options = {
      message: `${'Check this Store\n'}${getLink}`,
      // url: getLink,
    };
    Share.open(options)
      .then(res => consoleHere({shareProductRes: res}))
      .catch(err => consoleHere({shareProductErr: err}));
  }, [generateLink]);

  const clickCount = useCallback(async () => {
    const payload = {
      seller_store_id: store_details.seller_store_id,
      seller_store_address_id: seller_store_address_id,
    };
    whatsAppClickCountAPI(payload);
    contactWithWhatsApp(store_details?.seller_store?.whatsapp_number);
  }, [store_details, seller_store_address_id]);

  return (
    <Background>
      <PrimaryHeader
        left="back"
        right="search_plus_cart_plus_menu"
        title={store_details?.store_name}
        searchType="storeDetail"
        screen_from="storeDetail"
        onDetailSearch={searchHandler}
      />

      {isSearch === true ? (
        <SearchInput
          inputValue={inputValue}
          onPressClose={onInputChange.bind(null, '')}
          onChangeText={onInputChange}
        />
      ) : null}

      {storeDetailData && (
        <>
          <ScrollView
            testID={'StoreDetailScrollView'}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing()}
                onRefresh={handleRefresh}
              />
            }
            scrollEventThrottle={1000}
            onScroll={onScrollHandler}
            nestedScrollEnabled={true}
            contentContainerStyle={storeDetailsStyles.contentContainerStyle}>
            {store_details?.is_open !== 'open' && (
              <View style={storeDetailsStyles.closedView}>
                <PrimaryText style={storeDetailsStyles.txtClosed}>
                  {strings.ctStoreClosed}
                </PrimaryText>
              </View>
            )}
            <View style={storeDetailsStyles.tabHeader}>
              <FlatList
                ref={subCatRef}
                data={[{id: null}, ...sub_category_list]}
                showsHorizontalScrollIndicator={false}
                bounces={false}
                horizontal
                contentContainerStyle={storeDetailsStyles.subCatContainerStyles}
                keyExtractor={(item, index) => `${index}_sub_cat_keys`}
                renderItem={renderItemHandler}
                getItemLayout={(_, index) => ({
                  length: 60 + 20,
                  offset: (60 + 20) * index,
                  index,
                })}
              />
            </View>
            {product_list?.data && product_list?.data?.length > 0 ? (
              inputValue?.trim().length > 0 &&
              filteredStoreResults.length > 0 ? (
                <View style={commonStyles.listGridWrapper}>
                  {filteredStoreResults?.map((item: any, index: number) => {
                    return (
                      <ProductItem
                        key={`${index}_product_item_keys`}
                        item={item}
                        type="storelist"
                      />
                    );
                  })}
                </View>
              ) : inputValue?.trim().length > 0 &&
                filteredStoreResults.length === 0 ? (
                <NoDataFound isDisplay={false} />
              ) : (
                <View style={commonStyles.listGridWrapper}>
                  {product_list?.data?.map((item: any, index: number) => (
                    <ProductItem
                      key={`${index}_product_item_keys`}
                      item={item}
                      type="storelist"
                    />
                  ))}
                </View>
              )
            ) : (
              !isLoading && <NoDataFound />
            )}
            <LoadMore />
          </ScrollView>

          <FloatingOptions
            onChange={openModalHandler}
            type="product"
            value={''}
            count={count}
          />
        </>
      )}
      <PrimaryModal
        payload={screenParams?.category_id}
        isVisible={showCatModal}
        onClose={closeModalHandler.bind(null, 'category')}
        type="other_category"
        onChange={handleOtherCategory}
      />
      <FilterModal
        selectedFilter={selectFilter}
        onMount={data => setCount(data?.filter_count ?? 0)}
        payload={{
          seller_store_id: screenParams?.seller_store_id ?? seller_store_id,
          category_id: screenParams?.category_id ?? category_id,
          subCategoryIdArr: subCatID,
        }}
        type="product_list"
        isVisible={showFilterModal}
        onClose={closeModalHandler.bind(null, 'filter')}
        onApply={handleFilterApply}
      />
      <SortModal
        selectedSortFilter={selectedSorting}
        type="product_list"
        isVisible={showSortModal}
        onClose={closeModalHandler.bind(null, 'sort')}
        onApply={handleSortApply}
      />
      <View style={storeDetailsStyles.shareView}>
        {store_details?.seller_store?.whatsapp_visible_on_store === 'on' && (
          <TouchableOpacity
            style={storeDetailsStyles.whatsappButton}
            activeOpacity={0.8}
            onPress={clickCount}>
            <Image
              style={storeDetailsStyles.whatsappImage}
              source={images.icWhatsapp}
            />
          </TouchableOpacity>
        )}
        {store_details && (
          <TouchableOpacity
            style={storeDetailsStyles.shareButton}
            activeOpacity={0.8}
            onPress={shareStore}>
            {/* () => contactWithWhatsApp(store_details?.seller_store?.whatsapp_number) */}
            <Image
              style={storeDetailsStyles.shareImage}
              source={images.share}
            />
          </TouchableOpacity>
        )}
      </View>
    </Background>
  );
};
