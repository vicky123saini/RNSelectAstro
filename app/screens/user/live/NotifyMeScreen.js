import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image, SafeAreaView, ScrollView, StyleSheet, ImageBackground, Alert, ActivityIndicator } from 'react-native'
import MyStyle from './style'
import * as env from '../../../../env';
import * as Api from '../../../Api';
import * as MyExtension from '../../../MyExtension';
import * as Auth from '../../../Auth';
import { Avatar } from 'react-native-elements';

export default class NotifyMeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
          loading:true
        };
      }
    
      componentDidMount = () => {
        const{Id}=this.props.route.params??{};
        console.log("Id",Id);
        this.setState({loading:true});
        Api.UserliveSessionByIdService(Id)
        .then(resp=> {
            console.log("UserliveSessionByIdService resp", resp);
            this.setState({loading:false});
            if (resp.ResponseCode == 200) {
                this.setState({data:resp.data});
                if(resp.data.Session.Status==MyExtension.LiveSession_Status.SCHEDULED){
                  this._interval = setInterval(() => {
                    if(this.state.data.Session.TimerSeconds==0){
                      clearInterval(this._interval);
                      return;
                    }
                    this.setState(prevState=>({data:{...prevState.data, Session:{...prevState.data.Session, TimerSeconds:--prevState.data.Session.TimerSeconds}}}))
                  }, 1000);
                }
                else if(resp.data.Session.Status==MyExtension.LiveSession_Status.LIVE){
                  setTimeout(() => {
                    this.props.navigation.replace("Live_Usr_GoLiveScreen",{Id:Id});
                  }, 3000);
                }
            }
        });
      };

      notifyMePress = () => {
        const{Id}=this.props.route.params??{};
        this.setState({loading:true});
        var request = {Id:Id};
        Api.UserliveSessionNotifyMeService(request)
        .then(resp=> {
          this.setState({loading:false});
            console.log("UserliveSessionNotifyMeService resp", resp);
            if (resp.ResponseCode == 200) {
              Alert.alert(null, resp.ResponseMessage)
            }
          })
      }

  render() {
      const{data}=this.state;
      const{Id}=this.props.route.params??{};
  return (
      !data && <ActivityIndicator color="blue"/> ||
    <SafeAreaView style={MyStyle.BodyOne}>
     
          <View style={{flex:1}}>
            <Image source={{uri:`${env.DynamicAssetsBaseURL}${data.Session.BackgroundImagePath}`}} style={MyStyle.Back_Image}/>
            <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/shafdow_all.png`}} style={MyStyle.Back_Image}/>
              
            <View style={MyStyle.Direction_Row_Between}>
                <View style={MyStyle.Status_Position}/>
                <View style={[MyStyle.Status_Position,{backgroundColor:'#fff'}]}/>
                <View style={MyStyle.Status_Position}/>
                <View style={MyStyle.Status_Position}/>
                <View style={MyStyle.Status_Position}/>
                <View style={MyStyle.Status_Position}/>
              </View>
              <View style={[MyStyle.Direction_Row_Between,{margin:10,alignItems:'center'}]}>
                <View style={MyStyle.Direction_Row_Center}>
                  <View style={MyStyle.Cricle}>
                  <Avatar size={55} rounded source={{uri:`${env.DynamicAssetsBaseURL}${data.Profile.ProfileImage}`}} />
                  </View>
                  <View style={MyStyle.Text_MarginHorizontal}>
                    <Text style={MyStyle.Text20_Bold_White}>{data.Profile.Name}</Text>
                    <View style={MyStyle.Direction_Row}>
                      <View style={MyStyle.Direction_Row_Center}>
                        <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/View.png`}} style={MyStyle.Image_20}/>
                        <Text style={MyStyle.Text25_Bold_White}>{data.Profile.Views}</Text>
                      </View>
                      <View style={[MyStyle.Direction_Row_Center,MyStyle.Text_MarginHorizontal]}>
                      <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/Path.png`}} style={MyStyle.Image_16}/>
                        <Text style={MyStyle.Text25_Bold_White}>{data.Profile.Likes}</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={MyStyle.Buton_Small}>
                <Text style={MyStyle.Text12_Bold_White}>Follow</Text>
                </View>
                <TouchableOpacity>
                  <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/share-2.png`}} style={MyStyle.Image_25}/>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/Close.png`}} style={MyStyle.Image_25} />
                </TouchableOpacity>
                
              </View>
              <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
                
                  <View style={MyStyle.Cricle_120}>
                    <Avatar size={120} rounded source={{uri:`${env.DynamicAssetsBaseURL}${data.Profile.ProfileImage}`}} />
                  </View>
                  <View style={{bottom:20}}>
                    <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/Star_One.png`}} style={{height:35,width:120}}/>
                  </View>
                  <View style={MyStyle.Text_MarginVertical}>
                  <Text style={MyStyle.Text20_Bold_White}>{data.Profile.Name}</Text>
                  </View>
                  
                <View style={[MyStyle.Direction_Row_Between]}>
                  {
                    data.Profile.Experties.map((item, index)=>(
                      <View key={index} style={{alignItems:"center"}}>
                        <Image style={{height:34,width:34}} resizeMode="stretch" source={{uri:`${env.DynamicAssetsBaseURL}${item.Image}`}}/>
                        <Text style={MyStyle.Text12_Bold_White_Center}>{item.Name}</Text>
                      </View>
                    ))
                  }                   
                </View>
                <View style={MyStyle.Text_MarginVertical}>
                  <ImageBackground source={{uri:`${env.AssetsBaseURL}/assets/images/live/red-ribbon.png`}} style={{height:50,width:180,justifyContent:'center'}}>
                    <Text style={MyStyle.Text16_Bold_White_Center}>TOPIC</Text>
                    </ImageBackground>
                </View>
                <View style={[MyStyle.Text_MarginVertical,{width:'70%'}]}>
                  <Text style={[MyStyle.Text20_Bold_White,{textAlign:'center'}]}>{data.Session.Subject}</Text>
                </View>
                

                {
                  data.Session.Status==MyExtension.LiveSession_Status.SCHEDULED &&
                  <>
                    <View style={MyStyle.Text_MarginVertical}>
                      <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/Vector.png`}} style={MyStyle.Image_20}/>
                    </View>
                    <View style={MyStyle.Text_MarginVertical}>
                      <Text style={MyStyle.Text16_Bold_White}>{data.Session.TimerSeconds} minutes left</Text>
                    </View>
                    <TouchableOpacity onPress={()=>this.notifyMePress()} style={[MyStyle.Button_Center,MyStyle.Direction_Row_Center,MyStyle.Text_MarginVertical]}>
                      {
                        this.state.loading && <ActivityIndicator color="blue"/> 
                        ||
                        <Text style={MyStyle.Text16_Bold_White}>Notify me</Text>
                      }
                      <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/bell.png`}} style={[MyStyle.Image_25,MyStyle.Text_MarginHorizontal]} />
                    </TouchableOpacity>
                  </>
                  ||
                  data.Session.Status==MyExtension.LiveSession_Status.LIVE &&
                  <TouchableOpacity onPress={()=>this.props.navigation.replace('Live_Usr_GoLiveScreen', {Id:Id})} style={[MyStyle.Button_Center,MyStyle.Direction_Row_Center,MyStyle.Text_MarginVertical]}>
                    <Text style={MyStyle.Text16_Bold_White}>Go</Text>
                  </TouchableOpacity>
                }

              </View>
        </View>
      
      

    </SafeAreaView>
  )
  }
}
