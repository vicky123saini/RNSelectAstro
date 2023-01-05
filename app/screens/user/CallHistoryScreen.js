import React, { Component, useState } from 'react';
import { View, Text, Image, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator, TouchableOpacity, RefreshControl, BackHandler, PermissionsAndroid, Platform, Alert, Modal } from 'react-native';
import { Card } from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import { FeedbackForm } from '../../controls/ExpertControls';
import MainStyles from '../../Styles';
import * as env from '../../../env';
import * as Api from '../../Api';
import * as Auth from '../../Auth';
import * as MyExtension from '../../MyExtension';
import * as UserControl from './Controls';
import { Singular } from 'singular-react-native';
import RNFetchBlob from 'rn-fetch-blob';
import { WebView } from 'react-native-webview';

export default class CallHistoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      FilterTypeList: [
        { Id: 0, Name: "All" },
        { Id: 1, Name: "Call", ServiceType: Auth.CallDetail_ServiceType.VOICE_CALL },
        { Id: 2, Name: "Video", ServiceType: Auth.CallDetail_ServiceType.VIDEO_CALL },
        { Id: 3, Name: "Chat", ServiceType: Auth.CallDetail_ServiceType.CHAT },
        /*{ Id: 4, Name: "Report", ServiceType: Auth.CallDetail_ServiceType.PDF_REPORT }*/
      ],
      selectedFilter: { Id: 0, Name: "All" },
      visibleModel:false
    };
  }



  componentDidMount = () => {
    this.backHandler = BackHandler.addEventListener('hardwareBackPress', () => this.props.navigation.navigate("UserProfile"));
    
    if(Platform.OS=="ios"){
      Api.GetAppSettingByKetService(Auth.AppSettingKey.PDF_View_IOS_Enable).then(resp=>{
        this.setState({PDF_View_IOS_Enable:resp.data && resp.data != "False" && resp.data != "false"}, ()=> this.bindData());
        if(resp.data && resp.data != "False" && resp.data != "false"){
          this.setState(prevState=>({FilterTypeList:[...prevState.FilterTypeList, { Id: 4, Name: "Report", ServiceType: Auth.CallDetail_ServiceType.PDF_REPORT }]}))
        }
      });
    }
    else{
      this.setState({PDF_View_IOS_Enable:true}, ()=> this.bindData());
      this.setState(prevState=>({FilterTypeList:[...prevState.FilterTypeList, { Id: 4, Name: "Report", ServiceType: Auth.CallDetail_ServiceType.PDF_REPORT }]}))
    }

    
  };

  componentWillUnmount = () => {
    this.backHandler.remove();
  };
  

  bindData = () => {
    Api.CallHistoryService().then(resp => {
      console.log("CallHistoryService resp");
      if (resp.ResponseCode == 200) {
        this.setState({ CallHistory: resp.data, filteredCallHistory: resp.data.filter(o=> this.state.PDF_View_IOS_Enable || o.ServiceType!=Auth.CallDetail_ServiceType.PDF_REPORT), refreshing: false });
      }
    })
  };


  onRefresh = () => {
    this.setState({ refreshing: true, CallHistory: null, filteredCallHistory: null, FeedbackId: null });
    this.bindData();
  }

  filterClick = (filter) => {
    Singular.eventWithArgs("CallHistoryScreen_filterClick", { name: filter.Name });
    var filterData = this.state.CallHistory.filter(item => filter.ServiceType == null || item.ServiceType == filter.ServiceType);
    this.setState({ filteredCallHistory: filterData, selectedFilter: filter });
  }

  onDownloadNow = async(item) =>{
    if(Platform.OS=="android"){
      const permissionAndroid = await PermissionsAndroid.check('android.permission.WRITE_EXTERNAL_STORAGE');
      if(permissionAndroid != PermissionsAndroid.RESULTS.granted){
        const reqPer = await PermissionsAndroid.request('android.permission.WRITE_EXTERNAL_STORAGE');
        if(reqPer != 'granted'){
          return false;
        }
      }
    }
    this.setState({loading:true});
    var date = new Date();
    const { config, fs } = RNFetchBlob
    let DownloadDir = fs.dirs.DownloadDir // this is the pictures directory. You can check the available directories in the wiki.
    console.log("DownloadDir", DownloadDir);
    let options = {
      fileCache: true,
      addAndroidDownloads: {
        useDownloadManager: true, // setting it to true will use the device's native download manager and will be shown in the notification bar.
        notification: true,
        path: DownloadDir + "/"+item.Name.replace("2022 ","").replace(" ","_")+"2022" + Math.floor(date.getTime() + date.getSeconds() / 2) + ".pdf", // + "/me_"+Math.floor(date.getTime() + date.getSeconds() / 2) this is the path where your downloaded file will live in
        description: 'Downloading pdf.'
      }
      
    }
    config(options).fetch('GET', `${env.DynamicAssetsBaseURL}${item.Remark}`).then((res) => {
      // do some magic here
      Alert.alert("", "Download Completed.")
      this.setState({loading:false});
    });
  }

  render() {
    return (
      <SafeAreaView style={{flex:1}}>
      
      <UserControl.HeaderWithoutShare onBackPress={()=> /*this.props.navigation.navigate("UserProfile")*/ this.props.navigation.goBack()} title="Consultation history"/>
{
      this.state.filteredCallHistory == null &&
      <View style={{ flex: 1, justifyContent: "center", backgroundColor: "#fff" }}><ActivityIndicator color="#0000ff" /></View>
      ||
     
      <ScrollView style={{ flex: 1 }} refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}>

        {
          this.state.FilterTypeList &&
          <View style={{ height: 50 }}>
            <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
              <View style={{ flexDirection: "row", padding: 10 }}>
                {
                  this.state.FilterTypeList.map((item, index) => (
                    <TouchableOpacity key={index} onPress={() => this.filterClick(item)}>
                      <LinearGradient colors={this.state.selectedFilter != null && this.state.selectedFilter.Id == item.Id ? ["#7162FC", "#B542F2"] : ["#fff", "#fff"]} style={[{ borderRadius: 30, marginLeft: 10 }]}>
                        <Text style={[MainStyles.text, { paddingHorizontal: 20, paddingVertical: 3 }, this.state.selectedFilter != null && this.state.selectedFilter.Id == item.Id ? { color: "#fff" } : { color: "#000" }]}>{item.Name}</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  ))
                }
              </View>
            </ScrollView>
          </View>
        }

        {
          this.state.FeedbackId &&
          <FeedbackForm feedbackId={this.state.FeedbackId} onClose={() => this.setState({ FeedbackId: null })} onSubmit={(Rating) => { if(Rating<4)this.props.navigation.navigate("UserFeedbackScreen", {prefixMessage:("Astrologer Name:"+this.state.selectedItem.Name+"\nService Type:"+this.state.selectedItem.ServiceTypeName+"\n")}); this.onRefresh(); }} />
        }
        {
          this.state.filteredCallHistory.length == 0 && <View style={{ flex: 1, backgroundColor: "#fff", alignContent: "center", alignItems: "center", justifyContent: "center", backfaceVisibility: "#fff" }}><Text>NO RECORD FOUND</Text></View>
        }
        {
          this.state.filteredCallHistory && this.state.filteredCallHistory.length > 0 &&

          <View style={{ paddingTop: 10, backgroundColor: "#fff" }}>
            <View style={{ width: "90%", alignSelf: "center" }}>

              {
                this.state.filteredCallHistory.map((item, index) => (
                  item.ServiceType == 10 && <DownloadPDFCardView key={index} {...this.props} item={item} onPressDownload={()=> this.onDownloadNow(item)}/> ||
                  <CallChatVideoCardView key={index} {...this.props} item={item} onFeedbackClick={() => { Singular.event("CallHistoryScreen_FEEDBACK_Click"); this.setState({ FeedbackId: item.FeedbackId, selectedItem:item }) }} onPlay={(url)=> this.props.navigation.navigate("AudioPlayerScreen",{AudioUrl:url}) }/>
                )) 
              }
            </View>
          </View>
        }
        {/* <Modal visible={this.state.AudioUrl!=null}>
          <View style={{flex:1}}>
            <WebView
              javaScriptEnabled={true}
              scrollEnabled={false}
              allowsFullscreenVideo={true}
              source={{uri: this.state.AudioUrl}}
            />
            <View style={{alignItems:"center", alignContent:"center"}}>
                <TouchableOpacity onPress={()=> this.setState({AudioUrl:null})}>
                    <LinearGradient colors={["#ccc", "#ddd"]} style={{borderRadius:30, width:220, marginBottom:20}}>
                        <Text style={{color:"#000", padding:15, fontSize:16, textAlign:"center"}}>Exit</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
          </View>
        </Modal> */}
      </ScrollView>
  }
      </SafeAreaView>
    );
  }
}


const CallChatVideoCardView = (props) => {
  const { item } = props;
  return (
    <Card>

      <TouchableOpacity onPress={() => { Singular.event("CallHistoryScreen_filteredClick"); item.ServiceType == Auth.CallDetail_ServiceType.CHAT && props.navigation.navigate("ChatScreen", { Id: item.SessionId, ViewOnly: true }) }}>


        <View style={{ flexDirection: "row", padding: 10 }}>
          <View style={{ flex: 1, marginLeft: 15 }}>
            <TouchableOpacity onPress={() => props.navigation.navigate("ExpertDetailsScreen", { Id: item.ExpertId })}>
              <Image style={{ width: 50, height: 50, borderRadius: 25 }} resizeMode="cover" source={{ uri: `${env.DynamicAssetsBaseURL}${item.ProfileImage}` }} />
            </TouchableOpacity>
          </View>
          <View style={{ flex: 1, paddingLeft: 10 }}>
            <Text style={[Styles.listText1, {}]}>{item.StartDate}</Text>
            <Text style={[Styles.listText1, {}]}>{item.StartTime}</Text>
            <Text style={[Styles.listText2, {}]}>{item.Duration}</Text>
          </View>
          <View style={{ flex: 1, marginLeft: 10, alignItems: "flex-start" }}>
            {/* <Text style={[Styles.listText2,{}]}>Status</Text>
          <Text style={[Styles.listText1,{fontSize:16, textTransform:"capitalize"}]}>{item.Status}</Text> */}
            {
              item.ServiceType == Auth.CallDetail_ServiceType.DAKSHINA &&
              <Text style={[Styles.listText2, {}]}>Dakshina Amount</Text>
              ||
              <Text style={[Styles.listText2, {}]}>Total Cost</Text>
            }

            <Text style={[Styles.listText1, { fontSize: 16 }]}>₹ {item.CallCharges ?? 0}</Text>

            {
              item.IsFeedbackDone && item.TotalRating > 0 &&
              <View style={{ flexDirection: "row" }}>
                <Image style={{ width: 14, height: 14 }} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/star-active.png` }} />
                <Text style={[Styles.listText1, { fontSize: 16, color: "#FF65A0" }]}>{item.TotalRating.toFixed(1) ?? 0}</Text>
              </View>
            }
          </View>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 10 }}>
          <View>
            <Text style={[Styles.listText2, { marginTop: 0 }]}>{item.Name}</Text>

            {/* <Text style={[Styles.listText2,{marginTop:0, marginLeft:20, color:"#A848F4", fontWeight:"bold", textTransform:"capitalize"}]}>{item.ServiceTypeName}</Text> */}
            {
              item.ServiceType == Auth.CallDetail_ServiceType.DAKSHINA && <Text style={[Styles.listText2, { marginTop: 0, marginLeft: 20, color: "#A848F4", fontWeight: "bold", textTransform: "capitalize" }]}>Dakshina</Text> ||
              item.ServiceType == Auth.CallDetail_ServiceType.VOICE_CALL && <Text style={[Styles.listText2, { marginTop: 0, marginLeft: 20, color: "#D52837", fontWeight: "bold", textTransform: "capitalize" }]}>Voice Call</Text> ||
              item.ServiceType == Auth.CallDetail_ServiceType.VIDEO_CALL && <Text style={[Styles.listText2, { marginTop: 0, marginLeft: 20, color: "#793900", fontWeight: "bold", textTransform: "capitalize" }]}>Video Call</Text> ||
              item.ServiceType == Auth.CallDetail_ServiceType.CHAT && <Text style={[Styles.listText2, { marginTop: 0, marginLeft: 20, color: "#A848F4", fontWeight: "bold", textTransform: "capitalize" }]}>Read Chat</Text>
            }
          </View>
          {
            item.ServiceType == Auth.CallDetail_ServiceType.VOICE_CALL && item.Call_Recording_URL &&
            <TouchableOpacity onPress={()=> props.onPlay(item.Call_Recording_URL)}>
              <LinearGradient colors={["#F09B39", "#ED7931"]} style={{ borderRadius: 30, marginBottom: 20 }}>
                <Text style={{ color: "#fff", paddingHorizontal: 20, paddingVertical: 2, fontSize: 12, textAlign: "center" }}>Call Recording</Text>
              </LinearGradient>
            </TouchableOpacity>
          }
          {
            !item.IsFeedbackDone &&
            <TouchableOpacity onPress={() => props.onFeedbackClick()}>
              <LinearGradient colors={["#A3CA3E", "#799D15"]} style={{ borderRadius: 30, marginBottom: 20 }}>
                <Text style={{ color: "#fff", paddingHorizontal: 20, paddingVertical: 2, fontSize: 12, textAlign: "center" }}>FEEDBACK</Text>
              </LinearGradient>
            </TouchableOpacity>
          }
        </View>
      </TouchableOpacity>
    </Card>
  )
}



const DownloadPDFCardView = (props) => {
  const { item } = props;
  const [loading, setLoading] = useState(false);

  const onDownload = () => {
    props.onPressDownload();
    //props.navigation.navigate("PdfViewerScreen",{Url:`${env.DynamicAssetsBaseURL}${item.Remark}`})
  }

  return (
    <Card>
      <View style={{ flexDirection: "row", padding: 10 }}>
        <View style={{ flex: 1, alignContent: "center", alignItems: "center", justifyContent: "center" }}>
          <View style={{ borderWidth: 2, borderRadius: 1, borderColor: "#ddd", borderStyle: "dashed" }}>
            <Image style={{ width: 30, height: 45 }} resizeMode="stretch" source={{ uri: `${env.DynamicAssetsBaseURL}${item.ProfileImage}` }} />
          </View>
        </View>
        <View style={{ flex: 1, paddingLeft: 10 }}>
          <Text style={[Styles.listText1, {}]}>{item.StartDate}</Text>
          <Text style={[Styles.listText1, {}]}>{item.StartTime}</Text>
        </View>
        <View style={{ flex: 1, marginLeft: 10, alignItems: "flex-start" }}>



          <Text style={[Styles.listText2, {}]}>Total Cost</Text>


          <Text style={[Styles.listText1, { fontSize: 16 }]}>₹ {item.CallCharges ?? 0}</Text>


        </View>
      </View>

      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 10 }}>
        <View>
          <Text style={[Styles.listText2, { marginTop: 0, marginLeft: 20, color: "#A848F4", fontWeight: "bold", textTransform: "capitalize" }]}>{item.Name}</Text>
        </View>

        {
          item.Remark &&
          <View style={{ alignItems: "center", justifyContent: "center" }}>
            <TouchableOpacity onPress={() => !loading && onDownload()}>
              <LinearGradient colors={["#FF8767", "#FF65A0"]} style={{ borderRadius: 30, marginBottom: 5 }}>
                {
                  loading && <ActivityIndicator style={{ paddingVertical: 5 }} color="blue" /> ||
                  <Text style={{ color: "#fff", paddingHorizontal: 20, paddingVertical: 3, fontSize: 12, textAlign: "center" }}>DOWNLOAD</Text>
                }

              </LinearGradient>
            </TouchableOpacity>
            <Text style={{ fontSize: 12, marginBottom: 10 }}>Available for 30days</Text>
          </View>
        }

      </View>

    </Card>
  )
}


const Styles = StyleSheet.create({
  cartItem: { flex: 1, alignContent: "center", alignItems: "center", justifyContent: "center" },
  bottomText: { ...MainStyles.text, padding: 10, fontSize: 18, textAlign: "center" },
  itemCell: { width: 100, height: 50, margin: 20, transform: [{ rotate: '-90deg' }], alignItems: "center", justifyContent: "center" },
  boxTex1: { ...MainStyles.text, color: "#fff", paddingTop: 10 },
  listText1: { ...MainStyles.text, fontSize: 14, color: "#131313" },
  listText2: { ...MainStyles.text, fontSize: 12, color: "#656565" }
})