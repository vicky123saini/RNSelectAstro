import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, SafeAreaView } from 'react-native';
import analytics from '@react-native-firebase/analytics';
import { Switch } from 'react-native-switch';
import {Card} from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import MainStyles from '../../Styles';
import moment from 'moment';
import * as env from '../../../env';
import * as Api from '../../Api';
import * as Auth from '../../Auth';
import * as ExpertControls from '../../controls/ExpertControls';
import {Singular} from 'singular-react-native';


export default class AnalyticsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      FilterTypeList:[
        {Id:0, Name:"Call Logs", Selected:true, View:<CallLogsScreen {...this.props}/>},
        {Id:1, Name:"Review/Rating", Selected:false, View:<ReviewAndRatingScreen {...this.props}/>},
      ]
    };
  }

  componentDidMount = () => {
    analytics().logEvent("Astrologer_Analytics_Page");
  };
  
  render() {
     
    return (
      <SafeAreaView>
        <View style={{ height: 50 }}>
          <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
            <View style={{ flexDirection: "row", padding: 10 }}>
              {
                this.state.FilterTypeList.map((item, index) => ( 
                  <TouchableOpacity key={index} onPress={() => this.setState(prevState=>({FilterTypeList:[...prevState.FilterTypeList.map(o=>{o.Selected=o.Id==item.Id; return o;})]}))}>
                    <LinearGradient colors={item.Selected ? ["#7162FC", "#B542F2"]:["#fff", "#fff"]} style={[{ borderRadius: 30, marginLeft: 10 }]}>
                      <Text style={[MainStyles.text, { paddingHorizontal: 20, paddingVertical: 3 }, item.Selected ? { color:"#fff" }:{color:"#000"}]}>{item.Name}</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                ))
              }
            </View>
          </ScrollView>
        </View>
        {
          (this.state.FilterTypeList.find(item=>item.Selected).View)
        }
      </SafeAreaView>
    );
  }
}


class CallLogsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  } 

  componentDidMount = () => {
    
    this.bindData();
    this._unsubscribe1 = this.props.navigation.addListener('focus', () => {      
      this.onRefresh();
    });
    this._unsubscribe2 = this.props.navigation.addListener('blur', () => {
       
    });
  };

  componentWillUnmount = () =>{
    this._unsubscribe1();
    this._unsubscribe2();
  }

  bindData = () => {
    console.log("GetCallLogsService req");
    Api.GetCallLogsService().then(resp => {
      console.log("GetCallLogsService resp", resp);
      if (resp.ResponseCode == 200) {
          this.setState({CallLogs:resp.data, refreshing:false});
      }
    });
  }

  onRefresh = () => {
    this.setState({refreshing:true, CallLogs:null});
    this.bindData();
  }

  render() {
    return (
      <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}>
      {
        this.state.CallLogs &&
    
        <View style={{paddingTop:10, backgroundColor:"#fff"}}>
            <View style={{width:"90%", alignSelf:"center"}}>
                {
                    this.state.CallLogs.map((item, index)=>(
                        <Card key={index}>
                            <View style={{flexDirection:"row", padding:10}}>
                                <View style={{flex:1}}>
                                    <Image style={{width:30, height:30, margin:10}} resizeMode="stretch" source={{uri:`${env.DynamicAssetsBaseURL}${item.FromUser_ProfileImage}`}}/>
                                </View>
                                <View style={{flex:3, padding:10}}>
                                    <View style={{flexDirection:"row"}}>
                                        <Text style={[Styles.listText1,{}]}>{item.FromUser_Name}</Text>
                                        {
                                            item.CallMode=="VoiceCall" && <Image style={{width:10, height:10, margin:5}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/phone-active.png`}}/> ||
                                            item.CallMode=="VideoCall" && <Image style={{width:10, height:10, margin:5}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/video-active.png`}}/> ||
                                            item.CallMode=="Chat" && <Image style={{width:10, height:10, margin:5}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/chat-active.png`}}/>
                                        }
                                    </View>
                                    <Text style={[Styles.listText2,{}]}>{item.StartDate} {item.StartTime}</Text>
                                    <Text>{moment(item.StartDate +" "+item.StartTime, "DD/MM/YY hh:mm A").format()}</Text>
                                    <Text style={[Styles.listText2,{}]}>{item.Duration}</Text>
                                    {
                                        item.CallMode=="VoiceCall" && <Text style={[Styles.listText2,{fontWeight:"bold", marginTop:5}]}>Voice Call</Text> ||
                                        item.CallMode=="VideoCall" && <Text style={[Styles.listText2,{fontWeight:"bold", marginTop:5}]}>Video Call</Text> ||
                                        item.CallMode=="Chat" && <Text style={[Styles.listText2,{fontWeight:"bold", marginTop:5}]}>Chat</Text>
                                    }
                                </View>
                                <View style={{flex:3.5, padding:10, alineItem:"center", justifyContent:"center"}}>
                                    {/* <Text style={[Styles.listText2,{}]}>Charges</Text>
                                    <Text style={[Styles.listText1,{fontSize:16}]}>₹{item.Charges}</Text> */}
                                    {
                                       item.ServiceType==Auth.CallDetail_ServiceType.CHAT &&
                                       <TouchableOpacity onPress={()=>this.props.navigation.navigate("ChatScreen", {Id:item.SessionId, ViewOnly:true})}>
                                           <LinearGradient colors={["#7162FC", "#B542F2"]} style={{borderRadius:20, width:120, marginBottom:20}}>
                                               <Text style={{color:"#fff", paddingHorizontal:2, paddingVertical:2, fontSize:14, textAlign:"center"}}>CHAT HISTORY</Text>
                                           </LinearGradient>
                                       </TouchableOpacity>
                                    }
                                    {
                                    !item.IsFeedbackDone_Astro && 
                                    <TouchableOpacity onPress={()=>this.props.navigation.navigate("ExpertFeedbackScreen",{data:{SessionId:item.SessionId, Customer_Name:item.FromUser_Name, Time_Of_Call:moment(item.StartDate +" "+item.StartTime, "DD/MM/YY hh:mm A").format(), Duration:item.Duration}, Step:0})}>
                                        <LinearGradient colors={["#FF8767", "#FF65A0"]} style={{borderRadius:20, width:120}}>
                                            <Text style={{color:"#fff", paddingHorizontal:7, paddingVertical:2, fontSize:14, textAlign:"center"}}>FEEDBACK</Text>
                                        </LinearGradient>
                                    </TouchableOpacity> 
                                    }
                                </View>
                            </View>
                        </Card>
                    ))
                }
            </View>
        </View>
        }
        
      </ScrollView>
    );
  }
}


class ReviewAndRatingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount = () => {

    this.bindData();
    this._unsubscribe1 = this.props.navigation.addListener('focus', () => {      
      this.onRefresh();
    });
    this._unsubscribe2 = this.props.navigation.addListener('blur', () => {
       
    });
  };

  componentWillUnmount = () =>{
    this._unsubscribe1();
    this._unsubscribe2();
  }

  bindData = () => {
    console.log("GetAstroReviewAndRatingsService req");
    Api.GetAstroReviewAndRatingsService().then(resp => {
      console.log("GetAstroReviewAndRatingsService resp", resp);
      if (resp.ResponseCode == 200) {
          this.setState({Feedbacks:resp.data, refreshing:false});
      }
    });
  }

  onRefresh = () => {
    this.setState({refreshing:true, Feedbacks:null});
    this.bindData();
  }

  render() {
    return (
      <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}>
      {
        this.state.Feedbacks &&
    
        <View style={{paddingTop:10, backgroundColor:"#fff"}}>
            <View style={{width:"90%", alignSelf:"center"}}>
                {
                    this.state.Feedbacks.map((item, index)=>(
                      <TouchableOpacity key={index} onPress={()=> this.setState({FeedbackId:item.AppointmentId, ParentId:item.Id})}>
                        <Card>
                          <ExpertControls.ReviewView item={item}/>
                        </Card>
                      </TouchableOpacity>
                    ))
                }
            </View>
        </View>
        }
        {
          this.state.ParentId && <ExpertControls.ExpertFeedbackReplyForm feedbackId={this.state.FeedbackId} parentId={this.state.ParentId} onSubmit={()=>this.setState({FeedbackId:null, ParentId:null}, ()=> this.onRefresh())} onClose={()=>this.setState({FeedbackId:null, ParentId:null}, ()=> this.onRefresh())}/>
        }
      </ScrollView>
    );
  }
}


const Styles = StyleSheet.create({
  boxTex1:{...MainStyles.text, color:"#fff", paddingTop:10},
  listText1:{...MainStyles.text, fontSize:14, color:"#131313"},
  listText2:{...MainStyles.text, fontSize:12, color:"#656565"}
})