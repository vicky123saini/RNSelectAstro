import React, { Component } from 'react';
import { View, Text, StyleSheet, TextInput, Image, ScrollView, ImageBackground, ActivityIndicator, RefreshControl } from 'react-native';
import analytics from '@react-native-firebase/analytics';
import { TouchableOpacity } from 'react-native-gesture-handler';
import HoroscopeView from '../../../controls/HoroscopeView';
import LinearGradient from 'react-native-linear-gradient';
import MainStyles from '../../../Styles';
import * as Api from '../../../Api';
import * as env from '../../../../env';
import moment from 'moment';
import {Singular} from 'singular-react-native';

export default class YourHoroscopeScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }

    componentDidMount = ()=>{
        analytics().logEvent("Your_Horoscope");
        this.bindData();
    }

    onRefresh = () =>{
        this.setState({refreshing:true});
        this.bindData();
      }

    bindData = () =>{
        console.log("GetEnduserProfileService req");
        Api.GetEnduserProfileService().then(resp => {
            console.log("GetEnduserProfileService resp", resp);
            if (resp.ResponseCode == 200) {
                this.setState({ MyProfile: resp.data });
            }
        });

        console.log("GetMyHoroscopeFullService req");
        Api.GetMyHoroscopeFullService().then(resp => {
            console.log("GetMyHoroscopeFullService resp", resp);
            if (resp.ResponseCode == 200) {
                this.setState({ MyHoroscope: resp.data, refreshing:false });
            }
        });
    }


    render() {
        return (
            <ScrollView style={{ backgroundColor: "#fff" }} refreshControl={<RefreshControl refreshing={this.state.refreshing} onRefresh={this.onRefresh} />}>
            
                
                {
                    this.state.MyProfile &&
                    <>
                <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
                    <Text style={styles.heading}>Your Details</Text>
                </View>
                <View style={{ backgroundColor: "#F3F3F3", flexWrap: "wrap", flexDirection: "row", padding: 20 }}>
                    <View style={{ width: "40%" }}><Text style={styles.label}>Name:</Text></View>
                    <View style={{ width: "60%" }}><Text style={styles.field}>{this.state.MyProfile.Name}</Text></View>

                    <View style={{ width: "40%" }}><Text style={styles.label}>Gender:</Text></View>
                    <View style={{ width: "60%" }}><Text style={styles.field}>{this.state.MyProfile.Gender}</Text></View>

                    <View style={{ width: "40%" }}><Text style={styles.label}>Date of Birth:</Text></View>
                    <View style={{ width: "60%" }}><Text style={styles.field}>{this.state.MyProfile.DateOfBirth}</Text></View>

                    <View style={{ width: "40%" }}><Text style={styles.label}>City of Birth:</Text></View>
                    <View style={{ width: "60%" }}><Text style={styles.field}>{this.state.MyProfile.PlaceOfBirth}</Text></View>

                    <View style={{ width: "40%" }}><Text style={styles.label}>Time of Birth:</Text></View>
                    <View style={{ width: "60%" }}><Text style={styles.field}>{this.state.MyProfile.TimeOfBirth}</Text></View>
                </View>
                </>
                ||
                <ActivityIndicator color="#0000ff"/>
                }

                <View style={{ padding: 30 }}>
                    <Text style={[MainStyles.text, { fontSize: 20, fontWeight: "700", color: "#090320", textAlign: "center" }]}>Horoscope Today</Text>
                    <Text style={[MainStyles.text, { fontSize: 18, fontWeight: "700", color: "#090320", textAlign: "center" }]}>({moment().format("DD/MM/YYYY")})</Text>
                </View>

                {
                    this.state.MyHoroscope && 
                    <HoroscopeView dataSource={this.state.MyHoroscope}/>
                    ||
                    <ActivityIndicator color="#0000ff"/>
                }

                <View style={{ marginTop: 20, marginBottom: 50, alignItems: "center" }}>
                    <TouchableOpacity onPress={() => {Singular.event("YourHoroscopeScreen_View_Other_Signs"); this.props.onChangeTabIndex(2)}}>
                        <LinearGradient colors={["#FF8767", "#FF65A0"]} style={{ borderRadius: 30, width: 220, marginBottom: 20 }}>
                            <Text style={{ color: "#fff", padding: 15, fontSize: 16, textAlign: "center" }}>View Other Signs</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    heading: {
        ...MainStyles.text,
        fontSize: 14,
        marginBottom: 20,
        color: "#090320"
    },
    label: {
        ...MainStyles.text,
        fontSize: 14,
        color: "#929292",
        marginBottom: 20,
        marginLeft: 10
    },
    field: {
        ...MainStyles.text,
        fontSize: 14,
        color: "#090320",
        marginBottom: 20,
    }
});