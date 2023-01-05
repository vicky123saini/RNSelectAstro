import React, { Component, useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, SafeAreaView, Dimensions } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MainStyles from '../../Styles';
import analytics from '@react-native-firebase/analytics';
import * as UserControls from './Controls';
import * as env from '../../../env';
import * as Api from '../../Api';
import Swiper from 'react-native-swiper' 
import { useNavigation } from '@react-navigation/native';

export default class AnnualHoroscopeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
       tabs:[
        {index:0, title:"Jan - Mar", propName:"phase_1"},
        {index:1, title:"Apr - June", propName:"phase_2"},
        {index:2, title:"July - Sep", propName:"phase_3"},
        {index:3, title:"Oct - Dec", propName:"phase_4"},
      ],
      selectTabIndex:0
    };
  }

  componentDidMount = async () => {
    analytics().logEvent("annual_horoscope");
    
    console.log("GetEnduserProfileService req")

    Api.GetEnduserProfileService().then(resp => {
        console.log("GetEnduserProfileService resp", JSON.stringify(resp));
        if (resp.ResponseCode == 200) {
          if(resp.data.DateOfBirth==null || resp.data.DateOfBirth==""){
            this.props.navigation.replace("UpdateUserProfile")
          }
          this.setState({profile:resp.data});
        }
    }); 
    
    Api.GetMyAnnualHoroscopeService().then(resp=> {
      console.log("GetMyAnnualHoroscopeService", JSON.stringify(resp))
      if (resp.ResponseCode == 200) {
        this.setState({data:resp.data});
      }
    });
  };

  onTabPress = (index) =>{
    this.setState({selectTabIndex:index});
  }

  render() {
    return ( 
      !this.state.data && <Text>..</Text>||
      <SafeAreaView style={{flex:1, backgroundColor:"#fff"}}>

{
  this.state.profile && <UserControls.Header {...this.props} title="Annual Horoscope" shareText={this.state.profile.ShareText}/>
}
        

        <ScrollView style={{flex:1, backgroundColor:"#fff"}}>
         
        <Image style={{width:Dimensions.get("window").width, height:Dimensions.get("window").width/710*193}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}assets/images/annual-horoscope-banner.png`}}/>
        
      
      <View style={{marginTop:1, flexDirection:"row", height:35, backgroundColor:"#F3F3F3", alignItems:"center", justifyContent:"center"}}>
        {
          this.state.tabs.map((item, index)=>(
          <TouchableOpacity onPress={()=> this.onTabPress(index)}>
            <View style={[{height:35, alignItems:"center", justifyContent:"center", paddingHorizontal:20}, item.index==this.state.selectTabIndex && {borderBottomColor:"#AF44F3", borderBottomWidth:2}]}>
              <Text style={{fontSize:14}}>{item.title}</Text>
            </View>
          </TouchableOpacity>
          ))
        }
      </View>

      {
        this.state.profile && <DetailView navigation={this.props.navigation} data={{...this.state.data.annualHoroscope[this.state.tabs[this.state.selectTabIndex].propName], Name_En:this.state.data.Name_En, ImagePath:this.state.data.ImagePath, banner:this.state.data.banner}} profile={this.state.profile}/>
      }

    </ScrollView>
    </SafeAreaView>
    );
  }
}

const DetailView = (props) => {
  const{data, profile}=props;
  console.log("profile",profile)

  

  const stabs=[
    {index:0, title:"Overall", propName:"status"},
    {index:1, title:"Health", propName:"health"},
    {index:2, title:"Career", propName:"career"},
    {index:3, title:"Relationship", propName:"relationship"},
    {index:4, title:"Travel", propName:"travel"},
    {index:5, title:"Family", propName:"family"},
    {index:6, title:"Friends", propName:"friends"},
    {index:7, title:"Finances", propName:"finances"},
  ];
  const[tabIndex, setTabIndex] = useState(0);


  return(
    <View>
<View>
    {/* <View style={{marginTop:30, backgroundColor:"#F3F3F3"}}>
      <ScrollView horizontal={true}>
    <View style={{flex:0, flexDirection:"row", padding:10}}>
      
      {
        stabs.map((item, index)=>(
        <TouchableOpacity onPress={()=> {setTabIndex(index)}}>
          <LinearGradient colors={tabIndex==index ? ["#AF44F3", "#AF44F3"]:["#fff", "#fff"]} style={[{ borderRadius: 30, marginLeft: 10 }]}>
            <Text style={[MainStyles.text,{borderRadius:10, paddingHorizontal:15, paddingVertical:3}, tabIndex==index ? { color:"#fff" }:{color:"#000"}]}>{item.title}</Text>
          </LinearGradient>
        </TouchableOpacity>
        ))
      }
     
    </View>
 </ScrollView>
  </View> */}

  <View style={{flexDirection:"row", alignItems:"flex-start", justifyContent:"space-evenly", paddingVertical:30}}>
    <View>
      <Text style={{fontSize:20, fontWeight:"700"}}>{data.Name_En}</Text>
      <Text>{profile.Name}</Text>
      <Text>{profile.DateOfBirth}</Text>
    </View>
    <View>
      <Image style={{width:60, height:60}} resizeMode="stretch" source={{uri:`${env.DynamicAssetsBaseURL}${data.ImagePath}`}}/>
    </View>
  </View>


</View>
  <SliderView data={data}/*data={{...data[stabs[tabIndex].propName], banner:data.banner}}*/ />

  <View>
        <UserControls.ExpertSuggestionView navigation={props.navigation}/>
      </View>
</View>
  )
}


const SliderView = (props) => {
  const{data}=props;
  const navigation = useNavigation();

  const stabs=[
    {index:0, title:"Overall", propName:"status"},
    {index:1, title:"Health", propName:"health"},
    {index:2, title:"Career", propName:"career"},
    {index:3, title:"Relationship", propName:"relationship"},
    {index:4, title:"Travel", propName:"travel"},
    {index:5, title:"Family", propName:"family"},
    {index:6, title:"Friends", propName:"friends"},
    {index:7, title:"Finances", propName:"finances"},
  ];


  return(
    
<View>
 
<Swiper 
  style={styles.wrapper} 
  showsButtons={true}
  nextButton = {<Text style={{color:"#ccc", fontSize:30, fontWeight:"bold"}}>{'>'}</Text>}
  prevButton = {<Text style={{color:"#ccc", fontSize:30, fontWeight:"bold"}}>{'<'}</Text>}
  >
    {
      stabs.map((item, index)=>
      {
        const nitem=data[stabs[index].propName];
        return(
        <View style={styles.slide}>
          <View style={styles.slide_text}>
            <View style={{alignContent:"center", alignItems:"center"}}>
              <Text style={{fontSize:20, color:"#AF44F3", fontWeight:"700"}}>{stabs[index].title}</Text>
              <Text style={[MainStyles.text, { fontSize: 14, color: "#090320" }]}>{nitem.score_text}</Text>
            </View>
            <Text style={[MainStyles.text, { fontSize: 14, color: "#090320" }]}>{nitem.prediction}</Text>
          </View>
        </View>
        )
      })
    }    
</Swiper>

 


    <View style={{marginVertical:40, alignItems:"center", justifyContent:"center"}}>
      <TouchableOpacity onPress={()=>navigation.navigate(data.banner.actionName, data.banner.actionParam)}>
      <Image style={{width:Dimensions.get("window").width-20, height:Dimensions.get("window").width/551*200}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}${data.banner.image.uri}`}}/>
        {/* <LinearGradient colors={["#AF43F2", "#6D4BD0"]} style={[{borderRadius: 15, width:320, height:100}]}>
          <ImageBackground style={{width:340, height:90, paddingVertical:5, paddingHorizontal:20, alignItems:"flex-start"}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}assets/images/booknow-bg.png`}}>
            <Text style={[{fontSize:14, color:"#fff"}]}>ARE YOU ABLE TO READ THE CHART?</Text>
            <Text style={[{fontSize:12, color:"#fff", marginTop:0}]}>Connect with an expert astrologer for a complete reading!</Text>
            <Text style={{paddingVertical:6, paddingHorizontal:20, borderRadius:10, backgroundColor:"#fff", marginTop:5}}>Call Now</Text>
          </ImageBackground>
        </LinearGradient> */}
      </TouchableOpacity>
    </View>
</View>
  )
}

const styles = StyleSheet.create({
  wrapper: {height:250},
  slide: {
    
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 30,
    paddingVertical:20,
    
  },
  slide_text:{width:"100%", height:250}
  });