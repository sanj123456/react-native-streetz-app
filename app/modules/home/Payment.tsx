import {FC, useEffect, useState} from 'react';
import {ScrollView, View} from 'react-native';
import {
  Background,
  PaymentItem,
  PrimaryButton,
  PrimaryHeader,
  PrimaryText,
} from '../../components';
import {strings} from '../../i18n';
import {CommonNavigationProps} from '../../types/navigationTypes';
import {getPayModesAPI} from '../../services';
import {useSelector} from 'react-redux';
import {RootState, dispatch} from '../../redux';
import {PaymentItemParams} from '../../types/paramsTypes';
import {setPayMode} from '../../redux/modules/cartSlice';
import {payStyles} from '../../styles';

export const Payment: FC<CommonNavigationProps> = ({navigation}) => {
  const paymentModes = useSelector(
    (state: RootState) => state?.order?.paymentModes,
  );
  const payMode = useSelector((state: RootState) => state?.cart?.payMode);

  const [selectedMode, setSelectedMode] = useState<any>(payMode || null);

  useEffect(() => {
    getPayModesAPI();
    return () => {};
  }, []);

  const isButtonDisabled = () => {
    const result = !selectedMode;
    return result;
  };

  const handleContinue = () => {
    dispatch(setPayMode(selectedMode));
    navigation.goBack();
  };

  return (
    <Background>
      <PrimaryHeader left="back" title={strings.ctPayment} />
      {paymentModes?.length > 0 && (
        <ScrollView contentContainerStyle={payStyles.contentContainerStyle}>
          <PrimaryText style={payStyles.headingTxt}>
            {strings.ctHowWouldLikeToPay}
          </PrimaryText>
          <PrimaryText style={payStyles.descTxt}>
            {strings.ctYouWillPayBy}
          </PrimaryText>
          <View style={payStyles.listWrapper}>
            {/* {paymentModes?.map((item: PaymentItemParams, index: number) => (
              <PaymentItem
                key={`${index}_payment_option_keys`}
                item={item}
                onPress={data => setSelectedMode(data)}
                value={selectedMode?.enum}
              />
            ))} */}
          </View>
        </ScrollView>
      )}
      <PrimaryButton
        disabled={isButtonDisabled()}
        style={payStyles.btnContinue}
        title={strings.btContinue}
        onPress={handleContinue}
        testID={'btnContinue'}
      />
    </Background>
  );
};
