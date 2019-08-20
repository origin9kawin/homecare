const BASE_URL = 'http://192.168.1.24:5000'
module.exports = {
  LOGIN_URL: BASE_URL + '/api/signin',
  LOGOUT_URL: BASE_URL + '/api/signout',
  HOMECASE_URL: BASE_URL + '/api/hmcase',
  IMAGE_URL: BASE_URL + '/uploads/',
  IMAGE_UPLOAD: BASE_URL + '/api/hmcaseImage',
  HEADERS: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Accept-Encoding': 'gzip, deflate'
  },
  REQUEST_TIMEOUT: 2000,
  definedGlobalText: {
    value: {
      init: 'Login',
      invalid: 'Invalid, please try again',
      offline: 'System may down, please report/check connection',
      loading: 'Loading...',
      // getting: 'Getting... data',
      getting: 'กรุณารอสักครู่',
      startChecking: 'ตรวจสอบ'
    },
    size: {
      init: 20,
      offline: 14
    },
    delay: {
      init: 0,
      error: 1000,
      offline: 3000
    }
  },
  stateButtonBackgroundColor: {
    light: '#E2792D',
    heavy: '#848484',
  },
  ERROR: {
    server: {
      message: 'ไม่มีข้อมูล / เกิดข้อผิดพลาด',
      todo: 'กรุณาลองใหม่อีกครั้ง / โปรดแจ้งเจ้าหน้าที่',
    },
    abort: {
      message: 'ยกเลิกการบันทึก',
      todo: 'กลับไปหน้าหลัก'
    }
  },
  UPLOAD: {
    MIN: 1
  }
};
