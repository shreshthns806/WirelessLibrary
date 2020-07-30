import React from 'react';
import { Text, View, Image, TouchableOpacity, StyleSheet, TextInput, KeyboardAvoidingView, Alert } from 'react-native';
import * as Permissions from 'expo-permissions';
import * as firebase from 'firebase';
import db from '../config';
import { BarCodeScanner } from 'expo-barcode-scanner';
export default class TransactionScreen extends React.Component {
    
    constructor(){
        super();
        this.state = {
            hasCameraPermission: null,
            scanned: false,
            scanBookID: '',
            scanStudentID:'',
            buttonState: 'normal',
            transactionMessage: '',
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

    handleTransaction = async ()=> {
        var transactionMessage
        db.collection("books").doc(this.state.scanBookID).get().then(
            (doc)=> {
                var book = doc.data();
                if(book.bookAvailability){
                    this.initiateBookIssue();
                    transactiaaonMessage = 'Book Issued'
                    Alert.alert(transactionMessage)
                }
                else {
                    this.inititeBookReturn();
                    transactionMessage = 'Book Returned'
                    Alert.alert(transactionMessage)
                }
            }
        )
        this.setState({ transactionMessage: transactionMessage })
    }

    initiateBookIssue = async ()=>{
        //add a transaction
        db.collection("transactions").add({
          'studentID' : this.state.scanStudentID,
          'bookID' : this.state.scanBookID,
          'data' : firebase.firestore.Timestamp.now().toDate(),
          'transactionType' : "Issue"
        })
    
        //change book status
        db.collection("books").doc(this.state.scanBookID).update({
          'bookAvailability' : false
        })

        //change number of issued books for student
        db.collection("students").doc(this.state.scanStudentID).update({
          'numberOfBooksIssued' : firebase.firestore.FieldValue.increment(1)
        })
    
        this.setState({
          scanStudentID : '',
          scanBookID: ''
        })
      }
    
      initiateBookReturn = async ()=>{
        //add a transaction
        db.collection("transactions").add({
          'studentID' : this.state.scanStudentID,
          'bookID' : this.state.scanBookId,
          'date'   : firebase.firestore.Timestamp.now().toDate(),
          'transactionType' : "Return"
        })
    
        //change book status
        db.collection("books").doc(this.state.scanBookID).update({
          'bookAvailability' : true
        })
    
        //change book status
        db.collection("students").doc(this.state.scanStudentID).update({
          'numberOfBooksIssued' : firebase.firestore.FieldValue.increment(-1)
        })
    
        this.setState({
          scanStudentID : '',
          scanBookID : ''
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
            )}
        else if(buttonState == 'normal') {
            return(
                <KeyboardAvoidingView style = {styles.container} behaviour = "padding" enabled>
                    <View>
                        <Image source = {require('../assets/booklogo.jpg')}></Image>
                        <Text style = {{textAlign:'center', fontSize:28}}>Wireless Library</Text>
                    </View>
                    <View style = {styles.inputView}>
                        <TextInput 
                            style = {styles.inputBox}
                            placeholder = 'BookID'
                            onChangeText = {
                                (text)=>{
                                    this.setState({
                                        scanBookID:text
                                    })
                                }
                            }
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
                            placeholder = 'StudentID'
                            onChangeText = {
                                (text)=>{
                                    this.setState({
                                        scanStudentID:text
                                    })
                                }
                            }
                            value = {this.state.scanStudentID}
                        ></TextInput>
                        <TouchableOpacity
                            style = {styles.scanButton1}
                            onPress = {()=>{this.getCameraPermission("StudentID")}}
                        ><Text style = {styles.buttonText}>Scan</Text></TouchableOpacity>
                    </View>
                    <TouchableOpacity style = {styles.submitButton}
                            onPress = {async ()=>{await this.handleTransaction()}}>
                        <Text style = {styles.buttonText}>Submit</Text>
                    </TouchableOpacity>
                </KeyboardAvoidingView>
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
    submitButton:{
        backgroundColor:'greenyellow',
        margin:10,
        paddingRight:5,
        paddingLeft:5,
        width:100,
        height:50,
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