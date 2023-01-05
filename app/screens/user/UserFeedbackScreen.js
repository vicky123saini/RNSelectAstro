import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Image, ScrollView, Linking, ActivityIndicator } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import analytics from '@react-native-firebase/analytics';
import {Toast} from 'native-base';
import MainStyles from '../../Styles';
import * as env from '../../../env';
import * as Api from '../../Api';
import * as Auth from '../../Auth';

export default class UserFeedbackScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        WrittenBy:3
    };
  }
  componentDidMount = () => {
    Auth.getProfie().then(JSON.parse)
    .then(resp=>this.setState({Name:resp.Name,MobileNo:resp.MobileNo,EmailId:resp.Emaile}))
    .catch(()=> console.error("err componentDidMount userfeedbackscreen"));
  };
  

  _submit = () =>{
    
    this.setState({loading:true});
    
    var prefixMessage="";
    if(this.props.route.params && this.props.route.params.prefixMessage){
        prefixMessage=this.props.route.params.prefixMessage;
    }

    var body = {
        ...this.state,
        Message: prefixMessage + this.state.Message
    };

    console.log("ContactusService req", body);
    Api.ContactusService(body).then(resp=>{
        console.log("ContactusService resp", resp);
        if (resp.ResponseCode == 200) {
            this.setState(null);
            alert("Your Feedback has been submitted! Our team will resolve & respond back on your registered email ID. ");
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
        <View style={{flexDirection:"row", alignItems:"center", marginBottom:20}}>
            <Text style={{flex:1}}>Not a Good Experience?​{'\n'}Tell us how we can improve</Text>
            <Image style={{ width: 50, height: 50, flex:0 }} resizeMode="cover" source={{ uri:  `${env.AssetsBaseURL}/assets/images/sad1.png` }} />
        </View>
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

        <Text style={styles.label}>Tell Us Your Views</Text>
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

        <View style={{width:"100%", alignItems:"center"}}>
            <TouchableOpacity onPress={()=>this.props.navigation.navigate("UserHomeScreen")}>
                <Text style={{color:"#000", padding:15, fontSize:16, fontWeight:"bold", textAlign:"center", textDecorationLine:"underline", alignSelf:"flex-end"}}>Later</Text>
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