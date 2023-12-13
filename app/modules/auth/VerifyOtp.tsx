import {FC, useState} from 'react';
import {CommonNavigationProps} from '../../types/navigationTypes';
import {TouchableOpacity, Platform, Keyboard, View} from 'react-native';
import {colors, verifyOtpStyles} from '../../styles';
import {PrimaryButton, PrimaryText} from '../../components';
import {strings} from '../../i18n';
import {
  verifyUpdateProfileAPI,
  registerResendAPI,
  updateProfileResendAPI,
  verifyFrontUserAPI,
} from '../../services/authServices';
import OTPTextInput from 'react-native-otp-textinput';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux';
import AuthBackground from './AuthBackground';
import OTPInputView from '@twotalltotems/react-native-otp-input';

export const VerifyOtp: FC<CommonNavigationProps> = ({navigation, route}) => {
  const [code, setCode] = useState<any>('');
  const [valid, setValid] = useState<boolean>(false);
  const {verify_key, flowType, mobile, email} = route.params;

  const fcmToken = useSelector((state: RootState) => state?.generic?.fcmToken);

  const otpVerify = () => {
    if (flowType === 'signUp') {
      verifyFrontUserAPI({
        verify_key: verify_key,
        OTP: code,
        email: email,
        device_type: Platform.OS,
        device_id: fcmToken ?? '1234',
        isCredentialKey: 1,
      });
    } else if (flowType === 'update') {
      verifyUpdateProfileAPI(
        {
          verify_key: verify_key,
          OTP: code,
          new_email: email,
          new_mobile: mobile,
          isCredentialKey: 1,
        },
        navigation,
      );
    }
    Keyboard.dismiss();
  };

  const resendOtp = () => {
    if (flowType === 'signUp') {
      registerResendAPI({
        mobile_no: mobile,
      });
    } else if (flowType === 'update') {
      updateProfileResendAPI({
        email: email,
        mobile_no: mobile,
      });
    }
  };

  return (
    <AuthBackground
      title={strings.ctVerifyOTP}
      onBack={() => {
        navigation.goBack();
      }}>
      <View style={{flexGrow: 1}}>
        {Platform.OS === 'android' ? (
          <OTPTextInput
            handleTextChange={(otp: any) => {
              setCode(otp);
              setValid(otp?.length === 4);
            }}
            containerStyle={verifyOtpStyles.otpView}
            textInputStyle={verifyOtpStyles.underlineStyleBase}
            inputCount={4}
            inputCellLength={1}
            testIDPrefix="otpInput"
            tintColor={colors.primary}
            offTintColor={colors.primary}
          />
        ) : (
          <OTPInputView
            style={verifyOtpStyles.otpView}
            pinCount={4}
            autoFocusOnLoad
            codeInputFieldStyle={verifyOtpStyles.underlineStyleBase}
            selectionColor={colors.primary}
            onCodeFilled={code => {
              setCode(code);
              setValid(code?.length === 4);
            }}
          />
        )}

        <TouchableOpacity
          activeOpacity={0.8}
          testID="btnResend"
          style={verifyOtpStyles.btnResend}
          onPress={resendOtp}>
          <PrimaryText testID="txtResend" style={verifyOtpStyles.txtResend}>
            {strings.ctResendOTP}
          </PrimaryText>
        </TouchableOpacity>

        <PrimaryButton
          testID={'verify'}
          disabled={!valid}
          addMargin={'8%'}
          onPress={() => otpVerify()}
          title={strings.btVerify}
        />
      </View>
    </AuthBackground>
  );
};
