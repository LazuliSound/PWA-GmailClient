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
      email: '',
      password: '',      
      alertMailVisibility: false
    }
  } 

  _showAlertMailCompose = () => this.setState({ alertMailComposeVisibility: true });
  _hideAlertMailCompose = () => this.setState({ alertMailComposeVisibility: false });

  render() {
    const email = this.props.navigation.getParam('email', '');
    const password = this.props.navigation.getParam('password', '');
    const seqnum = this.props.navigation.getParam('seqnum', '');
    return (
      <Provider>
        <ScrollView style={styles.container}>
          <Text>
            {email} - {password} - {seqnum}
          </Text>
          <Button mode="contained" onPress={() => {
            if (this.state.email.length == 0 || this.state.password.length == 0) {
              this._showAlertMailCompose();
            } else {
              this.props.navigation.navigate('Inbox', {
                email : this.state.email,
                password : this.state.password
              })
            }
          }}>
            To Inbox
          </Button>
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