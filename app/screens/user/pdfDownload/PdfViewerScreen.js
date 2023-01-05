import React, { Component } from 'react';
import { View, Text, SafeAreaView, ScrollView, Dimensions, TouchableOpacity } from 'react-native';
//import { WebView } from 'react-native-webview';
import LinearGradient from 'react-native-linear-gradient';
//import Html from 'react-native-render-html';
import PDFView from 'react-native-view-pdf';

export default class PdfViewerScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  componentDidMount = () => {
    console.log(this.props.route.params.Url)
  };
  

  render() {
    return (
      <SafeAreaView style={{flex:1}}>
          <View style={{flex:1}}>
            {/* <WebView
                
                source={{uri: this.props.route.params.Url}}
                style={{width: Dimensions.get('window').width, height: Dimensions.get('window').height}}
                /> */}
                {/* <Html
                        contentWidth={Dimensions.get("window").width}
                        source={{uri:this.props.route.params.Url}}
                    /> */}
 
        <PDFView
          fadeInDuration={250.0}
          style={{ flex: 1 }}
          resource={this.props.route.params.Url}
          resourceType="url"
        />
          </View>
          <View style={{flex:0, marginVertical:20, alignItems: 'center'}}>
            <TouchableOpacity onPress={()=> this.props.navigation.goBack()}>
              <LinearGradient colors={["#FDCB2F", "#FB7021"]} start={{ x: 0, y: .5 }} end={{ x: 1, y: .5 }} style={{borderRadius:30}}>
                <Text style={{color:"fff", padding:15, width:250, fontSize:16, textAlign:"center"}}>Back</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
      </SafeAreaView>
    );
  }
}
