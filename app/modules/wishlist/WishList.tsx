/* eslint-disable react-hooks/exhaustive-deps */
import {FC, useEffect, useState} from 'react';
import {FlatList} from 'react-native';
import {
  Background,
  LoadMore,
  NoDataFound,
  PrimaryHeader,
  ProductItem
} from '../../components';
import {isRefreshing} from '../../core';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux';
import {getWishListAPI} from '../../services';
import {strings} from '../../i18n';
import { wishListStyles } from '../../styles';

export const WishList: FC = () => {
  const [currentPage, setCurrentPage] = useState(1);

  const wish_list = useSelector(
    (state: RootState) => state?.wishlist?.wishListData,
  );
  useEffect(() => {
    getWishList();
  }, []);

  const getWishList = async () => {
    const payload = {
      page: currentPage,
    };
    getWishListAPI(payload);
  };

  const handleRefresh = async () => {
    const payload = {
      page: 1,
    };
    setCurrentPage(1);
    getWishListAPI(payload, 'refreshing');
  };

  const handleLoadMore = async () => {
    if (
      wish_list?.data?.length &&
      wish_list?.total &&
      wish_list?.data?.length < wish_list?.total
    ) {
      const payload = {
        page: currentPage + 1,
      };
      setCurrentPage(currentPage + 1);
      getWishListAPI(payload, 'loading_more');
    }
  };

  return (
    <Background>
      <PrimaryHeader left="back" title={strings.ctWishList} right="menu" />
      <FlatList
        contentContainerStyle={wishListStyles.contentContainerStyle}
        columnWrapperStyle={wishListStyles.columnWrapperStyle}
        data={wish_list?.data}
        numColumns={2}
        refreshing={isRefreshing()}
        onRefresh={handleRefresh}
        onEndReached={handleLoadMore}
        ListFooterComponent={<LoadMore />}
        ListEmptyComponent={<NoDataFound />}
        keyExtractor={(item, index) => `${index}_wishlist_keys`}
        renderItem={({item}) => <ProductItem type="wishlist" item={item} />}
      />
    </Background>
  );
};


