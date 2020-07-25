import React from 'react';
import { StyleSheet, Text, View, Image } from 'react-native';
import TransactionScreen from './screens/BookTransaction';
import SearchScreen from './screens/SearchScreen';
import { createAppContainer } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';

export default class App extends React.Component{
  render(){
    return (
      <AppContainer />
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const tabNavigator = createBottomTabNavigator({
  Transaction:{screen:TransactionScreen},
  Search:{screen:SearchScreen},
},
{
  defaultNavigationOptions: ({navigation})=> {
    return(
      {tabBarIcon: ()=> {
          const routeName = navigation.state.routeName
          console.log(routeName)
          if(routeName=='Transaction'){
            return(
              <Image source = {require('./assets/book.png')} style = {{width:32, height:32}}></Image>
            ) 
          }
          else if(routeName=="Search"){
            return(
              <Image source = {require('./assets/searchingbook.png')} style = {{width:32,height:32}}></Image>
            )
          }
        }
      }
    )
  }
})

const AppContainer = createAppContainer(tabNavigator)