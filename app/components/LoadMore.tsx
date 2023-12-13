import React, {FC} from 'react';
import {View, ActivityIndicator, StyleSheet} from 'react-native';
import {colors} from '../styles';
import {useSelector} from 'react-redux';
import {RootState} from '../redux';

export const LoadMore: FC = () => {
  const loadingType = useSelector(
    (state: RootState) => state.generic.loader?.loadingType,
  );
  const isLoading = useSelector(
    (state: RootState) => state.generic.loader?.isLoading,
  );

  if (isLoading && loadingType === 'loading_more') {
    return (
      <View style={styles.mainView} testID={`LoadMoreView`}>
        <ActivityIndicator
          size={'large'}
          color={colors.primary}
          testID={`ActivityIndicator`}
        />
      </View>
    );
  }
  return null;
};

const styles = StyleSheet.create({
  mainView: {
    width: '100%',
    paddingVertical: '2%',
    alignItems: 'center',
  },
});
