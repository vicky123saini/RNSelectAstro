import {StyleSheet, Dimensions} from 'react-native';


const deviceHeight = Dimensions.get('window').height;
const deviceWidth = Dimensions.get('window').width;

export default StyleSheet.create({
    BodyOne:{ 
        minHeight:deviceHeight,
        minWidth:deviceWidth,
        flex:1,
        backgroundColor:'#fff',
       
    },
    Back_Image:{
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1
      
    },
    Back_Image_One:{
        width: Dimensions.get('window').width,
        //height: Dimensions.get('window').height,
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
       zIndex: -1
      
    },
    Status_Position:{
        height:5, 
        width:'15.5%',
        marginHorizontal:2,
        borderRadius:2,
        backgroundColor:'#5F5F5F',
        top:3
},
Direction_Row_Between_Center:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center'
},
Direction_Row_Between:{
    flexDirection:'row',
    justifyContent:'space-between'
},
Direction_Row:{
    flexDirection:'row',
   
},
Direction_Row_Center:{
    flexDirection:'row',
    alignItems:'center'
   
},
Direction_Row_around:{
    flexDirection:'row',
    justifyContent:'space-around'
   
},
Direction_Row_around_Center:{
    flexDirection:'row',
    justifyContent:'space-around',
   alignItems:'center'
},

Text20_Bold_White:{
    fontSize:20,
    color:'#fff',
    fontFamily:'Roboto-Bold'
},
Text20_Bold:{
    fontSize:20,
    fontFamily:'Roboto-Bold'
},
Text20:{
    fontSize:20,
    //fontFamily:'Roboto-Bold'
},
Text20_Regular_wHITE:{
    fontSize:20,
    color:'#fff',
    fontFamily:'Roboto-Regular'
},
Text25_Bold_White:{
    fontSize:25,
    color:'#fff',
    fontFamily:'Roboto-Regular'
},
Text12_Bold_White:{
    fontSize:12,
    fontFamily:'Roboto-Bold',
    color:'#fff'
},
Text12_Bold:{
    fontSize:12,
    fontFamily:'Roboto-Bold',
   
},
Text12_Bold_White_Center:{
    fontSize:12,
    fontFamily:'Roboto-Bold',
    color:'#fff',
    alignSelf:'center'
},
Text14_Regular:{
    fontSize:14,
    fontFamily:'Roboto-Regular',
   
},
Text14_Regular_White:{
    fontSize:14,
    fontFamily:'Roboto-Regular',
    color:'#fff',
},
Text16_Regular:{
    fontSize:16,
    fontFamily:'Roboto-Regular',
   
},
Text16_Bold_White_Center:{
    fontSize:16,
    fontFamily:'Roboto-Bold',
    color:'#fff',
    alignSelf:'center'
},
Text16_Bold_White:{
    fontSize:16,
    fontFamily:'Roboto-Bold',
    color:'#fff',
    
},
Text16_Regular_White:{
    fontSize:16,
    fontFamily:'Roboto-Regular',
    color:'#fff',
    
},
Text16_Bold:{
    fontSize:16,
    fontFamily:'Roboto-Bold',
    
    
},


Text_MarginHorizontal:{
marginHorizontal:10
},
Text_MarginVertical:{
    marginVertical:10
    },
Center_Items:{
    justifyContent:'center',
    alignItems:'center'
},
Cricle:{

    height:55,
    width:55,
    borderWidth:2,
    borderColor:'#fff',
    borderRadius:55,
    justifyContent:'center',
    alignItems:'center'
},
Cricle_120:{

    height:120,
    width:120,
    borderRadius:120,
    borderWidth:2,
    borderColor:'#fff',
    justifyContent:'center',
    alignItems:'center'
},
Cricle_25:{

    height:25,
    width:25,
    borderWidth:2,
    borderColor:'#fff',
    borderRadius:25,
    justifyContent:'center',
    alignItems:'center'
},
Cricle_120:{

    height:120,
    width:120,
    borderWidth:2,
    borderColor:'#fff',
    borderRadius:120,
    justifyContent:'center',
    alignItems:'center'
},
Cricle_40:{

    height:40,
    width:40,
    borderWidth:2,
    borderColor:'#fff',
    borderRadius:40,
    justifyContent:'center',
    alignItems:'center'
},
Image_55:{
    height:55,width:55
},
Image_20:
{
    height:20,
    width:20
},
Image_16:{
    height:16,
    width:16
},
Image_25:{
    height:25,
    width:25
},
Image_120:{
    height:120,
    width:120
},
Image_40:{
    height:40,
    width:40,
    borderRadius:40
},
Image_46:{
    height:46,
    width:46,
  
},
Image_25_30:{
    height:22,
    width:25
},
Image_60_293:{
    height:60,
    width:293
},
Image_60_110:{
    height:60,width:110
},
Image_24_66:{
    height:24,width:66
},

Buton_Small:{
    height:20,
    width:50,
    borderRadius:4,
    backgroundColor:'#E62375',
    justifyContent:'center',
    alignItems:'center'
},
Buton_Small_Border:{
    height:20,
    width:50,
    borderRadius:4,
    borderWidth:2,
    borderColor:'#E62375',
    // backgroundColor:'#E62375',
    justifyContent:'center',
    alignItems:'center'
},
Buton_Small_One:{
    height:30,
    width:80,
    borderRadius:15,
    borderWidth:2,
    //borderColor:'#E62375',
    backgroundColor:'#fff',
    justifyContent:'center',
    alignItems:'center'
},
Button_Center:{
    height:60,
    width:180,
    borderRadius:15,
    backgroundColor:'#E62375',
    justifyContent:'center',
    alignSelf:'center'
},
Call_Position:{
    position:'absolute',
    right:0,
    top:100
},
Call_Position_One:{
    position:'absolute',
    right:0,
    top:150
},
Video_Call_Position:{
    position:'absolute',
    right:8,
    bottom:10
},
Video_Call_Position_One:{
    position:'absolute',
    right:0,
    bottom:10
},
Search_View:{
    height:45,width:180,backgroundColor:'#fff',borderRadius:40
},
Search_Tab:{
    height:40,width:'90%',alignSelf:'center',borderRadius:8,justifyContent:'center',paddingHorizontal:15,backgroundColor:'#fff'
},
centeredView_One: {
    flex: 1,
    justifyContent: "flex-end",
    //alignItems: "flex-end",
    //marginTop: 50,
    backgroundColor: 'rgba(52, 52, 52, 0.8)'
  }, 
   modalView_One: {
    height: 600,
    width: '100%',
    backgroundColor: "#ffff",
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    padding: 20,
    //alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    //marginTop: 50,
    backgroundColor: 'rgba(52, 52, 52, 0.8)'
  },
  modalView: {
    height: 400,
    width: '100%',
    backgroundColor: "#ffff",
    // borderTopLeftRadius: 15,
    // borderTopRightRadius: 15,
    borderRadius:15,
    padding: 15,
    //alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5
  },
  Position_Right_Top:{
    position:'absolute',
    right:0,
    top:0
  },
Button_View:{
    height:50,width:161,borderRadius:10,justifyContent:'center',alignItems:'center',flexDirection:'row'
},
TextArea: {
    height: 120,
    width:'90%',
    alignSelf:'center',
    justifyContent: "flex-start",
    borderRadius: 15,
    backgroundColor:'#fff'
  
  },
  Call_View:{
    height:60,width:'100%',backgroundColor:'#fff',position:'absolute',bottom:0
  },
  Medal_View:{
    position: 'absolute', bottom: -10, alignSelf: 'center' 
  }




})