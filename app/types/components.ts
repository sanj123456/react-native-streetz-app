import {ReactNode} from 'react';
import {TextProps, TextStyle, ViewStyle} from 'react-native';
import {CartApiItemParams, PaymentItemParams} from './paramsTypes';
import {ImageStyle} from 'react-native-fast-image';
import {NavigationProp} from '@react-navigation/native';

export type PrimaryTextProps = {
  style?: TextStyle | any;
  children?: ReactNode | any;
  props?: TextProps;
  id?: any;
  testID?: any;
  numberOfLines?: number;
};

export type PrimaryButtonProps = {
  style?: ViewStyle;
  title: string;
  addMargin?: number | string;
  onPress: () => void;
  onPressIn?: () => void;
  onPressOut?: () => void;
  disabled?: boolean;
  id?: any;
  testID?: any;
};

export type FieldInputProps = {
  placeholder?: string;
  inputViewStyles?: ViewStyle;
  inputStyles?: TextStyle;
  onChangeText?: (text: string) => void;
  value?: string;
  type?: 'email' | 'password';
  icon?: any;
  placeholderTextColor?: any;
  highlight?: boolean;
  maxLength?: number;
  testID?: any;
  id?: any;
  keyboardType?: 'number-pad' | 'numeric' | 'email-address';
  multiline?: boolean;
};

export type PrimaryHeaderProps = {
  title?: string;
  left?: 'back' | 'none' | 'location';
  right?:
    | 'menu'
    | 'cart_plus_menu'
    | 'share'
    | 'home_plus_menu'
    | 'search_plus_menu'
    | 'help'
    | 'search_plus_cart_plus_menu'
    | 'none';
  screen_from?: string;
  searchType?: string;
  onDetailSearch?: () => void;
  isHome?: boolean;
  transparent?: boolean;
};

export type LoaderProps = {};

export type NoInternetProps = {};

export type BackgroundProps = {
  children: ReactNode;
};

export type AuthBackgroundProps = {
  title: string;
  children: ReactNode;
  smallTitle?: string;
  onBack?: () => void;
};

export type FieldPlacesProps = {
  testID?: any;
  placeholder?: string;
  inputViewStyles?: ViewStyle;
  inputStyles?: TextStyle;
  addTopMargin?: number | undefined;
  handleLocation: (data: any) => void;
  initialValue: string | any;
  locationType: 'address' | 'location';
};

export type RatingProps = {
  value: number;
  onChangeValue?: (value: number) => void;
  size: 'small' | 'normal' | 'large';
  disabled?: boolean;
  style?: ViewStyle;
};

export type FloatingOptionsProps = {
  onChange?: (value: any) => void;
  value: string;
  type: 'store' | 'product' | 'storeSearch' | 'productSearch';
  count: number;
};

export type ProductItemProps = {
  style?: ViewStyle;
  item?: any;
  type?: 'normal' | 'wishlist' | 'storelist';
  handleItemPressInProductScreen?: (value: any) => void;
  testID?: string;
};

export type PrimaryModalProps = {
  type: 'item_added' | 'return_order' | 'other_category' | 'cart_total';
  isVisible: boolean;
  onClose: () => void;
  onChange?: (value: any) => void;
  payload?: any;
  onPlaceOrder?: () => void;
};

export type MyImageProps = {
  style?: ImageStyle | any;
  source: any;
  sourceType?: 'url' | 'local';
  componentType?: 'image' | 'imageBackground';
  children?: ReactNode;
  testID?: string;
  consoleParam?: string;
  isBanner?: boolean;
};

export type AddressItemProps = {
  type: 'cart' | 'address_list' | 'time_to_delivery';
  data?: any;
  navigation?: NavigationProp<any, any>;
};

export type MyImagePickerProps = {
  onChange: (src: any) => void;
  style?: ViewStyle;
  children: ReactNode;
  mediaType?: 'photo' | 'video' | 'mixed';
  selectionLimit?: number;
  openingType?: 'camera' | 'gallery' | 'mixed';
  cameraType?: 'back' | 'front';
  disabled?: boolean;
  testID?: string;
};

export type RatingModalProps = {
  isVisible: boolean;
  onClose: () => void;
};

export type InstaAuthProps = {
  onLoginSuccess: (code: string) => void;
  onLoginFailure?: (message: string) => void;
  onClose: () => void;
  isVisible: boolean;
};

export type FilterModalProps = {
  onClose: () => void;
  isVisible: boolean;
  selectedFilter: any;
  type: 'store_list' | 'product_list' | 'productSearch_list';
  payload?: {category_id: any; seller_store_id?: any; subCategoryIdArr?: any};
  onApply: ({
    product_rating,
    filter_variation_arr,
    seller_store_id,
    price_from,
    price_to,
    rating,
    filter_count,
  }: {
    product_rating?: number;
    filter_variation_arr?: number[];
    seller_store_id?: any;
    price_from?: any;
    category_id?: any;
    subCategory_id?: any;
    brand_id?: any;
    price_to?: any;
    rating?: any;
    filter_count?: number;
  }) => void;
  onMount?: ({filter_count}: {filter_count: number}) => void;
};

export type SortModalProps = {
  onClose: () => void;
  isVisible: boolean;
  selectedSortFilter: any;
  type: 'store_list' | 'product_list' | 'productSearch_list';
  onApply: ({sort_by}: {sort_by?: string}) => void;
};

export type NoDataFoundProps = {
  label?: string;
  buttonLabel?: string;
  isDisplay?: boolean;
  onPress?: () => void;
};

export type CartItemProps = {
  data: CartApiItemParams;
};

export type SupportModalProps = {
  onClose: () => void;
  isVisible: boolean;
};

export type CartBadgeProps = {
  style?: ViewStyle;
  type?: 'notification' | 'cart';
};

export type InfoIconProps = {
  msg?: string;
  type?: 'msg' | 'on_press';
  onPress?: () => void;
};

export type QuantityPopupProps = {
  isVisible: boolean;
  onClose: () => void;
  onChange: (value: number) => void;
  value: number;
  onPressBackDrop: () => void;
};

export type PaymentItemProps = {
  item: PaymentItemParams;
  onPress?: () => void;
  selectedItemMode?:any
};
export type AddressTypeTabProps = {
  image: string | any;
  text: string;
  style: ViewStyle;
  onPress: () => void;
};
export type GPSAndroidModalProps = {
  visible: boolean;
};
export type GPSAndroidModalHeaderProps = {
  onPress: () => void;
};
export type SearchInputProps = {
  onChangeText?: (char: string) => void;
  onPressClose: () => void;
  inputValue: string;
};
export type formParams = {
  issue_related_to: string;
  email: string;
  subject: string;
  issue_description: string;
  image: any[];
};
export type CategoryHeaderProps = {
  onPress: () => void;
};
export type HomeBottomBannerProps = {
  onPress: () => void;
  marginTop: any;
};
export type HomeCategoryProps = {
  data: any;
  onPress: (item: any) => void;
};
export type RecentViewProductProps = {
  data: any;
};
export type StoreCarouselProps = {
  onSnapToItem: (index: any) => void;
  onPress: (item: any) => void;
  bannerCurrentIndex: any;
  data: any;
};
export type StoreCategoryTitleProps = {
  category_name: string;
};
export type StoreItemProps = {
  floatingValue: string;
  item: any;
  testID: any;
  onPress: () => void;
  category_id?: any;
  seller_store_id: any;
  idSellerStore?: any;
  seller_store_address_id?: any;
};
export type SelectedVariationType = {
  label: string;
  value: string;
  optionID: number;
  variationID: number;
};
export type HomeCarouselProps = {
  onSnapToItem: (index: any) => void;
  onPress: (item: any) => void;
  bannerCurrentIndex: any;
  data: any;
  isTrendingCarousel?: boolean;
  isLightIndicator?: boolean;
};

export type CategoryTitleProps = {
  onPress?: () => void | any;
  text: string;
};

export type SubCategoryItemProps = {
  data: any;
  onPressCategory?: () => void;
  onPressSubCategory?: (item: any) => void;
};
