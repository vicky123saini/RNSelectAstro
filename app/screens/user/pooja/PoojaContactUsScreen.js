import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Image, ScrollView, Linking, ActivityIndicator, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import {Toast} from 'native-base';
//import { Picker, DatePicker } from 'react-native-wheel-datepicker';
import { DatePicker } from '../../../controls/MyDatePicker';
import moment from 'moment';
import MainStyles from '../../../Styles';
import * as env from '../../../../env';
import * as Api from '../../../Api';
import * as Auth from '../../../Auth';

export default class PoojaContactUsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        WrittenBy:this.props.route.params!=null && this.props.route.params.WrittenBy ? this.props.route.params.WrittenBy : 1,
        //PujaDate:new Date(moment(moment().add(1,"day")).format("DD-MMM-YYYY")),
        PujaDate:new Date(),
        PujaName:this.props.route.params!=null && this.props.route.params.PujaName ? this.props.route.params.PujaName : "",
        Gemstone:this.props.route.params!=null && this.props.route.params.Gemstone ? this.props.route.params.Gemstone : "",
    };
  }
  componentDidMount = () => {
    console.log("this.props.route.params", this.props.route.params);
    Auth.getProfie().then(JSON.parse)
    .then(resp=>{
        this.setState({Name:resp.Name,MobileNo:resp.MobileNo,EmailId:resp.Emaile})
    
        switch(this.state.WrittenBy){
            case 4:{
                this.props.navigation.setOptions({title:"Puja: Know more?"});
                break;
            }
            case 5:{
                this.props.navigation.setOptions({title:"Puja: Request for Puja, today"});
                break;
            }
            case 6:{
                this.props.navigation.setOptions({title:"Puja: Post Payment inquiry"});
                break;
            }
            case 7:{
                this.props.navigation.setOptions({title:"Gemstone: Query"});
                if(resp.MobileNo && resp.Emaile){
                    this.setState({Message:"Gemstone: Query"});
                }
                break;
            }
            default:{
                this.props.navigation.setOptions({title:"Contact Us"});
            }
        }
    }).catch(()=> console.error("err getProfie poojacontactus"));

    Api.WhatsApp_Communication_NumberService("PoojaDetailScreen").then(resp=> {
        console.log("WhatsApp_Communication_NumberService resp", resp);
        if(resp.ResponseCode == 200){
          this.setState({WhatsAppNo:resp.data.MobileNo})
        }
      });
  };
  

  _submit = () =>{
    this.setState({loading:true});
    console.log("MandirContactusService req", this.state);
    var req={...this.state, PujaDate:moment(this.state.PujaDate).format("DD-MMM-YYYY")}
    Api.MandirContactusService(req).then(resp=>{
        console.log("MandirContactusService resp", resp);
        if (resp.ResponseCode == 200) {
            this.setState(null);
            
            switch(this.state.WrittenBy){
                case 4:{
                    
                    Alert.alert("", "Your query has been submitted successfully & our team will respond on the shared email shortly")
                    break;
                }
                case 5:{
                    
                    Alert.alert("", "Your request has been forwarded & our team will check availability at the temple and get back to you on call/Whatsapp within the next 2hrs");
                    break;
                }
                case 6:{
                    Alert.alert("", "Your query has been submitted successfully & our team will respond on the shared email shortly")
                    break;
                }
                case 7:{
                    Alert.alert("", "Our Support team will call you shortly")
                    break;
                }
                default:{
                    Alert.alert("", "Your query has been submitted successfully & our team will respond on the shared email shortly")
                }
            }
            this.props.navigation.goBack();
        }
        else{
            this.setState({loading:false});
            Toast.show({
              text:resp.ResponseMessage,
              type:"danger",
              duration:5000
            });
          }
    });
  }

  render() {
    return (
    <ScrollView style={{flex:1, backgroundColor:"#fff"}}>
      <View style={{padding:30}}>
          {
              this.state.WrittenBy != 4 && this.state.WrittenBy != 7 &&
         
        <TouchableOpacity onPress={()=> Linking.openURL(`whatsapp://send?text=hello&phone=${this.state.WhatsAppNo}`)}>
            <Text style={[styles.label,{marginBottom:20}]}>Please Share your puja query or whatsapp/call us on <Text style={{color:"blue", textDecorationLine:"underline"}}>{this.state.WhatsAppNo}</Text></Text>
        </TouchableOpacity>
        }
        {
            this.state.WrittenBy != 7 &&
            <>
            <Text style={styles.label}>Puja Name</Text>
            <View style={styles.textInput}>
                <TextInput style={{width:"100%", color:"#000"}} value={this.state.PujaName} onChangeText={(text)=> this.setState({PujaName:text})} placeholder="Enter puja name"/>
            </View>
            </>
        }

        <Text style={styles.label}>Phone</Text>
        <View style={styles.textInput}>
            <TextInput style={{width:"100%", color:"#000"}} value={this.state.MobileNo} onChangeText={(text)=> this.setState({MobileNo:text})} placeholder="Enter your phone number"/>
        </View>

        <Text style={styles.label}>Email (*Please reconfirm email Id)</Text>
        <View style={styles.textInput}>
            <TextInput style={{width:"100%", color:"#000"}} value={this.state.EmailId} onChangeText={(text)=> this.setState({EmailId:text})} placeholder="Enter your Email Address"/>
        </View>

        {
            this.state.WrittenBy == 7 &&
            <>
            <Text style={styles.label}>House/plot number</Text>
            <View style={styles.textInput}>
                <TextInput style={{width:"100%", color:"#000"}} value={this.state.HouseNo} onChangeText={(text)=> this.setState({HouseNo:text})} placeholder="House/plot number"/>
            </View>
            <Text style={styles.label}>Area/block/district</Text>
            <View style={styles.textInput}>
                <TextInput style={{width:"100%", color:"#000"}} value={this.state.Area} onChangeText={(text)=> this.setState({Area:text})} placeholder="Area/block/district"/>
            </View>
            <Text style={styles.label}>City/town</Text>
            <View style={styles.textInput}>
                <TextInput style={{width:"100%", color:"#000"}} value={this.state.City} onChangeText={(text)=> this.setState({City:text})} placeholder="City/town"/>
            </View>
            <Text style={styles.label}>Area Pin code</Text>
            <View style={styles.textInput}>
                <TextInput style={{width:"100%", color:"#000"}} value={this.state.PinCode} onChangeText={(text)=> this.setState({PinCode:text})} placeholder="Area Pin code"/>
            </View>
            </>
        }
{
    this.state.WrittenBy != 4 && this.state.WrittenBy != 6 && this.state.WrittenBy != 7 &&
 <>
        <Text style={styles.label}>Date</Text>
        <TouchableOpacity onPress={()=> this.setState({showDate:true})}>
            <View style={styles.textInput}>
                <Text>{this.state.PujaDate==null?"DD-MM-YYYY":moment(this.state.PujaDate).format("DD-MM-YYYY")}</Text>
                <Image style={{width:23, height:23, marginRight:20}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/calendar.png`}}/>
            </View>
        </TouchableOpacity>
      
        {
            this.state.showDate &&
             
              
            <DatePicker
            date={this.state.PujaDate} 
            minimumDate={new Date()}
            mode="date"
            onDateChange={(selectedDate)=> this.setState({PujaDate:selectedDate, showDate:false})}
            />
            // <TouchableOpacity onPress={()=>this.setState({showDate:false})}>{/*/LanguageChoiseScreen*/}
            //     <LinearGradient colors={["#7162FC", "#B542F2"]} style={{borderRadius:30, width:150, marginBottom:15, marginTop:10, alignSelf:"center"}}>
            //         <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>OK</Text>
            //     </LinearGradient>
            // </TouchableOpacity>
             
        }
        </>
        }
        
        {
        this.state.WrittenBy != 7 &&
        <>
        <Text style={styles.label}>Your Question</Text>
        <View style={[styles.textInput,{height:100}]}>
            <TextInput style={{width:"100%", color:"#000"}} multiline={true} value={this.state.Message} onChangeText={(text)=> this.setState({Message:text})} placeholder="Type in your message"/>
        </View>
        </>
        }

        <View style={{width:"100%", alignItems:"center"}}>
            <TouchableOpacity onPress={()=>this._submit()}>
                <LinearGradient colors={["#F09B39", "#ED7931"]} style={{borderRadius:30, width:150, marginBottom:20}}>
                    {
                        this.state.loading && 
                        <View style={{flex:1, height:50, justifyContent:"center"}}>
                            <ActivityIndicator color="#0000ff"/>
                        </View>
                        ||
                        <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>SUBMIT</Text>
                    }
                </LinearGradient>
            </TouchableOpacity>
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