import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, ScrollView, SafeAreaView, Linking, ActivityIndicator, Dimensions, RefreshControl, Platform, Alert } from 'react-native';
import {Picker} from '../../controls/MyPicker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
//import { DatePicker } from 'react-native-wheel-datepicker';
import { DatePicker } from '../../controls/MyDatePicker';
import MainStyles from '../../Styles';
import analytics from '@react-native-firebase/analytics';
import { Divider } from 'react-native-elements';
import * as UserControls from './Controls';
import * as env from '../../../env';
import * as Api from '../../Api';
import moment from 'moment';
import Swiper from 'react-native-swiper'
import {Autocomplete} from '../../controls/MyAutocomplete';
import {Singular} from 'singular-react-native';

export default class MatchmakingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      TabIndex:props.route.params && props.route.params.TabIndex ? props.route.params.TabIndex:0,
      data:props.route.params && props.route.params.data,
    };
  } 

  componentDidMount = () => {
    analytics().logEvent("Match_making");

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
          this.state.profile && <UserControls.Header {...this.props} title="Love Score" shareText={this.state.profile.ShareText}/>
        }

        {
          !this.state.data &&
          <View style={{flex:0, flexDirection:"row", padding:10}}>
            <TouchableOpacity onPress={()=> {Singular.event("MatchmakingScreen_Enter_New_Details"); this.onTabChange(0)}}>
              <LinearGradient colors={this.state.TabIndex==0 ? ["#DE374C", "#DE374C"]:["#fff", "#fff"]} style={[{ borderRadius: 30, marginLeft: 10 }]}>
                <Text style={[MainStyles.text,{borderRadius:10, paddingHorizontal:20, paddingVertical:3}, this.state.TabIndex==0 ? { color:"#fff" }:{color:"#000"}]}>Enter New Details</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> {Singular.event("MatchmakingScreen_Saved_Details"); this.onTabChange(1)}}>
              <LinearGradient colors={this.state.TabIndex==1 ? ["#DE374C", "#DE374C"]:["#fff", "#fff"]} style={[{ borderRadius: 30, marginLeft: 10 }]}>
                <Text style={[MainStyles.text,{borderRadius:10, paddingHorizontal:20, paddingVertical:3}, this.state.TabIndex==1 ? { color:"#fff" }:{color:"#000"}]}>Saved Details</Text>
              </LinearGradient>
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={()=> this.onTabChange(2)}>
              <LinearGradient colors={this.state.TabIndex==2 ? ["#DE374C", "#DE374C"]:["#fff", "#fff"]} style={[{ borderRadius: 30, marginLeft: 10 }]}>
                <Text style={[MainStyles.text,{borderRadius:10, paddingHorizontal:20, paddingVertical:3}, this.state.TabIndex==2 ? { color:"#fff" }:{color:"#000"}]}>Result</Text>
              </LinearGradient>
            </TouchableOpacity> */}
          </View>
        }

        <ScrollView style={{flex:1, backgroundColor:"#fff"}} keyboardShouldPersistTaps="always"> 
         {
          this.state.data && <MatchResult {...this.props} data={this.state.data} onTabChange = {() => this.onTabChange(0)}/>
          ||
          this.state.TabIndex==0 && this.state.profile && <View style={{flex:1, backgroundColor:"#fff"}}><EnterNewDetails {...this.props} profile={this.state.profile} onSubmit = {(data) => this.setState({TabIndex:2, data:data})}/></View>
          ||
          this.state.TabIndex==1 && <SavedDetails {...this.props} onSubmit = {(data) => this.setState({TabIndex:2, data:data})} onTabChange = {() => this.onTabChange(0)}/>
          ||
          <ActivityIndicator color="blue"/>
         }
        </ScrollView> 
        
       
      </SafeAreaView>
    );
  }
}


const EnterNewDetails = (props) => {
  
  const[state, setState]=useState(props.profile.Gender=="Male" ? {
    boy_name:props.profile.Name,
    boy_dob:moment(props.profile.DateOfBirth, "DD/MMM/YYYY").format(),
    boy_tob:moment(props.profile.TimeOfBirth, "HH:mm:00").format(),
    boy_pob:props.profile.PlaceOfBirth,
    girl_dob:moment(), 
    girl_tob:moment(), 
  }:{
    boy_dob:moment(), 
    boy_tob:moment(), 
    girl_name:props.profile.Name,
    girl_dob:moment(props.profile.DateOfBirth, "DD/MMM/YYYY").format(), 
    girl_tob:moment(props.profile.TimeOfBirth, "HH:mm:00").format(), 
    girl_pob:props.profile.PlaceOfBirth
  });

  useEffect(() => {
    const boy_delayDebounceFn = setTimeout(() => {
      // Send Axios request here
      if(state.boy_pob!=null && state.boy_pob.length>0){
        Api.GetMatchmakingLocationSuggestionService(state.boy_pob).then(resp=>{
          console.log("GetMatchmakingLocationSuggestionService resp", resp);
          if(resp.ResponseCode==200){
            setState({...state, boy_pobLocationSuggestion:resp.data});
          }
        });
      }
    }, 3000)
    return () => clearTimeout(boy_delayDebounceFn)
  }, [state.boy_pob])

  useEffect(() => {
    const girl_delayDebounceFn = setTimeout(() => {
      // Send Axios request here
      if(state.girl_pob!=null && state.girl_pob.length>0){
        Api.GetMatchmakingLocationSuggestionService(state.girl_pob).then(resp=>{
          console.log("GetMatchmakingLocationSuggestionService resp", resp);
          if(resp.ResponseCode==200){
            setState({...state, girl_pobLocationSuggestion:resp.data});
          }
        });
      }

    }, 3000)
    return () => clearTimeout(girl_delayDebounceFn)
  }, [state.girl_pob])

  const onChange_boy = (keyworkds) => {
    console.log("onChange", state.boy_pob)
    setState({...state, boy_pob:keyworkds});
  }

  const onChange_girl = (keyworkds) => {
    console.log("onChange", state.girl_pob)
    setState({...state, girl_pob:keyworkds});
  }

  const onSubmit = () => {
    Singular.event("MatchmakingScreen_onSubmit");
    if(!state.boy_name){
      Alert.alert(null, "Name Required.");
      return;
    }
    if(!state.boy_tob){
      Alert.alert(null, "Time of Birth Required.");
      return;
    }
    if(!state.boy_dob){
      Alert.alert(null, "Date of Birth Required.");
      return;
    }
    if(!state.boy_pob){
      Alert.alert(null, "Place of Birth Required.");
      return;
    }

    if(!state.girl_name){
      Alert.alert(null, "Name Required.");
      return;
    }
    if(!state.girl_tob){
      Alert.alert(null, "Time of Birth Required.");
      return;
    }
    if(!state.girl_dob){
      Alert.alert(null, "Date of Birth Required.");
      return;
    }
    if(!state.girl_pob){
      Alert.alert(null, "Place of Birth Required.");
      return;
    }

    const req = {
      boy_name:state.boy_name,
      boy_dob:moment(state.boy_dob).format("DD/MMM/YYYY"),
      boy_tob:moment(state.boy_tob).format("HH:mm"),
      boy_pob:state.boy_pob,
      girl_name:state.girl_name,
      girl_dob:moment(state.girl_dob).format("DD/MMM/YYYY"), 
      girl_tob:moment(state.girl_tob).format("HH:mm"), 
      girl_pob:state.girl_pob,
      IsNew:true
    }
    console.log("GetCompatibilityScoreService req", req)
    Api.GetCompatibilityScoreService(req).then(resp=>{
      console.log("GetCompatibilityScoreService resp", resp);
      if(resp.ResponseCode==200){
        setState({});
        //props.onSubmit({...resp.data, boy_name:req.boy_name, girl_name:req.girl_name});
        //props.navigation.push('MatchmakingScreen', {TabIndex:2, data:{...resp.data, boy_name:req.boy_name, girl_name:req.girl_name}});
        props.navigation.replace('MatchmakingScreen', {TabIndex:2, data:{...resp.data, boy_name:req.boy_name, girl_name:req.girl_name}});
      }
      else{
        alert(resp.ResponseMessage);
      }
    });
  }
  return(
    
    <View style={{padding:30}}>
      <View style={{flexDirection:"row", alignItems:"center", marginBottom:20}}>
          <Image style={{width:22, height:33, marginLeft:22}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/man.png`}}/>
          <Text style={[MainStyles.text, {marginLeft:16}]}>Male</Text>
      </View>

      <Text style={styles.label}>Name <Text style={{color:"red"}}>*</Text></Text>
      <View style={[styles.textInput, {height:50}]}>
          <TextInput style={{width:"100%", color:"#000"}} value={state.boy_name} onChangeText={(text)=>setState({...state, boy_name:text})} placeholder="Name"/>
      </View>

      <Text style={styles.label}>Date of Birth <Text style={{color:"red"}}>*</Text></Text> 
        <TouchableOpacity onPress={()=> setState({...state, boy_showDate:true})}>
            <View style={[styles.textInput, {height:50}]}>
                <Text>{state.boy_dob==null?"DD-MM-YYYY":moment(state.boy_dob).format("DD-MM-YYYY")}</Text>
                <Image style={{width:23, height:23, marginRight:20}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/calendar.png`}}/>
            </View>
        </TouchableOpacity>
        {
        state.boy_showDate &&
         
        <DatePicker
        date={new Date(state.boy_dob)} 
        minimumDate={new Date(1921,1,1)}
        maximumDate={new Date()} 
        mode="date"
        onDateChange={(selectedDate)=> setState({...state, boy_dob:selectedDate, boy_showDate:false})}
        />
        // <TouchableOpacity onPress={()=>setState({...state, boy_showDate:false})}>{/*/LanguageChoiseScreen*/}
        //     <LinearGradient colors={["#7162FC", "#B542F2"]} style={{borderRadius:30, width:150, marginBottom:15, marginTop:10, alignSelf:"center"}}>
        //         <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>OK</Text>
        //     </LinearGradient>
        // </TouchableOpacity>
         
        }

      <Text style={styles.label}>City of Birth <Text style={{color:"red"}}>*</Text></Text>
      <View style={{flex:1, marginBottom:20}}>
        
          <Autocomplete
            data={state.boy_pobLocationSuggestion}
            value={state.boy_pob}
            onChangeText={(test) => onChange_boy(test)}
          />
      </View>

      <Text style={styles.label}>Time of Birth <Text style={{color:"red"}}>*</Text></Text>
      <TouchableOpacity onPress={()=> setState({...state, boy_showTime:true})}>
          <View style={[styles.textInput, {height:50}]}>
              <Text>{state.boy_tob==null?"HH:MM":moment(state.boy_tob).format("HH:mm")}</Text>
              <Image style={{width:23, height:23, marginRight:20}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/clock.png`}}/>
          </View>
      </TouchableOpacity>
      {
          state.boy_showTime &&
          
          <DatePicker
          date={new Date(state.boy_tob)} 
          mode="time"
          onDateChange={(selectedDate)=> setState({...state,boy_tob:selectedDate, boy_showTime:false})}
          />
          // <TouchableOpacity onPress={()=>setState({...state, boy_showTime:false})}>{/*/LanguageChoiseScreen*/}
          //     <LinearGradient colors={["#7162FC", "#B542F2"]} style={{borderRadius:30, width:150, marginBottom:15, marginTop:10, alignSelf:"center"}}>
          //         <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>OK</Text>
          //     </LinearGradient>
          // </TouchableOpacity>
           
      }

      <Divider inset={false}/>

      <View style={{flexDirection:"row", alignItems:"center", marginVertical:20}}>
          <Image style={{width:22, height:33, marginLeft:22}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/woman.png`}}/>
          <Text style={[MainStyles.text, {marginLeft:16}]}>Female</Text>
      </View>

      <Text style={styles.label}>Name <Text style={{color:"red"}}>*</Text></Text>
      <View style={[styles.textInput, {height:50}]}>
          <TextInput style={{width:"100%", height:50, color:"#000"}} value={state.girl_name} onChangeText={(text)=>setState({...state, girl_name:text})} placeholder="Name"/>
      </View>

      <Text style={styles.label}>Date of Birth <Text style={{color:"red"}}>*</Text></Text> 
        <TouchableOpacity onPress={()=> setState({...state, girl_showDate:true})}>
            <View style={[styles.textInput, {height:50}]}>
                <Text>{state.girl_dob==null?"DD-MM-YYYY":moment(state.girl_dob).format("DD-MM-YYYY")}</Text>
                <Image style={{width:23, height:23, marginRight:20}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/calendar.png`}}/>
            </View>
        </TouchableOpacity>
        {
        state.girl_showDate &&
         
          <DatePicker
          date={new Date(state.girl_dob)} 
          minimumDate={new Date(1921,1,1)}
          maximumDate={new Date()} 
          mode="date"
          onDateChange={(selectedDate)=> setState({...state, girl_dob:selectedDate, girl_showDate:false})}
          />
          // <TouchableOpacity onPress={()=>setState({...state, girl_showDate:false})}>{/*/LanguageChoiseScreen*/}
          //     <LinearGradient colors={["#7162FC", "#B542F2"]} style={{borderRadius:30, width:150, marginBottom:15, marginTop:10, alignSelf:"center"}}>
          //         <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>OK</Text>
          //     </LinearGradient>
          // </TouchableOpacity>
         
        }

      <Text style={styles.label}>City of Birth <Text style={{color:"red"}}>*</Text></Text>
      <View style={{flex:1, marginBottom:20}}>
          {/* <TextInput style={{width:"100%", color:"#000"}} value={state.girl_pob} onChangeText={(text)=>setState({...state, girl_pob:text})} placeholder="Enter City/District"/> */}
          <Autocomplete
            data={state.girl_pobLocationSuggestion}
            value={state.girl_pob}
            onChangeText={(test) => onChange_girl(test)}
          />
      </View>

      <Text style={styles.label}>Time of Birth <Text style={{color:"red"}}>*</Text></Text>
      <TouchableOpacity onPress={()=> setState({...state, girl_showTime:true})}>
          <View style={[styles.textInput, {height:50}]}>
              <Text>{state.girl_tob==null?"HH:MM":moment(state.girl_tob).format("HH:mm")}</Text>
              <Image style={{width:23, height:23, marginRight:20}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/clock.png`}}/>
          </View>
      </TouchableOpacity>
      {
          state.girl_showTime &&
           
          <DatePicker
          date={new Date(state.girl_tob)} 
          mode="time"
          onDateChange={(selectedDate)=> setState({...state,girl_tob:selectedDate, girl_showTime:false})}
          />
          // <TouchableOpacity onPress={()=>setState({...state, girl_showTime:false})}>{/*/LanguageChoiseScreen*/}
          //     <LinearGradient colors={["#7162FC", "#B542F2"]} style={{borderRadius:30, width:150, marginBottom:15, marginTop:10, alignSelf:"center"}}>
          //         <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>OK</Text>
          //     </LinearGradient>
          // </TouchableOpacity>
           
      }

      <View style={{alignItems:"center"}}>
          <TouchableOpacity onPress={()=> onSubmit()}>
              <LinearGradient colors={["#CC0E13", "#FB77A6"]} style={{borderRadius:30, width:300, marginBottom:20}}>
                  <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>SUBMIT</Text>
              </LinearGradient>
          </TouchableOpacity>
      </View>

   
    </View>
   
  )
}

const SavedDetails = (props) => {
  const[data, setData]=useState(null);
  const[male, setMale]=useState(null);
  const[female, setFemale]=useState(null);

  useEffect(()=>{
    Api.GetUserHistoryService().then(resp=>{
      console.log("GetUserHistoryService resp", resp);
      if(resp.ResponseCode==200){ 
        setData(resp.data)
      }
      else{
        alert(resp.ResponseMessage);
      }
    });
  },[])

  const onSubmit = () =>{
    if(!male || !female) return;

    const req = {
      boy_name:male.Name,
      boy_dob:moment(male.DateOfBirth, "DD/MM/YYYY").format("DD/MMM/YYYY"),
      boy_tob:male.TimeOfBirth,
      boy_pob:male.PlaceOfBirth,
      girl_name:female.Name,
      girl_dob:moment(female.DateOfBirth, "DD/MM/YYYY").format("DD/MMM/YYYY"), 
      girl_tob:female.TimeOfBirth, 
      girl_pob:female.PlaceOfBirth,
      IsNew:false
    }

    console.log("GetCompatibilityScoreService req", req)
    Api.GetCompatibilityScoreService(req).then(resp=>{
      console.log("GetCompatibilityScoreService resp", resp);
      if(resp.ResponseCode==200){
        //props.onSubmit({...resp.data, boy_name:req.boy_name, girl_name:req.girl_name});
        //props.navigation.push('MatchmakingScreen', {TabIndex:2, data:{...resp.data, boy_name:req.boy_name, girl_name:req.girl_name}});
        props.navigation.replace('MatchmakingScreen', {TabIndex:2, data:{...resp.data, boy_name:req.boy_name, girl_name:req.girl_name}});
      }
      else{
        alert(resp.ResponseMessage);
      }
    });
  }
  
  return(
    <View style={{flex:1, backgroundColor:"#fff"}}>
      <View style={{flexDirection:"row", alignContent:"center", justifyContent:"space-evenly", marginTop:50}}>
        <View style={{alignItems:"center"}}>
            <Image style={{width:22, height:33}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/man.png`}}/>
            <View style={{backgroundColor:"#EFEFEF", borderRadius:20, marginTop:10, paddingLeft:10}}>
              <Picker style={{ width: 150, height:50 }} selectedValue={male} onValueChange = {(selectedItem)=> setMale(selectedItem)}>
              <Picker.Item label='Select Profile' value={null}/>
                {
                  data && data.filter(item=>item.Gender=='MALE').map((item, index)=>(<Picker.Item key={index} label={item.Name} value={item}/>))
                  ||
                  <Picker.Item label='Select'/>
                }
              </Picker>
              {
                Platform.OS=="android" && <Text style={{width: '100%', height: 60, position: 'absolute', bottom: 0, left: 0}}>{' '}</Text>
              }
              
            </View>
        </View>
        <View style={{alignItems:"center"}}>
            <Image style={{width:22, height:33}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/woman.png`}}/>
            <View style={{backgroundColor:"#EFEFEF", borderRadius:20, marginTop:10, paddingLeft:10}}>
              <Picker style={{ width: 150, height:50 }} selectedValue={female} onValueChange = {(selectedItem)=> setFemale(selectedItem)}>
              <Picker.Item label='Select Profile' value={null}/>
                {
                  data && data.filter(item=>item.Gender=='FEMALE').map((item, index)=>(<Picker.Item key={index} label={item.Name} value={item}/>))
                  ||
                  <Picker.Item label='Select'/>
                }
              </Picker>
              {
                Platform.OS=="android" && <Text style={{width: '100%', height: 60, position: 'absolute', bottom: 0, left: 0}}>{' '}</Text>
              }
            </View>
        </View>
        </View>


        {
          male && female &&
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
  )
}

const MatchResult = (props) => {
  const {data}=props;
  const[bannerList, setBannerList]=useState([]);
  useEffect(()=>{
    console.log("GetBannersService req");
    Api.GetBannersService("COMPSCRB1").then(resp => {
      console.log("GetBannersService resp", resp);
      if (resp.ResponseCode == 200) {
        setBannerList(resp.data);
      }
    });
  },[])
  return(
    <View style={{flex:1, backgroundColor:"#fff"}}>
   
      {
        bannerList && bannerList.map((item, index) => (
          <View key={index}>
            <TouchableOpacity key={index} onPress={() => {props.navigation.navigate(item.ActionName, JSON.parse(item.ActionParams));}}>
                <View style={{backgroundColor:"#ffe", marginTop:10}}>
                  <Image style={{ width: "100%", height:(Dimensions.get("window").width*313)/1982 }} resizeMode="stretch" source={{ uri: `${env.DynamicAssetsBaseURL}${item.BannerUrl}` }} />
                </View>
              </TouchableOpacity> 
          </View>
        ))
      }

      <View style={{minHeight:160, alignItems:"center", justifyContent:"center"}}>
        <Text style={{fontWeight:"700"}}>Compatibility Score of {data.boy_name} With {data.girl_name} is</Text>
        <Text style={{color:"#E51530", fontSize:28, fontWeight:"700", marginTop:10}}>{data.response.score}%</Text>
      </View>
      <View style={{minHeight:160, alignItems:"center", justifyContent:"center", backgroundColor:"#F3F3F3"}}>
        <Text style={{fontWeight:"700"}}>Summary</Text>
        <Text style={{color:"#656565", paddingHorizontal:20}}>{data.response.bot_response}</Text>
      </View>

      <View style={{marginTop:40}}>
        
      

       <View style={{minHeight:200}}>
        <Swiper 
            style={styles.wrapper} 
            showsButtons={true}
            nextButton = {<Text style={{color:"#ccc", fontSize:30, fontWeight:"bold"}}>{'>'}</Text>}
            prevButton = {<Text style={{color:"#ccc", fontSize:30, fontWeight:"bold"}}>{'<'}</Text>}
            >
          
              <View style={styles.slide}>
                <View style={styles.slide_text}>
                  <Text style={{backgroundColor:"#EDCBCE", width:"100%", textAlign:"center", paddingVertical:15, fontWeight:"700", fontSize:18}}>Kaalsarp Dosh</Text>
                  <Text style={styles.sliderDesc}>{data.response.kaalsarpdosh}</Text>
                </View>
              </View>
            
              <View style={styles.slide}>
                <View style={styles.slide_text}>
                  <Text style={{backgroundColor:"#EDCBCE", width:"100%", textAlign:"center", paddingVertical:15, fontWeight:"700", fontSize:18}}>Kalatra Dosh Rahuketu</Text>
                  <Text style={styles.sliderDesc}>{data.response.kalatradosh_rahuketu}</Text>
                </View>
              </View>
            
              <View style={styles.slide}>
                <View style={styles.slide_text}>
                  <Text style={{backgroundColor:"#EDCBCE", width:"100%", textAlign:"center", paddingVertical:15, fontWeight:"700", fontSize:18}}>Kalatra Dosh Saturn</Text>
                  <Text style={styles.sliderDesc}>{data.response.kalatradosh_saturn}</Text>
                </View>
              </View>
             
              <View style={styles.slide}>
                <View style={styles.slide_text}>
                  <Text style={{backgroundColor:"#EDCBCE", width:"100%", textAlign:"center", paddingVertical:15, fontWeight:"700", fontSize:18}}>Mangal Dosh</Text>
                  <Text style={styles.sliderDesc}>{data.response.mangaldosh}</Text>
                </View>
              </View>
             
              <View style={styles.slide}>
                <View style={styles.slide_text}>
                  <Text style={{backgroundColor:"#EDCBCE", width:"100%", textAlign:"center", paddingVertical:15, fontWeight:"700", fontSize:18}}>Pitra Dosh</Text>
                  <Text style={styles.sliderDesc}>{data.response.pitradosh}</Text>
                </View>
              </View>
            
        </Swiper>
       </View>

       <View style={{alignItems:"center",paddingTop:20}}>
          <TouchableOpacity onPress={()=> /*props.navigation.goBack()*/ props.navigation.replace('MatchmakingScreen')}>
              <LinearGradient colors={["#CC0E13", "#FB77A6"]} style={{borderRadius:30, width:300, marginBottom:20}}>
                  <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>Enter New Details</Text>
              </LinearGradient>
          </TouchableOpacity>
       </View>

       <View>
        <UserControls.ExpertSuggestionView navigation={props.navigation}/>
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
      marginBottom:20
  },
  selectButton:{flexDirection:"row", width:127, height:50, backgroundColor:"#F3F3F3", padding:5, alignContent:"center", alignItems:"center", borderRadius:30},
  selectedButton:{
      borderColor:"#FF708F",
      borderWidth:2,
      backgroundColor:"#fff"
  },
  wrapper: {height:220},
    slide: {
      flex: 1,
      backgroundColor: '#F5F5F5',
      paddingHorizontal: 0,
      paddingVertical:0
    },
    slide_text:{width:"100%", height:140},
    sliderDesc:{paddingHorizontal:30, paddingVertical:10}
});