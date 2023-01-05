import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, RefreshControl } from 'react-native';
import {Card, CardItem} from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import {FeedbackForm} from '../../controls/ExpertControls';
import MainStyles from '../../Styles';
import * as env from '../../../env';
import * as Api from '../../Api';
import * as Auth from '../../Auth';
import * as MyExtension from '../../MyExtension';
import moment from 'moment';
import {Singular} from 'singular-react-native';

export default class WalletHistoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  

  componentDidMount = () => {
    this.bindData();
  };

  bindData = () => {
    Api.WalletHistoryService().then(resp=>{
        console.log("WalletHistoryService resp");
        if (resp.ResponseCode == 200) {
            this.setState({data:resp.data, refreshing:false});
        }
    })
  };
  

  onRefresh = () => {
    this.setState({refreshing:true, data:null, FeedbackId:null});
    this.bindData();
  }

  render() {
    return (
        this.state.data == null && 
        <View style={{flex:1, justifyContent:"center", backgroundColor:"#fff"}}><ActivityIndicator color="#0000ff"/></View>
        ||
        
        this.state.data.length==0 && <View style={{flex:1, alignContent:"center", alignItems:"center", justifyContent:"center", backfaceVisibility:"#fff"}}><Text>NO RECORD FOUND</Text></View>
        
        ||
        <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}>
        {
            this.state.FeedbackId &&
            <FeedbackForm feedbackId={this.state.FeedbackId} onClose={()=> this.setState({FeedbackId:null})} onSubmit={(Rating)=> { if(Rating<4)this.props.navigation.navigate("UserFeedbackScreen"); this.onRefresh(); }}/>
        }
        {
        this.state.data &&
    
        <View style={{paddingTop:10, backgroundColor:"#fff"}}>
            <View style={{width:"90%", alignSelf:"center"}}>
                {
                    this.state.data.map((item, index)=>(
                        <Card key={index}>
                           <CardItem style={{}}>
                               <View style={{flex:1.5}}>
                                <Text>{moment(item.CreatedDate).format("DD/MM/YYYY")}</Text>
                                <Text>{moment(item.CreatedDate).format("HH:mm")}</Text>
                               </View>
                               <View style={{flex:2}}>
                                   <Text>Description</Text>
                                    <Text style={{color:item.Type==Auth.WalletDetail_Type.CREDIT?"green":"red"}}>{item.Remark}</Text>
                               </View>
                               <View style={{flex:1}}>
                                   <Text>Amount</Text>
                                    <Text style={{fontWeight:"700",color:item.Type==Auth.WalletDetail_Type.CREDIT?"green":"red"}}>₹{item.Amount}</Text>
                               </View>
                           </CardItem>
                        </Card>
                    ))
                }
            </View>
        </View>
        }
      </ScrollView>
    );
  }
}