import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Image, ScrollView, ActivityIndicator, Linking } from 'react-native';
import {Card, CardItem} from 'native-base';
import analytics from '@react-native-firebase/analytics';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
import { StackActions } from '@react-navigation/native';
import HoroscopeView from '../../controls/HoroscopeView';
import MainStyles from '../../Styles';
import * as env from '../../../env';
import * as Auth from '../../Auth';
import * as Api from '../../Api';
import {Singular} from 'singular-react-native';

export default class ExpertProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount = async() => {
    analytics().logEvent("Astrologer_Profile_Page");
    const profile = await Auth.getProfie().then(profile=> JSON.parse(profile)).catch(()=> console.error("err expertProfile getProfile"));
    this.setState({Profile:profile})

    console.log("GetExpertProfileService req");
    Api.GetExpertProfileService().then(resp => {
        console.log("GetExpertProfileService resp", resp);
        if (resp.ResponseCode == 200) {
            this.setState({ ExpertProfile: resp.data });
        }
    });

  };
  

  _logout = async()=>{
    await Api.LogoutService();
    await Auth.Logout();
    try{
      this.props.navigation.dispatch(StackActions.popToTop());
      this.props.navigation.replace("LoginScreen"); 
    }
    catch{
      this.props.navigation.replace("LoginScreen"); 
    }
    //this.props.navigation.dispatch(StackActions.popToTop());
    //this.props.navigation.navigate("LoginScreen");
    
  }

  render() {
    return (
      <ScrollView>
        <View style={{padding:20, backgroundColor:"#fff"}}>
          {
            this.state.ExpertProfile && 
            <View style={{backgroundColor:"#F5F5F5", marginTop:20, marginBottom:20, alignItems:"center", borderRadius:10}}>
              <Image style={{width:80, height:80, borderRadius:50, top:-40}} resizeMode="cover" source={{uri:`${env.DynamicAssetsBaseURL}${this.state.Profile.ProfileImage}`}}/>
              <Text style={[MainStyles.text, {fontSize:20, fontWeight:"700", color:"#090320", marginBottom:20}]}>{this.state.Profile.Name}</Text>
              {/* <Text style={[MainStyles.text, {fontSize:14, color:"#9591A7", marginBottom:20}]}>Astro ID: {this.state.Profile.UserRegistrationNo}</Text> */}

              <Text  style={Styles.prifileDetailText}>Name: <Text>{this.state.ExpertProfile.Name}</Text></Text>
              <Text  style={Styles.prifileDetailText}>Email: <Text>{this.state.ExpertProfile.Emaile}</Text></Text>
              <Text  style={Styles.prifileDetailText}>Mobile No: <Text>{this.state.ExpertProfile.MobileNo}</Text></Text>
              <Text  style={Styles.prifileDetailText}>Year of Experience: <Text>{this.state.ExpertProfile.TotalExperience} Years</Text></Text>

              {/* <TouchableOpacity onPress={()=>this.props.navigation.navigate("SigninUpdateInfoScreen")}>
                  <LinearGradient colors={["#FF8767", "#FF65A0"]} style={{borderRadius:30, width:220, marginBottom:20}}>
                      <Text style={[MainStyles.text,{color:"#fff", padding:15, fontSize:16, textAlign:"center"}]}>Edit profile</Text>
                  </LinearGradient>
              </TouchableOpacity> */}
              <View style={{marginBottom:20}}></View>
            </View>
            ||
            <ActivityIndicator color="#0000ff"/>
          }
 
            
          <View style={{backgroundColor:"#F5F5F5", marginBottom:30, borderRadius:10}}>
            {/* <TouchableOpacity onPress={()=> this.props.navigation.navigate("LearnAstrologyScreen")}>
              <View style={[Styles.menuItem]}>
                <Text style={Styles.menuItemText}>Learn Astrology</Text>
              </View>
            </TouchableOpacity> */}
            {/* {
              ["Chat / history", "Call logs", "Purchase history", "Recharge history"].map((item, index)=>(
              <TouchableOpacity key={index}>
              <View style={[Styles.menuItem]}>
                <Text style={Styles.menuItemText}>{item}</Text>
              </View>
              </TouchableOpacity>
              ))
            } */}

            <TouchableOpacity onPress={()=> this.props.navigation.navigate("ExpertContactUsScreen")}>
              <View style={[Styles.menuItem]}>
                <Text style={Styles.menuItemText}>Contact Us</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=> Linking.openURL('https://myastrotest.app/astrologer-terms-conditions')}>
              <View style={[Styles.menuItem,{borderBottomWidth:0}]}>
                <Text style={Styles.menuItemText}>Terms & Conditions</Text>
              </View>
            </TouchableOpacity>
          </View>


{
  this.state.ExpertProfile &&

          <View style={{marginTop:10, backgroundColor:"#fff"}}>
            <Text style={[MainStyles.Text, {marginTop:10, fontSize:14}]}>Astro Profile Details</Text>
            <Card>
              <View style={{padding:20}}>
                <Text style={[MainStyles.Text, {marginTop:10, fontSize:14, color:"#656565"}]}>More good pictures</Text>
                {
                  this.state.ExpertProfile.Gallery &&
                  <ScrollView horizontal={true}>
                  <View style={{flexDirection:"row"}}>
                    {
                      this.state.ExpertProfile.Gallery.map((item, index)=>(
                        <View key={index} style={{width:80, height:100, margin:10, backgroundColor:"#ccc", alignContent:"center", alignItems:"center", justifyContent:"center"}}>
                          <Image style={{width:80, height:100}} resizeMode="cover" source={{uri:`${env.DynamicAssetsBaseURL}${item}`}}/>
                        </View>
                      ))
                    }
                  </View>
                  </ScrollView> 
                }

                {
                  this.state.ExpertProfile && this.state.ExpertProfile.ExpertiesCollection &&
                
                <View style={{flexDirection:"row"}}>
                  <View style={{flex:1}}>
                  <Text style={[MainStyles.Text, {fontSize:14, marginRight:10, color:"#656565"}]}>Your Expertise</Text>
                  </View>
                  <View style={{flex:1}}>
                    {
                      this.state.ExpertProfile.ExpertiesCollection.map((item, index)=>(
                        <Text style={MainStyles.Text,[{marginBottom:10}]}>{item.Text}</Text>
                      ))
                    }
                  </View>
                </View>
                }

{
                  this.state.ExpertProfile && this.state.ExpertProfile.SkillsCollection &&
                
                <View style={{flexDirection:"row"}}>
                  <View style={{flex:1}}>
                  <Text style={[MainStyles.Text, {fontSize:14, marginRight:10, color:"#656565"}]}>Your Skills</Text>
                  </View>
                  <View style={{flex:1}}>
                    {
                      this.state.ExpertProfile.SkillsCollection.map((item, index)=>(
                        <Text style={MainStyles.Text,[{marginBottom:10}]}>{item.Text}</Text>
                      ))
                    }
                  </View>
                </View>
                }


<Text style={[MainStyles.Text, {marginTop:10, fontSize:14, color:"#656565"}]}>About Yourself</Text>
<Text style={[MainStyles.Text, {marginTop:10, fontSize:14}]}>{this.state.ExpertProfile.BriefBio_EN}</Text>
              </View>
            </Card>


            <Text style={[MainStyles.Text, {marginTop:10, fontSize:14, color:"#656565"}]}>Payment Details</Text>
            <Card>
              <View style={{padding:20}}>
                  <View>
                    <Text style={[MainStyles.Text, {marginTop:10, fontSize:14, color:"#656565"}]}>Bank Account Number</Text>
                    {
                      this.state.ExpertProfile.BankAccountNo &&
                      <Text style={[MainStyles.Text, {marginTop:10, fontSize:14}]}>*********{this.state.ExpertProfile.BankAccountNo.slice(this.state.ExpertProfile.BankAccountNo.length-4, this.state.ExpertProfile.BankAccountNo.length)}</Text>
                      ||
                      <Text style={[MainStyles.Text, {marginTop:10, fontSize:14}]}></Text>
                    }
                  </View>
                  <View style={{marginTop:10}}>
                    <Text style={[MainStyles.Text, {marginTop:10, fontSize:14, color:"#656565"}]}>Bank name</Text>
                    <Text style={[MainStyles.Text, {marginTop:10, fontSize:14}]}>{this.state.ExpertProfile.BankAccountName}</Text>
                  </View>
                  <View style={{marginTop:10}}>
                    <Text style={[MainStyles.Text, {marginTop:10, fontSize:14, color:"#656565"}]}>IFCI code</Text>
                    <Text style={[MainStyles.Text, {marginTop:10, fontSize:14}]}>{this.state.ExpertProfile.IFSCCode}</Text>
                  </View>
                  <View style={{marginTop:10}}>
                    <Text style={[MainStyles.Text, {marginTop:10, fontSize:14, color:"#656565"}]}>Pan Card</Text>
                    <Text style={[MainStyles.Text, {marginTop:10, fontSize:14}]}>{this.state.ExpertProfile.PAN}</Text>
                  </View>
              </View>
            </Card>

          </View>
  }
          <TouchableOpacity onPress={() => this._logout()}>
            <Text style={[MainStyles.text, {alignSelf:"center", textAlign:"center", fontSize:16, color:"#090320", width:150, paddingVertical:10, borderWidth:1, borderColor:"#00f", borderRadius:20, margin:10}]}>Log Out</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}


const Styles=StyleSheet.create({
  menuItem:{height:62, width:"100%", borderBottomWidth:1, borderBottomColor:"#DCDCDC", justifyContent:"center"},
  menuItemText:{...MainStyles.text, color:"#090320", fontSize:18, paddingLeft:40},
  prifileDetailText:{...MainStyles.text, paddingLeft:20, paddingTop:10, fontSize:14, color:"#090320", alignSelf:"flex-start"}
})