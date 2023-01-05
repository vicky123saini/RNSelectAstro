import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { WebView } from 'react-native-webview';

export default class AudioPlayerScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    return (
      <View style={{flex:1, backgroundColor:"#fff"}}>
        <WebView
              javaScriptEnabled={true}
              scrollEnabled={false}
              allowsFullscreenVideo={true}
              source={{uri: this.props.route.params.AudioUrl}}
            />
      </View>
    );
  }
}
