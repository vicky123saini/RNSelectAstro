import React, { Component } from 'react';
import { View, Text, TouchableOpacity, SafeAreaView } from 'react-native';

import YourHoroscopeScreen from './YourHoroscopeScreen';
import OtherHoroscopeScreen from './OtherHoroscopeScreen';
import AllHoroscopeScreen from './AllHoroscopeScreen';
import LinearGradient from 'react-native-linear-gradient';
import {Singular} from 'singular-react-native';
import MainStyles from '../../../Styles';
import * as Auth from '../../../Auth';
import * as Api from '../../../Api';
import * as UserControls from '../Controls';

export default class HoroscopeScreen extends Component {
  constructor(props) {
    super(props);
     
    this.state = {
      TabIndex:-1
    };
  }

  // componentDidMount = async() =>{
  //   console.log("GetEnduserProfileService req")
  //   Api.GetEnduserProfileService().then(resp => {
  //       console.log("GetEnduserProfileService resp", JSON.stringify(resp));
  //       if (resp.ResponseCode == 200) {
  //         if(resp.data.DateOfBirth==null || resp.data.DateOfBirth==""){
  //           this.props.navigation.navigate("UpdateUserProfile")
  //         }
  //       }
  //   });

  //   const profile = await Auth.getProfie().then(resp=>JSON.parse(resp)).catch(()=> console.error("err setState horoscope"));;
  //   const{Id}=this.props.route.params??{};
  //   console.log("this.props.route.params Id", Id);
  //   if(Id)
  //     this.setState({TabIndex:2})
  //   else {
  //     if(profile.Name){
  //       this.setState({TabIndex:0})
  //     }
  //     else{
  //       this.setState({TabIndex:2})
  //       this.props.navigation.navigate("UpdateUserProfile")
  //     }
  //   }
  // }

  componentDidMount = () => {
    const{Id}=this.props.route.params??{};
    console.log("GetEnduserProfileService req")
    Api.GetEnduserProfileService().then(resp => {
        console.log("GetEnduserProfileService resp", JSON.stringify(resp));
        if (resp.ResponseCode == 200) {
          if(resp.data.DateOfBirth==null || resp.data.DateOfBirth==""){
            this.props.navigation.navigate("UpdateUserProfile")
          }
          this.setState({profile:resp.data});
          if(Id)
            this.setState({TabIndex:2})
          else {
            if(resp.data.Name){
              this.setState({TabIndex:0})
            }
            else{
              this.setState({TabIndex:2})
              this.props.navigation.navigate("UpdateUserProfile")
            }
          }
        }
    });
  };
  

  onTabChange = async(TabIndex) =>{
    const profile = await Auth.getProfie().then(resp=>JSON.parse(resp)).catch(()=> console.error("err setState ontabchange userprofile"));;
    if(TabIndex==0 && !profile.Name) this.props.navigation.navigate("UpdateUserProfile");
    else this.setState({TabIndex:TabIndex})
  }

  render() {
    const{Id}=this.props.route.params??{};
    return (
      <SafeAreaView style={{flex:1}}>
        
      <View style={{flex:1}}>
        <View style={{flexDirection:"row", padding:10}}>
          <TouchableOpacity onPress={()=> {Singular.event("HoroscopeScreen_YourHoroscope"); this.onTabChange(0)}}>
            <LinearGradient colors={this.state.TabIndex==0 ? ["#7162FC", "#B542F2"]:["#fff", "#fff"]} style={[{ borderRadius: 30, marginLeft: 10 }]}>
              <Text style={[MainStyles.text,{borderRadius:10, paddingHorizontal:20, paddingVertical:3}, this.state.TabIndex==0 ? { color:"#fff" }:{color:"#000"}]}>Your Horoscope</Text>
            </LinearGradient>
          </TouchableOpacity>
          {/* <TouchableOpacity onPress={()=> this.setState({TabIndex:1})}>
            <Text style={[MainStyles.text,{backgroundColor:this.state.TabIndex==1?"#B542F2":"#fff", borderRadius:10, paddingHorizontal:20, paddingVertical:3, marginLeft:10}]}>Someone else's</Text>
          </TouchableOpacity> */}
          <TouchableOpacity onPress={()=> {Singular.event("HoroscopeScreen_All"); this.onTabChange(2)}}>
            <LinearGradient colors={this.state.TabIndex==2 ? ["#7162FC", "#B542F2"]:["#fff", "#fff"]} style={[{ borderRadius: 30, marginLeft: 10 }]}>
              <Text style={[MainStyles.text,{borderRadius:10, paddingHorizontal:20, paddingVertical:3}, this.state.TabIndex==2 ? { color:"#fff" }:{color:"#000"}]}>All</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
        
         {
            this.state.TabIndex==0 && <YourHoroscopeScreen onChangeTabIndex={(TabIndex)=> this.setState({TabIndex})}/> 
            // ||
            // this.state.TabIndex==1 && <OtherHoroscopeScreen />
            ||
            this.state.TabIndex==2 && <AllHoroscopeScreen Id={Id}/>
         }
      </View>
      </SafeAreaView>
    );
  }
}
