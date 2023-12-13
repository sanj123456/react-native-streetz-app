import {
  TextInput,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';
import {colors, commonStyles, fonts} from '../styles';
import {strings} from '../i18n';
import {images} from '../core';
import {FC, memo} from 'react';
import {SearchInputProps} from '../types/components';

const SearchInput: FC<SearchInputProps> = props => {
  const {inputValue, onChangeText, onPressClose} = props;
  return (
    <View style={styles.searchView}>
      <TextInput
        style={styles.inputStyles}
        placeholder={strings.ctSearchStores}
        placeholderTextColor={colors.greyText}
        onChangeText={onChangeText}
        //   onChangeText={txt => onInputChange(txt)}
        value={inputValue}
        testID={'SearchStores'}
      />
      {inputValue?.length > 0 && (
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={onPressClose}
          testID={'Close'}>
          <Image style={commonStyles.icon53} source={images.icClose} />
        </TouchableOpacity>
      )}
    </View>
  );
};
export default memo(SearchInput);
const styles = StyleSheet.create({
  inputStyles: {
    padding: 0,
    ...fonts.regular12,
    width: '87%',
    height: 35,
    paddingHorizontal: 10,
  },
  searchView: {
    flexDirection: 'row',
    borderRadius: 25,
    paddingHorizontal: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 5,
    marginLeft: 15,
    marginRight: 15,
    height: 32,
    backgroundColor: colors.white,
  },
});
