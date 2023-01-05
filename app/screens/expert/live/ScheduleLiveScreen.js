import React, { Component, useState } from 'react';
import { View, Text, TextInput, SafeAreaView, ScrollView, Image, TouchableOpacity, Modal, ActivityIndicator } from 'react-native';
import {PinkButton, GrayButton} from './Controls';
import * as env from '../../../../env';
import * as Api from '../../../Api';
import * as Auth from '../../../Auth';
import {Live_Category, LiveSession_Status} from '../../../MyExtension';
import moment from 'moment';
import { Calendar } from 'react-native-calendars';
import {Picker} from '../../../controls/MyPicker';
import {LiveSessionCard} from '../../user/Controls';

export default class ScheduleLiveScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        date:moment().format("DD-MMM-YYYY"),
        markedDates:{}
    };

    this.state.markedDates[moment().format("YYYY-MM-DD")]={selected: true, selectedColor:"#FB7753"};
  }

  componentDidMount = async() => {
    const Profile=await Auth.getProfie().then(JSON.parse);
    this.setState({Profile});
    
    Api.GetLiveBackgroundImageAllService()
    .then(resp=> {
        console.log("GetLiveBackgroundImageAllService resp", resp);
        if (resp.ResponseCode == 200) {
            this.setState({BackgroundImages:resp.data});
        }
    });

    if(this.props.route.params && this.props.route.params.Id){
        const{Id}=this.props.route.params;
        Api.GetLive_SessionbyIdService(Id)
        .then(resp=> {
            console.log("GetLive_SessionbyIdService resp", resp);
            if (resp.ResponseCode == 200) {
                //var BackgroundImages=this.state.BackgroundImages.map(o=> {o.Image==resp.data.BackgroundImagePath ? o.IsDefault=true : o.IsDefault=false; return o;});
                //console.log("new BackgroundImages", BackgroundImages);
                //var SessionStartDate=moment(resp.data.SessionStartDate).format("hh:mm A");
                this.setState(resp.data);
            }
        });
    }
    this.onDateChange();
  };

  onSelectBanner = (item) => {
    var BackgroundImages=this.state.BackgroundImages.map(o=> {o.Id==item.Id ? o.IsDefault=true : o.IsDefault=false; return o;});
    console.log("new BackgroundImages", BackgroundImages);
    this.setState({BackgroundImages});
  }

  onDayPress = (date) => {
    console.log(date);
    
    this.setState({date:moment(date.dateString, "YYYY-MM-DD").format("DD-MMM-YYYY")}, ()=> this.onDateChange());
    var markedDates={};
    markedDates[date.dateString]={selected: true, selectedColor:"#FB7753"};
    this.setState({markedDates});
  }

  onDateChange = () => {
    Api.GetLiveSession_ScheduleSlotbyDateService(this.state.date)
    .then(resp=> {
        console.log("GetLiveSession_ScheduleSlotbyDateService resp", resp);
        if (resp.ResponseCode == 200) {
            this.setState({SlotList:resp.data.map((o, i)=>({id:i,title:o, selected:false}))});
        }
    })
  }

  onSlotSelect = (item) => {
    var SlotList=this.state.SlotList.map(o=> {o.id==item.id ? o.selected=true : o.selected=false; return o;});
    console.log("new SlotList", SlotList);
    this.setState({SlotList}); 
  }

  onSubmit = async() => {
    var slot=this.state.SlotList.find(o=>o.selected);
    if(slot==null){
        alert("please select slot");
        return;
    }
    const{Id}=this.props.route.params??{};
    var req={
        Id:Id,
        Category:this.state.Category,
        Subject:this.state.Subject,
        BackgroundImagePath:this.state.BackgroundImages.find(o=>o.IsDefault).Image,
        SessionStartDate: new moment(this.state.date+" "+slot.title, "DD-MMM-YYYY hh:mm A").format(),
        Status:LiveSession_Status.SCHEDULED
    }
    console.log("date", this.state.date, slot.title, (this.state.date+" "+slot.title), new moment(this.state.date+" "+slot.title, "DD-MMM-YYYY hh:mm A").format());
    console.log("req", req);
    this.setState({previewModel:req, previewVisible:true});
  }
  
  onSubmitConfirm = () => {
    this.setState({loading:true});
    console.log("Add_Update_Schedule_Live_SessionService resp", this.state.previewModel);
    Api.Add_Update_Schedule_Live_SessionService(this.state.previewModel)
    .then(resp=> {
        console.log("Add_Update_Schedule_Live_SessionService resp", resp);
        if (resp.ResponseCode == 200) {
            this.setState({loading:false});
            this.props.navigation.replace("Live_Exp_MyLiveSessionsScreen")
        }
    });
  }

  render() {
    return (
        <SafeAreaView style={{flex:1, backgroundColor:"#fff"}}>
        <ScrollView>
        <View style={{ width: "100%", height: 54, flexDirection: "row", alignItems: "center", backgroundColor: "#F09B39", borderBottomWidth: 1, borderBottomColor: "#0000001A" }}>
          <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
              <View style={{ width: 30, height: 54, alignItems: "center", justifyContent: "center", marginLeft:10 }}>
                  <Image style={{ width: 24, height: 24 }} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/icons/ic_back_mdpi.png`}} />
              </View>
          </TouchableOpacity>
          <View style={{width:"100%", alignItems:"center", justifyContent:"center"}}>
            <Text style={{fontSize:20, color:"#fff", marginRight:50}}>Schedule live session</Text>
          </View>
        </View>
          <View style={{padding:10}}>
            <View>
                <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
                    <Text style={{fontWeight:"600"}}>Subject</Text>
                    <Text style={{fontWeight:"600"}}>0/120</Text>
                </View>
                <View style={{height:100, borderRadius:10, backgroundColor:"#EFEFEF", marginTop:10}}>
                    <TextInput style={{color:"#000"}} multiline={true} value={this.state.Subject} onChangeText={(text)=> this.setState({Subject:text})}/>
                </View>
            </View>
            <View style={{backgroundColor:"#EFEFEF", borderRadius:10, marginTop:20}}>
                <Picker selectedValue={this.state.Category} onValueChange={(value)=> this.setState({Category:value})}>
                    <Picker.item label="Select Category" value=""/>
                    <Picker.Item label="ASTROLOGY" value={Live_Category.ASTROLOGY} />
                    <Picker.Item label="LIVE POOJA" value={Live_Category.LIVE_POOJA} />
                </Picker>
                {
                    Platform.OS=="android" && <Text style={{width: '100%', height: 60, position: 'absolute', bottom: 0, left: 0}}>{' '}</Text>
                }
            </View>

            {
            this.state.BackgroundImages &&
            <View style={{marginTop:20}}>
                <Text style={{fontWeight:"600"}}>Choose background</Text>
                <ScrollView horizontal={true}>
                    <View style={{flexDirection:"row", marginTop:20}}>
                    {
                        this.state.BackgroundImages.map((item, index)=>(
                            <TouchableOpacity key={index} onPress={()=> this.onSelectBanner(item)}>
                                <View style={[{padding:5}, item.IsDefault && {borderWidth:2, borderColor:"#20962C", borderRadius:10}]}>
                                
                                    <Image style={{width:146, height:100, borderRadius:10}} resizeMode="cover" source={{uri:`${env.DynamicAssetsBaseURL}${item.Image}`}}/>
                                    {
                                        item.IsDefault &&  <Image style={{ width: 32, height: 32, position:"absolute", right:-10, top:-10 }} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/live/tick-g.png`}} />
                                    }
                                </View>
                            </TouchableOpacity>
                        ))
                    }
                    </View>
                </ScrollView>
            </View>
            }
 
            <View style={{marginTop:20}}>
            <Text style={{fontWeight:"600"}}>Choose Date and Time</Text>

              <Calendar
                markedDates={this.state.markedDates}
                //minDate={this.state.minDate} 
                //maxDate={this.state.maxDate} 
                onDayPress={(day) => this.onDayPress(day) }
                  
                />
                <ScrollView horizontal={true}>
                    <View style={{flexDirection:"row", marginVertical:20}}>
                        {
                            this.state.SlotList && this.state.SlotList.map((item, index)=>(<SlotView key={index} item={item} onPress={()=> this.onSlotSelect(item)}/>))
                        }
                    </View>
                </ScrollView>
            </View>
            <View style={{marginVertical:20}}>
                <PinkButton onPress={()=> this.onSubmit()}>Schedule Session</PinkButton>
            </View>
          </View>
          </ScrollView>

          {
                this.state.previewVisible &&
                <Modal visible={this.state.previewVisible}>
                    <View style={{backgroundColor:"#fff"}}>
                        <View style={{ width: "100%", height: 54, flexDirection: "row", alignItems: "center", backgroundColor: "#F09B39", borderBottomWidth: 1, borderBottomColor: "#0000001A" }}>
                            <TouchableOpacity onPress={() => this.setState({previewVisible:null, previewModel:null})}>
                                <View style={{ width: 30, height: 54, alignItems: "center", justifyContent: "center", marginLeft:10 }}>
                                    <Image style={{ width: 24, height: 24 }} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/icons/ic_back_mdpi.png`}} />
                                </View>
                            </TouchableOpacity>
                            <View style={{width:"100%", alignItems:"center", justifyContent:"center"}}>
                                <Text style={{fontSize:20, color:"#fff", marginRight:50}}>Schedule live session</Text>
                            </View>
                        </View>
                        <View style={{padding:20}}>
                            <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
                                <Text style={{fontSize:18}}>Live card preview</Text>
                                <Image style={{ width: 24, height: 24 }} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/live/question-circle.png`}} />
                            </View>
                        </View>

                        <View style={{flexDirection:"row", alignItems:"flex-end", justifyContent:"space-between"}}>
                            <View style={{width:70, height:138, backgroundColor:"#E1E1E1", borderTopRightRadius:10, borderBottomRightRadius:10}}/>
                            <LiveSessionCard profile={this.state.Profile} item={this.state.previewModel}/>
                            <View style={{width:70, height:138, backgroundColor:"#E1E1E1", borderTopLeftRadius:10, borderBottomLeftRadius:10}}/>
                        </View>

                        <View style={{marginVertical:50, padding:20}}>
                            {
                                this.state.loading && <ActivityIndicator color="blue"/> || <PinkButton onPress={()=> this.onSubmitConfirm()}>Schedule Session</PinkButton>
                            }
                        </View>
                    </View>
                </Modal>
            }         
      </SafeAreaView>
    );
  }
}

const SlotView = (props) => {
    const{item}=props;
    return(
        <TouchableOpacity onPress={()=>props.onPress()}>
            <View style={[{width:88, height:40, alignItems:"center", justifyContent:"center", borderRadius:10}, item.selected && {backgroundColor:"#F09B39", borderRadius:10}]}>
                <Text style={[{color:"#000"}, item.selected && {color:"#fff"}]}>{item.title}</Text>
            </View>
        </TouchableOpacity>
    )
}