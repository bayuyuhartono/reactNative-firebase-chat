import React, {Component} from 'react';
import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';

export default class Profile extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      headerStyle: {
        backgroundColor: '#2E364F',
      },
      headerTitleStyle: {
        color: '#F3F0E2',
      },
      headerTintColor: '#F3F0E2',
      title: 'Profile',
    };
  };
  constructor(props) {
    super(props);
    this.state = {bio: []};
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
            <Text style={styles.name}>
              {this.props.navigation.getParam('name')}
            </Text>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate('Map', {
                  name: this.props.navigation.getParam('name'),
                  uid: this.props.navigation.getParam('uid'),
                })
              }
              style={styles.buttonContainer}>
              <Text style={styles.buttText}>See Location</Text>
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
