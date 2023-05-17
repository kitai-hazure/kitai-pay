import AsyncStorage from '@react-native-async-storage/async-storage';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';

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
      channelId: 'kitaihazurekitaipay', // (required)
      channelName: 'Kitai Pay Notification', // (required)
      channelDescription: 'Notification for KitaiPay', // (optional) default: undefined.
      importance: 4, // (optional) default: 4. Int value of the Android notification importance
      vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
    },
    (created: any) => console.log(`Channel Created '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
  );
})();

export const handleNotification = (title: string, message: string) => {
  PushNotification.localNotification({
    channelId: 'kitaihazurekitaipay',
    title,
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
