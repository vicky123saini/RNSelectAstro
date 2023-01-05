import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Image, ScrollView, ImageBackground } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import MainStyles from '../../../Styles';
import * as env from '../../../../env';
import {Singular} from 'singular-react-native';

export default class OtherHoroscopeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };

  }

  render() {
    return (
        <ScrollView>
      <View style={{padding:30, backgroundColor:"#fff"}}>

        <Text style={styles.label}>Name <Text style={{color:"red"}}>*</Text></Text>
        <View style={styles.textInput}>
            <TextInput style={{width:"100%", color:"#000"}} placeholder="Name"/>
        </View>

        <Text style={styles.label}>Gender <Text style={{fontSize:15}}>(Optional)</Text></Text>
        <View style={{flexDirection:"row", width:"100%", justifyContent:"space-between", marginBottom:20}}>
            <TouchableOpacity>
                <View style={[styles.selectButton, styles.selectedButton]}>
                    <Image style={{width:22, height:33, marginLeft:22}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/man.png`}}/>
                    <Text style={[MainStyles.text, {marginLeft:16}]}>Male</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity>
                <View style={[styles.selectButton]}>
                    <Image style={{width:22, height:33, marginLeft:22}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/woman.png`}}/>
                    <Text style={[MainStyles.text, {marginLeft:16}]}>Female</Text>
                </View>
            </TouchableOpacity>
        </View>

        <Text style={styles.label}>Date of Birth <Text style={{color:"red"}}>*</Text></Text>
        <View style={styles.textInput}>
            <TextInput style={{width:"100%", color:"#000"}} placeholder="DD-MM-YYYY"/>
            <Image style={{width:23, height:23, marginRight:20}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/calendar.png`}}/>
        </View>

        <Text style={styles.label}>City of Birth <Text style={{fontSize:15}}>(Optional)</Text></Text>
        <View style={styles.textInput}>
            <TextInput style={{width:"100%", color:"#000"}} placeholder="Enter City/District"/>
        </View>

        <Text style={styles.label}>Time of Birth <Text style={{fontSize:15}}>(Optional)</Text></Text>
        <View style={styles.textInput}>
            <TextInput style={{width:"100%", color:"#000"}} placeholder="HH:MM TT"/>
            <Image style={{width:23, height:23, marginRight:20}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/clock.png`}}/>
        </View>

        <View style={{alignItems:"center"}}>
            <TouchableOpacity onPress={()=>{Singular.event("OtherHoroscopeScreen_View_daily_prediction"); this.props.navigation.navigate("LanguageChoiseScreen")}}>
                <LinearGradient colors={["#7162FC", "#B542F2"]} style={{borderRadius:30, width:300, marginBottom:20}}>
                    <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>View daily prediction</Text>
                </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>{Singular.event("OtherHoroscopeScreen_View_yearly_prediction"); this.props.navigation.navigate("LanguageChoiseScreen")}}>
                <LinearGradient colors={["#7162FC", "#B542F2"]} style={{borderRadius:30, width:300, marginBottom:20}}>
                    <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>View yearly prediction</Text>
                </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=>{Singular.event("OtherHoroscopeScreen_View_detailed_kundali"); this.props.navigation.navigate("LanguageChoiseScreen")}}>
                <LinearGradient colors={["#FF8767", "#FF65A0"]} style={{borderRadius:30, width:300, marginBottom:20}}>
                    <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>View detailed kundali</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>

      </View>
      </ScrollView>
    );
  }
}

const styles=StyleSheet.create({
    pageTitle:{
        ...MainStyles.text,
        fontSize:20,
        marginBottom:20
    },
    label:{
        ...MainStyles.text,
        paddingLeft:20,
        fontSize:17,
        color:"#656565"
    },
    textInput:{
        flexDirection:"row",
        width:"100%",
        alignItems:"center",
        justifyContent:"space-between",
        paddingLeft:20,
        backgroundColor:"#F3F3F3", 
        borderRadius:30,
        marginBottom:20,
        height:50
    },
    selectButton:{flexDirection:"row", width:127, height:50, backgroundColor:"#F3F3F3", padding:5, alignContent:"center", alignItems:"center", borderRadius:30},
    selectedButton:{
        borderColor:"#FF708F",
        borderWidth:2,
        backgroundColor:"#fff"
    }
});