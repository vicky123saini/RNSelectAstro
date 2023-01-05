import React, { Component } from 'react';
import { View, Text, SafeAreaView, ScrollView, Image, TouchableOpacity, StyleSheet, Modal, Alert, ActivityIndicator } from 'react-native';
import {PinkButton, GrayButton} from './Controls';
import * as env from '../../../../env';
import * as Api from '../../../Api';
import * as Auth from '../../../Auth';
import moment from 'moment';
import { Calendar } from 'react-native-calendars';

export default class MyLiveSessionsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      date:moment().format("DD-MMM-YYYY"),
      markedDates:{}
    };
    this.state.markedDates[moment().format("YYYY-MM-DD")]={selected: true, selectedColor:"#FB7753"};
  }

  componentDidMount = () => {
    this.binddata();
  };

  binddata = () => {
    console.log("GetExpertLiveSession_ScheduleService req", this.state.date);
    Api.GetExpertLiveSession_ScheduleService(this.state.date)
    .then(resp=> {
      console.log("GetExpertLiveSession_ScheduleService resp", resp);
      if (resp.ResponseCode == 200) {
        this.setState({ExpertLiveSessions:resp.data.map(o=>({...o, SessionStartDate:moment(o.SessionStartDate).format("DD/MMM/YY hh:mm A")}))});
      }
    })
  }

  onDayPress = (date) => {
    console.log(date);
    this.setState({date:moment(date.dateString, "YYYY-MM-DD").format("DD-MMM-YYYY")}, ()=> this.binddata());
    var markedDates={};
    markedDates[date.dateString]={selected: true, selectedColor:"#FB7753"};
    this.setState({markedDates});
  }

  onCancelSchedule = (item) => {
    this.setState({loading:true});
    console.log("DeleteLive_SessionbyIdService req", item.Id);
    Api.DeleteLive_SessionbyIdService(item.Id)
    .then(resp=> {
      console.log("DeleteLive_SessionbyIdService resp", resp);
      if (resp.ResponseCode == 200) {
        this.setState({ExpertLiveSessions:null, selectedItem:null});
        this.setState({loading:false});
        Alert.alert("", "Done!");
      }
    })
  }
  

  render() {
    return (
      <SafeAreaView style={{flex:1, backgroundColor:"#fff"}}>
        <View style={{ width: "100%", height: 54, flexDirection: "row", alignItems: "center", backgroundColor: "#F09B39", borderBottomWidth: 1, borderBottomColor: "#0000001A" }}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <View style={{ width: 30, height: 54, alignItems: "center", justifyContent: "center", marginLeft:10 }}>
                  <Image style={{ width: 24, height: 24 }} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/icons/ic_back_mdpi.png`}} />
              </View>
          </TouchableOpacity>
          <View style={{width:"100%", alignItems:"center", justifyContent:"center"}}>
            <Text style={{fontSize:20, color:"#fff", marginRight:50}}>GoLive !</Text>
          </View>
        </View>
          <View style={{padding:10}}>
            <View>
              <PinkButton onPress={()=> this.props.navigation.navigate("Live_Exp_CreateLiveSession")}>Go Live now</PinkButton>
              <GrayButton onPress={()=> this.props.navigation.navigate("Live_Exp_ScheduleLiveScreen")} style={{marginTop:20}}>Schedule Session</GrayButton>
            </View>
            <View style={{height:170}}>
              <ScrollView>   
                {
                  this.state.ExpertLiveSessions && this.state.ExpertLiveSessions.map((item, index)=> <ListItem key={index} {...this.props} item={item} onOptionPress={()=> this.setState({selectedItem:item})}/>)
                }
                
              </ScrollView>
            </View>
            <View>
              <Calendar
                markedDates={this.state.markedDates}
                //minDate={this.state.minDate} 
                //maxDate={this.state.maxDate} 
                onDayPress={(day) => this.onDayPress(day) }
                  
                />
            </View>
          </View>
           
          <Modal animationType="slide" transparent={true} visible={this.state.selectedItem!=null}>
            <View style={{flex:1, backgroundColor:"rgba(0, 0, 0, 0.8)"}}>
              <View style={styles.modalView}>
                  <TouchableOpacity style={{alignSelf:"flex-end"}} onPress={()=>this.setState({selectedItem:null})}>
                    <Image style={{width:15, height:15}} resizeMode="stretch" source={{uri: `${env.AssetsBaseURL}/assets/images/close-black-bg.png`}}/>  
                  </TouchableOpacity>
                {
                  this.state.selectedItem &&
                  <View style={{padding:20}}>
                    <View style={{alignItems:"center"}}>
                      <Image style={{width:22, height:21, marginHorizontal:10}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/live/sound-2.png`}} />
                      <Text style={{fontSize:14, fontWeight:"600"}}>Live Session</Text>
                      <Text style={{fontSize:12, fontWeight:"600"}}>{this.state.selectedItem.SessionStartDate}</Text>
                    </View>
                    {
                      this.state.loading && <ActivityIndicator color="blue"/> ||
                      <View style={{flexDirection:"row", alignItems:"center", justifyContent:"center", marginVertical:20}}>
                        <TouchableOpacity onPress={()=> this.onCancelSchedule(this.state.selectedItem)}>
                          <View style={{width:160, height:50, margin:10, alignItems:"center", justifyContent:"center", backgroundColor:"#FF000F", borderRadius:10}}><Text style={{color:"#fff"}}>Cancel</Text></View>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={()=> this.props.navigation.navigate("ScheduleLiveScreen",{Id:this.state.selectedItem.Id})}>
                          <View style={{width:160, height:50, margin:10, alignItems:"center", justifyContent:"center", backgroundColor:"#E8E8E8", borderRadius:10}}><Text style={{color:"#20962C"}}>Reschedule</Text></View>
                        </TouchableOpacity>
                      </View>
                    }
                  </View>
                }
              </View>
            </View>
          </Modal>
      </SafeAreaView>
    );
  }
}


const ListItem = (props) => {
  const{item}=props;
  return(
    
    <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between", borderBottomWidth:1, borderBottomColor:"#E0E0E0"}}>
      <TouchableOpacity onPress={()=> props.navigation.navigate("Live_Exp_GoLiveScreen", {Id:item.Id})}>
        <View style={{flexDirection:"row", padding:10}}>
          <Image style={{width:22, height:21, marginHorizontal:10}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/live/sound-2.png`}} />
          <View style={{marginHorizontal:10}}>
            <Text style={{fontSize:14, fontWeight:"600"}}>Live Session</Text>
            <Text style={{fontSize:12, fontWeight:"600"}}>{item.SessionStartDate}</Text>
          </View>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=> props.onOptionPress()}>
        <Image style={{width:24, height:29, marginRight:10}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/live/menu.png`}} />
      </TouchableOpacity>
    </View>
  )
}

 


const styles = StyleSheet.create({   
  modalView: {
    width:"100%",
    position:"absolute",
    bottom:0,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
     
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  }
});