import React, { Component } from 'react';
import { StyleSheet, View, Image, Text, TouchableOpacity, SafeAreaView, PermissionsAndroid, Linking, Modal, Platform, Dimensions } from 'react-native';
import QRCodeScanner from 'react-native-qrcode-scanner';
import * as Api from '../Api';
import * as Auth from '../Auth';
import * as env from "../../env"; 
import { RNCamera } from 'react-native-camera';
import {Toast} from 'native-base';

export default class ScanQRCodeScreen extends Component {

    constructor(props) { 
        super(props); 
        this.state = {successPopup:false, failedPopup:false, isFlashlightOn:false, permissionAndroid:false}
    }

    componentWillMount = async() => {
      if(Platform.OS=="android"){
        try{
        const permissionAndroid = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
        this.setState({permissionAndroid})
        if(!permissionAndroid){
          const reqPer = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA);
          if(reqPer != 'granted'){
            Toast.show({
              text:"Camera Permission Required.",
              type:"warning",
              duration:5000
            });
            this.props.navigation.replace("UserHomeScreen");
          }
          else{
            this.setState({permissionAndroid:true});
          }
        }
      }
      catch(e){
        console.log("_requestAudioPermission", e);
        this.props.navigation.replace("UserHomeScreen");
      }
    };
    
   
        // try{
        //     return PermissionsAndroid.request(
        //       PermissionsAndroid.PERMISSIONS.CAMERA,
        //       {
        //         title: "Need permission to access CAMERA",
        //         message:
        //           "To run this demo we need permission to access your CAMERA",
        //         buttonNegative: "Cancel",
        //         buttonPositive: "OK",
        //       }
        //     );
        //   }
        //   catch(e){
        //     console.log("_requestAudioPermission", e)
        //   }
    };
    
  onSuccess(e) {
    //Alert.alert("Vikas", e.data)
    console.log(e.data);
    var data=JSON.parse(e.data);
    const{Id}=this.props.route?.params;
    

    var req={VendorOfferId:Id, VendorId:data.VendorId, No_Unit:1};
    this.setState({loading:true});
    console.log("Save_Vendor_TransactionService req", req);
    Api.Save_Vendor_TransactionService(req)
    .then(resp=> {
        console.log("Save_Vendor_TransactionService resp", resp);
        this.setState({loading:false});
        if (resp.ResponseCode == 200 && resp.data.status == "Success") {
          this.setState({successPopup:true, message:resp.ResponseMessage, sdate:resp.data.sdate, stime:resp.data.stime, txnid:resp.data.txnid})
        }
        else{
          this.setState({failedPopup:true, message:resp.ResponseMessage});
        }
    });

    //console.error('data', e);
    
    // Linking.openURL(e.data).catch(err =>
    //   console.error('An error occured', err)
    // );
  }

  onClose = () => {
    this.setState({successPopup:false, failedPopup:false});
    this.props.navigation.replace("UserHomeScreen")
  }

  render() {
    return (
        <SafeAreaView style={{flex:1, backgroundColor:"#fff"}}>
             
                <Modal animationType="slide" transparent={true} visible={this.state.successPopup}>
                    <View style={{flex:1, backgroundColor:"rgba(0, 0, 0, 0.8)",  alignItems:"center", justifyContent:"center"}}>
                      <View style={[styles.modalView,{backgroundColor:"#642F87"}]}>
                          <TouchableOpacity style={{alignSelf:"flex-end", marginTop:-20, marginRight:20}} onPress={()=> this.onClose()}>
                            <Image style={{width:15, height:15}} resizeMode="stretch" source={{uri: `${env.AssetsBaseURL}/assets/images/close-black-bg.png`}}/>  
                          </TouchableOpacity>
                         <View style={{alignItems:"center", justifyContent:"center"}}> 
                            <Image style={{width:100, height:100, margin:30}} resizeMode="stretch" source={{uri: `${env.AssetsBaseURL}/assets/images/icons/ok-g.png`}}/>  
                            <Text style={{color:"#fff", fontSize:20, textAlign:"center"}}>डाउनलोड करने के लिए{'\n'}धन्यवाद</Text>
                            {/* <Text style={{color:"#fff", fontSize:20, textAlign:"center"}}>अपनी मुफ्त चाय पाने{'\n'}के लिए कृपया इस स्क्रीन को{'\n'}काउंटर पर दिखाएं</Text> */}
                            <Text style={{color:"#fff", fontSize:20, textAlign:"center"}}>{this.state.message}</Text>
                            <Text style={{color:"#fff", fontWeight:"bold", marginTop:40}}>Date: {this.state.sdate}{'\n'}Time: {this.state.stime}</Text>
                            
                         </View>
                      </View>
                    </View>
                  </Modal> 

                  <Modal animationType="slide" transparent={true} visible={this.state.failedPopup}>
                    <View style={{flex:1, backgroundColor:"rgba(0, 0, 0, 0.8)",  alignItems:"center", justifyContent:"center"}}>
                      <View style={[styles.modalView, {backgroundColor: "#E52475"}]}>
                          {/* <TouchableOpacity style={{alignSelf:"flex-end"}} onPress={()=> this.onClose()}>
                            <Image style={{width:15, height:15}} resizeMode="stretch" source={{uri: `${env.AssetsBaseURL}/assets/images/close-black-bg.png`}}/>  
                          </TouchableOpacity> */}
                         <View style={{alignItems:"center", justifyContent:"center"}}>
                            <Text style={{fontSize:40, color:"#FFFFFF", fontWeight:"700"}}>OOPS!</Text>
                            <Text style={{color:"#fff", fontSize:18, marginTop:10}}>क्षमा चाहते हैं</Text>
                            <Image style={{width:100, height:100, margin:30}} resizeMode="stretch" source={{uri: `${env.AssetsBaseURL}/assets/images/icons/error-i.png`}}/>  
                            {/* <Text style={{color:"#fff", fontSize:20, textAlign:"center"}}>Yeh offer is device pe{'\n'}uplabdh nahi hai.</Text> */}
                            <Text style={{color:"#fff", fontSize:20, textAlign:"center"}}>{this.state.message}</Text>

                            <Text style={{color:"#fff", fontSize:18, marginTop:20}}>असुविधा के लिए खेद है</Text>
                            <Text style={{color:"#fff", fontWeight:"bold", marginTop:40}}>Adhik jaankari T&C page pe payein.</Text>
                            <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between", marginTop:20, width:"80%"}}>
                                <TouchableOpacity onPress={()=> Linking.openURL(`https://uat.myastrotest.in/customer-terms-conditions`)}>
                                    <View style={{backgroundColor:"#FFD008", paddingHorizontal:10, paddingVertical:5, borderRadius:5}}>
                                        <Text>View t&c</Text>
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={()=> this.onClose()}>
                                    <View style={{backgroundColor:"#FFD008", paddingHorizontal:10, paddingVertical:5, borderRadius:5}}>
                                        <Text>Exit</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                         </View>
                      </View>
                    </View>
                  </Modal> 

              <View style={{flex:1}}>
                {
                  (Platform.OS=="ios" || this.state.permissionAndroid) &&
                <QRCodeScanner
                  checkAndroid6Permissions={true}
                  onRead={this.onSuccess.bind(this)}
                  flashMode={this.state.isFlashlightOn ? RNCamera.Constants.FlashMode.torch : RNCamera.Constants.FlashMode.off}
                  topContent={
                    <Text style={styles.centerText}>scan the QR code</Text>
                  }
                />
                }
                <View style={{zIndex:1,position:"absolute", top:Dimensions.get("window").height/2-50, right:25}}>
                  <TouchableOpacity onPress={()=> this.setState({isFlashlightOn:!this.state.isFlashlightOn})}>
                    <View style={{backgroundColor:"#fff",width:50, height:50, borderRadius:25}}>
                    <Image style={{width:50, height:50}} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/chai-wala/flash-${this.state.isFlashlightOn?"on":"off"}.png` }} />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
        </SafeAreaView>
    );
  }
}

 

const styles = StyleSheet.create({
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  buttonText: {
    fontSize: 21,
    color: 'rgb(0,122,255)',
  },
  buttonTouchable: {
    padding: 16,
  },
  modalView: {
    width:"90%",
    paddingVertical:40,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  }
});