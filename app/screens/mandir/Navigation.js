import React, {Component} from 'react';
import {Image,View, Text, TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import * as env from '../../../env';
import MainStyles from '../../Styles';
import * as Api from '../../Api'; 
import * as Auth from '../../Auth';

import HomeScreen from './HomeScreen';
import TimeTableScreen from './TimeTableScreen';
import FeedbackScreen from './FeedbackScreen';

const Tab = createBottomTabNavigator(); 

export function LogoTitle() {
  return (
    <Image style={{width:72, height:28}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/logo.png`}}/>
  );
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
      <Tab.Screen name="TimeTableScreen" component={TimeTableScreen} options={{tabBarLabel:"Time Table", title: "TimeTableScreen"}}/>
      <Tab.Screen name="FeedbackScreen" component={FeedbackScreen} options={{tabBarLabel:"Feedback", title: "पूर्ण पूजा फीडबैक"}}/>
    </Tab.Navigator> 
    );
  }
}

  export function MyTabBar({ state, descriptors, navigation }) {
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
              ? {uri:`${env.AssetsBaseURL}/assets/images/tab-icons/home-active.png`}
              : {uri:`${env.AssetsBaseURL}/assets/images/tab-icons/home.png`};
              break;
            }
            case 'TimeTableScreen':{
              iconName = isFocused
              ? {uri:`${env.AssetsBaseURL}/assets/images/tab-icons/blog-active.png`}
              : {uri:`${env.AssetsBaseURL}/assets/images/tab-icons/blog.png`};
              break;
            }
            case 'FeedbackScreen':{
              iconName = isFocused
              ? {uri:`${env.AssetsBaseURL}/assets/images/tab-icons/feedback-active.png`}
              : {uri:`${env.AssetsBaseURL}/assets/images/tab-icons/feedback.png`};
              break;
            }
          }

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
              
                
                  <View style={[{backgroundColor:"#fff",alignItems:"center", paddingVertical:5},isFocused?{borderTopColor:"#FF0000", borderTopWidth:1}:{}]}>
                    <Image style={{width:28, height:28}} resizeMode="stretch" source={iconName} />
                    <Text style={[MainStyles.text, {fontSize:16, color: isFocused ? '#673ab7' : '#222' }]}>
                      {label}
                    </Text>
                  </View>
                
              
            </TouchableOpacity>
          );
        })}
      </View>
    );
  }
