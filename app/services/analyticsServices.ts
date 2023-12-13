import analytics from '@react-native-firebase/analytics';
import {consoleHere} from '../core';
import Config from 'react-native-config';

export const analyticsLogEvent = async (event: string, data?: any) => {
  if (Config.TYPE === 'production') {
    try {
      const res = await analytics().logEvent(event, data);
      consoleHere({analyticsLogEvent: res});
    } catch (error) {
      consoleHere({analyticsLogEventError: error});
    }
  }
};
