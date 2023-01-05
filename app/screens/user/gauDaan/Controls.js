import React, { Component, useEffect, useState } from 'react';
import { View, Text, TextInput, Image, Dimensions, TouchableOpacity, StyleSheet, Alert } from 'react-native';

import LinearGradient from 'react-native-linear-gradient';
import * as env from '../../../../env';
import * as Api from '../../../Api';
import * as Auth from '../../../Auth';

export const Button = (props) => {
    return(
        <TouchableOpacity onPress={props.onPress}>
            <LinearGradient colors={["#63398D", "#E5307E"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{borderRadius:21}}>
                <View style={[{alignItems:"center", justifyContent:"center", height:42}, props.style]}>
                    <Text style={{color:"#fff", fontSize:20, fontWeight:"700"}}>{props.title}</Text>
                </View>
            </LinearGradient>
        </TouchableOpacity>
    )
}

export const BalanceView = () => {
    return(
        <View>
            <Text style={{color:"#646464"}}>Frame</Text>
            <View style={{flexDirection:"row", alignItems:"center"}}>
                <Image style={{width:35,height:35}} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/gau-seva/coins.png` }} />
                <Text style={{fontSize:32, fontWeight:"bold", color:"#646464", marginLeft:10}}>2155</Text>
            </View>
        </View>
    )
}

export const TaxRebaitFormView = (props) => {
    const{Id}=props
    const[name, setName]=useState();
    const[mobileNo, setMobileNo]=useState();
    const[email, setEmail]=useState();
    const[panNo, setPanNo]=useState();

    useEffect(async()=>{
        const profile = await Auth.getProfie().then(profile=> JSON.parse(profile)).catch(()=> console.error("err AppStart binddata"));
        console.log("profile", profile);
        setMobileNo(profile.MobileNo);
        setEmail(profile.Emaile);
        setName(profile.Name);
    },[])

    const onPressSubmit = () => {
        if(!panNo){
            Alert.alert(null, "Pan no is required.");
            return;
        }
        var body={
            TransactionId:Id,
            Name:name,
            MobileNo:mobileNo,
            Email:email,
            PanNo:panNo
        };

        Api.SetTaxRebateGauSevaService(body).then(resp=>{
            console.log("SetTaxRebateGauSevaService resp", resp);
            Alert.alert(null, resp.ResponseMessage);
            if (resp.ResponseCode == 200) {
                props.onClose();
            }
        })
    }
    
    const onPressClose = () => {
        props.onClose();
    }

    return(
        
            <View style={{backgroundColor:"#EDEDED", width:"100%", padding:10, borderRadius:10}}>
                <View style={{alignItems:"center"}}>
                    <Text style={{fontSize:20, fontWeight:"600"}}>Generate Form 80G</Text>
                    <Text style={{fontSize:10, fontWeight:"500"}}>(For Tax Rebate)</Text>
                </View>
                <View style={styles.formRaw}>
                    <TextInput style={styles.textInput} value={name} onChangeText={setName} placeholder="Name" placeholderTextColor={"#ccc"}/>
                </View>
                <View style={styles.formRaw}>
                    <TextInput style={styles.textInput} value={mobileNo} onChangeText={setMobileNo} placeholder="Mobile" placeholderTextColor={"#ccc"}/>
                </View>
                <View style={styles.formRaw}>
                    <TextInput style={styles.textInput} value={email} onChangeText={setEmail} placeholder="Email" placeholderTextColor={"#ccc"}/>
                </View>
                <View style={styles.formRaw}>
                    <TextInput style={styles.textInput} value={panNo} onChangeText={setPanNo} placeholder="Pan no." placeholderTextColor={"#ccc"}/>
                </View>

                <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-evenly", padding:10}}>
                    <TouchableOpacity onPress={onPressClose}>
                        <View style={{alignItems:"center", justifyContent:"center", height:22, width:90}}>
                            <Text style={{fontSize:12, fontWeight:"700", textDecorationLine:"underline"}}>Cancel</Text>
                        </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={onPressSubmit}>
                        <LinearGradient colors={["#63398D", "#E5307E"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{borderRadius:21}}>
                            <View style={{alignItems:"center", justifyContent:"center", height:22, width:90}}>
                                <Text style={{color:"#fff", fontSize:12, fontWeight:"700"}}>Submit</Text>
                            </View>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        
    )
}

const styles = StyleSheet.create({
    formRaw:{flexDirection:"row", justifyContent:"space-between", alignItems:"center", marginTop:10},
    textInput:{flex:1, height:27, paddingVertical:0, color:"#000", backgroundColor:"#fff", borderWidth:1, borderColor:"#ACACAC", borderRadius:5}
})