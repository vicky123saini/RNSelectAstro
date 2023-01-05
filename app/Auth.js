import React, {useState, useEffect} from 'react';
import {Platform, View, Text, Linking, TouchableOpacity, Image, ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import AsyncStorage from '@react-native-community/async-storage';
import { StackActions } from '@react-navigation/native';
import firebase from '@react-native-firebase/app';
import messaging from '@react-native-firebase/messaging';
import { getVersion } from 'react-native-device-info';
import Overlay from 'react-native-modal-overlay';
import * as Api from './Api';
import * as env from '../env';
import MainStyles from './Styles';
import {Singular} from 'singular-react-native';
import moment from 'moment';

export const Login = async ({ access_token, token_type, profile }) => {
    var token_type_access_token=token_type+' '+access_token;
    await set_access_token(token_type_access_token);
    await set_profile(profile);
    return true;
}

// export const Logout = ({navigation}) => {
//     ApiServices.LogOut().then((resp)=>{
//         console.log("LogOut")
//         console.log(resp);
//         AsyncStorage.clear();
//         try{
//             GoogleSignin.isSignedIn().then(resp=>{
//                 if(resp){
//                     GoogleSignin.signOut();
//                 }
//             });
//         }
//         catch{}
//         navigation.dispatch(StackActions.popToTop());
//         navigation.replace("Login");
//     });
// }

export const Logout = () => {
    try{
        AsyncStorage.clear();
    }
    catch{
        
    }
}

export const RemoveSession = ({navigation})=>{
    console.log("RemoveSession")
    AsyncStorage.clear();
    navigation.replace("AppStartScreen");
}

export const getProfie = async () => {
    return await AsyncStorage.getItem('profile');
}

export const UpdateMobileno = async(MobileNo) => {
    try{
        var profile=await AsyncStorage.getItem('profile');
        var jsonprofile=JSON.parse(profile);
        jsonprofile.MobileNo=MobileNo;
        await set_profile(jsonprofile);
    }
    catch{
        console.error("err UpdateMobileno Auth")
    }
    return;
}

export const isLowBalancePopupView = async () => {
    //await AsyncStorage.setItem('low_bal_view_date', moment().add(-2, 'days').toString());
    // try{
    //     var low_bal_view_date = await AsyncStorage.getItem('low_bal_view_date');
    //     //console.log("low_bal_view_date", low_bal_view_date, moment(low_bal_view_date), moment().add(-1, 'days'), moment().toString())
    //     if(low_bal_view_date == null || moment(low_bal_view_date).format('L') != moment().format('L')){
    //         await AsyncStorage.setItem('low_bal_view_date', moment().toString());
    //         return true;
    //     } 
    //     else return false;
    // }
    // catch{
    //     return true;
    // }
    return true;
}

export const isWelcomePopup = async () =>{
    try{
        var Welcome_Popup_Interval_In_Hours=await Api.GetAppSettingByKetService(AppSettingKey.Welcome_Popup_Interval_In_Hours).then(resp=>resp.data);
        if(Welcome_Popup_Interval_In_Hours==null || Welcome_Popup_Interval_In_Hours=="False") return true;

        var IntervalHours=parseInt(Welcome_Popup_Interval_In_Hours);
        var Welcome_Popup_Interval_In_Hours_date = await AsyncStorage.getItem('Welcome_Popup_Interval_In_Hours_date');
        var dateDiffer=moment().diff(moment(Welcome_Popup_Interval_In_Hours_date), "hours");
        console.log("dateDiffer", dateDiffer)
        if(Welcome_Popup_Interval_In_Hours_date == null || dateDiffer>IntervalHours/*moment(Welcome_Popup_Interval_In_Hours_date).subtract(IntervalHours,'h') < moment().subtract(1,'millisecond')*/){
            await AsyncStorage.setItem('Welcome_Popup_Interval_In_Hours_date', moment().toString());
            return true;
        }
        else return false;
    }
    catch(e){
        console.log("isWelcomePopup err", e.toString())
        return true;
    }
} 

export const Access_Token = async () => {
    const Access = await AsyncStorage.getItem('access_token');
    return Access;
}

export const set_access_token = async (access_token) => {
    await AsyncStorage.setItem('access_token', access_token);
}

export const set_profile = async (profile) => {
    await AsyncStorage.setItem('profile', JSON.stringify(profile));
}

export const UserType = {
    ENDUSER:"EndUser",
    ASTROLOGER:"Astrologer",
    MANDIR_ADMIN:"Mandir_Admin",
    MANDIR_SUBADMIN:"Mandir_SubAdmin",
    Vendor:"Vendor"
}

export const AppSettingKey={
    APP_SPLASH_SCREEN_TEXT:"App_Splash_Screen_Text",
    CUSTOMER_WELCOME_SCREEN_TEXT:"Customer_Welcome_Screen_Text",
    Enable_Profile_Update_While_Registration:"Enable_Profile_Update_While_Registration",
    CurrentVersion_Android:"CurrentVersion_Android",
    CurrentVersion_IOS:"CurrentVersion_IOS",
    Enable_Google_Login_Button:"Enable_Google_Login_Button",
    Enable_Chakra_Popup:"Enable_Chakra_Popup",
    Coupon_Suggestion:"Coupon_Suggestion",
    Share_Text:"Share_Text",
    Share_Text_Puja:"Share_Text_Puja",
    App_Playstore_Link:"App_Playstore_Link",
    Share_Text_Ref_And_Ern:"Share_Text_Ref_And_Ern",
    Recommended_Gemstone_Default_Banner:"Recommended_Gemstone_Default_Banner",
    Welcome_Popup_Interval_In_Hours:"Welcome_Popup_Interval_In_Hours",
    PDF_View_IOS_Enable:"PDF_View_IOS_Enable",
    Horoscope_IOS_Enable:"Horoscope_IOS_Enable",
    Gau_Seva_Per_Meal_INR:"Gau_Seva_Per_Meal_INR",
    Gau_Seva_Per_Meal_Coin:"Gau_Seva_Per_Meal_Coin",
    Enable_Gau_Seva:"Enable_Gau_Seva",
    Enable_Tax_Rebate_Form:"Enable_Tax_Rebate_Form",
}

export const CallDetail_Status = {
    QUEUED:0,
    IN_PROCESS:1,
    COMPLETED:2,
    FAILED:3,
    BUSY:4,
    NO_ANSWER:5,
    NA:6
}

export const CallDetail_ServiceType={
    DAKSHINA:0,
    VOICE_CALL:1,
    CHAT:2,
    VIDEO_CALL:3,
    PDF_REPORT:10
}
export const WalletDetail_Type =
    {
        CREDIT:0,
        DEBIT:1
    }

    export const Chat_MessageType={
        JSON:0,
        SESSION_START_MESSAGE:1,
        TEXT_MESSAGE:2,
        IMAGE:3,
        INFO:9
    }

export const getFCMToken = async () => {
    // var firebaseConfig =  {
    //     appId:'1:102190068006:android:0346946868b88d0aedd1e7',
    //     apiKey: 'AIzaSyBwClJ0k6w6mqslbMlvExbq9m2u-5Xd1Tw',
    //     databaseURL:'https://databaseName.firebaseio.com',
    //     authDomain: 'selectastro-30edb.firebaseapp.com', 
    //     projectId: 'selectastro-30edb',
    //     storageBucket: 'selectastro-30edb.appspot.com',
    //     messagingSenderId: '102190068006'
    // }

    // var firebaseConfig = {
    //     apiKey: "AIzaSyBwClJ0k6w6mqslbMlvExbq9m2u-5Xd1Tw",
    //     authDomain: "selectastro-30edb.firebaseapp.com",
    //     projectId: "selectastro-30edb",
    //     storageBucket: "selectastro-30edb.appspot.com",
    //     messagingSenderId: "102190068006",
    //     appId: "1:102190068006:web:5ec87bcebced3a8bedd1e7",
    //     measurementId: "G-0YMM235PSR"
    //   };
    //await firebase.initializeApp(firebaseConfig);

    try {
        
        if(Platform.OS === 'ios') {
            await messaging().registerDeviceForRemoteMessages();
            await messaging().setAutoInitEnabled(true);
        }
        const token = await messaging().getToken();
        return token;

        //return "1";
        // await firebase.messaging().registerDeviceForRemoteMessages();
        // const fcmToken = await firebase.messaging().getToken();
        // return fcmToken;

    } catch (error) {
      console.log("getFCMToken error",error);
      return "";
    }
  };

export const UpdateAvaliable = () =>{
    //const[currentVersion, setCurrentVersion]=useState(null);
    const[showMessageBox, setShowMessageBox]=useState(false)
    const onUpgrade = () =>{
        //setShowMessageBox(false);
        //props.onClose();
        Singular.event("UpgradeApp");
        if(Platform.OS=="ios")
            Linking.openURL("itms-apps://apps.apple.com/id/app/halojasa/id1613296409");
        else
            Linking.openURL("market://details?id=com.rnselectastro");
    }
    const onClose = () =>{
        Singular.event("UpgradeAppLater");
        global.LaterUpdate=true;
        setShowMessageBox(false);
    }

    useEffect(()=>{
        if(global.LaterUpdate) return;
        Api.GetAppSettingByKetService(Platform.OS=="ios" ? AppSettingKey.CurrentVersion_IOS : AppSettingKey.CurrentVersion_Android).then(resp=>{
            console.log("GetAppSettingByKetService", resp);
            if(resp.data!=getVersion())
                setShowMessageBox(true);
          });
    },[])
    return(
        // <View>
        //     <Text>{Platform.OS}</Text>
        //     <Text>{currentVersion}</Text>
        //     <Text>{getVersion()}</Text>
        // </View>
        <Overlay childrenWrapperStyle={{ borderRadius: 30 }} visible={showMessageBox}>
            <ImageBackground style={{width:"100%", height:300}} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/bg-popup.png` }}>
            <View style={{ padding: 20, alignContent: "center", alignItems: "center", justifyContent: "center" }}>
                <Image style={{ width: 48, height: 83 }} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/rocket.png` }} />
                <Text style={[MainStyles.text, { marginBottom: 20, fontSize:15, fontWeight:"700", textAlign:"center" }]}>For more features and a better{'\n'}user experience, please update{'\n'}this app.</Text>
                {
                    <TouchableOpacity onPress={onUpgrade}>
                        <LinearGradient colors={["#7162FC", "#B542F2"]} start={{ x: 0, y: 0 }} end={{ x: 2, y: 2 }} style={{borderRadius:30, width:220, marginBottom:20}}>
                            <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>Upgrade</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                }
                {
                    <TouchableOpacity onPress={onClose}>
                        <Text style={{color:"#000", padding:15, fontSize:16, fontWeight:"bold", textAlign:"center", textDecorationLine:"underline"}}>Later</Text>
                    </TouchableOpacity>
                }
            </View>
            </ImageBackground>
        </Overlay>
    )
}