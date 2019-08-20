import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import {
  MaterialCommunityIcons,
  Octicons,
} from '@expo/vector-icons';
import MakeRequest from './MakeRequest'
import { TextInput } from 'react-native-gesture-handler';
class SignScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: this.props.isLoading,
      issubLoading: true,
      statusList: [
        {
          id: 1,
          name: 'ครบ',
          active: true
        },
        {
          id: 2,
          name: 'ไม่ครบ',
          active: false
        }
      ]
    }
  }
  async processCallback(responseRequest) {
  }
  async callbackMakeRequest() {
    this.setState({
      issubLoading: true
    })
    console.log("\nSigned->callbackMakeRequest: start calling back data from make request")
    const responseRequest = await MakeRequest.fetchCase(this.state)
    this.processCallback(responseRequest)
  }
  componentDidMount() {
    console.log("\nSigned->componentDidMount: component is mounted")
  }
  componentWillUnmount() {
    console.log("\nSigned->componentWillUnmount")
    this.setState({})
  }
  componentWillMount() {
    console.log("\nSigned->componentWillMount calling caseList")
  }
  radioSelect = (activeRadio) => {
    let updatedStatusList = [];
    this.state.statusList.map(element => {
      let active = 0;
      if (element.id == activeRadio) { active = 1 }
      updatedStatusList.push({
        id: element.id,
        name: element.name,
        active: active,
      });
    });
    this.setState({
      statusList: updatedStatusList,
    })
  }
  statusList = () => {
    return (
      this.state.statusList.map((value, i) => {
        let selectColor = '#E2792D';
        if (value.active == 0) {
          selectColor = '#010101';
        }
        return (
          <View key={i} style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              onPress={() => this.radioSelect(value.id)}
            >
              <View style={{ flexDirection: 'row', marginLeft: 10, backgroundColor: '#fff', paddingVertical: 10 }}>
                {this.state.statusList.filter(status => status.id === value.id)[0].active == 1 ? (
                  <MaterialCommunityIcons name="radiobox-marked" size={32} color={selectColor} />
                ) : (
                    <MaterialCommunityIcons name="radiobox-blank" size={32} color={selectColor} />
                  )}
                <Text style={{ fontSize: 20, marginLeft: 10 }}>{value.name}</Text>
              </View>
            </TouchableOpacity>
          </View>
        )
      })
    )
  }
  renderHave() {
    return (
      <ScrollView>
        <View style={{
          flexDirection: 'column',
          margin: 10,
          backgroundColor: '#fff',
          padding: 20,
          borderRadius: 3,
          elevation: 6,
          shadowOffset: {
            height: 2,
            width: 0
          },
          shadowColor: "rgba(0,0,0,1)",
          shadowOpacity: 0.24,
          shadowRadius: 1,
          overflow: "visible",
        }}>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
          }}>
            <Text style={{
              fontSize: 23,
              color: '#E2792D',
            }}>มีผู้รับงาน</Text>
          </View>
          <Text style={{ fontSize: 20, marginTop: 10, }}>ทรัพย์สินครบทุกชิ้น</Text>
          <View style={{
            flexDirection: 'row',
            marginVertical: 10,
          }}>
            {this.statusList()}
          </View>
          <Text style={{ fontSize: 20, marginVertical: 10 }}>ชื่อ-นามสกุล </Text>
          <View style={{
          }}>
            <TextInput
              style={{ fontSize: 20, marginVertical: 10, borderBottomColor: '#B5B5B5', borderBottomWidth: 1, paddingVertical: 10 }}
              placeholder=''
              autoCompleteType="off"
              autoCapitalize="none"
              maxLength={80}
              underlineColorAndroid={'rgba(0,0,0,0)'}
              returnKeyType="next"
              blurOnSubmit={true}
              multiline={false}
              underlineColorAndroid='transparent'
            ></TextInput>
          </View>
          <View>
            <TextInput>
            </TextInput>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10, marginHorizontal: 5 }}>
            <View style={{ flexDirection: 'row' }}>
              <Octicons name='pencil' size={22} color='#E2792D' />
              <Text style={{ fontSize: 22, marginLeft: 10, }}>ลงนาม</Text>
            </View>
            <View style={[styles.backToHomeButton, { backgroundColor: '#F4F4F4', width: 100, }]}>
              <TouchableHighlight
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => console.log('pressed')}
                underlayColor='#E2792D'>
                <Text style={{
                  color: '#000',
                  fontSize: 20,
                  paddingVertical: 10,
                }}>Clear</Text>
              </TouchableHighlight>
            </View>
          </View>
          <View style={{
            width: '100%',
            height: 250,
            borderWidth: 1,
            borderColor: '#B5B5B5',
            borderStyle: 'solid',
            borderRadius: 5
          }}>
            {/* Sign Here */}

          </View>
          <View style={{
            flexDirection: 'row',
            justifyContent: 'center',
            margin: 10,
          }}>
            <View style={[styles.backToHomeButton, { backgroundColor: '#F4F4F4', width: '50%', marginHorizontal: 10, }]}>
              <TouchableHighlight
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => console.log('pressed')}
                underlayColor='#E2792D'>
                <Text style={{
                  color: '#000',
                  fontSize: 20,
                  paddingVertical: 10,
                }}>ยกเลิก</Text>
              </TouchableHighlight>
            </View>
            <View style={[styles.backToHomeButton, { backgroundColor: '#FBBD0A', width: '50%', marginHorizontal: 10, }]}>
              <TouchableHighlight
                style={{
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
                onPress={() => console.log('pressed')}
                underlayColor='#E2792D'>
                <Text style={{
                  color: '#FFF',
                  fontSize: 20,
                  paddingVertical: 10,
                }}>ตกลง</Text>
              </TouchableHighlight>
            </View>
          </View>
        </View>
      </ScrollView>
    )
  }
  renderHavent() {
    return (
      <View style={{
        flexDirection: 'column',
        margin: 10,
      }}>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center'
        }}>
          <Text style={{
          }}>ไม่มีผู้รับงาน</Text>
        </View>
      </View>
    )
  }
  render() {
    console.log(this.props.have);
    return (
      <View style={[styles.container]}>
        {this.props.have == 1 ? (
          this.renderHave()
        ) : (
            this.renderHavent()
          )}
      </View>
    )
  }
}
export default SignScreen;
const styles = StyleSheet.create({
  backToHomeButton: {
    marginVertical: 10,
    borderRadius: 1,
    elevation: 1,
    shadowOffset: {
      height: 1,
      width: 0
    },
    shadowColor: "rgba(0,0,0,1)",
    shadowOpacity: 0.24,
    shadowRadius: 1,
    overflow: "visible",
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F7F7F7',
  },
});