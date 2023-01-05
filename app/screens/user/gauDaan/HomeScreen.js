import React, { Component } from 'react';
import { View, Text, SafeAreaView, ScrollView, Image } from 'react-native';
import {Card, CardItem} from 'native-base';
import {Button, BalanceView} from './Controls';
import * as env from '../../../../env';

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <SafeAreaView style={{flex:1, backgroundColor:"#fff", padding:20}}>
        <Card style={{borderRadius:40}}>
            <CardItem style={{borderRadius:40}}>
                <View style={{padding:20}}>
                    <Text style={{fontSize:20, fontWeight:"700", color:"#646464"}}>Sponser food for a cow</Text>
                    <Text style={{fontWeight:10, fontWeight:"400", color:"#646464"}}>Convert your rewards to feed cows</Text>
                    <View style={{marginVertical:20}}>
                        <BalanceView/>
                    </View>
                    <Image style={{width:288,height:186}} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/gau-seva/gau1.png` }} />
                </View>
            </CardItem>
        </Card>
        <View style={{marginTop:40}}>
            <Button title="Convert"/>
        </View>
      </SafeAreaView>
    );
  }
}
