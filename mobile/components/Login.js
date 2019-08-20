import React from 'react';
import CONFIG from '../config/Config';
import AccessRequest from './AccessRequest'
import EStyleSheet from 'react-native-extended-stylesheet';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  KeyboardAvoidingView,
  Text,
  View,
  TextInput,
  TouchableHighlight,
  TouchableWithoutFeedback, Keyboard,
  Image,
  ImageBackground,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import RootScreen from './Root';
import HomeScreen from './Home';
import CheckReview from './CheckReview';
import CheckSave from './CheckSave';
import CheckAssign from './CheckAssign';
import CheckSummary from './CheckSummary';
import SopImgUp from './SopImgUp';
import CameraScreen from './CameraScreen';
import SemiFinal from './SemiFinal';
import {
  createStackNavigator,
  createAppContainer,
} from 'react-navigation';
const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);
const win = Dimensions.get('window');
const ratio = win.width / 200; //541 is actual image width
class LoginScreen extends React.Component {
  static navigationOptions = {
    header: null,
  }
  constructor(props) {
    super(props);
    this.passwordInput = React.createRef();
    this.usernameInput = React.createRef();
    this.submitButton = React.createRef();
    this.submitTextRef = React.createRef();
    this.state = {
      username: '',
      password: '',
      appIsReady: false,
      hidePassword: true,
      openEyes: false,
      usernameFocus: false,
      passwordFocus: false,
      submitButtonDisabled: false,
      animateLoading: false,
      showEyeButton: false,
      networkOffline: false,
      loginError: false,
      successCredential: false,
      buttonBackgroundColor: CONFIG.stateButtonBackgroundColor.light,
      submitTextValue: CONFIG.definedGlobalText.value.init,
      submitTextSize: CONFIG.definedGlobalText.size.init,
      loginCount: 0,
      buttonPressedCount: 0,
    }
  }
  componentDidUpdate(prevProps, prevState, isLoading) {
    if (this.state.networkOffline == true) {
      console.log("\nLogin>componentDidUpdate: networking is down")
      setTimeout(() => {
        this.setState({
          submitTextValue: CONFIG.definedGlobalText.value.init,
          submitTextSize: CONFIG.definedGlobalText.size.init,
          buttonBackgroundColor: CONFIG.stateButtonBackgroundColor.light,
          networkOffline: false, // do not forget set back state
          submitButtonDisabled: false,
        })
      }, CONFIG.definedGlobalText.delay.offline);
    }
    if (this.state.loginError == true) {
      console.log("\nLogin>componentDidUpdate: invalid login")
      setTimeout(() => {
        this.setState({
          submitTextValue: CONFIG.definedGlobalText.value.init,
          submitTextSize: CONFIG.definedGlobalText.size.init,
          buttonBackgroundColor: CONFIG.stateButtonBackgroundColor.light,
          loginError: false, // do not forget set back state
          submitButtonDisabled: false,
        })
      }, CONFIG.definedGlobalText.delay.error);
    }
    if (this.state.successCredential == true) {
      console.log("\nLogin>componentDidUpdate: success store credential")
      console.log("\nLogin>componentDidUpdate: set to false then navigate to HomeScreen")
      this.setState({
        successCredential: false
      })
      return this.props.navigation.push('RootScreen');
    }
  }
  componentWillUnmount() {
    this.setState({})
  }
  startLoading = () => {
    this.setState({
      submitTextValue: CONFIG.definedGlobalText.value.loading,
      submitButtonDisabled: true,
      animateLoading: true,
      buttonBackgroundColor: CONFIG.stateButtonBackgroundColor.heavy
    })
  }
  finishLoading(responseRequest) {
    console.log("\nLogin->finishLoading: responseRequest: " + JSON.stringify(responseRequest))
    for (var key in responseRequest) { if (responseRequest.hasOwnProperty(key)) { this.setState({ [key]: responseRequest[key] }) } }
  }
  async callbackAccessRequest() {
    console.log("Login->callbackMakeRequest: start calling back data from access request")
    this.startLoading()
    const responseRequest = await AccessRequest.Request(this.state)
    console.log("\nLogin->onClickListener: responseRequest: " + responseRequest)
    if (responseRequest != undefined) {
      this.finishLoading(responseRequest[0])
    }
  }
  onClickListener = (pressId) => {
    if (pressId == 'login') {
      this.setState({
        hidePassword: true,
        showEyeButton: false,
        buttonPressedCount: this.state.buttonPressedCount += 1
      });
      if (this.state.username.length < 1 || this.state.password.length < 1) {
        console.log('\nLogin->onClickListener: username / password is empty')
        this.usernameInput.current.focus();
        if (this.state.username.length > 1) {
          console.log('\nLogin->onClickListener: username is not empty then focus on password block')
          this.passwordInput.current.focus();
        }
      }
      if (this.state.username.length > 1 && this.state.password.length > 1) {
        console.log('\nLogin->onClickListener: unfocus password field by focus somewhere else');
        Keyboard.dismiss();
        console.log("\nLogin->onClickListener: Button pressed: " + this.state.buttonPressedCount);
        console.log("\nLogin->onClickListener: making a " + this.state.loginCount + " request");
        this.callbackAccessRequest()
      }
    }
  }
  togglePasswordVisibility() {
    console.log('touching..');
    if (this.state.hidePassword == true) {
      this.setState({ hidePassword: false, openEyes: true, });
    } else {
      this.setState({ hidePassword: true, openEyes: false, });
    }
  }
  render() {
    const vstyles = {
      button: { backgroundColor: this.state.buttonBackgroundColor, },
      size: { fontSize: this.state.submitTextSize }
    }
    return (
      <KeyboardAvoidingView style={{
        flex: 1,
      }}
        behavior="padding"
      >
        <View style={styles.root} >
          <ImageBackground source={require('../assets/login-background.png')} style={{
            width: '100%', height: '100%',
          }}></ImageBackground>
          <View style={styles.loginView}>
            <DismissKeyboard>
              <View style={{
                flexDirection: 'row',
                alignContent: 'center',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                marginBottom: 20
              }}>
                <View style={{
                  width: '49%',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Image style={{
                    width: win.width / 3,
                    height: 52 * ratio / 3,
                  }} source={require('../assets/login-logo.png')}></Image>
                </View>
                <View style={{
                  width: 1,
                  backgroundColor: "#DB742A",
                  marginHorizontal: 10,
                }}><Text style={{
                  fontSize: 8 * ratio,
                }}>|</Text></View>
                <View style={{
                  width: '49%',
                }}>
                  <Text style={styles.title}>HOMECARE</Text>
                </View>
              </View>
            </DismissKeyboard>
            <Text style={[styles.label_username, styles.label]}>Username</Text>
            <TextInput
              style={[styles.textInput, styles.input_username]}
              placeholder="admin"
              autoCompleteType="off"
              autoCapitalize="none"
              maxLength={20}
              underlineColorAndroid={'rgba(0,0,0,0)'}
              underlineColorAndroid="transparent"
              returnKeyType="next"
              onChangeText={(username) => { this.setState({ username: username }) }}
              blurOnSubmit={true}
              onSubmitEditing={(event) => { this.passwordInput.current.focus() }}
              ref={this.usernameInput}
            ></TextInput>
            <Text style={[styles.label_password, styles.label]}>Password</Text>
            <TextInput
              style={[styles.textInput, styles.input_password]}
              placeholder="12345"
              autoCompleteType="off"
              autoCapitalize="none"
              maxLength={25}
              underlineColorAndroid={'rgba(0,0,0,0)'}
              underlineColorAndroid="transparent"
              returnKeyType="done"
              secureTextEntry={this.state.hidePassword}
              onChangeText={(password) => {
                this.setState({ password: password });
              }}
              blurOnSubmit={true}
              onSubmitEditing={(event) => { this.onClickListener('login') }}
              ref={this.passwordInput}
            ></TextInput>
            {this.state.showEyeButton ? (
              <TouchableWithoutFeedback onPress={() => this.togglePasswordVisibility()}>
                {this.state.openEyes ? (
                  <View style={[styles.eyeIcon]}><Icon name="eye-outline" size={25} color="#707070" /></View>
                ) :
                  <View style={[styles.eyeIcon]} ><Icon name="eye-off-outline" size={25} color="#707070" /></View>
                }
              </TouchableWithoutFeedback>
            ) : null}
            <TouchableHighlight
              disabled={this.state.submitButtonDisabled}
              style={[styles.button, vstyles.button]}
              onPress={() => this.onClickListener('login')}
              underlayColor="#e89a61">
              <Text ref={this.submitTextRef} style={[styles.button_text, vstyles.size]}>{this.state.submitTextValue}</Text>
            </TouchableHighlight>
            {this.state.animateLoading ? (
              <View style={{
                position: 'absolute',
                bottom: '14%',
                right: '39%'
              }}><ActivityIndicator size='small' color='#FFFFFF' />
              </View>
            ) : null}
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
}
const RootStackNavigator = createStackNavigator(
  {
    LoginScreen: LoginScreen,
    RootScreen: {
      screen: RootScreen,
      navigationOptions: ({ navigation }) => ({
        header: null
      }),
    },
    HomeScreen: {
      screen: HomeScreen,
      navigationOptions: ({ navigation }) => ({
        header: null
      }),
    },
    CheckReview: CheckReview,
    CheckSave: CheckSave,
    CheckSummary: CheckSummary,
    CheckAssign: CheckAssign,
    SopImgUp: SopImgUp,
    CameraScreen: {
      screen: CameraScreen,
      navigationOptions: ({ navigation }) => ({
        header: null
      }),
    },
    SemiFinal: {
      screen: SemiFinal,
      navigationOptions: ({ navigation }) => ({
        header: null
      }),
    },
  },
);
const NavigationApp = createAppContainer(RootStackNavigator);
export default NavigationApp;
EStyleSheet.build({
  '@media android': {
    $fontSize: 16,
  },
});
const styles = EStyleSheet.create({
  buttonSelected: {
    backgroundColor: '#848486',
  },
  button_text: {
    color: '#FFF',
  },
  button: {
    height: 20 * ratio,
    marginTop: 5 * ratio,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 3,
  },
  input_username: {
  },
  input_password: {
  },
  eyeIcon: {
    position: 'absolute',
    right: 1 * ratio,
    bottom: 45 * ratio,
    padding: 8 * ratio,
  },
  textInput: {
    fontSize: 25,
    color: '#707070',
    borderColor: 'transparent',
    borderBottomColor: '#707070',
    borderBottomWidth: 1,
    textDecorationLine: 'none',
    textAlignVertical: "bottom",
    paddingVertical: 3 * ratio,
    marginBottom: 5 * ratio,
  },
  label: {
    fontSize: 20,
  },
  label_username: {
  },
  label_password: {
  },
  title: {
    color: '#E87D2F',
    fontFamily: 'SukhumvitSet-Bold',
    fontSize: 11 * ratio,
  },
  loginView: {
    width: '85%',
    flex: 1,
    backgroundColor: "#FFFFFF",
    position: "absolute",
    elevation: 6,
    shadowOffset: {
      height: 2,
      width: 0
    },
    shadowColor: "rgba(0,0,0,1)",
    shadowOpacity: 0.24,
    shadowRadius: 2,
    overflow: "visible",
    paddingVertical: 30,
    paddingHorizontal: 25,
  },
  root: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
