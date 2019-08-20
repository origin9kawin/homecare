import React from 'react';
import CONFIG from '../config/Config'
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import ImageView from 'react-native-image-view';
import UnixThai from '../utils/UnixThai';
const win = Dimensions.get('window');
export default class ReRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeAssignTab: 0,
      imageAssignIndex: 0,
      isImageAssignViewVisible: false,
      activeCheckedTab: 0,
      imageCheckedIndex: 0,
      isImageCheckedViewVisible: false,
    };
    this.renderImageViewFooter = this.renderImageViewFooter.bind(this);
  }
  componentDidMount() {
    console.log("ReRow did mount");
  }
  renderImageViewFooter({ title }) {
    return (
      <View style={styles.footer}>
        <Text style={styles.footerText}>{title}</Text>
        <TouchableOpacity
          style={styles.footerButton}
        >
        </TouchableOpacity>
      </View>
    );
  }
  renderRemarkValues = (item) => {
    let xHomeListDefect = [];
    let technicianId = null;
    let technicianName = '';
    if (item.update != undefined) {
      xHomeListDefect = item.update.xHomeListDefect;
    } else {
      xHomeListDefect = item.xHomeListDefect;
    }
    return (
      xHomeListDefect.map((value, i) => {
        if (item.nonZero != undefined) {
          technicianId = item.nonZero.filter(non => non.id === value.id)[0].technician;
          technicianName = item.data.techniciandata.filter(tech => tech.ids === technicianId)[0].firstname;
        }
        if (value.xHomeCaseDet != undefined) {
          if (value.xHomeCaseDet.length > 0) {
            technicianId = value.xHomeCaseDet[0].assignedTo;
            technicianName = item.data.techniciandata.filter(tech => tech.ids === technicianId)[0].firstname;
          }
        }
        let listValue = null;
        let remarkValue = null;
        if (item.initState == 0) {
          let casedetId = item.case.casedetId;
          if (value.casedetId == casedetId) { listValue = value.name; remarkValue = value.remark }
        } else { listValue = value.name; }
        return (
          item.initState == 1 ? (
            <View key={i}>
              <Text style={[styles.nametitle]}>รายการที่ {i + 1}.</Text>
              <Text>{value.name}</Text>
              {technicianId != null ? (
                <View>
                  <Text style={[styles.nametitle]}>ผู้ได้รับมอบหมาย</Text>
                  <Text>{technicianName}</Text>
                </View>
              ) : (null)}
              <Text></Text>
            </View>
          ) : (
              listValue != null ? (
                <View key={i}>
                  <Text style={[styles.nametitle]}>รายการซ่อม</Text>
                  <Text>{listValue}</Text>
                  <Text style={[styles.nametitle]}>หมายเหตุ</Text>
                  <Text>{remarkValue}</Text>
                </View>
              ) : (
                  <View key={i}></View>
                )
            )
        )
      })
    )
  }
  renderFirstRow = (item) => {
    item['vstyles'] = null;
    const projectMap = item.data.projectdata.filter(project => project.ids === item.projectId)[0];
    if (item.update == undefined) {
      const issuer = item.xHomePhone_Issuer
      const iPhones = []; issuer.forEach(element => { iPhones.push(element.number) });
      const owner = item.xHomePhone_Owner
      const oPhones = []; owner.forEach(element => { oPhones.push(element.number) });
      const issuerPhones = iPhones.join(', ')
      const ownerPhones = oPhones.join(', ')
      const vstyles = { circle: { backgroundColor: item.status_color }, borderLeft: { borderLeftColor: 'transparent' } }
      item['issuerPhones'] = issuerPhones
      item['ownerPhones'] = ownerPhones
      item['vstyles'] = vstyles
    } else {
      const vstyles = { circle: { backgroundColor: item.update.status.color }, borderLeft: { borderLeftColor: 'transparent' } }
      item['vstyles'] = vstyles;
    }
    return (
      <View style={[styles.checkList, {
      }, item.vstyles.borderLeft]}>
        <View style={{
          flexDirection: 'column',
          backgroundColor: '#F7F7F7',
          padding: 2,
          width: '100%'
        }}>
          <View style={[{
            marginBottom: 10,
          }, styles.zeroAlpha]}>
            <View style={[styles.Alpha, {
            }]}>
              <Text style={{
                fontSize: 20,
                color: '#E2792D'
              }}>ข้อมูลลูกบ้าน</Text>
            </View>
          </View>
          <View style={[{
          }, styles.zeroAlpha]}>
          </View>
          <View style={[{
          }, styles.zeroAlpha]}>
            <View style={[styles.Alpha, {
            }]}>
              <Text style={[styles.nametitle]}>โครงการ</Text>
              <Text>{projectMap.name}</Text>
            </View>
            <View style={[styles.Chalee, {
              left: 350,
            }]}>
              <Text style={[styles.nametitle]}>เลขยูนิต</Text>
              <Text>{item.case.units}</Text>
            </View>
          </View>
          <View style={[styles.seperateLine]}></View>
          <View style={[{
          }, styles.zeroAlpha]}>
            <View style={[styles.Alpha, {
            }]}>
              <Text style={[styles.nametitle]}>เจ้าบ้าน</Text>
              <Text>{item.homecareName}</Text>
            </View>
            <View style={[styles.Chalee, {
              left: 350,
            }]}>
              <Text style={[styles.nametitle]}>เบอร์โทร</Text>
              <Text>{item.ownerPhones}</Text>
            </View>
          </View>
          <View style={[{
          }, styles.zeroAlpha]}>
            <View style={[styles.Alpha, {
            }]}>
              <Text style={[styles.nametitle]}>ย้ายเข้าเมื่อ</Text>
              <Text>{UnixThai.Time(item.homecareInDate, true)}</Text>
            </View>
            <View style={[styles.Chalee, {
              left: 350,
            }]}>
              <Text style={[styles.nametitle]}></Text>
              <Text></Text>
            </View>
          </View>
          <View style={[{
          }, styles.zeroAlpha]}>
            <View style={[styles.Alpha, {
            }]}>
              <Text style={[styles.nametitle]}>ผู้แจ้งซ่อม</Text>
              <Text>{item.case.issuerName}</Text>
            </View>
            <View style={[styles.Chalee, {
              left: 350,
            }]}>
              <Text style={[styles.nametitle]}>เบอร์โทร</Text>
              <Text>{item.issuerPhones}</Text>
            </View>
          </View>
        </View>
      </View>
    )
  }
  renderSecondRow = (item) => {
    const catMap = item.data.catdata.filter(cat => cat.ids === item.catId)[0];
    const subcatMap = item.data.subcatdata.filter(subcat => subcat.ids === item.subcatId)[0];
    let statusMap = null;
    let statusFind = null;
    item.update == undefined ? statusFind = item.statusId : statusFind = item.update.status.id;
    statusMap = item.data.statusdata.filter(status => status.ids === statusFind)[0];
    const vstyles = { circle: { backgroundColor: statusMap.color }, borderLeft: { borderLeftColor: 'transparent' } }
    item['vstyles'] = vstyles
    return (
      <View style={[styles.checkList, {
      }, item.vstyles.borderLeft]}>
        <View style={{
          flexDirection: 'column',
          backgroundColor: '#fff',
          padding: 2,
          width: '100%'
        }}>
          <View style={[{
            marginBottom: 20,
          }, styles.zeroAlpha]}>
            <View style={[styles.Alpha, {
            }]}>
              <Text style={{
                fontSize: 20,
                color: '#E2792D'
              }}>รายละเอียดแจ้งซ่อม</Text>
            </View>
          </View>
          <View style={[{
          }, styles.zeroAlpha]}>
            <View style={[styles.Alpha, {
            }]}>
              <Text style={[styles.nametitle]}>ID</Text>
              <Text>{item.case.casenumberId}</Text>
            </View>
            <View style={[styles.Bravo, {
              left: 140,
            }]}>
              <Text style={[styles.nametitle]}>ประเภทหลัก</Text>
              <Text>{catMap.name}</Text>
            </View>
            <View style={[styles.Chalee, {
              left: 350,
            }]}>
              <Text style={[styles.nametitle]}>ประเภทย่อย</Text>
              <Text>{subcatMap.name}</Text>
            </View>
          </View>
          <View style={[{
          }, styles.zeroAlpha]}>
            <View style={{
              padding: 2,
              position: 'relative',
            }}>
              <Text style={[styles.nametitle]}>รายละเอียด</Text>
              <Text>{item.description}</Text>
            </View>
          </View>
          {this.renderArrayAssignImage(item)}
          {item.initState == 1 ? (
            <View>
              <View style={[styles.seperateLine]}></View>
              <View style={[{
              }, styles.zeroAlpha]}>
                <View style={[styles.Alpha, {
                }]}>
                  <Text style={[styles.nametitle]}>วันและเวลารับเรื่อง</Text>
                  <Text>{UnixThai.Time(item.case.createdAt)}</Text>
                </View>
                <View style={[styles.Chalee, {
                  left: 350,
                }]}>
                  <Text style={[styles.nametitle]}>สถานะ</Text>
                  <View style={[styles.circleStatus, item.vstyles.circle]}></View>
                  <Text style={{
                    marginLeft: 25,
                  }}>{statusMap.name}</Text>
                </View>
              </View>
            </View>
          ) : (null)}
        </View>
      </View>
    )
  }
  renderThirdRow = (item) => {
    const catMap = item.data.catdata.filter(cat => cat.ids === item.catId)[0];
    const subcatMap = item.data.subcatdata.filter(subcat => subcat.ids === item.subcatId)[0];
    const checkingStatusId = item.data.statusdata.filter(status => status.ordering === 2)[0].ids;
    let statusMap = item.data.statusdata.filter(status => status.ids === item.statusId)[0];
    let imageTimeCreated = null;
    let casedetCreated = null;
    const images = item.xHomeImage.filter(image => image.statusId === checkingStatusId)[0];
    if (images == undefined) {
      if (item.update.images.length > 0) {
        imageTimeCreated = item.update.images.filter(image => image.statusId === checkingStatusId)[0].createdAt;
      }
    } else {
      imageTimeCreated = images.createdAt;
    }
    if (item.xHomeListDefect != undefined) {
      if (item.xHomeListDefect.length > 0) {
        if (item.xHomeListDefect[0].xHomeCaseDet.length > 0) {
          casedetCreated = item.xHomeListDefect[0].xHomeCaseDet[0].createdAt;
          statusMap = item.data.statusdata.filter(status => status.ids === item.case.statusId)[0];
        }
      }
    }
    let titleSubject = 'เข้าตรวจสอบ'
    if (item.initState == 0) {
      titleSubject = 'รายการเข้าซ่อม';
    }
    if (this.props.sopStatus != undefined) {
      if (this.props.sopStatus.statusId != undefined) {
        statusMap = item.data.statusdata.filter(status => status.ids === this.props.sopStatus.statusId)[0];
      }
    }
    let casedetReasonTitle = ' ';
    let casedetReasons = ' ';
    if (this.props.sopReason != undefined) {
      let reasonName = [];
      let reasonDet = this.props.sopReason;
      if (reasonDet.length > 0) {
        reasonDet.forEach(element => {
          if (element.activeState == true) {
            reasonName.push(element.name);
          }
        });
      }
      if (reasonName.length > 0) {
        casedetReasonTitle = 'เหตุผล';
        casedetReasons = reasonName.join(' / ');
      }
    }
    const vstyles = { circle: { backgroundColor: statusMap.color }, borderLeft: { borderLeftColor: 'transparent' } }
    item['vstyles'] = vstyles
    return (
      <View style={[styles.checkList, {
      }, item.vstyles.borderLeft]}>
        <View style={{
          flexDirection: 'column',
          backgroundColor: '#fff',
          padding: 2,
          width: '100%'
        }}>
          <View style={[{
            marginBottom: 20,
          }, styles.zeroAlpha]}>
            <View style={[styles.Alpha, {
            }]}>
              <Text style={{
                fontSize: 20,
                color: '#E2792D'
              }}>{titleSubject}</Text>
            </View>
          </View>
          {item.initState == 1 ? (
            <View>
              <View style={[{
              }, styles.zeroAlpha]}>
                <View style={[styles.Alpha, {
                }]}>
                  <Text style={[styles.nametitle]}>ประเภทหลัก</Text>
                  <Text>{catMap.name}</Text>
                </View>
                <View style={[styles.Chalee, {
                  left: 350,
                }]}>
                  <Text style={[styles.nametitle]}>ประเภทย่อย</Text>
                  <Text>{subcatMap.name}</Text>
                </View>
              </View>
              <View style={[styles.seperateLine]}></View>
            </View>
          ) : null}
          {item.initState == 1 ? (
            <View>
              <View style={[{
              }, styles.zeroAlpha]}>
                <View style={{
                  padding: 2,
                  position: 'relative',
                }}>
                  {this.renderRemarkValues(item)}
                </View>
              </View>
              <View style={[styles.seperateLine]}></View>
              {this.renderArrayCheckedImage(item)}
            </View>
          ) : (
              <View>
                <View style={[styles.zeroAlpha]}>
                  <View style={{
                    padding: 2,
                    position: 'relative',
                    flexDirection: 'column',
                    flexWrap: 'wrap',
                    width: 320,
                  }}>
                    {this.renderRemarkValues(item)}
                  </View>
                  <View style={{
                    position: 'relative',
                    padding: 2,
                    width: 220,
                    flexWrap: 'wrap',
                    left: 30,
                    top: 7,
                    flexDirection: 'column'
                  }}>
                    <View>
                      <Text style={[styles.nametitle]}>สถานะ</Text>
                      <View style={[styles.circleStatus, item.vstyles.circle]}></View>
                      <Text style={{
                        marginLeft: 25,
                      }}>{statusMap.name}</Text>
                    </View>
                    <View>
                      <Text style={[styles.nametitle]}>SLA</Text>
                      <Text>1 วัน</Text>
                    </View>
                    <View>
                      <Text style={[styles.nametitle]}>{casedetReasonTitle}</Text>
                      <Text>{casedetReasons}</Text>
                    </View>
                  </View>
                </View>
                <View style={[styles.seperateLine]}></View>
                <View>{this.renderArrayCheckedImage(item)}</View>
              </View>
            )}
          {item.initState == 1 ? (
            <View>
              <View style={[styles.seperateLine]}></View>
              <View style={[{
              }, styles.zeroAlpha]}>
                <View style={[styles.Alpha, {
                }]}>
                  <Text style={[styles.nametitle]}>วันและเวลาที่เข้าตรวจ</Text>
                  <Text>{UnixThai.Time(imageTimeCreated)}</Text>
                </View>
                <View style={[styles.Chalee, {
                  left: 350,
                }]}>
                  {casedetCreated != null ? (
                    <View>
                      <Text style={[styles.nametitle]}>วันและเวลาที่มอบหมาย</Text>
                      <Text>{UnixThai.Time(casedetCreated)}</Text>
                    </View>
                  ) : (
                      <View>
                        <Text style={[styles.nametitle]}></Text>
                        <Text></Text>
                      </View>
                    )}
                </View>
              </View>
            </View>
          ) : null}
        </View>
      </View>
    )
  }
  renderArrayAssignImage = (item) => {
    const arrayImages = []
    const statusMap = item.data.statusdata.filter(status => status.ordering === 1)[0];
    const sourceImageArray = item.xHomeImage.filter(image => image.statusId === statusMap.ids);
    sourceImageArray.map((image, i) => {
      arrayImages.push({
        source: { uri: CONFIG.IMAGE_URL + image.fileName },
        title: i,
        width: 400,
      })
    })
    const assignTabs = [{ title: 'Images', images: arrayImages }];
    const { isImageAssignViewVisible, activeAssignTab, imageAssignIndex } = this.state;
    const assignImages = assignTabs[activeAssignTab].images || [];
    item['assignImages'] = assignImages
    item['assignTabs'] = assignTabs
    return (
      <View style={[styles.zeroAlpha]}>
        <View style={{
          padding: 2,
          position: 'relative',
        }}>
          <Text style={[styles.nametitle]}>รูปภาพ</Text>
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap'
          }}>
            {item.assignImages.map((image, index) => (
              <TouchableOpacity
                key={image.title}
                onPress={() => {
                  this.setState({
                    imageAssignIndex: index,
                    isImageAssignViewVisible: true,
                  });
                }}
              >
                <Image
                  style={{
                    margin: 5,
                    width: 95,
                    height: 95,
                  }}
                  source={image.source}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.tabs}>
            {item.assignTabs.map(({ title }, index) => (
              <TouchableOpacity
                style={styles.tab}
                key={title}
                onPress={() => {
                  this.setState({
                    activeAssignTab: index,
                  });
                }}
              >
                <Text
                  style={[
                    styles.tabTitle,
                    index === activeAssignTab &&
                    styles.tabTitleActive,
                  ]}
                >
                  {title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <ImageView
            isVisible={true}
            isSwipeCloseEnabled={false}
            isTapZoomEnabled={true}
            isPinchZoomEnabled={false}
            glideAlways={true}
            glideAlwaysDelay={0}
            images={item.assignImages}
            imageAssignIndex={imageAssignIndex}
            animationType="none"
            isVisible={isImageAssignViewVisible}
            renderImageViewFooter={this.renderImageViewFooter}
            onClose={() => this.setState({ isImageAssignViewVisible: false })}
          />
        </View>
      </View>
    )
  }
  renderArrayCheckedImage = (item) => {
    const arrayImages = [];
    let sourceImageArray = [];
    const statusMap = item.data.statusdata.filter(status => status.ordering === 2)[0];
    if (item.update == undefined) {
      sourceImageArray = item.xHomeImage.filter(image => image.statusId === statusMap.ids);
    } else {
      sourceImageArray = item.update.images.filter(image => image.statusId === statusMap.ids);
    }
    sourceImageArray.map((image, i) => {
      arrayImages.push({
        source: { uri: CONFIG.IMAGE_URL + image.fileName },
        title: i,
        width: 400,
      })
    })
    const assignTabs = [{ title: 'Images', images: arrayImages }];
    const { isImageCheckedViewVisible, activeCheckedTab, imageCheckedIndex } = this.state;
    const assignImages = assignTabs[activeCheckedTab].images || [];
    item['assignImages'] = assignImages
    item['assignTabs'] = assignTabs
    return (
      <View style={[styles.zeroAlpha]}>
        <View style={{
          padding: 2,
          position: 'relative',
        }}>
          <Text style={[styles.nametitle]}>รูปภาพ</Text>
          <View style={{
            flexDirection: 'row',
            flexWrap: 'wrap'
          }}>
            {item.assignImages.map((image, index) => (
              <TouchableOpacity
                key={image.title}
                onPress={() => {
                  this.setState({
                    imageCheckedIndex: index,
                    isImageCheckedViewVisible: true,
                  });
                }}
              >
                <Image
                  style={{
                    margin: 5,
                    width: 95,
                    height: 95,
                  }}
                  source={image.source}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.tabs}>
            {item.assignTabs.map(({ title }, index) => (
              <TouchableOpacity
                style={styles.tab}
                key={title}
                onPress={() => {
                  this.setState({
                    activeCheckedTab: index,
                  });
                }}
              >
                <Text
                  style={[
                    styles.tabTitle,
                    index === activeCheckedTab &&
                    styles.tabTitleActive,
                  ]}
                >
                  {title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <ImageView
            isVisible={true}
            isSwipeCloseEnabled={false}
            isTapZoomEnabled={true}
            isPinchZoomEnabled={false}
            glideAlways={true}
            glideAlwaysDelay={0}
            images={item.assignImages}
            imageAssignIndex={imageCheckedIndex}
            animationType="none"
            isVisible={isImageCheckedViewVisible}
            renderImageViewFooter={this.renderImageViewFooter}
            onClose={() => this.setState({ isImageCheckedViewVisible: false })}
          />
        </View>
      </View>
    )
  }
  render() {
    switch (this.props.rows) {
      case 'firstRow':
        return (
          <View>
            {this.renderFirstRow(this.props.item)}
          </View>
        )
        break;
      case 'secondRow':
        return (
          <View>
            {this.renderSecondRow(this.props.item)}
          </View>
        )
        break;
      case 'thirdRow':
        return (
          <View>
            {this.renderThirdRow(this.props.item)}
          </View>
        )
        break;
      default:
        return (
          <View>
            <Text>ReRow</Text>
          </View>
        )
        break;
    }
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
    width: 155,
  },
  Chalee: {
    position: 'relative',
    padding: 2,
    width: 220,
    flexWrap: 'wrap'
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
  tabs: {
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    height: 30,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  tabTitle: {
    color: '#EEE',
  },
  tabTitleActive: {
    fontWeight: '700',
    color: '#FFF',
  },
  footer: {
    width: win.width,
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  footerButton: {
    flexDirection: 'row',
    marginLeft: 15,
  },
  footerText: {
    fontSize: 16,
    color: '#FFF',
    textAlign: 'center',
  },
  seperateLine: {
    borderColor: '#E8E8E8',
    borderBottomWidth: 1,
    marginHorizontal: 10,
    marginTop: 10,
  }
});
