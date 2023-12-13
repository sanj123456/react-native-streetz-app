/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { FC, useCallback, useEffect } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import Modal from 'react-native-modal';
import { useSelector } from 'react-redux';
import { images, initialList } from '../core';
import { strings } from '../i18n';
import { RootState, dispatch } from '../redux';
import { setSortList } from '../redux/modules/homeSlice';
import { colors, commonStyles, fonts } from '../styles';
import { SortModalProps } from '../types/components';
import { PrimaryButton } from './PrimaryButton';
import { PrimaryText } from './PrimaryText';

export const SortModal: FC<SortModalProps> = ({
  onClose,
  isVisible,
  type,
  onApply,
  selectedSortFilter,
}) => {
  /************* Hooks Functions *************/
  const sortList = useSelector((state: RootState) => state?.home?.sortList);

  useEffect(() => {
    if (
      isVisible &&
      (type === 'product_list' || type === 'productSearch_list') &&
      sortList?.length === 0
    ) {
      dispatch(setSortList(initialList));
    }
  }, [isVisible, sortList]);

  /************* Main Functions *************/

  const handleItemSelect =
    (passedIndex: number, passedSubIndex: number) => () => {
      const newArray: any = sortList.map((item: any, index: number) =>
        passedIndex === index
          ? {
              ...item,
              option_list: item?.option_list?.map((itm: any, idx: number) => ({
                ...itm,
                isSelected: passedSubIndex === idx && !itm?.isSelected,
              })),
            }
          : item,
      );
      dispatch(setSortList(newArray));
    };

  const handleApply = () => {
    let sort_by: string = '';
    sortList?.forEach((item: any) =>
      item?.option_list?.forEach((itm: any) => {
        if (itm?.isSelected) {
          sort_by = itm?.value;
        }
      }),
    );
    onApply({
      sort_by,
    });
    onClose();
  };
  const isClear = useCallback(() => {
    const noneSelected = sortList
      .flatMap(item => item?.option_list)
      .every(option => !option?.isSelected);
    return noneSelected;
  }, [sortList]);

  return (
    <Modal
      onBackdropPress={onClose}
      onBackButtonPress={onClose}
      isVisible={isVisible}
      style={styles.modalView}>
      <View style={styles.mainView}>
        <TouchableOpacity
          activeOpacity={0.8}
          testID={'btnClose'}
          onPress={onClose}
          hitSlop={commonStyles.hitSlop}
          style={styles.dropdownWrapper}>
          <Image style={commonStyles.icon15} source={images.icDropDownBlur} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          testID={'btnClear'}
          disabled={isClear()}
          onPress={() => {
            onApply({sort_by: ''});
            onClose();
            dispatch(setSortList([]));
          }}
          hitSlop={commonStyles.hitSlop}
          style={styles.btnClear}>
          <PrimaryText style={{opacity: isClear() ? 0.5 : 1}}>
            {strings.btClear}
          </PrimaryText>
        </TouchableOpacity>

        <FlatList
          showsVerticalScrollIndicator={false}
          data={sortList}
          renderItem={({item, index}: any) => (
            <View style={styles.itemWrapper}>
              <PrimaryText style={styles.txtHeading}>{item?.name}</PrimaryText>
              {item?.option_list?.map((itm: any, idx: number) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleItemSelect(index, idx)}
                  style={styles.itemSubWrapper}
                  key={`${idx}_filter_sub_item_key`}
                  testID={`${idx}_filter_sub_item_key`}>
                  <Image
                    style={styles.imgCheck}
                    source={itm?.isSelected ? images.icCheck : images.icUncheck}
                  />
                  <PrimaryText>{itm?.name ?? itm?.brand_name}</PrimaryText>
                </TouchableOpacity>
              ))}
            </View>
          )}
          keyExtractor={(item, index) => `${index}_filter_item_keys`}
          ItemSeparatorComponent={() => <Separator />}
        />

        <PrimaryButton
          disabled={selectedSortFilter ? false : isClear()}
          addMargin={15}
          onPress={handleApply}
          title={strings.btApply}
          testID={'btnApply'}
        />
      </View>
    </Modal>
  );
};

const Separator: FC = () => {
  return <View style={styles.separator} />;
};

const styles = StyleSheet.create({
  modalView: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  mainView: {
    width: '100%',
    paddingHorizontal: '5%',
    paddingVertical: '4%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: colors.white,
    maxHeight: '80%',
  },
  dropdownWrapper: {
    alignSelf: 'center',
  },
  btnClear: {
    alignSelf: 'flex-end',
  },
  itemWrapper: {
    width: '100%',
    paddingHorizontal: '2%',
    marginTop: '3%',
    paddingBottom: '4%',
  },
  txtHeading: {
    ...fonts.medium16,
    color: colors.primary,
  },
  itemSubWrapper: {
    ...commonStyles.horizontalCenterStyles,
    marginTop: '2%',
  },
  imgCheck: {
    ...commonStyles.icon15,
    tintColor: colors.blackText,
    marginRight: '2%',
  },
  separator: {
    height: 1,
    width: '100%',
    backgroundColor: colors.borderColor,
  },
});
