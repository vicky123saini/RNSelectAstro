import React from 'react';
import {StyleSheet} from 'react-native';

const styles=StyleSheet.create({
    text:{
        /*fontFamily: "ProximaNova-Regular",*/
    },
    bottomBorder:{
        borderBottomWidth:1, 
        borderBottomColor:"#DCDCDC"
    },
    shadow:{
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,

        elevation: 8,
    },
    label:{
        /*fontFamily: "ProximaNova-Regular",*/
        paddingLeft:20,
        fontSize:17,
        color:"#656565"
    },
    textInput:{
        flexDirection:"row",
        width:"100%",
        alignItems:"center",
        justifyContent:"space-between",
        paddingLeft:20,
        backgroundColor:"#F3F3F3", 
        borderRadius:30,
        marginBottom:20
    },
});

export default styles;