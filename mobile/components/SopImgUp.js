import React from 'react';
import { StackActions, NavigationActions } from 'react-navigation';
import {
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
  TouchableOpacity,
  Image,
  Dimensions,
  Modal,
  ScrollView,
} from 'react-native';
import UnixThai from '../utils/UnixThai';
import {
  MaterialCommunityIcons,
  AntDesign,
} from '@expo/vector-icons';
import { SQLite } from 'expo-sqlite';
const db = SQLite.openDatabase("homecare.db");
const win = Dimensions.get('window');
const ratio = win.width / 200;
class HeaderLeft extends React.Component {
  constructor(props) { super(props); }
  _onPress = () => {
    console.log("_onPress")
    if (this.props.navigation.getParam('backWithReload') == undefined) {
      this.props.navigation.navigate('CheckReview');
    } else {
      const resetAction = StackActions.reset({
        index: 0,
        actions: [
          NavigationActions.navigate({
            routeName: 'CheckReview'
          }),
        ],
      });
      this.props.navigation.dispatch(resetAction);
      this.props.navigation.navigate('Fix')
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
          <AntDesign style={{
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
export default class SopImgUp extends React.Component {
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
    this.state = {
      modalVisible: false,
      activeCamera: false,
      imageList: [],
      activeImageURI: null
    }
  }
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
  reloadImageList = () => {
    let activeOpId = this.props.navigation.state.params.opId;
    console.log("\nSomImgUp->reloadImageList: activeOpId: ", activeOpId);
    try {
      db.transaction(tx => { tx.executeSql("select mainids,subids,uri from sopImage where mainids = ? order by id asc", [activeOpId], (_, { rows: { _array } }) => { this.setState({ imageList: _array }) }); });
    } catch (error) { console.log(error); return false }
    finally {
      console.log("\nSopStep->prepareStatusList: done")
    }
  }
  componentDidMount() {
    console.log("\nSopImgUp: did mount ");
    let imageChanged = this.params.item.imageChanged
    console.log("\nSomImgUp->componentDidMount: ", imageChanged);
  }
  componentWillUpdate() {
    let activeOpId = this.params.opId;
    console.log("\nSomImgUp->componentWillUpdate: ", activeOpId);
    let imageChanged = this.params.item.imageChanged
    console.log("\nSomImgUp->componentWillUpdate: ", imageChanged);
  }
  componentDidUpdate() {
    console.log("\nSomImgUp: did update: ");
    const item = this.params.item
    let imageChanged = item.imageChanged
    console.log("\nSomImgUp->componentDidUpdate: ", imageChanged);
    if (imageChanged) {
      item['imageChanged'] = false;
      let imageChanged = item.imageChanged
      console.log("\nSomImgUp->componentDidUpdate: ", imageChanged);
      this.reloadImageList();
    }
  }
  captureWithSubImages = (subImage) => {
    let singleImage = []
    this.state.imageList.map((value, key) => {
      if (subImage == value.subids) {
        singleImage = value;
      }
    })
    console.log(singleImage);
    return (
      <TouchableOpacity
        onPress={() => {
          console.log('active modal');
          this.setState({
            activeImageURI: singleImage.uri
          })
          this.setModalVisible(!this.state.modalVisible);
        }}
      >
        <Image style={{ width: 200, height: 250 }} source={{ uri: singleImage.uri }} resizeMode='stretch' />
      </TouchableOpacity>
    )
  }
  withImgSubTag = (item) => {
    let subImages = [];
    item.data.imgsubdata.map((value, key) => {
      if (value.selectAble == 0) {
        subImages.push(value);
      }
    })
    return (
      subImages.map((value, key) => {
        let title = key + 1 + '. ' + value.name;
        let imageUri = this.captureWithSubImages(value.ids);
        return (
          <View key={key} style={[styles.verView, {}]}>
            <View style={{ flexDirection: 'column' }}>
              <Text style={{ marginLeft: 10, marginTop: 5, fontSize: 20 }}>{title}</Text>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <View style={{ marginVertical: 5, width: 200, height: 250, backgroundColor: '#f8f8f8' }}>
                  {imageUri}
                </View>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <View style={[styles.btnPhotoAdd]}>
                  <TouchableHighlight
                    style={{
                      backgroundColor: 'transparent',
                      width: 45 * ratio,
                      height: 15 * ratio,
                      overflow: "visible",
                      zIndex: 1,
                    }}
                    underlayColor='transparent'
                    onPress={() => this.props.navigation.navigate('CameraScreen', {
                      item: item,
                      opId: this.props.navigation.state.params.opId,
                      opSub: value.ids,
                      imageChanged: this.props.navigation.state.params.imageChanged
                    })}
                  >
                    <View>
                      <MaterialCommunityIcons style={{
                        marginTop: 10, marginLeft: 8,
                      }} name="image-plus" size={25} color="#fff" />
                      <Text style={{
                        position: 'absolute',
                        right: ratio * 10,
                        top: ratio * 3,
                        color: 'white',
                        fontSize: 20,
                      }}>เพิ่มรูป</Text>
                    </View>
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          </View>
        )
      })
    )
  }
  renderConfirmUpdate = () => {
    let actionText = 'ยืนยัน'
    return (
      <View style={[styles.backToHomeButton]}>
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
          }}>{actionText}</Text>
        </TouchableHighlight>
      </View>
    )
  }
  renderBefore = (item) => {
    return (
      <ScrollView>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginVertical: 0,
        }}><Text style={{
          fontSize: 30,
        }}>{this.params.opText}</Text></View>
        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {this.withImgSubTag(item)}
          {this.modalImageView()}
        </View>
        {this.renderConfirmUpdate()}
      </ScrollView>
    )
  }
  modalImageView = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        hardwareAccelerated={true}
        visible={this.state.modalVisible}>
        <View style={{
          flexDirection: 'column', justifyContent: 'center', flex: 1,
          backgroundColor: 'rgba(0,0,0,0.5)',
        }}>
          <TouchableHighlight underlayColor='#fff' onPress={() => { this.setModalVisible(!this.state.modalVisible); }}>
            <Image source={{ uri: this.state.activeImageURI }} style={{
              width: Dimensions.get('window').width,
              height: Dimensions.get('window').height,
            }}></Image>
          </TouchableHighlight>
        </View>
      </Modal>
    )
  }
  capturedWithOutSubImages = () => {
    console.log('\ncapturedWithOutSubImages: ', this.state.imageList);
    return (
      this.state.imageList.map((value, key) => {
        return (
          <TouchableOpacity
            key={key}
            onPress={() => {
              console.log('active modal');
              this.setState({
                activeImageURI: value.uri
              })
              this.setModalVisible(!this.state.modalVisible);
            }}
          >
            <Image style={[styles.imageList]} source={{ uri: value.uri }} resizeMode='stretch' />
          </TouchableOpacity>
        )
      })
    )
  }
  withoutImgSubTag = (item) => {
    let minimumText = 'เพิ่มรูปภาพอย่างน้อย 1 รูป'; if (this.state.imageList.length > 0) { minimumText = this.state.imageList.length + ' รูป'; }
    return (
      <ScrollView>
        <View style={[{ flexDirection: 'row', justifyContent: 'center', padding: 10, width: win.width }]}>
          <View style={{
            width: '100%',
            minHeight: 700,
            backgroundColor: '#fff',
            flexDirection: 'row',
            justifyContent: 'center'
          }}>
            <View style={{
              flexDirection: 'column',
              width: '100%',
            }}>
              <View style={[{
                width: '100%',
                minHeight: 300,
              }]}>
                <View style={{
                  flexDirection: 'row',
                  justifyContent: 'flex-start',
                  flexWrap: 'wrap',
                }}>
                  {this.capturedWithOutSubImages()}
                  {this.modalImageView()}
                </View>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <Text style={{
                  marginVertical: 10,
                }}>{minimumText}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <View style={[styles.btnPhotoAdd]}>
                  <TouchableHighlight
                    style={{
                      backgroundColor: 'transparent',
                      width: 45 * ratio,
                      height: 15 * ratio,
                      overflow: "visible",
                      zIndex: 1,
                    }}
                    underlayColor='#E2792D'
                    onPress={() => this.props.navigation.navigate('CameraScreen', {
                      item: item,
                      opId: this.props.navigation.state.params.opId,
                      opSub: null,
                      imageChanged: this.props.navigation.state.params.imageChanged
                    })}
                  >
                    <View>
                      <MaterialCommunityIcons style={{
                        marginTop: 10, marginLeft: 8,
                      }} name="image-plus" size={25} color="#fff" />
                      <Text style={{
                        position: 'absolute',
                        right: ratio * 10,
                        top: ratio * 3,
                        color: 'white',
                        fontSize: 20,
                      }}>เพิ่มรูป</Text>
                    </View>
                  </TouchableHighlight>
                </View>
              </View>
            </View>
          </View>
        </View>
      </ScrollView >
    )
  }
  renderPDF = (item) => {
    return (
      <ScrollView>
        <View style={{
          flexDirection: 'row',
          justifyContent: 'center',
          marginVertical: 0,
        }}><Text style={{
          fontSize: 30,
        }}>
            {this.params.opText}
          </Text>
        </View>
        <View style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          {this.withoutImgSubTag(item)}
        </View>
        {this.renderConfirmUpdate()}
      </ScrollView>
    )
  }
  render() {
    const item = this.props.navigation.state.params.item;
    switch (this.params.opText) {
      case 'Before':
        return (
          <View>
            {this.renderBefore(item)}
          </View>
        )
      default:
        return (
          <View>
            {this.renderPDF(item)}
          </View>
        )
    }
  }
}
const styles = StyleSheet.create({
  modalIconList: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: 5,
    marginLeft: 10,
  },
  modalImgSouceList: {
    width: 200,
    flexDirection: 'column',
    paddingVertical: 20,
    borderColor: '#ccc',
    borderWidth: 1,
    backgroundColor: 'white',
    elevation: 10,
    borderRadius: 4,
  },
  sourceSelect: {
    marginLeft: 20,
    marginTop: 5,
    fontSize: 20,
  },
  imageList: {
    width: 140, height: 165,
    margin: 3,
  },
  btnPhotoAdd: {
    backgroundColor: '#FCB800',
    borderRadius: 3,
    elevation: 3,
    shadowOffset: {
      height: 2,
      width: 0
    },
    shadowColor: "rgba(0,0,0,1)",
    shadowOpacity: 0.24,
    shadowRadius: 2,
    overflow: "visible"
  },
  backToHomeButton: {
    backgroundColor: '#FBBD0A',
    marginHorizontal: 10,
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
  verView: {
    width: 282,
    paddingBottom: 10,
    marginHorizontal: 10,
    marginVertical: 8,
    backgroundColor: "#fff",
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
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});
