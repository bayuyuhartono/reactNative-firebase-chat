import React, {Component} from 'react';
import {firebase as authFB} from '@react-native-firebase/auth';
import {firebase as databaseFB} from '@react-native-firebase/database';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';

export default class MyAccount extends Component {
  static navigationOptions = {headerShown: false};
  constructor() {
    super();
    this.state = {bio: []};
  }

  _logOut = async () => {
    await authFB.auth().signOut();
    this.props.navigation.navigate('Auth');
  };

  getBio = async () => {
    try {
      const uid = authFB.auth().currentUser.uid;
      let usersRef = databaseFB.database().ref('users');
      usersRef.on('value', snapshot => {
        this.setState({
          bio: snapshot.val()[uid],
        });
      });
    } catch (e) {
      // error reading value
    }
  };

  componentDidMount() {
    this.getBio();
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header} />
        <Image
          style={styles.avatar}
          source={{uri: 'https://bootdey.com/img/Content/avatar/avatar6.png'}}
        />
        <View style={styles.body}>
          <View style={styles.bodyContent}>
            <Text style={styles.name}>{this.state.bio.name}</Text>
            <TouchableOpacity
              onPress={this._logOut}
              style={styles.buttonContainer}>
              <Text style={styles.buttText}>Log Out</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#2E364F',
    flex: 1,
  },
  header: {
    backgroundColor: '#2D5D7C',
    height: 200,
  },
  avatar: {
    width: 130,
    height: 130,
    borderRadius: 63,
    borderWidth: 4,
    borderColor: '#F3F0E2',
    marginBottom: 10,
    alignSelf: 'center',
    position: 'absolute',
    marginTop: 130,
  },
  name: {
    fontSize: 22,
    color: '#F3F0E2',
    fontWeight: '600',
  },
  body: {
    marginTop: 40,
  },
  bodyContent: {
    flex: 1,
    alignItems: 'center',
    padding: 30,
  },
  info: {
    fontSize: 16,
    color: '#00BFFF',
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    color: '#696969',
    marginTop: 10,
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 10,
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
    backgroundColor: '#2D5D7C',
  },
  buttText: {
    color: '#F3F0E2',
  },
});
