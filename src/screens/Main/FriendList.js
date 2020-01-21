import React, {Component} from 'react';
import {Text, TouchableOpacity, FlatList, SafeAreaView} from 'react-native';
import {firebase as databaseFB} from '@react-native-firebase/database';
import {firebase as authFB} from '@react-native-firebase/auth';
export default class Home extends Component {
  static navigationOptions = {headerShown: false};
  constructor() {
    super();
    this.state = {
      myUid: authFB.auth().currentUser.uid,
      users: [],
    };
  }

  componentWillMount() {
    let usersRef = databaseFB.database().ref('users');
    usersRef.on('child_added', snapshot => {
      let person = snapshot.val();
      person.email = snapshot.key;
      if (person.email !== this.state.myUid) {
        this.setState(prevState => {
          return {
            users: [...prevState.users, person],
          };
        });
      }
    });
  }

  _logOut = async () => {
    this.props.navigation.navigate('Auth');
  };

  renderRow = ({item}) => {
    return (
      <TouchableOpacity
        onPress={() => this.props.navigation.navigate('ChatRoom', item)}
        style={{padding: 10, borderBottomColor: '#ccc', borderBottomWidth: 1}}>
        <Text style={{fontSize: 20}}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <SafeAreaView style={{flex: 1, backgroundColor: '#F3F0E2'}}>
        <FlatList
          data={this.state.users}
          renderItem={this.renderRow}
          keyExtractor={item => item.email}
        />
      </SafeAreaView>
    );
  }
}
