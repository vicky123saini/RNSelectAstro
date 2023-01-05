import React, { Component } from 'react'
import { View, Text, TextInput, TouchableOpacity, Image, SafeAreaView, ScrollView, StyleSheet, ImageBackground, Modal, Alert, Dimensions } from 'react-native'
import * as Api from '../../../Api';
import * as Auth from '../../../Auth';
import * as env from '../../../../env';
import {Button} from './Controls';

import LinearGradient from 'react-native-linear-gradient';
export default class BuyMoreScreen extends Component {
     
    constructor(props) {
        super(props);
        this.state = {
            modalVisible:false,
            customPackageVisible:false
        };
      }

      componentDidMount = () => {
        Api.GetBuyMealsGauSevaService().then(resp => {
            console.log("GetBuyMealsGauSevaService resp", resp);
            if (resp.ResponseCode == 200) {
                this.setState({data:resp.data});
            }
            else{
                Alert.alert(null, resp.ResponseMessage);
            }
        });

        // Api.GetAppSettingByKetService(Auth.AppSettingKey.Gau_Seva_Per_Meal_INR).then(resp=>{
        //     console.log("GetAppSettingByKetService resp", resp);
        //     var Gau_Seva_Per_Meal_INR=parseFloat(resp.data);
        //     this.setState({Gau_Seva_Per_Meal_INR});
        // });
      };

      onChangeCustomNoOffMeals = (text) => {
        console.log("onChangeCustomNoOffMeals", text);
        if(isNaN(text))return;

        var oneMeelPlan = this.state.data[0];

        if(text==""){
            this.setState({CustomNoOffMeals:"", CustomAmount:""}); 
        }
        else{
            console.log("CustomNoOffMeals", parseInt(text), "CustomAmount", oneMeelPlan.Amount*parseInt(text))
            this.setState({CustomNoOffMeals:parseInt(text), CustomAmount:oneMeelPlan.Amount*parseInt(text)});
        }
      }

      buyNowOnPress = (type) => {
        this.setState({customPackageVisible:false});

        if(type=="custom"){
            if(this.state.CustomNoOffMeals==null || this.state.CustomNoOffMeals=="" || this.state.CustomNoOffMeals==0)
            {
                Alert.alert(null, "Please Enter No. Of Days");
                return;
            }
            var oneMeelPlan = this.state.data[0];
            var SelectedPlan = {
                Id:0, 
                Amount: oneMeelPlan.Amount*this.state.CustomNoOffMeals,
                GST_Value: oneMeelPlan.GST_Value*this.state.CustomNoOffMeals,
                NetAmount: oneMeelPlan.NetAmount*this.state.CustomNoOffMeals
            }
            this.props.navigation.navigate("GauDaanPaymentDetailsScreen", {SelectedPlan})
        }
        else{
            if(!this.state.SelectedPlan){
                Alert.alert(null, "Please Select No. Of Days");
                return;
            }
            console.log("SelectedPlan",this.state.SelectedPlan);
            this.props.navigation.navigate("GauDaanPaymentDetailsScreen", {SelectedPlan: this.state.SelectedPlan})
        }
      }

    render() {
        return (
            <SafeAreaView>
                <ScrollView>
                    <View>
                        <Image source={{ uri: `${env.AssetsBaseURL}/assets/images/gau-seva/Rectangle65.png` }} style={styles.Image_Top_View} />
                    </View>
                    <View style={styles.View_One}>
                        <View style={styles.View_Two}>
                            {
                                this.state.data && this.state.data.map((item, index)=>(
                                <TouchableOpacity onPress={()=> this.setState({SelectedPlan:item})}>
                                    <View style={styles.Row_justify}>
                                        <View style={{ width: '40%' }}>
                                            <Text style={styles.Text20}>{item.Title}</Text>
                                        </View>
                                        <View style={{ width: '40%' }}>
                                            <Text style={styles.Text20_lightcolor}>₹ {item.Amount}</Text>
                                        </View>
                                        <Image source={{ uri: `${env.AssetsBaseURL}/assets/images/gau-seva/rb${this.state.SelectedPlan && this.state.SelectedPlan.Id==item.Id ? "-checked" :""}.png` }} style={{height:24, width:24}} resizeMode="stretch"/>
                                    </View>
                                </TouchableOpacity>
                             ))
                            }
                            <View style={{width:Dimensions.get("window").width-80, marginTop:10}}>
                                <Button onPress={()=> this.setState({customPackageVisible:true, CustomAmount:null, CustomNoOffMeals:null})} title="Customize"/>
                            </View>
                        </View>

                        <Button style={{width:Dimensions.get("window").width-40}} onPress={()=> this.buyNowOnPress("package")} title="Buy Now"/>
                    </View>

                    <Modal visible={this.state.customPackageVisible} transparent={true}>
                        <View style={{flex:1, alignContent:"center", justifyContent:"center", backgroundColor: 'rgba(0,0,0,0.7)'}}>
                            <View style={{margin:20, padding:10, borderRadius:10, backgroundColor:"#EDEDED"}}>
                                <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-evenly"}}>
                                    <Text style={{fontSize:20, fontWeight:"bold", color:"#131111"}}>No of Days</Text>
                                    <TextInput keyboardType='number-pad' style={{width:61, padding:5, color:"#000", borderColor:"#ACACAC", borderWidth:1, borderRadius:10}} value={this.state.CustomNoOffMeals} onChangeText={(text)=> this.onChangeCustomNoOffMeals(text)}/>
                                    <Text style={{fontSize:20, fontWeight:"bold", color:"#131111"}}>₹</Text>
                                    <Text style={{width:108, padding:8, borderColor:"#ACACAC", backgroundColor:"#d5d5d5", borderWidth:1, borderRadius:10}}>{this.state.CustomAmount}</Text>
                                </View>
                                <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-evenly", marginTop:20}}>
                                    <TouchableOpacity onPress={()=> this.setState({customPackageVisible:false})}>
                                        <Text style={{textDecorationLine:"underline"}}>Go Back</Text>
                                    </TouchableOpacity>
                                     
                                    <TouchableOpacity onPress={()=> this.buyNowOnPress("custom")}>
                                        <LinearGradient colors={["#63398D", "#E5307E"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{borderRadius:21}}>
                                            <View style={[{alignItems:"center", justifyContent:"center", height:22, width:88}]}>
                                                <Text style={{color:"#fff", fontSize:12, fontWeight:"700"}}>Buy Now</Text>
                                            </View>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>

                    {/* <Modal animationType="slide" transparent={true}
                        visible={this.state.modalVisible} onRequestClose={() => {
                            this.setState({modalVisible:false})
                        }} >

                        <View style={styles.centeredView_One}>
                            <View style={styles.modalView_One}>
                                <View style={{ alignItems: 'center' }}>
                                    <Text style={styles.Text16}>Gau Mata Ka Ashirwad, Apke Sath</Text>
                                    <Image source={{ uri: `${env.AssetsBaseURL}/assets/images/gau-seva/Group.png` }} style={styles.Image_180} />
                                    <Text style={[styles.Text20_white,{margin:10}]}>Thank you for your donation.</Text>
                                    <Text style={styles.Text10_Center}>Your devotion attracts the blessings that you’re waiting for.
                                        With your contribution, we will provide  meals for cows.</Text>
                                    <Text style={styles.Text10}>Pass on the good deed. Share it with your friends. </Text>
                                </View>
                                <View style={{ flexDirection: 'row' }}>
                                    <View style={styles.Text_Direction}>
                                        <View style={styles.View_Three}>
                                            <Text style={styles.Text20_color}>Recharge</Text>
                                        </View>
                                        <Text style={styles.Text15}>COUPON CODE</Text>
                                    </View>
                                    <View style={{ width: '2%' }}>
                                        <Image source={{ uri: `${env.AssetsBaseURL}/assets/images/gau-seva/Line_3.png` }} style={{ height: 200 }} />
                                    </View>
                                    <View style={{ width: '49%' }}>
                                        <View style={{margin:10}}>
                                            <Text style={{fontSize:10,color:'#fff'}}>Register yourself at{'\n'}
                                                myastrotest.app{'\n'}
                                                Or Downlaod the app.{'\n'}
                                                https://3ww4.short.gy/yWYLwP</Text>
                                        </View>
                                        <View style={{margin:10}}>
                                            <Image source={{ uri: `${env.AssetsBaseURL}/assets/images/gau-seva/RectangleQbar.png` }}/>
                                        </View>

                                    </View>
                                </View>
                            </View>
                        </View>
                    </Modal> */}

                </ScrollView>
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    Image_Top_View: { height: 475, width: '100%' },
    View_One: { backgroundColor: '#fff', top: -44, height: '100%', width: '100%', borderRadius: 50, paddingHorizontal: 15, alignItems: 'center' },
    View_Two: { backgroundColor: '#EDEDED', width: '100%', borderRadius: 50, margin: 20, padding: 20 },
    View_Three:{ height: 30, width: 120, borderRadius: 7, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center' },
    Text20: { fontSize: 20, fontWeight: '600' },
    Text20_color:{ fontSize: 20, fontWeight: '700', color: '#843A89' },
    Text20_lightcolor: { fontSize: 20, fontWeight: '600', color: '#646464' },
    Text15:{ fontSize: 15, fontWeight: '700', color: '#fff' },
    Text16:{ margin: 10, fontSize: 16, fontWeight: '700', color: '#fff' },
    Text10_Center:{ fontSize: 10, fontWeight: '400', color: '#fff', margin: 30, textAlign: 'center' },
    Text10:{ margin: 10, fontSize: 12, fontWeight: '700', color: '#fff'},
    Row_justify: { flexDirection: 'row', justifyContent: 'space-between', margin: 10 },
    Image_Background: { height: 45, width: '100%', justifyContent: 'center', alignItems: 'center', alignSelf: 'center', margin: 10 },
    Image_180:{ height: 130, width: 185 },
    Text20_white: { fontSize: 20, fontWeight: '600', color: '#fff' },
    Text_Direction:{ width: '49%', justifyContent:'center',alignItems:'center' },
    centeredView_One: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        //marginTop: 50,
        backgroundColor: 'rgba(52, 52, 52, 0.8)'
    },
    modalView_One: {
        //height:715,
        width: '95%',
        backgroundColor: "#843A89",
        borderRadius: 50,
        padding: 15,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },

})