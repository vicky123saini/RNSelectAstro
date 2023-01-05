import React, { Component, useState, useEffect } from 'react';
import { BackHandler, View, Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, ScrollView, Alert, Modal, ImageBackground, Keyboard, Platform } from 'react-native';
import { Avatar } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import BackgroundTimer from 'react-native-background-timer';
import Overlay from 'react-native-modal-overlay';
import LinearGradient from 'react-native-linear-gradient';
import analytics from '@react-native-firebase/analytics';
import * as env from '../../env';
import * as Api from '../Api';
import * as Auth from '../Auth';
import * as MyControls from './user/Controls';
import moment from 'moment';
import {Singular} from 'singular-react-native';

export default class ChatScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages:[],
      timer:0,
      keyboardHeight:0
    };
    
  }


      componentDidMount = () => {
        analytics().logEvent("Chat");
        const{Id, ViewOnly}=this.props.route.params;

        if(!ViewOnly){
          this.connect();
        }
        this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => !this.confirmDisconnect());

        this.setState({SessionId:Id});

        Auth.getProfie().then(profile => JSON.parse(profile)).then(profile=>{
        console.log("profile", JSON.stringify(profile));
        this.setState({profile: profile});


        Api.GetChatDetailsService(Id).then(resp=>{
          console.log("GetChatDetailsService", resp);
          const rprofile=resp.data.UserProfile; 
          var messages=resp.data.Messages.map(o=> {
            try{
              var newMessage=JSON.parse(o.Message);
              newMessage.MessageType=o.MessageType;
              return newMessage;
            }
            catch{
              console.error("err Chat");
            }
          });
          console.log("messages", messages);
          this.setState({timer:resp.data.TimeLimit, messages:messages});
          
          if(profile.UserType==Auth.UserType.ENDUSER){
            this.setState({ToProfile:resp.data.ExpertProfile}); 
            //this.pushFirstMessage(rprofile, null);
          }
          else{
            this.setState({ToProfile:resp.data.UserProfile});
            //this.pushFirstMessage(rprofile, resp.data.UserProfile.UserId)
            //const rprofile=resp.data.ExpertProfile; 
          }
        });

        // var firstmessage={"message":"Hi"};
        
        if(!ViewOnly){
          this._interval = BackgroundTimer.setInterval(() => {

            console.log("Intervaleee", 1001, this.state.timer);
            if(this.state.IsInited){
              this.setState(prevState => ({timer:prevState.timer>0?prevState.timer-1:0}));
            }
            if(this.state.IsInited && this.state.timer==0){
              this.sessionClose();
            }
            else if(this.state.IsInited && this.state.timer==60 && this.state.profile && this.state.profile.UserType==Auth.UserType.ENDUSER){
              const message={_id:this.state.profile.UserId,image:"/Content/App/assets/images/one_minute_left_for_chat.gif",time:moment()};
              this.setState({messages:[...this.state.messages, message]});
            }

          }, 1000);

          this._interval2 = setInterval(() => {
            console.log("Interval", 1002);
              Api.GetChatCurrentStatusService(this.state.SessionId).then(resp=>{
                if (resp.ResponseCode == 200) {
                    if(resp.data.Status != Auth.CallDetail_Status.IN_PROCESS && resp.data.Status != Auth.CallDetail_Status.QUEUED){
                      this.sessionClose();
                    }
                    this.setState({timer:resp.data.TimeLimit, IsInited:resp.data.IsInited});
                }
              });
          }, 5000);
        }

        if(profile.UserType.includes(Auth.UserType.ASTROLOGER)){
          console.log("GetBannersService req");
          Api.GetBannersService("CHAT_STICK").then(resp => {
            console.log("GetBannersService resp", resp);
            if (resp.ResponseCode == 200) {
              this.setState({ BannerList: resp.data });
            }
          });
        }
      })
      .catch(()=> console.error("err componentDidMount ChatScreen"));

      this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e)=> this.setState({isKeybordOpen:true, keyboardHeight:e.endCoordinates.height-30}));
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', ()=> this.setState({isKeybordOpen:false, keyboardHeight:0}));
      }




      connect = () => {
        if(this.setState.closeSession)return;

        this.setState({connecting:true});
         
        var websocketUrl=`${env.WEBSOCKET_BASE_URL}api/v1/Chat/Connectroom/${this.props.route.params.Id}`;
        console.log("websocketUrl", websocketUrl);
        var tt=this;
        
        this.ws = new WebSocket(websocketUrl);
        this.ws.binaryType="blob";

        this.ws.onopen = () => {
          // on connecting, do nothing but log it to the console
          console.log('connected');
          tt.setState({connecting:false});
        }

        this.ws.onmessage = evt => {
          //console.log("onmessage", JSON.stringify(evt.data))
          
          var reader = new FileReader();
          reader.onload = () => {
            try{
              const resp=reader.result.toString();
              console.log("reader.result*********", resp); 
              var firesJson = resp.substring(0, resp.indexOf("$#$"));
              const message=JSON.parse(firesJson);

              if(message.typing){
                this.setState({typing:true});
                setTimeout(() => {
                  tt.setState({typing:false});
                },2000);
              }
              else if(message.ResponseCode!=null){
                if (resp.ResponseCode == 200) {
                  if(resp.data.Status != Auth.CallDetail_Status.IN_PROCESS && resp.data.Status != Auth.CallDetail_Status.QUEUED){
                    this.sessionClose();
                  }
                  this.setState({timer:resp.data.IsInited ? resp.data.TimeLimit : 0, IsInited:resp.data.IsInited});
                }
              }
              else if(message.message!=null){
                this.setState({messages:[...this.state.messages, message]});
                this.setState({typing:false});
              }
            }
            catch(e){console.error("err reader.onload err"+e)}
          }
          reader.readAsText(evt.data);
        }

        
 
        this.ws.onclose = e => {
          // connection closed
          if(this.state.closeSession) return;

          tt.reconnectTimer=setTimeout(() => {
            if(!tt.state.connecting)
              tt.connect();
          }, 2000);
        }

      }

      componentWillUnmount = () => {
        const{Id, ViewOnly}=this.props.route.params;
        if(!ViewOnly){
        BackgroundTimer.clearInterval(this._interval);
        clearInterval(this._interval2);
        this.backHandler.remove();
        }
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
      };
      

      // pushFirstMessage = (rprofile, senderId) => {
      //   const message1=`Gender:${rprofile.Gender}\nBirthday:${rprofile.DateOfBirth}\nBirth Time:${rprofile.TimeOfBirth}\nBirth Location:${rprofile.PlaceOfBirth}`;
      //   this.setState(prevState => ({messages:[...prevState.messages, {_id:senderId, message:message1, time:moment()}]}));
      //   var tt=this;
      //   setTimeout(() => {
      //     //const message2=`Is Your given Details Correct?\nDo you have to check these details?`;
      //     const message2 = `Hello/ Namaskar/ Pranaam\nPlease confirm if above details are correct and please let me know the question you want to ask.`
      //     tt.setState(prevState => ({messages:[...prevState.messages, {_id:senderId, message:message2, time:moment()}]}));
      //   }, 3000);
      // }


      // componentWillUnmount = () => {
      //   this.disconnect();
      // };
      

      _ChatNow=(req)=>{
        
        console.log("_ChatNow req", req)
        if(!req.message && !req.image) return;
        const message={
          _id:req.UserId??this.state.profile.UserId, 
          message:req.message,
          image:req.image,
          time:moment()
        }

        this.setState(prevState=>({
          messages:[...prevState.messages, message], 
          currentMessage:null
        }));

        if(this.ws!=null){
          console.log("send", JSON.stringify(message));
          this.ws.send(JSON.stringify(message)+"$#$");
        }

        var req={SessionId: this.state.SessionId, Message:JSON.stringify(message)}
        Api.ChatPushMessageService(req);
      }

      confirmDisconnect = () => {
        const{Id, ViewOnly}=this.props.route.params;
        console.log("ViewOnly", ViewOnly);

        if(!ViewOnly){
          this.setState({isConfirmDisconnect:true});
          return false;
        }
        else{
          this.props.navigation.goBack();
          return true;
        }
      }

      onConfirmDisconnect = () => {
        console.log("onConfirmDisconnect");
        this.setState({isConfirmDisconnect:false});
        this.disconnect();
      }

      disconnect =()=>{
        console.log("disconnect");
        var req={Status:Auth.CallDetail_Status.COMPLETED, SessionId:this.state.SessionId};
        Api.UpdateChatStatusService(req);
        this.sessionClose();
        
      }

      sessionClose = async () =>{
        console.log("sessionClose");
        //this.props.navigation.pop();
        clearTimeout(this.reconnectTimer);
        this.setState({closeSession:true});
        this.ws.close();
        this.ws = null;
        
        BackgroundTimer.clearInterval(this._interval);
        clearInterval(this._interval2);
        
        const profile = await Auth.getProfie().then(profile=> JSON.parse(profile)).catch(()=> console.error("err chatScreen getProfile"));
        if(profile.UserType==Auth.UserType.ENDUSER)
           //this.props.navigation.replace("ExpertDetailsScreen", {Id:this.state.ToProfile.UserId});
           this.props.navigation.replace("UserHomeScreen");
         else if(profile.UserType==Auth.UserType.ASTROLOGER)
           this.props.navigation.replace("ExpertHomeScreen");
      }

      onDakshinaSelect = (item) => {
        this.setState({selectedDakshina:item, isDakshinaConfirmation:true});
      }

      onDakshinaConfirm = () => {
        const{Id}=this.props.route.params;
        const item = this.state.selectedDakshina;

        var req={DakshinaId:item.Id, CallId:Id};
        console.log("CreateDakshinaTransactionService req", req);
        Api.CreateDakshinaTransactionService(req).then(resp=>{
          console.log("CreateDakshinaTransactionService resp", resp);
          this.setState({isDakshinaConfirmation:false, selectedDakshina:null});
          if(resp.ResponseCode==200){
            if(item){
              var message="Rs. "+item.Amount+" Dakshina";
              this._ChatNow({"message":message});

              setTimeout(() => {
                this._ChatNow({"image":item.OtherImageUrl, UserId:this.state.ToProfile.UserId});  
              }, 1000);
            }
            this.setState(prevState=>({IsDakshinaViewOpen:!prevState.IsDakshinaViewOpen}))
          }
          else{
            Alert.alert(
              null,
              resp.ResponseMessage,
              [{
                  text: "OK"
              }]
            );
          }
        });
      }

      onClearChat = () => {
        Alert.alert(
          null,
          "Are You Sure?\nYour Complete Chat History Will Be Deleted !",
          [{
            text:"Cancel"
          },{
            text: "OK",
            onPress:()=> this.onClearChatConfirm()
          }]
        );
      }

      onClearChatConfirm = () => {
        const{Id}=this.props.route.params;
        var req={SessionId:Id}

        Api.ClearChatHistoryService(req).then(resp=>{
          console.log("ClearChatHistoryService resp", resp);
          if(resp.ResponseCode==200){
            this.setState({messages:null});
          }
           
          Alert.alert(
            null,
            resp.ResponseMessage,
            [{
                text: "OK"
            }]
          );
           
        });
      }

      render() {
        const{Id, ViewOnly}=this.props.route.params;
        return (
          <SafeAreaView style={{ flex: 1 }}>
            <Overlay childrenWrapperStyle={{ borderRadius: 30 }} visible={this.state.isConfirmDisconnect}>
                <ImageBackground style={{width:"100%", height:200}} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/bg-popup.png` }}>
                <View style={{ padding: 20, justifyContent: "center" }}>
                    <Text style={[{ marginBottom: 20, fontWeight:"bold", textAlign:"center"}]}>Are you sure you want to exit?</Text> 

                    <View style={{alignItems:"center", alignContent:"center"}}>
                        <TouchableOpacity onPress={()=> this.setState({isConfirmDisconnect:null})}>
                            <LinearGradient colors={["#FF8767", "#FF65A0"]} style={{borderRadius:30, width:220, marginBottom:20}}>
                                <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>No, Continue</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    <View style={{alignItems:"center", alignContent:"center"}}>
                        <TouchableOpacity onPress={()=> this.onConfirmDisconnect()}>
                            <LinearGradient colors={["#ccc", "#ddd"]} style={{borderRadius:30, width:220, marginBottom:20}}>
                                <Text style={{color:"#000", padding:15, fontSize:16, textAlign:"center"}}>Yes, Exit</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View> 
                </ImageBackground>
            </Overlay>

            <Overlay childrenWrapperStyle={{ borderRadius: 30 }} visible={this.state.isDakshinaConfirmation}>
                <ImageBackground style={{width:"100%", height:200}} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/bg-popup.png` }}>
                <View style={{ padding: 20, justifyContent: "center" }}>
                    <Text style={[{ marginBottom: 20, fontWeight:"bold", textAlign:"center"}]}>Thank you! You have decided to give ₹{this.state.selectedDakshina ? this.state.selectedDakshina.Amount : ""} dakshina to {this.state.ToProfile ? this.state.ToProfile.Name :""}</Text> 

                    <View style={{alignItems:"center", alignContent:"center"}}>
                        <TouchableOpacity onPress={()=> this.onDakshinaConfirm()}>
                            <LinearGradient colors={["#FF8767", "#FF65A0"]} style={{borderRadius:30, width:220, marginBottom:20}}>
                                <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>Confirm</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
 
                    <View style={{alignItems:"center", alignContent:"center"}}>
                        <TouchableOpacity onPress={()=> this.setState({isDakshinaConfirmation:false, selectedDakshina:null, IsDakshinaViewOpen:false})}>
                            <LinearGradient colors={["#ccc", "#ddd"]} style={{borderRadius:30, width:220, marginBottom:20}}>
                                <Text style={{color:"#000", padding:15, fontSize:16, textAlign:"center"}}>Later</Text>
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
                {
                  this.state.ToProfile &&
                  <View style={{ alignItems: "flex-start" }}>
                    <View style={{flexDirection:"row", alignItems:"center"}}>
                      <Avatar size={50} title={this.state.ToProfile.Name} source={{uri:`${env.DynamicAssetsBaseURL}${this.state.ToProfile.ProfileImage}`}} borderColor="#ccc" borderWidth={1} rounded marginHorizontal={10} titleStyle={{color:"#ccc"}}/>
                      <Text style={{fontWeight:"700"}}>{this.state.ToProfile.Name}</Text>
                    </View>
                  </View>
                }
              </View>

            {
            !ViewOnly &&
              <View style={{flex:0, alignItems:"center" }}>
                  <Text style={{fontSize:20, fontWeight:"700"}}>{parseInt(this.state.timer/60)}:{parseInt(this.state.timer%60)}</Text>
                  <TouchableOpacity onPress={()=> this.confirmDisconnect()}>
                    <Text style={{paddingVertical:10, paddingHorizontal:20, borderWidth:1, borderRadius:20}}>Disconnect</Text>
                  </TouchableOpacity>
              </View>
              ||
              this.state.profile && this.state.profile.UserType==Auth.UserType.ENDUSER &&
              <View style={{flex:0, alignItems:"center" }}>
                  <TouchableOpacity onPress={()=> this.props.navigation.navigate("ExpertDetailsScreen", { Id: this.state.ToProfile.UserId })}>
                    <Text style={{paddingVertical:10, paddingHorizontal:20, borderWidth:1, borderRadius:20}}>Consult</Text>
                  </TouchableOpacity>
              </View>
              
            }
            </View>
            
         
            {
              this.state.profile &&
              <View style={{flex:1, backgroundColor:"#fff"}}>
                 
                <KeyboardAwareScrollView flex={1} extraScrollHeight={0} enableOnAndroid={false} keyboardShouldPersistTaps='handled' ref={ref => {this.scrollView = ref}} onContentSizeChange={() => this.scrollView.scrollToEnd({animated: true})}>  
                

                <View style={{marginBottom:50}}>
                    <View style={{flex:1, padding:20, marginBottom:20}}>
                    {
                        this.state.messages && this.state.messages.map((item, index)=>(
                          <View>
                            {
                              item.MessageType==Auth.Chat_MessageType.INFO &&
                              <>
                              <View style={{flex:1, alignItems:"center", justifyContent:"center"}}>
                                <Text style={{padding:10, margin:10, backgroundColor:"#d5d5d5", borderRadius:10}}>{item.message}</Text>
                              </View>
                              <View style={{alignItems:"center"}}>
                              <Text style={{padding:10}}>{moment(item.time).format("HH:mm")}</Text>
                            </View>
                            </>
                              ||

                            
                            <>
                            <View key={index} style={{flexDirection:"row"}}>
                              {
                                this.state.ToProfile && item._id==this.state.ToProfile.UserId && this.state.ToProfile.ProfileImage &&
                                <View style={{flex:1, marginTop:20}}><Avatar size={50} rounded source={{uri:`${env.DynamicAssetsBaseURL}${this.state.ToProfile.ProfileImage}`}} /></View>
                                // ||
                                // item._id==null &&
                                // <View style={{flex:1, marginTop:20}}><Avatar size={50} rounded source={{uri:`${env.AssetsBaseURL}/assets/images/photo-border.png`}} /></View>
                              }
                              
                              <View style={[{flex:6}, item._id==this.state.profile.UserId?{alignItems:"flex-end"}:{alignItems:"flex-start"}]}>
                                <View style={[{padding:20, margin:10, borderWidth:1, borderRadius:20}, item._id==this.state.profile.UserId?{alignContent:"flex-end", alignItems:"flex-end", backgroundColor:"#fff", borderColor:"#F8F8F8"}:{borderColor:"#F8F8F8",  backgroundColor:"#F8F8F8", alignItems:"flex-start"}]}>
                                    {
                                        item.message && <Text>{item.message}</Text> ||
                                        item.image && <Image style={{width:150, height:150}} resizeMode="stretch" source={{uri:`${env.DynamicAssetsBaseURL}${item.image}`}}/>
                                    }
                                </View>
                              </View>

                              {
                                item._id==this.state.profile.UserId &&
                                <View style={{flex:1, marginTop:10}}><Avatar size={50} rounded source={{uri:`${env.DynamicAssetsBaseURL}${this.state.profile.ProfileImage}`}} /></View>
                              }
                            </View>
                            
                            <View style={item._id==this.state.profile.UserId ? {alignItems:"flex-end"} : {alignItems:"flex-start"}}>
                              <Text style={{padding:10}}>{moment(item.time).format("HH:mm")}</Text>
                            </View>
                            </>
                            }
                          </View>
                        ))
                    }
                    </View>
                </View>

               
                </KeyboardAwareScrollView>
                
                {
                  (!ViewOnly || this.state.profile.UserType==Auth.UserType.ASTROLOGER) &&
                
                  <View style={[Platform.OS=="ios"?{bottom:this.state.keyboardHeight}:{flex:0}]}>
                  <View style={{height:50}}>
                    {
                      this.state.typing && 
                    //   <View style={{paddingHorizontal:10}}>
                    //     <Image style={{width:45, height:12}} resizeMode={"stretch"} source={{uri:`${env.AssetsBaseURL}/assets/images/tenor.gif`}}/>
                    //   </View>
                      <Text style={[{padding:10, fontWeight:"bold", color:"#000"}]}>Typing...</Text>
                    }
                  </View>
                  
                 
                    <View style={{flexDirection:"row",alignContent:"center", alignItems:"center", justifyContent:"center", padding:5, borderTopColor:"#F3F3F3", borderTopWidth:1}}>
                        {
                          this.state.profile && this.state.profile.UserType==Auth.UserType.ENDUSER &&
                          <View style={{flex:0}}>
                            <TouchableOpacity onPress={()=> this.setState({IsDakshinaViewOpen:true})}>
                              <Image style={{width:34, height:31}} resizeMode={"stretch"} source={{uri:`${env.AssetsBaseURL}/assets/images/flower.png`}}/>
                            </TouchableOpacity>
                          </View>
                        }

                        {
                          this.state.profile && this.state.profile.UserType==Auth.UserType.ASTROLOGER &&
                          <View style={{flex:0}}>
                            <TouchableOpacity onPress={()=> this.setState({IsChatStickerViewOpen:true})}>
                              <Image style={{width:34, height:31}} resizeMode={"stretch"} source={{uri:`${env.AssetsBaseURL}/assets/images/flower.png`}}/>
                            </TouchableOpacity>
                          </View>
                        }

                        <View style={{flex:1, justifyContent:"center", borderWidth:1, borderRadius:10, borderColor:"#ccc", marginHorizontal:5}}>
                          <TextInput style={{padding:10, height: 50, backgroundColor:"#E8E8E8", borderRadius:10, color:"#000"}} value={this.state.currentMessage} onChangeText={(text)=>this.setState({currentMessage: text})}></TextInput>
                        </View>
                        <TouchableOpacity style={{flex:0}} onPress={()=> this._ChatNow({"message":this.state.currentMessage})}>
                          <Image style={{width:34, height:31}} resizeMode={"stretch"} source={{uri:`${env.AssetsBaseURL}/assets/images/btn-send.png`}}/>
                        </TouchableOpacity>
                    </View>
                    
                </View>
                }

{
              ViewOnly &&
              <View style={{alignItems:"center" }}>
                <TouchableOpacity onPress={()=> this.onClearChat()}>
                <LinearGradient colors={["#989898", "#686868"]} style={{borderRadius:30, width:150, marginBottom:15}}>
                  <Text style={{color:"#fff",padding:15, fontSize:16, textAlign:"center"}}>Delete Chat</Text>
                  </LinearGradient>
                </TouchableOpacity>
              </View>
               
            }
              </View>
            }
            
          </View>
          {
            this.state.profile && this.state.profile.UserType.includes(Auth.UserType.ENDUSER) &&
            this.state.IsDakshinaViewOpen && 
            
            <Modal
              animationType="slide"
              transparent={true} 
              visible={true}
            >
              <View style={{flex:1, marginTop:Dimensions.get("window").height/2, borderTopLeftRadius:20, borderTopRightRadius:20, backgroundColor:"#F3F3F3", alignContent:"center", alignItems:"center", justifyContent:"flex-start"}}>
              <TouchableOpacity style={{alignSelf:"flex-end"}} onPress={()=>this.setState(prevState=>({IsDakshinaViewOpen:!prevState.IsDakshinaViewOpen}))}>
                <Text style={{padding:10, backgroundColor:"#FF8767", borderRadius:20, margin:10, fontWeight:"700"}}>X</Text>
              </TouchableOpacity>
              
                <MyControls.DakshinaView onSelect={(item)=> this.onDakshinaSelect(item)} walletBalanceValidate={false} multiSelectonEnable={false}/>
              </View>
            </Modal>
          }


          {
            this.state.profile && this.state.profile.UserType.includes(Auth.UserType.ASTROLOGER) &&
            this.state.IsChatStickerViewOpen && 
            
            <Modal
              animationType="slide"
              transparent={true} 
              visible={true}
            >
              <View style={{flex:1, marginTop:Dimensions.get("window").height/2, borderTopLeftRadius:20, borderTopRightRadius:20, backgroundColor:"#F3F3F3", alignContent:"center", alignItems:"center", justifyContent:"flex-start"}}>
              <TouchableOpacity style={{alignSelf:"flex-end"}} onPress={()=>this.setState(prevState=>({IsChatStickerViewOpen:!prevState.IsChatStickerViewOpen}))}>
                <Text style={{padding:10, backgroundColor:"#FF8767", borderRadius:20, margin:10, fontWeight:"700"}}>X</Text>
              </TouchableOpacity>
                <ScrollView style={{flex:1}}>
                  <View style={{flexDirection:"row", flexWrap:"wrap", flex:1, padding:10}}>
                {
                  this.state.BannerList && this.state.BannerList.map((item, index)=>(
                  <View key={index} style={{ width: (Dimensions.get("window").width-40)/2, margin:5, height:100 }}>
                    <TouchableOpacity key={index} onPress={() => this._ChatNow({"image":item.BannerUrl})}>
                        <View style={{backgroundColor:"#ffe"}}>
                          <Image style={{ width: "100%", height:100 }} resizeMode="stretch" source={{ uri: `${env.DynamicAssetsBaseURL}${item.BannerUrl}` }} />
                        </View>
                      </TouchableOpacity> 
                  </View>
                  ))
                }
                </View>
                </ScrollView>
              </View>
            </Modal>
          }
          </SafeAreaView>
        );
      }
    }




     