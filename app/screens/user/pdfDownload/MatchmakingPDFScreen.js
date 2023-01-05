import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, ScrollView, SafeAreaView, Linking, ActivityIndicator, Dimensions, PermissionsAndroid, Platform, TouchableOpacity, Alert, Modal } from 'react-native';
import {Picker} from '../../../controls/MyPicker';
import { Toast, Card, cardItem, CardItem, List, ListItem, Left, Right } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
//import { DatePicker } from 'react-native-wheel-datepicker';
import { DatePicker } from '../../../controls/MyDatePicker';
import MainStyles from '../../../Styles';
import analytics from '@react-native-firebase/analytics';
import * as UserControls from '../Controls';
import * as env from '../../../../env';
import * as Api from '../../../Api';
import * as Auth from '../../../Auth';
import * as MyExtension from '../../../MyExtension';
import moment from 'moment';
import { WebView } from 'react-native-webview';
import {Autocomplete} from '../../../controls/MyAutocomplete';
import {Singular} from 'singular-react-native';
import Overlay from 'react-native-modal-overlay';
import RNFetchBlob from 'rn-fetch-blob';
import { Divider } from 'react-native-elements';
import PDFView from 'react-native-view-pdf';
import RazorpayCheckout from 'react-native-razorpay';
import AllInOneSDKManager from 'paytm_allinone_react-native';

export default class MatchmakingPDFScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      TabIndex:props.route.params && props.route.params.TabIndex ? props.route.params.TabIndex:0,
      data:props.route.params && props.route.params.data,
    };
  } 

  componentDidMount = () => {
    analytics().logEvent("Matchmaking_PDF");
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
          !this.state.data &&
          <View style={{flex:0, flexDirection:"row", padding:10}}>
            <TouchableOpacity onPress={()=> {this.onTabChange(0)}}>
              <LinearGradient colors={this.state.TabIndex==0 ? ["#FC7C37", "#FC7C37"]:["#fff", "#fff"]} style={[{ borderRadius: 30, marginLeft: 10 }]}>
                <Text style={[MainStyles.text,{borderRadius:10, paddingHorizontal:20, paddingVertical:3}, this.state.TabIndex==0 ? { color:"#fff" }:{color:"#000"}]}>Enter New Details</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> {this.onTabChange(1)}}>
              <LinearGradient colors={this.state.TabIndex==1 ? ["#FC7C37", "#FC7C37"]:["#fff", "#fff"]} style={[{ borderRadius: 30, marginLeft: 10 }]}>
                <Text style={[MainStyles.text,{borderRadius:10, paddingHorizontal:20, paddingVertical:3}, this.state.TabIndex==1 ? { color:"#fff" }:{color:"#000"}]}>Saved Details</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        }
        
        
        <ScrollView style={{flex:1, backgroundColor:"#fff"}} keyboardShouldPersistTaps="always">
         {
            this.state.data && this.state.profile &&  <Result {...this.props} data={this.state.data} profile={this.state.profile} onCallNow={() => this.props.navigation.navigate("ExpertListScreen")}/> 
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
  

  var prof=props.profile.Gender=="Male" ? {
    boy_name:props.profile.Name,
    boy_dob:props.profile.DateOfBirth?moment(Date(props.profile.DateOfBirth)):moment(),
    boy_tob:props.profile.TimeOfBirth?moment(props.profile.TimeOfBirth, "HH:mm:00"):moment(),
    boy_pob:props.profile.PlaceOfBirth,
    girl_dob:moment(), 
    girl_tob:moment(), 
  }:{
    boy_dob:moment(), 
    boy_tob:moment(), 
    girl_name:props.profile.Name,
    girl_dob:props.profile.DateOfBirth?moment(Date(props.profile.DateOfBirth)):moment(),
    girl_tob:props.profile.TimeOfBirth?moment(props.profile.TimeOfBirth, "HH:mm:00"):moment(), 
    girl_pob:props.profile.PlaceOfBirth
  };

    const[state, setState]=useState({...prof, boy_pobSelected:true, girl_pobSelected:true});
  
    useEffect(() => {
      console.log("prof", prof, "DateOfBirth", moment(Date(props.profile.DateOfBirth)))
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
      if(state.boy_name==null || state.boy_name==""){
        alert("Name is required");
        return;
      }
      if(state.boy_dob==null || state.boy_dob==""){
        alert("Date Of Birth is required");
        return;
      }
      if(state.boy_tob==null || state.boy_tob==""){
        alert("Time Of Birth is required");
        return;
      }
      if(state.boy_pob==null || state.boy_pob==""){
        alert("City of Birth is required");
        return;
      }
    
      if(state.girl_name==null || state.girl_name==""){
        alert("Name is required");
        return;
      }
      if(state.girl_dob==null || state.girl_dob==""){
        alert("Date Of Birth is required");
        return;
      }
      if(state.girl_tob==null || state.girl_tob==""){
        alert("Time Of Birth is required");
        return;
      }
      if(state.girl_pob==null || state.girl_pob==""){
        alert("City of Birth is required");
        return;
      }

      Singular.event("MatchmakingScreen_onSubmit");
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
      console.log("req", req);
      props.navigation.push('MatchmakingPDFScreen', {TabIndex:2, data:req});
    //   console.log("GetCompatibilityScoreService req", req)
    //   Api.GetCompatibilityScoreService(req).then(resp=>{
    //     console.log("GetCompatibilityScoreService resp", resp);
    //     if(resp.ResponseCode==200){
    //       setState({});
    //       //props.onSubmit({...resp.data, boy_name:req.boy_name, girl_name:req.girl_name});
    //       props.navigation.push('MatchmakingPDFScreen', {TabIndex:2, data:{...resp.data, boy_name:req.boy_name, girl_name:req.girl_name}});
    //     }
    //     else{
    //       alert(resp.ResponseMessage);
    //     }
    //   });
    }
    return(
      
      <View style={{padding:30}}>
        <View style={{flexDirection:"row", alignItems:"center", marginBottom:20}}>
            <Image style={{width:22, height:33, marginLeft:22}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/man.png`}}/>
            <Text style={[MainStyles.text, {marginLeft:16}]}>Male</Text>
        </View>
  
        <Text style={styles.label}>Name <Text style={{color:"red"}}>*</Text></Text>
        <View style={styles.textInput}>
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
        <View style={styles.textInput}>
            <TextInput style={{width:"100%", color:"#000"}} value={state.girl_name} onChangeText={(text)=>setState({...state, girl_name:text})} placeholder="Name"/>
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
      props.navigation.push('MatchmakingPDFScreen', {TabIndex:2, data:req});
    //   console.log("GetCompatibilityScoreService req", req)
    //   Api.GetCompatibilityScoreService(req).then(resp=>{
    //     console.log("GetCompatibilityScoreService resp", resp);
    //     if(resp.ResponseCode==200){
    //       //props.onSubmit({...resp.data, boy_name:req.boy_name, girl_name:req.girl_name});
    //       props.navigation.push('MatchmakingPDFScreen', {TabIndex:2, data:{...resp.data, boy_name:req.boy_name, girl_name:req.girl_name}});
    //     }
    //     else{
    //       alert(resp.ResponseMessage);
    //     }
    //   });
    }
    
    return(
      <View style={{flex:1, backgroundColor:"#fff"}}>
        <View style={{flexDirection:"row", alignContent:"center", justifyContent:"space-evenly", marginTop:50}}>
          <View style={{alignItems:"center"}}>
              <Image style={{width:22, height:33}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/man.png`}}/>
              <View style={{backgroundColor:"#EFEFEF", borderRadius:20, marginTop:10, paddingLeft:10}}>
                <Picker style={{ width: 150 }} selectedValue={male} onValueChange = {(selectedItem)=> setMale(selectedItem)}>
                <Picker.Item label='Select Profile' value={null}/>
                  {
                    data && data.filter(item=>item.Gender=='MALE').map((item, index)=>(<Picker.Item key={index} label={item.Name} value={item}/>))
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
                <Picker style={{ width: 150 }} selectedValue={female} onValueChange = {(selectedItem)=> setFemale(selectedItem)}>
                <Picker.Item label='Select Profile' value={null}/>
                  {
                    data && data.filter(item=>item.Gender=='FEMALE').map((item, index)=>(<Picker.Item key={index} label={item.Name} value={item}/>))
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
  
const Result = (props) => {
  const{data, profile}=props;
  const[showMessageBox, setShowMessageBox]=useState(false)
  const[loading, setLoading]=useState(false);
  const[showWatingMessageBox, setShowWatingMessageBox]=useState(false)
  const[pdfUrl, setPdfUrl]=useState();
  const[pdfViewOpen, setPdfViewOpen]=useState(false);
  const[isPaymentView, setIsPaymentView]=useState(false);

  const onSubmit = () => {
    setIsPaymentView(true);
  }

  const _onSPSelect = (Mathod) => {

    if(loading) return;
    setLoading(true);
    
    var req={
      ServiceType:MyExtension.DownloadPDF_ServiceType.MATCHMAKING,
      Profile1_Name:data.boy_name,
      Profile1_Gender:"MALE",
      Profile1_DateOfBirth:moment(data.boy_dob, ["DD/MM/YYYY", "DD/MMM/YYYY", "DD-MM-YYYY"]).format("DD/MMM/YYYY"),
      Profile1_TimeOfBirth:data.boy_tob,
      Profile1_PlaceOfBirth:data.boy_pob,
      Profile2_Name:data.girl_name,
      Profile2_Gender:"FEMALE",
      Profile2_DateOfBirth:moment(data.girl_dob, ["DD/MM/YYYY", "DD/MMM/YYYY", "DD-MM-YYYY"]).format("DD/MMM/YYYY"),
      Profile2_TimeOfBirth:data.girl_tob,
      Profile2_PlaceOfBirth:data.girl_pob,
      Mathod:Mathod
    };

    console.log("DownloadHoroscopeCreateTransactionService req",req);
    Api.DownloadHoroscopeCreateTransactionService(req).then(response => {
        console.log("DownloadHoroscopeCreateTransactionService resp", response);
        if(response.ResponseCode == 200){
            switch (Mathod) {
                case "paytm": {
                    paytmSubmit(response.data, Mathod);
                    break;
                }
                default: {
                    razorpaySubmit(response.data, Mathod);
                    break;
                }
            }
            setIsPaymentView(false);
        }
        else{
          setLoading(false);
          if(response.data!=null && response.data.Alert!=null)
            Alert.alert(response.data.Alert.Title, response.data.Alert.Message)
          else
            Alert.alert(
                null,
                response.ResponseMessage,
                [{
                    text: "OK"
                }]
              );
        }
    })
  }


  const razorpaySubmit = (data, Mathod) => {
    var options = {
        description: 'Select Astro txnid:' + data.TxnId,
        image: 'https://services.myastrotest.in/Content/App/assets/images/logo.png',
        currency: 'INR',
        key: 'rzp_live_jef3Y0sZQebKKk',
        amount: data.NetAmount * 100,
        name: 'plan ' + data.NetAmount,
        prefill: {
            email: profile.Emaile??"payment@myastrotest.in",
            contact: profile.MobileNo,
            name: profile.Name,
            method: Mathod
        },
        theme: { color: '#F37254' }
    }

    RazorpayCheckout.open(options).then((Razorpay_data) => {
      console.log("Razorpay_data", Razorpay_data);
        // handle success
        var treq = { Id:data.Id, TxnId: data.TxnId, PaymentId: Razorpay_data.razorpay_payment_id, Status:"1" };
        console.log("DownloadHoroscopeUpdateTransactionService req", treq);
        Api.DownloadHoroscopeUpdateTransactionService(treq).then(tresp => {
          console.log("DownloadHoroscopeUpdateTransactionService resp", tresp);
          setLoading(false);
          if (tresp.ResponseCode == 200) {
            setShowWatingMessageBox(false);
            setPdfUrl(`${env.DynamicAssetsBaseURL}${tresp.data.pdf_url}`);
            setPdfViewOpen(true);
          }
        })
        //alert(`Success: ${data.razorpay_payment_id}`);
    }).catch((error) => {
      setLoading(false);
        // handle failure
        //alert(`Error: ${error.code} | ${error.description}`);
        alert("Oops! Transaction Fail. please try again");
    });
}

const paytmSubmit = (data, Mathod) => {
    var callBack = `https://securegw.paytm.in/theia/paytmCallback?ORDER_ID=${data.OrderId}`;

    var paytmReq = {
        orderId: data.OrderId,
        mid: "Select06912760077014",
        txnToken: data.txnToken,
        amount: data.NetAmount.toString(),
        callbackUrl: callBack,
        isStaging: false,
        restrictAppInvoke: false
    };

    console.log("paytmReq", paytmReq);

    AllInOneSDKManager.startTransaction(
      data.OrderId,
        "Select06912760077014",
        data.txnToken,
        data.NetAmount.toString(),
        callBack,
        false,
        false,
    )
        .then((result) => {
            console.log(result);
            setLoading(false);
            /*
             {"BANKNAME": "NKMB", "BANKTXNID": "202117423419462", "CHECKSUMHASH": "9zUNSoGS2XEChk0okT7wgAjKXqA4Fi3xXToBVjQ2u54leWuKkJKQEpdoW/e+mJKWrPzdpqeEh5OrzKAk/PPGGIGwJEL21jiqsM+AaTYj4Xo=", "CURRENCY": "INR", "GATEWAYNAME": "BOBFSS", "MID": "Select06912760077014", "ORDERID": "7W6B73zYruI_", "PAYMENTMODE": "CC", "RESPCODE": "01", "RESPMSG": "Txn Success", "STATUS": "TXN_SUCCESS", "TXNAMOUNT": "59.00", "TXNDATE": "2021-06-23 16:41:09.0", "TXNID": "20210623111212800110168423815791449"}
            */
            if (parseFloat(data.NetAmount) != parseFloat(result.TXNAMOUNT)) {
                //alert("Oops! amount is not matching with transaction amount.");
                alert("Oops! Transaction has been cancelled. Please try again.");
            }
            else if(result.RESPCODE=="01"){
                var treq = {Id:data.Id, TxnId: data.TxnId, PaymentId: result.TXNID, Status:"1" };
                console.log("DownloadHoroscopeUpdateTransactionService req", treq);
                Api.DownloadHoroscopeUpdateTransactionService(treq).then(tresp => {
                  console.log("DownloadHoroscopeUpdateTransactionService resp", tresp);
                    if (tresp.ResponseCode == 200) {
                      setShowWatingMessageBox(false);
                      setPdfUrl(`${env.DynamicAssetsBaseURL}${tresp.data.pdf_url}`);
                      setPdfViewOpen(true);
                    }
                })
            }
            else{
                alert("Oops! amount is not matching with transaction amount.");
                
            }
        })
        .catch((err) => {
          setLoading(false);
            console.log("paytm error", err);
            alert("Oops! Transaction Fail. please try again"); 
        });
}


/*
  const onSubmit = () => {
    console.log("data", data);
    

    setLoading(true);
    setShowWatingMessageBox(true);

    var req={
      ServiceType:MyExtension.DownloadPDF_ServiceType.MATCHMAKING,
      Profile1_Name:data.boy_name,
      Profile1_Gender:"MALE",
      Profile1_DateOfBirth:moment(data.boy_dob, ["DD/MM/YYYY", "DD/MMM/YYYY", "DD-MM-YYYY"]).format("DD/MMM/YYYY"),
      Profile1_TimeOfBirth:data.boy_tob,
      Profile1_PlaceOfBirth:data.boy_pob,
      Profile2_Name:data.girl_name,
      Profile2_Gender:"FEMALE",
      Profile2_DateOfBirth:moment(data.girl_dob, ["DD/MM/YYYY", "DD/MMM/YYYY", "DD-MM-YYYY"]).format("DD/MMM/YYYY"),
      Profile2_TimeOfBirth:data.girl_tob,
      Profile2_PlaceOfBirth:data.girl_pob
    };

    console.log("DownloadKundaliHoroscopeCreateTransactionService req", req);
    Api.DownloadKundaliHoroscopeCreateTransactionService(req).then(resp=>{
      console.log("DownloadKundaliHoroscopeCreateTransactionService resp", resp);
      if(resp.ResponseCode==200){
        setLoading(false);
        setShowWatingMessageBox(false);
        //--//setShowMessageBox(true);

        setPdfUrl(`${env.DynamicAssetsBaseURL}${resp.data.pdf_url}`);
        setPdfViewOpen(true);
      }
      else{
        Alert.alert(
          null,
          resp.ResponseMessage,
          [
            {
              text: "OK",
              onPress: () => {
                if(resp.ResponseCode==409){
                  props.navigation.replace("WalletScreen")
                }
              }
            }
          ]
        ); 
      }
    })
    
    //setShowWatingMessageBox(true);
  }
*/

  const onDownloadNow = async() => {
    if(Platform.OS=="android"){
      const permissionAndroid = await PermissionsAndroid.check('android.permission.WRITE_EXTERNAL_STORAGE');
      if(permissionAndroid != PermissionsAndroid.RESULTS.granted){
        const reqPer = await PermissionsAndroid.request('android.permission.WRITE_EXTERNAL_STORAGE');
        if(reqPer != 'granted'){
          return false;
        }
      }
    }
    var date=new Date();
    const { config, fs } = RNFetchBlob
    let DownloadDir = fs.dirs.DownloadDir // this is the pictures directory. You can check the available directories in the wiki.
    console.log("DownloadDir",DownloadDir);
    let options = {
      fileCache: true,
      addAndroidDownloads : {
        useDownloadManager : true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
        notification : true,
        path:  DownloadDir+"/matchmaking2022"+Math.floor(date.getTime() + date.getSeconds() / 2)+".pdf", // + "/me_"+Math.floor(date.getTime() + date.getSeconds() / 2) this is the path where your downloaded file will live in
        description : 'Downloading pdf.'
      }
    }
    config(options).fetch('GET', pdfUrl).then((res) => {
      // do some magic here
      Alert.alert("", "Download Completed.")
    });
  }
  return(
    pdfViewOpen &&
  
    <View style={{flex:1}}>

      <View style={{flex:1}}>
         
            <PDFView
              fadeInDuration={250.0}
              style={{ flex: 1, width:Dimensions.get("window").width, height:Dimensions.get("window").height-200 }}
              resource={pdfUrl}
              resourceType="url"
            />
      </View>
         
          <View style={{flex:0, flexDirection:"row", marginVertical:20, alignItems: 'center', justifyContent:"space-evenly"}}>
            <TouchableOpacity onPress={()=> {setPdfViewOpen(false); props.navigation.navigate("CallHistoryScreen");}}>
              <LinearGradient colors={["#ccc", "#ddd"]} start={{ x: 0, y: .5 }} end={{ x: 1, y: .5 }} style={{borderRadius:30}}>
                <Text style={{color:"#fff", padding:15, width:150, fontSize:16, textAlign:"center"}}>Back</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> onDownloadNow()}>
              <LinearGradient colors={["#FDCB2F", "#FB7021"]} start={{ x: 0, y: .5 }} end={{ x: 1, y: .5 }} style={{borderRadius:30}}>
                {loading && <View style={{padding:15, width:150, fontSize:16, textAlign:"center"}}><ActivityIndicator color="blue"/></View> || <Text style={{color:"#fff", padding:15, width:150, fontSize:16, textAlign:"center"}}>Download</Text>}
              </LinearGradient>
            </TouchableOpacity>
          </View>
          </View>
          ||
    <View style={{flex: 1}}>
    
    <Modal visible={isPaymentView}>

    <View style={[Platform.OS=="ios" && {marginTop:40}]}>
    <View elevation={5} style={{ width: "100%", height: 54, flexDirection: "row", alignItems: "center", justifyContent:"space-between", backgroundColor: "#fff"}}>
        <View style={{flexDirection: "row", alignItems: "center"}}>
            <TouchableOpacity onPress={() => setIsPaymentView(false)}>
                <View style={{ width: 30, height: 54, alignItems: "center", justifyContent: "center", marginLeft:10 }}>
                    <Image style={{ width: 13, height: 22 }} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/back.png`}} />
                </View>
            </TouchableOpacity>
            <Text style={{fontSize:18, marginLeft:20}}>Payment Details</Text>
        </View>
    </View>

<View style={{ paddingHorizontal: 20 }}>
<List>
                        <ListItem>
                            <Left style={{ left: 20, flex:2 }}><Text style={[MainStyles.text, { fontSize: 18 }]}>Matchmaking PDF{'\n'}Report</Text></Left>
                            <Right style={{ right: 20, flex:1}}><Text style={[MainStyles.text, { fontSize: 18 }]}><Text style={{textDecorationLine:"line-through"}}>₹449</Text> ₹49/-</Text></Right>
                        </ListItem>
                        <ListItem>
                            <Left style={{ left: 20 }}><Text style={[MainStyles.text, { fontSize: 18 }]}>Taxes</Text></Left>
                            <Right style={{ right: 20 }}><Text style={[MainStyles.text, { fontSize: 18 }]}>₹0</Text></Right>
                        </ListItem>
                        <ListItem>
                            <Left style={{ left: 20 }}><Text style={[MainStyles.text, { fontWeight: "700", fontSize: 18 }]}>Total Payable Amount</Text></Left>
                            <Right style={{ right: 20 }}><Text style={[MainStyles.text, { fontWeight: "700", fontSize: 18 }]}>₹49/-</Text></Right>
                        </ListItem>
                        
                    </List>

                    <View style={{ flexDirection:"row",flexWrap:"wrap", alignItems: "center", justifyContent:"space-evenly", marginTop:20 }}>
                            <TouchableOpacity onPress={() => _onSPSelect("card")}>
                                <View style={styles.cardItem}>
                                    <Image style={{ width: 50, height: 50 }} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/card-icons/debit.png` }} />
                                    <Text style={[MainStyles.Text, {}]}>Debit Card</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => _onSPSelect("netbanking")}>
                                <View style={styles.cardItem}>
                                    <Image style={{ width: 50, height: 50 }} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/card-icons/netb.png` }} />
                                    <Text>Net Banking</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => _onSPSelect("upi")}>
                                <View style={styles.cardItem}>
                                    <Image style={{ width: 50, height: 50 }} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/card-icons/upi.png` }} />
                                    <Text>UPI</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => _onSPSelect("paytm")}>
                                <View style={styles.cardItem}>
                                    <Image style={{ width: 50, height: 50 }} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/card-icons/paytm.png` }} />
                                    <Text>Paytm Wallet</Text>
                                </View>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={() => _onSPSelect("card")}>
                                <View style={styles.cardItem}>
                                    <Image style={{ width: 50, height: 50 }} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/card-icons/credit.png` }} />
                                    <Text>Credit Card</Text>
                                </View>
                            </TouchableOpacity> 
                        </View>

 
    
</View>
</View>
    </Modal>

    <View style={{padding:20}}>
      <View style={{alignItems: 'center', justifyContent:"center"}}>
      <Text style={{marginVertical:5, fontSize:18}}>Ensure A Successful Relationship With</Text>
      <Text style={{color:"#FB7021", fontWeight:"700", fontSize:22}}> Matchmaking 2022 Report</Text>
      <Text style={{fontSize:22}}>At Just <Text style={{textDecorationLine:"line-through", textDecorationStyle: "solid", textDecorationColor:"#000", color:"#FB7021"}}>₹449</Text> <Text style={{color:"#FB7021", fontWeight:"700"}}>₹49/-</Text></Text>
      
      <TouchableOpacity onPress={()=>props.navigation.navigate("PdfViewerScreen",{Url:`${env.AssetsBaseURL}assets/pdf/matchmaking_sample.pdf`})}>
      <View style={{borderWidth:2, borderColor:"#ddd", borderStyle:"dashed", borderRadius:1, marginTop:40, paddingHorizontal:5}}>
        <Image style={{width:100, height:141, marginVertical:10}} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/pdfIcon.png` }} />
      </View>
      </TouchableOpacity>
      <Text style={{marginBottom:40, marginTop:10, fontSize:18}}>View Sample Report</Text>

      </View>
      <View style={{alignItems:"center",marginTop:20}}>
          <TouchableOpacity onPress={()=>!loading && onSubmit()}>
              <LinearGradient colors={["#FDCB2F", "#FB7021"]} start={{ x: 0, y: .5 }} end={{ x: 1, y: .5 }} style={{borderRadius:30, width:300, marginBottom:20}}>
                  {
                    loading && <ActivityIndicator style={{padding:15}} color="#fff"/> ||
                    <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>Buy Now</Text>}
              </LinearGradient>
          </TouchableOpacity> 
       </View>
      <Text style={{marginVertical:5, fontWeight:"bold", fontSize:16}}>PDF Highlights</Text>
      <Text style={{marginVertical:2}}>● The PDF will consist of your <Text style={{fontWeight:"bold"}}>Annual Report, Matchmaking Chart 2022, Planetary Positions,</Text> and much more. </Text>
      <Text style={{marginVertical:2}}>● The PDF will be available for only 48 hours on your profile.</Text>
      {/* <Text style={{marginVertical:2}}>● After clicking on the <Text style={{fontWeight:"bold"}}>“buy now button”</Text> the amount will be deducted from your wallet balance.</Text>
      <Text style={{marginVertical:2}}>● If you lose your PDF you can download it again within <Text style={{fontWeight:"bold"}}>48 hours.</Text></Text> */}
      
    </View>
    
    <Overlay childrenWrapperStyle={{ borderRadius: 30 }} visible={showMessageBox}>
    
    <View style={{alignItems:"center", justifyContent:"center", padding:10}}>
      <Image style={{width:100, height:100, marginVertical:10}} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/downloading.png` }} />
      <Text style={{textAlign:"center", fontWeight:"700", marginVertical:5, fontSize:20}}>Its Ready!</Text>
      <Text style={{textAlign:"center", marginVertical:5}}>Your Matchmaking 2022 Report has been {'\n'}generated & is getting downloaded on your phone.</Text>
      <View style={{marginTop:20}}>
        <TouchableOpacity onPress={()=> {setShowMessageBox(false); props.navigation.replace("CallHistoryScreen");}}>
          <LinearGradient colors={["#FDCB2F", "#FB7021"]} start={{ x: 0, y: .5 }} end={{ x: 1, y: .5 }} style={{borderRadius:30}}>
            <Text style={{color:"fff", padding:15,width:250, fontSize:16, textAlign:"center"}}>Close</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
      <View style={{marginVertical:10}}>
        <TouchableOpacity onPress={()=> {setShowMessageBox(false); props.navigation.replace("CallHistoryScreen");}}>
          <Text style={{color:"blue", padding:15, fontSize:16, textAlign:"center"}}>Download Again</Text>
        </TouchableOpacity>
      </View>
      {/* <View style={{marginVertical:10}}>
        <TouchableOpacity onPress={()=> setShowMessageBox(false)}>
            <LinearGradient colors={["#ccc", "#ddd"]} start={{ x: 0, y: .5 }} end={{ x: 1, y: .5 }} style={{borderRadius:30}}>
                  <Text style={{color:"#000", width:300, padding:15, fontSize:16, textAlign:"center"}}>No</Text>
            </LinearGradient>
        </TouchableOpacity>
      </View> */}
    </View>
  </Overlay>

  <Overlay childrenWrapperStyle={{ borderRadius: 30 }} visible={showWatingMessageBox}>

    <View style={{alignItems:"center", justifyContent:"center", padding:10}}>
      <Text style={{textAlign:"center", marginVertical:5}}>Your PDF report is being Generated. It may take upto 10sec</Text>
      <View style={{marginVertical:10}}>
        <TouchableOpacity onPress={()=> setShowWatingMessageBox(false)}>
            <LinearGradient colors={["#FDCB2F", "#FB7021"]} start={{ x: 0, y: .5 }} end={{ x: 1, y: .5 }} style={{borderRadius:30}}>
                  <Text style={{color:"#fff", width:300, padding:15, fontSize:16, textAlign:"center"}}>Close</Text>
            </LinearGradient>
        </TouchableOpacity>
      </View>
       
    </View>
    
  </Overlay>
  
  
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
    slide_text:{width:"100%", height:100},
    cardItem: { width: 150, height: 80, marginTop: 10, borderWidth: 1, borderColor: "#000", borderRadius: 5, alignContent: "center", alignItems: "center", justifyContent: "center" }
});