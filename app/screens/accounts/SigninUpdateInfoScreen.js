import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Image, ImageBackground, ScrollView, MaskedViewComponent, ActivityIndicator, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
//import DateTimePicker from '@react-native-community/datetimepicker';
//import { Picker, DatePicker } from 'react-native-wheel-datepicker';
import { DatePicker } from '../../controls/MyDatePicker';
import {Toast} from 'native-base';
import {CheckBox} from 'react-native-elements';
import moment from 'moment';
import MainStyles from '../../Styles';
import analytics from '@react-native-firebase/analytics';
import * as env from '../../../env';
import * as Api from '../../Api';
import * as Auth from '../../Auth';
import {Singular} from 'singular-react-native';
import {Autocomplete} from '../../controls/MyAutocomplete';
import Overlay from 'react-native-modal-overlay';

export default class SigninUpdateInfoScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        loading:false,
        Gender:" ",
        showDate:false,
        showTime:false,
        ...this.props.route.params.data,
        isEmailEditable:this.props.route.params.data.Emaile==null,
        NoCommunication:false
    };
  }

  componentDidMount = () => {
    analytics().logEvent("Update_Profile");
  };
  

  _submit = async()=>{
      this.setState({loading:true, updateRegReferralCodePopup:false});
    const{screen, data}=this.props.route.params;
    var req={...data, ...this.state};
    if(this.state.DateOfBirth_Date)
        req.DateOfBirth=moment(this.state.DateOfBirth_Date).format("DD-MMM-YYYY");
    if(this.state.TimeOfBirth_Date)
        req.TimeOfBirth=moment(this.state.TimeOfBirth_Date).format("HH:mm:00");

    console.log("UpdateUserDetailsService req", req);
    Api.UpdateUserDetailsService(req).then(resp=>{
      console.log("UpdateUserDetailsService resp", resp);
      if(resp.ResponseCode==200){
        Singular.setCustomUserId(resp.data.Profile.UserId.toString());
        Singular.event("Signin_Update");
        Auth.Login({ access_token: resp.data.AccessToken, token_type:resp.data.TokenType, profile:resp.data.Profile }).then(()=>this.props.navigation.replace("WelcomeScreen"))
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

  _skyp = () =>{
    this.setState({loading:true, updateRegReferralCodePopup:false});
    const{screen, data}=this.props.route.params;
    var req={...data};
    console.log("SkypeUpdateUserDetailsService req", req);
    Api.SkypeUpdateUserDetailsService(req).then(resp=>{
      console.log("SkypeUpdateUserDetailsService resp", resp);
      if(resp.ResponseCode==200){
        Singular.setCustomUserId(resp.data.Profile.UserId.toString());
        Singular.event("Signin_Skyp");
        Auth.Login({ access_token: resp.data.AccessToken, token_type:resp.data.TokenType, profile:resp.data.Profile }).then(()=>{
            this.props.navigation.replace("WelcomeScreen");
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
    const{screen, data}=this.props.route.params;

    return (
       
    <ScrollView>
         <Overlay childrenWrapperStyle={{borderRadius:30}} visible={this.state.updateRegReferralCodePopup}>
                
           
            
            <View>
              <Text style={styles.label}>Got Referral Code?</Text>
              <View style={styles.textInput}>
                  <TextInput style={{width:"100%", height:50, color:"#000"}} value={this.state.Reg_Referral_Code} onChangeText={(text)=> this.setState({Reg_Referral_Code:text})}/>
              </View>
            </View>
            
            

            <View style={{flexDirection:"row", width:"100%", marginTop:20, alignItems:"center", justifyContent:"center"}}>

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
            <TouchableOpacity onPress={()=>this._submit()}>
                <LinearGradient colors={["#FF8767", "#FF65A0"]} style={{borderRadius:30, width:150, marginBottom:20}}>
                    <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>SAVE</Text>
                </LinearGradient>
            </TouchableOpacity>
            }

            <TouchableOpacity style={{marginLeft:10}} onPress={()=>!this.state.loading && this._skyp()}>{/*/LanguageChoiseScreen*/}
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

            </View>
             
          
          
        </Overlay>

      <View style={{padding:30, backgroundColor:"#fff"}}>
        <Text style={styles.pageTitle}>Personal Details</Text>
         
        <Text style={styles.label}>Email <Text style={{color:"red"}}>*</Text></Text>
        <View style={styles.textInput}>
            <TextInput editable={this.state.isEmailEditable} style={{width:"100%", height:50, color:"#000"}} value={this.state.Emaile} onChangeText={(text)=> this.setState({Emaile:text})} placeholder="Email"/>
        </View>
            
        <Text style={styles.label}>Name <Text style={{color:"red"}}>*</Text></Text>
        <View style={styles.textInput}>
            <TextInput style={{width:"100%", height:50, color:"#000"}} value={this.state.Name} onChangeText={(text)=> this.setState({Name:text})} placeholder="Name"/>
        </View>

        <Text style={styles.label}>Gender <Text style={{fontSize:15}}>(Optional)</Text></Text>
        <View style={{flexDirection:"row", width:"100%", justifyContent:"space-between", marginBottom:15}}>
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
            <View style={[styles.textInput, {height:50}]}>
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
    //     <LinearGradient colors={["#7162FC", "#B542F2"]} style={{borderRadius:30, width:150, marginBottom:15, marginTop:10, alignSelf:"center"}}>
    //         <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>OK</Text>
    //     </LinearGradient>
    // </TouchableOpacity>
     
}

        <Text style={styles.label}>City of Birth <Text style={{fontSize:15}}>(Optional)</Text></Text>
        {/* <View style={styles.textInput}>
            <TextInput style={{width:"100%", color:"#000"}} value={this.state.PlaceOfBirth} onChangeText={(text)=> this.setState({PlaceOfBirth:text})} placeholder="Enter City/District"/>
        </View> */}
        <View style={{flex:1, marginBottom:20}}>
            <Autocomplete
                data={this.state.LocationSuggestion}
                value={this.state.PlaceOfBirth}
                onChangeText={(text) => this.onChangePlaceOfBirth(text)}
            />
        </View>

        <Text style={styles.label}>Time of Birth <Text style={{fontSize:15}}>(Optional)</Text></Text>
        
        <TouchableOpacity onPress={()=> this.setState({showTime:true})}>
            <View style={[styles.textInput, {height:50}]}>
                <Text>{this.state.TimeOfBirth_Date==null?"HH:MM":moment(this.state.TimeOfBirth_Date).format("HH:mm")}</Text>
                <Image style={{width:23, height:23, marginRight:20}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/clock.png`}}/>
            </View>
        </TouchableOpacity>
        {
            this.state.showTime &&
            // <DateTimePicker
                
            //     testID="dateTimePicker1"
            //     value={new Date()}
            //     mode={'time'}
            //     is24Hour={true}
            //     display="default"
            //     onChange={(event, selectedDate)=> this.setState({TimeOfBirth_Date:selectedDate, showTime:false})}
            //     />
            
            <DatePicker
            date={this.state.TimeOfBirth_Date} 
            mode="time"
            onDateChange={(selectedDate)=> this.setState({TimeOfBirth_Date:selectedDate, showTime:false})}
            />
            // <TouchableOpacity onPress={()=>this.setState({showTime:false})}>{/*/LanguageChoiseScreen*/}
            //     <LinearGradient colors={["#7162FC", "#B542F2"]} style={{borderRadius:30, width:150, marginBottom:15, marginTop:10, alignSelf:"center"}}>
            //         <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>OK</Text>
            //     </LinearGradient>
            // </TouchableOpacity>
            
        }

        <Text style={styles.label}>Any Referral Code? <Text style={{fontSize:15}}>(Optional)</Text></Text>
        <View style={styles.textInput}>
            <TextInput style={{width:"100%", height:50, color:"#000"}} value={this.state.Reg_Referral_Code} onChangeText={(text)=> this.setState({Reg_Referral_Code:text})} placeholder="Referral Code"/>
        </View>

        <View style={{width:"100%", flexDirection:"row", alignItems:"center"}}>
            <View style={{flex:0}}>
            <CheckBox 
            checkedIcon={<Image style={{width:20, height:20}} resizeMode="center" source={{ uri: `${env.AssetsBaseURL}/assets/images/cb2.png` }} />}
            uncheckedIcon={<Image style={{width:20, height:20}} resizeMode="center" source={{ uri: `${env.AssetsBaseURL}/assets/images/cb1.png` }} />}
            checked={this.state.NoCommunication} 
            onPress={()=> this.setState(prevState=>({NoCommunication:!prevState.NoCommunication}))}
            />
            </View>
            <View style={{flex:1}}>
                <Text style={[styles.label, {paddingLeft:0, fontSize:14, textAlign:"justify"}]}>Please check this box if you do not wish to receive information from SelectAstro about offers, new features & events through email & messages.</Text>
            </View>
        </View>

        <View style={{width:"100%", alignContent:"center", alignItems:"center", justifyContent:"center", marginTop:10}}>
        
         <View style={{flexDirection:"row", alignContent:"space-between", alignItems:"center", justifyContent:"space-between"}}>
            <TouchableOpacity onPress={()=>this.state.Reg_Referral_Code ? (!this.state.loading && this._submit()) : this.setState({updateRegReferralCodePopup:true})}>{/*/LanguageChoiseScreen*/}
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
        
            <TouchableOpacity style={{marginLeft:10}} onPress={()=>!this.state.loading && this._skyp()}>{/*/LanguageChoiseScreen*/}
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

            </View>
            
        <Text><Text style={{color:"red"}}>*</Text> Mandatory field</Text>
            {/* <TouchableOpacity onPress={()=>this.props.navigation.replace("LanguageChoiseScreen")}>
                <Text style={{padding:15, fontSize:16, textAlign:"center"}}>SKIP</Text>
            </TouchableOpacity> */}
        </View>
      </View>
      </ScrollView>
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
        marginBottom:15,
        height:50
    },
    selectButton:{flexDirection:"row", width:127, height:50, backgroundColor:"#F3F3F3", padding:5, alignContent:"center", alignItems:"center", borderRadius:30},
    selectedButton:{
        borderColor:"#FF708F",
        borderWidth:2,
        backgroundColor:"#fff"
    }
});