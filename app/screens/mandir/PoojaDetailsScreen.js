import React, { Component } from 'react';
import { SafeAreaView, View, Text, StyleSheet, TextInput, Image, ScrollView, Modal, ActivityIndicator, Dimensions, RefreshControl, ImageBackground, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as env from '../../../env';
import * as Api from '../../Api';
import * as Auth from '../../Auth';
import * as MyControls from './Controls';
import Swiper from 'react-native-swiper'

export default class PoojaDetailsScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount = () => {
      this.binddata();
      this.interval=setInterval(()=>{ 
        console.log("Interval", 30001);
        this.binddata();
        }, 10000)
    }; 

    componentWillUnmount = () => {
      clearInterval(this.interval);
    };
    

    onRefresh = () => {
        this.setState({data:null, PujaBookings:null, refreshing:true}, ()=> this.binddata())
    }

    binddata = () => {
        const{Id}=this.props.route.params;
        
        Api.GetPujaBookingsByIdService(Id).then(response=>{ 
            console.log("GetPujaBookingsByIdService resp", response);
            if(response.ResponseCode== 200){
                this.setState({data:response.data, refreshing:false})
            }
        });
  
        Api.Acharaya_PujaBookingsService(1, 10).then(response => {
          console.log("Acharaya_PujaBookingsService resp", response);
          if (response.ResponseCode == 200) {
              this.setState({PujaBookings:response.data})
          }
        });
    }

    initVideoCall = () => { 
        const{Id}=this.props.route.params;
        var req={MandirTransactionId:Id}
        Api.MandirInitVideoCallService(req).then(response=>{ 
            console.log("MandirInitVideoCallService resp", response);
            if(response.ResponseCode== 200){
                this.props.navigation.navigate("PoojaVideoCallScreen", {Id:response.data.SessionId, MandirTransactionId:Id})
            }
        });
    }
    

    render() {
        return (
            <SafeAreaView>
                {
                    this.state.data &&
                
                <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}>
                     
                    <Swiper 
                    style={styles.wrapper} 
                    showsButtons={false} 
                    //nextButton = {<Text style={{color:"#ccc", fontSize:30, fontWeight:"bold"}}>{'>'}</Text>}
                    //prevButton = {<Text style={{color:"#ccc", fontSize:30, fontWeight:"bold"}}>{'<'}</Text>}
                    >
                {
                    this.state.data && this.state.data.PujaBannerList && this.state.data.PujaBannerList.Banner1 &&
                    <View style={styles.slide}>
                        <Image style={{width:"100%", height:200 }} resizeMode="stretch" source={{uri:`${env.DynamicAssetsBaseURL}${this.state.data.PujaBannerList.Banner1}`}}/>
                    </View>
                }
                {
                    this.state.data && this.state.data.PujaBannerList && this.state.data.PujaBannerList.Banner2 &&
                    <View style={styles.slide}>
                        <Image style={{width:"100%", height:200 }} resizeMode="stretch" source={{uri:`${env.DynamicAssetsBaseURL}${this.state.data.PujaBannerList.Banner2}`}}/>
                    </View>
                }
                {
                    this.state.data && this.state.data.PujaBannerList && this.state.data.PujaBannerList.Banner3 &&
                    <View style={styles.slide}>
                        <Image style={{width:"100%", height:200 }} resizeMode="stretch" source={{uri:`${env.DynamicAssetsBaseURL}${this.state.data.PujaBannerList.Banner3}`}}/>
                    </View>
                }
                {
                    this.state.data && this.state.data.PujaBannerList && this.state.data.PujaBannerList.Banner4 &&
                    <View style={styles.slide}>
                        <Image style={{width:"100%", height:200 }} resizeMode="stretch" source={{uri:`${env.DynamicAssetsBaseURL}${this.state.data.PujaBannerList.Banner4}`}}/>
                    </View>
                }
                </Swiper>

                    
                    
                    <View style={{padding:20, backgroundColor:"#fff"}}>
                        <RowView>
                            <Text style={{fontWeight:"700"}}>लाइव पूजा</Text>
                            <Text style={{fontSize:9, color:"#6D6E71"}}>{this.state.data.Puja_Start_Date}</Text>
                        </RowView>
                        <RowView>
                            <Text style={{}}>{this.state.data.PujaName}</Text>
                            <Text style={{}}>{this.state.data.Puja_Start_Time}</Text>
                        </RowView>
                        {
                            this.state.data.Puja_Status=="Open" &&
                            <RowView>
                                <TouchableOpacity onPress={()=> this.initVideoCall()}>
                                    <LinearGradient colors={["#8A09F0", "#E39DD9"]} style={{borderRadius:30, width:220, alignSelf:"center"}}>
                                        <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>लाइव पूजा स्टार्ट करे</Text>
                                    </LinearGradient>
                                </TouchableOpacity>
                            </RowView>
                        }
                    </View>

                    <View style={{padding:10, backgroundColor:"#fff"}}>
                        <MyControls.ContackUsSticker/>
                    </View>

                    <View style={{padding:20, backgroundColor:"#fff", marginTop:2}}>
                        {/* <RowView>
                            <Text style={{fontWeight:"700"}}>आज की पूजा</Text>
                            <Text style={{fontSize:9, color:"#6D6E71"}}>जनवरी 03, 2022</Text>
                        </RowView> */}
                        {
                            this.state.PujaBookings && this.state.PujaBookings.map((item, index)=>(
                                <RowView>
                                    <Text style={{}}>{item.PujaName}</Text>
                                    <Text style={{}}>{item.Puja_Start_Date}</Text>
                                </RowView>
                            ))
                        }
                    </View>

                </ScrollView>
                }
            </SafeAreaView>
        );
    }
}


const RowView = (props) => {
    return (
        <View style={{flexDirection:"row", alignItems:"center", alignContent:"center", justifyContent:"space-between", marginVertical:10}}>{props.children}</View>
    )
}



const styles = StyleSheet.create({
    wrapper: {height:200},
    slide: {
      //flex: 1
      height:200
    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      position:"relative"
    },
    modalView: {
      width:"100%",
      position:"absolute",
      bottom:0,
      backgroundColor: "white",
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
       
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2
      },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5
    }
});