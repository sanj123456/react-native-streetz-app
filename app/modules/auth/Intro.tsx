/* eslint-disable react-native/no-inline-styles */
/* eslint-disable react/no-unstable-nested-components */
import {FC, useState} from 'react';
import {
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar,
  TouchableOpacity,
  View,
} from 'react-native';
import {useSelector} from 'react-redux';
import {PrimaryButton, PrimaryText} from '../../components';
import {constants, images, screenName} from '../../core';
import {strings} from '../../i18n';
import {RootState, dispatch} from '../../redux';
import {colors, commonStyles} from '../../styles';
import {navigate} from '../../navigation/RootNavigation';
import {setAsyncData} from '../../services';
import {setIntroSkipStatus} from '../../redux/modules/genericSlice';
import {introStyles} from '../../styles';
import {CommonNavigationProps} from '../../types/navigationTypes';

export const Intro: FC<CommonNavigationProps> = props => {
  const {navigation} = props;
  const introContent = [
    {
      label: strings.ctWelcomeToStreetz,
      desc: strings.ctDiscoverStreetz,
      img: images.dummyIntro1,
    },
    {
      label: strings.ctCuratedPortfolio,
      desc: strings.ctByChoosing,
      img: images.dummyIntro2,
    },
    {
      label: strings.ctFastDelivery,
      desc: strings.ctOurTwoHoursDelivery,
      img: images.dummyIntro3,
    },
  ];

  const [index, setIndex] = useState(0);
  const linkData: any = useSelector(
    (state: RootState) => state.generic.deepLinkData,
  );

  const handleSkip = () => {
    setAsyncData(constants.asyncIntroSkip, true);
    if (linkData) {
      setTimeout(() => {
        if (linkData?.type === 'product') {
          navigation.navigate(screenName?.productDetails, {
            product_id: linkData?.data,
            type: '',
          });
        } else if (linkData?.type === 'store') {
          navigation.navigate(screenName?.storeDetails, linkData?.data);
        }
      }, 4500);
    }
    navigate(screenName.auth);
    dispatch(setIntroSkipStatus(true));
  };

  const StylesComp = ({description}: any) => {
    const isTrue = description.includes('2-hours');
    const splitDescription = description.split('2-hours');

    const boldText = (
      <PrimaryText style={{fontWeight: 'bold'}}>
        {isTrue ? '2-hours' : undefined}
      </PrimaryText>
    );

    return (
      <PrimaryText style={introStyles.desc}>
        <PrimaryText>{splitDescription[0]}</PrimaryText>
        {boldText}
        <PrimaryText>{splitDescription[1]}</PrimaryText>
      </PrimaryText>
    );
  };
  const handleNext = () => {
    if (index === 0) {
      setIndex(1);
    } else if (index === 1) {
      setIndex(2);
    } else if (index === 2) {
      handleSkip();
    }
  };

  return (
    <View style={commonStyles.mainView}>
      <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
      <SafeAreaView />
      <ScrollView style={{marginBottom: 10}}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleSkip}
          style={introStyles.btnSkip}>
          <PrimaryText style={introStyles.txtSkip}>
            {strings.btSkip.toUpperCase()}
          </PrimaryText>
        </TouchableOpacity>
        <Image
          style={introStyles.sliderImage}
          source={introContent?.[index]?.img}
        />

        <PrimaryText style={introStyles.heading}>
          {introContent?.[index]?.label}
        </PrimaryText>
        <StylesComp description={introContent?.[index]?.desc} />
      </ScrollView>
      <PrimaryButton
        style={introStyles.btnNext}
        onPress={handleNext}
        title={strings.btNext}
      />
    </View>
  );
};
