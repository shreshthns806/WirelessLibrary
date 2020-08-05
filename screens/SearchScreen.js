import React from 'react';
import { Text, View, FlatList,StyleSheet} from 'react-native';
import db from '../config';

export default class SearchScreen extends React.Component {

    constructor() {
        super();
        this.state = {
            allTransactions : [],
            lastVisibleTransaction: null,
            search:'',
        }
    }

    componentDidMount = async ()=> {
        const query = await db.collection("transactions").get()
      query.docs.map(
            (item)=> {
                this.setState({
                    allTransactions:[...this.state.allTransactions,item.data()]
                })
            }
        )
    }
    
    fetchMoreTransactions = async ()=> {

    }

    render(){
        return(
            <View style = {styles.container}>
                <FlatList
                    data = {this.state.allTransactions}
                    renderItem = {
                        ({item})=> {
                            console.log(item.bookID, item.studentID, item.transactionType, item.data.toDate());
                            return(<View style = {{borderBottomWidth:2}}>
                                <Text>{'bookID: '+item.bookID}</Text>
                                <Text>{'studentID: '+item.studentID}</Text>
                                <Text>{'transactionType: '+item.transactionType}</Text>
                                <Text>{'date: '+item.data.toDate()}</Text>
                            </View>)
                        }
                    }
                      keyExtractor= {(item, index)=> index.toString()}
                      onEndReached ={this.fetchMoreTransactions}
                      onEndReachedThreshold={0.7}
                ></FlatList>
            </View>
        )
    }
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      marginTop: 20
    },
    searchBar:{
      flexDirection:'row',
      height:40,
      width:'auto',
      borderWidth:0.5,
      alignItems:'center',
      backgroundColor:'grey',
  
    },
    bar:{
      borderWidth:2,
      height:30,
      width:300,
      paddingLeft:10,
    },
    searchButton:{
      borderWidth:1,
      height:30,
      width:50,
      alignItems:'center',
      justifyContent:'center',
      backgroundColor:'green'
    }
  })
