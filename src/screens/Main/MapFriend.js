import React, {Component} from 'react';
import {StyleSheet, View, Alert} from 'react-native';
import MapView, {Marker} from 'react-native-maps';
import {firebase as databaseFB} from '@react-native-firebase/database';

export default class MapFriend extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      headerStyle: {
        backgroundColor: '#2E364F',
      },
      headerTitleStyle: {
        color: '#F3F0E2',
      },
      headerTintColor: '#F3F0E2',
      title: `${navigation.getParam('name')} Location`,
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      uid: props.navigation.getParam('uid'),
      loading: true,
      updatesEnabled: false,
      latitude: 0,
      longitude: 0,
      name: '',
    };
  }

  getLocation = async () => {
    try {
      const uid = this.props.navigation.getParam('uid');
      let usersRef = databaseFB
        .database()
        .ref('location')
        .child(uid);
      usersRef.on('value', snapshot => {
        this.setState({
          loading: false,
          uid,
          name: snapshot.val().name,
          latitude: snapshot.val().latitude,
          longitude: snapshot.val().longitude,
        });
      });
    } catch (e) {
      // error reading value
    }
  };

  componentDidMount() {
    this.getLocation();
  }

  render() {
    const mapStyle = [
      {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
      {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
      {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
      {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{color: '#d59563'}],
      },
      {
        featureType: 'poi',
        elementType: 'labels.text.fill',
        stylers: [{color: '#d59563'}],
      },
      {
        featureType: 'poi.park',
        elementType: 'geometry',
        stylers: [{color: '#263c3f'}],
      },
      {
        featureType: 'poi.park',
        elementType: 'labels.text.fill',
        stylers: [{color: '#6b9a76'}],
      },
      {
        featureType: 'road',
        elementType: 'geometry',
        stylers: [{color: '#38414e'}],
      },
      {
        featureType: 'road',
        elementType: 'geometry.stroke',
        stylers: [{color: '#212a37'}],
      },
      {
        featureType: 'road',
        elementType: 'labels.text.fill',
        stylers: [{color: '#9ca5b3'}],
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry',
        stylers: [{color: '#746855'}],
      },
      {
        featureType: 'road.highway',
        elementType: 'geometry.stroke',
        stylers: [{color: '#1f2835'}],
      },
      {
        featureType: 'road.highway',
        elementType: 'labels.text.fill',
        stylers: [{color: '#f3d19c'}],
      },
      {
        featureType: 'transit',
        elementType: 'geometry',
        stylers: [{color: '#2f3948'}],
      },
      {
        featureType: 'transit.station',
        elementType: 'labels.text.fill',
        stylers: [{color: '#d59563'}],
      },
      {
        featureType: 'water',
        elementType: 'geometry',
        stylers: [{color: '#17263c'}],
      },
      {
        featureType: 'water',
        elementType: 'labels.text.fill',
        stylers: [{color: '#515c6d'}],
      },
      {
        featureType: 'water',
        elementType: 'labels.text.stroke',
        stylers: [{color: '#17263c'}],
      },
    ];
    const {latitude, longitude, loading, name} = this.state;
    return (
      <View style={styles.container}>
        {!loading && (
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: latitude,
              longitude: longitude,
              latitudeDelta: 0.0922,
              longitudeDelta: 0.0421,
            }}
            customMapStyle={mapStyle}>
            <Marker
              draggable
              coordinate={{
                latitude: latitude,
                longitude: longitude,
              }}
              onDragEnd={e => Alert(JSON.stringify(e.nativeEvent.coordinate))}
              title={name}
            />
          </MapView>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  map: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});
