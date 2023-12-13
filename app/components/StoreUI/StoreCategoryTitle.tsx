import {StyleSheet, View} from 'react-native';
import {PrimaryText} from '../PrimaryText';
import {strings} from '../../i18n';
import {colors, fonts} from '../../styles';
import React, {FC, memo} from 'react';
import {StoreCategoryTitleProps} from '../../types/components';

const StoreCategoryTitle: FC<StoreCategoryTitleProps> = props => {
  const {category_name} = props;
  return (
    <View style={styles.catNameView}>
      <PrimaryText style={styles.catHeading}>{strings.ctStoresFor}</PrimaryText>
      <PrimaryText style={styles.catName}>{category_name}</PrimaryText>
    </View>
  );
};
export default memo(StoreCategoryTitle);
const styles = StyleSheet.create({
  catNameView: {
    flexDirection: 'row',
  },
  catHeading: {
    ...fonts.medium16,
    marginTop: '4%',
  },
  catName: {
    ...fonts.medium16,
    marginTop: '4%',
    color: colors.primary,
    marginLeft: 5,
  },
});
