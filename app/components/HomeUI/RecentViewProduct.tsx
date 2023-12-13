import {FC, memo} from 'react';
import {ScrollView, StyleSheet, View} from 'react-native';
import {strings} from '../../i18n';
import {commonStyles, fonts} from '../../styles';
import {PrimaryText} from '../PrimaryText';
import {ProductItem} from '../ProductItem';
import {RecentViewProductProps} from '../../types/components';

const RecentViewProduct: FC<RecentViewProductProps> = props => {
  const {data} = props;
  return (
    <View>
      <PrimaryText testID="homeRecentlyViewedTxt" style={styles.catHeading}>
        {strings.ctRecentlyViewed}
      </PrimaryText>

      <ScrollView
        showsHorizontalScrollIndicator={false}
        nestedScrollEnabled={true}
        horizontal
        style={commonStyles.flex1}
        contentContainerStyle={styles.recentScroll}>
        <View style={styles.recentWrapper}>
          {data?.map((item: any, index: number) => (
            <ProductItem
              testID="home"
              style={styles.productItem}
              key={`${index}_recent_item_keys`}
              item={item}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
};
export default memo(RecentViewProduct);
const styles = StyleSheet.create({
  catHeading: {
    ...fonts.medium16,
    marginTop: '4%',
    paddingHorizontal: '4%',
  },
  recentScroll: {
    paddingHorizontal: '4%',
    paddingBottom: '5%',
  },
  recentWrapper: {
    flexDirection: 'row',
  },
  productItem: {
    width: 180,
    marginRight: 10,
    marginTop: '1.5%',
  },
});
