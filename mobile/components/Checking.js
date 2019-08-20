import React from 'react';
import { SQLite } from 'expo-sqlite';
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
} from 'react-native';
import IsLoading from './Isloading'
import MakeRequest from './MakeRequest'
import CaseListItem from './caseListItem'
import { LayoutUtil } from './LayoutUtil'
import { RecyclerListView, DataProvider } from 'recyclerlistview';
const win = Dimensions.get('window');
const ratio = win.width / 200;
function timeStamp() { return Math.floor(Date.now() / 1000) }
const db = SQLite.openDatabase("homecare.db");
class CheckScreen extends React.Component {
  constructor(props) {
    super(props);
    this.sqliteinRequest = false;
    this.state = {
      isLoading: this.props.isLoading,
      issubLoading: true,
      initState: this.props.initState,
      isRefreshing: false,
      limit: 10,
      page: 1,
      order: 'asc',
      dataProvider: new DataProvider((r1, r2) => {
        return r1 !== r2;
      }),
      layoutProvider: LayoutUtil.getLayoutProvider(3),
      statusdata: [], projectdata: [], catdata: [], subcatdata: [], techniciandata: [], reasondata: [], imgmaindata: [], imgsubdata: [],
      casedata: [],
    }
  }
  async processCallback(responseRequest) {
    for (var key in responseRequest) {
      if (responseRequest.hasOwnProperty(key)) {
        if (key == 'casedata') {
          const casedata = responseRequest[key]
          this.setState({
            dataProvider: this.state.dataProvider.cloneWithRows(
              this.state.casedata.concat(casedata)
            ),
            casedata: this.state.casedata.concat(casedata),
          });
        } else {
          this.setState({
            [key]: responseRequest[key]
          })
        }
      }
    }
  }
  async callbackMakeRequest() {
    this.setState({
      issubLoading: true
    })
    console.log("\nCheckReview->callbackMakeRequest: start calling back data from make request")
    const responseRequest = await MakeRequest.fetchCase(this.state)
    this.processCallback(responseRequest)
  }
  getPreload(params) {
    if (!this.sqliteinRequest) {
      this.sqliteinRequest = true;
      try {
        db.transaction(tx => {
          tx.executeSql("select ids,name,desc,color,ordering,reasonBtn from status", [], (_, { rows: { _array } }) => { this.setState({ statusdata: _array }); });
          tx.executeSql("select ids,name from reason", [], (_, { rows: { _array } }) => { this.setState({ reasondata: _array }); });
          tx.executeSql("select ids,name,ordering,selectAble from imgmaintag order by ordering asc", [], (_, { rows: { _array } }) => { this.setState({ imgmaindata: _array }); });
          tx.executeSql("select ids,name,ordering,selectAble,mainimgtagId from imgsubtag order by ordering asc", [], (_, { rows: { _array } }) => { this.setState({ imgsubdata: _array }); });
          tx.executeSql("select ids,name from project", [], (_, { rows: { _array } }) => { this.setState({ projectdata: _array }); });
          tx.executeSql("select ids,name from cate", [], (_, { rows: { _array } }) => { this.setState({ catdata: _array }); });
          tx.executeSql("select ids,name from subcat", [], (_, { rows: { _array } }) => { this.setState({ subcatdata: _array }); });
          tx.executeSql("select ids,firstname,email from technician", [], (_, { rows: { _array } }) => { this.setState({ techniciandata: _array }); });
        });
      } catch (error) { console.log(error); return false }
      finally {
        this.sqliteinRequest = false;
        console.log("\nChecking->ReadCase: done")
        this.setState({
          issubLoading: false,
        });
      }
    }
  }
  componentDidMount() {
    console.log("\nChecking->componentDidMount: component is mounted")
    this.setState({
      isLoading: false,
    })
    this.getPreload()
    this.callbackMakeRequest(this.state)
  }
  componentWillUnmount() {
    console.log("\nChecking->componentWillUnmount")
    this.setState({})
  }
  componentWillMount() {
    console.log("\nChecking->componentWillMount calling caseList")
  }
  handleRefresh = () => {
    console.log("\nChecking->_onRefresh: " + timeStamp())
    this.setState({
      page: 1,
    },
      () => {
        // const params = {
        //   page: this.state.page,
        //   limit: this.state.limit,
        //   initState: this.state.initState
        // }
        // this.getPreload(params)
        // this.setState({});
      }
    )
  }
  handleListEnd = () => {
    console.log("\nChecking->_onLoadmore: " + timeStamp())
    this.setState({
      page: this.state.page + 1,
    },
      () => {
        // const params = {
        //   page: this.state.page,
        //   limit: this.state.limit,
        //   initState: this.state.initState
        // }
        // this.getPreload(params)
        // this.setState({});
      }
    )
  }
  rowRenderer = (type, data) => {
    return <CaseListItem showcase={data} props={this.props} state={this.state} navigation={this.props.navigation} />;
  };
  renderFooter = () => {
    return this.sqliteinRequest
      ? <ActivityIndicator style={{ margin: 10 }} size="small" color={'#000'} />
      : <View style={{ height: 60 }} />;
  };
  render() {
    return (
      this.state.isLoading ? (
        <IsLoading isLoadingFromHome={this.state.isLoading} />
      ) : (
          this.state.issubLoading ? (null) : (
            <View style={styles.container}>
              <RecyclerListView
                style={{ flex: 1 }}
                contentContainerStyle={{ margin: 3 }}
                onEndReached={this.handleListEnd}
                dataProvider={this.state.dataProvider}
                layoutProvider={this.state.layoutProvider}
                rowRenderer={this.rowRenderer}
                renderFooter={this.renderFooter}
                refreshControl={
                  <RefreshControl
                    tintColor="transparent"
                    colors={['#000']}
                    style={{
                      backgroundColor: 'transparent'
                    }}
                    refreshing={this.state.isRefreshing}
                    onRefresh={this.handleRefresh.bind(this)}
                  />
                }
              />
            </View >
          )
        )
    )
  }
}
export default CheckScreen;
const styles = StyleSheet.create({
  pickerText: {
    color: '#707070',
    fontSize: 20,
    marginTop: 10,
    paddingHorizontal: 9,
  },
  pickerView: {
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
    overflow: "visible"
  },
  tabTitle: {
    color: '#E2792D',
    fontSize: 20,
    paddingVertical: 2 * ratio,
    paddingHorizontal: 3 * ratio,
    borderBottomWidth: 3,
  },
  logoutButton: {
    width: 60,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    top: 0,
    right: 0
  },
  tabNav: {
    position: 'relative',
    borderBottomWidth: 3,
  },
  paragraph: {
    margin: 24,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  headerWrapper: {
    position: 'absolute',
    height: 200,
    left: 0,
    right: 0,
    top: 29,
  },
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#F7F7F7',
  },
});