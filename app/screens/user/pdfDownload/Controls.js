import React, { Component, useState } from 'react';
import { View, Text, Modal, TouchableOpacity } from 'react-native';
import PDFView from 'react-native-view-pdf';
import LinearGradient from 'react-native-linear-gradient';
import RNFetchBlob from 'rn-fetch-blob';

export const ViewPdfWithDownload = (props) => { 
    const{url}=props;
    return( 
<Overlay containerStyle={{margin:0, padding:0}} childrenWrapperStyle={{ margin:0, padding:0, width:Dimensions.get("window").width, height:Dimensions.get("window").height }} visible={props.visible}>
  
  <View style={{flex:1}}>
    
       
      <View style={{flex:1}}>
       
      <PDFView
        fadeInDuration={250.0}
        style={{ flex: 1 }}
        resource={pdfUrl}
        resourceType="url"
      />
      </View>
     

   
    <View style={{flex:0, flexDirection:"row", marginVertical:20, alignItems: 'center', justifyContent:"space-evenly"}}>
      <TouchableOpacity onPress={()=> props.onClose()}>
        <LinearGradient colors={["#FDCB2F", "#FB7021"]} start={{ x: 0, y: .5 }} end={{ x: 1, y: .5 }} style={{borderRadius:30}}>
          <Text style={{color:"#fff", padding:15, width:150, fontSize:16, textAlign:"center"}}>Back</Text>
        </LinearGradient>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=> props.onDownloadNow()}>
        <LinearGradient colors={["#FDCB2F", "#FB7021"]} start={{ x: 0, y: .5 }} end={{ x: 1, y: .5 }} style={{borderRadius:30}}>
          {loading && <View style={{padding:15, width:150, fontSize:16, textAlign:"center"}}><ActivityIndicator color="blue"/></View> || <Text style={{color:"#fff", padding:15, width:150, fontSize:16, textAlign:"center"}}>Download</Text>}
        </LinearGradient>
      </TouchableOpacity>
    </View>
    </View>
    </Overlay>
    )
}