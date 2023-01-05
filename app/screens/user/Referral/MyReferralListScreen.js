import React, { Component } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Image, Dimensions } from 'react-native';
import * as MyControls from '../Controls';
import LinearGradient from 'react-native-linear-gradient';
import * as env from '../../../../env';
import * as Auth from '../../../Auth';
import * as Api from '../../../Api';
import MainStyles from '../../../Styles';
import Html from 'react-native-render-html';

export default class MyReferralListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { 
    };
  }

  componentDidMount = () => {
    this.binddata();
  };

  binddata = () => {
      
        console.log("GetMyReferralListService req");
        Api.GetMyReferralListService().then(resp => {
          console.log("GetMyReferralListService resp", resp);
          if (resp.ResponseCode == 200) { 
            this.setState({ data: resp.data });
          }
        });
      
       
  }
  

  render() { 
    return (
      <SafeAreaView>
       
        <View style={{backgroundColor:"#fff", minHeight:Dimensions.get("window").height}}>
        <View style={{paddingHorizontal:10, alignItems:"center", marginTop:20}}>
             
            <View style={{width:"98%"}}>
                <View style={{flexDirection:"row"}}>
                <Text style={{fontSize:12, fontWeight:"700", borderWidth:1, borderRightWidth:0, borderColor:"#ccc", width:"25%", padding:7}}>Name</Text>
                <Text style={{fontSize:12, fontWeight:"700", borderTopWidth:1, borderBottomWidth:1, borderColor:"#ccc", width:"25%", padding:7}}>Date</Text>
                <Text style={{fontSize:12, fontWeight:"700", borderTopWidth:1, borderBottomWidth:1, borderColor:"#ccc", width:"30%", padding:7}}>Mobile</Text>
                <Text style={{fontSize:12, fontWeight:"700", borderWidth:1, borderLeftWidth:0, borderColor:"#ccc", width:"20%", padding:7}}>Amount</Text>
                </View>
                {
                    this.state.data && this.state.data.map((item, index)=>(
                        <View key={index} style={{flexDirection:"row", borderWidth:1, borderColor:"#ccc", width:"100%"}}>
                            <Text style={{fontSize:12, width:"25%", padding:7}}>{item.Name}</Text>
                            <Text style={{fontSize:12, width:"25%", padding:7}}>{item.Date}</Text>
                            <Text style={{fontSize:12, width:"30%", padding:7}}>{item.Mobile}</Text>
                            <Text style={{fontSize:12, width:"20%", padding:7}}>{item.Amount}</Text>
                        </View>
                    ))
                }
            </View>
                
           
        </View>
        </View>
      </SafeAreaView>
    );
  }
}
