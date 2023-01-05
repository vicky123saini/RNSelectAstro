import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, ScrollView, Linking, ActivityIndicator, Platform } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import LinearGradient from 'react-native-linear-gradient';
import analytics from '@react-native-firebase/analytics';
import {Toast} from 'native-base';
import MainStyles from '../../Styles';
import * as env from '../../../env';
import * as Api from '../../Api';
import * as Auth from '../../Auth';
import {Singular} from 'singular-react-native';

export default class ContactUsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        WrittenBy:1
    };
  }

  componentDidMount = () => {
    analytics().logEvent("Contact_us_tab");
    Auth.getProfie().then(JSON.parse)
    .then(resp=>this.setState({Name:resp.Name,MobileNo:resp.MobileNo,EmailId:resp.Emaile}))
    .catch(()=> console.error("err componentDidMount ContactUsScreen"));
    
    Api.WhatsApp_Communication_NumberService("ContactUS").then(resp=> {
      console.log("WhatsApp_Communication_NumberService resp", resp);
      if(resp.ResponseCode == 200){
        this.setState({WhatsAppNo:resp.data.MobileNo})
      }
    });
  };
  

  _submit = () =>{
    Singular.event("ContactUsScreen_submit");
    this.setState({loading:true});
    console.log("ContactusService req", this.state);
    Api.ContactusService(this.state).then(resp=>{
        console.log("ContactusService resp", resp);
        if (resp.ResponseCode == 200) {
            this.setState(null);
            alert("Successfully Done");
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
      <KeyboardAwareScrollView
      extraScrollHeight={0} enableOnAndroid={false} keyboardShouldPersistTaps='handled' ref={ref => {this.scrollView = ref}} onContentSizeChange={() => this.scrollView.scrollToEnd({animated: true})}
      style={{flex:1, backgroundColor:"#fff"}}
    >
      <View style={{padding:30}}>
      <TouchableOpacity onPress={()=> Linking.openURL(`whatsapp://send?text=hello&phone=${this.state.WhatsAppNo}`)}>
        <Text style={[styles.label,{marginBottom:20}]}>Please Share your Query or whatsapp us on <Text style={{color:"blue", textDecorationLine:"underline"}}>{this.state.WhatsAppNo}</Text></Text>
</TouchableOpacity>
        <Text style={styles.label}>Name</Text>
        <View style={styles.textInput}>
            <TextInput style={{width:"100%", color:"#000"}} value={this.state.Name} onChangeText={(text)=> this.setState({Name:text})} placeholder="Enter your Name"/>
        </View>

        <Text style={styles.label}>Mobile</Text>
        <View style={styles.textInput}>
            <TextInput style={{width:"100%", color:"#000"}} value={this.state.MobileNo} onChangeText={(text)=> this.setState({MobileNo:text})} placeholder="Enter your mobile number"/>
        </View>

        <Text style={styles.label}>Email</Text>
        <View style={styles.textInput}>
            <TextInput style={{width:"100%", color:"#000"}} value={this.state.EmailId} onChangeText={(text)=> this.setState({EmailId:text})} placeholder="Enter your Email Address"/>
        </View>

        <Text style={styles.label}>Message</Text>
        <View style={[styles.textInput,{height:100}]}>
            <TextInput style={{width:"100%", color:"#000"}} multiline={true} value={this.state.Message} onChangeText={(text)=> this.setState({Message:text})} placeholder="Type in your message"/>
            
        </View>

        <View style={{width:"100%", alignItems:"center"}}>
            <TouchableOpacity onPress={()=>this._submit()}>
                <LinearGradient colors={["#FF8767", "#FF65A0"]} style={{borderRadius:30, width:150, marginBottom:20}}>
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
      </KeyboardAwareScrollView>
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