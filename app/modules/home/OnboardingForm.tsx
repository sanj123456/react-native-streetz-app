import React, {FC, useCallback, useEffect, useState} from 'react';
import {FlatList, Image, Pressable, Text, View} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useSelector} from 'react-redux';
import {
  Background,
  PrimaryButton,
  PrimaryHeader,
  PrimaryText,
} from '../../components';
import {constants, errorToast, images, screenName} from '../../core';
import {strings} from '../../i18n';
import {RootState} from '../../redux';
import {OnBoardingAPI} from '../../services';
import {colors, commonStyles, onboardingStyles} from '../../styles';
import {Dropdown} from 'react-native-element-dropdown';
import {submitOnBoardingAPI} from '../../services/homeServices';
import {CommonNavigationProps} from '../../types/navigationTypes';

export const OnBoardingForm: FC<CommonNavigationProps> = props => {
  const {navigation} = props;
  const onBoardingData = useSelector(
    (state: RootState) => state.home.onBoardingData,
  );

  const [radioData, setRadio] = useState<any>('');
  const [chkBoxData, setChkBoxData] = useState<any>('');
  const [inputData, setInputData] = useState<any>('');
  const [dropdownData, setDropDownData] = useState<any>('');

  useEffect(() => {
    OnBoardingAPI();
  }, []);

  const pressHandler = useCallback(
    (data: any, type: any) => {
      // Logic for radio buttons
      if (type === constants.onBoardingQuestionKeys.radio) {
        if (radioData?.[data.question]) {
          if (radioData[data.question] === data.answer) {
            // for deleting value
            setRadio((prev: any) => {
              const {[data.question]: delObj, ...rest} = prev;
              return {...rest};
            });
          } else {
            // for updating existing value
            setRadio((prev: any) => {
              return {...prev, [data.question]: data.answer};
            });
          }
        } else {
          // for adding new value
          setRadio((prev: any) => {
            return {...prev, [data.question]: data.answer};
          });
        }
      }
      // Logic for checkbox buttons
      if (type === constants.onBoardingQuestionKeys.checkbox) {
        if (chkBoxData[data.question]) {
          if (chkBoxData[data.question].includes(data.answer)) {
            // for deleting value
            const updatedAns = chkBoxData[data.question].filter(
              (item: any) => item !== data.answer,
            );
            setChkBoxData((prev: any) => {
              return {
                ...prev,
                [data.question]: [...updatedAns],
              };
            });
          } else {
            // for updating existing value
            setChkBoxData((prev: any) => {
              return {
                ...prev,
                [data.question]: [...prev[data.question], data.answer],
              };
            });
          }
        } else {
          // for adding new value
          setChkBoxData((prev: any) => {
            return {...prev, [data.question]: [data.answer]};
          });
        }
      }
    },
    [radioData, chkBoxData],
  );

  const radioHandler = useCallback(
    (question: any, ans: any) => {
      return (
        <Pressable
          style={onboardingStyles.elementStyle}
          onPress={pressHandler.bind(
            null,
            {question, answer: ans},
            constants.onBoardingQuestionKeys.radio,
          )}>
          {radioData && radioData?.[question] === ans ? (
            <Image source={images.icTick} style={onboardingStyles.iconStyle} />
          ) : (
            <Image
              source={images.icUnTick}
              style={onboardingStyles.iconStyle}
            />
          )}
          <PrimaryText style={onboardingStyles.textStyle}>{ans}</PrimaryText>
        </Pressable>
      );
    },
    [pressHandler, radioData],
  );

  const checkBoxHandler = useCallback(
    (question: any, ans: any) => {
      return (
        <Pressable
          style={onboardingStyles.elementStyle}
          onPress={pressHandler.bind(
            null,
            {question, answer: ans},
            constants.onBoardingQuestionKeys.checkbox,
          )}>
          {chkBoxData && chkBoxData?.[question]?.includes(ans) ? (
            <Image
              source={images.icTickedCheckBox}
              style={onboardingStyles.iconStyle}
            />
          ) : (
            <View style={onboardingStyles.unTickedCheckBoxStyle} />
          )}
          <PrimaryText style={onboardingStyles.textStyle}>{ans}</PrimaryText>
        </Pressable>
      );
    },
    [pressHandler, chkBoxData],
  );

  const onTextChangeHandler = useCallback((question: any, text: any) => {
    // Logic for text input
    setInputData((prev: any) => {
      return {...prev, [question]: text};
    });
  }, []);

  const onChangeDropDownHandler = useCallback((question: any, item: any) => {
    setDropDownData((prev: any) => {
      return {...prev, [question]: item.value};
    });
  }, []);

  const dropDownHandler = useCallback(
    (options: any, question: any) => {
      const optionArray: any = [];
      // changing option array to key value object of array
      options.map((ele: any) => {
        optionArray.push({label: ele, value: ele});
      });
      return (
        <Dropdown
          style={onboardingStyles.dropdownFieldWrapper}
          placeholderStyle={onboardingStyles.placeholderStyle}
          selectedTextStyle={onboardingStyles.selectedTextStyle}
          data={optionArray}
          maxHeight={300}
          labelField="label"
          valueField="value"
          placeholder={strings.ctChoose}
          value={dropdownData[question]}
          onChange={onChangeDropDownHandler.bind(null, question)}
          renderLeftIcon={() => (
            <Image style={commonStyles.icon12} source={images.icDropdown} />
          )}
        />
      );
    },
    [dropdownData, onChangeDropDownHandler],
  );

  const renderHandler = useCallback(
    ({item}: any) => {
      return (
        <View style={onboardingStyles.itemStyle}>
          <View style={onboardingStyles.questionView}>
            <PrimaryText style={onboardingStyles.questionStyle}>
              {item.question}
              {item.is_required && (
                <Text style={onboardingStyles.requireStyle}> *</Text>
              )}
            </PrimaryText>
          </View>
          {item.type === constants.onBoardingQuestionKeys.radio &&
            item?.options.map(radioHandler.bind(null, item.question))}
          {item.type === constants.onBoardingQuestionKeys.checkbox &&
            item?.options.map(checkBoxHandler.bind(null, item.question))}
          {item.type === constants.onBoardingQuestionKeys.dropdown &&
            dropDownHandler(item.options, item.question)}
          {(item.type === constants.onBoardingQuestionKeys.text ||
            item.type === constants.onBoardingQuestionKeys.email ||
            item.type === constants.onBoardingQuestionKeys.gst_number ||
            item.type === constants.onBoardingQuestionKeys.mobile_number) && (
            <TextInput
              placeholder="Your answer"
              style={onboardingStyles.inputStyle}
              placeholderTextColor={colors.greyText}
              onChangeText={onTextChangeHandler.bind(null, item.question)}
              value={inputData[item.question]}
              maxLength={item.max_length ? item.max_length : 10}
            />
          )}
        </View>
      );
    },
    [
      checkBoxHandler,
      radioHandler,
      onTextChangeHandler,
      inputData,
      dropDownHandler,
    ],
  );

  const checkForAllRequiredFilledOrNot = (data: any) => {
    let isAllRequiredNotFill = false;
    const isRequired: any = [];
    onBoardingData.map((item: any) => {
      if (item.is_required) {
        isRequired.push(item.question);
      }
    });
    isRequired.map((ele: any) => {
      if (data.hasOwnProperty(ele) === false) {
        isAllRequiredNotFill = true;
      }
    });

    return isAllRequiredNotFill;
  };

  const validationForEmail = (data: any) => {
    let isEmailValid = true;
    onBoardingData.map((item: any) => {
      if (item.type === constants.onBoardingQuestionKeys.email) {
        isEmailValid = constants.emailRegex.test(data[item.question]);
      }
    });
    return !isEmailValid;
  };

  const validationForNumber = (data: any) => {
    let isNumValid = true;
    onBoardingData.map((item: any) => {
      if (item.type === constants.onBoardingQuestionKeys.mobile_number) {
        if (
          constants.numberRegex.test(data[item.question]) &&
          data[item.question].length > 9
        ) {
          isNumValid = true;
        } else {
          isNumValid = false;
        }
      }
    });
    return !isNumValid;
  };

  const validationForGSTNumber = (data: any) => {
    let isGstNum = true;
    onBoardingData.map((item: any) => {
      if (item.type === constants.onBoardingQuestionKeys.gst_number) {
        if (
          constants.gstRegex.test(data[item.question]) ||
          data[item.question] === '0000'
        ) {
          isGstNum = true;
        } else {
          isGstNum = false;
        }
      }
    });
    return !isGstNum;
  };

  const onSubmitHandler = useCallback(async () => {
    const filterChkData: any = {};
    const filterInputData: any = {};

    const chkBoxDataKeys = Object.keys(chkBoxData);
    const inputDataKeys = Object.keys(inputData);
    // convert object value (which are array) to string
    chkBoxDataKeys.map((item: any) => {
      const checkedStrings = chkBoxData[item].toString();
      if (checkedStrings?.trim().length > 0) {
        filterChkData[`${item}`] = chkBoxData[item].toString().trim();
      }
    });
    // checking for empty values for inputs
    inputDataKeys.map((item: any) => {
      if (inputData[item]?.trim().length > 0) {
        filterInputData[`${item}`] = inputData[item];
      }
    });
    // getting required fields

    const data = {
      ...radioData,
      ...filterChkData,
      ...filterInputData,
      ...dropdownData,
    };
    if (checkForAllRequiredFilledOrNot(data)) {
      errorToast('Please fill the required fields');
      return;
    }

    if (validationForEmail(data)) {
      errorToast('Please enter valid email address');
      return;
    }
    if (validationForNumber(data)) {
      errorToast('Please enter valid contact number');
      return;
    }
    if (validationForGSTNumber(data)) {
      errorToast('Please enter valid GST number');
      return;
    }

    const result = await submitOnBoardingAPI(data);
    if (result) {
      setRadio('');
      setChkBoxData('');
      setInputData('');
      setDropDownData('');
      navigation.goBack();
    }
  }, [
    radioData,
    chkBoxData,
    inputData,
    dropdownData,
    checkForAllRequiredFilledOrNot,
    validationForNumber,
    validationForEmail,
    validationForGSTNumber,
    navigation,
  ]);

  return (
    <Background>
      <PrimaryHeader left="back" title={strings.ctBecomeASeller} />
      <KeyboardAwareScrollView
        bounces={false}
        contentContainerStyle={onboardingStyles.scrollViewContentContainer}
        showsVerticalScrollIndicator={false}>
        <FlatList
          bounces={false}
          showsVerticalScrollIndicator={false}
          data={onBoardingData}
          renderItem={renderHandler}
          scrollEnabled={false}
        />
        <PrimaryButton title="Submit" onPress={onSubmitHandler} />
      </KeyboardAwareScrollView>
    </Background>
  );
};
