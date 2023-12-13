/* eslint-disable react/no-unstable-nested-components */
import {FC, useEffect, useState} from 'react';
import {
  FlatList,
  Image,
  Linking,
  Platform,
  TouchableOpacity,
  View,
} from 'react-native';
import {colors, commonStyles, fonts, helpStyles} from '../../styles';
import {
  Background,
  PrimaryHeader,
  PrimaryModal,
  PrimaryText,
  SupportModal,
} from '../../components';
import {CommonNavigationProps} from '../../types/navigationTypes';
import {strings} from '../../i18n';
import {getSupportMail, images, isRefreshing, screenName} from '../../core';
import {faqAPI} from '../../services';
import {
  orderReturnAvailableAPI,
  orderReturnRequestAPI,
} from '../../services/helpServices';
import moment from 'moment';
import {RootState} from '../../redux';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';

export const Help: FC<CommonNavigationProps> = ({route}) => {
  /*********** Hook Functions **********/

  const [screenList, setScreenList] = useState<any[]>([]);
  const [showReturnOrderModal, setShowReturnOrderModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [returnOrderList, setReturnOrderList] = useState<any>();
  const userType = useSelector((state: RootState) => state.profile.userType);
  const [orderID, setOrderID] = useState('');

  const nav = useNavigation();

  useEffect(() => {
    getAllData();
  }, []);

  const getAllData = async () => {
    const faq = await faqAPI();
    if (faq) {
      const newArray = faq?.map((item: any) => ({
        ...item,
        isOpened: false,
        type: 'normal',
      }));
      setScreenList([
        ...newArray,
        {
          question: strings.ctReturnExchange,
          isOpened: false,
          type: 'return',
          answer: null,
        },
      ]);
    }
  };

  useEffect(() => {
    const listener = nav.addListener('focus', () => {
      if (userType !== 'guest') {
        getOrderReturnData();
      }
    });

    return listener;
  }, [userType, nav]);

  const getOrderReturnData = async () => {
    const ReturnOrderData = await orderReturnAvailableAPI();
    if (ReturnOrderData) {
      setReturnOrderList(ReturnOrderData);
    }
  };

  /*********** Main Functions **********/

  const handleOpenOption = (passedIndex: number) => () => {
    const newArray = screenList.map((item, index) => ({
      ...item,
      isOpened: index === passedIndex ? !item?.isOpened : false,
    }));
    setScreenList(newArray);
  };

  const handleRefresh = async () => {
    const faq = await faqAPI('refreshing');
    if (faq) {
      const newArray = faq?.map((item: any) => ({
        ...item,
        isOpened: false,
        type: 'normal',
      }));
      setScreenList([
        ...newArray,
        {
          question: strings.ctReturnExchange,
          isOpened: false,
          type: 'return',
          answer: null,
        },
      ]);
    }
    getOrderReturnData();
  };

  const handleOrderRequest = async ({id, orderId}: any) => {
    const result = await orderReturnRequestAPI(id);
    if (result) {
      setOrderID(orderId);
      setShowReturnOrderModal(true);
    }
  };

  return (
    <Background>
      <PrimaryModal
        type="return_order"
        isVisible={showReturnOrderModal}
        onClose={() => {
          if (Platform.OS === 'android') {
            Linking.openURL(
              `mailto:${getSupportMail()}?subject=Return for order ID : ${orderID} &body= Please add issue details here, our support executive will get back to you`,
            );
            setShowReturnOrderModal(false);
          } else {
            const encodedSubject = encodeURIComponent(
              `Return for order ID : ${orderID}`,
            );

            const encodedBody = encodeURIComponent(
              'Please add issue details here, our support executive will get back to you',
            );

            Linking.openURL(
              `mailto:${getSupportMail()}?subject=${encodedSubject}&body=${encodedBody}`,
            );
            setShowReturnOrderModal(false);
          }
          getOrderReturnData();
        }}
      />
      <PrimaryHeader
        left="back"
        title={strings.ctHelp}
        right={route?.name === screenName.help ? 'none' : 'menu'}
      />
      {screenList.length > 0 && (
        <PrimaryText style={helpStyles.screenHeading}>
          {strings.ctHelpQueries}
        </PrimaryText>
      )}
      <FlatList
        contentContainerStyle={helpStyles.contentContainerStyle}
        data={screenList}
        refreshing={isRefreshing()}
        onRefresh={handleRefresh}
        keyExtractor={(item, index) => `${index}_help_keys`}
        renderItem={({item, index}: any) => (
          <View
            style={{
              ...helpStyles.itemWrapper,
              backgroundColor: item?.isOpened ? colors.primary : colors.white,
            }}>
            <TouchableOpacity
              activeOpacity={0.8}
              testID={`${index}_Option`}
              onPress={handleOpenOption(index)}
              style={helpStyles.topWrapper}>
              <PrimaryText
                style={{
                  ...fonts.medium14,
                  color: item?.isOpened ? colors.white : colors.blackText,
                }}>
                {item?.question}
              </PrimaryText>
              <Image
                style={{
                  ...commonStyles.icon18,
                  transform: [
                    {
                      rotateZ: item?.isOpened ? '180deg' : '0deg',
                    },
                  ],
                }}
                source={images.icDropDownBlur}
              />
            </TouchableOpacity>

            {item?.isOpened && item?.type === 'normal' && (
              <PrimaryText style={helpStyles.txtItem1}>
                {item?.answer}
              </PrimaryText>
            )}
            {item?.isOpened && item?.type === 'return' && (
              <View style={helpStyles.viewWrapper}>
                <PrimaryText style={helpStyles.txtOrderFrom}>
                  {strings.ctOrderFrom}
                </PrimaryText>
                {returnOrderList?.map((itm: any, idx: number) => (
                  <TouchableOpacity
                    activeOpacity={0.8}
                    testID={`${idx}_returnOrder`}
                    onPress={handleOrderRequest.bind(null, {
                      id: itm.id,
                      orderId: itm.order_number,
                    })}
                    key={`${idx}_orders_keys`}
                    style={helpStyles.orderWrapper}>
                    <View style={helpStyles.leftView}>
                      <PrimaryText style={fonts.medium14}>
                        {itm.order_number}
                      </PrimaryText>
                      <View style={commonStyles.horizontalCenterStyles}>
                        <Image
                          style={helpStyles.imgLoc}
                          source={images.icPin}
                        />
                        <PrimaryText>{itm.address_line_2}</PrimaryText>
                      </View>
                    </View>
                    <PrimaryText style={helpStyles.txtOrderTime}>
                      {`${' Delivered On'}\n${moment(itm?.updated_at).format(
                        'DD/MM/YYYY',
                      )}`}
                    </PrimaryText>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        )}
        ListFooterComponent={() => (
          <TouchableOpacity
            activeOpacity={0.8}
            testID={'btn_supportModel'}
            onPress={() => setShowSupportModal(true)}
            style={helpStyles.btnContact}>
            <PrimaryText style={helpStyles.txtContact}>
              {strings.ctContactSupport}
            </PrimaryText>
          </TouchableOpacity>
        )}
      />
      <SupportModal
        isVisible={showSupportModal}
        onClose={() => setShowSupportModal(false)}
      />
    </Background>
  );
};
