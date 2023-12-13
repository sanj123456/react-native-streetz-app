/* eslint-disable react-hooks/exhaustive-deps */
import React, {FC, useEffect, useState} from 'react';
import {Background, PrimaryHeader} from '../../components';
import {CommonNavigationProps} from '../../types/navigationTypes';
import {orderInvoiceAPI} from '../../services';
import {consoleHere, images, successToast} from '../../core';
import Pdf from 'react-native-pdf';
import {
  TouchableOpacity,
  Image,
  View,
  Platform,
  PermissionsAndroid,
} from 'react-native';
import {colors, commonStyles, invoiceStyles} from '../../styles';
import ReactNativeBlobUtil from 'react-native-blob-util';
import Share from 'react-native-share';

export const InvoiceView: FC<CommonNavigationProps> = ({route}) => {
  const [HTML, setHTML] = useState('');

  useEffect(() => {
    getOrderInvoice();
  }, []);

  const getOrderInvoice = async () => {
    const res = await orderInvoiceAPI(route?.params?.order_id);
    if (res) {
      setHTML(res?.invoice_link);
    }
  };

  const downloadPDF = async () => {
    const source = HTML;
    const fileName = `streetz_order_${route?.params?.order_number}.pdf`;
    let dirs = ReactNativeBlobUtil.fs.dirs;
    ReactNativeBlobUtil.config({
      fileCache: true,
      appendExt: 'pdf',
      path: `${dirs.DocumentDir}/${fileName}`,
      addAndroidDownloads: {
        useDownloadManager: true,
        notification: true,
        title: fileName,
        description: 'File downloaded by download manager.',
        mime: 'application/pdf',
        storeInDownloads: true,
      },
    })
      .fetch('GET', source)
      .then((res: any) => {
        // in iOS, we want to save our files by opening up the saveToFiles bottom sheet action.
        // whereas in android, the download manager is handling the download for us.
        if (Platform.OS === 'ios') {
          const filePath = res.path();
          let options = {
            type: 'application/pdf',
            url: filePath,
            saveToFiles: true,
          };
          Share.open(options)
            .then(resp => consoleHere(resp))
            .catch(err => consoleHere(err));
        } else {
          successToast('Download Complete', fileName);
        }
      })
      .catch(err => consoleHere('BLOB ERROR -> ', err));
  };

  const checkPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version < 33) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          downloadPDF();
        } else {
          consoleHere('permission denied');
        }
      } catch (err) {
        consoleHere(err);
      }
    } else {
      downloadPDF();
    }
  };

  return (
    <Background>
      <PrimaryHeader left="back" />
      <View style={commonStyles.flex1}>
        {HTML && (
          <TouchableOpacity
            activeOpacity={0.8}
            hitSlop={commonStyles.hitSlop}
            onPress={checkPermission}
            style={invoiceStyles.btnDownload}
            testID="btnDownload">
            <Image
              style={{...commonStyles.icon15, tintColor: colors.white}}
              source={images.icDownload}
            />
          </TouchableOpacity>
        )}
        <Pdf
          source={{uri: HTML}}
          style={commonStyles.flex1}
          trustAllCerts={false}
        />
      </View>
    </Background>
  );
};
