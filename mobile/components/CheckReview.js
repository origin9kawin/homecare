import React from 'react';
import { StackActions, NavigationActions } from 'react-navigation';
import {
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
  ActivityIndicator,
  Dimensions,
  Platform,
} from 'react-native';
import UnixThai from '../utils/UnixThai';
import { ScrollView } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/AntDesign';
import MakeRequest from './MakeRequest'
import ReRow from './ReRow'
import SopStep from './SopStep'
const win = Dimensions.get('window');
class HeaderLeft extends React.Component {
  constructor(props) { super(props); }
  _onPress = () => {
    console.log("_onPress")
    if (this.props.navigation.getParam('backWithReload') == undefined) {
      this.props.navigation.navigate('HomeScreen');
    } else {
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
          <Text style={{ marginTop: 11, marginLeft: 10, color: '#CBCBCB' }}>{UnixThai.Time()}</Text>
        </View>
      </TouchableHighlight>
    )
  }
}
export default class CheckReview extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    headerLeft: <HeaderLeft sopStatus={0} navigation={navigation} />,
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
    this.state = {
      casedetData: [],
      issubLoading: true,
      item: {},
      sopStatus: {},
      sopReason: [],
    };
  }
  getSopStatusResponse(result) {
    this.props.navigation.setParams({
      backWithReload: true,
    });
    this.setState({
      sopStatus: result
    });
  }
  getSopReasonResponse(result) {
    this.setState({
      sopReason: result
    });
  }
  async processCallback(responseRequest) {
    console.log("\nCheckReview->processCallback: response: " + responseRequest)
    for (var key in responseRequest) { if (responseRequest.hasOwnProperty(key)) { this.setState({ [key]: responseRequest[key] }) } }
  }
  async callbackMakeRequest() {
    this.setState({
      issubLoading: true
    })
    console.log("\nCheckReview->callbackMakeRequest: start calling back data from make request")
    const responseRequest = await MakeRequest.fetchCheckReview(this.params.item)
    console.log("\nCheckReview->callbackMakeRequest: response: " + responseRequest)
    this.processCallback(responseRequest)
  }
  componentDidMount() {
    console.log('\nCheckReview->componentDidMount: ' + JSON.stringify(this.params.item))
    this.callbackMakeRequest()
  }
  componentDidUpdate(prevProps, prevState) {
  }
  componentWillUnmount() {
    this.setState({});
    this.params = null;
  }
  _onPressStartChecking = (item) => {
    console.log("_onPressStartChecking")
    this.props.navigation.navigate('CheckSave', {
      item: item
    })
  }
  _onPressStartAssign = (item) => {
    console.log("_onPressStartChecking")
    this.props.navigation.navigate('CheckAssign', {
      item: item
    })
  }
  renderToCheckButton(item) {
    return (
      <View style={[styles.backToCheckButton]}>
        <TouchableHighlight
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => this._onPressStartChecking(item)}
          underlayColor="#E2792D">
          <Text style={{
            color: '#FFF',
            fontSize: 20,
            paddingVertical: 10,
          }}>เริ่มตรวจสอบ</Text>
        </TouchableHighlight>
      </View>
    )
  }
  renderToAssignButton(item) {
    return (
      <View style={[styles.backToCheckButton]}>
        <TouchableHighlight
          style={{
            justifyContent: 'center',
            alignItems: 'center',
          }}
          onPress={() => this._onPressStartAssign(item)}
          underlayColor="#E2792D">
          <Text style={{
            color: '#FFF',
            fontSize: 20,
            paddingVertical: 10,
          }}>มอบหมายงาน</Text>
        </TouchableHighlight>
      </View>
    )
  }
  render() {
    const casedetData = this.state.casedetData
    if (casedetData.length > 0) {
      const item = this.state.item;
      Object.keys(casedetData[0]).forEach(function (itms) {
        item[itms] = casedetData[0][itms]
      })
      item['data'] = this.params.data
      item['case'] = this.params.item
      const statusMap = item.data.statusdata.filter(status => status.ids === item.case.statusId)[0];
      item['statusOrdering'] = statusMap.orderinng;
      item['initState'] = this.params.initState;
      return (
        <View style={styles.container}>
          <ScrollView>
            <ReRow rows={'firstRow'} item={item} />
            <ReRow rows={'secondRow'} item={item} />
            {statusMap.ordering >= 2 ? (
              <ReRow rows={'thirdRow'} sopStatus={this.state.sopStatus} sopReason={this.state.sopReason} item={item} />
            ) : null}
            {statusMap.ordering == 2 ? (
              this.renderToAssignButton(item)
            ) : null}
            {statusMap.ordering == 1 ? (
              this.renderToCheckButton(item)
            ) : null}
            {item.initState == 0 ? (
              <SopStep item={item} callbackStatus={this.getSopStatusResponse.bind(this)} callbackReason={this.getSopReasonResponse.bind(this)} navigation={this.props.navigation} />
            ) : null}
          </ScrollView>
        </View>
      )
    } else {
      return (
        <View style={{
          flex: 1,
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
        }}>
          <ActivityIndicator size='large' color='#E2792D' />
        </View>
      )
    }
  }
}
const styles = StyleSheet.create({
  backToCheckButton: {
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
