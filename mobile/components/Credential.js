import React from 'react';
import * as SecureStore from 'expo-secure-store';
const debug = false;
class Credential extends React.Component {
  async Store(resJson) {
    debug ? console.log("\nCredential->Store: response data parse from Login: " + JSON.stringify(resJson)) : null
    const credentialName = 'credential'
    debug ? console.log("\nCredential->Store: prepared write data: " + JSON.stringify(resJson)) : null
    await SecureStore.deleteItemAsync(credentialName)
    await SecureStore.setItemAsync(credentialName, JSON.stringify(resJson))
    let readData = await SecureStore.getItemAsync(credentialName)
    debug ? console.log("\nCredential->Store: read data: " + readData) : null
    if (JSON.stringify(resJson == readData)) {
      return true
    } else {
      return false
    }
  }
  async Read(whatToread) {
    debug ? console.log("\nCredential->Store: response data parse from Login: " + whatToread) : null
    let readData = await SecureStore.getItemAsync(whatToread)
    debug ? console.log("\nCredential->Store: read data: " + readData) : null
    if (readData != undefined) {
      return readData
    } else {
      return false
    }
  }
  async Delete(whattoDelete) {
    debug ? console.log("\nCredential->Store: data parse from Logout: " + whattoDelete) : null
    let readData = await SecureStore.deleteItemAsync(whattoDelete)
    console.log("\nCredential->Store: read data: " + readData)
    if (readData == undefined) {
      return true
    } else {
      return false
    }
  }
}
const responseToAnyWhoeverRequest = new Credential()
export default responseToAnyWhoeverRequest;
