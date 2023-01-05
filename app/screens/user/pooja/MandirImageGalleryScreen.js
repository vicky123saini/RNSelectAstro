import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, ImageBackground, Modal, Dimensions } from 'react-native';
import Share from 'react-native-share';
import {CheckBox} from 'react-native-elements';
import { Calendar } from 'react-native-calendars';
import * as PoojaControls from './Controls';
import * as env from '../../../../env'; 
import * as Api from '../../../Api';
import * as Auth from '../../../Auth';
import { ScrollView } from 'react-native-gesture-handler';
import Swiper from 'react-native-swiper'
import Overlay from 'react-native-modal-overlay';
import RNFetchBlob from "rn-fetch-blob";
 

export default class MandirImageGalleryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showMessageBox:false
    };
  }
componentDidMount = () => {
  console.log("this.props.route.params", this.props.route.params)
  var data=this.props.route.params.data;

  data=data.map((item, index)=>{
    Image.getSize(`${env.DynamicAssetsBaseURL}${item.Image}`, (width, height) => {
      item.owidth=width;
      item.oheight=height;

      if(width>height){
        item.width=Dimensions.get("window").width;
        item.height=(height/width) * Dimensions.get("window").width
      }
      else{
        item.height=Dimensions.get("window").height;
        item.width=(width/height) * Dimensions.get("window").height
      }
       
    });
    return item;
  });
  console.log("data new", data); 
  this.setState({data:data});
};

onImagePress = (item)=>{
  if(item.Type=="Video"){
    this.props.navigation.replace("VSYoutubeVideoPlayer", {Url:item.VideoURL})
  }
}

onShareUrl = async (url) => {
  console.log("onShareUrl", url)
  var cardData=this.props.route.params.cardData;
  console.log("data", cardData);

  var App_Playstore_Link=await Api.GetAppSettingByKetService(Auth.AppSettingKey.App_Playstore_Link).then(resp=>resp.data);

    // try {
    //     const result = await Share.share({
    //     //title:this.state.Astrologer.Name,
    //     //message: url + '\nMessage goes here.',
    //     url:url,
    //     //message:shareText,
    //   });
    //   if (result.action === Share.sharedAction) {
    //     if (result.activityType) {
    //       // shared with activity type of result.activityType
    //     } else {
    //       // shared
    //     }
    //   } else if (result.action === Share.dismissedAction) {
    //     // dismissed
    //   }
    // } catch (error) {
    //   alert(error.message);
    // }

    
  const fs = RNFetchBlob.fs;
  let imagePath = null;
  RNFetchBlob.config({
    fileCache: true
  })
    .fetch("GET", url)
    // the image is now dowloaded to device's storage
    .then(resp => {
      // the image path you can use it directly with Image component
      imagePath = resp.path();
      return resp.readFile("base64");
    })
    .then(async base64Data => {
      // here's base64 encoded image
      //console.log("data:image/jpeg;base64,"+base64Data);

      const message=`Hi, maine apni ${cardData.Name} karwai, Live from ${cardData.MandirName} ${cardData.Location}, apne ghar me rehkar, kahin jaana nahi pada. I recommend SelectAstro. Click: ${App_Playstore_Link}`;
      console.log("message", message); 

      const shareOptions = {
        social: Share.Social.WHATSAPP,
        title: 'puja',
        url: "data:image/jpeg;base64,"+base64Data, // places a base64 image here our your file path
        message:message
        //social: 'whatsapp',
      };

      try {
        //const ShareResponse = await Share.shareSingle(shareOptions);
        const ShareResponse = await Share.shareSingle(shareOptions);
        console.log("ShareResponse =>", ShareResponse);
         

      } catch (error) {
        console.log('Error =>', error);
      }
      // remove the file from storage
      return fs.unlink(imagePath);
    });
  
}
 
  render() {
    let tindex=2;
    const{data}=this.state; 
    return (
      <SafeAreaView style={{flex:1}}>
{
 this.state.showMessageBox &&
          <Swiper 
              style={[styles.wrapper]} 
              showsButtons={true} 
              index={this.state.selectedImageIndex}
              nextButton = {<Text style={{color:"#000", fontSize:30, fontWeight:"bold"}}>{'>'}</Text>}
              prevButton = {<Text style={{color:"#000", fontSize:30, fontWeight:"bold"}}>{'<'}</Text>}
              >
            {
              data && data.filter(o=>o.Type=="Image").map((item, index)=>(
              <View style={styles.slide}>
                <View style={{width:Dimensions.get("window").width, height:Dimensions.get("window").height-50, alignItems:"center", justifyContent:"center"}}>
                  <Image style={{width:item.width-30, height:item.height-30 }} resizeMode="stretch" source={{uri:`${env.DynamicAssetsBaseURL}${item.Image}`}}/>
                </View>
              </View>
              ))
            }
          </Swiper>

         ||

 
 
          <ScrollView>
              <View style={{flexDirection:"row", flexWrap:"wrap", alignItems:"center", justifyContent:"space-between"}}>
              {
                data && data.map((item, index)=>{
                  tindex++;
                  return(
                    item.Type=="Video" &&
                    <TouchableOpacity onPress={()=> this.onImagePress(item)}>
                      <Image style={{width:tindex%3==0 ? Dimensions.get("window").width-10 : ((Dimensions.get("window").width-20)/2), height:160, borderRadius:10, margin: 5, }} resizeMode="cover" source={{uri:`${env.DynamicAssetsBaseURL}${item.Image}`}}/>
                    </TouchableOpacity>
                    ||
                    <TouchableOpacity onPress={()=> this.setState({selectedImageIndex:index, showMessageBox:true})}>
                      <View style={{width:tindex%3==0 ? Dimensions.get("window").width-10 : ((Dimensions.get("window").width-20)/2), height:160, borderRadius:10, margin: 5, }}>
                        <View style={{position:"absolute", bottom:0, right:0, zIndex:1}}>
                          <TouchableOpacity onPress={()=> this.onShareUrl(`${env.DynamicAssetsBaseURL}${item.Image}`)}>
                            <Image style={{width:30, height:30, margin:5}} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}assets/images/whatsapp-share-icon.png`}}/>
                          </TouchableOpacity>
                        </View>
                        <Image style={{width:tindex%3==0 ? Dimensions.get("window").width-10 : ((Dimensions.get("window").width-20)/2), height:160, borderRadius:10 }} resizeMode="cover" source={{uri:`${env.DynamicAssetsBaseURL}${item.Image}`}}/>
                      </View>
                      
                    </TouchableOpacity>
                  )
                })
              }
              </View>
          </ScrollView>
   }
      </SafeAreaView>
    );
  }
}



const styles = StyleSheet.create({
  wrapper: {height:Dimensions.get("window").height},
  slide: {
    flex: 1,
    width:Dimensions.get("window").width, 
    height:Dimensions.get("window").height
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    position:"relative"
  },
  modalView: {
    width:"100%",
    position:"absolute",
    bottom:0,
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
     
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  }
});