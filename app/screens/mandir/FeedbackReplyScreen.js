import React, { Component } from 'react';
import {SafeAreaView, View, Text, StyleSheet, TextInput, Image, ScrollView, Modal, ActivityIndicator, Dimensions, RefreshControl, ImageBackground, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as env from '../../../env';
import * as Api from '../../Api';
import * as Auth from '../../Auth';
import * as MyControls from './Controls';
import ImagePicker from 'react-native-image-crop-picker';

export default class FeedbackReplyScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        item:this.props.route.params.item,
        Images:[]
    };
  }

  
  _onFileUpload = () => {
    const data = new FormData();
    

    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: true
    }).then(image => {
      console.log(image);
      let filename = image.path.substring(image.path.lastIndexOf('/') + 1, image.path.length)
      var photo = {
        uri: image.path,
        type: image.mime,
        name:filename
      };
      
      data.append('file', photo);
      Api.FeedbackFileuploadService(data)
      .then(resp=>{
        console.log("FeedbackFileuploadService resp", resp);
if(resp.ResponseCode==200){
        this.setState(prepState=>({Images:[...prepState.Images, resp.data.path]}))
}
else{
  alert("Oops! sonthing wend wrong. please try again.")
}
      })
    });
  };

  onSubmit = () => {
      if(!this.state.Review){
          alert("please fill review");
          return;
      }
      const{item}=this.props.route.params;
      console.log("item", item);

      var req={id:item.Id, Review:this.state.Review, Rating:0, Review_Rating_Puja_Image_List:this.state.Images.map((item, index)=> {return {Image :item}})};
      console.log("Save_Puja_Review_Rating_AcharayaService req", req);
    Api.Save_Puja_Review_Rating_AcharayaService(req).then(response => {
        console.log("Save_Puja_Review_Rating_AcharayaService resp", response);
        if (response.ResponseCode == 200) {
           this.props.navigation.goBack();
        }
    });
  }

  render() {
      const item=this.state.item;
    return (
      <SafeAreaView style={{flex:1, backgroundColor:"#FFF", padding:20}}>
        <ScrollView>
            <View style={{}}>
                <View style={{flexDirection:"row", padding:10}}>
                    <Image style={{width:23, height:23, marginRight:20}} resizeMode="stretch" source={{uri:`${env.DynamicAssetsBaseURL}${item.Image}`}}/>
                    <View>
                        <Text style={{fontSize:14, fontWeight:"bold", color:"#FF7389"}}>{item.Name}</Text>
                        <Text style={{fontSize:9, fontWeight:"400", color:"#6D6E71"}}>{item.FeedbackDate}</Text>
                        <Text style={{fontSize:9, fontWeight:"bold", color:"#000000"}}>{item.PujaName}</Text>
                    </View>
                </View>
                <Text style={{fontSize:13, fontWeight:"400", color:"#090320"}}>{item.Review}</Text>
            </View>
            <View style={{margin:10}}>
                <Text style={{fontWeight:"bold", marginVertical:10}}>रिˈप्लाइ लिखें</Text>
                <View style={{backgroundColor:"#F3F3F3", height:112, borderRadius:15}}>
                    <TextInput style={{width:"100%", color:"#000", paddingHorizontal:10}} multiline={true} value={this.state.Review} onChangeText={(text)=> this.setState({Review:text})}/>
                </View>
            </View>
            <View style={{margin:10}}>
                <Text style={{fontWeight:"bold", marginVertical:10}}>चित्र/वीडियो अपलोड करें</Text>
                <View style={{flexDirection:"row", alignItems:"center"}}>
                    <TouchableOpacity onPress={()=> this._onFileUpload()}>
                        <View style={{backgroundColor:"#F3F3F3", height:100, width:80, borderRadius:15, alignItems:"center", justifyContent:"center"}}>
                            <Text style={{fontSize:50, color:"#656565"}}>+</Text>
                        </View>
                    </TouchableOpacity>
                    {
                        this.state.Images.map((item, index)=>(
                            <Image style={{height:100, width:80, borderRadius:15, marginLeft:20}} resizeMode="stretch" source={{uri:`${env.DynamicAssetsBaseURL}${item}`}}/>
                        ))
                    }
                </View>
            </View>
            {/* <View style={{margin:10}}>
                <Text style={{fontWeight:"bold", marginVertical:10}}>चित्र 1 टाइटल</Text>
                <View style={{backgroundColor:"#F3F3F3", borderRadius:15}}>
                    <TextInput style={{width:"100%", color:"#000", paddingHorizontal:10}}/>
                </View>
            </View>
            <View style={{margin:10}}>
                <Text style={{fontWeight:"bold", marginVertical:10}}>चित्र 1 डिस्क्रिप्शन</Text>
                <View style={{backgroundColor:"#F3F3F3", height:112, borderRadius:15}}>
                    <TextInput style={{width:"100%", color:"#000", paddingHorizontal:10}} multiline={true}/>
                </View>
            </View> */}
            <View style={{margin:10}}>
                <TouchableOpacity onPress={()=> this.onSubmit()}>
                    <LinearGradient colors={["#8A09F0", "#E39DD9"]} style={{borderRadius:30, width:220, alignSelf:"center"}}>
                        <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>अप्लाई</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
