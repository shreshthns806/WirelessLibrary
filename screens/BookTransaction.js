import React from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import * as Permissions from 'expo-permissions';
import { BarCodeScanner } from 'expo-barcode-scanner';
export default class TransactionScreen extends React.Component {
    
    constructor(){
        super();
        this.state = {
            hasCameraPermission: null,
            scanned: false,
            scanBookID: '',
            scanStudentID:'',
            buttonState: 'normal'
        }
    }
    
    getCameraPermission = async (ID) => {
        const {status} = await Permissions.askAsync(Permissions.CAMERA);
        this.setState({
            hasCameraPermission: status == 'granted',
            buttonState:ID,
            scanned:false,
        })
    }

    handleBarcodeScanned = async ({type,data}) => {
        const buttonState = this.state.buttonState
        if(buttonState == 'BookID'){
            this.setState({
                scanned:true,
                scanBookID:data,
                buttonState:'normal',
            })
        }
        else if(buttonState == 'BookID'){
            this.setState({
                scanned:true,
                scanStudentID:data,
                buttonState:'normal',
            })
        }
        
    }

    render(){
        const hasCameraPermission = this.state.hasCameraPermission;
        const scanned = this.state.scanned;
        const buttonState = this.state.buttonState;
        if (buttonState != 'normal' && hasCameraPermission){
            return(
                <BarCodeScanner style = {StyleSheet.absoluteFillObject}
                    onBarCodeScanned = {scanned?undefined:this.handleBarcodeScanned}
                ></BarCodeScanner>
            )
        }
        else if(buttonState == 'normal') {
            return(
                <View style = {styles.container}>
                    <View>
                        <Image source = {require('../assets/booklogo.jpg')}></Image>
                        <Text style = {{textAlign:'center', fontSize:28}}>Wireless Library</Text>
                    </View>
                    <View style = {styles.inputView}>
                        <TextInput 
                            style = {styles.inputBox}
                            placeHolder = 'BookID'
                            value = {this.state.scanBookID}
                        ></TextInput>
                        <TouchableOpacity
                            style = {styles.scanButton1}
                            onPress = {()=>{this.getCameraPermission("BookID")}}
                        ><Text style = {styles.buttonText}>Scan</Text></TouchableOpacity>
                    </View>
                    <View style = {styles.inputView}>
                        <TextInput 
                            style = {styles.inputBox}
                            placeHolder = 'StudentID'
                            value = {this.state.scanStudentID}
                        ></TextInput>
                        <TouchableOpacity
                            style = {styles.scanButton1}
                            onPress = {()=>{this.getCameraPermission("StudentID")}}
                        ><Text style = {styles.buttonText}>Scan</Text></TouchableOpacity>
                    </View>
                    <Text style = {styles.displayText}>
                        {
                            hasCameraPermission == true ? this.state.scanData:'Request Camera Permission'
                        }
                    </Text>
                    <TouchableOpacity style = {styles.scanButton} onPress = {this.getCameraPermission}>
                        <Text style = {styles.buttonText}>Scan QR Code</Text>
                    </TouchableOpacity>
                </View>
            )
        }
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        justifyContent:'center',
        alignItems:'center',
    },
    displayText: {
        fontSize:15,
        textDecorationLine:'underline',
    },
    scanButton:{
        backgroundColor:'greenyellow',
        margin:10,
        paddingRight:5,
        paddingLeft:5
    },
    scanButton1:{
        backgroundColor:'greenyellow',
        paddingRight:5,
        paddingLeft:5,
        marginLeft:10
    },
    buttonText:{
        fontSize:20,
        textAlign:'center',
        marginTop:10,
    },
    inputBox:{
        width:200,
        height:40,
        borderWidth:1.5,
        fontSize:20,
    },
    inputView: {
        flexDirection:'row',
        margin:20,
    },
})