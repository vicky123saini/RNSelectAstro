import React, { Component } from 'react';
import { StyleSheet, View, Text, Dimensions, Image, TouchableOpacity, ActivityIndicator } from 'react-native'
import LinearGradient from 'react-native-linear-gradient';
import analytics from '@react-native-firebase/analytics';
import * as env from '../../../env';
import * as Auth from '../../Auth';
import * as Api from '../../Api';

export default class WelcomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    
  }

  componentDidMount = () => {
    analytics().logEvent("Greeting_Screen");
    Api.GetAppSettingByKetService(Auth.AppSettingKey.CUSTOMER_WELCOME_SCREEN_TEXT).then(resp=>{
      this.setState({CUSTOMER_WELCOME_SCREEN_TEXT:resp.data})
    });
  };

  _submit = async() =>{
    const profile = await Auth.getProfie().then(profile=> JSON.parse(profile)).catch(()=> console.error("err welcome getProfile"));
     
      
      if(profile.UserType==Auth.UserType.ENDUSER)
        this.props.navigation.replace("UserHomeScreen");
      else if(profile.UserType==Auth.UserType.ASTROLOGER)
        this.props.navigation.replace("ExpertHomeScreen");
  }
  

  render() {
    return (
    <View style={styles.container}>
        <LinearGradient
          colors={['#000000CC', '#000000CC' ]}
          style={styles.linearGradient}
        >
        <View style={styles.centerContent}>
            <Image style={{width:75,height:72}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/flower.png`}}/>
        </View>

        <View style={styles.centerContent}>
          {
            this.state.CUSTOMER_WELCOME_SCREEN_TEXT &&
            <Text style={styles.sliderText}>{this.state.CUSTOMER_WELCOME_SCREEN_TEXT}</Text>
            ||
<ActivityIndicator coloe="#0000ff"/>
          }
          
          </View>

          <View style={styles.centerContent}>
              <TouchableOpacity onPress={()=> this._submit()}>
          <Image style={{width:80,height:80}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/arrow-right.png`}}/>
          </TouchableOpacity>
          </View>
        </LinearGradient>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    linearGradient: {
        flex:1,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 5,
      height: Dimensions.get("window").height,
      width: Dimensions.get("window").width,
    },
    sliderText:{
        color:"#fff",
        fontSize:18,
        padding:30,
        fontFamily:"Roboto",
        textAlign:"center"
    },
    centerContent:{
        flex:1,
        alignItems:"center",
        alignContent:"center",
        justifyContent:"center"
    }
  })