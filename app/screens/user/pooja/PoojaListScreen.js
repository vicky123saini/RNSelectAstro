import React, { Component } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, RefreshControl, SafeAreaView, Dimensions } from 'react-native';
import {Card, CardItem} from 'native-base';
import * as env from '../../../../env';
import * as PoojaControls from './Controls';
import * as Api from '../../../Api';
import * as Auth from '../../../Auth';
import * as UserControls from '../Controls';
import LinearGradient from 'react-native-linear-gradient';

export default class PoojaListScreen extends Component {
    constructor(props) {
      super(props);
      this.state = {
        PageNo:1,
        RequestPerPage:10,
        Search:"",
        data:[],
        selectedFilters:[],
        isEnd:false,
        loading:false
      }
    } 
    
    componentDidMount = () => {
      Api.GetMandirPujaFiltersService().then(response=>{
        if(response.ResponseCode == 200){
          this.setState({MandirPujaFilters:response.data});
        }
      });

      this.binddata();

      this._unsubscribe1 = this.props.navigation.addListener('focus', () => {
        this.setState({PageNo:1, data:[], isEnd:false},()=> this.binddata());
      });

      this._unsubscribe2 = this.props.navigation.addListener('blur', () => {
         
      });
    };

    onRefresh = () => {
      this.setState({PageNo:1, data:[], isEnd:false, refreshing:true},()=> this.binddata());
    }

    componentWillUnmount = () => {
      this._unsubscribe1();
      this._unsubscribe2();
    };
    
    
    onSearch = () =>{
      this.setState({PageNo:1, data:[], isEnd:false},()=> this.binddata());
    }

    nextPage = () => {
      if(this.state.isEnd) return;
      if(this.state.data.length>=10 ){
        this.setState(prevState=>({PageNo:prevState.PageNo+1}), ()=> this.binddata())
      }
    }

    binddata = () => {
      //console.log("binddata");
      if(this.state.isEnd || this.state.loading) return;

        this.setState({loading:true});
        var body={
          q:this.state.Search, 
          Filters:this.state.selectedFilters, 
          PageNo:this.state.PageNo, 
          RequestPerPage:this.state.RequestPerPage
        }
        console.log("GetMandirPujaListByFiltersService req", body);
        Api.GetMandirPujaListByFiltersService(body).then(response=>{
          console.log("GetMandirPujaListByFiltersService resp", response);

          if (response != null && response.ResponseCode == 200) {
            this.setState(prevState=>({data:[...prevState.data, ...response.data], isEnd:response.data.length<this.state.RequestPerPage, refreshing:false, loading:false}));
          }
          else if (response != null && response.ResponseCode == 401) {
            Auth.RemoveSession({ navigation: this.props.navigation })
          }
        });
        // this.setState({data:[
        //     {title:"Grah Shanti", image:"/Content/App/assets/images/pooja/userprofile1.png", mandir:"Manglapur Temple, Ujjain", rating:5, reviews:2545},
        //     {title:"Nav-grah Shanti", image:"/Content/App/assets/images/pooja/userprofile1.png", mandir:"Manglapur Temple, Ujjain", rating:5, reviews:2545},
        //     {title:"Kaal Sarp Dosh Shanti", image:"/Content/App/assets/images/pooja/userprofile1.png", mandir:"Manglapur Temple, Ujjain", rating:5, reviews:2545},
        //     {title:"Rudra Abhishek", image:"/Content/App/assets/images/pooja/userprofile1.png", mandir:"Manglapur Temple, Ujjain", rating:5, reviews:2545},
        //     {title:"Maha Mrityunjay Yagya", image:"/Content/App/assets/images/pooja/userprofile1.png", mandir:"Manglapur Temple, Ujjain", rating:5, reviews:2545},
        //     {title:"Grah Shanti", image:"/Content/App/assets/images/pooja/userprofile1.png", mandir:"Manglapur Temple, Ujjain", rating:5, reviews:2545},
        //     {title:"Nav-grah Shanti", image:"/Content/App/assets/images/pooja/userprofile1.png", mandir:"Manglapur Temple, Ujjain", rating:5, reviews:2545},
        //     {title:"Kaal Sarp Dosh Shanti", image:"/Content/App/assets/images/pooja/userprofile1.png", mandir:"Manglapur Temple, Ujjain", rating:5, reviews:2545},
        //     {title:"Rudra Abhishek", image:"/Content/App/assets/images/pooja/userprofile1.png", mandir:"Manglapur Temple, Ujjain", rating:5, reviews:2545},
        //     {title:"Maha Mrityunjay Yagya", image:"/Content/App/assets/images/pooja/userprofile1.png", mandir:"Manglapur Temple, Ujjain", rating:5, reviews:2545},
        // ]})
 
    //   Api.OODOGetClubV4Service(this.state.profile.UserId, this.state.Search, false, categoryId, this.state.PageIndex, 10).then(resp=>{
    //     console.log("OODOGetClubV4Service resp", resp);
    //     if (resp != null && resp.ResponseCode == 200) {
    //       if(resp.data.clubs.length<10)this.setState({isEnd:true});
    //       this.setState(prevState=>({data:[...prevState.data, ...resp.data.clubs]}));
    //     }
    //     else if (resp != null && resp.ResponseCode == 401) {
    //       Auth.RemoveSession({ navigation: this.props.navigation })
    //     }
    //   })
    }

    onPressFilter = (item) =>{
      // if(this.state.selectedFilters.find(o=>o==item.Id)){
      //   var newFilters=this.state.selectedFilters.filter(o=>o!=item.Id);
      //   this.setState({selectedFilters:newFilters});
      // }
      // else this.setState({selectedFilters:[...this.state.selectedFilters, item.Id]});
       
      this.setState({PageNo:1, Search:"",data:[],isEnd:false, selectedFilters:item ? [item.Id]: []}, ()=> this.binddata())
    }

    isCloseToBottom({ layoutMeasurement, contentOffset, contentSize }) {
      return layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
    }

    FiltersView = () =>{
      return(
        <View style={{padding:10}}>
          <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
            <TouchableOpacity onPress={()=> this.onPressFilter(null)}>
              <LinearGradient colors={this.state.selectedFilters.length==0 ? ["#9E4BF3", "#8357F7"]:["#fff","#fff"]} style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between", height:28, borderRadius:14, marginRight:10, paddingHorizontal:15}}>
                {/* <Image style={{width:22, height:22}} resizeMode="stretch" source={{uri:`${env.DynamicAssetsBaseURL}${item.Image}`}}/> */}
                <Text style={this.state.selectedFilters.length==0?{color:"#fff"}:{color:"#000"}}>All</Text>
              </LinearGradient>
            </TouchableOpacity>
          {
            this.state.MandirPujaFilters && this.state.MandirPujaFilters.map((item, index)=>(
              <TouchableOpacity onPress={()=> this.onPressFilter(item)}>
                <LinearGradient colors={this.state.selectedFilters.find(o=>o==item.Id) ? ["#9E4BF3", "#8357F7"]:["#fff","#fff"]} style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between", height:28, borderRadius:14, marginRight:10, paddingHorizontal:15}}>
                  <Image style={{width:22, height:22}} resizeMode="stretch" source={{uri:`${env.DynamicAssetsBaseURL}${item.Image}`}}/>
                  <Text style={[{marginLeft:10},this.state.selectedFilters.find(o=>o==item.Id)?{color:"#fff"}:{color:"#000"}]}>{item.Name}</Text>
                </LinearGradient>
              </TouchableOpacity>
              ))
          }
          </ScrollView>
        </View>
      )
    }

    render() {
      const{categoryId}=this.props??{}; 
      return ( 
        <SafeAreaView style={{flex:1}}>
          <UserControls.MainHeader {...this.props} style={{flex:0}}/>
          
          {
            (categoryId==null || categoryId=="") &&
            <View style={{flex:0, height:50, flexDirection:"row", alignItems:"center", margin:10, paddingHorizontal:10, backgroundColor:"#E5E5E5", borderRadius:20}}>
                <TextInput style={{flex:1, height:50}} value={this.state.Search} onChangeText={(value)=> this.setState({Search:value})} placeholderTextColor="#4e656e" placeholder="Search for puja here"></TextInput>
                <TouchableOpacity onPress={()=>this.onSearch()}>
                  <Image style={{flex:0, width:15, height:15 }} resizeMode="stretch" source={{uri:`${env.AssetsBaseURL}/assets/images/search.png`}}/>
                </TouchableOpacity>
            </View>
          }
          
          <this.FiltersView/>
          <View style={{flex:1, paddingHorizontal:10}}>
          <ScrollView
        refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />} 
        onScroll={({ nativeEvent }) => { if (this.isCloseToBottom(nativeEvent)) { this.nextPage(); } }}>
          <ScrollView style={{paddingVertical:10}} horizontal={true} showsHorizontalScrollIndicator={false}> 
            <PoojaControls.RecomdationPoojaCard {...this.props}/>
            <PoojaControls.RecomdationGemstonCard {...this.props}/>
            </ScrollView>
          {
            this.state.data && this.state.data.map((item, index)=>(
              <TouchableOpacity key={index} onPress={()=> this.props.navigation.navigate("UserPoojaDetailsScreen", {Id:item.Id})}>
                {/* <PoojaControls.PoojaCard {...this.props} item={item}/> */} 
                <Image style={{width:Dimensions.get("window").width-20, height:((Dimensions.get("window").width-20)*251)/900, marginBottom:10}} resizeMode="stretch" source={{uri:`${env.DynamicAssetsBaseURL}${item.ListingImage}`}}/>
              </TouchableOpacity>
            ))
          }
        </ScrollView>

            {/* <FlatList  
              data={this.state.data}
              renderItem={(data)=>
              <TouchableOpacity onPress={()=> this.props.navigation.navigate("UserPoojaDetailsScreen", {Id:data.item.Id})}>
                 
                <Image style={{width:Dimensions.get("window").width-20, height:((Dimensions.get("window").width-20)*251)/900, marginBottom:10}} resizeMode="stretch" source={{uri:`${env.DynamicAssetsBaseURL}${data.item.ListingImage}`}}/>
              </TouchableOpacity>}
              keyExtractor={item => item.id}
              onEndReached={this.nextPage}
            /> */}
          </View>
          <UserControls.Footer style={{flex:0}} {...this.props} activeIndex={3}/>
        </SafeAreaView>
   );
  }
}

