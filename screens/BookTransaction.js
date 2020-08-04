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

    checkBookAvailability = async ()=> {
        const bookRef = await db.collection('books').where('bookID','==',this.state.scanBookID).get();
        var transactionType = '';
        if(bookRef.docs.length==0){
            transactionType='false';
        }
        else{
            bookRef.docs.map(
                (item)=> {
                    var book = item.data();
                    if(book.bookAvailability){
                        transactionType='issue';
                    }
                    else{
                        transactionType='return';
                    }
                }
            )
        }
        return transactionType
    }
    
    sEligibilityForBookIssue = async ()=> {
        const studentRef = await db.collection('students').where('studentID','==',this.state.scanStudentID).get();
        var isStudentEligible = '';
        if(studentRef.docs.length==0){
            isStudentEligible='false';
            Alert.alert("Sorry, your ID does not exist in our database.")
            this.setState({
                scanStudentID : '',
                scanBookID: ''
            })
        }
        else{
            studentRef.docs.map(
                (item)=> {
                    var student = item.data();
                    if(student.numberOfBooksIssued<2){
                        isStudentEligible='true';
                    }
                    else{
                        isStudentEligible='false';
                        Alert.alert("Student has already issued two books. return at least one of them before issuing another")
                        this.setState({
                            scanStudentID : '',
                            scanBookID: ''
                        })
                    }
                }
            )
        }
        return isStudentEligible
    }

    sEligibilityForBookReturn = async ()=> {
        const transactionRef = await db.collection('transaction').where('bookID','==',this.state.scanBookID).limit(1).get();
        var isStudentEligible = '';
        transactionRef.docs.map(
            (item)=> {
                var lastBookTransaction = item.data();
                if(lastBookTransaction.studentID == this.state.scanStudentID){
                    isStudentEligible='true';
                }
                else{
                    isStudentEligible='false';
                    Alert.alert("Scanned Book is not Issued by the studen or it has already been returned")
                    this.setState({
                        scanStudentID : '',
                        scanBookID: ''
                    })
                }
            }
        )
        return isStudentEligible
    }

    handleTransaction = async ()=> {
        var transactionType = await this.checkBookAvailability();
        if(!transactionType){
            Alert.alert("Sorry! The Book does Not exist in our library database")
            this.setState({
                scanStudentID : '',
                scanBookID: ''
            })
        }
        else if (transactionType=='issue'){
            var isStudentEligible = await this.sEligibilityForBookIssue();
            if(isStudentEligible){
                this.initiateBookIssue();
                Alert.alert('Book Issued to the student')
            }
        }

        else if (transactionType=='return'){
            var isStudentEligible = await this.sEligibilityForBookReturn();
            if(isStudentEligible){
                this.initiateBookReturn();
                Alert.alert('Book Returned by the student')
            }
        }
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
        console.log("book return initiated")
        db.collection("transactions").add({
          'studentID' : this.state.scanStudentID,
          'bookID' : this.state.scanBookID,
          'data'   : firebase.firestore.Timestamp.now().toDate(),
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