import React, {Component} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
} from 'react-native';
import {firebase as databaseFB} from '@react-native-firebase/database';
import {firebase as authFB} from '@react-native-firebase/auth';

export default class Chat extends Component {
  static navigationOptions = ({navigation}) => {
    return {
      headerStyle: {
        backgroundColor: '#2E364F',
      },
      headerTitleStyle: {
        color: '#F3F0E2',
      },
      headerTintColor: '#F3F0E2',
      title: navigation.getParam('name', null),
      headerRight: (
        <TouchableOpacity
          style={{marginRight: 20}}
          onPress={() =>
            navigation.navigate('Profile', {
              name: navigation.getParam('name'),
            })
          }>
          <Text style={{color: '#F3F0E2'}}>See Profile</Text>
        </TouchableOpacity>
      ),
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      textMessage: '',
      messagesList: [],
      person: {
        name: this.props.navigation.getParam('name'),
        uid: this.props.navigation.getParam('email'),
      },
      bio: [],
    };
  }

  componentWillMount() {
    const uid = authFB.auth().currentUser.uid;
    databaseFB
      .database()
      .ref('messages')
      .child(uid)
      .child(this.state.person.uid)
      .on('child_added', snapshot => {
        this.setState(prevState => {
          return {
            messagesList: [...prevState.messagesList, snapshot.val()],
          };
        });
      });
  }

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

  handleChange = key => val => {
    this.setState({[key]: val});
  };

  sendMessage = async () => {
    if (this.state.textMessage.length > 0) {
      const uid = authFB.auth().currentUser.uid;
      let msgId = databaseFB
        .database()
        .ref('messages')
        .child(uid)
        .child(this.state.person.uid)
        .push().key;
      let updates = {};
      let message = {
        message: this.state.textMessage,
        time: databaseFB.database.ServerValue.TIMESTAMP,
        from: uid,
      };
      updates[
        'messages/' + uid + '/' + this.state.person.uid + '/' + msgId
      ] = message;
      updates[
        'messages/' + this.state.person.uid + '/' + uid + '/' + msgId
      ] = message;
      databaseFB
        .database()
        .ref()
        .update(updates);
      databaseFB
        .database()
        .ref('messageHeaders')
        .child(uid)
        .child(this.state.person.uid)
        .set({
          message: this.state.textMessage,
          time: databaseFB.database.ServerValue.TIMESTAMP,
          from: uid,
          name: this.state.person.name,
          email: this.state.person.uid,
        });
      databaseFB
        .database()
        .ref('messageHeaders')
        .child(this.state.person.uid)
        .child(uid)
        .set({
          message: this.state.textMessage,
          time: databaseFB.database.ServerValue.TIMESTAMP,
          from: uid,
          name: this.state.bio.name,
          email: uid,
        });
      this.setState({textMessage: ''});
    }
  };

  renderRow = ({item}) => {
    const uid = authFB.auth().currentUser.uid;
    let itemStyle = item.from !== uid ? styles.itemIn : styles.itemOut;
    return (
      <View style={[styles.item, itemStyle]}>
        <View style={[styles.balloon]}>
          <Text>{item.message}</Text>
        </View>
      </View>
    );
  };

  render() {
    return (
      <View style={styles.container}>
        <FlatList
          style={styles.list}
          data={this.state.messagesList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={this.renderRow}
        />
        <View style={styles.footer}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.inputs}
              placeholder="Write a message..."
              underlineColorAndroid="transparent"
              value={this.state.textMessage}
              onChangeText={textMessage => this.setState({textMessage})}
            />
          </View>

          <TouchableOpacity onPress={this.sendMessage} style={styles.btnSend}>
            <Image
              source={{
                uri: 'https://png.icons8.com/small/75/ffffff/filled-sent.png',
              }}
              style={styles.iconSend}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingHorizontal: 17,
    backgroundColor: '#2D5D7C',
  },
  footer: {
    flexDirection: 'row',
    height: 50,
    backgroundColor: '#F3F0E2',
    paddingHorizontal: 10,
    padding: 5,
  },
  btnSend: {
    backgroundColor: '#2D5D7C',
    width: 40,
    height: 40,
    borderRadius: 360,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconSend: {
    width: 30,
    height: 30,
    alignSelf: 'center',
    marginLeft: 5,
  },
  inputContainer: {
    borderBottomColor: '#F3F0E2',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderBottomWidth: 1,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 10,
  },
  inputs: {
    height: 40,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
  },
  balloon: {
    maxWidth: 250,
    padding: 15,
    borderRadius: 20,
    backgroundColor: '#F3F0E2',
    borderColor: '#F3F0E2',
  },
  itemIn: {
    alignSelf: 'flex-start',
  },
  itemOut: {
    alignSelf: 'flex-end',
  },
  time: {
    alignSelf: 'flex-end',
    margin: 15,
    fontSize: 12,
    color: '#808080',
  },
  item: {
    marginVertical: 14,
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#eeeeee',
    borderRadius: 300,
    padding: 5,
  },
});
