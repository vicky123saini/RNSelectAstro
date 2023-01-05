import React, { Component } from 'react';
import {SafeAreaView, View, Text, StyleSheet, TextInput, Image, ScrollView, Modal, ActivityIndicator, Dimensions, RefreshControl, ImageBackground, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import * as env from '../../../env';
import * as Api from '../../Api';
import * as Auth from '../../Auth';
import * as MyControls from './Controls';

export default class FeedbackScreen extends Component {
  constructor(props) {
    super(props);
     
    this.state = {
    };
  }

  componentDidMount = () => {
    this._unsubscribe1 = this.props.navigation.addListener('focus', () => {      
        this.binddata();
      });
      this._unsubscribe2 = this.props.navigation.addListener('blur', () => {
        this.binddata();
      });
  };

  onRefresh = () => {
    this.setState({data:null, refreshing:true}, () => this.binddata());
  }
  
  componentWillUnmount = () =>{
    this._unsubscribe1();
    this._unsubscribe2();
  }

  binddata = () => {
    Api.Acharaya_Puja_Review_RatingService().then(response => {
        console.log("Acharaya_Puja_Review_RatingService resp", response);
        if (response.ResponseCode == 200) {
          this.setState({data:response.data, refreshing:false});
        }
    });
  }

  render() {
    return (
      <SafeAreaView style={{flex:1, backgroundColor:"#fff"}}>
            <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}>
                {
                    this.state.data && this.state.data.map((item, index)=> (
                        <View style={{backgroundColor:"#F3F3F3", marginBottom:5, padding:20}}>
                            <PoojaCardView item={item}/>
                            <TouchableOpacity onPress={()=>this.props.navigation.navigate("FeedbackReplyScreen", {item:item})}><Text style={{fontSize:10, textDecorationLine:"underline", color:"#000000", marginVertical:10, alignSelf:"flex-end"}}>रिˈप्लाइ</Text></TouchableOpacity>
                            {
                                item.ReviewAndRatings && item.ReviewAndRatings.map((sitem, sindex)=>(
                                    <View style={{marginLeft:30, paddingLeft:10, borderLeftWidth:2, borderLeftColor:"#FB7753"}}>
                                        <PoojaCardView item={sitem}/>
                                    </View>
                                ))
                            }
                        </View>
                    ))
                }
            </ScrollView>
      </SafeAreaView>
    );
  }
}


const PoojaCardView = (props) => {
    const{item}=props;
    return (
        <View>
            <View style={{flexDirection:"row", padding:10}}>
                <Image style={{width:23, height:23, marginRight:20}} resizeMode="stretch" source={{uri:`${env.DynamicAssetsBaseURL}${item.Image}`}}/>
                <View>
                    <Text style={{fontSize:14, fontWeight:"bold", color:"#FF7389"}}>{item.Name}</Text>
                    <Text style={{fontSize:9, fontWeight:"400", color:"#6D6E71"}}>{item.FeedbackDate}</Text>
                    <Text style={{fontSize:9, fontWeight:"bold", color:"#000000"}}>{item.PujaName}</Text>
                </View>
            </View>
            <Text style={{fontSize:11, fontWeight:"400", color:"#090320"}}>{item.Review}</Text>
        </View>
    )
}