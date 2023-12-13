import {FC} from 'react';
import {Image, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {colors, fonts} from '../styles';
import {AddressTypeTabProps} from '../types/components';

const AddressTypeTab: FC<AddressTypeTabProps> = props => {
  const {image, text, style, onPress} = props;
  return (
    <TouchableOpacity
      style={[styles.root, style]}
      activeOpacity={0.8}
      onPress={onPress}
      testID={'AddressType'}>
      <Image
        source={image}
        style={styles.image}
        resizeMode="contain"
        testID={'AddressTypeImage'}
      />
      <Text style={styles.text} testID={'AddressTypeText'}>
        {text}
      </Text>
    </TouchableOpacity>
  );
};
export default AddressTypeTab;
const styles = StyleSheet.create({
  root: {
    height: 38,
    borderWidth: 1,
    borderColor: colors.primary,
    paddingHorizontal: 8,
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    marginRight: 10,
  },
  image: {
    marginRight: 5,
    height: 20,
    width: 20,
  },
  text: {
    ...fonts.regular14,
    color: colors.blackText,
  },
});
