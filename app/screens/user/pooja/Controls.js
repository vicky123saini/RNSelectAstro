import React, { Component, useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image, FlatList, Share, Dimensions } from 'react-native';
import {Avatar} from 'react-native-elements';
import {Card, CardItem, Left, Right} from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import * as Auth from '../../../Auth';
import * as Api from '../../../Api';
import * as env from '../../../../env';
import Stars from 'react-native-stars';
import moment from 'moment';

export const Header = (props) => {

    const onShare = async () => {
        var shareText = await Api.GetAppSettingByKetService(Auth.AppSettingKey.Share_Text_Puja).then(resp=>resp.data);
        shareText = shareText.replace("{0}", props.pujaName).replace("{1}", props.mandirLocation)
        try {
            const result = await Share.share({
            //title:this.state.Astrologer.Name,
            //url:`${env.DynamicAssetsBaseURL}${this.state.Astrologer.ProfileImage}`,
            message:shareText,
          });
          if (result.action === Share.sharedAction) {
            if (result.activityType) {
              // shared with activity type of result.activityType
            } else {
              // shared
            }
          } else if (result.action === Share.dismissedAction) {
            // dismissed
          }
        } catch (error) {
          alert(error.message);
        }
      }
    return(
    <View elevation={5} style={{ width: "100%", height: 54, flexDirection: "row", alignItems: "center", justifyContent:"space-between", backgroundColor: "#F09B39"}}>
        <View style={{flexDirection: "row", alignItems: "center"}}>
            <TouchableOpacity onPress={() => props.navigation.goBack()}>
                <View style={{ width: 30, height: 54, alignItems: "center", justifyContent: "center", marginLeft:10 }}>
                    <Image style={{ width: 26, height: 27 }} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/icons/ic_back_hdpi.png`}} />
                </View>
            </TouchableOpacity>
            <Text style={{fontSize:18, color:"#fff", marginLeft:20}}>{props.title}</Text>
        </View>
        <TouchableOpacity onPress={()=> onShare()}>
            <View style={{marginLeft:20, width:63, height:54, alignItems:"center", justifyContent:"center"}}>
                <Image style={{width:30, height:30}} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/share-icon.png`}}/>
                <Text>Share</Text>
            </View>
        </TouchableOpacity>
    </View>
    )
}

export const PoojaCard = (props) => {
    const {item}=props;
    useEffect(()=>{
        console.log("item**", item)
    },[])
    return(
        
        <Card style={{borderRadius:10}}>
            <CardItem style={{borderRadius:10}}>
                <Image style={{width:60, height:60, borderRadius:10 }} resizeMode="cover" source={{uri:`${env.DynamicAssetsBaseURL}${item.Image}`}}/>
                <View style={{paddingLeft:20}}>
                    <Text numberOfLines={1} style={{fontWeight:"700", fontSize:16}}>{item.Name}</Text>
                    <Text numberOfLines={1} style={{fontSize:12, color:"#5f5f5f"}}>{item.MandirName} {item.Location}</Text>
                    <Text numberOfLines={1} style={{fontSize:13}}>Duration: {item.Duration}</Text>
                    {/* <View style={{flexDirection:"row", marginTop:10}}>
                            <Stars
                                display={4}
                                spacing={8}
                                count={5}
                                starSize={15}
                            
                                fullStar={{ uri: `${env.AssetsBaseURL}/assets/images/icons/ic_star_l_1_mdpi.png` }}
                                emptyStar={{ uri: `${env.AssetsBaseURL}/assets/images/icons/ic_star_l_0_mdpi.png` }}
                                halfStar={{ uri: `${env.AssetsBaseURL}/assets/images/star-half.png` }}
                            />
                        <Text style={{fontSize:12, color:"#5f5f5f", marginLeft:10}}>(1.6180 reviews)</Text>
                    </View> */}
                </View>
            </CardItem>
        </Card>
        
    )
}


export const RecomdationPoojaCardOld = (props) => {
    const[data, setData]=useState([])
     
    useEffect(()=>{
        Api.GetMandirRecommendedPujaListService().then(response=>{
            console.log("GetMandirRecommendedPujaListService", response);
            if (response != null && response.ResponseCode == 200) {
                setData(response.data);
            }
            else if (response != null && response.ResponseCode == 401) {
              Auth.RemoveSession({ navigation: props.navigation })
            }
          });
    },[])

    return(
       
        data && data.map((item, index)=>(
              
        <TouchableOpacity key={index} onPress={()=> props.navigation.navigate("UserPoojaDetailsScreen", {Id:item.Puja.Id})}>
             
           
        <Card style={{borderRadius:10, marginTop:10, zIndex:0, width:Dimensions.get("window").width-50, marginRight:10}}> 
            <Image style={{width:110, height:117, position:"absolute", right:-15, top:-15, zIndex:1 }} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/recommanded.png`}}/>
            <CardItem style={{borderTopLeftRadius:10, borderTopRightRadius:10}}>
            
                <Text>Advised by <Text style={{fontWeight:"700"}}>{item.Astrologer.Name} {'\n'}On {item.CreatedDateTime}</Text></Text>
                <Avatar size={40} rounded resizeMode="stretch" source={{uri:`${env.DynamicAssetsBaseURL}${item.Astrologer.ProfileImage}`}}/>
                  
            </CardItem>
            <CardItem style={{borderBottomLeftRadius:10, borderBottomRightRadius:10, alignItems:"flex-start"}}>
                <Image style={{width:80, height:80, borderRadius:10 }} resizeMode="cover" source={{uri:`${env.DynamicAssetsBaseURL}${item.Puja.Image}`}}/>
                <View style={{paddingLeft:20}}>
                    <Text numberOfLines={1} style={{fontWeight:"700", fontSize:16}}>{item.Puja.Name}</Text>
                    <Text numberOfLines={1} style={{fontSize:12, color:"#5f5f5f"}}>{item.Puja.MandirName} {item.Puja.Location}</Text>
                    <Image style={{width:80, height:55, alignSelf:"flex-end", marginTop:5, marginBottom:-10 }} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/book-now-round.png`}}/>
                </View>
            </CardItem>
            
        </Card>
        
        </TouchableOpacity>
            )) 
          ||
          <></>
       
    )
}


export const RecomdationPoojaCard = (props) => {
    const[data, setData]=useState();
    useEffect(()=>{
        Api.GetMandirRecommendedPujaListService().then(response=>{
            console.log("GetMandirRecommendedPujaListService", response);
            if (response != null && response.ResponseCode == 200) {
                setData(response.data);
            }
            else if (response != null && response.ResponseCode == 401) {
              Auth.RemoveSession({ navigation: props.navigation })
            }
          });
    },[])

    return(
        
        data && data.map((item, index)=>(
           
        <Card key={index} style={{borderRadius:10, marginTop:10, zIndex:0, width:Dimensions.get("window").width-50, marginRight:10}}> 
            <Image style={{width:80, height:80, borderRadius:10, position:"absolute", right:20, top:-10, zIndex:1 }} resizeMode="cover" source={{uri:`${env.DynamicAssetsBaseURL}${item.Puja.Image}`}}/>
            <CardItem style={{borderTopLeftRadius:10, borderTopRightRadius:10}}>
                <Text numberOfLines={1} style={{fontWeight:"700", fontSize:16}}>{item.Puja.Name}</Text>
            </CardItem>

            <CardItem>
                <Avatar size={40} rounded resizeMode="stretch" source={{uri:`${env.DynamicAssetsBaseURL}${item.Astrologer.ProfileImage}`}}/>
                <View style={{ paddingLeft:10}}>
                    <Text style={{color:"#ADABB5", fontSize:12}}>Recommended by</Text>
                    <Text style={{fontWeight:"700"}}>{item.Astrologer.Name}</Text>
                </View>
            </CardItem>
            
            <CardItem style={{borderBottomLeftRadius:10, borderBottomRightRadius:10, paddingTop:0}}>
                <Left>
                    <View>
                        <Text numberOfLines={1} style={{fontWeight:"700", fontSize:16}}>On {item.CreatedDateTime}</Text>
                        <Text numberOfLines={1} style={{fontSize:12, color:"#5f5f5f"}}>{item.Puja.MandirName} {item.Puja.Location}</Text>
                    </View>
                </Left>
                <Right>
                    <TouchableOpacity onPress={()=>props.navigation.navigate("UserPoojaDetailsScreen", {Id:item.Puja.Id})}>
                        <LinearGradient colors={["#FF8767", "#FF65A0"]} style={{borderRadius:30, width:95, height:35, alignSelf:"center"}}>
                            <Text style={{color:"#fff", padding:6, fontSize:16, textAlign:"center"}}>Book Now</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </Right>
            </CardItem>
        </Card>
        
        
            )) 
          ||
          
          <></>
         
    )
}


export const RecomdationGemstonCard = (props) => {
    const[data, setData]=useState()
    const[recommended_Gemstone_Default_Banner, setRecommended_Gemstone_Default_Banner]=useState();
    useEffect(()=>{
        Api.GetRecommendedGemstonListService().then(response=>{
            console.log("GetRecommendedGemstonListService", response);
            if (response != null && response.ResponseCode == 200) {
                setData(response.data);
                if(response.data==null || response.data.length==0 ){
                    Api.GetAppSettingByKetService(Auth.AppSettingKey.Recommended_Gemstone_Default_Banner).then(resp=>{
                        try{
                            console.log("GetAppSettingByKetService resp", resp.data);
                            if(resp.data!=null && resp.data != "false")
                            {
                                setRecommended_Gemstone_Default_Banner(JSON.parse(resp.data));
                            }
                            //setAPP_SPLASH_SCREEN_TEXT(resp.data)
                        }
                        catch{
                            console.error("err GetAppSettingByKetService")
                        }
                    }); 
                }
            }
            else if (response != null && response.ResponseCode == 401) {
              Auth.RemoveSession({ navigation: props.navigation })
            }
          });
    },[])

    return(
        
        data && data.map((item, index)=>(
           
        <Card key={index} style={{borderRadius:10, marginTop:10, zIndex:0, width:Dimensions.get("window").width-50, marginRight:10}}> 
            <Image style={{width:80, height:117, position:"absolute", right:20, top:-10, zIndex:1 }} resizeMode="stretch" source={{uri:`${env.DynamicAssetsBaseURL}${item.Gemstone.Image}`}}/>
            <CardItem style={{borderTopLeftRadius:10, borderTopRightRadius:10}}>
                <View>
                    <Text numberOfLines={1} style={{fontWeight:"700", fontSize:16}}>{item.Gemstone.Name}</Text>
                    <Text style={{fontWeight:"700", fontSize:16}}>{item.Gemstone.Size_of_Gemstone}</Text>
                </View>
            </CardItem>

            <CardItem>
                <Avatar size={40} rounded resizeMode="stretch" source={{uri:`${env.DynamicAssetsBaseURL}${item.Astrologer.ProfileImage}`}}/>
                <View style={{ paddingLeft:10}}>
                    <Text style={{color:"#ADABB5", fontSize:12}}>Advised by</Text>
                    <Text style={{fontWeight:"700"}}>{item.Astrologer.Name}</Text>
                </View>
            </CardItem>
            
            <CardItem style={{borderBottomLeftRadius:10, borderBottomRightRadius:10, paddingTop:0}}>
                <Left>
                    <Text numberOfLines={1} style={{fontWeight:"700", fontSize:16}}>On {item.CreatedDateTime}</Text>
                    {/* <Text style={{fontWeight:"700"}}>{item.Gemstone.Size_of_Gemstone}</Text> */}
                </Left>
                <Right>
                <TouchableOpacity onPress={()=>props.navigation.navigate("PoojaContactUsScreen", {Gemstone:item.Gemstone.Name, WrittenBy:7})}>
                    <LinearGradient colors={["#FF8767", "#FF65A0"]} style={{borderRadius:30, width:95, height:35, alignSelf:"center"}}>
                        <Text style={{color:"#fff", padding:6, fontSize:16, textAlign:"center"}}>Buy Now</Text>
                    </LinearGradient>
                </TouchableOpacity>
                </Right>
            </CardItem>
        </Card>
        
        
            )) 
          ||
          recommended_Gemstone_Default_Banner &&
          <TouchableOpacity onPress={()=>props.navigation.navigate("PoojaContactUsScreen", {Gemstone:"Default", WrittenBy:7})}>
             
                <Image style={[{width:Dimensions.get("window").width-15, height: ((Dimensions.get("window").width*452)/724)}, recommended_Gemstone_Default_Banner.image.style]} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}${recommended_Gemstone_Default_Banner.image.uri}` }}/>
                 
          </TouchableOpacity>
          ||
          <></>
         
    )
}

export const AachryaCard = (props) => {
    const {item}=props;
    return(
        <TouchableOpacity onPress={()=> props.navigation.navigate("UserPoojaDetailsScreen", {item:item})}>
            <Card style={{borderRadius:10}}>
                <CardItem style={{borderWidth:1, borderColor:"#ccc", borderRadius:10}}>
                    <Image style={{flex:0, width:80, height:96, borderRadius:10 }} resizeMode="cover" source={{uri:`${env.DynamicAssetsBaseURL}${item.image}`}}/>
                    <View style={{flex:1, paddingLeft:20}}>
                        <Text numberOfLines={1} style={{fontWeight:"700", fontSize:16}}>{item.name}</Text>
                        <Text numberOfLines={1} style={{fontSize:12, paddingVertical:5, color:"#5f5f5f"}}>{item.degree}</Text>
                        <Text numberOfLines={2} style={{fontSize:12, color:"#5f5f5f"}}>{item.description}</Text>
                    </View>
                </CardItem>
            </Card>
        </TouchableOpacity>
    )
}

export const ReviewRatingCard = (props) => {
    const{item}=props;
    return(
        <View style={{paddingVertical:10, borderBottomWidth:1, borderBottomColor:"#d1d1d1"}}>
            {
                item.Rating !=null && item.Rating>0 &&
            
            <View style={{alignItems:"flex-start", padding:10}}>
            <Stars
                display={item.Rating}
                spacing={8}
                count={5}
                starSize={15}
            
                fullStar={{ uri: `${env.AssetsBaseURL}/assets/images/icons/ic_star_l_1_mdpi.png` }}
                emptyStar={{ uri: `${env.AssetsBaseURL}/assets/images/icons/ic_star_l_0_mdpi.png` }}
                halfStar={{ uri: `${env.AssetsBaseURL}/assets/images/star-half.png` }}
            />
            </View>
            }
            <Text style={{paddingVertical:5, paddingHorizontal:10}}>{item.Review}</Text>
            <UserCard item={item.UserProfile} date={item.CreatedDate}/>
        </View>
    )
}


export const UserCard = (props) => {
    const {item, date}=props;
    return(
        <Card>
            <CardItem>
                <Avatar size={50} rounded resizeMode="cover" source={{uri:`${env.DynamicAssetsBaseURL}${item.ProfileImage}`}}/>
                <View style={{paddingLeft:20}}>
                    <Text style={{fontWeight:"700", fontSize:16}}>{item.Name}</Text>
                    <Text style={{fontSize:12, color:"#5f5f5f"}}>{moment(date).format("DD-MMM-YYYY")}</Text>
                </View>
            </CardItem>
        </Card>
    )
}

export const PlanCard = (props) => {
    const{item}=props;
    return(
        <View style={[{flex:1, margin:10, borderRadius:20, borderWidth:1, borderColor:"#d1d1d1", minHeight:100}, item.selected && {backgroundColor:"#FDF3E7"}]}>
            <View style={{flex:1, padding:20}}>
                <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
                    <Text style={{flex:3, fontWeight:"bold", fontSize:18}}>{item.Name}</Text>
                    <Text style={{flex:1, fontWeight:"bold", fontSize:18, color:"#F09338", textAlign:"right"}}>₹ {item.Price}</Text>
                </View>
                <Text style={{color:"#000", marginTop:5}}>{item.Description}</Text>
            </View>
            {
                item.IsSpecial && 
                <View style={{flex:0, backgroundColor:"#EF8B36", flexDirection:"row", paddingVertical:5, paddingHorizontal:20, alignItems:"center", justifyContent:"space-between", borderBottomLeftRadius:20, borderBottomRightRadius:20}}>
                    <Text style={{color:"#fff"}}>{item.SpecialText}</Text>
                    <Image style={{width:10, height:10}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/icons/ic_tick_xhdpi.png`}}/>
                </View>
            }
        </View>
    )
}

export const SlotCard = (props) => {
    const{item}=props;
    return(
        <TouchableOpacity onPress={()=>item.IsMaxBooked && props.onPress(item)}>
            <LinearGradient colors={item.selected ? ["#F09B39", "#ED7931"] : ["#fff","#fff"]} style={{margin:5, borderWidth:1, borderRadius:10, borderColor:"#d1d1d1", borderRadius:12}}>
                <Text style={[{color:"#000", paddingVertical:10, paddingHorizontal:15, fontSize:12, textAlign:"center", borderRadius:10}, item.selected && {color:"#fff"}, !item.IsMaxBooked && {textDecorationLine:"line-through", backgroundColor:"#ccc"}]}>{item.StartTime} - {item.EndTime}</Text>
            </LinearGradient>
        </TouchableOpacity>
    )
}

export const ButtonOrange = (props) => {
  return(
    <TouchableOpacity onPress={props.onPress}>
        <LinearGradient colors={["#F09B39", "#ED7931"]} style={[{borderRadius:12, minWidth:160}, props.style]}>
            <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>{props.title}</Text>
        </LinearGradient>
    </TouchableOpacity>
  )
}

export const PoojaBookingCard = (props) => {
    const {item}=props;
    return(
        <Card style={{borderRadius:15}}>
            <CardItem style={{borderRadius:15}}>
                <Image style={{width:50, height:50, borderRadius:10 }} resizeMode="cover" source={{uri:`${env.DynamicAssetsBaseURL}${item.PujaImage}`}}/>
                <View style={{paddingLeft:20}}>
                    <Text numberOfLines={1} style={{fontWeight:"700", fontSize:16}}>{item.PujaName}</Text>
                    <Text numberOfLines={1} style={{fontSize:12, color:"#5f5f5f"}}>{item.MandirName} {item.Location}</Text>
                </View>
            </CardItem>
            <CardItem style={{padding:0}}>
                <View>
                    <Text style={{fontWeight:"700"}}>Date and Time</Text>
             
                    <Text>{item.Puja_Start_Date}      {item.Puja_Start_Time}</Text>
                </View>
            </CardItem>
            {
                !props.isUpcoming &&
                <CardItem style={{minHeight:80, backgroundColor:"#F6F6F6"}}>
                    <Left>
                        <Text>Rate this pooja</Text>
                    </Left>
                    <Right>
                        {
                            item.Rating &&
                            // <View style={{flexDirection:"row", alignItems:"flex-end", justifyContent:"flex-end"}}>
                            //     <Image style={{width:25, height:25 }} resizeMode="cover" source={{uri:`${env.AssetsBaseURL}/assets/images/star-active.png`}}/>
                            //     <Image style={{width:25, height:25 }} resizeMode="cover" source={{uri:`${env.AssetsBaseURL}/assets/images/star-active.png`}}/>
                            //     <Image style={{width:25, height:25 }} resizeMode="cover" source={{uri:`${env.AssetsBaseURL}/assets/images/star-active.png`}}/>
                            //     <Image style={{width:25, height:25 }} resizeMode="cover" source={{uri:`${env.AssetsBaseURL}/assets/images/star-active.png`}}/>
                            //     <Image style={{width:25, height:25 }} resizeMode="cover" source={{uri:`${env.AssetsBaseURL}/assets/images/star.png`}}/>
                            // </View>
                            <Stars
                                display={item.Rating}
                                spacing={8}
                                count={5}
                                starSize={25}
                            
                                fullStar={{ uri: `${env.AssetsBaseURL}/assets/images/icons/ic_star_l_1_mdpi.png` }}
                                emptyStar={{ uri: `${env.AssetsBaseURL}/assets/images/icons/ic_star_l_0_mdpi.png` }}
                                halfStar={{ uri: `${env.AssetsBaseURL}/assets/images/star-half.png` }}
                            />
                            ||
                            <TouchableOpacity onPress={()=> props.onRateNow()}>
                                <LinearGradient colors={["#F09B39", "#ED7931"]} style={[{borderRadius:12, minWidth:160}]}>
                                    <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>Rate Now</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                         }
                    </Right>
                </CardItem>
            } 
            
        </Card>
    )
}