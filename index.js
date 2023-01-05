// /**
//  * @format
//  */

// import {AppRegistry} from 'react-native';
// import App from './App';
// import {name as appName} from './app.json';

// AppRegistry.registerComponent(appName, () => App);

/**
 * @format
 */

 import {AppRegistry} from 'react-native';
 import App from './App';
 import {name as appName} from './app.json';
 
 
 AppRegistry.registerComponent(appName, () => App);
 
 AppRegistry.registerHeadlessTask('ReactNativeFirebaseMessagingHeadlessTask', () => firebaseBackgroundMessage);
 
 function firebaseBackgroundMessage(resp){
      
     try{
         console.log("firebaseBackgroundMessage",resp);
         if(resp.data && resp.data.ActionName){
             console.log("ActionName", resp.data.ActionName);
             global.PushNotification=resp.data;
             
         }
     }
     catch(error){
         console.log("error++++++++++++", error)
     }
     return Promise.resolve();
     //{"collapseKey": "com.UnitedFor.Her", "data": {"key1": "value1", "key2": "value2"}, "from": "813716010162", "messageId": "0:1613027711568882%68d13fe068d13fe0", "notification": {"android": {}, "body": "Test", "title": "Test"}, "sentTime": 1613027711546, "ttl": 2419200}
     //{"collapseKey": "com.UnitedFor.Her", "data": {"key1": "value1", "key2": "value2"}, "from": "813716010162", "messageId": "0:1613028040527439%68d13fe068d13fe0", "notification": {"android": {}, "body": "Test", "title": "Test"}, "sentTime": 1613028040508, "ttl": 2419200}
 }
 