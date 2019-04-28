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
      body : '',
    }
  } 

  sendMail(email, password, to, subject, body) {
    fetch('https://nodejs-mail-rest.herokuapp.com/sendmail', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
        to: this.state.to,
        subject : this.state.subject,
        body: this.state.body
      }),
    }).then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      this.props.navigation.navigate('Home', {
        email : email,
        password : password
      });
    })
    .catch((error) => {
      console.error(error);
      this.props.navigation.navigate('Home', {
        email : email,
        password : password
      });
    });
  }

  render() {
    const email = this.props.navigation.getParam('email', '');
    const password = this.props.navigation.getParam('password', '');

    return (
      <Provider>
        <ScrollView style={styles.container}>
          <Button icon="send" mode="contained" onPress={() => {
            if (email === '' || password === '') {
              this._showAlertMailCompose();
            } else {
              this.sendMail(email,password)
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
            value={this.state.body}
            onChangeText={body => this.setState({ body })}
          />            
        </ScrollView>
      </Provider>
    );
  }  
}

export default ComposeMailScreen;