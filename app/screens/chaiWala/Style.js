import {StyleSheet} from 'react-native';
const colors = {
    orange:"#F28C2C",
    darkOrange:"#f26527"
}
export default StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:colors.orange
    },
    headerContainer:{
        height:60,
        backgroundColor:colors.darkOrange,
        flexDirection:"row"
    },
    headerLeft:{
        flex:1,
        alignItems:"center",
        justifyContent:"center"
    },
    headerRight:{
        flex:0,
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"center",
        paddingHorizontal:10
    },
    headingText:{
        fontSize:30,
        fontWeight:"700",
        color:"#fff",
        margin:20
    },
    tabButton: {
        width:124, height:26, backgroundColor:"#D8D8D8",
        shadowColor: "#000",
        shadowOffset: {width: 1, height: 2},
        shadowOpacity: 0.8,
        shadowRadius: 4,
        elevation: 5,
        marginHorizontal:10,
        borderRadius:4,
        alignItems:"flex-start",
        justifyContent:"center",
        paddingHorizontal:5
      },
      slidMenuButton:{
        backgroundColor:"#F28C2C",
        paddingVertical:10,
        paddingHorizontal:20,
        marginVertical:5
      },

      tabButtonActive:{
        backgroundColor:"#F28C2C",
        borderWidth:0.5,
        borderColor:"#fff"
      },
      tabButtonText:{
        color:"#fff",
        fontSize:14, fontWeight:"700"
      },
      tableRaw:{
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop: 0,
        paddingBottom: 0,
        backgroundColor:"#EDEDED"
      }
})