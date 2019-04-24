import React from 'react';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Appbar, TextInput, Button, List, TouchableRipple, Portal, Dialog, Provider } from 'react-native-paper';

import coreStyle from './styles'
import ConfigScreen from './Screens/ConfigScreen'
import InboxScreen from './Screens/InboxScreen'
import ReadMailScreen from './Screens/ReadMailScreen'
import ComposeMailScreen from './Screens/ComposeMailScreen'


class ProfileScreen extends React.Component {
  static navigationOptions = {
    title: 'Welcome',
  };
  render() {  
    return (
      <View>
        <Text>{this.props.name}</Text>
      </View>
    );
  }
}

class DetailsScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>Details Screen</Text>
        <Button mode="contained" onPress={() => this.props.navigation.navigate('Home')}>
          Go to Home Screen
        </Button>
      </View>
    );
  }
}

const AppNavigator = createStackNavigator(
  {
    Home: ConfigScreen,
    Inbox: InboxScreen,
    ReadMail: ReadMailScreen,
    ComposeMail: ComposeMailScreen
  },
  {
    initialRouteName: "Home"
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}

const styles = coreStyle;