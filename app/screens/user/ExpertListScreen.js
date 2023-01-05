import React, { Component } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, Image, TextInput, RefreshControl, ScrollView, SafeAreaView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { ExpertStickerView } from '../../controls/ExpertControls';
import MainStyles from '../../Styles';
import analytics from '@react-native-firebase/analytics';
import * as Api from '../../Api';
import * as env from '../../../env';
import { CheckBox } from 'native-base';
import {Singular} from 'singular-react-native';
import * as UserControls from './Controls';

export default class ExpertListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      PageNo: 1,
      SelectedFilter:this.props.route.params && this.props.route.params.SelectedFilter ? this.props.route.params.SelectedFilter : null
    };
  }

  componentDidMount = () => {
    analytics().logEvent("Astrologer_List");
    const { q, Skills } = this.props.route.params ?? {};
    this.setState({ Skills, q }, () => this.bindData(1));
    
    console.log("GetBannersService req");
    Api.GetBannersService("EXPLIST1").then(resp => {
      console.log("GetBannersService resp", resp);
      if (resp.ResponseCode == 200) {
        this.setState({ BannerList: resp.data });
      }
    });

    // console.log("GetSkillsService req");
    // Api.GetSkillsService().then(resp => {
    //   console.log("GetSkillsService resp", resp);
    //   if (resp.ResponseCode == 200) {
    //     this.setState({ SkillList: resp.data });
    //   }
    // });

    console.log("GetSearchFiltersService req");
    Api.GetSearchFiltersService().then(resp => {
      console.log("GetSearchFiltersService resp", resp);
      if (resp.ResponseCode == 200) {
        this.setState({ FiltersList: resp.data });
      }
    });

      this._unsubscribe = this.props.navigation.addListener('focus', () => {  
    //   this.setState({AstrologerList:[]});
    //   this.bindData(1); sotp auto load as discussed with himanshu on 27/Dec/2021
      });
  };

  componentWillUnmount = () => {
    this._unsubscribe();
  };
  

  onRefresh = () => {
    console.log("onRefresh")
    this.setState({refreshing:true, AstrologerList:[]});
    this.bindData(1);
  }

  bindData = async (PageNo) => { 
    if (PageNo == 1) this.setState({ AstrologerList: [] });

    this.setState({ PageNo, Loading: true });

    var req = { PageNo: PageNo, q: this.state.q, Skills: this.state.Skills ?? [], Filter:this.state.SelectedFilter };
    console.log("SearchService req", req);
    Api.SearchService(req).then(resp => {
      this.setState({refreshing:false})
      //console.log("SearchService resp", JSON.stringify(resp));
      if (resp.ResponseCode == 200) {
        this.setState({ AstrologerList: [...this.state.AstrologerList, ...resp.data], Loading: false });

      }
    });
  }

  bindNextPage = async () => {
    var nextPage = ++this.state.PageNo;
    await this.bindData(nextPage);
  }

  _submit = async () => {
    await this.bindData(1);
  }

  _search = async () => {
    await this.bindData(1);
  }

  _skillClick = (item) => {
    Singular.event("ExpertListScreen_skillClick");
    /*
    Love
    Shaadi
    Career
    Money
    Health
    Education
    */
    if(item && item.Name)
      analytics().logEvent(item.Name);
    /****/

    if (item == null) {
      this.setState({ Skills: null }, () => this.bindData(1));
      return;
    }

    var Skills = [item.Id]
    this.setState({ Skills }, () => this.bindData(1));
  }

  _flter = (item) =>{
    Singular.event("ExpertListScreen_flter");
    this.setState({SelectedFilter:item?.Value}, () => this.bindData(1));
  }

  isCloseToBottom({ layoutMeasurement, contentOffset, contentSize }) {
    return layoutMeasurement.height + contentOffset.y >= contentSize.height - 20;
  }


  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        <UserControls.MainHeader {...this.props} style={{flex:0}}/>
      <View style={{ flex: 1 }}>
        <View style={{ width: "100%", height: 54, flexDirection: "row", alignItems: "center", alignContent: "center", justifyContent: "center", backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#0000001A" }}>
          {/* <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
            <View style={{ width: 30, height: 54, alignItems: "center", justifyContent: "center" }}>
              <Image style={{ width: 13, height: 27 }} resizeMode="stretch" source={require("../../assets/images/back.png")} />
            </View>
          </TouchableOpacity> */}
          <View style={{ width: "85%", height: 38, flexDirection: "row", alignItems: "center", alignContent: "center", justifyContent: "center", borderRadius: 20, backgroundColor: "#F3F3F3" }}>
            <TextInput style={{ paddingLeft: 20, width: "80%" , color:"#000"}} value={this.state.q} onChangeText={(text) => this.setState({ q: text })} placeholder="Search" />
            <TouchableOpacity onPress={() => this._search()}>
              <View style={{ paddingHorizontal: 10 }}>
                <Image style={{ width: 16, height: 16 }} resizeMode="stretch" source={{ uri: `${env.AssetsBaseURL}/assets/images/search.png` }} />
              </View>
            </TouchableOpacity>
          </View>
          {/* <TouchableOpacity>
                <View style={{backgroundColor:"#F3F3F3", width:63, height:54, alignItems:"center", justifyContent:"center"}}>
                    <Image style={{width:20, height:20}} resizeMode="stretch" source={require("../../assets/images/filter.png")}/>
                </View>
            </TouchableOpacity> */}
        </View>


        {
          this.state.SkillList &&
          <View style={{ height: 50 }}>
            <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
              <View style={{ flexDirection: "row", padding: 10 }}>
                {/* <TouchableOpacity onPress={()=> this._skillClick(null)}>
                  <Text style={[MainStyles.text,this.state.Skills?{backgroundColor:"#fff", color:"#000"}:{backgroundColor:"#B542F2", color:"#fff"}, {borderRadius:10, paddingHorizontal:20, paddingVertical:3, marginLeft:10}]}>All</Text>
                </TouchableOpacity> */}
                <TouchableOpacity onPress={() => this._skillClick(null)}>
                  <LinearGradient colors={this.state.Skills == null ? ["#7162FC", "#B542F2"]:["#fff", "#fff"]} style={[{ borderRadius: 30, marginLeft: 10 }]}>
                    <Text style={[MainStyles.text, { paddingHorizontal: 20, paddingVertical: 3 }, this.state.Skills == null ? { color:"#fff" }:{color:"#000"}]}>All</Text>
                  </LinearGradient>
                </TouchableOpacity>
                {
                  this.state.SkillList.map((item, index) => (
                    <TouchableOpacity key={index} onPress={() => this._skillClick(item)}>
                      <LinearGradient colors={this.state.Skills != null && this.state.Skills.find(o => o == item.Id) != null ? ["#7162FC", "#B542F2"]:["#fff", "#fff"]} style={[{ borderRadius: 30, marginLeft: 10 }]}>
                        <Text style={[MainStyles.text, { paddingHorizontal: 20, paddingVertical: 3 }, this.state.Skills != null && this.state.Skills.find(o => o == item.Id) != null ? { color:"#fff" }:{color:"#000"}]}>{item.Name}</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  ))
                }
              </View>
            </ScrollView>
          </View>
        }
        <View style={{ width: "100%", height: 2, backgroundColor: "#fff" }}></View>
        {
          this.state.FiltersList &&
          <View style={{ height: 50 }}>
            <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
              <View style={{ flexDirection: "row", padding: 10 }}>
                <Text>Filter:</Text>
                <TouchableOpacity onPress={() => this._flter(null)}>
                  <LinearGradient colors={this.state.SelectedFilter == null ? ["#FF8767", "#FF65A0"]:["#fff", "#fff"]} style={[{ borderRadius: 30, marginLeft: 10 }]}>
                    <Text style={[MainStyles.text, { paddingHorizontal: 20, paddingVertical: 3 }, this.state.SelectedFilter == null ? {color:"#fff"}:{color:"#000"}]}>All</Text>
                  </LinearGradient>
                </TouchableOpacity>
                {
                  this.state.FiltersList.map((item, index) => (
                    <TouchableOpacity key={index} onPress={() => this._flter(item)}>
                      <LinearGradient colors={this.state.SelectedFilter == item.Value ? ["#FF8767", "#FF65A0"]:["#fff", "#fff"]} style={[{ borderRadius: 30, marginLeft: 10 }]}>
                        <Text style={[MainStyles.text, { paddingHorizontal: 20, paddingVertical: 3 }, this.state.SelectedFilter == item.Value ? {color:"#fff"}:{color:"#000"}]}>{item.Key}</Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  ))
                }

              </View>
            </ScrollView>
          </View>
        }

        <ScrollView
        refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />} 
        onScroll={({ nativeEvent }) => { if (this.isCloseToBottom(nativeEvent)) { this.bindNextPage(); } }}>
          
          {
            this.state.AstrologerList &&
            <View style={{flex:1, backgroundColor: "#fff", paddingVertical: 20, width: "100%", flexWrap: "wrap", flexDirection: "row", justifyContent: "center" }}>
              {
                this.state.BannerList && this.state.BannerList.map((item, index) => (
                  <View key={index} style={{ width: "50%", padding: 5 / 2 }}>
                    <TouchableOpacity key={index} onPress={() => {this.props.navigation.navigate(item.ActionName, JSON.parse(item.ActionParams));}}>
                        <View style={{backgroundColor:"#ffe"}}>
                          <Image style={{ width: "100%", height:320 }} resizeMode="stretch" source={{ uri: `${env.DynamicAssetsBaseURL}${item.BannerUrl}` }} />
                        </View>
                      </TouchableOpacity> 
                  </View>
                ))
              }
              {
                this.state.AstrologerList.map((item, index) => (
                  <View key={index} style={{ width: "50%", padding: 5 / 2 }}>
                    <TouchableOpacity onPress={() => {Singular.event("ExpertListScreen_ExpertStickerViewClick"); this.props.navigation.navigate("ExpertDetailsScreen", { Id: item.UserId })}}>
                      <ExpertStickerView key={index} item={item} style={{ marginLeft: 0 }} />
                    </TouchableOpacity>
                  </View>
                )) 
              }
            </View>
          }

          {
            this.state.Loading && !this.state.refreshing && <ActivityIndicator style={{ marginVertical: 20 }} color="#0000ff" />
          }
        </ScrollView>
      </View>
      <UserControls.Footer style={{flex:0}} {...this.props} activeIndex={2}/>
      </SafeAreaView>
    );
  }
}
