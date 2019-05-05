import React from 'react';
import { Text, ScrollView } from 'react-native';
import { TextInput, Button, Portal, Dialog, Provider } from 'react-native-paper';
import coreStyle from '../styles';
const styles= coreStyle;

class ReadMailScreen extends React.Component {
  static navigationOptions = {
    title: 'Mail Kripto - Baca Email',
  };
  constructor(props) {
    super(props);
    this.state = {
      from : '',
      subject : '',
      date : '',
      text : '',
    }
  } 

  fetchMail(email, password, seqnum) {
    console.log(`Try to fetch ${email} - ${password} - ${seqnum}`);
    fetch('https://nodejs-mail-rest.herokuapp.com/mail', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
        seqnum: seqnum,
      }),
    }).then((response) => response.text())
    .then((responseData) => {
      console.log('success');
      let buffer = responseData;
      console.log(buffer);
      if (typeof buffer === 'string' && buffer.substr(0,1) === '<') {
        this.setState({subject : bufferJson.subject, from : bufferJson.from, date : bufferJson.date, text : 'request timeout'});
      } else {
        let bufferJson = JSON.parse(buffer);      
        console.log(typeof bufferJson);
        this.setState({subject : bufferJson.subject, from : bufferJson.from, date : bufferJson.date, text : bufferJson.text});
      }
    })
    .catch((error) => {
      console.log('failed');
      console.error(error);
    });
  }
  componentWillMount(){      
    const email = this.props.navigation.getParam('email', '');
    const password = this.props.navigation.getParam('password', '');
    const seqnum = this.props.navigation.getParam('seqnum', '');    
    this.fetchMail(email,password,seqnum);
  }

  render() {
    

    return (
      <Provider>
        <ScrollView style={styles.container}>
          <Text>
            From : {this.state.from}
          </Text>
          <Text>
            Date : {this.state.date}
          </Text>
          <Text>
            Subject : {this.state.subject}
          </Text>
          <Text>
            {this.state.text}
          </Text>
          
        </ScrollView>
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

export default ReadMailScreen;