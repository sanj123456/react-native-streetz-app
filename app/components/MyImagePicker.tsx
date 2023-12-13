import React, {FC, useCallback} from 'react';
import {
  Alert,
  Linking,
  PermissionsAndroid,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import {MyImagePickerProps} from '../types/components';
import ImagePicker from 'react-native-image-crop-picker';
import {consoleHere, errorToast} from '../core';
import {PERMISSIONS, RESULTS, check, request} from 'react-native-permissions';
import {CheckPermission} from '../core/CheckPermission';
import {RequestPermission} from '../core/RequestPermission';

export const MyImagePicker: FC<MyImagePickerProps> = ({
  onChange,
  style,
  children,
  mediaType,
  selectionLimit,
  openingType,
  cameraType,
  disabled,
  testID,
}) => {
  const checkCameraPermission = async () => {
    try {
      const cameraPermissionStatus = await check(PERMISSIONS.IOS.CAMERA);
      if (cameraPermissionStatus === RESULTS.GRANTED) {
        return true;
      } else if (cameraPermissionStatus === RESULTS.DENIED) {
        const requestResult = await request(PERMISSIONS.IOS.CAMERA);
        if (requestResult === RESULTS.GRANTED) {
          return true;
        } else {
          return false;
        }
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error checking or requesting camera permission:', error);
      return false;
    }
  };

  const uploadImage = () => {
    Alert.alert(
      '',
      'Upload Image From',
      [
        {
          text: 'Camera',
          onPress: () =>
            Platform.OS === 'android'
              ? handleCameraPermission()
              : handleDeviceCamera(),
        },
        {
          text: 'Gallery',
          onPress: () => handleDeviceGallery(),
        },
        {
          text: 'Cancel',
        },
      ],
      {
        cancelable: false,
      },
    );
  };

  const handleCameraPermission = () => {
    PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA)
      .then(res => {
        if (res === true) {
          handleDeviceCamera();
        } else {
          PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA)
            .then(resp => {
              consoleHere({permission_request_response: resp});
              if (resp === PermissionsAndroid.RESULTS.GRANTED) {
                handleDeviceCamera();
              }
            })
            .catch(e => consoleHere({camera_request_permission_error: e}));
        }
      })
      .catch(e => consoleHere({Camera_check_Permission_Error: e}));
  };

  const launchCameraHandler = () => {
    launchCamera(
      {
        quality: 0.5,
        maxWidth: 512,
        maxHeight: 512,
        mediaType: mediaType ?? 'photo',
        saveToPhotos: false,
        cameraType: cameraType ?? 'back',
      },
      (res: any) => {
        consoleHere({Camera_response: res});
        if (res?.didCancel) {
          consoleHere('User cancelled image picker');
        } else if (res?.error) {
          consoleHere({ImagePicker_Error: res?.error});
        } else if (res?.customButton) {
          consoleHere({user_tapped_custom_button: res?.customButton});
        } else if (res?.assets && res?.assets[0]?.uri) {
          const source = {
            uri:
              Platform.OS === 'android'
                ? res?.assets[0]?.uri
                : res?.assets[0]?.uri.replace('file://', ''),
            type: res?.assets[0]?.type,
            name: res?.assets[0]?.fileName,
          };
          consoleHere({size: res?.assets?.[0]?.fileSize / 1048576});
          onChange(source);
        }
      },
    );
  };
  const handleDeviceCamera = async () => {
    if (Platform.OS === 'android' && cameraType === 'front') {
      ImagePicker.openCamera({
        compressImageMaxWidth: 512,
        compressImageMaxHeight: 512,
        useFrontCamera: cameraType === 'front' ? true : false,
        mediaType:
          mediaType === 'mixed'
            ? 'any'
            : mediaType === 'video'
            ? 'video'
            : 'photo',
      })
        .then(imageCrop => {
          consoleHere({imageCrop});
          if (imageCrop && imageCrop?.path) {
            const source = {
              uri: imageCrop?.path,
              type: imageCrop?.mime,
              name: `StreetzImage-${imageCrop?.modificationDate}`,
            };
            onChange(source);
          }
        })
        .catch(errCam => consoleHere({errCam}));
    } else {
      if (Platform.OS === 'ios') {
        const cameraPermissionGranted = await checkCameraPermission();
        if (cameraPermissionGranted) {
          launchCameraHandler();
        } else {
          Alert.alert(
            'Allow Permission',
            "Streetz Hyperlocal requires your device's camera permission in order to upload a profile picture.",
            [
              {text: 'Cancel', style: 'cancel'},
              {
                text: 'Open Settings',
                style: 'cancel',
                onPress: () => Linking.openSettings(),
              },
            ],
          );
        }
      } else {
        launchCameraHandler();
      }
    }
  };
  const handleDeviceGallery = () => {
    launchImageLibrary(
      {
        quality: 0.5,
        // maxWidth: 512,
        // maxHeight: 512,
        mediaType: mediaType ?? 'photo',
        selectionLimit: selectionLimit ?? 1,
      },
      (res: any) => {
        consoleHere({Gallery_response: res});
        if (res?.didCancel) {
          consoleHere('User cancelled image picker');
        } else if (res?.error) {
          consoleHere({ImagePicker_Error: res?.error});
        } else if (res?.customButton) {
          consoleHere({User_tapped_custom_button: res?.customButton});
        } else if (
          res?.assets &&
          res?.assets?.length === 1 &&
          res?.assets[0]?.uri
        ) {
          if (res?.assets?.[0]?.fileSize > 2 * 1024 * 1024) {
            errorToast('Image Size Should less Than 2 MB.');
          } else {
            const source = {
              uri:
                Platform.OS === 'android'
                  ? res?.assets[0]?.uri
                  : res?.assets[0]?.uri.replace('file://', ''),
              type: res?.assets[0]?.type,
              name: res?.assets[0]?.fileName,
            };
            consoleHere({size: res?.assets?.[0]?.fileSize / 1048576});
            onChange(source);
          }
        } else if (res?.assets && res?.assets?.length > 1) {
          if (res?.assets?.[0]?.fileSize > 2 * 1024 * 1024) {
            errorToast('Image Size Should less Than 2 MB.');
          } else {
            const source = res?.assets?.map((item: any) => ({
              uri:
                Platform.OS === 'android'
                  ? item?.uri
                  : item?.uri.replace('file://', ''),
              type: item?.type,
              name: item?.fileName,
            }));
            onChange(source);
          }
        }
      },
    );
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      testID={testID}
      style={style}
      disabled={disabled}
      onPress={
        openingType === 'camera'
          ? Platform.OS === 'android'
            ? handleCameraPermission
            : handleDeviceCamera
          : openingType === 'gallery'
          ? handleDeviceGallery
          : uploadImage
      }>
      {children}
    </TouchableOpacity>
  );
};
