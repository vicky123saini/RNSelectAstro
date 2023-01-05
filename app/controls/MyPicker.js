// import React, {Component} from 'react';
import { Platform } from 'react-native';


import {Picker as NPicker} from '@react-native-community/picker';
import {Picker as NBPicker} from 'native-base';

export const Picker = Platform.OS=="ios" ? NBPicker : NPicker

// export class Picker extends Component { 
//     constructor(props) {
//         super(props);
//         this.state = {
//             //modelVisible:true
//         };
//       }
// // <TouchableOpacity onPress={()=> console.log("asdf")}>
//     //     <Text>{iProps.label}</Text> 
//     // </TouchableOpacity> 
//     static Item = (iProps) => Platform.OS=="ios" && 
//     <NBPicker.Item label={iProps.label} value={iProps.value}/>
//     ||
//     <NPicker.Item label={iProps.label} value={iProps.value}/>

//     render(){
//         const props = this.props;
//         return(
//             <View style={{minWidth:150, height:50}}>
//             {
//                 Platform.OS=="ios" &&
//                 <NBPicker selectedValue={props.selectedValue} onValueChange={props.onValueChange}>
//                     {props.children}
//                 </NBPicker>
//                 // <TouchableOpacity onPress={()=>this.setState({modelVisible:true})}>
//                 //     <TextInput editable={false} style={{paddingVertical:10, paddingHorizontal:40}} value={props.selectedValue}/>
//                 // </TouchableOpacity>
//                 ||
//                 <NPicker selectedValue={props.selectedValue} onValueChange={props.onValueChange}>
//                     {props.children}
//                 </NPicker>
//             }
//             {/* {
//                 Platform.OS=="ios" &&
//                 <Modal transparent={true} visible={this.state.modelVisible}>
//                     <View style={{margin:40, pading:20, backgroundColor:"#fff"}}>{props.children}</View>
//                 </Modal>
//             } */}
//             </View>
//         )
//     }
// }
 
