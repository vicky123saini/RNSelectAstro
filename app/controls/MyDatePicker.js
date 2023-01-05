import moment from 'moment';
import React, { useState, useRef } from 'react';
import { View, Text, Modal, Dimensions, TouchableOpacity, TextInput, Platform, Alert } from 'react-native';
//import {Calendar} from 'react-native-simple-calendar-new';
import {Picker} from '../controls/MyPicker';

export const DatePicker = (props) => {
    const [date, setDate] = useState(props.date);
    const [isValidDate, setIsValidDate] = useState(false);
    const [isValidTime, setIsValidTime] = useState(false);
    const [DD, setDD]=useState(moment(date).format("DD"));
    const [MM, setMM]=useState(moment(date).format("MM"));
    const [YYYY, setYYYY]=useState(moment(date).format("YYYY"));

    const [hh, setHh]=useState(moment(date).format("HH"));
    const [mm, setMm]=useState(moment(date).format("mm"));
    //const [tt, setTt] = useState("PM");
     
    const DDs = ["",...Array.from({ length: 31 }).map((_, i) => String(i+1)), "0", "01","02","03","04","05","06","07","08","09"];
    const MMMs = ["",...Array.from({ length: 12 }).map((_, i) => String(i+1)), "0", "01","02","03","04","05","06","07","08","09"];
    const YYYYs = ["",...Array.from({ length: 2022 }).map((_, i) => String(i+1))];

    const HHs = ["",...Array.from({ length: 23 }).map((_, i) => String(i+1)),"0","00","01","02","03","04","05","06","07","08","09"];
    const MMs = ["",...Array.from({ length: 60 }).map((_, i) => String(i)),"0","00","01","02","03","04","05","06","07","08","09"]

    const refMM = useRef();
    const refYYYY = useRef();
    const refmm = useRef();

    const onPressOK = () => {
        if(props.mode==null || props.mode=="date"){
            // if(date.DD){
            //     props.onDateChange(moment(date.DD+"-"+date.MMM+"-"+date.YYYY).format("DD-MMM-YYYY"));
            // }
            // else{
            //     props.onDateChange(moment().format("DD-MMM-YYYY"));    
            // }
            if(!isValidDate){
                return;
            }

            if(DD){
                var date = moment(DD+"-"+MM+"-"+YYYY, "DD-MM-YYYY");
                var check = date.isValid();
                if(!check){
                    Alert.alert(null,"Input date is not valid.");
                    return;
                }

                if(date>moment()){
                    Alert.alert(null,"Input date is not valid.");
                    return;
                }

                props.onDateChange(date.format("DD-MMM-YYYY"));
            }
            else{
                props.onDateChange(moment().format("DD-MMM-YYYY")); 
            }

        }
        else{
            if(!isValidTime){
                return;
            }
            //console.log(moment(hh+":"+mm+" "+tt, "hh:mm A"))
            props.onDateChange(moment(hh+":"+mm, "HH:mm"));
        }
    }
    const onPerssCancel = () => {
        props.onDateChange(props.date)
        // if(props.mode==null || props.mode=="date"){
        //     if(DD && MM && YYYY)
        //         props.onDateChange(moment(DD+"-"+MM+"-"+YYYY, "DD-MM-YYYY"));
        //     else
        //         props.onDateChange(moment().format("DD-MMM-YYYY"));
        //     }
        // else{
        //     if(hh && mm)
        //         props.onDateChange(moment(hh+":"+mm, "HH:mm"));
        //     else
        //         props.onDateChange(moment());
        //     }
    }
    
  
    const onChangeDate = (type, text) => {
        switch(type){
            case "DD":{
                if(DDs.indexOf(text)!=-1){
                    setDD(text);
                    if(text && text.length==2 && text!="0" && text!="00"){
                        setMM("");
                        refMM.current.focus();
                    }
                }
                break;
            }
            case "MM":{
                if(MMMs.indexOf(text)!=-1) {
                    setMM(text);
                    if(text && text.length==2 && text!="0" && text!="00"){
                        setYYYY("")
                        refYYYY.current.focus();
                    }
                }
                break;
            }
            case "YYYY":{
                YYYYs.indexOf(text)!=-1 && setYYYY(text)
                break;
            }
        }

        switch(type){
            case "DD":{
                onValidateDate(text, MM, YYYY)
                break;
            }
            case "MM":{
                onValidateDate(DD, text, YYYY)
                break;
            }
            case "YYYY":{
                onValidateDate(DD, MM, text)
                break;
            }
        }
        
    }

    const onValidateDate = (DD, MM, YYYY) => {
        console.log("DD", DD, "MM", MM, "YYYY", YYYY);
        if(DD==null || DD=="" || DD=="0" || DD=="00"){
            setIsValidDate(false);
            console.log("DD False");
        }
        else if(MM==null || MM=="" || MM=="0" || MM=="00"){
            setIsValidDate(false);
            console.log("MM False");
        }
        else if(YYYY==null || YYYY=="" || YYYY=="0" || YYYY=="00" || YYYY=="000" || YYYY=="0000"){
            setIsValidDate(false);
            console.log("YY False");
        }
        else{
            var date = moment(DD+"-"+MM+"-"+YYYY, "DD-MM-YYYY");
            var check = date.isValid();
            setIsValidDate(check);
            console.log("DDMMYYYY False", DD+"-"+MM+"-"+YYYY);
        }
    }

    const onChangeTime = (type, text)=>{
        switch(type){
            case "HH":{
                if(HHs.indexOf(text)!=-1){setHh(text);
                    if(text && text.length==2 && text!="0" && text!="00"){
                        setMm("");
                        refmm.current.focus();
                    }
                }
                break;
            }
            case "MM":{
                if(MMs.indexOf(text)!=-1) {setMm(text);}
                break;
            }
        }

        switch(type){
            case "HH":{
                onValidateTime(text, mm)
                break;
            }
            case "MM":{
                onValidateTime(hh, text)
                break;
            }
        }
    }

    const onValidateTime = (hh, mm) => {
        if(hh==null || hh==""){
            setIsValidTime(false);
            console.log("hh False");
        }
        else if(mm==null || mm==""){
            setIsValidTime(false);
            console.log("mm False");
        }
        else{
            var date = moment(hh+":"+mm, "HH:mm");
                var check = date.isValid();
                setIsValidTime(check);
        }
        
    }

    return (
    <Modal transparent={true}>
            {
                props.mode==null || props.mode=="date" &&
                <View style={[{width:Dimensions.get("window").width-60, marginHorizontal:30, marginTop:(Dimensions.get("window").height/2)-100, borderWidth:1, borderColor:"#d5d5d5", backgroundColor:"#fff", height:170}]}>
                    <View style={{flexDirection:"row", alignItems:"center", justifyContent:"center", marginVertical:20}}>
                        <View>
                            <TextInput keyboardType='decimal-pad' style={{height:50, width:70, borderBottomWidth:1, borderColor:"#d5d5d5", color:"#000"}} value={DD} onChangeText={(text)=> onChangeDate("DD", text)}/>
                            <Text>DD</Text>
                        </View>
                        <View style={{marginHorizontal:10}}>
                            <Text>:</Text>
                            <Text/>
                        </View>
                        <View>
                            <TextInput keyboardType='decimal-pad' style={{height:50, width:70, borderBottomWidth:1, borderColor:"#d5d5d5", color:"#000"}} value={MM} ref={refMM} onChangeText={(text)=> onChangeDate("MM", text)}/>
                            <Text>MM</Text>
                        </View>
                        <View style={{marginHorizontal:10}}>
                            <Text>:</Text>
                            <Text/>
                        </View> 
                        <View>
                            <TextInput keyboardType='decimal-pad' style={{height:50, width:70, borderBottomWidth:1, borderColor:"#d5d5d5", color:"#000"}} value={YYYY} ref={refYYYY} onChangeText={(text)=> onChangeDate("YYYY", text)}/>
                            <Text>YYYY</Text>
                        </View> 
                    </View>
                    <View style={{flex:1, flexDirection:"row", borderTopWidth:1, borderColor:"#d5d5d5"}}>
                        <TouchableOpacity onPress={onPerssCancel} style={{flex:1, alignItems:"center", justifyContent:"center", borderRightWidth:1, borderRightColor:"#d5d5d5"}}><Text style={{textAlign:"center"}}>Cancel</Text></TouchableOpacity>
                        <TouchableOpacity onPress={onPressOK} style={[{flex:1, alignItems:"center", justifyContent:"center"}, !isValidDate && {backgroundColor:"#DCDCDC"}]}><Text style={{textAlign:"center"}}>OK</Text></TouchableOpacity>
                    </View>
                </View>
                ||
                <View style={[{width:Dimensions.get("window").width-60, marginHorizontal:30, marginTop:(Dimensions.get("window").height/2)-100, borderWidth:1, borderColor:"#d5d5d5", backgroundColor:"#fff", height:180}]}>
                <View style={{flexDirection:"row", alignItems:"center", justifyContent:"center", marginVertical:10}}>
                    <View style={{alignItems:"center"}}>
                        <TextInput keyboardType='decimal-pad' style={{height:50, width:70, borderBottomWidth:1, borderColor:"#d5d5d5", color:"#000", textAlign:"center"}} value={hh} onChangeText={(text)=> onChangeTime("HH", text)}/>
                        <Text>HH</Text>
                    </View>
                    <View style={{marginHorizontal:10}}>
                        <Text>:</Text>
                        <Text/>
                    </View>
                    <View style={{alignItems:"center"}}>
                        <TextInput keyboardType='decimal-pad' style={{height:50, width:70, borderBottomWidth:1, borderColor:"#d5d5d5", color:"#000", textAlign:"center"}} value={mm} ref={refmm} onChangeText={(text)=> onChangeTime("MM", text)}/>
                        <Text>MM</Text>
                    </View>
                    <View style={{marginHorizontal:10}}>
                         
                    </View>
                    <View>
                         
                    </View>
                    {/* <View>
                        <View style={{borderBottomWidth:1, borderColor:"#d5d5d5", width:100}}>
                            <Picker style={{ height: 50, width: 150 }} selectedValue={tt} onValueChange={(value)=> setTt(value)}>
                                <Picker.Item label="PM" value={"PM"} />
                                <Picker.Item label="AM" value={"AM"} />
                            </Picker> 
                            {
                                Platform.OS=="android" &&
                            <Text style={{width: '100%', height: 60, position: 'absolute', bottom: 0, left: 0}}>{' '}</Text>
                            }
                        </View>
                        <Text/>
                    </View> */}
                </View>
                <View style={{alignItems:"center", padding:10}}><Text>(In 24-Hours Format)</Text></View>
                <View style={{flex:1, flexDirection:"row", borderTopWidth:1, borderColor:"#d5d5d5"}}>
                    <TouchableOpacity onPress={onPerssCancel} style={{flex:1, alignItems:"center", justifyContent:"center", borderRightWidth:1, borderRightColor:"#d5d5d5"}}><Text style={{textAlign:"center"}}>Cancel</Text></TouchableOpacity>
                    <TouchableOpacity onPress={onPressOK} style={[{flex:1, alignItems:"center", justifyContent:"center"}, !isValidTime && {backgroundColor:"#DCDCDC"}]}><Text style={{textAlign:"center"}}>OK</Text></TouchableOpacity>
                </View>
            </View>
            }
    </Modal>
    );
  }

const DatePicker_tmp = (props) => {
    const [date, setDate] = useState(props.date);
    const [hh, setHh]=useState();
    const [mm, setMm]=useState();
    const [tt, setTt] = useState("PM");

    const HHs = ["",...Array.from({ length: 12 }).map((_, i) => String(i+1))];
    const MMs = ["",...Array.from({ length: 60 }).map((_, i) => String(i+1))]

    const onPressOK = () => {
        if(props.mode==null || props.mode=="date"){
            if(date.DD){
                props.onDateChange(moment(date.DD+"-"+date.MMM+"-"+date.YYYY).format("DD-MMM-YYYY"));
            }
            else{
                props.onDateChange(moment().format("DD-MMM-YYYY"));    
            }
        }
        else{
            console.log(moment(hh+":"+mm+" "+tt, "hh:mm A"))
            props.onDateChange(moment(hh+":"+mm+" "+tt, "hh:mm A"));
        }
    }
    const onPerssCancel = () => {
        props.onDateChange(moment().format("DD-MMM-YYYY"));
    }
  
    return (
    <Modal transparent={true}>
        <View style={[{width:Dimensions.get("window").width-60, marginHorizontal:30, marginTop:(Dimensions.get("window").height/2)-100, borderWidth:1, borderColor:"#d5d5d5", backgroundColor:"#fff"}, props.mode==null || props.mode=="date" ? {height:200}:{height:160}]}>
            {
                props.mode==null || props.mode=="date" &&
                <Calendar onChange={(date)=> setDate(date)} MinYY={1922} MaxYY={2022}/>
                ||
                <View style={{flexDirection:"row", alignItems:"center", justifyContent:"center", marginVertical:20}}>
                    <View>
                        <TextInput keyboardType='decimal-pad' style={{height:50, width:70, borderBottomWidth:1, borderColor:"#d5d5d5", color:"#000"}} value={hh} onChangeText={(text)=> HHs.indexOf(text)!=-1 && setHh(text)}/>
                        <Text>hour</Text>
                    </View>
                    <View style={{marginHorizontal:10}}>
                        <Text>:</Text>
                        <Text/>
                    </View>
                    <View>
                        <TextInput keyboardType='decimal-pad' style={{height:50, width:70, borderBottomWidth:1, borderColor:"#d5d5d5", color:"#000"}} value={mm} onChangeText={(text)=> MMs.indexOf(text)!=-1 && setMm(text)}/>
                        <Text>minutes</Text>
                    </View>
                    <View style={{marginHorizontal:10}}>
                         
                    </View>
                    <View>
                        <View style={{borderBottomWidth:1, borderColor:"#d5d5d5", width:100}}>
                            <Picker style={{ height: 50, width: 150 }} selectedValue={tt} onValueChange={(value)=> setTt(value)}>
                                <Picker.Item label="PM" value={"PM"} />
                                <Picker.Item label="AM" value={"AM"} />
                            </Picker> 
                            {
                                Platform.OS=="android" &&
                            <Text style={{width: '100%', height: 60, position: 'absolute', bottom: 0, left: 0}}>{' '}</Text>
                            }
                        </View>
                        <Text/>
                    </View>
                </View>
            }
            <View style={{flex:1, flexDirection:"row", borderTopWidth:1, borderColor:"#d5d5d5"}}>
                <TouchableOpacity onPress={onPerssCancel} style={{flex:1, alignItems:"center", justifyContent:"center", borderRightWidth:1, borderRightColor:"#d5d5d5"}}><Text style={{textAlign:"center"}}>Cancel</Text></TouchableOpacity>
                <TouchableOpacity onPress={onPressOK} style={{flex:1, alignItems:"center", justifyContent:"center"}}><Text style={{textAlign:"center"}}>OK</Text></TouchableOpacity>
            </View>
        </View>
    </Modal>
    );
  }