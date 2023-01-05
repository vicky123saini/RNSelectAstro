import React, { Component, useEffect, useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, TextInput, Image, ScrollView, Linking, ActivityIndicator, Dimensions, RefreshControl, Platform, ImageBackground, Modal } from 'react-native';
import styles from './Style';
import * as env from '../../../env';
import * as Api from '../../Api';
import * as Auth from '../../Auth';
import {Header, TabButton, SlidMenuButton} from './Controls';
import {Card, CardItem} from 'native-base';
import { Avatar } from 'react-native-elements';

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        sideMenuPopup:false,
        menuList:[
            {id:1, text:"Daily Ledger", selected:true, view:()=> <Tab1View/>},
            {id:2, text:"Monthly Ledger", selected:false, view:()=> <Tab2View/>},
            {id:3, text:"Payout", selected:false, view:()=> <Tab3View/>},
        ]
    };
  }

  componentDidMount = async() => {
    const profile=await Auth.getProfie().then(profile=> JSON.parse(profile));  
    this.setState({profile});
  };
  

  onTabPress = (item) => {
    let newMenuList = this.state.menuList.map(o=>{ if(o.id==item.id) o.selected=true; else o.selected=false; return o});
    this.setState({menuList:newMenuList});
  }

  onLogout = async() => {
    await Api.LogoutService();
    await Auth.Logout();
    try{
      this.props.navigation.dispatch(StackActions.popToTop());
      this.props.navigation.replace("LoginScreen"); 
    }
    catch{
      this.props.navigation.replace("LoginScreen"); 
    }
  }

  render() {
    const SelectedTabView = this.state.menuList.find(o=>o.selected).view;
     
    return (
      <SafeAreaView style={styles.container}>
        <Header {...this.props} onPressMenu={()=> this.setState({sideMenuPopup:true})}/>
        <ImageBackground style={{width:Dimensions.get("window").width, height:(240/320)*Dimensions.get("window").width}} resizeMode="cover" source={{ uri: `${env.AssetsBaseURL}/assets/images/chai-wala/page-bg.png` }}>
            <View style={{height:250, alignItems:"flex-start", justifyContent:"flex-end"}}>
                <Text style={styles.headingText}>Dashboard</Text>
                <View style={{height:50}}>
                <ScrollView horizontal={true}>
                    {
                        this.state.menuList.map((item, index)=> <TabButton key={index} active={item.selected} onPress={()=> this.onTabPress(item)} text={item.text}/>)
                    }
                </ScrollView>
                </View>
            </View>
        </ImageBackground>
        <View style={{marginTop:-50}}>
            <SelectedTabView/>
        </View>
         <Modal visible={this.state.sideMenuPopup} transparent={true} onRequestClose={() => {this.setState({sideMenuPopup:false})}}>
         <TouchableOpacity 
            style={{zindex:0, flex:1, position:"absolute", left:0, right:0, top:0, bottom:0}} 
            activeOpacity={1} 
            onPressOut={() => {this.setState({sideMenuPopup:false})}}
          >
            <View/>
          </TouchableOpacity>
            <View style={{zindex:1, marginVertical:10, marginLeft:Dimensions.get("window").width/2, backgroundColor:"#F5F5F5", flex:1, borderTopLeftRadius:20, borderBottomLeftRadius:20}}>
                    {
                        this.state.profile &&
                        <View style={{flex:1}}>
                            <View style={{alignItems:"center", marginTop:50}}>
                                <Avatar size={70} title={this.state.profile.Name} source={{uri:`${env.DynamicAssetsBaseURL}${this.state.profile.ProfileImage}`}} borderColor="#ccc" borderWidth={1} rounded marginHorizontal={10} titleStyle={{color:"#ccc"}}/>
                                <Text style={{fontWeight:"700"}}>{this.state.profile.Name}</Text>
                            </View>
                            <View style={{marginTop:20}}>
                            {
                                this.state.menuList.map((item, index)=> <SlidMenuButton key={index} onPress={()=> this.onTabPress(item)} text={item.text}/>)
                            }
                            <SlidMenuButton onPress={()=> Linking.openURL(`https://uat.myastrotest.in/vendor-terms-conditions`)} text="View t&c"/>
                            <SlidMenuButton onPress={()=> this.onLogout()} text="Logout"/>
                            </View>
                        </View>
                    }
            </View>
           
         </Modal>
      </SafeAreaView>
    );
  }
}

const Tab1View = () =>{
    const[data, setData]=useState()
    useEffect(()=>{
        Api.getDaily_Vendor_reportsService().then(resp=>{
            console.log("getDaily_Vendor_reportsService", resp);
            if(resp.ResponseCode==200){
                setData(resp.data);
            }
        })
    },[]);

    return(
        <View style={{marginHorizontal:20}}>
            <Card style={{borderRadius:20}}>
                <CardItem style={{borderRadius:20}}>
                    <View style={{flex:1, alignItems:"center"}}><Text>ID</Text></View>
                    <View style={{flex:2, alignItems:"center"}}><Text>Particulars</Text></View>
                    <View style={{flex:2, alignItems:"center"}}><Text>Cost/Cup</Text></View>
                </CardItem>
                {
                    data && data.map((item, index)=>
                    <CardItem key={index} style={styles.tableRaw}>
                        <View style={{flex:1, borderRightWidth:1, borderRightColor:"#9B9B9B", alignItems:"center", paddingVertical:10}}><Text>{item.Id}</Text></View>
                        <View style={{flex:2, borderRightWidth:1, borderRightColor:"#9B9B9B", alignItems:"center", paddingVertical:10}}><Text>{item.MobileNo}</Text></View>
                        <View style={{flex:2, alignItems:"center", paddingVertical:10}}><Text>{item.Unit_Price}</Text></View>
                    </CardItem>
                    )
                    ||
                    <CardItem style={styles.tableRaw}>
                        <View style={{flex:1, alignItems:"center", paddingVertical:10}}><Text>NO RECORD FOUND</Text></View>
                    </CardItem>
                }
                <CardItem style={{borderRadius:20, justifyContent:"flex-end"}}>
                    <Text style={{color:"#552675", fontWeight:"bold", marginRight:10}}>Daily Total</Text>
                    <Text style={{width:124, height:30, textAlignVertical:"center", paddingHorizontal:5, backgroundColor:"#fff", borderRadius:10, borderWidth:1, borderColor:"#E2E2E2"}}>{data ? Object.values(data).reduce((r, { Unit_Price }) => r + Unit_Price, 0):0}</Text>
                </CardItem>
            </Card>
        </View>
    )
}
const Tab2View = () =>{
    const[data, setData]=useState()
    useEffect(()=>{
        Api.getMonthly_Vendor_reportsService().then(resp=>{
            console.log("getMonthly_Vendor_reportsService", resp);
            if(resp.ResponseCode==200){
                setData(resp.data);
            }
        })
    },[]);
    return(
        <View style={{marginHorizontal:20}}>
            <Card style={{borderRadius:20}}>
                <CardItem style={{borderRadius:20}}>
                    <View style={{flex:2, alignItems:"center"}}><Text>Date</Text></View>
                    <View style={{flex:1, alignItems:"center"}}><Text>Cups</Text></View>
                    <View style={{flex:1, alignItems:"center"}}><Text>Cost/Cup</Text></View>
                    <View style={{flex:1, alignItems:"center"}}><Text>Amount</Text></View>
                </CardItem>
                {
                    data && data.map((item, index)=>
                    <CardItem key={index} style={styles.tableRaw}>
                        <View style={{flex:2, borderRightWidth:1, borderRightColor:"#9B9B9B", alignItems:"center", paddingVertical:10}}><Text>{item.Datetimes}</Text></View>
                        <View style={{flex:1, borderRightWidth:1, borderRightColor:"#9B9B9B", alignItems:"center", paddingVertical:10}}><Text>{item.Total_Cups}</Text></View>
                        <View style={{flex:1, alignItems:"center", borderRightWidth:1, borderRightColor:"#9B9B9B", paddingVertical:10}}><Text>{item.Total_Cups_Price}</Text></View>
                        <View style={{flex:1, alignItems:"center", paddingVertical:10}}><Text>{item.Total_Amount}</Text></View>
                    </CardItem>
                    )
                    ||
                    <CardItem style={styles.tableRaw}>
                        <View style={{flex:1, alignItems:"center", paddingVertical:10}}><Text>NO RECORD FOUND</Text></View>
                    </CardItem>
                }
                <CardItem style={{borderRadius:20, justifyContent:"flex-end"}}>
                    <Text style={{color:"#552675", fontWeight:"bold", marginRight:10}}></Text>
                    <Text style={{width:124, height:30, textAlignVertical:"center", paddingHorizontal:5, backgroundColor:"#fff", borderRadius:10, borderWidth:1, borderColor:"#E2E2E2"}}>{data ? Object.values(data).reduce((r, { Total_Amount }) => r + Total_Amount, 0):0}</Text>
                </CardItem>
            </Card>
        </View>
    )
}
const Tab3View = () =>{
    const[data, setData]=useState()
    useEffect(()=>{
        Api.get_Vendor_Payout_reportsService().then(resp=>{
            console.log("get_Vendor_Payout_reportsService", resp);
            if(resp.ResponseCode==200){
                setData(resp.data);
            }
        })
    },[]);
    return(
        <View style={{marginHorizontal:20}}>
            <Card style={{borderRadius:20}}>
                <CardItem style={{borderRadius:20}}>
                    <View style={{flex:1, alignItems:"center"}}><Text>Entry</Text></View>
                    <View style={{flex:1, alignItems:"center"}}><Text>Debit</Text></View>
                    <View style={{flex:1, alignItems:"center"}}><Text>Credit</Text></View>
                    <View style={{flex:1, alignItems:"center"}}><Text>Balance</Text></View>
                </CardItem>
                {
                    data && data.map((item, index)=>
                    <CardItem key={index} style={styles.tableRaw}>
                        <View style={{flex:1, borderRightWidth:1, borderRightColor:"#9B9B9B", alignItems:"center", paddingVertical:10}}><Text>{item.Datetimes}</Text></View>
                        <View style={{flex:1, borderRightWidth:1, borderRightColor:"#9B9B9B", alignItems:"center", paddingVertical:10}}><Text>{item.Debit}</Text></View>
                        <View style={{flex:1, alignItems:"center", borderRightWidth:1, borderRightColor:"#9B9B9B", paddingVertical:10}}><Text>{item.Credit}</Text></View>
                        <View style={{flex:1, alignItems:"center", paddingVertical:10}}><Text>{item.Balance}</Text></View>
                    </CardItem>
                    )
                    ||
                    <CardItem style={styles.tableRaw}>
                        <View style={{flex:1, alignItems:"center", paddingVertical:10}}><Text>NO RECORD FOUND</Text></View>
                    </CardItem>
                }
                <CardItem style={{borderRadius:20, justifyContent:"flex-end"}}>
                    <Text style={{color:"#552675", fontWeight:"bold", marginRight:10}}></Text> 
                </CardItem>
            </Card>
        </View>
    )
}