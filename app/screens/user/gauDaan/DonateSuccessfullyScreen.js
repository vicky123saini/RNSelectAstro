import React, { Component } from 'react'
import { View, Text, TouchableOpacity, Image, SafeAreaView, ScrollView, StyleSheet, ImageBackground } from 'react-native'
import Share from 'react-native-share';
import * as Api from '../../../Api';
import * as Auth from '../../../Auth';
import * as env from '../../../../env';
import RNFetchBlob from "rn-fetch-blob";
import Overlay from 'react-native-modal-overlay';
import analytics from '@react-native-firebase/analytics';

export default class DonateSuccessfullyScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
      }

    componentDidMount = () => {
      const{type, Id, mealCount}=this.props.route.params??{};
      analytics().logEvent("Gau_Seva_Purchase", {type, Id});

      Api.GetMandirPujaListService("", 1, 10).then(response=>{
        console.log("GetMandirPujaListService", response);
        if (response != null && response.ResponseCode == 200) {
          this.setState({data:response.data});
        }
        else if (response != null && response.ResponseCode == 401) {
          Auth.RemoveSession({ navigation: this.props.navigation })
        }
      });
    };
    
     
      onShare = async () => {

  var App_Playstore_Link=await Api.GetAppSettingByKetService(Auth.AppSettingKey.App_Playstore_Link).then(resp=>resp.data);

    

  var url=`${env.AssetsBaseURL}assets/images/gau-seva/share-image.png`;
  //var url = `https://services.myastrotest.in/Content/App/assets/images/image2.jpg`;

  const fs = RNFetchBlob.fs;
  let imagePath = null;
  RNFetchBlob.config({
    fileCache: true
  })
    .fetch("GET", url)
    // the image is now dowloaded to device's storage
    .then(resp => {
      // the image path you can use it directly with Image component
      imagePath = resp.path();
      return resp.readFile("base64");
    })
    .then(async base64Data => {
      // here's base64 encoded image
      //console.log("data:image/jpeg;base64,"+base64Data);

      const message=`Namaste! 🛕🙏🏽 Mana jata hai Gau Seva Karne se jeevan mein sukh, shanti aur safalta bani rehti hai. ⭐ Aj Mene myastrotest App Ke Madhyam Se Gau Bhojan Daan kiya. 🌿 Meri Aasha Hai Ki Aap Bhi Gau Bhoj Daan Se  Gau Mata ka ashirvad prapt kare😊 Gau Seva Ke Liye Click:  ${App_Playstore_Link} 🤳`;

      console.log("message", message); 

      const shareOptions = {
        title: 'gau seva',
        type:"image/png",
        //social: Share.Social.WHATSAPP,
        url: "data:image/png;base64,"+base64Data, // places a base64 image here our your file path
        message:message
        //social: 'whatsapp',
      };

      try {
        //const ShareResponse = await Share.shareSingle(shareOptions);
        const ShareResponse = await Share.open(shareOptions);
        console.log("ShareResponse =>", ShareResponse);
         

      } catch (error) {
        console.log('Error =>', error);
      }
      // remove the file from storage
      return fs.unlink(imagePath);
    });
  
}

    render() {
      const{mealCount}=this.props.route.params??{};
        return (
            <SafeAreaView>
                <ScrollView>
                    <View style={{}}>
                        <Image source={{ uri: `${env.AssetsBaseURL}/assets/images/gau-seva/Rectangle65.png` }} style={styles.Image_Top_View} />
                    </View>
                    <View style={styles.View_One}>
                        <Text style={styles.Text16}>Gau Mata Ka Ashirwad, Apke Sath</Text>
                        <Image source={{ uri: `${env.AssetsBaseURL}/assets/images/gau-seva/Group.png` }} style={styles.Image_Group} />
                        <Text style={ styles.Text20}>Dhanyavaad</Text>
                        <Text style={ styles.Text20}>Apka Daan Safal Raha</Text>
                        <Text style={styles.Text11}>Apke daan dwara Gau Mata ko {mealCount} meal samarpit kare gaye hain.</Text>
                        <Text style={styles.Text12}>Yeh shubh kam apne friends & family ke sath share karein.</Text>

                        <TouchableOpacity onPress={()=> this.onShare()}>
                          <View style={styles.Button_View}>
                            <Image source={{ uri: `${env.AssetsBaseURL}/assets/images/gau-seva/share-2.png` }} style={{width:12, height:12, marginRight:6}} />
                            <Text style={ styles.Text16_White}>Share</Text>
                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={()=> this.props.navigation.replace("UserHomeScreen")}>
                            <Text style={styles.Text13}>Go back</Text>
                        </TouchableOpacity>
                        <View>
                          <Text style={styles.Text13_start}>Our Puja Services</Text>
                          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                          <View style={{ flexDirection: "row" }}>
                            {
                              this.state.data && this.state.data.map((item, index) => {
                                return (
                                  <TouchableOpacity key={index} onPress={()=> this.props.navigation.navigate("UserPoojaDetailsScreen", {Id:item.Id})}>
                                    <View style={{flex:1, backgroundColor:"#ffe", alignItems:"center", width:83, marginRight:10}}>
                                      <Image style={{ width: 83, height: 83, borderRadius:10 }} resizeMode="cover" source={{ uri: `${env.DynamicAssetsBaseURL}${item.Image}` }} />
                                      <Text style={{fontSize:12, textAlign:"center"}}>{item.Name}</Text>
                                    </View>
                                  </TouchableOpacity>
                                )
                              })
                            }
            
                          </View>
                        </ScrollView>
                      </View>       

                    </View>
                    

                </ScrollView>
            </SafeAreaView>
        )
    }
}
const styles = StyleSheet.create({
    Image_Top_View: { height: 475, width: '100%' },
    Image85:{height:85,width:85},
    Image_Group:{ height: 175, width: 249 },
    View_One:{ backgroundColor: '#fff', top: -44, height: '100%', width: '100%', borderRadius: 50, paddingHorizontal: 15, alignItems: 'center' },
    Button_View:{ flexDirection:"row", height: 47, width: 180, borderRadius: 25, backgroundColor: '#7E388B', alignItems: 'center', justifyContent: 'center',marginTop:10 },
    Text16:{ fontSize: 16, fontWeight: '700', textAlign: 'center', margin: 20 },
    Text20:{ fontSize: 20, fontWeight: '500', },
    Text11:{ fontSize: 11, fontWeight: '400', textAlign: 'center', marginVertical:10 },
    Text12:{ fontSize: 12, fontWeight: '700', margin: 10 },
    Text16_White:{ fontSize: 16, fontWeight: '700', color: '#fff' },
    Text13:{ fontSize: 13, fontWeight: '700', marginTop: 10 },
    Text13_start:{ fontSize: 13, fontWeight: '700', marginTop: 30, marginBottom:10,alignSelf:'flex-start' },
    Text10:{fontSize:10,fontWeight:'500',textAlign:'center'}

})