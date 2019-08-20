import React from 'react';
import CONFIG from '../config/Config'
import { StackActions, NavigationActions } from 'react-navigation';
import {
  KeyboardAvoidingView,
  View,
  ActivityIndicator,
  Picker,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import UnixThai from '../utils/UnixThai';
import { ScrollView } from 'react-native-gesture-handler';
import ImageBrowser from './ImageBrowser';
import MakeRequest from './MakeRequest'
import Modal from "react-native-modal";
import Icon from 'react-native-vector-icons/AntDesign';
const win = Dimensions.get('window');
const ratio = win.width / 200;
class HeaderLeft extends React.Component {
  constructor(props) { super(props); }
  _onPress = () => {
    console.log("_onPress")
    this.props.navigation.goBack()
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
export default class CheckSave extends React.Component {
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
    this.remarkValues = []
    this.state = {
      issubLoading: false,
      defectedId: null,
      activeRemarkValue: '',
      imageBrowserOpen: false,
      pickedPhotos: [],
      modalVisible: false,
      isModalVisible: false,
      summaryData: [],
      isLoading: false,
      isSuccess: false,
      pleaseRetry: false,
      imagesReturn: [],
      defectsReturn: [],
      statusReturn: '',
      caseReturn: ''
    }
  }
  componentWillMount() {
    console.log("\nCheckSave->componentWillMount: " + this.remarkValues)
    const item = this.params.item
    item.xHomeListDefect.forEach((element, i) => {
      this.remarkValues.push({
        id: element.id,
        name: element.name,
        value: element.remark
      })
      if (i == 0) {
        this.setState({
          defectedId: element.id,
          activeRemarkValue: element.remark
        })
      }
    });
  }
  componentDidMount() {
    console.log("\nCheckSave->componentDidMount: component is mounted")
    console.log("\nCheckSave->componentWillMount: defectedId: " + this.state.defectedId)
    console.log("\nCheckSave->componentWillMount: activeRemarkValue: " + this.state.activeRemarkValue)
  }
  componentDidUpdate(prevProps, prevState) {
    console.log("\nCheckSave->componentDidUpdate: updated")
  }
  componentWillUnmount() {
    this.params = null
    this.remarkValues = null
    this.setState({})
  }
  handledefectedChangeOption = (value) => {
    console.log("\nCheckSave->handledefectedChangeOption: " + value)
    let remarkVal = this.remarkValues.find(x => x.id === value).value
    console.log("\nCheckSave->handledefectedChangeOption: activeRemarkValue: " + remarkVal)
    console.log();
    this.setState({
      defectedId: value,
    })
    this.setState({
      activeRemarkValue: remarkVal
    })
  }
  defectedList = () => {
    const item = this.params.item
    return (
      item.xHomeListDefect.map((value, key) => {
        let label = key + 1 + '. ' + value.name
        return (<Picker.Item label={label} key={key} value={value.id} />)
      }));
  }
  abortClick = () => {
    console.log("\nCheckSave->User Abort: asking back to CheckReview")
    this.setState({
      isModalVisible: !this.state.isModalVisible
    },
      () => {
        const resetAction = StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({ routeName: 'HomeScreen' }),
          ],
        });
        this.props.navigation.dispatch(resetAction);
      });
  }
  remarkValuesUpdate = (update) => {
    this.setState({
      activeRemarkValue: update
    })
    let updatedItem = this.remarkValues.find((element) => { return element.id === this.state.defectedId })
    updatedItem.value = update;
  }
  imageBrowserCallback = (callback) => {
    callback.then((pickedPhotos) => {
      this.setState({
        imageBrowserOpen: false,
        pickedPhotos
      })
    }).catch((e) => console.log(e))
  }
  renderImage(item, i) {
    return (
      <Image
        style={{ height: 100, width: 100, margin: 5 }}
        source={{ uri: item.file }}
        key={i}
      />
    )
  }
  imagePicker = () => {
    if (this.state.imageBrowserOpen) {
      return (<ImageBrowser max={20} callback={this.imageBrowserCallback} />);
    }
    return (
      <View>
        <View style={[styles.zeroAlpha]}>
          <View style={{
            padding: 2,
            position: 'relative',
            flexDirection: 'row'
          }}>
            <View style={{
              backgroundColor: '#FCB800',
              borderRadius: 3,
              elevation: 6,
              shadowOffset: {
                height: 2,
                width: 0
              },
              shadowColor: "rgba(0,0,0,1)",
              shadowOpacity: 0.24,
              shadowRadius: 2,
              overflow: "visible"
            }}>
              <TouchableHighlight
                style={{
                  backgroundColor: 'transparent',
                  width: 50 * ratio,
                  height: 20 * ratio,
                  overflow: "visible",
                  zIndex: 1
                }}
                underlayColor='#848484'
                onPress={() => this.setState({ imageBrowserOpen: true })}
              >
                <Image
                  style={{
                    marginLeft: ratio * 6,
                    marginTop: ratio * 6
                  }}
                  source={require('../assets/addphoto.png')} />
              </TouchableHighlight>
              <Text style={{
                position: 'absolute',
                right: ratio * 10,
                top: ratio * 5,
                color: 'white',
                fontSize: 20,
              }}>เพิ่มรูป</Text>
            </View>
          </View>
        </View>
        <View style={[styles.zeroAlpha]}>
          <View style={{
            padding: 2,
            position: 'relative',
          }}>
            <View style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
              {this.state.pickedPhotos.map((item, i) => this.renderImage(item, i))}
            </View>
          </View>
        </View>
      </View>
    );
  }
  remarkTextInput = () => {
    return (
      <View style={[{
      }, styles.zeroAlpha]}>
        <View style={{
          padding: 2,
          position: 'relative',
        }}>
          <View style={{
            flexDirection: 'row',
          }}>
            <View style={[styles.pickerView, {
              width: '100%',
            }]}>
              <TextInput
                style={styles.textInput}
                autoCompleteType="off"
                autoCapitalize="none"
                underlineColorAndroid={'rgba(0,0,0,0)'}
                returnKeyType="next"
                onChangeText={(remark) => { this.remarkValuesUpdate(remark) }}
                value={this.state.activeRemarkValue}
                blurOnSubmit={true}
                multiline={true}
                underlineColorAndroid='transparent'
              ></TextInput>
            </View>
          </View>
        </View>
      </View>
    )
  }
  prepareData = (item) => {
    const remarkUpdate = []
    this.remarkValues.forEach(element => {
      remarkUpdate.push({
        id: element.id,
        name: element.name,
        value: element.value
      })
    })
    const statusMap = item.data.statusdata.filter(status => status.ids === item.statusId)[0];
    console.log(statusMap)
    this.setState({
      summaryData: {
        caseId: item.id,
        remarks: remarkUpdate,
        photos: this.state.pickedPhotos,
        statusId: item.statusId,
        statusNext: true,
        statusOrdering: statusMap.ordering,
      },
      isModalVisible: !this.state.isModalVisible,
    })
  }
  actionConfirm = (item) => {
    return (
      <View style={{
        flexDirection: 'row'
      }}>
        <View style={[{
          backgroundColor: '#FFE5D3',
        }, styles.actionView]}>
          <TouchableHighlight
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => this.toggleModal()}
            underlayColor="#E8E8E8">
            <Text style={{
              color: '#000',
              fontSize: 20,
              paddingVertical: 10,
            }}>ยกเลิก</Text>
          </TouchableHighlight>
        </View>
        <View style={[{
          backgroundColor: '#FBBD0A',
          position: 'absolute',
          right: 0,
        }, styles.actionView]}>
          <TouchableHighlight
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
            onPress={() => this.prepareData(item)}
            underlayColor="#E2792D">
            <Text style={{
              color: '#FFF',
              fontSize: 20,
              paddingVertical: 10,
            }}>ตกลง</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
  defectedPicker = () => {
    return (
      <View style={[styles.zeroAlpha]}>
        <View style={{
          padding: 2,
          position: 'relative',
        }}>
          <View style={{
            flexDirection: 'row',
          }}>
            <View style={[styles.pickerView, {
              width: '100%',
              borderBottomWidth: 1,
            }]}>
              <Picker
                style={{
                  color: '#707070',
                  height: 60,
                  fontSize: 20,
                }}
                itemStyle={{ height: 60 }}
                onValueChange={(value) => (this.handledefectedChangeOption(value))}
                selectedValue={this.state.defectedId}
              >
                {this.defectedList()}
              </Picker>
            </View>
          </View>
        </View>
      </View>
    )
  }
  toggleModal = () => {
    this.setState({
      isModalVisible: !this.state.isModalVisible,
      summaryData: []
    });
  };
  modalImgMissing = () => {
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
              }}>ต้องการข้อมูล!</Text>
            </View>
            <View style={{
              width: '100%',
              position: 'absolute',
              top: 60,
              left: 10,
              flexDirection: 'row'
            }}>
              <Text style={{
                fontSize: 16,
                marginLeft: 15,
              }}>รูปภาพอย่างน้อย {CONFIG.UPLOAD.MIN} รูป</Text>
            </View>
            <View style={[styles.modalSubmitView]}>
              <TouchableOpacity onPress={this.toggleModal}>
                <Text style={[styles.modalButton, {
                }]}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    )
  }
  modalViewCancel = () => {
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
              }}>ยกเลิกบันทึก?</Text>
            </View>
            <View style={{
              width: '100%',
              position: 'absolute',
              top: 60,
              left: 10,
              flexDirection: 'row'
            }}>
              <Text style={{
                fontSize: 16,
                marginLeft: 15,
              }}>และกลับไปยังหน้าหลัก</Text>
            </View>
            <View style={[styles.modalSubmitView]}>
              <TouchableOpacity onPress={this.toggleModal}>
                <Text style={[styles.modalButton, {
                  marginRight: 20,
                }]}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.abortClick}>
                <Text style={[styles.modalButton, {
                }]}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    )
  }
  modaldefectedRemarkList = () => {
    const remarks = this.state.summaryData.remarks
    return (
      remarks.map((item, i) => {
        let text = i + 1 + '. ' + item.name + ' (' + item.value.length + ')'
        return (
          <Text key={i} style={[styles.textlistinModal]}>{text}</Text>
        )
      })
    )
  }
  modeldefectedImageList = () => {
    const imgLength = Object.size(this.state.summaryData.photos)
    return (
      <Text style={[styles.textlistinModal]}>รูปภาพจำนวน {imgLength} รูป</Text>
    )
  }
  async processCallback(responseRequest) {
    console.log("\nCheckSave->processCallback: response: " + JSON.stringify(responseRequest))
    for (var key in responseRequest) { if (responseRequest.hasOwnProperty(key)) { this.setState({ [key]: responseRequest[key] }) } }
  }
  callbackMakeRequest = async () => {
    this.setState({
      isLoading: true
    })
    // }
    console.log("\nCheckSave->callbackMakeRequest: start calling back data from make request")
    const responseRequest = await MakeRequest.CheckSave(this.state.summaryData)
    this.processCallback(responseRequest)
  }
  toCheckSummaryView = () => {
    console.log("\nCheckSave->toCheckSummaryView: prepared to navigate to CheckReView")
    this.setState({
      isModalVisible: !this.state.isModalVisible
    },
      () => {
        const item = this.params.item
        item['update'] = {
          xHomeListDefect: this.state.defectsReturn,
          status: this.state.statusReturn,
          images: this.state.imagesReturn,
          caseId: this.state.caseReturn
        }
        setTimeout(() => {
          this.setState({ issubLoading: false })
          this.props.navigation.push('CheckSummary', {
            item: item
          })
        }, 50);
      });
  }
  modalViewSubmit = (item) => {
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
              }}>บันทึกข้อมูล?</Text>
            </View>
            <View style={{
              width: '100%',
              position: 'absolute',
              top: 60,
              left: 10,
            }}>
              <View style={{
                flexDirection: 'column',
                position: 'relative'
              }}>
                {this.modaldefectedRemarkList()}
                <Text></Text><Text></Text>
                {this.modeldefectedImageList()}
              </View>
            </View>
            <View style={[styles.modalRemark]}>
              <Text>ในวงเล็บ = ความยาวหมายเหตุ</Text>
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
                    <TouchableOpacity onPress={this.toCheckSummaryView}>
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
                        <TouchableOpacity onPress={this.toggleModal}>
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
                          <TouchableOpacity onPress={this.toggleModal}>
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
      </View >
    )
  }
  modalWaiting = (item) => {
    if (this.state.isModalVisible) {
      if (Object.size(this.state.summaryData) > 0) {
        if (Object.size(this.state.summaryData.photos) >= CONFIG.UPLOAD.MIN) {
          return this.modalViewSubmit(item)
        } else {
          return this.modalImgMissing()
        }
      } else {
        return this.modalViewCancel()
      }
    }
  }
  render() {
    const item = this.params.item
    let { image } = this.state;
    const catMap = item.data.catdata.filter(cat => cat.ids === item.catId)[0];
    const subcatMap = item.data.subcatdata.filter(subcat => subcat.ids === item.subcatId)[0];
    return (
      this.state.issubLoading ? (
        <View style={styles.container}>
          <View style={{
            flex: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <ActivityIndicator size='large' color='#E2792D' />
          </View>
        </View>
      ) : (
          <View style={styles.container}>
            <KeyboardAvoidingView
              style={{
                flex: 1,
                flexDirection: 'column'
              }}
              behavior="padding"
              keyboardVerticalOffset={50}
            >
              <ScrollView>
                <View style={[styles.checkList, {
                }]}>
                  <View style={{
                    flexDirection: 'column',
                    backgroundColor: '#fff',
                    padding: 2,
                    width: '100%'
                  }}>
                    <View style={[{
                      marginBottom: 20,
                    }, styles.zeroAlpha]}>
                      <View style={[styles.Alpha, {
                      }]}>
                        <Text style={{
                          fontSize: 20,
                          color: '#E2792D'
                        }}>รายละเอียดแจ้งซ่อม</Text>
                      </View>
                    </View>
                    <View style={[{
                    }, styles.zeroAlpha]}>
                      <View style={[styles.Alpha, {
                      }]}>
                        <Text style={[styles.nametitle]}>ประเภทหลัก</Text>
                        <Text>{catMap.name}</Text>
                      </View>
                      <View style={[styles.Chalee, {
                        left: 350,
                      }]}>
                        <Text style={[styles.nametitle]}>ประเภทย่อย</Text>
                        <Text>{subcatMap.name}</Text>
                      </View>
                    </View>
                    <View style={[styles.zeroAlpha]}>
                      <View style={{
                        padding: 2,
                        position: 'relative',
                      }}>
                        <Text style={[styles.nametitle]}>รายการ ({item.xHomeListDefect.length})</Text>
                      </View>
                    </View>
                    {this.defectedPicker()}
                    <View style={[styles.zeroAlpha]}>
                      <View style={{
                        padding: 2,
                        position: 'relative',
                      }}>
                        <Text style={[styles.nametitle]}>หมายเหตุ</Text>
                      </View>
                    </View>
                    {this.remarkTextInput()}
                    <View style={[styles.zeroAlpha]}>
                      <View style={{
                        padding: 2,
                        position: 'relative',
                      }}>
                        <Text style={[styles.nametitle]}>รูปภาพ</Text>
                      </View>
                    </View>
                    {this.imagePicker()}
                    <View style={{
                      borderColor: '#E8E8E8',
                      marginHorizontal: 10,
                      marginTop: 10,
                    }}>
                    </View>
                  </View>
                </View>
                {this.actionConfirm(item)}
                {this.modalWaiting(item)}
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        )
    )
  }
}
const styles = StyleSheet.create({
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
  nametitle: {
    color: '#BCBCBC'
  },
  circleStatus: {
    width: 20,
    height: 20,
    borderRadius: 100 / 2,
    position: 'absolute',
    bottom: 3,
  },
  Alpha: {
    padding: 2,
    position: 'absolute',
    top: 10,
    left: 10,
  },
  Bravo: {
    position: 'absolute',
    padding: 2,
    top: 10,
    width: 155,
  },
  Chalee: {
    position: 'relative',
    padding: 2,
  },
  zeroAlpha: {
    flexDirection: 'row',
    padding: 8,
    width: '100%',
  },
  checkList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 10,
    borderRadius: 3,
    elevation: 6,
    shadowOffset: {
      height: 2,
      width: 0
    },
    shadowColor: "rgba(0,0,0,1)",
    shadowOpacity: 0.24,
    shadowRadius: 2,
    overflow: "visible"
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F7F7F7',
    paddingTop: Platform.select({ ios: 0, android: 10 }),
  },
  actionView: {
    width: 93 * ratio,
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
  pickerView: {
    backgroundColor: '#fff',
    borderBottomEndRadius: 1,
    shadowOffset: {
      height: 2,
      width: 0
    },
    shadowColor: "rgba(0,0,0,1)",
    shadowOpacity: 0.24,
    shadowRadius: 2,
    overflow: "visible"
  },
  textInput: {
    fontSize: 25,
    color: '#707070',
    borderBottomColor: '#DEDEDE',
    borderBottomWidth: 1,
    textDecorationLine: 'none',
    textAlignVertical: "bottom",
    paddingVertical: 3 * ratio,
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
  }
});
