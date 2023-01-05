import React, { Component, useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Image, SafeAreaView, ScrollView, StyleSheet, ImageBackground, Alert, Modal, Switch, TextInput, Dimensions, PermissionsAndroid, Platform, ActivityIndicator, } from 'react-native';
import MyStyle from './style';
import * as env from '../../../../env';
import * as Api from '../../../Api';
import * as Auth from '../../../Auth';
import * as MyExtension from '../../../MyExtension';
import {ActiveCallers, Header, BadgesView} from '../../../controls/LiveSessionControls';
import {Picker} from '../../../controls/MyPicker';
import {Live_Category, LiveSession_Status} from '../../../MyExtension';
import RtcEngine, { ChannelProfile, ClientRole, RtcEngineContext, RtcLocalView, RtcRemoteView, } from 'react-native-agora';
//import Item from '../../../controls/AgoraControls/basic/JoinChannelAudio/Item';
//const config = require('../../config/agora.config.json');
import {agoraConf as config} from '../../../../env';
import { Avatar } from 'react-native-elements';
import ChatRtmEngine from 'agora-react-native-rtm'; 

export default class GoLiveScreen extends Component {

  constructor(props) {
    super(props);
    const{Id}=this.props.route.params??{};
    this.state = {
      messages:[{
        _id: +new Date(),
        text:"hi",
        user: {
          _id: +new Date(),
          name: "Me",
        },
        createdAt: new Date(),
      }],
      isJoined: Id!=null,
      remoteUid: [],
      switchCamera: true,
      switchRender: true,
      isRenderTextureView: false,
      isSettingPopup:false,
      isCallStatusPopup:false
    };
  }

  componentDidMount = () => {
    // const{Id}=this.props.route.params??{};
    // if(Id){
    //   this.setState({isJoined:true, SessionId:Id});
    // }
  };
  

  UNSAFE_componentWillMount() {
    const{Id}=this.props.route.params??{};
    this.setState({SessionId:Id});
   
    //this._joinChannelTemp();
    this._initEngine();
  }

  componentWillUnmount() {
    const channel = this.state.channel;
    this._engine?.destroy();
    clearInterval(this._interval);
    this.chatClient?.leaveChannel(channel).then(resp=> console.log("leaveChannel", resp));;;
    ///this.chatClient?.logout().then(resp=> console.log("chatClient logout", resp));
  }

  _initEngine = async () => {
    this._engine = await RtcEngine.createWithContext(
      new RtcEngineContext(config.appId)
    );
    this._addListeners();

    //chat init
    this.chatClient = new ChatRtmEngine();
    this._addListenersChat();

    await this._engine.enableVideo();
    await this._engine.startPreview();
    await this._engine.setChannelProfile(ChannelProfile.LiveBroadcasting);
    //await this._engine.setClientRole(ClientRole.Broadcaster);
    await this.chatClient.createClient(config.appId);

    this._joinChannel(ClientRole.Broadcaster)
  };

  onSend = (messages) => {
    const channel = this.state.channel;
    console.log('send channel', this.state.channel);
    messages.forEach((message) => {
      this.chatClient?.sendMessageByChannelId(channel,`${message.text}`) 
      .then(() => {
        console.log('send message');
        var msg= {
          _id: +new Date(),
          text: message.text,
          user: {
            _id: +new Date(),
            name: "Me",
          },
          createdAt: new Date(),
        };

        this.setState((prevState) => ({
          //messages: GiftedChat.append(prevState.messages, [message]),
          messages:[...prevState.messages, msg]
        }));
      })
          .catch(() => { 
            console.warn('send failured');
          });
      // this.chatClient?.sendChannelMessage({
      //     channel,
      //     message: `${message.text}`,
      //   })
      //   .then(() => {
      //     console.log('send message');
      //     this.setState((prevState) => ({
      //       messages: GiftedChat.append(prevState.messages, [message]),
      //     }));
      //   })
      //   .catch(() => { 
      //     console.warn('send failured');
      //   });
    });
  }

  _addListeners = () => {
    this._engine?.addListener('Warning', (warningCode) => {
      //console.info('Warning', warningCode);
    });
    this._engine?.addListener('Error', (errorCode) => {
      console.info('Error', errorCode);
    });
    this._engine?.addListener('JoinChannelSuccess', (channel, uid, elapsed) => {
      console.info('JoinChannelSuccess', channel, uid, elapsed);
      this.setState({ isJoined: true });
    });
    this._engine?.addListener('LeaveChannel', (stats) => {
      console.info('LeaveChannel', stats);
      this.setState({ isJoined: false, remoteUid: [] });
    });
    this._engine?.addListener('UserJoined', (uid, elapsed) => {
      console.info('UserJoined', uid, elapsed);
      this.setState({ remoteUid: [...this.state.remoteUid, uid] });
    });
    this._engine?.addListener('UserOffline', (uid, reason) => {
      console.info('UserOffline', uid, reason);
      this.setState({
        remoteUid: this.state.remoteUid.filter((value) => value !== uid),
      });
    });
  };

  _addListenersChat = () => {
    this.chatClient?.on('tokenExpired', (e) => {
      console.info('tokenExpired', e);
    });
    this.chatClient?.on('remoteInvitationRefused', (e) => {
      console.info('remoteInvitationRefused', e);
    });
    this.chatClient?.on('remoteInvitationFailure', (e) => {
      console.info('remoteInvitationFailure', e);
    });
    this.chatClient?.on('remoteInvitationCanceled', (e) => {
      console.info('remoteInvitationCanceled', e);
    });
    this.chatClient?.on('messageReceived', (e) => {
      console.info('messageReceived', e);
    });
    this.chatClient?.on('localInvitationRefused', (e) => {
      console.info('localInvitationRefused', e);
    });
    this.chatClient?.on('localInvitationReceivedByPeer', (e) => {
      console.info('localInvitationReceivedByPeer', e);
    });
    this.chatClient?.on('localInvitationFailure', (e) => {
      console.info('localInvitationFailure', e);
    });
    this.chatClient?.on('localInvitationCanceled', (e) => {
      console.info('localInvitationCanceled', e);
    });
    this.chatClient?.on('localInvitationAccepted', (e) => {
      console.info('localInvitationAccepted', e);
    });
    this.chatClient?.on('error', (e) => {
      console.info('error', e);
    });
    this.chatClient?.on('connectionStateChanged', (e) => {
      console.info('connectionStateChanged', e);
    });
    this.chatClient?.on('channelMessageReceived', (e) => {
      console.info('channelMessageReceived', e);
    });
    this.chatClient?.on('channelMemberLeft', (e) => {
      console.info('channelMemberLeft', e);
    });
    this.chatClient?.on('channelMemberJoined', (e) => {
      console.info('channelMemberJoined', e);
    });
    this.chatClient?.on('remoteInvitationReceived', (e) => {
      console.info('remoteInvitationReceived', e);
    });
    this.chatClient?.on('channelMessageReceived', (evt) => {
      const { uid, channelId, text } = evt;
      console.log('evt exp', evt);
      console.log('channelMessageReceived uid exp', uid);
      if (channelId === this.state.channel) {
        // this.setState((prevState) => ({
        //   messages: GiftedChat.append(prevState.messages, [
        //     {
        //       _id: +new Date(),
        //       text,
        //       user: {
        //         _id: +new Date(),
        //         name: uid.substr(uid.length - 1, uid.length),
        //       },
        //       createdAt: new Date(),
        //     },
        //   ]),
        // }));
        var msg=     {
          _id: +new Date(),
          text,
          user: {
            _id: +new Date(),
            name: uid.substr(uid.length - 1, uid.length),
          },
          createdAt: new Date(),
        };

  this.setState((prevState) => ({
    //messages: GiftedChat.append(prevState.messages, [message]),
    messages:[...prevState.messages, msg]
  }));
        console.log('message from current channel exp', text);
      }
    });
  };

  onSwitchCamera = () => {
    this._engine?.switchCamera()
  };

  onAudioEnable = () => {
    this._engine?.muteLocalAudioStream(!this.state.muted);
    this.setState(prevState=>({muted:!prevState.muted}));
  }

  ucommingCallListener = () => {
    this._interval = setInterval(() => {
      //console.log("Interval", 1303);
      //console.log("5001");
      if(!this.state.SessionId) return;

      Api.ExpertliveSessionCallWattingService(this.state.SessionId).then((resp) => {
        //console.log("ExpertliveSessionCallWattingService resp", resp);
        if (resp.ResponseCode == 200) {
          this.setState({callWaitingList:resp.data})
        }
      });
    }, 5000);
  }

  _joinChannel = async (Role) => {
    await this._engine.setClientRole(Role);
    const{Id}=this.props.route.params??{};

    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ]);
    }
    
    var req={
      Id:Id
    }

    console.log("ExpertliveSessionInitLiveService req", req);
    Api.ExpertliveSessionInitLiveService(req).then( async (resp) => {
      console.log("ExpertliveSessionInitLiveService resp", resp);
      if (resp.ResponseCode == 200) {
        this.setState({isJoined:true, channel:resp.data.channelName});
        this.ucommingCallListener();

        await this._engine?.joinChannelWithUserAccount(
          resp.data.token,
          resp.data.channelName,
          resp.data.uid
        );

        await this.chatClient.login({
          uid: resp.data.uid,
          token: resp.data.tokenChat,
        })
        .then(r=> console.log("chatClient.login resp", r))
        .catch(e=> console.log("chatClient.login err", e));

        await this.chatClient.joinChannel(resp.data.channelName);

      }
    });
  };

  _joinChannelTemp = async (Role) => {
    const{Id}=this.props.route.params??{};
    var req={
      Id:Id
    }

    console.log("ExpertliveSessionInitLiveService req", req);
    Api.ExpertliveSessionInitLiveService(req).then( async (resp) => {
      console.log("ExpertliveSessionInitLiveService resp", resp);
      if (resp.ResponseCode == 200) {
        this.setState({isJoined:true});
        this.ucommingCallListener();
      }
    });
  };

  _leaveChannel = async () => {
    await this._engine?.leaveChannel();
  };

  _switchCamera = () => {
    const { switchCamera } = this.state;
    this._engine
      ?.switchCamera()
      .then(() => {
        this.setState({ switchCamera: !switchCamera });
      })
      .catch((err) => {
        console.warn('switchCamera', err);
      });
  };

  _switchRender = () => {
    const { switchRender, remoteUid } = this.state;
    this.setState({
      switchRender: !switchRender,
      remoteUid: remoteUid.reverse(),
    });
  };

  _switchRenderView = (value) => {
    this.setState({
      isRenderTextureView: value,
    });
  };

  onSettingPress = () =>{
    Api.ExpertliveSessionGetSettingsService().then(resp => {
      console.log("ExpertliveSessionGetSettingsService resp", resp);
      if (resp.ResponseCode == 200) {
         this.setState({SettingList:resp.data, isSettingPopup:true});
      }
    });
  }

  onSettingChange = (item) =>{
    let newSetting=this.state.SettingList.map(o=> {if(o.Id==item.Id)item.Value=!item.Value; return o});
    this.setState({SettingList:newSetting});

    Api.ExpertliveSessionUpdateSettingService(newSetting).then(resp => {
      console.log("ExpertliveSessionUpdateSettingService resp", resp);
      // if (resp.ResponseCode == 200) {
         
      // }
    });
  }

  onDisconnectCall = () => {
    var req={JoinSessionId:this.state.selectedCall.JoinSessionId, Status:MyExtension.LiveSessionJoin_Status.COMPLETED};
    console.log("ExpertliveSessionUpdateCallStatusService req", req);
    Api.ExpertliveSessionUpdateCallStatusService(req).then(async(resp)=>{
      console.log("ExpertliveSessionUpdateCallStatusService resp", resp);
      if (resp.ResponseCode == 200) {
      }
    });
  }

  onCloseSession = () =>{
    var req={SessionId:this.state.SessionId};
    console.log("ExpertliveSessionCloseSessionService req", req);
    Api.ExpertliveSessionCloseSessionService(req).then(resp => {
      console.log("ExpertliveSessionCloseSessionService resp", resp);
      if (resp.ResponseCode == 200) {
        this._engine?.destroy();
        this.props.navigation.replace("ExpertHomeScreen");
      }
      else{
        Alert.alert(null, resp.ResponseMessage);
      }
    });
  }

  onActiveCallStickerPress = async(item) =>{
    console.log("item", item);
    //{"SessionJoinId": 55, "Name": "vikas saini", "ProfileImage": "/Content/ProfileImage/canlil4qrjq.jpg", "Time": 1.1293056, "Type": 1, "UserId": 16}
    this.setState({isCallStatusPopup:true, selectedCall:item});
  }

    render() {
        const { channelId, isJoined, switchCamera } = this.state;
        return (
            <SafeAreaView style={{flex:1}}>
              <View style={{position:"absolute", top:0, left:0, bottom:0, right:0, zIndex:0}}>
                {this._renderVideo()}
              </View>
              {
                  this.state.SessionId &&
              <View style={{flex:1, zIndex:1}}>
                
                  <View style={{ flex: 0 }}>
                    <Header data={{SessionId:this.state.SessionId}} onClose={()=> this.onCloseSession()}/>
                  </View>
                
               
                    {this._renderMainView()}
               
              </View>  
               }
            </SafeAreaView>
        )
    }

  

    _renderMainView = () => {
      return(
        <View style={{flex:1}}>
          <View style={{flex:1}}>
            <View style={{padding:10}}>
              {this.state.SessionId && <ActiveCallers Id={this.state.SessionId} onPress={(item)=> this.onActiveCallStickerPress(item)}/>}
              {this.state.SessionId && <View style={{alignItems:"flex-end"}}><BadgesView Id={this.state.SessionId}/></View>}
            </View>
          {this.state.callWaitingList && <CallingStripView {...this.props} data={this.state.callWaitingList} onAccept={(item)=> this.setState({selectedCall:item})}/>}
          </View>
         <View style={{flex:0}}>
         <View style={{width:"100%"}}>
           <View style={MyStyle.Direction_Row}>
            <ScrollView>
            {this._chatView()} 
            </ScrollView>
           </View>
           
          <View style={[MyStyle.Direction_Row_Between_Center,{padding:10, backgroundColor: 'rgba(52, 52, 52, 0.8)'}]}>
              <View style={MyStyle.Search_View}>
                  <TextInput placeholder='Type something...' style={MyStyle.Text_MarginHorizontal} value={this.state.message} onChangeText={(text)=> this.setState({message:text})}/>
              </View>
              <TouchableOpacity onPress={()=> {this.onSend([{text:this.state.message}]); this.setState({message:null});}}>
                          <View>
                            <Text style={{color:"#fff"}}>Send</Text>
                          </View>
                        </TouchableOpacity>
              <View style={[MyStyle.Direction_Row_Between_Center,{justifyContent:"flex-end"}]}>
              <TouchableOpacity onPress={()=> this.onSettingPress()}>
                  <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/icons_setting.png`}} style={[MyStyle.Image_25_30, {marginRight:20}]} />
              </TouchableOpacity>
              <TouchableOpacity onPress={()=> this.onAudioEnable()}>
                  <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/${this.state.muted?"Not_Send-dis":"Not_Send"}.png`}} style={[MyStyle.Image_25_30, {marginRight:20}]} />
              </TouchableOpacity>
              <TouchableOpacity onPress={()=> this.onSwitchCamera()}>
                  <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/Video_Start.png`}} style={MyStyle.Image_25_30} />
              </TouchableOpacity>
              </View>
          </View>

            
           {/* <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/shadow_bottom.png`}} style={MyStyle.Back_Image_One} /> */}
         </View>
         </View>



         
<Modal animationType="slide" transparent={true} visible={this.state.isSettingPopup} onRequestClose={() => { this.setState({isSettingPopup:false}) }}>
<View style={MyStyle.centeredView_One}>
    <View style={[MyStyle.modalView_One, {height:450}]}>
        <View style={{alignItems:"flex-end"}}>
            <TouchableOpacity onPress={() => this.setState({isSettingPopup:false})}>
                <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/Close_1.png`}} style={MyStyle.Image_20} />
            </TouchableOpacity>
        </View>
        <View style={{padding:10}}>
         {
          this.state.SettingList && this.state.SettingList.map((item, index)=>(
            <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between", padding:10}}>
              <Text style={{fontWeight:"700"}}>{item.Title}</Text>
              <Switch
                //trackColor={{ false: "#767577", true: "#81b0ff" }}
                //thumbColor={item.Value ? "#f5dd4b" : "#f4f3f4"}
                //ios_backgroundColor="#3e3e3e"
                onValueChange={()=> this.onSettingChange(item)}
                value={item.Value}
              />
            </View>
          ))
         }
        </View>
    </View>
</View>
</Modal>

<Modal animationType="slide" transparent={true} visible={this.state.isCallStatusPopup} onRequestClose={() => { this.setState({isCallStatusPopup:false}) }}>
<View style={MyStyle.centeredView_One}>
    <View style={[MyStyle.modalView_One, {height:250}]}>
        <View style={{alignItems:"flex-end"}}>
            <TouchableOpacity onPress={() => this.setState({isCallStatusPopup:false})}>
                <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/Close_1.png`}} style={MyStyle.Image_20} />
            </TouchableOpacity>
        </View>
        {
          this.state.selectedCall &&
          <View style={{alignItems:"center", marginTop:-90}}>
            <Avatar size={100} title={this.state.selectedCall.Name} source={{uri:`${env.DynamicAssetsBaseURL}${this.state.selectedCall.ProfileImage}`}} borderColor="#ccc" borderWidth={1} rounded/>
            <View style={{marginVertical:20, alignItems:"center"}}>
              <Text style={{fontWeight:"bold"}}>{this.state.selectedCall.Name}</Text> 
            </View>
            
            {/* {
              this.state.SessionDetails &&
              <View style={{flexDirection:"row", height:88, width:Dimensions.get("window").width, backgroundColor:"#F6F6F6", alignItems:"center", justifyContent:"space-evenly"}}>
                <View style={{flexDirection:"row", alignItems:"center"}}>
                  
                    <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/phone-call.png`}} style={{width:35, height:35}} />
                  
                  <View style={{paddingHorizontal:10}}>
                    <Text style={{fontWeight:"700"}}>{parseInt(this.state.SessionDetails.Duration/60)}:{parseInt(this.state.SessionDetails.Duration%60)}</Text>
                    <Text>Call Duration</Text>
                  </View>
                </View>
                
                <View style={{flexDirection:"row", alignItems:"center"}}>
                
                    <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/coins_2.png`}} style={{width:35, height:35}} />
                  
                  <View style={{paddingHorizontal:10}}>
                    <Text style={{fontWeight:"700"}}>{parseInt(this.state.SessionDetails.CoinSpend)}</Text>
                    <Text>Coin Spent</Text>
                  </View>
                </View>

              </View>} */}

            <View style={{flexDirection:"row", width:Dimensions.get("window").width, height:100, alignItems:"center", justifyContent:"space-evenly"}}>
              {/* <TouchableOpacity>
              <View style={{width:56, height:56, borderRadius:28, borderWidth:1, borderColor:"#D9D9D9", alignItems:"center", justifyContent:"center"}}>
                <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/microphone.png`}} style={{width:24, height:24}} />
              </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={()=> this.onAudioEnable()}>
              <View style={{width:56, height:56, borderRadius:28, borderWidth:1, borderColor:"#D9D9D9", alignItems:"center", justifyContent:"center"}}>
                <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/speaker-2.png`}} style={{width:24, height:24}} />
              </View>
              </TouchableOpacity> */}

              <TouchableOpacity onPress={()=> this.onDisconnectCall()}>
              <View style={{width:56, height:56, borderRadius:28, backgroundColor:"#CE2929", alignItems:"center", justifyContent:"center"}}>
                <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/phone-down.png`}} style={{width:24, height:24}} />
              </View>
              </TouchableOpacity>
            </View> 
          </View>
        }
        
    </View>
</View>
</Modal>
         </View>
      )
    }
    
    _chatView = () => {
       
      return(
        <View style={{ flex: 1 }}>
        <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/shadow_bottom.png`}} style={MyStyle.Back_Image} />
        <View>
        {
        this.state.messages.map((item, index)=>(
        
        <View style={[MyStyle.Direction_Row, MyStyle.Text_MarginVertical]}>
            <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/Profile_Seven.png`}} style={[MyStyle.Image_40, MyStyle.Text_MarginHorizontal]} />
            <View>
                <Text style={MyStyle.Text12_Bold_White}>{item.user.name}</Text>
                <Text style={MyStyle.Text20_Regular_wHITE}>{item.text}</Text>
            </View>
        </View>
        ))
      }
            {/* <View style={[MyStyle.Direction_Row, MyStyle.Text_MarginVertical]}>
                <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/Profile_Eight.png`}} style={[MyStyle.Image_40, MyStyle.Text_MarginHorizontal]} />
                <View>
                    <Text style={MyStyle.Text12_Bold_White}>Rekha</Text>
                    <Text style={MyStyle.Text20_Regular_wHITE}>Hi</Text>
                </View>
            </View>
    
            <ImageBackground source={{uri:`${env.AssetsBaseURL}/assets/images/live/Shaddow.png`}} style={MyStyle.Image_60_293}>
                <View style={MyStyle.Direction_Row_Between_Center}>
                    <View style={[MyStyle.Direction_Row, MyStyle.Text_MarginVertical]}>
                        <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/Profile_Five.png`}} style={[MyStyle.Image_40, MyStyle.Text_MarginHorizontal]} />
                        <View>
                            <Text style={MyStyle.Text12_Bold_White}>ZESHAN</Text>
                            <Text style={MyStyle.Text20_Regular_wHITE}>Sent a Gift !</Text>
                        </View>
    
                    </View>
                    <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/Gift.png`}} style={[MyStyle.Image_46, { right: 10 }]} />
                </View>
    
            </ImageBackground>
    
    
            <View style={[MyStyle.Direction_Row, MyStyle.Text_MarginVertical]}>
                <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/Profile_Nine.png`}} style={[MyStyle.Image_40, MyStyle.Text_MarginHorizontal]} />
                <View>
                    <Text style={MyStyle.Text12_Bold_White}>Visitor234</Text>
                    <Text style={MyStyle.Text20_Regular_wHITE}>Started Watching</Text>
                </View>
            </View>
            <View style={[MyStyle.Direction_Row, MyStyle.Text_MarginVertical]}>
                <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/Profile_Eight.png`}} style={[MyStyle.Image_40, MyStyle.Text_MarginHorizontal]} />
                <View>
                    <Text style={MyStyle.Text12_Bold_White}>Visitor234</Text>
                    <Text style={MyStyle.Text20_Regular_wHITE}>Hello</Text>
                </View>
            </View> */}
    
    
        </View>
    
    </View>
      )
    }

  _renderVideo = () => {
    // return(
    //   <View style={{flex:1,heitht:Dimensions.get("window").height, backgroundColor:"#d5d5d5"}}></View>
    // )
    const { isRenderTextureView, remoteUid } = this.state;
    return (
      <View style={styles.container}>
        {isRenderTextureView ? (
          <RtcLocalView.TextureView style={styles.local} />
        ) : (
          <RtcLocalView.SurfaceView style={styles.local} />
        )}
        
        {remoteUid !== undefined && (
          <ScrollView horizontal={true} style={[styles.remoteContainer, {top:120}]}>
            {remoteUid.map((value, index) => (
              <TouchableOpacity
                key={index}
                style={styles.remote}
                onPress={this._switchRender}
              >
                {isRenderTextureView ? (
                  <RtcRemoteView.TextureView
                    style={styles.container}
                    uid={value}
                  />
                ) : (
                  <RtcRemoteView.SurfaceView
                    style={styles.container}
                    uid={value}
                    zOrderMediaOverlay={true}
                  />
                )}
              </TouchableOpacity>
            ))}

              <View style={{position:"absolute", left:0, bottom:0, right:0, width:"100%", alignItems:"center", justifyContent:"center",pading:10}}>
                <TouchableOpacity onPress={()=> this.onDisconnectCall()}>
                  <View style={{width:30, height:30, borderRadius:28, backgroundColor:"#CE2929", alignItems:"center", justifyContent:"center"}}>
                    <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/phone-down.png`}} style={{width:24, height:24}} />
                  </View>
                </TouchableOpacity>
              </View>
          </ScrollView>
        )}
      </View>
    );
  };
}


const CallingStripView = (props) => {
  const{data}=props;
  const[loading, setLoading]=useState(false);

  const onAccept = (item) => {
    if(loading) return;
    setLoading(true);
    var req={JoinSessionId:item.JoinSessionId, Status:MyExtension.LiveSessionJoin_Status.CONNECTED}
    Api.ExpertliveSessionUpdateCallStatusService(req).then( async (resp) => {
      console.log("ExpertliveSessionInitLiveService resp", resp);
      setLoading(false);
      if (resp.ResponseCode == 200) {
         props.onAccept(item);
      }
      else{
        alert(resp.ResponseMessage);
      }
    });
  }
  const onReject = (item) =>{
    if(loading) return;
    setLoading(true);
    var req={JoinSessionId:item.JoinSessionId, Status:MyExtension.LiveSessionJoin_Status.DISCONNECTED}
    Api.ExpertliveSessionUpdateCallStatusService(req).then( async (resp) => {
      console.log("ExpertliveSessionInitLiveService resp", resp);
      setLoading(false);
      if (resp.ResponseCode == 200) {
         
      }
      else{
        alert(resp.ResponseMessage);
      }
    });
  }

  return(
    <View>
      {
        data.map((item, index)=>(
          <View key={index} style={{width:"100%", backgroundColor: "rgba(255, 255, 255, 0.9)", height:60, flexDirection:"row", alignItems:"center", justifyContent:"space-evenly"}}>
            <TouchableOpacity onPress={()=>onAccept(item)}>
              <View style={{width:45, height:45, backgroundColor:"#20962C", alignItems:"center", justifyContent:"center", borderRadius:22.5}}>
                {loading && <ActivityIndicator color="blue"/> || <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/shape_13.png`}} style={MyStyle.Image_25} />}
              </View>
            </TouchableOpacity>
            <View style={{alignItems:"center", justifyContent:"center"}}>
              <View style={{flexDirection:"row"}}>
                <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/${item.Type==3 ? "speaker.png":"video-camera.png"}`}} style={{width:18, height:18}} />
                <Text style={{color:"#C72578"}}>{item.TypeText}</Text>
              </View>
              <View style={{flexDirection:"row"}}>
                <Avatar size={25} rounded title={item.Profile.Name} source={{uri:`${env.DynamicAssetsBaseURL}${item.Profile.ProfileImage}`}}/>
                <Text style={{fontWeight:"bold"}}>{item.Profile.Name}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={()=>onReject(item)}>
              <View style={{width:45, height:45, backgroundColor:"#C10202", alignItems:"center", justifyContent:"center", borderRadius:22.5}}>
                {loading && <ActivityIndicator color="blue"/> || <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/shape_14.png`}} style={{width:24, height:12}} />}
              </View>
            </TouchableOpacity>
          </View>
        ))
      }
    </View>
  )
}
 


 
  

//   render() {
//     const { channelId, isJoined, switchCamera } = this.state;
//     return (
//       <View style={styles.container}>
//         <View style={styles.top}>
//           <TextInput
//             style={styles.input}
//             onChangeText={(text) => this.setState({ channelId: text })}
//             placeholder={'Channel ID'}
//             value={channelId}
//           />
//           <Button
//             onPress={()=>isJoined ? this._leaveChannel() : this._joinChannel(ClientRole.Broadcaster)}
//             title={`${isJoined ? 'Leave' : 'Broadcaster Join'} channel`}
//           />
//           <Button
//             onPress={()=>isJoined ? this._leaveChannel() : this._joinChannel(ClientRole.Audience)}
//             title={`${isJoined ? 'Leave' : 'Audience Join'} channel`}
//           />
//         </View>
//         {Platform.OS === 'android' && (
//           <Item
//             title={'Rendered By TextureView (Default SurfaceView):'}
//             isShowSwitch
//             onSwitchValueChange={this._switchRenderView}
//           />
//         )}
//         {this._renderVideo()}
//         <View style={styles.float}>
//           <Button
//             onPress={this._switchCamera}
//             title={`Camera ${switchCamera ? 'front' : 'rear'}`}
//           />
//         </View>
//       </View>
//     );
//   }



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  float: {
    position: 'absolute',
    right: 0,
    bottom: 0,
  },
  top: {
    width: '100%',
  },
  input: {
    borderColor: 'gray',
    borderWidth: 1,
  },
  local: {
    flex: 1,
  },
  remoteContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
  },
  remote: {
    width: 120,
    height: 120,
  },
});
