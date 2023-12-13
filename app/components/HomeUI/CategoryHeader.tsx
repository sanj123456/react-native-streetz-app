import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {colors, commonStyles, fonts} from '../../styles';
import {PrimaryText} from '../PrimaryText';
import {strings} from '../../i18n';
import {FC, memo} from 'react';
import {CategoryHeaderProps} from '../../types/components';

const CategoryHeader: FC<CategoryHeaderProps> = props => {
  const {onPress} = props;
  return (
    <View style={[commonStyles.horizontalBetweenStyles, {marginBottom: '2%'}]}>
      <PrimaryText testID="homeCategoryHeading" style={styles.catHeadingWhite}>
        {strings.ctCategories}
      </PrimaryText>
      <TouchableOpacity onPress={onPress}>
        <PrimaryText
          testID="homeCategoryHeading"
          style={styles.catHeadingWhite}>
          {strings.ctViewAll}
        </PrimaryText>
      </TouchableOpacity>
    </View>
  );
};
export default memo(CategoryHeader);
const styles = StyleSheet.create({
  catHeadingWhite: {
    ...fonts.medium16,
    color: colors.white,
  },
});
