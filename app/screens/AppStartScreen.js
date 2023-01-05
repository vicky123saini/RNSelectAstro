import React, { Component, useEffect, useState } from 'react';
import { StyleSheet, View, Text, Dimensions, Image, TouchableOpacity, ActivityIndicator, Platform } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import analytics from '@react-native-firebase/analytics';
import * as env from '../../env';
import * as Auth from '../Auth';
import * as Api from '../Api';
import {Singular} from 'singular-react-native';

export default class AppStartScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentScreenIndex:0
    };
  }

  componentDidMount = ()=>{
    this._unsubscribe1 = this.props.navigation.addListener('focus', () => {    
      this.binddata();
    });

    this._unsubscribe2 = this.props.navigation.addListener('blur', () => {
      clearTimeout(this._timeout);
      this._timeout=null;
    });
  }
  
  componentWillUnmount = () => {
    clearTimeout(this._timeout);
    this._unsubscribe1();
    this._unsubscribe2();
  };

  binddata = async() => {
    const accessToken=await Auth.Access_Token();

    if(accessToken){
      const profile = await Auth.getProfie().then(profile=> JSON.parse(profile)).catch(()=> console.error("err AppStart binddata"));
      Singular.setCustomUserId(profile.UserId.toString());
      Singular.event("AppStart_Login");

      if(profile.UserType==Auth.UserType.ENDUSER)
        this.props.navigation.replace("UserHomeScreen");
      else if(profile.UserType==Auth.UserType.ASTROLOGER)
        this.props.navigation.replace("ExpertHomeScreen");
      else if(profile.UserType==Auth.UserType.MANDIR_ADMIN || profile.UserType==Auth.UserType.MANDIR_SUBADMIN)
        this.props.navigation.replace("MandirHomeScreen");
      else if(profile.UserType==Auth.UserType.Vendor)
        this.props.navigation.replace("ChaiWalaHomeScreen"); 
    }

    this._timeout=setTimeout(() => {
      this.props.navigation.navigate("LoginScreen");
    }, 5000);
  }

  
  
  // onsubmit =(index)=>{
  //   console.log(index)
  //   if(index==3)this.props.navigation.navigate("LoginScreen");
  //   this.setState({currentScreenIndex:index});
  // }

  render() {
    return (
      <WelcomeScreen onPress={()=> this.props.navigation.navigate("LoginScreen")}/>
      //<OldScreen/>
      // this.state.currentScreenIndex==0 && <Screen1 onPress={(index)=> this.onsubmit(index)}/> ||
      // this.state.currentScreenIndex==1 && <Screen2 onPress={(index)=> this.onsubmit(index)}/> ||
      // this.state.currentScreenIndex==2 && <Screen3 onPress={(index)=> this.onsubmit(index)}/>
    );
  }
}

const WelcomeScreen = (props) => {
  useEffect(()=>{
    analytics().logEvent("Welcome_Screen_1");
  },[])
  return(
    <TouchableOpacity style={{flex:1}} onPress={() => props.onPress()}>
      <Image style={{flex:1, width:"100%"}} resizeMode="cover" source={{uri:`${env.AssetsBaseURL}/assets/images/welcome-screen-${Platform.OS}.jpeg`}}/>
    </TouchableOpacity>
  )
}

const Screen1 = (props) => {
  useEffect(()=>{
    analytics().logEvent("Welcome_Screen_1");
  },[])
  return(
    <TouchableOpacity style={{flex:1}} onPress={() => props.onPress(1)}>
      <Image style={{flex:1, width:"100%"}} resizeMode="cover" source={{uri:`${env.AssetsBaseURL}/assets/images/appStart/start3.png`}}/>
    </TouchableOpacity>
  )
}

const Screen2 = (props) => {
  useEffect(()=>{
    analytics().logEvent("Welcome_Screen_2");
  },[])
  return(
    <TouchableOpacity style={{flex:1}} onPress={() => props.onPress(2)}>
      <Image style={{flex:1, width:"100%"}} resizeMode="cover" source={{uri:`${env.AssetsBaseURL}/assets/images/appStart/start2.png`}}/>
    </TouchableOpacity>
  )
}
const Screen3 = (props) => {
  useEffect(()=>{
    analytics().logEvent("Welcome_Screen_3");
  },[])
  return(
    <TouchableOpacity style={{flex:1}} onPress={() => props.onPress(3)}>
      <Image style={{flex:1, width:"100%"}} resizeMode="cover" source={{uri:`${env.AssetsBaseURL}/assets/images/appStart/start1.png`}}/>
    </TouchableOpacity>
  )
}

const OldScreen = () => {
  const[APP_SPLASH_SCREEN_TEXT, setAPP_SPLASH_SCREEN_TEXT]=useState(null)
  useEffect(()=>{
    Api.GetAppSettingByKetService(Auth.AppSettingKey.APP_SPLASH_SCREEN_TEXT).then(resp=>{
      setAPP_SPLASH_SCREEN_TEXT(resp.data)
    });
  },[])
  return(
    <View style={styles.container}>
        <LinearGradient
          colors={['#7B74FB', '#C43EF8', '#FE73AD' ]}
          style={styles.linearGradient}
        >
        <View style={{flex:3, overflow:"hidden"}}>
          <Image style={{width:460,height:460, top:-100}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/start-background.png`}}/>
        </View>

        <View style={{flex:1}}>
          {
            APP_SPLASH_SCREEN_TEXT && <Text style={styles.sliderText}>{APP_SPLASH_SCREEN_TEXT}</Text> 
            ||
            <ActivityIndicator color="#0000ff"/>
          }
          
          </View>

          {/* <View style={{flex:1}}>
            <TouchableOpacity onPress={()=> this.props.navigation.navigate("LoginScreen")}>
                  <Image style={{width:80,height:80}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/arrow-right.png`}}/>
            </TouchableOpacity>
          </View> */}
        </LinearGradient>
      </View>
  )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    linearGradient: {
      flex:1,
      alignItems: 'center',
      justifyContent: 'center',
      height: Dimensions.get("window").height,
      width: Dimensions.get("window").width,
    },
    sliderText:{
        color:"#fff",
        fontSize:18,
        padding:30,
        fontFamily:"Roboto",
        textAlign:"center"
    }
  })