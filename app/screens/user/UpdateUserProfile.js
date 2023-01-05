import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Image, ImageBackground, ScrollView, MaskedViewComponent, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import analytics from '@react-native-firebase/analytics';
import LinearGradient from 'react-native-linear-gradient';
//import DateTimePicker from '@react-native-community/datetimepicker';
//import { Picker, DatePicker } from 'react-native-wheel-datepicker';
import { DatePicker } from '../../controls/MyDatePicker';
import {Toast} from 'native-base';
import moment from 'moment';
import MainStyles from '../../Styles';
import * as env from '../../../env';
import * as Api from '../../Api';
import * as Auth from '../../Auth';
import {Singular} from 'singular-react-native';
import {Autocomplete} from '../../controls/MyAutocomplete';
import Overlay from 'react-native-modal-overlay';
import { SafeAreaView } from 'react-native-safe-area-context';

export default class UpdateUserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
        Gender:" ",
        showDate:false,
        showTime:false,
        step:1,
        loading:true
    };
  }

  componentDidMount = () => {
    analytics().logEvent("Edit_Profile");
    console.log("GetEnduserProfileService req")
    Api.GetEnduserProfileService().then(resp => {
        console.log("GetEnduserProfileService resp", JSON.stringify(resp));
        if (resp.ResponseCode == 200) {
            
            var model= {
                MobileNo:resp.data.MobileNo,
                Emaile:resp.data.Emaile??"",
                Name:resp.data.Name, 
                Gender:resp.data.Gender, 
                //DateOfBirth_Date:moment(resp.data.DateOfBirth).format("DD-MMM-YYYY"),
                
                PlaceOfBirth:resp.data.PlaceOfBirth,
            };
            if(resp.data.DateOfBirth){
                model.DateOfBirth_Date=new Date(resp.data.DateOfBirth);
            }
            if(resp.data.TimeOfBirth){
                try{
                    //model.TimeOfBirth_Date=moment(resp.data.TimeOfBirth, "HH:mm:00").format();
                    var tdate=moment(resp.data.TimeOfBirth, "HH:mm:00").format();
                    model.TimeOfBirth_Date=new Date(tdate);
                }
                catch{}
            }
            this.setState({...model, emailIsEditable:resp.data.Emaile==null, loading:false});
            //this.setState();
        }
    });
  };
  

  

  _submit = async()=>{
    Singular.event("UpdateUserProfile_submit");
      this.setState({loading:true});
    var req={...this.state};
    if(this.state.DateOfBirth_Date)
        req.DateOfBirth=moment(this.state.DateOfBirth_Date).format("DD-MMM-YYYY");
    if(this.state.TimeOfBirth_Date)
        req.TimeOfBirth=moment(this.state.TimeOfBirth_Date).format("HH:mm:00");
    req.isUpdating=true;
    req.RegistrationUsing="Emaile";

    console.log("UpdateUserDetailsService req", req);
    Api.UpdateUserDetailsService(req).then(resp=>{
      console.log("UpdateUserDetailsService resp", resp);
      if(resp.ResponseCode==200){
        Auth.Login({ access_token: resp.data.AccessToken, token_type:resp.data.TokenType, profile:resp.data.Profile }).then(()=>{
            this.props.navigation.navigate("UserProfile");
        })
      }
      else{
        this.setState({loading:false}, ()=>
            Toast.show({
                text:resp.ResponseMessage,
                type:"danger",
                duration:5000
            })
        );
      }
    });
  }

  _skip = () =>{
    Singular.event("UpdateUserProfile_skip");
      const{initCallIfProfileUpdateSkip}=this.props.route.params??{};
      if(initCallIfProfileUpdateSkip) {
        this.props.navigation.goBack();
        initCallIfProfileUpdateSkip();
      }
      else{
          this.props.navigation.navigate("UserHomeScreen", { screen: 'HomeScreen' })
      }
      
  }

  
  onClose = () =>{
    this.setState({updateMoibleNoPopup:false});
  }

  mobileNoUpdateSubmit = () =>{
    var req = {MobileNo:this.state.MobileNo, OTP: this.state.OTP}
    console.log("UpdateMobileNoService req", req);
    Api.UpdateMobileNoService(req)
    .then(resp=>{
      console.log("UpdateMobileNoService resp", resp);
      if(resp.ResponseCode==200){
        if(this.state.step==1){
          this.setState({otpViewShow:true, step:2});
        }
        else{
          Auth.UpdateMobileno(this.state.MobileNo).then(()=>{
            alert("Mobile no updated successfully!");
            //this.onSubmit();
            this.setState({updateMoibleNoPopup:false});
          });
        }
      }
      else{ 
        Alert.alert("", resp.ResponseMessage);
      }
    })
  }

  onChangePlaceOfBirth = (text) => {
    this.setState({PlaceOfBirth:text});
  setTimeout(() => {
      console.log(this.state.PlaceOfBirth)
      // Send Axios request here
      if(this.state.PlaceOfBirth!=null && this.state.PlaceOfBirth.length>0){
        Api.GetLocationSuggestionService(this.state.PlaceOfBirth).then(resp=>{
          console.log("GetLocationSuggestionService resp", resp);
          if(resp.ResponseCode==200){
              this.setState({...this.state, LocationSuggestion:resp.data});
          }
        });
      }
    }, 3000)
}

  render() {
    return (
       this.state.loading && <ActivityIndicator color="blue"/> ||
       <SafeAreaView style={{flex:1, backgroundColor:"#fff"}}>
          <Overlay childrenWrapperStyle={{borderRadius:30}} visible={this.state.updateMoibleNoPopup} onClose={this.onClose} closeOnTouchOutside>
      <ImageBackground style={{width:"100%", height:250}} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/bg-popup.png` }}>
          <View style={{width:"100%"}}>
            <Text style={[styles.pageTitle, {width:"100%", textAlign:"center"}]}>Update your mobile no</Text>
            {
              this.state.otpViewShow && 
              <View>
                <Text style={styles.label}>OTP</Text>
                <View style={styles.textInput}>
                    <TextInput style={{width:"100%", height:50, color:"#000"}} value={this.state.OTP} onChangeText={(text)=> this.setState({OTP:text})} placeholder="OTP"/>
                </View>
              </View>
            ||
            <View>
              <Text style={styles.label}>Mobile No</Text>
              <View style={styles.textInput}>
                  <TextInput style={{width:"100%", height:50, color:"#000"}} value={this.state.MobileNo} onChangeText={(text)=> this.setState({MobileNo:text})} placeholder="MobileNo"/>
              </View>
            </View>
            }
            

            <View style={{width:"100%", marginTop:20, alignItems:"center", alignContent:"center", justifyContent:"center"}}>

            {
            this.state.loading ?
            <TouchableOpacity>
                <LinearGradient colors={["#FF8767", "#FF65A0"]} style={{borderRadius:30, width:150, marginBottom:20}}>
                    <View style={{padding:15}}>
                    <ActivityIndicator color="#0000ff"/>
                    </View>
                </LinearGradient>
            </TouchableOpacity>
            :
            <TouchableOpacity onPress={()=>this.mobileNoUpdateSubmit()}>
                <LinearGradient colors={["#FF8767", "#FF65A0"]} style={{borderRadius:30, width:150, marginBottom:20}}>
                    <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>SAVE</Text>
                </LinearGradient>
            </TouchableOpacity>
        }

            </View>

          </View>
          </ImageBackground>
        </Overlay>
    <ScrollView style={{flex:1}}>
       

      <View style={{paddingHorizontal:30, paddingBottom:30}}>
        <Text style={styles.pageTitle}>Personal Details</Text>

        <Text style={styles.label}>Mobile No <Text style={{color:"red"}}>*</Text></Text>
        {
            this.state.MobileNo &&
            <View style={styles.textInput}>
                <TextInput style={{width:"100%", height:50, color:"#000"}} value={this.state.MobileNo} editable={false}/>
            </View>
            ||
            <View>
                <TouchableOpacity style={{marginLeft:10}} onPress={()=>this.setState({updateMoibleNoPopup:true})}>{/*/LanguageChoiseScreen*/}
                <LinearGradient colors={["#d5d5d5", "#d5d5d5"]} style={{borderRadius:30, width:"100%", marginBottom:15}}>
                    {
                        this.state.loading ?
                        <View style={{padding:15}}>
                            <ActivityIndicator color="#0000ff"/>
                            </View>
                            :
                        <Text style={{color:"#000",padding:15, fontSize:16, textAlign:"center"}}>Update Mobile No</Text>
                    }
                </LinearGradient>
            </TouchableOpacity>
            </View>
        }
        

        <Text style={styles.label}>Email <Text style={{color:"red"}}>*</Text></Text>
        <View style={styles.textInput}>
            <TextInput style={{width:"100%", height:50, color:"#000"}} value={this.state.Emaile} editable={this.state.emailIsEditable} onChangeText={(text)=> this.setState({Emaile:text})} placeholder="Email"/>
        </View>

        <Text style={styles.label}>Name <Text style={{color:"red"}}>*</Text></Text>
        <View style={styles.textInput}>
            <TextInput style={{width:"100%", height:50, color:"#000"}} value={this.state.Name} onChangeText={(text)=> this.setState({Name:text})} placeholder="Name"/>
        </View>

        <Text style={styles.label}>Gender <Text style={{fontSize:15}}>(Optional)</Text></Text>
        <View style={{flexDirection:"row", width:"100%", justifyContent:"space-between", marginBottom:20}}>
            <TouchableOpacity onPress={()=> this.setState({Gender:"Male"})}>
                <View style={[styles.selectButton, this.state.Gender=="Male" && styles.selectedButton]}>
                    <Image style={{width:22, height:33, marginLeft:22}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/man.png`}}/>
                    <Text style={[MainStyles.text, {marginLeft:16}]}>Male</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=> this.setState({Gender:"Female"})}>
                <View style={[styles.selectButton, this.state.Gender=="Female" && styles.selectedButton]}>
                    <Image style={{width:22, height:33, marginLeft:22}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/woman.png`}}/>
                    <Text style={[MainStyles.text, {marginLeft:16}]}>Female</Text>
                </View>
            </TouchableOpacity>
        </View>

        <Text style={styles.label}>Date of Birth <Text style={{color:"red"}}>*</Text></Text> 
        <TouchableOpacity onPress={()=> this.setState({showDate:true})}>
            <View style={[styles.textInput,{height:50}]}>
                <Text>{this.state.DateOfBirth_Date==null?"DD-MM-YYYY":moment(this.state.DateOfBirth_Date).format("DD-MM-YYYY")}</Text>
                <Image style={{width:23, height:23, marginRight:20}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/calendar.png`}}/>
            </View>
        </TouchableOpacity>
        {
    this.state.showDate &&
    // <DateTimePicker
        
    //       testID="dateTimePicker"
    //       value={new Date()}
    //       mode={'date'}
    //       is24Hour={true}
    //       display="default"
    //       onChange={(event, selectedDate)=> this.setState({DateOfBirth_Date:selectedDate, showDate:false})}
    //     />
     
    <DatePicker
    date={this.state.DateOfBirth_Date} 
    minimumDate={new Date(1921,1,1)}

    maximumDate={new Date()} 
    mode="date"
    onDateChange={(selectedDate)=> this.setState({DateOfBirth_Date:selectedDate, showDate:false})}
    />
    // <TouchableOpacity onPress={()=>this.setState({showDate:false})}>{/*/LanguageChoiseScreen*/}
    //     <LinearGradient colors={["#7162FC", "#B542F2"]} style={{borderRadius:30, width:150, marginBottom:20, marginTop:10, alignSelf:"center"}}>
    //         <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>OK</Text>
    //     </LinearGradient>
    // </TouchableOpacity>
     
}

        <Text style={styles.label}>City of Birth <Text style={{fontSize:15}}>(Optional)</Text></Text>
        {/* <View style={styles.textInput}>
            <TextInput style={{width:"100%", height:50, color:"#000"}} value={this.state.PlaceOfBirth} onChangeText={(text)=> this.setState({PlaceOfBirth:text})} placeholder="Enter City/District"/>
        </View> */}
        <View style={{flex:1, marginBottom:20}}>
            <Autocomplete
                data={this.state.LocationSuggestion}
                value={this.state.PlaceOfBirth??""}
                onChangeText={(text) => this.onChangePlaceOfBirth(text)}
            />
        </View>

        <Text style={styles.label}>Time of Birth <Text style={{fontSize:15}}>(Optional)</Text></Text>
        
        <TouchableOpacity onPress={()=> this.setState({showTime:true})}>
            <View style={[styles.textInput,{height:50}]}>
                <Text>{this.state.TimeOfBirth_Date==null?"HH:MM":moment(this.state.TimeOfBirth_Date).format("HH:mm")}</Text>
                <Image style={{width:23, height:23, marginRight:20}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/clock.png`}}/>
            </View>
        </TouchableOpacity>
        {
            this.state.showTime &&
            
            
            <DatePicker
            date={this.state.TimeOfBirth_Date} 
            mode="time"
            onDateChange={(selectedDate)=> this.setState({TimeOfBirth_Date:selectedDate, showTime:false})}
            />
            // <TouchableOpacity onPress={()=>this.setState({showTime:false})}>{/*/LanguageChoiseScreen*/}
            //     <LinearGradient colors={["#7162FC", "#B542F2"]} style={{borderRadius:30, width:150, marginBottom:20, marginTop:10, alignSelf:"center"}}>
            //         <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>OK</Text>
            //     </LinearGradient>
            // </TouchableOpacity>
             
        }

        <View style={{width:"100%", alignContent:"center", alignItems:"center", justifyContent:"center"}}>
        {/*  
this.state.loading ?
            <TouchableOpacity>
                <LinearGradient colors={["#FF8767", "#FF65A0"]} style={{borderRadius:30, width:150, marginBottom:20}}>
                    <View style={{padding:15}}>
                    <ActivityIndicator color="#0000ff"/>
                    </View>
                </LinearGradient>
            </TouchableOpacity>
            :
            <TouchableOpacity onPress={()=>this._submit()}>
                <LinearGradient colors={["#FF8767", "#FF65A0"]} style={{borderRadius:30, width:150, marginBottom:20}}>
                    <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>SAVE</Text>
                </LinearGradient>
            </TouchableOpacity>
         */}

        <View style={{flexDirection:"row", alignContent:"space-between", alignItems:"center", justifyContent:"space-between"}}>
            <TouchableOpacity onPress={()=>!this.state.loading && this._submit()}>{/*/LanguageChoiseScreen*/}
                <LinearGradient colors={["#FF8767", "#FF65A0"]} style={{borderRadius:30, width:150, marginBottom:15}}>
                    {
                        this.state.loading ?
                        <View style={{padding:15}}>
                            <ActivityIndicator color="#0000ff"/>
                            </View>
                            :
                        <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>SAVE</Text>
                    }
                </LinearGradient>
            </TouchableOpacity>
        {
            !this.state.Name &&
        
            <TouchableOpacity style={{marginLeft:10}} onPress={()=>!this.state.loading && this._skip()}>{/*/LanguageChoiseScreen*/}
                <LinearGradient colors={["#989898", "#686868"]} style={{borderRadius:30, width:150, marginBottom:15}}>
                    {
                        this.state.loading ?
                        <View style={{padding:15}}>
                            <ActivityIndicator color="#0000ff"/>
                            </View>
                            :
                        <Text style={{color:"#fff",padding:15, fontSize:16, textAlign:"center"}}>SKIP</Text>
                    }
                </LinearGradient>
            </TouchableOpacity>
        }
            </View>
         
         <Text><Text style={{color:"red"}}>*</Text> Mandatory field</Text>

            {/* <TouchableOpacity onPress={()=>this.props.navigation.navigate("LanguageChoiseScreen")}>
                <Text style={{padding:15, fontSize:16, textAlign:"center"}}>SKIP</Text>
            </TouchableOpacity> */}
        </View>
      </View>
      </ScrollView>
      </SafeAreaView>
    );
  }
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
    }
});