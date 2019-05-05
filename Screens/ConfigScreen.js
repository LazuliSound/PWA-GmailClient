import React from 'react';
import { Text, ScrollView } from 'react-native';
import { TextInput, Button, Portal, Dialog, Provider } from 'react-native-paper';
import coreStyle from '../styles';
import { Point, ECCEG } from '../lib/ECCEG';
const styles= coreStyle;

class ConfigScreen extends React.Component {
  static navigationOptions = {
    title: 'Mail Kripto - Configuration',
  };
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',      
      alertMailVisibility: false,
      publicKey : 0,
      GX: 0,
      GY: 0,
      privateKeyX : 0,
      privateKeyY : 0,
    }
  } 

  _showAlertMailCompose = () => this.setState({ alertMailComposeVisibility: true });
  _hideAlertMailCompose = () => this.setState({ alertMailComposeVisibility: false });

  render() {
    return (
      <Provider>
        <ScrollView style={styles.container}>
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
          <Button icon="inbox" mode="contained" onPress={() => {
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
          <Button icon="create" mode="contained" onPress={() => {
              if (this.state.email.length === 0 || this.state.password.length === 0 || this.state.privateKeyX.length === 0 || this.state.privateKeyY.length === 0) {
                this._showAlertMailCompose();
              } else {
                console.log('called');
                this.props.navigation.navigate('ComposeMail', {
                  email : this.state.email,
                  password : this.state.password,
                  GX : this.state.GX,
                  GY: this.state.GY,
                  privateKeyX : this.state.privateKeyX,
                  privateKeyY : this.state.privateKeyY,
                });
                console.log('called2');
              }
            }}
            >
              Buat Surat Baru
            </Button> 
            <Button icon="create" mode="contained" onPress={() => {
              let G = new ECCEG().generateG();
              let key = new ECCEG().generateKey(G);
              let publicKey = key[0];
              let privateKey = key[1];
              this.setState({GX : G.x});
              this.setState({GY : G.y});
              this.setState({publicKey : publicKey});
              this.setState({privateKeyX : privateKey.x});
              this.setState({privateKeyY : privateKey.y});
            }}
            >
              Generate Key
            </Button> 
            <Text>
              Public Key : { this.state.publicKey }
            </Text> 
            <Text>
              GX : { this.state.GX } | 
              GY : { this.state.GY }
            </Text> 
            <Text>
              Private Key X : { this.state.privateKeyX } | 
              Private Key Y : { this.state.privateKeyY }
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
              <Text>Tolong isi email dan password lalu bangkitkan kunci terlebih dahulu</Text>
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

export default ConfigScreen;