import React from 'react';
import { Alert, ScrollView, View, Text } from 'react-native';
import { TextInput, Button, Provider, Checkbox } from 'react-native-paper';
import coreStyle from '../styles';
import SHA1 from '../lib/SHA-1';
import {ECCEG, Point} from '../lib/ECCEG';
const styles= coreStyle;
const pointG = new Point(771, 35);
const kEncode = 10;
const kEncrypt = 10;

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
      pubX : null,
      pubY : null,
      isEncrypt: false,
      isSigned: false,
    }
  } 

  showAlert(email,password,status) {
    let isSuccess = status;
    let header = '';
    if (isSuccess) {
      header = 'Pengiriman email sukses';
    } else {
      header = 'Pengiriman email gagal';
    }

    Alert.alert(
      header,
      '',
      [
        {text: 'Ok', onPress: () => {
          this.props.navigation.navigate('Home', {
            email : email,
            password : password
          });
        }},
      ],
      {cancelable: false},
    );
  }

  sendMail(email, password) {
    const ecc1 = new ECCEG(1,18,2087);
    const isEncrypt = this.state.isEncrypt;
    const isSigned = this.state.isSigned;
    let payload = this.state.body;
    let hash = null;
    let hashContainer = null;
    let arrPayload = null;
    let arrHash = null;
    let digiSig = null;
    let arrPayloadEncrypted = null;

    if (isEncrypt || isSigned) {
      hash = new SHA1().shaString(payload);
      if (isEncrypt) {
        arrPayload = ecc1.stringEncAscii(hash, kEncode);
      }
      if (isSigned) {
        arrHash = ecc1.stringEncAscii(hash, kEncode);
        digiSig = ecc1.arrEncrypt(arrhash, pointG, kEncrypt, pointPub);
        hashContainer = "\n<a-sha>" +hash+ "</a-sha>\n";
        payload += hashContainer;
      }
    }
    
    
    
    
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
        body: payload,
      }),
    }).then((response) => response.json())
    .then((responseJson) => {
      console.log(responseJson);
      console.log("Body");
      console.log(this.state.body);
      console.log("Hashed Body");
      console.log(new SHA1().shaString(this.state.body));
      this.showAlert(email,password,true);
    })
    .catch((error) => {
      console.error(error);
      this.showAlert(email,password,false);
    });
  }  

  render() {
    const email = this.props.navigation.getParam('email', '');
    const password = this.props.navigation.getParam('password', '');
    const isEncrypt = this.state.isEncrypt;
    const isSigned = this.state.isSigned;

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
          <View>
            <View>
              <Text>Enkripsi Pesan</Text>
              <Checkbox
                status={isEncrypt ? 'checked' : 'unchecked'}
                onPress={() => { this.setState({ isEncrypt: !isEncrypt }); }}
              />
            </View>
            <View>
              <Text>Tandatangani Pesan</Text>
              <Checkbox
                status={isSigned ? 'checked' : 'unchecked'}
                onPress={() => { this.setState({ isSigned: !isSigned }); }}
              />
            </View>  
          </View>
          <TextInput
            label='Kunci Publik X Penerima'
            mode='flat'
            value={this.state.pubX}
            onChangeText={pubX => this.setState({ pubX })}
          />
          <TextInput
            label='Kunci Publik Y Penerima'
            mode='flat'
            value={this.state.pubY}
            onChangeText={pubY => this.setState({ pubY })}
          />
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