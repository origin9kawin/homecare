import React from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableHighlight,
} from 'react-native';
import UnixThai from '../utils/UnixThai';
export default class CaseListItem extends React.Component {
  constructor(props) { super(props); }
  componentWillUnmount() {
    this.setState({})
  }
  shouldComponentUpdate(newProps) {
    return this.props.showcase !== newProps.showcase;
  }
  _onPress = (item) => {
    console.log('\nChecking->initState: ' + this.props.state.initState)
    console.log("\nChecking->_onPress: " + JSON.stringify(item));
    this.props.navigation.navigate('CheckReview', {
      initState: this.props.state.initState,
      item: item,
      data: {
        statusdata: this.props.state.statusdata,
        reasondata: this.props.state.reasondata,
        imgmaindata: this.props.state.imgmaindata,
        imgsubdata: this.props.state.imgsubdata,
        projectdata: this.props.state.projectdata,
        catdata: this.props.state.catdata,
        subcatdata: this.props.state.subcatdata,
        techniciandata: this.props.state.techniciandata,
      }
    })
  }
  render() {
    const statusMap = this.props.state.statusdata.filter(status => status.ids === this.props.showcase.statusId)[0];
    const projectMap = this.props.state.projectdata.filter(project => project.ids === this.props.showcase.projectId)[0];
    const catMap = this.props.state.catdata.filter(cat => cat.ids === this.props.showcase.catId)[0];
    const subcatMap = this.props.state.subcatdata.filter(subcat => subcat.ids === this.props.showcase.subcatId)[0];
    const vstyles = {
      circle: {
        backgroundColor: statusMap.color
      },
      borderLeft: {
        borderLeftColor: statusMap.color
      }
    }
    let datetimeOfAction = '';
    if (statusMap.ordering > 1) {
      datetimeOfAction = UnixThai.Time(this.props.showcase.checkedAt);
    } else {
      datetimeOfAction = UnixThai.Time(this.props.showcase.createdAt);
    }
    let desc = statusMap.desc;
    return (
      <TouchableHighlight
        underlayColor='#F7F7F7'
        onPress={() => this._onPress(this.props.showcase)}
      >
        <View style={[styles.checkList, vstyles.borderLeft]}>
          <View style={{
            flexDirection: 'column',
            backgroundColor: '#fff',
            padding: 2,
            width: '100%'
          }}
          >
            <View style={[{
            }, styles.zeroAlpha]}>
              <View style={[styles.Alpha, {
              }]}>
                <Text style={[styles.nametitle]}>ID</Text>
                <Text>{this.props.showcase.casenumberId}</Text>
              </View>
              <View style={[styles.Bravo, {
                left: 100,
              }]}>
                <Text style={[styles.nametitle]}>โครงการ</Text>
                <Text>{projectMap.name}</Text>
              </View>
              <View style={[styles.Chalee, {
                left: 350,
              }]}>
                <Text style={[styles.nametitle]}>เลขยูนิต</Text>
                <Text>{this.props.showcase.units}</Text>
              </View>
            </View>
            <View style={[{
            }, styles.zeroAlpha]}>
              <View style={[styles.Alpha, {
              }]}>
                <Text style={[styles.nametitle]}>ผู้แจ้งซ่อม</Text>
                <Text>{this.props.showcase.issuerName}</Text>
              </View>
              <View style={[styles.Bravo, {
                left: 200,
              }]}>
                <Text style={[styles.nametitle]}>เบอร์โทร</Text>
                <Text>{this.props.showcase.xHomePhone_Issuer}</Text>
              </View>
              <View style={[styles.Chalee, {
                left: 350,
              }]}>
                <Text style={[styles.nametitle]}>สถานะ</Text>
                <View style={[styles.circleStatus, vstyles.circle]}></View>
                <Text style={{ marginLeft: 25 }}>{statusMap.name}</Text>
              </View>
            </View>
            <View style={{
              borderColor: '#E8E8E8',
              borderBottomWidth: 1,
              marginHorizontal: 10,
            }}>
            </View>
            <View style={[{
            }, styles.zeroAlpha]}>
              <View style={[styles.Alpha, {
              }]}>
                <Text style={[styles.nametitle]}>ประเภทหลัก</Text>
                <Text>{catMap.name}</Text>
              </View>
              <View style={[styles.Bravo, {
                left: 150,
              }]}>
                <Text style={[styles.nametitle]}>ประเภทย่อย</Text>
                <Text>{subcatMap.name}</Text>
              </View>
              <View style={[styles.Chalee, {
                left: 350,
              }]}>
                <Text style={[styles.nametitle]}>วันและเวลาที่{desc}</Text>
                <Text>{datetimeOfAction}</Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableHighlight>
    )
  }
}
const styles = StyleSheet.create({
  nametitle: {
    color: '#BCBCBC'
  },
  circleStatus: {
    width: 20,
    height: 20,
    borderRadius: 100 / 2,
    position: 'absolute',
    bottom: 3,
  },
  Alpha: {
    padding: 2,
    position: 'absolute',
    top: 10,
    left: 10,
  },
  Bravo: {
    position: 'absolute',
    padding: 2,
    top: 10,
    width: 250,
  },
  Chalee: {
    position: 'relative',
    padding: 2,
  },
  zeroAlpha: {
    flexDirection: 'row',
    padding: 8,
    width: '100%',
  },
  checkList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    margin: 10,
    borderLeftWidth: 11,
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
});