import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, ActivityIndicator, ImageBackground, Dimensions, Alert } from 'react-native';
import analytics from '@react-native-firebase/analytics';
import RazorpayCheckout from 'react-native-razorpay';
import LinearGradient from 'react-native-linear-gradient';
import MainStyles from '../../Styles';
import { Toast, Card, cardItem, CardItem, List, ListItem, Left, Right } from 'native-base';
import AllInOneSDKManager from 'paytm_allinone_react-native';
import Overlay from 'react-native-modal-overlay';
import * as env from '../../../env';
import * as Api from '../../Api';
import * as Auth from '../../Auth';
import {Singular} from 'singular-react-native';
import Html from 'react-native-render-html';

export default class PaymentDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount = () => { 
        analytics().logEvent("Payment_details");
        Auth.getProfie().then(Profile => this.setState({Profile:JSON.parse(Profile)})).catch(()=> console.error("err getProfie paymentDetails"));
        const { SelectedPlan } = this.props.route.params;
        this.setState({SelectedPlan});

        console.log("SelectedPlan", SelectedPlan);

        Api.GetAppSettingByKetService(Auth.AppSettingKey.Coupon_Suggestion).then(resp=>{
            console.log("GetAppSettingByKetService resp", resp.data);
            if(resp.data!=null && resp.data != "false" && resp.data != "False")
            {
                try{
                    this.setState({Coupon_Suggestion:JSON.parse(resp.data)});
                }
                catch{
                    console.error("err GetAppSettingByKetService paymentDetails");
                }
            }
            //setAPP_SPLASH_SCREEN_TEXT(resp.data)
        });
    }

    _onSPSelect = (Mathod) => {
        const { SelectedPlan } = this.props.route.params;

        analytics().logEvent("Payment_details_Submit");
        Singular.eventWithArgs("PaymentDetails_onSPSelect",{Mathod:Mathod});
        
        if(this.loading) return;
        this.loading = true;
        setTimeout(()=>{
            this.loading = false;
        }, 2000);
        
        console.log("Mathod", Mathod, "SelectedPlan", SelectedPlan);
        var req = { PlanId: SelectedPlan.Id, Mathod: Mathod, CouponCode: this.state.ValidCouponCode};

        console.log("WalletCreateTransactionService req", req);
        Api.WalletCreateTransactionService(req).then(transaction=>{
            console.log("WalletCreateTransactionService resp", transaction);
            if (transaction.ResponseCode != 200) {
                if(transaction.data!=null && transaction.data.Alert!=null)
                    Alert.alert(transaction.data.Alert.Title, transaction.data.Alert.Message)
                else
                    alert(transaction.ResponseMessage);
                return false;
            }
            switch (Mathod) {
                case "paytm": {
                    this.paytmSubmit(SelectedPlan, transaction.data, Mathod);
                    break;
                }
                default: {
                    this.razorpaySubmit(SelectedPlan, transaction.data, Mathod);
                    break;
                }
            }
        });
         
    };

    razorpaySubmit = (SelectedPlan, transaction, Mathod) => {
        Singular.event("PaymentDetails_razorpaySubmit");
        var options = {
            order_id: transaction.OrderId,
            description: 'Select Astro txnid:' + transaction.TxnId,
            image: 'https://services.myastrotest.in/Content/App/assets/images/logo.png',
            currency: 'INR',
            key: 'rzp_live_jef3Y0sZQebKKk',
            amount: transaction.NetAmount * 100,
            name: 'Top up ' + transaction.Amount,
            prefill: {
                email: this.state.Profile.Emaile??"payment@myastrotest.in",
                contact: this.state.Profile.MobileNo,
                name: this.state.Profile.Name,
                method: Mathod
            },
            theme: { color: '#F37254' }
        }
        RazorpayCheckout.open(options).then((data) => {
            // handle success
            var treq = { TxnId: transaction.TxnId, PaymentId: data.razorpay_payment_id };
            Api.WalletCompleteTransactionService(treq).then(tresp => {
                if (tresp.ResponseCode == 200) {
                    this.props.navigation.replace("SuccessScreen");
                }
            })
            //alert(`Success: ${data.razorpay_payment_id}`);
        }).catch((error) => {
            // handle failure
            //alert(`Error: ${error.code} | ${error.description}`);
            alert("Oops! Transaction Fail. please try again");
            this.props.navigation.replace("WalletScreen");
        });
    }

    paytmSubmit = (SelectedPlan, transaction, Mathod) => {
        Singular.event("PaymentDetails_paytmSubmit");
        var callBack = `https://securegw.paytm.in/theia/paytmCallback?ORDER_ID=${transaction.OrderId}`;

        var paytmReq = {
            orderId: transaction.OrderId,
            mid: "Select06912760077014",
            txnToken: transaction.txnToken,
            amount: transaction.NetAmount.toString(),
            callbackUrl: callBack,
            isStaging: false,
            restrictAppInvoke: false
        };
        console.log("paytmReq", paytmReq);

        AllInOneSDKManager.startTransaction(
            transaction.OrderId,
            "Select06912760077014",
            transaction.txnToken,
            transaction.NetAmount.toString(),
            callBack,
            false,
            false,
        )
            .then((result) => {
                console.log(result);
                /*
                 {"BANKNAME": "NKMB", "BANKTXNID": "202117423419462", "CHECKSUMHASH": "9zUNSoGS2XEChk0okT7wgAjKXqA4Fi3xXToBVjQ2u54leWuKkJKQEpdoW/e+mJKWrPzdpqeEh5OrzKAk/PPGGIGwJEL21jiqsM+AaTYj4Xo=", "CURRENCY": "INR", "GATEWAYNAME": "BOBFSS", "MID": "Select06912760077014", "ORDERID": "7W6B73zYruI_", "PAYMENTMODE": "CC", "RESPCODE": "01", "RESPMSG": "Txn Success", "STATUS": "TXN_SUCCESS", "TXNAMOUNT": "59.00", "TXNDATE": "2021-06-23 16:41:09.0", "TXNID": "20210623111212800110168423815791449"}
                */
                if (parseFloat(transaction.NetAmount) != parseFloat(result.TXNAMOUNT)) {
                    //alert("Oops! amount is not matching with transaction amount.");
                    alert("Oops! Transaction has been cancelled. Please try again.");
                    this.props.navigation.replace("WalletScreen");

                }
                else {
                    var treq = { TxnId: transaction.TxnId, PaymentId: result.TXNID };
                    Api.WalletCompleteTransactionService(treq).then(tresp => {
                        if (tresp.ResponseCode == 200) {
                            this.props.navigation.replace("SuccessScreen");
                        }
                    })
                }

            })
            .catch((err) => {
                console.log("paytm error", err);
                alert("Oops! Transaction Fail. please try again");
                this.props.navigation.replace("WalletScreen");
            });
    }

    onApplyCoupon = () =>{
        Singular.event("PaymentDetails_onApplyCoupon");
        const { SelectedPlan } = this.props.route.params;
        if(this.state.CouponCode==null && this.state.CouponCode==""){
            Toast.show({
              text:"Please enter coupon code",
              duration:5000
            });
            return;
          }
          this.setState({couponCoadLoading:true})
          var req={Code:this.state.CouponCode, CouponType:0, PlanId:SelectedPlan.Id}
          console.log("ValidateCodeService req", req);
          Api.ValidateCodeService(req).then(resp=>{
            this.setState({couponCoadLoading:false, message:resp.ResponseMessage})
            console.log("ValidateCodeService resp", resp);
            if(resp.ResponseCode==200){
            //   Toast.show({
            //     text:"Coupon code applied successfully",
            //     duration:5000
            //   });
              this.setState(prevState=>({ValidCouponCode:this.state.CouponCode, SelectedPlan:{...prevState.SelectedPlan, AdditionalAmount:parseInt(prevState.SelectedPlan.AdditionalAmount)+resp.data.CouponAmount}}));

            }
            // else{
            //   Toast.show({
            //     text:resp.ResponseMessage,
            //     duration:5000
            //   });
            // }
          });
    }

    render() {
        const { SelectedPlan } = this.props.route.params;
        return (
            <ScrollView style={{flex: 1, backgroundColor:"#fff"}}>
                <Overlay childrenWrapperStyle={{borderRadius:30}} visible={this.state.message!=null} onClose={()=> this.setState({message:null})} closeOnTouchOutside>
                    <ImageBackground style={{width:"100%"}} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/bg-popup.png` }}>
                    <View style={{padding:10, margin:10, alignItems:"center", justifyContent:"center"}}>
                        <Text style={[Styles.pageTitle, {color:"#000"}]}>{this.state.message}</Text>
                        <TouchableOpacity onPress={()=>this.setState({message:null})}>
                            <LinearGradient colors={["#FF8767", "#FF65A0"]} style={{borderRadius:30, width:150, marginBottom:10}}>
                                <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>OK</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                    </ImageBackground>
                </Overlay>

                <View style={{ flex: 1, backgroundColor: "#fff" }}>
                    <List>
                        <ListItem>
                            <Left style={{ left: 20 }}><Text style={[MainStyles.text, { fontSize: 18 }]}>Total Amount</Text></Left>
                            <Right style={{ right: 20 }}><Text style={[MainStyles.text, { fontSize: 18 }]}>₹{SelectedPlan.Amount}</Text></Right>
                        </ListItem>
                        <ListItem>
                            <Left style={{ left: 20 }}><Text style={[MainStyles.text, { fontSize: 18 }]}>GST</Text></Left>
                            <Right style={{ right: 20 }}><Text style={[MainStyles.text, { fontSize: 18 }]}>₹{SelectedPlan.GST_Value}</Text></Right>
                        </ListItem>
                        <ListItem>
                            <Left style={{ left: 20 }}><Text style={[MainStyles.text, { fontWeight: "700", fontSize: 18 }]}>Total Payable Amount</Text></Left>
                            <Right style={{ right: 20 }}><Text style={[MainStyles.text, { fontWeight: "700", fontSize: 18 }]}>₹{SelectedPlan.NetAmount}</Text></Right>
                        </ListItem>
                        <ListItem>
                            <Left style={{ left: 20 }}><Text style={[MainStyles.text, { fontWeight: "700", fontSize: 18 }]}>Wallet Amount</Text></Left>
                            {
                                this.state.SelectedPlan &&
                                <Right style={{ right: 20 }}><Text style={[MainStyles.text, { fontWeight: "700", fontSize: 18 }]}>₹{this.state.SelectedPlan.AdditionalAmount}</Text></Right>
                            }
                            
                        </ListItem>
                    </List>

                    <View style={{paddingHorizontal:40}}>
                        <View style={{marginTop:20, flexDirection:"row", backgroundColor:"#F3F3F3", height:50, borderRadius:25, paddingLeft:25}}>
                            <TextInput style={{flex:1, color:"#000"}} editable={this.state.ValidCouponCode==null} placeholder="Enter coupon code" placeholderTextColor={"#000"} value={this.state.CouponCode} onChangeText={(text)=> this.setState({CouponCode:text})}/>
                            <TouchableOpacity disabled={this.state.ValidCouponCode!=null} onPress={()=> !this.state.couponCoadLoading && this.onApplyCoupon()}>
                                <LinearGradient colors={["#FF8767", "#FF65A0"]} style={{flex:0, borderRadius:30, width:100}}>
                                    {
                                        this.state.couponCoadLoading && <ActivityIndicator style={{padding:15}} color="blue"/> ||
                                        <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>APPLY</Text>
                                    }
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                    </View>


                    {
                        this.state.Coupon_Suggestion != null && 
                        <TouchableOpacity disabled={this.state.ValidCouponCode!=null} onPress={() =>  this.setState({CouponCode:this.state.Coupon_Suggestion.Code}, ()=> !this.state.couponCoadLoading && this.onApplyCoupon())}>
                            <View style={{marginVertical:10}}>
                                <Image style={[{width:Dimensions.get("window").width, height: ((Dimensions.get("window").width*313)/1982)}, this.state.Coupon_Suggestion.image.style]} resizeMode="stretch" source={{ uri: `${env.DynamicAssetsBaseURL}${this.state.Coupon_Suggestion.image.uri}` }}/>
                            </View>
                        </TouchableOpacity>
                    }
                    

                    <View style={{ paddingHorizontal: 20 }}>

                        <View style={{ flexDirection:"row",flexWrap:"wrap", alignItems: "center", justifyContent:"space-evenly" }}>
                            <TouchableOpacity onPress={() => this._onSPSelect("card")}>
                                <View style={Styles.cardItem}>
                                    <Image style={{ width: 50, height: 50 }} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/card-icons/debit.png` }} />
                                    <Text style={[MainStyles.Text, {}]}>Debit Card</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this._onSPSelect("netbanking")}>
                                <View style={Styles.cardItem}>
                                    <Image style={{ width: 50, height: 50 }} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/card-icons/netb.png` }} />
                                    <Text>Net Banking</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this._onSPSelect("upi")}>
                                <View style={Styles.cardItem}>
                                    <Image style={{ width: 50, height: 50 }} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/card-icons/upi.png` }} />
                                    <Text>UPI</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this._onSPSelect("paytm")}>
                                <View style={Styles.cardItem}>
                                    <Image style={{ width: 50, height: 50 }} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/card-icons/paytm.png` }} />
                                    <Text>Paytm Wallet</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this._onSPSelect("card")}>
                                <View style={Styles.cardItem}>
                                    <Image style={{ width: 50, height: 50 }} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/card-icons/credit.png` }} />
                                    <Text>Credit Card</Text>
                                </View>
                            </TouchableOpacity> 
                            {/*
                    <View style={Styles.cardItem}>
                      <Image style={{width:50, height:50}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/card-icons/phonep.png`}}/>
                      <Text>PhonePe</Text>
                    </View> */}
                        </View>
                    </View>
                </View>
            </ScrollView>
        );
    }
}



const Styles = StyleSheet.create({
    menuItem: { height: 62, width: "100%", borderBottomWidth: 1, borderBottomColor: "#DCDCDC", justifyContent: "center" },
    menuItemText: { ...MainStyles.text, color: "#090320", fontSize: 18, paddingLeft: 40 },
    pageTitle: {
        ...MainStyles.text,
        fontSize: 20,
        marginBottom: 20
    },
    label: {
        ...MainStyles.text,
        fontSize: 17,
        color: "#656565",
        marginBottom: 10
    },
    textInput: {
        flexDirection: "row",
        width: "100%",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#F3F3F3",
        borderRadius: 30,
        marginBottom: 20,
        paddingLeft: 20
    },
    cardItem: { width: 150, height: 80, marginTop: 10, borderWidth: 1, borderColor: "#000", borderRadius: 5, alignContent: "center", alignItems: "center", justifyContent: "center" }
})