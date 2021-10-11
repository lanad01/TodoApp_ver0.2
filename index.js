/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './todo/route';
import {name as appName} from './app.json';
import PushNotification from 'react-native-push-notification';
// Must be outside of any component LifeCycle (such as `componentDidMount`).
PushNotification.configure({
    // (required) Called when a remote is received or opened, or local notification is opened
    onNotification: function (notification) {
      console.log('NOTIFICATION:', notification);
      notification.finish(PushNotificationIOS.FetchResult.NoData);
    },
    requestPermissions: Platform.OS == 'android',
  });
  
AppRegistry.registerComponent(appName, () => App);
