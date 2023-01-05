import React, { Component } from 'react';
import { View, Text, AppRegistry, ScrollView, ActivityIndicator } from 'react-native';
import {LiveSessionCard} from '../../user/Controls';
import * as env from '../../../../env';
import * as Api from '../../../Api';
import * as Auth from '../../../Auth';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';

export default class LiveSessionListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount = () => {
    this.setState({loading:true});
    this.binddata();
    this._unsubscribe1 = this.props.navigation.addListener('focus', () => {      
      this.interval = setInterval(() => this.binddata(), 5000);
    });
    this._unsubscribe2 = this.props.navigation.addListener('blur', () => {
      clearInterval(this.interval);
    });
  };

  binddata = () => {
    //console.log("Interval", 1304);
    //console.log("UserliveSessionService req");
    Api.UserliveSessionService()
    .then(resp=> {
        //console.log("UserliveSessionService resp", resp.data.length);
        this.setState({loading:false});
        if (resp.ResponseCode == 200) {
            this.setState({data:resp.data});
        }
    });
  }

  componentWillUnmount = () => {
    clearInterval(this.interval);
    this._unsubscribe1();
    this._unsubscribe2()
  };
  
  

  render() {
    return (
      <SafeAreaView style={{flex:1, backgroundColor:"#FFF"}}>
      {
      this.state.loading && <ActivityIndicator color="blue"/> ||
      (this.state.data==null || this.state.data.length==0) && <View style={{flex:1, alignItems:"center", justifyContent:"center"}}><Text style={{fontWeight:"700"}}>NO RECORD FOUND</Text></View> ||
        <View style={{paddingVertical:10, backgroundColor:"#fff"}}>
            <ScrollView horizontal={true}>
                {
                    this.state.data && this.state.data.map((item, index)=>
                        <TouchableOpacity key={index} onPress={()=> this.props.navigation.replace("Live_Usr_NotifyMeScreen", {Id:item.Session.Id})}>
                            <View style={{padding:10}}>
                                <LiveSessionCard profile={item.Profile} item={item.Session}/>
                            </View>
                        </TouchableOpacity> 
                    )
                }
            </ScrollView>
        </View>
        }
      </SafeAreaView>
    );
  }
}

 