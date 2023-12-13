import LottieView from 'lottie-react-native';
import {FC} from 'react';
import {StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import {colors, fonts} from '../styles';
import {LoaderProps} from '../types/components';
import {RootState} from '../redux';
import {images} from '../core';

export const Loader: FC<LoaderProps> = ({}) => {
  const loadingType = useSelector(
    (state: RootState) => state.generic.loader?.loadingType,
  );
  const isLoading = useSelector(
    (state: RootState) => state.generic.loader?.isLoading,
  );

  if (isLoading && !loadingType) {
    return (
      <View style={styles.modalStyles} testID={`LoaderModal`}>
        <View style={styles.mainViewWrapper} testID={`LoaderMainView`}>
          <LottieView
            resizeMode="cover"
            source={images.ltLoader}
            style={{
              width: 150,
              height: 125,
            }}
            autoPlay
            loop
          />
        </View>
      </View>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  modalStyles: {
    flex: 1,
    alignItems: 'center',
    zIndex: 1000,
    position: 'absolute',
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    // backgroundColor:'rgba(0,0,0,0.25)' ,
    marginTop: 0,
  },
  mainViewWrapper: {
    backgroundColor: colors.white,
    borderRadius: 20,
    alignItems: 'center',
    padding: 0,
  },
  mainText: {
    ...fonts.medium14,
    color: colors.blackText,

    marginTop: 15,
  },
});
