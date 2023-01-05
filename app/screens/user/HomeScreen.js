import React, { Component } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TextInput, Image, ScrollView, Linking, ActivityIndicator, Dimensions, RefreshControl, Platform } from 'react-native';
import Overlay from 'react-native-modal-overlay';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import HoroscopeView from '../../controls/HoroscopeView';
import {FeedbackForm, LessThen60Popup} from '../../controls/ExpertControls';
import MainStyles from '../../Styles';
import {mountHeaderBalanceRefresh} from '../../Functions';
import {Blogs_Type} from '../../MyExtension';
import {AllHoroList} from './horoscope/AllHoroscopeScreen';
import analytics from '@react-native-firebase/analytics';
import {TimerTickTock} from './ChakraScreen';
import * as UserControls from './Controls';
import * as env from '../../../env';
import * as Api from '../../Api';
import * as Auth from '../../Auth';
import * as Utility from '../../Functions';
import * as PoojaControls from './pooja/Controls';
import {Singular} from 'singular-react-native';
import moment from 'moment';
import { SliderBox } from "react-native-image-slider-box";


export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading:true
    };

    this.imgBanner = require("../../assets/images/Group-2028.png");
    this.lvBanner = require("../../assets/images/lst1.png")
  }


  componentDidMount = () => {
    Utility.CheckConnectivity("Please connect to WiFi or move to a better network coverage area and try again...");

    Auth.getProfie().then(profile=> JSON.parse(profile)).then(profile=> this.setState({profile})).catch(()=> console.error("err getProfie HomeScreen"));
    analytics().logEvent("Dashboard");
    Singular.event("Dashboard");
    try{
      //push notification service
      if(global.PushNotification){
        try{
          var rdata=JSON.parse(JSON.stringify(global.PushNotification));
          global.PushNotification=null;

          let ActionParams={}
          if(rdata.ActionParams!=null && rdata.ActionParams!=""){
              ActionParams=JSON.parse(rdata.ActionParams);
          }
          this.props.navigation.navigate(rdata.ActionName, ActionParams)
        }
        catch{
           console.error("err componentDidMount homeScreen")
        }
      }
    }
    catch{}

    if(Platform.OS=="ios"){
      Api.GetAppSettingByKetService(Auth.AppSettingKey.PDF_View_IOS_Enable).then(resp=>{
        this.setState({PDF_View_IOS_Enable:resp.data && resp.data != "False" && resp.data != "false"});
      });
      Api.GetAppSettingByKetService(Auth.AppSettingKey.Horoscope_IOS_Enable).then(resp=>{
        this.setState({Horoscope_IOS_Enable:resp.data && resp.data != "False" && resp.data != "false"})
      });
    }
    else{
      this.setState({PDF_View_IOS_Enable:true});
      this.setState({Horoscope_IOS_Enable:true});
    }

     


    this.bindData();
    this._unsubscribe1 = this.props.navigation.addListener('focus', () => {      
      //this._interval=mountHeaderBalanceRefresh();
      //this.onRefresh(); stop auto refress as discuss with himanshu on 27.Dec.2021
      mountHeaderBalanceRefresh();
    });
    this._unsubscribe2 = this.props.navigation.addListener('blur', () => {
      //clearInterval(this._interval);
      clearInterval(this.secondInterval);
      this.secondInterval=null;
    });
    
  }

  componentWillUnmount = () =>{
    this._unsubscribe1();
    this._unsubscribe2();
    clearInterval(this.secondInterval);
    this.secondInterval=null;
  }

  onRefresh = () => {
    clearInterval(this.secondInterval);
    this.secondInterval=null;
    this.setState({refreshing:true, SkillList:null, HomePageBannerList:null, MyHoroscope:null, BlogList:null});
    this.bindData();
  }

  bindData = () =>{

    // console.log("GetSkillsService req");
    // var p1=Api.GetSkillsService().then(resp => {
    //   console.log("GetSkillsService resp", resp);
    //   if (resp.ResponseCode == 200) {
    //     this.setState({ SkillList: resp.data });
    //   }
    // });

    console.log("HomePageBannersService req");
    var p2=Api.HomePageBannersService().then(resp => {
      console.log("HomePageBannersService resp", resp);
      if (resp.ResponseCode == 200) {
        this.setState({ HomePageBannerList: resp.data });

        Auth.isLowBalancePopupView().then(resp2=>{
          if(resp2){
            console.log("GetBannersService req");
            Api.GetBannersService("LOW_BAL_BA").then(resp3 => {
              console.log("GetBannersService resp", resp3);
              if (resp3.ResponseCode == 200 && resp3.data && resp3.data.length>0) {
                this.setState({ LowBalanceBanner: resp3.data[0] }); 
                return;
              }
            });
          }
        });

        var welcomePopup=this.state.HomePageBannerList.filter(item => item.BannerType == "WELCOME");
        Auth.isWelcomePopup().then(resp2=>{
          console.log("isWelcomePopup resp2", resp2)
          if(resp2 && welcomePopup!=null && welcomePopup.length>0){
            this.setState({ WelcomePopupData: welcomePopup[0] });
          }
        })
        
        
      }
    }); 

    
    

    console.log("GetMyHoroscopeFullService req");
    Api.GetMyHoroscopeFullService().then(resp => {
      console.log("GetMyHoroscopeFullService resp", resp);
      if (resp.ResponseCode == 200) {
        this.setState({ MyHoroscope: resp.data });
      }
      else if(resp.ResponseCode==401){
        Auth.Logout();
        this.props.navigation.replace("LoginScreen");
      }
    });

   

  
    console.log("GetBlogsForHomeService req");
    Api.GetBlogsForHomeService().then(resp => {
      console.log("GetBlogsForHomeService resp", resp);
      if (resp.ResponseCode == 200) {
        this.setState({ BlogList: resp.data});
      }
    });
    
 
    console.log("GetFeedbackPendingStatusService req");
    Api.GetFeedbackPendingStatusService().then(resp => {
      console.log("GetFeedbackPendingStatusService resp", resp);
      //this.setState({ FeedbackId: 1});
      if (resp.ResponseCode == 200) {
        if(resp.data.isLess60SecCall){
          this.setState({isLess60SecCall:true, serviceType:resp.data.ServiceType});
      }
      else {
          console.log("GetBannersService req");
          Api.GetBannersService("LOW_BAL_BA").then(resp3 => {
            console.log("GetBannersService resp", resp3);
            if (resp3.ResponseCode == 200 && resp3.data && resp3.data.length>0) {
              this.setState({ LowBalanceBanner: resp3.data[0] });
            }
            else{
              this.setState({ FeedbackId: resp.data.FeedbackId});
            }
          });
        }
      }
    });

    Api.GetChakraTodayStatusService().then(resp => {
      console.log("GetChakraTodayStatusService resp", resp);
      if (resp.ResponseCode == 200) {
        this.setState({ ChakraStatus: resp.data});
        if(resp.data && resp.data.isSpinned){
          this.nextAppearInTimer();
        }
      }
    });

    Api.GetAppSettingByKetService(Auth.AppSettingKey.Enable_Chakra_Popup).then(resp=>{
      console.log("Enable_Chakra_Popup",resp);
      this.setState({Enable_Chakra_Popup:resp.data=="True"});
    });

    Api.GetMandirRecommendedPujaListService().then(response=>{
      console.log("GetMandirRecommendedPujaListService", response);
      if (response != null && response.ResponseCode == 200) {
          this.setState({RecommendedPujaList:response.data});
      }
      else if (response != null && response.ResponseCode == 401) {
        Auth.RemoveSession({ navigation: this.props.navigation })
      }
    });
    
    Promise.all([p2]).then(()=> this.setState({loading:false, refreshing:false}));
  }

  nextAppearInTimer = () => {
   if(this.secondInterval==null){
      this.secondInterval = setInterval(() => {
        console.log("Interval", 1101);
        this.setState(prevState=>({ChakraStatus:{...prevState.ChakraStatus, nextAppearIn:prevState.ChakraStatus.nextAppearIn-1 }}))
        //this.setState(prevState=>({ChakraStatus:{...prevState.ChakraStatus,nextAppearIn:0 }}))
      }, 1000);
    }
  }

  onSpinNow = () =>{
    Singular.event("HomeScreen_SpinNow");
    this.props.navigation.replace("ChakraScreen");
  }
 

  render() {
    return (
      this.state.loading &&
      <View style={{flex:1, justifyContent:"center",}}>
         <ActivityIndicator color="#0000ff"/>
        
      </View> ||
      <SafeAreaView style={{flex:1}}>

        <UserControls.MainHeader {...this.props} style={{flex:0}}/>
      <ScrollView style={{flex:1, marginTop:10, backgroundColor:"#fff"}} refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}>

      {
        this.state.ChakraStatus && !this.state.ChakraStatus.isSpinned && this.state.Enable_Chakra_Popup &&
        <UserControls.ChakraPopup onSpinNow={()=> this.onSpinNow()} onClose={()=> Singular.event("HomeScreen_SpinLater")}/>
      }
        
        <Auth.UpdateAvaliable/>
        
        {
          this.state.isLess60SecCall && <LessThen60Popup serviceType={this.state.serviceType} onClose={()=> this.setState({isLess60SecCall:false},()=>this.props.navigation.navigate("ExpertListScreen"))}/> ||
          this.state.FeedbackId && <FeedbackForm feedbackId={this.state.FeedbackId} onClose={()=> this.setState({FeedbackId:null})} onSubmit={(Rating)=> { if(Rating<4)this.props.navigation.navigate("UserFeedbackScreen"); this.setState({FeedbackId:null}); }}/>
        }
       

       <UserControls.SessionStrip {...this.props}/>
       <UserControls.LivePujaStrip {...this.props}/>
       
       {
         this.state.LowBalanceBanner && 
         <UserControls.LowBalPopup navigation={this.props.navigation} data={this.state.LowBalanceBanner}/>
         ||
         this.state.WelcomePopupData &&
         <UserControls.WelcomePopup navigation={this.props.navigation} data={this.state.WelcomePopupData}/>
       }
        
        {/* <UserControls.VideoBannerView type={1}/> */}

       {
         this.state.HomePageBannerList && this.state.HomePageBannerList.filter(item => item.BannerType == "HOME3").length>0 &&
         <View style={{ backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#DCDCDC" }}>
            <UserControls.KundlySliderView {...this.props} data={this.state.HomePageBannerList.filter(item => item.BannerType == "HOME3")}/>
          </View>
       }
 
        
       {
          this.state.HomePageBannerList && this.state.HomePageBannerList.filter(item => item.BannerType == "HOME1").length>0 &&
        <View style={{ backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#DCDCDC" }}>
          <View style={{marginVertical:5}}>
            {/* <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: "row" }}>
                {
                  this.state.HomePageBannerList && this.state.HomePageBannerList.filter(item => item.BannerType == "HOME1").map((item, index) => {
                    return (
                      <TouchableOpacity key={index} onPress={() => {Singular.eventWithArgs("HomeScreen_BannerClick",{Id: item.Id}); this.props.navigation.navigate(item.ActionName, item.ActionParams);}}>
                        <View style={{backgroundColor:"#ffe"}}>
                          <Image style={{ width: 333, height: 162, marginLeft:10 }} resizeMode="stretch" source={{ uri: `${env.DynamicAssetsBaseURL}${item.BannerUrl}` }} />
                        </View>
                      </TouchableOpacity>
                    )
                  })
                }

              </View>
            </ScrollView> */}
            {
              this.state.HomePageBannerList &&
              <SliderBox
                autoplayInterval={5000}
                images={this.state.HomePageBannerList.filter(item => item.BannerType == "HOME1").map(o=>{return `${env.DynamicAssetsBaseURL}${o.BannerUrl}`})}
                onCurrentImagePressed={index => {
                  try{
                    var item=this.state.HomePageBannerList.filter(item => item.BannerType == "HOME1")[index];
                    Singular.eventWithArgs("HomeScreen_BannerClick",{Id: item.Id}); 
                    this.props.navigation.navigate(item.ActionName, JSON.parse(item.ActionParams));
                  }
                  catch{
                    console.error("err navigate homescreen");
                  }
                }}
                autoplay
                circleLoop
              />
              
            }
          </View>
        </View>
        }

 
<TouchableOpacity onPress={()=> this.props.navigation.navigate("Live_Usr_LiveSessionListScreen")}>
   <View style={{padding:10, borderWidth:1, borderRadius:10,borderColor:"#d5d5d5"}}>
     <Text>Live</Text>
   </View>
 </TouchableOpacity>

{/* {
          this.state.SkillList &&
        
        <View style={{ paddingVertical: 20, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#DCDCDC" }}>
         
          
          
          <View>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: "row", paddingHorizontal: 20 }}>
                {
                  this.state.SkillList && this.state.SkillList.map((item, index) => {
                    return (
                      <TouchableOpacity key={index} onPress={() => {Singular.eventWithArgs("HomeScreen_SkillClick",{Id: item.Id, Name: item.Name}); this.props.navigation.navigate("ExpertListScreen",{Skills:[item.Id]});}}>
                        <View style={{ marginRight:40, alignItems:"center"}}>
                          <Image style={{ width: 30, height: 30 }} resizeMode="stretch" source={{ uri: `${env.DynamicAssetsBaseURL}${item.ImageForApp2}` }} />
                          <Text>{item.Name}</Text>
                        </View>
                      </TouchableOpacity>
                    )
                  })
                }
                <TouchableOpacity onPress={() => {Singular.event("HomeScreen_SkillSearchClick"); this.props.navigation.navigate("ExpertListScreen")}}>
                  <View style={{ marginHorizontal: 5 }}>
                  <Image style={{width:30,height:30}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/search.png`}}/>
                    <Text>Search</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
        ||
        <ActivityIndicator color="#0000ff"/>
        } */}



<UserControls.ExpertSuggestionNewView navigation={this.props.navigation}/>




{
this.state.ChakraStatus && this.state.ChakraStatus.isSpinned &&

  <View style={{paddingHorizontal:20, paddingBottom:20, alignItems:"center"}}>
    <LinearGradient colors={["#FB6F8F", "#FC826E"]} style={{borderRadius:10, width:"100%", margin:2}}>
      <View style={{flex:1, flexDirection:"row", alignItems:"center", paddingVertical:10}}>
        <Image style={{flex:0, width: 70, height: 70 }} resizeMode="stretch"  source={{ uri: `${env.AssetsBaseURL}/assets/images/spin-wheel.png` }} />
            <View style={{flex:1, alignItems:"center"}}>
              <>
              <Text style={{marginBottom:10, color:"#fff"}}>Your Next Spin Is In</Text>
              <View style={{flex:1, flexDirection:"row", justifyContent:"space-evenly"}}>


              <View style={{alignItems:"center"}}>
                <View style={{flexDirection:"row"}}>
                  <View style={{borderRadius:10, width:29, height:35, alignItems:"center", justifyContent:"center", margin:2, backgroundColor:"#fff"}}>
                      <Text style={{fontSize:21, fontWeight:"700"}}>{parseInt((this.state.ChakraStatus.nextAppearIn/60/60)/10)}</Text>
                  </View>
                  <View style={{borderRadius:10, width:29, height:35, alignItems:"center", justifyContent:"center", margin:2, backgroundColor:"#fff"}}>
                      <Text style={{fontSize:21, fontWeight:"700"}}>{parseInt((this.state.ChakraStatus.nextAppearIn/60/60%10))}</Text>
                  </View>
                </View>
                <Text style={{fontSize:9, textAlign:"center", color:"#fff"}}>hours</Text>
              </View>


                <Text style={{fontSize:21, fontWeight:"700"}}>:</Text>


                <View style={{alignItems:"center"}}>
                <View style={{flexDirection:"row"}}>
                <View style={{borderRadius:10, width:29, height:35, alignItems:"center", justifyContent:"center", margin:2, backgroundColor:"#fff"}}>
                    <Text style={{fontSize:21, fontWeight:"700"}}>{parseInt((this.state.ChakraStatus.nextAppearIn/60%60)/10)}</Text>
                </View>
                <View style={{borderRadius:10, width:29, height:35, alignItems:"center", justifyContent:"center", margin:2, backgroundColor:"#fff"}}>
                    <Text style={{fontSize:21, fontWeight:"700"}}>{parseInt(this.state.ChakraStatus.nextAppearIn/60%60%10)}</Text>
                </View>
                </View>
                <Text style={{fontSize:9, textAlign:"center", color:"#fff"}}>minutes</Text>
              </View>

              <View style={{height:35, alignItems:"center", justifyContent:"center"}}>
              <Text style={{fontSize:21, fontWeight:"700"}}>:</Text>
              </View>
                


                <View style={{alignItems:"center"}}>
                <View style={{flexDirection:"row"}}>
                <View style={{borderRadius:10, width:29, height:35, alignItems:"center", justifyContent:"center", margin:2, backgroundColor:"#fff"}}>
                    <Text style={{fontSize:21, fontWeight:"700"}}>{parseInt((this.state.ChakraStatus.nextAppearIn%60)/10)}</Text>
                </View>
                <View style={{borderRadius:10, width:29, height:35, alignItems:"center", justifyContent:"center", margin:2, backgroundColor:"#fff"}}>
                    <Text style={{fontSize:21, fontWeight:"700"}}>{parseInt(this.state.ChakraStatus.nextAppearIn%60%10)}</Text>
                </View>
                </View>
                <Text style={{fontSize:9, textAlign:"center", color:"#fff"}}>seconds</Text>
              </View>
            </View>
            </>
 
            </View>
        </View>
      </LinearGradient>
  </View>
  ||
  this.state.ChakraStatus &&
  <View style={{paddingHorizontal:20, paddingBottom:20, alignItems:"center", justifyContent:"center"}}>
    <TouchableOpacity onPress={() => {Singular.event("HomeScreen_SpintheChakraClick"); this.props.navigation.replace("ChakraScreen", {autoSpin:true})}}>
      <Image style={{ width:Dimensions.get("window").width-40, height:(351/1334)*(Dimensions.get("window").width-40) }} resizeMode="stretch"  source={{ uri: `${env.AssetsBaseURL}/assets/images/spin-the-chakra-banner.png` }}/>
    </TouchableOpacity>
  </View>
 
  // <View style={{marginLeft:70, alignItems:"center"}}>
  //   <Text style={{marginBottom:10, color:"#fff", fontWeight:"700", fontStyle:"italic"}}>Spin the Chakra & Win</Text>
  //   <TouchableOpacity onPress={() => {Singular.event("HomeScreen_SpintheChakraClick"); this.props.navigation.replace("ChakraScreen")}}>
  //   <LinearGradient colors={["#7162FC", "#B542F2"]} style={{borderRadius:30}}>
  //           <Text style={{ padding:10, fontSize:16, fontWeight:"700", textAlign:"center", width:150, color:"#fff"}}>Spin NOW</Text>
  //       </LinearGradient>
  //   </TouchableOpacity>
  // </View>
  } 
 

{
  this.state.MyHoroscope && this.state.Horoscope_IOS_Enable &&
  <View style={{backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#DCDCDC" }}>
            <Text style={[styles.heading, { paddingHorizontal: 20 }]}>Horoscope Today (<Text>{moment().format("DD/MM/YYYY")}</Text>)</Text>  
  <HoroscopeView dataSource={this.state.MyHoroscope} />
  </View>
}



         

        {/* {
          this.state.HomePageBannerList && this.state.HomePageBannerList.filter(item => item.BannerType == "HOME3").map((item, index) => {
            return (
              <TouchableOpacity key={index} onPress={() => this.props.navigation.navigate(item.ActionName, item.ActionParams)}>
                <View style={{ padding: 20, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#DCDCDC" }}>
                  <Image style={{ width: 320, height: 120 }} resizeMode="stretch" source={{ uri: `${env.DynamicAssetsBaseURL}${item.BannerUrl}` }} />
                </View>
              </TouchableOpacity> 
            )
          })
        } */}

        {/* <View style={{padding:20, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#DCDCDC" }}>
          <UserControls.OfferBanner onPress={(plan)=> {Singular.eventWithArgs("HomeScreen_OfferBannerClick",{Id:plan.Id}); this.props.navigation.navigate("WalletScreen", {plan})}}/>
        </View> */}

        {
          this.state.PDF_View_IOS_Enable &&
                <View style={{padding:10, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#DCDCDC" }}>
                  <Text style={[styles.heading,{marginBottom:0, paddingLeft:10}]}>Download Reports</Text>
                  <UserControls.DownloadPDFSliderView {...this.props}/>
                </View>
        }

        {
          !this.state.MyHoroscope && this.state.Horoscope_IOS_Enable &&
          <View style={{backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#DCDCDC" }}>
            <Text style={[styles.heading, { paddingHorizontal: 20, marginTop:20 }]}>Horoscope Today</Text>  
            <AllHoroList {...this.props}/>
          </View>
        }

        {
          this.state.RecommendedPujaList && this.state.RecommendedPujaList.length>0 && 
          <View style={{ padding: 20, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#DCDCDC"}}>
            <Text style={styles.heading}>Recommended Puja</Text>
            <View>
              <PoojaControls.RecomdationPoojaCard {...this.props}/>
            </View>

            <Text style={[styles.heading,{marginTop:10}]}>Recommended Gemstone</Text>
            <View style={{}}>
              <PoojaControls.RecomdationGemstonCard {...this.props}/>
            </View>
          </View>
        }

 
           
            
 

        
{
  this.state.BlogList && this.state.BlogList.length>0 &&
        <View style={{padding: 20, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#DCDCDC" }}>
          <Text style={styles.heading}>Trending</Text>
          <View>
            <ScrollView horizontal={true}>
              <View style={{ flexDirection: "row" }}> 
                {
                  this.state.BlogList && this.state.BlogList.map((item, index) => {
                    return (
                      <TouchableOpacity key={index} onPress={()=> {Singular.eventWithArgs("HomeScreen_SomethingNewForYouClick",{Id:item.Id}); this.props.navigation.navigate("BlogDetailScreen", {Id:item.Id})}}>
                      <View style={{marginRight:10}}>
                        <Image style={item.Blogs_Type==Blogs_Type.Creative ? {width:290, height:290} : {width:290, height:164}} resizeMode="stretch" source={{ uri: `${env.DynamicAssetsBaseURL}${item.ThumbImagePath}` }} />
                      </View>
                    </TouchableOpacity>
                    )
                  })
                }
              </View>
            </ScrollView>
          </View>
        </View>
}

      </ScrollView>
        <UserControls.Footer style={{flex:0}} {...this.props} activeIndex={0}/>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  heading: {
    /*...MainStyles.text,*/
    fontSize: 14,
    fontWeight:"700",
    marginBottom: 20,
    color: "#090320"
  },
  
});