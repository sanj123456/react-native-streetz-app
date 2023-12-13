import {Mobile} from 'aws-sdk';
import {strings} from '../i18n';
import * as Yup from 'yup';
export const loginValidationSchema = Yup.object({
  number: Yup.string()
    .trim()
    .required(strings.valPhoneNoRequired)
    .matches(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
      strings.phoneNoInvalid,
    )
    .min(10, strings.valPhoneNoAtLeast10),
  // .test('oneOfRequired', 'Email or Phone is invalid', value => {
  //   const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,63})+$/;
  //   const phoneRegex = /^[6-9]\d{9}$/;
  //   return emailRegex.test(value) || phoneRegex.test(value);
  // }),
});
export const signUpValidationSchema = Yup.object().shape({
  first_name: Yup.string()
    .trim()
    .required(strings.valFirstNameRequired)
    .min(3, strings.valAtLeast3Chars)
    .matches(/^[A-Za-z]+$/, strings.valFirstNameNotContainNumbers),
  last_name: Yup.string()
    .trim()
    .required(strings.valLastNameRequired)
    .min(3, strings.valAtLeast3Chars)
    .matches(/^[A-Za-z]+$/, strings.valLastNameNotContainNumbers),
  email: Yup.string()
    .trim()
    .required(strings.valEmail)
    .email(strings.emailVal)
    .matches(
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,63})+$/,
      strings.emailInvalid,
    ),
  mobile: Yup.string()
    .trim()
    .required(strings.valPhoneNoRequired)
    .matches(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
      strings.phoneNoInvalid,
    )
    .min(10, strings.valPhoneNoAtLeast10),
  // profile_pic: Yup.object()
  //   .shape({
  //     name: Yup.string().required('Profile Image is required'),
  //     uri: Yup.string().required('Profile Image is required'),
  //     type: Yup.string().required('Profile Image is required'),
  //   })
  //   .required(),
});

export const updateProfileValidationSchema = Yup.object().shape({
  first_name: Yup.string()
    .trim()
    .required(strings.valFirstNameRequired)
    .min(3, strings.valAtLeast3Chars)
    .matches(/^[a-zA-Z\s]*$/, strings.valFirstNameNotContainNumbers),
  last_name: Yup.string()
    .trim()
    .required(strings.valLastNameRequired)
    .min(3, strings.valAtLeast3Chars)
    .matches(/^[a-zA-Z\s]*$/, strings.valLastNameNotContainNumbers),
  email: Yup.string()
    .trim()
    .required(strings.valEmail)
    .email(strings.emailVal)
    .matches(
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,63})+$/,
      strings.emailInvalid,
    ),
  mobile: Yup.string()
    .trim()
    .required(strings.valPhoneNoRequired)
    .matches(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
      strings.phoneNoInvalid,
    )
    .min(10, strings.valPhoneNoAtLeast10),
});

export const addressValidationSchema = Yup.object().shape({
  name: Yup.string()
    .trim()
    .required(strings.valNameRequired)
    .min(3, strings.valAtLeast3Chars)
    .matches(/^[a-zA-Z\s]*$/, strings.valNameNotContainNumbers),
  mobile_no: Yup.string()
    .trim()
    .required(strings.valPhoneNoRequired)
    .matches(
      /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/,
      strings.phoneNoInvalid,
    )
    .min(10, strings.valPhoneNoAtLeast10),
  address_line_1: Yup.string().trim().required(strings.valAddressLineOne),
  address_line_2: Yup.string().trim().required(strings.valAddressLineTwo),
  city: Yup.string().trim().required(strings.valCity),
  state: Yup.string().trim().required(strings.valState),
  country: Yup.string().trim().required(strings.valCountry),
  pincode: Yup.string().trim().required(strings.valPinCode),
  address_label: Yup.string().trim().required(strings.valAddressLabel),
  address_tag: Yup.string().trim().required(strings.valRequired),
});
