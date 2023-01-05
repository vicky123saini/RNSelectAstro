import React, {useState, useEffect, useRef} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet, TextInput, ActivityIndicator, Alert, Linking, Dimensions, Modal, Platform} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import MainStyles from '../Styles';
import Stars from 'react-native-stars';
import Overlay from 'react-native-modal-overlay';
import {Card} from 'native-base';
import {Avatar} from 'react-native-elements';
import * as env from '../../env';
import * as Api from '../Api';
import * as Auth from '../Auth';
import * as MyExtension from '../MyExtension';
import * as MyControls from '../screens/user/Controls';
import moment from 'moment';
import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
  } from 'react-native-popup-menu';

export const ExpertStickerView = (props) => {
    const item=props.item;
    return(
        
        <View style={[{width:"100%", borderWidth:1, borderColor:"#F1F1F1", borderRadius:10}, props.style]}>

            <View style={{position:"relative"}}>
                <Image style={{width:"100%", height:142, borderTopLeftRadius:10, borderTopRightRadius:10}} resizeMode="cover" source={{uri:`${env.DynamicAssetsBaseURL}${item.ProfileImage}`}}/>
                
                {
                /*<View style={{position:"absolute", justifyContent:"space-between", paddingHorizontal:5, paddingVertical:2, bottom:0, flexDirection:"row", width:"100%", height:24, backgroundColor:"#ccc"}}>*/
                }
                <LinearGradient colors={["transparent", "#000000C8", "#000000ED", "#000000E8"]} style={{position:"absolute", alignItems:"flex-end", justifyContent:"space-between", paddingHorizontal:5, paddingVertical:2, bottom:0, flexDirection:"row", width:"100%", height:30, }}>
                        <View style={{flexDirection:"row"}}>
                            <Image style={{width:16, height:16}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/star.png`}}/>
                            <Text style={[MainStyles.text,{color:"#fff", marginLeft:5}]}>{item.TotalRating?.toFixed(1)??0}</Text>
                        </View>

                        <View style={{flexDirection:"row"}}>
                        <Image style={{width:20, height:16}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/user-group.png`}}/>
                        <Text style={[MainStyles.text,{color:"#fff", marginLeft:5}]}>{item.TotalReview??0}</Text>
                        </View>
                        {
                            item.IsBookmarked && 
                            <Image style={{width:17,height:15}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/hart-active.png`}}/>
                            ||
                            <Image style={{width:17,height:15}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/hart.png`}}/>
                        }
                    </LinearGradient>
                
            </View>
            <View style={{padding: 10}}>
                <Text style={[MainStyles.text, {fontSize:16, color:"#090320", fontWeight:"700"}]} numberOfLines={1}>{item.Name}</Text>
                <Text style={[MainStyles.text, {fontSize:12, color:"#6E6E6E", marginBottom:10}]}>Exp: {item.TotalExperience} years</Text>
                <Text style={{minHeight:40}}>
                {
                    item.ExpertiesCollection && item.ExpertiesCollection.map((titem, tindex) => <Text key={`c-${tindex}`} style={[MainStyles.text, {fontSize:12, color:"#090320", marginBottom:10}]}>{tindex!=0 && ', '}{titem.Text}</Text>)
                }
                </Text>

                <View style={{flexDirection:"row", minHeight:16}}>
                    {
                        item.LanguageCollection && item.LanguageCollection.map((titem, tindex)=>(
                            <Image key={`a-${tindex}`} style={{width:16,height:16, marginRight:10}} resizeMode="stretch" source={{uri:`${env.DynamicAssetsBaseURL}${titem.Value}`}}/>
                            // <Text>X</Text>
                        ))
                    }
                    {
                        item.SkillsCollection && item.SkillsCollection.map((titem, tindex)=>(
                            <Image key={`b-${tindex}`} style={{width:16,height:16, marginRight:10}} resizeMode="stretch" source={{uri:`${env.DynamicAssetsBaseURL}${titem.Value}`}}/>
                            // <Text>X</Text>
                        ))
                    }
                </View>
            </View>
            <View style={{flexDirection:"row", width:"100%", height:50, paddingVertical: 5, backgroundColor:"#F5F5F5"}}>
                <View style={{flex:1, alignItems:"center", justifyContent:"flex-end"}}>
                    
                    <Text style={[MainStyles.text,{fontSize:15, width:"100%", textAlign:"center"}]}>{item.PerMinutesRateINR_CutPrice>0 && <Text style={{textDecorationLine:"line-through", color: "#090320"}}>₹{item.PerMinutesRateINR_CutPrice}</Text>} <Text style={{fontWeight:"700"}}>₹{item.PerMinutesRateINR}/min</Text></Text>
                    <View style={{flexDirection:"row", width:"100%", alignContent:"center", alignItems:"center", justifyContent:"center"}}>
                        {
                            item.IsCallService &&
                            <Image style={{ width:14,height:13, marginRight:10  }} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/phone-active.png`}}/> ||
                            <Image style={{ width:14,height:13, marginRight:10  }} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/phone.png`}}/>
                        }
                        {
                            item.IsVideoService &&
                            <Image style={{ width:14,height:13, marginRight:10  }} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/video-active.png`}}/> ||
                            <Image style={{ width:14,height:13, marginRight:10  }} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/video.png`}}/>
                        }
                        {
                            item.IsChatService &&
                            <Image style={{ width:14,height:13 }} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/chat-active.png`}}/> ||
                            <Image style={{ width:14,height:13 }} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/chat.png`}}/>
                        }
                    </View>
                </View> 
                <View style={{flex:1, alignItems:"center", justifyContent:"flex-end"}}>
                    {
                        item.IsAvailable && !item.IsBusy && 
                        <View>
                            <Text style={[MainStyles.text,{fontSize:12, fontWeight:"bold", paddingTop:4, width:"100%", textAlign:"center", color:"green"}]}>Available</Text>
                        </View>
                        ||
                        item.IsAvailable && item.IsBusy &&
                        <View>
                            <Text style={[MainStyles.text,{fontSize:12, fontWeight:"bold", paddingTop:4, width:"100%", textAlign:"center", color:"#ff0000"}]}>Busy</Text>
                            <Text style={[MainStyles.text,{fontSize:12, paddingTop:4, width:"100%", textAlign:"center"}]}>Avail: {parseInt(item.AvaliableIn/60)}mins</Text>
                        </View>
                        ||
                        <View>
                            <Text style={[MainStyles.text,{fontSize:12, fontWeight:"bold", paddingTop:4, width:"100%", textAlign:"center", color:"#ff0000"}]}>Offline</Text>
                            {
                                item.OfflineText && 
                                <Text style={[MainStyles.text,{fontSize:12, paddingTop:4, width:"100%", textAlign:"center"}]}>{item.OfflineText}</Text>
                            }
                        </View>
                    }
                </View>
            </View>
        </View>
    );
}

export const ExpertLiveBannerView = () => {
    return(
        <TouchableOpacity>
            <View style={{width:320, height: 94, position:"relative", margin:10, borderWidth:1/2, borderRadius:10, borderColor:"#ddd"}}>
            <Image style={{ width:320, height: 94  }} resizeMode="cover" source={{uri:`${env.AssetsBaseURL}/assets/images/live-banner-bg.png`}}/>
                <View style={{width:320, height: 94, position:"absolute", flexDirection:"row"}}>
                    <View style={{flex:2, paddingLeft:25, paddingTop:15}}>
                        <View style={{flexDirection:"row"}}>
                            <Text style={[MainStyles.text,{fontSize:16, color:"#090320", fontWeight:"bold"}]}>Aacharya Vinayak</Text>
                            <Text style={[MainStyles.text, {backgroundColor:"#CC0000", paddingHorizontal:10, paddingVertical:3, marginLeft:10, fontSize:14, color:"#fff", borderRadius:5, overflow:"hidden"}]}>LIVE</Text>
                        </View>
                        <Text style={[MainStyles.text,{fontSize:14, color:"#090320"}]}>Family me Samasya Kyu, Chita kyu, Upaay kya</Text>
                    </View>
                    <View style={{flex:1, position:"relative", justifyContent:"center"}}>
                        <Image style={{ width:89, height: 89  }} resizeMode="cover" source={{uri:`${env.AssetsBaseURL}/assets/images/photo-border.png`}}/>
                        <Image style={{ width:69, height: 69, left:10, top:10, position:"absolute", borderRadius:50 }} resizeMode="cover" source={require("../assets/images/exp1.png")}/>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
}

// export const HoroView = (prop) => {
//     return(
//         <View style={[{backgroundColor:"#F5F5F5", padding:20},prop.style]}>
//           <View style={{flexDirection:"row"}}>
//             <View style={{flex:1, alignContent:"center", alignItems:"center", justifyContent:"center"}}>
//               <Text style={[MainStyles.text,{fontSize:20, fontWeight:"700"}]}>Aries Today</Text>
//               <Text style={[MainStyles.text,{fontSize:12, color:"#484848"}]}>Aries (March 21-April 20)</Text>
//             </View>
//             <View style={{flex:1, alignContent:"center", alignItems:"center", justifyContent:"center"}}>
//               <Image style={{width:75,height:48}} resizeMode="stretch" source={require("../assets/images/aries.png")}/>
//             </View>
//           </View>
//           <Text style={[MainStyles.text,{fontSize:12, marginTop:20}]}>Your opinions will get importance in the professional front as people will be impressed with your work and the ideas that you bring to the table.</Text>
//           <View style={{flexDirection:"row"}}>
//               <View style={{flex:1, alignItems:"center", alignContent:"center", justifyContent:"center"}}>
//                 <Text style={[MainStyles.text,{fontSize:20, color:"#F34E81", fontWeight:"700"}]}>92%</Text>
//                 <Text style={[MainStyles.text,{fontSize:12, color:"#090320"}]}>Luck Score</Text>
//               </View>
//               <View style={{flex:1, alignItems:"center", alignContent:"center", justifyContent:"center"}}>
//                 <Text style={[MainStyles.text,{fontSize:20, color:"#F34E81", fontWeight:"700"}]}>4</Text>
//                 <Text style={[MainStyles.text,{fontSize:12, color:"#090320"}]}>Lucky Number</Text>
//               </View>
//               <View style={{flex:1, alignItems:"center", alignContent:"center", justifyContent:"center"}}>
//                 <Text style={[MainStyles.text,{fontSize:20, color:"#F34E81", fontWeight:"700"}]}>blue</Text>
//                 <Text style={[MainStyles.text,{fontSize:12, color:"#090320"}]}>Lucky Colour</Text>
//               </View>
//           </View>

//             {
//                 prop.isFull &&
//                 Array.from(Array(10).keys()).map((item, index) => (
//                     <View style={{ marginBottom: 30, marginTop:20 }}>
//                         <Text style={[MainStyles.text, { fontSize: 16, fontWeight: "700", color: "#090320", marginBottom: 10 }]}>Family <Text style={[MainStyles.text, { fontSize: 20, color: "#F34E81", fontWeight: "700" }]}>92%</Text></Text>
//                         <Text style={[MainStyles.text, { fontSize: 12, color: "#090320" }]}>Your opinions will get importance in the professional front as people will be impressed with your work and the ideas that you bring to the table.</Text>
//                     </View>
//                 ))
//             }
//         </View>
//     )
// }

export const ReviewView = (props) => {
    //const{item}=props;
    const[item, setItem]=useState(props.item);
    const[reportText, setReportText]=useState();
    const[visible, setVisible]=useState(false);
    const[loading, setloading]=useState(false);

    const onLikePress = () => {
        setloading(true);
        var req={
            UserReviewAndRatingId:item.Id,
            Action:MyExtension.CreateReviewAndRatingAction_Action.LIKE
        }
        Api.SetReviewAndRatingsLikeService(req).then(resp=>{
            console.log("SetReviewAndRatingsLikeService resp", resp);
            setloading(false);

            if(resp.ResponseCode==200){
                var newItem={...item, IsLiked:true};
                setItem(newItem);
            }
            else{
            Alert.alert(
                null,
                resp.ResponseMessage,
                [{ text: "OK" }]
            );
             
            } 
        });
    }

    const onSpamPress = () => {
        console.log("onSpamPress")
        setVisible(true);
    }

    const onSpamSubmit = (Type) => {
        setloading(true);
        var req={
            UserReviewAndRatingId:item.Id,
            ReportText:"Report",
            Type:Type
        }
        Api.SetReviewAndRatingsReportService(req).then(resp=>{
            console.log("SetReviewAndRatingsReportService resp", resp);
            setloading(false);
            if(resp.ResponseCode==200){
                setVisible(false);
                setReportText();
                var newItem={...item, IsReported:true};
                setItem(newItem);
            }
            else{
            Alert.alert(
                null,
                resp.ResponseMessage,
                [{ text: "OK" }]
            );
             
            } 
        });
    }

    return(
        <View style={{padding:10, flex:1}}>
            
            {/* <Overlay visible={visible} closeOnTouchOutside onClose={()=> setVisible(false)} childrenWrapperStyle={{borderRadius:20}}>
                <View style={{width:Dimensions.get('window').width-50, padding:10}}>
                    <Text style={{}}>Report</Text>
                    <View style={{marginTop:10, width:"100%", height:150, borderWidth:1, borderRadius:20, borderColor:"#d5d5d5"}}>
                        <TextInput style={{color:"#000"}} value={reportText} onChangeText={setReportText} placeholder="Report Text..."/>
                    </View>
                    <View style={{alignItems:"center"}}>
                    <TouchableOpacity onPress={onSpamSubmit}>
                        <View style={{marginTop:20, paddingVertical:10, paddingHorizontal:30, backgroundColor:"#d5d5d5", borderWidth:1, borderRadius:10}}>
                            <Text>OK</Text>
                        </View>
                    </TouchableOpacity>
                    </View>
                </View>
            </Overlay> */}
            
            <View style={{flex:1, flexDirection:"row", alignItems:"center", justifyContent:"space-between", paddingVertical:10}}>
                <View style={{flex:1, flexDirection:"row"}}>
                    {
                        item.ProfileImage ? 
                        <Image style={{ width:30, height: 30, borderRadius:50 }} resizeMode="cover" source={{ uri: `${env.DynamicAssetsBaseURL}${item.ProfileImage}` }} />
                        :
                        <View>
                            <Text style={{width:40, height: 40, backgroundColor:"#ccc", color:"#fff", borderWidth:1, borderColor:"#ccc", borderRadius:20, textAlign:"center", paddingTop:10}}>{item.CreatedByName.substring(0,2)}</Text>
                        </View>
                    }
                    
                
                    <View style={{marginLeft:10, alignItems:"flex-start"}}>
                        <Text style={[MainStyles.text,{fontSize:14, color:"#FF7389"}]}>{item.CreatedByName.indexOf(' ')>-1 ? item.CreatedByName.split(' ')[0]:item.CreatedByName}</Text>
                        {
                        item.Id &&
                        <Stars
                            display={item.Rating}
                            spacing={4}
                            count={5}
                            starSize={10}
                            fullStar={{uri:`${env.AssetsBaseURL}/assets/images/star-active.png`}}
                            emptyStar={{uri:`${env.AssetsBaseURL}/assets/images/star.png`}}
                            halfStar={{uri:`${env.AssetsBaseURL}/assets/images/star-half.png`}}
                            />
                        }
                        {
                            item.Id && <Text style={[MainStyles.text,{fontSize:14, color:"#000"}]}>{item.DateStamp}</Text>
                        }
                    </View>
                </View>
                <View style={{flex:0, flexDirection:"row"}}>
                    <TouchableOpacity onPress={()=> onLikePress()}>
                        <View style={{marginHorizontal:5}}>
                            <Image style={{ width:20, height: 20  }} resizeMode="cover" source={{uri:`${env.AssetsBaseURL}/assets/images/icons/${item.IsLiked ? "thumb_up_icon_active":"thumb_up_icon"}.png`}}/>
                        </View>
                    </TouchableOpacity>

                    <Menu>
                        <MenuTrigger>
                            <View style={{marginHorizontal:5}}>
                                <Image style={{ width:20, height: 20  }} resizeMode="cover" source={{uri:`${env.AssetsBaseURL}/assets/images/live/menu.png`}}/>
                            </View>
                        </MenuTrigger>
                        <MenuOptions>
                            <MenuOption onSelect={() => onSpamSubmit(MyExtension.UserReviewAndRatingReport_Type.REPORT)} text={item.IsReported ? "✔ Report" : 'Report'} />
                            <MenuOption onSelect={() => onSpamSubmit(MyExtension.UserReviewAndRatingReport_Type.BLOCK)} text={item.IsBlocked ? "✔ Block this User" : 'Block this User'} />
                        </MenuOptions>
                    </Menu>
                </View>
               <View>

               </View>
            </View>

            <Text style={[MainStyles.text,{fontSize:12, color:"#090320"}]}>{item.Review}</Text>
            <View style={{backgroundColor:"#F5F5F5", borderRadius:10}}>
                {
                    item.ReviewAndRatings && item.ReviewAndRatings.map((titem, index)=>(
                       
                        <ReviewView key={`d-${index}`} item={titem}/>
                        
                      ))
                }
            </View>
        </View>
    )
}




export const FeedbackForm = ({feedbackId, onSubmit, onClose}) =>{
    const didMountRef = useRef(true);
    const [showMessageBox, setShowMessageBox] = useState(true);
    const [Review, setReview] = useState("");
    const [loading, setloading] = useState(false);
    const [Rating, setRating]=useState(0);
    const [FeedbackDetails, setFeedbackDetails]=useState({});
    const [showPlayStorePopup, setShowPlayStorePopup] = useState(false);
    const [showFollow, setShowFollow] = useState(false);
    const [selectedDakshina, setSelectedDakshina]=useState(null);
    useEffect(()=>{
        if (didMountRef.current){
            console.log("GetFeedbackDetailsService req", feedbackId);
            Api.GetFeedbackDetailsService(feedbackId).then(resp=>{
                console.log("GetFeedbackDetailsService resp", resp);
                if (resp.ResponseCode == 200) {
                    setFeedbackDetails(resp.data);
                }
            });
            didMountRef.current = false;
        }
        else
            didMountRef.current = false;
    });

    const thisonClose = () => {
      setShowMessageBox(false);
      onClose();
    }

    const submit = () =>{
        if(Rating==0){
            alert('Please give a Star Rating.');
            return false;
        }
        setloading(true);

        if(selectedDakshina){
            var req={DakshinaId:selectedDakshina.Id, CallId:feedbackId};
            console.log("CreateDakshinaTransactionService req", req);
            Api.CreateDakshinaTransactionService(req).then(resp=>{
                console.log("CreateDakshinaTransactionService resp", resp);
                if(resp.ResponseCode==200){
                    setloading(false);
                }
                else{
                Alert.alert(
                    null,
                    resp.ResponseMessage,
                    [{ text: "OK" }]
                );
                return false
                } 
            });
        }

        var req={Rating, Review, FeedbackId:feedbackId}
        console.log("FeedbackService req", req);

        Api.FeedbackService(req).then(resp=>{
            console.log("FeedbackService resp", resp)
            setloading(false);
            if(Rating>3 && (!FeedbackDetails.IsBookmarked || !resp.data.IsPlayStoreRatingDone)){
                if(!resp.data.IsPlayStoreRatingDone){
                    setShowPlayStorePopup(true);
                }
                else if(!FeedbackDetails.IsBookmarked){
                    setShowFollow(true);
                }
                 
            }
            else{
                setShowMessageBox(false); 
                onSubmit(Rating);
            }
        });
    }

    const submitFollow = () =>{
        setloading(true);
        var req = { CreatedForUserId: FeedbackDetails.UserId, IsBookmark: true };
        console.log("SetBookmarkService req", req);
        Api.SetBookmarkService(req).then(resp => {
            console.log("SetBookmarkService resp", resp);
            setloading(false);
            setShowMessageBox(false); 
            onSubmit(Rating);
        })
    }

    const skipFollow = () => {
        setShowMessageBox(false); 
        onSubmit(Rating);
    }

    const onGoToPlayStore = () =>{
        setShowMessageBox(false); 
        onSubmit(Rating);
        Linking.openURL(Platform.OS=="ios" ? "https://apps.apple.com/in/app/myastrotest-app/id1613296409" : "market://details?id=com.rnselectastro");
    }

    const onDakshinaSelect = (item) => {
        setSelectedDakshina(item);
    }

    if(showPlayStorePopup){
        return(
    <Overlay childrenWrapperStyle={{ borderRadius: 30 }} visible={showMessageBox} onClose={thisonClose} closeOnTouchOutside>
        <View style={{padding:0, backgroundColor:"#fff", width:"100%", alignContent:"center", alignItems:"center", justifyContent:"center"}}>
            <Image style={{ width: 100, height: 100 }} resizeMode="cover" source={{ uri:  `${env.AssetsBaseURL}/assets/images/namaskar.png` }} />
            <Text style={[{ marginBottom: 20, fontWeight:"bold", color:"#000", marginTop:20 }]}>We Feel Honored!!</Text>
            <Text style={[{ marginBottom: 20, textAlign:"center" }]}>It will be amazing if you can review us</Text>
  
        
            <TouchableOpacity onPress={()=>onGoToPlayStore()}>
                <LinearGradient colors={["#FF8767", "#FF65A0"]} style={{borderRadius:30, width:200, marginBottom:20, alignItems:"center"}}>
                    <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>Go To {Platform.OS=="ios" ? "App":"Play"} Store</Text>
                </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={skipFollow}>
                <Text style={{color:"#000", padding:15, fontSize:16, fontWeight:"bold", textAlign:"center", textDecorationLine:"underline", alignSelf:"flex-end"}}>Later</Text>
            </TouchableOpacity>
          
        </View>
    </Overlay>
        )
    }
    else if(showFollow)
    return(
    <Overlay childrenWrapperStyle={{ borderRadius: 30 }} visible={showMessageBox} onClose={thisonClose} closeOnTouchOutside>
        <View style={{padding:0, backgroundColor:"#fff", width:"100%", alignContent:"center", alignItems:"center", justifyContent:"center"}}>
            <Image style={{ width: 50, height: 50, borderRadius:25 }} resizeMode="cover" source={{ uri: `${env.DynamicAssetsBaseURL}${FeedbackDetails.ProfileImage}` }} />
            <Text style={[{ marginBottom: 20, fontWeight:"bold", color:"#000", marginTop:20 }]}>Now you can follow {FeedbackDetails.Name}</Text>
            <Text style={[{ marginBottom: 20, textAlign:"center" }]}>You will be notified when Acharya ji is available or has responded to your query.</Text>
  
        
            <TouchableOpacity onPress={()=>submitFollow()}>
                <LinearGradient colors={["#FF8767", "#FF65A0"]} style={{borderRadius:30, width:140, marginBottom:20, alignItems:"center"}}>
                    {
                        loading && 
                        <View style={{width:"100%", height:50, justifyContent:"center"}}>
                            <ActivityIndicator color="#0000ff"/>
                        </View>
                        ||
                        <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>FOLLOW</Text>
                    }
                </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={skipFollow}>
                <Text style={{color:"#000", padding:15, fontSize:16, fontWeight:"bold", textAlign:"center", textDecorationLine:"underline", alignSelf:"flex-end"}}>Later</Text>
            </TouchableOpacity>
          
        </View>
    </Overlay>
    )
    else
    return( 
      <Overlay childrenWrapperStyle={{ borderRadius: 30 }} visible={showMessageBox} onClose={thisonClose} closeOnTouchOutside>
        <View style={{padding:0, backgroundColor:"#fff", width:"100%"}}>

        <View>
            <Card>
                <View style={{flexDirection:"row", padding:10}}>
                    <View style={{flex:1, alignItems:"center"}}>
                        <Image style={{ width: 50, height: 50, borderRadius:25 }} resizeMode="cover" source={{ uri: `${env.DynamicAssetsBaseURL}${FeedbackDetails.ProfileImage}` }} />
                    </View>
                    <View style={{flex:1,paddingLeft:10}}>
                        <Text style={[Styles.listText1,{}]}>{FeedbackDetails.StartDate}</Text>
                        <Text style={[Styles.listText1,{}]}>{FeedbackDetails.StartTime}</Text>
                        <Text style={[Styles.listText2,{}]}>{FeedbackDetails.Duration}</Text>
                    </View>
                    <View style={{flex:1,marginLeft:10}}>
                        {/* <Text style={[Styles.listText2,{}]}>Status</Text>
                        <Text style={[Styles.listText1,{fontSize:16, textTransform:"capitalize"}]}>{FeedbackDetails.Status}</Text> */}
                        <Text style={[Styles.listText2,{}]}>Total Cost</Text>
                        <Text style={[Styles.listText1,{fontSize:16, textTransform:"capitalize"}]}>₹{FeedbackDetails.CallCharges??0}</Text>
                    </View>
                </View>
                <Text style={[Styles.listText2,{margin:10, marginTop:0, paddingLeft:10}]}>{FeedbackDetails.Name}</Text>
            </Card>
        </View>
{/* <Text style={{color:"#A848F4", fontWeight:"bold"}}>{ FeedbackDetails.ServiceType == MyExtension.ServiceType.VOICE_CALL && 'Call' ||
                                                    FeedbackDetails.ServiceType == MyExtension.ServiceType.CHAT && 'Chat' ||
                                                    FeedbackDetails.ServiceType == MyExtension.ServiceType.VIDEO_CALL && 'Video Call'}</Text> */}
          <Text style={MainStyles.label}>Rate Your {
                                        FeedbackDetails.ServiceType==Auth.CallDetail_ServiceType.DAKSHINA && <Text style={[{marginTop:0, marginLeft:20, color:"#A848F4", fontWeight:"bold", textTransform:"capitalize"}]}>Dakshina</Text> ||
                                        FeedbackDetails.ServiceType==Auth.CallDetail_ServiceType.VOICE_CALL && <Text style={[{marginTop:0, marginLeft:20, color:"#D52837", fontWeight:"bold", textTransform:"capitalize"}]}>Voice Call</Text> ||
                                        FeedbackDetails.ServiceType==Auth.CallDetail_ServiceType.VIDEO_CALL && <Text style={[{marginTop:0, marginLeft:20, color:"#793900", fontWeight:"bold", textTransform:"capitalize"}]}>Video Call</Text> ||
                                        FeedbackDetails.ServiceType==Auth.CallDetail_ServiceType.CHAT && <Text style={[{marginTop:0, marginLeft:20, color:"#A848F4", fontWeight:"bold", textTransform:"capitalize"}]}>Chat</Text>
                                    }</Text>
          <View style={{width:"100%", alignItems:"flex-start", padding:20, backgroundColor:"#F3F3F3", borderRadius:30, marginBottom:20}}>
          <Stars
            display={Rating}
            update={(val)=>{setRating(val)}}
            spacing={5}
            count={5}
            starSize={30}
            fullStar={{uri:`${env.AssetsBaseURL}/assets/images/star-active.png`}}
            emptyStar={{uri:`${env.AssetsBaseURL}/assets/images/star.png`}}
            halfStar={{uri:`${env.AssetsBaseURL}/assets/images/star-half.png`}}
            />
           </View>
  
          <Text style={MainStyles.label}>Write a Review</Text>
          <View style={[MainStyles.textInput,{height:100}]}>
              <TextInput style={{width:"100%", color:"#000"}} multiline={true} value={Review} onChangeText={(text)=> setReview(text)} placeholder="Write a Review"/>
          </View>


          <View>
              <Text style={MainStyles.label}>Dakshina for {FeedbackDetails.Name}</Text>
            <MyControls.DakshinaView onSelect={(item)=> onDakshinaSelect(item)} walletBalanceValidate={true} multiSelectonEnable={true}/>
          </View>
  
          <View style={{width:"100%", flexDirection:"row", alignContent:"center", alignItems:"center", justifyContent:"space-between"}}>

              <TouchableOpacity onPress={()=>submit()}>
                  <LinearGradient colors={["#FF8767", "#FF65A0"]} style={{borderRadius:30, width:140, marginBottom:20, alignItems:"center"}}>
                      {
                          loading && 
                          <View style={{width:"100%", height:50, justifyContent:"center"}}>
                              <ActivityIndicator color="#0000ff"/>
                          </View>
                          ||
                          <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>SUBMIT</Text>
                      }
                  </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity onPress={thisonClose}>
                  <LinearGradient colors={["#ccc", "#ddd"]} style={{borderRadius:30, width:140, marginBottom:20, marginLeft:10, alignItems:"center"}}>
                        <Text style={{color:"#000", padding:15, fontSize:16, textAlign:"center"}}>CANCEL</Text>
                  </LinearGradient>
              </TouchableOpacity>
          </View>
        </View>
      </Overlay>
    )
  }
  

  
export const ExpertFeedbackReplyForm = ({feedbackId, parentId, onSubmit, onClose}) =>{
    const [showMessageBox, setShowMessageBox] = useState(true);
    const [Review, setReview] = useState("");
    const [loading, setloading] = useState(false);
    const [Rating, setRating]=useState(5);

    const thisonClose = () => {
      setShowMessageBox(false);
      onClose();
    }

    const submit = () =>{
        if(Rating==0){
            alert('Please give a Star Rating.');
            return false;
        }
        setloading(true);

        var req={Rating, Review, ParentId:parentId, FeedbackId:feedbackId}
        console.log("AstroFeedbackService req", req);
        Api.AstroFeedbackService(req).then(resp=>{
            console.log("AstroFeedbackService resp", resp)
            setloading(false);
             
            setShowMessageBox(false); 
            onSubmit();
             
        });
    }
   
    return( 
      <Overlay childrenWrapperStyle={{ borderRadius: 30 }} visible={showMessageBox} onClose={thisonClose} closeOnTouchOutside>
        <View style={{padding:0, backgroundColor:"#fff", width:"100%"}}>

          {/* <Text style={MainStyles.label}>Rate Your {
                                        FeedbackDetails.ServiceType==Auth.CallDetail_ServiceType.DAKSHINA && <Text style={[{marginTop:0, marginLeft:20, color:"#A848F4", fontWeight:"bold", textTransform:"capitalize"}]}>Dakshina</Text> ||
                                        FeedbackDetails.ServiceType==Auth.CallDetail_ServiceType.VOICE_CALL && <Text style={[{marginTop:0, marginLeft:20, color:"#D52837", fontWeight:"bold", textTransform:"capitalize"}]}>Voice Call</Text> ||
                                        FeedbackDetails.ServiceType==Auth.CallDetail_ServiceType.VIDEO_CALL && <Text style={[{marginTop:0, marginLeft:20, color:"#793900", fontWeight:"bold", textTransform:"capitalize"}]}>Video Call</Text> ||
                                        FeedbackDetails.ServiceType==Auth.CallDetail_ServiceType.CHAT && <Text style={[{marginTop:0, marginLeft:20, color:"#A848F4", fontWeight:"bold", textTransform:"capitalize"}]}>Chat</Text>
                                    }</Text>
          <View style={{width:"100%", alignItems:"flex-start", padding:20, backgroundColor:"#F3F3F3", borderRadius:30, marginBottom:20}}>
          <Stars
            display={Rating}
            update={(val)=>{setRating(val)}}
            spacing={5}
            count={5}
            starSize={30}
            fullStar={{uri:`${env.AssetsBaseURL}/assets/images/star-active.png`}}
            emptyStar={{uri:`${env.AssetsBaseURL}/assets/images/star.png`}}
            halfStar={{uri:`${env.AssetsBaseURL}/assets/images/star-half.png`}}
            />
           </View> */}
  
          <Text style={MainStyles.label}>Write a Review</Text>
          <View style={[MainStyles.textInput,{height:100}]}>
              <TextInput style={{width:"100%", color:"#000"}} multiline={true} value={Review} onChangeText={(text)=> setReview(text)} placeholder="Write a Review"/>
          </View>
  
          <View style={{width:"100%", flexDirection:"row", alignContent:"center", alignItems:"center", justifyContent:"space-between"}}>

              <TouchableOpacity onPress={()=>submit()}>
                  <LinearGradient colors={["#FF8767", "#FF65A0"]} style={{borderRadius:30, width:140, marginBottom:20, alignItems:"center"}}>
                      {
                          loading && 
                          <View style={{width:"100%", height:50, justifyContent:"center"}}>
                              <ActivityIndicator color="#0000ff"/>
                          </View>
                          ||
                          <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>SUBMIT</Text>
                      }
                  </LinearGradient>
              </TouchableOpacity>

              <TouchableOpacity onPress={thisonClose}>
                  <LinearGradient colors={["#ccc", "#ddd"]} style={{borderRadius:30, width:140, marginBottom:20, marginLeft:10, alignItems:"center"}}>
                        <Text style={{color:"#000", padding:15, fontSize:16, textAlign:"center"}}>CANCEL</Text>
                  </LinearGradient>
              </TouchableOpacity>
          </View>
        </View>
      </Overlay>
    )
  }
  
  const Styles = StyleSheet.create({
    listText1:{...MainStyles.text, fontSize:14, color:"#131313"},
    listText2:{...MainStyles.text, fontSize:12, color:"#656565"}
})


export const LessThen60Popup = (props) => {
    const[showMessageBox, setShowMessageBox]=useState(true)
    const{serviceType}=props;
    const onClose = () =>{
        setShowMessageBox(false);
        props.onClose();
    }
    return(
        <Overlay childrenWrapperStyle={{ borderRadius: 30 }} visible={showMessageBox} /*onClose={this.onClose} closeOnTouchOutside*/>
            <View style={{ padding: 20, alignContent: "center", alignItems: "center", justifyContent: "center" }}>
                <Text  style={[MainStyles.text, { marginBottom: 20, fontSize:26, fontWeight:"bold", color:"#7361FB" }]}>OOPS!</Text>
                {
                    serviceType==Auth.CallDetail_ServiceType.CHAT &&
                    <Text style={[MainStyles.text, { marginBottom: 20 }]}>It seems like you could not chat with our astrologer for some reason.</Text>
                    ||
                    <Text style={[MainStyles.text, { marginBottom: 20 }]}>It seems like your call disconnected within <Text style={{fontWeight:"700"}}>60 sec</Text> for some reason.</Text>
                }
                <Text style={[MainStyles.text, { marginBottom: 20, fontWeight:"700" }]}>We have not deducted balance from your SelectAstro wallet.</Text>

                {
                    <TouchableOpacity onPress={onClose}>
                        <LinearGradient colors={["#7162FC", "#B542F2"]} start={{ x: 0, y: 0 }} end={{ x: 2, y: 2 }} style={{borderRadius:30, width:220, marginBottom:20}}>
                            <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>Ok</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                }
            </View>
        </Overlay>
    )
}

export const NotConnectPopup = (props) => {
    const[showMessageBox, setShowMessageBox]=useState(true)
    const onClose = () =>{
        setShowMessageBox(false);
        props.onClose();
    }
    return(
        <Overlay childrenWrapperStyle={{ borderRadius: 30 }} visible={showMessageBox} /*onClose={this.onClose} closeOnTouchOutside*/>
            <View style={{ padding: 20, alignContent: "center", alignItems: "center", justifyContent: "center" }}>
                <Image style={{ width: 67, height: 61 }} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/sad.png` }} />
                <Text style={[MainStyles.text, { marginBottom: 20, marginTop:20 }]}>Looks like your {props.serviceType == Auth.CallDetail_ServiceType.VOICE_CALL ? 'call' : props.serviceType == Auth.CallDetail_ServiceType.VIDEO_CALL ? 'video call' : 'chat'} could not connect with our Astrologer.{'\n'}No money has been deducted from your SelectAstro Wallet.{'\n'}Please try connecting again after some time.</Text>
                 
                {
                    <TouchableOpacity onPress={onClose}>
                        <LinearGradient colors={["#7162FC", "#B542F2"]} style={{borderRadius:30, width:220, marginBottom:20}}>
                            <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>Ok</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                }
            </View>
        </Overlay>
    )
}