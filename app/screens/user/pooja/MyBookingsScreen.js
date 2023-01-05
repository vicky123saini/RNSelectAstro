import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, SafeAreaView, ScrollView, Dimensions, ActivityIndicator, ImageBackground, Modal, Linking, RefreshControl } from 'react-native';
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
import Stars from 'react-native-stars';

export default class MyBookingsScreen extends Component {
  constructor(props) {
    super(props); 
    this.state = {
      modalVisible:false,
      selectedTabIndex:0
    };
  }

  componentDidMount = () => {
    Utility.CheckConnectivity("Please connect to WiFi or move to a better network coverage area and try again...");
    this.binddata();
  };

  binddata = () =>{
    Api.PujaMyPujaBookingsCouponService(1, 100).then(response=>{
      console.log("PujaMyPujaBookingsCouponService resp",response);
        if(response.ResponseCode == 200){
          this.setState({data:response.data, refreshing:false});
        }
    });
  }

  onRefresh = () => {
    this.setState({data:[], refreshing:true}, ()=> this.binddata());
  }

  onReviewSubmit = () => {
    var req={"AppointmentId":this.state.selectedItem.Id, "Rating":this.state.SelectedRate, "Review":this.state.Review}
    const currentSelectedRate=this.state.SelectedRate;
    Api.PujaReview_Rating_Puja_BookingService(req).then(response=>{
      if(response.ResponseCode == 200){
        this.setState({modalVisible:false, selectedItem:null, SelectedRate:1, Review:null}, ()=> this.binddata());
        if(currentSelectedRate>3){
          this.setState({showMessageBox:true});
        }
        else{
          this.props.navigation.navigate("UserFeedbackScreen")
        }
      }
    });
  }
  
  onGoToPlayStore = () => {
    this.setState({showMessageBox:false});
    Linking.openURL(Platform.OS=="ios" ? "https://apps.apple.com/in/app/myastrotest-app/id1613296409" : "market://details?id=com.rnselectastro");
  }

  render() {
    return (
      <SafeAreaView style={{flex:1}}>
        <Overlay childrenWrapperStyle={{ borderRadius: 30 }} visible={this.state.showMessageBox} onClose={()=> this.setState({showMessageBox:false})} closeOnTouchOutside>
            <View style={{padding:0, backgroundColor:"#fff", width:"100%", alignContent:"center", alignItems:"center", justifyContent:"center"}}>
                <Image style={{ width: 100, height: 100 }} resizeMode="cover" source={{ uri:  `${env.AssetsBaseURL}/assets/images/namaskar.png` }} />
                <Text style={[{ marginBottom: 20, fontWeight:"bold", color:"#000", marginTop:20 }]}>We Feel Honored!!</Text>
                <Text style={[{ marginBottom: 20, textAlign:"center" }]}>It will be amazing if you can review us</Text>
      
            
                <TouchableOpacity onPress={()=>this.onGoToPlayStore()}>
                    <LinearGradient colors={["#FF8767", "#FF65A0"]} style={{borderRadius:30, width:200, marginBottom:20, alignItems:"center"}}>
                        <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>Go To {Platform.OS=="ios" ? "App":"Play"} Store</Text>
                    </LinearGradient>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=> this.setState({showMessageBox:false})}>
                    <Text style={{color:"#000", padding:15, fontSize:16, fontWeight:"bold", textAlign:"center", textDecorationLine:"underline", alignSelf:"flex-end"}}>Later</Text>
                </TouchableOpacity>
              
            </View>
        </Overlay>

        <View elevation={5} style={{ width: "100%", height:100, backgroundColor: "#F09B39"}}>
          <View style={{flexDirection: "row", alignItems: "center", flex:1, marginTop:20}}>
              <TouchableOpacity style={{flex:0}} onPress={() => this.props.navigation.goBack()}>
                  <View style={{ width: 30, height: 54, alignItems: "center", justifyContent: "center", marginLeft:10 }}>
                      <Image style={{ width: 26, height: 27 }} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/icons/ic_back_hdpi.png`}} />
                  </View>
              </TouchableOpacity>
              <View style={{flex:1, alignItems:"center", justifyContent:"center"}}>
                <Text style={{fontSize:18, color:"#fff"}}>My Puja Bookings</Text>
              </View>
          </View>
          <View style={{flexDirection:"row", flex:0}}>
            <TouchableOpacity onPress={()=> this.setState({selectedTabIndex:0})}><View style={[{},this.state.selectedTabIndex==0 &&{borderBottomWidth:2, borderBottomColor:"#fff"}]}><Text style={{color:"#fff", fontSize:16, padding:10}}>Upcoming</Text></View></TouchableOpacity>
            <TouchableOpacity onPress={()=> this.setState({selectedTabIndex:1})}><View style={[{},this.state.selectedTabIndex==1 &&{borderBottomWidth:2, borderBottomColor:"#fff"}]}><Text style={{color:"#fff", fontSize:16, padding:10}}>Ongoing</Text></View></TouchableOpacity>
            <TouchableOpacity onPress={()=> this.setState({selectedTabIndex:2})}><View style={[{},this.state.selectedTabIndex==2 &&{borderBottomWidth:2, borderBottomColor:"#fff"}]}><Text style={{color:"#fff", fontSize:16, padding:10}}>Past Bookings</Text></View></TouchableOpacity>
          </View>
        </View>
 
 
        <ScrollView style={{flex:1, backgroundColor: "#fff"}}  refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />} >

          {
            this.state.selectedTabIndex==0 &&
            <View style={{padding:20, backgroundColor:"#fff", alignItems:"flex-start"}}>
            {/* <Text style={{backgroundColor:"#E5E5E5", paddingVertical:7, paddingHorizontal:15, borderRadius:15, marginVertical:10}}>Upcoming</Text> */}
            <View style={{width:"100%"}}>
              {
                this.state.data && this.state.data.filter(o=>o.Type=='Upcoming').map((item, index)=>(
                  <TouchableOpacity onPress={()=> this.props.navigation.navigate("MyBookingDetailsScreen", {Id:item.Id})}>
                    <PoojaControls.PoojaBookingCard item={item} isUpcoming/>
                  </TouchableOpacity>
                ))
              } 
            </View>
          </View> 
          }

{
            this.state.selectedTabIndex==1 &&
            <View style={{padding:20, backgroundColor:"#fff", alignItems:"flex-start"}}>
            {/* <Text style={{backgroundColor:"#E5E5E5", paddingVertical:7, paddingHorizontal:15, borderRadius:15, marginVertical:10}}>Upcoming</Text> */}
            <View style={{width:"100%"}}>
              {
                this.state.data && this.state.data.filter(o=>o.Type=='Ongoing').map((item, index)=>(
                  <TouchableOpacity onPress={()=> this.props.navigation.navigate("MyBookingDetailsScreen", {Id:item.Id})}>
                    <PoojaControls.PoojaBookingCard item={item} isUpcoming/>
                  </TouchableOpacity>
                ))
              } 
            </View>
          </View> 
          }
 
 {
   this.state.selectedTabIndex==2 &&

          <View style={{padding:20, backgroundColor:"#fff", alignItems:"flex-start"}}>
            {/* <Text style={{backgroundColor:"#E5E5E5", paddingVertical:7, paddingHorizontal:15, borderRadius:15, marginVertical:10}}>Past Bookings</Text> */}
            <View style={{width:"100%"}}>
              {
                this.state.data && this.state.data.filter(o=>o.Type=='Past Bookings').map((item, index)=>(
                  <TouchableOpacity onPress={()=> this.props.navigation.navigate("MyBookingDetailsScreen", {Id:item.Id})}>
                    <PoojaControls.PoojaBookingCard item={item} onRateNow={()=> this.setState({selectedItem:item, modalVisible:true})}/>
                  </TouchableOpacity>
                ))
              } 
            </View>
          </View>
 }
        </ScrollView>

        
        <Modal animationType="slide" transparent={true} visible={this.state.modalVisible}>
          
          <View style={styles.modalView}>
            <View style={{flexDirection:"row", padding:10}}>
              <Text style={{flex:1, fontWeight:"bold", fontSize:20, textAlign:"center"}}>Share your feedback</Text>
              <TouchableOpacity style={{flex:0}} onPress={()=>this.setState({modalVisible:false, selectedItem:null})}><Text style={{padding:10}}>X</Text></TouchableOpacity>
            </View>
            <View>
              <Text style={{textAlign:"center", fontSize:16, paddingHorizontal:30}}>Tell us how satisfied are you feeling with your Pooja experience on Select Astro</Text>

              {/* <View style={{flexDirection:"row", alignItems:"center", justifyContent:"center", marginVertical:20}}>
                  <Image style={{width:35, height:35 }} resizeMode="cover" source={{uri:`${env.AssetsBaseURL}/assets/images/star-active.png`}}/>
                  <Image style={{width:35, height:35 }} resizeMode="cover" source={{uri:`${env.AssetsBaseURL}/assets/images/star-active.png`}}/>
                  <Image style={{width:35, height:35 }} resizeMode="cover" source={{uri:`${env.AssetsBaseURL}/assets/images/star-active.png`}}/>
                  <Image style={{width:35, height:35 }} resizeMode="cover" source={{uri:`${env.AssetsBaseURL}/assets/images/star-active.png`}}/>
                  <Image style={{width:35, height:35 }} resizeMode="cover" source={{uri:`${env.AssetsBaseURL}/assets/images/star.png`}}/>
              </View> */}
              <View style={{marginVertical:20}}>
                <Stars
                    default={1}
                    update={(val)=>this.setState({SelectedRate:val})}
                    spacing={8}
                    count={5}
                    starSize={35}
                  
                    fullStar={{ uri: `${env.AssetsBaseURL}/assets/images/icons/ic_star_l_1_mdpi.png` }}
                    emptyStar={{ uri: `${env.AssetsBaseURL}/assets/images/icons/ic_star_l_0_mdpi.png` }}
                    halfStar={{ uri: `${env.AssetsBaseURL}/assets/images/star-half.png` }}
                />
              </View>
              <View style={{borderColor:"#F3F3F3", borderWidth:1, height:176, borderRadius:15, margin:20}}>
                  <TextInput style={{width:"100%", height:50, color:"#000", paddingHorizontal:10}} multiline={true} value={this.state.Review} onChangeText={(text)=> this.setState({Review:text})} placeholder="Write a review" placeholderTextColor={"#000"}/>
              </View>
              <View style={{padding:10, alignItems:"center"}}>
                <PoojaControls.ButtonOrange style={{width:Dimensions.get("window").width-20}} title="Submit" onPress={()=>this.onReviewSubmit()}/>
              </View>
            </View>
          </View>
          
        </Modal>

      </SafeAreaView>
    );
  }
}

 



const styles = StyleSheet.create({
  wrapper: {height:200},
  slide: {
    //flex: 1
    height:200
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position:"relative"
  },
  modalView: {
    width:"100%",
    position:"absolute",
    bottom:0,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
     
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  }
});