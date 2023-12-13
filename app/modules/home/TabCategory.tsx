/* eslint-disable react-hooks/exhaustive-deps */
import { useIsFocused, useScrollToTop } from '@react-navigation/native';
import { FC, memo, useCallback, useEffect, useRef, useState } from 'react';
import { FlatList, View } from 'react-native';
import { useSelector } from 'react-redux';
import {
  Background,
  NoDataFound,
  PrimaryHeader,
  SearchInput,
  SubCategoryItem
} from '../../components';
import { getTabSafeAreaHeight, screenName } from '../../core';
import { strings } from '../../i18n';
import { RootState, dispatch } from '../../redux';
import { setCatSafeArea } from '../../redux/modules/genericSlice';
import { setFilterList, setStoreDetail } from '../../redux/modules/homeSlice';
import { categoriesWithSubCategoriesDataAPI } from '../../services/homeServices';
import { commonStyles, tabCategoryStyles } from '../../styles';
import { CommonNavigationProps } from '../../types/navigationTypes';

// let filteredCategoryResults: any = [];
export const TabCategory: FC<CommonNavigationProps> = memo(({navigation}) => {
  /************ Hooks Functions ************/
  const categoryWithSubCategory = useSelector(
    (state: RootState) => state?.home?.categoryWithSubCategory,
  );
  const isLoading = useSelector(
    (state: RootState) => state?.generic?.loader?.isLoading,
  );

  const isFocused = useIsFocused();
  const [isSearch, setIsSearch] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [filteredCategoryResults, setFilteredCategoryResults] = useState<any>(
    [],
  );

  const checkComponentFocused = useCallback(async () => {
    dispatch(setCatSafeArea(isFocused));
  }, [isFocused]);

  const scrollViewRef = useRef<any>();

  useScrollToTop(
    useRef({
      scrollToTop: () =>
        scrollViewRef.current.scrollToOffset({offset: 0, animated: true}),
    }),
  );

  useEffect(() => {
    checkComponentFocused();
  }, [isFocused]);

  useEffect(() => {
    categoriesWithSubCategoriesDataAPI();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setInputValue('');
      setIsSearch(false);
    });
    return unsubscribe;
  }, [navigation]);

  /************ Main Functions ************/

  const onInputChange = useCallback(
    (txt: string) => {
      setInputValue(txt);
      const result = categoryWithSubCategory
        ?.map((item: any) => {
          const subCatArr = item?.sub_category?.filter((x: any) =>
            x?.sub_category_name?.toLowerCase()?.includes(txt?.toLowerCase()),
          );
          if (item?.category_name?.toLowerCase().includes(txt?.toLowerCase())) {
            return item;
          } else if (subCatArr?.length) {
            return {...item, sub_category: subCatArr};
          } else {
            return null;
          }
        })
        ?.filter((x: any) => x);
      setFilteredCategoryResults([...result]);
    },
    [categoryWithSubCategory],
  );

  const onPressSubCategoryHandler = useCallback(
    (item: any) => {
      dispatch(setFilterList([]));
      dispatch(setStoreDetail(null));
      navigation.navigate(screenName.stores, {
        category_id: item?.category_id,
        sub_category_id: item?.id,
        category_name: item?.sub_category_name,
      });
    },
    [navigation],
  );

  const onPressCategoryHandler = useCallback(
    (item: any) => {
      dispatch(setFilterList([]));
      dispatch(setStoreDetail(null));
      navigation.navigate(screenName.stores, {
        category_id: item?.id,
        category_name: item?.category_name,
      });
    },
    [navigation],
  );


  const listEmptyComponentHandler = useCallback(() => {
    return categoryWithSubCategory?.length > 0 && inputValue?.length > 0 ? (
      <NoDataFound label={'Result not found'} isDisplay={false} />
    ) : (
      !isLoading && (
        <View style={tabCategoryStyles.noFoundView}>
          <NoDataFound label={strings.ctServiceNotAvailable} />
        </View>
      )
    );
  }, [categoryWithSubCategory, inputValue, isLoading]);

  const onDetailSearchHandler = useCallback(() => {
    setIsSearch(prev => !prev);
  }, []);

  return (
    <Background>
      <View
        style={[commonStyles.flex1, {paddingBottom: getTabSafeAreaHeight()}]}>
        <PrimaryHeader
          left="location"
          right="search_plus_menu"
          searchType="category"
          screen_from="category"
          onDetailSearch={onDetailSearchHandler}
        />

        {isSearch ? (
          <SearchInput
            inputValue={inputValue}
            onChangeText={onInputChange}
            onPressClose={onInputChange.bind(null, '')}
          />
        ) : null}

        <FlatList
          ref={scrollViewRef}
          data={
            categoryWithSubCategory?.length > 0 && inputValue?.length > 0
              ? filteredCategoryResults
              : categoryWithSubCategory
          }
          renderItem={(item)=><SubCategoryItem data={item} 
           onPressCategory={onPressCategoryHandler.bind(null, item.item)}
           onPressSubCategory={onPressSubCategoryHandler} />}
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={tabCategoryStyles.contentContainerStyle}
          ListEmptyComponent={listEmptyComponentHandler}
        />
      </View>
    </Background>
  );
});
