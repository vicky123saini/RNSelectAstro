import React, { Component } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, Image, Dimensions } from 'react-native';
import * as MyControls from '../Controls';
import LinearGradient from 'react-native-linear-gradient';
import * as env from '../../../../env';
import * as Auth from '../../../Auth';
import * as Api from '../../../Api';
import MainStyles from '../../../Styles';
import Html from 'react-native-render-html';

export default class WinnersScreen extends Component {
  constructor(props) {
    super(props);
    this.state = { 
    };
  }

  componentDidMount = () => {
    const{type}=this.props.route.params;
    this.binddata(type);
  };

  binddata = (type) => {
      if(type=="Weekly"){
        console.log("GetWeeklyReferralService req");
        Api.GetWeeklyReferralService().then(resp => {
          console.log("GetWeeklyReferralService resp", resp);
          if (resp.ResponseCode == 200) { 
            this.setState({ data: resp.data });
            this.props.navigation.setOptions({title:"Weekly Winners"})
          }
        });
      }
      else{
        console.log("GetMonthlyReferralService req");
        Api.GetMonthlyReferralService().then(resp => {
          console.log("GetMonthlyReferralService resp", resp);
          if (resp.ResponseCode == 200) { 
            this.setState({ data: resp.data });
            this.props.navigation.setOptions({title:"Monthly Winners"})
          }
        });
      }
  }
  

  render() { 
    return (
      <SafeAreaView>
      
        <View style={{backgroundColor:"#fff", minHeight:Dimensions.get("window").height}}>
        <View style={{paddingHorizontal:10, alignItems:"center", marginTop:20}}>
            {
              !this.state.data && <Text>Loading...</Text> ||
              this.state.data.length==0 && <Text>NO RECORD FOUND</Text> ||
              this.state.data.map((item, index)=>(
                    <View key={index} style={{width:"90%"}}>
                        <Text style={{fontSize:18, borderWidth:1, borderColor:"#ccc", width:"100%", textAlign:"center", padding:7}}>{item.Month}</Text>
                        {
                            item.Items.map((titem, tindex)=>(
                                <View key={tindex} style={{flexDirection:"row", borderWidth:1, borderColor:"#ccc", width:"100%"}}>
                                    <Text style={{fontSize:18, width:"50%", padding:7, textAlign:"center"}}>{titem.Type}</Text>
                                    <Text style={{fontSize:18, width:"50%", padding:7, textAlign:"center"}}>{titem.Name}</Text>
                                </View>
                            ))
                        }
                    </View>
                ))
            }
        </View>
        </View>
      </SafeAreaView>
    );
  }
}
