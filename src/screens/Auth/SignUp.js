import React from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableHighlight,
  Alert,
} from 'react-native';
import {firebase as authFB} from '@react-native-firebase/auth';
import {firebase as databaseFB} from '@react-native-firebase/database';
export default class SignUp extends React.Component {
  static navigationOptions = {
    //To hide the ActionBar/NavigationBar
    header: null,
  };
  constructor() {
    super();

    this.state = {
      name: '',
      email: '',
      password: '',
      errorMessage: null,
    };
  }

  handleSignUp = () => {
    if (!this.state.name) {
      return Alert.alert('Alert', 'name is required');
    }
    if (!this.state.email) {
      return Alert.alert('Alert', 'email is required');
    }
    if (!this.state.password) {
      return Alert.alert('Alert', 'password is required');
    }
    authFB
      .auth()
      .createUserWithEmailAndPassword(this.state.email, this.state.password)
      .then(res => {
        console.warn(res.user.uid);
        databaseFB
          .database()
          .ref('users/' + res.user.uid)
          .set({
            name: this.state.name,
            email: this.state.email,
          });
        this.props.navigation.navigate('App');
      })
      .catch(error => this.setState({errorMessage: error.message}));
  };

  render() {
    return (
      <View style={styles.container}>
        {this.state.errorMessage && (
          <Text style={{color: 'red'}}>{this.state.errorMessage}</Text>
        )}
        <Text style={styles.label}>Name</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputs}
            placeholder="Name"
            underlineColorAndroid="transparent"
            onChangeText={name => this.setState({name})}
          />
        </View>

        <Text style={styles.label}>Email</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputs}
            placeholder="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            underlineColorAndroid="transparent"
            onChangeText={email => this.setState({email})}
          />
        </View>

        <Text style={styles.label}>Password</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.inputs}
            autoCapitalize="none"
            placeholder="Password"
            secureTextEntry={true}
            underlineColorAndroid="transparent"
            onChangeText={password => this.setState({password})}
          />
        </View>

        <TouchableHighlight
          style={[styles.buttonContainer, styles.regisButton]}
          onPress={this.handleSignUp}>
          <Text style={styles.regisText}>Sign Up</Text>
        </TouchableHighlight>

        <TouchableHighlight
          style={styles.buttonContainer}
          onPress={() => this.props.navigation.navigate('SignIn')}>
          <Text>Login</Text>
        </TouchableHighlight>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F3F0E2',
  },
  inputContainer: {
    borderBottomColor: '#F5FCFF',
    backgroundColor: '#FFFFFF',
    borderRadius: 30,
    borderBottomWidth: 1,
    width: 250,
    height: 45,
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inputs: {
    height: 45,
    marginLeft: 16,
    borderBottomColor: '#FFFFFF',
    flex: 1,
  },
  inputIcon: {
    width: 30,
    height: 30,
    marginLeft: 15,
    justifyContent: 'center',
  },
  buttonContainer: {
    height: 45,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    width: 250,
    borderRadius: 30,
  },
  regisButton: {
    backgroundColor: '#2D5D7C',
  },
  regisText: {
    color: 'white',
  },
  label: {
    marginBottom: 10,
  },
  picker: {height: 50, width: 240, marginLeft: 10},
});
