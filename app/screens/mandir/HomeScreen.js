import React, { Component, useEffect, useState } from 'react';
import {SafeAreaView, View, Text, StyleSheet, TextInput, Image, ScrollView, Linking, ActivityIndicator, Dimensions, RefreshControl, ImageBackground, TouchableOpacity } from 'react-native';
import Overlay from 'react-native-modal-overlay';
import LinearGradient from 'react-native-linear-gradient'; 
import MainStyles from '../../Styles';  
import analytics from '@react-native-firebase/analytics'; 
import {Singular} from 'singular-react-native'; 
import moment from 'moment';
import { SliderBox } from "react-native-image-slider-box";
import { Calendar } from 'react-native-calendars';
import * as env from '../../../env';
import * as Api from '../../Api';
import * as Auth from '../../Auth';
import * as MyControls from './Controls';

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tabs:[
        {id:1, title:"आने वाली पूजा 72 घंटे में", selected:true, TabView: ()=> { return(<Tab1View {...this.props}/>) }},
        {id:2, title:"कैलेंडर", TabView: ()=> { return(<Tab2View {...this.props}/>) }}
      ]
    };
  }

  componentDidMount = () => {
    this.binddata();
    
    this._unsubscribe1 = this.props.navigation.addListener('focus', () => {
         
      this.setState({PageNo:1, data:[], isEnd:false},()=> this.binddata());
    });
    this._unsubscribe2 = this.props.navigation.addListener('blur', () => {
       
    });
  };

  onRefresh = () => {
    this.setState({PageNo:1, data:[], isEnd:false, refreshing:true},()=> this.binddata());
  }

  binddata = () => {
    Api.Acharaya_PujaBookings_Top1Service().then(response => {
      console.log("Acharaya_PujaBookings_Top1Service resp", response);
      if (response.ResponseCode == 200) {
        this.setState({data:response.data, refreshing:false});
        var now = moment();
        var end = moment(response.data.Puja_Start_DateTime);
        var pendingTimeSS = end.diff(now, 'seconds');

        if (pendingTimeSS > 0) {
          this.setState({ pendingTimeSS }); 

          // this.interval = setInterval(() => {
          //   console.log("interval", this.state.pendingTimeSS)
          //   this.setState({ pendingTimeSS: this.state.pendingTimeSS - 1 });
          // }, 1000);
        }
        else this.setState({ pendingTimeSS:0 }); 
      }
    });

  }
  
  componentWillUnmount = () => {
    //clearInterval(this.interval);
  };
  

  onTabPress = (item) => {
    var tabs=this.state.tabs.map(o=> {o.selected=(item.id==o.id); return o; });
    this.setState({tabs})
  }

  render() {
    const TabView=this.state.tabs.find(o=>o.selected).TabView;
    return (
      <SafeAreaView style={{flex:1, backgroundColor:"#FFF", paddingHorizontal:20}}>
        <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}>
        {
          this.state.data &&
          <ImageBackground style={{height:116, width:"100%"}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/card-bg-blue.png`}}>
            <View style={{flexDirection:"row", paddingVertical:10, paddingHorizontal:20}}>
              <View style={{flex:1}}>
                <Text style={{fontSize:16, fontWeight:"bold", color:"#FFFFFF"}}>आने वाली पूजा</Text>
                <Text style={{fontSize:10, fontWeight:"bold", color:"#FFFFFF"}}>On {this.state.data.Puja_Start_Date}{'\n'}at {this.state.data.Puja_Start_Time}</Text>
              </View>
              <View style={{flex:1}}>
                <Text style={{fontSize:13, color:"#FFFFFF"}}>{this.state.data.PujaName}</Text>
              </View>
            </View>

            <View style={{flexDirection:"row", justifyContent:"space-between", paddingVertical:10, paddingHorizontal:20}}>
              <TimerView pendingTimeSS={this.state.pendingTimeSS}/>
              <TouchableOpacity style={{marginBottom:15}} onPress={()=> this.props.navigation.navigate("PoojaDetailsScreen", {Id:this.state.data.Id})}>
                <Image style={{height:25, width:87}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/go-lie.png`}}/>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        }
        <View style={{marginTop:20}}>
          <MyControls.ContackUsSticker/>
        </View>
        <View style={{marginTop:20}}>
          <View style={{flexDirection:"row", padding:10, alignItems: "center", alignContent:"center", justifyContent:"space-evenly", borderTopLeftRadius:15, borderTopRightRadius:15, backgroundColor:"#F5F5F5"}}>
          {
            this.state.tabs.map((item, index)=>(
              <TouchableOpacity onPress={()=>this.onTabPress(item)}>
                <Text style={[{fontSize:14, fontWeight:"bold", color:"#000", padding:10}, item.selected && {color:"#FB7753", borderBottomWidth:2, borderBottomColor:"#FB7753"}]}>{item.title}</Text>
              </TouchableOpacity>
            ))
          }
          </View>
          
          <TabView/>
           
        </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}

const Tab1View = (props) => {
  const[data, setData]=useState([])
  useEffect(()=>{
    Api.Acharaya_AcharayaPujaBookingsUpcommingService().then(response => {
      console.log("Acharaya_AcharayaPujaBookingsUpcommingService resp", response);
      if (response.ResponseCode == 200) {
        setData(response.data);
      }
    });

  },[])
  return (
    <View style={{padding:20, borderBottomLeftRadius:15, borderBottomRightRadius:15, backgroundColor:"#F5F5F5"}}>
      {
        data.map((item, index)=>(
          <MyControls.TimetableListItemView {...props} item={item}/>
        ))
      } 
    </View>
  )
}
 
const Tab2View = (props) => { 
  const[data, setData]=useState([]);
  const[avaliableSlots, setAvaliableSlots]=useState([])
  useEffect(()=>{
    Api.GetAcharaya_PujaSlot_60DaysService().then(response => {
      console.log("GetAcharaya_PujaSlot_60DaysService resp", response);
      if (response.ResponseCode == 200) {
        setData(response.data);
        var newData=response.data.filter(o=>o.SlotCount>0).map(o=>{return  "\""+moment(o.date, "DD/MMM/YYYY").format("YYYY-MM-DD")+"\": {\"selected\": true, \"selectedColor\":\"#FB7753\"}" }).toString();
        console.log("GetAcharaya_PujaSlot_60DaysService newData", "{"+newData+"}");
        setAvaliableSlots(JSON.parse("{"+newData+"}"));
      }
    })
    .catch(()=> console.error("err GetAcharaya_PujaSlot_60DaysService HomeScreen"));

  },[])
  return(
    <View style={{}}>
      <View style={{padding:20, borderBottomLeftRadius:15, borderBottomRightRadius:15, backgroundColor:"#F5F5F5"}}>
      <Calendar 
          markedDates={avaliableSlots} 
          //minDate={this.state.minDate} 
          //maxDate={this.state.maxDate} 
          //onDayPress={(day) => onDayPress(day) }
          theme={{
            backgroundColor:"#F5F5F5",
            calendarBackground: '#F5F5F5'
          }}
          />
        </View>

        {/*<View style={{marginBottom:20}}>
          <Text style={{fontSize:13, fontWeight:"bold", marginTop:22, marginBottom:10}}>कल की पूजा</Text>
          <View style={{backgroundColor:"#FB7753", borderRadius:15, padding:20, paddingBottom:0}}>
             <MyControls.TimetableListItemView {...props}/>
            <MyControls.TimetableListItemView {...props}/>
            <MyControls.TimetableListItemView {...props}/> 
          </View>
        </View>*/}
    </View>
  )
}

const TimerView = (props) => {
  return(
    <View style={{flexDirection:"row"}}>
      <BoxGroup timeFrame="Days" value={parseInt(props.pendingTimeSS / (60 * 60 * 24))} />
      <Text style={{fontSize:18, fontWeight:"bold", color:"#fff", paddingHorizontal:2}}>:</Text>
      <BoxGroup timeFrame="hours" value={parseInt(props.pendingTimeSS / (60 * 60)) % 60}/>
      <Text style={{fontSize:18, fontWeight:"bold", color:"#fff", paddingHorizontal:2}}>:</Text>
      <BoxGroup timeFrame="minutes" value={parseInt(props.pendingTimeSS / 60) % 60}/>
      <Text style={{fontSize:18, fontWeight:"bold", color:"#fff", paddingHorizontal:2}}>:</Text>
      <BoxGroup timeFrame="seconds" value={props.pendingTimeSS % 60}/>
    </View>
  )
}

const BoxGroup = (props) => {
  return(
    <View style={{alignItems: "center"}}>
      <View style={{flexDirection:"row"}}>
        <WhiteBox time={parseInt(props.value / 10)} />
        <WhiteBox time={props.value % 10} />
      </View>
      <Text style={{fontSize:7, color:"#fff"}}>{props.timeFrame}</Text>
    </View>
  )
}

const WhiteBox = (props)=>{
  return(
    <View style={{width:18, height:22, margin:2, backgroundColor:"#fff", borderRadius:5, alignItems:"center", justifyContent: "center"}}>
      <Text style={{fontSize:12, fontWeight:"bold"}}>{props.time}</Text>
    </View>
  )
}


