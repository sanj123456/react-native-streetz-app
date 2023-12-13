/* eslint-disable react-native/no-inline-styles */
import React, {FC, useState} from 'react';
import {View, TextInput, TouchableOpacity, Image} from 'react-native';
import {images} from '../core';
import {colors, commonStyles, fonts} from '../styles';
import {FieldInputProps} from '../types/components';

export const FieldInput: FC<FieldInputProps> = ({
  placeholder,
  inputViewStyles,
  inputStyles,
  onChangeText,
  value,
  type,
  icon,
  placeholderTextColor,
  highlight,
  maxLength,
  testID,
  id,
  keyboardType,
  multiline,
}) => {
  /********** Hooks Functions ***********/
  const [hidePassword, setHidePassword] = useState(
    type === 'password' ? true : false,
  );

  const [isFocused, setIsFocused] = useState(false);

  return (
    <View
      testID={`${testID}InputView`}
      style={{
        ...commonStyles.fieldInputMainViewStyles,
        backgroundColor:
          highlight && isFocused ? `${colors.primary}30` : colors.transparent,
        ...inputViewStyles,
      }}>
      {icon && (
        <Image
          testID={`${testID}LeftIcon`}
          style={commonStyles.icon25}
          source={icon}
        />
      )}
      <TextInput
        testID={`${testID}TextInput`}
        id={id}
        hitSlop={{top: 20, bottom: 20, left: 0, right: 0}}
        style={{
          width: icon ? '90%' : '100%',
          padding: 0,
          ...fonts.regular16,
          ...inputStyles,
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        placeholderTextColor={
          placeholderTextColor
            ? placeholderTextColor
            : highlight && isFocused
            ? colors.primary
            : colors.black
        }
        onChangeText={onChangeText}
        value={value}
        secureTextEntry={hidePassword}
        autoCapitalize={'none'}
        maxLength={maxLength}
        keyboardType={keyboardType}
        multiline={multiline}
      />
      {type === 'password' && (
        <TouchableOpacity
          activeOpacity={0.8}
          testID={`${testID}BtnEye`}
          onPress={() => setHidePassword(!hidePassword)}>
          <Image
            testID={`${testID}ImgEye`}
            style={commonStyles.icon18}
            source={hidePassword ? images.icOpenEye : images.icCloseEye}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};
