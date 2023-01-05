import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator, RefreshControl } from 'react-native';
import analytics from '@react-native-firebase/analytics';
import LinearGradient from 'react-native-linear-gradient';
import MainStyles from '../Styles';
import * as Api from '../Api';
import * as Auth from '../Auth';
import * as env from '../../env';
import {Blogs_Type} from '../MyExtension';
import {Singular} from 'singular-react-native';

export default class BlogListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      SelectCategory:0,
      refreshing:false 
    };
  }

  componentDidMount = () => {
    analytics().logEvent("Blog");
    this.bindData();
  };

  onRefresh = () =>{
    this.setState({refreshing:true});
    this.bindData();
  }

  bindData = () =>{
    console.log("GetBlogsCategorysService req");
    Api.GetBlogsCategorysService().then(resp => {
      console.log("GetBlogsCategorysService resp", resp);
      if (resp.ResponseCode == 200) {
        console.log("resp.data[0]", resp.data[0])
        var SelectCategory=resp.data[0];
        this.setState({ BlogCategoryList: resp.data, SelectCategory:SelectCategory, refreshing:false });
        this.getBlogByCategory(SelectCategory.Key);

      }
    });
  }

  getBlogByCategory = (Id) => {
    this.setState({ BlogList: null});
    console.log("GetBlogsByCategoryService req");
    Api.GetBlogsByCategoryService(Id).then(resp => {
      //console.log("GetBlogsByCategoryService resp", resp);
      if (resp.ResponseCode == 200) {
        this.setState({ BlogList: resp.data});
      }
    });
  };
  
  _changeCategory = (item) =>{
    Singular.eventWithArgs("BlogListScreen_changeCategory",{name:item.Key});
    this.setState({SelectCategory:item});
    this.getBlogByCategory(item.Key);
  }
  

  render() {
    return (
      <View style={{flex:1}}>
        {
          this.state.BlogCategoryList &&
         
        <View style={{flexDirection:"row", padding:10}}>
          {
            this.state.BlogCategoryList.map((item, index)=>{
              return(
                <TouchableOpacity onPress={()=> this._changeCategory(item)}>
                  <LinearGradient colors={this.state.SelectCategory==item ? ["#7162FC", "#B542F2"]:["#fff", "#fff"]} style={[{ borderRadius: 30, marginLeft: 10 }]}>
                    <Text style={[MainStyles.text, {borderRadius:10, paddingHorizontal:20, paddingVertical:3 }, this.state.SelectCategory==item ? { color:"#fff" }:{color:"#000"}]}>{item.Key}</Text>
                  </LinearGradient>
                </TouchableOpacity>
              )
            })
          }
           
        </View>
  }
{
  this.state.BlogList &&  
  <ScrollView refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}>
            <View style={{backgroundColor:"#fff", padding:10}}>
            
              <View style={{alignItems:"center"}}>
              {
                this.state.BlogList.map((item, index)=>{
                  return(
                    <TouchableOpacity key={index} onPress={()=> this.props.navigation.navigate("BlogDetailScreen", {Id:item.Id})}>
                      <View style={{marginVertical:10, alignItems:"center"}}>
                        <Text style={[MainStyles.Text,{marginVertical:10}]}>{item.Title}</Text>
                        <Image style={item.Blogs_Type==Blogs_Type.Creative ? {width:340, height:340} : {width:340, height:193}} resizeMode="stretch" source={{ uri: `${env.DynamicAssetsBaseURL}${item.ThumbImagePath}` }} />
                      </View>
                    </TouchableOpacity>
                  )
                })
              }
              </View>
            </View> 
          </ScrollView>
          ||
          <View style={{flex:1, justifyContent:"center"}}>
            <ActivityIndicator color="#0000ff"/>
            </View>
}
      
          </View>
    );
  }
}
