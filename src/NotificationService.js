import {Platform} from 'react-native';
import PushNotification from 'react-native-push-notification';

export default class NotificationService {
  //onNotificaitn is a function passed in that is to be called when a
  //notification is to be emitted.
  constructor(onNotification) {
    PushNotification.createChannel(
      {
        channelId: 'channel-id', // (required)
        channelName: 'My channel', // (required)
        channelDescription: 'A channel to categorise your notifications', // (optional) default: undefined.
        soundName: 'default', // (optional) See `soundName` parameter of `localNotification` function
        importance: 4, // (optional) default: 4. Int value of the Android notification importance
        vibrate: true, // (optional) default: true. Creates the default vibration patten if true.
      },
      (created) => console.log(`createChannel returned '${created}'`), // (optional) callback returns whether the channel was created, false means it already existed.
    );
    this.configure(onNotification);
    this.lastId = 0;
    console.log(this.lastId);
  }

  configure(onNotification) {
    PushNotification.configure({
      onNotification: onNotification,

      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      popInitialNotification: true,
      // This line solves the problem that I was facing.
      requestPermissions: Platform.OS === 'ios',
    });
  }

  //Appears right away
  localNotification() {
    this.lastId++;
    console.log('here');
    console.log(PushNotification.localNotification);
    PushNotification.localNotification({
      channelId: 'channel-id',
      title: 'Local Notification',
      message: 'My Notification Message',
      playSound: true,
      soundName: 'default',
      actions: '["Yes", "No"]',
    });
  }

  //Appears after a specified time. App does not have to be open.
  scheduleNotification() {
    this.lastId++;
    PushNotification.localNotificationSchedule({
      channelId: 'channel-id',
      date: new Date(Date.now() + 5 * 1000), //5 seconds
      title: 'Scheduled Notification',
      message: 'My Notification Message',
      playSound: true,
      soundName: 'default',
    });
  }

  checkPermission(cbk) {
    return PushNotification.checkPermissions(cbk);
  }

  cancelNotif() {
    PushNotification.cancelLocalNotifications({id: '' + this.lastId});
  }

  cancelAll() {
    PushNotification.cancelAllLocalNotifications();
  }
}
