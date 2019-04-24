import React from 'react';
import { Text, ScrollView } from 'react-native';
import { TextInput, Button, Portal, Dialog, Provider } from 'react-native-paper';
import coreStyle from '../styles';
const styles= coreStyle;

class ReadMailScreen extends React.Component {
  static navigationOptions = {
    title: 'Mail Kripto - Configuration',
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
    }).then((response) => response.json())
    .then((responseJson) => {
      let buffer = responseJson;
      console.log(buffer);
      this.setState({subject : buffer.subject, from : buffer.from, date : buffer.date, text : buffer.text});
    })
    .catch((error) => {
      console.error(error);
    });
  }

  render() {
    const email = this.props.navigation.getParam('email', '');
    const password = this.props.navigation.getParam('password', '');
    const seqnum = this.props.navigation.getParam('seqnum', '');
    this.fetchMail(email,password,seqnum);

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