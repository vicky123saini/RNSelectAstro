import React, {Component, useEffect, useState} from 'react';
import {Image,View, Text, TouchableOpacity, ImageBackground } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './HomeScreen';
import HoroscopeScreen from './horoscope/HoroscopeScreen';
import ExpertListScreen from '../user/ExpertListScreen';
import UserProfile from '../user/UserProfile';
import BlogListScreen from '../BlogListScreen';
import PoojaListScreen from './pooja/PoojaListScreen';
import analytics from '@react-native-firebase/analytics';
import * as env from '../../../env';
import MainStyles from '../../Styles';
import {Singular} from 'singular-react-native';
import { Avatar } from 'react-native-elements';
import * as Api from '../../Api';
import * as Auth from '../../Auth';

const Tab = createBottomTabNavigator(); 

export const LogoTitle = (props) => {
  const[profile, setProfile]=useState(null);
  useEffect(()=>{
    Auth.getProfie().then(resp=>setProfile(JSON.parse(resp))).catch(()=> console.error("err useEffect LogoTitle navigation"));
  },[]);
 
  return (
    <TouchableOpacity style={{flex:1, flexDirection:"row", alignItems:"center"}} onPress={()=> props.navigation.navigate("UserProfile")}>
      {
        profile != null && profile.ProfileImage != null &&
        <Avatar size={40} rounded source={{uri:`${env.DynamicAssetsBaseURL}${profile.ProfileImage}`}}/>
      }
      <Text style={{marginLeft:10, fontSize:14, fontWeight:"500", width:150}} numberOfLines={1}>Namaskar {profile != null && profile.Name != null ? profile.Name : ""}</Text>
    </TouchableOpacity>
  );
}
 
export class NavigatorMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount = () => {
    Api.GetBalanceService().then(resp=> {
      console.log("GetBalanceService resp", resp);
      global.WalletDetails = resp.data;
      this.setState({WalletLoaded:true})
    });
    Api.GetNotificationNewCountService().then(resp=>{
      console.log("GetNotificationNewCountService resp", resp);
      if (resp.ResponseCode == 200 && resp.data && resp.data.Count) {
        this.setState({Count:resp.data.Count});
      }
    })
    
  };

  onWalletPress = () => {
    analytics().logEvent("Wallet_Icon_on_Home");
    this.props.navigation.navigate("WalletScreen");
  }

  onNotificationPress = () =>{
    this.setState({Count:null});
    this.props.navigation.navigate("NotificationHistoryScreen")
  }
  

  render() {
    return (
      <View style={{flexDirection:"row", alignContent:"center", alignItems:"center", justifyContent:"center"}}>
      {/* <View style={{marginRight:10}}>
        <TouchableOpacity onPress={()=> this.props.navigation.navigate("ExpertListScreen")}>
          <Image style={{width:16,height:16}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/search.png`}}/>
        </TouchableOpacity>
      </View> */}
      <View style={{marginRight:10}}>
        <TouchableOpacity onPress={()=> this.onWalletPress()}>
          <View style={{flexDirection:"row", alignItems:"center", paddingHorizontal:7, justifyContent:"space-between", borderWidth:.5, borderRadius:10, borderColor:"E5E5E5", height:32, minWidth:50}}>
            <View style={{width:20, height:20, borderRadius:10, borderWidth:2, borderColor:"#F0C839", backgroundColor:"#FFE074"}}/>
            {
              this.state.WalletLoaded &&
              <Text style={[MainStyles.text,{fontSize:16,paddingHorizontal:5}]}>₹ {global.WalletDetails ? global.WalletDetails.Balance : "..."}</Text>
              ||
              <Text style={[MainStyles.text,{fontSize:16}]}>₹  ...</Text>
            }
          </View>
        </TouchableOpacity>
      </View>

      <View>
        <TouchableOpacity onPress={()=> this.onNotificationPress()}>
          {/* <ImageBackground style={{width:20,height:20}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/bell-860.png`}}> */}
          <ImageBackground style={{width:20,height:20}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/bell-icon.png`}}>
          {
          this.state.Count !=null && this.state.Count>0 &&
          <Text style={{width:"100%", color:"red", fontSize:20, textAlign:"right"}}>*</Text>
          }
          </ImageBackground>
        </TouchableOpacity>
      </View>

      
     
      
  </View>
    );
  }
}



//FooterTabNavigation

export class FooterTabNavigation extends Component {
  constructor(props) {
    super(props);

    this.state = {
    };
  }

render(){
    return(

    <Tab.Navigator tabBar={MyTabBar}>
      <Tab.Screen name="HomeScreen" component={HomeScreen} options={{title: "Home"}}/>
      <Tab.Screen name="HoroscopeScreen" component={HoroscopeScreen} options={{title: "Horoscope"}}/>
      {/* <Tab.Screen name="BlogListScreen" component={BlogListScreen} options={{title: "Suvichar"}}/> */}
      <Tab.Screen name="ExpertListScreen" component={ExpertListScreen} options={{title: "Consult"}}/>
      <Tab.Screen name="PoojaListScreen" component={PoojaListScreen} options={{title: "Puja"}}/>
      <Tab.Screen name="UserProfile" component={UserProfile} options={{title: "Profile", tabBarLabel:"More"}}/>
    </Tab.Navigator>
    );
  }
}

  export function MyTabBar({ state, descriptors, navigation }) {
    Singular.eventWithArgs("Tab_Click",{index: state.index});

    const focusedOptions = descriptors[state.routes[state.index].key].options;
  
    if (focusedOptions.tabBarVisible === false) {
      return null;
    }
  
    
    return (
      <View style={{ flexDirection: 'row', alignContent:"center", alignItems:"center" }}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;
  
          const isFocused = state.index === index;
          let iconName;
          switch(route.name){
            case 'HomeScreen':{
              iconName = isFocused
              ? {uri:`${env.AssetsBaseURL}/assets/images/tab-icons-new/home-active.png`}
              : {uri:`${env.AssetsBaseURL}/assets/images/tab-icons-new/home.png`};
              break;
            }
            case 'HoroscopeScreen':{
              iconName = isFocused 
                 ? {uri:`${env.AssetsBaseURL}/assets/images/tab-icons-new/astrology-active.png`}
              : {uri:`${env.AssetsBaseURL}/assets/images/tab-icons-new/astrology.png`};
              break;
            }
            case 'ExpertListScreen':{
              iconName = isFocused
              ? {uri:`${env.AssetsBaseURL}/assets/images/tab-icons-new/call-active.png`}
              : {uri:`${env.AssetsBaseURL}/assets/images/tab-icons-new/call.png`};
              break;
            }
            case 'PoojaListScreen':{
              iconName = isFocused
              ? {uri:`${env.AssetsBaseURL}/assets/images/tab-icons-new/puja-active.png`}
              : {uri:`${env.AssetsBaseURL}/assets/images/tab-icons-new/puja.png`};
              break;
            }
            case 'UserProfile':{
              iconName = isFocused
              ? {uri:`${env.AssetsBaseURL}/assets/images/icons/ic_more_1_hdpi.png`}
              : {uri:`${env.AssetsBaseURL}/assets/images/icons/ic_more_0_hdpi.png`};
              break;
            }
          }
          // switch(route.name){
          //   case 'HomeScreen':{
          //     iconName = isFocused
          //     ? {uri:`${env.AssetsBaseURL}/assets/images/tab-icons/home-active.png`}
          //     : {uri:`${env.AssetsBaseURL}/assets/images/tab-icons/home.png`};
          //     break;
          //   }
          //   case 'HoroscopeScreen':{
          //     iconName = isFocused 
          //     ? {uri:`${env.AssetsBaseURL}/assets/images/tab-icons/astrology-active.png`}
          //     : {uri:`${env.AssetsBaseURL}/assets/images/tab-icons/astrology.png`};
          //     break;
          //   }
          //   case 'BlogListScreen':{
          //     iconName = isFocused
          //     ? {uri:`${env.AssetsBaseURL}/assets/images/tab-icons/video-active.png`}
          //     : {uri:`${env.AssetsBaseURL}/assets/images/tab-icons/video.png`};
          //     break;
          //   }
          //   case 'UserProfile':{
          //     iconName = isFocused
          //     ? {uri:`${env.AssetsBaseURL}/assets/images/tab-icons/profile-active.png`}
          //     : {uri:`${env.AssetsBaseURL}/assets/images/tab-icons/profile.png`};
          //     break;
          //   }
          // }

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
  
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };
  
          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };
  
          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityStates={isFocused ? ['selected'] : []}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{ flex: 1 }}
            >
              
                
                  <View style={[{backgroundColor:"#fff",alignItems:"center", paddingVertical:10}, isFocused ? {/*borderTopColor:"#FF0000", borderTopWidth:1*/}:{}]}>
                    <Image style={{width:28, height:28}} resizeMode="stretch" source={iconName} />
                    <Text style={[MainStyles.text, {fontSize:14, marginTop:10}, isFocused?{color:"#F09B39", fontWeight:"bold"}:{color:"#000"}]}>
                      {label}
                    </Text>
                  </View>
                
              
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }

