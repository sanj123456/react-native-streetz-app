import {FC, useCallback, useState} from 'react';
import {PrimaryButton} from '../../components';
import {FieldPlaces} from '../../components/FieldPlaces';
import {constants, errorToast, perfectSize, screenName} from '../../core';
import {strings} from '../../i18n';
import {resetNavigation} from '../../navigation/RootNavigation';
import {dispatch} from '../../redux';
import {setSelectedAddress} from '../../redux/modules/addressSlice';
import {
  setLocationEnteredSkip,
  setMyLocation,
} from '../../redux/modules/genericSlice';
import {setAsyncData} from '../../services';
import {locationManualStyles} from '../../styles';
import AuthBackground from './AuthBackground';

const LocationEnteredManually: FC = () => {
  const [text, setText] = useState('');

  const onSelectAddress = useCallback((address: any) => {
    const payload = {
      coords: {
        latitude: address?.location.latitude,
        longitude: address?.location.longitude,
      },
      address: address?.formattedAddress ?? '',
    };

    dispatch(
      setSelectedAddress({
        latitude: address?.location.latitude,
        longitude: address?.location.longitude,
      }),
    );
    dispatch(setMyLocation(payload));
    setText(address.formattedAddress);
  }, []);

  const onPressHandler = useCallback(() => {
    if (text.length === 0) {
      errorToast('Please type your address', undefined, 'top');
      return;
    }
    resetNavigation(screenName.app);
    setAsyncData(constants.asyncLocationEnteredSkip, true);
    dispatch(setLocationEnteredSkip(true));
  }, [text]);

  return (
    <AuthBackground title={strings.msgLocation}>
      <FieldPlaces
        testID={'enteredLandmark'}
        placeholder={strings.ctSelectApartmentName}
        inputViewStyles={locationManualStyles.inputViewStyles}
        inputStyles={locationManualStyles.inputStyles}
        initialValue={text}
        handleLocation={onSelectAddress}
        locationType="location"
      />
      <PrimaryButton
        testID={'btnSignUp'}
        addMargin={perfectSize(25)}
        onPress={onPressHandler}
        title={strings.btSetLandmark}
      />
    </AuthBackground>
  );
};
export default LocationEnteredManually;
