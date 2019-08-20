import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
  Dimensions,
} from 'react-native';
import IconPhoto from 'react-native-vector-icons/MaterialCommunityIcons';
const win = Dimensions.get('window');
const ratio = win.width / 200;
import { SQLite } from 'expo-sqlite';
const db = SQLite.openDatabase("homecare.db");
export default class SopImage extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    console.log("\nSopImage: did mount");
  }
  ToSopImgUp = (item) => {
    try {
      db.transaction(tx => { tx.executeSql("delete from sopImage where mainids = ?", [this.props.opId]); });
    } catch (error) {
      console.log(error);
    } finally {
      console.log("\nSopImage->ToSopImgUp: db is clear");
      item['imageChanged'] = false;
      item['subids'] = null;
      console.log(this.props.opId)
      this.props.navigation.navigate('SopImgUp', {
        opId: this.props.opId,
        opText: this.props.opText,
        item: item,
      });
    }
  }
  render() {
    const item = this.props.item;
    return (
      <View style={{
        margin: 10,
        marginBottom: 30,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 3,
        elevation: 6,
        shadowOffset: {
          height: 2,
          width: 0
        },
        shadowColor: "rgba(0,0,0,1)",
        shadowOpacity: 0.24,
        shadowRadius: 2,
        overflow: "visible",
        flexDirection: 'column'
      }}>
        <View>
          <Text style={{
            fontSize: 20,
            marginVertical: 20,
          }}>{this.props.opText}</Text>
        </View>
        <View style={{ paddingBottom: 20, }}>
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
              onPress={() => this.ToSopImgUp(item)}
            >
              <View>
                <IconPhoto style={{
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
    )
  }
}
const styles = StyleSheet.create({
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
});