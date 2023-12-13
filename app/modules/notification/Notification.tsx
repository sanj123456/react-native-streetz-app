/* eslint-disable react-hooks/exhaustive-deps */
import {FC, useCallback} from 'react';
import {FlatList, TouchableOpacity} from 'react-native';
import {notifyStyles} from '../../styles';
import {
  Background,
  MyImage,
  NoDataFound,
  PrimaryHeader,
  PrimaryText,
} from '../../components';
import {strings} from '../../i18n';
import {getNotificationsAPI} from '../../services';
import {useSelector} from 'react-redux';
import {RootState} from '../../redux';
import {isRefreshing, screenName} from '../../core';
import {NotificationListParams} from '../../types/paramsTypes';
import {CommonNavigationProps} from '../../types/navigationTypes';
import {useFocusEffect} from '@react-navigation/native';

export const Notification: FC<CommonNavigationProps> = ({navigation}) => {
  const isLoading = useSelector(
    (state: RootState) => state?.generic?.loader?.isLoading,
  );
  const notificationList = useSelector(
    (state: RootState) => state?.notification?.notificationList,
  );

  useFocusEffect(
    useCallback(() => {
      getNotificationsAPI(undefined, notificationList?.length === 0);
    }, []),
  );

  const handleRefresh = () => {
    getNotificationsAPI('refreshing');
  };

  const handleItemPress = (notify: NotificationListParams) => () => {
    if (notify?.notification_type === 'order') {
      navigation.navigate(screenName.timeToDelivery, {
        orderID: notify?.order_id,
      });
    } else if (notify?.notification_type === 'StoreDetails') {
      navigation.navigate(notify?.notification_type, {
        category_id: notify?.category_id,
        seller_store_id: notify?.seller_store_id,
      });
    }
  };

  return (
    <Background>
      <PrimaryHeader left="back" title={strings.ctNotification} right="menu" />
      {notificationList?.length > 0 ? (
        <FlatList
          refreshing={isRefreshing()}
          onRefresh={handleRefresh}
          contentContainerStyle={notifyStyles.contentContainerStyle}
          data={notificationList}
          keyExtractor={(item, index) => `${index}_wishlist_keys`}
          renderItem={({item}) => (
            <TouchableOpacity
              onPress={handleItemPress(item)}
              activeOpacity={0.8}
              style={notifyStyles.itemWrapper}>
              <PrimaryText style={notifyStyles.heading}>
                {item?.title}
              </PrimaryText>
              <PrimaryText style={notifyStyles.desc}>
                {item?.description}
              </PrimaryText>
              {item?.thumbnail && (
                <MyImage style={notifyStyles.image} source={item?.image_url} />
              )}
            </TouchableOpacity>
          )}
        />
      ) : isLoading ? null : (
        <NoDataFound label="You have received no notification." />
      )}
    </Background>
  );
};
