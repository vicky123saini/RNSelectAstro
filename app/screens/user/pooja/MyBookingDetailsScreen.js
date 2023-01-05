import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, SafeAreaView, ScrollView, ActivityIndicator, ImageBackground, Dimensions, Alert, Linking, RefreshControl } from 'react-native';
import analytics from '@react-native-firebase/analytics';
import RazorpayCheckout from 'react-native-razorpay';
import LinearGradient from 'react-native-linear-gradient';
import MainStyles from '../../../Styles';
import { Toast, Card, cardItem, CardItem, List, ListItem, Left, Right } from 'native-base';
import AllInOneSDKManager from 'paytm_allinone_react-native';
import Overlay from 'react-native-modal-overlay';
import * as PoojaControls from './Controls';
import * as env from '../../../../env';
import * as Api from '../../../Api';
import * as Auth from '../../../Auth';
import * as Utility from '../../../Functions';
import Html from 'react-native-render-html';
import moment from 'moment';

export default class MyBookingDetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
  }

  componentDidMount = () => {
    Utility.CheckConnectivity("Please connect to WiFi or move to a better network coverage area and try again...");
    this.binddata();
    this._interval=setInterval(()=>{
      console.log("Interval", 20001);
      this.checkVideoCallStatus();
    },5000);
    Api.WhatsApp_Communication_NumberService("BookingDetailScreen").then(resp=> {
      console.log("WhatsApp_Communication_NumberService resp", resp);
      if(resp.ResponseCode == 200){
        this.setState({WhatsAppNo:resp.data.MobileNo})
      }
    });
  };

  componentWillUnmount = () => {
    clearInterval(this._interval);
  };

  binddata = () =>{
    const { Id } = this.props.route.params;
    Api.PujaMyPujaBookingsDetailsByIdService(Id).then(response => {
      console.log("PujaMyPujaBookingsDetailsByIdService resp", response);
      if (response.ResponseCode == 200) {
        this.setState({ data: response.data, pendingTimeSS: 0, refreshing:false });
        var now = moment();
        var end = moment(response.data.Puja_Start_DateTime);
        var pendingTimeSS = end.diff(now, 'seconds');

        if (pendingTimeSS > 0) {
          this.setState({ pendingTimeSS });

          this.interval = setInterval(() => {
            console.log("interval", this.state.pendingTimeSS);
            if(this.state.pendingTimeSS>0)
              this.setState({ pendingTimeSS: this.state.pendingTimeSS - 1 });
          }, 1000);
        }
         
      }
    });
  }
   
  checkVideoCallStatus = () => {
    const{Id}=this.props.route.params;
     
    Api.MandirVideoCallGetCurrentStatusService(Id).then(response=>{ 
      console.log("MandirVideoCallGetCurrentStatusService resp", response);
      if(response.ResponseCode== 200 && (response.data.Status=="IN_PROCESS" || response.data.Status=="CONNECTED")){
        this.setState(prevState => ({SessionId:response.data.SessionId, data:{...prevState.data, Puja_Status:"Open"}}));
      }
      else{
        this.setState({SessionId:null});
      }
    });
  }

  onRefresh = () => {
    this.setState({refreshing:true, data:null});
    this.binddata();
  }

  

  onCancel = () => {
    

    Alert.alert(
      "Are You Sure?",
      "As you are canceling your booking 48 hours before the Puja, we will deduct 15% cancellation charges. The Remaining amount will be reflected in your bank account in 5-6 working days.",
      [
        {
          text: "Cancel"
        },
        { text: "Ok", onPress: () =>  this.cancelConfirm()}
      ]
    );

    
  }

  cancelConfirm = () =>{
    const { Id } = this.props.route.params;
    var req={id:Id};
    Api.PujaCancel_Puja_BookingService(req).then(response=>{
      if (response.ResponseCode == 200) {
        this.binddata();
      }

      Alert.alert(
        null,
        response.ResponseMessage,
        [{
            text: "OK"
        }]
      );

    })
  }

  initVideoCall = () => {
    Utility.CheckConnectivity("Please connect to WiFi or move to a better network coverage area and try again...");
    const{Id}=this.props.route.params;
    this.props.navigation.navigate("PoojaVideoCallScreen",{Id:this.state.SessionId, MandirTransactionId:Id})
  }

  render() {

    return (
      <SafeAreaView style={{ flex: 1 }}>

        <View elevation={5} style={{ width: "100%", height: 60, backgroundColor: "#F09B39" }}>
          <View style={{ flexDirection: "row", alignItems: "center", flex: 1 }}>
            <TouchableOpacity style={{flex: 0}} onPress={() => this.props.navigation.goBack()}>
              <View style={{ width: 30, height: 54, alignItems: "center", justifyContent: "center", marginLeft: 10 }}>
                <Image style={{ width: 26, height: 27 }} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/icons/ic_back_hdpi.png` }} />
              </View>
            </TouchableOpacity>
            <View style={{flex:1, alignItems:"center", justifyContent:"center"}}>
            <Text style={{ fontSize: 18, color: "#fff" }}>Puja Order Summary</Text>
            </View>
          </View>
        </View>

        {
          this.state.data &&

          <ScrollView style={{ flex: 1 }} refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}>
            <View>
              <View style={{ flexDirection: "row", alignItems: "center", padding: 20, backgroundColor: "#fff" }}>
                <Image style={{ width: 100, height: 100, borderRadius: 10 }} resizeMode="cover" source={{ uri: `${env.DynamicAssetsBaseURL}${this.state.data.PujaImage}` }} />
                <View style={{ paddingLeft: 20 }}>
                  <Text numberOfLines={1} style={{ fontWeight: "700", fontSize: 16, marginVertical: 5 }}>{this.state.data.PujaName}</Text>
                  <Text numberOfLines={1} style={{ fontSize: 12, color: "#5f5f5f", marginVertical: 5 }}>{this.state.data.MandirName} {this.state.data.Location}</Text>
                </View>
              </View>
              <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", backgroundColor: "#fff" }}>
                <View style={{ alignItems: "flex-start", minHeight: 100 }}>
                  <Text style={{ fontWeight: "bold" }}>Date</Text>
                  <Text>{this.state.data.Puja_Start_Date}</Text>
                  <Text>{this.state.data.Puja_Start_Time}</Text>
                </View>
                <View style={{ alignItems: "flex-start", minHeight: 100 }}>
                  <Text style={{ fontWeight: "bold" }}>Duration</Text> 
                  <Text>{this.state.data.Duration}</Text>
                </View>
                <View style={{ alignItems: "flex-start", minHeight: 100 }}>
                  <Text style={{ fontWeight: "bold", color: "#20962C" }}>Payment</Text>
                  <Text style={{ color: "#20962C" }}>Complete{'\n'}(₹{this.state.data.NetAmount})</Text>
                </View>
              </View>
              <View style={{ backgroundColor: "#fff", marginTop: 10, paddingTop:20 }}>
                {
                  (this.state.data.Puja_Status == "Assign" || this.state.data.Puja_Status == "Re-Assign") && 
                  <LinearGradient colors={["#E2E3E4", "#5DDFED"]} style={{ height: 81, borderWidth: 2, borderColor: "#ccc" }}>
                    <View style={{ alignItems: "center", justifyContent: "center" }}>
                      <Text style={{ fontWeight: "bold", marginVertical: 5 }}>Your Puja Start In:- </Text>
                      <TimerView pendingTimeSS={this.state.pendingTimeSS} />
                    </View>
                  </LinearGradient>
                  ||
                  this.state.data.Puja_Status == "Open" && this.state.SessionId &&
                  <TouchableOpacity onPress={()=>this.initVideoCall()}>
                      <LinearGradient colors={["#097E06", "#5FF45C"]} style={{borderRadius:30, width:"90%", alignSelf:"center", marginBottom:20}}>
                          <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>Click To Join Puja</Text>
                      </LinearGradient>
                  </TouchableOpacity>
                  ||
                  this.state.data.Puja_Status == "Open" && this.state.SessionId==null &&
                  <LinearGradient colors={["#d5d5d5", "#d5d5d5"]} style={{borderRadius:30, width:"90%", alignSelf:"center", marginBottom:20}}>
                    <Text style={{color:"#000", padding:15, fontSize:16, textAlign:"center"}}>Please Wait While Pandit Ji Is Joining...</Text>
                  </LinearGradient>
                }
                
                 

                <View style={{ flexDirection: "row", padding: 20 }}>
                  <View>
                    <ImageBackground style={{ width: 48, height: 23 }} resizeMode="cover" source={{ uri: `${env.AssetsBaseURL}/assets/images/video-camera-red.png` }}>
                      <Text style={{ color: "#fff", marginLeft: 5, fontWeight: "400" }}>Live</Text>
                    </ImageBackground>
                  </View>
                  <View>
                    <Image style={{ width: 239, height: 173 }} resizeMode="cover" source={{ uri: `${env.AssetsBaseURL}/assets/images/shutterstock_1.png` }} />
                  </View>
                  <View>
                    {
                      this.state.data.Puja_Status == "Open" &&
                      <Text style={{ backgroundColor: "#F3F3F3", borderRadius: 7, marginLeft:-40, paddingVertical: 5, paddingHorizontal: 7, fontSize: 12 }}>JOIN LIVE PUJA</Text>
                     }
                  </View>
                </View>

                <View style={{ padding: 20 }}>
                  <Text style={{ fontWeight: "bold" }}>Check List:-</Text>
                  <Html
                    contentWidth={Dimensions.get("window").width}
                    source={{ html: this.state.data.CheckList }}
                  />
                </View>
                
                    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-evenly", marginBottom:20 }}>
                    {
                      (this.state.data.Puja_Status == "Pending" || this.state.data.Puja_Status == "Assign") && moment(this.state.data.Puja_Start_DateTime).add("hours", -48) > moment() &&
                      <PoojaControls.ButtonOrange style={{ width: 150 }} title="Reschedule" onPress={()=> this.props.navigation.replace("UserPoojaDetailsScreen",{action:"Reschedule", Id:this.state.data.PujaId, PujaTransacionId:this.state.data.Id})}/>
                      ||
                      (this.state.data.Puja_Status == "Re-Assign" || this.state.data.Puja_Status == "Canceled") &&
                      <LinearGradient colors={["#d5d5d5", "#d5d5d5"]} style={{borderRadius:12, minWidth:160}}>
                        <Text style={{color:"#000", padding:15, fontSize:16, textAlign:"center"}}>Reschedule</Text>
                      </LinearGradient>
                    }

                    {
                      (this.state.data.Puja_Status == "Pending" || this.state.data.Puja_Status == "Assign" || this.state.data.Puja_Status == "Re-Assign") && moment(this.state.data.Puja_Start_DateTime).add("hours", -48) > moment() &&
                
                      <PoojaControls.ButtonOrange style={{ width: 150 }} title="Cancel" onPress={()=> this.onCancel()}/>
                      ||
                      this.state.data.Puja_Status == "Canceled" &&
                      <LinearGradient colors={["#d5d5d5", "#d5d5d5"]} style={{borderRadius:12, minWidth:160}}>
                        <Text style={{color:"#000", padding:15, fontSize:16, textAlign:"center"}}>Cancel</Text>
                      </LinearGradient>
                    }
                    </View>

                    
                
              </View>
              <View style={{ alignItems: "center", justifyContent: "center", marginTop: 10, backgroundColor: "#fff" }}>
                <Text style={{ fontWeight: "bold", marginVertical: 10 }}>Contact Us:</Text>

                <TouchableOpacity onPress={()=>this.props.navigation.navigate("PoojaContactUsScreen", {PujaName:this.state.data.PujaName, WrittenBy:6})}>
                  <View style={{ flexDirection: "row", marginVertical: 10 }}>
                    <Image style={{ width: 42, height: 31, marginHorizontal: 10 }} resizeMode="cover" source={{ uri: `${env.AssetsBaseURL}/assets/images/mail-m.png` }} />
                    <Text style={{ backgroundColor: "#693A8E", color: "#fff", paddingVertical: 8, paddingHorizontal: 17, borderRadius: 6, marginHorizontal: 10 }}>E-Mail</Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={()=>Linking.openURL(`whatsapp://send?text=hello&phone=${this.state.WhatsAppNo}`)}> 
                  <View style={{ flexDirection: "row", alignItems:"center", marginVertical: 10 , marginBottom:20}}>
                    <Image style={{ width: 42, height: 42, marginHorizontal: 10 }} resizeMode="cover" source={{ uri: `${env.AssetsBaseURL}/assets/images/call-icn.png` }} />
                    <Text style={{}}>Whatsapp or call on:{'\n'}<Text style={{ color: "blue" }}>{this.state.WhatsAppNo}</Text></Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{ alignItems: "center", justifyContent: "center", marginTop: 10, padding:20, backgroundColor: "#fff" }}>
                <TouchableOpacity onPress={()=>Linking.openURL(`https://myastrotest.app/terms-conditions`)}>
                  <Text style={{ marginTop: 0, marginBottom: 10, color:"blue", textDecorationLine:"underline" }}>Term & Condition</Text>
                </TouchableOpacity>
                {/* <Html
                  contentWidth={Dimensions.get("window").width}
                  source={{ html: this.state.data.Terms_And_Conditions }}
                /> */}
              </View>
            </View>
          </ScrollView>
        }
      </SafeAreaView>
    );
  }
}




const TimerView = (props) => {
  return (
    <View style={{ flexDirection: "row" }}>
      <BoxGroup timeFrame="Days" value={parseInt(props.pendingTimeSS / (60 * 60 * 24))} />
      <Text style={{ fontSize: 18, fontWeight: "bold", color: "#000", paddingHorizontal: 10 }}>:</Text>
      <BoxGroup timeFrame="Hours" value={parseInt(props.pendingTimeSS / (60 * 60)) % 60} />
      <Text style={{ fontSize: 18, fontWeight: "bold", color: "#000", paddingHorizontal: 10 }}>:</Text>
      <BoxGroup timeFrame="Minutes" value={parseInt(props.pendingTimeSS / 60) % 60} />
      <Text style={{ fontSize: 18, fontWeight: "bold", color: "#000", paddingHorizontal: 10 }}>:</Text>
      <BoxGroup timeFrame="Seconds" value={props.pendingTimeSS % 60} />
    </View>
  )
}

const BoxGroup = (props) => {
  return (
    <View style={{ alignItems: "center" }}>
      <View style={{ flexDirection: "row" }}>
        <WhiteBox time={parseInt(props.value / 10)} />
        <WhiteBox time={props.value % 10} />
      </View>
      <Text style={{ fontSize: 10, fontWeight: "bold", color: "#000" }}>{props.timeFrame}</Text>
    </View>
  )
}

const WhiteBox = (props) => {
  return (
    <View style={{ width: 20, height: 26, margin: 2, backgroundColor: "#fff", borderRadius: 5, alignItems: "center", justifyContent: "center" }}>
      <Text style={{ fontSize: 16, fontWeight: "bold" }}>{props.time}</Text>
    </View>
  )
}
