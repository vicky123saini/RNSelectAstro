import React, { Component } from 'react'
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    ImageBackground,
    Alert,
    Modal,
    Pressable,
    TextInput,

} from 'react-native';
import MyStyle from './style';
import * as env from '../../../../env';
import * as Api from '../../../Api';
import * as Auth from '../../../Auth';

export default class VideoScreen extends Component {
  render() {
    return (
     <SafeAreaView style={MyStyle.BodyOne}>
                         <View style={{ flex: 1 }}>
                    <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/image_2.png`}} style={MyStyle.Back_Image} />
                    <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/shadow_top.png`}} style={MyStyle.Back_Image_One} />

                    <View style={MyStyle.Direction_Row_Between}>
                        <View style={MyStyle.Status_Position} />
                        <View style={[MyStyle.Status_Position, { backgroundColor: '#fff' }]} />
                        <View style={MyStyle.Status_Position} />
                        <View style={MyStyle.Status_Position} />
                        <View style={MyStyle.Status_Position} />
                        <View style={MyStyle.Status_Position} />
                    </View>
                    <View style={[MyStyle.Direction_Row_Between, { margin: 10, alignItems: 'center' }]}>
                        <View style={MyStyle.Direction_Row_Center}>
                            <TouchableOpacity style={MyStyle.Cricle}>
                                <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/Profile_One.png`}} style={MyStyle.Image_55} />
                            </TouchableOpacity>
                            <View style={MyStyle.Text_MarginHorizontal}>
                                <Text style={MyStyle.Text20_Regular_wHITE}>Pandit Badri Prasad</Text>
                                <View style={MyStyle.Direction_Row}>
                                    <View style={MyStyle.Direction_Row_Center}>
                                        <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/View.png`}} style={MyStyle.Image_20} />
                                        <Text style={MyStyle.Text16_Regular_White}>345</Text>
                                    </View>
                                    <View style={[MyStyle.Direction_Row_Center, MyStyle.Text_MarginHorizontal]}>
                                        <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/Path.png`}} style={MyStyle.Image_16} />
                                        <Text style={MyStyle.Text16_Regular_White}>212</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <TouchableOpacity style={MyStyle.Buton_Small_Border}>
                            <Text style={MyStyle.Text12_Bold_White}>Follow</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/share-2.png`}} style={MyStyle.Image_25} />
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/Close.png`}} style={MyStyle.Image_25} />
                        </TouchableOpacity>

                    </View>
                    <View style={[MyStyle.Direction_Row_Between, MyStyle.Text_MarginHorizontal]}>
                        <View style={[MyStyle.Direction_Row_Between, { width: '40%' }]}>
                            <View style={{ height: 30, width: 100, borderRadius: 15, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 5 }}>
                                <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/Profile_One.png`}} style={MyStyle.Cricle_25} />
                                <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/sound-2.png`}} style={MyStyle.Image_20} />
                                <Text style={MyStyle.Text12_Bold}>35:17</Text>
                            </View>
                            <View style={MyStyle.Cricle_25}>
                                <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/Profile_Three.png`}} style={MyStyle.Image_25} />
                            </View>
                            <View style={MyStyle.Cricle_25}>
                                <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/Add.png`}} style={MyStyle.Image_20} />
                            </View>

                        </View>
                        <View >
                            <TouchableOpacity >
                                <ImageBackground source={{uri:`${env.AssetsBaseURL}/assets/images/live/Profile_Four.png`}} style={[MyStyle.Image_40, MyStyle.Text_MarginVertical, { justifyContent: 'center' }]}>
                                    <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/har_1.png`}} style={[MyStyle.Image_20, MyStyle.Medal_View]} />
                                </ImageBackground>
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <ImageBackground source={{uri:`${env.AssetsBaseURL}/assets/images/live/Profile_Five.png`}} style={[MyStyle.Image_40, { justifyContent: 'center' }]}>
                                    <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/har_2.png`}} style={[MyStyle.Image_20, MyStyle.Medal_View]} />
                                </ImageBackground>
                            </TouchableOpacity>
                            <TouchableOpacity  >
                                <ImageBackground source={{uri:`${env.AssetsBaseURL}/assets/images/live/Profile_Six.png`}} style={[MyStyle.Image_40, MyStyle.Text_MarginVertical, { justifyContent: 'center' }]}>
                                    <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/har_3.png`}} style={[MyStyle.Image_20, MyStyle.Medal_View]} />
                                </ImageBackground>
                            </TouchableOpacity>
                        </View>
                    </View>

 




                </View>
                
                <View style={{ flex: 1 }}>
                    <View style={MyStyle.Direction_Row}>
                        <View style={{ flex: 1 }}>
                            <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/shadow_bottom.png`}} style={MyStyle.Back_Image} />
                            <View>
                                <View style={[MyStyle.Direction_Row, MyStyle.Text_MarginVertical]}>
                                    <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/Profile_Seven.png`}} style={[MyStyle.Image_40, MyStyle.Text_MarginHorizontal]} />
                                    <View>
                                        <Text style={MyStyle.Text12_Bold_White}>Heena</Text>
                                        <Text style={MyStyle.Text20_Regular_wHITE}>Started watching</Text>
                                    </View>
                                </View>
                                <View style={[MyStyle.Direction_Row, MyStyle.Text_MarginVertical]}>
                                    <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/Profile_Eight.png`}} style={[MyStyle.Image_40, MyStyle.Text_MarginHorizontal]} />
                                    <View>
                                        <Text style={MyStyle.Text12_Bold_White}>Rekha</Text>
                                        <Text style={MyStyle.Text20_Regular_wHITE}>Hi</Text>
                                    </View>
                                </View>

                                <ImageBackground source={{uri:`${env.AssetsBaseURL}/assets/images/live/Shaddow.png`}} style={MyStyle.Image_60_293}>
                                    <View style={MyStyle.Direction_Row_Between_Center}>
                                        <View style={[MyStyle.Direction_Row, MyStyle.Text_MarginVertical]}>
                                            <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/Profile_Five.png`}} style={[MyStyle.Image_40, MyStyle.Text_MarginHorizontal]} />
                                            <View>
                                                <Text style={MyStyle.Text12_Bold_White}>ZESHAN</Text>
                                                <Text style={MyStyle.Text20_Regular_wHITE}>Sent a Gift !</Text>
                                            </View>

                                        </View>
                                        <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/Gift.png`}} style={[MyStyle.Image_46, { right: 10 }]} />
                                    </View>

                                </ImageBackground>


                                <View style={[MyStyle.Direction_Row, MyStyle.Text_MarginVertical]}>
                                    <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/Profile_Nine.png`}} style={[MyStyle.Image_40, MyStyle.Text_MarginHorizontal]} />
                                    <View>
                                        <Text style={MyStyle.Text12_Bold_White}>Visitor234</Text>
                                        <Text style={MyStyle.Text20_Regular_wHITE}>Started Watching</Text>
                                    </View>
                                </View>
                                <View style={[MyStyle.Direction_Row, MyStyle.Text_MarginVertical]}>
                                    <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/Profile_Eight.png`}} style={[MyStyle.Image_40, MyStyle.Text_MarginHorizontal]} />
                                    <View>
                                        <Text style={MyStyle.Text12_Bold_White}>Visitor234</Text>
                                        <Text style={MyStyle.Text20_Regular_wHITE}>Hello</Text>
                                    </View>
                                </View>


                            </View>

                        </View>
                        <View style={{ flex: 1 }}>
                            <TouchableOpacity style={MyStyle.Call_Position_One}>
                                <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/call_123.png`}} style={{height:56,width:116}} />
                            </TouchableOpacity>
                            <TouchableOpacity style={MyStyle.Video_Call_Position_One}>
                                <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/video_12341.png`}} style={{height:100,width:135}} />
                            </TouchableOpacity>

                        </View>
                    </View>
                    <View>
                        <View style={[MyStyle.Direction_Row_Between_Center, MyStyle.Text_MarginHorizontal]}>
                            <View style={MyStyle.Search_View}>
                                <TextInput placeholder='Type something...' style={MyStyle.Text_MarginHorizontal} />
                            </View>
                            <TouchableOpacity>
                                <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/Heart_White.png`}} style={MyStyle.Image_25_30} />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/Gift_White.png`}} style={MyStyle.Image_25_30} />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/Not_Send.png`}} style={MyStyle.Image_25_30} />
                            </TouchableOpacity>
                            <TouchableOpacity>
                                <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/Video_Start.png`}} style={MyStyle.Image_25_30} />
                            </TouchableOpacity>
                        </View>

                    </View>
                    <Image source={{uri:`${env.AssetsBaseURL}/assets/images/live/shadow_bottom.png`}} style={MyStyle.Back_Image_One} />
                </View>
     </SafeAreaView>
    )
  }
}
