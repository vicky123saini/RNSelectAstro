import React, { Component } from 'react';
import {SafeAreaView, View, Text, StyleSheet, TextInput, Image, ScrollView, Modal, ActivityIndicator, Dimensions, RefreshControl, ImageBackground, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as env from '../../../env';
import * as Api from '../../Api';
import * as Auth from '../../Auth';
import * as MyControls from './Controls';
import { Calendar } from 'react-native-calendars';

export default class TimeTableScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
        modalVisible: false,
    };
  }

  componentDidMount = () => {
    this.binddata();
  }; 
  
  onRefresh = () => {
    this.setState({data:null, refreshing:true}, ()=> this.binddata());
  }

  binddata = () => {
    Api.Acharaya_PujaBookingsService(1, 10).then(response => {
      console.log("Acharaya_PujaBookingsService resp", response);
      if (response.ResponseCode == 200) {
         this.setState({data:response.data, refreshing:false});
      }
    });
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  render() {
    return (
      <SafeAreaView style={{flex:1, backgroundColor:"#fff"}}>
        <ScrollView style={{flex:1, padding:20}} refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}>
        <TouchableOpacity onPress={()=> this.setModalVisible(true)}>
            <View style={{flexDirection:"row", alignItems:"center", backgroundColor:"#F5F5F5", borderRadius:15, paddingVertical:10, paddingHorizontal:20}}>
                <Image style={{width:23, height:23, marginRight:20}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/calendar.png`}}/>
                 
                <View>
                    <Text style={{fontSize:14, fontWeight:"400"}}>पूजा के लिए उपलब्ध नहीं है</Text>
                    <Text style={{fontSize:14, fontWeight:"400", color:"#A5A5A5"}}>08 जनवरी, 09 जनवरी, 10 जनवरी, 20 जनवरी</Text>
                </View>
            </View>
        </TouchableOpacity>

            <View style={{flexDirection:"row", alignItems:"center", backgroundColor:"#F5F5F5", borderRadius:5, alignSelf:"flex-end", marginTop:20, paddingVertical:5, paddingHorizontal:10}}>
                <Text>फ़िल्टर चुनें</Text>
                <Image style={{width:14, height:11, marginLeft:10}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/filter.png`}}/>
            </View>
            
            <View style={{marginVertical:20}}>
                <Text style={{fontSize:13, fontWeight:"bold", marginTop:22, marginBottom:10}}>पूजा कार्यक्रम</Text>
                <View style={{backgroundColor:"#FB7753", borderRadius:15, padding:20, paddingBottom:0}}>
                  {
                    this.state.data && this.state.data.map((item, index)=>(
                      <MyControls.TimetableListItemView {...this.props} item={item}/>
                    ))
                  }
                    {/* <MyControls.TimetableListItemView {...this.props}/>
                    <MyControls.TimetableListItemView {...this.props}/>
                    <MyControls.TimetableListItemView {...this.props}/>
                    <MyControls.TimetableListItemView {...this.props}/>
                    <MyControls.TimetableListItemView {...this.props}/> */}
                </View>
            </View>

        <Modal 
          animationType="slide"
          transparent={true} 
          visible={this.state.modalVisible}
          >
          <View style={{flex:1, marginTop: 110, backgroundColor:"#fff", padding:20, borderTopLeftRadius:20, borderTopRightRadius:20, borderWidth:1, borderColor:"#F5F5F5"}}>
            
            <TouchableOpacity
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}>
              <View style={{alignItems: "center", width:"100%", height:20}}>
                <Image style={{width:140, height:8}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/rectangle.png`}}/>
              </View>
              </TouchableOpacity>

              <View style={{marginVertical:20, alignItems: "center"}}>
                  <Text style={{fontSize:16, fontWeight:"bold"}}>तिथियों का चयन करें</Text>
              </View>
              <View style={{flexDirection:"row", alignItems: "center", justifyContent: "space-between", paddingHorizontal:30}}>
                <View style={{flexDirection:"row", alignItems: "center"}}>
                    <View style={{width:16, height:16, borderRadius:8, backgroundColor:"#FB7753"}}></View>
                    <Text style={{marginLeft:10, fontSize:12}}>पूजा तिथियां</Text>
                </View>
                <View style={{flexDirection:"row", alignItems: "center"}}>
                    <View style={{width:16, height:16, borderRadius:8, backgroundColor:"#ccc"}}></View>
                    <Text style={{marginLeft:10, fontSize:12}}>पूजा के लिए उपलब्ध नहीं</Text>
                </View>
               </View>

              <View style={{padding:20, marginTop:20, borderBottomLeftRadius:15, borderBottomRightRadius:15}}>
                <Calendar 
                    markedDates={{
                        '2022-01-10': {selected: true, selectedColor:"#FB7753"},
                        '2022-01-01': {selected: true, selectedColor:"#FB7753"},
                        '2022-01-25': {selected: true, selectedColor:"#FB7753"},
                        '2022-01-27': {selected: true, selectedColor:"#FB7753"},
                        '2022-01-28': {selected: true, selectedColor:"#FB7753"},
                        '2022-01-30': {selected: true, selectedColor:"#FB7753"}
                    }}
                    //minDate={this.state.minDate} 
                    //maxDate={this.state.maxDate} 
                    //onDayPress={(day) => onDayPress(day) }
                     
                    />
                </View>

             
                <TouchableOpacity>
                    <LinearGradient colors={["#8A09F0", "#E39DD9"]} style={{borderRadius:30, width:220, alignSelf:"center"}}>
                        <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>अप्लाई</Text>
                    </LinearGradient>
                </TouchableOpacity>
             
             
          </View>
        </Modal>

        </ScrollView>
      </SafeAreaView>
    );
  }
}
