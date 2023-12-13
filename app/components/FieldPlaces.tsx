/* eslint-disable react-native/no-inline-styles */
import { useState, useEffect, FC } from 'react';
import { Text, TextInput, View, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { consoleHere, errorToast, getGMP } from '../core';
import { FieldPlacesProps } from '../types/components';
import { colors, commonStyles, fonts } from '../styles';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useDebouncedCallback } from 'use-debounce';

export const FieldPlaces: FC<FieldPlacesProps> = ({
  testID,
  placeholder,
  inputViewStyles,
  inputStyles,
  addTopMargin,
  handleLocation,
  initialValue,
  locationType,
}) => {
  /******************** Hooks Functions **********************/

  const [inputValue, setInputValue] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setInputValue(initialValue);
    // return setInputValue('');
  }, [initialValue]);

  const debounced = useDebouncedCallback(
    (text: any) => {
      axios({
        method: 'GET',
        url: 'https://maps.googleapis.com/maps/api/place/autocomplete/json',
        params: {
          key: getGMP(),
          input: text,
          components: 'country:in',
          types: ['establishment'],
        },
      })
        .then(response => {
          consoleHere({ googleAPI: response });
          setResults(response.data.predictions);
        })
        .catch((err: any) => {
          errorToast(err?.message);
        });
    },
    // delay in ms
    500,
  );

  /******************** Component methods ********************/

  const onInputChange = (txt: string) => {
    if (txt.length > 0) {
      setIsOpen(true);
      setInputValue(txt);
      debounced(txt);
    } else {
      setIsOpen(false);
      setInputValue('');
      setResults([])
    }
  };

  const handleItemSelect = (selectedItem: any) => () => {
    setIsOpen(false);
    consoleHere({ selectedItem });
    let result: any = null;
    axios({
      method: 'GET',
      url: 'https://maps.googleapis.com/maps/api/place/details/json',
      params: {
        key: getGMP(),
        placeid: selectedItem?.place_id,
        types: 'address',
      },
    })
      .then(response => {
        consoleHere({ googlePlaceIdAPI: response });
        if (locationType === 'address') {
          result = selectedItem?.description;
          setInputValue(selectedItem?.description);
          handleLocation(result);
        } else if (locationType === 'location') {
          const { lat, lng } = response?.data?.result?.geometry?.location;
          const addressComponent = response?.data?.result?.address_components;
          result = {
            addressComponent,
            formattedAddress: response?.data?.result?.formatted_address ?? '',
            location: {
              latitude: lat,
              longitude: lng,
            },
          };
          setInputValue(selectedItem?.description);
          handleLocation(result);
        }
      })
      .catch(error => {
        errorToast(error.message);
      });
  };

  return (
    <View style={{ width: '100%', marginTop: addTopMargin }}>
      <>
        <View
          testID={`${testID}InputView`}
          style={{
            ...commonStyles.fieldInputViewStyles,
            ...inputViewStyles,
          }}>
          {/* <Image style={commonStyles.icon15} source={images.icPin} /> */}
          <TextInput
            testID={`${testID}TextInput`}
            style={{
              width: '100%',
              padding: 0,
              ...fonts.regular14,
              ...inputStyles,
            }}
            placeholderTextColor={colors.blackText}
            onChangeText={txt => onInputChange(txt)}
            value={inputValue}
            placeholder={placeholder}
          />
          {/* <Image style={commonStyles.icon15} source={images.icSearch} /> */}
        </View>

        {results && results.length > 0 && isOpen === true && (
          <KeyboardAwareScrollView
            horizontal={true}
            keyboardShouldPersistTaps="handled"
            enableOnAndroid={false}
            bounces={false}
            extraScrollHeight={0}
            contentContainerStyle={commonStyles.placesListViewStyles}
            testID={`${testID}ScrollView`}>
            <FlatList
              nestedScrollEnabled
              data={results}
              keyExtractor={(item, index) => `${index}_PlacesList`}
              renderItem={({ item, index }: any) => (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={handleItemSelect(item)}
                  style={commonStyles.placesListItem}
                  testID={`${index}_PlacesListItem`}>
                  <Text style={fonts.regular12} testID={`${index}_Description`}>
                    {item?.description}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </KeyboardAwareScrollView>
        )}
      </>
    </View>
  );
};
