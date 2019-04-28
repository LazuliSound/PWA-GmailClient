import React from 'react';
import { Text, View, ScrollView } from 'react-native';
import { Appbar, TextInput, Button, List, TouchableRipple, Portal, Dialog, Provider } from 'react-native-paper';
import coreStyle from '../styles';
const styles= coreStyle;

class InboxScreen extends React.Component {
  static navigationOptions = {
    title: 'Mail Kripto - Inbox',
  };
  constructor(props) {
    super(props);
    this.state = {
      textButton: "Ambil Surat Terbaru",
      mails : [],
      mailLists : [],
    };    
  }

  appendList(id,from,subject) {
    let tempMails = this.state.mailLists;   
    tempMails.push(
      <TouchableRipple
        onPress={() => this.props.navigation.navigate('ReadMail', {
          email : this.props.navigation.getParam('email', ''),          
          password : this.props.navigation.getParam('password', ''),
          seqnum: id
        })}
        rippleColor="rgba(0, 0, 0, .32)"
      >
        <List.Item
          title={from}
          description={subject}
          left={props => <List.Icon {...props} icon="mail" />}
          key={id}
        />
      </TouchableRipple>
    )
    this.setState({
        mailLists: tempMails
    })
  }

  clearMails() {
    this.setState({mails : [], mailLists : []});
  }

  fetchMails(email, password) {
    fetch('https://nodejs-mail-rest.herokuapp.com/mails', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    }).then((response) => response.json())
    .then((responseJson) => {
      let buffer = responseJson
      let buffers = []
      for (i=0;i<buffer.length;i++){
        buffers.push(buffer[i])
      }
      if (this.state.mailLists.length !== 0) {
        this.clearMails();
        this.setState({textButton : "Ambil Surat Terbaru"})
      } else {
        console.log("portal2")
        for (i = 0;i<buffers.length;i++) {
          this.appendList(buffers[i].seqnum,buffers[i].from,buffers[i].subject);
        }   
        this.setState({textButton : "Kosongkan Kotak Surat"})
      }               
    })
    .catch((error) => {
      console.error(error);
    });
    
  }

  render() {
    const email = this.props.navigation.getParam('email', '');
    const password = this.props.navigation.getParam('password', '');

    return (
      <Provider>
        <ScrollView style={styles.container}>
          <View style={styles.controller}>
            <Button icon="inbox" mode="contained" onPress={() => {
              if (email === '' || password === '') {
                this._showAlertMailCompose();
              } else {
                this.fetchMails(email,password)
              }              
            }}
            >
              {this.state.textButton}
            </Button>      
          </View>
          <Text>
            {this.state.mails}
          </Text>
          <View>
            {this.state.mailLists}
          </View>        
        </ScrollView>        
      </Provider>
    );
  }
}

export default InboxScreen;
