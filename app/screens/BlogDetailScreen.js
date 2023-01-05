import React, { Component } from 'react';
import { View, Text, Image, ActivityIndicator, ScrollView, Dimensions } from 'react-native';
import MainStyles from '../Styles';
import * as Api from '../Api';
import * as Auth from '../Auth';
import * as env from '../../env';
import {Blogs_Type} from '../MyExtension';
import {Singular} from 'singular-react-native';

export default class BlogDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount = () => {
    console.log("GetBlogByIdService req");
    const{Id}=this.props.route.params;

    Api.GetBlogByIdService(Id).then(resp => {
      console.log("GetBlogByIdService resp", resp);
      if (resp.ResponseCode == 200) {
        if(resp.data.Blogs_Type==Blogs_Type.Video){
          this.props.navigation.replace("VSYoutubeVideoPlayer", {Url:resp.data.Description})
        }
        else{
          this.props.navigation.setOptions({title:resp.data.Title})
          this.setState({ Blog: resp.data });
        }
      }
    });
  };

  render() {
    return (
      this.state.Blog &&
      <View style={{flex:1, backgroundColor:"#fff"}}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Image style={this.state.Blog.Blogs_Type==Blogs_Type.Creative?{width:Dimensions.get("window").width, height:Dimensions.get("window").width}: {width:"100%", height:187}} resizeMode="stretch" source={{ uri: `${env.DynamicAssetsBaseURL}${this.state.Blog.ThumbImagePath}` }} />
          <View style={{padding:30}}>
              <Text style={[MainStyles.text,{fontSize:14, color:"#090320"}]}>{this.state.Blog.Description}</Text>
          </View>
        </ScrollView>
      </View>
      ||
      <View style={{flex:1, justifyContent:"center"}}>
          <ActivityIndicator color="#0000ff"/>
      </View>
    );
  }
}
