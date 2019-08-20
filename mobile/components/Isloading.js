import React from 'react';
import {
  View,
  Dimensions,
  Image,
} from 'react-native'
const win = Dimensions.get('window');
const ratio = win.width / 200;
export default class IsLoading extends React.Component {
  constructor(isLoadingFromHome) {
    super()
    this.state = { isLoadingFromHome }
  }
  componentWillReceiveProps({ isLoadingFromHome }) {
    this.setState({ ...this.state, isLoadingFromHome })
  }
  render() {
    console.log('\nIsloading->render: ' + this.props.isLoadingFromHome)
    return (
      <View style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center'
      }}>
        <View style={{
          width: '49%',
          justifyContent: 'center',
          alignItems: 'center'
        }}>
          <Image style={{
            width: win.width / 3,
            height: 52 * ratio / 3,
          }} source={require('../assets/login-logo.png')}></Image>
        </View>
      </View >
    )
  }
}
