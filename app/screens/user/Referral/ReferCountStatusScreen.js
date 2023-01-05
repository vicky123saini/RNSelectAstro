import React, { Component } from 'react';
import { View, Text, SafeAreaView, ScrollView, TouchableOpacity, Image, Dimensions, Share, Modal } from 'react-native';
import * as MyControls from '../Controls';
import LinearGradient from 'react-native-linear-gradient';
import * as env from '../../../../env';
import * as Auth from '../../../Auth';
import * as Api from '../../../Api';
import MainStyles from '../../../Styles';
import Html from 'react-native-render-html';
import { Accordion } from "native-base";
import Overlay from 'react-native-modal-overlay';

export default class ReferCountStatusScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      type:"Weekly",
      TargetArray:[],
      viewTandC:false
    };
  }

  componentDidMount = () => {
    console.log("GetReferralService req");
    Api.GetReferralService().then(resp => {
      console.log("GetReferralService resp", resp);
      if (resp.ResponseCode == 200) { 
        this.setState({ ReferralData: resp.data });
        var newArrayWeekly=[];
        for(var i=1;i<=resp.data.WeeklyTarget;i++){
            newArrayWeekly.push({image:"assets/images/icons/ic_tick_xhdpi.png", isDone:i<=resp.data.WeeklyCount})
        }
        this.setState({TargetArrayWeekly:newArrayWeekly});

        var newArrayMonthly=[];
        for(var i=1;i<=resp.data.MonthlyTarget;i++){
            newArrayMonthly.push({image:"assets/images/icons/ic_tick_xhdpi.png", isDone:i<=resp.data.MonthlyCount})
        }
        this.setState({TargetArrayMonthly:newArrayMonthly});

        this.setState({TargetArray:newArrayWeekly, selectedCounter:resp.data.WeeklyCount});
        this.onTabChange("Weekly")
      }
    });
  };
  
  onTabChange = (tab) => {
    var type="";
    var bannersType="";
    if(tab=="Weekly"){
      type="Week";
      bannersType="REF_ERN_WK";
      this.setState({TargetArray:this.state.TargetArrayWeekly, selectedCounter:this.state.ReferralData.WeeklyCount, type:"Weekly"});
    }
    else{
      type="Month";
      bannersType="REF_ERN_MO";
      this.setState({TargetArray:this.state.TargetArrayMonthly, selectedCounter:this.state.ReferralData.MonthlyCount, type:"Monthly"})
    }

    console.log("GetBannersService req");
    Api.GetBannersService(bannersType).then(resp => {
      console.log("GetBannersService resp", resp);
      if (resp.ResponseCode == 200) {
        this.setState({bannerList:resp.data})
      }
    });

    Api.getReferralTermsService(type).then(resp => {
      console.log("getReferralTermsService resp", resp);
      if (resp.ResponseCode == 200) { 
        this.setState({ TermAndConditionData: resp.data });
      }
    });

    Api.getReferralFAQService(type).then(resp => {
      console.log("getReferralFAQService resp", resp);
      if (resp.ResponseCode == 200) { 
        this.setState({ FAQData: resp.data });
      }
    });

    
  }

  
  onShareReferal = () => {
    Api.GetAppSettingByKetService(Auth.AppSettingKey.Share_Text_Ref_And_Ern).then(async(resp) =>{
      console.log("Share_Text_Ref_And_Ern", resp);
      //this.setState({Share_Text_Ref_And_Ern:resp.data});
      var shareText=resp.data.replace("{0}", this.state.My_Referral_Code);

       
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
      
    });
  }

  render() {
    return ( 
      <SafeAreaView style={{flex:1}}>
         <Modal animationType="none" transparent={true} visible={this.state.viewTandC}>
        {/* <Overlay containerStyle={{height:Dimensions.get("window").height/2}} childrenWrapperStyle={{borderRadius:30, height:Dimensions.get("window").height/2}} visible={this.state.viewTandC} onClose={()=> this.setState({viewTandC:false})} closeOnTouchOutside></Overlay> */}
            {this.state.ReferralData &&
              <View style={{flex:1, backgroundColor:"rgba(0, 0, 0, 0.8)"}}>
                <View style={{marginVertical:(Dimensions.get("window").height*20)/100, marginHorizontal:10, padding:10, backgroundColor:"#fff", borderWidth:1, borderColor:"#d5d5d5", borderRadius:20}}>
                  <TouchableOpacity style={{alignSelf:"flex-end"}} onPress={()=>this.setState({viewTandC:false})}>
                  <Image style={{width:31, height:36, borderRadius:10 }} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/close-x.png`}}/>
                </TouchableOpacity>
                  <ScrollView>
                    <View style={{padding:20, borderBottomWidth:1, borderBottomColor:"#000", marginBottom:10, alignItems:"center"}}>
                      <Text style={{fontWeight:"bold", fontSize:18}}>*Terms & Conditions</Text>
                    </View>
                    <View>
                    <Html
                        contentWidth={Dimensions.get("window").width-20}
                        source={{html:this.state.TermAndConditionData}}
                    />
                    </View>
                  </ScrollView>
                </View>
              </View>
              }
            
            </Modal>

        <ScrollView style={{flex:1}}>
       
        <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-evenly", paddingTop:10, backgroundColor:"#fff"}}>
            <TouchableOpacity onPress={()=> this.onTabChange("Weekly")}>
                <LinearGradient colors={this.state.type=="Weekly" ? ["#7162FC", "#B542F2"] :["#ccc", "#ddd"]} style={{borderRadius:30, width:150}}>
                    <Text style={[MainStyles.text,{padding:15, fontSize:16, textAlign:"center"}, this.state.type=="Weekly"?{color:"#fff"}:{color:"#000"}]}>Weekly Status</Text>
                </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> this.onTabChange("Monthly")}>
                <LinearGradient colors={this.state.type=="Monthly" ? ["#7162FC", "#B542F2"] :["#ccc", "#ddd"]} style={{borderRadius:30, width:150}}>
                    <Text style={[MainStyles.text,{color:"#fff", padding:15, fontSize:16, textAlign:"center"}, this.state.type=="Monthly"?{color:"#fff"}:{color:"#000"}]}>Monthly Status</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
        <View style={{paddingHorizontal:10, alignItems:"center", justifyContent:"center", backgroundColor:"#fff"}}>
            <View style={{flexDirection:"row", alignItems:"center", justifyContent:"center", marginTop:10}}>
                {
                    this.state.TargetArray.map((item, index)=>(
                    <View style={{flexDirection:"row", alignItems:"center"}}>
                        {
                            index>0 && (index)==this.state.selectedCounter && <View style={[{backgroundColor:"#027EA7", width:20, height:5}, this.state.TargetArray.length>7 && {width:5}]}/> ||
                            index>0 && item.isDone && <View style={[{backgroundColor:"#A3CA3E", width:20, height:5}, this.state.TargetArray.length>7 && {width:5}]}/> ||
                            index>0 && <View style={[{backgroundColor:"#D8D8DE", width:20, height:5}, this.state.TargetArray.length>7 && {width:5}]}/> 
                        }
                        {
                            (index)==this.state.selectedCounter && 
                            <View style={[{backgroundColor:"#027EA7", borderRadius:20, padding:10}, this.state.TargetArray.length>7 && {borderRadius:16, padding:5}]}>
                                <Text style={[{width:20, height:20, fontWeight:"bold", color:"#fff", textAlign:"center"}, this.state.TargetArray.length>7 && {width:16, height:16, fontSize:10}]}>{index+1}</Text>
                            </View> ||
                            item.isDone &&
                            <View style={[{backgroundColor:"#A3CA3E", borderRadius:20, padding:10}, this.state.TargetArray.length>7 && {borderRadius:16, padding:5}]}>
                                <Image style={[{width:20, height:20}, this.state.TargetArray.length>7 && {width:16, height:16}]} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}${item.image}`}}/>
                            </View>
                            ||
                            <View style={[{backgroundColor:"#D8D8DE", borderRadius:20, padding:10}, this.state.TargetArray.length>7 && {borderRadius:16, padding:5}]}>
                                <Text style={[{width:20, height:20, fontWeight:"bold", color:"#000", textAlign:"center"}, this.state.TargetArray.length>7 && {width:16, height:16, fontSize:10}]}>{index+1}</Text>
                            </View>
                        }
                        
                    </View>
                    ))
                }
            </View>

              {
                this.state.ReferralData && this.state.type=="Weekly" &&
                <Html
                  contentWidth={Dimensions.get("window").width}
                  source={{html:this.state.ReferralData.WeeklyStatus_Details}}
                />
                ||
                this.state.ReferralData && this.state.type=="Monthly" &&
                <Html
                  contentWidth={Dimensions.get("window").width}
                  source={{html:this.state.ReferralData.MonthlyStatus_Details}}
                />
              }


            <View style={{marginBottom:20, alignItems:"center"}}>
            {
              this.state.bannerList && this.state.bannerList.map((item, index) => (
                <View key={index}>
                  <TouchableOpacity onPress={this.onShareReferal}> 
                    <Image style={{ width: 344, height:184 }} resizeMode="stretch" source={{ uri: `${env.DynamicAssetsBaseURL}${item.BannerUrl}` }} />
                  </TouchableOpacity> 
                </View>
              ))
            }
            </View>

        </View>
        <View style={{marginTop:5, backgroundColor:"#fff", alignItems:"center", marginBottom:100}}>
            

             
           <View style={{marginTop:20}}>
          {
            this.state.type=="Weekly" &&
          <TouchableOpacity style={{flexDirection:"row", alignItems:"center"}} onPress={()=> this.props.navigation.navigate("WinnersScreen", {type:"Weekly"})}>
            <Image style={{width:18, height:18, marginHorizontal:5 }} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/gift-box.png`}}/>
            <Text style={{fontSize:18, fontWeight:"bold", color:"#8B6D02"}}>List of Weekly Winners</Text>
          </TouchableOpacity>
          ||
          <TouchableOpacity style={{flexDirection:"row", alignItems:"center"}} onPress={()=> this.props.navigation.navigate("WinnersScreen", {type:"Monthly"})}>
            <Image style={{width:18, height:18, marginHorizontal:5 }} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/gift-box.png`}}/>
            <Text style={{fontSize:18, fontWeight:"bold", color:"#8B6D02"}}>List of Monthly Winners</Text>
          </TouchableOpacity>
          }
          </View>   
          
          {
            this.state.FAQData &&
          
          <View style={{padding:10, width:"100%"}}>
          <Text style={{marginRight:20, fontWeight:"bold", fontSize:16, padding:10}}>FAQs</Text>
            <Accordion 
              dataArray={this.state.FAQData.map(o=>({title:o.Question, content:o.Answer}))}
              renderContent={(item, index)=> (
                <View key={index} style={{padding:10, backgroundColor:"#F5F5F5"}}>
                  <Html
                    contentWidth={Dimensions.get("window").width-20}
                    source={{html:item.content}}
                />
                </View>
              )}
              headerStyle={{backgroundColor:"#fff"}}
              renderHeader={(item, expanded, index)=>(
                <View key={index} style={{flexDirection:"row", padding:10, alignItems:"center", justifyContent:"space-between"}}>
                  <Text>{item.title}</Text>
                    {
                      expanded && 
                      <Text>&and;</Text>
                      ||
                      <Text>&or;</Text>
                    }
                </View>
              )}
            />
          </View>
          }


<TouchableOpacity onPress={()=> this.setState({viewTandC:true})}>
              <Text style={{textDecorationLine:"underline", marginVertical:10, color:"#d5d5d5"}}>*Terms & Conditions</Text>
            </TouchableOpacity>
           
            

        </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
}
