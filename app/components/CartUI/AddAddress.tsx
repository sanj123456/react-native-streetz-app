import {Image, TouchableOpacity, View} from 'react-native';
import {cartStyles, fonts} from '../../styles';
import {PrimaryText} from '../PrimaryText';
import {strings} from '../../i18n';
import {images} from '../../core';
import {FC, memo} from 'react';
type AddAddressProps = {
  onPress?: () => void;
};
const AddAddress: FC<AddAddressProps> = props => {
  const {onPress} = props;
  return (
    <View style={cartStyles.addAddressView} testID={'cartAddressView'}>
      <PrimaryText style={fonts.medium16}>{strings.ctAddress}</PrimaryText>
      <TouchableOpacity
        activeOpacity={0.8}
        testID={'cartAddAddressBtn'}
        onPress={onPress}>
        <Image style={cartStyles.imgAdd} source={images.icAdd} />
      </TouchableOpacity>
    </View>
  );
};
export default memo(AddAddress);
