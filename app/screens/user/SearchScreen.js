import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, TextInput, Modal, Alert } from 'react-native';
import MainStyles from '../../Styles';
import * as env from '../../../env';
import {Singular} from 'singular-react-native';

export default class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
    };
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  _submit = () =>{
    this.props.navigation.navigate("ExpertListScreen",{...this.state});
  }

  render() {
    return (
      <View style={{flex:1, backgroundColor:"#fff"}}>
        <View style={{width:"100%", height:54, flexDirection:"row", alignItems:"center", alignContent:"center", justifyContent:"space-between", borderBottomWidth:1, borderBottomColor:"#0000001A"}}>
            <TouchableOpacity onPress={()=> this.props.navigation.goBack()}>
                <View style={{width:30, height:54, alignItems:"center", justifyContent:"center"}}>
                    <Image style={{width:13, height:27}} resizeMode="stretch" source={require("../../assets/images/back.png")}/>
                </View>
            </TouchableOpacity>
            <View style={{width:222, height:38, flexDirection:"row", alignItems:"center", alignContent:"center", justifyContent:"space-between", borderRadius:20, backgroundColor:"#F3F3F3"}}>
                <TextInput style={{paddingLeft:20, width:"80%", height:50, color:"#000"}} value={this.state.q} onChangeText={(text)=>this.setState({q:text})} placeholder="Search"/>
                <TouchableOpacity onPress={()=> this._submit()}>
                  <View style={{paddingHorizontal:10}}>
                    <Image style={{width:16,height:16}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/search.png`}}/>
                  </View>
                </TouchableOpacity>
            </View>
            <TouchableOpacity onPress={()=> this.setModalVisible(true)}>
                <View style={{backgroundColor:"#F3F3F3", width:63, height:54, alignItems:"center", justifyContent:"center"}}>
                    <Image style={{width:20, height:20}} resizeMode="stretch" source={require("../../assets/images/filter.png")}/>
                </View>
            </TouchableOpacity>
        </View>

        <View style={{padding:30}}>
            <Text style={[MainStyles.text, {fontSize:12, color:"#404040"}]}>Search for Astrologers, Astro items, horoscope and articles</Text>
        </View>

        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          <View style={{flex:1, marginTop: 150, backgroundColor:"#ccc"}}>
            <View>
              <Text>Filters!</Text>

              <TouchableOpacity
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}>
                <Text style={{marginTop:20, padding:20, backgroundColor:"#df33ff"}}>Close me</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

      </View>
    );
  }
}
