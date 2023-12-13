/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-hooks/exhaustive-deps */
import {FC, useCallback, useEffect} from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  View,
  TouchableOpacity,
  Platform
} from 'react-native';
import Modal from 'react-native-modal';
import {colors, commonStyles, fonts} from '../styles';
import {images} from '../core';
import {FilterModalProps} from '../types/components';
import {PrimaryText} from './PrimaryText';
import {brandListForFilterAPI, filterVariationAPI} from '../services';
import {PrimaryButton} from './PrimaryButton';
import {strings} from '../i18n';
import {useSelector} from 'react-redux';
import {RootState, dispatch} from '../redux';
import {
  setAppendSubCategoryData,
  setFilterList,
  setStoreFilterList,
  setSubCategoryLisCategoryData
} from '../redux/modules/homeSlice';
import {subCategoryListCategoryAPI} from '../services/homeServices';
const ratingObj = {
  name: 'Rating',
  type: 'rating',
  option_list: [
    {
      name: '5 Stars',
      value: 5,
    },
    {
      name: '4 & above',
      value: 4,
    },
    {
      name: '3 & above',
      value: 3,
    },
    {
      name: '2 & above',
      value: 2,
    },
    {
      name: '1 & above',
      value: 1,
    },
  ],
};

const priceObj = {
  name: 'Price',
  type: 'price',
  option_list: [
    {
      name: `${strings.currency}0 to ${strings.currency}500`,
      price_from: 0,
      price_to: 500,
    },
    {
      name: `${strings.currency}500 to ${strings.currency}1,000`,
      price_from: 500,
      price_to: 1000,
    },
    {
      name: `${strings.currency}1,000 to ${strings.currency}5,000`,
      price_from: 1000,
      price_to: 5000,
    },
    {
      name: `${strings.currency}5,000 to ${strings.currency}10,000`,
      price_from: 5000,
      price_to: 10000,
    },
    {
      name: `${strings.currency}10,000 to ${strings.currency}50,000`,
      price_from: 10000,
      price_to: 50000,
    },
  ],
};

export const FilterModal: FC<FilterModalProps> = ({
  onClose,
  isVisible,
  type,
  payload,
  onApply,
  onMount,
  selectedFilter
}) => {
  /************* Hooks Functions *************/
  const filterList = useSelector((state: RootState) => state?.home?.filterList);
  const storeFilterList = useSelector(
    (state: RootState) => state?.home?.storeFilterList,
  );
  const subCategoryByCategoryList = useSelector(
    (state: RootState) => state?.home?.SubCategoryListByCategoryData,
  );
  const category_list = useSelector(
    (state: RootState) => state.home?.homeData?.category_list,
  );

  useEffect(() => {
    if (
      isVisible &&
      payload &&
      type === 'product_list' &&
      filterList?.length === 0
    ) {
      getFilterVariation();
    } else if (
      isVisible &&
      payload &&
      type === 'store_list' &&
      storeFilterList?.length === 0
    ) {
      getBrandList();
    } else if (
      isVisible &&
      payload &&
      type === 'productSearch_list' &&
      (subCategoryByCategoryList === null ||
        subCategoryByCategoryList?.length === 0)
    ) {
      getBrandList();
    }
  }, [isVisible, storeFilterList, filterList, subCategoryByCategoryList]);

  useEffect(() => {
    onMount ? onMount({filter_count: isClear()}) : null;
  }, [filterList?.length]);

  useEffect(() => {
   isClear()>0 && type==='product_list'?handleApply():null 
  },[])

  /************* Main Functions *************/

  const getSubCategoryByCategory = async (data: any) => {
    const idArray: any = [];
    data.forEach((ele: any) => {
      if (ele.type === 'Category') {
        ele.option_list.forEach((item: any) => {
          if (item.isSelected) {
            idArray.push(item.id);
          }
        });
      }
    });
    const payload = {
      category_id_arr: idArray,
    };
    const subCategoryData = await subCategoryListCategoryAPI(payload);

    if (subCategoryData) {
      let newObj = {
        name: 'SubCategory',
        type: 'subCategory',
        option_list: subCategoryData,
      };
      dispatch(setAppendSubCategoryData(newObj));
    } else {
      dispatch(setAppendSubCategoryData(null));
    }
  };

  const getFilterVariation = async () => {
    const filterVariation = await filterVariationAPI(payload);
    if (filterVariation) {
      dispatch(setFilterList([ratingObj, priceObj, ...filterVariation]));
    }
  };

  const getBrandList = async () => {
    const brands = await brandListForFilterAPI(payload);
    if (brands) {
      let newObj = {
        name: 'Brands',
        type: type === 'productSearch_list' ? 'brandSearch' : 'brands',
        option_list: brands,
      };
      if (type === 'productSearch_list') {
        let newCatObj = {
          name: 'Category',
          type: 'Category',
          option_list: category_list,
        };
        dispatch(setSubCategoryLisCategoryData([ratingObj, newObj, newCatObj]));
      } else {
        dispatch(setStoreFilterList([ratingObj, newObj]));
      }
    }
  };

  const handleItemSelect =
    (passedIndex: number, passedSubIndex: number, selectedType: any) => () => {
      const newArray: any = (
        type === 'product_list'
          ? filterList
          : type === 'productSearch_list'
          ? subCategoryByCategoryList
          : storeFilterList
      ).map((item: any, index: number) =>
        passedIndex === index
          ? {
              ...item,
              option_list: item?.option_list?.map((itm: any, idx: number) =>
                item?.type === 'rating' || item?.type === 'price'
                  ? {
                      ...itm,
                      isSelected: passedSubIndex === idx && !itm?.isSelected,
                    }
                  : {
                      ...itm,
                      isSelected:
                        passedSubIndex === idx
                          ? !itm?.isSelected
                          : itm?.isSelected,
                    },
              ),
            }
          : item,
      );
      dispatch(
        type === 'product_list'
          ? setFilterList(newArray)
          : type === 'productSearch_list'
          ? setSubCategoryLisCategoryData(newArray)
          : setStoreFilterList(newArray),
      );
      if (type === 'productSearch_list') {
        if (selectedType === 'Category') {
          getSubCategoryByCategory(newArray);
        }
      }
    };

  const handleApply = () => {
    let product_rating: number = 0;
    let rating: number = 0;
    let filter_variation_arr: number[] = [];
    let seller_store_id: any[] = [];
    let brand_id: any[] = [];
    let price_from: any = null;
    let price_to: any = null;
    let category_id: any = [];
    let subCategory_id: any[] = [];

    (type === 'product_list'
      ? filterList
      : type === 'productSearch_list'
      ? subCategoryByCategoryList
      : storeFilterList
    )?.forEach((item: any) =>
      item?.option_list?.forEach((itm: any) => {
        if (item?.type === 'rating' && itm?.isSelected) {
          type === 'product_list' || type === 'productSearch_list'
            ? (product_rating = itm?.value)
            : (rating = itm?.value);
        } else if (item?.type === 'price' && itm?.isSelected) {
          price_from = itm?.price_from;
          price_to = itm?.price_to;
        } else if (item?.type === 'brands' && itm?.isSelected) {
          seller_store_id.push(itm?.id);
        } else if (!item?.type && itm?.isSelected) {
          filter_variation_arr.push(itm?.product_variation_option_id);
        } else if (item?.type === 'Category' && itm?.isSelected) {
          category_id.push(itm?.id);
        } else if (item?.type === 'subCategory' && itm?.isSelected) {
          subCategory_id.push(itm?.id);
        } else if (item?.type === 'brandSearch' && itm?.isSelected) {
          brand_id.push(itm?.id);
        }
      }),
    );

    onApply(
      type === 'product_list'
        ? {
            product_rating,
            filter_variation_arr,
            price_from,
            price_to,
            filter_count: isClear(),
          }
        : type === 'productSearch_list'
        ? {
            product_rating,
            filter_variation_arr,
            brand_id,
            category_id,
            subCategory_id,
            filter_count: isClear(),
          }
        : {
            rating,
            seller_store_id,
            filter_count: isClear(),
          },
    );
    onClose();
  };

  const isClear = useCallback(() => {
    const fl_selected = filterList
      .flatMap(item => {
        return item.option_list;
      })
      .filter(option => option.isSelected);
    const sfl_selected = storeFilterList
      .flatMap(item => {
        return item.option_list;
      })
      .filter(option => option.isSelected);
    const sCat_selected = subCategoryByCategoryList
      ?.flatMap((item: any) => {
        return item?.option_list;
      })
      .filter((option: any) => option?.isSelected);

    const count: number =
      type === 'product_list'
        ? fl_selected.length
        : type === 'productSearch_list'
        ? sCat_selected?.length
        : sfl_selected.length;

    return count;
  }, [filterList, storeFilterList, subCategoryByCategoryList, type]);
  
  return (
    <Modal
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      isVisible={isVisible}
      style={styles.modalView}>
      <View style={styles.mainView} testID={`FilterModelMainView`}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onClose}
          hitSlop={commonStyles.hitSlop}
          style={styles.dropdownWrapper}
          testID={`FilterModelClose`}>
          <Image
            style={commonStyles.icon15}
            source={images.icDropDownBlur}
            testID={`FilterModelDropDownIcon`}
          />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          disabled={!isClear()}
          onPress={() => {
            onApply(
              type === 'product_list'
                ? {
                    product_rating: 0,
                    filter_variation_arr: [],
                    price_from: null,
                    price_to: null,
                  }
                : type === 'productSearch_list'
                ? {
                    product_rating: 0,
                    filter_variation_arr: [],
                    brand_id: [],
                    category_id: [],
                    subCategory_id: [],
                  }
                : {
                    rating: 0,
                    seller_store_id: [],
                  },
            );
            onClose();
            dispatch(
              type === 'product_list'
                ? setFilterList([])
                : type === 'productSearch_list'
                ? setSubCategoryLisCategoryData([])
                : setStoreFilterList([]),
            );
          }}
          hitSlop={commonStyles.hitSlop}
          style={styles.btnClear}
          testID={`FilterModelClear`}>
          <PrimaryText
            style={{opacity: !isClear() ? 0.5 : 1}}
            testID={`FilterModelTextClear`}>
            {strings.btClear}
          </PrimaryText>
        </TouchableOpacity>

        <FlatList
          showsVerticalScrollIndicator={false}
          data={
            type === 'product_list'
              ? filterList
              : type === 'productSearch_list'
              ? subCategoryByCategoryList
              : storeFilterList
          }
          renderItem={({item, index}: any) => (
            <View
              style={styles.itemWrapper}
              testID={`${index}_filter_ModelItem`}>
              <PrimaryText style={styles.txtHeading}>{item?.name}</PrimaryText>
              {item?.option_list?.map((itm: any, idx: number) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleItemSelect(index, idx, item.type)}
                  style={styles.itemSubWrapper}
                  key={`${idx}_filter_sub_item_key`}
                  testID={`${idx}_filter_sub_item_key`}>
                  <Image
                    style={styles.imgCheck}
                    source={itm?.isSelected ? images.icCheck : images.icUncheck}
                  />
                  <PrimaryText
                    style={{marginTop: Platform.OS === 'ios' ? 5 : 0}}
                    testID={`${idx}_itmName`}>
                    {itm?.name ??
                      itm?.brand_name ??
                      itm?.category_name ??
                      itm?.sub_category_name}
                  </PrimaryText>
                </TouchableOpacity>
              ))}
            </View>
          )}
          keyExtractor={(item, index) => `${index}_filter_item_keys`}
          ItemSeparatorComponent={() => <Separator />}
        />

        <PrimaryButton
          disabled={selectedFilter ? false : !isClear()}
          addMargin={15}
          onPress={handleApply}
          title={strings.btApply}
          testID={'filterApplyButton'}
        />
      </View>
    </Modal>
  );
};

const Separator: FC = () => {
  return <View style={styles.separator} />;
};

const styles = StyleSheet.create({
  modalView: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  mainView: {
    width: '100%',
    paddingHorizontal: '5%',
    paddingVertical: '4%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: colors.white,
    maxHeight: '80%',
  },
  dropdownWrapper: {
    alignSelf: 'center',
  },
  btnClear: {
    alignSelf: 'flex-end',
  },
  itemWrapper: {
    width: '100%',
    paddingHorizontal: '2%',
    marginTop: '3%',
    paddingBottom: '4%',
  },
  txtHeading: {
    ...fonts.medium16,
    color: colors.primary,
  },
  itemSubWrapper: {
    ...commonStyles.horizontalCenterStyles,
    marginTop: '2%',
  },
  imgCheck: {
    ...commonStyles.icon15,
    tintColor: colors.blackText,
    marginRight: '2%',
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: colors.borderColor,
  },
});
