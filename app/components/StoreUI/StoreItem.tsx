import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import {MyImage} from '../MyImage';
import {PrimaryText} from '../PrimaryText';
import {Rating} from '../Rating';
import {consoleHere, contactWithWhatsApp, images, toNumber} from '../../core';
import {strings} from '../../i18n';
import {colors, commonStyles, fonts} from '../../styles';
import {FC, memo, useCallback} from 'react';
import {StoreItemProps} from '../../types/components';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import Share from 'react-native-share';
import Config from 'react-native-config';
import {whatsAppClickCountAPI} from '../../services/homeServices';

const StoreItem: FC<StoreItemProps> = props => {
  const {
    floatingValue,
    item,
    testID,
    onPress,
    seller_store_id,
    category_id,
    seller_store_address_id,
    idSellerStore,
  } = props;

  const generateLink = async () => {
    try {
      const link = await dynamicLinks().buildShortLink(
        {
          link: `${
            Config.Deep_Link_URL
          }${'store?category_id'}=${category_id}&seller_store_id=${seller_store_id}`,
          domainUriPrefix: 'https://streetzapp.page.link',
          android: {
            packageName: Config.ANDROID_PACKAGE_NAME ?? '',
          },
          ios: {
            appStoreId: '6451184276',
            bundleId: 'org.StreetzApp',
          },
        },
        dynamicLinks.ShortLinkType.DEFAULT,
      );

      return link;
    } catch (error) {
      consoleHere({generateLinkError: error});
    }
  };

  const shareStore = useCallback(async () => {
    const getLink = await generateLink();
    const options = {
      message: `${'Check this Store\n'}${getLink}`,
      // url: getLink,
    };
    Share.open(options)
      .then(res => consoleHere({shareProductRes: res}))
      .catch(err => consoleHere({shareProductErr: err}));
  }, [generateLink]);

  const clickCount = useCallback(async () => {
    const payload = {
      seller_store_id: idSellerStore,
      seller_store_address_id: seller_store_address_id,
    };
    whatsAppClickCountAPI(payload);
    contactWithWhatsApp(
      item?.whatsapp_number ?? item?.seller_store?.whatsapp_number,
    );
  }, [idSellerStore, seller_store_address_id, item]);

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      testID={`${testID}_storeItem`}
      style={
        floatingValue === 'grid'
          ? styles.itemGridWrapper
          : styles.itemListWrapper
      }>
      <MyImage
        style={
          floatingValue === 'grid' ? styles.itemGridImage : styles.itemListImage
        }
        source={
          item?.seller_store?.brand_logo_thumbnail_url ??
          item?.brand_logo_thumbnail_url
        }
      />

      <View
        style={
          floatingValue === 'grid'
            ? styles.itemGridMiddle
            : styles.itemListMiddle
        }>
        <View style={styles.storeNameWrapper}>
          <PrimaryText style={styles.itemStoreText}>
            {item?.store_name}
          </PrimaryText>
          {floatingValue === 'grid' && (
            <View
              style={{
                flexDirection: 'row',
                alignSelf: 'flex-start',
                alignItems: 'center',
              }}>
              {(item?.whatsapp_visible_on_store === 'on' ||
                item?.seller_store?.whatsapp_visible_on_store === 'on') && (
                <TouchableOpacity
                  onPress={clickCount}
                  activeOpacity={0.8}
                  style={styles.whatsappGridButton}>
                  <Image
                    style={styles.whatsappRightImage}
                    source={images.icWhatsapp}
                  />
                </TouchableOpacity>
              )}
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.shareRightButton}
                onPress={shareStore}
                testID={'buttonShare'}>
                <Image
                  resizeMode="contain"
                  style={styles.shareRightImage}
                  source={images.share}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
        <View style={[commonStyles.horizontalCenterStyles, {marginTop: '2%'}]}>
          <Rating disabled size="small" value={toNumber(item?.avg_rating)} />
          <PrimaryText props={{numberOfLines: 1}} style={styles.itemReviewText}>
            {strings.ctStoreReviewCount(
              item?.store_review_count ?? item?.store_address_review_count,
            )}
          </PrimaryText>
        </View>
        <View
          style={{
            ...commonStyles.horizontalCenterStyles,
            marginTop: '2%',
          }}>
          <Image style={commonStyles.icon12} source={images.icPin} />
          <PrimaryText
            props={{numberOfLines: 1}}
            style={styles.itemLocationText}>
            {item?.address_landmark ?? item?.address}
          </PrimaryText>
        </View>
      </View>
      {floatingValue === 'list' && (
        <View style={styles.rightWrapper}>
          <Image style={styles.itemRightArrow} source={images.icRightArrow} />
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {(item?.whatsapp_visible_on_store === 'on' ||
              item?.seller_store?.whatsapp_visible_on_store === 'on') && (
              <TouchableOpacity
                onPress={clickCount}
                activeOpacity={0.8}
                style={styles.whatsappRightButton}>
                <Image
                  style={styles.whatsappRightImage}
                  source={images.icWhatsapp}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              activeOpacity={0.8}
              style={styles.shareRightButton}
              onPress={shareStore}
              testID={'buttonShare'}>
              <Image
                style={styles.shareRightImage}
                resizeMode="contain"
                source={images.share}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
    </TouchableOpacity>
  );
};
export default memo(StoreItem);
const styles = StyleSheet.create({
  itemGridWrapper: {
    width: '48%',
    paddingHorizontal: '3%',
    paddingVertical: '2%',
    marginTop: '3%',
    backgroundColor: colors.white,
    borderRadius: 12,
  },
  itemListWrapper: {
    flex: 1,
    paddingHorizontal: '3%',
    paddingVertical: '2%',
    flexDirection: 'row',
    marginTop: '3%',
    backgroundColor: colors.white,
    borderRadius: 12,
  },
  itemGridImage: {
    height: 155,
    width: '100%',
    resizeMode: 'cover',
    borderRadius: 9,
    alignSelf: 'center',
  },
  itemGridMiddle: {
    paddingVertical: '3%',
  },
  itemListImage: {
    height: 73,
    width: 73,
    resizeMode: 'cover',
    borderRadius: 9,
  },
  itemListMiddle: {
    flex: 1,
    paddingHorizontal: '3%',
    paddingVertical: '2%',
  },
  itemStoreText: {
    ...fonts.medium16,
    color: colors.primary,
    flex: 1,
  },
  itemReviewText: {
    ...fonts.regular12,
    color: colors.greyText,
    paddingLeft: 5,
    width: '50%',
  },
  itemLocationText: {
    ...fonts.regular12,
    paddingLeft: 5,
    width: '92%',
  },
  itemRightArrow: {
    ...commonStyles.icon12,
  },
  rightWrapper: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingVertical: 5,
  },
  whatsappRightButton: {
    width: 20,
    height: 20,
    marginLeft: 7,
  },
  shareRightButton: {
    width: 18,
    height: 18,
    marginLeft: 7,
  },
  whatsappRightImage: {
    height: '100%',
    width: '100%',
  },
  shareRightImage: {
    width: 18,
    height: 18,
    tintColor: colors.primary,
  },
  whatsappGridButton: {
    width: 20,
    height: 20,
  },
  storeNameWrapper: {
    ...commonStyles.horizontalBetweenStyles,
  },
});
