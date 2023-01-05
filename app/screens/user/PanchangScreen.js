import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, ScrollView, SafeAreaView, Linking, ActivityIndicator, Dimensions, RefreshControl, Picker } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import MainStyles from '../../Styles';
import analytics from '@react-native-firebase/analytics';
import * as UserControls from './Controls';
import * as env from '../../../env';
import * as Api from '../../Api';
import moment from 'moment';
import {Singular} from 'singular-react-native';

export default class PanchangScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      TabIndex:0
    };
  } 
 
  componentDidMount = async() => {
    analytics().logEvent("Panchang");

    console.log("GetEnduserProfileService req")
    Api.GetEnduserProfileService().then(resp => {
        console.log("GetEnduserProfileService resp", JSON.stringify(resp));
        if (resp.ResponseCode == 200) {
          this.setState({profile:resp.data});
        }
    });
    
  };
  
  onTabChange = (TabIndex) => {
    this.setState({TabIndex});
  }
  render() {
    return (
      !this.state.profile && <View><Text>..</Text></View>||

      <SafeAreaView style={{flex:1}}>
        {
          this.state.profile && <UserControls.Header {...this.props} title="Panchang" shareText={this.state.profile.ShareText}/>
        }
        <View style={{flex:0, flexDirection:"row", padding:10}}>
          <TouchableOpacity onPress={()=> {Singular.event("PanchangScreen_Today"); this.onTabChange(0)}}>
            <LinearGradient colors={this.state.TabIndex==0 ? ["#FB65A0", "#FB65A0"]:["#fff", "#fff"]} style={[{ borderRadius: 30, marginLeft: 10 }]}>
              <Text style={[MainStyles.text,{borderRadius:10, paddingHorizontal:20, paddingVertical:3}, this.state.TabIndex==0 ? { color:"#fff" }:{color:"#000"}]}>Today</Text>
            </LinearGradient>
          </TouchableOpacity>
          <TouchableOpacity onPress={()=> {Singular.event("PanchangScreen_Tomorrow"); this.onTabChange(1)}}>
            <LinearGradient colors={this.state.TabIndex==1 ? ["#FB65A0", "#FB65A0"]:["#fff", "#fff"]} style={[{ borderRadius: 30, marginLeft: 10 }]}>
              <Text style={[MainStyles.text,{borderRadius:10, paddingHorizontal:20, paddingVertical:3}, this.state.TabIndex==1 ? { color:"#fff" }:{color:"#000"}]}>Tomorrow</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        
        <ScrollView style={{flex:1, backgroundColor:"#fff"}}> 
         {
            this.state.TabIndex==0 && <PanchangView {...this.props} profile={this.state.profile} date={moment()}/>
            ||
            this.state.TabIndex==1 && <PanchangView {...this.props} profile={this.state.profile} date={moment().add(1,'days')}/>
           
         }
         <View>
        <UserControls.ExpertSuggestionView navigation={this.props.navigation}/>
      </View>
        </ScrollView> 
        
       
      </SafeAreaView>
    );
  }
}


const PanchangView = (props) => {
  const[state, setState]=useState({});
  //const[sunrise, setSunrise]=useState(null);
  //const[sunset, setSunset]=useState(null);

  useEffect(()=>{
    const{profile}=props;

    const req = {
      Name:null,
      Gender:null,
      Dob:props.date.format("DD/MMM/YYYY"),
      Tob:props.date.format("HH:mm"),
      Pob:profile.PlaceOfBirth??'Delhi, India',
      IsNew:false
    }
    console.log("GetPanchangService req", req)
    Api.GetPanchangService(req).then(resp=>{
      console.log("GetPanchangService resp", JSON.stringify(resp));
      if(resp.ResponseCode==200){
        setState({...state, Panchang:resp.data})
      }
      else{
        alert(resp.ResponseMessage);
      }
    });

    // console.log("GetPanchangSunriseService req", req)
    // Api.GetPanchangSunriseService(req).then(resp=>{
    //   console.log("GetPanchangSunriseService resp", JSON.stringify(resp));
    //   if(resp.ResponseCode==200){
    //     setSunrise(resp.data)
    //   }
    //   else{
    //     alert(resp.ResponseMessage);
    //   }
    // });

    // console.log("GetPanchangSunsetService req", req)
    // Api.GetPanchangSunsetService(req).then(resp=>{
    //   console.log("GetPanchangSunsetService resp", JSON.stringify(resp));
    //   if(resp.ResponseCode==200){
    //     setSunset(resp.data)
    //   }
    //   else{
    //     alert(resp.ResponseMessage);
    //   }
    // });

  },[props.date])

  return(
    state.Panchang && state.Panchang.response &&
    <View style={{}}>
      <View style={{height:40, marginTop:26, backgroundColor:"#F3F3F3", alignItems:"center", justifyContent:"center"}}>
        <Text>{props.date.format("Do MMMM YYYY, dddd")}</Text>
      </View>
      <View style={{flexDirection:"row", flexWrap:"wrap", alignItems:"flex-start", justifyContent:"space-evenly", paddingVertical:20}}>
        <CardView style={{width:"40%", height:80}} headerStyle={{color:"green"}} {...props} title="Shubh Mahurat" date={state.Panchang.response.advanced_details.abhijit_muhurta.start + ' to ' + state.Panchang.response.advanced_details.abhijit_muhurta.end}/> 
        <CardView style={{width:"40%", height:80}} headerStyle={{color:"red"}} {...props} title="Rahukaal" date={state.Panchang.response.rahukaal}/>
        <CardView style={{width:"40%", height:80, marginTop:20}} {...props} title="Gulika" date={state.Panchang.response.gulika}/>
        <CardView style={{width:"40%", height:80, marginTop:20}} {...props} title="Yamakanta" date={state.Panchang.response.yamakanta}/>
      </View>

      <View style={{marginHorizontal:20}}>
        <TipsView {...props} data={state.Panchang.response}/>
      </View>

      <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-evenly", marginTop:20}}>
         
        <View style={{alignItems:"center", justifyContent:"space-evenly", borderWidth:1, borderColor:"#FB65A0", borderRadius:20, paddingVertical:10, paddingHorizontal:30}}>
          <Text style={{fontWeight:"bold", fontSize:18}}>Sunrise</Text>
          <Image style={{width:50, height:50, resizeMode:"stretch"}} source={{uri: `${env.AssetsBaseURL}/assets/images/sunsine.png` }}/>
          <Text>{state.Panchang.response.advanced_details.sun_rise}</Text>
        </View>
      
        <View style={{alignItems:"center", justifyContent:"space-evenly", borderWidth:1, borderColor:"#FB65A0", borderRadius:20, paddingVertical:10, paddingHorizontal:30}}>
          <Text style={{fontWeight:"bold", fontSize:18}}>Sunset</Text>
          <Image style={{width:50, height:50, resizeMode:"stretch"}} source={{uri: `${env.AssetsBaseURL}/assets/images/sunset.png` }}/>
          <Text>{state.Panchang.response.advanced_details.sun_set}</Text>
        </View>

      </View>
    </View>
    ||
   <View><Text>Loading...</Text></View>
  )
}

const CardView = (props) => {
  return(
     
    <View style={[{padding:10, borderWidth:1, borderRadius:10, borderColor:"#FB65A0"}, props.style]}>
      <Text style={[{fontWeight:"700"}, props.headerStyle]}>{props.title}</Text>
      <Text style={{}}>{props.date}</Text>
    </View>
    
  )
}

const TipsView = (props) => {
  const{data}=props;
  return(
    <View style={{borderRadius:10, minHeight:208, borderWidth:1, borderRadius:10, borderColor:"#FB65A0"}}>
        <View style={{flex:1, padding:10, width:"100%"}}>
          <Text style={{fontWeight:"700"}}>Tithi</Text>
          <Text style={{}}>{data.tithi.name} {data.tithi.start} {data.tithi.end}</Text>
        </View>
        <View style={{flex:1, borderTopWidth:1, borderTopColor:"#FB65A0", flexDirection:"row"}}>
          <View style={{padding:10, flex:1, borderRightWidth:1, borderRightColor:"#FB65A0"}}>
            <Text style={{fontWeight:"700"}}>Nakshatra</Text>
            <Text style={{}}>{data.nakshatra.name}</Text>
            <Text style={{fontSize:12}}>{data.nakshatra.start} to {data.nakshatra.end}</Text>
          </View>
          <View style={{padding:10, flex:1}}>
            <Text style={{fontWeight:"700"}}>Karana</Text>
            <Text style={{}}>{data.karana.name}</Text>
            <Text style={{fontSize:12}}>{data.karana.start} to {data.karana.end}</Text>
          </View>
        </View>
    </View>
  )
}

 
  