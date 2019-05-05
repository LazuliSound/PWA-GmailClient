import { StyleSheet } from 'react-native';
import Dimensions from 'Dimensions';
const {deviceWidth, deviceHeight} = Dimensions.get('window');
const coreStyle = StyleSheet.create({
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

export default coreStyle;