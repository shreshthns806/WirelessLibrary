import React from 'react';
import { Text, View, FlatList} from 'react-native';
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
        db.collection('transactions').get().docs.map(
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
            <View style = {{flex:1, justifyContent:'center', alignItems:'center'}}>
                <FlatList
                    data = {this.state.allTransactions}
                    renderItem = {
                        ({item})=> {
                            console.log(item.bookID, item.studentID, item.transactionType, item.data);
                            <View style = {{borderBottomWidth:2}}>
                                <Text>{'bookID: '+item.bookID}</Text>
                                <Text>{'studentID: '+item.studentID}</Text>
                                <Text>{'transactionType: '+item.transactionType}</Text>
                                <Text>{'date: '+item.data.toDate()}</Text>
                            </View>
                        }
                    }
                    keyExtractor = {
                        (item,index)=> {
                            index.toString();
                        }
                    }
                    onEndReached = {this.fetchMoreTransactions}
                ></FlatList>
            </View>
        )
    }
}