import React from 'react';
import {
  createMaterialTopTabNavigator,
  createAppContainer,
  createStackNavigator
} from 'react-navigation';
import Icon from 'react-native-vector-icons/AntDesign';
import {
  View,
  Text,
  TouchableHighlight,
} from 'react-native';
import UnixThai from '../utils/UnixThai';
import SignScreen from './Signed.js'
const SemiStackNavigator = createStackNavigator({
  Home: {
    screen: createMaterialTopTabNavigator({
      Have: {
        screen: props => <SignScreen {...props} have={1} />,
        navigationOptions: ({ navigation }) => ({
          title: 'มีผู้รับงาน',
        }),
      },
      Havent: {
        screen: props => <SignScreen {...props} have={0} />,
        navigationOptions: ({ navigation }) => ({
          title: 'ไม่มีผู้รับงาน',
        }),
      }
    },
      {
        initialRouteName: 'Have',
        swipeEnabled: false,
        tabBarOptions: {
          activeTintColor: '#E2792D',
          inactiveTintColor: '#CBCBCB',
          style: {
            paddingTop: 0,
            paddingBottom: 10,
            backgroundColor: '#FFF',
            shadowOpacity: 0,
            shadowOffset: {
              height: 0,
            },
            shadowRadius: 0,
          },
          labelStyle: {
            fontSize: 20,
            padding: 0,
          },
          tabStyle: {
            width: 200,
            padding: 0,
            margin: 0,
          },
          indicatorStyle: {
            backgroundColor: '#E2792D',
            height: 3,
            marginBottom: 1,
          }
        }
      }),
    navigationOptions: ({ navigation }) => ({
      headerLeft: <HeaderLeft />,
      headerRight: <HeaderRight navigation={navigation} />,
      headerStyle: {
        backgroundColor: '#fff',
        elevation: 0,
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
        color: '#000',
        paddingTop: 0,
        paddingBottom: 0,
        margin: 0,
      },
    }),
  }
});
class HeaderLeft extends React.Component {
  constructor(props) {
    super(props)
  }
  _onPress = () => {
    console.log("_onPress")
    console.log(this);
  }
  render() {
    return (
      <TouchableHighlight
        onPress={() => this._onPress()}
        underlayColor="transparent">
        <View style={{
          marginLeft: 10,
          flexDirection: 'row'
        }}>
          <Icon style={{
            marginTop: 6,
          }} name="arrowleft" size={27} color="#000" />
          <Text style={{
            paddingLeft: 10,
            fontSize: 27,
            color: '#000000',
          }}>Homecare</Text>
        </View>
      </TouchableHighlight>
    )
  }
}
class HeaderRight extends React.Component {
  render() {
    return (
      <View style={{
        backgroundColor: '#fff',
        position: 'absolute',
        right: 10,
        flexDirection: 'row'
      }}>
        <Text style={{ marginTop: 11, marginLeft: 10, color: '#CBCBCB' }}>{UnixThai.Time()}</Text>
      </View>
    )
  }
}
const SemiFinal = createAppContainer(SemiStackNavigator);
export default SemiFinal;
