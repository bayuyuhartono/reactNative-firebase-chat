import React, {Component} from 'react';
import {
  Text,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ToastAndroid,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import {firebase as databaseFB} from '@react-native-firebase/database';
import {firebase as authFB} from '@react-native-firebase/auth';
export default class Home extends Component {
  static navigationOptions = {headerShown: false};
  constructor() {
    super();
    this.state = {
      myUid: authFB.auth().currentUser.uid,
      messageHeaders: [],
      bio: [],
    };
    this.getBio();
  }

  _logOut = async () => {
    this.props.navigation.navigate('Auth');
  };

  hasLocationPermission = async () => {
    if (
      Platform.OS === 'ios' ||
      (Platform.OS === 'android' && Platform.Version < 23)
    ) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
    }

    return false;
  };

  getLocation = async () => {
    const hasLocationPermission = await this.hasLocationPermission();

    if (!hasLocationPermission) {
      return;
    }

    this.setState({loading: true}, () => {
      console.warn(this.state.bio.name);
      Geolocation.getCurrentPosition(
        position => {
          databaseFB
            .database()
            .ref('location')
            .child(this.state.myUid)
            .set({
              name: this.state.bio.name,
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
              time: databaseFB.database.ServerValue.TIMESTAMP,
            });
        },
        error => {
          console.warn(error);
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 10000,
          distanceFilter: 50,
          forceRequestLocation: true,
        },
      );
    });
  };

  getBio = async () => {
    try {
      let usersRef = databaseFB.database().ref('users');
      usersRef.on('value', snapshot => {
        this.setState({
          bio: snapshot.val()[this.state.myUid],
        });
      });
    } catch (e) {
      // error reading value
    }
  };

  componentWillMount() {
    this.getBio();
    this.getLocation();
    databaseFB
      .database()
      .ref('messageHeaders')
      .child(this.state.myUid)
      .on('child_added', snapshot => {
        this.setState(prevState => {
          return {
            messageHeaders: [...prevState.messageHeaders, snapshot.val()],
          };
        });
      });
  }

  renderRow = ({item, index}) => {
    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('ChatRoom', item)}
        style={{padding: 10, borderBottomColor: '#ccc', borderBottomWidth: 1}}>
        <Text style={{fontSize: 20}}>{item.name}</Text>
        <Text style={{fontSize: 15, color: 'gray'}}>
          Last Message: {item.message}
        </Text>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#F3F0E2'}}>
        <FlatList
          data={this.state.messageHeaders}
          renderItem={this.renderRow}
          keyExtractor={item => item.email}
        />
      </SafeAreaView>
    );
  }
}
