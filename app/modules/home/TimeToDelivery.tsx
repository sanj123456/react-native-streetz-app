/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react-hooks/exhaustive-deps */
import moment from 'moment';
import { FC, useCallback, useEffect } from 'react';
import {
  Alert,
  BackHandler,
  Image,
  RefreshControl,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSelector } from 'react-redux';
import {
  AddressItem,
  Background,
  InfoIcon,
  PrimaryButton,
  PrimaryHeader,
  PrimaryText,
} from '../../components';
import {
  getOrderProgressBar,
  getOrderStatus,
  images,
  isRefreshing,
  orderStatusData,
  screenName,
  toNumber
} from '../../core';
import { strings } from '../../i18n';
import { resetNavigation } from '../../navigation/RootNavigation';
import { RootState, dispatch } from '../../redux';
import {
  setRatingOrderID,
  setShowRatingModal,
} from '../../redux/modules/orderSlice';
import { cancelOrderAPI, orderDetailsAPI } from '../../services';
import { colors, commonStyles, fonts, timeToDeliveryStyles } from '../../styles';
import { CommonNavigationProps } from '../../types/navigationTypes';

export const TimeToDelivery: FC<CommonNavigationProps> = ({
  navigation,
  route,
}) => {
  const orderID = route?.params?.orderID;
  const prevFlow = route?.params?.prevFlow;

  const appStateVisible = useSelector(
    (state: RootState) => state?.generic?.appStateVisible,
  );
  const orderDetails = useSelector(
    (state: RootState) => state?.order?.orderDetails,
  );

  useEffect(() => {
    if (appStateVisible === 'active') {
      getOrderDetails();
      calculateCanceledItemsPrice();
    }
  }, [appStateVisible, orderID]);

  useEffect(() => {
    const backAction = () => {
      if (prevFlow === 'payment' || prevFlow === 'notification') {
        resetNavigation(screenName.app);
      } else {
        navigation.goBack();
      }
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [prevFlow]);

  const getOrderDetails = async () => {
    orderDetailsAPI(orderID);
  };

  const handleRefresh = async () => {
    orderDetailsAPI(orderID, 'refreshing');
  };

  const addressObj = {
    name: orderDetails?.name,
    mobile_no: orderDetails?.mobile_no,
    address_label: orderDetails?.address_label,
    address_line_2: orderDetails?.address_line_2,
    city: orderDetails?.city,
    state: orderDetails?.state,
    country: orderDetails?.country,
    pincode: orderDetails?.pincode,
  };

  const showTimer = () => {
    const momentStart = moment(orderDetails?.start_time, 'YYYY-MM-DD HH:mm:ss');
    const momentEnd = moment(orderDetails?.end_time, 'YYYY-MM-DD HH:mm:ss');
    const momentToday = moment();
    if (
      momentStart.diff(momentToday, 'seconds') <= 0 &&
      momentEnd.diff(momentToday, 'seconds') > 0 &&
      (getOrderStatus(orderDetails?.status)?.id ?? 100) < 5
    ) {
      return true;
    } else {
      return false;
    }
  };

  const calculateTime = () => {
    if (showTimer()) {
      const futureMoment = moment(
        orderDetails?.end_time,
        'YYYY-MM-DD HH:mm:ss',
      );
      const currentMoment = moment();
      const duration = moment.duration(futureMoment.diff(currentMoment));
      const remainingHours =
        duration.hours() < 10 ? `0${duration.hours()}` : duration.hours();
      const remainingMinutes =
        duration.minutes() < 10 ? `0${duration.minutes()}` : duration.minutes();
      return `${remainingHours}:${remainingMinutes}`;
    }
  };

  const handleOrderCancel = () => {
    Alert.alert(strings.ctCancelOrder, strings.msgConfirmOrderCanceled, [
      {
        text: strings.btYesCancel,
        onPress: () => {
          cancelOrderAPI({order_id: orderDetails?.id});
        },
      },
      {text: strings.btNo},
    ]);
  };

  const calculateCanceledItemsPrice = (): number => {
    const filterData: any[] = orderDetails?.order_items?.filter(
      (item: any) => item?.status === 'Cancelled',
    );
    const itemsAmount = filterData?.reduce(
      (total, item) => total + toNumber(item?.total_price),
      0,
    );
    return itemsAmount ?? 0;
  };

  const showCanceledItemPrice = (): boolean => {
    const filterData: any[] = orderDetails?.order_items?.filter(
      (item: any) => item?.status === 'Cancelled',
    );
    return filterData?.length > 0 && orderDetails?.payment_method !== 'COD';
  };

  const totalDetails = [
    {
      label: strings.ctTotalMRP,
      value:
        orderDetails?.total_price_after_accepted ?? orderDetails?.total_price,
      type: null,
    },
    {
      label: strings.ctConvenienceFees,
      value: orderDetails?.connivance_price,
      type: 'convenience',
    },
    {
      label: strings.ctGiftWrappingFees,
      value: toNumber(orderDetails?.gift_wrapping_fee ?? 0),
      type: 'gift',
    },
    {
      label: strings.ctDeliveryFee,
      value:
        orderDetails?.coupon_code_type === 'free-delivery'
          ? orderDetails?.calculate_delivery_fee
          : orderDetails?.delivery_price,
      type: 'delivery',
    },
    {
      label: strings.ctDiscount,
      value:
        orderDetails?.discounted_price_after_accepted ??
        orderDetails?.discounted_price,
      type: 'discount',
    },
    {
      label: '',
      value: '',
      type: 'item_refund',
    },
    {
      label: strings.ctTotalAmount,
      value: orderDetails?.final_price_after_accepted
        ? toNumber(orderDetails?.final_price_after_accepted).toFixed(2)
        : toNumber(orderDetails?.final_price).toFixed(2),
      type: 'total',
    },
  ];

  const getOrderStatusID = useCallback(() => {
    return getOrderStatus(orderDetails?.status)?.id ?? 100;
  }, [orderDetails?.status]);

  const isTimeExceeded = () => {
    const momentEnd = moment(orderDetails?.end_time, 'YYYY-MM-DD HH:mm:ss');
    const momentToday = moment();
    if (momentEnd.diff(momentToday, 'seconds') < 0) {
      return true;
    } else {
      return false;
    }
  };

  return (
    <Background>
      <PrimaryHeader
        title={
          prevFlow === 'payment'
            ? strings.ctTimeToDelivery
            : strings.ctOrderDetails
        }
        screen_from={prevFlow}
        left={prevFlow === 'payment' ? 'none' : 'back'}
        right="help"
      />

      {orderDetails && (
        <>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing()}
                onRefresh={handleRefresh}
              />
            }
            contentContainerStyle={timeToDeliveryStyles.contentContainerStyle}
            testID={'timeToDeliveryScrollView'}>
            {showTimer() ? (
              <>
                <PrimaryText style={timeToDeliveryStyles.txtReceivedOrder}>
                  {strings.ctReceivingOrderIn}
                </PrimaryText>
                <PrimaryText style={timeToDeliveryStyles.txtTimeLeft}>
                  {calculateTime()}
                </PrimaryText>
              </>
            ) : getOrderStatusID() < 5 && isTimeExceeded() ? (
              <PrimaryText style={timeToDeliveryStyles.sorryMessage}>
                {
                  'We greatly appreciate your order and apologize for not meeting the promised delivery time. Rest assured, we will always strive to deliver your orders as quickly as possible.\nBest regards, Streetz.'
                }
              </PrimaryText>
            ) : null}

            <View style={timeToDeliveryStyles.barWrapper}>
              {orderStatusData
                ?.filter(item => item?.id <= 5)
                .map((item, index) => (
                  <View
                    key={`${index}_bar_keys`}
                    testID={`${index}_bar_keys`}
                    style={{
                      ...timeToDeliveryStyles.barItem,
                      backgroundColor:
                        item?.id <= getOrderProgressBar(orderDetails?.status)
                          ? colors.primary
                          : colors.background,
                    }}
                  />
                ))}
            </View>
            <View
              style={timeToDeliveryStyles.statusWrapper}
              testID={'OrderStatus'}>
              <PrimaryText style={timeToDeliveryStyles.txtStatus}>
                {orderDetails?.status}
              </PrimaryText>
              <PrimaryText style={timeToDeliveryStyles.txtStatusDesc}>
                {getOrderStatus(orderDetails?.status)?.order_desc}
              </PrimaryText>
            </View>

            <View
              style={{
                ...commonStyles.horizontalBetweenStyles,
                alignItems: 'flex-end',
              }}
              testID={'OrderDetails'}>
              <PrimaryText style={timeToDeliveryStyles.heading}>
                {strings.ctOrderDetails}
              </PrimaryText>

              {getOrderStatus(orderDetails?.status)?.id === 1 && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleOrderCancel}
                  testID={'OrderDetails'}>
                  <PrimaryText style={timeToDeliveryStyles.txtCancelBtn}>
                    {strings.ctCancelOrder}
                  </PrimaryText>
                </TouchableOpacity>
              )}
            </View>

            <View
              style={timeToDeliveryStyles.orderDetailsWrapper}
              testID={'TimeToDeliveryAddress'}>
              <View
                style={commonStyles.horizontalBetweenStyles}
                testID={'OrderDetailsAddress'}>
                <View style={timeToDeliveryStyles.leftView}>
                  <PrimaryText style={timeToDeliveryStyles.userName}>
                    {orderDetails?.seller_store_address?.store_name}
                  </PrimaryText>
                  <View style={commonStyles.horizontalCenterStyles}>
                    <Image style={commonStyles.icon12} source={images.icPin} />
                    <PrimaryText style={timeToDeliveryStyles.txtLocation}>
                      {orderDetails?.seller_store_address?.address_landmark ??
                        orderDetails?.seller_store_address?.address}
                    </PrimaryText>
                  </View>
                </View>
                <View
                  style={timeToDeliveryStyles.rightView}
                  testID={'TimeToDeliveryOrderNumber'}>
                  <PrimaryText style={fonts.medium12}>
                    {orderDetails?.order_number}
                  </PrimaryText>
                  <PrimaryText
                    style={{
                      ...timeToDeliveryStyles.txtStatusGreen,
                      color:
                        getOrderStatus(orderDetails?.status)?.id === 6
                          ? colors.wishRed
                          : colors.greenBg,
                    }}>
                    {orderDetails?.status}
                  </PrimaryText>
                </View>
              </View>
              <PrimaryText style={timeToDeliveryStyles.txtItemsInclude}>
                {strings.ctItemsInclude}
              </PrimaryText>

              {orderDetails?.order_items.map((item: any, index: number) => (
                <View
                  key={`${index}_product_item_keys`}
                  testID={`${index}_product_item_keys`}
                  style={{
                    ...commonStyles.horizontalBetweenStyles,
                    ...timeToDeliveryStyles.horizontalMargin,
                  }}>
                  <PrimaryText
                    props={{numberOfLines: 2}}
                    style={timeToDeliveryStyles.txtProduct}>
                    {item?.quantity} X {item?.product?.product_name}
                    {(getOrderStatus(orderDetails?.status)?.id ?? 0) < 6 &&
                      item?.status === 'Cancelled' && (
                        <PrimaryText
                          style={{
                            ...timeToDeliveryStyles.txtProduct,
                            color: colors.wishRed,
                          }}>
                          {' '}
                          ({strings.ctItemNotAvailable})
                        </PrimaryText>
                      )}
                  </PrimaryText>
                  <PrimaryText
                    style={{
                      ...fonts.regular12,
                      textDecorationLine:
                        (getOrderStatus(orderDetails?.status)?.id ?? 0) < 6 &&
                        item?.status === 'Cancelled'
                          ? 'line-through'
                          : 'none',
                    }}>
                    {strings.currency} {item?.total_price}
                  </PrimaryText>
                </View>
              ))}
              <View style={timeToDeliveryStyles.separatorBar} />
              {totalDetails?.map((item, index) =>
                (item?.type === 'discount' && toNumber(item?.value) === 0) ||
                (item?.type === 'convenience' && toNumber(item?.value) === 0) ||
                (item?.type === 'gift' && orderDetails?.is_gift === 'no') ||
                (item?.type === 'item_refund' &&
                  !showCanceledItemPrice()) ? null : (
                  <View
                    key={`${index}_total_details_keys`}
                    testID={`${index}_total_details_keys`}
                    style={{
                      ...commonStyles.horizontalBetweenStyles,
                      ...timeToDeliveryStyles.horizontalMargin,
                    }}>
                    <PrimaryText
                      props={{numberOfLines: 1}}
                      style={timeToDeliveryStyles.txtProduct}>
                      {item?.label}
                    </PrimaryText>
                    <View style={timeToDeliveryStyles.priceView}>
                      {item?.type === 'item_refund' && (
                        <InfoIcon msg={strings.msgRefundDays} />
                      )}
                      <PrimaryText
                        style={{
                          ...(item?.type === 'total'
                            ? timeToDeliveryStyles.txtPrice
                            : fonts.regular12),
                          color:
                            orderDetails?.coupon_code_type ===
                              'free-delivery' && item?.type === 'delivery'
                              ? colors.red
                              : colors.blackText,
                          textDecorationLine:
                            orderDetails?.coupon_code_type ===
                              'free-delivery' && item?.type === 'delivery'
                              ? 'line-through'
                              : 'none',
                        }}>
                        {(item?.type === 'discount' ||
                          item?.type === 'item_refund') &&
                          '-'}{' '}
                        {strings.currency}{' '}
                        {item?.type === 'item_refund'
                          ? calculateCanceledItemsPrice().toFixed(2)
                          : item?.value}
                      </PrimaryText>
                      {orderDetails?.coupon_code_type === 'free-delivery' &&
                        item?.type === 'delivery' && (
                          <PrimaryText
                            style={
                              fonts.regular12
                            }>{` ${strings.currency} 0.00`}</PrimaryText>
                        )}
                    </View>
                  </View>
                ),
              )}

              {(getOrderStatus(orderDetails?.status)?.id === 5 ||
                getOrderStatus(orderDetails?.status)?.id === 7 ||
                getOrderStatus(orderDetails?.status)?.id === 8 ||
                (getOrderStatus(orderDetails?.status)?.id ?? 0) > 9) && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  testID={'btnInvoice'}
                  style={timeToDeliveryStyles.btnInvoice}
                  onPress={() =>
                    navigation.navigate(screenName.invoiceView, {
                      order_id: orderDetails?.id,
                      order_number: orderDetails?.order_number,
                    })
                  }>
                  <PrimaryText style={timeToDeliveryStyles.txtInvoice}>
                    {strings.ctInvoice}
                  </PrimaryText>
                </TouchableOpacity>
              )}
            </View>

            <PrimaryText
              style={timeToDeliveryStyles.heading}
              testID={'DeliveryAddress'}>
              {strings.ctDeliveryAddress}
            </PrimaryText>

            <AddressItem type="time_to_delivery" data={addressObj} />

            {(getOrderStatus(orderDetails?.status)?.id ?? 0) >= 3 &&
              orderDetails?.delivery_partner_detail && (
                <>
                  <PrimaryText style={timeToDeliveryStyles.heading}>
                    {strings.ctDeliveryPartner}
                  </PrimaryText>
                  <View
                    style={timeToDeliveryStyles.partnerView}
                    testID={'PartnerView'}>
                    <View
                      style={timeToDeliveryStyles.partnerMainSubView}
                      testID={'partnerMainSubView'}>
                      <View
                        style={timeToDeliveryStyles.partnerSubView}
                        testID={'partnerSubView'}>
                        <PrimaryText
                          style={fonts.medium14}
                          testID={'PartnerName'}>
                          {strings.ctPartnerName}
                        </PrimaryText>
                        <PrimaryText
                          style={fonts.medium14}
                          testID={'PartnerMobile'}>
                          {strings.ctPartnerMobile}
                        </PrimaryText>
                      </View>

                      <View
                        style={timeToDeliveryStyles.partnerSubView}
                        testID={'DeliveryPersonName'}>
                        <PrimaryText>
                          {
                            orderDetails?.delivery_partner_detail
                              ?.delivery_person_name
                          }
                        </PrimaryText>
                        <PrimaryText>
                          {
                            orderDetails?.delivery_partner_detail
                              ?.delivery_person_mobile
                          }
                        </PrimaryText>
                      </View>
                    </View>
                  </View>
                </>
              )}
            {orderDetails?.order_refund &&
              orderDetails?.order_refund?.length > 0 && (
                <>
                  <PrimaryText style={timeToDeliveryStyles.heading}>
                    {strings.ctOrderRefund}
                  </PrimaryText>
                  <View style={timeToDeliveryStyles.partnerView}>
                    {orderDetails?.order_refund?.map(
                      (item: any, index: number) => (
                        <View
                          key={`${index}_refund_keys`}
                          testID={`${index}_refund_keys`}
                          style={commonStyles.horizontalBetweenStyles}>
                          <PrimaryText
                            style={{
                              ...fonts.medium14,
                              width: '60%',
                            }}>
                            {item?.description}
                          </PrimaryText>
                          <PrimaryText
                            style={{
                              ...fonts.regular14,
                              width: '38%',
                              textAlign: 'right',
                            }}>
                            {strings.currency} {item?.amount}
                          </PrimaryText>
                        </View>
                      ),
                    )}
                  </View>
                </>
              )}
          </ScrollView>

          <View style={timeToDeliveryStyles.bottomWrapper}>
            {getOrderStatus(orderDetails?.status)?.id === 5 &&
              orderDetails?.is_feedback_provide === 0 && (
                <PrimaryButton
                  testID={'ShowRatingModal'}
                  addMargin={5}
                  onPress={() => {
                    dispatch(setRatingOrderID(orderID));
                    dispatch(setShowRatingModal(true));
                  }}
                  title={strings.btReview}
                />
              )}

            <PrimaryButton
              testID={'ShopMore'}
              addMargin={5}
              onPress={() => resetNavigation(screenName.app)}
              title={strings.ctShopMore}
            />
          </View>
        </>
      )}
    </Background>
  );
};
