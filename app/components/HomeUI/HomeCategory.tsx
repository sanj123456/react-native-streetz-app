import {FC, memo, useCallback} from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {color} from '../../core/helpers';
import {MyImage} from '../MyImage';
import {perfectSize} from '../../core';
import {PrimaryText} from '../PrimaryText';
import {colors, fonts} from '../../styles';
import {HomeCategoryProps} from '../../types/components';

const HomeCategory: FC<HomeCategoryProps> = props => {
  const {data, onPress} = props;

  const lengthHandler = useCallback(() => {
    if (data.length === 9 || data.length === 6 || data.length === 3) {
      return true;
    } else {
      return false;
    }
  }, [data]);

  const renderItemHandler = useCallback(
    (item: any, index: any) => {
      return (
        <TouchableOpacity
          testID="homeCategoryWrapper"
          onPress={onPress.bind(null, item)}
          key={`${index}_category_item_keys`}
          style={[
            styles.categoryItem,
            {
              width: lengthHandler() ? '33%' : '25%',
            },
          ]}>
          <View
            testID="homeCategoryImageBackground"
            style={[
              styles.catImageBg,
              {
                backgroundColor: color[index % color.length],
              },
            ]}>
            <MyImage
              testID="homeCategoryImage"
              style={{
                borderRadius: 100,
                height: lengthHandler() ? perfectSize(70) : perfectSize(65),
                width: lengthHandler() ? perfectSize(70) : perfectSize(65),
              }}
              source={item?.thumbnail_url}
            />
          </View>
          <View style={styles.catLabelWrapper}>
            <PrimaryText
              testID="homeCategoryName"
              style={styles.txtCat}
              props={{numberOfLines: 3}}>
              {item?.category_name}
            </PrimaryText>
          </View>
        </TouchableOpacity>
      );
    },
    [onPress, lengthHandler],
  );

  return (
    <View style={styles.categoryWrapper}>{data?.map(renderItemHandler)}</View>
  );
};
export default memo(HomeCategory);
const styles = StyleSheet.create({
  categoryWrapper: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  categoryItem: {
    marginTop: '2.5%',
    alignItems: 'center',
  },
  catImageBg: {
    overflow: 'hidden',
    borderRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  catLabelWrapper: {
    width: '100%',
    paddingVertical: '2%',
    paddingHorizontal: '3%',
  },
  txtCat: {
    ...fonts.medium12,
    color: colors.white,
    textAlign: 'center',
    paddingHorizontal: 2,
    marginTop: 4,
  },
});
