import React from 'react';
import CONFIG from '../config/Config';
import Credential from './Credential'
import LocalSQlite from './LocalSQLite'
class AccessRequest extends React.Component {
  async dataSourceHandler(dataSource) {
    console.log("\nRoot->dataSourceHandler: storaging dataSource")
    const sqliteResponse = await LocalSQlite.PreloadWrite(dataSource)
    return sqliteResponse
  }
  async Request(loginInfo) {
    const url = CONFIG.LOGIN_URL;
    console.log("\nAccessRequest->Request: url: " + url)
    const requestHeader = {
      method: 'POST',
      headers: CONFIG.HEADERS,
      body: JSON.stringify({
        username: loginInfo.username,
        password: loginInfo.password,
        loginCount: loginInfo.loginCount.toString(),
        buttonPressedCount: loginInfo.buttonPressedCount.toString(),
      }),
      timeout: CONFIG.REQUEST_TIMEOUT
    }
    try {
      const response = await fetch(CONFIG.LOGIN_URL, requestHeader);
      console.log("\nAccessRequest->Request: HTTP response: " + response)
      const dataJson = await response.json();
      if (response.status >= 200 && response.status < 300) {
        let showMessage = dataJson.message.show
        const credentialStore = await Credential.Store(dataJson.credential)
        if (credentialStore == true) {
          /**
           * redirecto to HomeScreen View
           */
          const responseToLogin = []
          responseToLogin.push({
            submitButtonDisabled: false,
            submitTextValue: showMessage,
            showEyeButton: false,
            buttonBackgroundColor: CONFIG.stateButtonBackgroundColor.light,
            submitButtonDisabled: false,
            animateLoading: false,
            successCredential: true
          })
          /**
           * store status, project information before response
           */
          const dataSuccess = await this.dataSourceHandler(dataJson.dataSource)
          console.log('\ndatasuccess: ' + dataSuccess);
          if (dataSuccess == true) {
            return await responseToLogin
          } else {
            throw new Error("Problem with SQLite");
          }
        } else {
          throw new Error("Incomplete write credential data");
        }
      }
      if (response.status >= 400) {
        const responseToLogin = []
        responseToLogin.push({
          submitButtonDisabled: false,
          animateLoading: false,
          submitTextValue: dataJson.message.show,
          showEyeButton: true,
          buttonBackgroundColor: CONFIG.stateButtonBackgroundColor.heavy,
          activeDelay: CONFIG.definedGlobalText.delay.error,
          loginCount: loginInfo.loginCount += 1,
          loginError: true
        })
        if (loginInfo.activeDelay !== CONFIG.definedGlobalText.delay.init) {
          setTimeout(() => {
            responseToLogin.push({
              submitButtonDisabled: false,
              animateLoading: false,
              submitTextValue: CONFIG.definedGlobalText.value.init,
              submitTextSize: CONFIG.definedGlobalText.size.init,
              buttonBackgroundColor: CONFIG.stateButtonBackgroundColor.heavy,
              loginError: true
            })
          }, loginInfo.activeDelay);
        }
        return await responseToLogin
      }
    } catch (error) {
      console.log("\nAccessRequest->Request: Error" + error)
      const responseToLogin = []
      responseToLogin.push({
        submitTextValue: CONFIG.definedGlobalText.value.offline,
        submitTextSize: CONFIG.definedGlobalText.size.offline,
        buttonBackgroundColor: CONFIG.stateButtonBackgroundColor.heavy,
        animateLoading: false,
        networkOffline: true
      })
      return await responseToLogin
    } finally {
      console.log("\nAccessRequest->Request: Finally: " + Math.floor(Date.now() / 1000))
    }
  }
}
const responseToLogin = new AccessRequest()
export default responseToLogin;
