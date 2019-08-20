import React from 'react';
import { StackActions, NavigationActions } from 'react-navigation';
import {
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
  Dimensions,
  Platform,
} from 'react-native';
import UnixThai from '../utils/UnixThai';
import { ScrollView } from 'react-native-gesture-handler';
import ReRow from './ReRow'
const win = Dimensions.get('window');
const ratio = win.width / 200;
class HeaderLeft extends React.Component {
  constructor(props) { super(props); }
  _onPress = () => {
    console.log("_onPress")
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
          <Text style={{
            paddingLeft: 10,
            fontSize: 27,
            color: '#000000',
          }}>Homecare</Text>
          <Text style={{ marginTop: 11, marginLeft: 10, color: '#CBCBCB' }}>{UnixThai.Time()}</Text>
        </View>
      </TouchableHighlight>
    )
  }
}
export default class CheckSummary extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerLeft: <HeaderLeft navigation={navigation} />,
    headerStyle: {
      backgroundColor: '#FFFFFF',
      paddingTop: 0,
      paddingBottom: 10,
      backgroundColor: '#FFF',
      shadowOpacity: 0,
      elevation: 6,
      shadowOffset: {
        height: 2,
        width: 0
      },
      shadowRadius: 0,
    },
    headerTintColor: '#000000',
    headerTitleStyle: {
      fontWeight: 'bold',
      color: '#000',
      paddingTop: 0,
      paddingBottom: 0,
      margin: 0,
    }
  })
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params;
  }
  componentDidMount() {
    console.log("\nCheckReview->componentDidMount: component is mounted")
  }
  componentWillUnmount() {
    this.params = null
  }
  toHomeScreen = () => {
    console.log("\CheckSummary->User Abort: asking back to HomeScreen")
    const resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({
          routeName: 'HomeScreen'
        }),
      ],
    });
    this.props.navigation.dispatch(resetAction);
    this.props.navigation.navigate('Check')
  }
  renderBacktoHome = (item) => {
    let actionText = 'ตรวจสอบสำเร็จ'
    if (item.nonZero != undefined) {
      actionText = 'มอบหมายสำเร็จ'
    }
    return (
      <View style={[styles.backToHomeButton]}>
        <TouchableHighlight
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => (this.toHomeScreen())}
          underlayColor='#E2792D'>
          <Text style={{
            color: '#FFF',
            fontSize: 20,
            paddingVertical: 10,
          }}>{actionText} กลับไปหน้าหลัก</Text>
        </TouchableHighlight>
      </View>
    )
  }
  render() {
    const item = this.params.item
    if (item.update != undefined) {
      var deleting = ['id', 'assignImages', 'assignTabs', 'vstyles', 'xHomeListDefect', 'xHomePhone_Owner', 'xHomePhone_Issuer'];
      deleting.forEach(element => {
        delete item[element];
      });
    }
    return (
      <View style={styles.container}>
        <ScrollView>
          <ReRow rows={'firstRow'} item={item} />
          <ReRow rows={'secondRow'} item={item} />
          <ReRow rows={'thirdRow'} item={item} />
          {this.renderBacktoHome(item)}
        </ScrollView>
      </View>
    )
  }
}
const styles = StyleSheet.create({
  backToHomeButton: {
    backgroundColor: '#FBBD0A',
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 30,
    borderRadius: 3,
    elevation: 3,
    shadowOffset: {
      height: 2,
      width: 0
    },
    shadowColor: "rgba(0,0,0,1)",
    shadowOpacity: 0.24,
    shadowRadius: 2,
    overflow: "visible",
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F7F7F7',
    paddingTop: Platform.select({ ios: 0, android: 10 }),
  },
});
