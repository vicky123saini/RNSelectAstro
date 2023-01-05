import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, _View } from 'react-native';
import {Card} from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import MainStyles from '../../Styles';
import * as env from '../../../env';
import * as Api from '../../Api';
import {Singular} from 'singular-react-native';

export default class RechargeHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount = () => {
    Api.RechargeHistoryService().then(resp=>{
        console.log("RechargeHistoryService resp", JSON.stringify(resp));
        if (resp.ResponseCode == 200) {
            this.setState({RechargeHistory:resp.data});
        }
    })
  };
  

  render() {
    return (
        this.state.RechargeHistory == null && 
        <View style={{flex:1, justifyContent:"center", backgroundColor:"#fff"}}><ActivityIndicator color="#0000ff"/></View>
        ||
        
        this.state.RechargeHistory.length==0 && <View style={{flex:1, alignContent:"center", alignItems:"center", justifyContent:"center", backfaceVisibility:"#fff"}}><Text>NO RECORD FOUND</Text></View>
        
        ||
      <ScrollView>
          
        {
        this.state.RechargeHistory &&
    
        <View style={{paddingTop:10, backgroundColor:"#fff"}}>
            <View style={{width:"90%", alignSelf:"center"}}>
                
                {
                    
                    this.state.RechargeHistory.map((item, index)=>(
                        <Card key={index}>
                            <Text style={{paddingLeft:10, paddingTop:10}}>Ref No: {item.TxnId}</Text>
                            <View style={{flexDirection:"row", padding:10}}>
                              <View style={{flex:1}}>
                                <Text>{item.CreatedDate}</Text>
                              </View>
                              <View style={{flex:1,paddingLeft:10}}>
                                <Text style={[Styles.listText1,{}]}>{item.Remark}</Text>
                                <Text style={[Styles.listText2,{}]}>Amount: {item.Amount}</Text>
                              </View>
                              <View style={{flex:1,marginLeft:10}}>
                                  <Text style={[Styles.listText2,{}]}>Status</Text>
                                  <Text style={[Styles.listText1,{fontSize:16, textTransform:"capitalize"}, item.Status=="SUCCESS" && {color:"green"} || {color:"red"}]}>{item.Status.replace("_"," ")}</Text>
                              </View>
                            </View>
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



const Styles = StyleSheet.create({
    cartItem:{flex:1, alignContent:"center", alignItems:"center", justifyContent:"center"},
    bottomText:{...MainStyles.text, padding:10, fontSize:18, textAlign:"center"},
    itemCell:{width:100, height:50, margin:20, transform: [{ rotate: '-90deg'}], alignItems:"center", justifyContent:"center"},
    boxTex1:{...MainStyles.text, color:"#fff", paddingTop:10},
    listText1:{...MainStyles.text, fontSize:14, color:"#131313"},
    listText2:{...MainStyles.text, fontSize:12, color:"#656565"}
})