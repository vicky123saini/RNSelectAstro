import React, { Component, useState, useRef, useEffect } from "react";
import { BackHandler, StyleSheet, Text, Image, View, PermissionsAndroid, Platform, TouchableOpacity, Dimensions, SafeAreaView, ImageBackground } from "react-native";
import { TwilioVideoLocalView, TwilioVideoParticipantView, TwilioVideo, } from "react-native-twilio-video-webrtc";
import KeepAwake from 'react-native-keep-awake';
import { Avatar } from 'react-native-elements';
import Overlay from 'react-native-modal-overlay';
import LinearGradient from 'react-native-linear-gradient';
import analytics from '@react-native-firebase/analytics';
import * as Api from '../Api';
import * as Auth from '../Auth';
import * as env from "../../env";
import * as MyControls from './user/Controls';
import moment from 'moment';
import {Singular} from 'singular-react-native';
//import RNSwitchAudioOutput from 'react-native-switch-audio-output';

export default class PoojaVideoCallScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      status:"Calling...",
      timer:0
    };
   
  }

  componentDidMount = async() => {
    KeepAwake.activate();
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => !this.confirmDisconnect());
  try{
    const {Id} = this.props.route.params;
    const profile = await Auth.getProfie().then(resp=>JSON.parse(resp)).catch(()=> console.error("err poojavideocallscreen getProfile"));;
    const tokenData = await Api.GetMandirVideoCallGetTokenService(Id).then(resp=> resp.data);
    //const details = await Api.GetMandirVideoCallDetailsService(Id).then(resp=> resp.data);

    this.setState({profile, tokenData, SessionId:Id});

    Api.GetMandirVideoCallDetailsService(Id).then(resp=>{
        console.log("GetMandirVideoCallDetailsService", resp);
         
        if(profile.UserType==Auth.UserType.ENDUSER){
          this.setState({ToProfile:resp.data.ExpertProfile}); 
        }
        else{
          this.setState({ToProfile:resp.data.UserProfile});
        }
      });

    if(profile.UserType==Auth.UserType.ENDUSER){
      const {MandirTransactionId} = this.props.route.params;
      this._interval = setInterval(() => {
        console.log("Interval", 10001);
         
        Api.MandirVideoCallGetCurrentStatusService(MandirTransactionId).then(response=>{ 
            console.log("MandirInitVideoCallService resp", response);
            if(response.ResponseCode== 200 && response.data.Status=="DIS_CONNECTED"){
              this.sessionClose();
            }
        });
      }, 3000);
    }
  }
  catch(err){
    console.log(err);
  }
}

componentWillUnmount = () => {
  KeepAwake.deactivate();
  clearInterval(this._interval);
}

sessionClose = async() =>{
 
  this.Disconnect();
  //this.props.navigation.pop();
   if(this.state.profile.UserType==Auth.UserType.ENDUSER)
     this.props.navigation.replace("MyBookingsScreen");
   else if(this.state.profile.UserType==Auth.UserType.MANDIR_ADMIN || this.state.profile.UserType==Auth.UserType.MANDIR_SUBADMIN)
     this.props.navigation.replace("MandirHomeScreen");
}

Connected = () =>{
  console.log("connectionDidConnect");
}
confirmDisconnect = () => {
  this.setState({confirmDisconnect:true});
  return false;
}

onConfirmDisconnect = () => {
  this.setState({confirmDisconnect:null});
  this.sessionClose();
}

Disconnect = () =>{
  try{
    const {Id, MandirTransactionId} = this.props.route.params;
    let req={MandirTransactionId:MandirTransactionId, CallStatus: "DIS_CONNECTED"}
    console.log("MandirUpdateVideoCallStatusService req", req);
    Api.MandirUpdateVideoCallStatusService(req);
 
    KeepAwake.deactivate();
    clearInterval(this._interval);
    
    if(this.state.profile.UserType==Auth.UserType.ENDUSER)
      this.props.navigation.replace("UserHomeScreen");
    else if(this.state.profile.UserType==Auth.UserType.MANDIR_ADMIN || this.state.profile.UserType==Auth.UserType.MANDIR_SUBADMIN)
      this.props.navigation.replace("MandirHomeScreen");
    }
  catch{
      console.log("Disconnect error");
  }
}

  render() {
    return (
        this.state.tokenData &&
        <SafeAreaView style={{ flex: 1 }}>
          <KeepAwake />
    <Overlay childrenWrapperStyle={{ borderRadius: 30 }} visible={this.state.confirmDisconnect}>
        <ImageBackground style={{width:"100%", height:200}} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/bg-popup.png` }}>
        <View style={{ padding: 20, justifyContent: "center" }}>
            <Text style={[{ marginBottom: 20, fontWeight:"bold", textAlign:"center"}]}>Are you sure you want to exit?</Text> 

            <View style={{alignItems:"center", alignContent:"center"}}>
                <TouchableOpacity onPress={()=> this.setState({confirmDisconnect:null})}>
                    <LinearGradient colors={["#FF8767", "#FF65A0"]} style={{borderRadius:30, width:220, marginBottom:20}}>
                        <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>Continue</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>

            <View style={{alignItems:"center", alignContent:"center"}}>
                <TouchableOpacity onPress={()=> this.onConfirmDisconnect()}>
                    <LinearGradient colors={["#ccc", "#ddd"]} style={{borderRadius:30, width:220, marginBottom:20}}>
                        <Text style={{color:"#000", padding:15, fontSize:16, textAlign:"center"}}>Exit</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View> 
        </ImageBackground>
    </Overlay>

  <View style={{ flex: 1 }}>
    <View elevation={5} style={{ flexDirection: "row", alignItems:"center", padding:10, backgroundColor:"#fff"}}>
      <View style={{ flex: 1, flexDirection: "row", alignItems:"center" }}>
        <View>
          <TouchableOpacity onPress={() => this.confirmDisconnect()}>
            <Image style={{width:13, height:22}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/back.png`}} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
 
      <VideoCallControl token={ this.state.tokenData.token } roomName={ this.state.tokenData.roomName } profile={this.state.Profile} Connected={()=>this.Connected()} Disconnect={()=>this.Disconnect()} />
      </View>
    </SafeAreaView>
      ||
      <View><Text>Loading....</Text></View>
    );
  }
}
const VideoCallControl = (props) => {
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [status, setStatus] = useState("disconnected");
  const [participants, setParticipants] = useState(new Map());
  const [videoTracks, setVideoTracks] = useState(new Map());
  const [speaker, setSpeaker] = useState("AUDIO_SPEAKER");
  const twilioVideo = useRef(null);

  useEffect(async()=>{
    try{
      try{
        twilioVideo.current.disconnect();
      }
      catch(e){
        console.log("_onConnectButtonPress twilioVideo.current.disconnect", e)
      }

      if (Platform.OS === "android") {
        await _requestAudioPermission();
        await _requestCameraPermission();
      }
      
      twilioVideo.current.connect({ roomName: props.roomName, accessToken: props.token });
      setStatus("connecting");
      props.Connected();
    }
    catch(e){
      console.log("_onConnectButtonPress", e)
    }
  },[])

  const _onEndButtonPress = () => {
    try{
      twilioVideo.current.disconnect();
      props.Disconnect();
    }
    catch(e){
      console.log("_onEndButtonPress", e)
    }
  };

//   const _onSwitchBluetooth = () => {
//     try{
//       if(speaker == "AUDIO_SPEAKER"){
//         // switch to headphone
//         RNSwitchAudioOutput.selectAudioOutput(RNSwitchAudioOutput.AUDIO_HEADPHONE)
//         setSpeaker("AUDIO_HEADPHONE");
//       }
//       else{
//         // switch to speakerphone
//         RNSwitchAudioOutput.selectAudioOutput(RNSwitchAudioOutput.AUDIO_SPEAKER)
//         setSpeaker("AUDIO_SPEAKER");
//       }
//     }
//     catch(e){
//       console.log("_onSwitchBluetooth", e)
//     }
// };

  const _onMuteButtonPress = () => {
    try{
      twilioVideo.current
      .setLocalAudioEnabled(!isAudioEnabled)
      .then((isEnabled) => setIsAudioEnabled(isEnabled));
    }
    catch(e){
      console.log("_onMuteButtonPress", e)
    }
  };

  const _onFlipButtonPress = () => {
    try{
      twilioVideo.current.flipCamera();
    }
    catch(e){
      console.log("_onFlipButtonPress", e)
    }
  };

  const _onRoomDidConnect = () => {
    try{
      setStatus("connected");
    }
    catch(e){
      console.log("_onRoomDidConnect", e)
    }
  };

  const _onRoomDidDisconnect = ({ error }) => {
    try{
      console.log("ERROR: ", error);
      setStatus("disconnected");
      props.Disconnect();
    }
    catch(e){
      console.log("_onRoomDidDisconnect", e)
    }
  };

  const _onRoomDidFailToConnect = (error) => {
    try{
      console.log("ERROR: ", error);
      setStatus("disconnected");
      props.Disconnect();
    }
    catch(e){
      console.log("_onRoomDidFailToConnect", e)
    }
  };

  const _onParticipantAddedVideoTrack = ({ participant, track }) => {
    try{
      console.log("onParticipantAddedVideoTrack: ", participant, track);
      setVideoTracks(
        new Map([
          ...videoTracks,
          [
            track.trackSid,
            { participantSid: participant.sid, videoTrackSid: track.trackSid },
          ],
        ])
      );
    }
    catch(e){
      console.log("_onParticipantAddedVideoTrack", e)
    }
  };

  const _onParticipantRemovedVideoTrack = ({ participant, track }) => {
    try{
      console.log("onParticipantRemovedVideoTrack: ", participant, track);
      const videoTracks = new Map(videoTracks);
      videoTracks.delete(track.trackSid);
      setVideoTracks(videoTracks);
    }
    catch(e){
      console.log("_onParticipantRemovedVideoTrack", e)
    }
  };

  const _requestAudioPermission = () => {
    try{
      return PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        {
          title: "Need permission to access microphone",
          message:
            "To run this demo we need permission to access your microphone",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
    }
    catch(e){
      console.log("_requestAudioPermission", e)
    }
  };

  const _requestCameraPermission = () => {
    try{
      return PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
        title: "Need permission to access camera",
        message: "To run this demo we need permission to access your camera",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      });
    }
    catch(e){
      console.log("_requestCameraPermission", e)
    }
  };

  return (
    

    <View style={styles.container}>
      {/* {status === "disconnected" && (
        <View style={{flex: 1, backgroundColor:"#fff", justifyContent: 'center',alignItems: 'center', paddingBottom:100}}>
          <Text style={styles.Text}>Connecting..</Text>
        </View>
      )} */}
      {(status === "connected" || status === "connecting") && (
        <View style={styles.callContainer}>
          {status === "connected" && (
            <View style={styles.remoteGrid}>
              {Array.from(videoTracks, ([trackSid, trackIdentifier]) => {
                return (
                  <TwilioVideoParticipantView
                    style={styles.remoteVideo}
                    key={trackSid}
                    trackIdentifier={trackIdentifier}
                  />
                );
              })}
            </View>
          )}

          {/* <View style={styles.optionsContainer}>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={_onEndButtonPress}
            >
              <Text style={{ fontSize: 12 }}>End</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={_onMuteButtonPress}
            >
              <Text style={{ fontSize: 12 }}>
                {isAudioEnabled ? "Mute" : "Unmute"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={_onFlipButtonPress}
            >
              <Text style={{ fontSize: 12 }}>Flip</Text>
            </TouchableOpacity>
            
          </View> */}
          <TwilioVideoLocalView enabled={true} style={styles.localVideo} />
          <View style={styles.callContainer}>
            <LinearGradient colors={["#110E0E", "#7F7F7F"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.optionsContainer}>
              {/* <TouchableOpacity style={styles.optionButton} onPress={_onSwitchBluetooth}>
                <Avatar size={55} rounded source={{uri:`${env.AssetsBaseURL}assets/images/bluetooth-active.png`}}/>
                <Text style={{ fontSize: 14, fontWeight:"700", color:"#fff" }}>{speaker == "AUDIO_SPEAKER" ? "Off" : "On"}</Text>
              </TouchableOpacity> */}

              <TouchableOpacity style={styles.optionButton} onPress={_onMuteButtonPress}>
                <Avatar size={55} rounded source={{uri:`${env.AssetsBaseURL}assets/images/mute.png`}}/>
                <Text style={{ fontSize: 14, fontWeight:"700", color:"#fff" }}>{isAudioEnabled ? "Mute" : "Unmute"}</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.optionButton} onPress={_onFlipButtonPress}>
                <Avatar size={55} rounded source={{uri:`${env.AssetsBaseURL}assets/images/flip-camera.png`}}/>
                <Text style={{ fontSize: 14, fontWeight:"700", color:"#fff" }}>Flip</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.optionButton} onPress={_onEndButtonPress}>
                <Avatar size={74} rounded source={{uri:`${env.AssetsBaseURL}assets/images/end-call.png`}}/>
                <Text style={{ fontSize: 14, fontWeight:"700", color:"#fff" }}>End Call</Text>
              </TouchableOpacity>

            </LinearGradient>
          </View>
        </View>
      )}
      <TwilioVideo
        ref={twilioVideo}
        onRoomDidConnect={_onRoomDidConnect}
        onRoomDidDisconnect={_onRoomDidDisconnect}
        onRoomDidFailToConnect={_onRoomDidFailToConnect}
        onParticipantAddedVideoTrack={_onParticipantAddedVideoTrack}
        onParticipantRemovedVideoTrack={_onParticipantRemovedVideoTrack}
      />
    </View>
              
   
  
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  callContainer: {
    flex: 1,
    position: "absolute",
    bottom: 0,
    top: 0,
    left: 0,
    right: 0,
  },
  welcome: {
    fontSize: 30,
    textAlign: "center",
    paddingTop: 40,
  },
  input: {
    height: 50,
    borderWidth: 1,
    marginRight: 70,
    marginLeft: 70,
    marginTop: 50,
    textAlign: "center",
    backgroundColor: "white",
  },
  button: {
    marginTop: 100,
  },
  localVideo: {
    flex: 1,
    width: 100,
    height: 150,
    position: "absolute",
    right: 10,
    top: 10,
  },
  remoteGrid: {
    flex: 1,
    //flexDirection: "row",
    //flexWrap: "wrap",
  },
  remoteVideo: {
    // marginTop: 20,
    // marginLeft: 10,
    // marginRight: 10,
    width: "100%",
    height: Dimensions.get('window').height-150,
  },
  optionsContainer: {
    borderTopLeftRadius:30,
    borderTopRightRadius:30,
    position: "absolute",
    left: 0,
    bottom: 0,
    right: 0,
    height: 120,
    backgroundColor: '#00000061',
    flexDirection: "row",
    alignItems: "center",
    justifyContent:"space-evenly"
  },
  optionButton: {
    justifyContent: "center",
    alignItems: "center",
  },
  Text:{
    fontFamily: "Roboto",
    color: '#5b5b5b',
    marginTop: 6,
    marginBottom: 6,
    fontSize: 16,
    alignSelf:"flex-start",
    textAlign:"center",
    padding:20
  },
  buttonBlueBig:{
    width: 200,
    height: 50,
    justifyContent: 'center',
    textAlign:'center',
    textAlignVertical:'center',
    backgroundColor: '#00b4e8',
    color: '#fff',
    fontSize: 16,
    borderRadius: 10,
    marginTop:20,
  }
});