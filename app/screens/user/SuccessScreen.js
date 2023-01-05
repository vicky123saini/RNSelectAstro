import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import analytics from '@react-native-firebase/analytics';
import {Singular} from 'singular-react-native';

export default class SuccessScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount = () => {
    analytics().logEvent("Recharge_Success_page");
    this._timeout=setTimeout(() => {
      this.props.navigation.replace("ExpertListScreen")
    }, 3000);
  };
  
  componentWillUnmount = () =>{
    clearTimeout(this._timeout);
  }

  render() {
    return (
      <LinearGradient colors={["#157A20", "#20962C"]} style={{flex:1, alignContent:"center", alignItems:"center", justifyContent:"center"}}>
      
        <Text style={{fontWeight:"bold", color:"#fff", fontSize:24}}> Transaction Successfull </Text>
        {/* <TouchableOpacity onPress={() => this.props.navigation.replace("ExpertListScreen")}>
          <Text style={{width:"100%", padding:20, textAlign:"center", color:"#fff", fontSize:18, fontWeight:"bold"}}>Go To Home</Text>
        </TouchableOpacity> */}
       
      </LinearGradient>
    );
  }
}
