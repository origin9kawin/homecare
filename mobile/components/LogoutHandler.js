import { Component } from 'react';
import CONFIG from '../config/Config';
import Credential from './Credential'
class LogoutRequest extends Component {
  async logoutAndClear() {
    /**
     * delete secure store
     * request clear token
     * return true, false
     */
    const readCredential = await Credential.Read('credential');
    const userId = JSON.parse(readCredential).userId;
    const loginToken = JSON.parse(readCredential).accessToken;
    const requestHeader = {
      method: 'PUT',
      headers: CONFIG.HEADERS,
      body: JSON.stringify({
        userId: userId,
        loginToken: loginToken,
      }),
      timeout: CONFIG.REQUEST_TIMEOUT,
    }
    const url = CONFIG.LOGOUT_URL;
    try {
      let response = await fetch(url, requestHeader);
      if (response.status >= 200 && response.status < 300) {
        // let responseJson = await response.json();
        // console.log("\nLogoutHander->logoutAndClear: responseJson: " + responseJson)
        const readCredential = await Credential.Delete('credential');
        if (readCredential == true) {
          return true
        }
      }
      if (response.status >= 400) {
        // console.log("\nLogoutHandler->logoutAndClear: sorry something wrong: " + JSON.stringify(response))
        return false
      }
    } catch (error) {
      // console.log("\nLogoutHandler->logoutAndClear: Error: " + error)
      return false
    } finally {
      // console.log("\nLogoutHandler->logoutAndClear: finally: " + Math.floor(Date.now() / 1000))
    }
  }
}
const logout = new LogoutRequest();
export default logout;
