import React, {Component, useEffect, useState} from 'react';
import {Text, View, Image, TouchableOpacity, StyleSheet, Dimensions, ImageBackground, ScrollView, Share, ActivityIndicator, Modal, Pressable, Platform, FlatList} from 'react-native';
import { Avatar } from 'react-native-elements';
import Overlay from 'react-native-modal-overlay';
import LinearGradient from 'react-native-linear-gradient';
import * as Api from '../../Api';
import * as Auth from '../../Auth';
import * as MyExtension from '../../MyExtension';
import * as env from '../../../env';
import * as UserNavigation from './Navigation';
import {Singular} from 'singular-react-native';
import MainStyles from '../../Styles';
import { ExpertStickerView, ExpertLiveBannerView } from '../../controls/ExpertControls';
import moment from 'moment';
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from 'react-native-popup-menu';
import Video from 'react-native-video'; 

export const MainHeader = (props) => {
  return(
    <View style={{ width: "100%", padding:10, flexDirection: "row", alignItems: "center", alignContent: "center", justifyContent: "space-between", backgroundColor: "#fff" }}>
        <UserNavigation.LogoTitle {...props}/>
        <UserNavigation.NavigatorMenu {...props}/>
    </View>
  )
 }

export const OfferBanner = (props) => {
    const [data, setData]=useState([]);
    useEffect(()=>{
        Api.GetOffersService().then(resp=> {
            console.log("GetOffersService resp", resp);
            if (resp.ResponseCode == 200) {
                setData(resp.data);
              //this.setState({Offers:resp.data})
            }
          });
    },[])
    const w_width=Dimensions.get("window").width-40;
    return(
        <View>
            {
            data && data.map((item, index)=>(
            <View key={index} style={{marginBottom:20}}>
                <TouchableOpacity onPress={()=> props.onPress(item)}>
                    <Image style={{width:w_width, height:(w_width*288)/1077}} resizeMode="stretch" source={{uri:`${env.DynamicAssetsBaseURL}${item.ImagePath}`}}/>
                </TouchableOpacity>
            </View>
            ))
          }
        </View>
    )
}



export const DakshinaView = (props) => {
    //const{modalVisible}=props;
    const [data, setData] = useState([]);
    const[selectItem, setSelectedItem]=useState(null);
    useEffect(()=>{
      console.log("props.walletBalanceValidate", props.walletBalanceValidate)
      Api.GetAllDakshinaService().then(resp=> setData(resp.data));
    },[]);

   const onPress = (item) =>{
     if(props.walletBalanceValidate && global.WalletDetails!=null && global.WalletDetails.Balance<item.Amount){
       alert("You don't have enough balance in your wallet. Select another option.");
       return;
     }

     if(props.multiSelectonEnable){
      if(selectItem==item){
        setSelectedItem(null);
        props.onSelect(null);
      }
      else{
        setSelectedItem(item);
        props.onSelect(item);
      }
    }
    else{
      props.onSelect(item);
    }

   }

    return(
    
        <View style={{flexDirection:"row", flexWrap:"wrap", alignContent:"center", alignItems:"center", justifyContent:"center", marginBottom:10}}>
        {
          data.map((item, index)=>(
            <View key={index} style={[{width:60, height:70, margin:10}, selectItem && selectItem.Id==item.Id && {backgroundColor:"#A848F4"}]}>
              <TouchableOpacity onPress={()=> onPress(item)}>
                <View style={{ alignContent:"center", alignItems:"center", justifyContent:"center", padding:10}}>
                  <Image style={{width:45, height:40}} resizeMode={"stretch"} source={{uri:`${env.DynamicAssetsBaseURL}${item.ImageUrl}`}}/>
                  <Text>₹ {item.Amount}</Text>
                </View>
              </TouchableOpacity>
            </View>
          ))
        }
        </View>

     
    
    )
  }


  export const ChakraPopup = (props) => {
    const[showMessageBox, setShowMessageBox]=useState(true)
    const onClose = () =>{
        setShowMessageBox(false);
        props.onClose();
    }
    const onSpinNow = () => {
      setShowMessageBox(false);
      props.onSpinNow()
    }

    return(
        <Overlay childrenWrapperStyle={{ borderRadius: 30, backgroundColor:"transparent" }} visible={showMessageBox}>
        <ImageBackground style={{width:329, height:416}} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/chakra-popup-bg.png` }}>
          <View style={{width:329, height:416, alignContent:"center", alignItems:"center", justifyContent:"flex-end", padding:20}}>
            <Text style={{color:"#fff", fontSize:16, width:"100%", textAlign:"center"}}>Spin The Chakra Daily and{'\n'}<Text style={{fontSize:20, fontWeight:"bold"}}>WIN Free wallet balance!</Text></Text>
             
            <View style={{padding:20}}>
              <TouchableOpacity onPress={onSpinNow}>
                  <LinearGradient colors={["#fff", "#fff"]} style={{borderRadius:30}}>
                        <Text style={{color:"#000", width:200, padding:15, fontSize:16, textAlign:"center"}}>Spin Now</Text>
                  </LinearGradient>
              </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Text style={{color:"#fff", textDecorationLine:"underline"}}>Later</Text>
            </TouchableOpacity>
          </View>
          </ImageBackground>
          </Overlay>
    )
}


export const WelcomePopup = (props) => {
  const[showMessageBox, setShowMessageBox]=useState(true);
  const[imageDimansons, setImageDimansons]=useState({})
  useEffect(()=> {

    Image.getSize(`${env.DynamicAssetsBaseURL}${props.data.BannerUrl}`, (width, height)=>{
      var maxWidth = Dimensions.get("window").width-20;
      if(width>maxWidth){
        var xWidth = width-maxWidth;
        var xWidthPer=(xWidth*100)/width;
        var xHeight=(height*xWidthPer)/100;
        var newHeight=height-xHeight;
          
        setImageDimansons({width:maxWidth, height:newHeight});
      }
      else{
      
        setImageDimansons({width, height});
      }
    });

  },[])
  const onClose = () =>{
    
      setShowMessageBox(false);
      //props.onClose();
  }
  const onPress = () =>{
    try{
      props.navigation.navigate(props.data.ActionName, JSON.parse(props.data.ActionParams));
    }
    catch{
      console.error("err WelcomePopup onPress");
    }
    //props.onPress()
    onClose();
  }

  return(
      <Overlay childrenWrapperStyle={{ borderRadius: 15, backgroundColor:"transparent" }} visible={showMessageBox} onClose={onClose} closeOnTouchOutside>
        <TouchableOpacity style={{position:"absolute", right:-10, top:-10, zIndex:1}}  onPress={()=>onClose()}>
          <Image style={{width:31, height:36, borderRadius:10 }} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/close-x.png`}}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={onPress}>
          <Image style={[{borderRadius: 15}, imageDimansons]} resizeMode="stretch" source={{ uri: `${env.DynamicAssetsBaseURL}${props.data.BannerUrl}` }}/>
        </TouchableOpacity>
      </Overlay>
  )
}



export const LowBalPopup = (props) => {
  const[showMessageBox, setShowMessageBox]=useState(true);
  const[imageDimansons, setImageDimansons]=useState({})
  useEffect(()=> {

    Image.getSize(`${env.DynamicAssetsBaseURL}${props.data.BannerUrl}`, (width, height)=>{
      var maxWidth = Dimensions.get("window").width-20;
      if(width>maxWidth){
        var xWidth = width-maxWidth;
        var xWidthPer=(xWidth*100)/width;
        var xHeight=(height*xWidthPer)/100;
        var newHeight=height-xHeight;
          
        setImageDimansons({width:maxWidth, height:newHeight});
      }
      else{
      
        setImageDimansons({width, height});
      }
    });

  },[])
  const onClose = () =>{
    
      setShowMessageBox(false);
      //props.onClose();
  }
  const onPress = () =>{
    console.log("props.data", props.data)
    try{
      props.navigation.navigate(props.data.ActionName, JSON.parse(props.data.ActionParams));
    }
    catch{
      console.error("err WelcomePopup onPress");
    }
    //props.onPress()
    onClose();
  }

  return(
      <Overlay childrenWrapperStyle={{ borderRadius: 15, backgroundColor:"transparent" }} visible={showMessageBox} onClose={onClose} closeOnTouchOutside>
        <TouchableOpacity style={{position:"absolute", right:-10, top:-10, zIndex:1}}  onPress={()=>onClose()}>
          <Image style={{width:31, height:36, borderRadius:10 }} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/close-x.png`}}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={onPress}>
          <Image style={[{borderRadius: 15}, imageDimansons]} resizeMode="stretch" source={{ uri: `${env.DynamicAssetsBaseURL}${props.data.BannerUrl}` }}/>
        </TouchableOpacity>
      </Overlay>
  )
}

export class SessionStrip extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount = () => {
    this.binddata();
      this._unsubscribe1 = this.props.navigation.addListener('focus', () => {  
        this.binddata();
    });
    this._unsubscribe2 = this.props.navigation.addListener('blur', () => {
        
    });
  };

  componentWillUnmount = () => {
     
    this._unsubscribe1();
    this._unsubscribe2();
  };
  
   
  
  // componentDidMount = () => {
  //   this.stripTimer();
  //   this._unsubscribe1 = this.props.navigation.addListener('focus', () => {      
  //     this.stripTimer();
  //   });
  //   this._unsubscribe2 = this.props.navigation.addListener('blur', () => {
  //      clearInterval(this.interval);
  //      this.interval=null;
  //   });
  // };

  // stripTimer = () => {
  //   if(this.interval==null){
  //     this.interval=setInterval(() => {
  //       console.log("Interval", 8001);
  //       this.binddata()
  //     }, 5000);
  //   }
  // }

  binddata = () => {
    Api.GetCurrentServiceStatusService().then(resp=>{
      console.log("SessionStrip GetCurrentServiceStatusService resp", resp)
      if(resp.ResponseCode == 200 && resp.data){
        this.setState({session:resp.data}); 
      }
      else{
        this.setState({session:null}); 
      }
    });
  }

   

  onPress =()=>{
    
    if(this.state.session.ServiceType==Auth.CallDetail_ServiceType.CHAT)
      this.props.navigation.navigate("ChatScreen", {Id:this.state.session.SessionId, ViewOnly:false})
    else if(this.state.session.ServiceType==Auth.CallDetail_ServiceType.VIDEO_CALL)
      this.props.navigation.navigate("VideoCallScreen", {Id:this.state.session.SessionId})
  }
  
  
  render() {
    return (
      this.state.session && this.state.session.Status==Auth.CallDetail_Status.IN_PROCESS && (this.state.session.ServiceType==Auth.CallDetail_ServiceType.VIDEO_CALL || this.state.session.ServiceType==Auth.CallDetail_ServiceType.CHAT) &&
    <View elevation={5} style={{backgroundColor:"#FC9D66"}}>
      <TouchableOpacity onPress={()=> this.onPress()}>
        <LinearGradient colors={["#3A9812", "#FBB860"]} start={{ x: 0, y: 0 }} end={{ x: 2, y: 2 }} style={{ flex: 1 }}>
          <View style={{flex:1, flexDirection:"row", paddingHorizontal:30, paddingVertical:10, alignItems:"center", justifyContent:"space-between"}}>
            <View style={{flexDirection:"row", alignItems:"center"}}>
              <View>
                <Avatar size={50} source={{uri:`${env.DynamicAssetsBaseURL}${this.state.session.ExpertProfile.ProfileImage}`}}  borderColor="#ccc" borderWidth={1} rounded marginHorizontal={10} titleStyle={{color:"#ccc"}}/>
              </View>
              <View>
                <Text style={{color:"#fff", fontWeight:"700"}}>{this.state.session.ExpertProfile.Name}</Text>
                <Text style={{color:"#fff", fontWeight:"700"}}>
                {
                    this.state.session.ServiceType==Auth.CallDetail_ServiceType.DAKSHINA && <Text style={[{marginTop:0, marginLeft:20, color:"#A848F4", fontWeight:"bold", textTransform:"capitalize"}]}>Dakshina</Text> ||
                    this.state.session.ServiceType==Auth.CallDetail_ServiceType.VOICE_CALL && <Text style={[{marginTop:0, marginLeft:20, color:"#D52837", fontWeight:"bold", textTransform:"capitalize"}]}>Voice Call</Text> ||
                    this.state.session.ServiceType==Auth.CallDetail_ServiceType.VIDEO_CALL && <Text style={[{marginTop:0, marginLeft:20, color:"#793900", fontWeight:"bold", textTransform:"capitalize"}]}>Video Call</Text> ||
                    this.state.session.ServiceType==Auth.CallDetail_ServiceType.CHAT && <Text style={[{marginTop:0, marginLeft:20, color:"#A848F4", fontWeight:"bold", textTransform:"capitalize"}]}>Chat</Text>
                } is in progress</Text>
              </View>
            </View>
            <View style={{}}>
              <Text style={{backgroundColor:"#fff", borderStyle:"dotted", borderWidth:2, borderRadius:10, paddingVertical:5, paddingHorizontal:20}}>{
                    this.state.session.ServiceType==Auth.CallDetail_ServiceType.DAKSHINA && <Text style={[{marginTop:0, marginLeft:20, color:"#A848F4", fontWeight:"bold", textTransform:"capitalize"}]}>Dakshina</Text> ||
                    this.state.session.ServiceType==Auth.CallDetail_ServiceType.VOICE_CALL && <Text style={[{marginTop:0, marginLeft:20, color:"#D52837", fontWeight:"bold", textTransform:"capitalize"}]}>Voice Call</Text> ||
                    this.state.session.ServiceType==Auth.CallDetail_ServiceType.VIDEO_CALL && <Text style={[{marginTop:0, marginLeft:20, color:"#793900", fontWeight:"bold", textTransform:"capitalize"}]}>Video Call</Text> ||
                    this.state.session.ServiceType==Auth.CallDetail_ServiceType.CHAT && <Text style={[{marginTop:0, marginLeft:20, color:"#A848F4", fontWeight:"bold", textTransform:"capitalize"}]}>Chat</Text>
                }</Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
    ||
    <></>
    );
  }
}


export class LivePujaStrip extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount = () => {
    this.binddata();
      this._unsubscribe1 = this.props.navigation.addListener('focus', () => {  
        this.binddata();
    });
    this._unsubscribe2 = this.props.navigation.addListener('blur', () => {
        
    });
  };

  componentWillUnmount = () => {
    this._unsubscribe1();
    this._unsubscribe2();
  }; 

  binddata = () => {
    Api.GetLivePujaService().then(resp=>{
      console.log("GetLivePujaService resp", resp)
      if(resp.ResponseCode == 200 && resp.data){
        this.setState({data:resp.data}); 
      }
      else{
        this.setState({data:null}); 
      }
    });
  }

   

  onPress =()=>{
    this.props.navigation.navigate("MyBookingDetailsScreen", {Id:this.state.data.Id});
  }
  
  
  render() {
    return (
      this.state.data &&
    <View elevation={5} style={{backgroundColor:"#FC9D66"}}>
      <TouchableOpacity onPress={()=> this.onPress()}>
        <LinearGradient colors={["#3A9812", "#FBB860"]} start={{ x: 0, y: 0 }} end={{ x: 2, y: 2 }} style={{ flex: 1 }}>
          <View style={{flex:1, flexDirection:"row", paddingHorizontal:30, paddingVertical:10, alignItems:"center"}}>
            <View style={{flex:1}}>
              <Text style={{color:"#fff", fontWeight:"700", fontSize:18}}>{this.state.data.PujaName}</Text>
            </View>
            <View style={{flex:0}}>
              <Text style={{backgroundColor:"#fff", borderStyle:"dotted", borderWidth:2, borderRadius:10, paddingVertical:5, paddingHorizontal:20}}>
                <Text style={[{marginTop:0, marginLeft:20, color:"#A848F4", fontWeight:"bold", textTransform:"capitalize"}]}>Go To Puja</Text> 
              </Text>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
    ||
    <></>
    );
  }
}


 export const KundlySliderView =(props)=>{
  const{data}=props;
  const[gauSevaEnable, setGauSevaEnable]=useState(false);
  useEffect(()=>{
    Api.GetAppSettingByKetService(Auth.AppSettingKey.Enable_Gau_Seva).then(resp=>{
      console.log("GetAppSettingByKetService resp", resp.data);
      setGauSevaEnable((resp.data!=null && resp.data != "false" && resp.data != "False"))
    });
  },[])
  //  const KundalyBannerList = [
  //   {BannerUrl:"assets/images/annual-horoscope.png", ActionName:"AnnualHoroscopeScreen", ActionParams:""},
  //   {BannerUrl:"assets/images/kundali.png", ActionName:"KundaliScreen", ActionParams:""},
  //   {BannerUrl:"assets/images/compatibility.png", ActionName:"MatchmakingScreen", ActionParams:""},
  //   {BannerUrl:"assets/images/panchang.png", ActionName:"PanchangScreen", ActionParams:""},
  //   {BannerUrl:"assets/images/daily-horo.png", ActionName:"UserHomeScreen", ActionParams:{screen:'HoroscopeScreen'}},
  // ]; 

   return(
    <View style={{marginVertical:20}}>
      <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: "row" }}>
          {
            gauSevaEnable &&
          <TouchableOpacity onPress={()=> props.navigation.navigate("GauDaanDetailsScreen")}>
            <View style={{/*borderWidth:1, borderRadius:12,*/ overflow:"hidden", marginLeft:10}}>
              <Image style={{width: 105, height: 70}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/gau-seva/gau-seva-banner-big.gif`}}/>
            </View>
          </TouchableOpacity>
          }
          {
            data.map((item, index) => {
              return (
                <TouchableOpacity key={index} onPress={() => {Singular.eventWithArgs("HomeScreen_BannerClick",{Id: item.Id}); props.navigation.navigate(item.ActionName, JSON.parse(item.ActionParams)); }}>
                  <Image style={{ width: 105, height: 70, marginLeft:10 }} resizeMode="stretch" source={{ uri: `${env.DynamicAssetsBaseURL}${item.BannerUrl}` }} />
                </TouchableOpacity>
              )
            })
          }
        </View>
      </ScrollView>
    </View>
   )
 }

 export const RefreshControl = (props) => {
   return(
     <View>
       {
         props.refreshing && 
         <View style={{}}>
            <Image  style={{ width: "100%", height: 70 }} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}assets/images/loader.gif` }}/>
          </View>
       }
     </View>
    
   )
 }

 export const Header = (props) => {
  const[Astrologer, setAstrologer]=useState(props.Astrologer);
  const{title, shareText}=props;
  const[loading,setloading]=useState(false);

  const onShare = async () => {
    Singular.eventWithArgs("Header_onShare",{title:title})
    try {
        const result = await Share.share({
        //title:this.state.Astrologer.Name,
        //url:`${env.DynamicAssetsBaseURL}${this.state.Astrologer.ProfileImage}`,
        message:shareText,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  }

  const onSpamSubmit = () => {
    setloading(true);
    var req={
      AstrologerId:Astrologer.Id,
      ReportText:"Report"
    }
    Api.SetAstrologerReportService(req).then(resp=>{
        console.log("SetAstrologerReportService resp", resp);
        setloading(false);
        if(resp.ResponseCode==200){
            var newItem={...Astrologer, IsReported:true};
            setAstrologer(newItem);
        }
        else{
        Alert.alert(
            null,
            resp.ResponseMessage,
            [{ text: "OK" }]
        );
         
        } 
    });
}

  return(
    <View style={{ width: "100%", height: 54, flexDirection: "row", alignItems: "center", alignContent: "center", justifyContent: "space-between", backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#0000001A" }}>
        <TouchableOpacity onPress={() => props.navigation.goBack()}>
            <View style={{ width: 30, height: 54, alignItems: "center", justifyContent: "center", marginLeft:10 }}>
                <Image style={{ width: 13, height: 27 }} resizeMode="stretch" source={require("../../assets/images/back.png")} />
            </View>
        </TouchableOpacity>
        <Text style={{fontSize:20}}>{title}</Text>
        <View style={{flexDirection:"row", alignItems:"center"}}>
          
        <TouchableOpacity onPress={()=> onShare()}>
            <View style={{backgroundColor:"#fff", marginRight:10, width:63, height:54, alignItems:"center", justifyContent:"center"}}>
                <Image style={{width:30, height:30}} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/share-icon.png`}}/>
                <Text>Share</Text>
            </View>
        </TouchableOpacity>
      {
        Astrologer &&
        <Menu>
            <MenuTrigger>
                <View style={{marginHorizontal:5}}>
                    <Image style={{ width:20, height: 20  }} resizeMode="cover" source={{uri:`${env.AssetsBaseURL}/assets/images/live/menu.png`}}/>
                </View>
            </MenuTrigger>
            <MenuOptions>
                <MenuOption onSelect={() => onSpamSubmit()} text={Astrologer.IsReported ? "✔ Report" : 'Report'} />
            </MenuOptions>
        </Menu>
        }
        </View>
    </View>
  )
 }

 
 export const HeaderWithoutShare = (props) => {
  const{title}=props;

  return(
    <View style={{ width: "100%", height: 54, flexDirection: "row", alignItems: "center", justifyContent: "flex-start", backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#0000001A" }}>
        <TouchableOpacity onPress={() => props.onBackPress()}>
            <View style={{ width: 30, height: 54, alignItems: "center", justifyContent: "center", marginLeft:10 }}>
                <Image style={{ width: 13, height: 27 }} resizeMode="stretch" source={require("../../assets/images/back.png")} />
            </View>
        </TouchableOpacity>
        <Text style={{fontSize:20, marginLeft:10}}>{title}</Text>
         
    </View>
  )
 }

 

 export const DownloadPDFSliderView =(props)=>{

  const KundalyBannerList = [
   {BannerUrl:"assets/images/image1.jpg", ActionName:"BasicHoroscopePDFScreen", ActionParams:"", style:{width: Dimensions.get("window").width-50, height: ((Dimensions.get("window").width-50)*229)/643, margin:10}},
   {BannerUrl:"assets/images/image2.jpg", ActionName:"MatchmakingPDFScreen", ActionParams:"", style:{width: 160, height: 102, marginTop:10}},
   {BannerUrl:"assets/images/image3.jpg", ActionName:"AdvancedHoroscopePDFScreen", ActionParams:"", style:{width: 160, height: 102, marginTop:10}}
 ]; 

  return(
   <View style={{marginVertical:20}}>
     
       <View style={{ flexDirection: "row", flexWrap:"wrap", alignItems:"center", justifyContent:"space-evenly"}}>
         {
           KundalyBannerList.map((item, index) => {
             return (
               <TouchableOpacity key={index} onPress={() => {props.navigation.navigate(item.ActionName, item.ActionParams);}}>
                 <Image style={item.style} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}${item.BannerUrl}` }} />
               </TouchableOpacity>
             )
           }) 
         }
       </View>
     
   </View>
  )
}

export const ExpertSuggestionView = (props) => {
  const[astrologerList, setAstrologerList] = useState(null);
useEffect(()=>{
  console.log("GetAstrologerForMobileHomeService req");
  Api.GetAstrologerForMobileHomeService().then(resp => {
    console.log("GetAstrologerForMobileHomeService resp", resp);
    if (resp.ResponseCode == 200) {
      setAstrologerList(resp.data);
    }
  });
},[]) 
  return(
    astrologerList &&

        <View style={{backgroundColor: "#fff", paddingVertical:20}}>
          <View style={{paddingHorizontal:20, marginBottom:10, flexDirection:"row", alignItems:"center", alignContent:"center", justifyContent:"space-between"}}>
            <Text style={[styles.heading,{marginBottom:0}]}>Recommended Astrologers</Text>
            <TouchableOpacity onPress={() =>{Singular.event("HomeScreen_RecommendedAstrologersViewAllClick"); props.navigation.navigate("ExpertListScreen")}}>
              <LinearGradient colors={["#7162FC", "#B542F2"]} style={{borderRadius:5}}>
                  <Text style={{color:"#fff", padding:5, fontSize:16, textAlign:"center"}}>View All</Text>
              </LinearGradient>
          </TouchableOpacity>
          </View>
            <ScrollView horizontal={true}>
              <View style={{ flexDirection: "row", paddingLeft:20 }}>
                {
                  astrologerList && astrologerList[0] && astrologerList[0].data && astrologerList[0].data.map((item, index) => (
                    <View key={index} style={{width:Dimensions.get("window").width/2, padding:5/2}}>
                      <TouchableOpacity onPress={()=> {Singular.eventWithArgs("HomeScreen_ExpertDetailsClick",{Id:item.UserId}); props.navigation.navigate("ExpertDetailsScreen", {Id:item.UserId})}}>
                        <ExpertStickerView item={item} />
                      </TouchableOpacity>
                    </View>
                  )) 
                }
                <View style={[{width:184, height:330, marginRight:20, borderWidth:1, borderColor:"#F1F1F1", borderRadius:10, alignContent:"center", alignItems:"center", justifyContent:"center"}]}>
                  <TouchableOpacity onPress={()=>{Singular.event("HomeScreen_RecommendedAstrologersViewAllClick"); props.navigation.navigate("ExpertListScreen")}}>
                    <View style={{alignContent:"center"}}>
                      <Image style={{ width: 50, height: 50 }} resizeMode="cover"  source={{ uri: `${env.AssetsBaseURL}/assets/images/arrow-right-blue.png` }} />
                      <Text>View All</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
         
        </View>
 ||
 <ActivityIndicator color="#0000ff"/>

  )
}


export const ExpertSuggestionNewView = (props) => {
  const[astrologerList, setAstrologerList] = useState(null);
useEffect(()=>{
  console.log("GetAstrologerForMobileHomeNewService req");
  Api.GetAstrologerForMobileHomeNewService().then(resp => {
    console.log("GetAstrologerForMobileHomeNewService resp", resp);
    if (resp.ResponseCode == 200) {
      setAstrologerList(resp.data);
    }
  });
},[]) 
  return(
    astrologerList &&
    astrologerList.filter(o=>o.data!=null && o.data.length>0).map((mitem, mindex)=>(
        <View style={{backgroundColor: "#fff", paddingVertical:20}}>
          <View style={{paddingHorizontal:20, marginBottom:10, flexDirection:"row", alignItems:"center", alignContent:"center", justifyContent:"space-between"}}>
            <Text style={[styles.heading,{marginBottom:0}]}>{mitem.title}</Text>
            <TouchableOpacity onPress={() =>{Singular.event("HomeScreen_RecommendedAstrologersViewAllClick"); props.navigation.navigate("ExpertListScreen")}}>
              <LinearGradient colors={["#7162FC", "#B542F2"]} style={{borderRadius:5}}>
                  <Text style={{color:"#fff", padding:5, fontSize:16, textAlign:"center"}}>View All</Text>
              </LinearGradient>
          </TouchableOpacity>
          </View>
            <ScrollView horizontal={true}>
              <View style={{ flexDirection: "row", paddingLeft:20 }}>
                {
                  mitem.data.map((item, index) => (
                    <View key={index} style={{width:Dimensions.get("window").width/2, padding:5/2}}>
                      <TouchableOpacity onPress={()=> {Singular.eventWithArgs("HomeScreen_ExpertDetailsClick",{Id:item.UserId}); props.navigation.navigate("ExpertDetailsScreen", {Id:item.UserId})}}>
                        <ExpertStickerView item={item} />
                      </TouchableOpacity>
                    </View>
                  )) 
                }
                <View style={[{width:184, height:330, marginRight:20, borderWidth:1, borderColor:"#F1F1F1", borderRadius:10, alignContent:"center", alignItems:"center", justifyContent:"center"}]}>
                  <TouchableOpacity onPress={()=>{Singular.event("HomeScreen_RecommendedAstrologersViewAllClick"); props.navigation.navigate("ExpertListScreen")}}>
                    <View style={{alignContent:"center"}}>
                      <Image style={{ width: 50, height: 50 }} resizeMode="cover"  source={{ uri: `${env.AssetsBaseURL}/assets/images/arrow-right-blue.png` }} />
                      <Text>View All</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </ScrollView>
         
        </View>
        ))
 ||
 <ActivityIndicator color="#0000ff"/>

  )
}

export const Footer = (props) => {
  const[isModelVisible, setIsModelVisible]=useState(false);
  const[horoscope_IOS_Enable, setHoroscope_IOS_Enable]=useState(false);
  const{activeIndex}=props;

  useEffect(()=>{
    if(Platform.OS=="ios"){
      Api.GetAppSettingByKetService(Auth.AppSettingKey.Horoscope_IOS_Enable).then(resp=>{
        setHoroscope_IOS_Enable(resp.data && resp.data != "False" && resp.data != "false");
      });
    }
    else{
      setHoroscope_IOS_Enable(true);
    }
  },[])

  return (
    <View style={{ flexDirection: 'row', alignContent:"center", alignItems:"center" }}>
          <TouchableOpacity style={{ flex: 1 }} onPress={()=> props.navigation.navigate("UserHomeScreen")}>
          <View style={{backgroundColor:"#fff",alignItems:"center", paddingVertical:10}}>
            <Image style={{width:28, height:28}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/tab-icons-new/home${activeIndex==0 ? '-active':''}.png`}} />
            <Text style={[MainStyles.text, {fontSize:14, marginTop:10, color:"#000"}, activeIndex==0 && {color:"#DD1E63", fontWeight:"bold"}]}>Home</Text>
          </View>
          </TouchableOpacity>

          <TouchableOpacity style={{ flex: 1 }} onPress={()=> props.navigation.navigate("WalletScreen")}> 
          <View style={{backgroundColor:"#fff",alignItems:"center", paddingVertical:10}}>
            <Image style={{width:28, height:28}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/tab-icons-new/wallet${activeIndex==1 ? '-active':''}.png`}} />
            <Text style={[MainStyles.text, {fontSize:14, marginTop:10, color:"#000"}, activeIndex==1 && {color:"#DD1E63", fontWeight:"bold"}]}>Recharge</Text>
          </View>
          </TouchableOpacity>

          <TouchableOpacity style={{ flex: 1 }} onPress={()=> props.navigation.navigate("ExpertListScreen")}>
          <View style={{backgroundColor:"#fff",alignItems:"center", paddingVertical:10}}>
            <Image style={{width:28, height:28}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/tab-icons-new/call${activeIndex==2 ? '-active':''}.png`}} />
            <Text style={[MainStyles.text, {fontSize:14, marginTop:10, color:"#000"}, activeIndex==2 && {color:"#DD1E63", fontWeight:"bold"}]}>Consult</Text>
          </View>
          </TouchableOpacity>

          <TouchableOpacity style={{ flex: 1 }} onPress={()=> props.navigation.navigate("PoojaListScreen")}>
          <View style={{backgroundColor:"#fff",alignItems:"center", paddingVertical:10}}>
            <Text style={{position:"absolute", top:5, right:5, backgroundColor:"red", color:"#fff", borderRadius:10, fontSize:10, paddingHorizontal:3}}>New</Text>
            <Image style={{width:28, height:28}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/tab-icons-new/puja${activeIndex==3 ? '-active':''}.png`}} />
            <Text style={[MainStyles.text, {fontSize:14, marginTop:10, color:"#000"}, activeIndex==3 && {color:"#DD1E63", fontWeight:"bold"}]}>Puja</Text>
          </View>
          </TouchableOpacity>

          <TouchableOpacity style={{ flex: 1 }} onPress={()=> setIsModelVisible(true)}>
            <View style={{backgroundColor:"#fff",alignItems:"center", paddingVertical:10}}>
              <Image style={{width:28, height:28}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/icons/ic_more_${activeIndex==4 ? '1':'0'}_hdpi.png`}} />
              <Text style={[MainStyles.text, {fontSize:14, marginTop:10, color:"#000"}, activeIndex==4 && {color:"#DD1E63", fontWeight:"bold"}]}>More</Text>
            </View>
          </TouchableOpacity>

          <Modal transparent={true} animationType="slide" visible={isModelVisible} onRequestClose={() => {
            setIsModelVisible(false);
          }}>
            <Pressable style={{
              flex:1,
              backgroundColor:'transparent',
            
          }}
          onPress={()=>setIsModelVisible(false)}
          />
            <View style={{
              width:"100%",
              position:"absolute",
              bottom:Platform.OS=="android" ? 75 : 108,
              backgroundColor: "#f5f5f5",
              
            }}>

              <View style={{padding:20, flexDirection:"row", alignItems:"center",justifyContent:"space-evenly"}}>
              <View>
                  <TouchableOpacity onPress={()=> {setIsModelVisible(false); props.navigation.navigate("UserProfile");}}>
                  <View style={{alignItems:"center"}}>
                  <Image style={{width:28, height:28}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/tab-icons-new/profile-active.png`}} />
                    <Text style={{fontWeight:"bold", marginTop:3}}>Profile</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View>
                  <TouchableOpacity onPress={()=> {setIsModelVisible(false); props.navigation.navigate("BlogListScreen");}}>
                  <View style={{alignItems:"center"}}>
                    <Image style={{width:28, height:28}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/tab-icons-new/suvichar-active.png`}} />
                    <Text style={{fontWeight:"bold", marginTop:3}}>Suvichar</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View>
                  <TouchableOpacity onPress={()=> {setIsModelVisible(false); props.navigation.navigate("ExpertListScreen",{SelectedFilter:4});}}>
                  <View style={{alignItems:"center"}}>
                  <Image style={{width:28, height:28}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/tab-icons-new/vip-active.png`}} />
                    <Text style={{fontWeight:"bold", marginTop:3}}>VIP</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              {
                horoscope_IOS_Enable &&
                <View>
                  <TouchableOpacity onPress={()=> {setIsModelVisible(false); props.navigation.navigate("HoroscopeScreen");}}>
                  <View style={{alignItems:"center"}}>
                  <Image style={{width:28, height:28}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/tab-icons-new/astrology.png`}} />
                    <Text style={{fontWeight:"bold", marginTop:3}}>Horoscope</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              }
              </View>

            </View>
          </Modal>
    </View>
  );
}


export const LiveSessionCard = (props) => {
  const{item, profile}=props;
  const[pendingTimeSS, setPendingTimeSS]=useState();
  
  useEffect(()=>{
    var now = moment();
    var end = moment(item.SessionStartDate);
    var diff = end.diff(now, 'seconds');
    if(diff>0)
      setPendingTimeSS(diff);
    else
      setPendingTimeSS(0);
  },[]);

  return(
    <View>
      <View style={{flexDirection:"row", alignItems:"flex-start", marginBottom:-10, zIndex:1, paddingHorizontal:10}}>
        <Avatar size={46} rounded source={{uri:`${env.DynamicAssetsBaseURL}${profile.ProfileImage}`}} />
        <View style={{marginHorizontal:10}}>
          <Text style={{fontSize:12, fontWeight:"bold"}}>{profile.Name}</Text>
          {
            item.Status==MyExtension.LiveSession_Status.LIVE &&
            <View style={{flexDirection:"row", alignItems:"center"}}>
              <Image style={{width:10, height:10}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/live/Hotspot.png`}} />
              <Text style={{color:"#CC2523", fontSize:10, marginLeft:5}}>Live now</Text>
            </View>||
            item.Status==MyExtension.LiveSession_Status.SCHEDULED && pendingTimeSS==0 &&
            <Text style={{color:"#CC2523", fontSize:10}}>Preparing...</Text>||
            item.Status==MyExtension.LiveSession_Status.SCHEDULED &&
            <Text style={{color:"#CC2523", fontSize:10}}>Going live in {parseInt(pendingTimeSS/60)}:{parseInt(pendingTimeSS%60)}</Text>
          }
        </View>
        <View style={{marginHorizontal:10, flexDirection:"row", alignItems:"center"}}>
          <Image style={{width:20, height:20}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/live/View.png`}} />
          <Text>{profile.Views}</Text>
        </View>
      </View>
      <ImageBackground style={{width:233, height:137, paddingHorizontal:20}} imageStyle={{ borderRadius: 10}} resizeMode="cover" source={{uri:`${env.DynamicAssetsBaseURL}${item.BackgroundImagePath}`}}>
        <View style={{flex:1, alignItems:"center", justifyContent:"center"}}>
          <Text style={{fontSize:14, color:"#fff", textAlign:"center"}}>{item.Subject}</Text>
        </View>
        <View style={{flex:0, alignItems:"flex-end", justifyContent:"flex-end", paddingBottom:10}}>
          <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between", padding:1, backgroundColor:"#fff", borderRadius:26}}>
            <Avatar size={13} rounded source={{uri:`${env.DynamicAssetsBaseURL}${profile.ProfileImage}`}} />
            <Text style={{fontSize:12, fontWeight:"500", paddingHorizontal:7}}>{item.Category}</Text>
          </View>
        </View>
      </ImageBackground>
    </View>
  )
}

export const VideoBannerView = (props) => {
  const{type}=props;
  const[data, setData]=useState();
  useEffect(()=>{
    Api.GetVideosService(type).then(resp=>{
      if(resp.ResponseCode==200){
        setData(resp.data);
      }
    })
  },[])
  return(
    data &&
    <FlatList
    data={data}
    renderItem = {({item})=> <View style={{width:Dimensions.get('window').width, height:Dimensions.get("window").height-150}}>
                                <Video 
                                  source={{uri: item.Url}}          // the video file
                                    paused={false}                  // make it start    
                                    style={{width:Dimensions.get('window').width, height:Dimensions.get("window").height-150}}  // any style you want
                                    repeat={true}                   // make it a loop
                                    //controls={true}
                                /> 
                              </View>}
    />
    
    ||
    <></> 
  )
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