/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/index';
import {name as appName} from './app.json';

//Semelhante ao ReactDom que poem o App dentro de um div root
AppRegistry.registerComponent(appName, () => App);