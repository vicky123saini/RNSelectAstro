import React, { Component, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Image, ScrollView, SafeAreaView, ActivityIndicator, Alert, Platform } from 'react-native';
import {Picker} from '../../controls/MyPicker';
import { TouchableOpacity } from 'react-native-gesture-handler';
import LinearGradient from 'react-native-linear-gradient';
//import { DatePicker } from 'react-native-wheel-datepicker';
import { DatePicker } from '../../controls/MyDatePicker';
import {CheckBox} from 'react-native-elements';
import moment from 'moment';
import MainStyles from '../../Styles';
import analytics from '@react-native-firebase/analytics';
import * as env from '../../../env';
import * as Api from '../../Api';
import * as Auth from '../../Auth';
import {Singular} from 'singular-react-native';

export default class FeedbackScreen extends Component {
  constructor(props) {
    super(props);
    this.state = this.props.route.params??{Step:0}
  }
  componentDidMount = () => {
    analytics().logEvent("Customer_Feedback_form_Astrologer");
    console.log("data", this.state)
  };
  

  onSubmit = (data) => {
    console.log("AstrologerFeedbackService req", data.data);
    Api.AstrologerFeedbackService(data.data).then(resp=>{
        console.log("AstrologerFeedbackService resp", resp);
        if(resp.ResponseCode==200){
            Alert.alert(
                null,
                resp.ResponseMessage,
                [{
                    text: "OK"
                }]
            );
            this.props.navigation.navigate("ExpertHomeScreen");
        }
    })
    //this.props.navigation.navigate("ExpertHomeScreen");
  }

  render() {
    return (
      <SafeAreaView style={{flex:1}}>
          {
            this.state.Step==0 &&
            <Step1View {...this.props} onSubmit={(data)=> this.props.navigation.push("ExpertFeedbackScreen", {data:{...this.state.data, ...data}, Step: 1}) }/>
            ||
            this.state.Step==1 &&
            <Step2View {...this.props} onSubmit={(data)=> this.props.navigation.push("ExpertFeedbackScreen", {data:{...this.state.data, ...data}, Step: 2}) }/>
            ||
            this.state.Step==2 &&
            <Step3View {...this.props} onSubmit={(data)=> this.onSubmit({data:{...this.state.data, ...data}, step:0})}/>

          }
      </SafeAreaView>
    );
  }
}




class Step1View extends Component {
  constructor(props) {
    super(props);
    this.state = {
        ...this.props.route.params.data,
        loading:false,
        Gender:"Male",
        showDate:false,
        showTime:false
    };
  }
 
  componentDidMount = () => {
    Api.GetAgeGroupService().then(resp=>{
        console.log("GetAgeGroupService resp", resp);
        if(resp.ResponseCode==200){
            this.setState({AgeGroupList:resp.data})
        }
    });
    Api.GetProfessionService().then(resp=>{
        console.log("GetProfessionService resp", resp);
        if(resp.ResponseCode==200){
            this.setState({ProfessionList:resp.data})
        }
    });
  };
    

  _submit = async()=>{
      this.setState({loading:true});
      var data={
        Customer_Name:this.state.Customer_Name,
        Time_Of_Call:moment(this.state.Time_Of_Call).format("DD/MM/YYYY HH:mm"),
        //Duration:,
        Gender:this.state.Gender,
        Age_Group:this.state.AgeGroupList.filter(o=>o.checked).map(o=>o.Value).toString(),
        Profession:this.state.ProfessionList.filter(o=>o.checked).map(o=>o.Value).toString(),
      }
      this.props.onSubmit(data);
      this.setState({loading:false});
  }


  render() {
    return (
    <ScrollView>
      <View style={{padding:30, backgroundColor:"#fff"}}>
        <Text style={styles.pageTitle}>1. Customer Information</Text>
            
        <Text style={styles.label}>Name</Text>
        <View style={styles.textInput}>
            <TextInput style={{width:"100%", color:"#000"}} value={this.state.Customer_Name} onChangeText={(text)=> this.setState({Customer_Name:text})} placeholder="Name"/>
        </View>

        <Text style={styles.label}>Date of Call</Text> 
        <TouchableOpacity onPress={()=> this.setState({showDate:true})}>
            <View style={styles.textInput}>
                <Text style={{height:50, textAlignVertical:"center"}}>{this.state.Time_Of_Call==null?"DD-MM-YYYY":moment(this.state.Time_Of_Call).format("DD-MM-YYYY")}</Text>
                <Image style={{width:23, height:23, marginRight:20}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/calendar.png`}}/>
            </View>
        </TouchableOpacity>
        {
    this.state.showDate &&
    
    <DatePicker
    date={new Date(this.state.Time_Of_Call)} 
    minimumDate={new Date(1921,1,1)}
    maximumDate={new Date()} 
    mode="date"
    onDateChange={(selectedDate)=> this.setState({Time_Of_Call:selectedDate, showDate:false})}
    />
    // <TouchableOpacity onPress={()=>this.setState({showDate:false})}>{/*/LanguageChoiseScreen*/}
    //     <LinearGradient colors={["#7162FC", "#B542F2"]} style={{borderRadius:30, width:150, marginBottom:15, marginTop:10, alignSelf:"center"}}>
    //         <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>OK</Text>
    //     </LinearGradient>
    // </TouchableOpacity>
    
}

        <Text style={styles.label}>Time of Call</Text>
        
        <TouchableOpacity onPress={()=> this.setState({showTime:true})}>
            <View style={styles.textInput}>
                <Text style={{height:50, textAlignVertical:"center"}}>{this.state.Time_Of_Call==null?"HH:MM":moment(this.state.Time_Of_Call).format("HH:mm")}</Text>
                <Image style={{width:23, height:23, marginRight:20}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/clock.png`}}/>
            </View>
        </TouchableOpacity>
        {
            this.state.showTime &&
            
            <DatePicker
            date={new Date(this.state.Time_Of_Call)} 
            mode="time"
            onDateChange={(selectedDate)=> this.setState({Time_Of_Call:selectedDate, showTime:false})}
            />
            // <TouchableOpacity onPress={()=>this.setState({showTime:false})}>{/*/LanguageChoiseScreen*/}
            //     <LinearGradient colors={["#7162FC", "#B542F2"]} style={{borderRadius:30, width:150, marginBottom:15, marginTop:10, alignSelf:"center"}}>
            //         <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>OK</Text>
            //     </LinearGradient>
            // </TouchableOpacity>
            
        }


        <Text style={styles.label}>Gender</Text>
        <View style={{flexDirection:"row", width:"100%", justifyContent:"space-between", marginBottom:15}}>
            <TouchableOpacity onPress={()=> this.setState({Gender:"Male"})}>
                <View style={[styles.selectButton, this.state.Gender=="Male" && styles.selectedButton]}>
                    <Image style={{width:22, height:33, marginLeft:22}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/man.png`}}/>
                    <Text style={[MainStyles.text, {marginLeft:16}]}>Male</Text>
                </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={()=> this.setState({Gender:"Female"})}>
                <View style={[styles.selectButton, this.state.Gender=="Female" && styles.selectedButton]}>
                    <Image style={{width:22, height:33, marginLeft:22}} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/woman.png`}}/>
                    <Text style={[MainStyles.text, {marginLeft:16}]}>Female</Text>
                </View>
            </TouchableOpacity>
        </View>

        <Text style={styles.label}>Age Group</Text>
        <View style={{flexDirection:"row", flexWrap:"wrap", width:"100%", justifyContent:"space-between", marginBottom:15}}>
            {
                this.state.AgeGroupList && this.state.AgeGroupList.map((item, index)=>(
                    <MyCheckBox key={index} style={{width:"50%"}} item={item} onPress={()=> this.setState(prevState=>({AgeGroupList:prevState.AgeGroupList.map(o=>{if(o.Id==item.Id) o.checked=!o.checked; return o;})})) }/>
                ))
            }
        </View>

        <Text style={styles.label}>Profession</Text>
        <View style={{marginBottom:15}}>
            {
                this.state.ProfessionList && this.state.ProfessionList.map((item, index)=>(
                    <MyCheckBox key={index} item={item} onPress={()=> this.setState(prevState=>({ProfessionList:prevState.ProfessionList.map(o=>{if(o.Id==item.Id) o.checked=!o.checked; return o;})})) }/>
                ))
            }
        </View>
       
        <View style={{width:"100%", alignContent:"center", alignItems:"center", justifyContent:"center", marginTop:10}}>
        
            <View style={{flexDirection:"row", alignContent:"space-between", alignItems:"center", justifyContent:"space-between"}}>
                <TouchableOpacity onPress={()=>!this.state.loading && this._submit()}>{/*/LanguageChoiseScreen*/}
                    <LinearGradient colors={["#FF8767", "#FF65A0"]} style={{borderRadius:30, width:150, marginBottom:15}}>
                        {
                            this.state.loading ?
                            <View style={{padding:15}}>
                                <ActivityIndicator color="#0000ff"/>
                            </View>
                            :
                            <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>NEXT</Text>
                        }
                    </LinearGradient>
                </TouchableOpacity>
            </View>

        </View>
      </View>
      </ScrollView>
    );
  }
}



class Step2View extends Component {
    constructor(props) {
      super(props);
      this.state = {
          OtherSkill:{Id:0, Value:"Other",checked:false},
          PujsOptions:[{Id:1, Value:"Yes",checked:false}, {Id:2, Value:"No",checked:false}]
      };
    }
   
    componentDidMount = () => {
        Api.GetSkillsService().then(resp => {
            console.log("GetSkillsService resp", resp);
            if (resp.ResponseCode == 200) {
                this.setState({ SkillList: resp.data.map(o=>({Id:o.Id, Value:o.Name, Image:o.ImageForApp2, checked:false})) });
            }
        });

    //   Api.GetPujaService().then(resp=>{
    //       console.log("GetPujaService resp", resp);
    //       if(resp.ResponseCode==200){
    //           this.setState({PujaServiceList:resp.data})
    //       }
    //   }); 
    Api.GetMandirPujaListService("", 1, 100).then(response=>{
        console.log("GetMandirPujaListService", response);
        if (response != null && response.ResponseCode == 200) {
          this.setState({PujaServiceList:response.data.map(o=>({Id:o.Id, Value:o.Name}))});
        }
        else if (response != null && response.ResponseCode == 401) {
          Auth.RemoveSession({ navigation: this.props.navigation })
        }
      });
    }; 
      
  
    _submit = async()=>{
      this.setState({loading:true});
      var data={
        Topic_of_Consultation:this.state.SkillList.filter(o=>o.checked).map(o=>o.Value).toString(),
        PujaIds:this.state.PujaServiceList.filter(o=>o.checked).map(o=>o.Id)
      }
      this.props.onSubmit(data);
      this.setState({loading:false});
    }
  
  
    render() {
      return (
      <ScrollView>
        <View style={{padding:30, backgroundColor:"#fff"}}>
          <Text style={styles.pageTitle}>Topic Of Consultation</Text>

          <View style={{marginBottom:15}}>
            {
            this.state.SkillList && this.state.SkillList.map((item, index)=>(
            <MyCheckBox key={index} item={item} onPress={()=> this.setState(prevState=>({SkillList:prevState.SkillList.map(o=>{if(o.Id==item.Id) o.checked=!o.checked; return o;})})) }/>
            ))
            } 
            <MyCheckBox item={this.state.OtherSkill} onPress={()=> this.setState(prevState=>({OtherSkill:{...prevState.OtherSkill, checked:!prevState.OtherSkill.checked}}))}/>
            {
            this.state.OtherSkill && this.state.OtherSkill.checked && 
            <View style={styles.textInput}>
                <TextInput style={{width:"100%", color:"#000"}} value={this.state.OtherSkillValue} onChangeText={(text)=> this.setState({OtherSkillValue:text})} placeholder="Other"/>
            </View>
            }
          </View>
  
          {/* <Text style={styles.label}>Puja</Text> */}
          <View style={{marginBottom:15}}>
              {/* <View style={{flexDirection:"row"}}>
              {
                  this.state.PujsOptions && this.state.PujsOptions.map((item, index)=>(
                      <View key={index} style={{flexDirection:"row", alignItems:"center"}}>
                          <MyCheckBox item={item} onPress={()=> this.setState(prevState=>({PujsOptions:prevState.PujsOptions.map(o=>{o.checked=o.Id==item.Id; return o;})})) }/>
                      </View> 
                  ))
              }
              </View> */}
              <Text style={styles.label}>Puja Recommended</Text>
              {
                  this.state.PujaServiceList && this.state.PujaServiceList.map((item, index)=>(
                      <View key={index} style={{flexDirection:"row", alignItems:"center"}}>
                          <MyCheckBox item={item} onPress={()=> this.setState(prevState=>({PujaServiceList:prevState.PujaServiceList.map(o=>{if(o.Id==item.Id) o.checked=!o.checked; return o;})})) }/>
                      </View> 
                  ))
              }
          </View>
         
          <View style={{width:"100%", alignContent:"center", alignItems:"center", justifyContent:"center", marginTop:10}}>
          
              <View style={{flexDirection:"row", alignContent:"space-between", alignItems:"center", justifyContent:"space-between"}}>
                  <TouchableOpacity onPress={()=>!this.state.loading && this._submit()}>{/*/LanguageChoiseScreen*/}
                      <LinearGradient colors={["#FF8767", "#FF65A0"]} style={{borderRadius:30, width:150, marginBottom:15}}>
                          {
                              this.state.loading ?
                              <View style={{padding:15}}>
                                  <ActivityIndicator color="#0000ff"/>
                              </View>
                              :
                              <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>NEXT</Text>
                          }
                      </LinearGradient>
                  </TouchableOpacity>
              </View>
  
          </View>
        </View>
        </ScrollView>
      );
    }
  }


  class Step3View extends Component {
    constructor(props) {
      super(props);
      this.state = {
          OtherSton:{Id:0, Value:"Other",checked:false},
          PujsOptions:[{Id:1, Value:"Yes",checked:false}, {Id:2, Value:"No",checked:false}]
      };
    }
   
    componentDidMount = () => {
        Api.GetGemstoneService().then(resp => {
            console.log("GetGemstoneService resp", resp);
            if (resp.ResponseCode == 200) {
                this.setState({ GemstoneList: resp.data });
            }
        });

      Api.GetSizeOfGemstoneService().then(resp=>{
          console.log("GetSizeOfGemstoneService resp", resp);
          if(resp.ResponseCode==200){
              this.setState({SizeOfGemstoneList:resp.data})
          }
      }); 

      Api.GetWhenWeCallBackService().then(resp=>{
        console.log("GetWhenWeCallBackService resp", resp);
        if(resp.ResponseCode==200){
            this.setState({WhenWeCallBackList:resp.data})
        }
    }); 
    };
      
  
    _submit = async()=>{
      this.setState({loading:true});
      var data={
        Gemstone:this.state.GemstoneList.filter(o=>o.checked).map(o=>o.Value).toString(),
        Size_of_Gemstone:this.state.Size_of_Gemstone,
        When_We_Call_Back:this.state.WhenWeCallBackList.filter(o=>o.checked).map(o=>o.Value).toString(),
      }
      this.props.onSubmit(data);
      this.setState({loading:false});
    }
  
  
    render() {
      return (
      <ScrollView>
        <View style={{padding:30, backgroundColor:"#fff"}}>
          <Text style={styles.pageTitle}>2. Gemstone</Text>
              
          <Text style={styles.label}>Gemstone Recommended</Text>

          <View style={{flexDirection:"row", flexWrap:"wrap", width:"100%", marginBottom:15}}>
              {
                this.state.GemstoneList && this.state.GemstoneList.map((item, index)=>(
                <MyCheckBox style={{width:"50%"}} item={item} onPress={()=> this.setState(prevState=>({GemstoneList:prevState.GemstoneList.map(o=>{if(o.Id==item.Id) o.checked=!o.checked; return o;})})) }/>
                ))
              } 
          </View>
          <MyCheckBox item={this.state.OtherSton} onPress={()=> this.setState(prevState=>({OtherSton:{...prevState.OtherSton, checked:!prevState.OtherSton.checked}}))}/>
            {
            this.state.OtherSton && this.state.OtherSton.checked && 
            <View style={styles.textInput}>
                <TextInput style={{width:"100%", color:"#000"}} value={this.state.OtherStonValue} onChangeText={(text)=> this.setState({OtherStonValue:text})} placeholder="Other"/>
            </View>
            }

            <Text style={styles.label}>Size Of Gemstone</Text>
            <View style={{paddingLeft:20, backgroundColor:"#F3F3F3", borderRadius:30, marginBottom:15}}>
                <Picker selectedValue={this.state.Size_of_Gemstone} onValueChange={(value)=> this.setState({Size_of_Gemstone:value})}>
                {
                    this.state.SizeOfGemstoneList && this.state.SizeOfGemstoneList.map((item, index)=>(
                    <Picker.item key={index} label={item.Value} value={item.Value}/>
                    ))
                }
                </Picker>
                {
                    Platform.OS=="android" && <Text style={{width: '100%', height: 60, position: 'absolute', bottom: 0, left: 0}}>{' '}</Text>
                }
            </View>

            <Text style={styles.label}>When has the customer been asked to call back</Text>

            <View style={{flexDirection:"row", flexWrap:"wrap", width:"100%", marginBottom:15}}>
                {
                this.state.WhenWeCallBackList && this.state.WhenWeCallBackList.map((item, index)=>(
                <MyCheckBox key={index} style={{width:"50%"}} item={item} onPress={()=> this.setState(prevState=>({WhenWeCallBackList:prevState.WhenWeCallBackList.map(o=>{if(o.Id==item.Id) o.checked=!o.checked; return o;})})) }/>
                ))
                } 
            </View>
         
          <View style={{width:"100%", alignContent:"center", alignItems:"center", justifyContent:"center", marginTop:10}}>
          
              <View style={{flexDirection:"row", alignContent:"space-between", alignItems:"center", justifyContent:"space-between"}}>
                  <TouchableOpacity onPress={()=>!this.state.loading && this._submit()}>{/*/LanguageChoiseScreen*/}
                      <LinearGradient colors={["#FF8767", "#FF65A0"]} style={{borderRadius:30, width:150, marginBottom:15}}>
                          {
                              this.state.loading ?
                              <View style={{padding:15}}>
                                  <ActivityIndicator color="#0000ff"/>
                              </View> 
                              :
                              <Text style={{color:"#fff", padding:15, fontSize:16, textAlign:"center"}}>Submit</Text>
                          }
                      </LinearGradient>
                  </TouchableOpacity>
              </View>
  
          </View>
        </View>
        </ScrollView>
      );
    }
  }

  const MyCheckBox = (props) => {
      const[item, setItem]=useState(props.item)
      return(
        <View style={[{flexDirection:"row", alignItems:"center"}, props.style]}>
        <CheckBox
            checkedIcon={<Image style={{width:20, height:20}} resizeMode="center" source={{ uri: `${env.AssetsBaseURL}/assets/images/cb2.png` }} />}
            uncheckedIcon={<Image style={{width:20, height:20}} resizeMode="center" source={{ uri: `${env.AssetsBaseURL}/assets/images/cb1.png` }} />}
            checked={item.checked}
            //onPress={()=>{setItem({...item, checked:!item.checked}); props.onPress(item)}}
            onPress={()=>props.onPress()}
        />
        <Text style={{}}>{item.Value}</Text>
        {
            item.Image && <Image style={{ width: 30, height: 30, marginLeft:10}} resizeMode="stretch" source={{ uri: `${env.DynamicAssetsBaseURL}${item.Image}` }} />
        }
        </View>
      )
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
        marginBottom:15,
        height:50
    },
    selectButton:{flexDirection:"row", width:127, height:50, backgroundColor:"#F3F3F3", padding:5, alignContent:"center", alignItems:"center", borderRadius:30},
    selectedButton:{
        borderColor:"#FF708F",
        borderWidth:2,
        backgroundColor:"#fff"
    }
});