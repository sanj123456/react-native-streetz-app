import React, {FC} from 'react';
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Text,
  Platform,
} from 'react-native';
import {FloatingOptionsProps} from '../types/components';
import {images, screenName} from '../core';
import {colors, commonStyles, fonts} from '../styles';

import DeviceInfo from 'react-native-device-info';
import {useRoute} from '@react-navigation/native';

const storeSearchOptions = [
  {
    value: 'filter',
    icon: images.icFilter,
  },
  {
    value: 'category',
    icon: images.icSort,
  },
];

const storeOptions = [
  {
    value: 'list',
    icon: images.icList,
  },
  {
    value: 'grid',
    icon: images.icGrid,
  },
  {
    value: 'filter',
    icon: images.icFilter,
  },
  {
    value: 'category',
    icon: images.icSort,
  },
];

const tabStoreOptions = [
  {
    value: 'list',
    icon: images.icList,
  },
  {
    value: 'grid',
    icon: images.icGrid,
  },

  {
    value: 'category',
    icon: images.icSort,
  },
];

const productOptions = [
  {
    value: 'filter',
    icon: images.icFilter,
  },
  {
    value: 'sort',
    icon: images.icSortTwo,
  },
];

export const FloatingOptions: FC<FloatingOptionsProps> = ({
  onChange,
  value,
  type,
  count,
}) => {
  const route = useRoute().name;

  const handleBottomPosition = () => {
    if (route === screenName.tabStore && Platform.OS === 'android') {
      return 80;
    } else if (
      Platform.OS === 'ios' &&
      DeviceInfo.hasNotch() === false &&
      route === screenName.tabStore
    ) {
      return '18%';
    } else if (route === screenName.tabStore && Platform.OS === 'ios') {
      return '15%';
    } else {
      return '5%';
    }
  };

  return (
    <View
      style={{
        ...styles.mainView,
        bottom: handleBottomPosition(),
      }}>
      {(route === screenName.tabStore
        ? tabStoreOptions
        : type === 'store'
        ? storeOptions
        : type === 'storeSearch'
        ? storeSearchOptions
        : productOptions
      ).map((item, index) => (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => (onChange ? onChange(item?.value) : null)}
          key={`${index}_floating_item_keys`}
          testID={`${index}_floating_item_keys`}
          style={{
            ...styles.buttonWrapper,
            backgroundColor:
              item?.value === value ? colors.white : colors.primary,
          }}>
          {item?.icon === images.icFilter && count > 0 && (
            <View style={styles.countView}>
              <Text style={styles.count}>{count}</Text>
            </View>
          )}
          <Image
            style={{
              ...commonStyles.icon15,
              tintColor:
                item?.value === value ? colors.blackText : colors.white,
            }}
            source={item?.icon}
          />
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  mainView: {
    flexDirection: 'row',
    borderRadius: 40,
    backgroundColor: colors.blackText,
    position: 'absolute',
    alignItems: 'center',
    paddingVertical: '2%',
    alignSelf: 'center',
    paddingHorizontal: '4%',
    justifyContent: 'center',
  },
  buttonWrapper: {
    height: 28,
    width: 28,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 5,
  },
  count: {
    ...fonts.medium12,
    color: colors.white,

    marginTop: Platform.OS === 'ios' ? 3 : 0,
  },
  countView: {
    height: 22,
    width: 22,
    backgroundColor: colors.red,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: -8,
    right: -6,
    zIndex: 5,
  },
});
