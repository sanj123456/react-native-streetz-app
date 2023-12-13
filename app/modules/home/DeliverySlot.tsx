/* eslint-disable react-native/no-inline-styles */
import moment from 'moment';
import {FC, useEffect, useState} from 'react';
import {Image, SafeAreaView, TouchableOpacity, View} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSelector} from 'react-redux';
import {
  Background,
  PrimaryButton,
  PrimaryHeader,
  PrimaryText,
} from '../../components';
import {errorToast, getNext7DaysDates, images} from '../../core';
import {strings} from '../../i18n';
import {RootState, dispatch} from '../../redux';
import {setDeliveryTime} from '../../redux/modules/cartSlice';
import {checkDeliveryAvailAPI, deliveryTimeSlotAPI} from '../../services';
import {colors, commonStyles, deliverySlotStyles, fonts} from '../../styles';
import {CommonNavigationProps} from '../../types/navigationTypes';

export const DeliverySlot: FC<CommonNavigationProps> = ({
  navigation,
  route,
}) => {
  /*************** Hooks Functions ***************/
  const deliveryTimeSlot = useSelector(
    (state: RootState) => state.home.DeliveryTimeSlotData,
  );

  const myCart = useSelector((state: RootState) => state?.cart?.myCart);
  const deliveryTime = useSelector(
    (state: RootState) => state?.cart?.deliveryTime,
  );

  const [selectedSlot, setSelectedSlot] = useState<any>(null);
  const [dates, setDates] = useState<any[]>([]);
  const [selectedDate, setSelectedDates] = useState<any>({});

  const getDeliveryTimeSlotAPI = async (date: any) => {
    const payload = {
      date: date,
      is_gift_slots: myCart.totalPrice.is_gift,
      seller_store_address_id: myCart.seller_store_address_id,
    };
    const res: any = await deliveryTimeSlotAPI(payload);
    if (res && deliveryTime?.delivery_time_slot_id) {
      const slot = res?.find(
        (item: any) => item?.id === deliveryTime?.delivery_time_slot_id,
      );

      setSelectedSlot({...slot, date});
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      let newArray = getNext7DaysDates();
      if (deliveryTime?.date) {
        newArray = newArray.map((dateObj: any) => ({
          ...dateObj,
          isSelected:
            deliveryTime?.date === moment(dateObj?.date).format('DD-MM-YYYY'),
        }));
        getDeliveryTimeSlotAPI(deliveryTime?.date);
      } else {
        getDeliveryTimeSlotAPI(moment().format('DD-MM-YYYY'));
      }

      setDates(newArray);
    });
    return unsubscribe;
  }, [deliveryTime, navigation, getDeliveryTimeSlotAPI]);

  useEffect(() => {
    setSelectedDates(() => dates?.find(date => date?.isSelected)?.date);
  }, [dates]);

  const handleSelectedDate = async (index: any) => {
    const updatedDates = dates.map((dateObj, i) => ({
      ...dateObj,
      isSelected: i === index,
    }));
    let updatedSelectDate = updatedDates?.find(item => item?.isSelected)?.date;
    setSelectedDates(updatedSelectDate);
    setDates(updatedDates);
    await getDeliveryTimeSlotAPI(
      moment(updatedSelectDate).format('DD-MM-YYYY'),
    );
    if (selectedSlot) {
      const res = await checkDeliveryAvailAPI({
        type: 1,
        date: moment(updatedSelectDate).format('DD-MM-YYYY'),
        delivery_time_slot_id: selectedSlot?.id,
      });
      if (!res) {
        setSelectedSlot(null);
      }
    }
  };

  const handleSlotSelection = (passedItem: any) => async () => {
    const slotDate = moment(selectedDate).format('DD-MM-YYYY');
    const res = await checkDeliveryAvailAPI({
      type: 1,
      date: slotDate,
      delivery_time_slot_id: passedItem?.id,
    });
    if (res) {
      setSelectedSlot({...passedItem});
    }
  };

  const isSlotDisabled = (startTime: string, isClosed: any) => {
    const slotDate = moment(selectedDate).format('DD-MM-YYYY');
    const momentSlot = moment(`${slotDate} ${startTime}`, 'DD-MM-YYYY hh:mmA');
    const momentCurrent = moment();
    const diff = momentSlot.diff(momentCurrent, 'seconds');
    if (diff < 0 || isClosed) {
      return true;
    }
    return false;
  };

  const handleContinue = async () => {
    if (selectedSlot) {
      const slotDate = moment(selectedDate).format('DD-MM-YYYY');
      const payload = {
        type: 1,
        date: slotDate,
        delivery_time_slot_id: selectedSlot?.id,
        time: `, ${selectedSlot?.start_time} to ${selectedSlot?.end_time}`,
        dateObj: moment(selectedDate).format('MM-DD-YYYY'),
      };
      const res = await checkDeliveryAvailAPI(payload);
      if (res) {
        dispatch(setDeliveryTime(payload));
        navigation.goBack();
      }
    } else {
      errorToast('Please select time slot.');
    }
  };

  return (
    <Background>
      <PrimaryHeader title={strings.ctDeliveryTimeSlot} left="back" />
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={deliverySlotStyles.contentContainerStyle}
        testID={'ScrollViewDeliverySlot'}>
        <View
          style={deliverySlotStyles.calendarWrapper}
          testID={'CalendarWrapper'}>
          <View style={commonStyles.horizontalBetweenStyles}>
            <PrimaryText
              style={{width: '62%', ...fonts.regular16}}
              testID={'BestAvailableTime'}>
              {strings.ctSelectYourBestAvailableTime}
            </PrimaryText>

            <TouchableOpacity
              activeOpacity={0.8}
              style={deliverySlotStyles.btnMonthYear}
              testID={'btnMonthYear'}>
              <PrimaryText
                style={deliverySlotStyles.txtMonthYear}
                testID={'txtMonthYear'}>
                {moment(dates?.find(date => date?.isSelected)?.date).format(
                  'MMM YYYY',
                )}
              </PrimaryText>
            </TouchableOpacity>
          </View>

          <View
            style={deliverySlotStyles.weekDaysWrapper}
            testID={'weekDaysWrapper'}>
            {dates?.map((item, index) => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => handleSelectedDate(index)}
                style={deliverySlotStyles.weekItem}
                key={`${index}_week_day_keys`}
                testID={`${index}_week_day_keys`}>
                <View
                  style={{
                    ...deliverySlotStyles.weekCircle,
                    borderWidth: item.isSelected === true ? 0 : 1,
                    backgroundColor:
                      item.isSelected === true
                        ? colors.primary
                        : colors.transparent,
                  }}>
                  <PrimaryText
                    style={{
                      ...fonts.medium16,
                      color:
                        item.isSelected === true
                          ? colors.white
                          : colors.blackText,
                    }}>
                    {moment(item.date, 'DD/MM/YYYY').format('DD')}
                  </PrimaryText>
                </View>
                <PrimaryText style={deliverySlotStyles.txtWeekDay}>
                  {moment(item.date, 'DD/MM/YYYY').format('ddd')}
                </PrimaryText>
              </TouchableOpacity>
            ))}
          </View>

          <View
            style={deliverySlotStyles.timeSlotTopWrapper}
            testID={'TimeSlot'}>
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() =>
                getDeliveryTimeSlotAPI(moment().format('DD-MM-YYYY'))
              }
              testID={'PressDeliveryTimeSlot'}>
              <Image style={commonStyles.icon28} source={images.icReset} />
            </TouchableOpacity>
          </View>

          <View style={deliverySlotStyles.timeSlotWrapper}>
            {deliveryTimeSlot?.map((item: any, index: number) => {
              return item?.is_gift_slots === 'yes' &&
                myCart?.totalPrice?.is_gift === 'no' ? null : (
                <TouchableOpacity
                  activeOpacity={0.8}
                  disabled={isSlotDisabled(item?.start_time, item.is_close)}
                  onPress={handleSlotSelection(item)}
                  style={{
                    ...deliverySlotStyles.timeSlotItem,
                    backgroundColor: isSlotDisabled(
                      item?.start_time,
                      item.is_close,
                    )
                      ? colors.greyText
                      : item?.id === selectedSlot?.id
                      ? colors.primary
                      : colors.blackText,
                  }}
                  key={`${index}_slot_item`}
                  testID={`${index}_slot_item`}>
                  <PrimaryText
                    style={{
                      ...fonts.regular14,
                      color: colors.white,
                    }}>
                    {item?.start_time + ' to ' + item?.end_time}
                  </PrimaryText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </KeyboardAwareScrollView>

      <PrimaryButton
        style={deliverySlotStyles.btnContinue}
        title={strings.btContinue}
        onPress={handleContinue}
        testID={'btnContinue'}
      />
      <SafeAreaView />
    </Background>
  );
};
