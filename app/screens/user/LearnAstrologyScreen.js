import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Image, ScrollView, ImageBackground } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import MainStyles from '../../Styles';
import * as env from '../../../env';
import {ExpertStickerView, ExpertLiveBannerView} from '../../controls/ExpertControls';
import {Singular} from 'singular-react-native';

export default class LearnAstrologyScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };

  }

  render() {
    return (
    <ScrollView style={{backgroundColor:"#fff"}}>
      <View style={{padding:20}}>
        <Text style={styles.heading}>Astro Teachers</Text>
        <View>
          <ScrollView horizontal={true}>
            <View style={{flexDirection:"row"}}>
              {
                Array.from(Array(10).keys()).map((item, index)=>{
                  return(
                    <TouchableOpacity key={index} onPress={()=> this.props.navigation.navigate("ExpertListScreen")}>
                      <View style={{width:120, height:148, position:"relative"}}>
                        <ImageBackground style={{width:120, height:148}} resizeMode="stretch" source={require("../../assets/images/astro-bg.png")}/>
                        <View style={{position:"absolute",width:120, height:148, alignItems:"center", justifyContent:"center"}}>
                        <Image style={{width:80, height:80, borderRadius:40}} resizeMode="cover" source={require("../../assets/images/exp2.jpg")}/>
                        <Text style={[MainStyles.text,{fontSize:14, color:"#fff"}]}>Acharya Dev</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )
                })
              }

            </View>
          </ScrollView>
        </View>
      </View>

      <View style={{padding:20, marginBottom:20}}>
        <Text style={styles.heading}>Astro Courses</Text>
        <View>
          <ScrollView horizontal={true}>
            <View style={{flexDirection:"row"}}>
              {
                Array.from(Array(10).keys()).map((item, index)=>{
                  return(
                    <TouchableOpacity key={index} onPress={()=> this.props.navigation.navigate("ExpertListScreen")}>
                      <View style={[MainStyles.shadow, {margin:10, width:200, height:270, backgroundColor:"#FFF", padding:20}]}>
                         <Text style={[MainStyles.text,{fontSize:20, color:"#090320", fontWeight:"700"}]}>Beginner</Text>
                         <Text style={[MainStyles.text,{fontSize:14, color:"#090320", marginBottom:20}]}>Introduction to Astrology</Text>
                         <Text style={[MainStyles.text,{fontSize:14, color:"#090320", alignSelf:"center"}]}>Total Sessions</Text>
                         <Text style={[MainStyles.text,{fontSize:40, fontWeight:"bold", color:"#090320", alignSelf:"center"}]}>10</Text>
                         <Text style={[MainStyles.text,{fontSize:16, color:"#090320", alignSelf:"center"}]}>₹ 7499</Text>
                         <Text style={[MainStyles.text,{fontSize:14, color:"#9591A7", textDecorationLine:"line-through", alignSelf:"center", marginBottom:15}]}>₹ 15000</Text>
                         <View style={{width:"100%", alignItems:"center"}}>
                            <TouchableOpacity onPress={()=>this.props.navigation.navigate("SigninUpdateInfoScreen")}>
                                <LinearGradient colors={["#FF8767", "#FF65A0"]} style={{borderRadius:30, width:166, marginBottom:20}}>
                                    <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>Take this course</Text>
                                </LinearGradient>
                            </TouchableOpacity>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )
                })
              }

            </View>
          </ScrollView>
        </View>
      </View>

    

     
     
      <View style={{width:"100%", alignItems:"center"}}>
        <TouchableOpacity onPress={()=>this.props.navigation.navigate("UserContactUsScreen")}>
            <LinearGradient colors={["#7162FC", "#B542F2"]} style={{borderRadius:30, width:260, marginBottom:20}}>
                <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>Have query ?</Text>
            </LinearGradient>
        </TouchableOpacity>
      </View>

     <View style={{padding:30}}>
         <Text style={[MainStyles.text,{fontSize:14, color:"#090320"}]}>Important Points{'\n'}{'\n'}1. 50% Discount Offer is only valid till 31st March, 2021. Standard fee will be applied thereafter.{'\n'}2. Advanced Predictive Course will be include Beginner & Advanced Course Guidelines.{'\n'}3. Sessions will be conducted by one of the mentioned teachers. Choice of the same is at the liberty of SelectAstro.{'\n'}4. Session once skipped shall not be repeated.{'\n'}5. The Fees of the course includes GST. Invoice available at request.</Text>
     </View>
      

      </ScrollView>
    );
  }
}

const styles=StyleSheet.create({
    heading:{
        ...MainStyles.text,
        fontSize:14,
        marginBottom:20,
        color:"#090320"
    }
    
});