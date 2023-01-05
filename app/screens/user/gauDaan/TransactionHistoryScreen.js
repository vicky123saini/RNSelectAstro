import React, { Component } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity } from 'react-native';
import {Card, CardItem} from 'native-base';
import LinearGradient from 'react-native-linear-gradient';
import MainStyles from '../../../Styles';
import * as env from '../../../../env';
import * as Api from '../../../Api';
import * as Auth from '../../../Auth';
import {Singular} from 'singular-react-native';
import {TaxRebaitFormView} from './Controls';
import Overlay from 'react-native-modal-overlay';

export default class TransactionHistoryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount = () => {
    Api.GetAppSettingByKetService(Auth.AppSettingKey.Enable_Tax_Rebate_Form).then(resp=>{
      console.log("GetAppSettingByKetService resp", resp.data);
      if(resp.data!=null && resp.data != "false" && resp.data != "False"){
        this.setState({Enable_Tax_Rebate_Form:true});
      }
    });
    this.binddata();
  };

  binddata = () =>{
    Api.GetTransactionsGauSevaService().then(resp=>{
      console.log("GetTransactionsGauSevaService resp", JSON.stringify(resp));
      if (resp.ResponseCode == 200) {
          this.setState({data:resp.data});
      }
    });
  }
  

  render() {
    return (
        this.state.data == null && 
        <View style={{flex:1, justifyContent:"center", backgroundColor:"#fff"}}><ActivityIndicator color="#0000ff"/></View>
        ||
        
        this.state.data.length==0 && <View style={{flex:1, alignContent:"center", alignItems:"center", justifyContent:"center", backfaceVisibility:"#fff"}}><Text>NO RECORD FOUND</Text></View>
        
        ||
      <ScrollView>
          
        {
        this.state.data &&
    
        <View style={{paddingTop:10, backgroundColor:"#fff"}}>
            <View style={{width:"90%", alignSelf:"center"}}>
                
                {
                    
                    this.state.data.map((item, index)=>(
                        <Card key={index}>
                            <CardItem justifyContent="space-between">
                              <View>
                                <Text style={{fontSize:12}}>{item.Date}</Text>
                                <Text>{item.Type}</Text>
                                <Text style={[Styles.listText2,{}]}>Amount: {item.Amount}</Text>
                              </View>

                              <View>
                                <Text numberOfLines={1} style={{width:220}}>Ref No: {item.RefNo}</Text>
                                <View style={{flexDirection:"row", alignItems:"flex-end", justifyContent:"flex-start"}}>
                                  <View>
                                    <Text style={[Styles.listText2,{fontSize:14, fontWeight:"700"}]}>Status</Text>
                                    <Text style={[Styles.listText1,{fontSize:14, textTransform:"capitalize"}, item.Status=="SUCCESS" && {color:"green"} || {color:"red"}]}>{item.Status.replace("_"," ")}</Text>
                                  </View>
                                  <View>
                                    {
                                      this.state.Enable_Tax_Rebate_Form && !item.IsTaxRebaitDone &&
                                      <TouchableOpacity onPress={()=> this.setState({selectedItem:item})}>
                                        <View style={{height:30, paddingHorizontal:15, alignItems:"center", justifyContent:"center", backgroundColor:"#683A8E", borderRadius:15, marginLeft:10}}>
                                          <Text style={{color:"#fff", fontSize:14}}>Generate 80G Form</Text>
                                        </View>
                                      </TouchableOpacity>
                                    }
                                  </View>
                                </View>
                              </View>      
                            </CardItem>
                        </Card>
                    ))
                }
            </View>
        </View>
        }

        <Overlay visible={this.state.selectedItem!=null}>
          <TaxRebaitFormView Id={this.state.selectedItem ? this.state.selectedItem.Id : 0} onClose={()=> this.setState({selectedItem:null}, ()=> this.binddata())}/>
        </Overlay>

         
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