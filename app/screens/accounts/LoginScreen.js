import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ActivityIndicator, Alert, Platform, ScrollView } from 'react-native';
import analytics from '@react-native-firebase/analytics';
import {Toast} from 'native-base';
import * as env from '../../../env';
import LinearGradient from 'react-native-linear-gradient';
import * as Api from '../../Api';
import * as Auth from '../../Auth';

import {SociaLoginButtons} from './SocialAuth';
import RNOtpVerify from 'react-native-otp-verify';
import {Singular, SingularConfig} from 'singular-react-native';
import * as Utility from '../../Functions';
import {Picker} from '../../controls/MyPicker';

export default class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      RegistrationUsing: "UserName"
    };
  }

  componentDidMount = () => {
    analytics().logEvent("Join_Us");
    Utility.CheckConnectivity("Please connect to WiFi or move to a better network coverage area and try login again...");
    this._unsubscribe1 = this.props.navigation.addListener('focus', () => {    
      Auth.Access_Token().then(resp=>{
        if(resp!=null && resp!=""){
          this.props.navigation.replace("AppStartScreen");
        }
      })
    });

    this._unsubscribe2 = this.props.navigation.addListener('blur', () => {
       
    });

    Api.GetAppSettingByKetService(Auth.AppSettingKey.Enable_Google_Login_Button).then(resp=>{
      console.log("Enable_Google_Login_Button",resp);
      this.setState({Enable_Google_Login_Button:resp.data=="True"})
    });

    
    console.log("SearchService req");
    var req={PageNo:1}
    Api.SearchServiceTmp(req).then(resp => {
      console.log("SearchService resp", resp);
      if (resp.ResponseCode == 200) {
        this.setState({ AstrologerList: resp.data});
      }
    });
  };

  componentWillUnmount = () => {
    this._unsubscribe1();
    this._unsubscribe2();
    //clearTimeout(this._timeOut)
  };

  // _submit = async () => {
  //   Utility.CheckConnectivity("Please connect to WiFi or move to a better network coverage area and try login again...");
  //   try{
  //     this._timeOut=setTimeout(() => {
  //       this.loginByOtp();
  //     }, 2000);

  //     this.setState({loading:true});
  //     var bureauReq={transactionId:Utility.guidGenerator(), mobile:"91"+this.state.UserName};
  //     console.log("bureauReq",bureauReq);
  //     var bureauResp=await Api.BureauAuthService(bureauReq)
  //     console.log("bureauResp", bureauResp);

  //     if(bureauResp!=null && bureauResp.token != null){
  //       var loginByOneClickReq={TransactionId:bureauReq.transactionId, Token:bureauResp.token, MobileNo:this.state.UserName};
  //       console.log("LoginByOneClickService req", loginByOneClickReq);
  //       Api.LoginByOneClickService(loginByOneClickReq).then(resp=>{
  //         console.log("LoginByOneClickService resp", resp);
  //         if(resp.ResponseCode==200){
  //           if(resp.ResponseMessage=="IS_NOT_VERIFIED")
  //             if(resp.data){
  //               this.createSession(resp);
  //             }
  //             else
  //               this.props.navigation.replace("SigninUpdateInfoScreen",{screen, data})
  //           else{
  //             this.createSession(resp);
  //           }
  //         }
  //         else{
  //           this.setState({loading:false});
  //           this.loginByOtp();
  //         }
  //       });
  //     }
  //     else{
  //       this.setState({loading:false});
  //       this.loginByOtp();
  //     }
  //   }
  //   catch{
  //     this.setState({loading:false});
  //     this.loginByOtp();
  //   }
  // }

  _submit = async() => {
    this.setState({loading:true});
    //clearTimeout(this._timeOut);
    Utility.CheckConnectivity("Please connect to WiFi or move to a better network coverage area and try login again...");

    const hash= Platform.OS=="android" ? await RNOtpVerify.getHash():"";

    console.log("hash", hash.toString());
    var req={...this.state, hash:hash.toString()};
    console.log("LoginByOtpService req", req);
    Api.LoginByOtpService(req).then(resp=>{
      console.log("LoginByOtpService resp", resp);
      if(resp.ResponseCode==200){
        this.props.navigation.replace("OTPScreen", {screen:"LoginScreen", data:resp.data});
      }
      else if(resp.ResponseCode==404 || resp.ResponseCode==100){
        this.props.navigation.replace("OTPScreen", {screen:"SigninScreen", data:resp.data});
      }
      else{
        // Toast.show({
        //   text:resp.ResponseMessage,
        //   type:"danger",
        //   duration:5000
        // })
        Alert.alert("", resp.ResponseMessage);
        this.setState({loading:false});
      }
    });
  }

  // createSession = (resp) =>{
  //   Singular.setCustomUserId(resp.data.Profile.UserId.toString());
  //   Singular.event("Login");

  //   Auth.Login({ access_token: resp.data.AccessToken, token_type:resp.data.TokenType, profile:resp.data.Profile }).then((loginResp)=>{
  //     if(resp.data.Profile.UserType==Auth.UserType.ENDUSER)
  //       this.props.navigation.replace("UserHomeScreen");
  //     else if(resp.data.Profile.UserType==Auth.UserType.ASTROLOGER)
  //       this.props.navigation.replace("ExpertHomeScreen");
  // });
  // }

  onTempAstroLogin = () => {
    var req={MobileNo:this.state.SelectedAstro.MobileNo}
    Api.TmpAstroLoginService(req).then(resp=>{
      console.log("ValidateOTPService resp", resp);
      if(resp.ResponseCode==200){
        Auth.Login({ access_token: resp.data.AccessToken, token_type:resp.data.TokenType, profile:resp.data.Profile }).then((loginResp)=>{
          if(resp.data.Profile.UserType==Auth.UserType.ENDUSER)
            this.props.navigation.replace("UserHomeScreen");
          else if(resp.data.Profile.UserType==Auth.UserType.ASTROLOGER)
            this.props.navigation.replace("ExpertHomeScreen");
          else if(resp.data.Profile.UserType==Auth.UserType.MANDIR_ADMIN || resp.data.Profile.UserType==Auth.UserType.MANDIR_SUBADMIN)
            this.props.navigation.replace("MandirHomeScreen");
        });
      }
      else{
        this.setState({loading:false});
        Alert.alert("", resp.ResponseMessage);
      }
    });
  }

  render() {
    return (
      
      <ScrollView style={{flex:1, backgroundColor:"#fff"}}>
          <View style={{marginTop:250, paddingHorizontal:30, justifyContent:"flex-end"}}>
            <View>
              <Text style={{marginBottom:10, fontSize:26 }}>Hi! Welcome!</Text>
              <Text style={{marginBottom:20}}>Join Us With Your Mobile Number</Text>

              <View style={{width:"100%",backgroundColor:"#F3F3F3", borderRadius:30, flexDirection:"row", marginBottom:20}}>
                  {/* <View style={{width:"60%", justifyContent:"center"}}>
                  {
                    this.state.RegistrationUsing == "MobileNo"?
                    <TextInput style={{ width:"100%", marginLeft: 20 }} value={this.state.MobileNo} onChangeText={(text)=> this.setState({MobileNo:text})} placeholder="Mobile No" />
                    :
                    <TextInput style={{ width:"100%", marginLeft: 20 }} value={this.state.Email} onChangeText={(text)=> this.setState({Email:text})} placeholder="Email Id" />
                  }
                  </View> */}
                  <View style={{width:"60%", height:50, justifyContent:"center"}}>
                    <TextInput style={{ width:"100%", height:50, marginLeft: 20 , color:"#000"}} keyboardType="number-pad" value={this.state.UserName} onChangeText={(text)=> this.setState({UserName:text})} placeholder="Mobile No." placeholderTextColor={"#000"}/>
                  </View>

                  <View style={{width:"40%", alignSelf:"flex-end", justifyContent:"center"}}>
                    <TouchableOpacity onPress={() => this._submit()}>
                        <LinearGradient colors={["#FF8767", "#FF65A0"]} style={{borderRadius:30, height:56, alignItems:"center", justifyContent:"center"}}>
                            {
                            this.state.loading && <ActivityIndicator color="#fff"/> ||
                            <Text style={{color:"#fff", fontSize:16}}>JOIN US</Text>
                            }
                        </LinearGradient>
                    </TouchableOpacity>
                  </View>
              </View>
              <View>
              {
                this.state.AstrologerList && 
                <View>
                  <Text>Temp Astro Join</Text>
                  <View style={{borderBottomWidth:1, borderColor:"#d5d5d5", width:"100%"}}>
                      <Picker style={{ height: 50, width: "100%" }} selectedValue={this.state.SelectedAstro} onValueChange={(value)=> this.setState({SelectedAstro:value})}>
                        {
                        this.state.AstrologerList.map((item, index)=> <Picker.Item label={item.Name} value={item} />)
                        }
                      </Picker> 
                      {
                          Platform.OS=="android" &&
                        <Text style={{width: '100%', height: 60, position: 'absolute', bottom: 0, left: 0}}>{' '}</Text>
                      }
                  </View>
                  <View style={{width:"40%", alignSelf:"center", marginTop:20, justifyContent:"center"}}>
                    <TouchableOpacity onPress={() => this.onTempAstroLogin()}>
                        <LinearGradient colors={["#FF8767", "#FF65A0"]} style={{borderRadius:30}}>
                            <Text style={{color:"#fff", padding:20, fontSize:16, textAlign:"center"}}>JOIN NOW</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              }
              </View>
            </View>
              {/* <TouchableOpacity onPress={() => this.setState({ RegistrationUsing: this.state.RegistrationUsing == "MobileNo" ? "Email" : "MobileNo" })}>
                <Text style={{marginBottom:50}}>Or <Text style={{textDecorationLine:"underline", color:"#656565"}}>Use {this.state.RegistrationUsing == "MobileNo" ?  "email":"phone no"} instead.</Text></Text>
              </TouchableOpacity>

              <View style={{flexDirection:"row"}}>
                <Text>New to SelectAstro?</Text>
                <TouchableOpacity onPress={()=> this.props.navigation.replace("SigninScreen")}>
                    <Text style={{color:"#FF6B97", textDecorationLine:"underline", marginLeft:20}}>Register</Text>
                </TouchableOpacity>
              </View> */}
          </View>
         
          {
            this.state.Enable_Google_Login_Button &&
            <View style={{flex:1.5, margin:30}}>
              <SociaLoginButtons {...this.props}/>
            </View>
            ||
            <View style={{flex:.5, backgroundColor:"#fff"}}>
               
            </View>
          }
         

           {/* <TouchableOpacity onPress={()=> this.props.navigation.navigate("SigninUpdateInfoScreen", {screen:"", data:{}})}>
             <Text>reg</Text>
           </TouchableOpacity> */}
      </ScrollView> 
    );
  }
}
