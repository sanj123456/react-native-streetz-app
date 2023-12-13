import React, {FC} from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {PrimaryText} from './PrimaryText';
import {PrimaryButton} from './PrimaryButton';
import {strings} from '../i18n';
import {colors, fonts} from '../styles';
import {NoDataFoundProps} from '../types/components';
import {images} from '../core';
import {useSelector} from 'react-redux';
import {RootState} from '../redux';

export const NoDataFound: FC<NoDataFoundProps> = ({
  label,
  buttonLabel,
  isDisplay,
  onPress,
}) => {
  const loader = useSelector(
    (state: RootState) => state?.generic?.loader.isLoading,
  );

  return (
    <View style={styles.mainView} testID={`NoDataFound`}>
      {isDisplay !== false ? (
        <Image
          style={{height: 210, width: 210}}
          source={images.icNoData}
          resizeMode="contain"></Image>
      ) : null}
      {loader === false ? (
        <PrimaryText style={styles.txtHeading} testID={`NoDataFoundText`}>
          {label ?? strings.ctNoDataFound}
        </PrimaryText>
      ) : null}
      {onPress && (
        <PrimaryButton
          style={styles.btnRetry}
          onPress={onPress}
          title={buttonLabel ?? strings.btRetry}
          testID={`NoDataFoundBtnRetry`}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },

  txtHeading: {
    ...fonts.heading16,
    color: colors.greyText,
    textAlign: 'center',
    width: '80%',
  },
  btnRetry: {
    width: '45%',
    height: 35,
    marginTop: '3%',
    backgroundColor: `${colors.primary}99`,
  },
});
