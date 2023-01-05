import React, { Component } from 'react';
import { Image, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import AppStartScreen from './screens/AppStartScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/accounts/LoginScreen';
import SigninScreen from './screens/accounts/SigninScreen';
import OTPScreen from './screens/accounts/OTPScreen';
import SigninUpdateInfoScreen from './screens/accounts/SigninUpdateInfoScreen';
import LanguageChoiseScreen from './screens/accounts/LanguageChoiseScreen';
import WelcomeScreen from './screens/accounts/WelcomeScreen';
import ChatScreen from './screens/ChatScreen';
import VideoCallScreen from './screens/VideoCallScreen';
import NotificationHistoryScreen from './screens/NotificationHistoryScreen';
import VSYoutubeVideoPlayer from './controls/VSYoutubeVideoPlayer';
import TestScreen from './screens/TestScreen';
import VideoCallTestScreen from './screens/VideoCallTestScreen';
import ScanQRCodeScreen from './screens/ScanQRCodeScreen';

//User Screens
import UserProfile from './screens/user/UserProfile';
import YourHoroscopeScreen from './screens/user/horoscope/YourHoroscopeScreen';
import OtherHoroscopeScreen from './screens/user/horoscope/OtherHoroscopeScreen';
import AllHoroscopeScreen from './screens/user/horoscope/AllHoroscopeScreen';
import RechargeHistory from './screens/user/RechargeHistory';
import CallHistoryScreen from './screens/user/CallHistoryScreen';
import WalletHistoryScreen from './screens/user/WalletHistoryScreen';
import ExpertListScreen from './screens/user/ExpertListScreen';
import ExpertDetailsScreen from './screens/user/ExpertDetailsScreen';
import SearchScreen from './screens/user/SearchScreen';
import LearnAstrologyScreen from './screens/user/LearnAstrologyScreen';
import WalletScreen from './screens/user/WalletScreen'; 
import SuccessScreen from './screens/user/SuccessScreen';
import PaymentDetails from './screens/user/PaymentDetails';
import BlogDetailScreen from './screens/BlogDetailScreen';
import UserContactUsScreen from './screens/user/ContactUsScreen';
import ExpertContactUsScreen from './screens/expert/ContactUsScreen';
import AboutScreen from './screens/AboutScreen';
import UpdateUserProfile from './screens/user/UpdateUserProfile';
import ChakraScreen from './screens/user/ChakraScreen';
import KundaliScreen from './screens/user/KundaliScreen';
import MatchmakingScreen from './screens/user/MatchmakingScreen';
import PanchangScreen from './screens/user/PanchangScreen';
import AnnualHoroscopeScreen from './screens/user/AnnualHoroscopeScreen';
import PoojaListScreen from './screens/user/pooja/PoojaListScreen';
import UserPoojaDetailsScreen from './screens/user/pooja/PoojaDetailsScreen';
import CheckoutScreen from './screens/user/pooja/CheckoutScreen';
import MandirImageGalleryScreen from './screens/user/pooja/MandirImageGalleryScreen';
import PoojaPaymentDetails from './screens/user/pooja/PaymentDetails';
import MyBookingsScreen from './screens/user/pooja/MyBookingsScreen';
import MyBookingDetailsScreen from './screens/user/pooja/MyBookingDetailsScreen';
import PoojsSuccessScreen from './screens/user/pooja/SuccessScreen';
import PoojaContactUsScreen from './screens/user/pooja/PoojaContactUsScreen';
import BasicHoroscopePDFScreen from './screens/user/pdfDownload/BasicHoroscopePDFScreen';
import AdvancedHoroscopePDFScreen from './screens/user/pdfDownload/AdvancedHoroscopePDFScreen';
import MatchmakingPDFScreen from './screens/user/pdfDownload/MatchmakingPDFScreen';
import UserFeedbackScreen from './screens/user/UserFeedbackScreen';
import PdfViewerScreen from './screens/user/pdfDownload/PdfViewerScreen';
import PoojaVideoCallScreen from './screens/PoojaVideoCallScreen';
import BlogListScreen from './screens/BlogListScreen';
import AudioPlayerScreen from './screens/AudioPlayerScreen';
//****//

//Expert
import CallerDetailScreen from './screens/expert/CallerDetailScreen';
import ExpertFeedbackScreen from './screens/expert/FeedbackScreen';
//****//

//Mandir
import PoojaDetailsScreen from './screens/mandir/PoojaDetailsScreen';
import FeedbackReplyScreen from './screens/mandir/FeedbackReplyScreen';
//****/

//Gau Seva
import GauDaanHomeScreen from './screens/user/gauDaan/HomeScreen';
import GauDaanDetailsScreen from './screens/user/gauDaan/DetailsScreen';
import GauDaanDonateSuccessfullyScreen from './screens/user/gauDaan/DonateSuccessfullyScreen';
import GauDaanBuyMoreScreen from './screens/user/gauDaan/BuyMoreScreen';
import GauDaanPaymentDetailsScreen from './screens/user/gauDaan/PaymentDetailsScreen';
import GauDaanTransactionHistoryScreen from './screens/user/gauDaan/TransactionHistoryScreen';
import GauDaanImageGalleryScreen from './screens/user/gauDaan/ImageGalleryScreen';
/*****/

import * as UserNavigation from './screens/user/Navigation';
import * as ExpertNavigation from './screens/expert/Navigation'
import * as MandirNavigation from './screens/mandir/Navigation'

//Referral
import ReferCountStatusScreen from './screens/user/Referral/ReferCountStatusScreen';
import WinnersScreen from './screens/user/Referral/WinnersScreen';
import MyReferralListScreen from './screens/user/Referral/MyReferralListScreen';
/*****/

//footer menu for user
import UserHomeScreen from './screens/user/HomeScreen';
import HoroscopeScreen from './screens/user/horoscope/HoroscopeScreen';
//import ExpertListScreen from './screens/user/ExpertListScreen';
//import UserProfile from './screens/user/UserProfile';
//import BlogListScreen from './screens/BlogListScreen';
//import PoojaListScreen from './screens/user/pooja/PoojaListScreen';
/***/

/**Live - User***/
import Live_Usr_LiveSessionListScreen from './screens/user/live/LiveSessionListScreen';
import Live_Usr_NotifyMeScreen from './screens/user/live/NotifyMeScreen';
import Live_Usr_GoLiveScreen from './screens/user/live/GoLiveScreen';
/*****/

/**Live - Expert**/
import Live_Exp_MyLiveSessionsScreen from './screens/expert/live/MyLiveSessionsScreen';
import Live_Exp_ScheduleLiveScreen from './screens/expert/live/ScheduleLiveScreen';
import Live_Exp_CreateLiveSession from './screens/expert/live/CreateLiveSession';
import Live_Exp_GoLiveScreen from './screens/expert/live/GoLiveScreen';
/*******/

/**Chai Wala - User */
import ChaiWalaHomeScreen from './screens/chaiWala/HomeScreen';
/**** */

import * as env from '../env';
import MainStyles from './Styles';
import * as Api from './Api';
import * as Auth from './Auth';

const Stack = createStackNavigator();



//Navigation
class Navigation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading:true
    };
  }

  render() {
    return(
    <NavigationContainer>
      <RootNavigation/>
    </NavigationContainer>
    );
  }
}

const RootNavigation = () => {
  return ( 
      <Stack.Navigator initialRouteName="AppStartScreen">
        
        {/* <Stack.Screen name="TestScreen" component={TestScreen} options={{title:"Loading..."}}></Stack.Screen>  */}
        {/* <Stack.Screen name="VideoCallTestScreen" component={VideoCallTestScreen} options={{title:"Loading..."}}></Stack.Screen> */}
        <Stack.Screen name="AppStartScreen" component={AppStartScreen} options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name="SigninScreen" component={SigninScreen} options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name="OTPScreen" component={OTPScreen} options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name="LanguageChoiseScreen" component={LanguageChoiseScreen} options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name="SigninUpdateInfoScreen" component={SigninUpdateInfoScreen} options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name="BlogListScreen" component={BlogListScreen} options={{title:"Suvichar"}}></Stack.Screen>

        <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ headerShown: false }}></Stack.Screen>
        
        <Stack.Screen name="UserHomeScreen" component={UserHomeScreen} options={{ headerShown: false }}></Stack.Screen>
        {/* <Stack.Screen name="UserHomeScreen" component={UserNavigation.FooterTabNavigation} 
          options={({ navigation, route }) => ({
            headerLeft:null,
            headerTitle: props => <UserNavigation.LogoTitle {...props} navigation={navigation}/>,
            headerRight: props => <UserNavigation.NavigatorMenu {...props} navigation={navigation}/>
          })}
        /> */}
        
        <Stack.Screen name="ExpertListScreen" component={ExpertListScreen} options={{headerShown:false}}></Stack.Screen>
        <Stack.Screen name="ExpertDetailsScreen" component={ExpertDetailsScreen} options={{headerShown:false}}></Stack.Screen>
        <Stack.Screen name="SearchScreen" component={SearchScreen} options={{headerShown:false}}></Stack.Screen>
        <Stack.Screen name="LearnAstrologyScreen" component={LearnAstrologyScreen} options={{title:"Learn Astrology"}}></Stack.Screen>
        <Stack.Screen name="WalletScreen" component={WalletScreen} options={{headerShown:false}}></Stack.Screen>
        <Stack.Screen name="PaymentDetails" component={PaymentDetails} options={{title:"Payment Details"}}></Stack.Screen>
        <Stack.Screen name="SuccessScreen" component={SuccessScreen} options={{title:"Success"}}></Stack.Screen>
        <Stack.Screen name="VideoCallScreen" component={VideoCallScreen} options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name="NotificationHistoryScreen" component={NotificationHistoryScreen} options={{ title:"Notifications" }}></Stack.Screen>
  
        <Stack.Screen name="UserProfile" component={UserProfile} options={{title: "Profile"}}></Stack.Screen>
        <Stack.Screen name="HoroscopeScreen" component={HoroscopeScreen} options={{title: "Horoscope"}}></Stack.Screen>
        <Stack.Screen name="YourHoroscopeScreen" component={YourHoroscopeScreen} options={{title: "Horoscope"}}></Stack.Screen>
        <Stack.Screen name="AllHoroscopeScreen" component={AllHoroscopeScreen} options={{title:"Horoscope"}}></Stack.Screen>
        <Stack.Screen name="OtherHoroscopeScreen" component={OtherHoroscopeScreen} options={{title:"Horoscope"}}></Stack.Screen>
        <Stack.Screen name="UpdateUserProfile" component={UpdateUserProfile} options={{title:"Update Profile"}}></Stack.Screen>
        <Stack.Screen name="RechargeHistory" component={RechargeHistory} options={{title:"Recharge History"}}></Stack.Screen>
        <Stack.Screen name="CallHistoryScreen" component={CallHistoryScreen} options={{headerShown:false}}></Stack.Screen>
        <Stack.Screen name="WalletHistoryScreen" component={WalletHistoryScreen} options={{title:"Wallet history"}}></Stack.Screen>
        <Stack.Screen name="BlogDetailScreen" component={BlogDetailScreen} options={{title:"Loading...."}}></Stack.Screen>
        <Stack.Screen name="UserContactUsScreen" component={UserContactUsScreen} options={{title:"Contact Us"}}></Stack.Screen>
        <Stack.Screen name="ExpertContactUsScreen" component={ExpertContactUsScreen} options={{title:"Contact Us"}}></Stack.Screen>
        <Stack.Screen name="AboutScreen" component={AboutScreen} options={{title:"About Select Astro"}}></Stack.Screen>
        <Stack.Screen name="VSYoutubeVideoPlayer" component={VSYoutubeVideoPlayer} options={{title:"Video"}}></Stack.Screen>
        <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: false }}></Stack.Screen>
        <Stack.Screen name="CallerDetailScreen" component={CallerDetailScreen} options={{title:"About Caller"}}></Stack.Screen>
        <Stack.Screen name="ExpertFeedbackScreen" component={ExpertFeedbackScreen} options={{title:"Customer Feedback Form"}}></Stack.Screen>
        <Stack.Screen name="ChakraScreen" component={ChakraScreen} options={{title:"The Chakra: Spin Daily & Win"}}></Stack.Screen>
        <Stack.Screen name="KundaliScreen" component={KundaliScreen} options={{headerShown: false}}></Stack.Screen>
        <Stack.Screen name="MatchmakingScreen" component={MatchmakingScreen} options={{headerShown: false}}></Stack.Screen>
        <Stack.Screen name="PanchangScreen" component={PanchangScreen} options={{headerShown: false}}></Stack.Screen>
        <Stack.Screen name="AnnualHoroscopeScreen" component={AnnualHoroscopeScreen} options={{headerShown: false}}></Stack.Screen>
        <Stack.Screen name="ScanQRCodeScreen" component={ScanQRCodeScreen} options={{title:"Scan"}}></Stack.Screen>

        <Stack.Screen name="UserPoojaDetailsScreen" component={UserPoojaDetailsScreen} options={{headerShown: false}}></Stack.Screen>
        <Stack.Screen name="CheckoutScreen" component={CheckoutScreen} options={{headerShown: false}}></Stack.Screen>
        <Stack.Screen name="MandirImageGalleryScreen" component={MandirImageGalleryScreen} options={{title:"Temple Photos"}}></Stack.Screen>
        <Stack.Screen name="PoojaPaymentDetails" component={PoojaPaymentDetails} options={{title:"Payment Details"}}></Stack.Screen>
        <Stack.Screen name="MyBookingsScreen" component={MyBookingsScreen} options={{headerShown: false}}></Stack.Screen>
        
        <Stack.Screen name="BasicHoroscopePDFScreen" component={BasicHoroscopePDFScreen} options={{title:"Kundali 2022 Report"}}></Stack.Screen>
        <Stack.Screen name="AdvancedHoroscopePDFScreen" component={AdvancedHoroscopePDFScreen} options={{title:"Horoscope 2022 Report"}}></Stack.Screen>
        <Stack.Screen name="MatchmakingPDFScreen" component={MatchmakingPDFScreen} options={{title:"Matchmaking 2022 Report"}}></Stack.Screen>
        <Stack.Screen name="UserFeedbackScreen" component={UserFeedbackScreen} options={{title:"Customer Feedback Form"}}></Stack.Screen>
        <Stack.Screen name="PdfViewerScreen" component={PdfViewerScreen} options={{headerShown: false}}></Stack.Screen>

        <Stack.Screen name="GauDaanHomeScreen" component={GauDaanHomeScreen} options={{headerShown: false}}></Stack.Screen>
        <Stack.Screen name="GauDaanDetailsScreen" component={GauDaanDetailsScreen} options={{title:"Gau Seva"}}></Stack.Screen>
        <Stack.Screen name="GauDaanDonateSuccessfullyScreen" component={GauDaanDonateSuccessfullyScreen} options={{title:"Gau Seva"}}></Stack.Screen>
        <Stack.Screen name="GauDaanBuyMoreScreen" component={GauDaanBuyMoreScreen} options={{title:"Gau Seva"}}></Stack.Screen>
        <Stack.Screen name="GauDaanPaymentDetailsScreen" component={GauDaanPaymentDetailsScreen} options={{title:"Payment Details"}}></Stack.Screen>
        <Stack.Screen name="GauDaanTransactionHistoryScreen" component={GauDaanTransactionHistoryScreen} options={{title:"Payment Details"}}></Stack.Screen>
        <Stack.Screen name="GauDaanImageGalleryScreen" component={GauDaanImageGalleryScreen} options={{title:"Gallery"}}></Stack.Screen>

        <Stack.Screen name="ExpertHomeScreen" component={ExpertNavigation.FooterTabNavigation} 
          options={({ navigation, route }) => ({
            headerLeft:null,
            headerTitle: props => <ExpertNavigation.LogoTitle {...props} />
          })}
        />
        
        <Stack.Screen name="PoojaDetailsScreen" component={PoojaDetailsScreen} options={{title:"लाइव"}}></Stack.Screen>
        <Stack.Screen name="FeedbackReplyScreen" component={FeedbackReplyScreen} options={{title:"लाइव"}}></Stack.Screen>
        <Stack.Screen name="MyBookingDetailsScreen" component={MyBookingDetailsScreen} options={{headerShown: false}}></Stack.Screen>
        <Stack.Screen name="PoojsSuccessScreen" component={PoojsSuccessScreen} options={{headerShown: false}}></Stack.Screen>
        <Stack.Screen name="PoojaContactUsScreen" component={PoojaContactUsScreen} options={{title:"Loading..."}}></Stack.Screen>
        <Stack.Screen name="PoojaListScreen" component={PoojaListScreen} options={{headerShown: false}}></Stack.Screen>
        <Stack.Screen name="PoojaVideoCallScreen" component={PoojaVideoCallScreen} options={{headerShown: false}}></Stack.Screen>

        <Stack.Screen name="ReferCountStatusScreen" component={ReferCountStatusScreen} options={{title:null}}></Stack.Screen>
        <Stack.Screen name="WinnersScreen" component={WinnersScreen} options={{title:"Loading..."}}></Stack.Screen>
        <Stack.Screen name="MyReferralListScreen" component={MyReferralListScreen} options={{title:"Succesfull Referral"}}></Stack.Screen>
        <Stack.Screen name="AudioPlayerScreen" component={AudioPlayerScreen} options={{title:"Call Recording"}}></Stack.Screen>
        
        <Stack.Screen name="MandirHomeScreen" component={MandirNavigation.FooterTabNavigation} 
          options={({ navigation, route }) => ({
            headerLeft:null,
            headerTitle: props => <MandirNavigation.LogoTitle {...props} />,
            headerRight: props => <View><TouchableOpacity onPress={()=> {Auth.Logout(); navigation.replace("AppStartScreen")}}><Text style={{paddingVertical:5, paddingHorizontal:10, marginHorizontal:10, backgroundColor:"#F09B39", borderRadius:10, color:"#fff"}}>Logout</Text></TouchableOpacity></View>
          })}
        /> 

        <Stack.Screen name="Live_Usr_LiveSessionListScreen" component={Live_Usr_LiveSessionListScreen} options={{title:"Live Session"}}></Stack.Screen>
        <Stack.Screen name="Live_Usr_NotifyMeScreen" component={Live_Usr_NotifyMeScreen} options={{headerShown: false}}></Stack.Screen>
        <Stack.Screen name="Live_Usr_GoLiveScreen" component={Live_Usr_GoLiveScreen} options={{headerShown: false}}></Stack.Screen>

        <Stack.Screen name="Live_Exp_MyLiveSessionsScreen" component={Live_Exp_MyLiveSessionsScreen} options={{headerShown: false}}></Stack.Screen>
        <Stack.Screen name="Live_Exp_ScheduleLiveScreen" component={Live_Exp_ScheduleLiveScreen} options={{headerShown: false}}></Stack.Screen>
        <Stack.Screen name="Live_Exp_CreateLiveSession" component={Live_Exp_CreateLiveSession} options={{headerShown: false}}></Stack.Screen>
        <Stack.Screen name="Live_Exp_GoLiveScreen" component={Live_Exp_GoLiveScreen} options={{headerShown: false}}></Stack.Screen>

        <Stack.Screen name="ChaiWalaHomeScreen" component={ChaiWalaHomeScreen} options={{headerShown: false}}></Stack.Screen>
      </Stack.Navigator>
  );
}

export default Navigation;