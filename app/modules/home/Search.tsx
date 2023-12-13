/* eslint-disable react-native/no-inline-styles */
import {FC, useCallback, useEffect, useRef, useState} from 'react';
import {View, TouchableOpacity, Image, Text} from 'react-native';
import {CommonNavigationProps} from '../../types/navigationTypes';
import {
  Background,
  FilterModal,
  FloatingOptions,
  LoadMore,
  NoDataFound,
  PrimaryHeader,
  PrimaryModal,
  ProductItem,
  StoreItem,
} from '../../components';
import {colors, commonStyles, searchStyles} from '../../styles';
import {images, screenName} from '../../core';
import {strings} from '../../i18n';
import {FlatList, TextInput} from 'react-native-gesture-handler';
import {universalSearchAPI} from '../../services';
import {useSelector} from 'react-redux';
import {RootState, dispatch} from '../../redux';
import {
  setSearchStoreData,
  setSortList,
  setStoreFilterList,
  setSubCategoryLisCategoryData,
} from '../../redux/modules/homeSlice';
import {universalProductSearchAPI} from '../../services/homeServices';
import {SortModal} from '../../components/SortModal';

export const Search: FC<CommonNavigationProps> = ({navigation}) => {
  /************ Hooks Functions ************/
  const coords = useSelector(
    (state: RootState) => state?.generic?.myLocation?.coords,
  );
  const Product_data = useSelector(
    (state: RootState) => state.home.SearchProductData,
  );
  const Search_data = useSelector(
    (state: RootState) => state.home.SearchStoreData,
  );
  const isLoading = useSelector(
    (state: RootState) => state.generic.loader.isLoading,
  );
  let [currentPage] = useState(1);
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<any>(null);
  const [selectedSegment, setSelectedSegment] = useState('product');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showCatModal, setShowCatModal] = useState(false);
  const [showSortModal, setShowSortModal] = useState(false);
  const [count, setCount] = useState(0);
  const [screenParams, setScreenParams] = useState<any>({category_id: null});
  const [selectedSorting, setSelectedSorting] = useState(false);
  const [selectFilter, setSelectedFilter] = useState(false);
  const isApiCalled = useRef<any>();
  isApiCalled.current = false;
  /************ Main Functions ************/

  useEffect(() => {
    dispatch(setSearchStoreData(null));
    setTimeout(() => {
      inputRef?.current?.focus();
    }, 100);
  }, []);

  const handleSegmentPress = async (segmentIndex: string) => {
    setCount(0);
    setSelectedSegment(segmentIndex);
    isApiCalled.current = true;
    if (selectedSegment === 'store') {
      dispatch(setSortList([]));
      dispatch(setSubCategoryLisCategoryData([]));
    } else {
      dispatch(setStoreFilterList([]));
      setScreenParams({
        category_id: null,
      });
    }
    if (inputValue !== '' && coords.latitude && coords.longitude) {
      currentPage = 1;
      const payload = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        search: inputValue,
        page: currentPage,
      };
      if (segmentIndex === 'store') {
        universalSearchAPI(payload, 'search');
      } else {
        universalProductSearchAPI(payload, 'search');
      }
    }
  };

  const onPressStoreItemHandler = useCallback(
    (item: any) => {
      navigation.navigate(screenName.storeDetails, {
        category_id: item?.category_id,
        seller_store_id: item?.id,
      });
    },
    [navigation],
  );

  const renderItem = ({item, index}: any) =>
    selectedSegment === 'store' ? (
      <StoreItem
        item={item}
        testID={`${index}`}
        floatingValue={'grid'}
        onPress={onPressStoreItemHandler.bind(null, item)}
        category_id={item?.category_id}
        seller_store_id={item?.id}
        idSellerStore={item?.seller_store_id}
        seller_store_address_id={
          item?.seller_store_categories?.[0]?.seller_store_address_id
        }
      />
    ) : (
      <ProductItem item={item} type="normal" />
    );

  const onInputChange = (txt: string) => {
    setInputValue(txt);
    if (txt?.length > 0 && coords.latitude && coords.longitude) {
      currentPage = 1;
      if (selectedSegment === 'store') {
        const payload = {
          search: txt,
          latitude: coords.latitude,
          longitude: coords.longitude,
          categoryIdArr:
            screenParams?.category_id === null
              ? ''
              : [screenParams?.category_id],
          store_rating: screenParams?.store_rating,
          sellerStoreIdArr: screenParams?.sellerStoreIdArr,
          page: currentPage,
        };

        universalSearchAPI(payload, 'search');
      } else {
        const payload = {
          search: txt,
          latitude: coords.latitude,
          longitude: coords.longitude,
          sort_by: screenParams?.sort_by,
          product_rating: screenParams?.product_rating,
          categoryIdArr: screenParams?.category_id,
          subCategoryIdArr: screenParams?.subCategory_id,
          sellerStoreIdArr: screenParams?.brand_id,
          page: currentPage,
        };
        universalProductSearchAPI(payload, 'search');
      }
    }
  };

  const handleLoadMore = async () => {
    if (inputValue?.length > 0 && coords.latitude && coords.longitude) {
      if (selectedSegment === 'store') {
        if (
          Search_data?.seller_store_addresses.data?.length <
          Search_data?.seller_store_addresses.total
        ) {
          const payload = {
            search: inputValue,
            latitude: coords.latitude,
            longitude: coords.longitude,
            categoryIdArr: [screenParams?.category_id],
            store_rating: screenParams?.store_rating,
            sellerStoreIdArr: screenParams?.sellerStoreIdArr,
            page: currentPage + 1,
          };
          universalSearchAPI(payload, 'loading_more');
        }
      } else {
        if (
          Product_data?.seller_store_addresses.data.length <
          Product_data?.seller_store_addresses.total
        ) {
          const payload = {
            search: inputValue,
            latitude: coords.latitude,
            longitude: coords.longitude,
            sort_by: screenParams?.sort_by,
            product_rating: screenParams?.product_rating,
            categoryIdArr: screenParams?.category_id,
            subCategoryIdArr: screenParams?.subCategory_id,
            sellerStoreIdArr: screenParams?.brand_id,
            page: currentPage + 1,
          };
          universalProductSearchAPI(payload, 'loading_more');
        }
      }
    }
  };

  const handleFilterApply = (data: any) => {
    setCount(data.filter_count);
    setSelectedFilter(data?.filter_count > 0);
    currentPage = 1;
    if (selectedSegment === 'store') {
      currentPage = 1;

      const payload = {
        latitude: coords.latitude,
        longitude: coords.longitude,
        store_rating: data.rating,
        sellerStoreIdArr: data.seller_store_id,
        search: inputValue,
        page: currentPage,
      };

      setScreenParams({
        latitude: coords.latitude,
        longitude: coords.longitude,
        store_rating: data.rating,
        sellerStoreIdArr: data.seller_store_id,
        search: inputValue,
        page: currentPage,
      });

      universalSearchAPI(payload, 'search');
    } else {
      currentPage = 1;
      const payload = {
        ...screenParams,
        product_rating: data.product_rating,
        categoryIdArr: data.category_id,
        subCategoryIdArr: data.subCategory_id,
        sellerStoreIdArr: data.brand_id,
        search: inputValue,
        page: currentPage,
      };

      setScreenParams({
        ...screenParams,
        product_rating: data.product_rating,
        categoryIdArr: data.category_id,
        subCategoryIdArr: data.subCategory_id,
        sellerStoreIdArr: data.brand_id,
        search: inputValue,
        page: currentPage,
      });

      universalProductSearchAPI(payload, 'search');
    }
  };

  const handleSortApply = (data: any) => {
    setSelectedSorting(data?.sort_by?.length > 0);
    currentPage = 1;

    const payload = {
      latitude: coords.latitude,
      longitude: coords.longitude,
      sort_by: data.sort_by,
      search: inputValue,
      page: currentPage,
    };

    setScreenParams({
      latitude: coords.latitude,
      longitude: coords.longitude,
      sort_by: data.sort_by,
      search: inputValue,
      page: currentPage,
    });

    universalProductSearchAPI(payload);
  };

  const handleOtherCategory = (id: any) => {
    currentPage = 1;
    const payload = {
      latitude: coords.latitude,
      longitude: coords.longitude,
      categoryIdArr: id === null ? '' : [id],
      page: currentPage,
      search: inputValue,
    };

    setScreenParams({
      latitude: coords.latitude,
      longitude: coords.longitude,
      category_id: id,
      page: currentPage,
      search: inputValue,
    });

    universalSearchAPI(payload);
  };

  return (
    <Background>
      <View style={searchStyles.headerIconView}>
        <View style={searchStyles.headerIcon}>
          <PrimaryHeader left="back" />
        </View>
        <View style={searchStyles.searchView}>
          <TextInput
            ref={inputRef}
            style={searchStyles.inputStyles}
            placeholder={strings.ctSearchStores}
            placeholderTextColor={colors.greyText}
            onChangeText={txt => onInputChange(txt)}
            value={inputValue}
          />
          {inputValue?.length > 0 && (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => onInputChange('')}>
              <Image style={commonStyles.icon53} source={images.icClose} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={searchStyles.container}>
        <TouchableOpacity
          activeOpacity={0.8}
          testID={'product'}
          style={[
            searchStyles.segmentButton,
            selectedSegment === 'product' && searchStyles.selectedSegment,
          ]}
          onPress={() => handleSegmentPress('product')}>
          <Text
            style={[
              searchStyles.segmentText,
              selectedSegment === 'product' && searchStyles.selectedText,
            ]}>
            Products
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          testID={'store'}
          style={[
            searchStyles.segmentButton,
            selectedSegment === 'store' && searchStyles.selectedSegment,
          ]}
          onPress={() => handleSegmentPress('store')}>
          <Text
            style={[
              searchStyles.segmentText,
              selectedSegment === 'store' && searchStyles.selectedText,
            ]}>
            Stores
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        contentContainerStyle={searchStyles.contentContainerStyle}
        columnWrapperStyle={searchStyles.columnWrapperStyle}
        data={
          selectedSegment === 'store'
            ? inputValue?.length > 0
              ? Search_data?.seller_store_addresses.data
              : []
            : inputValue?.length > 0
            ? Product_data?.seller_store_addresses.data
            : []
        }
        numColumns={2}
        onEndReached={handleLoadMore}
        ListFooterComponent={<LoadMore />}
        ListEmptyComponent={
          isLoading ? null : selectedSegment === 'store' ? (
            <NoDataFound
              label={
                inputValue?.length > 0
                  ? Search_data?.seller_store_addresses?.data
                    ? strings.msgSearchGuide
                    : 'Result not found'
                  : strings.msgSearchGuide
              }
            />
          ) : (
            <NoDataFound
              label={
                inputValue?.length > 0
                  ? Product_data?.seller_store_addresses?.data
                    ? strings.msgSearchProductGuide
                    : 'Result not found'
                  : strings.msgSearchProductGuide
              }
            />
          )
        }
        keyExtractor={(item, index) => `${index}_Search_keys`}
        renderItem={renderItem}
      />

      <FloatingOptions
        onChange={value =>
          value === 'filter'
            ? setShowFilterModal(true)
            : selectedSegment === 'store'
            ? setShowCatModal(true)
            : setShowSortModal(true)
        }
        type={selectedSegment === 'store' ? 'storeSearch' : 'product'}
        value={''}
        count={count}
      />

      <PrimaryModal
        payload={screenParams?.category_id}
        isVisible={showCatModal}
        onClose={() => setShowCatModal(false)}
        type="other_category"
        onChange={handleOtherCategory}
      />

      <FilterModal
        selectedFilter={selectFilter}
        payload={{
          seller_store_id: screenParams?.seller_store_id,
          category_id: screenParams?.category_id,
        }}
        type={selectedSegment === 'store' ? 'store_list' : 'productSearch_list'}
        isVisible={showFilterModal}
        onClose={() => setShowFilterModal(false)}
        onApply={(data: any) => {
          handleFilterApply(data);
        }}
      />

      <SortModal
        selectedSortFilter={selectedSorting}
        type="productSearch_list"
        isVisible={showSortModal}
        onClose={() => setShowSortModal(false)}
        onApply={data => {
          handleSortApply(data);
        }}
      />
    </Background>
  );
};
