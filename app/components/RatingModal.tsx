import React, {FC, useRef, useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Modal from 'react-native-modal';
import {PrimaryText} from './PrimaryText';
import {Rating} from './Rating';
import {strings} from '../i18n';
import {colors, commonStyles, fonts} from '../styles';
import {PrimaryButton} from './PrimaryButton';
import {RatingModalProps} from '../types/components';
import {useSelector} from 'react-redux';
import {RootState} from '../redux';
import {reviewRatingAPI} from '../services';
import FlashMessage from 'react-native-flash-message';

export let ratingModalRef: any;

export const ratingToast = (msg: string, type: 'success' | 'error') => {
  ratingModalRef?.current?.showMessage({
    message: type === 'success' ? 'Success' : 'Oops!',
    description: msg,
    type: type === 'success' ? 'success' : 'danger',
    position: 'top',
    icon: 'auto',
  });
};

const initialState = [
  {
    label: strings.ctStoreReview,
    value: 0,
    comment: '',
  },
  {
    label: strings.ctProductReview,
    value: 0,
    comment: '',
  },
  {
    label: strings.ctDeliveryReview,
    value: 0,
    comment: '',
  },
];

export const RatingModal: FC<RatingModalProps> = ({isVisible, onClose}) => {
  ratingModalRef = useRef(null);
  const loader = useSelector((state: RootState) => state?.generic?.loader);
  const ratingOrderID = useSelector(
    (state: RootState) => state?.order?.ratingOrderID,
  );

  const [reviewData, setReviewData] = useState<
    {
      label: string;
      value: any;
      comment: any;
    }[]
  >(initialState);

  const handleRatingChange = (
    type: 'rate' | 'comment',
    value: number | string,
    passedIndex: number,
  ) => {
    const newArray = reviewData?.map((item, index) => ({
      ...item,
      value: type === 'rate' && index === passedIndex ? value : item?.value,
      comment:
        type === 'comment' && index === passedIndex ? value : item?.comment,
    }));
    setReviewData(newArray);
  };

  const validate = (form: any) => {
    if (form?.store_rating === 0) {
      ratingToast(strings.valStoreRating, 'error');
      return false;
    } else if (form?.product_rating === 0) {
      ratingToast(strings.valProductRating, 'error');
      return false;
    } else if (form?.driver_rating === 0) {
      ratingToast(strings.valDriverRating, 'error');
      return false;
    } else {
      return true;
    }
  };

  const handleSubmit = async () => {
    const payload = {
      order_id: ratingOrderID,
      store_rating: reviewData?.[0]?.value,
      store_review_comment: reviewData?.[0]?.comment,
      product_rating: reviewData?.[1]?.value,
      product_review_comment: reviewData?.[1]?.comment,
      driver_rating: reviewData?.[2]?.value,
      driver_review_comment: reviewData?.[2]?.comment,
    };
    if (validate(payload)) {
      const res = await reviewRatingAPI(payload);
      if (res) {
        handleClose();
      }
    }
  };

  const handleClose = () => {
    setReviewData(initialState);
    onClose();
  };

  return (
    <Modal
      onBackButtonPress={handleClose}
      backdropOpacity={0.8}
      isVisible={isVisible}
      style={styles.modalStyle}>
      <FlashMessage ref={ratingModalRef} duration={4000} color={'#ffffff'} />
      {loader?.isLoading && loader?.loadingType === 'rating' && (
        <View style={styles.loadingView}>
          <ActivityIndicator size={'large'} color={colors.primary} />
        </View>
      )}
      <KeyboardAwareScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerStyle={styles.contentContainerStyle}>
        {reviewData.map((item, index) => (
          <View style={styles.itemWrapper} key={`${index}_review_keys`}>
            <PrimaryText style={styles.txtLabel}>{item?.label}</PrimaryText>
            <Rating
              onChangeValue={value => handleRatingChange('rate', value, index)}
              style={styles.ratingView}
              value={item?.value}
              size={'large'}
            />
            <View style={styles.inputViewStyles}>
              <TextInput
                onChangeText={value =>
                  handleRatingChange('comment', value, index)
                }
                multiline
                maxLength={1000}
                style={styles.inputStyles}
                placeholder={strings.ctWriteYourComments}
                placeholderTextColor={colors.blackText}
              />
            </View>
          </View>
        ))}

        <PrimaryButton
          addMargin={'5%'}
          title={strings.ctSubmitReview}
          onPress={handleSubmit}
          testID={'btnSubmit'}
        />

        <TouchableOpacity
          activeOpacity={0.8}
          testID={'btnClose'}
          onPress={handleClose}
          hitSlop={commonStyles.hitSlop}
          style={styles.btnClose}>
          <PrimaryText style={styles.txtClose}>{strings.btClose}</PrimaryText>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalStyle: {
    margin: 0,
  },
  contentContainerStyle: {
    paddingHorizontal: '8%',
    paddingVertical: '20%',
  },
  itemWrapper: {
    width: '100%',
    marginTop: '5%',
  },
  txtLabel: {
    ...fonts.medium16,
    color: colors.white,
    alignSelf: 'center',
  },
  ratingView: {
    alignSelf: 'center',
    marginTop: '2%',
  },
  inputViewStyles: {
    width: '100%',
    borderRadius: 8,
    backgroundColor: colors.white,
    paddingHorizontal: '4%',
    paddingVertical: '2%',
    marginTop: '4%',
    height: 73,
  },
  inputStyles: {
    ...fonts.regular14,
    width: '100%',
    height: '100%',
    textAlignVertical: 'top',
    padding: 0,
  },
  btnClose: {
    marginTop: '7%',
    alignSelf: 'center',
  },
  txtClose: {
    ...fonts.regular12,
    color: colors.white,
  },
  loadingView: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    position: 'absolute',
    backgroundColor: `${colors.black}70`,
  },
});
