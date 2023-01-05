import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, ScrollView, ImageBackground, ActivityIndicator } from 'react-native';
import analytics from '@react-native-firebase/analytics';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import HoroscopeView from '../../../controls/HoroscopeView';
import MainStyles from '../../../Styles';
import {Singular} from 'singular-react-native';
import * as Api from '../../../Api';
import * as env from '../../../../env';


export default class AllHoroscopeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };

  }

  componentDidMount = ()=>{
    analytics().logEvent("All_Horoscope");
    Singular.event("All_Horoscope");
    console.log("this.props", this.props);
    const{Id}=this.props??{};

    console.log("GetAllZodiacSignService req");
    Api.GetAllZodiacSignService().then(resp => {
        console.log("GetAllZodiacSignService resp", resp);
        if (resp.ResponseCode == 200) {
            this.setState({ AllZodiacSignList: resp.data });
            if(resp.data){
              if(Id)this.getHoroById(Id);
              else this.getHoroById(resp.data[0].Id);
            }
        }
    });
  }

  getHoroById = (Id)=>{
    Singular.event("AllHoroscopeScreen_ReadMore");
    this.setState({Horoscope:null});
    console.log("GetHoroscopeFullByIdService req");
    Api.GetHoroscopeFullByIdService(Id).then(resp => {
        console.log("GetHoroscopeFullByIdService resp", resp);
        if (resp.ResponseCode == 200) {
            this.setState({ Horoscope: resp.data });
        }
    });
  }


  render() {
    return (
    <ScrollView style={{backgroundColor:"#fff"}}>
      <View style={{padding:20, marginBottom:20}}>
        
        {
          this.state.AllZodiacSignList &&
        
          <ScrollView horizontal={true}>
            <View style={{flexDirection:"row"}}>
              {
                this.state.AllZodiacSignList.map((item, index)=>{
                  return(
                   
                      <View key={index} style={[MainStyles.shadow, {margin:10, width:188, height:234, borderRadius:20, alignItems:"center", alignContent:"center", justifyContent:"center", backgroundColor:"#FFF", padding:10}]}>
                         
                        <Image style={{width:60,height:60, marginBottom:20}} resizeMode="stretch" source={{ uri: `${env.DynamicAssetsBaseURL}${item.ImagePath}` }} />

                         <Text style={[MainStyles.text,{fontSize:20, color:"#090320", fontWeight:"700"}]}>{item.Name_En}</Text>
                         <Text style={[MainStyles.text,{fontSize:14, color:"#090320", marginBottom:10}]}>({item.StartDate}-{item.EndDate})</Text>
                        
                        <TouchableOpacity onPress={()=>this.getHoroById(item.Id)}>
                            <LinearGradient colors={["#7162FC", "#B542F2"]} style={{borderRadius:30, width:126, marginBottom:0}}>
                                <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>Read More</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        
                      </View>
                  )
                })
              }

            </View>
          </ScrollView>
          ||
          <ActivityIndicator color="#0000ff"/>
        }
      </View>

      {
        this.state.Horoscope && 
        <View style={{marginBottom:50}}>
          <HoroscopeView dataSource={this.state.Horoscope}/>
        </View>
        ||
        <ActivityIndicator color="#0000ff"/>
      }

      </ScrollView>
    );
  }
}

export const AllHoroList = (props) => {
  const[allZodiacSignList, setAllZodiacSignList]=useState([])
  useEffect(()=>{
    console.log("GetAllZodiacSignService req");
    Api.GetAllZodiacSignService().then(resp => {
        console.log("GetAllZodiacSignService resp", resp);
        if (resp.ResponseCode == 200) {
          setAllZodiacSignList(resp.data);
        }
    });
  },[]);

  return(
    <ScrollView horizontal={true}>
            <View style={{flexDirection:"row"}}>
              {
                allZodiacSignList.map((item, index)=>{
                  return(
                   
                      <View key={index} style={[MainStyles.shadow, {margin:10, width:188, height:234, borderRadius:20, alignItems:"center", alignContent:"center", justifyContent:"center", backgroundColor:"#FFF", padding:10}]}>
                         
                        <Image style={{width:60,height:60, marginBottom:20}} resizeMode="stretch" source={{ uri: `${env.DynamicAssetsBaseURL}${item.ImagePath}` }} />

                         <Text style={[MainStyles.text,{fontSize:20, color:"#090320", fontWeight:"700"}]}>{item.Name_En}</Text>
                         <Text style={[MainStyles.text,{fontSize:14, color:"#090320", marginBottom:10}]}>({item.StartDate}-{item.EndDate})</Text>
                        
                        <TouchableOpacity onPress={()=> props.navigation.navigate("HoroscopeScreen", {Id: item.Id})}>
                            <LinearGradient colors={["#7162FC", "#B542F2"]} style={{borderRadius:30, width:126, marginBottom:0}}>
                                <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>Read More</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        
                      </View>
                  )
                })
              }

            </View>
          </ScrollView>
  )
}

const styles=StyleSheet.create({
    heading:{
        ...MainStyles.text,
        fontSize:14,
        marginBottom:20,
        color:"#090320"
    }
    
});