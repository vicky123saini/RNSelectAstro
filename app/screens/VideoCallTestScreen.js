import React, { Component, useState, useRef, useEffect } from "react";
import { BackHandler, StyleSheet, Text, TextInput, Image, View, PermissionsAndroid, Platform, TouchableOpacity, Dimensions, SafeAreaView, ImageBackground } from "react-native";
//import RNSwitchAudioOutput from 'react-native-switch-audio-output';
import { WebView } from 'react-native-webview';


import { TwilioVideoLocalView, TwilioVideoParticipantView, TwilioVideo, } from "react-native-twilio-video-webrtc";
import BackgroundTimer from 'react-native-background-timer';
import { Avatar } from 'react-native-elements';
import Overlay from 'react-native-modal-overlay';
import LinearGradient from 'react-native-linear-gradient';
import analytics from '@react-native-firebase/analytics';
import * as Api from '../Api';
import * as Auth from '../Auth';
import * as env from "../../env";
import moment from 'moment';

export default class VideoCallTestScreen extends Component {
    constructor(props) {
      super(props);
      this.state = {
        status:"Calling...",
        speaker:"AUDIO_SPEAKER"
      };
     
    }
  
    // componentDidMount = async() => {
    //   RNSwitchAudioOutput.isSpeakerphoneOn(res => {
    //     console.log("res", res);
    //   });
    // }
  
    // onPress = () => {
    //   if(this.state.speaker == "AUDIO_SPEAKER"){
    //     // switch to headphone
    //     //RNSwitchAudioOutput.switchAudioOutput(true);
    //     RNSwitchAudioOutput.selectAudioOutput(RNSwitchAudioOutput.AUDIO_HEADPHONE)
    //     this.setState({speaker:"AUDIO_HEADPHONE"});
    //   }
    //   else{
    //     // switch to speakerphone
    //     RNSwitchAudioOutput.selectAudioOutput(RNSwitchAudioOutput.AUDIO_SPEAKER)
    //     this.setState({speaker:"AUDIO_SPEAKER"});
    //   }
    // }
  
    onConnect = () => {
      Api.GetVideoCallGetTestTokenService(this.state.identity).then(resp=> this.setState({data:resp.data}));
    }
  
  sessionClose = async() =>{
    
    this.Disconnect();
   
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
    
  }
  
    render() {
      return (
          <SafeAreaView style={{ flex: 1 }}>
      
  <View style={{flex:1}}>
       {
         this.state.data && 
         <VideoCallControl token={ this.state.data.token } roomName={ this.state.data.roomName } Connected={()=>this.Connected()} Disconnect={()=>this.Disconnect()} />
         ||
         <View>
           <TextInput value={this.state.identity} onChangeText={(text)=> this.setState({identity:text})}/>
           <TouchableOpacity onPress={this.onConnect}>
             <Text style={{padding:10, paddingHorizontal:20, backgroundColor:"#d5d5d5"}}>Connect</Text>
           </TouchableOpacity>
         </View>
       }
       </View>
  
  <View style={{flex:0}}>
  <TouchableOpacity onPress={this.onPress}>
             <Text style={{padding:10, paddingHorizontal:20, backgroundColor:"#d5d5d5"}}>switch</Text>
           </TouchableOpacity>
  </View>
      </SafeAreaView>
  
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