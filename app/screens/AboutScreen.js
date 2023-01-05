import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import MainStyles from '../Styles';
import {Singular} from 'singular-react-native';

export default class AboutScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={{padding:20, backgroundColor:"#fff", flex:1}}>
        <Text style={styles.heading}>About Select Astro</Text>
        <Text style={[MainStyles.text,{fontSize:12, color:"#090320", marginBottom:20}]}>Providing answers to your queries from top astrologers in the country over chat, call or video !{'\n'}🔮Consultation{'\n'}💫 Spiritual{'\n'}♀️♂️Relationships</Text>
        <Text style={[MainStyles.text,{fontSize:12, color:"#090320", marginBottom:20}]}>Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore.</Text>
      </View>
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