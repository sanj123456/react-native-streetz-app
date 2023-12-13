import {FC} from 'react';
import {
  Alert,
  Image,
  ImageBackground,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import {commonStyles, myProfileStyles} from '../../styles';
import {
  Background,
  MyImage,
  PrimaryHeader,
  PrimaryText,
} from '../../components';
import {
  consoleHere,
  decryptData,
  images,
  infoToast,
  screenName,
} from '../../core';
import {CommonNavigationProps} from '../../types/navigationTypes';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux';
import {strings} from '../../i18n';
import {deleteAccountAPI} from '../../services';
import Share from 'react-native-share';
import {
  getNewUserReferAmount,
  getReferredUserReferAmount,
} from '../../core/helpers';

export const MyProfile: FC<CommonNavigationProps> = ({navigation}) => {
  /*********** Hook Functions **********/
  const profileData = useSelector(
    (state: RootState) => state?.profile?.profileData,
  );

  const randomData = useSelector(
    (state: RootState) => state?.generic?.randomData,
  );

  const contentList = [
    {
      icon: images.icAddressWhite,
      label: strings.ctAddresses,
      screen: screenName.myAddresses,
    },
    {
      icon: images.icProfileWhite,
      label: strings.ctEditProfile,
      screen: screenName.editProfile,
    },
  ];

  /*********** Main Functions **********/
  const deleteAccount = () => {
    Alert.alert(strings.ctDeleteAccount, strings.msgDeleteThisAccount, [
      {
        text: strings.btYes,
        onPress: () => {
          deleteAccountAPI();
        },
      },
      {text: strings.btNo},
    ]);
  };

  const shareReferralCode = () => {
    const options = {
      message: `${profileData?.first_name} ${profileData?.last_name} has invited you to try Streetz-Shop & Gift Instantly. Use this referral code: ${profileData?.referral_code} at checkout to avail amazing discounts on your first order.\nApp links:\nPlay Store: https://play.google.com/store/apps/details?id=com.streetzapp\nApp Store: https://apps.apple.com/in/app/streetz-shop-gift-instantly/id6451184276`,
    };
    Share.open(options)
      .then((res: any) => consoleHere(res))
      .catch((err: any) => consoleHere(err));
  };

  return (
    <Background>
      <PrimaryHeader
        left="back"
        title={strings.ctMyProfile}
        right="home_plus_menu"
      />
      <ScrollView
        contentContainerStyle={myProfileStyles.contentContainerStyle}
        testID={'MyProfileScrollView'}>
        <View
          style={myProfileStyles.profileWrapper}
          testID={'MyProfileWrapper'}>
          <MyImage
            sourceType={
              profileData?.profile_image_url === null ? 'local' : undefined
            }
            style={myProfileStyles.profilePic}
            source={
              profileData?.profile_image_url
                ? profileData?.profile_image_url
                : images.dummyProfile
            }
          />
        </View>

        <PrimaryText
          style={myProfileStyles.userName}
          testID={'MyProfileUsername'}>
          {profileData?.first_name
            ? `${profileData?.first_name} ${profileData?.last_name}`
            : strings.ctHeyUser}
        </PrimaryText>

        {profileData?.email && randomData?.gp ? (
          <View style={myProfileStyles.infoHorizontal} testID={'MyProfileInfo'}>
            <Image
              style={commonStyles.icon12}
              source={images.icMail}
              testID={'MyProfileIcMail'}
            />
            <PrimaryText
              style={myProfileStyles.infoTxt}
              testID={'MyProfileInfoTxt'}>
              {decryptData(JSON?.parse(profileData?.email), randomData?.gp)}
            </PrimaryText>
          </View>
        ) : null}

        {randomData?.gp && (
          <View
            style={myProfileStyles.infoHorizontal}
            testID={'MyProfileMobileView'}>
            <Image
              style={commonStyles.icon12}
              source={images.icMobile}
              testID={'MyProfileIcMobile'}
            />
            <PrimaryText
              style={myProfileStyles.infoTxt}
              testID={'MyProfileMobileTxt'}>
              {decryptData(JSON?.parse(profileData?.mobile_no), randomData?.gp)}
            </PrimaryText>
          </View>
        )}

        <View style={myProfileStyles.contentWrapper}>
          {contentList.map((item, index) => (
            <TouchableOpacity
              activeOpacity={0.8}
              onPress={() => navigation.navigate(item?.screen)}
              style={myProfileStyles.itemWrapper}
              key={`${index}_content_keys_profile`}
              testID={`${index}_content_keys_profile`}>
              <ImageBackground
                resizeMode="cover"
                style={myProfileStyles.profileBlock}
                source={images.dummyProfileBlock}
                testID={'profileBlock'}>
                <View style={myProfileStyles.innerWrapper}>
                  <Image style={commonStyles.icon38} source={item?.icon} />
                  <PrimaryText style={myProfileStyles.itemText}>
                    {item?.label}
                  </PrimaryText>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          ))}
        </View>

        <View style={myProfileStyles.referralView} testID={'referralView'}>
          <PrimaryText
            style={myProfileStyles.referralTitle}
            testID={'referralTitle'}>
            {strings.ctYourReferralCode}
          </PrimaryText>
          <View
            style={myProfileStyles.referralWrapperView}
            testID={'referralWrapperView'}>
            <PrimaryText>
              <PrimaryText
                style={myProfileStyles.inviteBlack}
                testID={'referralInvite'}>
                {'Invite friends to Streetz and get '}
              </PrimaryText>
              <PrimaryText
                style={myProfileStyles.invitePrimary}
                testID={'PriceCurrency'}>
                {strings.currency}
                {getReferredUserReferAmount()}
              </PrimaryText>
              <PrimaryText
                style={myProfileStyles.inviteBlack}
                testID={'Text_referral'}>
                {
                  ' when your friend orders for the first time using your referral code. They get '
                }
              </PrimaryText>
              <PrimaryText
                style={myProfileStyles.invitePrimary}
                testID={'Text_referralAmount'}>
                {strings.currency}
                {getNewUserReferAmount()}
              </PrimaryText>
              <PrimaryText style={myProfileStyles.inviteBlack}>!</PrimaryText>
            </PrimaryText>
            <View
              style={myProfileStyles.referralBottomView}
              testID={'referralBottomView'}>
              <TouchableOpacity
                disabled={profileData?.referral_code ? true : false}
                activeOpacity={0.8}
                onPress={() => {
                  navigation.navigate(screenName.editProfile);
                  infoToast(
                    'Please update your profile to generate code',
                    undefined,
                    'bottom',
                  );
                }}
                style={myProfileStyles.referralBgView}
                testID={'referralGenerateCode'}>
                <PrimaryText style={myProfileStyles.referralTxt}>
                  {profileData?.referral_code ?? 'Generate code'}
                </PrimaryText>
              </TouchableOpacity>
              {profileData?.referral_code && (
                <TouchableOpacity
                  activeOpacity={0.8}
                  onPress={shareReferralCode}
                  testID={'referralShareCode'}>
                  <Image style={commonStyles.icon32} source={images.icShare} />
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </ScrollView>
      <TouchableOpacity
        activeOpacity={0.8}
        style={myProfileStyles.deleteView}
        onPress={deleteAccount}
        testID={'referralDeleteAccount'}>
        <PrimaryText
          style={myProfileStyles.deleteTxt}
          testID={'referralDeleteTxt'}>
          {strings.ctDeleteAccountQuestion}
        </PrimaryText>
      </TouchableOpacity>
    </Background>
  );
};
