import React, { Component } from "react";
import { Text, View } from "react-native";
import Modal from "react-native-modal";
import { Button } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import {
  StyleSheet,
  TouchableOpacity
} from 'react-native';
export default class ModalAction extends Component {
  state = {
    isModalVisible: false
  };
  toggleModal = () => {
    this.setState({ isModalVisible: !this.state.isModalVisible });
  };
  render() {
    return (
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
      }}>
        <Button title="Show modal" onPress={this.toggleModal} />
        <Modal isVisible={this.state.isModalVisible}>
          <View style={{
            flex: 1,
            backgroundColor: '#FFF',
            marginVertical: 200,
            marginHorizontal: 100,
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
          }}>
            <View style={{
              width: '100%',
              position: 'absolute',
              top: 10,
              left: 10
            }}>
              <Text style={{
                fontSize: 25,
                color: '#000'
              }}>ยกเลิกการบันทึก</Text>
            </View>
            <View style={{
              width: '100%',
              position: 'absolute',
              top: 60,
              left: 10,
              flexDirection: 'row'
            }}>
              <Icon
                style={{
                  position: 'absolute',
                  top: 6,
                }}
                name="arrow-left" size={10} color="#E2792D" />
              <Text style={{
                fontSize: 16,
                marginLeft: 15,
              }}>กลับไปยังหน้าหลัก</Text>
            </View>
            <View style={{
              flexDirection: 'row',
              borderTopWidth: 1,
              borderTopColor: '#95989A',
              backgroundColor: '#fff',
              width: '100%',
              position: 'absolute',
              bottom: 10,
              paddingLeft: 160,
              paddingTop: 10,
            }}>
              <TouchableOpacity onPress={this.toggleModal}>
                <Text style={[styles.button, {
                  marginRight: 20,
                }]}>CANCEL</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={this.toggleModal}>
                <Text style={[styles.button, {
                }]}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  button: {
    textAlign: 'center',
    textAlignVertical: 'center',
    padding: 10,
    fontSize: 19,
    color: '#E2792D',
    fontFamily: 'Roboto-Medium',
  }
})
