import React, { Component } from 'react';
import { View, Text, Animated, Easing, Image, ImageBackground, Dimensions, TouchableOpacity, SafeAreaView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Overlay from 'react-native-modal-overlay';
import analytics from '@react-native-firebase/analytics';
import * as env from '../../../env';
import * as Api from '../../Api';
import * as Auth from '../../Auth';
import {Singular} from 'singular-react-native';

export default class ChakraScreen extends Component {
  constructor(props) {
    super(props);
    const rewardType = {
      FLAT:1,
      PERCENT:2
    }
    this.state = {
        callWaitingTime:22*60*60+360,
       
        center:0,
        imageWidth:0,
        imageHeight:0, 
        spin:'0deg',
        spinValue:new Animated.Value(0),
        rotate:0,
        // imageMap:[
        //   {start:1, end:35, title:'Get ₹50', rewardType:rewardType.FLAT, reward:50},
        //   {start:36, end:80, title:'Sorry', rewardType:rewardType.FLAT, reward:0},
        //   {start:81, end:130, title:'Get 25% Extra', rewardType:rewardType.PERCENT, reward:25},
        //   {start:131, end:180, title:'Get ₹20', rewardType:rewardType.FLAT, reward:20},
        //   {start:181, end:230, title:'Sorry', rewardType:rewardType.FLAT, reward:0},
        //   {start:231, end:275, title:'Get 10% Extra', rewardType:rewardType.PERCENT, reward:10},
        //   {start:276, end:318, title:'Get ₹10', rewardType:rewardType.FLAT, reward:10},
        //   {start:390, end:360, title:'Sorry', rewardType:rewardType.FLAT, reward:0},
        // ]
    };
    
  }

  componentDidMount = () => {
    analytics().logEvent("Chakra_page");
    console.log("GetChakraService req");
    Api.GetChakraService().then(resp => {
      console.log("GetChakraService resp", JSON.stringify(resp.data));
      if (resp.ResponseCode == 200) {
        this.setState({ ChakraData: resp.data, callWaitingTime:resp.data.nextAppearIn}, () => this.chakraTimer());

      }
    });

    const center=Dimensions.get("screen").width/2;
    const imageWidth=(Dimensions.get("screen").width*90)/100;
    const imageHeight=imageWidth;
    this.setState({center, imageWidth, imageHeight});

    this._unsubscribe2 = this.props.navigation.addListener('blur', () => {
      clearInterval(this.interval);
      this.interval=null;
    });
  };

  componentWillUnmount = () => {
    clearInterval(this.interva);
    this.interval=null;
    this._unsubscribe2();
  };
  

  chakraTimer = () => {
    this.interval=setInterval(() => {
      console.log("Interval", 7001);
      this.setState(prevState=>({callWaitingTime:prevState.callWaitingTime-1}))
    }, 1000);
  }

  onStart = () => {
    Singular.event("ChakraScreen_onStart");
    this.setState({loading:true, spinValue:new Animated.Value(0)})
    var random = Math.floor((Math.random() * 10) + 1) * 8;
    //var random = 1;
    console.log("random", random)
    var spin = this.state.spinValue.interpolate({
      inputRange: [0, random],
      outputRange: ['0deg', '360deg']
    });
    this.setState({spin})
    //var random=8;
    this.state.spinValue.setValue(0);

     
    // Animated.timing(
    //   this.state.spinValue,
    //   {
    //       toValue: 1,
    //       duration: random,
    //       easing: Easing.linear, // Easing is an additional import from react-native
    //       useNativeDriver: true  // To make use of native driver for performance
    //   }
    // ).start();
    this.chakra=Animated.decay(this.state.spinValue, {
      useNativeDriver: true,
      velocity: 1,
    }).start(()=>{
      const num=JSON.stringify(this.state.spin);
      const deg=parseInt(num.replace(/[^0-9.]/g, ''));
      const mainDeg=deg%360;
      console.log("this.state.spin",  mainDeg);
      var reward=this.state.ChakraData.data.find(o=>mainDeg>=o.start && mainDeg<=o.end);
      console.log("reward", reward);
      
      this.setState(prevState=>({loading:true, selectedReward:reward, viewPopup:true, ChakraData:{...prevState.ChakraData, isSpinned:true}}));

      var body={Id:reward.id};
      console.log("CreateChakraTransactionService req", body);
      Api.CreateChakraTransactionService(body).then(resp => {
        console.log("CreateChakraTransactionService resp", JSON.stringify(resp.data));
        if (resp.ResponseCode == 200) {
          this.setState(prevState=>({ChakraData:{...prevState.ChakraData, isSpinned:true}})); 
        }
      });
    })
  
    

    this.state.spinValue.addListener(value => {
      //const num=Number(this.state.spin.replace(/[^0-9.]/g, ''));
      
      
      //console.log("chakraPosition",this.state.chakraPosition)
      //console.log("value", value);
      //console.log("Animated.Value", Animated.ValueXY)
      // var spin = value.interpolate({
      //   inputRange: [0, 10000],
      //   outputRange: ['0deg', '360deg']
      // });
      // console.log("spin", spin);
    });
    
  }

  onChakreMainImageLoaded = () => {
    const{autoSpin}=this.props.route.params??{};
    if(autoSpin)
      this.onStart();
  } 
  
  onClosePopup =()=>{
    this.setState({viewPopup:false});
    Singular.event("ChakraScreen_onClosePopup");
    this.props.navigation.replace("UserHomeScreen");
  }
  // scrollEndHandler = (event) => {
     
  //     this.decaySpinVelocity(event.nativeEvent.velocityX)
     
  // }

  // decaySpinVelocity = (velocity) => {
  //   console.log("velocity", velocity)
  //   const startingVelocity = Math.floor((Math.random() * 10) + 1) * 100 
  //   Animated.decay(this.state.spinValue, {
  //     useNativeDriver: true,
  //     velocity: startingVelocity,
  //   }).start()
  // }


  render() {
      // Next, interpolate beginning and end values (in this case 0 and 1)
    
    
    return (
      !this.state.ChakraData &&
      <Text>...</Text>
      ||
      <SafeAreaView style={{flex:1, backgroundColor:"#fff"}}>
        <Overlay childrenWrapperStyle={{borderRadius:30}} visible={this.state.viewPopup} onClose={this.onClosePopup} closeOnTouchOutside>
                <ImageBackground style={{width:"100%", height:250}} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/bg-popup-star.png` }}>
          {
            this.state.selectedReward &&
            <View style={{alignContent:"center", alignItems:"center", justifyContent:"center"}}>
              <Image style={{width:163, height:131, marginTop:-50}} resizeMode="stretch" source={{uri:`${env.DynamicAssetsBaseURL}${this.state.selectedReward.messageImage}`}}/>
              <Text style={{fontSize:20, marginBottom:20}}>{this.state.selectedReward.messageText}</Text>
              <View style={{padding:20}}>
                <TouchableOpacity onPress={() =>this.onClosePopup()}>
                    <LinearGradient colors={["#FF8767", "#FF65A0"]} style={{borderRadius:30}}>
                          <Text style={{color:"#fff", width:200, padding:20, fontSize:16, textAlign:"center"}}>{this.state.selectedReward.messageButtonText}</Text>
                    </LinearGradient>
                </TouchableOpacity>
              </View>
            </View> 
          }
          
          </ImageBackground>
          </Overlay>

      <View style={{flex:1, alignItems:"center"}}>
      
        <View style={{flex:0, minHeight:430, width:this.state.imageWidth, position:"relative"}}>
            <Image style={{width:100, height:156, top:this.state.imageHeight-70, left:(this.state.imageWidth/2)-50}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/spinner/Hand.png`}}/>
            <Animated.Image
              //onLayout={(e)=> console.log("onLayout",e)}
              ref={view => this.setState({chakraPosition:view})}
                style={{transform: [{rotate: this.state.spin}], position:"absolute", width:this.state.imageWidth, height:this.state.imageHeight}}
                resizeMode="stretch"
                source={{uri:`${env.DynamicAssetsBaseURL}${this.state.ChakraData.image}`}} onLoadEnd={()=> this.onChakreMainImageLoaded()}/>
            <Image style={{width:50, height:50, position:"absolute", top:(this.state.imageWidth/2)-25, left:(this.state.imageWidth/2)-25}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/spinner/Spin-wheel-04.png`}}/>
        </View>
       
       {
         !this.state.loading && this.state.ChakraData && !this.state.ChakraData.isSpinned &&
         <View style={{flex:1, padding:20, justifyContent:"center"}}>
          <TouchableOpacity onPress={() =>this.onStart()}>
              <LinearGradient colors={["#FF8767", "#FF65A0"]} style={{borderRadius:30}}>
                  <Text style={{color:"#fff", padding:20, fontSize:16, textAlign:"center", width:250}}>Spin NOW</Text>
              </LinearGradient>
          </TouchableOpacity>
        </View>
       }
       
        {
          this.state.ChakraData && this.state.ChakraData.isSpinned &&
        
       <View style={{flex:1, padding:20, alignItems:"center", justifyContent:"center"}}>
         <Text>Your Next Spin Is In</Text>
        <TimerTickTock callWaitingTime={this.state.callWaitingTime}/>

        <View style={{flex:0, padding:20}}>
          <TouchableOpacity onPress={() => {Singular.event("ChakraScreen_BACK"); this.props.navigation.goBack()}}>
              <LinearGradient colors={["#ccc", "#ccc"]} style={{borderRadius:30}}>
                  <Text style={{color:"#000", padding:20, fontSize:16, textAlign:"center", width:250}}>BACK</Text>
              </LinearGradient>
          </TouchableOpacity>
        </View>

       </View>
      }
      </View>
      </SafeAreaView> 
    );
  }
}


export const TimerTickTock = (props) =>{
  const{callWaitingTime}=props;
  return(
    <View>
            <View style={{flexDirection:"row"}}>
                <LinearGradient colors={["#FB6F8F", "#FC826E"]} style={{borderRadius:10, width:29, height:35, alignItems:"center", justifyContent:"center", margin:2}}>
                    <Text style={{color:"#fff", fontSize:21, fontWeight:"700"}}>{parseInt((callWaitingTime/60/60)/10)}</Text>
                </LinearGradient>
                <LinearGradient colors={["#FB6F8F", "#FC826E"]} style={{borderRadius:10, width:29, height:35, alignItems:"center", justifyContent:"center", margin:2}}>
                    <Text style={{color:"#fff", fontSize:21, fontWeight:"700"}}>{parseInt((callWaitingTime/60/60%10))}</Text>
                </LinearGradient>

<View style={{height:35, alignItems:"center", justifyContent:"center"}}>
 <Text style={{fontSize:21, fontWeight:"700", marginHorizontal:12}}>:</Text>
</View>
               

                <LinearGradient colors={["#FB6F8F", "#FC826E"]} style={{borderRadius:10, width:29, height:35, alignItems:"center", justifyContent:"center", margin:2}}>
                    <Text style={{color:"#fff", fontSize:21, fontWeight:"700"}}>{parseInt((callWaitingTime/60%60)/10)}</Text>
                </LinearGradient>
                <LinearGradient colors={["#FB6F8F", "#FC826E"]} style={{borderRadius:10, width:29, height:35, alignItems:"center", justifyContent:"center", margin:2}}>
                    <Text style={{color:"#fff", fontSize:21, fontWeight:"700"}}>{parseInt(callWaitingTime/60%60%10)}</Text>
                </LinearGradient>
<View style={{height:35, alignItems:"center", justifyContent:"center"}}>
<Text style={{fontSize:21, fontWeight:"700", marginHorizontal:12}}>:</Text>
</View>
                

                <LinearGradient colors={["#FB6F8F", "#FC826E"]} style={{borderRadius:10, width:29, height:35, alignItems:"center", justifyContent:"center", margin:2}}>
                    <Text style={{color:"#fff", fontSize:21, fontWeight:"700"}}>{parseInt((callWaitingTime%60)/10)}</Text>
                </LinearGradient>
                <LinearGradient colors={["#FB6F8F", "#FC826E"]} style={{borderRadius:10, width:29, height:35, alignItems:"center", justifyContent:"center", margin:2}}>
                    <Text style={{color:"#fff", fontSize:21, fontWeight:"700"}}>{parseInt(callWaitingTime%60%10)}</Text>
                </LinearGradient>
            </View>
            <View style={{flexDirection:"row", alignContent:"space-around", alignItems:"center", justifyContent:"space-around"}}>
                <Text style={{fontSize:9, paddingLeft:10, textAlign:"center"}}>hours</Text>
                <Text style={{fontSize:9, paddingLeft:30,  textAlign:"center"}}>minutes</Text>
                <Text style={{fontSize:9, paddingLeft:30, textAlign:"center"}}>seconds</Text>
            </View>
        </View>
  )
}