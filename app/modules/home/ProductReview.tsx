/* eslint-disable react-hooks/exhaustive-deps */
import React, {FC, useEffect, useState} from 'react';
import {FlatList, Image, View} from 'react-native';
import {fonts, productReviewStyles} from '../../styles';
import {
  Background,
  LoadMore,
  NoDataFound,
  PrimaryHeader,
  PrimaryText,
  Rating,
} from '../../components';
import moment from 'moment';
import {images, isRefreshing} from '../../core';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux';
import {productRatingReviewAPI} from '../../services';
import {CommonNavigationProps} from '../../types/navigationTypes';

export const ProductReview: FC<CommonNavigationProps> = ({route}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const {product_id = ''} = route.params;
  const product_review = useSelector(
    (state: RootState) => state.home.productReview,
  );

  useEffect(() => {
    if (
      !product_review?.data ||
      (product_review?.data && product_review?.data?.length === 0)
    ) {
      getReviewList();
    }
  }, []);

  const getReviewList = async () => {
    const payload = {
      product_id: product_id,
      page: currentPage,
    };
    productRatingReviewAPI(payload);
  };

  const handleRefresh = async () => {
    const payload = {
      product_id: product_id,
      page: 1,
    };
    setCurrentPage(1);
    productRatingReviewAPI(payload, 'refreshing');
  };

  const handleLoadMore = async () => {
    if (product_review?.data?.length < product_review?.total) {
      const payload = {
        product_id: product_id,
        page: currentPage + 1,
      };
      setCurrentPage(currentPage + 1);
      productRatingReviewAPI(payload, 'loading_more');
    }
  };

  const renderItem = ({item, index}: any) => (
    <View
      style={productReviewStyles.reviewItemWrapper}
      testID={`${index}_reviewItem`}>
      <View
        style={productReviewStyles.reviewTopItemWrapper}
        testID={`${index}_reviewTopItem`}>
        <Image
          style={productReviewStyles.icon52}
          source={images.dummyProfileGrey}
        />
        <View
          style={productReviewStyles.reviewTopItemMiddleWrapper}
          testID={`${index}_reviewTopItemMiddle`}>
          <PrimaryText style={productReviewStyles.reviewerName}>
            {item?.user?.first_name + ' ' + item?.user?.last_name}
          </PrimaryText>
          <Rating
            style={productReviewStyles.reviewerRating}
            size="small"
            disabled
            value={item?.rating}
          />
        </View>
        <PrimaryText style={productReviewStyles.reviewedDate}>
          {moment(item?.created_at).format('DD/MM/YYYY')}
        </PrimaryText>
      </View>
      <PrimaryText style={fonts.regular12}>{item?.comment}</PrimaryText>
    </View>
  );

  return (
    <Background>
      <PrimaryHeader left="back" title="Ratings & Reviews" />
      <FlatList
        contentContainerStyle={productReviewStyles.contentContainerStyle}
        data={product_review?.data}
        refreshing={isRefreshing()}
        onRefresh={handleRefresh}
        ListFooterComponent={<LoadMore />}
        ListEmptyComponent={<NoDataFound />}
        keyExtractor={(item, index) => `${index}_review_keys`}
        renderItem={renderItem}
      />
    </Background>
  );
};
