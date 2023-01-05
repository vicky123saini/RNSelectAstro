import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, Platform } from 'react-native';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
// import { appleAuth } from '@invertase/react-native-apple-authentication';

import MainStyle from '../../Styles';
import * as Api from '../../Api';
import * as Auth from '../../Auth'
import * as env from "../../../env";

export const SociaLoginButtons = ({navigation}) => {
    const [loggedIn, setloggedIn] = useState(false);
    const [userInfo, setuserInfo] = useState([]);

    useEffect(() => {
        // GoogleSignin.configure({
        //   webClientId:"102190068006-vc4rtfj15858or02sr97v7meek31juf5.apps.googleusercontent.com",
        //   offlineAccess: false
        // });
        GoogleSignin.configure();
      }, []);

      async function _signInGoogle(){
        try {
          await GoogleSignin.hasPlayServices();
          const userInfo = await GoogleSignin.signIn();
          setuserInfo({ userInfo });
          console.log("userInfo", userInfo);
           
          var req={Email:userInfo.user.email, SocialID:userInfo.user.id, SocialType:"google", Name:userInfo.user.name}
          checkSocialUser(req);
          
        } catch (error) {
          if (error.code === statusCodes.SIGN_IN_CANCELLED) {
            // user cancelled the login flow
          } else if (error.code === statusCodes.IN_PROGRESS) {
            // operation (e.g. sign in) is in progress already
          } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
            // play services not available or outdated
          } else {
            // some other error happened
          }
          
          console.log("error", error)
        }
    };

    async function checkSocialUser(req){
      console.log("LoginBySocialService req", req);
        Api.LoginBySocialService(req).then(async(resp)=>{
            console.log("LoginBySocialService resp", resp);
            if (resp != null && resp.ResponseCode == 200 && resp.data!=null && resp.data.AccessToken!=null) {
                Auth.Login({ access_token: resp.data.AccessToken, token_type:resp.data.TokenType, profile:resp.data.Profile }).then(()=>{
                    if(resp.data.Profile.UserType==Auth.UserType.ENDUSER)
                      navigation.replace("UserHomeScreen");
                    else if(resp.data.Profile.UserType==Auth.UserType.ASTROLOGER)
                      navigation.replace("ExpertHomeScreen");
                });
            }
            else if(resp.ResponseCode==404 || resp.ResponseCode==100 || (resp.ResponseCode == 200 && resp.data==null) || (resp.data !=null && resp.data.Email==null)){
                var data= {RegistrationUsing:"Socia", ...req };
                navigation.replace("SigninUpdateInfoScreen",{screen:"SociaLogin", data});
            } 
            else {
                alert("Oops! something went wrong. please try again later."); 
            }
        });
    }

    return(
        <View>
            <TouchableOpacity onPress={()=>_signInGoogle()}>
                <View style={{flexDirection:"row", alignItems:"center", alignContent:"space-between", backgroundColor:"#fff", borderRadius:30, padding:10, marginBottom:20}}>
                <Image style={{width:50,height:50}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/google-logo.png`}}/>
                <Text style={{paddingLeft:30, fontSize:18}}>Join with Google</Text>
              </View>
            </TouchableOpacity>

           
            {/* <TouchableOpacity onPress={()=>_onAppleButtonPress()}>
                <View style={{flexDirection:"row", alignItems:"center", alignContent:"space-between", backgroundColor:"#fff", borderRadius:30, padding:10,}}>
                    <Image style={{width:50,height:50}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/fb-logo.png`}}/>
                    <Text style={{paddingLeft:30, fontSize:18}}>Join with Facebook</Text>
                </View>
            </TouchableOpacity>  */}
            
             
        </View>
    )
}



