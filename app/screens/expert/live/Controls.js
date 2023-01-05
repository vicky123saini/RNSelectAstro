import React from 'react';
import {TouchableOpacity, View, Text, Image} from 'react-native';
import * as env from '../../../../env';

export const PinkButton = (props) => {
    return(
        <TouchableOpacity onPress={props.onPress}>
            <View style={[{height:50, backgroundColor:"#E62375", borderRadius:10, flexDirection:"row", alignItems:"center", justifyContent:"center"}, props.style]}>
                <Text style={{color:"#fff", marginRight:20}}>{props.children}</Text>
                <Image style={{width:24, height:24}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/live/calendar-check-w.png`}} />
            </View>
        </TouchableOpacity>
    )
} 


export const GrayButton = (props) => {
    return(
        <TouchableOpacity onPress={props.onPress}>
            <View style={[{height:50, backgroundColor:"#E6E6E6", borderRadius:10, flexDirection:"row", alignItems:"center", justifyContent:"center"}, props.style]}>
                <Text style={{color:"#642F87", marginRight:20}}>{props.children}</Text>
                <Image style={{width:24, height:24}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/live/calendar-check-p.png`}} />
            </View>
        </TouchableOpacity>
    )
}