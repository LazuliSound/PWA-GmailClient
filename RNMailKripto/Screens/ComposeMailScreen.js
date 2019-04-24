import React from 'react';
import { ScrollView } from 'react-native';
import { TextInput, Button, Provider } from 'react-native-paper';
import coreStyle from '../styles';
const styles= coreStyle;

class ComposeMailScreen extends React.Component {
  static navigationOptions = {
    title: 'Mail Kripto - Compose Mail',
  };
  constructor(props) {
    super(props);
    this.state = {
      to : '',
      subject : '',
      text : '',
    }
  } 

  sendMail(email, password) {
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

    return (
      <Provider>
        <ScrollView style={styles.container}>
          <Button icon="send" mode="contained" onPress={() => {
            if (email === '' || password === '') {
              this._showAlertMailCompose();
            } else {
              this.fetchMails(email,password)
            }              
          }}>
            Kirim Surel
          </Button>
          <TextInput
            label='Penerima'
            mode='flat'
            value={this.state.to}
            onChangeText={to => this.setState({ to })}
          />
          <TextInput
            label='Subjek'
            mode='flat'
            value={this.state.subject}
            onChangeText={subject => this.setState({ subject })}
          />
          <TextInput
            label='Isi Pesan'
            mode='flat'
            multiline={true}
            value={this.state.text}
            onChangeText={text => this.setState({ text })}
          />            
        </ScrollView>
      </Provider>
    );
  }  
}

export default ComposeMailScreen;