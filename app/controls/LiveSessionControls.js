import React, {useEffect, useState} from 'react';
import { View, Text, TouchableOpacity, Image, SafeAreaView, ScrollView, StyleSheet, ImageBackground, Alert, Modal, Pressable, TextInput, Dimensions, PermissionsAndroid, Platform, ActivityIndicator, } from 'react-native';
import * as env from '../../env';
import * as Api from '../Api';
import * as Auth from '../Auth';
import * as MyExtension from '../MyExtension';
import { Avatar } from 'react-native-elements';
import MyStyle from '../screens/user/live/style';

export const ActiveCallers=(props)=>{
    const{Id}=props;
    const[state, setState]=useState({});
    //const[data, setData]=useState();

    // useEffect(()=>{
    //   Api.liveSessionActiveCallersService(Id).then(resp=>{
    //     if (resp.ResponseCode == 200) {
    //         setData(resp.data);
    //     }
    //   });
    // },[])

    useEffect(() => {
      const intervalId = setInterval(() => {
        setState(state => ({ data: state.data, error: false, loading: true }))

        Api.liveSessionActiveCallersService(Id).then(resp=>{
          if (resp.ResponseCode == 200) {
              //setData(resp.data);
              setState(state => ({ data: resp.data, error: false, loading: true }))
          }
        });

      }, 5000)
    
      return () => clearInterval(intervalId); //This is important
     
    }, [Id, useState])

    return(
      <View style={{flexDirection:"row"}}>
        {
            state && state.data && state.data.map((item, index)=>(
              <TouchableOpacity onPress={()=>props.onPress(item)}>
                <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between", backgroundColor:"#fff", borderRadius:10, padding:1, marginRight:4}}>
                    <Avatar size={22} rounded title={item.Name} source={{uri:`${env.DynamicAssetsBaseURL}${item.ProfileImage}`}}/>
                    <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/${item.Type==3 ? "speaker.png":"video-camera.png"}`}} style={{width:18, height:18}} />
                    <Text style={{marginHorizontal:3}}>{parseInt(item.Time/60)}:{parseInt(item.Time%60)}</Text>
                </View>
              </TouchableOpacity>
            ))
        }
        <View>
            <Avatar size={22} rounded source={{uri:`${env.AssetsBaseURL}/assets/images/live/Add.png`}} borderColor="#fff" borderWidth={2}/>
        </View>
      </View>
    )
  }

  export const Header = (props) => {
    const{SessionId}=props.data;
    const[data, setData]=useState();
    useEffect(()=>{
        console.log("liveSessionGetSessionDetailsService req", SessionId);
        Api.liveSessionGetSessionDetailsService(SessionId).then( async (resp) => {
            console.log("liveSessionGetSessionDetailsService resp", resp);
            if (resp.ResponseCode == 200) {
                setData(resp.data);
            }
          });
    },[])
    
    const onClose = () => {
        props.onClose();
    }

    return(
      <View style={[MyStyle.Direction_Row_Between, { padding: 10, alignItems: 'center', backgroundColor: 'rgba(52, 52, 52, 0.8)' }]}>
      {
        data &&
        <View style={MyStyle.Direction_Row_Center}>
          <TouchableOpacity style={MyStyle.Cricle}>
            <Avatar size={55} rounded source={{uri:`${env.DynamicAssetsBaseURL}${data.Profile.ProfileImage}`}}/>
          </TouchableOpacity>
          <View style={MyStyle.Text_MarginHorizontal}>
              <Text style={MyStyle.Text20_Regular_wHITE}>{data.Profile.Name}</Text>
              <View style={MyStyle.Direction_Row}>
                  <View style={MyStyle.Direction_Row_Center}>
                      <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/View.png`}} style={MyStyle.Image_20} />
                      <Text style={MyStyle.Text16_Regular_White}>{data.Profile.Views}</Text>
                  </View>
                  <View style={[MyStyle.Direction_Row_Center, MyStyle.Text_MarginHorizontal]}>
                      <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/Path.png`}} style={MyStyle.Image_16} />
                      <Text style={MyStyle.Text16_Regular_White}>{data.Profile.Likes}</Text>
                  </View>
              </View>
          </View>
        </View>
        ||
        <View style={MyStyle.Direction_Row_Center}><Text>...</Text></View>
      }

      <View style={[MyStyle.Buton_Small_One, MyStyle.Direction_Row]}>
          <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/Wifi.png`}} style={MyStyle.Image_16} />
          <Text style={MyStyle.Text12_Bold}>250/kbps</Text>
      </View>
  
      <TouchableOpacity onPress={()=> onClose()}>
          <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/Close.png`}} style={MyStyle.Image_25} />
      </TouchableOpacity>
  </View>
    )
  }


  export const BadgesView = (props) =>{
    const{Id}=props;
    //const[data, setData]=useState();
    const[state, setState]=useState({});
    const[isBadgesPopup, setIsBadgesPopup]=useState(false);

    // useEffect(()=>{
    //     Api.liveSessionGetBadgesService(Id).then(resp=>{
    //         if (resp.ResponseCode == 200) {
    //             setData(resp.data);
    //         }
    //       })
    // },[])

    useEffect(() => {
      const intervalId = setInterval(() => {
        setState(state => ({ data: state.data, error: false, loading: true }))

        Api.liveSessionGetBadgesService(Id).then(resp=>{
          //console.log("liveSessionGetBadgesService resp", resp);
          if (resp.ResponseCode == 200) {
              //setData(resp.data);
              setState(state => ({ data: resp.data, error: false, loading: true }))
          }
        });

      }, 5000)
    
      return () => clearInterval(intervalId); //This is important
     
    }, [Id, useState])

    return(
        <View>
          <TouchableOpacity onPress={()=>setIsBadgesPopup(true)}>
            {
                state && state.data && state.data.slice(0, 3).map((item, index)=>(
                    <View key={index} style={{margin:5, alignItems:"center", justifyContent:"center"}}>
                        {/* <ImageBackground style={{width:22, height:22, borderRadius:11, borderWidth:1, borderColor:1}} resizeMode="center" source={{uri:`${env.DynamicAssetsBaseURL}${item.Profile.ProfileImage}`}}>
                            <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/har_1.png`}} style={MyStyle.Image_25} />
                        </ImageBackground> */}
                        <Avatar size={36} rounded title={item.Profile.Name} borderWidth={2} borderColor="#F5A81E" source={{uri:`${env.DynamicAssetsBaseURL}${item.Profile.ProfileImage}`}}/>
                        <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/har_${index+1}.png`}} style={[MyStyle.Image_25,{marginTop:-15}]} />
                    </View>
                ))
            }
          </TouchableOpacity>

          
          <Modal animationType="slide" transparent={true} visible={isBadgesPopup} onRequestClose={() => {setIsBadgesPopup(false)}}>
          <View style={MyStyle.centeredView_One}>
              <View style={[MyStyle.modalView_One, {height:450}]}>
                  <View style={{alignItems:"flex-end"}}>
                      <TouchableOpacity onPress={() => setIsBadgesPopup(false)}>
                          <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/Close_1.png`}} style={MyStyle.Image_20} />
                      </TouchableOpacity>
                  </View>
                  <View style={{padding:10}}>
                  {
                    state && state.data && state.data.map((item, index)=>(
                      <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between", padding:10}}>
                        <View style={{flexDirection:"row", alignItems:"center", justifyContent:"flex-start"}}>
                          
                            <View style={{width:25, marginRight:10}}>
                              {
                                index<=2 &&
                                <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/har_${index+1}.png`}} style={[MyStyle.Image_25]} />
                                ||
                                <Text>{index+1}</Text>
                              }
                            </View>
                          
                          <Avatar size={36} rounded title={item.Profile.Name} borderWidth={2} borderColor="#F5A81E" source={{uri:`${env.DynamicAssetsBaseURL}${item.Profile.ProfileImage}`}}/>
                          <Text style={{fontWeight:"400", paddingHorizontal:10}}>{item.Profile.Name}</Text>
                         </View>
                         <View style={{flexDirection:"row", alignItems:"center", justifyContent:"flex-end"}}>
                            <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/likes_1.png`}} style={[MyStyle.Image_25]} />
                            <Text style={{paddingHorizontal:10, fontWeight:"500"}}>{item.Likes}</Text>

                            <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/${item.Donate>0?"coins_2":"coins_4"}.png`}} style={[MyStyle.Image_25]} />
                            <Text style={{paddingHorizontal:10, fontWeight:"500"}}>{item.Donate}</Text>
                         </View>
                      </View>
                    ))
                  }
                  </View>
              </View>
          </View>
          </Modal>
        </View>
    )
  }