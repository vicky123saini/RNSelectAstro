import React, { Component } from 'react';
import { View, Text, TouchableHighlight } from 'react-native';

export default class TestScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      ActionName:"UserPoojaDetailsScreen",
      ActionParams:"{\"Id\":\"4\"}"
    };
  }

  render() {
    return (
      <View>
        <TouchableHighlight onPress={()=> this.props.navigation.navigate(this.state.ActionName, JSON.parse(this.state.ActionParams))}>
          <Text>touch me</Text>
        </TouchableHighlight>
      </View>
    );
  }
}
