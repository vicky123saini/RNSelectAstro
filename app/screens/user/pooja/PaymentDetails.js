import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, SafeAreaView, ScrollView, ActivityIndicator, ImageBackground } from 'react-native';
import analytics from '@react-native-firebase/analytics';
import RazorpayCheckout from 'react-native-razorpay';
import LinearGradient from 'react-native-linear-gradient';
import MainStyles from '../../../Styles';
import { Toast, Card, cardItem, CardItem, List, ListItem, Left, Right } from 'native-base';
import AllInOneSDKManager from 'paytm_allinone_react-native';
import Overlay from 'react-native-modal-overlay';
import * as env from '../../../../env';
import * as Api from '../../../Api';
import * as Auth from '../../../Auth';
import * as Utility from '../../../Functions';
import moment from 'moment';

export default class PaymentDetails extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading:false
        };
    }

    componentDidMount = () => { 
        
        Auth.getProfie().then(Profile => this.setState({ Profile: JSON.parse(Profile) })).catch(()=> console.error("err getProfie paymentDetails"));
        const { SelectedPlan } = this.props.route.params;
        this.setState({SelectedPlan});

        console.log("SelectedPlan", SelectedPlan);
    }

    _onSPSelect = (Mathod) => {

        const { SelectedPlan, AppliedCouponCode, selectedDate, selectedSlot} = this.props.route.params;
        
        if(this.state.loading) return;
        this.setState({loading:true});

        var req={
            PackageId:SelectedPlan.Id,
            Calendar_Slot_Id :selectedSlot.Id,
            Puja_Date:moment(selectedDate).format("DD/MMM/YYYY"),
            TransactionId:Utility.guidGenerator(),
            Amount:SelectedPlan.Price,
            Discount_Amount:SelectedPlan.DiscountPrice,
            TaxAmount:SelectedPlan.TaxAmount,
            DonateAmount:SelectedPlan.DonatePrice,
            Coupon:AppliedCouponCode,
            NetAmount:SelectedPlan.NetAmount,
            Mathod:Mathod,
            OrderId:Utility.guidGenerator()
        }
        const transaction = {NetAmount:SelectedPlan.NetAmount, TxnId:req.TransactionId, OrderId:req.OrderId, txnToken:""}

        console.log("Save_MandirPuja_BookingService req",req);
        Api.Save_MandirPuja_BookingService(req).then(response => {
            console.log("Save_MandirPuja_BookingService resp",response);
            if(response.ResponseCode == 200){
                switch (Mathod) {
                    case "paytm": {
                        this.paytmSubmit(SelectedPlan, response.data, Mathod);
                        break;
                    }
                    default: {
                        this.razorpaySubmit(SelectedPlan, transaction, Mathod);
                        break;
                    }
                }
            }
            else{
                this.setState({loading:false});
                Alert.alert(
                    null,
                    response.ResponseMessage,
                    [{
                        text: "OK"
                    }]
                  );
            }
        })

        
         
    };

    razorpaySubmit = (SelectedPlan, transaction, Mathod) => {
        var options = {
            description: 'Select Astro txnid:' + transaction.TxnId,
            image: 'https://services.myastrotest.in/Content/App/assets/images/logo.png',
            currency: 'INR',
            key: 'rzp_live_jef3Y0sZQebKKk',
            amount: transaction.NetAmount * 100,
            name: 'plan ' + transaction.NetAmount,
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
            var treq = { TransactionId: transaction.TxnId, PaymentGateway_OrderId: data.razorpay_payment_id, Transaction_Status:"Success" };
            Api.Update_Puja_BookingService(treq).then(tresp => {
                this.setState({loading:false});
                if (tresp.ResponseCode == 200) {
                    this.props.navigation.replace("PoojsSuccessScreen");
                }
            })
            //alert(`Success: ${data.razorpay_payment_id}`);
        }).catch((error) => {
            this.setState({loading:false});
            // handle failure
            //alert(`Error: ${error.code} | ${error.description}`);
            alert("Oops! Transaction Fail. please try again");
            this.props.navigation.replace("PoojaListScreen");
             
        });
    }

    paytmSubmit = (SelectedPlan, transaction, Mathod) => {
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
                this.setState({loading:false});
                /*
                 {"BANKNAME": "NKMB", "BANKTXNID": "202117423419462", "CHECKSUMHASH": "9zUNSoGS2XEChk0okT7wgAjKXqA4Fi3xXToBVjQ2u54leWuKkJKQEpdoW/e+mJKWrPzdpqeEh5OrzKAk/PPGGIGwJEL21jiqsM+AaTYj4Xo=", "CURRENCY": "INR", "GATEWAYNAME": "BOBFSS", "MID": "Select06912760077014", "ORDERID": "7W6B73zYruI_", "PAYMENTMODE": "CC", "RESPCODE": "01", "RESPMSG": "Txn Success", "STATUS": "TXN_SUCCESS", "TXNAMOUNT": "59.00", "TXNDATE": "2021-06-23 16:41:09.0", "TXNID": "20210623111212800110168423815791449"}
                */
                if (parseFloat(transaction.NetAmount) != parseFloat(result.TXNAMOUNT)) {
                    //alert("Oops! amount is not matching with transaction amount.");
                    alert("Oops! Transaction has been cancelled. Please try again.");
                    this.props.navigation.replace("PoojaListScreen");

                }
                else if(result.RESPCODE=="01"){
                    var treq = { TransactionId: transaction.TxnId, PaymentGateway_OrderId: result.TXNID, Transaction_Status:"Success" };
                    Api.Update_Puja_BookingService(treq).then(tresp => {
                        if (tresp.ResponseCode == 200) {
                            this.props.navigation.replace("PoojsSuccessScreen");
                        }
                    })
                }
                else{
                    alert("Oops! amount is not matching with transaction amount.");
                    this.props.navigation.replace("PoojaListScreen");
                }
            })
            .catch((err) => {
                this.setState({loading:false});
                console.log("paytm error", err);
                alert("Oops! Transaction Fail. please try again");
                this.props.navigation.replace("PoojaListScreen");
            });
    }
 

    render() {
        const { SelectedPlan } = this.props.route.params;
        return (
            this.state.loading && <ActivityIndicator color="blue"/> ||
            <SafeAreaView>
            <ScrollView>
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

                <View style={{ flex: 1 }}>
                    <List style={{backgroundColor:"#fff"}}>
                        <ListItem >
                            <Left style={{ left: 20 }}><Text style={[MainStyles.text, { fontWeight: "700", fontSize: 18 }]}>Total Payable Amount</Text></Left>
                            <Right style={{ right: 20 }}><Text style={[MainStyles.text, { fontWeight: "700", fontSize: 18 }]}>₹{SelectedPlan.NetAmount}</Text></Right>
                        </ListItem>
                    </List>

                    

                    <View style={{ paddingHorizontal: 20 }}>

                        <View style={{ }}>
                            <TouchableOpacity onPress={() => this._onSPSelect("card")}>
                                <View style={Styles.cardItem}>
                                    <Image style={{width: 30, height: 30, marginHorizontal:10 }} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/card-icons/debit.png` }} />
                                    <Text style={[MainStyles.Text, {flex:1}]}>Debit Card</Text>
                                    <Text style={{fontSize:20, flex:0, marginHorizontal:10}}>{'>'}</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this._onSPSelect("netbanking")}>
                                <View style={Styles.cardItem}>
                                    <Image style={{ width: 30, height: 30, marginHorizontal:10 }} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/card-icons/netb.png` }} />
                                    <Text style={[MainStyles.Text, {flex:1}]}>Net Banking</Text>
                                    <Text style={{fontSize:20, flex:0, marginHorizontal:10}}>{'>'}</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this._onSPSelect("upi")}>
                                <View style={Styles.cardItem}>
                                    <Image style={{ width: 30, height: 30, marginHorizontal:10 }} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/card-icons/upi.png` }} />
                                    <Text style={[MainStyles.Text, {flex:1}]}>UPI</Text>
                                    <Text style={{fontSize:20, flex:0, marginHorizontal:10}}>{'>'}</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this._onSPSelect("paytm")}>
                                <View style={Styles.cardItem}>
                                    <Image style={{ width: 30, height: 30, marginHorizontal:10 }} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/card-icons/paytm.png` }} />
                                    <Text style={[MainStyles.Text, {flex:1}]}>Paytm Wallet</Text>
                                    <Text style={{fontSize:20, flex:0, marginHorizontal:10}}>{'>'}</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => this._onSPSelect("card")}>
                                <View style={Styles.cardItem}>
                                    <Image style={{ width: 30, height: 30, marginHorizontal:10 }} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/card-icons/credit.png` }} />
                                    <Text style={[MainStyles.Text, {flex:1}]}>Credit Card</Text>
                                    <Text style={{fontSize:20, flex:0, marginHorizontal:10}}>{'>'}</Text>
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
            </SafeAreaView>
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
    cardItem: { width: "100%", height: 64, marginTop: 10, borderRadius: 5, flexDirection:"row", alignItems: "center", backgroundColor: "#fff" }
})