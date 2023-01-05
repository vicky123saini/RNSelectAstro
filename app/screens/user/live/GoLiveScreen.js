import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image, SafeAreaView, ScrollView, StyleSheet, ImageBackground, Alert, Modal, Pressable, TextInput, Button, PermissionsAndroid, Platform, Dimensions, ActivityIndicator, } from 'react-native';
import MyStyle from './style';
import Stars from 'react-native-stars';
import * as env from '../../../../env';
import * as Api from '../../../Api';
import * as Auth from '../../../Auth';
import * as MyExtension from '../../../MyExtension';
import * as MainStyles from '../../../Styles';
import {Picker} from '../../../controls/MyPicker';
import {Live_Category, LiveSession_Status} from '../../../MyExtension';
import {ActiveCallers, Header, BadgesView} from '../../../controls/LiveSessionControls';
import { Avatar } from 'react-native-elements';
import RtcEngine, { ChannelProfile, ClientRole, RtcEngineContext, RtcLocalView, RtcRemoteView, } from 'react-native-agora';
import ChatRtmEngine from 'agora-react-native-rtm'; 

//import Item from '../../../controls/AgoraControls/basic/JoinChannelAudio/Item';
//const config = require('../../config/agora.config.json');
import {agoraConf as config} from '../../../../env';
import {mountHeaderBalanceRefresh} from '../../../Functions';

export default class GoLiveScreen extends Component {

  constructor(props) {
    super(props);
    this.state = {
      messages:[{
        _id: +new Date(),
        text:"Hello",
        user: {
          _id: +new Date(),
          name: "Me",
        },
        createdAt: new Date(),
      }],
      isJoined: false,
      remoteUid: [],
      switchCamera: true,
      switchRender: true,
      isRenderTextureView: false,
      isCallNowPopup:false,
      isDakshinaPopup:false,
      isCallStatusPopup:false,
      isFeedbackPopup:false,
      isFeedbackPopupNew:false,
      feedbackRating:1
    };
  }

  componentDidMount = () => {
    mountHeaderBalanceRefresh();
    const{Id}=this.props.route.params??{};

    console.log("Id",Id);
    this.setState({loading:true, SessionId:Id});
    Api.UserliveSessionByIdService(Id)
    .then(resp=> {
        console.log("UserliveSessionByIdService resp", resp);
        this.setState({loading:false});
        if (resp.ResponseCode == 200) {
          this.setState({data:resp.data});
        }
    });

    Api.UserliveSessionGetAllDakshinaService().then(resp=> {
      console.log("UserliveSessionGetAllDakshinaService resp", resp);
      if (resp.ResponseCode == 200) {
        this.setState({DakshinaData:resp.data});
      }
    });
  };
  
  UNSAFE_componentWillMount() {
    this._initEngine();
    //this._joinChannelTemp(ClientRole.Audience);
  }

   
  

  componentWillUnmount() {
    const channel = this.state.channel;
    this._engine?.destroy();
    clearInterval(this._interval);
    clearInterval(this._intervalSession);
    this.chatClient?.leaveChannel(channel).then(resp=> console.log("leaveChannel", resp));;
    //this.chatClient?.logout().then(resp=> console.log("chatClient logout", resp));;
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
    
    this._joinChannel(ClientRole.Audience);
    //chat
  
  };

  initCall = async () => { 
    this.setState({loading:true});
    const{Id}=this.props.route.params??{};
    var req = {
      SessionId:Id,
      Type:this.state.callType
    }
    console.log("UserliveSessionInitLiveService req", req);
    Api.UserliveSessionInitCallService(req).then((resp) => {
      console.log("UserliveSessionInitLiveService resp", resp);
      if (resp.ResponseCode == 200) {
        this.waitingCallResponse(resp.data.JoinSessionId);
        // this._engine = await RtcEngine.createWithContext(
        //   new RtcEngineContext(config.appId)
        // );
        // this._addListeners();
        // await this._engine.enableAudio();
      }
      else{
        this.setState({loading:false});
        alert(resp.ResponseMessage)
      }
    });
  }

  waitingCallResponse = (JoinSessionId) => {
    this._interval=setInterval(() => {
      //console.log("Interval", 1301);

      //console.log("UserliveSessionGetCallStatusService req", JoinSessionId);
      Api.UserliveSessionGetCallStatusService(JoinSessionId).then(async(resp) => {
        //console.log("UserliveSessionGetCallStatusService resp", resp);
        if (resp.ResponseCode == 200) {
          if(this.state.currentCallStatus && this.state.currentCallStatus==resp.data.Status) return;

          switch(resp.data.Status){
            case MyExtension.LiveSessionJoin_Status.CONNECTED :{
                this.setState({currentCallStatus:MyExtension.LiveSessionJoin_Status.CONNECTED});
                this.startCall();
                //clearInterval(this._interval);
              break;
            }
            case MyExtension.LiveSessionJoin_Status.DISCONNECTED :{
              this.setState({loading:false, selectedCall:null, callType:null});
              await this._engine.setClientRole(ClientRole.Audience);
              alert("DISCONNECTED");
              clearInterval(this._interval);
              break;
            } 
            case MyExtension.LiveSessionJoin_Status.NO_ANSWER :{
              this.setState({loading:false, selectedCall:null, isCallStatusPopup:false, callType:null});
              await this._engine.setClientRole(ClientRole.Audience);
              alert("NO_ANSWER");
              clearInterval(this._interval);
              break;
            } 
            case MyExtension.LiveSessionJoin_Status.COMPLETED :{
              this.setState({loading:false, selectedCall:null, isCallStatusPopup:false, FeedbackId:JoinSessionId, isFeedbackPopup:true, callType:null});
              await this._engine.setClientRole(ClientRole.Audience);
              //alert("COMPLETED");
              clearInterval(this._interval);
              break;
            } 
          }
        }
        else{
          this.setState({loading:false});
          alert(resp.ResponseMessage);
        }
      });
    }, 3000);
  }

  startCall = async() => {
    this.setState({loading:false, isCallNowPopup:false});
    await this._engine.setClientRole(ClientRole.Broadcaster);
    if(this.state.callType && this.state.callType==MyExtension.LiveSessionJoin_Type.AudioBroadcaster){
      await this._engine?.muteLocalVideoStream(true);
    }
    else{
      await this._engine?.muteLocalVideoStream(false);
    }
  }

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
          .catch((e) => { 
            console.warn('send failured', e);
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
      console.log('evt user', evt);
      console.log('channelMessageReceived uid user', uid);
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
        console.log('message from current channel user', text);
      }
    });
  };

  onSwitchCamera = () => {
    this._engine?.switchCamera();
  };

  onAudioEnable = () => {
    this._engine?.muteLocalAudioStream(!this.state.muted);
    this.setState(prevState=>({muted:!prevState.muted}));
  }

   sessionStatusListener = () =>{
    this._intervalSession=setInterval(() => {
      //console.log("Interval", 1302);
      //console.log("UserliveSessionGetSessionStatusService req", this.state.SessionId);
      Api.UserliveSessionGetSessionStatusService(this.state.SessionId).then((resp) => {
        //console.log("UserliveSessionGetSessionStatusService resp", resp);
        if (resp.ResponseCode == 200) {
          if(resp.data.Status!=MyExtension.LiveSession_Status.LIVE){
            clearInterval(this._intervalSession);
            this._engine?.destroy();
            this.props.navigation.replace("Live_Usr_LiveSessionListScreen");
          }
          else{
            this.setState({SessionDetails:resp.data.SessionDetails});
          }
        } 
      });
    }, 3000);
   }

 

  _joinChannel = async (Role) => {
    const{Id}=this.props.route.params??{};

    await this._engine.setClientRole(Role);

    if (Platform.OS === 'android') {
      await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
        PermissionsAndroid.PERMISSIONS.CAMERA,
      ]);
    }
    
    
    var req={
      Id:Id
    }

    console.log("UserliveSessionInitLiveService req", req);
    Api.UserliveSessionInitLiveService(req).then( async (resp) => {
      console.log("UserliveSessionInitLiveService resp", resp);
      if (resp.ResponseCode == 200) {
        this.setState({JoinSessionId:resp.JoinSessionId, channel:resp.data.channelName});
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

        //await this.chatClient?.loginV2(resp.data.uid, resp.data.tokenChat);
         
        //await this.chatClient?.joinChannel(resp.data.channelName);

        this.sessionStatusListener();
      }
    });

    // await this._engine?.joinChannel(
    //   config.token,
    //   config.channelId,
    //   null,
    //   config.uid
    // );

  };

  _joinChannelTemp = async (Role) => {
    const{Id}=this.props.route.params??{};
    var req={
      Id:Id
    }
    console.log("UserliveSessionInitLiveService req", req);
    Api.UserliveSessionInitLiveService(req).then( async (resp) => {
      console.log("UserliveSessionInitLiveService resp", resp);
      if (resp.ResponseCode == 200) {
        this.setState({JoinSessionId:resp.data.JoinSessionId});
        this.sessionStatusListener();
      }
    });
  }

 

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

  onPressLike = () => {
    this.setState({ likeLoading: true });
    var req = { SessionId: this.state.SessionId };
    console.log("UserliveSessionLikeService req", req);
    Api.UserliveSessionLikeService(req).then(resp => {
        console.log("UserliveSessionLikeService resp", resp);
        this.setState({likeLoading:false});
    });
  }

  onPressDakshina = (item) =>{
    this.setState({ dakshinaLoading: true });
    var req = { DakshinaId: item.Id, SessionId:this.state.SessionId };
    console.log("UserliveSessionCreateDakshinaTransactionService req", req);
    Api.UserliveSessionCreateDakshinaTransactionService(req).then(resp => {
        console.log("UserliveSessionCreateDakshinaTransactionService resp", resp);
        if (resp.ResponseCode == 200) {
          this.setState({dakshinaLoading:false, isDakshinaPopup:false});
            Alert.alert(null, resp.ResponseMessage);
        }
        else{
          Alert.alert(null, resp.ResponseMessage);
          this.setState({dakshinaLoading:false});
        }
    });
  }

  onCloseSession = () =>{
    var req={SessionId:this.state.SessionId};
    console.log("UserliveSessionCloseSessionService req", req);
    Api.UserliveSessionCloseSessionService(req).then(resp => {
      console.log("UserliveSessionCloseSessionService resp", resp);
      if (resp.ResponseCode == 200) {
        this._engine?.destroy();
         this.props.navigation.replace("Live_Usr_LiveSessionListScreen");
      }
      else{
        Alert.alert(null, resp.ResponseMessage);
      }
    });
  }

  onActiveCallStickerPress = async(item) =>{
    console.log("item", item);
    //{"SessionJoinId": 55, "Name": "vikas saini", "ProfileImage": "/Content/ProfileImage/canlil4qrjq.jpg", "Time": 1.1293056, "Type": 1, "UserId": 16}
    const profile=await Auth.getProfie().then(JSON.parse);
    if(profile.UserId==item.UserId){
      this.setState({isCallStatusPopup:true, selectedCall:item});
    }
  }

  onDisconnectCall = () => {
     
    var req={JoinSessionId:this.state.selectedCall.SessionJoinId, Status:MyExtension.LiveSessionJoin_Status.COMPLETED};
    console.log("UserliveSessionUpdateCallStatusService req", req);
    Api.UserliveSessionUpdateCallStatusService(req).then(async(resp)=>{
      console.log("UserliveSessionUpdateCallStatusService resp", resp);
      if (resp.ResponseCode == 200) {
        this.setState({selectedCall:null, isCallStatusPopup:false, FeedbackId:req.JoinSessionId, isFeedbackPopup:true, callType:null});
        await this._engine.setClientRole(ClientRole.Audience);
      }
    });
  }

  onSubmitFeedback = () => {
    var req={
      Id:this.state.FeedbackId,
      Rating:this.state.feedbackRating,
      Review:this.state.Review,
    }

    console.log("UserliveSessionSaveFeedbackService req", req);
    Api.UserliveSessionSaveFeedbackService(req).then(resp => {
      console.log("UserliveSessionSaveFeedbackService resp", resp);
      if (resp.ResponseCode == 200) {
        this.setState({feedbackRating:1, isFeedbackPopup:false, FeedbackId:null, Review:null});
      }
      else{
        Alert.alert(null, resp.ResponseMessage);
      }
    });
  }

  onReportUser = () =>{
    this.setState({loadingReportUser:true});
    var req={UserId:this.state.data.Profile.UserId, BlockPerson:true};
    console.log("UserliveSessionBlockUserService req", req);
    Api.UserliveSessionBlockUserService(req).then(resp => {
      this.setState({loadingReportUser:false});
      console.log("UserliveSessionBlockUserService resp", resp);
      Alert.alert(null, resp.ResponseMessage);
    });
  }

  onFeedbackPopupClose = () => {
    this.setState({feedbackRating:1, isFeedbackPopup:false, isFeedbackPopupNew:true, FeedbackId:null, Review:null});
  }

  onFeedbackPopupCloseNew = () => {
    this.setState({isFeedbackPopupNew:false});
  }

  onPressFollow = () => {
    this.setState({bookmarkLoading:true});
    var req={CreatedForUserId:this.state.data.Profile.UserId, IsBookmark:!this.state.data.Profile.IsBookmarked}
    Api.UserliveSessionSetBookmarkService(req).then(resp => {
      this.setState({bookmarkLoading:false});
      console.log("UserliveSessionSaveFeedbackService resp", resp);
      if (resp.ResponseCode == 200) {
        this.setState(prevState=>({data:{...prevState.data, Profile:{...prevState.data.Profile, IsBookmarked:!prevState.data.Profile.IsBookmarked}}}));
      }
      else{
        Alert.alert(null, resp.ResponseMessage);
      }
    });
  }

  render() {
      const { channelId, isJoined, switchCamera } = this.state;
      return (
          <SafeAreaView style={{flex:1}}>
            
            <View style={{position:"absolute", top:0, left:0, bottom:0, right:0, zIndex:0}}>
              {this._renderVideo()}
            </View>
            {
              this.state.data && this.state.SessionId && 
              <View style={{flex:1, zIndex:1}}>
                <View style={{flex:0}}>
                  <Header data={{SessionId:this.state.SessionId}} onClose={()=> this.onCloseSession()}/>
                </View>

                {this._renderMainView()}
              </View>
            } 
          </SafeAreaView>
      )
  }


_renderMainView=()=>{
  return(
    !this.state.data && <ActivityIndicator color="blue"/>||
    <View style={{flex:1}}>
      
      <View style={{padding:10}}>
          {this.state.SessionId && <ActiveCallers Id={this.state.SessionId} onPress={(item)=> this.onActiveCallStickerPress(item)}/>}
          {this.state.SessionId && <View style={{alignItems:"flex-end"}}><BadgesView Id={this.state.SessionId}/></View>}
          
          </View>
            <View style={{flex:1, justifyContent:"flex-end"}}>
              <View>
                <View style={MyStyle.Direction_Row}>
                    <View style={{flex:1}}>
                      <ScrollView>
                      {this._chatView()}
                      </ScrollView>
                    </View>
                    <View style={{flex:0}}>
                        <TouchableOpacity onPress={()=> this.setState({isCallNowPopup:true, callType:MyExtension.LiveSessionJoin_Type.AudioBroadcaster})}>
                          <ImageBackground source={{uri:`${env.AssetsBaseURL}/assets/images/live/call_123.png`}} style={{height:56,width:116}}>
                            <View style={{flex:1, alignItems:"flex-end", justifyContent:"flex-end", padding:5}}>
                              <Text style={{fontWeight:"bold", fontSize:21}}>₹{this.state.data.Profile.PerMinutesRateINR}</Text>
                              <Text>{parseInt(this.state.data.Profile.TimeLimit/60)} mins</Text>
                            </View>
                          </ImageBackground>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=> this.setState({isCallNowPopup:true, callType:MyExtension.LiveSessionJoin_Type.Broadcaster})}>
                          <ImageBackground source={{uri:`${env.AssetsBaseURL}/assets/images/live/video_12341.png`}} style={{height:90,width:116}}>
                            <View style={{flex:1, alignItems:"flex-end", justifyContent:"flex-end", padding:7, paddingBottom:15}}>
                              <Text style={{fontWeight:"bold", fontSize:21, color:"#fff"}}>₹{this.state.data.Profile.PerMinutesRateINR}</Text>
                              <Text style={{color:"#fff"}}>{parseInt(this.state.data.Profile.TimeLimit/60)} mins</Text>
                            </View>
                          </ImageBackground>
                        </TouchableOpacity>
                    </View>
                </View>
                
                    <View style={[MyStyle.Direction_Row_Between_Center, {backgroundColor: 'rgba(52, 52, 52, 0.8)', padding:10}]}>
                        <View style={MyStyle.Search_View}>
                            <TextInput placeholder='Type something...' style={MyStyle.Text_MarginHorizontal} value={this.state.message} onChangeText={(text)=> this.setState({message:text})}/>
                        </View>
                        <TouchableOpacity onPress={()=> {this.onSend([{text:this.state.message}]); this.setState({message:null});}}>
                          <View>
                            <Text style={{color:"#fff"}}>Send</Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=>this.onPressLike()}>
                          {
                            this.state.likeLoading && <ActivityIndicator color="blue"/>||
                            <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/Heart_White.png`}} style={MyStyle.Image_25_30} />
                          }
                        </TouchableOpacity>

                        <TouchableOpacity onPress={()=> this.setState({isDakshinaPopup:true})}>
                            <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/Gift_White.png`}} style={MyStyle.Image_25_30} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=> this.onAudioEnable()}>
                            <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/${this.state.muted?"Not_Send-dis":"Not_Send"}.png`}} style={MyStyle.Image_25_30} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=> this.onSwitchCamera()}>
                            <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/Video_Start.png`}} style={MyStyle.Image_25_30} />
                        </TouchableOpacity>
                    </View>

                 
                {/* <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/shadow_bottom.png`}} style={MyStyle.Back_Image_One} /> */}
              </View>

              </View>  

<Modal animationType="slide" transparent={true}
visible={this.state.isCallNowPopup} onRequestClose={() => {
     this.setState({isCallNowPopup:false})
}}>
<View style={MyStyle.centeredView_One}>
    <View style={[MyStyle.modalView_One, {height:350}]}>
        <View style={{alignItems:"flex-end"}}>
            <TouchableOpacity onPress={() => this.setState({isCallNowPopup:false})}>
                <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/Close_1.png`}} style={MyStyle.Image_20} />
            </TouchableOpacity>
        </View>
        {
          this.state.data &&
          <View style={{alignItems:"center", marginTop:-90}}>
            <Avatar size={100} title={this.state.data.Profile.Name} source={{uri:`${env.DynamicAssetsBaseURL}${this.state.data.Profile.ProfileImage}`}} borderColor="#ccc" borderWidth={1} rounded/>
            <View style={{marginVertical:20, alignItems:"center"}}>
              <Text style={{fontWeight:"bold"}}>{this.state.data.Profile.Name}</Text>
              
              <View style={MyStyle.Direction_Row}>
                <View style={MyStyle.Direction_Row_Center}>
                    <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/View.png`}} style={MyStyle.Image_20} />
                    <Text style={{}}>{this.state.data.Profile.Views}</Text>
                </View>
                <View style={[MyStyle.Direction_Row_Center, MyStyle.Text_MarginHorizontal]}>
                    <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/Path.png`}} style={MyStyle.Image_16} />
                    <Text style={{}}>{this.state.data.Profile.Likes}</Text>
                </View>
              </View>
            </View>
            
            <TouchableOpacity onPress={()=> this.initCall()}>
              <View style={{flexDirection:"row", width:Dimensions.get("window").width-40, height:55, paddingVertical:5, alignItems:"center", justifyContent:"center", backgroundColor:"#E62375", borderRadius:10}}>
                {
                  this.state.loading && <ActivityIndicator color="blue"/> ||
                  <>
                  <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/${this.state.callType==MyExtension.LiveSessionJoin_Type.AudioBroadcaster ? "shape_13":"Video_Start"}.png`}} style={MyStyle.Image_25} />
                  <View style={{paddingHorizontal:10}}>
                    <Text style={{color:"#fff", fontWeight:"700", fontSize:17}}>Call Now</Text>
                    <Text style={{color:"#fff"}}>Charges ₹ {this.state.data.Profile.PerMinutesRateINR} / min</Text>
                  </View>
                  </>
                }
              </View>
            </TouchableOpacity>
            
            <Text style={{fontSize:14, color:"#686868"}}>approx waiting {this.state.data.Profile.TimeLimit/60}:{this.state.data.Profile.TimeLimit%60} min</Text>

            <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between", marginTop:50, width:Dimensions.get("window").width-40}}>
              <View style={{alignItems:"center"}}>
                <Text>Your Wallet balance</Text>
                <View style={{flexDirection:"row", alignItems:"center", paddingHorizontal:10, justifyContent:"space-between", borderWidth:.5, borderRadius:10, borderColor:"E5E5E5", height:32, minWidth:50}}>
                  <View style={{width:20, height:20, borderRadius:10, borderWidth:2, borderColor:"#F0C839", backgroundColor:"#FFE074"}}/>
                  <Text style={[MainStyles.text,{fontSize:16,paddingHorizontal:5}]}>₹ {global.WalletDetails ? global.WalletDetails.Balance : "..."}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={()=> this.props.navigation.navigate("WalletScreen")}>
                <View style={{paddingVertical:10, paddingHorizontal:30, backgroundColor:"#E4E4E4", borderRadius:10}}>
                  <Text style={{color:"#642F87"}}>Recharge now</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        }
        
    </View>
</View>
</Modal>



<Modal animationType="slide" transparent={true}
visible={this.state.isDakshinaPopup} onRequestClose={() => {
     this.setState({isDakshinaPopup:false})
}}>
<View style={MyStyle.centeredView_One}>
    <View style={[MyStyle.modalView_One, {height:350}]}>
        <View style={{alignItems:"flex-end"}}>
            <TouchableOpacity onPress={() => this.setState({isDakshinaPopup:false})}>
                <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/Close_1.png`}} style={MyStyle.Image_20} />
            </TouchableOpacity>
        </View>
        <View style={{alignItems:"center"}}>
          <Text style={{fontWeight:"bold", fontSize:18}}>Send Gifts to show love</Text>
        </View>
        <View style={{flexDirection:"row", flexWrap:"wrap", alignContent:"center", alignItems:"center", justifyContent:"flex-start", marginBottom:10}}>
        {
          this.state.DakshinaData && this.state.DakshinaData.map((item, index)=>(
            <View key={index} style={[{width:90, height:105, margin:10}, this.state.selectDakshina && this.state.selectDakshina.Id==item.Id && {backgroundColor:"#A848F4"}]}>
              <TouchableOpacity onPress={()=> this.onPressDakshina(item)}>
                <View style={{ alignContent:"center", alignItems:"center", justifyContent:"center", padding:10}}>
                  <Image style={{width:65, height:60}} resizeMode={"stretch"} source={{uri:`${env.DynamicAssetsBaseURL}${item.ImageUrl}`}}/>
                  <Text>₹ {item.Amount}</Text>
                </View>
              </TouchableOpacity>
            </View>
          ))
        }
        </View>
    </View>
</View>
</Modal>


<Modal animationType="slide" transparent={true} visible={this.state.isCallStatusPopup} onRequestClose={() => { this.setState({isCallStatusPopup:false}) }}>
<View style={MyStyle.centeredView_One}>
    <View style={[MyStyle.modalView_One, {height:450}]}>
        <View style={{alignItems:"flex-end"}}>
            <TouchableOpacity onPress={() => this.setState({isCallStatusPopup:false})}>
                <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/Close_1.png`}} style={MyStyle.Image_20} />
            </TouchableOpacity>
        </View>
        {
          this.state.data &&
          <View style={{alignItems:"center", marginTop:-90}}>
            <Avatar size={100} title={this.state.data.Profile.Name} source={{uri:`${env.DynamicAssetsBaseURL}${this.state.data.Profile.ProfileImage}`}} borderColor="#ccc" borderWidth={1} rounded/>
            <View style={{marginVertical:20, alignItems:"center"}}>
              <Text style={{fontWeight:"bold"}}>{this.state.data.Profile.Name}</Text>
              
              <View style={MyStyle.Direction_Row}>
                <View style={MyStyle.Direction_Row_Center}>
                    <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/View.png`}} style={MyStyle.Image_20} />
                    <Text style={{}}>{this.state.data.Profile.Views}</Text>
                </View>
                <View style={[MyStyle.Direction_Row_Center, MyStyle.Text_MarginHorizontal]}>
                    <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/Path.png`}} style={MyStyle.Image_16} />
                    <Text style={{}}>{this.state.data.Profile.Likes}</Text>
                </View>
              </View>
            </View>
            
            {
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

              </View>}

            <View style={{flexDirection:"row", width:Dimensions.get("window").width, height:100, alignItems:"center", justifyContent:"space-evenly"}}>
              <TouchableOpacity>
              <View style={{width:56, height:56, borderRadius:28, borderWidth:1, borderColor:"#D9D9D9", alignItems:"center", justifyContent:"center"}}>
                <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/microphone.png`}} style={{width:24, height:24}} />
              </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={()=> this.onAudioEnable()}>
              <View style={{width:56, height:56, borderRadius:28, borderWidth:1, borderColor:"#D9D9D9", alignItems:"center", justifyContent:"center"}}>
                <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/speaker-2.png`}} style={{width:24, height:24}} />
              </View>
              </TouchableOpacity>

              <TouchableOpacity onPress={()=> this.onDisconnectCall()}>
              <View style={{width:56, height:56, borderRadius:28, backgroundColor:"#CE2929", alignItems:"center", justifyContent:"center"}}>
                <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/phone-down.png`}} style={{width:24, height:24}} />
              </View>
              </TouchableOpacity>
            </View>
            
            

            <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between", marginTop:50, width:Dimensions.get("window").width-40}}>
              <View style={{alignItems:"center"}}>
                <Text>Your Wallet balance</Text>
                <View style={{flexDirection:"row", alignItems:"center", paddingHorizontal:10, justifyContent:"space-between", borderWidth:.5, borderRadius:10, borderColor:"E5E5E5", height:32, minWidth:50}}>
                  <View style={{width:20, height:20, borderRadius:10, borderWidth:2, borderColor:"#F0C839", backgroundColor:"#FFE074"}}/>
                  <Text style={[MainStyles.text,{fontSize:16,paddingHorizontal:5}]}>₹ {global.WalletDetails ? global.WalletDetails.Balance : "..."}</Text>
                </View>
              </View>
              <TouchableOpacity onPress={()=> this.props.navigation.navigate("WalletScreen")}>
                <View style={{paddingVertical:10, paddingHorizontal:30, backgroundColor:"#E4E4E4", borderRadius:10}}>
                  <Text style={{color:"#642F87"}}>Recharge now</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        }
        
    </View>
</View>
</Modal>

<Modal animationType="slide" transparent={true} visible={this.state.isFeedbackPopup} onRequestClose={() => this.onFeedbackPopupClose()}>
  <View style={{flex:1, backgroundColor: 'rgba(52, 52, 52, 0.8)', alignItems:"center", justifyContent:"center"}}>
  <View style={{backgroundColor:"#fff", margin:20, padding:10, borderRadius:20}}>
    <View style={{alignItems:"flex-end"}}>
        <TouchableOpacity onPress={() => this.onFeedbackPopupClose()}>
            <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/Close_1.png`}} style={MyStyle.Image_20} />
        </TouchableOpacity>
    </View>
    {
          this.state.data &&
          <View>
          <View style={{alignItems:"center", marginTop:-80}}>
            <Avatar size={100} title={this.state.data.Profile.Name} source={{uri:`${env.DynamicAssetsBaseURL}${this.state.data.Profile.ProfileImage}`}} borderColor="#ccc" borderWidth={1} rounded/>
            <View style={{marginVertical:20, alignItems:"center"}}>
              <Text style={{fontWeight:"bold"}}>{this.state.data.Profile.Name}</Text>
              
              <View style={MyStyle.Direction_Row}>
                <View style={MyStyle.Direction_Row_Center}>
                    <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/View.png`}} style={MyStyle.Image_20} />
                    <Text style={{}}>{this.state.data.Profile.Views}</Text>
                </View>
                <View style={[MyStyle.Direction_Row_Center, MyStyle.Text_MarginHorizontal]}>
                    <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/Path.png`}} style={MyStyle.Image_16} />
                    <Text style={{}}>{this.state.data.Profile.Likes}</Text>
                </View>
              </View>
            </View>
            </View>
            
            <View style={{}}>
            <View style={{width:"100%", flexDirection:"row", alignItems:"center", justifyContent:"space-between", marginTop:10}}>
              
              <TouchableOpacity style={{width:"48%"}} onPress={()=> this.onPressFollow()}>
              {
                this.state.bookmarkLoading && <ActivityIndicator color="blue"/> ||
                <View style={{ paddingVertical:10, paddingHorizontal:30, backgroundColor:"#E62375", borderRadius:10, flexDirection:"row", alignItems:"center", justifyContent:"center"}}>
                  <Text style={{color:"#FFF", marginRight:10}}>{this.state.data.Profile.IsBookmarked ? "Following":"Follow"}</Text>
                  <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/Star-white.png`}} style={MyStyle.Image_16} />
                </View>
              }
              </TouchableOpacity>

              <TouchableOpacity style={{width:"48%"}}>
                <View style={{paddingVertical:10, paddingHorizontal:30, backgroundColor:"#E4E4E4", borderRadius:10, flexDirection:"row", alignItems:"center", justifyContent:"center"}}>
                  <Text style={{color:"#642F87", marginRight:10}}>Message</Text>
                  <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/msg.png`}} style={MyStyle.Image_16} />
                </View>
              </TouchableOpacity>
            </View>

            <View style={{marginTop:30}}>
              <Stars
                display={this.state.feedbackRating}
                update={(val)=>{this.setState({feedbackRating:val})}}
                spacing={5}
                count={5}
                starSize={30}
                fullStar={{uri:`${env.AssetsBaseURL}/assets/images/live/star-active.png`}}
                emptyStar={{uri:`${env.AssetsBaseURL}/assets/images/live/star.png`}}
                halfStar={{uri:`${env.AssetsBaseURL}/assets/images/live/star-half.png`}}
              />
            </View>

            <View style={{height:100, backgroundColor:"#E8E8E8", borderRadius:20, marginTop:10}}>
              <TextInput style={{color:"#000"}} value={this.state.Review} multiline={true} onChangeText={(text)=> this.setState({Review:text})}/>
            </View>
            
            <View style={{marginTop:20, alignItems:"center"}}>
              <TouchableOpacity onPress={()=> this.onSubmitFeedback()}>
                <View style={{paddingVertical:10, paddingHorizontal:30, backgroundColor:"#000000", borderRadius:10}}>
                  <Text style={{color:"#FFF"}}>Submit Review</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={{marginTop:20}}>
              <TouchableOpacity onPress={()=> this.onReportUser()}>
                <View style={{flexDirection:"row", alignItems:"center", padding:10}}>
                  <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/flag.png`}} style={MyStyle.Image_16} />
                  <Text style={{marginLeft:10}}>Report User</Text>
                </View>
              </TouchableOpacity>
            </View>

            </View>
          </View>
        }
  </View>
  </View>
  </Modal>


  <Modal animationType="slide" transparent={true} visible={this.state.isFeedbackPopupNew} onRequestClose={() => this.onFeedbackPopupCloseNew()}>
  <View style={{flex:1, backgroundColor: 'rgba(52, 52, 52, 0.8)', alignItems:"center", justifyContent:"center"}}>
  <View style={{backgroundColor:"#fff", margin:20, padding:10, borderRadius:20}}>
    <View style={{alignItems:"flex-end"}}>
        <TouchableOpacity onPress={() => this.onFeedbackPopupCloseNew()}>
            <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/Close_1.png`}} style={MyStyle.Image_20} />
        </TouchableOpacity>
    </View>
    {
          this.state.data &&
          <View>
          <View style={{alignItems:"center", marginTop:-80}}>
            <Avatar size={100} title={this.state.data.Profile.Name} source={{uri:`${env.DynamicAssetsBaseURL}${this.state.data.Profile.ProfileImage}`}} borderColor="#ccc" borderWidth={1} rounded/>
            <View style={{marginVertical:20, alignItems:"center"}}>
              <Text style={{fontWeight:"bold"}}>{this.state.data.Profile.Name}</Text>
              
              <View style={MyStyle.Direction_Row}>
                <View style={MyStyle.Direction_Row_Center}>
                    <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/View.png`}} style={MyStyle.Image_20} />
                    <Text style={{}}>{this.state.data.Profile.Views}</Text>
                </View>
                <View style={[MyStyle.Direction_Row_Center, MyStyle.Text_MarginHorizontal]}>
                    <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/Path.png`}} style={MyStyle.Image_16} />
                    <Text style={{}}>{this.state.data.Profile.Likes}</Text>
                </View>
              </View>
            </View>
            </View>
            
            <View style={{}}>
              <View style={{width:"100%", alignItems:"center"}}>
                <Text style={{textAlign:"center", paddingHorizontal:20}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. </Text>
                <TouchableOpacity style={{width:"48%"}} onPress={()=> this.onPressFollow()}>
                  {
                    this.state.bookmarkLoading && <ActivityIndicator color="blue"/> ||
                    <View style={{ paddingVertical:10, paddingHorizontal:30, backgroundColor:"#E62375", borderRadius:10, flexDirection:"row", alignItems:"center", justifyContent:"center", marginVertical:20}}>
                      <Text style={{color:"#FFF", marginRight:10}}>{this.state.data.Profile.IsBookmarked ? "Following":"Follow"}</Text>
                      <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/Star-white.png`}} style={MyStyle.Image_16} />
                    </View>
                  }
                </TouchableOpacity> 
              </View> 
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
      <View style={[styles.container, {position:"relative"}]}>
        {remoteUid !== undefined && (
          <View style={{flex:1}}>
            {remoteUid.map((value, index) => (
              <TouchableOpacity
                key={index}
                style={{width:Dimensions.get("window").width, height:Dimensions.get("window").height-100}}
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
                    zOrderMediaOverlay={false}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}
        {
          remoteUid !== undefined && this.state.callType && this.state.callType==MyExtension.LiveSessionJoin_Type.Broadcaster &&
            <View style={[styles.remote, {zIndex:1, position:"absolute", right:60, top:130}]}>
              {isRenderTextureView ? (
                <RtcLocalView.TextureView style={styles.local} />
              ) : (
                <RtcLocalView.SurfaceView style={styles.local} />
              )}
              <View style={{position:"absolute", left:0, bottom:0, right:0, width:"100%", alignItems:"center", justifyContent:"center",pading:10}}>
                <TouchableOpacity onPress={()=> this.onDisconnectCall()}>
                  <View style={{width:30, height:30, borderRadius:28, backgroundColor:"#CE2929", alignItems:"center", justifyContent:"center"}}>
                    <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/phone-down.png`}} style={{width:24, height:24}} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
        }
      </View>
    );
  };
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
