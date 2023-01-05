import React, { Component } from 'react';
import { View, Text } from 'react-native';
import Navigation from './app/Navigation';
//import Navigation from './app/screens/expert/Navigation';
import {Root} from 'native-base';
import {Singular, SingularConfig} from 'singular-react-native';
import { MenuProvider } from 'react-native-popup-menu';

export default function App(){
  const config = new SingularConfig('test', 'test');
  // Optional settings
  //config.withCustomUserId("johndoe@email.com"); // Set user ID
  //config.withSingularLinks(callBackFunction); // Enable deep linking
  config.withSingularLink(singularLinksParams => {
    const deeplink = singularLinksParams.deeplink;
    const passthrough = singularLinksParams.passthrough;
    const isDeferred = singularLinksParams.isDeferred;
    // Add your code here to handle the deep link
    console.log("deeplink",deeplink);
    console.log("passthrough",passthrough);
    console.log("isDeferred",isDeferred);
});
  Singular.init(config);

  return (
    <Root>
      <MenuProvider>
        <Navigation/>
      </MenuProvider>
    </Root>
  );
}
// import React, { Component } from 'react';
// import { View, Text } from 'react-native';
// import Navigation from './app/screens/expert/Navigation';
// import {Root} from 'native-base';
// import messaging from '@react-native-firebase/messaging';

// export default class App extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//     };
//   }
//   componentDidMount = () => {
    

// // Register background handler
// messaging().onMessage(async resp => {
  
//   try{
//     console.log("firebaseBackgroundMessage",resp);
//       if(resp.data && resp.data.ActionName){
//           console.log("ActionName", resp.data.ActionName);
//           global.PushNotification=resp.data;
          
//       }
//     }
//     catch(error){
//         console.log("error++++++++++++", error)
//     }

//   });

 
//   };
  

//   render() {
//     return (
//       <Root>
//         <Navigation/>
//       </Root>
//     );
//   }
// }
