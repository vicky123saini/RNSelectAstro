import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, ScrollView, SafeAreaView, ActivityIndicator, Dimensions, TouchableOpacity, Alert, PermissionsAndroid, Platform } from 'react-native';
import {Picker} from '../../../controls/MyPicker';
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
import * as PdfControls from './Controls';
import moment from 'moment';
import { WebView } from 'react-native-webview';
import {Autocomplete} from '../../../controls/MyAutocomplete';
import {Singular} from 'singular-react-native';
import Overlay from 'react-native-modal-overlay';
import RNFetchBlob from 'rn-fetch-blob'
import PDFView from 'react-native-view-pdf';

export default class BasicHoroscopePDFScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      TabIndex:props.route.params && props.route.params.TabIndex ? props.route.params.TabIndex:0,
      data:props.route.params && props.route.params.data,
    };
  } 

  componentDidMount = () => {
    analytics().logEvent("Kundli_PDF");
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
                <Text style={[MainStyles.text,{borderRadius:10, paddingHorizontal:20, paddingVertical:3}, this.state.TabIndex==0 ? { color:"#fff" }:{color:"#000"}]}>Your Profile</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> {this.onTabChange(1)}}>
              <LinearGradient colors={this.state.TabIndex==1 ? ["#FC7C37", "#FC7C37"]:["#fff", "#fff"]} style={[{ borderRadius: 30, marginLeft: 10 }]}>
                <Text style={[MainStyles.text,{borderRadius:10, paddingHorizontal:20, paddingVertical:3}, this.state.TabIndex==1 ? { color:"#fff" }:{color:"#000"}]}>New Profile</Text>
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
    rdata=JSON.parse(JSON.stringify({...props.profile, DateOfBirth:moment(props.profile.DateOfBirth, "DD/MMM/YYYY").format(),TimeOfBirth:moment(props.profile.TimeOfBirth, "HH:mm:00").format(), PlaceOfBirthSelected:true}));
  }
  catch{
    console.error("err EnterNewDetails basicHoroscrope");
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
    console.log("onChange", state.PlaceOfBirth);
    setState({...state, PlaceOfBirth:keyworkds});
  }


  const onSubmit = () => {
    if(state.Name==null || state.Name==""){
      alert("Name is required");
      return;
    }
    if(state.DateOfBirth==null || state.DateOfBirth==""){
      alert("Date Of Birth is required");
      return;
    }
    if(state.TimeOfBirth==null || state.TimeOfBirth==""){
      alert("Time Of Birth is required");
      return;
    }
    if(state.PlaceOfBirth==null || state.PlaceOfBirth==""){
      alert("City of Birth is required");
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
    //console.log("state", state);
    //console.log("req", req);
    props.navigation.push('BasicHoroscopePDFScreen', {TabIndex:2, data:req});
     
  }
  return(
    
    <View style={{padding:30}}>
       
      <Text style={styles.label}>Name <Text style={{color:"red"}}>*</Text></Text>
      <View style={styles.textInput}>
          <TextInput style={{width:"100%", color:"#000"}} value={state.Name} onChangeText={(text)=> setState({...state, Name:text})} placeholder="Name"/>
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
          
         
      }


{/* <TouchableOpacity onPress={()=>setState({...state, showTime:false})}>
              <LinearGradient colors={["#7162FC", "#B542F2"]} style={{borderRadius:30, width:150, marginBottom:15, marginTop:10, alignSelf:"center"}}>
                  <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>OK</Text>
              </LinearGradient>
          </TouchableOpacity> */}

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
    props.navigation.push('BasicHoroscopePDFScreen', {TabIndex:2, data:user});
  }

  return(
    <View style={{flex:1, backgroundColor:"#fff"}}>
      <View style={{flexDirection:"row", alignContent:"center", justifyContent:"space-evenly", marginTop:50}}>
        <View style={{alignItems:"center"}}>
            {/* <Image style={{width:22, height:33}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/man.png`}}/> */}
            <View style={{backgroundColor:"#EFEFEF", borderRadius:20, paddingLeft:10}}>
            
              <Picker style={{ width: 200 }} dropdownIconColor="black" selectedValue={user} onValueChange = {(selectedItem)=> setUser(selectedItem)}>
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
      <View style={{alignItems:"center",paddingTop:20}}>
          {
            user &&
            <TouchableOpacity onPress={()=> onSubmit()}>
              <LinearGradient colors={["#7162FC", "#B542F2"]} style={{borderRadius:30, width:300, marginBottom:20}}>
                  <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>Submit</Text>
              </LinearGradient>
          </TouchableOpacity>
          ||
          <LinearGradient colors={["#d5d5d5", "#dcdcdc"]} style={{borderRadius:30, width:300, marginBottom:20}}>
              <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>Submit</Text>
          </LinearGradient>
          }
       </View>
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
  const[showMessageBox, setShowMessageBox]=useState(false)
  const[loading, setLoading]=useState(false);
  const[showWatingMessageBox, setShowWatingMessageBox]=useState(false)
  const[pdfUrl, setPdfUrl]=useState();
  const[pdfViewOpen, setPdfViewOpen]=useState(false);

  useEffect(()=>{
console.log("pdfUrl", pdfUrl);
  },[])

  const onSubmit = () => {
    console.log("data", data);
    setLoading(true);
    setShowWatingMessageBox(true);
    var req={
      ServiceType:MyExtension.DownloadPDF_ServiceType.HOROSCOPE_BASIC,
      Profile1_Name:data.Name,
      Profile1_Gender:data.Gender,
      Profile1_DateOfBirth:moment(data.DateOfBirth,["DD/MM/YYYY", "DD/MMM/YYYY"]).format("DD/MMM/YYYY"),
      Profile1_TimeOfBirth:data.TimeOfBirth,
      Profile1_PlaceOfBirth:data.PlaceOfBirth
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
        path:  DownloadDir+"/kundali2022"+Math.floor(date.getTime() + date.getSeconds() / 2)+".pdf", // + "/me_"+Math.floor(date.getTime() + date.getSeconds() / 2) this is the path where your downloaded file will live in
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
    
    
    
        
  

    <View style={{padding:20}}>
      <View style={{alignItems: 'center', justifyContent:"center"}}>
      <Text style={{marginVertical:5, fontSize:18}}>Read Your Horoscope Chart With</Text>
      <Text style={{color:"#FB7021", fontWeight:"700", fontSize:22}}>2022 Kundali Report</Text>
      {/* <Text style={{fontSize:22}}>At Just <Text style={{color:"#FB7021", fontWeight:"700"}}>FREE!</Text></Text> */}
      
      {/* <TouchableOpacity onPress={()=>props.navigation.navigate("PdfViewerScreen",{Url:`${env.AssetsBaseURL}assets/pdf/mini_horoscope_sample.pdf`})}>
      <View style={{borderWidth:2, borderColor:"#ddd", borderStyle:"dashed", borderRadius:1, marginTop:40, paddingHorizontal:5}}>
        <Image style={{width:100, height:141, marginVertical:10}} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/pdfIcon.png` }} />
      </View>
      </TouchableOpacity> 
      <Text style={{marginBottom:40, marginTop:10, fontSize:18}}>View Sample Report</Text>*/}
      <Text style={{marginBottom:0, marginTop:60, fontSize:18}}>Absolutely</Text>
      <Text style={{marginBottom:60, marginTop:0, fontSize:30, fontWeight:"bold", color:"green"}}>FREE</Text>
      </View>
      <View style={{alignItems:"center",marginTop:20}}>
          <TouchableOpacity onPress={()=>!loading && onSubmit()}>
              <LinearGradient colors={["#FDCB2F", "#FB7021"]} start={{ x: 0, y: .5 }} end={{ x: 1, y: .5 }} style={{borderRadius:30, width:300, marginBottom:20}}>
                  {
                    loading && <ActivityIndicator style={{padding:15}} color="#fff"/> ||
                    <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>Download Now</Text>}
              </LinearGradient>
          </TouchableOpacity> 
       </View>
      <Text style={{marginVertical:5, fontWeight:"bold", fontSize:16}}>PDF Highlights</Text>
      <Text style={{marginVertical:2}}>● The PDF will consist of your <Text style={{fontWeight:"bold"}}>Annual Report, Horoscope Chart 2022, Planetary Positions,</Text> and much more. </Text>
      <Text style={{marginVertical:2}}>● The PDF will be available for only 48 hours on your profile.</Text>
      {/* <Text style={{marginVertical:2}}>● After clicking on the <Text style={{fontWeight:"bold"}}>“buy now button”</Text> the amount will be deducted from your wallet balance.</Text>
      <Text style={{marginVertical:2}}>● If you lose your PDF you can download it again within <Text style={{fontWeight:"bold"}}>48 hours.</Text></Text> */}
      
    </View>
     
    <Overlay childrenWrapperStyle={{ borderRadius: 30 }} visible={showMessageBox}>
    
        <View style={{alignItems:"center", justifyContent:"center", padding:10}}>
          <Image style={{width:100, height:100, marginVertical:10}} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/downloading.png` }} />
          <Text style={{textAlign:"center", fontWeight:"700", marginVertical:5, fontSize:20}}>Its Ready!</Text>
          <Text style={{textAlign:"center", marginVertical:5}}>Your 2022 Kundali Report has been {'\n'}generated & is getting downloaded on your phone.</Text>
          <View style={{marginTop:20}}>
            <TouchableOpacity onPress={()=> {setShowMessageBox(false); props.navigation.navigate("CallHistoryScreen");}}>
              <LinearGradient colors={["#FDCB2F", "#FB7021"]} start={{ x: 0, y: .5 }} end={{ x: 1, y: .5 }} style={{borderRadius:30}}>
                <Text style={{color:"#fff", padding:15,width:250, fontSize:16, textAlign:"center"}}>Close</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <View style={{marginVertical:10}}>
            <TouchableOpacity onPress={()=> {setShowMessageBox(false); props.navigation.navigate("CallHistoryScreen");}}>
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
      
      {/* {
        pdfViewOpen && pdfUrl!=null && pdfUrl!="" && <PdfControls.ViewPdfWithDownload url={pdfUrl} onDownloadNow={onDownloadNow} onClose={setPdfViewOpen(false)}/>
      } */}

 
 
 
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