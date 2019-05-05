import React from 'react';
import { Alert, ScrollView, View, Text } from 'react-native';
import { TextInput, Button, Provider, Checkbox } from 'react-native-paper';
import coreStyle from '../styles';
import SHA1 from '../lib/SHA-1';
import {ECCEG, Point} from '../lib/ECCEG';
const styles= coreStyle;
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
      pubX : 0,
      pubY : 0,
      isEncrypt: false,
      isSigned: false,
      privateKeyX : 0,
      privateKeyY : 0,
      GX : 0,
      GY : 0,
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
    var pointG = null
    var privateKey = null;
    const ecc1 = new ECCEG(1,18,2087);
    const isEncrypt = this.state.isEncrypt;
    const isSigned = this.state.isSigned;
    var payload = this.state.body;
    var hash = null;
    var hashContainer = '';
    var arrPayload = null;
    var arrHash = null;
    var digiSig = null;
    var arrPayloadEncrypted = null;

    if (isEncrypt || isSigned) {
      pointG = new Point(this.state.GX, this.state.GY);
      hash = new SHA1().shaString(payload);
      if (isEncrypt && this.state.pubX !== 0 && this.state.pubY !== 0) {
        let publicKey = new Point(this.state.pubX, this.state.pubY);
        arrPayload = ecc1.stringEncAscii(payload, kEncode);
        encryptedPayload = ecc1.arrEncrypt(arrPayload, pointG, kEncrypt, publicKey);
        let cipher = "";
        for(var i=0;i<encryptedPayload.length;i++){
          cipher += encryptedPayload[i][0].x+","+encryptedPayload[i][0].y+":"+encryptedPayload[i][1].x+","+encryptedPayload[i][1].y+" ";
        }  

        payload = '[encrypted]'+ cipher +'[/encrypted]<br>';
      }
      if (isSigned) {
        privateKey = new Point(this.state.privateKeyX, this.state.privateKeyY);
        arrHash = ecc1.stringEncAscii(hash, kEncode);
        encryptedHash = ecc1.arrEncrypt(arrHash, pointG, kEncrypt, privateKey);
        let digiSig = "";
        for(var i=0;i<encryptedHash.length;i++){
          digiSig += encryptedHash[i][0].x+","+encryptedHash[i][0].y+":"+encryptedHash[i][1].x+","+encryptedHash[i][1].y+" ";
        }  
        hashContainer = "<br>[ashap]" + digiSig + "[/ashap]\n";
        payload = payload + hashContainer;
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
      console.log(payload);
      this.showAlert(email,password,true);
    })
    .catch((error) => {
      console.error(error);
      this.showAlert(email,password,false);
    });
  }  

  componentWillMount(){      
    this.setState({ GX : this.props.navigation.getParam('GX', 0) });
    this.setState({ GY : this.props.navigation.getParam('GY', 0) });
    this.setState({ privateKeyX : this.props.navigation.getParam('privateKeyX', 0) });
    this.setState({ privateKeyY : this.props.navigation.getParam('privateKeyY', 0) });    
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
          <View>
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
          </View>
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