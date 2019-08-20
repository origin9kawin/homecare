import * as Permissions from 'expo-permissions';
import { Camera } from 'expo-camera';
import Constants from 'expo-constants';
import * as MediaLibrary from 'expo-media-library';
import { SQLite } from 'expo-sqlite';
import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
  Modal,
  Dimensions,
  ImageBackground,
} from 'react-native';
import {
  Ionicons,
  MaterialIcons,
  Foundation,
  AntDesign
} from '@expo/vector-icons';
const flashModeOrder = {
  off: 'on',
  on: 'auto',
  auto: 'torch',
  torch: 'off',
};
const flashIcons = {
  off: 'flash-off',
  on: 'flash-on',
  auto: 'flash-auto',
  torch: 'highlight'
};
const wbOrder = {
  auto: 'sunny',
  sunny: 'cloudy',
  cloudy: 'shadow',
  shadow: 'fluorescent',
  fluorescent: 'incandescent',
  incandescent: 'auto',
};
const wbIcons = {
  auto: 'wb-auto',
  sunny: 'wb-sunny',
  cloudy: 'wb-cloudy',
  shadow: 'beach-access',
  fluorescent: 'wb-iridescent',
  incandescent: 'wb-incandescent',
};
const db = SQLite.openDatabase("homecare.db");
export default class CameraScreen extends React.Component {
  constructor(props) {
    super(props);
    this.params = this.props.navigation.state.params
    this.state = {
      flash: 'off',
      zoom: 0,
      autoFocus: 'on',
      type: 'back',
      whiteBalance: 'auto',
      ratio: '16:9',
      ratios: [],
      barcodeScanning: false,
      newPhotos: false,
      permissionsCameraGranted: false,
      permissionsCameraRollGranted: false,
      pictureSize: undefined,
      pictureSizes: [],
      pictureSizeId: 0,
      showGallery: false,
      showMoreOptions: false,
      modalVisible: false,
      imageURI: null,
    }
  }
  async componentWillMount() {
    const { status } = await Permissions.askAsync(Permissions.CAMERA);
    const { statusRoll } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    this.setState({
      permissionsCameraGranted: status === 'granted',
      permissionsCameraRollGranted: statusRoll === 'granted'
    });
  }
  componentDidMount() {
    console.log("\nCameraScreen: did mount");
  }
  getRatios = async () => {
    const ratios = await this.camera.getSupportedRatios();
    return ratios;
  };
  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
  toggleView = () => this.setState({ showGallery: !this.state.showGallery, newPhotos: false });
  toggleFlash = () => this.setState({ flash: flashModeOrder[this.state.flash] });
  setRatio = ratio => this.setState({ ratio });
  toggleWB = () => this.setState({ whiteBalance: wbOrder[this.state.whiteBalance] });
  toggleFocus = () => this.setState({ autoFocus: this.state.autoFocus === 'on' ? 'off' : 'on' });
  zoomOut = () => this.setState({ zoom: this.state.zoom - 0.1 < 0 ? 0 : this.state.zoom - 0.1 });
  zoomIn = () => this.setState({ zoom: this.state.zoom + 0.1 > 1 ? 1 : this.state.zoom + 0.1 });
  setFocusDepth = depth => this.setState({ depth });
  takePicture = async () => {
    if (this.camera) {
      this.setModalVisible(!this.state.modalVisible);
      let image = await new Promise(async resolve => {
        await this.camera.takePictureAsync({ onPictureSaved: resolve });
        // this.camera.pausePreview();
      });
      // this.camera.resumePreview();
      this.setState({
        imageURI: image.uri
      })
      // console.log("\nCameraScreen->TakePicture: ", image);
      const asset = await MediaLibrary.createAssetAsync(image.uri);
      const item = this.props.navigation.state.params.item;
      await MediaLibrary.createAlbumAsync('HomeCare', asset)
        .then(() => {
          console.log('Album created!');
          let mainids = this.props.navigation.state.params.opId;
          let subids = this.props.navigation.state.params.opSub;
          try {
            db.transaction(
              tx => {
                tx.executeSql("insert into sopImage (mainids, subids, uri) \n" +
                  "values (?, ?, ?)", [mainids, subids, image.uri]);
                // tx.executeSql("select mainids,subids,uri from sopImage where 1 order by id asc", [], (_, { rows: { _array } }) => {
                //   console.log('\nimediate: ', JSON.stringify(_array));
                // });
              });
          } catch (error) {
            console.log(error);
          } finally {
            console.log("inserted into sqlite");
            console.log("going back to SopImgUp with update params");
            // this.setModalVisible(!this.state.modalVisible);
            item['imageChanged'] = true;
            item['subids'] = subids;
            this.props.navigation.navigate('SopImgUp', {
              item: item,
            });
          }
        })
        .catch(error => {
          console.log('err', error);
        });
    }
  };
  handleMountError = ({ message }) => console.error(message);
  collectPictureSizes = async () => {
    if (this.camera) {
      const pictureSizes = await this.camera.getAvailablePictureSizesAsync(this.state.ratio);
      let pictureSizeId = 0;
      if (Platform.OS === 'ios') {
        pictureSizeId = pictureSizes.indexOf('High');
      } else {
        // returned array is sorted in ascending order - default size is the largest one
        pictureSizeId = pictureSizes.length - 1;
      }
      this.setState({ pictureSizes, pictureSizeId, pictureSize: pictureSizes[pictureSizeId] });
    }
  };
  previousPictureSize = () => this.changePictureSize(1);
  nextPictureSize = () => this.changePictureSize(-1);
  changePictureSize = direction => {
    let newId = this.state.pictureSizeId + direction;
    const length = this.state.pictureSizes.length;
    if (newId >= length) {
      newId = 0;
    } else if (newId < 0) {
      newId = length - 1;
    }
    this.setState({ pictureSize: this.state.pictureSizes[newId], pictureSizeId: newId });
  }
  renderNoPermissions = () =>
    <View style={styles.noPermissions}>
      <Text style={{ color: 'white' }}>Accessing Camera</Text>
    </View>
  renderTopBar = () =>
    <View
      style={styles.topBar}>
      <TouchableOpacity style={styles.toggleButton} onPress={this.toggleFacing}>
        <Ionicons name="ios-reverse-camera" size={32} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.toggleButton} onPress={this.toggleFlash}>
        <MaterialIcons name={flashIcons[this.state.flash]} size={32} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.toggleButton} onPress={this.toggleWB}>
        <MaterialIcons name={wbIcons[this.state.whiteBalance]} size={32} color="white" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.toggleButton} onPress={this.toggleFocus}>
        <Text style={[styles.autoFocusLabel, { color: this.state.autoFocus === 'on' ? "white" : "#6b6b6b" }]}>AF</Text>
      </TouchableOpacity>
    </View>
  renderBottomBar = () =>
    <View
      style={styles.bottomBar}>
      <TouchableOpacity style={styles.bottomButton} onPress={() => console.log(this.props.navigation.navigate('SopImgUp'))}>
        <AntDesign name="close" size={30} color="white" />
      </TouchableOpacity>
      <View style={{ flex: 0.4 }}>
        <TouchableOpacity
          onPress={this.takePicture}
          style={{ alignSelf: 'center' }}
        >
          <Ionicons name="ios-radio-button-on" size={70} color="white" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.bottomButton} onPress={this.toggleView}>
        <View>
          <Foundation name="thumbnails" size={30} color="white" />
          {this.state.newPhotos && <View style={styles.newPhotosDot} />}
        </View>
      </TouchableOpacity>
    </View>
  renderCamera = () =>
    (
      <View style={{ flex: 1 }}>
        <Camera
          ref={ref => {
            this.camera = ref;
          }}
          style={styles.camera}
          // onCameraReady={this.collectPictureSizes}
          type={this.state.type}
          flashMode={this.state.flash}
          autoFocus={this.state.autoFocus}
          zoom={this.state.zoom}
          whiteBalance={this.state.whiteBalance}
          ratio={this.state.ratio}
          pictureSize={this.state.pictureSize}
          onMountError={this.handleMountError}
          backdropColor='transparent'
          skipProcessing={true}
        >
          {this.renderTopBar()}
          {this.renderBottomBar()}
        </Camera>
      </View>
    );
  modalCaptureWriting = () => {
    return (
      <Modal
        animationType="fade"
        transparent={true}
        hardwareAccelerated={true}
        visible={this.state.modalVisible}>
        <View style={{
          flexDirection: 'column', justifyContent: 'center', flex: 1,
        }}>
          <ImageBackground source={{ uri: this.state.imageURI }} style={{
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height,
          }}></ImageBackground>
        </View>
      </Modal>
    )
  }
  render() {
    const cameraScreenContent = this.state.permissionsCameraGranted
      ? this.renderCamera()
      : this.renderNoPermissions();
    const content = cameraScreenContent;
    return <View style={styles.container}>{content}{this.modalCaptureWriting()}</View>;
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  camera: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topBar: {
    flex: 0.2,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: Constants.statusBarHeight / 2,
  },
  bottomBar: {
    // paddingBottom: isIPhoneX ? 25 : 5,
    backgroundColor: 'transparent',
    alignSelf: 'flex-end',
    justifyContent: 'space-between',
    flex: 0.12,
    flexDirection: 'row',
  },
  noPermissions: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  gallery: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  toggleButton: {
    flex: 0.25,
    height: 40,
    marginHorizontal: 2,
    marginBottom: 10,
    marginTop: 20,
    padding: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  autoFocusLabel: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  bottomButton: {
    flex: 0.3,
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
  },
  newPhotosDot: {
    position: 'absolute',
    top: 0,
    right: -5,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#4630EB'
  },
  options: {
    position: 'absolute',
    bottom: 80,
    left: 30,
    width: 200,
    height: 160,
    backgroundColor: '#000000BA',
    borderRadius: 4,
    padding: 10,
  },
  detectors: {
    flex: 0.5,
    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },
  pictureQualityLabel: {
    fontSize: 10,
    marginVertical: 3,
    color: 'white'
  },
  pictureSizeContainer: {
    flex: 0.5,
    alignItems: 'center',
    paddingTop: 10,
  },
  pictureSizeChooser: {
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row'
  },
  pictureSizeLabel: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  row: {
    flexDirection: 'row',
  },
});