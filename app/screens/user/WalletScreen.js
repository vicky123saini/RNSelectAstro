import React, { Component, Profiler } from 'react';
import { View, Text, StyleSheet, TextInput, Image, SafeAreaView, ScrollView, Alert, ActivityIndicator, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import analytics from '@react-native-firebase/analytics';
import LinearGradient from 'react-native-linear-gradient';
import RazorpayCheckout from 'react-native-razorpay';
import MainStyles from '../../Styles';
import Overlay from 'react-native-modal-overlay';
import {Toast} from 'native-base';
import {mountHeaderBalanceRefresh} from '../../Functions';
import {OfferBanner} from './Controls';
import * as UserControls from './Controls';
import * as env from '../../../env';
import * as Api from '../../Api';
import * as Auth from '../../Auth';
import {Singular} from 'singular-react-native';


export default class WalletScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step:1
    };
    this.bindData=this.bindData.bind();
  }

  componentDidMount = () => {
    analytics().logEvent("Recharge_Offers");
    
    const{plan}=this.props.route.params??{};
    if(plan){
      this._onPlanSelect(plan);
    }
    Auth.getProfie().then(Profile=> this.setState({Profile:JSON.parse(Profile)})).catch(()=> console.error("err setState walletscreen"));
    this.bindData();
    
    this._unsubscribe1 = this.props.navigation.addListener('focus', () => {
      this._interval1=setInterval(() => {
        console.log("Interval", 1201);
        this.bindData();
      }, 10000);
      console.log("WalletScreen focus")
    });
    this._unsubscribe2 = this.props.navigation.addListener('blur', () => {
      clearInterval(this._interval);
      clearInterval(this._interval1);
      console.log("WalletScreen blur")
    });

  };

  componentWillUnmount = () =>{
    this._unsubscribe1();
    this._unsubscribe2();
  }
  

  bindData = () => {
    mountHeaderBalanceRefresh();
    // Api.GetBalanceService().then(resp=> {
    //   console.log("GetBalanceService resp", resp);
    //   this.setState(resp.data)
    // });

    Api.WalletRechargPlansService().then(resp=> {
      console.log("WalletRechargPlansService resp", resp);
      if (resp.ResponseCode == 200) {
        this.setState({WalletRechargPlans:resp.data})
      }
    });

    
  };

  onClose = () =>{
    this.setState({updateMoibleNoPopup:false, SelectedPlan:null});
    Singular.event("WalletScreen_onClose");
  }

  onBeginPlanSelect = async (Plan) => {
    var recommandedPlan = await Api.GetRecommendedOffersService(Plan.Id).then((resp)=>{
      if (resp.ResponseCode == 200) {
        return resp.data;
      }
    });

    if(recommandedPlan){
      this.setState({SelectedPlan:Plan, SelectedRecommandedPlan:recommandedPlan, recommandedPlanVisible:true})
    }
    else{
      this._onPlanSelect(Plan);
    }
  }

  _onPlanSelect = (Plan) =>{
    Singular.event("WalletScreen_onPlanSelect");
    if(this.loading) return;
    this.loading = true;
    setTimeout(()=>{
        this.loading = false;
    }, 2000);

    Api.GetEnduserProfileService().then(resp=>{
      if (resp.ResponseCode == 200) {
        this.setState({recommandedPlanVisible:false});
        if(resp.data.MobileNo == null || resp.data.MobileNo == ""){
          this.setState({updateMoibleNoPopup:true, SelectedPlan:Plan});
          return false;
        }
        else{
          this.props.navigation.navigate("PaymentDetails", {SelectedPlan:Plan});
        }
      }
    })
    // if(this.state.Profile.MobileNo==null || this.state.Profile.MobileNo == ""){
    //   this.setState({updateMoibleNoPopup:true, SelectedPlan:Plan});
    //   return false;
    // }
    // this.props.navigation.navigate("PaymentDetails", {SelectedPlan:Plan});
  }

  onRedeim = () => {
    Singular.event("WalletScreen_onRedeim");
    if(this.state.VoucherCode==null && this.state.VoucherCode==""){
      Toast.show({
        text:"Please enter voucher code",
        duration:5000
      });
      return;
    }
    this.setState({couponCoadLoading:true})
    var req={Code:this.state.VoucherCode}
    Api.ApplyVoucherService(req).then(resp=>{
      this.setState({couponCoadLoading:false, message:resp.ResponseMessage});

       if(resp.ResponseCode==200){
      //   Toast.show({
      //     text:"Your voucher code applied successfully",
      //     duration:5000
      //   });
         this.setState({VoucherCode:null});
      // }
      // else{
      //   Toast.show({
      //     text:resp.ResponseMessage,
      //     duration:5000
      //   });
       }
    });
  }

  _submit = () =>{
    Singular.event("WalletScreen_submit");
    var req = {MobileNo:this.state.MobileNo, OTP: this.state.OTP}
    console.log("UpdateMobileNoService req", req);
    Api.UpdateMobileNoService(req)
    .then(resp=>{
      console.log("UpdateMobileNoService resp", resp);
      if(resp.ResponseCode==200){
        if(this.state.step==1){
          this.setState({otpViewShow:true, step:2});
        }
        else{
          Auth.UpdateMobileno(this.state.MobileNo).then(()=>{
            try{
              var Profile=JSON.parse(JSON.stringify(this.state.Profile));
              Profile.MobileNo=this.state.MobileNo;
              this.setState({Profile, updateMoibleNoPopup:false});

              alert("Mobile no updated successfully!");
              if(this.state.SelectedPlan){
                this.props.navigation.navigate("PaymentDetails", {SelectedPlan:this.state.SelectedPlan});
              }
            }
            catch{
              console.error("err UpdateMobileno walletscreen")
            }
          });
        }
      }
      else{ 
        Alert.alert("", resp.ResponseMessage);
      }
    })
  }

  render() {
    return (
      <SafeAreaView style={{flex:1}}>
      <Overlay childrenWrapperStyle={{borderRadius:30}} visible={this.state.message!=null} onClose={()=> this.setState({message:null})} closeOnTouchOutside>
        <ImageBackground style={{width:"100%"}} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/bg-popup.png` }}>
          <View style={{padding:10, margin:10, alignItems:"center", justifyContent:"center"}}>
            <Text style={Styles.pageTitle}>{this.state.message}</Text>
            <TouchableOpacity onPress={()=>this.setState({message:null})}>
                <LinearGradient colors={["#FF8767", "#FF65A0"]} style={{borderRadius:30, width:150, marginBottom:10}}>
                    <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>OK</Text>
                </LinearGradient>
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </Overlay>

      <Overlay childrenWrapperStyle={{borderRadius:30}} visible={this.state.updateMoibleNoPopup} onClose={this.onClose} closeOnTouchOutside>
      <ImageBackground style={{width:"100%", height:250}} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/bg-popup.png` }}>
          <View style={{width:"90%"}}>
            <Text style={Styles.pageTitle}>Update your mobile no</Text>
            {
              this.state.otpViewShow && 
              <View>
                <Text style={Styles.label}>OTP</Text>
                <View style={Styles.textInput}>
                    <TextInput style={{width:"100%", color:"#000"}} value={this.state.OTP} onChangeText={(text)=> this.setState({OTP:text})} placeholder="OTP"/>
                </View>
              </View>
            ||
            <View>
              <Text style={Styles.label}>Mobile No</Text>
              <View style={Styles.textInput}>
                  <TextInput style={{width:"100%", color:"#000"}} value={this.state.MobileNo} onChangeText={(text)=> this.setState({MobileNo:text})} placeholder="MobileNo"/>
              </View>
            </View>
            }
            

            <View style={{width:"100%", marginTop:20, alignItems:"center", alignContent:"center", justifyContent:"center"}}>

            {
            this.state.loading ?
            <TouchableOpacity>
                <LinearGradient colors={["#FF8767", "#FF65A0"]} style={{borderRadius:30, width:150, marginBottom:20}}>
                    <View style={{padding:15}}>
                    <ActivityIndicator color="#0000ff"/>
                    </View>
                </LinearGradient>
            </TouchableOpacity>
            :
            <TouchableOpacity onPress={()=>this._submit()}>
                <LinearGradient colors={["#FF8767", "#FF65A0"]} style={{borderRadius:30, width:150, marginBottom:20}}>
                    <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>SAVE</Text>
                </LinearGradient>
            </TouchableOpacity>
        }

            </View>

          </View>
          </ImageBackground>
        </Overlay>

      <Overlay childrenWrapperStyle={{borderRadius:30}} visible={this.state.recommandedPlanVisible} onClose={()=> this.setState({recommandedPlanVisible:false, SelectedRecommandedPlan:null, SelectedPlan:null})} closeOnTouchOutside>
        {
          this.state.SelectedRecommandedPlan && this.state.SelectedPlan &&
          <View style={{alignItems:"center", justifyContent:"center"}}>
            <TouchableOpacity onPress={()=> this._onPlanSelect(this.state.SelectedRecommandedPlan)}>
              <Image style={{width:Dimensions.get("window").width-80, height:((383/660) * (Dimensions.get("window").width-80))}} resizeMode="stretch" source={{ uri: `${env.DynamicAssetsBaseURL}${this.state.SelectedRecommandedPlan.RecommendedImage}` }}/>
            </TouchableOpacity>
            <Text style={{color:"#ccc", marginTop:10, marginBottom:20}}>Or</Text>
            <TouchableOpacity onPress={()=>this._onPlanSelect(this.state.SelectedPlan)}>
                <Text style={{color:"#ec4119", fontWeight:"700", paddingVertical:10, width:300, fontSize:16, textAlign:"center", borderWidth:1, borderRadius:10, borderColor:"#ec4119"}}>Continue with ₹{this.state.SelectedPlan.Amount} Recharge</Text>
            </TouchableOpacity>
          </View>
        }
      </Overlay>

      <UserControls.MainHeader {...this.props} style={{flex:0}}/>
      <ScrollView style={{flex:1}}>
        
        <View style={{padding:20, backgroundColor:"#fff"}}>
         
          <View style={{backgroundColor:"#F5F5F5", marginBottom:20, paddingVertical:20, paddingHorizontal:40, alignItems:"center", borderRadius:10, flexDirection:"row", justifyContent:"space-between"}}>
            <Image style={{width:40,height:35}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/wallet.png`}}/>
            <Text style={[MainStyles.text, {color:"#090320", fontSize:16}]}>Total balance:</Text>
            <Text style={[MainStyles.text, {color:"#090320", fontSize:16, fontWeight:"bold"}]}>₹ {global.WalletDetails ? global.WalletDetails.Balance : "..."}</Text>
          </View>
           
          <View style={{backgroundColor:"#F5F5F5", marginBottom:20, paddingVertical:20, paddingHorizontal:40, borderRadius:10}}>
            <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
              <Image style={{width:40,height:35}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/coupon.png`}}/>
              <Text style={[MainStyles.text, {color:"#090320", fontSize:16}]}>Redeem voucher:</Text>
              <Text></Text>
            </View>
            
            <View style={{marginTop:20, flexDirection:"row", backgroundColor:"#fff", height:50, borderRadius:25, paddingLeft:15}}>
              <TextInput style={{flex:1, color:"#000"}} placeholder="Enter voucher code" placeholderTextColor={"#000"} value={this.state.VoucherCode} onChangeText={(text)=> this.setState({VoucherCode:text})}/>
              <TouchableOpacity style={{flex:0}} onPress={()=> !this.state.couponCoadLoading && this.onRedeim()}>
                  <LinearGradient colors={["#FF8767", "#FF65A0"]} style={{borderRadius:30, padding:15, alignItems:"center", justifyContent:"center"}}>
                      {
                        this.state.couponCoadLoading && <ActivityIndicator style={{padding:15}} color="blue"/> ||
                        <Text style={{color:"#fff", fontSize:16}}>APPLY</Text>
                      }
                  </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>

          {/* <View style={{marginBottom:50, alignItems:"center"}}>
            <Image style={{width:320, height:52}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/offer-banner.png`}}/>
          </View> */}

           <Text style={[MainStyles.text,{fontSize:16, color:"#090320", alignSelf:"center", marginBottom:20}]}>Add to your Wallet</Text>

          <OfferBanner onPress={(plan)=> this._onPlanSelect(plan)}/>
          

           <View style={{marginBottom:20}}>
        {
          this.state.WalletRechargPlans &&
        
        <View>
          <ScrollView>
            <View style={{flexDirection:"row", flexWrap:"wrap"}}>
              {
                this.state.WalletRechargPlans.map((item, index)=>{
                  return(
                    
                      <View key={index} style={{width:"50%", padding:5}}>
                      <TouchableOpacity onPress={()=>this.onBeginPlanSelect(item)}>
                      <LinearGradient colors={["#9D53E3", "#E9A4D6"]} start={{x:1,y:0}} end={{x:0,y:1}} style={[MainStyles.shadow, {width:"100%", height:210, borderRadius:20}]}>
                          

                      <ImageBackground style={{ width:118,height:20,marginTop:30, justifyContent:"center" }} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/ribbon-shape.png`}}>
                        <Text style={[MainStyles.text,{paddingLeft:20, fontSize:14}]}>{parseInt(((item.AdditionalAmount-item.Amount)/item.Amount)*100)}% Extra</Text>
                      </ImageBackground>

                      <View style={{alignItems:"center", justifyContent:"space-evenly", marginTop:10}}>
                          
                          {/* <Text style={[MainStyles.text,{fontSize:16, color:"#fff"}]}>Add to Wallet</Text> */}
                          
                          <Text style={[MainStyles.text,{fontSize:40, fontWeight:"bold", color:"#fff"}]}>₹{item.Amount}</Text>
                          {
                            item.AdditionalAmount!=null && item.AdditionalAmount>0 && 
                            <Text style={[MainStyles.text,{fontSize:16, color:"#fff"}]}>Get ₹{item.AdditionalAmount}</Text>
                          }

                          {/* <View style={{width:"100%", alignItems:"center"}}> </View> */}
                              
                            <LinearGradient colors={["#FF8767", "#FF65A0"]} style={{borderRadius:30, width:100, marginTop:10}}>
                                <Text style={{color:"#fff", padding:5, fontSize:16, textAlign:"center"}}>Add</Text>
                            </LinearGradient>
                              
                         

                        </View>

                      </LinearGradient>
                      </TouchableOpacity>
                    </View>
                  )
                })
              }

            </View>
          </ScrollView>
        </View>
        ||
        <ActivityIndicator color="#0000ff"/>
  }

      </View>

        </View>
      </ScrollView>
      <UserControls.Footer style={{flex:0}} {...this.props} activeIndex={1}/>
      </SafeAreaView>
    );
  }
}
 


const Styles=StyleSheet.create({
  menuItem:{height:62, width:"100%", borderBottomWidth:1, borderBottomColor:"#DCDCDC", justifyContent:"center"},
  menuItemText:{...MainStyles.text, color:"#090320", fontSize:18, paddingLeft:40},
  pageTitle:{
    ...MainStyles.text,
    fontSize:20,
    marginBottom:20
},
label:{
    ...MainStyles.text,
    fontSize:17,
    color:"#656565",
    marginBottom:10
},
textInput:{
    flexDirection:"row",
    width:"100%",
    alignItems:"center",
    justifyContent:"space-between",
    backgroundColor:"#F3F3F3", 
    borderRadius:30,
    marginBottom:20,
    paddingLeft:20,
    height:50
},
cardItem:{width:100, height:100, marginTop:10, borderWidth:1, borderColor:"#000", alignContent:"center", alignItems:"center", justifyContent:"center" }
})