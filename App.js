/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createMaterialTopTabNavigator} from 'react-navigation-tabs';

// import component
import SignUp from './src/screens/Auth/SignUp';
import SignIn from './src/screens/Auth/SignIn';
import MyAccount from './src/screens/Main/MyAccount';
import Profile from './src/screens/Main/Profile';
import Home from './src/screens/Main/Home';
import ChatRoom from './src/screens/Main/Chat';
import FriendList from './src/screens/Main/FriendList';
import SplashScreen from './src/screens/SplashScreen';

// for disable yellow box warn
console.disableYellowBox = true;

const AuthStack = createStackNavigator({
  SignIn,
  SignUp,
});

const HomeStack = createStackNavigator({
  Home,
  ChatRoom,
  Profile,
});

const FriendStack = createStackNavigator({
  FriendList,
});

const MyAccountStack = createStackNavigator({
  MyAccount,
});

const RootStack = createMaterialTopTabNavigator(
  {
    Chat: HomeStack,
    FriendList: FriendStack,
    MyAccount: MyAccountStack,
  },
  {
    tabBarOptions: {
      activeTintColor: 'white',
      showIcon: false,
      showLabel: true,
      style: {
        backgroundColor: '#2E364F',
      },
      indicatorStyle: {
        backgroundColor: '#EF5939',
      },
    },
  },
);

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: SplashScreen,
      App: RootStack,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'AuthLoading',
    },
  ),
);
