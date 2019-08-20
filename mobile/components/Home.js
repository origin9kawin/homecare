import React from 'react';
import LogoutRequest from './LogoutHandler';
import CONFIG from '../config/Config'
import {
  StackActions,
  NavigationActions,
  createMaterialTopTabNavigator,
  createAppContainer,
  createStackNavigator
} from 'react-navigation';
import Icon from 'react-native-vector-icons/AntDesign';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
} from 'react-native';
import UnixThai from '../utils/UnixThai';
import CheckScreen from './Checking'
const HomeStackNavigator = createStackNavigator({
  Home: {
    screen: createMaterialTopTabNavigator({
      Check: {
        screen: props => <CheckScreen {...props} initState={1} isLoading={true} />,
        navigationOptions: ({ navigation }) => ({
          title: 'รายการเข้าตรวจสอบ',
        }),
      },
      Fix: {
        screen: props => <CheckScreen {...props} initState={0} isLoading={true} />,
        navigationOptions: ({ navigation }) => ({
          title: 'รายการเข้าซ่อม',
        }),
      }
    },
      {
        initialRouteName: 'Check',
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
      }
    }),
  }
});
class HeaderLeft extends React.Component {
  render() {
    return (
      <View style={{
        backgroundColor: '#fff',
        marginLeft: 10,
        flexDirection: 'row'
      }}>
        <Text style={{ fontSize: 27, color: '#000000' }}>Homecare</Text>
        <Text style={{ marginTop: 11, marginLeft: 10, color: '#CBCBCB' }}>{UnixThai.Time()}</Text>
      </View>
    )
  }
}
class HeaderRight extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      disabled: false,
    }
  }
  componentWillMount() {
    console.log("\nHome->componentWillMount: " + this.state.disabled)
    this.setState({
      disabled: false
    })
  }
  componentWillUnmount() {
    this.setState({})
  }
  componentDidMount() {
    console.log("\nHome->componentDidMount: prop " + this.props)
  }
  componentWillUpdate() {
    console.log("\nHome->componentWillUpdate: " + this.state.disabled)
  }
  async serverErrorAlert() {
    console.log("\nHome->serverErrorAlert: clear screen and redirect to Login")
    await Alert.alert(
      CONFIG.ERROR.server.message,
      CONFIG.ERROR.server.todo,
      [{
        text: 'OK',
        onPress: () => this.props.navigation.dispatch(StackActions.popToTop())
      },],
    );
  }
  logoutHandler = async () => {
    console.log("\nHome->logoutHandler: start process logout")
    this.setState({
      disabled: true
    })
    const logoutSuccess = await LogoutRequest.logoutAndClear()
    if (logoutSuccess == true) {
      console.log("\nHome->logoutHander: Logout successful")
      const resetAction = StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({ routeName: 'LoginScreen' }),
        ],
      });
      this.props.navigation.dispatch(resetAction);
    } else {
      console.log("\nHome->logoutHander: Logout is not success")
      this.serverErrorAlert()
    }
  }
  render() {
    return (
      <View style={{
        backgroundColor: '#fff',
        margin: 0,
        padding: 0,
        marginRight: 10,
        marginTop: 10,
      }}>
        <TouchableOpacity style={{
          width: 60,
          height: 60,
          justifyContent: 'center',
          alignItems: 'center',
        }}
          disabled={this.state.disabled}
          onPress={() => this.logoutHandler()}>
          <Icon name="logout" size={30} color="#000" />
        </TouchableOpacity>
      </View>
    )
  }
}
const HomeScreen = createAppContainer(HomeStackNavigator);
export default HomeScreen;
