import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, ImageBackground, Modal, TextInput, Dimensions, Alert } from 'react-native';
import {CheckBox} from 'react-native-elements';
import * as PoojaControls from './Controls';
import * as env from '../../../../env'; 
import { ScrollView } from 'react-native-gesture-handler';
import moment from 'moment';
import Overlay from 'react-native-modal-overlay';
import * as Api from '../../../Api';
import * as Auth from '../../../Auth';
import MainStyles from '../../../Styles';
import LinearGradient from 'react-native-linear-gradient';

export default class CheckoutScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        ...this.props.route.params,
        step:1,
        couponNetAmount:0
    };
  }

  componentDidMount = () => {
    console.log('componentDidMount', this.state );
    this.netAmountCalc()
  };

  netAmountCalc = () => {
    var grossAmount = (this.state.CouponCode ? this.state.couponNetAmount : (this.state.selectedPlan.Price-this.state.selectedPlan.DiscountPrice??0));
    var taxAmount = Math.ceil((this.state.selectedPlan.TaxPercent * grossAmount)/100);
    var netAmount = grossAmount + taxAmount + (this.state.isCowCharityFund ? this.state.selectedPlan.DonatePrice : 0);
    
    this.setState(prevState=>({netAmount, selectedPlan:{...prevState.selectedPlan, TaxAmount: taxAmount}}));
  }

  onApplyCoupon = () => {
      if(!this.state.CouponCode) return;

      const{netAmount, CouponCode}=this.state;
      var Amount = (this.state.selectedPlan.Price-this.state.selectedPlan.DiscountPrice??0);
      var req={CouponCode:CouponCode, Amount:Amount}
      Api.PujaRedeemCouponService(req).then(response=>{
        console.log("PujaRedeemCouponService resp",response);
        if(response.ResponseCode == 200 && response.data != null && response.data != ""){
            this.setState({AppliedCouponCode:CouponCode, couponNetAmount:response.data});
            this.netAmountCalc();
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
  onCancelAppliedCoupon = () => {
    this.setState({AppliedCouponCode:null, couponNetAmount:0});
    this.netAmountCalc();
  }

  onClose = () =>{
    this.setState({updateMoibleNoPopup:false});
  }

  mobileNoUpdateSubmit = () =>{
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
            alert("Mobile no updated successfully!");
            this.onSubmit();
          });
        }
      }
      else{ 
        Alert.alert("", resp.ResponseMessage);
      }
    })
  }
  
  onSubmit = () => {
    const{selectedDate, selectedPlan, selectedSlot, netAmount}=this.state;
    Api.GetEnduserProfileService().then(resp=>{
        if (resp.ResponseCode == 200) {
          if(resp.data.MobileNo == null || resp.data.MobileNo == ""){
            this.setState({updateMoibleNoPopup:true});
            return false;
          }
          else{
            this.props.navigation.replace("PoojaPaymentDetails", {SelectedPlan:{...selectedPlan, NetAmount:netAmount, DonatePrice:this.state.isCowCharityFund ? this.state.selectedPlan.DonatePrice : 0}, AppliedCouponCode: this.state.AppliedCouponCode, selectedDate:selectedDate, selectedSlot:selectedSlot})
          }
        }
      });
  }

  render() {
    return (
        <SafeAreaView style={{flex:1}}>

             <Overlay childrenWrapperStyle={{borderRadius:30}} visible={this.state.updateMoibleNoPopup} onClose={this.onClose} closeOnTouchOutside>
      <ImageBackground style={{width:"100%", height:250}} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/bg-popup.png` }}>
          <View style={{width:"100%"}}>
            <Text style={[Styles.pageTitle, {width:"100%", textAlign:"center"}]}>Update your mobile no</Text>
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
            <TouchableOpacity onPress={()=>this.mobileNoUpdateSubmit()}>
                <LinearGradient colors={["#FF8767", "#FF65A0"]} style={{borderRadius:30, width:150, marginBottom:20}}>
                    <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>SAVE</Text>
                </LinearGradient>
            </TouchableOpacity>
        }

            </View>

          </View>
          </ImageBackground>
        </Overlay>


            <PoojaControls.Header {...this.props} title="Checkout" pujaName={this.state.cardData.Name} mandirLocation={this.state.cardData.MandirName + " " + this.state.cardData.Location}/>
            <ScrollView style={{flex:1}}>
                <View style={{backgroundColor:"#fff", padding:10, borderBottomWidth:1, borderBottomColor:"#d1d1d1"}}>
                    <PoojaControls.PoojaCard {...this.props} item={this.state.cardData}/>
                </View>
                 
                <View style={{padding:10, backgroundColor:"#fff"}}>
                    <Text style={{fontWeight:"bold", paddingVertical:5}}>Date and Time</Text>
                    <Text style={{paddingVertical:5}}>{moment(this.state.selectedDate).format("DD MMM yyyy, dddd")} {this.state.selectedSlot.StartTime} - {this.state.selectedSlot.EndTime}</Text>
                </View>

                <View style={{padding:10, marginTop:5, backgroundColor:"#fff"}}>
                    <Text style={{fontWeight:"bold"}}>Summary</Text>
                    <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between", paddingVertical:10}}>
                        <Text>{this.state.selectedPlan.Name}</Text>
                        <Text>₹ {this.state.selectedPlan.Price}</Text>
                    </View>
                    <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between", paddingVertical:10}}>
                        <Text>Total Discount</Text>
                        <Text>{this.state.selectedPlan.DiscountPrice??"--"}</Text>
                    </View>
                    <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between", paddingVertical:10}}>
                        <Text>Gross Amount</Text>
                        <Text>₹ {this.state.selectedPlan.Price-this.state.selectedPlan.DiscountPrice??0}</Text>
                    </View>
                    
                    <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between", paddingVertical:10, marginVertical:10, borderTopWidth:1, borderBottomWidth:1, borderColor:"#d1d1d1"}}>
                        <Text>Tax and Service fees</Text>
                        <Text>₹ {this.state.selectedPlan.TaxAmount}</Text>
                    </View>
{
    this.state.selectedPlan.IsDonate &&
                    <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between", paddingVertical:10}}>
                         
                        <View style={{flexDirection:"row", alignItems:"center"}}>
                            <CheckBox
                                containerStyle={{padding:0, margin:0}}
                                checkedIcon={<Image style={{width:20, height:20 }} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/icons/ic_tick_s_1_mdpi.png`}}/>}
                                uncheckedIcon={<Image style={{width:20, height:20 }} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/icons/ic_tick_s_0_mdpi.png`}}/>}
                                checked={this.state.isCowCharityFund}
                                onPress={()=> this.setState(privState=>({isCowCharityFund:!privState.isCowCharityFund}),()=>this.netAmountCalc())}
                                />
                            <Text>{this.state.selectedPlan.DonateName}</Text>
                        </View>
                         
                        <Text>₹ {this.state.isCowCharityFund ? this.state.selectedPlan.DonatePrice : 0}</Text>
                    </View>
  }
                    <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between", paddingVertical:20, borderTopWidth:1, borderTopColor:"#d1d1d1"}}>
                        <Text>Total Amount to be paid</Text>
                        <Text style={{fontWeight:"bold"}}>₹  {this.state.netAmount}</Text>
                    </View>
                </View>
{
  !this.state.Coupon_Not_Applicable &&
                <View style={{padding:10, marginTop:5, backgroundColor:"#fff"}}>
                    <Text style={{fontWeight:"bold"}}>Coupon and Discounts</Text>
                    {
                        this.state.AppliedCouponCode &&
                        <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between", backgroundColor:"#f2f9f3", borderRadius:10, padding:20, marginVertical:10}}>
                            <Text style={{fontWeight:"bold", fontSize:18, color:"#20962C"}}>{this.state.AppliedCouponCode}</Text>
                            <TouchableOpacity onPress={()=> this.onCancelAppliedCoupon()}>
                                <Image style={{width:20, height:20 }} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/icons/ic_close_g_mdpi.png`}}/>
                            </TouchableOpacity>
                        </View>
                        ||
                        <View style={{flexDirection:"row", alignItems:"center", flex:1}}>
                            <TextInput style={{flex:1, borderWidth:1, borderColor:"#d1d1d1", borderRadius:10, padding:10, marginVertical:10, color:"#000"}} value={this.state.CouponCode} onChangeText={(text)=> this.setState({CouponCode:text})} placeholder="Enter Coupon Code" placeholderTextColor={"#000"}/>
                            
                            <TouchableOpacity style={{flex:0, minWidth:100, marginLeft:10}} onPress={()=>this.onApplyCoupon()}>
                                
                                    <Text style={{backgroundColor:"#FBE6CE", color:"#000", padding:15, fontSize:16, textAlign:"center", borderRadius:30, borderWidth:1, borderColor:"#d1d1d1", overflow:"hidden"}}>Apply</Text>
                                 
                            </TouchableOpacity>
                        </View>
                     }
                    
                </View>
                }
                <View style={{padding:10, marginTop:5, backgroundColor:"#fff"}}>
                <View style={{alignItems:"center"}}>
                        <PoojaControls.ButtonOrange style={{width:Dimensions.get("window").width-20}} title="Make Purchase" onPress={()=>this.onSubmit()}/>
                    </View>
                    </View>
            </ScrollView>
        </SafeAreaView>
    );
  }
}
const Styles=StyleSheet.create({
   
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
  }
  })