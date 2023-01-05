import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import styles from './Style';
import * as env from '../../../env';

export const Header = (props) => {
    return(
        <View style={styles.headerContainer}>
            <View style={styles.headerLeft}>
                <Image style={{width:116, height:39}} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/chai-wala/logo.png` }}/>
            </View>
            <View style={styles.headerRight}>
                <Image style={{width:19, height:19, marginHorizontal:10}} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/chai-wala/bell.png` }}/>
               <TouchableOpacity onPress={()=> props.onPressMenu()}><Image style={{width:21, height:16}} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/chai-wala/menu.png` }}/></TouchableOpacity>
            </View>
        </View>
    )
}

export const TabButton = (props) => {
    return(
    <TouchableOpacity onPress={props.onPress}>
        <View style={[styles.tabButton, props.active && styles.tabButtonActive]}>
            <Text style={styles.tabButtonText}>{props.text}</Text>
        </View>
    </TouchableOpacity>
    )
}

export const SlidMenuButton = (props) => {
    return(
    <TouchableOpacity onPress={props.onPress}>
        <View style={styles.slidMenuButton}>
            <Text style={styles.tabButtonText}>{props.text}</Text>
        </View>
    </TouchableOpacity>
    )
}