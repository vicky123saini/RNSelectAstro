import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import SwipeButton from 'rn-swipe-button';
import LinearGradient from 'react-native-linear-gradient';
import MainStyles from '../../Styles';
import Overlay from 'react-native-modal-overlay';
import SoundPlayer from 'react-native-sound-player';
import KeepAwake from 'react-native-keep-awake';
import * as env from '../../../env';
import * as Api from '../../Api';
import * as Auth from '../../Auth';
import {Singular} from 'singular-react-native';

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        thumbIconImageSource:require('../../assets/images/rarrow.png'),
        EnableSwipeButton:true,
        AvailableSwipeButton:{
            title:'Drag right to go offline'
        },
    };
   
  }

  componentDidMount = async () => {
    KeepAwake.activate();
    await SoundPlayer.loadUrl(`${env.AssetsBaseURL}assets/sound/sound2.mp3`);
    
    this.bintData();

    this._unsubscribe1 = this.props.navigation.addListener('focus', () => {    
      this.homeTimer();
    });

    this._unsubscribe2 = this.props.navigation.addListener('blur', () => {
      clearInterval(this._interval);
      this._interval=null;
    });

    this._onFinishedLoadingURLSubscription = SoundPlayer.addEventListener('FinishedLoadingURL', ({ success, url }) => {
      console.log('finished loading url', success, url);
    });
  };

  homeTimer = () => {
    if(this._interval==null){
      this._interval = setInterval(()=>{
        console.log("Interval", 6002); 
        this.bintData();
      }, 10000);
    }
  }

  componentWillUnmount = () =>{
    clearInterval(this._interval);
    this._interval=null;

    this._unsubscribe1();
    this._unsubscribe2();

    this.Stop();
    this._onFinishedLoadingURLSubscription.remove();
  }

  bintData = () =>{
    console.log("GetServiceStatesService req");
    Api.GetServiceStatesService().then(resp => {
      console.log("GetServiceStatesService resp", resp);
      if (resp.ResponseCode == 200) {
        this.setState(resp.data);
        this.changeContent();
      }
      else if(resp.ResponseCode==401){
        Auth.Logout();
        this.props.navigation.replace("LoginScreen");
      }
    });

    console.log("GetUpcommingCallerDetailsService req");
    Api.GetUpcommingCallerDetailsService().then(resp => {
      console.log("GetUpcommingCallerDetailsService resp", resp);
      if (resp.ResponseCode == 200 && resp.data) {
        this.setState({ UpcommingCallerDetails: resp.data });
        if(resp.data.Status == Auth.CallDetail_Status.QUEUED){
          if(resp.data.ServiceType==Auth.CallDetail_ServiceType.VIDEO_CALL || resp.data.ServiceType==Auth.CallDetail_ServiceType.CHAT){
            this.Play();
          }
        }
      }
      else{
        this.setState({ UpcommingCallerDetails: null });
      }
    });
  }
  
  Play=async () => {
    try {
       
      await SoundPlayer.play();
       
  } catch (e) {
      console.log(`cannot play the sound file`, e)
  }
}

Stop = async () => {
  try {
    //this.props.navigation.goBack();
    await SoundPlayer.stop();
  } catch (e) {
      console.log(`cannot play the sound file`, e)
  }
}

  updateSwipeStatusMessage = (msg) => {
    console.log(msg);
  }

  _onSuccessSwipe(){
    this.setState({IsAvailable:!this.state.IsAvailable}, ()=> {
    //this.changeContent();
    this.updateState();
    
    });
  }

  _onSuccessBusySwipe(){
    this.setState({IsBusy:!this.state.IsBusy}, ()=> {
    //this.changeContent();
    this.updateState();
    
    });
  }

  _InitChat = () =>{
    this.Stop();
    this._onFinishedLoadingURLSubscription.remove();

      var req={Status:Auth.CallDetail_Status.IN_PROCESS, SessionId:this.state.UpcommingCallerDetails.SessionId};
      console.log("UpdateChatStatusService req", req);
      Api.UpdateChatStatusService(req).then(resp=>{
          clearInterval(this._interval);
          console.log("UpdateChatStatusService resp", resp);
          this.props.navigation.navigate("ChatScreen", {Id:this.state.UpcommingCallerDetails.SessionId, ViewOnly:false})
      });
  }
  
  _InitVideoCall = () =>{
    this.Stop();
    this._onFinishedLoadingURLSubscription.remove();
    
    var req={Status:Auth.CallDetail_Status.IN_PROCESS, SessionId:this.state.UpcommingCallerDetails.SessionId};
    console.log("UpdateVideoCallStatusService req", req);
    Api.UpdateVideoCallStatusService(req).then(resp=>{
        clearInterval(this._interval);
        console.log("UpdateVideoCallStatusService resp", resp);
        this.props.navigation.navigate("VideoCallScreen", {Id:this.state.UpcommingCallerDetails.SessionId});
    });
  }

  updateState = () =>{
    this.setState({EnableSwipeButton:false});
    var req={IsAvailable:this.state.IsAvailable, IsBusy:this.state.IsBusy, IsVideoService: this.state.IsVideoService, IsCallService:this.state.IsCallService, IsChatService:this.state.IsChatService}
    console.log("UpdateServiceStatesService req", req);
    Api.UpdateServiceStatesService(req).then(resp => {
      console.log("UpdateServiceStatesService resp", resp);
      //this.setState({SwipeButton:true});
      this.changeContent();
    });
  }

  changeContent = () =>{
        if(!this.state.IsAvailable){
            this.setState({AvailableSwipeButton:{
                thumbIconImageSource: require('../../assets/images/larrow.png'), 
                title:"Go Online",
                railBackgroundColor:"#B542F2",
                railBorderColor:"#7162FC",
                railFillBackgroundColor:"#FF65A0",
                railFillBorderColor:"#FF8767",
                thumbIconBackgroundColor:"#fff",
                thumbIconBorderColor:"#fff",
            }, EnableSwipeButton:true});
        }
        else{
            this.setState({AvailableSwipeButton:{
                thumbIconImageSource: require('../../assets/images/rarrow.png'), 
                title:"Drag right to go offline",
                railBackgroundColor:"#FF65A0",
                railBorderColor:"#FF8767",
                railFillBackgroundColor:"#B542F2",
                railFillBorderColor:"#7162FC",
                thumbIconBackgroundColor:"#fff",
                thumbIconBorderColor:"#fff",
            }, EnableSwipeButton:true});
        }

        if(this.state.IsBusy){
          this.setState({BusySwipeButton:{
              thumbIconImageSource: require('../../assets/images/larrow.png'), 
              title:"After 15 min. it will automatically go live",
  
              railBackgroundColor:"#ccc",
              railBorderColor:"#ccc",
  
              railFillBackgroundColor:"#3A9812",
              railFillBorderColor:"#3A9812",
  
              thumbIconBackgroundColor:"#fff",
              thumbIconBorderColor:"#fff",
          }, EnableSwipeButton:true});
      }
      else{
          this.setState({BusySwipeButton:{
              thumbIconImageSource: require('../../assets/images/rarrow.png'), 
              title:"Drag right to go break",
  
              railBackgroundColor:"#3A9812",
              railBorderColor:"#3A9812",
  
              railFillBackgroundColor:"#ccc",
              railFillBorderColor:"#ccc",
  
              thumbIconBackgroundColor:"#fff",
              thumbIconBorderColor:"#fff",
          }, EnableSwipeButton:true});
      }
  }

  render() {
    return (
    <View style={{flex:1}}>
      <KeepAwake />
    {
    this.state.IsAvailable !=null && 
    <>
        <View style={{backgroundColor:"#fff", marginTop:2, height:100, justifyContent:"center"}}>
            <View style={{padding:10}}>
                {
                    this.state.EnableSwipeButton &&
                    <SwipeButton
                        value={this.state.IsAvailable}
                        //onSwipeFail={() => this.updateSwipeStatusMessage('Incomplete swipe!')}
                        //onSwipeStart={() => this.updateSwipeStatusMessage('Swipe started!')}
                        onSwipeSuccess={() => this._onSuccessSwipe() }
                        
                        enableReverseSwipe={!this.state.IsAvailable}
                        {...this.state.AvailableSwipeButton}
                        // thumbIconImageSource={this.state.thumbIconImageSource}
                        // railBackgroundColor={this.state.railBackgroundColor}
                        // railBorderColor={this.state.railBorderColor}
                        // railFillBackgroundColor={this.state.railFillBackgroundColor}
                        // railFillBorderColor={this.state.railFillBorderColor}

                        // thumbIconBackgroundColor="#fff"
                        // thumbIconBorderColor="#fff"
                        // title={this.state.title}
                        // titleColor="#fff"
                        
                    />
                    ||
                    <View>
                        <ActivityIndicator color="#0000FF"/>
                    </View>
                }
            </View>
        </View>
        <View style={{backgroundColor:"#fff", marginTop:2, height:100, justifyContent:"center"}}>
            <View style={{padding:10}}>
                {
                    this.state.EnableSwipeButton &&
                    <SwipeButton
                        value={this.state.IsBusy}
                        //onSwipeFail={() => this.updateSwipeStatusMessage('Incomplete swipe!')}
                        //onSwipeStart={() => this.updateSwipeStatusMessage('Swipe started!')}
                        onSwipeSuccess={() => this._onSuccessBusySwipe() }
                        enableReverseSwipe={this.state.IsBusy}
                        {...this.state.BusySwipeButton}
                        // thumbIconImageSource={this.state.thumbIconImageSource}
                        // railBackgroundColor={this.state.railBackgroundColor}
                        // railBorderColor={this.state.railBorderColor}
                        // railFillBackgroundColor={this.state.railFillBackgroundColor}
                        // railFillBorderColor={this.state.railFillBorderColor}
                        // thumbIconBackgroundColor="#fff"
                        // thumbIconBorderColor="#fff"
                        // title={this.state.title}
                        // titleColor="#fff"
                    />
                    ||
                    <View>
                        <ActivityIndicator color="#0000FF"/>
                    </View>
                }
            </View>
        </View>
    </>
    }
 <TouchableOpacity onPress={()=> this.props.navigation.navigate("Live_Exp_MyLiveSessionsScreen")}>
   <View style={{padding:10, borderWidth:1, borderRadius:10,borderColor:"#d5d5d5"}}>
     <Text>Live</Text>
   </View>
 </TouchableOpacity>
<ScrollView>
{
    this.state.UpcommingCallerDetails &&
<TouchableOpacity onPress={()=> 
        this.state.UpcommingCallerDetails.ServiceType==Auth.CallDetail_ServiceType.VOICE_CALL ?
        this.props.navigation.navigate("CallerDetailScreen", {UpcommingCallerDetails:this.state.UpcommingCallerDetails})
        :
        this.state.UpcommingCallerDetails.ServiceType==Auth.CallDetail_ServiceType.CHAT ?
        this._InitChat()
        :
        this.state.UpcommingCallerDetails.ServiceType==Auth.CallDetail_ServiceType.VIDEO_CALL ?
        this._InitVideoCall()
        :
        null
    }>
<View style={{paddingTop:10, backgroundColor:"#fff"}}>
        <LinearGradient colors={this.state.UpcommingCallerDetails.ServiceType==Auth.CallDetail_ServiceType.VOICE_CALL?["#FF8767", "#FF65A0"]: 
                                this.state.UpcommingCallerDetails.ServiceType==Auth.CallDetail_ServiceType.CHAT?["#7162FC", "#B542F2"] : ["#FB7021", "#FB7021"]} style={{borderRadius:30, width:"90%", alignSelf:"center", marginBottom:20}}>
            <View style={{padding:20}}>
                {
                    this.state.UpcommingCallerDetails.ServiceType==Auth.CallDetail_ServiceType.VOICE_CALL &&
                    <Text style={[Styles.boxTex1,{}]}>You will recieve a call within the next 30sec</Text>
                    ||
                    this.state.UpcommingCallerDetails.ServiceType==Auth.CallDetail_ServiceType.CHAT &&
                    <Text style={[Styles.boxTex1,{}]}>Chat</Text>
                    ||
                    this.state.UpcommingCallerDetails.ServiceType==Auth.CallDetail_ServiceType.VIDEO_CALL &&
                    <Text style={[Styles.boxTex1,{}]}>Video Call</Text>
                }
                
                <View style={{flexDirection:"row"}}>
                    <Image style={{width:30, height:30, margin:10}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/flower.png`}}/>
                    <View>
                        <Text style={[Styles.boxTex1,{}]}>Client name:</Text>
                        <Text style={[Styles.boxTex1,{}]}>Client details:</Text>
                    </View>
                    <View>
                    <Text style={[Styles.boxTex1,{}]}>{this.state.UpcommingCallerDetails.UserProfile.Name}</Text>
                    <Text style={[Styles.boxTex1,{}]}>D.O.B. - {this.state.UpcommingCallerDetails.UserProfile.DateOfBirth}{'\n'}P.O.B. - {this.state.UpcommingCallerDetails.UserProfile.PlaceOfBirth}{'\n'}T.O.B. - {this.state.UpcommingCallerDetails.UserProfile.TimeOfBirth}</Text>
                    
                    </View>
                </View>
                <Text style={[Styles.boxTex1,{}]}>Maximum Call Duration: <Text style={{fontSize:20, fontWeight:"700"}}>{parseInt(this.state.UpcommingCallerDetails.TimeLimit/60)}:{this.state.UpcommingCallerDetails.TimeLimit%60}</Text></Text>
                <Text style={[Styles.boxTex1,{}]}>Caller Type: <Text style={{fontSize:20, fontWeight:"700"}}>{this.state.UpcommingCallerDetails.CallerType}</Text></Text>
                <Text style={[Styles.boxTex1,{}]}>Puja: <Text style={{fontSize:20, fontWeight:"700"}}>{this.state.UpcommingCallerDetails.PujaSuggestionByAstro}</Text></Text>
                <Text style={[Styles.boxTex1,{}]}>Gemstone: <Text style={{fontSize:20, fontWeight:"700"}}>{this.state.UpcommingCallerDetails.GemstoneByAstro}</Text></Text>
            </View>
        </LinearGradient>
        </View>
        </TouchableOpacity> 
    }

 

      </ScrollView>
      </View>
    );
  }
}


const Styles = StyleSheet.create({
    cartItem:{flex:1, alignContent:"center", alignItems:"center", justifyContent:"center"},
    bottomText:{...MainStyles.text, padding:10, fontSize:18, textAlign:"center"},
    itemCell:{width:100, height:50, margin:20, transform: [{ rotate: '-90deg'}], alignItems:"center", justifyContent:"center"},
    boxTex1:{...MainStyles.text, color:"#fff", paddingTop:10},
    listText1:{...MainStyles.text, fontSize:14, color:"#131313"},
    listText2:{...MainStyles.text, fontSize:12, color:"#656565"}
})