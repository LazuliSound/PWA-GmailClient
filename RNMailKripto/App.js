import React from 'react';
import {createStackNavigator, createAppContainer} from 'react-navigation';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { Appbar, TextInput, Button, List, TouchableRipple, Portal, Dialog, Provider } from 'react-native-paper';
import Dimensions from 'Dimensions';
const {deviceWidth, deviceHeight} = Dimensions.get('window');

class HomeScreen extends React.Component {
  
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',      
    }
  } 

  render() {
    return (
      <ScrollView style={styles.container}>
        <Appbar.Header>
          <Appbar.Content
            title="Mail Kripto"
            subtitle="Konfigurasi akun surel"
          />
        </Appbar.Header>
        <TextInput
          type="email-address"
          style={styles.textInput}
          placeholder="Email"
          onChangeText={(email) => this.setState({email})}
        />
        <TextInput
          style={styles.textInput}
          placeholder="Password"
          secureTextEntry={true}
          onChangeText={(password) => this.setState({password})}
        />
        <Button mode="contained" onPress={() => this.props.navigation.navigate('Details')}>
          To Details
        </Button>

      </ScrollView>
    );
  }
}


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

class InboxScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      textButton: "Ambil Surat Terbaru",
      mails : [],
      mailComposeVisibility: false,
      alertMailComposeVisibility: false,
      to: '',
      subject: '',
      isi: '',
    };
  }
  _showMailCompose = () => this.setState({ mailComposeVisibility: true });
  _hideMailCompose = () => this.setState({ mailComposeVisibility: false });
  _showAlertMailCompose = () => this.setState({ alertMailComposeVisibility: true });
  _hideAlertMailCompose = () => this.setState({ alertMailComposeVisibility: false });

  appendList(from,subject) {
    let tempMails = this.state.mails;
    tempMails.push(
      <TouchableRipple
        onPress={() => console.log('Pressed')}
        rippleColor="rgba(0, 0, 0, .32)"
      >
        <List.Item
          title={from}
          description={subject}
          left={props => <List.Icon {...props} icon="mail" />}
        />
      </TouchableRipple>
    )
    this.setState({
        mails: tempMails
    })
  }

  clearMails() {
    this.setState({mails : []});
  }

  fetchMails() {
    if (this.state.mails.length !== 0) {
      this.clearMails();
      this.setState({textButton : "Ambil Surat Terbaru"})
    } else {
      for (i = 1;i<6;i++) {
        this.appendList(i,'b');
      }   
      this.setState({textButton : "Kosongkan Kotak Surat"})
    }               
  }

  render() {
    return (
      <Provider>
        <ScrollView style={styles.container}>
          <Appbar.Header>
            <Appbar.Content
              title="Mail Kripto"
              subtitle="Inbox"
            />
          </Appbar.Header>
          <View style={styles.controller}>
            <TextInput
              type="email-address"
              style={styles.textInput}
              placeholder="Email"
              onChangeText={(email) => this.setState({email})}
            />
            <TextInput
              style={styles.textInput}
              placeholder="Password"
              secureTextEntry={true}
              onChangeText={(password) => this.setState({password})}
            />
            <Button mode="contained" onPress={() => {
              if (this.state.email === '' || this.state.password === '') {
                this._showAlertMailCompose();
              } else {
                this.fetchMails()
              }              
            }}
            >
              {this.state.textButton}
            </Button>
            <Button mode="contained" onPress={() => {
              if (this.state.email === '' || this.state.password === '') {
                this._showAlertMailCompose();
              } else {
                this._showMailCompose()                
              }
            }}
            >
              Buat Surat Baru
            </Button>          
          </View>
          <View>
            {this.state.mails}
          </View>        
        </ScrollView>
        <Portal>
          <Dialog
            contentContainerStyle={styles.composeMailModalContainer}
            visible={this.state.mailComposeVisibility}
            onDismiss={this._hideMailCompose}
          >
            <Dialog.Actions>
              <Button onPress={this._hideMailCompose}>Batal</Button>
              <Button onPress={this._hideMailCompose}>Kirim</Button>
            </Dialog.Actions>
            <Dialog.Content>
              <ScrollView>
                <TextInput
                  type="email-address"
                  style={styles.textInput}
                  placeholder="Email Tujuan"
                  onChangeText={(to) => this.setState({to})}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Subjek"
                  onChangeText={(subject) => this.setState({subject})}
                />
                <TextInput
                  style={styles.textInput}
                  placeholder="Isi pesan"
                  multiline={true}
                  onChangeText={(isi) => this.setState({isi})}
                />
              </ScrollView>
            </Dialog.Content>
          </Dialog>         
        </Portal>
        <Portal>
          <Dialog
            contentContainerStyle={styles.composeMailModalContainer}
            visible={this.state.alertMailComposeVisibility}
            onDismiss={this._hideAlertMailCompose}
          >
            <Dialog.Title>Alert</Dialog.Title>
            <Dialog.Content>
              <Text>Tolong isi email dan password terlebih dahulu</Text>
            </Dialog.Content>
            <Dialog.Actions>
              <Button onPress={this._hideAlertMailCompose}>Done</Button>
            </Dialog.Actions>
          </Dialog>         
        </Portal>
      </Provider>
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
    Home: HomeScreen,
    Details: DetailsScreen
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    height: deviceHeight,
  },
  controller: {
    flex:1,
    flexDirection: 'column'
  },
  composeMailModalContainer: {
    backgroundColor: '#fff',
    paddingTop:30,
    paddingBottom:30
  }
});