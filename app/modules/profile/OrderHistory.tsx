/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useState } from 'react';
import {
  FlatList,
  Image,
  TouchableOpacity,
  View
} from 'react-native';
import { colors, commonStyles, fonts, orderHistoryStyles } from '../../styles';
import {
  Background,
  LoadMore,
  NoDataFound,
  PrimaryHeader,
  PrimaryText
} from '../../components';
import { CommonNavigationProps } from '../../types/navigationTypes';
import { strings } from '../../i18n';
import { getOrderStatus, images, isRefreshing, screenName } from '../../core';
import { orderHistoryAPI } from '../../services';
import { useSelector } from 'react-redux';
import { RootState, dispatch } from '../../redux';
import moment from 'moment';
import {
  setRatingOrderID,
  setShowRatingModal
} from '../../redux/modules/orderSlice';

export const OrderHistory: FC<CommonNavigationProps> = ({ navigation }) => {
  /*********** Hook Functions **********/
  const orderHistory = useSelector(
    (state: RootState) => state?.order?.orderHistory,
  );
  const isLoading = useSelector(
    (state: RootState) => state?.generic?.loader?.isLoading,
  );

  const [params, setParams] = useState({
    page: 1,
    is_upcoming: 0,
  });
  useEffect(() => {
    getOrderHistory();
  }, []);

  /*********** Main Functions **********/

  const getOrderHistory = async () => {
    orderHistoryAPI(params);
  };

  const handleRefresh = async () => {
    const payload = {
      ...params,
      page: 1,
    };
    setParams(payload);
    orderHistoryAPI(payload, 'refreshing');
  };

  const handleLoadMore = async () => {
    if (orderHistory?.data?.length < orderHistory?.total && !isLoading) {
      const payload = {
        ...params,
        page: params?.page + 1,
      };
      setParams(payload);
      orderHistoryAPI(payload, 'loading_more');
    }
  };

  return (
    <Background>
      <PrimaryHeader left="back" title={strings.ctOrderHistory} />
      <FlatList
        refreshing={isRefreshing()}
        onRefresh={handleRefresh}
        contentContainerStyle={orderHistoryStyles.contentContainerStyle}
        data={orderHistory?.data}
        keyExtractor={(item, index) => `${index}_order_history_keys`}
        renderItem={({ item, index }) => (
          <View
            style={orderHistoryStyles.orderDetailsWrapper}
            testID={`${index}_orderDetailView`}>
            <View
              style={commonStyles.horizontalBetweenStyles}
              testID={`${index}_orderDetailView`}>
              <View style={orderHistoryStyles.leftView}>
                <PrimaryText
                  style={orderHistoryStyles.userName}
                  testID={`${index}_orderDetailStoreName`}>
                  {item?.seller_store_address?.store_name}
                </PrimaryText>
                <View
                  style={commonStyles.horizontalCenterStyles}
                  testID={`${index}_orderDetailPinView`}>
                  <Image
                    style={commonStyles.icon12}
                    source={images.icPin}
                    testID={`${index}_orderDetailIcPin`}
                  />
                  <PrimaryText
                    testID={`${index}_orderDetailAddress`}
                    props={{ numberOfLines: 1 }}
                    style={orderHistoryStyles.txtLocation}>
                    {item?.seller_store_address?.address_landmark ??
                      item?.seller_store_address?.address}
                  </PrimaryText>
                </View>
              </View>
              <View
                style={orderHistoryStyles.rightView}
                testID={`${index}_orderDetailOrderNo`}>
                <PrimaryText
                  style={fonts.medium12}
                  testID={`${index}_orderDetailTextOrderNo`}>
                  {item?.order_number}
                </PrimaryText>
                <PrimaryText
                  testID={`${index}_orderDetailStatus`}
                  style={{
                    ...orderHistoryStyles.txtStatusGreen,
                    color:
                      getOrderStatus(item?.status)?.id === 6
                        ? colors.wishRed
                        : colors.greenBg,
                  }}>
                  {`${item?.status}\n${moment(item?.updated_at).format(
                    'DD/MM/YYYY',
                  )}`}
                </PrimaryText>
              </View>
            </View>
            <PrimaryText
              style={orderHistoryStyles.txtItemsInclude}
              testID={`${index}_orderDetailItemInclude`}>
              {strings.ctItemsInclude}
            </PrimaryText>

            <View style={commonStyles.horizontalBetweenStyles}>
              <View style={orderHistoryStyles.leftProductView}>
                {item?.order_items.map((itm: any, idx: number) => (
                  (itm?.status !== 'Cancelled' || item?.status === 'Order Cancelled') && <PrimaryText
                    key={`${idx}_product_item_keys`}
                    testID={`${idx}_product_item_keys`}
                    props={{ numberOfLines: 1 }}
                    style={orderHistoryStyles.txtProduct}>
                    {itm?.quantity} X {itm?.product?.product_name}
                  </PrimaryText>
                ))}
              </View>
              <PrimaryText style={orderHistoryStyles.txtPrice} testID={'txtPrice'}>
                {strings.currency} {item?.final_price_after_accepted ? item?.final_price_after_accepted : item?.final_price}
              </PrimaryText>
            </View>
            <View
              style={commonStyles.horizontalBetweenStyles}
              testID={'timeToDeliveryView'}>
              <View style={orderHistoryStyles.txtButtonWrapper}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  testID={'timeToDelivery'}
                  onPress={() =>
                    navigation.navigate(screenName.timeToDelivery, {
                      orderID: item?.id,
                    })
                  }>
                  <PrimaryText
                    style={orderHistoryStyles.txtButton}
                    testID={'TxtViewOrderDetail'}>
                    {strings.ctViewOrderDetail}
                  </PrimaryText>
                </TouchableOpacity>
                {getOrderStatus(item?.status)?.id === 5 &&
                  item?.is_feedback_provide === 0 && (
                    <TouchableOpacity
                      activeOpacity={0.8}
                      testID={'ShowRatingModal'}
                      style={{ marginLeft: 10 }}
                      onPress={() => {
                        dispatch(setRatingOrderID(item?.id));
                        dispatch(setShowRatingModal(true));
                      }}>
                      <PrimaryText
                        style={orderHistoryStyles.txtButton}
                        testID={'BtnReviewNow'}>
                        {strings.ctReviewNow}
                      </PrimaryText>
                    </TouchableOpacity>
                  )}
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                testID={'BtnHelp'}
                onPress={() => navigation.navigate(screenName.help)}>
                <Image style={commonStyles.icon28} source={images.icHelp} />
              </TouchableOpacity>
            </View>
          </View>
        )}
        onEndReachedThreshold={0.2}
        ListFooterComponent={<LoadMore />}
        ListEmptyComponent={<NoDataFound />}
        onEndReached={handleLoadMore}
      />
    </Background>
  );
};