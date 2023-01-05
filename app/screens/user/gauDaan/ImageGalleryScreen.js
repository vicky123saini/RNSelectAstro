import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, SafeAreaView, ScrollView, StyleSheet, Dimensions, Platform } from 'react-native';
import * as Api from '../../../Api';
import * as Auth from '../../../Auth';
import * as env from '../../../../env';
import Swiper from 'react-native-swiper'

export default class ImageGalleryScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount = () => {
    Api.GetImageGalleryGauSevaService().then(resp => {
        console.log("GetImageGalleryGauSevaService resp", resp);
        if (resp.ResponseCode == 200) {
            var data=resp.data.map((item, index)=>{
                Image.getSize(`${env.DynamicAssetsBaseURL}${item.Uri}`, (width, height) => {
                  item.owidth=width;
                  item.oheight=height;
            
                  if(width>height){
                    item.width=Dimensions.get("window").width;
                    item.height=(height/width) * Dimensions.get("window").width
                  }
                  else{
                    item.height=Dimensions.get("window").height;
                    item.width=(width/height) * Dimensions.get("window").height
                  }
                   
                });
                return item;
              });
            this.setState({data})
        }
    });
  };
  
  render() {
    let tindex=2;
    return (
        <SafeAreaView style={{flex:1, backgroundColor:"#fff"}}>
{
    this.state.fullView &&
  
    <View style={{flex:1}}>
            <Swiper 
                style={[styles.wrapper]} 
                showsButtons={true} 
                index={this.state.selectedImageIndex}
                nextButton = {<Text style={{color:"#000", fontSize:30, fontWeight:"bold"}}>{'>'}</Text>}
                prevButton = {<Text style={{color:"#000", fontSize:30, fontWeight:"bold"}}>{'<'}</Text>}
                >
                {
                this.state.data && this.state.data.map((item, index)=>(
                <View style={styles.slide}>
                    <View style={{width:Dimensions.get("window").width, height:Dimensions.get("window").height, alignItems:"center", justifyContent:"center"}}>
                        <Image style={{width:item.width, height:item.height }} resizeMode="stretch" source={{uri:`${env.DynamicAssetsBaseURL}${item.Uri}`}}/>
                    </View>
                </View>
                ))
                }
            </Swiper>
        </View>
  

    ||

 

                <ScrollView>
                    <View style={{flexDirection:"row", flexWrap:"wrap", alignItems:"center", justifyContent:"space-between"}}>
                    {
                        this.state.data && this.state.data.map((item, index)=>{
                        tindex++;
                        return(
                            <TouchableOpacity onPress={()=> {this.setState({selectedImageIndex:index, fullView:true})}}>
                                <View style={{width:tindex%3==0 ? Dimensions.get("window").width-10 : ((Dimensions.get("window").width-20)/2), height:160, borderRadius:10, margin: 5, }}>
                                    <Image style={{width:tindex%3==0 ? Dimensions.get("window").width-10 : ((Dimensions.get("window").width-20)/2), height:160, borderRadius:10 }} resizeMode="cover" source={{uri:`${env.DynamicAssetsBaseURL}${item.Uri}`}}/>
                                </View>
                            </TouchableOpacity> 
                        )
                        })
                    }
                    </View>
                </ScrollView>
      


           
            }
        </SafeAreaView>
      
    );
  }
}

const styles = StyleSheet.create({
    wrapper: {height:Dimensions.get("window").height},
    slide: {
      flex: 1,
      width:Dimensions.get("window").width, 
      height:Dimensions.get("window").height
    }
})