/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import {FC, useCallback, useEffect, useRef, useState} from 'react';
import {Keyboard, Text, View} from 'react-native';
import {colors, commonStyles} from '../../styles';
import {
  Background,
  FieldInput,
  PrimaryButton,
  PrimaryHeader,
  PrimaryText,
} from '../../components';
import {strings} from '../../i18n';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {CommonNavigationProps} from '../../types/navigationTypes';
import {useNavigation} from '@react-navigation/native';
import {addAddressAPI, updateAddressAPI} from '../../services/addressServices';
import {addressValidationSchema} from '../../core/formikValidationsSchema';
import {Formik} from 'formik';
import {FieldPlaces} from '../../components/FieldPlaces';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux';
import {consoleHere, decryptData, errorToast, images} from '../../core';
import AddressTypeTab from '../../components/AddressTypeTab';
import {addAddressStyles} from '../../styles';

const initialValues = {
  name: '',
  mobile_no: '',
  address_line_1: '',
  address_line_2: '',
  city: '',
  state: '',
  country: '',
  pincode: '',
  address_label: '',
  address_tag: '',
};

export const AddAddress: FC<CommonNavigationProps> = ({navigation, route}) => {
  const formikRef = useRef<any>(null);
  const nav = useNavigation();
  const profileData = useSelector(
    (state: RootState) => state.profile?.profileData,
  );
  const addressData = useSelector(
    (state: RootState) => state.address?.addressData,
  );
  const randomData: any = useSelector(
    (state: RootState) => state?.generic?.randomData,
  );
  const [location, setLocation] = useState({
    latitude: '',
    longitude: '',
    formattedAddress: '',
  });
  const itemData = route?.params?.item;
  const [, updateState] = useState('');
  const [addressType, setAddressType] = useState('');
  const handleForceUpdate = useCallback(() => updateState('Update'), []);
  const [isCallApi, setIsCallApi] = useState(false);

  useEffect(() => {
    consoleHere({itemData});
    initialValues.name = itemData?.name || '';
    // initialValues.mobile_no = decryptData(
    //   JSON?.parse(profileData?.mobile_no),
    //   randomData?.gp,
    // );
    initialValues.mobile_no = itemData?.mobile_no.toString() || '';
    initialValues.address_line_1 = itemData?.address_line_1 || '';
    initialValues.address_line_2 = itemData?.address_line_2 || '';
    initialValues.city = itemData?.city || '';
    initialValues.state = itemData?.state || '';
    initialValues.country = itemData?.country || '';
    initialValues.pincode = itemData?.pincode.toString() || '';
    initialValues.address_label = itemData?.address_label || '';
    initialValues.address_tag = itemData?.address_tag || 'other';
    setAddressType(itemData?.address_tag ?? 'other');
    setLocation({
      latitude: itemData?.latitude ?? '',
      longitude: itemData?.longitude ?? '',
      formattedAddress: itemData?.address_line_1 ?? '',
    });
  }, [itemData]);

  useEffect(() => {
    const unsubscribe = nav.addListener('focus', () => {
      if (formikRef?.current) {
        setIsCallApi(false);
        formikRef.current.resetForm();
        formikRef.current.setErrors({});
      }
    });
    return unsubscribe;
  }, [navigation, initialValues]);

  const saveAddressHandler = (values: any) => {
    const isDefault = addressData.length === 0 ? 1 : 0;
    if (isCallApi === false) {
      setIsCallApi(true);
      addAddressAPI(
        {
          name: values.name,
          mobile_no: values.mobile_no,
          address_line_1: location.formattedAddress,
          address_line_2: values.address_line_2,
          city: values.city,
          state: values.state,
          country: values.country,
          pincode: values.pincode,
          address_label: values.address_label,
          address_tag: values.address_tag,
          latitude: location.latitude,
          longitude: location.longitude,
          is_default: isDefault,
        },
        navigation,
      );
      Keyboard.dismiss();
    }
  };
  const updateAddressHandler = (values: any) => {
    updateAddressAPI(
      {
        id: itemData?.id,
        name: values.name,
        mobile_no: values.mobile_no,
        address_line_1: location.formattedAddress || values.address_line_1,
        address_line_2: values.address_line_2,
        city: values.city,
        state: values.state.split(' ').join(''),
        country: values.country,
        pincode: values.pincode,
        address_label: values.address_label,
        address_tag: values.address_tag,
        latitude: location.latitude,
        longitude: location.longitude,
      },
      navigation,
    );
    Keyboard.dismiss();
  };

  function handleLocation(addressInfo: any) {
    const addressComponent = addressInfo.addressComponent;
    formikRef.current?.setFieldValue(
      'address_line_1',
      addressInfo.formattedAddress,
    );
    let pincode = '';
    addressComponent.forEach((element: any) => {
      if (
        element?.types[0] === 'postal_code' &&
        element?.short_name?.length > 0
      ) {
        pincode = element.long_name;
      } else if (
        element?.types[0] === 'country' &&
        element?.short_name?.length > 0
      ) {
        formikRef.current?.setFieldValue('country', element.long_name);
      } else if (
        element?.types[0] === 'administrative_area_level_1' &&
        element?.short_name?.length > 0
      ) {
        formikRef.current?.setFieldValue('state', element.long_name);
      } else if (
        element?.types[0] === 'administrative_area_level_3' &&
        element?.short_name?.length > 0
      ) {
        formikRef.current?.setFieldValue('city', element.long_name);
      }
    });
    formikRef.current?.setFieldValue('pincode', pincode);
    setLocation({
      latitude: addressInfo.location.latitude,
      longitude: addressInfo.location.longitude,
      formattedAddress: addressInfo.formattedAddress,
    });
  }

  const validateLocation = () => {
    if (location?.latitude && location?.longitude) {
      return true;
    }
    errorToast('Please select proper landmark.', '', 'top');
    return false;
  };

  useEffect(() => {
    if (!itemData) {
      initialValues.name = profileData?.first_name || '';
      initialValues.mobile_no = decryptData(
        JSON?.parse(profileData?.mobile_no),
        randomData?.gp,
      );
      // profileData?.mobile_no?.toString() || '';
      handleForceUpdate();
    }
  }, []);

  const onSelectTab = useCallback((value: any) => {
    setAddressType(value);

    formikRef.current?.setFieldValue('address_tag', value);
  }, []);

  return (
    <Background>
      <PrimaryHeader left="back" title={strings.ctAddNewAddress} />
      <Formik
        innerRef={formikRef}
        initialValues={initialValues}
        validationSchema={addressValidationSchema}
        onSubmit={values => {
          if (validateLocation()) {
            itemData
              ? updateAddressHandler(values)
              : saveAddressHandler(values);
          }
        }}>
        {({values, errors, touched, handleChange, handleSubmit}) => {
          return (
            <KeyboardAwareScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={addAddressStyles.contentContainerStyle}>
              <View style={addAddressStyles.horizontalView}>
                <View style={addAddressStyles.fieldWrapperFifty}>
                  <FieldInput
                    testID={'name'}
                    value={values.name}
                    onChangeText={handleChange('name')}
                    placeholder={strings.ctName}
                    inputViewStyles={{
                      ...addAddressStyles.inputViewStyles,
                      paddingHorizontal: '10%',
                    }}
                    inputStyles={addAddressStyles.inputStyles}
                    highlight
                    keyboardType="email-address"
                  />
                  {errors.name && touched.name && (
                    <View style={addAddressStyles.errorViewFifty}>
                      <PrimaryText
                        testID={'nameError'}
                        style={commonStyles.errorText}>
                        {errors.name}
                      </PrimaryText>
                    </View>
                  )}
                </View>
                <View style={addAddressStyles.fieldWrapperFifty}>
                  <FieldInput
                    testID={'mobileNo'}
                    value={values.mobile_no}
                    // defaultValue={values.mobile_no}
                    onChangeText={handleChange('mobile_no')}
                    placeholder={strings.ctMobileNumber}
                    inputViewStyles={{
                      ...addAddressStyles.inputViewStyles,
                      paddingHorizontal: '10%',
                    }}
                    inputStyles={addAddressStyles.inputStyles}
                    highlight
                    maxLength={10}
                    keyboardType="number-pad"
                  />
                  {errors.mobile_no && touched.mobile_no && (
                    <View style={addAddressStyles.errorView}>
                      <PrimaryText
                        testID={'mobileNoError'}
                        style={commonStyles.errorText}>
                        {errors.mobile_no}
                      </PrimaryText>
                    </View>
                  )}
                </View>
              </View>
              <FieldPlaces
                testID={'address_line_1'}
                placeholder={strings.ctSelectAddress}
                inputViewStyles={addAddressStyles.inputViewStyles}
                inputStyles={addAddressStyles.inputStyles}
                initialValue={initialValues.address_line_1}
                handleLocation={handleLocation}
                locationType="location"
              />
              {errors.address_line_1 && touched.address_line_1 && (
                <View style={addAddressStyles.errorView}>
                  <PrimaryText
                    testID={'addressOneError'}
                    style={commonStyles.errorText}>
                    {errors.address_line_1}
                  </PrimaryText>
                </View>
              )}
              <FieldInput
                testID={'addressOne'}
                value={values.address_line_2}
                onChangeText={handleChange('address_line_2')}
                placeholder={strings.ctExactAddress}
                inputViewStyles={addAddressStyles.inputViewStyles}
                highlight
                inputStyles={addAddressStyles.inputStyles}
                keyboardType="email-address"
              />
              {errors.address_line_2 && touched.address_line_2 && (
                <View style={addAddressStyles.errorView}>
                  <PrimaryText
                    testID={'addressOneError'}
                    style={commonStyles.errorText}>
                    {errors.address_line_2}
                  </PrimaryText>
                </View>
              )}

              <View style={addAddressStyles.horizontalView}>
                <View style={addAddressStyles.fieldWrapperFifty}>
                  <FieldInput
                    testID={'city'}
                    value={values.city}
                    onChangeText={handleChange('city')}
                    placeholder={strings.ctCity}
                    inputViewStyles={{
                      ...addAddressStyles.inputViewStyles,
                      paddingHorizontal: '10%',
                    }}
                    inputStyles={addAddressStyles.inputStyles}
                    highlight
                    keyboardType="email-address"
                  />
                  {errors.city && touched.city && (
                    <View style={addAddressStyles.errorView}>
                      <PrimaryText
                        testID={'cityError'}
                        style={commonStyles.errorText}>
                        {errors.city}
                      </PrimaryText>
                    </View>
                  )}
                </View>
                <View style={addAddressStyles.fieldWrapperFifty}>
                  <FieldInput
                    testID={'state'}
                    value={values.state}
                    onChangeText={handleChange('state')}
                    placeholder={strings.ctState}
                    inputViewStyles={{
                      ...addAddressStyles.inputViewStyles,
                      paddingHorizontal: '10%',
                    }}
                    inputStyles={addAddressStyles.inputStyles}
                    highlight
                    keyboardType="email-address"
                  />
                  {errors.state && touched.state && (
                    <View style={addAddressStyles.errorView}>
                      <PrimaryText
                        testID={'stateError'}
                        style={commonStyles.errorText}>
                        {errors.state}
                      </PrimaryText>
                    </View>
                  )}
                </View>
              </View>

              <View style={addAddressStyles.horizontalView}>
                <View style={addAddressStyles.fieldWrapperFifty}>
                  <FieldInput
                    testID={'country'}
                    value={values.country}
                    onChangeText={handleChange('country')}
                    placeholder={strings.ctCountry}
                    inputViewStyles={{
                      ...addAddressStyles.inputViewStyles,
                      paddingHorizontal: '10%',
                    }}
                    inputStyles={addAddressStyles.inputStyles}
                    highlight
                    keyboardType="email-address"
                  />
                  {errors.country && touched.country && (
                    <View style={addAddressStyles.errorView}>
                      <PrimaryText
                        testID={'countryError'}
                        style={commonStyles.errorText}>
                        {errors.country}
                      </PrimaryText>
                    </View>
                  )}
                </View>
                <View style={addAddressStyles.fieldWrapperFifty}>
                  <FieldInput
                    testID={'pinCode'}
                    value={values.pincode}
                    onChangeText={handleChange('pincode')}
                    placeholder={strings.ctPinCode}
                    inputViewStyles={{
                      ...addAddressStyles.inputViewStyles,
                      paddingHorizontal: '10%',
                    }}
                    inputStyles={addAddressStyles.inputStyles}
                    highlight
                    keyboardType="number-pad"
                  />
                  {errors.pincode && touched.pincode && (
                    <View style={addAddressStyles.errorView}>
                      <PrimaryText
                        testID={'pinCodeError'}
                        style={commonStyles.errorText}>
                        {errors.pincode}
                      </PrimaryText>
                    </View>
                  )}
                </View>
              </View>

              <FieldInput
                testID={'addressLabel'}
                value={values.address_label}
                onChangeText={handleChange('address_label')}
                placeholder={strings.ctAddressTag}
                inputViewStyles={addAddressStyles.inputViewStyles}
                inputStyles={addAddressStyles.inputStyles}
                highlight
                keyboardType="email-address"
              />
              {errors.address_label && touched.address_label && (
                <View style={addAddressStyles.errorView}>
                  <PrimaryText
                    testID={'addressLabelError'}
                    style={commonStyles.errorText}>
                    {errors.address_label}
                  </PrimaryText>
                </View>
              )}
              {/* <FieldInput
              inputViewStyles={addAddressStyles.inputViewStyles}
              placeholder={strings.ctAddressTag}
              onChangeText={() => null}
              value=""
            /> */}
              <Text style={addAddressStyles.saveText}>
                {strings.msgSaveYourAddressAs}
              </Text>
              <View style={addAddressStyles.addressView}>
                <AddressTypeTab
                  style={{
                    backgroundColor:
                      addressType === 'home' ? colors.primary1 : colors.white,
                  }}
                  image={images.menuHome}
                  text={strings.ctHome}
                  onPress={onSelectTab.bind(null, 'home')}
                />
                <AddressTypeTab
                  style={{
                    backgroundColor:
                      addressType === 'office' ? colors.primary1 : colors.white,
                  }}
                  image={images.icOfficeBag}
                  text={strings.ctOffice}
                  onPress={onSelectTab.bind(null, 'office')}
                />
                <AddressTypeTab
                  style={{
                    backgroundColor:
                      addressType === 'other' ? colors.primary1 : colors.white,
                  }}
                  image={images.icPin}
                  text={strings.ctOther}
                  onPress={onSelectTab.bind(null, 'other')}
                />
              </View>
              {errors.address_tag && touched.address_tag && (
                <View style={addAddressStyles.errorView}>
                  <PrimaryText
                    testID={'addressOneError'}
                    style={commonStyles.errorText}>
                    {errors.address_tag}
                  </PrimaryText>
                </View>
              )}
              <PrimaryButton
                addMargin={18}
                style={addAddressStyles.btnAddAddress}
                title={
                  itemData ? strings.btUpdateAddress : strings.btAddAddress
                }
                // onPress={() => navigation.goBack()}
                onPress={handleSubmit}
              />
            </KeyboardAwareScrollView>
          );
        }}
      </Formik>
    </Background>
  );
};
