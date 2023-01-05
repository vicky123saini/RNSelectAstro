import React, { Component } from 'react';
import { View, Text, Image, Dimensions, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as env from '../../../env';

export default class LanguageChoiseScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={{flex:1}}>
        <Image style={{flex:1}} resizeMode="cover" source={{uri:`${env.AssetsBaseURL}/assets/images/bg1.png`}}/>
        <View style={{position:"absolute", flex:1, alignItems:"center", justifyContent:"flex-end", minHeight:Dimensions.get("window").height, width:Dimensions.get("window").width}}>
            
                <Text style={{color:"#fff", fontSize:18, marginBottom:20}}>Choose your Language</Text>
                
                <TouchableOpacity onPress={()=>this.props.navigation.navigate("WelcomeScreen")}>
                    <LinearGradient colors={["#FF8767", "#FF65A0"]} style={{borderRadius:30, width:220, marginBottom:20}}>
                        <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>English</Text>
                    </LinearGradient>
                </TouchableOpacity>
    
                <TouchableOpacity onPress={()=>this.props.navigation.navigate("WelcomeScreen")}>
                    <LinearGradient colors={["#7162FC", "#B542F2"]} style={{borderRadius:30, width:220, marginBottom:100}}>
                        <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>हिंदी</Text>
                    </LinearGradient>
                </TouchableOpacity>
            
        </View>
      </View>
    );
  }
}
