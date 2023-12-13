/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-native/no-inline-styles */
import React, {FC, useCallback, useEffect, useState} from 'react';
import {
  ScrollView,
  View,
  Image,
  useWindowDimensions,
  TouchableOpacity,
  FlatList,
  Pressable,
} from 'react-native';
import {
  Background,
  MyImage,
  PrimaryButton,
  PrimaryHeader,
  PrimaryModal,
  PrimaryText,
  ProductItem,
  QuantityPopup,
  Rating,
} from '../../components';
import {colors, commonStyles, fonts, productDetailsStyles} from '../../styles';
import {
  consoleHere,
  constants,
  images,
  isRefreshing,
  screenName,
  successToast,
} from '../../core';
import {strings} from '../../i18n';
import Carousel from 'react-native-reanimated-carousel';
import moment from 'moment';
import {CommonNavigationProps} from '../../types/navigationTypes';
import {
  addToCartAPI,
  productDetailsAPI,
  setAsyncData,
  updateCartItemAPI,
} from '../../services';
import {useSelector} from 'react-redux';
import {RootState, dispatch, getStore} from '../../redux';
import {CartItemParams, UpdateCartItemParams} from '../../types/paramsTypes';
import {useFocusEffect} from '@react-navigation/native';
import RenderHtml from 'react-native-render-html';
import {setRecentlyViewed} from '../../redux/modules/homeSlice';
import {replaceCurrentRoute} from '../../navigation/RootNavigation';
import dynamicLinks from '@react-native-firebase/dynamic-links';
import Config from 'react-native-config';
import Share from 'react-native-share';
import {RefreshControl} from 'react-native-gesture-handler';
import {SelectedVariationType} from '../../types/components';

export const ProductDetails: FC<CommonNavigationProps> = ({
  navigation,
  route,
}) => {
  /************ Hooks Functions ************/
  const {width} = useWindowDimensions();
  const [productID, setProductID] = useState(null);
  const [flowType, setFlowType] = useState(null);
  const [cartProduct, setCartProduct] = useState<any>(null);
  const [afterAddModal, setAfterAddModal] = useState(false);
  const [bannerCurrentIndex, setBannerCurrentIndex] = useState(0);
  const [variationSelected, setVariationSelected] = useState<
    SelectedVariationType[]
  >([]);
  const [showSizeChart, setShowSizeChart] = useState(false);
  const [showQty, setShowQty] = useState(false);
  const [qty, setQty] = useState(1);
  const [cartItemID, setCartItemID] = useState<any>(null);
  const [cartProductQty, setCartProductQty] = useState<number>(0);

  const product_detail = useSelector(
    (state: RootState) => state.home.productDetails?.product_detail,
  );
  const similar_products = useSelector(
    (state: RootState) => state.home.productDetails?.similar_products,
  );
  const userType = useSelector((state: RootState) => state?.profile?.userType);
  const recentlyViewed = useSelector(
    (state: RootState) => state?.home?.recentlyViewed,
  );
  const cartItems = useSelector(
    (state: RootState) => state?.cart?.myCart?.items,
  );

  const generateLink = async () => {
    try {
      const link = await dynamicLinks().buildShortLink(
        {
          link: `${
            Config.Deep_Link_URL
          }${'productDetail?productId'}=${productID}`,
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

  const shareProduct = useCallback(async () => {
    const getLink = await generateLink();
    const options = {
      message: `${'Check this product\n'}${getLink}`,
      // url: getLink,
    };
    Share.open(options)
      .then(res => consoleHere({shareProductRes: res}))
      .catch(err => consoleHere({shareProductErr: err}));
  }, [generateLink]);

  useFocusEffect(
    useCallback(() => {
      setProductID(route?.params?.product_id ?? null);
      setFlowType(route?.params?.type ?? null);
      setCartProduct(route?.params?.data ?? null);
      if (route?.params?.type === 'edit_cart' && route?.params?.data) {
        setQty(route?.params?.data?.quantity ?? 1);
      }
      checkProductInCart();
      if (userType === 'guest') {
        const newArray = [route?.params?.product_id, ...recentlyViewed];
        const firstTenItems = newArray?.slice(0, 10);
        dispatch(setRecentlyViewed(firstTenItems));
        setAsyncData(constants.asyncRecentlyViewed, firstTenItems);
      }
    }, [
      navigation,
      route?.params?.product_id,
      route?.params?.type,
      route?.params?.combination_id,
    ]),
  );

  useEffect(() => {
    productID && productID !== product_detail?.id ? getProductDetails() : null;
    return () => {};
  }, [productID, route?.params?.combination_id]);

  useEffect(() => {
    if (product_detail?.product_variation_combinations?.length > 0) {
      variationSetup(!flowType ? 'initial' : 'change');
    } else {
      setVariationSelected([]);
    }
  }, [
    product_detail?.product_variation_combinations,
    product_detail?.product_variation_combinations?.length,
  ]);

  useEffect(() => {
    if (product_detail && product_detail?.id) {
      checkProductInCart();
    }
  }, [product_detail?.id, cartItems?.length]);

  /************ Main Functions ************/
  const getProductDetails = () => {
    const payload = {
      product_id: productID,
    };
    productDetailsAPI(payload);
  };

  // This function is used to setup variation option on screen mount and variation option change
  const variationSetup = (type: 'initial' | 'change') => {
    let variationArray: SelectedVariationType[] = [];
    if (type === 'initial') {
      const item = product_detail?.product_variation_combinations?.[0];
      item?.product_variation_combination_detail?.forEach((itm: any) => {
        variationArray.push({
          label: itm?.product_variation?.name,
          value: itm?.product_variation_option?.name,
          optionID: itm?.product_variation_option?.id,
          variationID: itm?.product_variation?.id,
        });
      });
    } else if (type === 'change' && flowType === 'edit_cart') {
      const item = product_detail?.product_variation_combinations?.find(
        (itm: any) => itm?.id === cartProduct?.product_variation_combination_id,
      );
      item?.product_variation_combination_detail?.forEach((itm: any) => {
        variationArray.push({
          label: itm?.product_variation?.name,
          value: itm?.product_variation_option?.name,
          optionID: itm?.product_variation_option?.id,
          variationID: itm?.product_variation?.id,
        });
      });
    }
    setVariationSelected(variationArray);
  };

  // This function is used to handle which variation option is selected
  const checkVariationSelected = (optionID: number) => {
    const variationSelectionList = variationSelected.map(
      (item: SelectedVariationType) => item?.optionID,
    );
    return variationSelectionList.includes(optionID);
  };

  // This function is used to get selected combination item plus the combination exists or not
  const getVariationCombinationItem = (
    type: 'get_item_only' | 'check_combo_only',
    variationList?: SelectedVariationType[],
  ): {
    discounted_price: string;
    id: number;
    price: number | string;
    product_id: number;
    product_variation_combination_detail: any[];
  } | null => {
    let activeCombination = null;
    if (
      variationSelected?.length > 0 &&
      product_detail?.product_variation_combinations?.length > 0
    ) {
      product_detail?.product_variation_combinations?.forEach(
        (element: any) => {
          // Map array IDs
          const ids1 = element?.product_variation_combination_detail?.map(
            (obj: any) => obj?.product_variation_option?.id,
          );
          const ids2 = (
            type === 'get_item_only'
              ? variationSelected
              : variationList && variationList?.length > 0
              ? variationList
              : []
          ).map(obj => obj.optionID);
          if (ids1.length !== ids2.length) {
            consoleHere('Arrays have different lengths');
          } else {
            // Sort the IDs
            ids1.sort();
            ids2.sort();

            // Check if the IDs are the same
            const areIdsEqual = ids1.every(
              (id: any, idIndex: number) => id === ids2[idIndex],
            );

            if (areIdsEqual) {
              activeCombination = element;
            }
          }
        },
      );
    }
    return activeCombination;
  };

  // This function is used to get prices of product with variation/non-variation
  const getPrices = () => {
    let price = null;
    let discount = null;
    let discounted_price = null;
    if (
      variationSelected?.length > 0 &&
      product_detail?.product_variation_combinations?.length > 0
    ) {
      const res = getVariationCombinationItem('get_item_only');
      discount = product_detail?.discount;
      discounted_price = res?.discounted_price;
      price = res?.price;
    } else {
      discount = product_detail?.discount;
      discounted_price = product_detail?.discounted_price;
      price = product_detail?.price;
    }

    return {
      price,
      discount,
      discounted_price,
    };
  };

  // This function is used to check do we have selected option combination or not
  // If YES then setVariationSelected
  // If NO then Show error message
  const handleVariationOptionChange =
    (variationID: number, optionItem: any) => () => {
      const newArray = variationSelected.map(item =>
        item?.variationID === variationID
          ? {
              ...item,
              variationID,
              value: optionItem?.name,
              optionID: optionItem?.id,
            }
          : item,
      );
      setVariationSelected(newArray);
    };

  const validateVariationCombo = useCallback(() => {
    if (
      product_detail?.product_variation_combinations?.length === 0 &&
      variationSelected?.length === 0
    ) {
      return true;
    }
    const res = getVariationCombinationItem('get_item_only');

    if (res) {
      return true;
    } else {
      return false;
    }
  }, [
    variationSelected,
    variationSelected?.length,
    product_detail?.product_variation_combinations?.length,
  ]);

  const handleAddToCart = async () => {
    let payload: CartItemParams = {
      product_id: product_detail?.id,
      quantity: qty,
    };
    const seller_store_address_id = product_detail?.seller_store_address_id;
    const freshProductInCart = checkProductInCart('no_re_render');
    if (variationSelected?.length > 0) {
      const res = getVariationCombinationItem('get_item_only');
      if (res) {
        payload = {
          ...payload,
          product_variation_combination_id: res?.id,
        };
      }
    }
    const res = await addToCartAPI(
      payload,
      seller_store_address_id,
      'hide',
      product_detail?.product_name,
    );
    if (res) {
      successToast(strings.msgAddedToCart);
      if (freshProductInCart) {
        checkProductInCart();
      }
    }
  };

  const handleUpdateCart = async () => {
    let payload: UpdateCartItemParams = {
      cart_item_id: flowType === 'edit_cart' ? cartProduct?.id : cartItemID,
      quantity:
        flowType === 'edit_cart' ? cartProduct?.quantity : cartProductQty + qty,
      product_variation_combination_id: null,
    };
    if (variationSelected?.length > 0) {
      const res = getVariationCombinationItem('get_item_only');
      if (res) {
        payload = {
          ...payload,
          product_variation_combination_id: res?.id,
        };
      }
    }
    const freshProductInCart = checkProductInCart('no_re_render');
    const res = await updateCartItemAPI(
      payload,
      freshProductInCart ? 'product_qty' : 'update',
    );
    if (res && !freshProductInCart) {
      setFlowType(null);
      route?.params?.screenName === screenName?.tabCart
        ? navigation.navigate(route?.params?.screenName)
        : replaceCurrentRoute(route?.params?.screenName);
    } else if (res && freshProductInCart) {
      checkProductInCart();
    }
  };

  const getProductImageList = () => {
    let newArray: any[] = [];
    if (product_detail?.product_image) {
      newArray?.unshift({
        image: product_detail?.product_image,
        image_url: product_detail?.product_image_url,
        product_id: productID,
        thumbnail: product_detail?.thumbnail,
        thumbnail_url: product_detail?.thumbnail_url,
      });
    }
    newArray = [...newArray, ...product_detail?.product_images];
    return newArray;
  };

  const checkProductInCart = (type?: 'no_re_render') => {
    const cartArray = getStore()?.cart?.myCart?.items;
    let payload: {product_id: any; product_variation_combination_id: any} = {
      product_id: product_detail?.id,
      product_variation_combination_id: null,
    };
    const res = getVariationCombinationItem('get_item_only');
    if (res) {
      payload = {
        ...payload,
        product_variation_combination_id: res?.id ?? null,
      };
    }
    if (cartArray?.length > 0 && product_detail) {
      if (payload?.product_id && payload?.product_variation_combination_id) {
        const productItem =
          cartArray?.find(
            item =>
              item?.product_id === payload?.product_id &&
              item?.product_variation_combination_id ===
                payload?.product_variation_combination_id,
          ) ?? null;
        if (productItem && flowType !== 'edit_cart') {
          !type && setCartItemID(productItem?.id ?? null);
          !type && setCartProductQty(productItem?.quantity ?? 0);
          return true;
        } else {
          return false;
        }
      } else if (
        payload?.product_id &&
        !payload?.product_variation_combination_id
      ) {
        const productItem = cartArray?.find(
          item => item?.product_id === payload?.product_id,
        );
        if (productItem && flowType !== 'edit_cart') {
          !type && setCartItemID(productItem?.id ?? null);
          !type && setCartProductQty(productItem?.quantity ?? 0);
          return true;
        } else {
          return false;
        }
      }
    } else {
      return false;
    }
  };

  const handleRefresh = async () => {
    const payload = {
      product_id: productID,
    };
    productDetailsAPI(payload, 'refreshing');
  };

  return (
    <Background>
      <PrimaryHeader
        screen_from={route?.params?.screen_from ?? null}
        left="back"
        right="cart_plus_menu"
      />
      {product_detail && (
        <>
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing()}
                onRefresh={handleRefresh}
              />
            }
            nestedScrollEnabled={true}
            contentContainerStyle={productDetailsStyles.contentContainerStyle}>
            <View>
              <Carousel
                panGestureHandlerProps={{
                  activeOffsetX: [-10, 10],
                }}
                loop
                width={width}
                height={350}
                data={getProductImageList()}
                scrollAnimationDuration={300}
                onSnapToItem={index => setBannerCurrentIndex(index)}
                renderItem={({item}: any) => (
                  <Pressable
                    style={productDetailsStyles.bannerMainWrapper}
                    testID={'ProductImage'}>
                    <MyImage
                      style={productDetailsStyles.bannerImage}
                      source={item?.image_url}
                    />
                  </Pressable>
                )}
              />

              <View style={productDetailsStyles.bannerIndicatorWrapper}>
                {getProductImageList()?.map((item: any, index: number) => (
                  <View
                    key={`${index}_banner_indicator_keys`}
                    testID={`${index}_banner_indicator_keys`}
                    style={{
                      ...productDetailsStyles.bannerIndicatorView,
                      ...commonStyles.shadowStyles,
                      height: 10,
                      width: 10,
                      backgroundColor:
                        index === bannerCurrentIndex
                          ? colors.primary
                          : colors.white,
                    }}
                  />
                ))}
              </View>
              <TouchableOpacity
                activeOpacity={0.8}
                style={productDetailsStyles.buttonShare}
                onPress={shareProduct}
                testID={'buttonShare'}>
                <Image style={commonStyles.icon28} source={images.icShare} />
              </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={0.8}
                style={productDetailsStyles.buttonZoom}
                onPress={() =>
                  navigation.navigate(screenName.imageZoom, {
                    images: getProductImageList(),
                    bannerCurrentIndex,
                  })
                }
                testID={'buttonZoom'}>
                <Image style={commonStyles.icon28} source={images.icZoom} />
              </TouchableOpacity>
            </View>

            <View style={productDetailsStyles.infoWrapper}>
              <PrimaryText style={fonts.medium16}>
                {product_detail?.product_name}
              </PrimaryText>
              {validateVariationCombo() ? (
                <>
                  <PrimaryText style={productDetailsStyles.priceText}>
                    {strings.currency}{' '}
                    {getPrices().discount > 0
                      ? getPrices().discounted_price?.replace(
                          /\B(?=(\d{3})+(?!\d))/g,
                          ',',
                        )
                      : getPrices().price?.replace(
                          /\B(?=(\d{3})+(?!\d))/g,
                          ',',
                        )}
                    <PrimaryText
                      style={[
                        productDetailsStyles.priceText,
                        {color: colors.darkPinkText},
                      ]}>
                      *
                    </PrimaryText>
                  </PrimaryText>
                  {getPrices().discount > 0 && (
                    <View
                      style={{
                        ...commonStyles.horizontalCenterStyles,
                        marginTop: '2%',
                      }}>
                      <View style={productDetailsStyles.discountedView}>
                        <PrimaryText
                          style={productDetailsStyles.discountedText}>
                          {strings.ctDiscountedPrice}
                        </PrimaryText>
                      </View>
                      <PrimaryText style={productDetailsStyles.mrpText}>
                        {strings.ctMRP}
                      </PrimaryText>
                      <PrimaryText style={productDetailsStyles.actualPriceText}>
                        {getPrices()?.price}
                      </PrimaryText>
                      <PrimaryText style={productDetailsStyles.offText}>
                        {strings.ctProductOffPercentage(getPrices()?.discount)}
                      </PrimaryText>
                    </View>
                  )}
                </>
              ) : (
                <PrimaryText style={productDetailsStyles.txtOutOfStock}>
                  Out of Stock
                </PrimaryText>
              )}
            </View>

            <FlatList
              scrollEnabled={false}
              data={product_detail?.variation_list}
              renderItem={({item, index}) => (
                <View
                  style={productDetailsStyles.infoMarginWrapper}
                  testID={`${index}_SizeChart`}>
                  <View style={commonStyles.horizontalBetweenStyles}>
                    <PrimaryText style={fonts.medium16}>
                      {strings.ctSelect} {item?.name}
                    </PrimaryText>

                    {item?.name === 'Size' &&
                      product_detail?.sub_category?.size_chart_image && (
                        <TouchableOpacity
                          activeOpacity={0.8}
                          testID={`${index}_ShowSizeChart`}
                          onPress={() => setShowSizeChart(true)}>
                          <PrimaryText
                            style={{
                              ...fonts.medium16,
                              color: colors.primary,
                            }}>
                            Size Chart
                          </PrimaryText>
                        </TouchableOpacity>
                      )}
                  </View>
                  <View style={productDetailsStyles.sizeListWrapper}>
                    {item?.option_list.map((itm: any, sizeIndex: number) => (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        onPress={handleVariationOptionChange(item?.id, itm)}
                        key={`${sizeIndex}_variation_options_keys`}
                        testID={`${sizeIndex}_variation_options_keys`}
                        style={{
                          ...productDetailsStyles.sizeItem,
                          borderColor: checkVariationSelected(itm?.id)
                            ? colors.primary
                            : colors.blackText,
                          backgroundColor: checkVariationSelected(itm?.id)
                            ? colors.primary
                            : colors.white,
                        }}>
                        <PrimaryText
                          style={[
                            productDetailsStyles.sizeText,
                            {
                              color: checkVariationSelected(itm?.id)
                                ? colors.white
                                : colors.blackText,
                            },
                          ]}>
                          {itm?.name}
                        </PrimaryText>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>
              )}
              keyExtractor={(item: any) => item.id}
            />

            {product_detail?.variation_list &&
              product_detail?.variation_list?.length === 0 &&
              product_detail?.sub_category?.size_chart_image && (
                <View style={productDetailsStyles.infoMarginWrapper}>
                  <TouchableOpacity
                    activeOpacity={0.8}
                    testID={'SizeChartBtn'}
                    style={{
                      alignSelf: 'flex-end',
                    }}
                    onPress={() => setShowSizeChart(true)}>
                    <PrimaryText
                      style={{
                        ...fonts.medium16,
                        color: colors.primary,
                      }}>
                      Size Chart
                    </PrimaryText>
                  </TouchableOpacity>
                </View>
              )}

            {product_detail?.description &&
              product_detail?.description?.length > 0 && (
                <View
                  style={productDetailsStyles.infoMarginWrapper}
                  testID={'Description'}>
                  <PrimaryText style={productDetailsStyles.txtDescHeading}>
                    Description
                  </PrimaryText>
                  <RenderHtml
                    source={{
                      html: product_detail?.description,
                    }}
                  />
                </View>
              )}

            {product_detail?.category?.return_policy_content && (
              <View style={productDetailsStyles.infoMarginWrapper}>
                <PrimaryText style={fonts.medium16}>
                  {strings.ctReturnPolicy}
                </PrimaryText>
                <PrimaryText>
                  {product_detail?.category?.return_policy_content}
                </PrimaryText>
              </View>
            )}

            {product_detail.product_reviews.length !== 0 ? (
              <View style={productDetailsStyles.infoMarginWrapper}>
                <View
                  style={[
                    commonStyles.horizontalBetweenStyles,
                    productDetailsStyles.reviewHeader,
                  ]}>
                  <PrimaryText style={fonts.medium16}>
                    {strings.ctRatingsAndReviews}
                  </PrimaryText>
                  {product_detail?.product_reviews &&
                    product_detail?.product_reviews?.length > 2 && (
                      <TouchableOpacity
                        activeOpacity={0.8}
                        style={productDetailsStyles.loadMoreButton}
                        onPress={() =>
                          navigation.navigate(screenName.ProductReview, {
                            product_id: productID,
                          })
                        }>
                        <PrimaryText style={productDetailsStyles.loadMoreText}>
                          {strings.btLoadMore}
                        </PrimaryText>
                      </TouchableOpacity>
                    )}
                </View>

                {product_detail.product_reviews.map(
                  (item: any, index: number) => (
                    <View
                      style={productDetailsStyles.reviewItemWrapper}
                      key={`${index}_review_keys`}>
                      <View style={productDetailsStyles.reviewTopItemWrapper}>
                        <Image
                          style={commonStyles.icon52}
                          source={images.dummyProfileGrey}
                        />
                        <View
                          style={
                            productDetailsStyles.reviewTopItemMiddleWrapper
                          }>
                          <PrimaryText
                            style={productDetailsStyles.reviewerName}>
                            {item?.user?.first_name +
                              ' ' +
                              item?.user?.last_name}
                          </PrimaryText>
                          <Rating
                            style={productDetailsStyles.reviewerRating}
                            size="small"
                            disabled
                            value={item?.rating}
                          />
                        </View>
                        <PrimaryText style={productDetailsStyles.reviewedDate}>
                          {moment(item?.created_at).format('DD/MM/YYYY')}
                        </PrimaryText>
                      </View>
                      <PrimaryText style={fonts.regular12}>
                        {item?.comment}
                      </PrimaryText>
                    </View>
                  ),
                )}
              </View>
            ) : null}

            {similar_products.length > 0 ? (
              <View style={productDetailsStyles.infoMarginWrapper}>
                <PrimaryText style={fonts.medium16}>
                  {strings.ctSimilarProducts}
                </PrimaryText>
                <ScrollView
                  showsHorizontalScrollIndicator={false}
                  nestedScrollEnabled={true}
                  horizontal={true}
                  // style={commonStyles.flex1}
                  // contentContainerStyle={productDetailsStyles.recentScroll}
                >
                  <View style={productDetailsStyles.productListWrapper}>
                    {similar_products?.map((item: any, index: number) => (
                      <ProductItem
                        handleItemPressInProductScreen={id => {
                          navigation.setParams({
                            product_id: id,
                            type: null,
                          });
                        }}
                        style={productDetailsStyles.productItem}
                        key={`${index}_product_item_keys`}
                        item={item}
                      />
                    ))}
                  </View>
                </ScrollView>
              </View>
            ) : null}

            <View style={productDetailsStyles.footer} />
          </ScrollView>

          {/* {checkProductInCart() ? (
            <PrimaryButton
              disabled
              style={productDetailsStyles.cartButton}
              onPress={() => null}
              title={strings.ctItemAlreadyAdded}
            />
          ) : (
            <PrimaryButton
              disabled={!validateVariationCombo()}
              style={productDetailsStyles.cartButton}
              onPress={
                flowType === 'edit_cart' ? handleUpdateCart : handleAddToCart
              }
              title={
                flowType === 'edit_cart'
                  ? strings.btUpdate
                  : strings.btAddToCart
              }
            />
          )} */}

          <View style={productDetailsStyles.bottomView}>
            <TouchableOpacity
              testID={'cartDropdown'}
              activeOpacity={0.8}
              disabled={flowType === 'edit_cart' || !validateVariationCombo()}
              onPress={() => setShowQty(true)}
              style={
                flowType === 'edit_cart' || !validateVariationCombo()
                  ? productDetailsStyles.qtyBtnDisabled
                  : productDetailsStyles.qtyBtn
              }>
              <PrimaryText style={productDetailsStyles.qtyTxt}>
                Qty: {qty}
              </PrimaryText>
              <Image
                style={productDetailsStyles.qtyDrop}
                source={images.icDropdown}
              />
            </TouchableOpacity>

            <PrimaryButton
              testID={'addToCart'}
              disabled={!validateVariationCombo()}
              style={productDetailsStyles.cartButton}
              onPress={
                flowType === 'edit_cart' || checkProductInCart('no_re_render')
                  ? handleUpdateCart
                  : handleAddToCart
              }
              title={
                flowType === 'edit_cart'
                  ? strings.btUpdate
                  : strings.btAddToCart
              }
            />
          </View>
        </>
      )}
      {/* Render Modal */}
      <PrimaryModal
        type="item_added"
        isVisible={afterAddModal}
        onClose={() => setAfterAddModal(false)}
      />

      <QuantityPopup
        onChange={value => setQty(value)}
        isVisible={showQty}
        onClose={() => setShowQty(false)}
        onPressBackDrop={()=>setShowQty(false)}
        value={qty}
      />
      {showSizeChart && (
        <View style={productDetailsStyles.sizeChartView}>
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => setShowSizeChart(false)}
            style={productDetailsStyles.chartClose}>
            <Image style={commonStyles.icon28} source={images.icClose} />
          </TouchableOpacity>
          <MyImage
            style={productDetailsStyles.chartImage}
            source={product_detail?.sub_category?.size_chart_image}
          />
        </View>
      )}
    </Background>
  );
};
