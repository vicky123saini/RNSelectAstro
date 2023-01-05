import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, ImageBackground, Dimensions, ActivityIndicator, StyleSheet, TextInput, Alert, Platform } from 'react-native';
import { ReviewView } from '../../controls/ExpertControls';
import {CheckBox} from 'react-native-elements';
import MainStyles from '../../Styles';
import Html from 'react-native-render-html';
import {FeedbackForm, LessThen60Popup, NotConnectPopup} from '../../controls/ExpertControls';
import {mountHeaderBalanceRefresh} from '../../Functions';
import analytics from '@react-native-firebase/analytics';
import * as UserControls from './Controls';
import * as env from '../../../env';
import * as Api from '../../Api';
import * as Auth from '../../Auth';
import LinearGradient from 'react-native-linear-gradient';
import Stars from 'react-native-stars';
import Overlay from 'react-native-modal-overlay';
import BackgroundTimer from 'react-native-background-timer';
import {Card, CardItem} from 'native-base';
import KeepAwake from 'react-native-keep-awake';
import {Singular} from 'singular-react-native';
import * as Utility from '../../Functions';
import {Autocomplete} from '../../controls/MyAutocomplete';
//import { Picker, DatePicker } from 'react-native-wheel-datepicker';
import { DatePicker } from '../../controls/MyDatePicker';
import moment from 'moment';

export default class ExpertDetailsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showMessageBox: false,
            step:1,
            callWaitingTime:120
        };
        //this.bindData=this.bindData.bind();
    }

    componentDidMount = async () => {
        const { Id } = this.props.route.params;
        
        Utility.CheckConnectivity("Please connect to WiFi or move to a better network coverage area and try again...");
        KeepAwake.activate();
        analytics().logEvent("Astrloger_Detail");
        Auth.getProfie().then(Profile=> this.setState({Profile:JSON.parse(Profile)})).catch(()=> console.error("err componentDidMount expertDetails"));
        this.bindData();
        
        this._unsubscribe1 = this.props.navigation.addListener('focus', () => {    
            this.bindTimer();
        });
    
        this._unsubscribe2 = this.props.navigation.addListener('blur', () => {
        clearInterval(this._interval);
        this._interval=null;
        });
    };
    
    componentWillUnmount = () => {
        KeepAwake.deactivate();
        this.clear();
        this._unsubscribe1();
        this._unsubscribe2();
    };

    bindTimer = () => {
        this._interval=setInterval(() => {
            console.log("Interval", 9001); 
            this.bindData()
        }, 15000);
    }

    
     
    
      bindData = () => {
        
        console.log("bindData");
        
        if(this.state.updateMoibleNoPopup)return false;
        const { Id } = this.props.route.params;

        Api.GetAstrologerDetailsByIdService(Id).then(resp => {
            //console.log("GetAstrologerDetailsByIdService resp", resp);
            if (resp.ResponseCode == 200) {
                this.setState({ Astrologer: resp.data });
                this.props.navigation.setOptions({ title: resp.data.Name });
                if(resp.data.FeedbackId){
                    if(resp.data.isLess60SecCall)
                        this.setState({isLess60SecCall:true});
                    else
                        this.setState({FeedbackId:resp.data.FeedbackId, showMessageBox:false, message_html:null, message:null, waitForAstResp:null });
                }
                else if(this.state.waitForAstResp && resp.data.IsCallService && this.state.serviceType==Auth.CallDetail_ServiceType.VOICE_CALL){
                    this.setState({ isNotConnectPopup:true });
                }
            }
        });

        mountHeaderBalanceRefresh();
      }

      clear = () => {
        try{
            //clearInterval(this._interval);//because back navigation
            clearInterval(this.intervalCallDetail);
            BackgroundTimer.clearInterval(this.interval_BG);
            this.setState({SessionId: null, message:null, message_html:null});
        }
        catch(e){

        }
      }

      updateMoibleNoPopuponClose = () =>{
        this.setState({updateMoibleNoPopup:false});
      }
    
       
      updateMoibleNoPopup_submit = () =>{
        var req = {MobileNo:this.state.MobileNo, OTP: this.state.OTP}
        console.log("UpdateMobileNoService req", req);
        Api.UpdateMobileNoService(req)
        .then(resp=>{
          console.log("UpdateMobileNoService resp", resp);
          if(resp.ResponseCode==200){
            if(this.state.step==1){
              this.setState({otpViewShow:true, step:2});
            }
            else{
              Auth.UpdateMobileno(this.state.MobileNo).then(()=>{
                var Profile=JSON.parse(JSON.stringify(this.state.Profile));
                Profile.MobileNo=this.state.MobileNo;
      
                this.setState({Profile, updateMoibleNoPopup:false});
                alert("Mobile no updated successfully!");
              })
              .catch(()=> console.error("err UpdateMobileno expertDetailsScreen"));
            }
          }
          else{ 
            // Toast.show({
            //   text:resp.ResponseMessage,
            //   type:"danger",
            //   duration:5000
            // });
            Alert.alert("", resp.ResponseMessage);
          }
        })
      }

    initCallIfProfileUpdateSkip = () => {
        this.initCallEv({skypUpdateProfile:true});
    }

    _InitCall = async() => {
        const IsMobileNoUpdated=await this.checkMobileNoUpdated();
        if(!IsMobileNoUpdated) {
            return false;
        }

        const profileData=await this.checkIsProfilePopup(this._InitCall.bind());
        if(!profileData){
            return false
        }
        
        //console.log("done********");
        //return false;
        this.initAllBegin("Call");
        Utility.CheckConnectivity("Please connect to WiFi or move to a better network coverage area and try again...");
        this.initCallEv();
    }

    initCallEv = async(prop) => {
        const profile=await Auth.getProfie().then(resp=>JSON.parse(resp)).catch(()=> console.error("err getProfie expertDetailsScreen"));
 
        if(!(this.state.Astrologer && this.state.Astrologer.IsAvailable && this.state.Astrologer.IsCallService)) return;

        const { Id } = this.props.route.params;
        var req = { ToUserId: Id };
        console.log("InitCallService req", req);

        if(global.WalletDetails!=null && global.WalletDetails.Balance!=0 && !profile.Name){
            console.log("stp1", prop);
            if(prop==null || prop.skypUpdateProfile==null || prop.skypUpdateProfile==false){
                console.log("stp2 rtn");
                this.props.navigation.navigate("UpdateUserProfile", {initCallIfProfileUpdateSkip:this.initCallIfProfileUpdateSkip.bind()});
                return;
            }
        }

        Api.InitCallService(req).then(resp => {
            console.log("InitCallService resp", JSON.stringify(resp));

            if(resp.data && resp.data.combindMessage){
                this.setState({ showMessageBox: true, message_html: resp.data.combindMessage, message:null, code:resp.ResponseCode, timerEnable:true, callWaitingTime:180, serviceType:Auth.CallDetail_ServiceType.VOICE_CALL });//410=Low Balance
            }
            else{
                this.setState({ showMessageBox: true, message_html:null, message: resp.ResponseMessage, code:resp.ResponseCode });//410=Low Balance
            }

            if(resp.ResponseCode!=410){

            }
            
            if(resp.ResponseCode==200){
                
                this.setState({callDetails_Id:resp.data.callDetails_Id});
                this.enableBackTimer();

                this.intervalCallDetail=setInterval(() => {
                    console.log("Interval", 9002);
                    if(this.state.callDetails_Id){
                        console.log("GetCallStatusByIdService req", this.state.callDetails_Id);
                        Api.GetCallStatusByIdService(this.state.callDetails_Id).then(resp2=>{
                            console.log("GetCallStatusByIdService resp", resp2);
                            if(resp2.ResponseCode==200){
                                mountHeaderBalanceRefresh();
                                if(resp2.data.Status==Auth.CallDetail_Status.COMPLETED && resp2.data.isLess60SecCall==true){
                                    this.setState({isLess60SecCall:true, showMessageBox:false, message:null});
                                    BackgroundTimer.clearInterval(this.interval_BG);
                                    clearInterval(this.intervalCallDetail);
                                }
                                else if(resp2.data.Status==Auth.CallDetail_Status.COMPLETED){
                                    this.setState({FeedbackId:resp2.data.FeedbackId, showMessageBox:false, message:null });
                                    BackgroundTimer.clearInterval(this.interval_BG);
                                    clearInterval(this.intervalCallDetail);
                                }
                                else if(resp2.data.Status==Auth.CallDetail_Status.FAILED || resp2.data.Status==Auth.CallDetail_Status.NO_ANSWER){
                                    this.setState({isNotConnectPopup:true, showMessageBox:false, message:null });
                                    BackgroundTimer.clearInterval(this.interval_BG);
                                    clearInterval(this.intervalCallDetail);
                                }
                            }
                        });
                    }
                }, 3000);

                
            }

            // Alert.alert(
            //     "Alert",
            //     resp.ResponseMessage,
            //     [
            //         { text: "OK", onPress: () => console.log("OK Pressed") }
            //     ]
            // );
        });
    }

    _InitChat = async() =>{
        const IsMobileNoUpdated=await this.checkMobileNoUpdated();
        if(!IsMobileNoUpdated) {
            return false;
        }

        const profileData=await this.checkIsProfilePopup(this._InitChat.bind());
        if(!profileData){
            return false
        }

        this.initAllBegin("Chat");
        Utility.CheckConnectivity("Please connect to WiFi or move to a better network coverage area and try again...");
        //if(!(this.state.Astrologer && this.state.Astrologer.IsAvailable && this.state.Astrologer.IsChatService)) return;
        const { Id } = this.props.route.params;
        var req = { ToUserId: Id };
        console.log("InitCallService req", req);
         
        Api.InitChatService(req).then(resp=>{
            console.log("InitCallService resp", resp);
            //this.setState({ showMessageBox: true, message: resp.ResponseMessage, code:resp.ResponseCode });
            if(resp.data && resp.data.combindMessage){
                this.setState({ showMessageBox: true, message_html: resp.data.combindMessage, message:null, code:resp.ResponseCode, timerEnable:true, callWaitingTime:120 });//410=Low Balance
            }
            else{
                this.setState({ showMessageBox: true, message_html:null, message: resp.ResponseMessage, code:resp.ResponseCode });//410=Low Balance
            }

            if(resp.ResponseCode==200){
                this.setState({SessionId:resp.data.SessionId, serviceType:Auth.CallDetail_ServiceType.CHAT})
                this.enableBackTimer();
            }
        });
    }

    _InitVideoCall = async() =>{
        const IsMobileNoUpdated=await this.checkMobileNoUpdated();
        if(!IsMobileNoUpdated) {
            return false;
        }

        const profileData=await this.checkIsProfilePopup(this._InitVideoCall.bind());
        if(!profileData){
            return false
        }

        this.initAllBegin("Video");
        Utility.CheckConnectivity("Please connect to WiFi or move to a better network coverage area and try again...");
        //if(!(this.state.Astrologer && this.state.Astrologer.IsAvailable && this.state.Astrologer.IsChatService)) return;
        const { Id } = this.props.route.params;
        var req = { ToUserId: Id };
        console.log("InitVideoCallService req", req);
        Api.InitVideoCallService(req).then(resp=>{
            console.log("InitVideoCallService resp", resp);
            //this.setState({ showMessageBox: true, message: resp.ResponseMessage, code:resp.ResponseCode });
            if(resp.data && resp.data.combindMessage){
                this.setState({ showMessageBox: true, message_html: resp.data.combindMessage, message:null, code:resp.ResponseCode, timerEnable:true, callWaitingTime:180 });//410=Low Balance
            }
            else{
                this.setState({ showMessageBox: true, message_html:null, message: resp.ResponseMessage, code:resp.ResponseCode });//410=Low Balance
            }

            if(resp.ResponseCode==200){
                this.setState({SessionId:resp.data.SessionId, serviceType:Auth.CallDetail_ServiceType.VIDEO_CALL})
                this.enableBackTimer();
            }
        });
    }

    enableBackTimer = () => {
        //var tt=this;
        this.interval_BG=BackgroundTimer.setInterval(() => {
            console.log("Interval", 9003);
            console.log("this.state.callWaitingTime", this.state.callWaitingTime)
            if(this.state.callWaitingTime!=null){
                if(this.state.callWaitingTime>0){
                    this.setState(prevState=>({callWaitingTime:prevState.callWaitingTime-1}));
                }
                else{
                    this.setState({showMessageBox:false, message:null, message_html:null, code:null, timerEnable:null, isNotConnectPopup:true});
                    BackgroundTimer.clearInterval(this.interval_BG);
                }
            }


            //wait for expert accept chat
            if(!this.loading){
                this.loading=true;
                if(this.state.SessionId && this.state.serviceType==Auth.CallDetail_ServiceType.CHAT){
                    console.log("GetChatCurrentStatusService req", this.state.SessionId)
                    Api.GetChatCurrentStatusService(this.state.SessionId).then(resp=>{
                        console.log("GetChatCurrentStatusService resp", resp)
                        if (resp.ResponseCode == 200) {
                            let SessionId = this.state.SessionId;
                            if(resp.data.Status == Auth.CallDetail_Status.IN_PROCESS){
                                
                                this.setState({SessionId: null, showMessageBox:false, message:null, message_html:null, code:null, timerEnable:false, callWaitingTime:null});
                                this.clear();
                                this.props.navigation.navigate("ChatScreen", {Id:SessionId, ViewOnly:false});
                                this.setState({loadingS:false});
                            }
                        }
                        this.loading=false;
                    });
                }
                if(this.state.SessionId && this.state.serviceType==Auth.CallDetail_ServiceType.VIDEO_CALL){
                    console.log("GetVideoCallCurrentStatusService req", this.state.SessionId)
                    Api.GetVideoCallCurrentStatusService(this.state.SessionId).then(resp=>{
                        console.log("GetVideoCallCurrentStatusService resp", resp)
                        if (resp.ResponseCode == 200) {
                            let SessionId = this.state.SessionId;
                            if(resp.data.Status == Auth.CallDetail_Status.IN_PROCESS){
                                
                                this.setState({SessionId: null, showMessageBox:false, message:null, message_html:null, code:null, timerEnable:false, callWaitingTime:null});
                                this.clear();
                                this.setState({ isNotConnectPopup:false });
                                this.props.navigation.navigate("VideoCallScreen", {Id:SessionId});
                                
                            }
                        }
                        this.loading=false;
                    });
                }
            }

        }, 1000);
    }

    _setBookmark = () => {
        const { Id } = this.props.route.params;
        this.setState({ bookmarkingLoading: true });
        var req = { CreatedForUserId: this.state.Astrologer.UserId, IsBookmark: !this.state.Astrologer.IsBookmarked };
        console.log("SetBookmarkService req", req);
        Api.SetBookmarkService(req).then(resp => {
            console.log("SetBookmarkService resp", resp);
            if (resp.ResponseCode == 200) {
                var Astrologer = { ...this.state.Astrologer };
                Astrologer.IsBookmarked = !this.state.Astrologer.IsBookmarked;
                this.setState({ Astrologer, bookmarkingLoading: false });
                if(req.IsBookmark)this.setState({ showBookmarkDoneMessage:true });
            }
        });
    }

    onNotifyMePress = () => {
        this.setState({ notifyMeLoading: true });
        var req = { CreatedForUserId: this.state.Astrologer.UserId, IsNotifyMe:true };
        console.log("SetNotifyMeService req", req);
        Api.SetNotifyMeService(req).then(resp => {
            console.log("SetNotifyMeService resp", resp);
            if (resp.ResponseCode == 200) {
                this.setState(prevState => ({ Astrologer:{...prevState.Astrologer, isNotifyOn:true}, notifyMeLoading: false }));
            }
        });
    }

    onClose = () => {
        this.setState({ showMessageBox: false, message: null, message_html:null });
    }

    initAllBegin = (serviceType) => {
        const { Id } = this.props.route.params;
    }

    checkMobileNoUpdated = async () => {
        const IsMobileNoUpdated = await Api.GetEnduserProfileService().then(resp=>{
            if (resp.ResponseCode == 200) {
              if(resp.data.MobileNo == null || resp.data.MobileNo == ""){
                this.setState({updateMoibleNoPopup:true});
                return false;
              }
              return true;
            }
            return false;
          });
          return IsMobileNoUpdated;
    }

    checkIsProfilePopup = async (event) => {
        var profileData = await Api.GetEnduserProfileService().then(resp => resp.data);
        console.log("GetEnduserProfileService resp", profileData);

        if(!profileData.IsProfilePopup && !this.state.isProfilePopupOpenedForThisSession){

            if(profileData.DateOfBirth){
                profileData.DateOfBirth_Date=new Date(profileData.DateOfBirth);
            }
            if(profileData.TimeOfBirth){
                try{
                    var tdate=moment(profileData.TimeOfBirth, "HH:mm:00").format();
                    profileData.TimeOfBirth_Date=new Date(tdate);
                }
                catch{}
            }

            console.log("profileData", profileData)

            this.setState({viewProfilePopup:true, isProfilePopupOpenedForThisSession:true, profileData:profileData, postProfileOpenedEvent:event});
            return false;
        }
        return true;
    }

    onConfirmUpdateProfile = () => {
        var body=this.state.profileData;
        Api.ConfirmProfileDetailsService(body).then(resp=>{
            console.log("ConfirmProfileDetailsService resp", resp);
            if(resp.ResponseCode==200){
                Auth.Login({ access_token: resp.data.AccessToken, token_type:resp.data.TokenType, profile:resp.data.Profile }).then(()=>{
                    this.setState({viewProfilePopup:false, profileData:null});
                    this.state.postProfileOpenedEvent();
                });
            }
            else{
                this.setState({loading:false}, ()=>
                    Toast.show({
                        text:resp.ResponseMessage,
                        type:"danger",
                        duration:5000
                    })
                );
            }
        });
    }

    onSkipConfirmUpdateProfile = () => {
        this.setState({viewProfilePopup:false, profileData:null})
    }

    onChangePlaceOfBirth = (text) => {
        //this.setState({PlaceOfBirth:text});
        this.setState(prevState=>({profileData:{...prevState.profileData, PlaceOfBirth:text}}));

      setTimeout(() => {
          console.log(this.state.profileData.PlaceOfBirth)
          // Send Axios request here
          if(this.state.profileData.PlaceOfBirth!=null && this.state.profileData.PlaceOfBirth.length>0){
            Api.GetLocationSuggestionService(this.state.profileData.PlaceOfBirth).then(resp=>{
              console.log("GetLocationSuggestionService resp", resp);
              if(resp.ResponseCode==200){
                this.setState(prevState=>({profileData:{...prevState.profileData, LocationSuggestion:resp.data}}));
              }
            });
          }
        }, 3000)
    }

    render() {
        
        return (
            this.state.Astrologer &&
            
            <View style={[{ flex: 1, backgroundColor: "#000000E8" }, Platform.OS=="ios" && {marginTop:40}]}>
                 <KeepAwake />
   
                <UserControls.Header {...this.props} title={this.state.Astrologer.Name} shareText={this.state.Astrologer.ShareText} Astrologer={this.state.Astrologer}/>
                {
                    this.state.isNotConnectPopup && <NotConnectPopup serviceType={this.state.serviceType} onClose={()=>this.setState({isNotConnectPopup:false})} /> ||
                    this.state.isLess60SecCall && <LessThen60Popup serviceType={this.state.serviceType} onClose={()=> this.setState({isLess60SecCall:false},()=>{this.props.navigation.navigate("ExpertListScreen")})}/> ||
                    this.state.FeedbackId && <FeedbackForm feedbackId={this.state.FeedbackId} onClose={()=> this.setState({FeedbackId:null})} onSubmit={(Rating)=> { if(Rating<4)this.props.navigation.navigate("UserFeedbackScreen"); this.setState({FeedbackId:null}); }}/>
                }

                <Overlay childrenWrapperStyle={{borderRadius:30}} visible={this.state.updateMoibleNoPopup} onClose={this.updateMoibleNoPopuponClose} closeOnTouchOutside>
                <ImageBackground style={{width:"100%", height:300}} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/bg-popup.png` }}>
          <View style={{width:"90%"}}>
            <Text style={Styles.pageTitle}>Update your mobile no</Text>
            {
              this.state.otpViewShow && 
              <View>
                <Text style={Styles.label}>OTP</Text>
                <View style={Styles.textInput}>
                    <TextInput style={{width:"100%", color:"#000"}} value={this.state.OTP} onChangeText={(text)=> this.setState({OTP:text})} placeholder="OTP"/>
                </View>
              </View>
            ||
            <View>
              <Text style={Styles.label}>Mobile No</Text>
              <View style={Styles.textInput}>
                  <TextInput style={{width:"100%", color:"#000"}} value={this.state.MobileNo} onChangeText={(text)=> this.setState({MobileNo:text})} placeholder="MobileNo"/>
              </View>
            </View>
            }
            

            <View style={{width:"100%", marginTop:20, alignItems:"center", alignContent:"center", justifyContent:"center"}}>

            {
            this.state.loading ?
            <TouchableOpacity>
                <LinearGradient colors={["#FF8767", "#FF65A0"]} style={{borderRadius:30, width:150, marginBottom:20}}>
                    <View style={{padding:15}}>
                    <ActivityIndicator color="#0000ff"/>
                    </View>
                </LinearGradient>
            </TouchableOpacity>
            :
            <TouchableOpacity onPress={()=>this.updateMoibleNoPopup_submit()}>
                <LinearGradient colors={["#FF8767", "#FF65A0"]} style={{borderRadius:30, width:150, marginBottom:20}}>
                    <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>SAVE</Text>
                </LinearGradient>
            </TouchableOpacity>
        }

            </View>
             
          </View>
          </ImageBackground>
        </Overlay>


        <Overlay childrenWrapperStyle={{ borderRadius: 30 }} visible={this.state.showMessageBox} /*onClose={this.onClose} closeOnTouchOutside*/>
            <ImageBackground style={{width:"100%", height:400}} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/bg-popup.png` }}>
            <View style={{ padding: 20, alignContent: "center", alignItems: "center", justifyContent: "center" }}>
                <Image style={{ width: "100%", height: 140, marginBottom: 20, borderRadius: 70 }} resizeMode="center" source={{ uri: `${env.DynamicAssetsBaseURL}${this.state.Astrologer.ProfileImage}` }} />
                {
                    this.state.message && <Text style={[MainStyles.Text, { marginBottom: 20 }]}>{this.state.message}</Text>
                    ||
                    this.state.message_html && 
                    <Html
                        contentWidth={Dimensions.get("window").width}
                        source={{html:this.state.message_html}}
                    />
                } 
                 
                
                {
                    this.state.code !=null && this.state.code==410 &&
                    <>
                    <TouchableOpacity onPress={()=>{this.onClose(); this.props.navigation.navigate("WalletScreen");}}>
                        <LinearGradient colors={["#FF8767", "#FF65A0"]} style={{borderRadius:30, width:220, marginBottom:20}}>
                            <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>Recharge Now</Text>
                        </LinearGradient>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={this.onClose}>
                        <Text style={{color:"#000", padding:15, fontSize:16, fontWeight:"bold", textAlign:"center", textDecorationLine:"underline", alignSelf:"flex-end"}}>Later</Text>
                    </TouchableOpacity>
                    </>
                    ||
                    this.state.code==417 &&
                    <TouchableOpacity onPress={()=>this.onClose()}>
                        <LinearGradient colors={["#FF8767", "#FF65A0"]} style={{borderRadius:30, width:220, marginBottom:20}}>
                            <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>Ok</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                }
                {
                    this.state.timerEnable && this.state.code !=null && this.state.code==200 &&
                    <View>
                        <View style={{flexDirection:"row"}}>
                            <LinearGradient colors={["#FB6F8F", "#FC826E"]} style={{borderRadius:10, width:29, height:35, margin:2}}>
                                <Text style={{color:"#fff", fontSize:21, fontWeight:"700", textAlign:"center", height:35, textAlignVertical:"center"}}>0</Text>
                            </LinearGradient>
                            <LinearGradient colors={["#FB6F8F", "#FC826E"]} style={{borderRadius:10, width:29, height:35, margin:2}}>
                                <Text style={{color:"#fff", fontSize:21, fontWeight:"700", textAlign:"center", height:35, textAlignVertical:"center"}}>{parseInt(this.state.callWaitingTime/60)}</Text>
                            </LinearGradient>

                            <Text style={{fontSize:21, fontWeight:"700", textAlign:"center", height:35, textAlignVertical:"center", marginHorizontal:12}}>:</Text>

                            <LinearGradient colors={["#FB6F8F", "#FC826E"]} style={{borderRadius:10, width:29, height:35, margin:2}}>
                                <Text style={{color:"#fff", fontSize:21, fontWeight:"700", textAlign:"center", height:35, textAlignVertical:"center"}}>{parseInt((this.state.callWaitingTime%60)/10)}</Text>
                            </LinearGradient>
                            <LinearGradient colors={["#FB6F8F", "#FC826E"]} style={{borderRadius:10, width:29, height:35, margin:2}}>
                                <Text style={{color:"#fff", fontSize:21, fontWeight:"700", textAlign:"center", height:35, textAlignVertical:"center"}}>{parseInt(this.state.callWaitingTime%60%10)}</Text>
                            </LinearGradient>
                        </View>
                        <View style={{flexDirection:"row", alignContent:"space-around", alignItems:"center", justifyContent:"space-around"}}>
                            <Text style={{fontSize:9, paddingRight:10}}>minutes</Text>
                            <Text style={{fontSize:9, paddingLeft:10}}>seconds</Text>
                        </View>
                    </View>
                }
                {/* <Text style={[MainStyles.Text,{marginBottom:20}]}>Hello vikas saini, Connecting you to praveen kumar.{'\n\n'}Call charges are ₹40/- per minute, your current balance is ₹400/- and you can take for 10 minutes.</Text> */}
            </View>
            </ImageBackground>
        </Overlay>

        <Overlay childrenWrapperStyle={{ borderRadius: 30 }} visible={this.state.showBookmarkDoneMessage} onClose={()=> this.setState({showBookmarkDoneMessage:false})} closeOnTouchOutside>
            <ImageBackground style={{width:"100%", height:200}} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/bg-popup.png` }}>
                <View style={{ padding: 20, alignItems:"center", justifyContent: "center" }}>
                    <Text style={[MainStyles.Text, { marginBottom: 20, fontWeight:"bold" }]}>You started following {this.state.Astrologer.Name}</Text>
                    <Text style={[MainStyles.Text, { marginBottom: 20 }]}>You will be notified when astrologer is available next.</Text>
                    <View style={{alignItems:"center", alignContent:"center"}}>
                        <TouchableOpacity onPress={()=>this.setState({showBookmarkDoneMessage:false})}>
                            <LinearGradient colors={["#FF8767", "#FF65A0"]} style={{borderRadius:30, width:220, marginBottom:20}}>
                                <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>Ok</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View> 
            </ImageBackground>
        </Overlay>

{
    this.state.profileData &&

        <Overlay childrenWrapperStyle={{ borderRadius: 30 }} visible={this.state.viewProfilePopup}>
             
        <TouchableOpacity style={{position:"absolute", right:10, top:10}}  onPress={()=>this.onSkipConfirmUpdateProfile()}>
        <Image style={{width:31, height:36 }} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/close-x.png`}}/>
        </TouchableOpacity>

        <ScrollView style={{width:"100%", height:560}} showsVerticalScrollIndicator={false}>
           
        <View style={{alignItems:"center", justifyContent:"center", marginBottom:10}}><Text style={[Styles.label,{fontWeight:"bold"}]}>Please re-confirm your detail</Text></View>

        <Text style={Styles.label}>Gender</Text>
        <View style={{flexDirection:"row", width:"100%", justifyContent:"space-between", marginBottom:20}}>
            <TouchableOpacity onPress={()=> this.setState(prevState=>({profileData:{...prevState.profileData, Gender:"Male"}}))}>
                <View style={[Styles.selectButton, this.state.profileData.Gender=="Male" && Styles.selectedButton]}>
                    <Image style={{width:22, height:33, marginLeft:22}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/man.png`}}/>
                    <Text style={[MainStyles.text, {marginLeft:16}]}>Male</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=> this.setState(prevState=>({profileData:{...prevState.profileData, Gender:"Female"}}))}>
                <View style={[Styles.selectButton, this.state.profileData.Gender=="Female" && Styles.selectedButton]}>
                    <Image style={{width:22, height:33, marginLeft:22}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/woman.png`}}/>
                    <Text style={[MainStyles.text, {marginLeft:16}]}>Female</Text>
                </View>
            </TouchableOpacity>
        </View>

        <Text style={Styles.label}>Name</Text>
        <View style={Styles.textInput}>
            <TextInput style={{width:"100%", color:"#000"}} value={this.state.profileData.Name} onChangeText={(text)=> this.setState(prevState=>({profileData:{...prevState.profileData,Name:text}}))} placeholder="Name"/>
        </View>

        <Text style={Styles.label}>Date of Birth</Text> 
        <TouchableOpacity onPress={()=> this.setState(prevState=>({profileData:{...prevState.profileData,showDate:true}}))}>
            <View style={[Styles.textInput, {height:50}]}>
                <Text>{this.state.profileData.DateOfBirth_Date==null?"DD-MM-YYYY":moment(this.state.profileData.DateOfBirth_Date).format("DD-MM-YYYY")}</Text>
                <Image style={{width:23, height:23, marginRight:20}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/calendar.png`}}/>
            </View>
        </TouchableOpacity>
        {
        this.state.profileData.showDate &&
        
        
        <DatePicker
        date={this.state.profileData.DateOfBirth_Date} 
        minimumDate={new Date(1921,1,1)}
        maximumDate={new Date()} 
        mode="date"
        onDateChange={(selectedDate)=> this.setState(prevState=>({profileData:{...prevState.profileData,DateOfBirth_Date:selectedDate, showDate:false}}))}
        />
        // <TouchableOpacity onPress={()=>this.setState(prevState=>({profileData:{...prevState.profileData,showDate:false}}))}>{/*/LanguageChoiseScreen*/}
        //     <LinearGradient colors={["#7162FC", "#B542F2"]} style={{borderRadius:30, width:150, marginBottom:20, marginTop:10, alignSelf:"center"}}>
        //         <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>OK</Text>
        //     </LinearGradient>
        // </TouchableOpacity>
         
        }

        <Text style={Styles.label}>City of Birth</Text>
 
        <View style={{flex:1, marginBottom:20}}>
            <Autocomplete 
                data={this.state.profileData.LocationSuggestion}
                value={this.state.profileData.PlaceOfBirth}
                onChangeText={(text) => this.onChangePlaceOfBirth(text)}
            />
        </View>

        <Text style={Styles.label}>Time of Birth</Text>
        
        <TouchableOpacity onPress={()=> this.setState(prevState=>({profileData:{...prevState.profileData,showTime:true}}))}>
            <View style={[Styles.textInput, {height:50}]}>
                <Text>{this.state.profileData.TimeOfBirth_Date==null?"HH:MM":moment(this.state.profileData.TimeOfBirth_Date).format("HH:mm")}</Text>
                <Image style={{width:23, height:23, marginRight:20}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/clock.png`}}/>
            </View>
        </TouchableOpacity>
        {
            this.state.profileData.showTime &&
            
             
            <DatePicker
            date={this.state.profileData.TimeOfBirth_Date} 
            mode="time"
            onDateChange={(selectedDate)=> this.setState(prevState=>({profileData:{...prevState.profileData,TimeOfBirth_Date:selectedDate, showTime:false}}))}
            />
            // <TouchableOpacity onPress={()=>this.setState(prevState=>({profileData:{...prevState.profileData,showTime:false}}))}>{/*/LanguageChoiseScreen*/}
            //     <LinearGradient colors={["#7162FC", "#B542F2"]} style={{borderRadius:30, width:150, marginBottom:20, marginTop:10, alignSelf:"center"}}>
            //         <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>OK</Text>
            //     </LinearGradient>
            // </TouchableOpacity>
            
        }

            
            <View style={{flexDirection:"row", alignItems:"center"}}>
                <CheckBox
                    containerStyle={{padding:0, margin:0}}
                    checkedIcon={<Image style={{width:20, height:20 }} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/icons/ic_tick_s_1_mdpi.png`}}/>}
                    uncheckedIcon={<Image style={{width:20, height:20 }} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/icons/ic_tick_s_0_mdpi.png`}}/>}
                    checked={this.state.profileData.IsProfilePopup}
                    onPress={()=> this.setState(privState=>({profileData:{...privState.profileData, IsProfilePopup:!privState.profileData.IsProfilePopup}}))}
                    />
                <Text>Do not show again</Text>
            </View>
 

        <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between", marginTop:10}}>

            <TouchableOpacity onPress={()=>this.onSkipConfirmUpdateProfile()}>
                <LinearGradient colors={["#d5d5d5", "#d5d5d5"]} style={{borderRadius:30, width:120, marginBottom:15}}>
                    <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>Back</Text>
                </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>!this.state.profileData.loading && this.onConfirmUpdateProfile()}>
                <LinearGradient colors={["#FF8767", "#FF65A0"]} style={{borderRadius:30, width:120, marginBottom:15}}>
                    {
                        this.state.profileData.loading ?
                        <View style={{padding:15}}>
                            <ActivityIndicator color="#0000ff"/>
                            </View>
                            :
                        <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>Confirm</Text>
                    }
                </LinearGradient>
            </TouchableOpacity>
        </View>

             
            </ScrollView>
        </Overlay>
    }

        <View style={{ width: "100%", height: Dimensions.get("window").height - 60 }}>
            <ImageBackground style={{ position: "absolute", top: 0, left: 0, width: "100%", height: 400, borderTopLeftRadius: 10, borderTopRightRadius: 10, zIndex: -1 }} resizeMode="cover" source={{ uri: `${env.DynamicAssetsBaseURL}${this.state.Astrologer.ProfileImage}` }} />

            <ScrollView nestedScrollEnabled={true} style={{ position: "absolute", top: 0, left: 0, right: 0, height: Dimensions.get("window").height - 60, backgroundColor: "transparent" }}>
                <View style={{ height: 300 }}></View>

                <LinearGradient colors={["transparent", "#000000C8", "#000000ED", "#000000E8"]} style={{ width: "100%", height: 100, justifyContent: "flex-end", paddingBottom: 10 }}>
                    <View style={{ paddingHorizontal: 5, flexDirection: "row", width: "100%", height: 24 }}>
                        <View style={{ flexDirection: "row" }}>
                            <Stars
                                display={this.state.Astrologer.TotalRating}
                                spacing={8}
                                count={5}
                                starSize={20}
                                fullStar={{ uri: `${env.AssetsBaseURL}/assets/images/star-active.png` }}
                                emptyStar={{ uri: `${env.AssetsBaseURL}/assets/images/star.png` }}
                                halfStar={{ uri: `${env.AssetsBaseURL}/assets/images/star-half.png` }}
                            />
                            <Text style={[MainStyles.text, { color: "#fff", marginLeft: 5, paddingTop: 2, fontSize: 18 }]}>{this.state.Astrologer.TotalRating.toFixed(1)}</Text>
                            
                            {/* <View style={{flexDirection:"row"}}>
                            <Image style={{width:16, height:16}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/star.png`}}/>
                            <Image style={{width:16, height:16}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/star.png`}}/>
                            <Image style={{width:16, height:16}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/star.png`}}/>
                            <Image style={{width:16, height:16}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/star.png`}}/>
                            <Image style={{width:16, height:16}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/star.png`}}/>
                            <Text style={[MainStyles.text,{color:"#fff", marginLeft:5}]}>{this.state.Astrologer.TotalRating??0}</Text>
                            </View> */}

                        </View>
                        <View style={{ flexDirection: "row", marginLeft: 20 }}>
                            <Image style={{ width: 26, height: 20 }} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/user-group.png` }} />
                            <Text style={[MainStyles.text, { color: "#fff", marginLeft: 5, paddingTop: 2, fontSize: 18 }]}>{this.state.Astrologer.TotalReview ?? 0}</Text>
                        </View>
                    </View>
                </LinearGradient>



                <View style={{ backgroundColor: "#ffffff", padding: 30, position: "relative", borderTopLeftRadius: 30, borderTopRightRadius: 30 }}>
                    <View style={{top: -20, right: 20, position: "absolute", alignItems: "center", justifyContent: "center"}}>
                        <Card style={{ width: 50, height: 50, borderRadius: 25, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" }}>
                            <TouchableOpacity onPress={this._setBookmark}>
                                {
                                    this.state.bookmarkingLoading && <ActivityIndicator style={{ width: 30, height: 30 }} color="#0000ff"/> ||
                                    <Image style={{ width: 30, height: 30 }} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/hart${this.state.Astrologer.IsBookmarked ? "-active" : ""}.png` }} />
                                }
                            </TouchableOpacity>
                        </Card>
                        <Text style={{color:"#FA3F84", fontWeight:"bold"}}>{this.state.Astrologer.BookmarkedCount}</Text>
                        {
                            this.state.Astrologer.IsBookmarked &&
                            <Text style={{color:"#FA3F84", fontWeight:"bold"}}>Following</Text>
                            ||
                            <Text style={{color:"#FA3F84", fontWeight:"bold"}}>Follow</Text>
                        }
                    </View>

                    <View style={{ flexDirection: "row", marginBottom: 15 }}>
                        {
                            this.state.Astrologer.SkillsCollection && this.state.Astrologer.SkillsCollection.map((titem, tindex) => (
                                <Image key={tindex} style={{ width: 27, height: 24, marginRight: 10 }} resizeMode="stretch" source={{ uri: `${env.DynamicAssetsBaseURL}${titem.Text}` }} />
                            ))
                        }
                        {
                            this.state.Astrologer.IsNew &&

                            <LinearGradient colors={["#FF8767", "#FF65A0"]} style={{ width: 54, height: 24, borderTopLeftRadius: 12, borderBottomRightRadius: 12, marginRight: 10 }}>
                                <Text style={{ color: "#fff", fontSize: 12, textAlign: "center", height: 24, textAlignVertical:"center" }}>NEW</Text>
                            </LinearGradient>
                        }
                    </View>
                    <Text style={[MainStyles.text, { fontSize: 20, fontWeight: "700", color: "#090320" }]}>{this.state.Astrologer.Name}</Text>
                    <Text style={[MainStyles.text, { fontSize: 14, color: "#6E6E6E", marginBottom: 10 }]}>Exp: {this.state.Astrologer.TotalExperience} years</Text>
                    <Text style={[MainStyles.text, { fontSize: 14, color: "#090320", marginBottom: 10 }]}>
                        {
                            this.state.Astrologer.ExpertiesCollection && this.state.Astrologer.ExpertiesCollection.map((titem, tindex) => <Text key={tindex} style={[MainStyles.text, { fontSize: 14, color: "#090320", marginBottom: 10 }]}>{tindex != 0 && ', '}{titem.Text}</Text>)
                        }
                    </Text>
                    <Text style={[MainStyles.text, { fontSize: 14, color: "#090320", marginBottom: 10 }]}>Language:<Text> </Text>
                        {
                            this.state.Astrologer.LanguagesCollection && this.state.Astrologer.LanguagesCollection.map((titem, tindex) => <Text key={tindex} style={[MainStyles.text, { fontSize: 14, color: "#090320", marginBottom: 10 }]}>{tindex != 0 && ', '}{titem.Text}</Text>)
                        }
                    </Text>
                </View>

                <View style={{ flexDirection: "row", width: "100%", paddingHorizontal: 30, paddingVertical: 10, backgroundColor: "#F5F5F5" }}>
                    <View style={{ flex: 1 }}>
                        <Text style={[MainStyles.text, { fontSize: 14 }]}>Charges</Text>
                        <Text style={[MainStyles.text, { fontSize: 20, fontWeight: "700", color: "green" }]}>{this.state.Astrologer.PerMinutesRateINR_CutPrice>0 && <Text style={{textDecorationLine:"line-through", color: "#090320"}}>₹{this.state.Astrologer.PerMinutesRateINR_CutPrice}</Text>} ₹{this.state.Astrologer.PerMinutesRateINR}/min</Text>
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={[MainStyles.text, { fontSize: 14, width: "100%", textAlign: "center" }]}>Available</Text>
                        <View style={{ flexDirection: "row", width: "100%", alignContent: "center", alignItems: "center", justifyContent: "center" }}>
                            {/*<Image style={{ width: 20, height: 20, marginRight: 10 }} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/phone-active.png` }} />
                            <Image style={{ width:20,height:20, marginRight:10  }} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/video.png`}}/>
                            <Image style={{ width:20,height:20 }} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/chat-active.png`}}/> */}
                            
                            {
                                this.state.Astrologer && this.state.Astrologer.IsCallService &&
                                <Image style={{ width:20,height:20, marginRight:10  }} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/phone-active.png`}}/> ||
                                <Image style={{ width:20,height:20, marginRight:10  }} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/phone.png`}}/>
                            }
                            {
                                this.state.Astrologer && this.state.Astrologer.IsVideoService &&
                                <Image style={{ width:25,height:20, marginRight:10  }} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/video-active.png`}}/> ||
                                <Image style={{ width:25,height:20, marginRight:10  }} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/video.png`}}/>
                            }
                            {
                                this.state.Astrologer && this.state.Astrologer.IsChatService &&
                                <Image style={{ width:20,height:20 }} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/chat-active.png`}}/> ||
                                <Image style={{ width:20,height:20 }} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/chat.png`}}/>
                            }
                        </View>
                    </View>
                </View>

                {
                    this.state.Astrologer && this.state.Astrologer.Gallery && this.state.Astrologer.Gallery.length > 0 &&
                    <View style={[MainStyles.bottomBorder, { width: "100%", paddingLeft: 30, paddingVertical: 30, backgroundColor: "#fff" }]}>
                        <Text style={[MainStyles.text, { fontSize: 16, fontWeight: "700", color: "#090320", marginBottom: 10 }]}>Photos</Text>
                        <ScrollView horizontal={true}>
                            {
                                this.state.Astrologer.Gallery.map((item, index) => (
                                    <Image key={index} style={{ width: 96, height: 120, marginRight: 10 }} resizeMode="cover" source={{ uri: `${env.DynamicAssetsBaseURL}${item}` }} />
                                ))
                            }
                        </ScrollView>
                    </View>
                }


                <View style={[{ width: "100%", paddingLeft: 30, paddingVertical: 30, backgroundColor: "#fff" }]}>
                    <Text style={[MainStyles.text, { fontSize: 16, fontWeight: "700", color: "#090320", marginBottom: 10 }]}>Expertise</Text>
                    <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
                        {
                            this.state.Astrologer.ExpertiesCollection && this.state.Astrologer.ExpertiesCollection.map((item, index) => (
                                <View key={index}>
                                    <LinearGradient colors={["#7162FC", "#B542F2"]} style={{ borderRadius: 30, width: 220, marginRight: 20 }}>
                                        <Text style={{ color: "#fff", padding: 15, fontSize: 16, textAlign: "center", marginRight: 10 }}>{item.Text}</Text>
                                    </LinearGradient>
                                </View>
                            ))
                        }
                    </ScrollView>
                </View>

                <View style={[MainStyles.bottomBorder, { width: "100%", paddingLeft: 30, paddingVertical: 30, backgroundColor: "#fff" }]}>
                    <Text style={[MainStyles.text, { fontSize: 16, fontWeight: "700", color: "#090320", marginBottom: 10 }]}>Skills</Text>
                    <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
                        <View style={{ flexDirection: "row" }}>
                            {
                                this.state.Astrologer.SkillsCollection && this.state.Astrologer.SkillsCollection.map((item, index) => {
                                    return (
                                        <TouchableOpacity key={index} onPress={() => this.props.navigation.navigate("ExpertListScreen")}>
                                            <View style={{ marginHorizontal: 5 }}>
                                                <Image style={{ width: 64, height: 66 }} resizeMode="stretch" source={{ uri: `${env.DynamicAssetsBaseURL}${item.Value}` }} />
                                            </View>
                                        </TouchableOpacity>
                                    )
                                })
                            }

                        </View>
                    </ScrollView>
                </View>

                <View style={[MainStyles.bottomBorder, { width: "100%", paddingHorizontal: 30, paddingVertical: 30, backgroundColor: "#fff" }]}>
                    <Text style={[MainStyles.text, { fontSize: 16, fontWeight: "700", color: "#090320", marginBottom: 10 }]}>Description</Text>
                    {/*<Text style={[MainStyles.text, { fontSize: 14, color: "#090320", marginBottom: 10 }]}>{this.state.Astrologer.BriefBio_EN}</Text>*/}
                    <Html
                        contentWidth={Dimensions.get("window").width}
                        source={{html:this.state.Astrologer.BriefBio_EN}}
                    />
                </View> 

                {
                    this.state.Astrologer.UserReviewAndRatingViewModel && this.state.Astrologer.UserReviewAndRatingViewModel.length > 0 &&
                    <>
                        <View style={[MainStyles.bottomBorder, { width: "100%", paddingHorizontal: 30, paddingVertical: 30, backgroundColor: "#fff" }]}>
                            <Text style={[MainStyles.text, { fontSize: 16, fontWeight: "700", color: "#090320", marginBottom: 10 }]}>Reviews</Text>
                            {/* <View style={{ flexDirection: "row" }}>
                    <Stars
                            display={this.state.Astrologer.TotalRating}
                            spacing={8}
                            count={5}
                            starSize={20}
                            fullStar={{uri:`${env.AssetsBaseURL}/assets/images/star-active.png`}}
                            emptyStar={{uri:`${env.AssetsBaseURL}/assets/images/star.png`}}
                            halfStar={{uri:`${env.AssetsBaseURL}/assets/images/star-half.png`}}
                            />
                        <Text style={[MainStyles.text, { color: "#000", marginLeft: 5 }]}>{this.state.Astrologer.TotalRating}</Text>
                    </View> */}

                        </View>

                        <View style={[MainStyles.bottomBorder, { width: "100%", paddingHorizontal: 20, paddingBottom: 100, backgroundColor: "#fff" }]}>
                            {
                                this.state.Astrologer.UserReviewAndRatingViewModel.map((item, index) => {
                                    return (
                                        <View key={index}>
                                            <ReviewView item={item} />
                                        </View>
                                    )
                                })
                            }
                        </View>
                    </>
                }
            </ScrollView>
        </View>

{
    !this.state.showMessageBox &&



<View style={{ width: "100%", position: "absolute", bottom: 0, left: 0, right: 0}}>
{
    this.state.notifyMeLoading && 
    <View style={{ width:"100%", height:40, backgroundColor:"#F0D5FF", alignItems:"center", justifyContent:"center"}}><ActivityIndicator color="blue"/></View>
    ||
    this.state.Astrologer && !this.state.Astrologer.isNotifyOn && (!this.state.Astrologer.IsAvailable || this.state.Astrologer.IsBusy) &&
    <View style={{backgroundColor:"#F0D5FF"}}>
        <TouchableOpacity onPress={this.onNotifyMePress}>
            <View style={{flexDirection:"row", width:"100%", height:40, backgroundColor:"#F0D5FF", alignItems:"center", justifyContent:"center"}}>
                <Image style={{width:20, height:20}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/bell-icon.png`}}/>
                <Text style={{marginLeft:10}}>Notify When Available</Text>
            </View>
        </TouchableOpacity>
    </View>
    ||
    this.state.Astrologer && this.state.Astrologer.isNotifyOn && (!this.state.Astrologer.IsAvailable || this.state.Astrologer.IsBusy) &&
    <View style={{flexDirection:"row", width:"100%", height:40, backgroundColor:"#ccc", alignItems:"center", justifyContent:"center"}}>
        <Image style={{width:20, height:20}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/bell-icon.png`}}/>
        <Text style={{marginLeft:10}}>You will be Notified!</Text>
    </View>
}


<View style={{ width: "100%", height: 60, flexDirection: "row" }}>
{
    this.state.Astrologer && this.state.Astrologer.IsAvailable && 
    <>
        {
            this.state.Astrologer.IsBusy &&
            <LinearGradient colors={["#5D0BA7", "#D8208E", "#FC5D38"]} start={{ x: 0, y: 0 }} end={{ x: 2, y: 2 }} style={{ flex: 1, height: 60 }}>
                <View style={{ width: "100%", height: 60, position: "relative" }}>
                    <ImageBackground style={{ position: "absolute", width: "100%", height: 60, bottom: 0, left: 0 }} resizeMode="stretch" source={require("../../assets/images/call-button-bg.png")} />
                    <View style={{ position: "absolute", width: "100%", height: 60, alignContent: "center", alignItems: "center", justifyContent: "center" }}>
                        <Text style={[MainStyles.text, {fontSize: 16, color: "#fff" }]}>Busy On Another Consultation</Text>
                        <Text style={[MainStyles.text, {fontSize:12, paddingTop:4, width:"100%", textAlign:"center", color:"#fff"}]}>Avl. in {parseInt(this.state.Astrologer.AvaliableIn/60)} mins</Text>
                    </View>
                </View>
            </LinearGradient>
        }

        {
            this.state.Astrologer.IsCallService && !this.state.Astrologer.IsBusy &&
            <LinearGradient colors={["#3A9812", "#FBB860"]} start={{ x: 0, y: 0 }} end={{ x: 2, y: 2 }} style={{ flex: 1, height: 60 }}>
                <TouchableOpacity onPress={() => this._InitCall()}>
                    <View style={{ width: "100%", height: 60, position: "relative" }}>
                        <ImageBackground style={{ position: "absolute", width: "100%", height: 60, bottom: 0, left: 0 }} resizeMode="stretch" source={require("../../assets/images/call-button-bg.png")} />
                        <View style={{ position: "absolute", width: "100%", height: 60, flexDirection: "row", alignContent: "center", alignItems: "center", justifyContent: "center" }}>
                            <Image style={{ width: 22, height: 22 }} resizeMode="stretch" source={require("../../assets/images/Icon-ionic-call.png")} />
                            <Text style={[MainStyles.text, { paddingLeft: 10, fontSize: 16, color: "#fff", marginLeft: 5 }]}>Call</Text>{/* <Text>₹{this.state.Astrologer.PerMinutesRateINR}/min</Text> */}
                        </View>
                    </View>
                </TouchableOpacity>
            </LinearGradient>
        }
        {
            this.state.Astrologer.IsVideoService && !this.state.Astrologer.IsBusy &&
            <LinearGradient colors={["#3A9812", "#FBB860"]} start={{ x: 0, y: 0 }} end={{ x: 2, y: 2 }} style={{ flex: 1, height: 60 }}>
                <TouchableOpacity onPress={() => this._InitVideoCall()}>
                    <View style={{ width: "100%", height: 60, position: "relative" }}>
                        <ImageBackground style={{ position: "absolute", width: "100%", height: 60, bottom: 0, left: 0 }} resizeMode="stretch" source={require("../../assets/images/call-button-bg.png")} />
                        <View style={{ position: "absolute", width: "100%", height: 60, flexDirection: "row", alignContent: "center", alignItems: "center", justifyContent: "center" }}>
                        <Image style={{ width: 30, height: 22 }} resizeMode="stretch" source={require("../../assets/images/Icon-ionic-videocam.png")} />
                            <Text style={[MainStyles.text, { paddingLeft: 10, fontSize: 16, color: "#fff", marginLeft: 5 }]}>Video</Text>{/* <Text>₹{this.state.Astrologer.PerMinutesRateINR}/min</Text> */}
                        </View>
                    </View>
                </TouchableOpacity>
            </LinearGradient>
        }
        {
            this.state.Astrologer.IsChatService && !this.state.Astrologer.IsBusy &&
            <LinearGradient colors={["#3A9812", "#FBB860"]} start={{ x: 0, y: 0 }} end={{ x: 2, y: 2 }} style={{ flex: 1, height: 60 }}>
                <TouchableOpacity onPress={() => this._InitChat()}>
                    <View style={{ width: "100%", height: 60, position: "relative" }}>
                        <ImageBackground style={{ position: "absolute", width: "100%", height: 60, bottom: 0, left: 0 }} resizeMode="stretch" source={require("../../assets/images/call-button-bg.png")} />
                        <View style={{ position: "absolute", width: "100%", height: 60, flexDirection: "row", alignContent: "center", alignItems: "center", justifyContent: "center" }}>
                        <Image style={{ width: 22, height: 22 }} resizeMode="stretch" source={require("../../assets/images/Icon-ionic-chatbubbles.png")} />
                            <Text style={[MainStyles.text, { paddingLeft: 10, fontSize: 16, color: "#fff", marginLeft: 5 }]}>Chat</Text>{/* <Text>₹{this.state.Astrologer.PerMinutesRateINR}/min</Text> */}
                        </View>
                    </View>
                </TouchableOpacity>
            </LinearGradient>
        }
    </>
    ||
    <LinearGradient colors={["#808080", "#808080", "#808080"]} start={{ x: 0, y: 0 }} end={{ x: 2, y: 2 }} style={{ flex: 1, height: 60 }}>
        <View style={{ width: "100%", height: 60, position: "relative" }}>
            <ImageBackground style={{ position: "absolute", width: "100%", height: 60, bottom: 0, left: 0 }} resizeMode="stretch" source={require("../../assets/images/call-button-bg.png")} />
            <View style={{ position: "absolute", width: "100%", height: 60, alignContent: "center", alignItems: "center", justifyContent: "center" }}>
                <Text style={[MainStyles.text, {fontSize: 16, color: "#fff" }]}>Offline</Text>
                {
                    this.state.Astrologer && this.state.Astrologer.OfflineText &&
                    <Text style={[MainStyles.text, {fontSize:12, paddingTop:4, width:"100%", textAlign:"center", color:"#fff"}]}>{this.state.Astrologer.OfflineText}</Text>
                }
            </View>
        </View>
    </LinearGradient> 
}
                     
                </View>
            </View>
    }

            </View>
             
            ||
            <ActivityIndicator color="#0000ff" />
        );
    }
}


const oldButtons = () =>{
    return(
        <View>
            {
                         this.state.Astrologer && this.state.Astrologer.IsAvailable && this.state.Astrologer.IsCallService &&
                         <LinearGradient colors={["#3A9812", "#FBB860"]} start={{ x: 0, y: 0 }} end={{ x: 2, y: 2 }} style={{ flex: 1, height: 60 }}>
                            <TouchableOpacity onPress={() => this._InitCall()}>
                                <View style={{ width: "100%", height: 60, position: "relative" }}>
                                    <ImageBackground style={{ position: "absolute", width: "100%", height: 60, bottom: 0, left: 0 }} resizeMode="stretch" source={require("../../assets/images/call-button-bg.png")} />
                                    <View style={{ position: "absolute", width: "100%", height: 60, flexDirection: "row", alignContent: "center", alignItems: "center", justifyContent: "center" }}>
                                        <Image style={{ width: 22, height: 22 }} resizeMode="stretch" source={require("../../assets/images/Icon-ionic-call.png")} />
                                        <Text style={[MainStyles.text, { paddingLeft: 20, fontSize: 16, color: "#fff", marginLeft: 5 }]}>Call Now</Text>{/* <Text>₹{this.state.Astrologer.PerMinutesRateINR}/min</Text> */}
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </LinearGradient>
                        ||
                        this.state.Astrologer && this.state.Astrologer.IsAvailable &&  !this.state.Astrologer.IsCallService &&
                         <LinearGradient colors={["#5D0BA7", "#D8208E", "#FC5D38"]} start={{ x: 0, y: 0 }} end={{ x: 2, y: 2 }} style={{ flex: 1, height: 60 }}>
                            <View style={{ width: "100%", height: 60, position: "relative" }}>
                                <ImageBackground style={{ position: "absolute", width: "100%", height: 60, bottom: 0, left: 0 }} resizeMode="stretch" source={require("../../assets/images/call-button-bg.png")} />
                                <View style={{ position: "absolute", width: "100%", height: 60, flexDirection: "row", alignContent: "center", alignItems: "center", justifyContent: "center" }}>
                                    <Text style={[MainStyles.text, {fontSize: 16, color: "#fff" }]}>Busy On Another Consultation</Text>
                                </View>
                            </View>
                        </LinearGradient>
                        ||
                        <LinearGradient colors={["#5D0BA7", "#D8208E", "#FC5D38"]} start={{ x: 0, y: .5 }} end={{ x: 1, y: .5 }} style={{ flex: 1, height: 60 }}>
                            <View style={{ width: "100%", height: 60, position: "relative" }}>
                                <ImageBackground style={{ position: "absolute", width: "100%", height: 60, bottom: 0, left: 0 }} resizeMode="stretch" source={require("../../assets/images/call-button-bg.png")} />
                                <View style={{ position: "absolute", width: "100%", height: 60, flexDirection: "row", alignContent: "center", alignItems: "center", justifyContent: "center" }}>
                                <Text style={[MainStyles.text, {fontSize: 16, color: "#fff" }]}>Offline</Text>
                                </View>
                            </View>
                        </LinearGradient>
                     }
                    
                     {
                         this.state.Astrologer &&  this.state.Astrologer.IsAvailable &&  
                         <LinearGradient colors={["#3A9812", "#FBB860"]} start={{ x: 0, y: .5 }} end={{ x: 1, y: .5 }} style={{ flex: 1, height: 60 }}>
                            <TouchableOpacity onPress={() => this._InitChat()}>
                                <View style={{ width: "100%", height: 60, position: "relative" }}>
                                    <ImageBackground style={{ position: "absolute", width: "100%", height: 60, bottom: 0, left: 0 }} resizeMode="stretch" source={require("../../assets/images/call-button-bg.png")} />
                                    <View style={{ position: "absolute", width: "100%", height: 60, flexDirection: "row", alignContent: "center", alignItems: "center", justifyContent: "center" }}>
                                        {
                                            this.state.Astrologer.IsChatService && 
                                            <>
                                                <Image style={{ width: 22, height: 22 }} resizeMode="stretch" source={require("../../assets/images/Icon-ionic-chatbubbles.png")} />
                                                <Text style={[MainStyles.text, { paddingLeft: 20, fontSize: 16, color: "#fff", marginLeft: 5 }]}>Chat Now</Text>
                                            </>
                                            ||
                                            <Text style={[MainStyles.text, {paddingBottom:10, fontSize: 16, color: "#fff" }]}>Busy On Another Consultation</Text>
                                        }
                                    </View>
                                </View>
                            </TouchableOpacity>
                        </LinearGradient>
                    ||
                    <LinearGradient colors={["#9E9E9E", "#7D7D7D"]} start={{ x: 0, y: .5 }} end={{ x: 1, y: .5 }} style={{ flex: 1, height: 60 }}>
                        <TouchableOpacity>
                            <View style={{ width: "100%", height: 60, position: "relative" }}>
                                <View style={{ position: "absolute", width: "100%", height: 60, flexDirection: "row", alignContent: "center", alignItems: "center", justifyContent: "center" }}>
                                <Text style={[MainStyles.text, {paddingBottom:10, fontSize: 16, color: "#fff" }]}>Offline</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    </LinearGradient>
                     } 
        </View>
    )
}

const Styles=StyleSheet.create({
     
    pageTitle:{
      ...MainStyles.text,
      fontSize:20,
      marginBottom:20
  },
  label:{
      ...MainStyles.text,
      fontSize:17,
      color:"#656565",
      marginBottom:10
  },
  textInput:{
      flexDirection:"row",
      width:"100%",
      alignItems:"center",
      justifyContent:"space-between",
      backgroundColor:"#F3F3F3", 
      borderRadius:30,
      marginBottom:20,
      paddingLeft:20,
      height:50
  },
    pageTitle:{
        ...MainStyles.text,
        fontSize:20,
        marginBottom:20
    },
    label:{
        ...MainStyles.text,
        paddingLeft:20,
        fontSize:17,
        color:"#656565"
    },
    textInput:{
        flexDirection:"row",
        width:"100%",
        alignItems:"center",
        justifyContent:"space-between",
        paddingLeft:20,
        backgroundColor:"#F3F3F3", 
        borderRadius:30,
        marginBottom:20
    },
    selectButton:{flexDirection:"row", width:127, height:50, backgroundColor:"#F3F3F3", padding:5, alignContent:"center", alignItems:"center", borderRadius:30},
    selectedButton:{
        borderColor:"#FF708F",
        borderWidth:2,
        backgroundColor:"#fff"
    }
});