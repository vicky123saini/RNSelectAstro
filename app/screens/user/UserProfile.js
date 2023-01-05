import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Image, ImageBackground, ScrollView, ActivityIndicator, RefreshControl, Linking, Dimensions, Share, Platform  } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import { StackActions } from '@react-navigation/native';
import ImagePicker from 'react-native-image-crop-picker';
import moment from 'moment';
import {mountHeaderBalanceRefresh} from '../../Functions';
import HoroscopeView from '../../controls/HoroscopeView';
import {AllHoroList} from './horoscope/AllHoroscopeScreen';
import * as UserControls from './Controls';
import analytics from '@react-native-firebase/analytics';
import MainStyles from '../../Styles';
import * as env from '../../../env';
import * as Auth from '../../Auth';
import * as Api from '../../Api';
import {Singular} from 'singular-react-native';
import Html from 'react-native-render-html';

export default class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      referAndEarnSelectedIndex:0
    };
    this.bindData=this.bindData.bind();
  }

  componentDidMount = () => {
   this.bindData();
    this._unsubscribe1 = this.props.navigation.addListener('focus', () => {
      mountHeaderBalanceRefresh();
    });
    this._unsubscribe2 = this.props.navigation.addListener('blur', () => {
      //clearInterval(this._interval);
    });
  };

  componentWillUnmount = () =>{
    this._unsubscribe1();
    this._unsubscribe2();
  }

  onRefresh = () => {
    this.setState({refreshing:true}, ()=>{
      this.bindData();
    });
    
  }

  bindData=()=>{

    Auth.getProfie().then(profile=>this.setState({Profile:JSON.parse(profile)})).catch(()=> console.error("err setState userprofile"));

    console.log("GetEnduserProfileService req")
    Api.GetEnduserProfileService().then(resp => {
        console.log("GetEnduserProfileService resp", JSON.stringify(resp));
        if (resp.ResponseCode == 200) {
            try{
            var model= {
              MobileNo:resp.data.MobileNo,
              Emaile:resp.data.Emaile??"",
              Name:resp.data.Name,
              DateOfBirth_Date:moment(resp.data.DateOfBirth,["DD-MMM-YYYY", "DD/MMM/YYYY", "DD/MM/YYYY"]).format("DD-MMM-YYYY"),
              TimeOfBirth_Date:moment(resp.data.TimeOfBirth, "HH:mm:00").format(),
              PlaceOfBirth:resp.data.PlaceOfBirth, 
              ProfileImage:resp.data.ProfileImage,
              refreshing:false,
              My_Referral_Code:resp.data.My_Referral_Code
            };
            this.setState(model);
          }
          catch(e){
            console.log(e)
            this.setState({refreshing:false});
          }
        }
    });

    // console.log("GetMyHoroscopeFullService req");
    // Api.GetMyHoroscopeFullService().then(resp => {
    //     console.log("GetMyHoroscopeFullService resp", resp);
    //     if (resp.ResponseCode == 200) {
    //         this.setState({ MyHoroscope: resp.data });
    //     }
    // });
     
    // Api.GetBalanceService().then(resp=> {
    //   console.log("GetBalanceService resp", resp);
    //   this.setState(resp.data)
    // });
    console.log("GetSocialMediaService req");
    Api.GetSocialMediaService().then(resp => {
      console.log("GetSocialMediaService resp", resp);
      if (resp.ResponseCode == 200) {
        this.setState({ SocialMediaList: resp.data });
      }
    });

    console.log("GetBannersService req");
    Api.GetBannersService("REF_ERN").then(resp => {
      console.log("GetBannersService resp", resp);
      if (resp.ResponseCode == 200) {
        this.setState({ ReferAndEarnBanner: resp.data });
      }
    });
    
    console.log("GetReferralService req");
    Api.GetReferralService().then(resp => {
      console.log("GetReferralService resp", resp);
      if (resp.ResponseCode == 200) {
        this.setState({ ReferralData: resp.data });
      }
    });
  }
  
  _onFileUpload = () => {
    Singular.event("UserProfile_onFileUpload");
    const data = new FormData();
    

    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true
    }).then(image => {
      console.log(image);
      let filename = image.path.substring(image.path.lastIndexOf('/') + 1, image.path.length)
      var photo = {
        uri: image.path,
        type: image.mime,
        name:filename
      };
      
      data.append('file', photo);
      Api.UploadUserProfileImageService(data)
      .then(resp=>{
        console.log("UploadUserProfileImageService resp", resp);
if(resp.ResponseCode==200){
        this.setState({ProfileImage:resp.data.ProfileImage})
}
else{
  alert("Oops! sonthing wend wrong. please try again.")
}
      })
    });
  };

  rechargeOffers = () => {
    this.props.navigation.navigate("WalletScreen");
    analytics().logEvent("Recharge_Button_on_Profile");
    Singular.event("UserProfile_rechargeOffers");
  }

  onShareReferal = () => {
    Api.GetAppSettingByKetService(Auth.AppSettingKey.Share_Text_Ref_And_Ern).then(async(resp) =>{
      console.log("Share_Text_Ref_And_Ern", resp);
      //this.setState({Share_Text_Ref_And_Ern:resp.data});
      var shareText=resp.data.replace("{0}", this.state.My_Referral_Code);

       
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
      
    });
  }

  _logout = async()=>{
    Singular.event("UserProfile_logout");
    analytics().logEvent("Log_out");
    
    await Api.LogoutService();
    await Auth.Logout();
    try{
      this.props.navigation.dispatch(StackActions.popToTop());
      this.props.navigation.replace("LoginScreen"); 
    }
    catch{
      this.props.navigation.replace("LoginScreen"); 
    }
    //this.props.navigation.dispatch(StackActions.popToTop());
    //this.props.navigation.navigate("LoginScreen"); 
  }

  render() {
    return (
      <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}>
        <View style={{paddingHorizontal:20,paddingVertical:50, backgroundColor:"#fff"}}>
          {/* <View style={{marginBottom:50, alignItems:"center"}}>
            <Image style={{width:320, height:52}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/offer-banner.png`}}/>
          </View> */}
          {
            !this.state.refreshing && 
            <View style={{backgroundColor:"#F5F5F5", marginBottom:20, alignItems:"center", borderRadius:10}}>
              <TouchableOpacity style={{top:-40}} onPress={()=> this._onFileUpload()}>
                <Image style={{width:80, height:80, borderRadius:50}} resizeMode="cover" source={{uri:`${env.DynamicAssetsBaseURL}${this.state.ProfileImage}`}}/>
              </TouchableOpacity>
              <Text style={[MainStyles.text, {fontSize:20, fontWeight:"700", color:"#090320"}]}>{this.state.Name}</Text>
              <Text style={[MainStyles.text, {fontSize:14, color:"#9591A7", marginBottom:30}]}>Mobile No: {this.state.MobileNo}</Text>

              {/* <Text style={[MainStyles.text, {fontSize:14, color:"#090320", marginBottom:10}]}>You haven't completed your profile</Text> */}

              <TouchableOpacity onPress={()=>this.props.navigation.navigate("UpdateUserProfile")}>
                  <LinearGradient colors={["#7162FC", "#B542F2"]} style={{borderRadius:30, width:220, marginBottom:20}}>
                      <Text style={[MainStyles.text,{color:"#fff", padding:15, fontSize:16, textAlign:"center"}]}>{this.state.Name ? "Edit profile":"Update Profile"}</Text>
                  </LinearGradient>
              </TouchableOpacity>
            </View>
            ||
            <ActivityIndicator color="#0000ff"/>
          }
          
          
          
            <View style={{backgroundColor:"#F5F5F5", padding:20, borderRadius:10, marginBottom:20}}>
              <View style={{alignItems:"center", flexDirection:"row", justifyContent:"space-evenly", marginBottom:20}}>
                <Image style={{width:40,height:35}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/wallet.png`}}/>
                <Text style={[MainStyles.text, {color:"#090320", fontSize:16}]}>Total balance:</Text>
                <Text style={[MainStyles.text, {color:"#090320", fontSize:16, fontWeight:"bold"}]}>₹ {global.WalletDetails ? global.WalletDetails.Balance : "..."}</Text>
              </View>

           <TouchableOpacity onPress={()=>this.rechargeOffers()}>
                <LinearGradient colors={["#FF8767", "#FF65A0"]} style={{borderRadius:30, width:220, alignSelf:"center"}}>
                    <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>Recharge Offers</Text>
                </LinearGradient>
            </TouchableOpacity>

            </View>

          

          {/* <View style={{backgroundColor:"#F5F5F5", marginBottom:20, padding:20, alignItems:"center", borderRadius:10, flexDirection:"row", justifyContent:"space-evenly"}}>
            <Image style={{width:40,height:35}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/coupon.png`}}/>
            <Text style={[MainStyles.text, {color:"#090320", fontSize:16, paddingRight:10}]}> Coupons </Text>
            <Text style={[MainStyles.text, {color:"#090320", fontSize:16, fontWeight:"bold"}]}> ? </Text>
          </View> */}
          
          {/* {
              this.state.MyHoroscope && 
              <View style={{marginBottom:20}}>
                <Text style={[MainStyles.heading, { paddingHorizontal: 20 }]}>Horoscope Today</Text>  
                <HoroscopeView dataSource={this.state.MyHoroscope}/>
              </View>
              || 
              <View style={{backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#DCDCDC" }}>
            <Text style={[MainStyles.heading, { paddingHorizontal: 20, marginTop:20 }]}>Horoscope Today</Text>  
              <AllHoroList {...this.props}/>
              </View>
          } */}

          {/* <View style={{marginBottom:20}}>
            <UserControls.DownloadPDFSliderView {...this.props}/>
          </View> */}

          {/* <View style={{marginBottom:20}}>
            <TouchableOpacity>
              <Image style={{width:320,height:150}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/envite-earn-bg.png`}}/>
            </TouchableOpacity>
          </View> */}

          {/* <View style={{marginBottom:20}}>
            <Image style={{width:"100%",height:150}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/comming-soon.jpg`}}/>
          </View> */}

          {
            this.state.My_Referral_Code &&
          
<View style={styles.ButtonDiv1}>
          <View style={{flexDirection:'row'}}>
            <TouchableOpacity onPress={()=> this.setState({referAndEarnSelectedIndex:0})}>
              <ImageBackground source={{uri:`${env.AssetsBaseURL}/assets/images/referalImages/GroupLeft.png`}} style={styles.ButtonDiv2}>
                  <Text style={[{color:'#181818', fontSize:18, fontWeight: 'bold'}, this.state.referAndEarnSelectedIndex==0 && {color:'#4E69FF'}]}>Refer</Text>
              </ImageBackground>
              <View style={[{width:"85%", alignSelf:"flex-end"}, this.state.referAndEarnSelectedIndex==0 && {borderBottomWidth:2, borderBottomColor:"#4E69FF"}]}/>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=> this.setState({referAndEarnSelectedIndex:1})}>
              <ImageBackground source={{uri:`${env.AssetsBaseURL}/assets/images/referalImages/GroupRight.png`}} style={styles.ButtonDiv2}>
                  <Text style={[{color:'#181818', fontSize:18, fontWeight: 'bold'}, this.state.referAndEarnSelectedIndex==1 &&{color:'#4E69FF'}]}>Reward</Text>
              </ImageBackground>
              <View style={[{width:"85%"}, this.state.referAndEarnSelectedIndex==1 && {borderBottomWidth:2, borderBottomColor:"#4E69FF"}]}/>
            </TouchableOpacity>
          </View>

{
  this.state.referAndEarnSelectedIndex==0 &&
        <View>
          <View>
              {/* <View style={styles.ButtonRefer}>
                  <Text style={{fontWeight:'700', fontSize: 18}}>Refer & Earn</Text>
                  <Text style={{fontWeight:'700', fontSize: 36, color:'#001FCE'}}>₹51</Text>
                  <Text style={{fontWeight:'700', fontSize: 18}}>Everytime</Text>
              </View>
              <View style={{justifyContent:'flex-end', alignItems:'flex-end'}}>
                  <Image source={{uri:`${env.AssetsBaseURL}/assets/images/referalImages/Img1.png`}} style={{height:100,width:180}}/>
              </View> */}
               
                {
                  this.state.ReferAndEarnBanner && this.state.ReferAndEarnBanner.length>0 && 
                  <Image style={{ width: "100%", height:150 }} resizeMode="stretch" source={{ uri: `${env.DynamicAssetsBaseURL}${this.state.ReferAndEarnBanner[0].BannerUrl}` }} />
                }
                
               
          </View>
          <View style={{marginVertical:20}}>
              <ImageBackground style={{width:"100%", height:74}} source={{uri:`${env.AssetsBaseURL}/assets/images/referalImages/DottedButton.png`}}>
              <View style={styles.ButtonDown}>
                  
                  <Text style={{paddingRight:120, fontSize:18,fontWeight:'bold'}}>{this.state.My_Referral_Code}</Text>
                  <TouchableOpacity style={{flexDirection:"row", alignItems:"center"}} onPress={this.onShareReferal}>
                    <Text style={{fontSize:16,fontWeight:'bold'}}>Share</Text>
                    <Image style={{width:29, height:29, marginLeft:10 }} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/share-icon-ng.png`}}/>
                  </TouchableOpacity>
                  <Image source={{uri:`${env.AssetsBaseURL}/assets/images/referalImages/shyear.png`}} style={{paddingRight:20}}/>
                  
                </View>
              </ImageBackground>
              <View style={{alignItems:"center"}}>
              <TouchableOpacity style={{marginTop:3}} onPress={()=> this.props.navigation.navigate("MyReferralListScreen")}>
                  <Text style={{fontSize:14, textDecorationLine:"underline"}}>Check Successful Referrals</Text>
                </TouchableOpacity>
              </View>
          </View>
          
          </View> ||
          this.state.referAndEarnSelectedIndex==1 &&
          <View>
            {
              this.state.ReferralData &&
              <View style={{paddingVertical:10}}>
                <View style={{flexDirection:"row", alignItems:"center", paddingHorizontal:10}}>
                  <View style={{width:33, height:33}}/>
                  <Text style={{fontSize:14, fontWeight:"bold", paddingHorizontal:10}}>Balance Earned</Text>
                  <Text style={{fontSize:14, fontWeight:"bold", paddingHorizontal:10}}>₹{this.state.ReferralData.BalanceEarned}</Text>
                </View>
                <View style={{}}>
                  <Text style={{fontWeight:"bold", marginLeft:53, color:"blue"}}>Refer and Win</Text>
                </View>
                <View style={{flexDirection:"row", alignItems:"center", paddingHorizontal:10}}>
                  <Image style={{width:33, height:33}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/dollar-money-bag-flat-circle-icon-vector.png`}}/>
                  <Text style={{width:"37%", fontSize:14, fontWeight:"bold", paddingHorizontal:10}}>Weekly Status:</Text>
                  <Html
                        contentWidth={Dimensions.get("window").width-20}
                        source={{html:this.state.ReferralData.WeeklyStatus}}
                    />
                </View>
                <View style={{flexDirection:"row", alignItems:"center", paddingHorizontal:10}}>
                  <Image style={{width:33, height:33}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/Apple-iPhone-13-Mini-Smartphones.png`}}/>
                  <Text style={{width:"37%", fontSize:14, fontWeight:"bold", paddingHorizontal:10}}>Monthly Status:</Text>
                  <Html
                        contentWidth={Dimensions.get("window").width-20}
                        source={{html:this.state.ReferralData.MonthlyStatus}}
                    />
                </View>

                <View style={{alignItems:"center", marginTop:20}}>
                <TouchableOpacity onPress={()=> this.props.navigation.navigate("ReferCountStatusScreen")}>
                  <LinearGradient colors={["#7162FC", "#B542F2"]} style={{borderRadius:30, width:220}}>
                      <Text style={[MainStyles.text,{color:"#fff", padding:15, fontSize:16, textAlign:"center"}]}>Know More</Text>
                  </LinearGradient>
                </TouchableOpacity>

                
                </View>

              </View>
            }
          </View>
            }

        </View>
  }


          <View style={{backgroundColor:"#F5F5F5", marginBottom:30, borderRadius:10}}>
            {/* <TouchableOpacity onPress={()=> this.props.navigation.navigate("LearnAstrologyScreen")}>
              <View style={[Styles.menuItem]}>
                <Text style={Styles.menuItemText}>Learn Astrology</Text>
              </View>
            </TouchableOpacity> */}
            
            <TouchableOpacity onPress={()=> this.props.navigation.navigate("RechargeHistory")}>
              <View style={[Styles.menuItem]}>
                <Text style={Styles.menuItemText}>Recharge history</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> this.props.navigation.navigate("CallHistoryScreen")}>
              <View style={[Styles.menuItem]}>
                <Text style={Styles.menuItemText}>Consultation history</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> this.props.navigation.navigate("WalletHistoryScreen")}>
              <View style={[Styles.menuItem]}>
                <Text style={Styles.menuItemText}>Wallet history</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> this.props.navigation.navigate("MyBookingsScreen")}>
              <View style={[Styles.menuItem]}>
                <Text style={Styles.menuItemText}>Puja Bookings</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> this.props.navigation.navigate("GauDaanTransactionHistoryScreen")}>
              <View style={[Styles.menuItem]}>
                <Text style={Styles.menuItemText}>Gau Daan history</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> this.props.navigation.navigate("BlogListScreen")}>
              <View style={[Styles.menuItem]}>
                <Text style={Styles.menuItemText}>Suvichar</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> this.props.navigation.navigate("NotificationHistoryScreen")}>
              <View style={[Styles.menuItem]}>
                <Text style={Styles.menuItemText}>Notification history</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> Linking.openURL(Platform.OS=="ios" ? 'https://myastrotest.app/ios-terms-conditions': 'https://myastrotest.app/terms-conditions')}>
              <View style={[Styles.menuItem]}>
                <Text style={Styles.menuItemText}>Terms & Conditions</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> Linking.openURL(Platform.OS=="ios" ? 'https://myastrotest.app/ios-privacy-policy' : 'https://myastrotest.app/privacy-policy')}>
              <View style={[Styles.menuItem]}>
                <Text style={Styles.menuItemText}>Privacy Policy</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> this.props.navigation.navigate("UserContactUsScreen")}>
              <View style={[Styles.menuItem,{borderBottomWidth:0}]}>
                <Text style={Styles.menuItemText}>Contact Us</Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity onPress={() => this._logout()}>
            <Text style={[MainStyles.text, {alignSelf:"center", textAlign:"center", fontSize:16, color:"#090320", width:150, paddingVertical:10, borderWidth:1, borderColor:"#00f", borderRadius:20}]}>Log Out</Text>
          </TouchableOpacity>
        </View>

        
        <View style={{ padding: 20, backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#DCDCDC" }}>
          <Text style={Styles.heading}>Our Philosophy</Text>
          {/* <Text style={[MainStyles.text, { fontSize: 14, color: "#090320", marginBottom: 20 }]}>Combining modern technology and the science of Vedic Astrology, we help you unlock your power & potential. Reliable and Accurate guidance is just a click away. </Text> */}
          {
            Platform.OS=="ios" && 
            <Text style={[MainStyles.text, { fontSize: 14, color: "#090320", marginBottom: 20 }]}>Established by Manu Jain, Himanshu Semwal & Acharya Dev in late 2020, myastrotest is a one-stop virtual platform that provides easy access to an array of services for your religious journey. For devotees & customers from all over the world, the platform offers virtual puja services in temples. Through Purna puja offerings, ashirvad & darshan services, myastrotest aims to provide a divine and fulfilling Mandir experience for all its users. Based on the extensive knowledge and experience of its experts, myastrotest offers solutions tailored to the needs of clients. It aspires to be a reliable and trustworthy partner ensuring that its users feel safe, understood, and connected to god at all times.</Text>
            ||
            <Text style={[MainStyles.text, { fontSize: 14, color: "#090320", marginBottom: 20 }]}>Established by Manu Jain, Himanshu Semwal & Acharya Dev in late 2020, myastrotest is a one-stop virtual platform that provides easy access to an array of services for one’s religious/spiritual journey. For devotees & customers from all over the world, the platform offers virtual puja remedies in temples. Through purn puja offerings, astrology services, and remedies, myastrotest aims to provide a divine and fulfilling spiritual experience for its users. Based on the extensive knowledge and experience of its experts, myastrotest offers solutions tailored to the needs of clients. It aspires to be a reliable and trustworthy partner ensuring that its users feel safe, understood, and connected at all times.</Text>
}
          {/* <View style={{ width: "100%", alignItems: "center" }}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate("AboutScreen")}>
              <LinearGradient colors={["#FF8767", "#FF65A0"]} style={{ borderRadius: 30, width: 220, marginBottom: 20 }}>
                <Text style={{ color: "#fff", padding: 15, fontSize: 16, textAlign: "center" }}>Know More</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View> */}

          <Text style={Styles.heading}>Follow us on</Text>
          <View style={{ width: "100%", alignItems: "center", marginBottom: 50 }}>
            <View style={{ flexDirection: "row" }}>
              {
                this.state.SocialMediaList && this.state.SocialMediaList.map((item, index) => {
                  return (
                    <TouchableOpacity key={index} onPress={()=> { Singular.eventWithArgs("UserProfile_Follow_us_on", {Url:item.Url}); Linking.openURL(item.Url)} }>
                      <View style={{ marginRight: 5 }}>
                        <Image style={{ width: 30, height: 30 }} resizeMode="stretch" source={{ uri: `${env.DynamicAssetsBaseURL}${item.ImagePath}` }} />
                      </View>
                    </TouchableOpacity>
                  )
                })
              }
            </View>
          </View>
        </View>

      </ScrollView>
    );
  }
}


const Styles=StyleSheet.create({
  menuItem:{height:62, width:"100%", borderBottomWidth:1, borderBottomColor:"#DCDCDC", justifyContent:"center"},
  menuItemText:{...MainStyles.text, color:"#090320", fontSize:18, paddingLeft:40},
  heading: {
    ...MainStyles.text,
    fontSize: 14,
    fontWeight:"700",
    marginBottom: 20,
    color: "#090320"
  },
})

const styles= StyleSheet.create({
  TopButton:{
      height:70,
      backgroundColor:'#EE8A35'
  
  },
  TopImage:{
      alignItems:'center',
      justifyContent:'center', 
      marginTop:20
  },
  ButtonDiv:{
      width: 380, 
      height:200,
      borderRadius: 20,
      marginTop:20,
      marginLeft:15,
    shadowColor: 'black',
    shadowOpacity: 0.126,
    shadowOffset: { width: 1, height: 2},
    shadowRadius: 10,
    elevation: 5,
    backgroundColor: 'white',
    },
    ButtonDiv1:{
      //width: 385, 
      height:320,
      borderRadius: 20,
      marginTop:20,
      //marginLeft:15,
      marginBottom: 10,
    shadowColor: 'black',
    shadowOpacity: 0.126,
    shadowOffset: { width: 1, height: 2},
    shadowRadius: 10,
    elevation: 5,
    backgroundColor: 'white',
    },
    ButtonDiv2:{
      //width:193, 
      width:(Dimensions.get("screen").width-40)/2,
      height: 50, 
      justifyContent:'center', 
      alignItems:'center'
    },
    ButtonRefer:{
        justifyContent:'center',
        alignItems:'center',
        flexDirection:'column',
        paddingLeft: 25,
        paddingRight: 25

    },
    ButtonDown:{
      flexDirection:'row',
      height:70, 
      justifyContent:'center', 
      alignItems:'center'
    },
    hairline: {
      backgroundColor: '#A2A2A2',
      height: 0.50,
      width: 365,
      marginLeft: 15,
      marginTop:15,
      marginBottom:15
    },

    ButtomButton:{
      flexDirection:'row', 
      alignItems:'center', 
      paddingHorizontal:10
    },
    BookingText:{
      fontSize:18, 
      fontWeight:'600',
      paddingHorizontal:15
    }


})