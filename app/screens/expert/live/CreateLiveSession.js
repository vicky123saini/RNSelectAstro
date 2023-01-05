import React, { Component, useEffect, useState } from 'react'
import { View, Text, TouchableOpacity, Image, SafeAreaView, ScrollView, StyleSheet, ImageBackground, Alert, Modal, Pressable, TextInput, Dimensions, PermissionsAndroid, Platform, ActivityIndicator, } from 'react-native';
import MyStyle from './style';
import * as env from '../../../../env';
import * as Api from '../../../Api';
import * as Auth from '../../../Auth';
import * as MyExtension from '../../../MyExtension';
import {ActiveCallers, Header, BadgesView} from '../../../controls/LiveSessionControls';
import {Picker} from '../../../controls/MyPicker';
import {Live_Category, LiveSession_Status} from '../../../MyExtension';
import RtcEngine, { ChannelProfile, ClientRole, RtcEngineContext, RtcLocalView, RtcRemoteView, } from 'react-native-agora';
//import Item from '../../../controls/AgoraControls/basic/JoinChannelAudio/Item';
//const config = require('../../config/agora.config.json');
import {agoraConf as config} from '../../../../env';
import { Avatar } from 'react-native-elements';

export default class CreateLiveSession extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  submit = () =>{
    var req={
        //Id:Id,
        Category:this.state.Category,
        Subject:this.state.Subject,
    }
    console.log("ExpertliveSessionCreateLiveSessionService req", req);
    Api.ExpertliveSessionCreateLiveSessionService(req).then( async (resp) => {
        console.log("ExpertliveSessionCreateLiveSessionService resp", resp);
        if (resp.ResponseCode == 200) {
            this.props.navigation.replace("Live_Exp_GoLiveScreen", {Id:resp.data.SessionId});
        }
        else{
            Alert.alert(null, resp.ResponseMessage)
        }
    });
  }

  render() {
    return (
      <View style={{flex:1,  justifyContent:"flex-end"}}>
                    <View>
                        
                        <View style={[MyStyle.Search_Tab, MyStyle.Text_MarginVertical]}>
                            <Picker selectedValue={this.state.Category} onValueChange={(value)=> this.setState({Category:value})}>
                                <Picker.item label="Select Category" value=""/>
                                <Picker.Item label="ASTROLOGY" value={Live_Category.ASTROLOGY} />
                                <Picker.Item label="LIVE POOJA" value={Live_Category.LIVE_POOJA} />
                            </Picker>
                            {
                                Platform.OS=="android" && <Text style={{width: '100%', height: 60, position: 'absolute', bottom: 0, left: 0}}>{' '}</Text>
                            }
                        </View>

                        <View style={[MyStyle.TextArea, MyStyle.Text_MarginVertical]}>
                            <TextInput style={{padding:15}}
                                placeholder="Notes/ Comments"
                                multiline={true} value={this.state.Subject} onChangeText={(text)=> this.setState({Subject:text})} />
                        </View>
                    </View>
                    <View style={[MyStyle.Direction_Row_Between_Center, MyStyle.Text_MarginHorizontal]}>
                        <View style={[MyStyle.Cricle_40,{backgroundColor:'#fff'}]}>
                            <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/shape_12.png`}} style={MyStyle.Image_20}/>
                        </View>

                        <TouchableOpacity onPress={()=>this.submit()}>
                            <ImageBackground source={{uri:`${env.AssetsBaseURL}/assets/images/live/dotted_lines.png`}} style={[MyStyle.Image_120,MyStyle.Center_Items]}>
                                <Text style={[MyStyle.Text20_Bold_White,{textAlign:'center'}]}>Go{'\n'}Live</Text>
                            </ImageBackground>
                        </TouchableOpacity>

                        <View style={[MyStyle.Cricle_40,{backgroundColor:'#fff'}]}>
                            <TouchableOpacity>
                                <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/shape_11.png`}} style={MyStyle.Image_20}/>
                            </TouchableOpacity>
                        </View>

                    </View>
                    <View style={[MyStyle.Direction_Row_Between,MyStyle.Text_MarginHorizontal]}>
                        <View style={MyStyle.Center_Items}>
                            <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/Vector_2323.png`}} style={MyStyle.Image_20}/>
                            <Text style={MyStyle.Text14_Regular_White}>Filters</Text>
                        </View>
                        <View style={MyStyle.Center_Items}>
                            <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/icons_setting.png`}} style={MyStyle.Image_20}/>
                            <Text style={MyStyle.Text14_Regular_White}>Settings</Text>
                        </View>
                    </View>
                
                    <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/shadow_bottom.png`}} style={MyStyle.Back_Image_One} />

      </View>
    );
  }
}