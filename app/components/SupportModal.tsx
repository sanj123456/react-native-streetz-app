import React, { FC, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import FlashMessage from 'react-native-flash-message';
import Modal from 'react-native-modal';
import { useSelector } from 'react-redux';
import { images } from '../core';
import { convertToFormData } from '../core/genericUtils';
import { strings } from '../i18n';
import { RootState } from '../redux';
import { contactSupportAPI } from '../services';
import { colors, commonStyles, fonts } from '../styles';
import { SupportModalProps, formParams } from '../types/components';
import { FieldInput } from './FieldInput';
import { MyImagePicker } from './MyImagePicker';
import { PrimaryButton } from './PrimaryButton';
import { PrimaryText } from './PrimaryText';

const dataList = [
  {label: 'Pre-Sale Question', value: 'Pre-Sale Question'},
  {label: 'Order Question', value: 'Order Question'},
  {label: 'Return', value: 'Return'},
  {label: 'Shipping', value: 'Shipping'},
  {label: 'Product Availability', value: 'Product Availability'},
  {label: 'Others', value: 'Others'},
];
export let supportModalRef: any;
export const SupportModal: FC<SupportModalProps> = ({onClose, isVisible}) => {
  /************* Hooks Functions *************/
  supportModalRef = useRef(null);
  const loader = useSelector((state: RootState) => state?.generic?.loader);

  const [form, setForm] = useState<formParams>({
    issue_related_to: '',
    email: '',
    subject: '',
    issue_description: '',
    image: [],
  });
  const [viewType, setViewType] = useState<'initial' | 'later'>('initial');

  /************* Main Functions *************/
  const handleSetMedia = (src: any) => {
    setForm(data => ({
      ...data,
      image: src?.uri ? [...data?.image, src] : [...data?.image, ...src],
    }));
  };

  const handleRemoveMedia = (passedIndex: number) => {
    const newArray = form?.image?.filter(
      (item, index) => index !== passedIndex,
    );
    setForm(data => ({
      ...data,
      image: newArray,
    }));
  };

  const handleSubmit = async () => {
    // let formData = new FormData();
    // formData.append('issue_related_to', form?.issue_related_to);
    // formData.append('email', form?.email);
    // formData.append('subject', form?.subject);
    // formData.append('issue_description', form?.issue_description);
    // formData.append('image', form?.image);
    const payload = convertToFormData(form);
    const res = await contactSupportAPI(payload);
    if (res) {
      setViewType('later');
      setForm({
        issue_related_to: '',
        email: '',
        subject: '',
        issue_description: '',
        image: [],
      });
    }
  };

  return (
    <Modal
      onBackdropPress={onClose}
      avoidKeyboard
      isVisible={isVisible}
      style={viewType === 'initial' ? styles.modalView : styles.laterModalView}>
      <FlashMessage ref={supportModalRef} duration={4000} color={'#ffffff'} />
      {loader?.isLoading && loader?.loadingType === 'contact_us' && (
        <View style={styles.loadingView}>
          <ActivityIndicator size={'large'} color={colors.primary} />
        </View>
      )}
      {viewType === 'initial' ? (
        <View style={styles.mainView}>
          <TouchableOpacity
            activeOpacity={0.8}
            testID={'DropDown'}
            onPress={onClose}
            hitSlop={commonStyles.hitSlop}
            style={styles.dropdownWrapper}>
            <Image style={commonStyles.icon15} source={images.icDropDownBlur} />
          </TouchableOpacity>

          <PrimaryText style={styles.heading}>
            {strings.ctCreateTicket}
          </PrimaryText>
          <PrimaryText style={styles.desc}>{strings.ctGetBack}</PrimaryText>
          <ScrollView
            nestedScrollEnabled
            contentContainerStyle={styles.contentContainerStyle}>
            <Dropdown
              style={styles.dropdownFieldWrapper}
              placeholderStyle={styles.placeholderStyle}
              selectedTextStyle={styles.selectedTextStyle}
              data={dataList}
              maxHeight={300}
              labelField="label"
              valueField="value"
              placeholder={strings.ctIssueRelatedTo}
              value={form?.issue_related_to}
              onChange={item => {
                setForm(data => ({
                  ...data,
                  issue_related_to: item?.value,
                }));
              }}
              renderLeftIcon={() => (
                <Image style={commonStyles.icon12} source={images.icDropdown} />
              )}
            />
            <FieldInput
              testID={'email-address'}
              placeholder={strings.ctEnterYourEmailAddress}
              placeholderTextColor={colors.blackText}
              keyboardType="email-address"
              maxLength={350}
              onChangeText={email =>
                setForm(data => ({
                  ...data,
                  email,
                }))
              }
              value={form?.email}
              inputViewStyles={styles.inputViewStyles}
            />

            <FieldInput
              testID={'Subject'}
              placeholder={strings.ctSubject}
              placeholderTextColor={colors.blackText}
              onChangeText={subject =>
                setForm(data => ({
                  ...data,
                  subject,
                }))
              }
              value={form?.subject}
              maxLength={100}
              inputViewStyles={styles.inputViewStyles}
            />

            <FieldInput
              testID={'description'}
              placeholder={strings.ctEnterDescription}
              placeholderTextColor={colors.blackText}
              onChangeText={issue_description =>
                setForm(data => ({
                  ...data,
                  issue_description,
                }))
              }
              value={form?.issue_description}
              maxLength={250}
              inputViewStyles={styles.inputDescViewStyles}
              inputStyles={styles.inputDescStyles}
              multiline
            />
            <PrimaryText style={styles.count}>
              {form?.issue_description?.length}/250
            </PrimaryText>

            <PrimaryText style={styles.headingFile}>
              {strings.ctAttachFile}
            </PrimaryText>
            <PrimaryText style={styles.descFile}>
              {strings.ctOnlyFilesAllowed}
            </PrimaryText>

            <View style={styles.mediaWrapper}>
              {form?.image?.length > 0 && (
                <ScrollView
                  nestedScrollEnabled
                  horizontal
                  contentContainerStyle={
                    styles.horizontalContentContainerStyle
                  }>
                  {form?.image?.map((item: any, index: number) => (
                    <View
                      key={`${index}_images`}
                      testID={`${index}_images`}
                      style={styles.imageWrapper}>
                      <Image
                        style={styles.imageFile}
                        source={{uri: item?.uri}}
                      />
                      <TouchableOpacity
                        activeOpacity={0.8}
                        testID={`${index}_RemoveMedia`}
                        onPress={() => handleRemoveMedia(index)}
                        style={styles.floatingCross}>
                        <Image
                          style={commonStyles.icon8}
                          source={images.icCross}
                        />
                      </TouchableOpacity>
                    </View>
                  ))}
                </ScrollView>
              )}
              <MyImagePicker
                selectionLimit={0}
                onChange={src => handleSetMedia(src)}>
                <Image style={styles.pickerImage} source={images.icAddPhoto} />
              </MyImagePicker>
            </View>

            <PrimaryButton
              testID={'BtnSend'}
              style={styles.btnSend}
              addMargin={15}
              onPress={handleSubmit}
              title={strings.btSend}
            />
          </ScrollView>
        </View>
      ) : (
        <View style={styles.laterView}>
          <Image style={styles.laterImage} source={images.icLogo} />
          <PrimaryText style={styles.laterText}>
            {strings.ctInconvenience}
          </PrimaryText>
          <PrimaryButton
            testID={'btOkay'}
            style={styles.laterBtn}
            addMargin={'4%'}
            onPress={() => {
              onClose();
              setViewType('initial');
            }}
            title={strings.btOkay}
          />
        </View>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalView: {
    margin: 0,
    justifyContent: 'flex-end',
  },
  mainView: {
    width: '100%',
    paddingVertical: '4%',
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: colors.white,
    maxHeight: '80%',
  },
  heading: {
    ...fonts.medium16,
    paddingHorizontal: '6%',
    color: colors.primary,
    marginTop: '4%',
  },
  desc: {
    ...fonts.regular12,
    paddingHorizontal: '6%',
    marginTop: '.5%',
    color: colors.fromText,
  },
  headingFile: {
    ...fonts.medium16,
    color: colors.primary,
    marginTop: '4%',
  },
  descFile: {
    ...fonts.regular12,
    marginTop: '.5%',
    color: colors.fromText,
  },
  contentContainerStyle: {paddingHorizontal: '6%', paddingBottom: '3%'},
  dropdownWrapper: {
    alignSelf: 'center',
  },
  btnClear: {
    alignSelf: 'flex-end',
  },
  inputViewStyles: {
    marginTop: '4%',
  },
  inputDescViewStyles: {
    height: 92,
    marginTop: '4%',
    borderRadius: 12,
  },
  inputDescStyles: {
    padding: 0,
    height: 78,
    textAlignVertical: 'top',
  },
  count: {
    ...fonts.regular12,
    alignSelf: 'flex-end',
    marginTop: '2%',
  },
  pickerImage: {
    height: 68,
    width: 68,
    resizeMode: 'contain',
    marginLeft: 5,
  },
  mediaWrapper: {
    marginTop: '2.5%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageWrapper: {
    height: 68,
    width: 68,
    overflow: 'hidden',
    borderRadius: 5,
    marginRight: 6,
  },
  imageFile: {
    height: '100%',
    width: '100%',
    resizeMode: 'cover',
  },
  floatingCross: {
    position: 'absolute',
    top: 5,
    right: 5,
  },
  horizontalContentContainerStyle: {
    paddingVertical: 8,
  },
  btnSend: {
    height: 40,
  },
  dropdownFieldWrapper: {
    height: 45,
    width: '100%',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.primary,
    marginTop: '4%',
    paddingLeft: '1%',
    paddingRight: '4%',
  },
  placeholderStyle: {
    ...fonts.regular14,
  },
  selectedTextStyle: {
    ...fonts.regular14,
  },
  laterModalView: {
    justifyContent: 'center',
    margin: 0,
  },
  laterView: {
    width: '90%',
    backgroundColor: colors.white,
    paddingHorizontal: '5%',
    paddingVertical: '4%',
    borderRadius: 18,
    alignSelf: 'center',
    alignItems: 'center',
  },
  laterImage: {
    height: 84,
    width: 81,
    resizeMode: 'contain',
  },
  laterText: {
    width: '80%',
    ...fonts.regular15,
    textAlign: 'center',
    marginTop: '4%',
  },
  laterBtn: {
    height: 40,
    width: '50%',
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
