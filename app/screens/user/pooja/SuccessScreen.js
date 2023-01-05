import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import analytics from '@react-native-firebase/analytics';
import {Singular} from 'singular-react-native';
import * as env from '../../../../env'; 
import * as Api from '../../../Api';
import * as Auth from '../../../Auth';

export default class SuccessScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount = () => {
    analytics().logEvent("Puja_Success_Payment");
    this._timeout=setTimeout(() => {
      Api.PujaMyPujaBookingsCouponService(1, 100).then(response=>{
        console.log("PujaMyPujaBookingsCouponService resp",response);
          if(response.ResponseCode == 200){
            var ids=response.data.map(o=>o.Id);
            var maxId=Math.max.apply(null, ids);
            this.props.navigation.replace("MyBookingDetailsScreen", {Id:maxId});
          }
      });

       
    }, 3000);
  };
  
  componentWillUnmount = () =>{
    clearTimeout(this._timeout);
  }

  render() {
    return (
      <LinearGradient colors={["#157A20", "#20962C"]} style={{flex:1, alignContent:"center", alignItems:"center", justifyContent:"center"}}>
          <Image style={{width:102, height:102 }} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/icons/ic_tick_ill_xhdpi.png`}}/>
        <Text style={{fontWeight:"bold", color:"#fff", fontSize:24, marginTop:10}}> Transaction Successfull </Text>
        <Text style={{color:"#fff", fontSize:16, textAlign:"center", marginTop:10}}>Your pooja is booked</Text>
        <Text style={{color:"#fff", fontSize:16, textAlign:"center", marginTop:40}}>Booking Reference ID:</Text>
        <Text style={{color:"#fff", fontSize:16, textAlign:"center", marginTop:10}}>MDNP210502</Text>
        {/* <TouchableOpacity onPress={() => this.props.navigation.replace("ExpertListScreen")}>
          <Text style={{width:"100%", padding:20, textAlign:"center", color:"#fff", fontSize:18, fontWeight:"bold"}}>Go To Home</Text>
        </TouchableOpacity> */}
       
      </LinearGradient>
    );
  }
}
