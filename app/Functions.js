import React from 'react';
import {Alert} from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import * as Api from './Api';

export const mountHeaderBalanceRefresh = () =>{
     
    Api.GetBalanceService().then(resp=> {
        console.log("GetBalanceService resp", resp);
        global.WalletDetails = resp.data;
        });
    
}

export function guidGenerator(){
    var S4 = function(){
        return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

export const CheckConnectivity = (NoInternetMessage) => {
    NetInfo.fetch().then(state => {
        console.log("Connection type", state.type);
        console.log("Is connected?", state.isConnected);
        if(!state.isConnected){
            Alert.alert("No Network!", NoInternetMessage);
        }
    });
};
 