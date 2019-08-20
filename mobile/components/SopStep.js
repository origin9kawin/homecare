import React from 'react';
import { SQLite } from 'expo-sqlite';
import {
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import Modal from "react-native-modal";
import MakeRequest from './MakeRequest'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import SopImage from './SopImage';
const win = Dimensions.get('window');
const db = SQLite.openDatabase("homecare.db");
export default class SopStep extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      opId: null,
      opText: null,
      modalVisible: false,
      isModalVisible: false,
      statusList: [],
      statusOriginState: null,
      reasonList: [],
      reasonOriginState: null,
      preparedUpdate: [],
      modalView: 'reason',
      statusDisable: false,
      reasonDisable: true,
      finishDisable: false,
      isLoading: false,
      isSuccess: false,
      pleaseRetry: false,
    }
  }
  prepareStatusList = () => {
    try {
      db.transaction(
        tx => {
          tx.executeSql("select ids,name,ordering,selectAble,initState,reasonBtn from status where initState=0 order by ordering asc", [], (_, { rows: { _array } }) => {
            let rearrange = [];
            _array.forEach(element => {
              let activeState = 0;
              let statusId = this.props.item.statusId;
              if (this.props.item.xHomeListDefect != undefined) {
                if (this.props.item.xHomeListDefect.length > 0) {
                  if (this.props.item.xHomeListDefect[0].xHomeCaseDet.length > 0) {
                    statusId = this.props.item.data.statusdata.filter(status => status.ids === this.props.item.case.statusId)[0].ids;
                  }
                }
              }
              if (element.ids == statusId) { activeState = 1 }
              rearrange.push({
                ids: element.ids,
                name: element.name,
                ordering: element.ordering,
                selectAble: element.selectAble,
                initState: element.initState,
                reasonBtn: element.reasonBtn,
                activeState: activeState,
              });
            });
            let current = rearrange.filter(arr => arr.activeState === 1)[0].ids;
            this.setState({
              statusList: rearrange,
              statusOriginState: current,
            });
          });
        }
      );
    } catch (error) { console.log(error); return false }
    finally {
      console.log("\nSopStep->prepareStatusList: done")
    }
  }
  prepareReasonList = () => {
    try {
      db.transaction(
        tx => {
          tx.executeSql("select ids,name,ordering from reason where 1 order by ordering asc", [], (_, { rows: { _array } }) => {
            let rearrange = [];
            let reasonsDet = this.props.item.xHomeListDefect.filter(def => def.casedetId === this.props.item.case.casedetId)[0].xHomeCaseDet[0].xHomeReasonDet;
            let reasonIds = []
            reasonsDet.forEach(element => {
              reasonIds.push(element.reasonId);
            });
            _array.forEach(element => {
              let activeState = 0;
              if (reasonIds.indexOf(element.ids) != -1) {
                activeState = 1;
              }
              rearrange.push({
                ids: element.ids,
                name: element.name,
                ordering: element.ordering,
                activeState: activeState,
              });
            })
            this.setState({
              reasonList: rearrange,
              reasonOriginState: rearrange,
            });
            this.props.callbackReason(rearrange);
          });
        }
      );
    } catch (error) { console.log(error); return false }
    finally {
      console.log("\nSopStep->prepareReasonList: done")
    }
  }
  activeBtnReasonState() {
    if (this.props.item.xHomeListDefect != undefined) {
      if (this.props.item.xHomeListDefect.length > 0) {
        if (this.props.item.xHomeListDefect[0].xHomeCaseDet.length > 0) {
          const statusMap = this.props.item.data.statusdata.filter(status => status.ids === this.props.item.case.statusId)[0];
          if (statusMap.reasonBtn == 1) {
            this.setState({
              reasonDisable: false,
            })
          }
        }
      }
    }
  }
  componentDidMount() {
    console.log("SopStep did mount");
    this.prepareStatusList();
    this.prepareReasonList();
    this.activeBtnReasonState();
  }
  componentDidUpdate() {
    console.log("SopStep did update");
  }
  componentWillUnmount() {
    console.log('\nSopStep unmount');
  }
  async processCallback(responseRequest) {
    console.log("\nCheckSave->processCallback: response: " + JSON.stringify(responseRequest))
    for (var key in responseRequest) { if (responseRequest.hasOwnProperty(key)) { this.setState({ [key]: responseRequest[key] }) } }
  }
  callbackMakeRequest = async () => {
    this.setState({
      isLoading: true
    })
    console.log("\nSopStep->callbackMakeRequest: start calling back data from make request")
    const responseRequest = await MakeRequest.SopStep(this.state.preparedUpdate)
    console.log("\nSopStep->callbackMakeRequest: response: " + JSON.stringify(responseRequest))
    this.processCallback(responseRequest)
  }
  reasonModal = (item) => {
    let preparedUpdate = {
      checkedLists: this.state.reasonOriginState,
      casedetId: this.props.item.case.casedetId,
      caseId: this.props.item.case.id,
      statusId: this.state.statusOriginState,
      action: 'reasonUpdate'
    }
    this.setState({
      isModalVisible: !this.state.isModalVisible,
      modalView: 'reason',
      preparedUpdate: preparedUpdate
    })
  }
  statusModal = (item) => {
    let preparedUpdate = {
      statusId: this.state.statusOriginState,
      casedetId: this.props.item.case.casedetId,
      caseId: this.props.item.case.id,
      action: 'statusUpdate'
    }
    this.setState({
      isModalVisible: !this.state.isModalVisible,
      modalView: 'status',
      preparedUpdate: preparedUpdate
    })
  }
  semiFinal = (item) => {
    this.props.navigation.navigate('SemiFinal', {
      item: item,
    });
  }
  toggleModal = () => {
    this.setState({
      isModalVisible: !this.state.isModalVisible,
    });
  };
  abortEdit = () => {
    console.log("\nSopStep->abortEdit: user cancel it")
    this.setState({
      isModalVisible: !this.state.isModalVisible
    },
      () => {
        // reset back to original state
        if (this.state.modalView == 'status') {
          let updatedStatusList = [];
          this.state.statusList.map(element => {
            let activeState = 0;
            if (element.ids == this.state.statusOriginState) { activeState = 1 }
            updatedStatusList.push({
              ids: element.ids,
              name: element.name,
              ordering: element.ordering,
              selectAble: element.selectAble,
              initState: element.initState,
              reasonBtn: element.reasonBtn,
              activeState: activeState,
            });
          });
          this.setState({
            statusList: updatedStatusList,
          })
        }
        if (this.state.modalView == 'reason') {
          console.log("reason");
          this.setState({
            reasonList: this.state.reasonOriginState,
          })
        }
      });
  }
  updateStatus = () => {
    console.log("\nSopStep->success update statusId");
    const statusMap = this.props.item.data.statusdata.filter(status => status.ids === this.state.preparedUpdate.statusId)[0];
    let reasonDisable = true;
    if (statusMap.reasonBtn == 1) {
      reasonDisable = false
    }
    this.setState({
      isModalVisible: !this.state.isModalVisible,
      isSuccess: false,
      reasonDisable: reasonDisable,
    });
    if (this.state.modalView == 'status') {
      this.props.callbackStatus(this.state.preparedUpdate);
      this.setState({
        statusOriginState: this.state.preparedUpdate.statusId
      })
    }
    if (this.state.modalView == 'reason') {
      this.props.callbackReason(this.state.reasonList);
      this.setState({
        reasonOriginState: this.state.reasonList
      })
    }
  }
  modalViewEdit = (item) => {
    let titleSubject = ''; if (this.state.modalView == 'status') { titleSubject = 'แก้ไขสถานะ'; } if (this.state.modalView == 'reason') { titleSubject = 'แก้ไขเหตุผล'; }
    return (
      <View style={[styles.modalTopView]}>
        <Modal isVisible={this.state.isModalVisible}>
          <View style={[styles.modalMainView]}>
            <View style={{
              width: '100%',
              position: 'absolute',
              top: 10,
              left: 10
            }}>
              <Text style={{
                fontSize: 25,
                color: '#000'
              }}>{titleSubject}</Text>
            </View>
            <View style={{
              width: '100%',
              position: 'absolute',
              top: 60,
              left: 10,
              flexDirection: 'row'
            }}>
              <View style={{
                flexDirection: 'column',
                flexWrap: 'wrap'
              }}>
                {this.state.modalView == 'status' ? (
                  this.modalStatusList(item)
                ) : null}
                {this.state.modalView == 'reason' ? (
                  this.modalReasonList(item)
                ) : null}
              </View>
            </View>
            {this.state.isLoading ? (
              <View style={[styles.modalSubmitView, {
                borderTopWidth: 0,
              }]}>
                <ActivityIndicator size='large' color='#E2792D' />
              </View>
            ) : (
                this.state.isSuccess ? (
                  <View style={[styles.modalSubmitView, {
                    paddingLeft: 30,
                  }]}>
                    <Text style={{
                      fontSize: 14,
                      paddingRight: 30,
                      paddingTop: 10,
                    }}>บันทึกข้อมูลสำเร็จ</Text>
                    <TouchableOpacity onPress={this.updateStatus}>
                      <Text style={[styles.modalButton, {
                      }]}>OK</Text>
                    </TouchableOpacity>
                  </View>
                ) : (
                    this.state.pleaseRetry ? (
                      <View style={[styles.modalSubmitView, {
                        paddingLeft: 20,
                      }]}>
                        <Text style={{
                          fontSize: 12,
                          paddingRight: 30,
                          paddingTop: 15,
                        }}>! โปรดลองใหม่อีกครั้ง</Text>
                        <TouchableOpacity onPress={this.abortEdit}>
                          <Text style={[styles.modalButton, {
                            marginRight: 20,
                          }]}>CANCEL</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={this.callbackMakeRequest}>
                          <Text style={[styles.modalButton, {
                          }]}>OK</Text>
                        </TouchableOpacity>
                      </View>
                    ) : (
                        <View style={[styles.modalSubmitView]}>
                          <TouchableOpacity onPress={this.abortEdit}>
                            <Text style={[styles.modalButton, {
                              marginRight: 20,
                            }]}>CANCEL</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={this.callbackMakeRequest}>
                            <Text style={[styles.modalButton, {
                            }]}>OK</Text>
                          </TouchableOpacity>
                        </View>
                      )
                  )
              )}
          </View>
        </Modal>
      </View>
    )
  }
  radioSelect = (activeRadio) => {
    let preparedUpdate = {
      statusId: activeRadio,
      casedetId: this.props.item.case.casedetId,
      caseId: this.props.item.case.id,
      action: 'statusUpdate'
    }
    let updatedStatusList = [];
    this.state.statusList.map(element => {
      let activeState = 0;
      if (element.ids == activeRadio) { activeState = 1 }
      updatedStatusList.push({
        ids: element.ids,
        name: element.name,
        ordering: element.ordering,
        selectAble: element.selectAble,
        initState: element.initState,
        reasonBtn: element.reasonBtn,
        activeState: activeState,
      });
    });
    this.setState({
      statusList: updatedStatusList,
      preparedUpdate: preparedUpdate,
    })
  }
  checkboxSelect = (activeCheckbox) => {
    let updatedReasonList = [];
    let checkedLists = [];
    this.state.reasonList.map(element => {
      let activeState = element.activeState;
      if (element.ids == activeCheckbox) { activeState = !element.activeState }
      updatedReasonList.push({
        ids: element.ids,
        name: element.name,
        ordering: element.ordering,
        activeState: activeState,
      });
      if (activeState == 1) {
        checkedLists.push(element.ids);
      }
    });
    let preparedUpdate = {
      checkedLists: checkedLists,
      casedetId: this.props.item.case.casedetId,
      caseId: this.props.item.case.id,
      statusId: this.state.statusOriginState,
      action: 'reasonUpdate'
    }
    this.setState({
      reasonList: updatedReasonList,
      preparedUpdate: preparedUpdate,
    })
  }
  modalStatusList = (item) => {
    return (
      this.state.statusList.map((value, i) => {
        let selectDisable = false;
        let selectColor = '#000';
        if (value.selectAble == 0) {
          selectDisable = true
          selectColor = '#CBCBCB';
        }
        return (
          <View key={i} style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              disabled={selectDisable}
              onPress={() => this.radioSelect(value.ids)}
            >
              <View style={{ flexDirection: 'row', marginLeft: 10, marginBottom: 5, backgroundColor: '#fff', width: 300, paddingVertical: 10 }}>
                {this.state.statusList.filter(status => status.ids === value.ids)[0].activeState == 1 ? (
                  <Icon name="radiobox-marked" size={20} color={selectColor} />
                ) : (
                    <Icon name="radiobox-blank" size={20} color={selectColor} />
                  )}
                <Text style={[styles.checkboxText, { color: selectColor }]}>{value.name}</Text>
              </View>
            </TouchableOpacity>
          </View>
        )
      })
    )
  }
  modalReasonList = (item) => {
    return (
      this.state.reasonList.map((value, i) => {
        let selectColor = '#000';
        return (
          <View key={i} style={{ flexDirection: 'row' }}>
            <TouchableOpacity
              onPress={() => this.checkboxSelect(value.ids)}
            >
              <View style={{ flexDirection: 'row', marginLeft: 10, marginBottom: 5, backgroundColor: '#fff', width: 300, paddingVertical: 10 }}>
                {this.state.reasonList.filter(status => status.ids === value.ids)[0].activeState == 1 ? (
                  <Icon name="checkbox-marked-outline" size={20} color={selectColor} />
                ) : (
                    <Icon name="checkbox-blank-outline" size={20} color={selectColor} />
                  )}
                <Text style={[styles.checkboxText, { color: selectColor }]}>{value.name}</Text>
              </View>
            </TouchableOpacity>
          </View>
        )
      })
    )
  }
  modalWaiting = (item) => {
    if (this.state.isModalVisible) {
      return this.modalViewEdit(item)
    }
  }
  sopList = (item) => {
    let imgmaindata = [];
    let i = 0;
    item.data.imgmaindata.map((value, key) => {
      if (value.selectAble == 0) {
        imgmaindata[i] = value
        i += 1;
      }
    });
    return (
      imgmaindata.map((value, key) => {
        let no = key + 1;
        return (
          <View key={key}>
            {value.selectAble == 0 ? (
              <View>
                <TouchableHighlight underlayColor='transparent' onPress={() => this.setState({ opId: value.ids, opText: value.name })}>
                  <View style={[styles.sopStep]}><View style={[styles.circleSop]}></View><Text style={[styles.sopText]}>{no}</Text></View>
                </TouchableHighlight>
              </View>
            ) : null}
          </View>
        )
      })
    )
  }
  render() {
    let fontColor = {
      active: '#FFF',
      unactive: '#A1A1A1'
    }
    let bgColor = {
      active: '#E2792D',
      unactive: '#D9D9D9'
    }
    let activeBackgroundStatus = bgColor.active;
    let activeFontColorStatus = fontColor.active;
    if (this.state.statusDisable) {
      activeBackgroundStatus = bgColor.unactive;
      activeFontColorStatus = fontColor.unactive;
    }
    let activeBackgroundReason = bgColor.active;
    let activeFontColorReason = fontColor.active;
    if (this.state.reasonDisable) {
      activeBackgroundReason = bgColor.unactive;
      activeFontColorReason = fontColor.unactive;
    }
    let activeBackgroundFinish = bgColor.active;
    let activeFontColorFinish = fontColor.active;
    if (this.state.finishDisable) {
      activeBackgroundFinish = bgColor.unactive;
      activeFontColorFinish = fontColor.unactive;
    }
    const vstyles = {
      statusBG: {
        backgroundColor: activeBackgroundStatus
      },
      statusFontColor: {
        color: activeFontColorStatus
      },
      reasonBG: {
        backgroundColor: activeBackgroundReason
      },
      reasonFontColor: {
        color: activeFontColorReason
      },
      finishBG: {
        backgroundColor: activeBackgroundFinish
      },
      finishFontColor: {
        color: activeFontColorFinish
      }
    }
    return (
      <View style={{
        flexDirection: 'column'
      }}>
        <View style={{
          flexDirection: 'row',
          margin: 10,
        }}>
          <TouchableHighlight
            style={{
              margin: 0,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            disabled={this.state.statusDisable}
            onPress={() => this.statusModal(this.props.item)}
            underlayColor="transparent">
            <View style={[styles.backToCheckButton, vstyles.statusBG]}><Text style={[{ fontSize: 20 }, vstyles.statusFontColor]}>แก้ไขสถานะ</Text></View>
          </TouchableHighlight>
          <TouchableHighlight
            style={{
              margin: 0,
              padding: 0,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            disabled={this.state.reasonDisable}
            onPress={() => this.reasonModal(this.props.item)}
            underlayColor="transparent">
            <View style={[styles.backToCheckButton, vstyles.reasonBG]}><Text style={[{ fontSize: 20 }, vstyles.reasonFontColor]}>แก้ไขเหตุผล</Text></View>
          </TouchableHighlight>
          <TouchableHighlight
            style={{
              margin: 0,
              padding: 0,
              justifyContent: 'center',
              alignItems: 'center',
            }}
            disabled={this.state.finishDisable}
            onPress={() => this.semiFinal(this.props.item)}
            underlayColor="transparent">
            <View style={[styles.backToCheckButton, vstyles.finishBG]}><Text style={[{ fontSize: 20 }, vstyles.finishFontColor]}>จบงาน</Text></View>
          </TouchableHighlight>
        </View>
        <View style={{ position: 'relative', alignItems: 'center', marginVertical: 10, }}><Text style={{ color: '#E2792D', fontSize: 23 }}>ขั้นตอนปฎิบัตตาม SOP</Text></View>
        <View style={{ flexDirection: 'column' }}>
          <View style={[styles.aboutCircle]}>
            {this.sopList(this.props.item)}
          </View>
          {/* <View style={[styles.textBelow]}>
            <View style={[styles.sopStepDesc, { marginLeft: 32, marginRight: 38 }]}>
              <Text style={[styles.sopDesc]}>Before</Text>
            </View>
            <View style={[styles.sopStepDesc, { marginLeft: 32, marginRight: 35 }]}>
              <Text style={[styles.sopDesc]}>Protection</Text>
            </View>
            <View style={[styles.sopStepDesc, { marginLeft: 39, marginRight: 34 }]}>
              <Text style={[styles.sopDesc]}>Doing</Text></View>
            <View style={[styles.sopStepDesc, { marginLeft: 44, marginRight: 26 }]}>
              <Text style={[styles.sopDesc]}>Finished</Text></View>
          </View> */}
        </View>
        <SopImage item={this.props.item} opId={this.state.opId} opText={this.state.opText} navigation={this.props.navigation} />
        {this.modalWaiting(this.props.item)}
      </View>
    )
  }
}
const styles = StyleSheet.create({
  checkboxText: {
    fontSize: 16,
    marginLeft: 15,
  },
  modalButton: {
    textAlign: 'center',
    textAlignVertical: 'center',
    padding: 10,
    fontSize: 19,
    color: '#E2792D',
    fontFamily: 'Roboto-Medium',
  },
  textlistinModal: {
    fontSize: 16,
    marginLeft: 15,
  },
  modalTopView: {
    flex: 1,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  modalMainView: {
    flex: 1,
    backgroundColor: '#FFF',
    marginVertical: 200,
    marginHorizontal: 100,
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
  },
  modalRemark: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: '100%',
    position: 'absolute',
    bottom: 80,
    paddingLeft: 30,
    paddingTop: 10,
  },
  modalSubmitView: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: '#95989A',
    backgroundColor: '#fff',
    width: '100%',
    position: 'absolute',
    bottom: 10,
    paddingLeft: 160,
    paddingTop: 10,
  },
  aboutCircle: {
    flexDirection: 'row',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBelow: {
    flexDirection: 'row',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 5
  },
  sopText: {
    color: '#fff',
    position: 'absolute',
    top: 12.5,
  },
  sopDesc: {
  },
  circleSop: {
    width: 50,
    height: 50,
    borderRadius: 100 / 2,
    position: 'absolute',
    backgroundColor: 'green'
  },
  connecting: {
    height: 6,
    width: 80,
    backgroundColor: '#B2B2B2'
  },
  sopStep: {
    flexDirection: 'column',
    width: 50,
    height: 50,
    alignContent: 'center',
    alignItems: 'center',
  },
  sopStepDesc: {
    flexDirection: 'column',
    alignContent: 'center',
    alignItems: 'center',
  },
  backToCheckButton: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    width: win.width / 3.3,
    paddingVertical: 10,
    marginRight: 17,
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
  },
});
