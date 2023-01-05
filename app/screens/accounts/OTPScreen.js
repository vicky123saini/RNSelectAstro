import React, { Component } from 'react';
import { View, Text, Image, SafeAreaView, ScrollView, Dimensions, TextInput, ActivityIndicator, Keyboard, Alert, Platform, ImageBackground} from 'react-native';
import analytics from '@react-native-firebase/analytics';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import {Toast} from 'native-base';
import * as env from '../../../env';
import * as Api from '../../Api';
import * as Auth from '../../Auth';
import RNOtpVerify from 'react-native-otp-verify';
import {Singular} from 'singular-react-native';

export default class OTPScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      otpResendCount:0,
      timer:30
    };
    this.otpSendCounterStart=this.otpSendCounterStart.bind();
  }

  componentDidMount = () => {
    analytics().logEvent("Enter_OTP");
    const{screen, data}=this.props.route.params??{};
    console.log("componentDidMount", screen, data);
    this.otpSendCounterStart();
    if(Platform.OS=="android")
      this.startListeningForOtp();
     
  }

  componentWillUnmount = () => {
    clearInterval(this._interval); 
    if(Platform.OS=="android")
      RNOtpVerify.removeListener(); 
  };

  startListeningForOtp = () =>
    RNOtpVerify.getOtp()
    .then(p => RNOtpVerify.addListener(this.otpHandler))
    .catch(p => console.log(p));

 otpHandler = (message) => {
   try{
    const OTP = /(\d{4})/g.exec(message)[1];
    this.setState({ OTP });

    if(Platform.OS=="android")
      RNOtpVerify.removeListener();
    
    Keyboard.dismiss();
    this._submit();
   }
   catch(err){console.log("otpHandler",err);}
 }
  

  otpSendCounterStart = () =>{
    this._interval = setInterval(() => {
      console.log("Interval", 4001);
      this.setState({timer:--this.state.timer},()=>{
        if(this.state.timer==0){
          clearInterval(this._interval);
        }
      });
    }, 1000);
  }

  _resend = () =>{
    const{screen, data}=this.props.route.params??{};
    console.log("OTPResendService req", data);
    Api.OTPResendService(data).then(resp=>{
      console.log("OTPResendService resp", resp);
      if(resp.ResponseCode==200){
        this.setState({otpResendCount:++this.state.otpResendCount, timer:30});
        this.otpSendCounterStart();
      }
    });
  }

  _submit = async()=>{
    this.setState({loading:true});

    const{screen, data}=this.props.route.params;
    var req={...data, OTP: this.state.OTP};
    console.log("ValidateOTPService req", req);
    Api.ValidateOTPService(req).then(resp=>{
      console.log("ValidateOTPService resp", JSON.stringify(resp));
      if(resp.ResponseCode==200){
        if(resp.ResponseMessage=="IS_NOT_VERIFIED")
          if(resp.data){
            this.createSession(resp);
          }
          else
            this.props.navigation.replace("SigninUpdateInfoScreen",{screen, data})
        else{
          this.createSession(resp);
        }
      }
      else{
        this.setState({loading:false});
        // Toast.show({
        //   text:resp.ResponseMessage,
        //   type:"danger",
        //   duration:5000
        // });
        Alert.alert("", resp.ResponseMessage);
      }
    });
  }

  createSession = (resp) =>{
    Singular.setCustomUserId(resp.data.Profile.UserId.toString());
    Singular.event("Login");

    Auth.Login({ access_token: resp.data.AccessToken, token_type:resp.data.TokenType, profile:resp.data.Profile }).then((loginResp)=>{
      if(resp.data.Profile.UserType==Auth.UserType.ENDUSER)
        this.props.navigation.replace("UserHomeScreen");
      else if(resp.data.Profile.UserType==Auth.UserType.ASTROLOGER)
        this.props.navigation.replace("ExpertHomeScreen");
      else if(resp.data.Profile.UserType==Auth.UserType.MANDIR_ADMIN || resp.data.Profile.UserType==Auth.UserType.MANDIR_SUBADMIN)
        this.props.navigation.replace("MandirHomeScreen");
      else if(resp.data.Profile.UserType==Auth.UserType.Vendor)
        this.props.navigation.replace("ChaiWalaHomeScreen");
    });
  }

  render() {
    const{screen, data}=this.props.route.params??{};
    return (
      this.state.loading ? <View style={{flex:1, justifyContent:"center"}}><ActivityIndicator color="#0000ff"/></View> :
      <SafeAreaView style={{flex:1}}>
        

        <ImageBackground style={{flex:1}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/original.png`}}>
        <ScrollView style={{flex:1}}>
        <View style={{ flex:1, minHeight:Dimensions.get("window").height, width:Dimensions.get("window").width}}>
            <View style={{flex:1, justifyContent:"center", alignItems:"center"}}>
              <Text style={{color:"#fff", fontSize:18, marginBottom:20}}>Enter OTP</Text>
              <Text style={{color:"#fff", fontSize:16, marginBottom:50, textAlign:"center"}}>We have shared OTP on your{'\n'}{data && data.RegistrationUsing=='Emaile' ? 'Email' : data.MobileNo} Enter to verify.</Text>
              <View style={{width:220, height:50, borderRadius:30, backgroundColor:"#fff", alignItems:"center", justifyContent:"center", marginBottom:20}}>
                  <TextInput autoFocus style={{width:220, height:50, color:"#000", paddingHorizontal:85}} keyboardType="number-pad" value={this.state.OTP} onChangeText={(text)=>this.setState({OTP:text})} placeholder="X X X X" placeholderTextColor={"#000"}/>
              </View>

<View style={{flexDirection:"row", alignItems:"center", alignItems:"center", justifyContent:"center", paddingHorizontal:20}}>
{
                this.state.otpResendCount<2 &&
                <View style={{flex:1, alignItems:"center", alignItems:"center", justifyContent:"center"}}>
                  {
                    this.state.timer>0 &&
                    <Text style={{color:"#fff", fontSize:16,marginBottom:15}}>00:{this.state.timer}</Text>
                    ||
                    <TouchableOpacity onPress={()=>this._resend()}>
                      <Text style={{color:"#fff", fontSize:18, textAlign:"center",marginBottom:15}}>RESEND OTP</Text>
                    </TouchableOpacity>
                  }
                </View>
              }
  <View style={{flex:1, alignItems:"center", justifyContent:"center"}}>
              <TouchableOpacity onPress={()=>this._submit()}>
                  <LinearGradient colors={["#FF8767", "#FF65A0"]} style={{borderRadius:30, width:160, marginBottom:20}}>
                      <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>VERIFY</Text>
                  </LinearGradient>
              </TouchableOpacity>
              </View>
              
</View>
              <TouchableOpacity onPress={()=> this.props.navigation.replace("LoginScreen")}>
                <Text style={{color:"#fff", fontSize:16, marginBottom:20}}>Use Another account</Text>
              </TouchableOpacity>
            </View>
        </View>
        </ScrollView>
        </ImageBackground>
        
      </SafeAreaView>
    );
  }
}
