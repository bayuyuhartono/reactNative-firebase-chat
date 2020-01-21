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
      messageHeaders: [],
    };
  }

  componentWillMount() {
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

  _logOut = async () => {
    this.props.navigation.navigate('Auth');
  };

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
