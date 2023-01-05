import { Platform } from 'react-native'
 
export const BASE_URL = "https://myastrotest.in/";
//export const BASE_URL="https://uat.myastrotest.in/"

export const WEBSOCKET_BASE_URL="wss://myastrotest.in/"
//export const WEBSOCKET_BASE_URL="wss://uat.myastrotest.in/"

export const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  'DeviceId': null,
  'DeviceType': Platform.OS,
  'Lat': '0',
  'Long': '0'
}

export const API_VERSION = "v3.0.1";
export const AssetsBaseURL = "https://services.myastrotest.in/Content/App/";
export const DynamicAssetsBaseURL = "https://services.myastrotest.in"
//https://myastrotest.in/
//https://services.myastrotest.in/

export const agoraConf ={
  "//appId": "Get your own App ID at https://dashboard.agora.io/",
  "appId": "test",
  "//token": "Please refer to https://docs.agora.io/en/Agora%20Platform/token",
  "token": "test",
  "//channelId": "Your channel ID",
  "channelId": "demo",
  "//uid": "Your int user ID",
  "uid": "16",
  "//stringUid": "Your string user ID",
  "stringUid": "16"
}