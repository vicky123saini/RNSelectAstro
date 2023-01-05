import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import {ExpertLiveBannerView} from '../../controls/ExpertControls';
import MainStyles from '../../Styles';
import * as env from '../../../env';

export default class LiveExpertsScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <ScrollView>
        <View style={{flexDirection:"row", padding:10}}>
          <TouchableOpacity>
            <Text style={[MainStyles.text,{backgroundColor:"#B542F2", borderRadius:10, paddingHorizontal:20, paddingVertical:3, marginLeft:10}]}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={[MainStyles.text,{backgroundColor:"#fff", borderRadius:10, paddingHorizontal:20, paddingVertical:3, marginLeft:10}]}>Live Now</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={[MainStyles.text,{backgroundColor:"#fff", borderRadius:10, paddingHorizontal:20, paddingVertical:3, marginLeft:10}]}>Live Now</Text>
          </TouchableOpacity>
        </View>

        <View style={{backgroundColor:"#fff", paddingVertical:20, paddingHorizontal:10}}>
          <Text style={[MainStyles.text, {color:"#090320", fontSize:14, fontWeight:"700", marginLeft:10}]}>Live Now</Text>
          <View style={{width:"100%", alignItems:"center"}}>
          {
            Array.from(Array(20).keys()).map((item, index)=>(<ExpertLiveBannerView key={index}/>))
          }
          </View>
        </View>
      </ScrollView>
    );
  }
}
