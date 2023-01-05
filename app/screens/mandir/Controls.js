import React, { Component, useEffect, useState } from 'react';
import {SafeAreaView, View, Text, StyleSheet, TextInput, Image, ScrollView, Linking, ActivityIndicator, Dimensions, RefreshControl, ImageBackground, TouchableOpacity } from 'react-native';
import * as env from '../../../env';

export const TimetableListItemView = (props) => {
    const{item}=props;
    return(
          <TouchableOpacity style={{marginBottom:15}} onPress={()=> props.navigation.navigate("PoojaDetailsScreen", {Id:item.Id})}>
              <View style={{padding:10, borderRadius:10, backgroundColor:"#ffff"}}>
                  <View style={{borderLeftWidth:2, borderLeftColor:'#FB7753', flexDirection:'row'}}>                  
                      <View style={{marginLeft:7, flex:4}}> 
                          <Text style={{fontSize:13, color:'#000000', fontWeight:'bold'}}>{item.PujaName}</Text> 
                          <Text style={{fontSize:10, color:'#6D6E71'}}>{item.Puja_Start_Date}</Text> 
                      </View>  
                      <View style={{flex:1.5, justifyContent:'center'}}>
                            <Text style={{backgroundColor:'#FB7753', textAlign:'center', fontSize:12, color:'#FFFFFF'}}>{item.Puja_Start_Time}</Text> 
                      </View>
                  </View>
              </View>
          </TouchableOpacity> 
    )
  } 

export const ContackUsSticker = () =>{
    const[WhatsAppNo, setWhatsAppNo]=useState();
    useEffect(()=>{
        Api.WhatsApp_Communication_NumberService("ContactUsButton").then(resp=> {
            console.log("WhatsApp_Communication_NumberService resp", resp);
            if(resp.ResponseCode == 200){
                setWhatsAppNo(resp.data.MobileNo)
            }
          });
    },[]);
    return(
        <TouchableOpacity onPress={()=> Linking.openURL(`whatsapp://send?text=hello&phone=${WhatsAppNo}`)}>
          <View style={{flexDirection:"row", padding:5, alignItems: "center", alignContent:"center", justifyContent:"center", borderRadius:15, backgroundColor:"#F5F5F5"}}>
            <Text style={{fontSize:16}}>सहायता के लिए</Text>
            <Image style={{ width: 35, height: 35, marginHorizontal: 10 }} resizeMode="cover" source={{ uri: `${env.AssetsBaseURL}/assets/images/call-icn.png` }} />
            <Text style={{color:"blue", textDecorationLine:"underline"}}>{WhatsAppNo}</Text>
          </View>
        </TouchableOpacity>
    )
}