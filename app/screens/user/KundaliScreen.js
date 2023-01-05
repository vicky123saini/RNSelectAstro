import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, ScrollView, SafeAreaView, ActivityIndicator, ImageBackground, Platform, Alert } from 'react-native';
import {Picker} from '../../controls/MyPicker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
//import { DatePicker } from 'react-native-wheel-datepicker';
import { DatePicker } from '../../controls/MyDatePicker';
import MainStyles from '../../Styles';
import analytics from '@react-native-firebase/analytics';
import * as UserControls from './Controls';
import * as env from '../../../env';
import * as Api from '../../Api';
import moment from 'moment';
import { WebView } from 'react-native-webview';
import {Autocomplete} from '../../controls/MyAutocomplete';
import {Singular} from 'singular-react-native';

export default class KundaliScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      TabIndex:props.route.params && props.route.params.TabIndex ? props.route.params.TabIndex:0,
      data:props.route.params && props.route.params.data,
    };
  } 

  componentDidMount = () => {
    analytics().logEvent("Kundli");

    console.log("GetEnduserProfileService req")
    Api.GetEnduserProfileService().then(resp => {
        console.log("GetEnduserProfileService resp", JSON.stringify(resp));
        if (resp.ResponseCode == 200) {
          if(resp.data.DateOfBirth==null || resp.data.DateOfBirth==""){
            resp.data.DateOfBirth=moment().format("DD/MMM/YYYY")
          }
          if(resp.data.TimeOfBirth==null || resp.data.TimeOfBirth==""){
            resp.data.TimeOfBirth=moment().format("HH:mm:00")
          }
            this.setState({profile:resp.data});
        }
    });
  };
  

  onTabChange = (TabIndex) => {
    this.setState({TabIndex});
  }

  render() {
    return (
      <SafeAreaView style={{flex:1}}>
        {
          this.state.profile && <UserControls.Header {...this.props} title="Kundali" shareText={this.state.profile.ShareText}/>
        }
        
        {
          !this.state.data &&
          <View style={{flex:0, flexDirection:"row", padding:10}}>
            <TouchableOpacity onPress={()=> {Singular.event("KundaliScreen_Your_kundali"); this.onTabChange(0)}}>
              <LinearGradient colors={this.state.TabIndex==0 ? ["#FC7C37", "#FC7C37"]:["#fff", "#fff"]} style={[{ borderRadius: 30, marginLeft: 10 }]}>
                <Text style={[MainStyles.text,{borderRadius:10, paddingHorizontal:20, paddingVertical:3}, this.state.TabIndex==0 ? { color:"#fff" }:{color:"#000"}]}>Your kundali</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> {Singular.event("KundaliScreen_New_Kundali"); this.onTabChange(1)}}>
              <LinearGradient colors={this.state.TabIndex==1 ? ["#FC7C37", "#FC7C37"]:["#fff", "#fff"]} style={[{ borderRadius: 30, marginLeft: 10 }]}>
                <Text style={[MainStyles.text,{borderRadius:10, paddingHorizontal:20, paddingVertical:3}, this.state.TabIndex==1 ? { color:"#fff" }:{color:"#000"}]}>New Kundali</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        }
        
        
        <ScrollView style={{flex:1, backgroundColor:"#fff"}} keyboardShouldPersistTaps="always">
         {
            this.state.data &&  <Result {...this.props} data={this.state.data} onCallNow={() => this.props.navigation.navigate("ExpertListScreen")}/> 
            ||
            this.state.TabIndex==0 && this.state.profile && <View style={{flex:1, backgroundColor:"#fff"}}><EnterNewDetails {...this.props} profile={this.state.profile}/></View>
            ||
            this.state.TabIndex==1 && <SavedDetails {...this.props} onTabChange={()=>this.onTabChange(0)}/>
            ||
            <ActivityIndicator color="blue"/>
         }
        </ScrollView>
        
       
      </SafeAreaView>
    );
  }
}


const EnterNewDetails = (props) => {
  var rdata={};
  try{
    rdata=JSON.parse(JSON.stringify({...props.profile, DateOfBirth:moment(props.profile.DateOfBirth, "DD/MMM/YYYY").format(),TimeOfBirth:moment(props.profile.TimeOfBirth, "HH:mm:00").format()}));
  }
  catch{
    console.log("err EnterNewDetails kundaliScreen")
  }
  const[state, setState]=useState(rdata);
  // const{profile}=props;
  // useEffect(()=>{
  //   console.log("profile", profile);
  // },[profile]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      console.log(state.PlaceOfBirth)
      // Send Axios request here
      if(state.PlaceOfBirth!=null && state.PlaceOfBirth.length>0){
        Api.GetKundaliLocationSuggestionService(state.PlaceOfBirth).then(resp=>{
          console.log("GetKundaliLocationSuggestionService resp", resp);
          if(resp.ResponseCode==200){
            setState({...state, LocationSuggestion:resp.data});
          }
        });
      }

    }, 3000)

    return () => clearTimeout(delayDebounceFn)
  }, [state.PlaceOfBirth])

  const onChange = (keyworkds) => {
    console.log("onChange", state.PlaceOfBirth)
    setState({...state, PlaceOfBirth:keyworkds});
  }


  const onSubmit = () => {
    Singular.event("KundaliScreen_onSubmit");
    if(!state.Name){
      Alert.alert(null, "Name Required.");
      return;
    }
    if(!state.TimeOfBirth){
      Alert.alert(null, "Time of Birth Required.");
      return;
    }
    if(!state.DateOfBirth){
      Alert.alert(null, "Date of Birth Required.");
      return;
    }
    if(!state.PlaceOfBirth){
      Alert.alert(null, "Place of Birth Required.");
      return;
    }

    const req = {
      Name:state.Name,
      Gender:state.Gender,
      DateOfBirth:moment(state.DateOfBirth).format("DD/MMM/YYYY"),
      TimeOfBirth:moment(state.TimeOfBirth).format("HH:mm"),
      PlaceOfBirth:state.PlaceOfBirth,
      IsNew:true
    }
    console.log("GetkundaliBasicInfoService req", req)
    Api.GetkundaliBasicInfoService(req).then(resp=>{
      console.log("GetkundaliBasicInfoService resp", resp);
      if(resp.ResponseCode==200){
        setState({});
        //props.onSubmit(resp.data);
        props.navigation.push('KundaliScreen', {TabIndex:2, data:resp.data});
      }
      else{
        alert(resp.ResponseMessage);
      }
    });
  }
  return(
    
    <View style={{padding:30}}>
       
      <Text style={styles.label}>Name <Text style={{color:"red"}}>*</Text></Text>
      <View style={styles.textInput}>
          <TextInput style={{width:"100%", height:50, color:"#000"}} value={state.Name} onChangeText={(text)=> setState({...state, Name:text})} placeholder="Name"/>
      </View>

      <Text style={styles.label}>Gender</Text>
        <View style={{flexDirection:"row", width:"100%", justifyContent:"space-between", marginBottom:15}}>
            <TouchableOpacity onPress={()=> setState({...state, Gender:"MALE"})}>
                <View style={[styles.selectButton, state.Gender=="MALE" && styles.selectedButton]}>
                    <Image style={{width:22, height:33, marginLeft:22}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/man.png`}}/>
                    <Text style={[MainStyles.text, {marginLeft:16}]}>Male</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=> setState({...state, Gender:"FEMALE"})}>
                <View style={[styles.selectButton, state.Gender=="FEMALE" && styles.selectedButton]}>
                    <Image style={{width:22, height:33, marginLeft:22}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/woman.png`}}/>
                    <Text style={[MainStyles.text, {marginLeft:16}]}>Female</Text>
                </View>
            </TouchableOpacity>
        </View>
        <Text style={styles.label}>Date of Birth <Text style={{color:"red"}}>*</Text></Text> 
        <TouchableOpacity onPress={()=> setState({...state, showDate:true})}>
            <View style={[styles.textInput, {height:50}]}>
                <Text>{state.DateOfBirth==null?"DD-MM-YYYY":moment(state.DateOfBirth).format("DD-MM-YYYY")}</Text>
                <Image style={{width:23, height:23, marginRight:20}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/calendar.png`}}/>
            </View>
        </TouchableOpacity>
        {
        state.showDate &&
        
        <DatePicker
        date={new Date(state.DateOfBirth)} 
        minimumDate={new Date(1921,1,1)}
        maximumDate={new Date()} 
        mode="date"
        onDateChange={(selectedDate)=> setState({...state, DateOfBirth:selectedDate, showDate:false})}
        />

        // <TouchableOpacity onPress={()=>setState({...state, showDate:false})}>{/*/LanguageChoiseScreen*/}
        //     <LinearGradient colors={["#7162FC", "#B542F2"]} style={{borderRadius:30, width:150, marginBottom:15, marginTop:10, alignSelf:"center"}}>
        //         <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>OK</Text>
        //     </LinearGradient>
        // </TouchableOpacity>
       
        }

      <Text style={styles.label}>City of Birth <Text style={{color:"red"}}>*</Text></Text>
      <View style={{flex:1, marginBottom:20}}>
      <Autocomplete
        data={state.LocationSuggestion}
        value={state.PlaceOfBirth}
        onChangeText={(test) => onChange(test)}
      />
      </View>

      <Text style={styles.label}>Time of Birth <Text style={{color:"red"}}>*</Text></Text>
      <TouchableOpacity onPress={()=> setState({...state, showTime:true})}>
          <View style={[styles.textInput, {height:50}]}>
              <Text>{state.TimeOfBirth==null?"HH:MM":moment(state.TimeOfBirth).format("HH:mm")}</Text>
              <Image style={{width:23, height:23, marginRight:20}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/clock.png`}}/>
          </View>
      </TouchableOpacity>
      {
          state.showTime &&
           
          <DatePicker
          date={new Date(state.TimeOfBirth)} 
          mode="time"
          onDateChange={(selectedDate)=> setState({...state,TimeOfBirth:selectedDate, showTime:false})}
          />
          // <TouchableOpacity onPress={()=>setState({...state, showTime:false})}>{/*/LanguageChoiseScreen*/}
          //     <LinearGradient colors={["#7162FC", "#B542F2"]} style={{borderRadius:30, width:150, marginBottom:15, marginTop:10, alignSelf:"center"}}>
          //         <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>OK</Text>
          //     </LinearGradient>
          // </TouchableOpacity>
          
      }


       

      <View style={{alignItems:"center"}}>
          <TouchableOpacity onPress={()=>onSubmit()}>
              <LinearGradient colors={["#FF7753", "#FB7B37"]} style={{borderRadius:30, width:300, marginBottom:20}}>
                  <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>SUBMIT</Text>
              </LinearGradient>
          </TouchableOpacity>
      </View>

   
    </View>
   
  )
}

const SavedDetails = (props) => {
  const[data, setData]=useState(null);
  const[user, setUser]=useState(null);

  useEffect(()=>{
    Api.GetUserHistoryService().then(resp=>{
      console.log("GetUserHistoryService resp", resp);
      if(resp.ResponseCode==200){
        console.log("GetUserHistoryService resp MALE", resp.data.filter(item=>item.Gender=='MALE'));
        setData(resp.data)
      }
      else{
        alert(resp.ResponseMessage);
      }
    });
  },[])

  const onSubmit = () => {
    console.log("user", user);
    if(!user) return;
    //props.onSubmit(user);
    props.navigation.push('KundaliScreen', {TabIndex:2, data:user});
  }

  return(
    <View style={{flex:1, backgroundColor:"#fff"}}>
      <View style={{flexDirection:"row", alignContent:"center", justifyContent:"space-evenly", marginTop:50}}>
        <View style={{alignItems:"center"}}>
            {/* <Image style={{width:22, height:33}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/man.png`}}/> */}
            <View style={{alignItems:"center", backgroundColor:"#EFEFEF", borderRadius:20, marginTop:10, paddingLeft:10}}>
              <Picker style={{ width: 200 }} selectedValue={user} onValueChange = {(selectedItem)=> setUser(selectedItem)}>
                <Picker.Item label='Select Profile' value={null}/>
                {
                  data && data.map((item, index)=>(<Picker.Item key={index} label={item.Name} value={item}/>))
                }
              </Picker>
              {
                Platform.OS=="android" && <Text style={{width: '100%', height: 60, position: 'absolute', bottom: 0, left: 0}}>{' '}</Text>
              }
            </View>
        </View>
         
      </View>


      <View style={{padding:30}}>
        {
          user && 
      <View style={{alignItems:"center",paddingTop:20}}>
          <TouchableOpacity onPress={()=> onSubmit()}>
              <LinearGradient colors={["#7162FC", "#B542F2"]} style={{borderRadius:30, width:300, marginBottom:20}}>
                  <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>Submit</Text>
              </LinearGradient>
          </TouchableOpacity>
       </View>
       ||
        <View style={{alignItems:"center",paddingTop:20}}>
         
            <LinearGradient colors={["#d5d5d5", "#dcdcdc"]} style={{borderRadius:30, width:300, marginBottom:20}}>
                <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>Submit</Text>
            </LinearGradient>
       
     </View>
}
       <View style={{alignItems:"center",paddingTop:20}}>
          <TouchableOpacity onPress={()=> props.onTabChange()}>
              <LinearGradient colors={["#CC0E13", "#FB77A6"]} style={{borderRadius:30, width:300, marginBottom:20}}>
                  <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>Enter New Details</Text>
              </LinearGradient>
          </TouchableOpacity>
       </View>
    </View>

    </View>
  )
}

const Result = (props) => {
  const{data}=props;
  const[state, setState] = useState({selectTabIndex:0});
  const tabs=[
    {index:0, title:"Basic"},
    {index:1, title:"Lagan"},
    {index:2, title:"Navamsa"},
    {index:3, title:"Dasha"},
  ]
  const onTabPress = (item, index) =>{
    setState({...state, selectTabIndex:index});
  }
  return(
    <View style={{marginTop:1}}>
      <View style={{flexDirection:"row", height:35, backgroundColor:"#F3F3F3", alignItems:"center", justifyContent:"center"}}>
        {
          tabs.map((item, index)=>(
          <TouchableOpacity onPress={()=> onTabPress(item, index)}>
            <View style={[{height:35, alignItems:"center", justifyContent:"center"}, item.index==state.selectTabIndex && {borderBottomColor:"#FC7C37", borderBottomWidth:2}]}>
              <Text style={[{paddingHorizontal:20, overflow:"hidden"}]}>{item.title}</Text>
            </View>
          </TouchableOpacity>
          ))
        }
      </View>
      <View style={{marginTop:20}}>
        {
          state.selectTabIndex==0 && <BasicDetails {...props} tab={tabs[state.selectTabIndex]}/> ||
          state.selectTabIndex==1 && <LaganView {...props} tab={tabs[state.selectTabIndex]} div={"D1"} onPress={()=>props.onCallNow()}/> ||
          state.selectTabIndex==2 && <LaganView {...props} tab={tabs[state.selectTabIndex]} div={"D9"} onPress={()=>props.onCallNow()}/> ||
          state.selectTabIndex==3 && <DashaView {...props} tab={tabs[state.selectTabIndex]}/>
        }
        
      </View>
      <View>
        <UserControls.ExpertSuggestionView navigation={props.navigation}/>
      </View>
    </View>
  )
}


const BasicDetails = (props) =>{
  const{data}=props;
  const[state, setState] = useState({selectTabIndex:0});
  const[sunrise, setSunrise]=useState(null);
  const[sunset, setSunset]=useState(null);
  const tabs=[
    {index:0, title:"Birth Details"},
    {index:1, title:"Panchang Details"},
    {index:2, title:"Planetary Details"}
  ]
  const req = {
    Name:data.Name,
    Gender:data.Gender,
    Dob:moment(data.DateOfBirth,'DD/MM/YYYY').format("DD-MMM-YYYY"),
    Tob:data.TimeOfBirth,
    Pob:data.PlaceOfBirth,
    IsNew:false
  }

  useEffect(()=>{
    console.log("GetPanchangSunriseService req", req)
    Api.GetPanchangSunriseService(req).then(resp=>{
      console.log("GetPanchangSunriseService resp", JSON.stringify(resp));
      if(resp.ResponseCode==200){
        setSunrise(resp.data) 
      }
      else{
        alert(resp.ResponseMessage);
      }
    });

    console.log("GetPanchangSunsetService req", req)
    Api.GetPanchangSunsetService(req).then(resp=>{
      console.log("GetPanchangSunsetService resp", JSON.stringify(resp));
      if(resp.ResponseCode==200){
        setSunset(resp.data) 
      }
      else{
        alert(resp.ResponseMessage);
      }
    });
  },[]);

  const onTabPress = (item, index) =>{
    switch(index){
      case 0:{
        setState({...state, selectTabIndex:index});
        break;
      }
      case 1:{
        console.log("GetPanchangService req", req)
        Api.GetPanchangService(req).then(resp=>{
          console.log("GetPanchangService resp", JSON.stringify(resp));
          if(resp.ResponseCode==200){
            setState({...state, selectTabIndex:index, Panchang:resp.data})
          }
          else{
            alert(resp.ResponseMessage);
          }
        });
        break;
      }
      case 2:{
        
        console.log("GetkundaliPlaneteryDetailsService req", req)
        Api.GetkundaliPlaneteryDetailsService(req).then(resp=>{
          console.log("GetkundaliPlaneteryDetailsService resp", JSON.stringify(resp));
          if(resp.ResponseCode==200){
            setState({...state, selectTabIndex:index, PlaneteryDetail:resp.data});
          }
          else{
            alert(resp.ResponseMessage);
          }
        });

        break;
      }
    }
    

  }
  return(
    <View style={{marginTop:1}}>
      <View style={{flexDirection:"row", height:35, backgroundColor:"#F3F3F3", alignItems:"center", justifyContent:"center"}}>
        {
          tabs.map((item, index)=>(
          <TouchableOpacity onPress={()=> onTabPress(item, index)}>
            <LinearGradient colors={state.selectTabIndex==index ? ["#FC7C37", "#FC7C37"]:["#fff", "#fff"]} style={[{ borderRadius: 30, marginLeft: 10 }]}>
              <Text style={[MainStyles.text,{borderRadius:10, paddingHorizontal:10, paddingVertical:3, fontSize:12}, state.selectTabIndex==index ? { color:"#fff" }:{color:"#000"}]}>{item.title}</Text>
            </LinearGradient>
          </TouchableOpacity>
          ))
        }
      </View>

      <View style={{marginTop:20}}>
      {
        state.selectTabIndex==0 &&
        <View style={{}}>
          <View style={{backgroundColor:"#F3F3F3", flexDirection:"row", paddingHorizontal:20, paddingVertical:10, marginTop:1}}>
            <Text style={{width:"50%"}}>Name:</Text>
            <Text>{data.Name}</Text>
          </View>
          <View style={{backgroundColor:"#FDDBD5", flexDirection:"row", paddingHorizontal:20, paddingVertical:10, marginTop:1}}>
            <Text style={{width:"50%"}}>Gender:</Text>
            <Text>{data.Gender}</Text>
          </View>

          <View style={{backgroundColor:"#F3F3F3", flexDirection:"row", paddingHorizontal:20, paddingVertical:10, marginTop:1}}>
            <Text style={{width:"50%"}}>Date of Birth:</Text>
            <Text>{moment(data.DateOfBirth,'DD/MM/YYYY').format("DD-MMM-YYYY")}</Text>
          </View>
          <View style={{backgroundColor:"#FDDBD5", flexDirection:"row", paddingHorizontal:20, paddingVertical:10, marginTop:1}}>
            <Text style={{width:"50%"}}>City of Birth:</Text>
            <Text>{data.PlaceOfBirth}</Text>
          </View>

          <View style={{backgroundColor:"#F3F3F3", flexDirection:"row", paddingHorizontal:20, paddingVertical:10, marginTop:1}}>
            <Text style={{width:"50%"}}>Time of Birth:</Text>
            <Text>{data.TimeOfBirth}</Text>
          </View>
          <View style={{backgroundColor:"#FDDBD5", flexDirection:"row", paddingHorizontal:20, paddingVertical:10, marginTop:1}}>
            <Text style={{width:"50%"}}>Latitude:</Text>
            <Text>{data.Latitude}</Text>
          </View>

          <View style={{backgroundColor:"#F3F3F3", flexDirection:"row", paddingHorizontal:20, paddingVertical:10, marginTop:1}}>
            <Text style={{width:"50%"}}>Longitude:</Text>
            <Text>{data.Longitude}</Text>
          </View>
          <View style={{backgroundColor:"#FDDBD5", flexDirection:"row", paddingHorizontal:20, paddingVertical:10, marginTop:1}}>
            <Text style={{width:"50%"}}>Timezone:</Text>
            <Text>{moment().format("Z")}</Text>
          </View>

          <View style={{backgroundColor:"#F3F3F3", flexDirection:"row", paddingHorizontal:20, paddingVertical:10, marginTop:1}}>
            <Text style={{width:"50%"}}>Sunrise:</Text>
            {
              sunrise && <Text>{sunrise.response.sun_sign}</Text>
            }
          </View>
          <View style={{backgroundColor:"#FDDBD5", flexDirection:"row", paddingHorizontal:20, paddingVertical:10, marginTop:1}}>
            <Text style={{width:"50%"}}>Sunset:</Text>
            {
              sunset && <Text>{sunset.response.sun_sign}</Text>
            }
          </View>

          <View style={{backgroundColor:"#F3F3F3", flexDirection:"row", paddingHorizontal:20, paddingVertical:10, marginTop:1}}>
            <Text style={{width:"50%"}}>Ayanamsha:</Text>
            <Text>{data.Ayanamsha}</Text>
          </View>
        </View>
        ||
        state.selectTabIndex==1 && state.Panchang && state.Panchang.response &&
        <View>
          <View style={{backgroundColor:"#F3F3F3", flexDirection:"row", paddingHorizontal:20, paddingVertical:10, marginTop:1}}>
            <Text style={{width:"30%"}}>Tithi:</Text>
            <Text>{state.Panchang.response.tithi.name} {state.Panchang.response.tithi.start_date} {state.Panchang.response.tithi.end_date}</Text>
          </View>
          <View style={{backgroundColor:"#FDDBD5", flexDirection:"row", paddingHorizontal:20, paddingVertical:10, marginTop:1}}>
            <Text style={{width:"30%"}}>Karan:</Text>
            <Text>{state.Panchang.response.karana.name} {state.Panchang.response.karana.start_date} {state.Panchang.response.karana.end_date}</Text>
          </View>

          <View style={{backgroundColor:"#F3F3F3", flexDirection:"row", paddingHorizontal:20, paddingVertical:10, marginTop:1}}>
            <Text style={{width:"30%"}}>Yog:</Text>
            <Text>{state.Panchang.response.yoga.name} {state.Panchang.response.yoga.start_date} {state.Panchang.response.yoga.end_date}</Text>
          </View>
          <View style={{backgroundColor:"#FDDBD5", flexDirection:"row", paddingHorizontal:20, paddingVertical:10, marginTop:1}}>
            <Text style={{width:"30%"}}>Nakshtra:</Text>
            <Text>{state.Panchang.response.nakshatra.name} {state.Panchang.response.nakshatra.start_date} {state.Panchang.response.nakshatra.end_date}</Text>
          </View>

          <View style={{backgroundColor:"#F3F3F3", flexDirection:"row", paddingHorizontal:20, paddingVertical:10, marginTop:1}}>
            <Text style={{width:"30%"}}>Sunrise:</Text>
            {
              sunrise && <Text>{sunrise.response.sun_sign}</Text>
            }
            
          </View>
          <View style={{backgroundColor:"#FDDBD5", flexDirection:"row", paddingHorizontal:20, paddingVertical:10, marginTop:1}}>
            <Text style={{width:"30%"}}>Sunset:</Text>
            {
              sunset && <Text>{sunset.response.sun_sign}</Text>
            }
          </View>
        </View>
        ||
        state.selectTabIndex==2 && state.PlaneteryDetail &&
        <View>
          <View style={{backgroundColor:"#F3F3F3", flexDirection:"row", paddingHorizontal:20, paddingVertical:10, marginTop:1}}>
            <Text style={{width:70, fontSize:12}}></Text>
            {/* <Text style={{width:20, fontSize:12}}>r/c</Text> */}
            <Text style={{width:40, fontSize:12}}>Deg</Text>
            <Text style={{width:70, fontSize:12}}>Rasi</Text>
            <Text style={{width:50, fontSize:12}}>House</Text>
            <Text style={{width:80, fontSize:12}}>Nakshatra</Text>
            <Text style={{width:30, fontSize:12}}>Pada</Text>
          </View>
          {
            Object.keys(state.PlaneteryDetail.response).filter((key,index)=> index<10).map((key, index)=>(
              <View style={{backgroundColor:index%2>0?"#F3F3F3":"#FDDBD5", flexDirection:"row", paddingHorizontal:20, paddingVertical:10, marginTop:1}}>
                <Text style={{width:70, fontSize:10}}>{state.PlaneteryDetail.response[key].full_name}<Text style={{color:"red", fontWeight:"700"}}>{state.PlaneteryDetail.response[key].retro?"(R)":""}</Text></Text>
                {/* <Text style={{width:20, fontSize:10}}>{state.PlaneteryDetail.response[key].retro?"R":""}</Text> */}
                <Text style={{width:40, fontSize:10}}>{parseFloat(state.PlaneteryDetail.response[key].local_degree).toFixed(2)}</Text>
                <Text style={{width:70, fontSize:10}}>{state.PlaneteryDetail.response[key].zodiac}</Text>
                <Text style={{width:50, fontSize:10}}>{state.PlaneteryDetail.response[key].house}</Text>
                <Text style={{width:80, fontSize:10}}>{state.PlaneteryDetail.response[key].nakshatra}</Text>
                <Text style={{width:30, fontSize:10}}>{state.PlaneteryDetail.response[key].nakshatra_pada}</Text>
              </View>
            ))
          }
        </View>
        ||
        <Text>{state.selectTabIndex}</Text>
      }
      </View>

    </View>
  )
}

const LaganView = (props) => {
  const{data, div}=props;
  const[state, setState] = useState({});
  useEffect(()=>{
    const req = {
      Name:data.Name,
      Gender:data.Gender,
      Dob:moment(data.DateOfBirth,'DD/MM/YYYY').format("DD-MMM-YYYY"),
      Tob:data.TimeOfBirth,
      Pob:data.PlaceOfBirth,
      Div:div,
      IsNew:false
    }
    // console.log("GetkundaliDivisionalChartsbyDivisonService req", req)
    // Api.GetkundaliDivisionalChartsbyDivisonService(req).then(resp=>{
    //   console.log("GetkundaliDivisionalChartsbyDivisonService resp", resp);
    //   if(resp.ResponseCode==200){
    //     setState({...state, ChartData:resp.data});
    //   }
    //   else{
    //     alert(resp.ResponseMessage);
    //   }
    // });
 
    var url=`${env.BASE_URL}home/GetDivisionalChartsbyDivison?IsNew=false&Name=${data.Name}&Gender=${data.Gender}&Dob=${moment(data.DateOfBirth,'DD/MM/YYYY').format("DD-MMM-YYYY")}&Tob=${data.TimeOfBirth}&Pob=${data.PlaceOfBirth}&Div=${div}`;
    setState({...state, ChartData:url});
  console.log("url", url); 
  },[div]);

  

  return(
    <View style={{flex:1, padding:20, alignContent:"center", justifyContent:"center"}}>
      {
        state.ChartData && 
        <WebView
          source={{uri: state.ChartData}}
          scrollEnabled={false}
          automaticallyAdjustContentInsets={true}
          style={{width: 600, height: 350}}
        />
      }
      <View style={{marginTop:40}}>
        <TouchableOpacity onPress={()=>props.onPress()}>
          <LinearGradient colors={["#FC7C37", "#FC7C37"]} style={[{borderRadius: 15, width:320, height:100}]}>
            <ImageBackground style={{width:340, height:90, paddingVertical:5, paddingHorizontal:20, alignItems:"flex-start"}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/booknow-bg.png`}}>
              <Text style={[{fontSize:14, color:"#fff"}]}>ARE YOU ABLE TO READ THE CHART?</Text>
              <Text style={[{fontSize:12, color:"#fff", marginTop:0}]}>Connect with an expert astrologer for a complete reading!</Text>
              <Text style={{paddingVertical:6, paddingHorizontal:20, borderRadius:10, backgroundColor:"#fff", marginTop:5}}>Call Now</Text>
            </ImageBackground>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const DashaView = (props) =>{
  const{data}=props;
  const[state, setState] = useState({});


useEffect(()=>{
  const req = {
    Name:data.Name,
    Gender:data.Gender,
    Dob:moment(data.DateOfBirth,'DD/MM/YYYY').format("DD-MMM-YYYY"),
    Tob:data.TimeOfBirth,
    Pob:data.PlaceOfBirth,
    IsNew:false
  }
  console.log("GetkundaliMahaDshaService req", req)
  Api.GetkundaliMahaDshaService(req).then(resp=>{
    console.log("GetkundaliMahaDshaService resp", JSON.stringify(resp));
    if(resp.ResponseCode==200){
      setState({...state, MahaDshaDetail:resp.data});
    }
    else{
      alert(resp.ResponseMessage);
    }
  });
},[])
  
        

       
  return(
    <View style={{marginTop:1}}>
     
      <Text style={{backgroundColor:"#F3F3F3", textAlign:"center", padding:10}}>MahaDasha</Text>

      <View style={{marginTop:20}}>
      
        <View style={{}}>
        <View style={{backgroundColor:"#F3F3F3", flexDirection:"row", paddingHorizontal:20, paddingVertical:10, marginTop:1}}>
              <Text style={{width:"20%"}}>Planet</Text>
              <Text style={{width:"40%"}}>Start</Text>
              <Text>End</Text>
            </View>
          {
            state.MahaDshaDetail && state.MahaDshaDetail.response && state.MahaDshaDetail.response.mahadasha && state.MahaDshaDetail.response.mahadasha.map((item, index)=>(
            <View style={{backgroundColor:index%2>0?"#F3F3F3":"#FDDBD5", flexDirection:"row", paddingHorizontal:20, paddingVertical:10, marginTop:1}}>
              <Text style={{width:"20%"}}>{item}</Text>
              <Text style={{width:"40%"}}>{index>0 && state.MahaDshaDetail.response.mahadasha_order[index-1]}</Text>
              <Text>{state.MahaDshaDetail.response.mahadasha_order[index]}</Text>
            </View>
            ))
          }
        </View>

      
     
      </View>

    </View>
  )
}
const styles=StyleSheet.create({
  pageTitle:{
      ...MainStyles.text,
      fontSize:20,
      marginBottom:20
  },
  label:{
      ...MainStyles.text,
      paddingLeft:20,
      fontSize:17,
      color:"#656565"
  },
  textInput:{
      flexDirection:"row",
      width:"100%",
      alignItems:"center",
      justifyContent:"space-between",
      paddingLeft:20,
      backgroundColor:"#F3F3F3", 
      borderRadius:30,
      marginBottom:20,
      height:50
  },
  selectButton:{flexDirection:"row", width:127, height:50, backgroundColor:"#F3F3F3", padding:5, alignContent:"center", alignItems:"center", borderRadius:30},
  selectedButton:{
      borderColor:"#FF708F",
      borderWidth:2,
      backgroundColor:"#fff"
  },
  wrapper: {flex: 1, height:220},
    slide: {
      flex: 1,
      backgroundColor: '#F5F5F5',
      paddingHorizontal: 30,
      paddingVertical:20
    },
    slide_text:{width:"100%", height:100}
});