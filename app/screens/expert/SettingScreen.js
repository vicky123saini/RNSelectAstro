import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Switch } from 'react-native-switch';
import {Card} from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import MainStyles from '../../Styles';
import * as env from '../../../env';
import * as Api from '../../Api';
import * as Auth from '../../Auth';
import {Singular} from 'singular-react-native';

export default class SettingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        thumbIconImageSource:require('../../assets/images/rarrow.png'),
        EnableSwipeButton:true,
        BusySwipeButton:{
          title:'Drag right to go break'
      }
    };
    this.bintData=this.bintData.bind();
  }

  componentDidMount = () => {
    this.bintData();
    //this._interval = setInterval(this.bintData, 10000);
    // this._unsubscribe1 = this.props.navigation.addListener('focus', () => {      
    //   this._interval = setInterval(this.bintData, 15000);
    // });
    // this._unsubscribe2 = this.props.navigation.addListener('blur', () => {
    //   clearInterval(this._interval);
    // });
  };

  componentWillUnmount = () =>{
    clearInterval(this._interval);
    //this._unsubscribe1();
    //this._unsubscribe2();
  }

  bintData = () =>{
    console.log("GetServiceStatesService req");
    Api.GetServiceStatesService().then(resp => {
      console.log("GetServiceStatesService resp", resp);
      if (resp.ResponseCode == 200) {
        this.setState(resp.data);
      }
      else if(resp.ResponseCode==401){
        Auth.Logout();
        this.props.navigation.replace("LoginScreen");
      }
    });
  }
  
   

  updateState = () =>{
    var req={IsAvailable:this.state.IsAvailable, IsBusy:this.state.IsBusy, IsVideoService: this.state.IsVideoService, IsCallService:this.state.IsCallService, IsChatService:this.state.IsChatService}
    console.log("UpdateServiceStatesService req", req);
    Api.UpdateServiceStatesService(req).then(resp => {
      console.log("UpdateServiceStatesService resp", resp);
    });
  }



  render() {
    return (
    <View style={{flex:1}}>
    {
    this.state.IsAvailable !=null && 
    <>
    

        <View style={{paddingHorizontal:10, backgroundColor:"#fff", marginTop:20}}>
            <LinearGradient colors={["#7162FC", "#B542F2"]} style={{height:50, alignContent:"center", alignItems:"center", justifyContent:"center", borderTopLeftRadius:20, borderTopRightRadius:20}}>
                <Text style={{color:"#fff"}}>Available</Text>
            </LinearGradient>
        </View>

        <View enablescrol style={{padding:10, alignItems:"center", backgroundColor:"#fff"}}>
            <Card style={{width:"90%", flexDirection:"row"}}>
            <View style={Styles.cartItem}>
                    <View style={Styles.itemCell}>
                        <Switch
                            disabled={!this.state.IsCallApproval}
                            value={this.state.IsCallService}
                            onValueChange={(val) => console.log(val)}
                            barHeight={10}
                            backgroundActive={"#FF65A0"}
                            backgroundInactive={"gray"}
                            activeTextStyle={{color:"#FF65A0"}}
                            inactiveTextStyle={{color:"gray"}}
                            onValueChange={(val) => this.setState({IsCallService:val}, ()=> this.updateState())}
                            renderInsideCircle={() => <Image style={{width:40, height:40}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/rphone-active.png`}}/>}
                        />
                    </View>
                    <Text style={Styles.bottomText}>Voice</Text>
                </View>
                <View style={Styles.cartItem}>
                    <View style={Styles.itemCell}>
                        <Switch
                            disabled={!this.state.IsVideoApproval}
                            value={this.state.IsVideoService}
                            barHeight={10}
                            backgroundActive={"#FF65A0"}
                            backgroundInactive={"gray"}
                            activeTextStyle={{color:"#FF65A0"}}
                            inactiveTextStyle={{color:"gray"}}
                            onValueChange={(val) => this.setState({IsVideoService:val}, ()=> this.updateState())}
                            renderInsideCircle={() => <Image style={{width:40, height:40, transform: [{ rotate: '90deg'}]}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/rvideo-active.png`}}/>}
                        />
                    </View>
                    <Text style={Styles.bottomText}>Video</Text>
                </View>
                <View style={Styles.cartItem}>
                    <View style={Styles.itemCell}>
                        <Switch
                            disabled={!this.state.IsChatApproval}
                            value={this.state.IsChatService}
                            onValueChange={(val) => console.log(val)}
                            barHeight={10}
                            backgroundActive={"#FF65A0"}
                            backgroundInactive={"gray"}
                            activeTextStyle={{color:"#FF65A0"}}
                            inactiveTextStyle={{color:"gray"}}
                            onValueChange={(val) => this.setState({IsChatService:val}, ()=> this.updateState())}
                            renderInsideCircle={() => <Image style={{width:40, height:40}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/rchat-active.png`}}/>}
                        />
                    </View>
                    <Text style={Styles.bottomText}>Chat</Text>
                </View>
            </Card>
        </View>

        <View style={{paddingHorizontal:10, backgroundColor:"#fff"}}>
            <LinearGradient colors={["#7162FC", "#B542F2"]} style={{height:50, alignContent:"center", alignItems:"center", justifyContent:"center", borderBottomLeftRadius:20, borderBottomRightRadius:20}}>
                <Text style={{color:"#fff"}}>Busy</Text>
            </LinearGradient>
        </View>
        </>
}


      </View>
    );
  }
}


const Styles = StyleSheet.create({
    cartItem:{flex:1, alignContent:"center", alignItems:"center", justifyContent:"center"},
    bottomText:{...MainStyles.text, padding:10, fontSize:18, textAlign:"center"},
    itemCell:{width:100, height:50, margin:20, transform: [{ rotate: '-90deg'}], alignItems:"center", justifyContent:"center"}
   
})