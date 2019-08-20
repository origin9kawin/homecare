import React, { Component } from 'react';
import * as Font from 'expo-font';
import { AppLoading } from 'expo';
import { setCustomText } from 'react-native-global-props';
import Login from './components/Login';
const customTextProps = {
  style: {
    fontSize: 16,
    fontFamily: 'Kanit-Regular',
    color: '#707070',
  }
};
setCustomText(customTextProps);
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appIsReady: false,
    }
  }
  async componentDidMount() {
    await Font.loadAsync({
      'SukhumvitSet-Bold': require('./fonts/SukhumvitSet-Bold.ttf'),
      'Kanit-Regular': require('./fonts/Kanit-Regular.ttf'),
      'Roboto-Medium': require('./fonts/Roboto-Medium.ttf'),
    });
    this.setState({ appIsReady: true });
  }
  render() {
    if (this.state.appIsReady) {
      console.log('\nApp.js: fonts is loaded')
      return (
        <Login />
      )
    } else {
      console.log('\nApp.js: fonts is loading....')
      return (
        <AppLoading />
      )
    }
  }
}
