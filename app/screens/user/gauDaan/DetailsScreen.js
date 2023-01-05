import React, { Component, useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, SafeAreaView, ScrollView, Linking, StyleSheet, ImageBackground, ActivityIndicator, Alert, Modal, Dimensions, FlatList, SectionList, Platform } from 'react-native';
import { SliderBox } from "react-native-image-slider-box";
import {Button} from './Controls';
import LinearGradient from 'react-native-linear-gradient';
import * as Api from '../../../Api';
import * as Auth from '../../../Auth';
import * as env from '../../../../env';
import { Accordion } from "native-base";
import analytics from '@react-native-firebase/analytics';

export default class DetailsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        // Faqs:[
        //     {title:"What is Gau Seva?", content:"Gau Seva, is the ultimate 'yagna' and means feeding cows with grass, protecting them with shelter, and providing clean water to drink."},
        //     {title:"Why We Do Gau Seva?", content:"Feeding Chaara And Doing Gau Seva bring peace in life and various difficulties in life are easily avoided."},
        //     {title:"What Is Seva Rashi?", content:"When you recharge on the myastrotest App, you receive Seva Rashi points that you can donate to the myastrotest Gau Seva Service."},
        //     {title:"How is Seva Rashi Credited In My Account If I Did Not Purchase It?", content:"Seva Rashi is credited along with every recharge you make on the myastrotest App."},
        //     {title:"How Do I Purchase More  Meals For Gau Seva?", content:"You can also purchase additional meals by clicking on “Buy more Seva Rashi” on the Gau Seva Page."},
        //     {title:"Will I Get A Certificate By Contributing To The myastrotest Gau Seva Service?", content:"Yes, after a successful donation of Seva Rashi, you will receive a confirmation WhatsApp message and an Acknowledgement Certificate."},
        //     {title:"Will I Get Any Photograph Or Video Of My Donation For The Gau Seva Service?", content:"No, there will be no individual video or photograph shared for the Gau Seva. We will be posting Gau Seva videos across our social media and within our app."},
        // ],
        TextSliderData:[
            "Gau Mata ko chaara khilane se jeevan mein shanti aati hai aur vibhinn badhayein asani se tal jate hain.",
            //"Apne Seva Rashi  ka prayog Gau Seva mein daan karein aur 10,000 meals Tak pohonchne mein humara sath dein.",
            "myastrotest apke nam pe Gau Mata ko chara kilate hain, jisse apko milta hai  Gau Ma ka aashirwad.",
            "Apni Free Seva Rashi yahan calculate karein ya apni shraddha anusar Daan Rashi select karein"
        ]
    };
  }

  componentDidMount = () => {
    analytics().logEvent("Gau_Seva_Detail");
    //this.props.navigation.replace("GauDaanDonateSuccessfullyScreen", {mealCount:5, type:"COIN"});
    Api.GetBalanceRewardService().then(resp => {
        console.log("GetBalanceRewardService resp", resp);
        if (resp.ResponseCode == 200) {
          this.setState({balance:resp.data.Balance})
        }
    });
    Api.WhatsApp_Communication_NumberService("GauDaan").then(resp=> {
        console.log("WhatsApp_Communication_NumberService resp", resp);
        if(resp.ResponseCode == 200){
          this.setState({WhatsAppNo:resp.data.MobileNo})
        }
      });
  };
  

  render() {
    return (
        <SafeAreaView style={styles.Container}>
            <ScrollView style={{flex:1}} ref={(node) => this.scroll = node}>
                    <View style={styles.Headers_View}>
                        <Text style={styles.Text32}>GAU SEVA</Text>
                        <View style={{flexDirection:"row", alignItems:"center", justifyContent:"center"}}>
                            <Text style={[styles.Text12,{color: '#7E388B', marginRight:5 }]}>Seva Rashi</Text>
                            <View style={styles.Top_view}>
                                <Image source={{ uri: `${env.AssetsBaseURL}/assets/images/gau-seva/Frame_fa.png` }} style={styles.Icon_Small} />
                                <Text style={{ fontSize: 16 }}>{this.state.balance??".."}</Text>
                            </View>
                        </View>
                    </View>
                    <View style={{padding:10}}>
                        <Text style={styles.Text20}>Mission 10,000 Meals for cows</Text>
                        <Text style={styles.Text12}>Gau Mata Ko Chaara Daan Karein</Text>
                        <Text style={styles.Text12_margin}>Gau Mata ki seva karne se sabhi devtaon ko bhog lag jaata hai. Sabhi tirtho ke punyo ka labh lein aur apne parivaar samast jeevan pein shanti layein. Ghar baithe hi Gau Mata ko chaara khilayein.</Text>
                    </View>
                    {/* <View>
                        <Image source={{ uri: `${env.AssetsBaseURL}/assets/images/gau-seva/Rectangle_Gau.png` }} style={styles.Image_Big} />
                        <Text style={styles.Bottom_View}>Apne Coins Gau Seva Mein Daan Karein</Text>
                    </View> */}
                    <View>
                        <BannerView/>
                    </View>

                    {/* <View style={{ marginVertical: 20, alignItems:"center" }}>
                        <Image resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/gau-seva/feed-a-cow-bn.png` }} style={{width:315, height:168 }} />
                    </View> */}

                    <View style={{ marginVertical: 20, alignItems:"center" }}>
                        <TextSliderView data={this.state.TextSliderData}/>
                    </View>
                    
                    <View style={{ alignItems:"center" }}>
                        <TouchableOpacity onPress={() => { this.scroll.scrollTo({ y: 800 }) }}>
                            <Image style={{width:40, height:40}} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/down-arrow.png`}}/>
                        </TouchableOpacity>
                    </View>

                    <View style={{padding:10}}>
                        <CounterView/>
                    </View>

                    <View style={{padding:10}}>
                        {
                            this.state.balance != null &&
                            <CalculatorView balance={this.state.balance} navigation={this.props.navigation}/>
                        }
                    </View>
                    
                    <View>
                        <ImageGallery {...this.props}/>
                    </View>

                    <View style={{paddingBottom:20}}>
                        <FaqsView/>
                    </View>

                    <View style={{padding:10, paddingBottom:40 }}>
                        <TouchableOpacity onPress={()=> Linking.openURL(`whatsapp://send?text=hello&phone=${this.state.WhatsAppNo}`)}>
                            <ImageBackground source={{ uri: `${env.AssetsBaseURL}/assets/images/gau-seva/Rectangle_Row.png` }} style={[styles.Image30, {flexDirection:"row", alignItems:"center", justifyContent:"center"}]} >
                                <Text style={{fontSize:14, fontWeight:"700", color:"#70398D"}}>Have a question ?</Text>
                                <Image style={{width:30, height:30}} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/share-icon.png`}}/>
                            </ImageBackground>
                        </TouchableOpacity>
                    </View>
            </ScrollView>
        </SafeAreaView>
    );
  }
}

const FaqsView = (props) => {
    const[data,setData]=useState();
    useEffect(()=>{
        Api.GetFaqsGauSevaService().then(resp => {
            console.log("GetFaqsGauSevaService resp", resp);
            if (resp.ResponseCode == 200) {
                setData(resp.data);
            }
        });
    },[]);
    return(
        data &&
        <View style={{padding:10, backgroundColor:"#fff"}}>
            <Text style={{marginRight:20, fontWeight:"bold", fontSize:16, padding:10, textDecorationLine:"underline"}}>FAQs</Text>
            <Accordion 
            dataArray={data}
            renderContent={(item, index)=> (
                <View key={index} style={{padding:10, borderBottomColor:"#000", borderBottomWidth:1}}>
                <Text style={{fontSize:13, fontWeight:"700"}}>{item.content}</Text>
                </View>
            )}
            headerStyle={{backgroundColor:"#F0F0F0"}}
            renderHeader={(item, expanded, index)=>(
                <View key={index} style={[{flexDirection:"row", backgroundColor:"#fff", padding:10, alignItems:"center", justifyContent:"space-between", borderBottomWidth:1, borderBottomColor:"#000"}, expanded && {backgroundColor:"#F0F0F0", borderBottomWidth:0}]}>
                <Text style={{color:"#70398D", fontSize:13, fontWeight:"700"}}>{item.title}</Text>
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
        ||
        <View></View>
    )
}

const BannerView_Temp = () => {
    const[data,setData]=useState()
    useEffect(()=>{
        console.log("GetBannersService req");
        Api.GetBannersService("GAU_SEVA").then(resp => {
          console.log("GetBannersService resp", resp);
          if (resp.ResponseCode == 200) {
            setData(resp.data);
          }
        });
    },[]);

    return(
        data &&
        <SliderBox
            style={styles.Image_Big}
            autoplayInterval={5000}
            images={data.map((item, index)=> `${env.DynamicAssetsBaseURL}${item.BannerUrl}`)}
                
            autoplay
            circleLoop
        />
        ||
        <ActivityIndicator color="blue"/>
    )
}

 

class BannerView extends Component {
  constructor(props) {
    super(props);
    this.state = {
        data:[],
        userRequest:{
            selectedIndex : 0,
            sectionListSIndex: 0
        }
    };
    this.flatListRef=null;

    this.DEVICE_Width = Dimensions.get('window').width
    this.DEVICE_Height = Dimensions.get('window').width
    this.Item_Spacing = 15
    this.Interval_Time = 3000
  }

  componentDidMount = () => {
    console.log("GetBannersService req");
    Api.GetBannersService("GAU_SEVA").then(resp => {
        console.log("GetBannersService resp", resp);
        if (resp.ResponseCode == 200) {
            this.setState({data:resp.data}, ()=> this.init());
        }
    });
  };

  init = () =>{
    console.debug('@ Section Index' + this.state.userRequest.sectionListSIndex)
    try{
      this.flatListRef?.scrollToIndex({
      index: this.state.userRequest.selectedIndex,
      animated: true,
      viewOffset: this.Item_Spacing
    })

    }
    catch(e){
        console.debug('@Failure on Use Effect')
        console.log(e);
    }
    this.startTimer()
  }

  _renderItem = ({ item }) => (
        <View style={{width: this.DEVICE_Width - (this.Item_Spacing * 4), height:190, padding:5}}>
            <Image style={{width: this.DEVICE_Width - (this.Item_Spacing * 4) - 10, height:190}} resizeMode="stretch" source={{uri:`${env.DynamicAssetsBaseURL}${item.BannerUrl}`}}/>
        </View>
    );

    stopTimer = () => {
        clearInterval(this.interval)
      }
    
      startTimer = () => {
        this.stopTimer()
        this.interval = setInterval(()=> {
          this.animationSequence()
        }, this.Interval_Time)
      }


      animationSequence = () => {
          
        if(this.state.data==null) return;
           
        var newSelectedIndex = this.state.userRequest.selectedIndex + 1
        if (newSelectedIndex > this.state.data.length - 1) newSelectedIndex = 0
        var index = this.state.userRequest.sectionListSIndex + 1
        //if (index > DATASection.length - 1) index = 0
        //console.log("newSelectedIndex", newSelectedIndex, "index", index);
        this.setState({userRequest:{
            sectionListSIndex: index,
            selectedIndex: newSelectedIndex
        }})
        try{
            this.flatListRef?.scrollToIndex({
            index: newSelectedIndex,
            animated: true,
            viewOffset: this.Item_Spacing
            })
      
          }
          catch(e){
              console.debug('@Failure on Use Effect')
              console.log(e);
          }
        }
    
      touchBeginEventHandler = (event) => {
        try{
          const currentOffset = event.nativeEvent.contentOffset.x
          this.offset = currentOffset
        }catch{console.debug('@Touch Begin Event Handler Failed')}
      }
    
      setSelectedIndexOnUserTouch = (event) =>{
        if(this.state.data==null) return;

        var currentOffset = event.nativeEvent.contentOffset.x
        var isLeft = true
        let threshHoldValue = this.DEVICE_Width * 0.2
        isLeft = currentOffset >= this.offset
        let movMagnitude = isLeft ? currentOffset - this.offset : this.offset - currentOffset
        if (movMagnitude >= threshHoldValue){
            isLeft = currentOffset >= this.offset
            var toAdd = isLeft ? 1 : -1
            let n = this.state.userRequest.selectedIndex + toAdd
            if (n < 0) n = 0
            else if (n >= this.state.data.length) n = this.state.data.length
            this.offset = currentOffset
            this.setState(prevState => ({userRequest:{
                sectionListSIndex: prevState.userRequest.sectionListSIndex,
                selectedIndex: n
            }}))
             
        } 
      }


  render() {
    return (
        
         
             this.state.data &&
             <FlatList 
             horizontal
             //ref={this.flatListRef}
             ref={ (ref) => (this.flatListRef=ref) }
             style={{ width: this.DEVICE_Width, paddingVertical: 10}}
             data={this.state.data}
             keyExtractor={item => item.id}
             renderItem={this._renderItem}
             contentContainerStyle= {{paddingStart: this.Item_Spacing, paddingEnd: this.Item_Spacing * 3}}
             showsHorizontalScrollIndicator={false}
             showsVerticalScrollIndicator={false}
             snapToAlignment={'center'}
             onTouchStart={()=>{
                this.stopTimer()
             }
             }
             onTouchEnd={()=>{
                this.startTimer()
             }}
             onTouchCancel={()=>{
                this.startTimer()
             }}
             onScrollBeginDrag={(nativeEvent) => {
                this.touchBeginEventHandler(nativeEvent)
             }}
             onScrollEndDrag={(nativeEvent) => {
                this.startTimer()
                this.setSelectedIndexOnUserTouch(nativeEvent)
             }}
             />
             ||
             <ActivityIndicator color="blue"/>
      );
  }
}

 

const CounterView = () => {
    const[data,setData]=useState();
    const[prefix, setPrefix]=useState();

    useEffect(()=>{
        Api.GetTotalFeedsGauSevaService().then(resp => {
            console.log("GetTotalFeedsGauSevaService resp", resp);
            if (resp.ResponseCode == 200) {
                var Total=resp.data.Total.toString();
                setData(Total);
                setPrefix(5-Total.length);
                //resp.data.Total
            }
        });
    },[])
    return(
        <View>
            
            <View style={{marginTop:20}}>
            <ImageBackground source={{ uri: `${env.AssetsBaseURL}/assets/images/gau-seva/Rectangle_banner.png` }} style={styles.Background_Image}>
                            <View style={{ flexDirection: 'row' }}>
                                <View>
                                    <View style={styles.Inner_View}>
                                        <Text style={styles.Text19}>GAU SEVA DONATED</Text>
                                        <Text style={styles.Text12_Right}>till today</Text>
                                    </View>
                                </View>
                                <View style={styles.Counter_View}>
                                    <Text style={styles.Text11}>Our Goal-10,000</Text>
                                    <View style={{ flexDirection: 'row' }}>
                                        {
                                            prefix &&
                                            Array.from({length:prefix}).map((_, i)=>(
                                                <View style={styles.Text_View}>
                                                    <Text style={styles.Text_Count}>0</Text>
                                                </View>
                                            ))
                                        }
                                        {
                                            data &&
                                            Array.from({length:data.length}).map((_, i)=>(
                                                <View style={styles.Text_View}>
                                                    <Text style={styles.Text_Count}>{data[i]}</Text>
                                                </View>
                                            ))
                                            ||
                                            <>
                                            <View style={styles.Text_View}>
                                                <Text style={styles.Text_Count}>0</Text>
                                            </View>
                                            <View style={styles.Text_View}>
                                                <Text style={styles.Text_Count}>0</Text>
                                            </View>
                                            <View style={styles.Text_View}>
                                                <Text style={styles.Text_Count}>0</Text>
                                            </View>
                                            <View style={styles.Text_View}>
                                                <Text style={styles.Text_Count}>0</Text>
                                            </View>
                                            <View style={styles.Text_View}>
                                                <Text style={styles.Text_Count}>0</Text>
                                            </View>
                                            <View style={styles.Text_View}>
                                                <Text style={styles.Text_Count}>0</Text>
                                            </View>
                                            </>
                                        }
                                         
                                    </View>
                                </View>
                            </View>
                        </ImageBackground>
            </View>   
            <View style={{ marginTop:20 }}>
                <Image source={{ uri: `${env.AssetsBaseURL}/assets/images/gau-seva/Rectangle_Row.png` }} style={styles.Image30} />
                <Text style={styles.Font12}>Ap Kitne Dino Tak Gau Seva Karna Chahenge?</Text>
            </View>   
        </View>
    )
}

const TextSliderView = (props) => {
    const{data}=props;
    return(
        data.map((item, index)=>
        <View style={{flexDirection:"row"}}>
            {
                index%2==0 &&
                    <View style={{flex:1, paddingHorizontal:10}}></View>
                ||
                <View style={{flex:1, paddingHorizontal:10}}>
                    <Text style={{color:"#4A4A4A", fontSize:12, textAlign:"right"}}>{item}</Text>
                </View>
            }
            <View style={{flex:0, alignItems:"center", paddingHorizontal:2}}>
                <View style={{flex:0, width:12, height:12, borderRadius:6, backgroundColor:"#683A8E"}}/>
                {
                    (index+1)!=data.length &&
                    <View style={{flex:1, backgroundColor:"#683A8E", width:1}}/>
                }
            </View>
            {
                index%2!=0 &&
                    <View style={{flex:1, paddingHorizontal:10}}></View>
                ||
                <View style={{flex:1, paddingHorizontal:10}}>
                    <Text style={{color:"#4A4A4A", fontSize:12}}>{item}</Text>
                </View>
            }
        </View>
        )
    )
}


const CalculatorView = (props) => {
    const{balance}=props
    const[Gau_Seva_Per_Meal_Coin, setGau_Seva_Per_Meal_Coin]=useState();
    const[mealCount, setMealCount]=useState(0);
    const[mealCoins, setMealCoins]=useState(0);
    const[customPackageVisible, setCustomPackageVisible]=useState(false);

    useEffect(()=>{
        Api.GetAppSettingByKetService(Auth.AppSettingKey.Gau_Seva_Per_Meal_Coin).then(resp=>{
            console.log("GetAppSettingByKetService resp", resp);
            var coin=parseFloat(resp.data);
            //var mealCountInt=parseInt(balance/coin);
            //console.log("coin", coin, "balance", balance,"mealCountInt", mealCountInt)
            setGau_Seva_Per_Meal_Coin(coin);
            //setMealCount(mealCountInt);
            //setMealCoins(coin*mealCountInt);
        });
    },[])
    
    const increasePress = () => {
        if((balance-mealCoins)<Gau_Seva_Per_Meal_Coin) {
            setCustomPackageVisible(true);
            return
        };

        var mealCoinsNew=mealCount+1;
        setMealCount(mealCoinsNew);
        setMealCoins(Gau_Seva_Per_Meal_Coin*mealCoinsNew);
    }

    const decreasePress = () => {
        if(mealCoins<=0) return false;
        
        var mealCoinsNew=mealCount-1;
        setMealCount(mealCoinsNew);
        setMealCoins(Gau_Seva_Per_Meal_Coin*mealCoinsNew);
    }

    const donateNowOnPress = () =>{
        if(mealCoins<=0) return;

        var req={
            RedeimCoins:mealCoins
        }
        console.log("BuyFeedFromRewardGauSevaService req", req);
        Api.BuyFeedFromRewardGauSevaService(req).then(resp => {
            console.log("BuyFeedFromRewardGauSevaService resp", resp);
            if (resp.ResponseCode == 200) {
                props.navigation.replace("GauDaanDonateSuccessfullyScreen", {mealCount:mealCount, type:"COIN"});
            }
            else{
                Alert.alert(null, resp.ResponseMessage);
            }
        });
        
    }
    const buyMoreOnPress = () => {
        setCustomPackageVisible(false);
        props.navigation.navigate("GauDaanBuyMoreScreen");
    }

    return(
        <View>
            
            <View style={[styles.Shadow,styles.TopView_Two]}>
                <View style={[styles.Shadow,styles.TopView_Two ]}>
                            <View style={styles.Upper_View}>
                                <Text style={{color:"#683A8E", fontSize:22, fontWeight:"700"}}>GAU SEVA</Text>
                                <View style={styles.View_Two}>
                                    <Text style={{color: '#7E388B', marginRight:5 }}>Apni FREE <Text style={{fontWeight:"700"}}>Seva{'\n'}Rashi</Text> Dan Karein</Text>
                                    {/* <View style={styles.View_Three}>
                                        <Image source={{ uri: `${env.AssetsBaseURL}/assets/images/gau-seva/Frame_fa.png` }} style={styles.Icon_Small} />
                                        <Text style={{ fontSize: 16 }}>{balance-mealCoins}</Text>
                                    </View> */}
                                </View>
                            </View>
                            <View style={styles.View_For}>
                                <Text style={{fontSize:12, color:"#fff"}}>Free Seva Rashi</Text>
                                <View style={styles.View_Five}>
                                    <Image source={{ uri: `${env.AssetsBaseURL}/assets/images/gau-seva/Frame_fa.png` }} style={styles.Icon_Small} />
                                    <Text style={{ fontSize: 16 }}>{balance-mealCoins}</Text>
                                </View>
                                {/* <Text style={{fontSize:12,color:'#fff'}}>MEALS</Text> */}
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <TouchableOpacity onPress={decreasePress}>
                                        <View style={{padding:5}}>
                                            <Image source={{ uri: `${env.AssetsBaseURL}/assets/images/gau-seva/VectorHG.png` }} style={styles.Vector_Icon} />
                                        </View>
                                    </TouchableOpacity>

                                    <View style={styles.View_Six}>
                                        <Text style={{fontSize:20, fontWeight:"bold", textAlign:"center"}}>{mealCount}</Text>
                                    </View>

                                    <TouchableOpacity onPress={increasePress}>
                                        <View style={{padding:5}}>
                                            <Image source={{ uri: `${env.AssetsBaseURL}/assets/images/gau-seva/Vector_Plush.png` }} style={styles.Image_Plush} />
                                        </View>
                                    </TouchableOpacity>

                                </View>

                                {
                                    mealCount>0 &&
                                    <TouchableOpacity onPress={()=>donateNowOnPress()}>
                                        <View style={{paddingVertical:4, paddingHorizontal:30, backgroundColor: mealCount>0 ? "#fff":"#d5d5d5", borderRadius:10, marginTop:20}}>
                                            <Text style={{color:"#843A89", fontWeight:"700", fontSize:14}}>Donate Now</Text>
                                        </View>
                                    </TouchableOpacity>
                                    ||
                                    <View style={{paddingVertical:4, paddingHorizontal:30, backgroundColor: mealCount>0 ? "#fff":"#d5d5d5", borderRadius:10, marginTop:20}}>
                                        <Text style={{color:"#843A89", fontWeight:"700", fontSize:14}}>Donate Now</Text>
                                    </View>
                                }
                                
                            </View>
                        </View>

                        <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between", padding:20, paddingBottom:10}}>
                            <Image source={{ uri: `${env.AssetsBaseURL}/assets/images/gau-seva/gau-mata.png` }} style={{width:124, height:92}} />
                            <Text style={{color:"#683A8E", textAlign:"right", fontSize:18}}>Ghar Baithe{'\n'}<Text style={{fontWeight:"bold"}}> Gau Seva </Text> Karne Ke{'\n'}Liye{'\n'}Yahan Plan Select{'\n'}Karein</Text>
                        </View>

                        <View style={[styles.View_For, {backgroundColor:"#683A8E", marginTop:0, paddingBottom:0}]}>
                            <Text style={{color:"#fff", fontSize:18, textAlign:"center"}}>Apni Shraddha Anusaar{'\n'}<Text style={{fontWeight:"bold"}}>GAU SEVA</Text> Plan Khareedne ke liye{'\n'}<Text style={{fontWeight:"bold"}}>Yahan Click Karein</Text></Text>
                            
                            <TouchableOpacity  onPress={()=> props.navigation.navigate("GauDaanBuyMoreScreen")}>
                                <LinearGradient colors={["#E3317F", "#E5307E"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{borderRadius:21, borderWidth:1, borderColor:"#fff", marginVertical:15}}>
                                    <View style={{alignItems:"center", justifyContent:"center", height:42, width:230}}>
                                        <Text style={{color:"#fff", fontSize:20, fontWeight:"700"}}>Choose Your Plan</Text>
                                    </View>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>

                    </View>





                        {/* <View style={{padding:10}}>
                            { 
                            mealCount>0 &&
                            <Button style={{height:50}} title="Donate Now" onPress={donateNowOnPress}/>
                             
                            ||
                            <TouchableOpacity style={styles.Button_View_One}>
                                <Text style={{ fontSize: 20 ,color:'#fff'}}>Donate Now</Text>
                            </TouchableOpacity>
                            }
                        <TouchableOpacity onPress={()=> props.navigation.navigate("GauDaanBuyMoreScreen")} style={styles.Button_View}>
                            <Text style={{ fontSize: 20 }}>Buy More Seva Rashi</Text>
                        </TouchableOpacity>
                        
                       
                         
                    </View> */}

                    <Modal visible={customPackageVisible} transparent={true}>
                        <View style={{flex:1, alignContent:"center", justifyContent:"center", backgroundColor: 'rgba(0,0,0,0.7)'}}>
                            <View style={{margin:20, paddingHorizontal:10, paddingVertical:30, borderRadius:10, backgroundColor:"#EDEDED"}}>
                                <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-evenly"}}>
                                    <Text style={{fontSize:16, fontWeight:"bold", color:"#131111"}}>{balance==0?"You Dont Have Enough Seva Rashi  !!":"Insufficient Seva Rashi in Your Account"}</Text>
                                </View>
                                <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-evenly", marginTop:20}}>
                                    <TouchableOpacity onPress={()=> setCustomPackageVisible(false)}>
                                        <Text style={{textDecorationLine:"underline"}}>Go Back</Text>
                                    </TouchableOpacity>
                                     
                                    <TouchableOpacity onPress={buyMoreOnPress}>
                                        <LinearGradient colors={["#63398D", "#E5307E"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{borderRadius:21}}>
                                            <View style={[{alignItems:"center", justifyContent:"center", height:22, width:88}]}>
                                                <Text style={{color:"#fff", fontSize:12, fontWeight:"700"}}>Buy Now</Text>
                                            </View>
                                        </LinearGradient>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>

                </View> 
    )
}
const ImageGallery = (props) => {
    const[data,setData]=useState();
     
    useEffect(()=>{
        Api.GetImageGalleryGauSevaService().then(resp => {
            console.log("GetImageGalleryGauSevaService resp", resp);
            if (resp.ResponseCode == 200) {
                setData(resp.data);
            }
        });
    },[]);

    return(
        data &&
        <View style={[styles.Shadow,styles.TopView_Two,{margin:10} ]}>
            

            <Text style={{color:"#67398D", fontSize:20, fontWeight:"700", margin:20}}>Gallery</Text>
        <View style={{flexDirection:"row", alignItems:"center", justifyContent:"center"}}>
            {
            data[0]!=null &&
            
                <Image style={{width:(Dimensions.get("window").width/2), height:160, borderRadius:10, margin: 5 }} resizeMode="cover" source={{uri:`${env.DynamicAssetsBaseURL}${data[0].Uri}`}}/>
            
            }
            
            <View style={{alignItems:"center", justifyContent:"center"}}>
            {
                data[1]!=null &&
                
                    <Image style={{width:(Dimensions.get("window").width/2)-50, height:76, borderRadius:10, margin: 5 }} resizeMode="cover" source={{uri:`${env.DynamicAssetsBaseURL}${data[1].Uri}`}}/>
                 
            }
            {
                data[2]!=null &&
                <TouchableOpacity onPress={()=> props.navigation.navigate("GauDaanImageGalleryScreen")}>
                     
                    <ImageBackground style={{width:(Dimensions.get("window").width/2)-50, height:76, margin: 5}} imageStyle={{borderRadius:10}} resizeMode="cover" source={{uri:`${env.DynamicAssetsBaseURL}${data[2].Uri}`}}>
                        <View style={{width:120, height:76, backgroundColor:'rgba(255,255,255,0.5)', alignItems:"center", justifyContent:"center", borderRadius:10}}>
                            <Text style={{color:"#000", fontWeight:"bold"}}>View Gallery</Text>
                        </View>
                    </ImageBackground>
                     
                </TouchableOpacity>
            }
            
            </View>
        </View>
 
          
        </View>
        ||
        <View></View>
    )
}

const styles = StyleSheet.create({
    Container:{ flex: 1, backgroundColor: '#fff' },
    Text12_margin: {
        fontSize: 12, fontWeight: '400', marginVertical: 10
    },
    Text12_margin_Right: {
        textAlign: 'right', fontSize: 12, fontWeight: '400', marginVertical: 10
    },
    Text_View: {
        height: 40, width: 18, backgroundColor: '#fff', alignItems: 'center', justifyContent: 'center', marginHorizontal: 1
    },
    Text32:{ fontSize: 32, color: '#7E388B', fontWeight: '700' },
    Text20:{ fontSize: 20, fontWeight: '700', marginVertical: 5 },
    Text12:{ fontSize: 12, fontWeight: '700', marginVertical: 5 },
    Text11:{ fontSize: 12, fontWeight: '700', color: '#fff' },
    Text19:{ fontSize: 19, fontWeight: '700', color: '#fff', textAlign: 'right' },
    Text12_Right:{ color: '#fff', fontSize: 12, textAlign: 'right' },
    Text25:{ fontSize: 18, color: '#7E388B', fontWeight: '700'},
    Text15:{ fontSize: 15, fontWeight: '700', color: '#fff' },
    Text20_White:{ fontSize: 20, fontWeight: '700',color:'#fff' },
    Font12:{ fontSize: 14, fontWeight: '700', alignSelf: 'center', position: 'absolute', top: 5 },
    TopView_Two:{ backgroundColor: '#fff', borderRadius: 15 },
    Shadow: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2, },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    Image_Plush:{ height: 28, width: 28 },
    Image_View:{ height: 60, width: '100%' },
    Image30:{ height: 30, width: '100%' },
    Image_Big:{ width: '100%', height: 582 },
    Headers_View:{ flexDirection: 'row', justifyContent: 'space-between', padding: 10 },
    Top_view:{ height: 30, width: 85, borderWidth: 2, borderColor: '#7E388B', borderRadius: 15, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
    Icon_Small:{ height: 20, width: 16 },
    Bottom_View:{ fontSize: 24, fontWeight: '700', textAlign: 'center', marginHorizontal: 30, position: 'absolute', bottom: 30, color: '#fff' },
    View_One:{ height: 70, flexDirection: 'row' },
    View_Two:{ flexDirection: 'row', alignItems: 'center', justifyContent:"flex-end" },
    View_Three:{ height: 30, width: 85, borderWidth: 2, borderColor: '#7E388B', borderRadius: 15, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
    View_For:{ margin:10, padding:20, backgroundColor: '#7E388B', borderRadius: 15, marginTop: 20, alignItems: 'center', justifyContent: 'center' },
    View_Five:{ height: 30, width: 85, backgroundColor: '#fff', borderRadius: 15, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', margin: 10 },
    View_Six:{ height: 37, width: 95, backgroundColor: '#fff', borderRadius: 10, justifyContent: 'center', alignItems: 'center', margin: 10 },
    Background_Image:{ width: '100%', height: 80, borderWidth:1, borderRadius:10, overflow:"hidden" },
    Background_Image_One:{ height:50, width: '100%',borderRadius:25, alignItems: 'center', justifyContent: 'center' },
    Inner_View:{ marginLeft:20, height: 80, justifyContent: 'center' },
    Counter_View:{ width: '40%', height: 80, justifyContent: 'center', alignItems: 'center' },
    Upper_View:{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20, alignItems: 'center', marginHorizontal: 10, paddingHorizontal:10 },
    Vector_Icon:{ height: 10, width: 25 },
    Button_View:{ height: 50, width: '100%', borderColor: '#7E388B', borderWidth: 2, borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginVertical: 10 },
    Button_View_One:{ height: 50, width: '100%', borderRadius: 25, alignItems: 'center', justifyContent: 'center', marginVertical: 10,backgroundColor:'#D4D0D8' },
    Text_Count:{fontSize:30, fontWeight:"700"},
    

   
})
