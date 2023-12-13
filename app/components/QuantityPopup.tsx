import React, {FC, useEffect, useRef} from 'react';
import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import {PrimaryText} from './PrimaryText';
import {QuantityPopupProps} from '../types/components';
import {colors, commonStyles, fonts} from '../styles';
import {images} from '../core';

export const QuantityPopup: FC<QuantityPopupProps> = ({
  isVisible,
  onChange,
  onClose,
  value,
  onPressBackDrop,
}) => {
  const qtyArray = Array.from({length: 10}, (_, i) => i + 1);

  const listRef = useRef<any>(null);

  useEffect(() => {
    if (listRef && isVisible && value && value <= 10) {
      setTimeout(() => {
        listRef?.current?.scrollToIndex({
          index: value - 1,
          animated: true,
          viewPosition: 1,
        });
      }, 300);
    }
  }, [isVisible, value]);

  if (isVisible) {
    return (
      <Pressable style={styles.backView} onPress={onPressBackDrop}>
        <View style={styles.whiteView}>
          <View style={styles.headerView}>
            <PrimaryText style={styles.heading}>Quantity</PrimaryText>
            <TouchableOpacity onPress={onClose} testID={'onClose'}>
              <Image style={styles.icCross} source={images.icCross} />
            </TouchableOpacity>
          </View>

          <FlatList
            showsVerticalScrollIndicator={false}
            ref={listRef}
            data={qtyArray}
            keyExtractor={item => `${item}_qty_list_keys`}
            renderItem={({item}) => (
              <TouchableOpacity
                testID={'qtyDropDown'}
                activeOpacity={0.8}
                style={{
                  ...styles.itemWrapper,
                  backgroundColor:
                    value === item ? colors.primary : colors.white,
                }}
                onPress={() => {
                  onChange(item);
                  onClose();
                }}>
                <PrimaryText
                  style={{
                    color: value === item ? colors.white : colors.blackText,
                  }}>
                  {item}
                </PrimaryText>
              </TouchableOpacity>
            )}
          />
        </View>
      </Pressable>
    );
  } else {
    return null;
  }
};

const styles = StyleSheet.create({
  backView: {
    height: '100%',
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    zIndex: 100,
    top: 0,
  },
  whiteView: {
    width: 180,
    height: 300,
    borderRadius: 8,
    backgroundColor: colors.white,
    ...commonStyles.shadowStyles,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: colors.borderColor,
  },
  headerView: {
    height: 43,
    backgroundColor: colors.primary,
    ...commonStyles.horizontalBetweenStyles,
    paddingHorizontal: '5%',
  },
  heading: {
    ...fonts.regular18,
    color: colors.white,
  },
  icCross: {
    ...commonStyles.icon15,
    tintColor: colors.white,
  },
  itemWrapper: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    height: 40,
    borderBottomWidth: 1,
    borderColor: colors.borderColor,
  },
});
