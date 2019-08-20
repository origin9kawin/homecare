class UnixThai {
  Time(unixtime, full) {
    var days = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์'];
    var months = ['มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน', 'กรกฏาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'];
    var tstime = null;
    if (unixtime == undefined) {
      tstime = new Date();
    } else {
      tstime = new Date(unixtime * 1000);
    }
    var day = days[tstime.getDay()];
    var hours = tstime.getHours();
    var minutes = tstime.getMinutes();
    if (minutes < 10) { minutes = "0" + tstime.getMinutes(); }
    // var seconds = tstime.getSeconds();
    var thmonth = months[tstime.getMonth()];
    var date = tstime.getDate();
    var month = tstime.getMonth();
    var year = tstime.getFullYear() + 543;
    var arrangeDatetime = '';
    if (full == undefined) {
      if (unixtime == undefined) {
        arrangeDatetime = day + ' ' + date + ' ' + thmonth + ' ' + year.toString();
      } else {
        arrangeDatetime = day + ' ' + date + '/' + month + '/' + year.toString().substring(2) + ' ' + hours + ':' + minutes + ' น.';
      }
    } else {
      arrangeDatetime = day + ' ที่ ' + date + ' เดือน ' + thmonth + ' พ.ศ ' + year + ' เวลา ' + hours + ':' + minutes + ' น.';
    }
    return arrangeDatetime;
  }
}
const UnixThaiTime = new UnixThai();
export default UnixThaiTime;
