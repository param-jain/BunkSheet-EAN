import { Permissions, Notifications } from 'expo';
import { AsyncStorage } from 'react-native';
import axios from 'axios';

const PUSH_ENDPOINT = "https://exp.host/--/api/v2/push/send";

export default async () => {

  let previousToken = await AsyncStorage.getItem('pushtoken');
  console.log("previous token: "+previousToken);

  if (previousToken) {
    return;
  } else {
  const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);

    if (status !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      if (status !== 'granted') {
        return;
      }
    }

    let token = await Notifications.getExpoPushTokenAsync();

    console.log('current token: ' + token);
    await axios.post(PUSH_ENDPOINT, token.token);

    AsyncStorage.setItem('pushtoken', token);

    this.subscription = Notifications.addListener(this.handleNotification);
  }
};