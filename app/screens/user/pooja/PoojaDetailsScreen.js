import React, { Component, useEffect, useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, Image, TouchableOpacity, ImageBackground, Modal, Dimensions, AppRegistry, ActivityIndicator, TextInput, Alert } from 'react-native';
import {CheckBox} from 'react-native-elements';
import Swiper from 'react-native-swiper'
import { Calendar } from 'react-native-calendars';
import LinearGradient from 'react-native-linear-gradient';
import {Card, CardItem} from 'native-base';
import Html from 'react-native-render-html';
import * as PoojaControls from './Controls';
import * as env from '../../../../env'; 
import * as Api from '../../../Api';
import * as Auth from '../../../Auth';
import { ScrollView } from 'react-native-gesture-handler';
import moment from 'moment';
import { Accordion } from "native-base";
import { SliderBox } from "react-native-image-slider-box";
import analytics from '@react-native-firebase/analytics';

export default class PoojaDetailsScreen extends Component {
  constructor(props) {
    super(props);
     
    
    this.state = {
      currentStepIndex:0,
      modalVisible: false,
      minDate:Date(),
      // plans:[{title:"Base", price:"5,000", description:"Single pandit will perform the pooja on behalf of you on selected date and time."},
      // {title:"Gold", price:"11,000", description:"A group of 11 highly experienced pandits will perform this  pooja after taking sankalp on your behalf.", selected:true}],
      // calenderData:{
      //   slots:[{title:"8:00 am", selected:false},
      //   {title:"9:00 am", selected:true},
      //   {title:"10:00 am", selected:false},
      //   {title:"11:00 am", selected:false}]
      // }
    };

    if(this.props.route.params != null && this.props.route.params.action != null && this.props.route.params.action == "Reschedule"){
      this.state.currentStepIndex=1;
      this.state.modalVisible=true;
      this.state.IsReschedule=true;
    }

    var date=new  Date();
      var yyyy = date.getFullYear().toString();
      var mm = (date.getMonth()).toString(); // getMonth() is zero-based
      var dd  = (date.getDate()+2).toString();

      var ttdate=new Date(yyyy,mm,dd);
    
      this.state.minDate=ttdate;
  }

  componentDidMount = () => {
    const{Id}=this.props.route.params??{}; 
    analytics().logEvent("Puja_Detail_Page",{Id:Id});

    console.log("Id", Id);
    Api.GetMandirPujaByIdService(Id).then(response=>{ 
      console.log("GetMandirPujaByIdService", response);
      if (response != null && response.ResponseCode == 200) {
        this.setState({
          data:response.data,
          cardData:{Image:response.data.Image, Name:response.data.Name, MandirName:response.data.MandirName, Location:response.data.Location, Duration:response.data.Duration }
        }); 
      }
      else if (response != null && response.ResponseCode == 401) {
        Auth.RemoveSession({ navigation: this.props.navigation })
      }
    });
    
  };
  
  onPressBookNow = () => {
    if(this.state.data && this.state.data.Package && this.state.data.Package.length==1){
      this.setState({currentStepIndex:1, selectedPlan:this.state.data.Package[0]});
    }

    this.setModalVisible(true);
  }

  setModalVisible = (visible) => {
    this.setState({ modalVisible: visible });
  }

  onSelectTandC = () => {
    if(this.props.route.params != null && this.props.route.params.action != null && this.props.route.params.action == "Reschedule"){
      var req={
        id :this.props.route.params.PujaTransacionId,
        Calendar_Slot_Id :this.state.selectedSlot.Id,
        Puja_Date:moment(this.state.selectedDate).format("DD/MMM/YYYY")
    }
      Api.PujaReschedule_Puja_BookingService(req).then(response=>{ 
        console.log("PujaReschedule_Puja_BookingService", response);
        if (response != null && response.ResponseCode == 200) {
          alert(response.ResponseMessage);
          this.props.navigation.replace("MyBookingsScreen");
        }
        else if (response != null && response.ResponseCode == 401) {
          Auth.RemoveSession({ navigation: this.props.navigation })
        }
        else{
          alert(response.ResponseMessage)
        }
      })
    }
    else{
      this.setState({currentStepIndex:0, modalVisible:false},()=> this.props.navigation.navigate("CheckoutScreen", {cardData:this.state.cardData, selectedPlan:this.state.selectedPlan, selectedSlot:this.state.selectedSlot, selectedDate:this.state.selectedDate, Coupon_Not_Applicable:this.state.data.Coupon_Not_Applicable}))
    }
  }

  render() {
    const{Id}=this.props.route.params??{}
    const { modalVisible } = this.state;
    return (
      !this.state.data && <ActivityIndicator color="blue"/> ||
      <SafeAreaView style={{flex:1}}>
        <PoojaControls.Header {...this.props} title={this.state.cardData.Name} pujaName={this.state.cardData.Name} mandirLocation={this.state.cardData.MandirName + " " + this.state.cardData.Location}/>
        <ScrollView style={{flex:1}} ref={(node) => this.scroll = node}>
          <View style={{height:200}}>
          <ImageSlider data={this.state.data}/>
          </View>
          <View style={{}}>

          <Card style={{borderRadius:10}}>
            <CardItem style={{borderRadius:10}}>
                <Image style={{width:80, height:80, borderRadius:10 }} resizeMode="cover" source={{uri:`${env.DynamicAssetsBaseURL}${this.state.cardData.Image}`}}/>
                <View style={{paddingLeft:20}}>
                    <Text numberOfLines={1} style={{fontWeight:"700", fontSize:16}}>{this.state.cardData.Name}</Text>
                    <Text numberOfLines={1} style={{fontSize:12, marginTop:5, color:"#5f5f5f"}}>{this.state.cardData.MandirName} {this.state.cardData.Location}</Text>
                    <View style={{flexDirection:"row", marginTop:10}}>
                        <Text style={{fontSize:14, color:"#5f5f5f"}}>Duration:{this.state.cardData.Duration}</Text>
                    </View>
                </View>
            </CardItem>
        </Card>
            
          </View>
          <View style={{flexDirection:"row", marginTop:2, height:50, backgroundColor:"#fff"}}>
            <TouchableOpacity style={{flex:1}} onPress={() => { this.scroll.scrollTo({ y: 0 }) }}>
              <Text style={{color:"#EF8534", height:50, borderBottomWidth:2, borderBottomColor:"#EF8534", textAlign:"center", textAlignVertical:"center", fontSize:16}}>Overview</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{flex:1}} onPress={() => { this.scroll.scrollTo({ y: 800 }) }}>
              <Text style={{height:50, borderBottomWidth:2, borderBottomColor:"#ccc", textAlign:"center", textAlignVertical:"center", fontSize:16}}>Temple</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{flex:1}} onPress={() => { this.scroll.scrollTo({ y: 1000 }) }}>
              <Text style={{height:50, borderBottomWidth:2, borderBottomColor:"#ccc", textAlign:"center", textAlignVertical:"center", fontSize:16}}>FAQs</Text>
            </TouchableOpacity>
          </View>
          <View style={{paddingHorizontal:10, backgroundColor:"#fff"}}>
            <Text style={{marginTop:10, fontWeight:"bold", fontSize:16}}>Benefits Of Puja</Text> 
            <View style={{marginBottom:10}}>
              <Html
                  contentWidth={Dimensions.get("window").width}
                  source={{html:this.state.data.About_Puja}}
              />
            </View>
            {/* <Text style={{paddingVertical:10}}>The Mangal dosha enhances the malefic effects of planet Mars and causes delays and obstacles in career, business, and marriage.</Text>
            <Text style={{paddingVertical:10}}>Shaligram Shala Mangal Dosh Nivaran Puja brings about personal and professional stability in a persons life through the blessings of planet Mars.</Text>
            <Text style={{paddingVertical:10}}>Affiliation: Deva, Graha, Navagraha{'\n'}
                  <Text style={{fontWeight:"700"}}>Abode</Text>: Mangala loka{'\n'}
                  <Text style={{fontWeight:"700"}}>Day</Text>: Tuesday{'\n'}
                  <Text style={{fontWeight:"700"}}>Color</Text>: Red{'\n'}
                  <Text style={{fontWeight:"700"}}>Mount</Text>: Sheep</Text> */}
          </View>
          {
            this.state.data.MandirPujaImageList &&
            <View style={{paddingHorizontal:10, backgroundColor:"#fff", paddingBottom:30}}>
              <Text style={{paddingVertical:10, fontWeight:"bold", fontSize:16}}>Sample Puja Video</Text>
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
              {
                this.state.data.MandirPujaImageList.map((item, index)=>(
                  <View key={index}>
                    {
                    item.Type=="Video" && 
                    <TouchableOpacity onPress={()=> this.props.navigation.navigate("VSYoutubeVideoPlayer", {Url:item.VideoURL})}>
                      <Image style={{width:200, height:105, borderRadius:10, margin: 5, }} resizeMode="cover" source={{uri:`${env.DynamicAssetsBaseURL}${item.Image}`}}/>
                    </TouchableOpacity>
                    ||
                    <Image style={{width:200, height:105, borderRadius:10, margin: 5 }} resizeMode="cover" source={{uri:`${env.DynamicAssetsBaseURL}${item.Image}`}}/>
                    }
                  </View>
                ))
              }
              </ScrollView>
            </View> 
          }
          {/* <View style={{paddingHorizontal:10, backgroundColor:"#fff", paddingBottom:30}}> 
            <Text style={{paddingVertical:10, fontWeight:"bold", fontSize:16}}>About Acharya</Text>
            {
              this.state.data.AcharyaList.map((item, index)=>(
              <View>
                <Html
                    contentWidth={Dimensions.get("window").width}
                    source={{html:item.About_Acharya}}
                />
                <PoojaControls.AachryaCard item={{name:item.AcharyaName, degree:item.AcharyaQualification, description:item.Description, image:item.Image}}/>
              </View>
              ))
            }
          </View> */}

          <AboutTempleView {...this.props} data={this.state.data} cardData={this.state.cardData}/>

          <View style={{flexDirection:"row", padding:10, marginTop:10, alignItems:"center", backgroundColor:"#fff"}}>
            <Text style={{marginRight:20, fontWeight:"bold", fontSize:16}}>Have a question?</Text>
            <TouchableOpacity onPress={()=> this.props.navigation.navigate("PoojaContactUsScreen", {PujaName:this.state.cardData.Name, WrittenBy:4})}>
                <LinearGradient colors={["#68F15C", "#077512"]} style={[{borderRadius:12, minWidth:130}]}>
                    <Text style={{color:"#fff", fontWeight:"bold", padding:10, fontSize:16, textAlign:"center"}}>Contact Us</Text>
                </LinearGradient>
            </TouchableOpacity>
          </View>

          <View style={{marginTop:10, backgroundColor:"#fff"}}>
            <Text style={{marginRight:20, fontWeight:"bold", fontSize:16, padding:10}}>FAQs</Text>
            <Accordion 
              dataArray={this.state.data.Faqs.map(o=>({title:o.Question, content:o.Answer}))}
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
{
  this.state.data.ReviewAndRating && this.state.data.ReviewAndRating.length>0 && <ReviewAndRatingView data={this.state.data.ReviewAndRating}/>
}
          
        </ScrollView>

{
  this.state.data.Package && this.state.data.Package.length>0 &&

        <View elevation={5} style={{flex:0, flexDirection:"row", backgroundColor:"#fff", height:88}}>
          <View style={{flex:1, alignItems:"center", justifyContent:"center"}}>
            <Text>Starting from</Text>
            <Text style={{fontSize:18, fontWeight:"bold"}}>₹ {this.state.data.Package[0].Price}</Text>
          </View>
          <View style={{flex:2, alignItems:"flex-end", justifyContent:"center", paddingRight:10}}>
            <PoojaControls.ButtonOrange onPress={()=> this.onPressBookNow()} title="Select Plan"/>
          </View>
        </View>
}

        <Modal animationType="slide" transparent={true} visible={modalVisible}>
          <ImageBackground style={styles.centeredView} source={{uri: `${env.AssetsBaseURL}/assets/images/mandir-bg-blur.png`}}>
            <View style={styles.modalView}>
              <View style={{flexDirection:"row", padding:10}}>
                <Text style={{flex:1, fontWeight:"bold", fontSize:20, textAlign:"center"}}>
                  {
                    this.state.currentStepIndex==0 && "Select Plan"
                    ||
                    this.state.currentStepIndex==1 && "Choose Date and Time"
                    ||
                    this.state.currentStepIndex==2 && "Terms and Conditions"
                  }
                  </Text>
                <TouchableOpacity style={{flex:0}} onPress={()=>this.setState({currentStepIndex:0, selectedPlan:null, selectedSlot:null},()=>this.setModalVisible(false))}>
                <Image style={{width:15, height:15}} resizeMode="stretch" source={{uri: `${env.AssetsBaseURL}/assets/images/close-black-bg.png`}}/>  
                </TouchableOpacity>
              </View>
              {
                this.state.currentStepIndex==0 &&
                <PlansView data={this.state.data.Package} onSelectPlan={(plan)=> this.setState({selectedPlan:plan, currentStepIndex:1})}/>
                ||
                this.state.currentStepIndex==1 && 
                <CalenderView 
                  pujaId={Id}
                  minDate={this.state.minDate} 
                  navigation={this.props.navigation} 
                  onSelectSlot={(slot, date)=>this.setState({selectedSlot:slot, selectedDate:date, currentStepIndex:2})}
                  onContactUsPress={()=> this.setState({currentStepIndex:0, modalVisible:false},()=> this.props.navigation.navigate("PoojaContactUsScreen",{PujaName:this.state.cardData.Name, WrittenBy:5})) }
                  onCanceledPress={()=> this.setModalVisible(false)}
                />
                ||
                this.state.currentStepIndex==2 &&
                <TermAndConditionView Terms_And_Conditions={this.state.data.Terms_And_Conditions} onSelectTandC={()=> this.onSelectTandC() }/>
              }
            </View>
          </ImageBackground>
        </Modal>

      </SafeAreaView>
    );
  }
}


const ImageSlider = (props) =>{
    const{data}=props;
    return( 
      <SliderBox
                autoplayInterval={5000}
                images={[`${env.DynamicAssetsBaseURL}${data.BannerImageList.BannerImage1}`,
                `${env.DynamicAssetsBaseURL}${data.BannerImageList.BannerImage2}`,
                `${env.DynamicAssetsBaseURL}${data.BannerImageList.BannerImage3}`,
                `${env.DynamicAssetsBaseURL}${data.BannerImageList.BannerImage4}`]}
                 
                autoplay
                circleLoop
              />
        // <Swiper 
        //     style={styles.wrapper} 
        //     showsButtons={false} 
           
        // >
        //   {
        //      data && data.BannerImageList && data.BannerImageList.BannerImage1 &&
        //     <View style={styles.slide}>
        //         <Image style={{width:"100%", height:200 }} resizeMode="stretch" source={{uri:`${env.DynamicAssetsBaseURL}${data.BannerImageList.BannerImage1}`}}/>
        //     </View>
        //   }
        //   {
        //      data && data.BannerImageList && data.BannerImageList.BannerImage2 &&
        //     <View style={styles.slide}>
        //         <Image style={{width:"100%", height:200 }} resizeMode="stretch" source={{uri:`${env.DynamicAssetsBaseURL}${data.BannerImageList.BannerImage2}`}}/>
        //     </View>
        //   }
        //   {
        //      data && data.BannerImageList && data.BannerImageList.BannerImage3 &&
        //     <View style={styles.slide}>
        //         <Image style={{width:"100%", height:200 }} resizeMode="stretch" source={{uri:`${env.DynamicAssetsBaseURL}${data.BannerImageList.BannerImage3}`}}/>
        //     </View>
        //   }
        //   {
        //      data && data.BannerImageList && data.BannerImageList.BannerImage4 &&
        //     <View style={styles.slide}>
        //         <Image style={{width:"100%", height:200 }} resizeMode="stretch" source={{uri:`${env.DynamicAssetsBaseURL}${data.BannerImageList.BannerImage4}`}}/>
        //     </View>
        //   }
        // </Swiper>
    )
}

const AboutTempleView = (props) =>{
  const{data, cardData} = props;
  return(
    <View style={{marginTop:10}}>
      <View style={{paddingHorizontal:10, backgroundColor:"#fff"}}>
        <Text style={{paddingVertical:10, fontWeight:"bold", fontSize:16}}>About Temple</Text>
        <Html
            contentWidth={Dimensions.get("window").width}
            source={{html:data.About_Mandir}}
        />
        {
          data.MandirImageList &&
          <View style={{flexDirection:"row", alignItems:"center", justifyContent:"center", marginTop:30}}>
            {
              data.MandirImageList[0]!=null &&
              <TouchableOpacity onPress={()=> props.navigation.navigate("MandirImageGalleryScreen", {data:data.MandirImageList, cardData:cardData})}>
              <Image style={{width:216, height:160, borderRadius:10, margin: 5, }} resizeMode="cover" source={{uri:`${env.DynamicAssetsBaseURL}${data.MandirImageList[0].Image}`}}/>
              </TouchableOpacity>
            }
            
            <View style={{alignItems:"center", justifyContent:"center"}}>
              {
                data.MandirImageList[1]!=null &&
                <TouchableOpacity onPress={()=> props.navigation.navigate("MandirImageGalleryScreen", {data:data.MandirImageList, cardData:cardData})}>
                <Image style={{width:120, height:76, borderRadius:10, margin: 5 }} resizeMode="cover" source={{uri:`${env.DynamicAssetsBaseURL}${data.MandirImageList[1].Image}`}}/>
                </TouchableOpacity>
              }
              {
                data.MandirImageList[2]!=null &&
                <TouchableOpacity onPress={()=> props.navigation.navigate("MandirImageGalleryScreen", {data:data.MandirImageList, cardData:cardData})}>
                  <ImageBackground style={{width:120, height:76, margin: 5, borderRadius:10}} resizeMode="cover" source={{uri:`${env.DynamicAssetsBaseURL}${data.MandirImageList[2].Image}`}}>
                    <View style={{width:120, height:76, backgroundColor:'rgba(255,255,255,0.5)', alignItems:"center", justifyContent:"center"}}>
                      <Text style={{color:"#000", fontWeight:"bold", borderRadius:10}}>View Gallery</Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              }
              
            </View>
          </View>
        }
      </View>

      {/* <View style={{paddingHorizontal:10, backgroundColor:"#fff"}}>
        <Text style={{paddingVertical:10, fontWeight:"bold", fontSize:16}}>Location</Text>
        <View>
          <ImageBackground style={{width:"100%", height:104, borderRadius:10, margin: 5, }} resizeMode="cover" source={{uri:`${env.AssetsBaseURL}assets/images/pooja/map.png`}}>
            <Text style={{fontWeight:"600", padding:10}}>{data.Location}</Text>
          </ImageBackground>
        </View>
      </View> */}
    </View>
  )
}

const ReviewAndRatingView = (props) => {
  const{data}=props;
  return(
    
      <View style={{marginVertical:10, paddingHorizontal:10, backgroundColor:"#fff"}}>
        <Text style={{paddingVertical:10, fontWeight:"bold", fontSize:16}}>Reviews</Text>

        {/* <View style={{alignItems:"center", paddingVertical:20, borderBottomColor:"#d1d1d1", borderBottomWidth:1}}>
          <Text style={{paddingVertical:10, paddingHorizontal:20, color:"#fff", backgroundColor:"#20962C", borderRadius:10, fontWeight:"700"}}>4.5</Text>
            <View style={{marginVertical:5}}>
            <Stars
                display={4}
                spacing={8}
                count={5}
                starSize={15}
            
                fullStar={{ uri: `${env.AssetsBaseURL}/assets/images/icons/ic_star_l_1_mdpi.png` }}
                emptyStar={{ uri: `${env.AssetsBaseURL}/assets/images/icons/ic_star_l_0_mdpi.png` }}
                halfStar={{ uri: `${env.AssetsBaseURL}/assets/images/star-half.png` }}
            />
            </View>
          <Text style={{color:"#d1d1d1", fontSize:14}}>(1356 ratings · 1043 reviews)</Text>
        </View> */}

        {
          data.map((item,index)=>(<PoojaControls.ReviewRatingCard key={index} item={item}/>))
        }

        {/* <View style={{marginVertical:20}}>
          <TouchableOpacity>
            <Text style={{flex:1, paddingVertical:10, borderWidth:1, borderRadius:10, borderColor:"#d1d1d1", textAlign:"center"}}>View all reviews</Text>
          </TouchableOpacity>
        </View> */}
      </View>
     
  )
}

const PlansView=(props)=>{
  const{data}=props;
  return(
    <View style={{padding:10}}>
      {
        data.map((item, index)=>(
          <TouchableOpacity key={index} onPress={()=> props.onSelectPlan(item)}>
            <PoojaControls.PlanCard item={item}/>
          </TouchableOpacity>
        ))
      }
    </View>
  )
}

const CalenderView = (props) => {
  const{pujaId}=props;
  const[data, setData]=useState(null);
  const[selectedDate, setSelectedDate]=useState(new Date(moment(selectedDate).add(48, "hours").format("DD-MMM-YYYY")))
  const[avaliableSlots, setAvaliableSlots]=useState([])
  useEffect(()=>{ 
    bindAvaliableSlots();
    
  },[])

  const bindAvaliableSlots = () => {
    console.log("PujaGetPujaSlot_60DaysService req");
    Api.PujaGetPujaSlot_60DaysService().then(response=>{ 
      if(response.ResponseCode== 200){
        var newData=response.data
        .filter(o=>o.SlotCount>0)
        .filter(o=>moment(o.date, "DD/MMM/YYYY") > props.minDate)
        .map(o=>{return  "\""+moment(o.date, "DD/MMM/YYYY").format("YYYY-MM-DD")+"\": { \"textColor\":\"#000\", \"disabled\":false}" }).toString();
        try{
          console.log("PujaGetPujaSlot_60DaysService newData", "{"+newData+"}");
          setAvaliableSlots(JSON.parse("{"+newData+"}"));
          console.log("response.data.filter(o=>o.SlotCount>0)", response.data.filter(o=>o.SlotCount>0))
          var tDate=moment(response.data.filter(o=>o.SlotCount>0).filter(o=>moment(o.date, "DD/MMM/YYYY") > props.minDate)[0].date, "DD/MMM/YYYY").format("DD-MMM-YYYY");
          setSelectedDate(tDate);
          binddata(tDate);
        }
        catch{
          console.error("err bindAvaliableSlots poojadetailsscreen;")
        }
      }
    })
  }

  const binddata = (date) => { 
    console.log("GetMandirPujaSlotService req", date, pujaId);
    Api.GetMandirPujaSlotService(date, pujaId).then(response=>{ 
      console.log("GetMandirPujaSlotService resp", response);
      if(response.ResponseCode== 200){
        setData(response.data)
      }
    })
  }

  const selectSlot = (slot) =>{
    console.log("selectSlot", slot);
    if(slot.IsMaxBooked){
      let newData=data.map(o=>{o.Id==slot.Id ? o.selected=true : o.selected=false; return o;});
      setData(newData);
    }
  }

  const onDayPress = (day) => { 
    console.log("OnDayPress", day);
    setSelectedDate(moment(day.dateString, "YYYY-MM-DD"));
    binddata(moment(day.dateString, "YYYY-MM-DD").format("DD-MMM-YYYY"));
    var newtt={...avaliableSlots, [moment(selectedDate).format("YYYY-MM-DD")]: { selected: true, disabled:false }};
    console.log("asdf", newtt)
  }

  const onContinue = () =>{
    let selectedSlot=data.find(o=>o.selected);
    if(selectedSlot==null) {
      alert("Please select an available slot");
      return;
    }
    analytics().logEvent("Puja_Term_Condition");
    props.onSelectSlot(selectedSlot, selectedDate)
  }

  const onCanceledPress =()=>{
    props.onCanceledPress();
  }

  return(
    <SafeAreaView style={{}}>
      <View style={{padding:10, borderWidth:1, borderRadius:10, borderColor:"#d1d1d1", margin:10}}>
      <Calendar 
          current={selectedDate}
          markedDates={{...avaliableSlots, [moment(selectedDate).format("YYYY-MM-DD")]: { selected: true, disabled:false }}} 
          minDate={props.minDate} 
          //maxDate={this.state.maxDate} 
          onDayPress={(day) => onDayPress(day) }
          disabledByDefault={true}
          theme={{
            selectedDayBackgroundColor:"#F09B39"
          }}
          />
      </View>
      {
        data && data.length==0 && <View style={{margin:10}}><Text>No Slots Available For This Date</Text></View> 
        ||
        <>
      <View style={{margin:10}}>
        <Text>Select your time slot</Text>
      </View>
      <View style={{maxHeight:100}}>
      <ScrollView horizontal={true}>
        {
          data && data.map((item,index)=>(
            <PoojaControls.SlotCard key={index} item={item} onPress={selectSlot}/>
          ))
        }
      </ScrollView>
      </View>
      </>
      }
      <TouchableOpacity onPress={()=> props.onContactUsPress()}>
      <View style={{padding:10, borderWidth:1, borderRadius:10, borderColor:"#d1d1d1", margin:10, alignItems:"center"}}>
        <Text style={{textAlign:"center"}}>If you want to book your puja for today! Then</Text>
        <Text style={{textDecorationLine:"underline", color:"#0029FF"}}>Connect with our Support Team</Text>
      </View>
      </TouchableOpacity>

      <View style={{padding:10, flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
        <TouchableOpacity onPress={()=> onCanceledPress()}>
          <LinearGradient colors={["#d5d5d5", "#dcdcdc"]} style={[{borderRadius:12, width:Dimensions.get("window").width/2-20}]}>
              <Text style={{color:"#000", padding:15, fontSize:16, textAlign:"center"}}>Cancel</Text>
          </LinearGradient>
        </TouchableOpacity>
        
        <PoojaControls.ButtonOrange style={{width:Dimensions.get("window").width/2-20}} title="Continue" onPress={()=>onContinue()}/>
      </View>
    </SafeAreaView>
  )
}

const TermAndConditionView = (props) => {
  const{Terms_And_Conditions}=props;
  const[iAggree, setIAggree]=useState(false);

  const onPress = () => {
    if(!iAggree){
      Alert.alert("", "Please accept the Terms & Conditions by checking the box");
    }
    else{
      props.onSelectTandC();
    }
  }

  return(
    <View style={{}}>
      <View style={{padding:10, margin:10}}>
        {/* <Text style={{paddingVertical:5}}>The Mangal dosha enhances the malefic effects of planet Mars and causes delays and obstacles in career, business, and marriage.</Text>
        <Text style={{paddingVertical:5}}>The Mangal dosha enhances the malefic effects of planet Mars and causes delays and obstacles in career, business, and marriage.</Text>
        <Text style={{paddingVertical:5}}>The Mangal dosha enhances the malefic effects of planet Mars and causes delays and obstacles in career, business, and marriage.</Text> */}
        
        <Html
                  contentWidth={Dimensions.get("window").width}
                  source={{html:Terms_And_Conditions}}
              />
        <View style={{flexDirection:"row", alignItems:"center"}}>
          <CheckBox
          checkedIcon={<Image style={{width:25, height:25 }} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/icons/ic_tick_s_1_mdpi.png`}}/>}
          uncheckedIcon={<Image style={{width:25, height:25 }} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/icons/ic_tick_s_0_mdpi.png`}}/>}
          checked={iAggree}
          onPress={()=> setIAggree(!iAggree)}
          />
          <Text style={{marginRight:10, fontWeight:"700"}}>I agree to Terms and Conditions</Text>
        </View>
      </View>
      <View style={{padding:10, alignItems:"center"}}>
        <PoojaControls.ButtonOrange style={{width:Dimensions.get("window").width-20}} title="Complete Purchase" onPress={()=>onPress()}/>
      </View>
    </View>
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