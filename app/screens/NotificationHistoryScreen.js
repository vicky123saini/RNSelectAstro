import React, { Component, useState, useEffect } from 'react';
import { BackHandler, View, Text, TouchableOpacity, Image, TextInput, Dimensions, SafeAreaView, ScrollView, Alert, Modal, ImageBackground, Pressable } from 'react-native';
import { Avatar, ListItem } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import BackgroundTimer from 'react-native-background-timer';
import Overlay from 'react-native-modal-overlay';
import LinearGradient from 'react-native-linear-gradient';
import * as env from '../../env';
import * as Api from '../Api';
import * as Auth from '../Auth';
import * as MyControls from './user/Controls';
import Html from 'react-native-render-html';
import moment from 'moment';
import {Singular} from 'singular-react-native';

export default class NotificationHistoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount = () => {
    Api.GetNotificationService().then(resp=>{
      console.log("GetNotificationService resp", resp);
      if (resp.ResponseCode == 200) {
        this.setState({data:resp.data});
      }
    });
  };

  onPress = (item) => {
    Singular.event("NotificationHistoryScreen_onPress");
    console.log("item", item);
    if(item.ActionName){
      try{
        this.props.navigation.navigate(item.ActionName, JSON.parse(item.ActionParam))
      }
      catch(e){console.error("err onPress NotificationHistory",e);}
    }
  }
  
  render() {
    return (
      <SafeAreaView style={{flex:1, backgroundColor:"#fff"}}>
        <ScrollView style={{flex:1}}>
         {
           this.state.data && this.state.data.map((item, index)=>(
             <ListItem key={index} style={{borderBottomWidth:1, borderBottomColor:"#ccc"}}>
               <TouchableOpacity onPress={()=> this.onPress(item)}>
                <View style={{padding:5}}>
                  {/* <Text style={{marginVertical:5, fontSize:18}}>{item.Notification}</Text> */}
                  <View style={{marginVertical:5}}>
                    <Html
                      contentWidth={Dimensions.get("window").width}
                      source={{html:item.Notification}}
                    />
                  </View>
                  <Text style={{alignSelf:"flex-end"}}>{moment(item.CreatedDate).format("DD/MM/YYYY - HH:mm")}</Text>
                </View>
               </TouchableOpacity>
             </ListItem>
           ))
         }
         </ScrollView>
      </SafeAreaView>
    );
  }
}
