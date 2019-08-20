import React from 'react';
import CONFIG from '../config/Config';
import Credential from './Credential'
class MakeRequest extends React.Component {
  async credentialVerify() {
    const getCredential = await Credential.Read('credential')
    var credentialObject = {}
    JSON.parse(getCredential.toString(), (key, value) => { if (typeof value === 'string') { credentialObject[key] = value } })
    Object.size = function (obj) { var size = 0, key; for (key in obj) { if (obj.hasOwnProperty(key)) size++; } return size; };
    var size = Object.size(credentialObject);
    if (size != 2) {
      console.log("\nMakeRequest->credentialVerify: credential array size MISMATCH: " + size)
      return false
    } else {
      console.log("\nMakeRequest->credentialVerify: credential array have SAME size: " + size)
      return credentialObject
    }
  }
  async CheckSave(checkSave) {
    console.log("\nMakeRequest->CheckSave: message from checkSave: " + JSON.stringify(checkSave))
    const credentialObject = await this.credentialVerify();
    if (credentialObject == false) {
      const responseToCheckReview = {
        isLoading: false,
        isSuccess: false,
        pleaseRetry: true,
      }
      return await responseToCheckReview
    }
    let array = []
    checkSave.photos.forEach((value, i) => {
      x = value.uri.split('/')
      y = x[x.length - 1]
      array.push({
        name: y,
        type: 'image/jpg',
        uri: value.uri
      })
    })
    const formdata = new FormData()
    array.forEach((element, i) => {
      const newFile = {
        uri: element.uri, type: element.type, name: element.name
      }
      formdata.append('filesName', newFile)
    });
    formdata.append("caseId", checkSave.caseId);
    formdata.append("statusId", checkSave.statusId);
    formdata.append("statusOrdering", checkSave.statusOrdering.toString());
    formdata.append("statusNext", checkSave.statusNext);
    formdata.append("remarks", JSON.stringify(checkSave.remarks));
    const url = CONFIG.IMAGE_UPLOAD;
    const Authorization = 'Bearer ' + credentialObject['accessToken']
    const options = {
      method: 'POST',
      headers: {
        'Authorization': Authorization,
      },
      body: formdata
    }
    try {
      let response = await fetch(url, options);
      console.log("\nMakeRequest->CheckSave: response: " + JSON.stringify(response))
      if (response.status >= 200 && response.status < 300) {
        let responseJson = await response.json();
        console.log("\nMakeRequest->CheckSave: caseList: " + JSON.stringify(responseJson))
        const responseToCheckReview = {
          isLoading: false,
          isSuccess: true,
          pleaseRetry: false,
          imagesReturn: responseJson.images,
          defectsReturn: responseJson.defects,
          statusReturn: responseJson.updatedStatus,
          caseReturn: responseJson.caseId
        }
        return await responseToCheckReview
      }
      if (response.status >= 400) {
        const responseToCheckReview = {
          isLoading: false,
          isSuccess: false,
          pleaseRetry: true,
        }
        return await responseToCheckReview
      }
    } catch (error) {
      console.log("\nMakeRequest->CheckSave: Error: " + error)
      const responseToCheckReview = {
        isLoading: false,
        isSuccess: false,
        pleaseRetry: true,
      }
      return await responseToCheckReview
    } finally {
      console.log("\nMakeRequest->CheckSave: finally: " + Math.floor(Date.now() / 1000))
    }
  }
  async CheckAssign(checkSave) {
    console.log("\nMakeRequest->CheckAssign: message from checkSave: " + JSON.stringify(checkSave))
    const credentialObject = await this.credentialVerify();
    if (credentialObject == false) {
      const responseToCheckReview = {
        isLoading: false,
        isSuccess: false,
        pleaseRetry: true,
      }
      return await responseToCheckAssign
    }
    const url = CONFIG.HOMECASE_URL + '/assigning';
    const Authorization = 'Bearer ' + credentialObject['accessToken']
    const authorizeHeader = { Authorization: Authorization }
    const addedHeader = { ...CONFIG.HEADERS, ...authorizeHeader }
    const options = {
      method: 'POST',
      headers: addedHeader,
      body: JSON.stringify({
        caseId: checkSave.caseId,
        statusId: checkSave.statusId,
        statusNext: checkSave.statusNext.toString(),
        statusOrdering: checkSave.statusOrdering.toString(),
        responsible: JSON.stringify(checkSave.responsible).toString()
      }),
      timeout: CONFIG.REQUEST_TIMEOUT
    }
    console.log("\nMakeRequest->CheckAssign: options: " + JSON.stringify(options))
    try {
      let response = await fetch(url, options);
      console.log("\nMakeRequest->CheckAssign: response: " + JSON.stringify(response))
      if (response.status >= 200 && response.status < 300) {
        let responseJson = await response.json();
        console.log(responseJson);
        const responseToCheckAssign = {
          isLoading: false,
          isSuccess: true,
          pleaseRetry: false,
          statusReturn: responseJson.updatedStatus,
        }
        return await responseToCheckAssign
      }
      if (response.status >= 400) {
        const responseToCheckAssign = {
          isLoading: false,
          isSuccess: false,
          pleaseRetry: true,
        }
        return await responseToCheckAssign
      }
    } catch (error) {
      console.log("\nMakeRequest->CheckAssign: Error: " + error)
      const responseToCheckAssign = {
        isLoading: false,
        isSuccess: false,
        pleaseRetry: true,
      }
      return await responseToCheckAssign
    } finally {
      console.log("\nMakeRequest->CheckAssign: finally: " + Math.floor(Date.now() / 1000))
    }
  }
  async SopStep(Update) {
    console.log("\nMakeRequest->SopStep: message from Update: " + JSON.stringify(Update))
    const credentialObject = await this.credentialVerify();
    if (credentialObject == false) {
      const responseToSopStep = {
        isLoading: false,
        isSuccess: false,
        pleaseRetry: true,
      }
      return await responseToSopStep
    }
    let url = CONFIG.HOMECASE_URL + '/' + Update.action;
    let body = {
      caseId: Update.caseId,
      casedetId: Update.casedetId,
      statusId: Update.statusId,
    }
    if (Update.action == 'reasonUpdate') {
      let data = { data: Update.checkedLists.toString() }
      body = { ...body, ...data }
    };
    const Authorization = 'Bearer ' + credentialObject['accessToken']
    const authorizeHeader = { Authorization: Authorization }
    const addedHeader = { ...CONFIG.HEADERS, ...authorizeHeader }
    const options = {
      method: 'POST',
      headers: addedHeader,
      body: JSON.stringify(body),
      timeout: CONFIG.REQUEST_TIMEOUT
    }
    console.log("\nMakeRequest->SopStep: options: " + JSON.stringify(options))
    try {
      let response = await fetch(url, options);
      console.log("\nMakeRequest->SopStep: response: " + JSON.stringify(response))
      if (response.status >= 200 && response.status < 300) {
        let responseJson = await response.json();
        console.log(responseJson);
        const responseToSopStep = {
          isLoading: false,
          isSuccess: true,
          pleaseRetry: false,
        }
        return await responseToSopStep
      }
      if (response.status >= 400) {
        const responseToSopStep = {
          isLoading: false,
          isSuccess: false,
          pleaseRetry: true,
        }
        return await responseToSopStep
      }
    } catch (error) {
      console.log("\nMakeRequest->SopStep: Error: " + error)
      const responseToSopStep = {
        isLoading: false,
        isSuccess: false,
        pleaseRetry: true,
      }
      return await responseToSopStep
    } finally {
      console.log("\nMakeRequest->SopStep: finally: " + Math.floor(Date.now() / 1000))
    }
  }
  async fetchCase(stateFromHome) {
    console.log("\nMakeRequest->fetchCase: message from home: " + JSON.stringify(stateFromHome))
    const credentialObject = await this.credentialVerify();
    if (credentialObject == false) {
      const responseToHome = {
        isLoading: false,
        initialLoad: true,
        restStatus: response.status
      }
      return await responseToHome
    }
    const params = {
      limit: stateFromHome.limit,
      order: stateFromHome.order,
      page: stateFromHome.page,
      init: stateFromHome.initState,
    }
    console.log("\nMakeRequest->fetchCase: params: " + JSON.stringify(params))
    // return
    const url_query = `/checking?page=${encodeURIComponent(params.page)}&limit=${encodeURIComponent(params.limit)}&order=${encodeURIComponent(params.order)}&init=${encodeURIComponent(params.init)}`
    const url = CONFIG.HOMECASE_URL + url_query;
    const Authorization = 'Bearer ' + credentialObject['accessToken']
    const authorizeHeader = { Authorization: Authorization }
    const addedHeader = { ...CONFIG.HEADERS, ...authorizeHeader }
    console.log("\nMakeRequest->fetchCase: addedHeader" + addedHeader)
    const requestHeader = {
      method: 'GET',
      headers: addedHeader,
      timeout: CONFIG.REQUEST_TIMEOUT
    }
    console.log("\nMakeRequest->fetchCase: requestHeader: " + requestHeader)
    try {
      let response = await fetch(url, requestHeader);
      console.log("\nMakeRequest->fetchCase: response: " + response)
      if (response.status >= 200 && response.status < 300) {
        let responseJson = await response.json();
        const responseToHome = {
          isLoading: false,
          issubLoading: false,
          initialLoad: true,
          casedata: responseJson.caseList
        }
        return await responseToHome
      }
      if (response.status >= 400) {
        console.log("\nMakeRequest->fetchCase: sorry something wrong: " + JSON.stringify(response))
        const responseToHome = {
          isLoading: false,
          initialLoad: true,
          restStatus: response.status
        }
        return await responseToHome
      }
    } catch (error) {
      console.log("\nMakeRequest->fetchCase: Error: " + error)
      const responseToHome = {
        id: 1,
        value: 'value',
      }
      return await responseToHome
    } finally {
      console.log("\nMakeRequest->fetchCase: finally: " + Math.floor(Date.now() / 1000))
    }
  }
  async fetchCheckReview(item) {
    console.log("\nMakeRequest->fetchCheckReview: message from home: " + item)
    const credentialObject = await this.credentialVerify();
    if (credentialObject == false) {
      const responseCheckReview = {
        isLoading: false,
      }
      return await responseCheckReview
    }
    const params = {
      caseId: item.id,
    }
    console.log("\nMakeRequest->fetchCheckReview: params: " + JSON.stringify(params))
    const url_query = `/checkreview/?caseId=${encodeURIComponent(params.caseId)}`
    const url = CONFIG.HOMECASE_URL + url_query;
    const Authorization = 'Bearer ' + credentialObject['accessToken']
    const authorizeHeader = { Authorization: Authorization }
    const addedHeader = { ...CONFIG.HEADERS, ...authorizeHeader }
    console.log("\nMakeRequest->fetchCheckReview: addedHeader" + addedHeader)
    const requestHeader = {
      method: 'GET',
      headers: addedHeader,
      timeout: CONFIG.REQUEST_TIMEOUT
    }
    console.log("\nMakeRequest->fetchCheckReview: requestHeader: " + requestHeader)
    try {
      let response = await fetch(url, requestHeader);
      console.log("\nMakeRequest->fetchCheckReview: response: " + response)
      if (response.status >= 200 && response.status < 300) {
        let responseJson = await response.json();
        const responseCheckReview = {
          issubLoading: false,
          casedetData: responseJson.caseDetail,
        }
        return await responseCheckReview
      }
      if (response.status >= 400) {
        console.log("\nMakeRequest->fetchCheckReview: sorry something wrong: " + JSON.stringify(response))
        const responseCheckReview = {
          isLoading: false,
        }
        return await responseCheckReview
      }
    } catch (error) {
      console.log("\nMakeRequest->fetchCheckReview: Error: " + error)
      const responseCheckReview = {
        id: 1,
        value: 'value',
      }
      return await responseCheckReview
    } finally {
      console.log("\nMakeRequest->fetchCheckReview: finally: " + Math.floor(Date.now() / 1000))
    }
  }
}
const responseToHome = new MakeRequest()
export default responseToHome;
