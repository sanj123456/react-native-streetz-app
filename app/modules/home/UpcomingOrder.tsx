/* eslint-disable react-hooks/exhaustive-deps */
import {FC, useCallback, useState} from 'react';
import {
  FlatList,
  Image,
  TouchableOpacity,
  View
} from 'react-native';
import {colors, commonStyles, fonts, upcomingOrderStyles} from '../../styles';
import {
  Background,
  LoadMore,
  NoDataFound,
  PrimaryHeader,
  PrimaryText
} from '../../components';
import {CommonNavigationProps} from '../../types/navigationTypes';
import {strings} from '../../i18n';
import {getOrderStatus, images, isRefreshing, screenName} from '../../core';
import {orderHistoryAPI} from '../../services';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux';
import moment from 'moment';
import {useFocusEffect} from '@react-navigation/native';

export const UpcomingOrder: FC<CommonNavigationProps> = ({navigation}) => {
  /*********** Hook Functions **********/
  const isLoading = useSelector(
    (state: RootState) => state?.generic?.loader?.isLoading,
  );
  const upcomingOrders = useSelector(
    (state: RootState) => state?.order?.upcomingOrders,
  );

  const [params, setParams] = useState({
    page: 1,
    is_upcoming: 0,
  });

  useFocusEffect(
    useCallback(() => {
      getOrderHistory();
    }, [navigation]),
  );

  /*********** Main Functions **********/

  const getOrderHistory = async () => {
    const payload = {
      ...params,
      page: 1,
    };
    setParams(payload);
    orderHistoryAPI(payload);
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
    if (upcomingOrders?.data?.length < upcomingOrders?.total && !isLoading) {
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
      <PrimaryHeader
        left="back"
        title={strings.ctUpcomingOrder}
        right="home_plus_menu"
      />
      <FlatList
        refreshing={isRefreshing()}
        onRefresh={handleRefresh}
        contentContainerStyle={upcomingOrderStyles.contentContainerStyle}
        data={upcomingOrders?.data}
        keyExtractor={(item, index) => `${index}_order_history_keys`}
        renderItem={({item, index}) => (
          <View
            style={upcomingOrderStyles.orderDetailsWrapper}
            testID={`${index}_order_history_View`}>
            <View
              style={commonStyles.horizontalBetweenStyles}
              testID={`${index}_order_history_SubView`}>
              <View
                style={upcomingOrderStyles.leftView}
                testID={`${index}_order_history_usernameView`}>
                <PrimaryText style={upcomingOrderStyles.userName}>
                  {item?.seller_store_address?.store_name}
                </PrimaryText>
                <View style={commonStyles.horizontalCenterStyles}>
                  <Image style={commonStyles.icon12} source={images.icPin} />
                  <PrimaryText
                    props={{numberOfLines: 1}}
                    style={upcomingOrderStyles.txtLocation}>
                    {item?.seller_store_address?.address_landmark ??
                      item?.seller_store_address?.address}
                  </PrimaryText>
                </View>
              </View>
              <View style={upcomingOrderStyles.rightView} testID={`${index}_order_number`}>
                <PrimaryText style={fonts.medium12}>
                  {item?.order_number}
                </PrimaryText>
                <PrimaryText
                  style={[upcomingOrderStyles.txtStatusGreen,{
                    color:
                      getOrderStatus(item?.status)?.id === 6
                        ? colors.wishRed
                        : colors.greenBg,
                  }]}>
                  {`${item?.status}\n${moment(item?.updated_at).format(
                    'DD/MM/YYYY',
                  )}`}
                </PrimaryText>
              </View>
            </View>
            <PrimaryText
              style={upcomingOrderStyles.txtItemsInclude}
              testID={`${index}_txtItemsInclude`}>
              {strings.ctItemsInclude}
            </PrimaryText>

            <View style={commonStyles.horizontalBetweenStyles}>
              <View style={upcomingOrderStyles.leftProductView}>
                {item?.order_items.map((itm: any, idx: number) => (
                  <PrimaryText
                    key={`${idx}_product_item_keys`}
                    testID={`${idx}_product_item_keys`}
                    props={{numberOfLines: 1}}
                    style={upcomingOrderStyles.txtProduct}>
                    {itm?.quantity} X {itm?.product?.product_name}
                  </PrimaryText>
                ))}
              </View>
              <PrimaryText style={upcomingOrderStyles.txtPrice} testID={'txtFinalPrice'}>
                {strings.currency} {item?.final_price}
              </PrimaryText>
            </View>
            <View
              style={commonStyles.horizontalBetweenStyles}
              testID={'txtFinalPrice'}>
              <View style={upcomingOrderStyles.txtButtonWrapper}>
                <TouchableOpacity
                  activeOpacity={0.8}
                  testID={'BtnTimeToDelivery'}
                  onPress={() =>
                    navigation.navigate(screenName.timeToDelivery, {
                      orderID: item?.id,
                    })
                  }>
                  <PrimaryText style={upcomingOrderStyles.txtButton}>
                    {strings.ctViewOrderDetail}
                  </PrimaryText>
                </TouchableOpacity>
                {getOrderStatus(item?.status)?.id === 5 &&
                  item?.is_feedback_provide === 0 && (
                    <TouchableOpacity
                      testID={'BtnReviewNow'}
                      activeOpacity={0.8}>
                      <PrimaryText style={upcomingOrderStyles.txtButton}>
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
