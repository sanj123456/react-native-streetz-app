import {S3} from 'aws-sdk';
import {consoleHere, constants, errorToast} from '../core';
import {get} from './request';
import {dispatch} from '../redux';
import {setRandomData, setStoreTiming} from '../redux/modules/genericSlice';

const s3 = new S3({
  accessKeyId: 'AKIA4TFPKLSZ6RKYMD4U',
  secretAccessKey: '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',
  region: 'ap-south-1',
});

export const makeMediaUrl = async (key: any) => {
  const params = {
    Bucket: 'stage-s3-streetz',
    Key: key,
    Expires: 3600, // The expiration time in seconds (adjust according to your requirements)
  };

  try {
    const signedUrl = await s3.getSignedUrlPromise('getObject', params);
    if (signedUrl) {
      return signedUrl;
    } else {
      return null;
    }
    // Use the signed URL as needed (e.g., pass it to an image component to display the image)
  } catch (error) {
    consoleHere({ErrorGeneratingSignedURL: error});
    return null;
  }
};

export const checkImageExists = async (key: any) => {
  const params = {
    Bucket: 'stage-s3-streetz',
    Key: key,
  };
  try {
    await s3.headObject(params).promise();
    return true;
  } catch (error: any) {
    if (error.code === 'NotFound') {
      return false;
    }
    throw error;
  }
};

export const getSettingsAPI = async () => {
  get(constants.endPtSettings)
    .then(async res => {
      if (res?.status === constants.apiSuccess) {
        dispatch(setStoreTiming(res?.data));
      } else {
        errorToast(res?.message);
      }
    })
    .catch(e => {
      consoleHere({e});
    });
};

export const getRandomDataAPI = async () => {
  get(constants.endPtGetRandomData)
    .then(async res => {
      if (res?.status === constants.apiSuccess) {
        dispatch(setRandomData(res?.data));
      } else {
        errorToast(res?.message);
      }
    })
    .catch(e => {
      consoleHere({e});
    });
};
