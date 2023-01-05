import React, { Component } from 'react';
import { View, Dimensions, AppState } from 'react-native';
import { WebView } from 'react-native-webview';

export default class VSYoutubeVideoPlayer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      appState: AppState.currentState
    };
  }

  async componentDidMount(){
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  async componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {        
    this.setState({appState: nextAppState});
  }

  render() {
    return (
        <View style={{width:Dimensions.get('window').width, height:Dimensions.get('window').height, alignContent:"center", alignItems:"center", justifyContent:"center"}}>
          {this.state.appState == 'active' &&
            <WebView
            javaScriptEnabled={true}
            scrollEnabled={false}
            allowsFullscreenVideo={true}
            source={{uri: `${this.props.route.params.Url}?autoplay=1&mute=0&showinfo=0&controls=1&fullscreen=1`}}
            style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height}}
            />
          }
        </View>
    );
  }
}
