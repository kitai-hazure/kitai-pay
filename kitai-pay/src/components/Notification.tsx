import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import PushNotification, { Importance } from 'react-native-push-notification';
import { NOTIFICATION } from '../constants';

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  } else {
    requestUserPermission();
  }
}

(() => {
  PushNotification.createChannel(
    {
      channelId: NOTIFICATION.POPUP_CHANNEL_ID,
      channelName: NOTIFICATION.POPUP_CHANNEL_NAME,
      importance: Importance.HIGH,
      vibrate: NOTIFICATION.POPUP_CHANNEL_VIBRATE,
      soundName: 'default',
    },
    () => {},
  );

  PushNotification.createChannel(
    {
      channelId: NOTIFICATION.SILENT_CHANNEL_ID,
      channelName: NOTIFICATION.SILENT_CHANNEL_NAME,
      importance: Importance.LOW,
      vibrate: NOTIFICATION.SILENT_CHANNEL_VIBRATE,
    },
    () => {},
  );
})();

export const handleNotification = (title: string, message: string) => {
  PushNotification.localNotification({
    autoCancel: true,
    smallIcon: NOTIFICATION.SMALL_ICON.KITAI_PAY_MAIN,
    vibrate: true,
    group: NOTIFICATION.GROUP_NAME.KITAI_PAY_MAIN,
    channelId: NOTIFICATION.POPUP_CHANNEL_ID,
    title: title,
    message: message,
    playSound: true,
    soundName: NOTIFICATION.SOUND_NAME.DEFAULT,
    number: NOTIFICATION.NUMBER.KITAI_PAY_MAIN,
  });

  PushNotification.localNotification({
    autoCancel: true,
    groupSummary: true,
    smallIcon: NOTIFICATION.SMALL_ICON.KITAI_PAY_MAIN,
    group: NOTIFICATION.GROUP_NAME.KITAI_PAY_MAIN,
    channelId: NOTIFICATION.SILENT_CHANNEL_ID,
    id: NOTIFICATION.GROUP_ID.KITAI_PAY_MAIN,
    message,
  });
};

export const getFCMToken = async () => {
  let fcmToken = await AsyncStorage.getItem('fcmToken');
  if (!fcmToken) {
    fcmToken = await messaging().getToken();
    if (!fcmToken) {
      console.log('Error: No FCM token found');
    }
    AsyncStorage.setItem('fcmToken', fcmToken);
  }
  console.log('FCM Token', fcmToken);
  return fcmToken;
};

export const createNotificationListeners = (onNotification: any) => {
  messaging().onMessage(async remoteMessage => {
    console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
    onNotification(remoteMessage);
  });

  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      JSON.stringify(remoteMessage),
    );
    // onNotification(remoteMessage);
  });

  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          JSON.stringify(remoteMessage),
        );
        // onNotification(remoteMessage);
      }
    });

  messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });

  messaging().onMessage(async remoteMessage => {
    if (!remoteMessage.notification) {
      return;
    }
    console.log('WE REACHED HEREE');
    handleNotification(
      // @ts-ignore
      remoteMessage.notification.title,
      remoteMessage.notification.body,
    );
    console.log('Notification in foreground', remoteMessage);
  });
};
