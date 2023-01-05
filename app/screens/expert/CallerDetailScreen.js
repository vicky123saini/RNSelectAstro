import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MainStyles from '../../Styles';
import * as env from '../../../env';
import * as Api from '../../Api';
import {Singular} from 'singular-react-native';

export default class CallerDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        TimeLimit:0
    };
  }

  componentDidMount = () => {
    const{UpcommingCallerDetails}=this.props.route.params;
    this.setState({UpcommingCallerDetails:UpcommingCallerDetails});
    var TimeLimit=UpcommingCallerDetails.TimeLimit;

    this._interval=setInterval(() => {
        console.log("Interval", 5001);
        if(TimeLimit>0){
            this.setState({TimeLimit:--TimeLimit});
        }
        else clearInterval(this._interval);
    }, 1000);
  };
  
  componentWillUnmount = () =>{
    clearInterval(this._interval);
  }

  render() {
    return (
        this.state.UpcommingCallerDetails &&
      <View style={{flex:1, backgroundColor:"#fff", alignContent:"center", alignItems:"center", justifyContent:"center"}}>
        <View style={{paddingTop:10, backgroundColor:"#fff"}}>
            <LinearGradient colors={["#FF8767", "#FF65A0"]} style={{borderRadius:30, width:"90%", alignSelf:"center", marginBottom:20}}>
                <View style={{padding:20}}>
                    <Text style={[Styles.boxTex1,{}]}>You will recieve a call within the next 30sec</Text>
                    <View style={{flexDirection:"row"}}>
                        <Image style={{width:30, height:30, margin:10}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/flower.png`}}/>
                        <View>
                            <Text style={[Styles.boxTex1,{}]}>Client name:</Text>
                            <Text style={[Styles.boxTex1,{}]}>Client details:</Text>
                        </View>
                        <View>
                        <Text style={[Styles.boxTex1,{}]}>{this.state.UpcommingCallerDetails.UserProfile.Name}</Text>
                        <Text style={[Styles.boxTex1,{}]}>D.O.B. - {this.state.UpcommingCallerDetails.UserProfile.DateOfBirth}{'\n'}P.O.B. - {this.state.UpcommingCallerDetails.UserProfile.PlaceOfBirth}{'\n'}T.O.B. - {this.state.UpcommingCallerDetails.UserProfile.TimeOfBirth}</Text>
                        
                        </View>
                    </View>
                    {/* <Text style={[Styles.boxTex1,{}]}>Maximum Call Duration: <Text style={{fontSize:20, fontWeight:"700"}}>{parseInt(this.state.TimeLimit/60)}:{this.state.TimeLimit%60}</Text></Text> */}
                </View>
            </LinearGradient>
        </View>
        <View style={{marginTop:20}}>
            <Text>Maximum Call Duration</Text>
            <View style={{flexDirection:"row", alignItems:"center", alignContent:"center", justifyContent:"center"}}>
                <View style={{alignItems:"center", alignContent:"center", justifyContent:"center"}}>
                    <Text style={{fontSize:24, fontWeight:"bold"}}>{parseInt(this.state.TimeLimit/60)}</Text>
                </View>
                <View style={{alignItems:"center", alignContent:"center", justifyContent:"center"}}>
                    <Text style={{fontSize:24, fontWeight:"bold"}}>:</Text>
                </View>
                <View style={{alignItems:"center", alignContent:"center", justifyContent:"center"}}>
                    <Text style={{fontSize:24, fontWeight:"bold"}}>{parseInt(this.state.TimeLimit%60)}</Text>
                </View>
            </View>
        </View>
      </View>
      ||
        <View style={{flex:1, backgroundColor:"#fff", alignContent:"center", alignItems:"center", justifyContent:"center"}}>
            <ActivityIndicator clolr="#0000ff"/>
        </View>
    );
  }
}


const Styles = StyleSheet.create({
    boxTex1:{...MainStyles.text, color:"#fff", paddingTop:10},
});