import React, { Component, useState } from 'react';
import { View, Text, TextInput, Image, Modal, TouchableOpacity, Platform } from 'react-native';
import * as env from '../../env';

export const Autocomplete = (props) => {
    const[modalVisible, setModalVisible]= useState(false);
    const[value, setValue]=useState(props.value);

    const onChangeText = (item) => {
        setValue(item);
        props.onChangeText(item);
    }

    const onSelect = (item) => {
        setValue(item);
        setModalVisible(false);
    }

    return (
      <View style={props.style}>
        <TouchableOpacity onPress={()=>setModalVisible(true)}>
            <Text style={[{color:"#000", backgroundColor:"#F3F3F3", 
                borderRadius:30,
                paddingLeft:20,
                height:50,
                paddingTop:15,
                overflow:"hidden"}]}>
                {value}
            </Text>
        </TouchableOpacity>

        <Modal visible={modalVisible}>
            <View style={[Platform.OS=="ios" && {marginTop:40}]}>
            
                <View elevation={5} style={{ width: "100%", height: 54, flexDirection: "row", alignItems: "center", justifyContent:"space-between", backgroundColor: "#fff"}}>
                    <View style={{flexDirection: "row", alignItems: "center"}}>
                        <TouchableOpacity onPress={() => setModalVisible(false)}>
                            <View style={{ width: 30, height: 54, alignItems: "center", justifyContent: "center", marginLeft:10 }}>
                                <Image style={{ width: 13, height: 22 }} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/back.png`}} />
                            </View>
                        </TouchableOpacity>
                        <Text style={{fontSize:18, marginLeft:20}}>Search</Text>
                    </View>
                </View>
                <View style={{padding:20}}>
                    <View style={{height:50, marginTop:20, borderRadius:30, borderWidth:1, borderColor:"#000"}}>
                        <TextInput style={{width:"100%", height:50, textAlignVertical:"center", color:"#000", paddingHorizontal:20}} value={value} onChangeText={onChangeText} placeholder="Enter city name" />
                    </View>
                    <View>
                        {
                            props.data && props.data.map((item, index)=> (
                                <TouchableOpacity onPress={()=>onSelect(item)}>
                                    <View style={{padding:10, borderBottomWidth:1, borderBottomColor:"#ccc"}}>
                                        <Text>{item}</Text>
                                    </View>
                                </TouchableOpacity>
                            ))
                        }
                    </View>
                </View>
            </View>
        </Modal>
      </View>
    );
  
}
