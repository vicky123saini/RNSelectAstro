import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import {Toast} from 'native-base';
import * as env from '../../../env';
import LinearGradient from 'react-native-linear-gradient';
import * as Api from '../../Api';

export default class SigninScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      RegistrationUsing: "MobileNo"
    };
  }

  _submit = async () => {
    var req={...this.state};
    console.log("RegistrationService req", req);
    Api.RegistrationService(req).then(resp=>{
      console.log("RegistrationService resp", resp);
      if(resp.ResponseCode==200){
        this.props.navigation.replace("OTPScreen", {screen:"SigninScreen", data:req});
      }
      else{
        Toast.show({
          text:resp.ResponseMessage,
          type:"danger",
          duration:5000
      })
      }
    });
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <View style={{ flex: 5, backgroundColor: "#fff", padding: 30 }}>
          <Text style={{ marginBottom: 20 }}>Hi There,{'\n'}Sign up with {this.state.RegistrationUsing == "MobileNo" ? "phone no" : "email"}</Text>

          <View style={{ width: "100%", backgroundColor: "#F3F3F3", borderRadius: 30, flexDirection: "row", marginBottom: 20 }}>
            <View style={{ width: "60%", height:50, justifyContent: "center" }}>
              {
                this.state.RegistrationUsing == "MobileNo"?
                <TextInput style={{ width:"100%", height:50, marginLeft: 20 , color:"#000"}} value={this.state.MobileNo} onChangeText={(text)=> this.setState({MobileNo:text})} placeholder="Mobile No" />
                :
                <TextInput style={{ width:"100%", height:50, marginLeft: 20 , color:"#000"}} value={this.state.Email} onChangeText={(text)=> this.setState({Email:text})} placeholder="Email Id" />
              }
              
            </View>
            <View style={{ width: "40%", alignSelf: "flex-end", justifyContent: "center" }}>
              <TouchableOpacity onPress={() => this._submit()}>
                <LinearGradient colors={["#7162FC", "#B542F2"]} style={{ borderRadius: 30 }}>
                  <Text style={{ color: "#fff", padding: 20, fontSize: 16, textAlign: "center" }}>SIGN UP</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity onPress={() => this.setState({ RegistrationUsing: this.state.RegistrationUsing == "MobileNo" ? "Email" : "MobileNo" })}>
            <Text style={{ marginBottom: 50 }}>Or <Text style={{ textDecorationLine: "underline", color: "#656565" }}>Use {this.state.RegistrationUsing == "MobileNo" ?  "email":"phone no"} id instead.</Text></Text>
          </TouchableOpacity>

          <View style={{ flexDirection: "row" }}>
            <Text>Already on SelectAstro?</Text>
            <TouchableOpacity onPress={() => this.props.navigation.replace("LoginScreen")}>
              <Text style={{ color: "#9252F7", textDecorationLine: "underline", marginLeft: 20 }}>Log in</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{ flex: 4, padding: 30 }}>
          <TouchableOpacity>
            <View style={{ flexDirection: "row", alignItems: "center", alignContent: "space-between", backgroundColor: "#fff", borderRadius: 30, padding: 10, marginBottom: 20 }}>
              <Image style={{ width: 50, height: 50 }} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/google-logo.png` }} />
              <Text style={{ paddingLeft: 30, fontSize: 18 }}>Join with Google</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity>
            <View style={{ flexDirection: "row", alignItems: "center", alignContent: "space-between", backgroundColor: "#fff", borderRadius: 30, padding: 10, }}>
              <Image style={{ width: 50, height: 50 }} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/fb-logo.png` }} />
              <Text style={{ paddingLeft: 30, fontSize: 18 }}>Join with Google</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

